/**
 * UGARIT · Sistema de Facturación Electrónica (DTE)
 *
 * Tipos compartidos para el flujo de Documento Tributario Electrónico
 * según normativa del SII Chile.
 *
 * Proveedor DTE: Facturapi (líder LATAM).
 * Docs: https://docs.facturapi.io/
 *
 * Estados de un DTE según SII:
 *  - draft:     creado pero no enviado al SII
 *  - pending:    enviado al SII, esperando respuesta
 *  - stamped:    emitido y timbrado por el SII (válido)
 *  - cancelled:  anulado (por nota de crédito o solicitud)
 *  - rejected:   rechazado por el SII (revisar errores)
 *  - error:      error técnico (no se pudo emitir)
 */

export type DteType = "boleta" | "factura" | "nota_credito" | "nota_debito"

export type DteStatus =
  | "draft"
  | "pending"
  | "stamped"
  | "cancelled"
  | "rejected"
  | "error"

/** Receptor de un DTE */
export type DteRecipient =
  | {
      /** Boleta: persona natural sin RUT */
      readonly type: "persona_natural"
      readonly rut?: string
      readonly name?: string
      readonly email?: string
    }
  | {
      /** Factura: empresa con RUT obligatorio */
      readonly type: "empresa"
      readonly rut: string
      readonly razonSocial: string
      readonly giro?: string
      readonly direccion: string
      readonly comuna: string
      readonly ciudad: string
      readonly email: string
    }

/** Item de un DTE (línea del documento) */
export type DteItem = {
  readonly sku: string
  readonly description: string
  readonly quantity: number
  readonly unitPrice: number // CLP sin IVA
  readonly taxRate?: number // 0.19 por defecto (19% IVA Chile)
}

/** Datos para emitir un DTE */
export type IssueDteInput = {
  readonly type: DteType
  readonly recipient: DteRecipient
  readonly items: readonly DteItem[]
  readonly paymentMethod: "webpay" | "mercadopago" | "transferencia"
  readonly externalOrderId: string // ID de la orden en Medusa
  readonly notes?: string
}

/** DTE emitido (respuesta de Facturapi) */
export type IssuedDte = {
  readonly id: string
  readonly type: DteType
  readonly status: DteStatus
  readonly folio: number // Folio SII (1, 2, 3...)
  readonly uuid: string // UUID único del SII
  readonly recipient: DteRecipient
  readonly items: readonly DteItem[]
  readonly subtotal: number
  readonly tax: number // IVA
  readonly total: number
  readonly issuedAt: string // ISO 8601
  readonly pdfUrl: string
  readonly xmlUrl: string
  readonly emailSentTo: string
  readonly externalOrderId: string
}

/** Error al emitir DTE */
export type DteError = {
  readonly code: string
  readonly message: string
  readonly field?: string
}

/** Resultado de validación de RUT */
export type RutValidation =
  | { readonly valid: true; readonly normalized: string }
  | { readonly valid: false; readonly reason: string }
