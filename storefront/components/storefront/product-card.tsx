"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ShoppingCart,
  Zap,
  ShieldCheck,
  BadgeCheck,
  ChevronDown,
} from "lucide-react"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-store"
import {
  formatCLP,
  type MockProduct,
  type LicenseVariant,
} from "@/lib/mock-products"

const BADGE_META: Record<
  string,
  { label: string; icon: React.ElementType; className: string }
> = {
  eset: { label: "ESET Oficial", icon: ShieldCheck, className: "bg-eset-500 text-white" },
  digital: { label: "Entrega 24/7", icon: Zap, className: "bg-amber-100 text-amber-800" },
  original: { label: "100% Original", icon: BadgeCheck, className: "bg-emerald-100 text-emerald-800" },
  warranty: { label: "Garantía Activación", icon: ShieldCheck, className: "bg-sky-100 text-sky-800" },
  microsoft: { label: "Microsoft", icon: BadgeCheck, className: "bg-blue-100 text-blue-800" },
  adobe: { label: "Adobe Autorizado", icon: BadgeCheck, className: "bg-red-100 text-red-800" },
  b2b: { label: "B2B", icon: BadgeCheck, className: "bg-slate-100 text-slate-800" },
}

const LICENSE_BADGE_KEYS = ["eset", "digital", "original", "warranty"] as const

type LicenseBadgeKey = (typeof LICENSE_BADGE_KEYS)[number]

function isLicenseBadge(key: string): key is LicenseBadgeKey {
  return (LICENSE_BADGE_KEYS as readonly string[]).includes(key)
}

export function ProductCard({ product }: { product: MockProduct }): React.JSX.Element {
  const addItem = useCart((s) => s.addItem)
  const isOutOfStock = product.stock === 0
  const [selectedVariant, setSelectedVariant] = useState<LicenseVariant | undefined>(
    product.hasVariants ? product.variants?.[1] ?? product.variants?.[0] : undefined
  )

  const currentPrice = selectedVariant?.price ?? product.price
  const currentCompare = selectedVariant?.compareAtPrice ?? product.compareAtPrice

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault()
    e.stopPropagation()
    if (isOutOfStock) {
      toast.error("Producto agotado", { description: product.title })
      return
    }
    const variantSku = selectedVariant?.sku ?? "default"
    addItem({
      id: `${product.id}-${variantSku}`,
      handle: product.handle,
      title: product.title,
      price: currentPrice,
      image: product.images[0] ?? "",
      maxStock: product.stock,
      virtual: product.virtual,
    })
    toast.success("Añadido al carrito", {
      description: `${product.title}${selectedVariant ? ` — ${selectedVariant.label}` : ""}`,
    })
  }

  const handleVariantChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    e.preventDefault()
    e.stopPropagation()
    const variant = product.variants?.find((v) => v.sku === e.target.value)
    setSelectedVariant(variant)
  }

  return (
    <Link
      href={`/p/${product.handle}`}
      className="group block h-full"
      aria-label={`Ver ${product.title}`}
    >
      <Card className="h-full overflow-hidden hover:shadow-lg hover:border-eset-300 transition-all flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : null}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.onSale && product.discountPercent ? (
              <Badge variant="offer">-{product.discountPercent}%</Badge>
            ) : null}
            {product.featured ? <Badge variant="warning">⭐ Destacado</Badge> : null}
            {isOutOfStock ? <Badge variant="secondary">Agotado</Badge> : null}
          </div>
          {product.brand === "ESET" ? (
            <div className="absolute bottom-2 left-2 bg-eset-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              ESET OFICIAL
            </div>
          ) : null}
          {product.virtual ? (
            <div className="absolute top-2 right-2 inline-flex items-center gap-1 bg-white/90 backdrop-blur text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
              <Zap className="h-3 w-3" />
              ENTREGA 24/7
            </div>
          ) : null}
        </div>

        <div className="p-4 flex flex-col flex-1 gap-2">
          {product.brand ? (
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              {product.brand}
            </p>
          ) : null}
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 min-h-10 group-hover:text-eset-700 transition-colors">
            {product.title}
          </h3>

          {product.hasVariants && product.variants ? (
            <div className="relative" onClick={(e) => e.preventDefault()}>
              <label className="sr-only" htmlFor={`variant-${product.id}`}>
                Seleccionar licencia
              </label>
              <select
                id={`variant-${product.id}`}
                value={selectedVariant?.sku ?? ""}
                onChange={handleVariantChange}
                onClick={(e) => e.stopPropagation()}
                className="w-full h-9 pl-3 pr-8 text-sm rounded-md border border-input bg-background appearance-none cursor-pointer hover:border-eset-400 focus:border-eset-500 focus:outline-none focus:ring-2 focus:ring-eset-200"
              >
                {product.variants.map((v) => (
                  <option key={v.sku} value={v.sku}>
                    {v.label} — {formatCLP(v.price)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          ) : null}

          <div className="flex items-baseline gap-2 mt-auto">
            <span className="text-lg font-bold text-eset-700">
              {formatCLP(currentPrice)}
            </span>
            {currentCompare ? (
              <span className="text-xs text-muted-foreground line-through">
                {formatCLP(currentCompare)}
              </span>
            ) : null}
          </div>
          <p className="text-[11px] text-muted-foreground">IVA incluido</p>

          {product.productBadges && product.productBadges.length > 0 ? (
            <ul className="flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-muted-foreground">
              {product.productBadges.slice(0, 3).map((b) => {
                if (!isLicenseBadge(b)) return null
                const meta = BADGE_META[b]
                if (!meta) return null
                const Icon = meta.icon
                return (
                  <li key={b} className="inline-flex items-center gap-0.5">
                    <Icon className="h-3 w-3" />
                    <span>{meta.label}</span>
                  </li>
                )
              })}
            </ul>
          ) : null}

          <Button
            size="sm"
            className="w-full mt-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={isOutOfStock}
            onClick={handleAdd}
          >
            <ShoppingCart className="h-4 w-4" />
            {isOutOfStock ? "Agotado" : "Comprar"}
          </Button>
        </div>
      </Card>
    </Link>
  )
}
