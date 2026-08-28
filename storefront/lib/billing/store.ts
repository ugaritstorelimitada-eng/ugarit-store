import type { IssuedDte } from "./types"

/**
 * UGARIT · Storage temporal de DTEs emitidos
 *
 * En desarrollo usamos un Map en memoria (no persiste entre reinicios).
 * En producción esto se reemplaza por una tabla en PostgreSQL
 * (Medusa model "dte_document" con FK a order).
 *
 * API thread-safe suficiente para un solo proceso Node.js.
 */
const STORE = new Map<string, IssuedDte>()

export const DteStore = {
  save(dte: IssuedDte): IssuedDte {
    STORE.set(dte.id, dte)
    return dte
  },

  get(id: string): IssuedDte | undefined {
    return STORE.get(id)
  },

  listByOrder(externalOrderId: string): IssuedDte[] {
    return Array.from(STORE.values()).filter(
      (d) => d.externalOrderId === externalOrderId
    )
  },

  list(limit = 100): IssuedDte[] {
    return Array.from(STORE.values())
      .sort((a, b) => (a.issuedAt > b.issuedAt ? -1 : 1))
      .slice(0, limit)
  },

  count(): number {
    return STORE.size
  },
}
