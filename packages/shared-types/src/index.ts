/**
 * UGARIT · Shared types
 * Tipos y helpers reusables entre storefront y backend.
 */

// ─── RUT & Identidad Chile ─────────────────────────────────
export type ChileanRut = string
export type CustomerType = "b2c" | "b2b"
export type DteType = "boleta" | "factura"
export type DteStatus = "pending" | "issued" | "rejected" | "cancelled"
export type PaymentMethod = "webpay" | "mercadopago" | "transferencia"
export type ShippingMethod = "chilexpress" | "bluexpress" | "retiro_tienda" | "digital"
export type OrderStatus =
  | "pending"
  | "awaiting_payment"
  | "paid"
  | "preparing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"

// ─── Producto ─────────────────────────────────────────────
export type ProductCategorySlug =
  | "software"
  | "windows"
  | "office"
  | "notebooks-y-pc"
  | "audifonos"
  | "relojes"
  | "cargadores"
  | "seguridad-y-vigilancia"
  | "eset"
  | "servicio-tecnico"

export type ProductKind = "physical" | "virtual" | "service"

export type ProductBadge =
  | "nuevo"
  | "oferta"
  | "destacado"
  | "vendido"
  | "exclusivo"

// ─── Facturación (DTE) ─────────────────────────────────────
export type DteDocumentType = "boleta_electronica" | "factura_electronica"

export type BillingInfo = {
  readonly rut: string
  readonly razonSocial: string
  readonly giro: string
  readonly direccion: string
  readonly comuna: string
  readonly email?: string
}

export type DteRecord = {
  readonly id: string
  readonly orderId: string
  readonly type: DteDocumentType
  readonly status: DteStatus
  readonly rut: string
  readonly razonSocial: string
  readonly monto: number
  readonly folio?: number
  readonly pdfUrl?: string
  readonly xmlUrl?: string
  readonly issuedAt?: string
  readonly createdAt: string
  readonly errorMessage?: string
}

// ─── Orden ─────────────────────────────────────────────────
export type CartItem = {
  readonly id: string
  readonly handle: string
  readonly title: string
  readonly price: number
  readonly image: string
  readonly quantity: number
  readonly maxStock: number
  readonly virtual: boolean
}

// ─── Checkout ──────────────────────────────────────────────
export { getCartFulfillmentType } from "./cart-fulfillment"
export { getCheckoutSteps } from "./checkout"
export type { CartItemFulfillment, CartFulfillmentType, CartFulfillmentResult } from "./cart-fulfillment"
export type { CheckoutStep, CheckoutStepId, FulfillmentType } from "./checkout"

// ─── Helpers Chile ─────────────────────────────────────────
export { formatCLP } from "./format-clp"
export { isValidRut, cleanRut, formatRut, validateRut, formatRutLive, RUT_ERROR_MESSAGES } from "./chile"
export type { RutValidation, RutError } from "./chile"
