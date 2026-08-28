import type { IssuedDte } from "./types"

/**
 * UGARIT · Email Service para DTE
 *
 * Envia el PDF + XML del DTE al cliente después de emitido.
 *
 * - LIVE: usa Resend (https://resend.com) con templates HTML
 * - MOCK: solo loguea en consola (dev)
 */

type EmailPayload = {
  readonly to: string
  readonly subject: string
  readonly html: string
  readonly attachments?: ReadonlyArray<{
    readonly filename: string
    readonly content: string | Buffer
    readonly contentType: string
  }>
}

type EmailResult = {
  readonly id: string
  readonly status: "sent" | "queued" | "mocked"
  readonly provider: "resend" | "mock"
  readonly sentAt: string
}

export class EmailService {
  private readonly apiKey: string | undefined
  private readonly from: string

  constructor(apiKey: string | undefined, from: string) {
    this.apiKey = apiKey
    this.from = from
  }

  async send(payload: EmailPayload): Promise<EmailResult> {
    if (!this.apiKey) {
      // Modo mock: loguear en consola
      console.log(`📧 [MOCK email] to=${payload.to} subject="${payload.subject}"`)
      if (payload.attachments) {
        for (const att of payload.attachments) {
          console.log(
            `   📎 attachment: ${att.filename} (${typeof att.content === "string" ? att.content.length + " chars" : att.content.length + " bytes"})`
          )
        }
      }
      return {
        id: `mock-email-${Date.now()}`,
        status: "mocked",
        provider: "mock",
        sentAt: new Date().toISOString(),
      }
    }

    // LIVE: Resend API
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: this.from,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        attachments: payload.attachments?.map((a) => ({
          filename: a.filename,
          content:
            typeof a.content === "string"
              ? Buffer.from(a.content).toString("base64")
              : a.content.toString("base64"),
        })),
      }),
    })

    if (!res.ok) {
      throw new Error(`Resend error ${res.status}: ${await res.text()}`)
    }
    const data = await res.json()
    return {
      id: String(data.id ?? ""),
      status: "sent",
      provider: "resend",
      sentAt: new Date().toISOString(),
    }
  }

  /** Envía el DTE al cliente con un HTML profesional */
  async sendDte(dte: IssuedDte): Promise<EmailResult> {
    const typeLabel =
      dte.type === "boleta"
        ? "Boleta Electrónica"
        : dte.type === "factura"
          ? "Factura Electrónica"
          : dte.type
    const recipientName =
      dte.recipient.type === "empresa"
        ? dte.recipient.razonSocial
        : dte.recipient.name ?? "Cliente"
    const subject = `Tu ${typeLabel} #${dte.folio} de UGARIT está disponible`
    const html = this.renderDteEmail(dte, recipientName, typeLabel)
    return this.send({
      to: dte.emailSentTo,
      subject,
      html,
    })
  }

  private renderDteEmail(
    dte: IssuedDte,
    name: string,
    typeLabel: string
  ): string {
    const itemsHtml = dte.items
      .map(
        (i) => `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${i.description}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: center;">${i.quantity}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">$${i.unitPrice.toLocaleString("es-CL")}</td>
        </tr>`
      )
      .join("")

    return `<!DOCTYPE html>
<html><body style="font-family: -apple-system, sans-serif; color: #0F172A; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 100%); padding: 24px; border-radius: 12px 12px 0 0;">
    <h1 style="color: #fff; margin: 0; font-size: 20px;">${typeLabel} #${dte.folio}</h1>
    <p style="color: #cbd5e1; margin: 4px 0 0; font-size: 14px;">UGARIT · ${dte.issuedAt.split("T")[0]}</p>
  </div>
  <div style="background: #fff; padding: 24px; border: 1px solid #e5e7eb; border-top: 0;">
    <p>Hola <strong>${name}</strong>,</p>
    <p>Tu ${typeLabel.toLowerCase()} por la compra en UGARIT ya está emitida y validada por el SII.</p>
    <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
      <thead>
        <tr style="background: #f1f5f9;">
          <th style="padding: 8px; text-align: left;">Producto</th>
          <th style="padding: 8px; text-align: center;">Cant.</th>
          <th style="padding: 8px; text-align: right;">Precio</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
      <tfoot>
        <tr><td colspan="2" style="padding: 8px; text-align: right;">Neto:</td><td style="padding: 8px; text-align: right;">$${dte.subtotal.toLocaleString("es-CL")}</td></tr>
        <tr><td colspan="2" style="padding: 8px; text-align: right;">IVA (19%):</td><td style="padding: 8px; text-align: right;">$${dte.tax.toLocaleString("es-CL")}</td></tr>
        <tr style="background: #00A88F; color: #fff;">
          <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">TOTAL:</td>
          <td style="padding: 10px; text-align: right; font-weight: bold;">$${dte.total.toLocaleString("es-CL")}</td>
        </tr>
      </tfoot>
    </table>
    <p style="margin-top: 20px;">Folio SII: <strong>#${dte.folio}</strong> · UUID: <code style="font-size: 12px;">${dte.uuid}</code></p>
    <a href="${dte.pdfUrl}" style="display: inline-block; background: #00A88F; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Descargar PDF</a>
    <a href="${dte.xmlUrl}" style="display: inline-block; background: #f1f5f9; color: #0F172A; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-left: 8px;">Descargar XML</a>
    <p style="margin-top: 24px; color: #64748b; font-size: 12px;">Si tienes dudas, contáctanos a contacto@ugarit.cl</p>
  </div>
  <div style="background: #f8fafc; padding: 16px; border-radius: 0 0 12px 12px; text-align: center; font-size: 11px; color: #64748b;">
    UGARIT · Importadora y Comercializadora Ugarit Limitada · RUT 77.316.893-8
  </div>
</body></html>`
  }
}

export function createEmailService(): EmailService {
  return new EmailService(
    process.env.RESEND_API_KEY,
    process.env.RESEND_FROM ?? "UGARIT <contacto@ugarit.cl>"
  )
}
