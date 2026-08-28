/**
 * POST /facturapi/webhook
 *
 * Receptor de webhooks de pago (Webpay, Mercado Pago).
 * Cuando un pago se confirma, emite automáticamente el DTE.
 *
 * Webpay: POST desde Transbank con TBK_* params (形式 old API)
 *         Nuevo: POST con JSON { order_id, token, payment_type_code, response_code }
 * Mercado Pago: POST con JSON { action, data.id, status }
 */

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import FacturapiService from "../../../services/facturapi.service"
import { cleanRut, isValidRut } from "@ugarit/shared-types"

// ─── Schemas de webhook ──────────────────────────────────────────────────────

const WebpayWebhookSchema = z.object({
  order_id: z.string(),
  token: z.string().optional(),
  payment_type_code: z.string().optional(),
  response_code: z.number().optional(),
  // Nuevo formato JSON
  type: z.enum(["webpay", "mercadopago"]).optional(),
  status: z.enum(["approved", "rejected", "pending"]).optional(),
  amount: z.number().optional(),
})

const MercadoPagoWebhookSchema = z.object({
  action: z.string(),
  "data.id": z.string().optional(),
  status: z.string().optional(),
})

// ─── Verificación de firma (Webpay) ──────────────────────────────────────────

async function verifyWebpaySignature(
  _req: MedusaRequest,
  _body: Record<string, string>
): Promise<boolean> {
  // En producción implementar verificación con la llave secreto de Webpay:
  // const signature = req.headers["tbk-api-key"] ?? req.headers["x-api-key"]
  // Comparar con HMAC-SHA256 del body
  // Por ahora devolvemos true para permitir el flujo
  return true
}

// ─── Handler principal ───────────────────────────────────────────────────────

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const body = req.body as Record<string, unknown>

  console.log("[Webhook] Recibido:", JSON.stringify(body))

  // ── Detectar tipo de webhook ──
  const isWebpay =
    "TBK_TOKEN" in body ||
    "order_id" in body ||
    (body as Record<string, unknown>).type === "webpay"

  const isMercadoPago =
    "action" in body && String((body as Record<string, unknown>).action).includes("payment")

  if (!isWebpay && !isMercadoPago) {
    return res.status(400).json({ error: "Webhook type not recognized" })
  }

  // ── Webpay ──
  if (isWebpay) {
    const parsed = WebpayWebhookSchema.safeParse(body)

    if (!parsed.success) {
      console.warn("[Webhook] Webpay body inválido:", parsed.error.flatten())
      return res.status(400).json({ error: "Invalid payload" })
    }

    const data = parsed.data

    // Aprobado: response_code === 0 en API antigua, status === "approved" en nueva
    const isApproved =
      data.response_code === 0 ||
      data.status === "approved" ||
      data.payment_type_code === "VD" ||
      data.payment_type_code === "VN" ||
      data.payment_type_code === "VC"

    if (!isApproved) {
      console.log("[Webhook] Webpay: pago no aprobado o pendiente")
      return res.status(200).json({ received: true, processed: false })
    }

    console.log(`[Webhook] Webpay: pago aprobado para orden ${data.order_id}`)

    // En producción: buscar la orden en Medusa y emitir DTE
    // Por ahora emitimos un DTE mock con los datos del body
    try {
      const container = req.scope as unknown as Record<string, unknown>
      const facturapiService = new FacturapiService(container)

      const dteRecord = await facturapiService.emitDte({
        orderId: data.order_id,
        type: "boleta_electronica", // valor por defecto, en prod se obtiene de la orden
        billing: {
          rut: body.rut as string ?? "11.111.111-1",
          razonSocial: (body.customer_name as string) ?? "",
          giro: "",
          direccion: (body.address as string) ?? "",
          comuna: (body.comuna as string) ?? "",
          email: (body.email as string) ?? "",
        },
        items: [], // en prod se obtienen de la orden en Medusa
        subtotal: 0,
        tax: 0,
        total: (data.amount as number) ?? 0,
        paymentMethod: "webpay",
        customerEmail: (body.email as string) ?? "",
        customerName: (body.customer_name as string) ?? "",
      })

      console.log(`[Webhook] DTE emitido via Webpay: ${dteRecord.id}`)
      return res.status(200).json({ received: true, processed: true, dte: dteRecord })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error"
      console.error("[Webhook] Error emitiendo DTE por Webpay:", msg)
      return res.status(500).json({ error: "DTE emission failed", message: msg })
    }
  }

  // ── Mercado Pago ──
  if (isMercadoPago) {
    const data = body as { action: string; status: string }

    // Solo procesar cuando el pago está aprobado
    if (data.status !== "approved") {
      return res.status(200).json({ received: true, processed: false })
    }

    // El order ID viene en el campo external_reference o en la URL del pago
    const orderId = (body.external_reference as string) ?? (body["data.id"] as string)

    if (!orderId) {
      console.warn("[Webhook] Mercado Pago: no se encontró order ID")
      return res.status(400).json({ error: "Missing order_id" })
    }

    console.log(`[Webhook] Mercado Pago: pago aprobado para orden ${orderId}`)

    try {
      const container = req.scope as unknown as Record<string, unknown>
      const facturapiService = new FacturapiService(container)

      const dteRecord = await facturapiService.emitDte({
        orderId,
        type: "boleta_electronica",
        billing: {
          rut: "11.111.111-1",
          razonSocial: "",
          giro: "",
          direccion: "",
          comuna: "",
          email: (body.payer?.email as string) ?? "",
        },
        items: [],
        subtotal: 0,
        tax: 0,
        total: (body.amount as number) ?? 0,
        paymentMethod: "mercadopago",
        customerEmail: (body.payer?.email as string) ?? "",
        customerName: (body.payer?.first_name as string) ?? "",
      })

      console.log(`[Webhook] DTE emitido via Mercado Pago: ${dteRecord.id}`)
      return res.status(200).json({ received: true, processed: true, dte: dteRecord })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error"
      console.error("[Webhook] Error emitiendo DTE por Mercado Pago:", msg)
      return res.status(500).json({ error: "DTE emission failed", message: msg })
    }
  }

  return res.status(400).json({ error: "Unhandled webhook" })
}

// GET para verificación de endpoint (requerido por Mercado Pago)
export const GET = async (_req: MedusaRequest, res: MedusaResponse) => {
  res.status(200).json({
    webhook: "ugarit-facturapi",
    status: "active",
    timestamp: new Date().toISOString(),
  })
}
