/**
 * UGARIT · Subscriber de emisión automática de DTE
 *
 * Escucha el evento `order.placed` de Medusa y, si la orden fue pagada,
 * emite automáticamente el documento tributario (boleta o factura) vía Facturapi.
 *
 * NOTA: Medusa v2 usa el sistema de módulos en lugar de OrderService.
 * Este subscriber accede a la orden a través del container.resolve.
 * Si el módulo de órdenes no está registrado, el subscriber registra el evento
 * pero no puede acceder a los datos de la orden — en ese caso, la emisión
 * de DTE se hace manualmente vía API POST /facturapi/dte.
 *
 * @see https://docs.medusajs.com/learn/fundamentals/events-and-subscribers
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyContainer = Record<string, any>

interface OrderPlacedData {
  id: string
}

interface SubscriberArgs {
  data: OrderPlacedData
  container: AnyContainer
}

// ─── Helpers RUT inline (evita dependency en shared-types para Medusa) ──────────

function cleanRut(rut: string): string {
  return rut.replace(/[^0-9kK]/g, "").toUpperCase()
}

function isValidRut(rut: string): boolean {
  const cleaned = cleanRut(rut)
  if (cleaned.length < 8) return false
  const body = cleaned.slice(0, -1)
  const dv = cleaned.slice(-1)
  let sum = 0
  let mult = 2
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i], 10) * mult
    mult = mult === 7 ? 2 : mult + 1
  }
  const expected = String(11 - (sum % 11))
  const expectedDv = expected === "11" ? "0" : expected === "10" ? "K" : expected
  return dv === expectedDv
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export default async function dteEmitterSubscriber({
  data,
  container,
}: SubscriberArgs) {
  const orderId = data.id

  console.log(`[DTE Subscriber] Procesando orden ${orderId}`)

  try {
    // ── Intentar obtener la orden desde Medusa v2 ──
    // En Medusa v2 el servicio se accede como "orderService" en el container.
    // Si no está disponible, se salta la emisión automática y se hace manual.
    let order: AnyContainer | null = null

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const orderService = container.resolve("orderService") as any
      if (orderService?.retrieve) {
        order = await orderService.retrieve(orderId, {
          relations: [
            "billing_address",
            "shipping_address",
            "customer",
            "items",
            "payments",
          ],
        })
      }
    } catch {
      console.warn(`[DTE Subscriber] No se pudo resolver orderService para orden ${orderId}`)
    }

    if (!order) {
      console.warn(
        `[DTE Subscriber] Orden ${orderId} no disponible via container. ` +
        `La emisión de DTE debe hacerse manualmente vía POST /facturapi/dte.`
      )
      return
    }

    // ── Verificar que la orden tiene pagos capturados ──
    const payments: Array<{ captured_at?: string | null; provider_id?: string }> =
      order.payments ?? []

    if (payments.length === 0) {
      console.warn(
        `[DTE Subscriber] Orden ${orderId} sin pagos registrados. DTE diferido.`
      )
      return
    }

    const hasCapturedPayment = payments.some((p) => p.captured_at !== null)
    if (!hasCapturedPayment) {
      console.warn(
        `[DTE Subscriber] Orden ${orderId} sin pagos capturados. DTE diferido.`
      )
      return
    }

    // ── Determinar método de pago ──
    const firstPayment = payments[0]
    const provider = (firstPayment?.provider_id ?? "").toLowerCase()
    let paymentMethod: "webpay" | "mercadopago" | "transferencia" = "transferencia"
    if (provider.includes("webpay") || provider.includes("transbank")) {
      paymentMethod = "webpay"
    } else if (
      provider.includes("mercadopago") ||
      provider.includes("mercadopago")
    ) {
      paymentMethod = "mercadopago"
    }

    // ── Extraer datos de billing ──
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customer = order.customer as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const billing = order.billing_address as any
    const metadata = customer?.metadata ?? {}

    const rutRaw = (metadata?.rut as string) ?? ""
    const dteTypeMeta = (metadata?.dteType as string) ?? "boleta_electronica"
    const rutClean = cleanRut(rutRaw)
    const isFactura =
      rutClean.length >= 8 && isValidRut(rutClean) && dteTypeMeta === "factura_electronica"

    const billingInfo = {
      rut: rutRaw || "11.111.111-1", // fallback para pruebas
      razonSocial: isFactura ? (billing?.company ?? "") : "",
      giro: (metadata?.giro as string) ?? "",
      direccion: [billing?.address_1, billing?.address_2]
        .filter(Boolean)
        .join(", "),
      comuna: billing?.city ?? "",
      email: customer?.email,
    }

    // ── Obtener servicio Facturapi y emitir DTE ──
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const facturapiService = new (require("../services/facturapi.service").default)(
      container
    )

    const subtotal = Number(order.subtotal ?? 0)
    const tax = Number(order.tax_total ?? 0)
    const total = Number(order.total ?? 0)

    const dteRecord = await facturapiService.emitDte({
      orderId,
      type: isFactura ? "factura_electronica" : "boleta_electronica",
      billing: billingInfo,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items: (order.items ?? []).map((item: any) => ({
        id: item.id,
        handle: item.variant?.product?.handle ?? item.title,
        title: item.title,
        price: Number(item.unit_price) / 100, // Medusa guarda en centavos
        image: "",
        quantity: item.quantity ?? 1,
        maxStock: 0,
        virtual: item.is_virtual ?? false,
      })),
      subtotal,
      tax,
      total,
      paymentMethod,
      customerEmail: customer?.email ?? "",
      customerName:
        [customer?.first_name, customer?.last_name].filter(Boolean).join(" ") ||
        "Cliente",
    })

    console.log(
      `[DTE Subscriber] DTE ${dteRecord.id} (folio ${dteRecord.folio ?? "N/A"}) ` +
      `emitido para orden ${orderId}`
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(`[DTE Subscriber] Error en orden ${orderId}:`, message)
    // No relanzar — el suscriptor no debe bloquear la orden
  }
}

// ─── Config ──────────────────────────────────────────────────────────────────

export const config = {
  event: "order.placed",
}
