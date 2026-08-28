/**
 * UGARIT · Cart fulfillment (shared)
 *
 * Determina el tipo de fulfillment del carrito en función de los productos
 * que contiene. Soporta tres modos:
 *
 * - all-digital: 100% licencias/software → no requiere envío físico
 * - all-physical: 100% hardware → requiere envío
 * - mixed: combinación → requiere envío (los físicos se envían, los digitales por email)
 */

export type CartItemFulfillment = {
  readonly virtual: boolean
}

export type CartFulfillmentType = "all-digital" | "all-physical" | "mixed"

export type CartFulfillmentResult = {
  readonly type: CartFulfillmentType
  readonly isAllDigital: boolean
  readonly isAllPhysical: boolean
  readonly isMixed: boolean
  readonly requiresShipping: boolean
  readonly hasDigital: boolean
  readonly hasPhysical: boolean
}

export function getCartFulfillmentType(
  items: readonly CartItemFulfillment[]
): CartFulfillmentResult {
  if (items.length === 0) {
    return {
      type: "all-digital",
      isAllDigital: true,
      isAllPhysical: false,
      isMixed: false,
      requiresShipping: false,
      hasDigital: false,
      hasPhysical: false,
    }
  }

  const hasDigital = items.some((i) => i.virtual)
  const hasPhysical = items.some((i) => !i.virtual)

  const isAllDigital = hasDigital && !hasPhysical
  const isAllPhysical = hasPhysical && !hasDigital
  const isMixed = hasDigital && hasPhysical

  const type: CartFulfillmentType = isAllDigital
    ? "all-digital"
    : isAllPhysical
      ? "all-physical"
      : "mixed"

  return {
    type,
    isAllDigital,
    isAllPhysical,
    isMixed,
    requiresShipping: hasPhysical,
    hasDigital,
    hasPhysical,
  }
}
