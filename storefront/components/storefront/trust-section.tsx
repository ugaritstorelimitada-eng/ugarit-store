import Link from "next/link"
import { ShieldCheck, FileText, ArrowRight, BadgeCheck } from "lucide-react"
import type { LucideIcon } from "lucide-react"

type TrustCard = {
  readonly icon: LucideIcon
  readonly pill: string
  readonly pillColor: "eset" | "mp"
  readonly title: string
  readonly description: string
  readonly cta: string
  readonly href: string
  readonly hrefExternal?: boolean
  readonly iconBg: string
  readonly iconColor: string
}

const CARDS: readonly TrustCard[] = [
  {
    icon: ShieldCheck,
    pill: "Partner Oficial",
    pillColor: "eset",
    title: "Distribuidor Autorizado ESET",
    description:
      "Licenciamiento 100% legítimo con respaldo directo del fabricante, soporte técnico y renovaciones para Chile.",
    cta: "Ver catálogo ESET",
    href: "/software/eset",
    iconBg: "bg-gradient-to-br from-eset-500 to-eset-700",
    iconColor: "text-white",
  },
  {
    icon: FileText,
    pill: "Sector Público",
    pillColor: "mp",
    title: "Proveedor del Estado",
    description:
      "Atendemos órdenes de compra, licitaciones y cotizaciones para organismos públicos, municipalidades y empresas del Estado.",
    cta: "Solicitar cotización pública",
    href: "/mercado-publico",
    iconBg: "bg-gradient-to-br from-[#0033A0] to-[#002677]",
    iconColor: "text-white",
  },
]

/**
 * TrustSection · Bloque oscuro con los 2 pilares institucionales.
 * Aparece antes del SiteFooter en todas las páginas.
 * Tema oscuro para máximo contraste y sensación premium.
 */
export function TrustSection(): React.JSX.Element {
  return (
    <section className="bg-slate-950 text-slate-100">
      <div className="container py-14">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-eset-400 mb-2">
            Respaldo institucional
          </p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Partners oficiales y proveedor del Estado
          </h2>
          <p className="text-slate-400 mt-3 text-sm md:text-base">
            Respaldados directamente por los fabricantes y registrados en ChileCompra para
            atender al sector público.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
          {CARDS.map((card) => {
            const Icon = card.icon
            const pillClass =
              card.pillColor === "eset"
                ? "bg-eset-500/15 text-eset-300 border-eset-500/30"
                : "bg-[#0033A0]/30 text-blue-200 border-[#0033A0]/50"
            return (
              <div
                key={card.title}
                className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 p-6 hover:border-slate-700 transition-colors"
              >
                <div
                  className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{
                    background:
                      card.pillColor === "eset"
                        ? "radial-gradient(circle, #00A88F 0%, transparent 70%)"
                        : "radial-gradient(circle, #0033A0 0%, transparent 70%)",
                  }}
                />

                <div className="relative flex items-start gap-4">
                  <div
                    className={`shrink-0 w-14 h-14 rounded-xl ${card.iconBg} ${card.iconColor} flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${pillClass}`}
                    >
                      <BadgeCheck className="h-3 w-3" />
                      {card.pill}
                    </span>
                    <h3 className="font-bold text-lg text-white mt-2">{card.title}</h3>
                    <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                      {card.description}
                    </p>
                    <Link
                      href={card.href}
                      target={card.hrefExternal ? "_blank" : undefined}
                      rel={card.hrefExternal ? "noreferrer" : undefined}
                      className="inline-flex items-center text-sm font-medium text-eset-400 hover:text-eset-300 mt-3 group/link"
                    >
                      {card.cta}
                      <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover/link:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Trust stats */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-center">
          {[
            { value: "10+", label: "Años en el mercado" },
            { value: "1.200+", label: "Clientes B2B activos" },
            { value: "24/7", label: "Entrega digital" },
            { value: "100%", label: "Licencias originales" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl md:text-3xl font-bold text-eset-400 tabular-nums">
                {stat.value}
              </p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
