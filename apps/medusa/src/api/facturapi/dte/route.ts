/**
 * POST /facturapi/dte
 *
 * Emite un Documento Tributario Electrónico (DTE) para una orden.
 * Llama al servicio Facturapi y registra el resultado.
 *
 * Body:
 *   orderId          – ID de la orden en Medusa
 *   type             – "boleta_electronica" | "factura_electronica"
 *   billing.rut      – RUT del cliente (formateado o limpio)
 *   billing.razonSocial – Razón social (requerida solo para factura)
 *   billing.giro     – Giro comercial (solo factura)
 *   billing.direccion – Dirección comercial (solo factura)
 *   billing.comuna   – Comuna (solo factura)
 *   billing.email    – Email para enviar el PDF
 *   items            – CartItem[] del pedido
 *   subtotal         – Subtotal sin IVA
 *   tax              – Monto del IVA (19%)
 *   total            – Total con IVA
 *   paymentMethod    – "webpay" | "mercadopago" | "transferencia"
 *   customerEmail    – Email del cliente
 *   customerName     – Nombre completo
 */

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import FacturapiService from "../../../services/facturapi.service"
import { cleanRut, isValidRut } from "@ugarit/shared-types"

// ─── Schema de validación ─────────────────────────────────────────────────────

const BillingSchema = z.object({
  rut: z.string().min(5, "RUT requerido"),
  razonSocial: z.string().optional(),
  giro: z.string().optional(),
  direccion: z.string().optional(),
  comuna: z.string().optional(),
  email: z.string().email().optional(),
})

const CartItemSchema = z.object({
  id: z.string(),
  handle: z.string(),
  title: z.string(),
  price: z.number().positive(),
  image: z.string(),
  quantity: z.number().int().positive(),
  maxStock: z.number().optional(),
  virtual: z.boolean().optional(),
})

const EmitDteSchema = z.object({
  orderId: z.string().min(1, "orderId requerido"),
  type: z.enum(["boleta_electronica", "factura_electronica"]),
  billing: BillingSchema,
  items: z.array(CartItemSchema).min(1, "Al menos un item requerido"),
  subtotal: z.number().nonnegative(),
  tax: z.number().nonnegative(),
  total: z.number().positive("Total debe ser mayor a 0"),
  paymentMethod: z.enum(["webpay", "mercadopago", "transferencia"]),
  customerEmail: z.string().email("Email inválido"),
  customerName: z.string().min(2, "Nombre requerido"),
})

// ─── Handler ─────────────────────────────────────────────────────────────────

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  // 1. Validar body
  const parsed = EmitDteSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: parsed.error.flatten().fieldErrors,
    })
  }

  const body = parsed.data

  // 2. Validar RUT
  const rutClean = cleanRut(body.billing.rut)
  if (!isValidRut(rutClean)) {
    return res.status(400).json({
      error: "RUT inválido",
      message: "El dígito verificador del RUT no es correcto",
    })
  }

  // 3. Factura requiere campos adicionales
  if (body.type === "factura_electronica") {
    if (!body.billing.razonSocial?.trim()) {
      return res.status(400).json({
        error: "Campo requerido",
        message: "Razón social es requerida para factura electrónica",
      })
    }
    if (!body.billing.giro?.trim()) {
      return res.status(400).json({
        error: "Campo requerido",
        message: "Giro comercial es requerido para factura electrónica",
      })
    }
  }

  // 4. Emitir DTE
  try {
    const container = req.scope as unknown as Record<string, unknown>
    const facturapiService = new FacturapiService(container)

    const dteRecord = await facturapiService.emitDte({
      orderId: body.orderId,
      type: body.type,
      billing: {
        rut: body.billing.rut,
        razonSocial: body.billing.razonSocial ?? body.customerName,
        giro: body.billing.giro ?? "",
        direccion: body.billing.direccion ?? "",
        comuna: body.billing.comuna ?? "",
        email: body.billing.email ?? body.customerEmail,
      },
      items: body.items.map((i) => ({
        id: i.id,
        handle: i.handle,
        title: i.title,
        price: i.price,
        image: i.image,
        quantity: i.quantity,
        maxStock: i.maxStock ?? 0,
        virtual: i.virtual ?? false,
      })),
      subtotal: body.subtotal,
      tax: body.tax,
      total: body.total,
      paymentMethod: body.paymentMethod,
      customerEmail: body.customerEmail,
      customerName: body.customerName,
    })

    // 5. Guardar registro del DTE (en prod esto iría a la DB)
    // Para MVP lo devolvemos directamente; en producción usarías:
    // await this.dteModuleService.create(dteRecord)
    console.log(`[DTE] ${body.type} emitida para orden ${body.orderId}: folio=${dteRecord.folio ?? "N/A"}`)

    return res.status(201).json({ success: true, dte: dteRecord })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido"
    console.error(`[DTE] Error emitiendo DTE para orden ${body.orderId}:`, message)
    return res.status(500).json({ error: "Error al emitir DTE", message })
  }
}
