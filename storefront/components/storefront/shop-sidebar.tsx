"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Shield,
  Server,
  FileText,
  Laptop,
  Camera,
  Cable,
  Sparkles,
  Wrench,
  Package,
} from "lucide-react"
import { MOCK_PRODUCTS } from "@/lib/mock-products"
import { cn } from "@/lib/utils"

const ICONS = {
  eset: Shield,
  windows: Server,
  office: FileText,
  notebooks: Laptop,
  seguridad: Camera,
  accesorios: Cable,
  servicio: Wrench,
  audio: Package,
}

type Group = {
  title: string
  items: { slug: string; label: string; icon: keyof typeof ICONS; count?: number; badge?: string }[]
}

const GROUPS: Group[] = [
  {
    title: "Software & Seguridad",
    items: [
      { slug: "eset", label: "ESET Ciberseguridad", icon: "eset", badge: "Oficial" },
      { slug: "windows", label: "Sistemas Operativos", icon: "windows" },
      { slug: "office", label: "Productividad y Office", icon: "office" },
      { slug: "software", label: "Ver todo Software", icon: "audio" },
    ],
  },
  {
    title: "Equipamiento & Hardware",
    items: [
      { slug: "notebooks-y-pc", label: "Notebooks y Computadores", icon: "notebooks" },
      { slug: "seguridad-y-vigilancia", label: "Cámaras y Seguridad Física", icon: "seguridad" },
      { slug: "audifonos", label: "Audífonos", icon: "audio" },
      { slug: "cargadores", label: "Accesorios y Periféricos", icon: "accesorios" },
    ],
  },
  {
    title: "Servicios",
    items: [
      { slug: "servicio-tecnico", label: "Servicio Técnico", icon: "servicio" },
    ],
  },
]

function countByCategory(slug: string): number {
  return MOCK_PRODUCTS.filter((p) => p.categories.includes(slug)).length
}

export function ShopSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeCat = searchParams.get("cat") ?? ""
  const activeQ = searchParams.get("q") ?? ""
  const facturaInmediata = searchParams.get("factura") === "1"
  const convenioMP = searchParams.get("convenio") === "1"

  const buildHref = (overrides: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(overrides).forEach(([k, v]) => {
      if (v === null) params.delete(k)
      else params.set(k, v)
    })
    const qs = params.toString()
    return `/tienda${qs ? `?${qs}` : ""}`
  }

  const handleFilterChange = (key: string, checked: boolean) => {
    router.push(buildHref({ [key]: checked ? "1" : null }))
  }

  return (
    <aside className="bg-card border border-slate-200 rounded-xl p-5 space-y-6">
      {GROUPS.map((group) => (
        <div key={group.title}>
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
            {group.title}
          </h4>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const Icon = ICONS[item.icon]
              const count = countByCategory(item.slug)
              const isActive = activeCat === item.slug
              return (
                <li key={item.slug}>
                  <Link
                    href={buildHref({ cat: item.slug })}
                    className={cn(
                      "flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all",
                      "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                      isActive && "bg-sky-50 text-sky-700 font-semibold"
                    )}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </span>
                    {item.badge ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                        {item.badge}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 tabular-nums">{count}</span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}

      {/* B2B Filters */}
      <div className="border-t border-slate-200 pt-5">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
          <Sparkles className="h-3 w-3" />
          Filtros B2B / Gobierno
        </h4>
        <div className="space-y-2.5">
          <label className="flex items-start gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={facturaInmediata}
              onChange={(e) => handleFilterChange("factura", e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-eset-500 focus:ring-eset-500"
            />
            <span className="text-sm text-slate-700 group-hover:text-slate-900">
              Disponible para <strong>Factura Inmediata</strong>
            </span>
          </label>
          <label className="flex items-start gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={convenioMP}
              onChange={(e) => handleFilterChange("convenio", e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-eset-500 focus:ring-eset-500"
            />
            <span className="text-sm text-slate-700 group-hover:text-slate-900">
              <strong>Convenio Mercado Público</strong> (proveedor del Estado)
            </span>
          </label>
        </div>
      </div>

      {/* Reset filters */}
      {(activeCat || activeQ || facturaInmediata || convenioMP) && (
        <Link
          href="/tienda"
          className="block text-center text-xs text-muted-foreground hover:text-eset-700 underline pt-2 border-t border-slate-200"
        >
          Limpiar todos los filtros
        </Link>
      )}
    </aside>
  )
}
