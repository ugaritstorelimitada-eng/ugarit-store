import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Truck, ShieldCheck, MessageCircle, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { AddToCartButton } from "@/components/storefront/add-to-cart-button"
import { ProductCard } from "@/components/storefront/product-card"
import {
  findProductByHandle,
  getRelatedProducts,
  formatCLP,
  MOCK_PRODUCTS,
} from "@/lib/mock-products"
import { SITE } from "@/lib/constants"

type Props = { params: Promise<{ handle: string }> }

export async function generateStaticParams() {
  return MOCK_PRODUCTS.map((p) => ({ handle: p.handle }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const product = findProductByHandle(handle)
  if (!product) return {}
  return {
    title: product.title,
    description: product.shortDescription,
    openGraph: {
      title: product.title,
      description: product.shortDescription,
      images: product.images.slice(0, 1),
    },
  }
}

export default async function ProductoPage({ params }: Props) {
  const { handle } = await params
  const product = findProductByHandle(handle)
  if (!product) notFound()

  const related = getRelatedProducts(product, 4)
  const isOutOfStock = product.stock === 0

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-foreground">Inicio</Link>
        <span>/</span>
        <Link href="/tienda" className="hover:text-foreground">Tienda</Link>
        <span>/</span>
        <Link href={`/categoria/${product.category}`} className="hover:text-foreground capitalize">
          {product.category.replace(/-/g, " ")}
        </Link>
        <span>/</span>
        <span className="text-foreground line-clamp-1">{product.title}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Galería */}
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
            {product.images[0] && (
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            )}
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {product.onSale && product.discountPercent && (
                <Badge variant="offer" className="text-sm">-{product.discountPercent}%</Badge>
              )}
              {product.featured && <Badge variant="warning">Destacado</Badge>}
              {isOutOfStock && <Badge variant="secondary">Agotado</Badge>}
            </div>
          </div>
          {/* Thumbnails (mock: solo la misma imagen) */}
          <div className="grid grid-cols-4 gap-2">
            {product.images.slice(0, 4).map((img, i) => (
              <div
                key={i}
                className="relative aspect-square overflow-hidden rounded border bg-muted cursor-pointer hover:border-ugarit-500"
              >
                <Image src={img} alt={`${product.title} ${i + 1}`} fill sizes="120px" className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-6">
          {product.brand && (
            <p className="text-sm text-muted-foreground uppercase tracking-wide">
              {product.brand}
            </p>
          )}
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {product.title}
          </h1>
          <p className="text-muted-foreground text-lg">{product.shortDescription}</p>

          {/* Precio */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-ugarit-700">
                {formatCLP(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatCLP(product.compareAtPrice)}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">Precio incluye IVA</p>
          </div>

          {/* Stock / tipo */}
          <div className="flex items-center gap-4 text-sm">
            {product.virtual ? (
              <Badge variant="success">Entrega digital inmediata</Badge>
            ) : isOutOfStock ? (
              <Badge variant="destructive">Agotado</Badge>
            ) : (
              <Badge variant="success">{product.stock} unidades disponibles</Badge>
            )}
            <span className="text-muted-foreground">SKU: {product.sku}</span>
          </div>

          {/* Add to cart */}
          <div className="flex flex-col sm:flex-row gap-3">
            <AddToCartButton product={product} />
            <Button variant="outline" size="lg" asChild>
              <a
                href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola, tengo una duda sobre: ${product.title}`)}`}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
                Consultar por WhatsApp
              </a>
            </Button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm">
              <ShieldCheck className="h-4 w-4 text-ugarit-700" />
              <span>Licencia original</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-4 w-4 text-ugarit-700" />
              <span>Envío a todo Chile</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-ugarit-700" />
              <span>Factura electrónica DTE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Descripción */}
      <div className="mt-12">
        <Card>
          <CardContent className="p-6 prose prose-sm max-w-none">
            <h2 className="text-xl font-semibold mb-3">Descripción</h2>
            <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
              {product.description}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Relacionados */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight mb-6">También te puede interesar</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
