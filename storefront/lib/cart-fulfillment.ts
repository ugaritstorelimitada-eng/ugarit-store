/**
 * UGARIT · Cart fulfillment (re-export from shared-types)
 *
 * Esta archivo re-exporta los helpers de shared-types para mantener
 * backward compatibility en el storefront. El código fuente real
 * está en packages/shared-types/src/cart-fulfillment.ts
 */

export { getCartFulfillmentType } from "@ugarit/shared-types"

export type {
  CartItemFulfillment,
  CartFulfillmentType,
  CartFulfillmentResult,
} from "@ugarit/shared-types"
