import type {
  IssueDteInput,
  IssuedDte,
  DteItem,
  DteRecipient,
} from "./types"

/**
 * UGARIT · Cliente de Facturapi
 *
 * Modo de operación:
 *  - LIVE:    con FACTURAPI_API_KEY en .env, llama a api.facturapi.io
 *  - MOCK:    sin API key (desarrollo), simula emisión local con folio aleatorio
 *
 * Facturapi es el líder de facturación electrónica en LATAM.
 * Documentación: https://docs.facturapi.io/
 *
 * IMPORTANTE: En producción (Fase 4 del plan), se debe mover a un
 * Medusa Subscriber (order.placed) o a un Next.js API route con
 * verificación de webhook firmada.
 */

const FACTURAPI_BASE = "https://api.facturapi.io/v2"

type FacturapiCustomer = {
  readonly legal_name?: string
  readonly tax_id?: string
  readonly tax_system?: "606" | "601" | "603" | "605" | "604" | "608"
  readonly email: string
  readonly address?: {
    readonly street: string
    readonly city: string
    readonly state: string
    readonly country: string
    readonly zip: string
  }
}

type FacturapiProduct = {
  readonly product_key?: string // ClaveProdServ del SAT/SII
  readonly description: string
  readonly product_key_unit?: string
  readonly unit_code?: string
  readonly unit_name?: string
  readonly sku: string
  readonly quantity: number
  readonly price: number
}

type FacturapiInvoice =
  | {
      type: "draft" | "final" | "pending"
      payment_form: "cash" | "card" | "transfer" | "check" | "credit"
      customer: FacturapiCustomer
      items: readonly FacturapiProduct[]
      external_id?: string
      folio_number?: number
      series?: string
      use_issued_at_for_stamp?: boolean
    }
  | {
      type: "receipt" | "draft" | "final"
      payment_form: "cash" | "card" | "transfer" | "check" | "credit"
      customer: FacturapiCustomer
      items: readonly FacturapiProduct[]
      external_id?: string
    }

function toFacturapiCustomer(r: DteRecipient): FacturapiCustomer {
  if (r.type === "empresa") {
    return {
      legal_name: r.razonSocial,
      tax_id: r.rut,
      tax_system: "601", // IVA general Chile
      email: r.email,
      address: {
        street: r.direccion,
        city: r.ciudad,
        state: r.comuna,
        country: "CL",
        zip: "0000000",
      },
    }
  }
  // Persona natural (boleta) - email puede no estar disponible
  return {
    email: r.email ?? "consumidor.final@ugarit.cl",
    tax_id: r.rut,
    legal_name: r.name ?? "Consumidor Final",
    tax_system: "608", // Sin obligaciones tributarias
  }
}

function toFacturapiItem(item: DteItem): FacturapiProduct {
  return {
    product_key: "81112105", // Software como servicio
    sku: item.sku,
    description: item.description,
    quantity: item.quantity,
    unit_code: "E48", // Unidad de servicio
    unit_name: "Servicio",
    price: item.unitPrice,
  }
}

function mapPaymentForm(method: IssueDteInput["paymentMethod"]): "card" | "transfer" | "credit" {
  switch (method) {
    case "webpay":
    case "mercadopago":
      return "card"
    case "transferencia":
      return "transfer"
  }
}

/** Calcula subtotal, IVA 19% y total en CLP */
function calculateTotals(
  items: readonly DteItem[],
  taxRate = 0.19
): { subtotal: number; tax: number; total: number } {
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)
  // En Chile el precio al consumidor YA incluye IVA. Para DTE hay que reversar:
  // neto = total / (1 + taxRate)
  const neto = Math.round(subtotal / (1 + taxRate))
  const tax = subtotal - neto
  return { subtotal: neto, tax, total: subtotal }
}

type ClientOptions = {
  readonly apiKey: string | undefined
  readonly organizationId: string | undefined
  readonly mode: "live" | "mock"
}

export class FacturapiClient {
  private readonly apiKey: string | undefined
  private readonly orgId: string | undefined
  private readonly mode: "live" | "mock"

  constructor(opts: ClientOptions) {
    this.apiKey = opts.apiKey
    this.orgId = opts.organizationId
    this.mode = opts.mode
  }

  /**
   * Emite un DTE.
   *  - LIVE: POST a api.facturapi.io/v2/{invoices|receipts}
   *  - MOCK: simula con folio aleatorio y PDFs placeholder
   */
  async issue(input: IssueDteInput): Promise<IssuedDte> {
    if (this.mode === "mock" || !this.apiKey) {
      return this.issueMock(input)
    }
    return this.issueLive(input)
  }

  // ─── LIVE ───────────────────────────────────────────────
  private async issueLive(input: IssueDteInput): Promise<IssuedDte> {
    const isReceipt = input.type === "boleta"
    const path = isReceipt ? "/receipts" : "/invoices"

    const body = isReceipt
      ? this.buildReceiptBody(input)
      : this.buildInvoiceBody(input)

    const res = await fetch(`${FACTURAPI_BASE}${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}))
      throw new DteEmissionError(
        `Facturapi error ${res.status}: ${errorBody.message ?? res.statusText}`,
        errorBody.code
      )
    }

    const data = await res.json()
    return this.parseFacturapiResponse(data, input)
  }

  private buildInvoiceBody(input: IssueDteInput): FacturapiInvoice {
    return {
      type: "final",
      payment_form: mapPaymentForm(input.paymentMethod),
      customer: toFacturapiCustomer(input.recipient),
      items: input.items.map(toFacturapiItem),
      external_id: input.externalOrderId,
      use_issued_at_for_stamp: true,
    }
  }

  private buildReceiptBody(input: IssueDteInput): FacturapiInvoice {
    return {
      type: "receipt",
      payment_form: mapPaymentForm(input.paymentMethod),
      customer: toFacturapiCustomer(input.recipient),
      items: input.items.map(toFacturapiItem),
      external_id: input.externalOrderId,
    }
  }

  private parseFacturapiResponse(
    data: Record<string, unknown>,
    input: IssueDteInput
  ): IssuedDte {
    const totals = calculateTotals(input.items)
    const emailTo =
      input.recipient.type === "empresa"
        ? input.recipient.email
        : input.recipient.email ?? "consumidor.final@ugarit.cl"
    return {
      id: String(data.id ?? ""),
      type: input.type,
      status: "stamped",
      folio: Number(data.folio_number ?? 0),
      uuid: String(data.uuid ?? ""),
      recipient: input.recipient,
      items: input.items,
      subtotal: totals.subtotal,
      tax: totals.tax,
      total: totals.total,
      issuedAt: String(data.created_at ?? new Date().toISOString()),
      pdfUrl: String(data.pdf_url ?? ""),
      xmlUrl: String(data.xml_url ?? ""),
      emailSentTo: emailTo,
      externalOrderId: input.externalOrderId,
    }
  }

  // ─── MOCK (desarrollo sin credenciales) ──────────────────
  private async issueMock(input: IssueDteInput): Promise<IssuedDte> {
    // Simula latencia de API
    await new Promise((r) => setTimeout(r, 800))

    const totals = calculateTotals(input.items)
    const folio = Math.floor(100000 + Math.random() * 900000)
    const id = `mock_${input.type}_${Date.now()}`
    const emailTo =
      input.recipient.type === "empresa"
        ? input.recipient.email
        : input.recipient.email ?? "consumidor.final@ugarit.cl"

    return {
      id,
      type: input.type,
      status: "stamped",
      folio,
      uuid: `uuid-mock-${id}`,
      recipient: input.recipient,
      items: input.items,
      subtotal: totals.subtotal,
      tax: totals.tax,
      total: totals.total,
      issuedAt: new Date().toISOString(),
      pdfUrl: `/api/dte/${id}/pdf`,
      xmlUrl: `/api/dte/${id}/xml`,
      emailSentTo: emailTo,
      externalOrderId: input.externalOrderId,
    }
  }
}

export class DteEmissionError extends Error {
  public readonly code: string | undefined
  constructor(message: string, code?: string) {
    super(message)
    this.name = "DteEmissionError"
    this.code = code
  }
}

/** Factory: crea el cliente según las env vars disponibles */
export function createFacturapiClient(): FacturapiClient {
  const apiKey = process.env.FACTURAPI_KEY
  const orgId = process.env.FACTURAPI_ORG_ID
  const live = Boolean(apiKey && apiKey.startsWith("sk_"))
  return new FacturapiClient({
    apiKey,
    organizationId: orgId,
    mode: live ? "live" : "mock",
  })
}
