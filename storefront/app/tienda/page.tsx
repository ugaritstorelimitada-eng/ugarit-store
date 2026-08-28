import type { Metadata } from "next"
import { ProductCard } from "@/components/storefront/product-card"
import { ShopSidebar } from "@/components/storefront/shop-sidebar"
import { MOCK_PRODUCTS } from "@/lib/mock-products"
import Link from "next/link"
import { SearchX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Tienda",
  description: "Catálogo completo de UGARIT: software, ciberseguridad ESET, hardware y servicio técnico.",
}

type Props = {
  searchParams: Promise<{ q?: string; cat?: string; sort?: string; factura?: string; convenio?: string }>
}

export default async function TiendaPage({ searchParams }: Props) {
  const { q, cat, sort, factura, convenio } = await searchParams

  let products = [...MOCK_PRODUCTS]

  if (q) {
    const query = q.toLowerCase()
    products = products.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some((t) => t.toLowerCase().includes(query)) ||
        p.category.toLowerCase().includes(query) ||
        p.brand?.toLowerCase().includes(query)
    )
  }

  if (cat) {
    products = products.filter((p) => p.categories.includes(cat))
  }

  // B2B filters (heurística simple para el mock)
  if (factura === "1") {
    // Todos los productos digitales tienen factura
    products = products.filter((p) => p.virtual)
  }
  if (convenio === "1") {
    // Productos B2B: tags incluyen 'b2b' o marca ESET/Microsoft con categorías empresariales
    products = products.filter(
      (p) =>
        p.tags.includes("b2b") ||
        p.tags.includes("enterprise") ||
        p.brand === "ESET" ||
        (p.virtual && (p.price ?? 0) > 80000)
    )
  }

  if (sort === "price-asc") products.sort((a, b) => a.price - b.price)
  else if (sort === "price-desc") products.sort((a, b) => b.price - a.price)
  else if (sort === "name") products.sort((a, b) => a.title.localeCompare(b.title))
  else if (sort === "newest") products.sort((a, b) => Number(b.id.replace("wp_", "") || 0) - Number(a.id.replace("wp_", "") || 0))

  return (
    <div className="container py-8">
      <nav className="text-sm text-muted-foreground mb-4">
        <Link href="/" className="hover:text-foreground">Inicio</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Tienda</span>
        {q && (
          <>
            <span className="mx-2">/</span>
            <span className="text-foreground line-clamp-1 inline-block max-w-xs align-bottom">
              Búsqueda: {q}
            </span>
          </>
        )}
      </nav>

      <div className="mb-6 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Catálogo completo</h1>
          <p className="text-muted-foreground mt-1">
            {products.length} producto{products.length !== 1 ? "s" : ""} encontrado{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm flex-wrap">
          <span className="text-muted-foreground">Ordenar:</span>
          {[
            { v: "default", label: "Relevancia" },
            { v: "newest", label: "Recientes" },
            { v: "price-asc", label: "Menor precio" },
            { v: "price-desc", label: "Mayor precio" },
          ].map((opt) => {
            const params = new URLSearchParams()
            if (q) params.set("q", q)
            if (cat) params.set("cat", cat)
            if (factura) params.set("factura", "1")
            if (convenio) params.set("convenio", "1")
            if (opt.v !== "default") params.set("sort", opt.v)
            const isActive = (sort ?? "default") === opt.v
            return (
              <Link
                key={opt.v}
                href={`/tienda${params.toString() ? `?${params}` : ""}`}
                className={`px-2.5 py-1 rounded-full text-xs ${
                  isActive
                    ? "bg-eset-500 text-white"
                    : "border hover:border-eset-500 hover:text-eset-700"
                }`}
              >
                {opt.label}
              </Link>
            )
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        <Suspense fallback={<div className="bg-card border rounded-xl p-5 h-96 animate-pulse" />}>
          <ShopSidebar />
        </Suspense>

        <div>
          {products.length === 0 ? (
            <div className="text-center py-16 border rounded-lg bg-muted/30">
              <SearchX className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-lg font-medium">No encontramos productos</p>
              {q && <p className="text-muted-foreground mt-1">para &ldquo;{q}&rdquo;.</p>}
              <div className="flex gap-2 justify-center mt-4">
                <Button variant="outline" asChild>
                  <Link href="/tienda">Ver todo</Link>
                </Button>
                <Button asChild>
                  <Link href="/contacto">Pedir ayuda</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
