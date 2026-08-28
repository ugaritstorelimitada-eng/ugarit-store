"use client"

import { useState } from "react"
import { ShoppingCart, Check } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-store"
import type { MockProduct } from "@/lib/mock-products"

export function AddToCartButton({ product }: { product: MockProduct }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const addItem = useCart((s) => s.addItem)
  const isOutOfStock = product.stock === 0

  const handleAdd = async () => {
    setLoading(true)
    addItem({
      id: product.id,
      handle: product.handle,
      title: product.title,
      price: product.price,
      image: product.images[0] ?? "",
      maxStock: product.stock,
      virtual: product.virtual,
    })
    await new Promise((r) => setTimeout(r, 200))
    setLoading(false)
    setDone(true)
    toast.success("Añadido al carrito", { description: product.title })
    setTimeout(() => setDone(false), 1500)
  }

  if (isOutOfStock) {
    return (
      <Button size="lg" disabled className="flex-1">
        Agotado
      </Button>
    )
  }

  return (
    <Button
      size="lg"
      onClick={handleAdd}
      disabled={loading}
      className="flex-1"
    >
      {done ? (
        <>
          <Check className="h-4 w-4" />
          Añadido
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" />
          {loading ? "Añadiendo..." : "Añadir al carrito"}
        </>
      )}
    </Button>
  )
}
