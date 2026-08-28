import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ProductCard } from "@/components/storefront/product-card"
import { CATEGORIES } from "@/lib/constants"
import { findProductsByCategory, MOCK_PRODUCTS } from "@/lib/mock-products"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cat = CATEGORIES.find((c) => c.slug === slug)
  if (!cat) return {}
  return {
    title: cat.label,
    description: `Productos de la categoría ${cat.label} en UGARIT.`,
  }
}

export default async function CategoriaPage({ params }: Props) {
  const { slug } = await params
  const category = CATEGORIES.find((c) => c.slug === slug)
  if (!category) notFound()

  const products = findProductsByCategory(slug)

  return (
    <div className="container py-8">
      <nav className="text-sm text-muted-foreground mb-4">
        <Link href="/" className="hover:text-foreground">Inicio</Link>
        <span className="mx-2">/</span>
        <Link href="/tienda" className="hover:text-foreground">Tienda</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{category.label}</span>
      </nav>

      <div className="mb-8 flex items-center gap-4">
        <span className="text-5xl">{category.icon}</span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{category.label}</h1>
          <p className="text-muted-foreground mt-1">
            {products.length} producto{products.length !== 1 ? "s" : ""} en esta categoría
          </p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 border rounded-lg bg-muted/30">
          <p className="text-muted-foreground">
            Aún no hay productos en esta categoría.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Vuelve pronto o explora otras categorías.
          </p>
          <Link
            href="/tienda"
            className="inline-block mt-4 text-ugarit-700 hover:underline"
          >
            Ver toda la tienda →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Cross-sell: otras categorías */}
      <div className="mt-16 border-t pt-8">
        <h2 className="text-xl font-semibold mb-4">Otras categorías</h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.filter((c) => c.slug !== slug).map((c) => {
            const count = MOCK_PRODUCTS.filter((p) => p.categories.includes(c.slug)).length
            return (
              <Link
                key={c.slug}
                href={`/categoria/${c.slug}`}
                className="px-3 py-1.5 rounded-full border text-sm hover:border-ugarit-500 hover:text-ugarit-700 transition-colors"
              >
                {c.icon} {c.label} ({count})
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
