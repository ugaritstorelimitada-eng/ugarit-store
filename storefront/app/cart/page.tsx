"use client"

import Image from "next/image"
import Link from "next/link"
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  Zap,
  Truck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/lib/cart-store"
import { formatCLP } from "@/lib/mock-products"
import { getCartFulfillmentType } from "@/lib/cart-fulfillment"


export default function CartPage() {
  const items = useCart((s) => s.items)
  const updateQuantity = useCart((s) => s.updateQuantity)
  const removeItem = useCart((s) => s.removeItem)
  const clear = useCart((s) => s.clear)
  const subtotal = useCart((s) => s.subtotal)()

  const fulfillment = getCartFulfillmentType(items)

  if (items.length === 0) {
    return (
      <div className="container py-16">
        <div className="max-w-md mx-auto text-center space-y-4">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto" />
          <h1 className="text-2xl font-bold">Tu carrito está vacío</h1>
          <p className="text-muted-foreground">
            Aún no has añadido productos. Explora nuestra tienda y encuentra lo que necesitas.
          </p>
          <Button asChild>
            <Link href="/tienda">Ir a la tienda</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        Carrito ({items.length} {items.length === 1 ? "producto" : "productos"})
      </h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        {/* Lista de items */}
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Link
                    href={`/p/${item.handle}`}
                    className="relative w-20 h-20 sm:w-24 sm:h-24 rounded overflow-hidden bg-muted shrink-0"
                  >
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="120px"
                        className="object-cover"
                      />
                    )}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/p/${item.handle}`}
                      className="font-medium hover:text-ugarit-700 line-clamp-2"
                    >
                      {item.title}
                    </Link>
                    {item.virtual ? (
                      <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                        <Zap className="h-3 w-3" />
                        Licencia Digital
                      </span>
                    ) : (
                      <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                        <Truck className="h-3 w-3" />
                        Producto Físico
                      </span>
                    )}
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatCLP(item.price)} c/u
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      aria-label="Eliminar"
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <div className="flex items-center gap-1 border rounded">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Disminuir"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                        aria-label="Aumentar"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="font-semibold text-sm">
                      {formatCLP(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-between pt-4">
            <Button variant="ghost" onClick={clear}>
              Vaciar carrito
            </Button>
            <Button variant="outline" asChild>
              <Link href="/tienda">Seguir comprando</Link>
            </Button>
          </div>
        </div>

        {/* Resumen */}
        <div className="lg:sticky lg:top-32 h-fit">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold text-lg">Resumen del pedido</h2>

              {/* Banner de fulfillment dinámico */}
              {fulfillment.isAllDigital ? (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3 space-y-1">
                  <div className="flex items-center gap-2 text-emerald-800 text-sm font-semibold">
                    <Zap className="h-4 w-4" />
                    Entrega digital inmediata
                  </div>
                  <p className="text-xs text-emerald-700">
                    Te enviamos la clave de activación y los accesos por email en
                    segundos tras confirmar el pago.
                  </p>
                </div>
              ) : fulfillment.isMixed ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-1">
                  <div className="flex items-center gap-2 text-slate-800 text-sm font-semibold">
                    <Truck className="h-4 w-4" />
                    Despacho mixto
                  </div>
                  <p className="text-xs text-slate-600">
                    Los productos físicos se enviarán a tu dirección. Los digitales
                    llegan por email al instante.
                  </p>
                </div>
              ) : null}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCLP(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {fulfillment.isAllDigital ? "Entrega" : "Envío"}
                  </span>
                  {fulfillment.requiresShipping ? (
                    <span className="text-muted-foreground">Calculado en checkout</span>
                  ) : (
                    <span className="font-semibold text-emerald-600">
                      Digital por email · $0
                    </span>
                  )}
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-ugarit-700">{formatCLP(subtotal)}</span>
                </div>
                <p className="text-xs text-muted-foreground">IVA incluido</p>
              </div>

              <Button size="lg" className="w-full" asChild>
                <Link href="/checkout">
                  {fulfillment.isAllDigital ? "Continuar al pago" : "Ir al checkout"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Pago seguro con Webpay o Mercado Pago
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
