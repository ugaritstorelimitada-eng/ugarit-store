import type { Metadata } from "next"
import Link from "next/link"
import { ShieldCheck, Zap, Lock, Award, ArrowRight, BadgeCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/storefront/product-card"
import { getEsetProducts } from "@/lib/mock-products"
import { SITE } from "@/lib/constants"

export const metadata: Metadata = {
  title: "ESET Chile · Distribuidor Autorizado",
  description: "Catálogo oficial de licencias ESET: antivirus, ciberseguridad y protección empresarial. Distribuidor autorizado en Chile.",
}

const FEATURES = [
  { icon: ShieldCheck, title: "Antivirus de clase mundial", desc: "ESET es reconocido por su tasa de detección líder en la industria." },
  { icon: Zap, title: "Bajo consumo de recursos", desc: "Protege sin ralentizar tu equipo. Ideal para PCs y laptops antiguas." },
  { icon: Lock, title: "Anti-ransomware", desc: "Protección contra ransomware y ataques zero-day con tecnología de machine learning." },
  { icon: Award, title: "30+ años de experiencia", desc: "ESET es una empresa europea con más de 30 años protegiendo usuarios." },
]

export default function EsetPage() {
  const products = getEsetProducts()

  return (
    <div>
      {/* Hero */}
      <section className="bg-eset-gradient text-white">
        <div className="container py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/20 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded mb-4 backdrop-blur">
              <BadgeCheck className="h-3 w-3" />
              Distribuidor Autorizado ESET Chile
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Ciberseguridad ESET
            </h1>
            <p className="text-lg text-white/90 mt-4 max-w-2xl">
              Licencias originales con respaldo directo del fabricante. Protección
              para usuarios, familias y empresas con tecnología europea de élite.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Button asChild size="lg" className="bg-white text-eset-700 hover:bg-slate-50">
                <Link href="#productos">Ver catálogo</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <a href={SITE.partners.eset.esetUrl} target="_blank" rel="noreferrer">
                  Conocer ESET
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => {
            const Icon = f.icon
            return (
              <Card key={f.title}>
                <CardContent className="p-6 space-y-2">
                  <Icon className="h-8 w-8 text-eset-500" />
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Catálogo */}
      <section id="productos" className="bg-muted/30 border-y scroll-mt-20">
        <div className="container py-12">
          <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Catálogo ESET</h2>
              <p className="text-muted-foreground mt-1">
                {products.length} producto{products.length !== 1 ? "s" : ""} disponibles
              </p>
            </div>
            <Badge variant="success" className="text-sm">
              <ShieldCheck className="h-3 w-3 mr-1" />
              Licencias 100% originales
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* B2B CTA */}
      <section className="container py-12">
        <Card className="bg-slate-900 text-white border-0">
          <CardContent className="p-8 md:p-12 text-center space-y-4">
            <h3 className="text-2xl md:text-3xl font-bold">
              ¿Necesitas ESET para tu empresa (5+ equipos)?
            </h3>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Tenemos planes corporativos con ESET PROTECT, consola de administración
              centralizada, y descuentos por volumen. Atendemos licitaciones en Mercado Público.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild size="lg" className="bg-eset-500 hover:bg-eset-600">
                <Link href="/mercado-publico">Cotización empresarial</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <a href={`mailto:${SITE.emailVentas}`}>
                  {SITE.emailVentas}
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
