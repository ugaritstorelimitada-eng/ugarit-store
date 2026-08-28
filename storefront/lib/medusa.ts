/**
 * UGARIT · Medusa SDK client
 * Cliente para consumir el backend de Medusa.js desde el storefront.
 */
import Medusa from "@medusajs/js-sdk"

const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  publishableKey: PUBLISHABLE_KEY,
  auth: {
    type: "session",
  },
})

/** Tipo helper para paginación de Medusa. */
export type MedusaListResponse<T> = {
  products?: T[]
  orders?: T[]
  customers?: T[]
  count: number
  offset: number
  limit: number
}
