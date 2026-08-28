import { Zap, ShieldCheck, FileText, Building2 } from "lucide-react"
import type { LucideIcon } from "lucide-react"

type ValueProp = {
  readonly icon: LucideIcon
  readonly title: string
  readonly description: string
  readonly accent: "eset" | "blue" | "amber" | "purple"
}

const PROPS: readonly ValueProp[] = [
  {
    icon: Zap,
    title: "Entrega Digital 24/7",
    description: "Clave de activación enviada por email en segundos, sin esperar horario de oficina.",
    accent: "amber",
  },
  {
    icon: ShieldCheck,
    title: "Garantía 100% Original",
    description: "Licencias legítimas con respaldo del fabricante. Soporte técnico incluido.",
    accent: "eset",
  },
  {
    icon: FileText,
    title: "Boleta o Factura Inmediata",
    description: "DTE electrónico automático al pago. Boleta para personas, factura para empresas.",
    accent: "blue",
  },
  {
    icon: Building2,
    title: "Convenio Mercado Público",
    description: "Proveedor del Estado. Atendemos licitaciones, órdenes de compra y cotizaciones.",
    accent: "purple",
  },
]

const ACCENT_STYLES: Record<ValueProp["accent"], { ring: string; icon: string; bg: string }> = {
  eset: { ring: "ring-eset-100", icon: "text-eset-600 bg-eset-50", bg: "bg-eset-50" },
  blue: { ring: "ring-sky-100", icon: "text-sky-600 bg-sky-50", bg: "bg-sky-50" },
  amber: { ring: "ring-amber-100", icon: "text-amber-600 bg-amber-50", bg: "bg-amber-50" },
  purple: { ring: "ring-violet-100", icon: "text-violet-600 bg-violet-50", bg: "bg-violet-50" },
}

/**
 * ValuePropsStrip · Franja de pilares de confianza bajo el hero.
 * 4 beneficios clave: Entrega Digital 24/7, Garantía 100%, Boleta/Factura DTE,
 * Convenio Mercado Público.
 */
export function ValuePropsStrip(): React.JSX.Element {
  return (
    <section className="border-y border-slate-200 bg-slate-50/60">
      <div className="container py-8">
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {PROPS.map((prop) => {
            const Icon = prop.icon
            const accent = ACCENT_STYLES[prop.accent]
            return (
              <li
                key={prop.title}
                className="group flex items-start gap-3 rounded-lg p-3 hover:bg-white transition-colors"
              >
                <div
                  className={`shrink-0 w-10 h-10 rounded-lg ${accent.icon} flex items-center justify-center ring-1 ${accent.ring}`}
                  aria-hidden="true"
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 leading-tight">
                    {prop.title}
                  </p>
                  <p className="text-xs text-slate-600 leading-snug mt-0.5">
                    {prop.description}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
