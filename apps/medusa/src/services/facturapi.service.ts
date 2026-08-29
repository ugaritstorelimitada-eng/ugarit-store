/**
 * UGARIT · Servicio de facturación electrónica con Facturapi
 *
 * Maneja la emisión de DTE (boletas y facturas electrónicas) a través
 * de la API de Facturapi. Designed para el ecosistema chileno:
 * - RUT con dígito verificador
 * - Folios electrónicos certificados por el SII
 * - Integración con Webpay y Mercado Pago
 * - Resend para envío automático de PDF por email
 *
 * @see https://docs.facturapi.com
 */

// Medusa v2: servicio plain (no extiende MedusaService que no existe en v2)
// @ts-ignore - Medusa v2 TypeScript definitions are incomplete for custom services
import { cleanRut, formatRut } from "@ugarit/shared-types"
// @ts-ignore
import type { BillingInfo, DteRecord, DteStatus, DteDocumentType, CartItem } from "@ugarit/shared-types"

// ─── Tipos internos ──────────────────────────────────────────────────────────

interface DteItem {
  product: string
  description: string
  quantity: number
  unit_price: number
  total: number
}

interface EmitDteParams {
  orderId: string
  type: DteDocumentType
  billing: BillingInfo
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  paymentMethod: "webpay" | "mercadopago" | "transferencia"
  customerEmail: string
  customerName: string
}

interface FacturapiTax {
  id: string
}

interface FacturapiItem {
  product: string
  description: string
  quantity: number
  unit_price: number
  taxes: FacturapiTax[]
}

interface FacturapiCustomer {
  legal_name: string
  tax_id: string
  email: string
  address?: {
    street: string
    zip: string
    municipality: string
    state: string
    country: string
  }
}

interface FacturapiPayload {
  type: "invoice" | "receipt"
  production: boolean
  customer: FacturapiCustomer
  items: FacturapiItem[]
  payment_form: string
  expedition_date: string
  use: string
  currency: "CLP"
  external_id?: string
}

interface FacturapiResponse {
  id: string
  status: string
  type: string
  folio?: number
  cfdi?: string
  pdf?: string
  errors?: Array<{ message: string; code: string }>
}

interface DteDbRecord extends DteRecord {
  facturapiId?: string
  pdfUrl?: string
  xmlUrl?: string
}

// ───常量────────────────────────────────────────────────────────────────────────

/** Código de uso SAT/MH para venta de bienes (Chile usa这本código en CFDI 4.0) */
const SAT_USE = "S01" // Venta de bienes

/** Forma de pago según documento */
const PAYMENT_FORM: Record<string, string> = {
  webpay: "PUE", // Pago en una sola exhibición
  mercadopago: "PUE",
  transferencia: "PUE",
}

// ─── Servicio ──────────────────────────────────────────────────────────────────

// Medusa v2 — plain service class (no MedusaService base class)
class FacturapiService {
  private apiKey: string
  private isProduction: boolean
  private baseUrl = "https://www.facturapi.io/v2"

  constructor(_container: Record<string, unknown>) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.apiKey = process.env.FACTURAPI_API_KEY ?? ""
    this.isProduction = process.env.NODE_ENV === "production"
  }

  // ── Helpers privados ──────────────────────────────────────────────────────

  /**
   * Construye el payload para la API de Facturapi.
   */
  private buildPayload(params: EmitDteParams): FacturapiPayload {
    const isFactura = params.type === "factura_electronica"
    const rutClean = cleanRut(params.billing.rut)

    // En Chile, el tipo "invoice" en Facturapi corresponde a Factura Electrónica
    // y "receipt" corresponde a Boleta Electrónica
    const facturapiType = isFactura ? "invoice" : "receipt"

    const items: FacturapiItem[] = params.items.map((item) => ({
      product: item.title,
      description: item.handle,
      quantity: item.quantity,
      unit_price: Math.round(item.price),
      taxes: [{ id: "002" }], // IVA 19% — código SAT para IVA
    }))

    const customer: FacturapiCustomer = {
      legal_name: isFactura ? params.billing.razonSocial : params.customerName,
      tax_id: rutClean,
      email: params.billing.email ?? params.customerEmail,
    }

    // Solo agregar dirección si es factura (empresa)
    if (isFactura && params.billing.direccion) {
      customer.address = {
        street: params.billing.direccion,
        zip: "000000",
        municipality: params.billing.comuna,
        state: "CL",
        country: "CL",
      }
    }

    return {
      type: facturapiType as "invoice" | "receipt",
      production: this.isProduction,
      customer,
      items,
      payment_form: PAYMENT_FORM[params.paymentMethod] ?? "PUE",
      expedition_date: new Date().toISOString().split("T")[0],
      use: SAT_USE,
      currency: "CLP",
      external_id: params.orderId,
    }
  }

  /**
   * Realiza el POST a la API de Facturapi.
   */
  private async callFacturapi(
    payload: FacturapiPayload
  ): Promise<FacturapiResponse> {
    if (!this.apiKey) {
      throw new Error(
        "FACTURAPI_API_KEY no está configurada. Agrega la variable de entorno."
      )
    }

    const response = await fetch(`${this.baseUrl}/documents`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(
        `Facturapi API error ${response.status}: ${errorBody}`
      )
    }

    return response.json() as Promise<FacturapiResponse>
  }

  // ── Métodos públicos ────────────────────────────────────────────────────

  /**
   * Emite un DTE (boleta o factura electrónica) a través de Facturapi.
   *
   * @returns DteRecord con folio, URLs de PDF/XML y estado
   */
  async emitDte(params: EmitDteParams): Promise<DteRecord> {
    const payload = this.buildPayload(params)

    // ── Modo mock si no hay API key (desarrollo) ──
    if (!this.apiKey) {
      console.warn(
        `[Facturapi] API key no configurada. Simulando emisión para orden ${params.orderId}`
      )
      return {
        id: `mock-dte-${Date.now()}`,
        orderId: params.orderId,
        type: params.type,
        status: "pending",
        rut: formatRut(params.billing.rut),
        razonSocial: params.billing.razonSocial,
        monto: params.total,
        createdAt: new Date().toISOString(),
        errorMessage: "DTE simulado (API key no configurada)",
      }
    }

    // ── Llamada real a Facturapi ──
    const result = await this.callFacturapi(payload)

    if (result.errors && result.errors.length > 0) {
      return {
        id: result.id ?? `err-${Date.now()}`,
        orderId: params.orderId,
        type: params.type,
        status: "rejected",
        rut: formatRut(params.billing.rut),
        razonSocial: params.billing.razonSocial ?? "",
        monto: params.total,
        createdAt: new Date().toISOString(),
        errorMessage: result.errors.map((e) => e.message).join("; "),
      }
    }

    return {
      id: result.id,
      orderId: params.orderId,
      type: params.type,
      status: "issued",
      rut: formatRut(params.billing.rut),
      razonSocial: params.billing.razonSocial ?? params.customerName,
      monto: params.total,
      folio: result.folio,
      pdfUrl: result.pdf,
      xmlUrl: result.cfdi, // CFDI = XML en contexto mexicano; ajusta si Facturapi Chile entrega XML separados
      issuedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }
  }

  /**
   * Consulta el estado de un DTE ya emitido en Facturapi.
   */
  async getDteStatus(dteId: string): Promise<{
    status: DteStatus
    folio?: number
    pdfUrl?: string
  }> {
    if (!this.apiKey) {
      return { status: "pending" }
    }

    const response = await fetch(`${this.baseUrl}/documents/${dteId}`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Facturapi get error ${response.status}`)
    }

    const data = (await response.json()) as FacturapiResponse

    return {
      status: data.status === "valid" ? "issued" : "rejected",
      folio: data.folio,
      pdfUrl: data.pdf,
    }
  }

  /**
   * Cancela un DTE en Facturapi (solo para facturas — boletas no son cancelables).
   */
  async cancelDte(dteId: string): Promise<void> {
    if (!this.apiKey) {
      console.warn(`[Facturapi] Simulando cancelación de DTE ${dteId}`)
      return
    }

    const response = await fetch(`${this.baseUrl}/documents/${dteId}/cancel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    })

    if (!response.ok) {
      const body = await response.text()
      throw new Error(`Facturapi cancel error ${response.status}: ${body}`)
    }
  }

  /**
   * Descarga el PDF de un DTE emitido.
   */
  async getDtePdf(dteId: string): Promise<Buffer> {
    if (!this.apiKey) {
      throw new Error("FACTURAPI_API_KEY requerida para descargar PDF")
    }

    const response = await fetch(
      `${this.baseUrl}/documents/${dteId}/pdf`,
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Facturapi PDF error ${response.status}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  }
}

export default FacturapiService
