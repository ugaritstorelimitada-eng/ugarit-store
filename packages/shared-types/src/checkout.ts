/**
 * UGARIT · Checkout helpers (shared)
 *
 * Re-exporta helpers de fulfillment del storefront para que el backend
 * de Medusa también tenga acceso a ellos.
 */

export type { CartItemFulfillment, CartFulfillmentType, CartFulfillmentResult } from "./cart-fulfillment"
export { getCartFulfillmentType } from "./cart-fulfillment"

export type CheckoutStepId = "contact" | "shipping" | "payment" | "confirm"

export type CheckoutStep = {
  id: CheckoutStepId
  label: string
}

export type FulfillmentType = "all-digital" | "all-physical" | "mixed"

/**
 * Devuelve los pasos del checkout según el tipo de fulfillment.
 */
export function getCheckoutSteps(fulfillment: FulfillmentType): CheckoutStep[] {
  if (fulfillment === "all-digital") {
    return [
      { id: "contact", label: "Contacto" },
      { id: "payment", label: "Pago" },
      { id: "confirm", label: "Confirmación" },
    ]
  }
  return [
    { id: "contact", label: "Contacto" },
    { id: "shipping", label: "Envío" },
    { id: "payment", label: "Pago" },
    { id: "confirm", label: "Confirmación" },
  ]
}
