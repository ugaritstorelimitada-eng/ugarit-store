import Link from "next/link"
import { ShieldCheck, FileText, ArrowRight, BadgeCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

/**
 * PreFooterInstitucional · Trust signals para empresa/gobierno.
 *
 * Aparece justo antes del <SiteFooter/> en todas las páginas.
 *
 * 2 cards:
 * 1. Distribuidor Autorizado ESET (partner oficial de ciberseguridad)
 * 2. Proveedor del Estado en Mercado Público Chile (B2B/Gobierno)
 */
export function PreFooterInstitutional() {
  return (
    <section className="bg-muted/40 border-y">
      <div className="container py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Respaldo institucional
          </h2>
          <p className="text-muted-foreground mt-2">
            Partners oficiales y proveedores del Estado
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* ─── ESET Partner ─── */}
          <Card className="border-eset-200 hover:border-eset-400 transition-colors">
            <CardContent className="p-6 flex gap-4 items-start">
              <div className="shrink-0 w-14 h-14 rounded-xl bg-eset-gradient flex items-center justify-center shadow-md">
                <ShieldCheck className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1 space-y-2">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-eset-50 text-eset-700">
                  <BadgeCheck className="h-3 w-3" />
                  Partner Oficial
                </span>
                <h3 className="font-bold text-lg">Distribuidor Autorizado ESET</h3>
                <p className="text-sm text-muted-foreground">
                  Licenciamiento 100% legítimo con respaldo directo del fabricante,
                  soporte técnico y renovaciones.
                </p>
                <Link
                  href="/software/eset"
                  className="inline-flex items-center text-sm font-medium text-eset-700 hover:text-eset-800 hover:underline"
                >
                  Ver catálogo ESET
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* ─── Mercado Público ─── */}
          <Card className="border-mp/30 hover:border-mp/60 transition-colors">
            <CardContent className="p-6 flex gap-4 items-start">
              <div
                className="shrink-0 w-14 h-14 rounded-xl flex items-center justify-center shadow-md"
                style={{ background: "linear-gradient(135deg, #0033A0 0%, #002677 100%)" }}
              >
                <FileText className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1 space-y-2">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-mp/10 text-mp">
                  <FileText className="h-3 w-3" />
                  Sector Público
                </span>
                <h3 className="font-bold text-lg">Proveedor del Estado</h3>
                <p className="text-sm text-muted-foreground">
                  Atendemos órdenes de compra, licitaciones y cotizaciones
                  para organismos públicos y municipalidades.
                </p>
                <Link
                  href="/mercado-publico"
                  className="inline-flex items-center text-sm font-medium text-mp hover:underline"
                  style={{ color: "#0033A0" }}
                >
                  Solicitar cotización pública
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
