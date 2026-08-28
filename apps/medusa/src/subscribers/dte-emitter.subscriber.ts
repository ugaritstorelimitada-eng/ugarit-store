/**
 * UGARIT · Subscriber de emisión automática de DTE
 *
 * Escucha el evento `order.placed` de Medusa y, si la orden fue pagada,
 * emite automáticamente el documento tributario (boleta o factura) vía Facturapi.
 *
 * También puede configurarse para escuchar `payment.captured` si se quiere
 * emitir el DTE en cuanto se captura el pago, sin esperar a que Medusa
 * complete la orden.
 *
 * @see https://docs.medusajs.com/learn/fundamentals/events-and-subscribers
 */

import { OrderService } from "@medusajs/medusa"
import FacturapiService from "../services/facturapi.service"
import { cleanRut, isValidRut } from "@ugarit/shared-types"

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface OrderPlacedData {
  id: string
}

interface SubscriberArgs {
  data: OrderPlacedData
  container: Record<string, unknown>
}

// ─── Handler ────────────────────────────────────────────────────────────────

export default async function dteEmitterSubscriber({
  data,
  container,
}: SubscriberArgs) {
  const orderId = data.id

  console.log(`[DTE Subscriber] Procesando orden ${orderId}`)

  try {
    // 1. Obtener la orden completa desde Medusa
    const orderService = container.resolve("orderService") as InstanceType<
      typeof OrderService
    >
    const order = await orderService.retrieve(orderId, {
      relations: [
        "billing_address",
        "shipping_address",
        "customer",
        "items",
        "payments",
      ],
    })

    // 2. Verificar que la orden tiene transacciones (prueba de pago real)
    // Esto es importante: no emitir DTE para órdenes que aún no están pagadas
    if (!order.payments || order.payments.length === 0) {
      console.warn(
        `[DTE Subscriber] Orden ${orderId} sin pagos registrados. DTE diferido.`
      )
      return
    }

    const hasCapturedPayment = order.payments.some(
      (p) => p.captured_at !== null
    )

    if (!hasCapturedPayment) {
      console.warn(
        `[DTE Subscriber] Orden ${orderId} sin pagos capturados. DTE diferido.`
      )
      return
    }

    // 3. Determinar el método de pago
    const paymentMethod = detectPaymentMethod(order.payments)

    // 4. Extraer datos de billing del cliente
    const billing = extractBilling(order, container)

    // 5. Calcular montos
    const subtotal = Number(order.subtotal)
    const tax = Number(order.tax_total ?? 0)
    const total = Number(order.total)

    // 6. Emitir DTE
    const facturapiService = new FacturapiService(container)

    const dteRecord = await facturapiService.emitDte({
      orderId,
      type: billing.dteType ?? "boleta_electronica",
      billing: billing.billingInfo,
      items: order.items.map((item) => ({
        id: item.id,
        handle: item.variant?.product?.handle ?? item.title,
        title: item.title,
        price: Number(item.unit_price) / 100, // Medusa guarda en centavos
        image: "", // Medusa no incluye imagen en el evento; se puede omitir
        quantity: item.quantity,
        maxStock: 0,
        virtual: item.is_virtual ?? false,
      })),
      subtotal,
      tax,
      total,
      paymentMethod,
      customerEmail: order.customer?.email ?? "",
      customerName:
        [order.customer?.first_name, order.customer?.last_name]
          .filter(Boolean)
          .join(" ") || "Cliente",
    })

    console.log(
      `[DTE Subscriber] DTE ${dteRecord.id} (folio ${dteRecord.folio ?? "N/A"}) emitido para orden ${orderId}`
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(`[DTE Subscriber] Error en orden ${orderId}:`, message)
    // No relanzar — el suscriptor no debe bloquear la orden
    // En prod: usar dead-letter queue o reintentos con exponential backoff
  }
}

// ─── Config ────────────────────────────────────────────────────────────────

/**
 * Escucha `order.placed` (orden completada tras captura de pago).
 * También puedes escuchar `payment.captured` para emitir antes.
 */
export const config = {
  event: "order.placed",
}

// ─── Helpers ──────────────────────────────────────────────────────────────

type MedusaPayment = {
  provider_id?: string
  captured_at?: string | null
  amount?: number
}

function detectPaymentMethod(
  payments: MedusaPayment[]
): "webpay" | "mercadopago" | "transferencia" {
  if (!payments || payments.length === 0) return "transferencia"

  const provider = payments[0]?.provider_id?.toLowerCase() ?? ""

  if (provider.includes("webpay") || provider.includes("transbank")) {
    return "webpay"
  }
  if (provider.includes("mercadopago") || provider.includes("mercadopago")) {
    return "mercadopago"
  }
  return "transferencia"
}

function extractBilling(
  order: {
    billing_address?: {
      company?: string | null
      address_1?: string | null
      address_2?: string | null
      city?: string | null
      province?: string | null
      postal_code?: string | null
      country_code?: string | null
    }
    customer?: {
      metadata?: Record<string, unknown>
    }
  },
  _container: Record<string, unknown>
): {
  billingInfo: {
    rut: string
    razonSocial: string
    giro: string
    direccion: string
    comuna: string
    email?: string
  }
  dteType: "boleta_electronica" | "factura_electronica"
} {
  // Intentar leer RUT desde metadata del cliente o billing address
  const metadata = order.customer?.metadata ?? {}
  const rutRaw = (metadata.rut as string) ?? ""
  const dteTypeFromMeta = (metadata.dteType as string) ?? "boleta_electronica"

  const rutClean = cleanRut(rutRaw)
  const isFactura = rutClean && isValidRut(rutClean) && dteTypeFromMeta === "factura_electronica"

  const billing = order.billing_address

  return {
    dteType: isFactura ? "factura_electronica" : "boleta_electronica",
    billingInfo: {
      rut: rutRaw || "11.111.111-1", // fallback para pruebas
      razonSocial: billing?.company ?? "",
      giro: (metadata.giro as string) ?? "",
      direccion: [billing?.address_1, billing?.address_2]
        .filter(Boolean)
        .join(", "),
      comuna: billing?.city ?? "",
      email: order.customer?.email,
    },
  }
}
