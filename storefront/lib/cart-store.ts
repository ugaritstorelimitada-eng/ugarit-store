import { create } from "zustand"
import { persist } from "zustand/middleware"

export type CartItem = {
  id: string
  handle: string
  title: string
  price: number
  image: string
  quantity: number
  maxStock: number
  /** Producto digital (licencia) vs físico (hardware) — alineado con shared-types */
  virtual: boolean
}

type CartState = {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clear: () => void
  toggleCart: () => void
  setOpen: (open: boolean) => void
  totalItems: () => number
  subtotal: () => number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const existing = get().items.find((i) => i.id === item.id)
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: Math.min(i.quantity + 1, item.maxStock) }
                : i
            ),
          })
        } else {
          set({ items: [...get().items, { ...item, quantity: 1 }] })
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) })
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id)
          return
        }
        set({
          items: get().items.map((i) =>
            i.id === id
              ? { ...i, quantity: Math.min(quantity, i.maxStock) }
              : i
          ),
        })
      },

      clear: () => set({ items: [] }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      setOpen: (open) => set({ isOpen: open }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "ugarit-cart",
      // Migración de carts viejos (schema legacy: is_digital → virtual)
      version: 3,
      migrate: (persistedState) => {
        if (
          persistedState &&
          typeof persistedState === "object" &&
          "items" in persistedState
        ) {
          const state = persistedState as { items?: Array<Record<string, unknown>> }
          state.items = (state.items ?? []).map((item) => ({
            ...item,
            // Normalizar: el schema nuevo usa `virtual`
            virtual: item.virtual ?? item.is_digital ?? true,
          }))
        }
        return persistedState as CartState
      },
      partialize: (state) => ({ items: state.items }),
    }
  )
)
