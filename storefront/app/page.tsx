import Link from "next/link"
import { ArrowRight, Sparkles, Tag, Zap, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/storefront/product-card"
import { ValuePropsStrip } from "@/components/storefront/value-props"
import { HeroBannerSlider } from "@/components/storefront/hero-banner-slider"
import { SITE } from "@/lib/constants"
import {
  getFeaturedProducts,
  getEsetProducts,
  getOnSaleProducts,
} from "@/lib/mock-products"

export default function HomePage() {
  const featured = getFeaturedProducts().slice(0, 4)
  const eset = getEsetProducts().slice(0, 4)
  const onSale = getOnSaleProducts().slice(0, 4)

  return (
    <div className="flex flex-col">
      {/* Hero Banner Slider — full width retail */}
      <HeroBannerSlider />

      {/* Trust strip — 4 pilares */}
      <ValuePropsStrip />

      {/* Productos destacados */}
      <section className="container py-12">
        <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-eset-700 mb-1">
              Más vendidos
            </p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Software destacado
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Los productos preferidos por nuestros clientes B2B y gobierno
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/tienda">
              Ver todo <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ESET Partner — banner full + grid */}
      <section className="bg-gradient-to-br from-eset-50 to-emerald-50/50 border-y">
        <div className="container py-12">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-8 items-center">
            <div className="space-y-3">
              <Badge className="bg-eset-500 text-white">
                <Shield className="h-3 w-3 mr-1" />
                Partner Oficial ESET
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Ciberseguridad líder mundial
              </h2>
              <p className="text-muted-foreground">
                Antivirus, endpoint protection y soluciones empresariales con respaldo directo
                del fabricante.
              </p>
              <Button className="bg-eset-600 hover:bg-eset-700 text-white" asChild>
                <Link href="/software/eset">
                  Ver catálogo ESET <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {eset.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ofertas */}
      {onSale.length > 0 && (
        <section className="container py-12">
          <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-1">
                Hasta 35% OFF
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Ofertas de la semana
              </h2>
            </div>
            <Button variant="outline" asChild>
              <Link href="/categoria/ofertas">
                Ver todas <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {onSale.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Banners horizontales (B2B + Servicio técnico) */}
      <section className="container py-12">
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-ugarit-900 text-white border-ugarit-900">
            <CardContent className="p-8 space-y-3">
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                <Tag className="h-3 w-3 mr-1" />
                B2B & Gobierno
              </Badge>
              <h3 className="text-2xl font-bold">Convenio Mercado Público</h3>
              <p className="text-ugarit-100 text-sm">
                Cotizaciones formales, órdenes de compra y licitaciones para organismos
                públicos y empresas.
              </p>
              <Button asChild className="bg-white text-ugarit-900 hover:bg-slate-100">
                <Link href="/mercado-publico">Solicitar cotización</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8 space-y-3">
              <Badge variant="secondary">
                <Sparkles className="h-3 w-3 mr-1" />
                Servicio técnico
              </Badge>
              <h3 className="text-2xl font-bold">Reparación y soporte</h3>
              <p className="text-muted-foreground text-sm">
                Diagnóstico, mantenimiento e instalación remota. Tu equipo en buenas manos.
              </p>
              <Button asChild>
                <Link href="/servicio-tecnico">Solicitar servicio</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA WhatsApp */}
      <section className="bg-muted/30 border-t">
        <div className="container py-12 text-center space-y-4">
          <h2 className="text-2xl font-bold">¿Necesitas ayuda para elegir?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Escríbenos por WhatsApp y un asesor te ayuda a encontrar el producto o servicio ideal
            para tu necesidad.
          </p>
          <Button size="lg" className="bg-eset-600 hover:bg-eset-700" asChild>
            <a
              href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
            >
              Chatear con un asesor
            </a>
          </Button>
        </div>
      </section>
    </div>
  )
}
