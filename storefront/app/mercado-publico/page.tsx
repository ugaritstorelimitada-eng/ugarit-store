import type { Metadata } from "next"
import { FileText, CheckCircle2, Mail, Building2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SITE } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Mercado Público · Proveedor del Estado",
  description: `Ugarit es proveedor del Estado en Mercado Público Chile. Atendemos licitaciones, órdenes de compra y cotizaciones para organismos públicos.`,
}

const BENEFITS = [
  "Empresa registrada en Mercado Público Chile con código de proveedor",
  "Factura electrónica (DTE) automática post-pago",
  "Plazo de pago a 30 días para organismos públicos",
  "Garantía de activación 100% en todas las licencias",
  "Soporte técnico dedicado durante toda la garantía",
  "Entrega digital inmediata de claves de activación",
  "Cumplimiento normativo SII y ChileCompra",
]

const CATEGORIES_MP = [
  "Software y Licencias",
  "Ciberseguridad (ESET)",
  "Equipos computacionales",
  "Servicio técnico especializado",
  "Soporte y mantenimiento",
]

export default function MercadoPublicoPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-slate-900 text-white">
        <div className="container py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded mb-4">
              <FileText className="h-3 w-3" />
              Sector Público
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Proveedor del Estado en Mercado Público Chile
            </h1>
            <p className="text-lg text-slate-300 mt-4">
              Atendemos órdenes de compra, licitaciones y cotizaciones formales
              para organismos públicos, municipalidades y empresas del Estado.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Button asChild size="lg" className="bg-eset-500 hover:bg-eset-600">
                <a href="#cotizar">Solicitar cotización pública</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <a href={`mailto:${SITE.emailMercadoPublico}`}>
                  <Mail className="h-4 w-4" />
                  {SITE.emailMercadoPublico}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="container py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              ¿Por qué elegir Ugarit?
            </h2>
            <ul className="space-y-3">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-eset-500 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <Card>
            <CardContent className="p-6 space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Categorías que供应mos
              </h3>
              <ul className="space-y-2 text-sm">
                {CATEGORIES_MP.map((c) => (
                  <li key={c} className="flex items-center gap-2 text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-eset-500" />
                    {c}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Formulario de cotización */}
      <section id="cotizar" className="bg-muted/30 border-y scroll-mt-20">
        <div className="container py-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight">
                Solicita tu cotización pública
              </h2>
              <p className="text-muted-foreground mt-2">
                Te respondemos en menos de 24h hábiles con cotización formal y código de proveedor.
              </p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <form className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <Label>Organismo / Institución</Label>
                      <Input placeholder="Municipalidad de…" required />
                    </div>
                    <div>
                      <Label>RUT del organismo</Label>
                      <Input placeholder="61.xxx.xxx-x" required />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <Label>Nombre del solicitante</Label>
                      <Input placeholder="Nombre completo" required />
                    </div>
                    <div>
                      <Label>Cargo</Label>
                      <Input placeholder="Ej: Jefe de Adquisiciones" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <Label>Email institucional</Label>
                      <Input type="email" placeholder="compras@organismo.cl" required />
                    </div>
                    <div>
                      <Label>Teléfono</Label>
                      <Input type="tel" placeholder="+56 2 2345 6789" />
                    </div>
                  </div>
                  <div>
                    <Label>Tipo de requerimiento</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option>Licitación pública (LP)</option>
                      <option>Licitación privada (LPR)</option>
                      <option>Convenio marco</option>
                      <option>Compra ágil</option>
                      <option>Trato directo</option>
                      <option>Orden de compra directa</option>
                    </select>
                  </div>
                  <div>
                    <Label>Detalle del requerimiento</Label>
                    <Textarea
                      rows={5}
                      placeholder="Cuéntanos qué productos/servicios necesitas, cantidades, plazos, etc."
                      required
                    />
                  </div>
                  <div>
                    <Label>Código de Mercado Público (opcional)</Label>
                    <Input placeholder="ID de la licitación si ya existe" />
                  </div>
                  <Button type="submit" size="lg" className="w-full">
                    Enviar solicitud
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Tus datos están protegidos. Solo usaremos esta información para
                    preparar tu cotización.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
