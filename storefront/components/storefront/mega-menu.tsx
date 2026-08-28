"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  LayoutGrid,
  ChevronDown,
  Shield,
  Laptop,
  Building2,
  Sparkles,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Tipos ──────────────────────────────────────────────────────

type AccentColor = "eset" | "blue" | "violet" | "amber"

type MenuItem = {
  readonly label: string
  readonly description: string
  readonly href: string
  readonly accent: AccentColor
}

type MenuSection = {
  readonly title: string
  readonly icon: LucideIcon
  readonly iconClass: string
  readonly items: readonly MenuItem[]
  readonly banner?: {
    readonly title: string
    readonly description: string
    readonly href: string
    readonly cta: string
  }
}

const ACCENT_HOVER: Record<AccentColor, string> = {
  eset: "group-hover:text-eset-600",
  blue: "group-hover:text-blue-600",
  violet: "group-hover:text-violet-600",
  amber: "group-hover:text-amber-600",
}

const SECTIONS: readonly MenuSection[] = [
  {
    title: "Software & Seguridad",
    icon: Shield,
    iconClass: "text-eset-600",
    items: [
      {
        label: "ESET Partner Oficial",
        description: "Antivirus, Endpoint y Servidores",
        href: "/categoria/eset",
        accent: "eset",
      },
      {
        label: "Windows 11 / 10 Pro",
        description: "Licencias OEM, Retail y Enterprise",
        href: "/categoria/windows",
        accent: "blue",
      },
      {
        label: "Microsoft Office",
        description: "Hogar, Empresas y suscripciones M365",
        href: "/categoria/office",
        accent: "blue",
      },
      {
        label: "Adobe & Creatividad",
        description: "Creative Cloud, Photoshop, Premiere",
        href: "/categoria/software",
        accent: "violet",
      },
    ],
  },
  {
    title: "Hardware & Equipos",
    icon: Laptop,
    iconClass: "text-blue-600",
    items: [
      {
        label: "Notebooks y PC",
        description: "Equipos corporativos y de estudio",
        href: "/categoria/notebooks-y-pc",
        accent: "blue",
      },
      {
        label: "Cámaras y Seguridad Física",
        description: "Vigilancia, DVR, NVR, kits de instalación",
        href: "/categoria/seguridad-y-vigilancia",
        accent: "amber",
      },
      {
        label: "Audífonos & Wearables",
        description: "AirPods, TWS, Smartwatch, cargadores",
        href: "/categoria/audifonos",
        accent: "amber",
      },
    ],
    banner: {
      title: "Convenio Mercado Público",
      description:
        "Cotizaciones directas y compras del Estado con RUT, para organismos y municipalidades.",
      href: "/mercado-publico",
      cta: "Ir al portal B2B →",
    },
  },
]

/**
 * MegaMenu · Menú flotante desplegable en el Header.
 *
 * Comportamiento:
 * - Abre con hover (desktop) o click (touch)
 * - Cierra con click fuera, Escape, o al salir del panel
 * - Accesible: aria-expanded, aria-haspopup, navegación por teclado
 *
 * Layout: 2 columnas con items tipados + banner destacado de Mercado Público.
 */
export function MegaMenu(): React.JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const close = useCallback((): void => setIsOpen(false), [])
  const toggle = useCallback((): void => setIsOpen((v) => !v), [])

  /**
   * Hover handlers con puente invisible:
   * - onMouseEnter: cancela cualquier cierre pendiente y abre
   * - onMouseLeave: programa el cierre con 150ms de delay
   *   para dar tiempo a que el cursor atraviese el "puente" invisible
   *   entre el botón y el panel (pt-2 del contenedor absoluto).
   */
  const handleMouseEnter = (): void => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setIsOpen(true)
  }

  const handleMouseLeave = (): void => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false)
      closeTimeoutRef.current = null
    }, 150)
  }

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    }
  }, [])

  // Click outside para cerrar (inmediato, sin delay)
  useEffect(() => {
    if (!isOpen) return
    function onPointerDown(e: MouseEvent): void {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
        close()
      }
    }
    document.addEventListener("mousedown", onPointerDown)
    return () => document.removeEventListener("mousedown", onPointerDown)
  }, [isOpen, close])

  // Escape para cerrar (inmediato)
  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent): void {
      if (e.key === "Escape") {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
        close()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [isOpen, close])

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={toggle}
        className={cn(
          "flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors",
          isOpen
            ? "bg-slate-200 text-slate-900"
            : "bg-slate-100 text-slate-800 hover:bg-slate-200"
        )}
      >
        <LayoutGrid className="h-4 w-4 text-slate-600" />
        <span>Todas las Categorías</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-slate-500 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen ? (
        /*
         * Puente invisible: el contenedor absoluto con pt-2 crea un área
         * interactiva invisible de 8px entre el botón y la tarjeta blanca.
         * Cuando el cursor cruza ese "puente", el hover se mantiene en el
         * contenedor padre → el menú NO se cierra.
         */
        <div
          role="menu"
          aria-label="Todas las categorías"
          className="absolute left-0 top-full z-50 pt-2"
        >
          <div className="w-[600px] rounded-xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/10">
          <div className="grid grid-cols-2 gap-6">
            {SECTIONS.map((section) => {
              const SectionIcon = section.icon
              return (
                <div key={section.title} className="space-y-3">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <SectionIcon className={cn("h-3.5 w-3.5", section.iconClass)} />
                    {section.title}
                  </span>
                  <ul className="space-y-0.5">
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={close}
                          className="group flex flex-col rounded-md px-2 py-1.5 hover:bg-slate-50 transition-colors"
                        >
                          <span
                            className={cn(
                              "text-xs font-semibold text-slate-900 transition-colors",
                              ACCENT_HOVER[item.accent]
                            )}
                          >
                            {item.label}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {item.description}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {section.banner ? (
                    <Link
                      href={section.banner.href}
                      onClick={close}
                      className="mt-3 block rounded-lg border border-blue-100 bg-gradient-to-br from-blue-50 to-sky-50 p-3 hover:border-blue-300 transition-colors"
                    >
                      <span className="flex items-center gap-1 text-[11px] font-bold text-blue-800 uppercase tracking-wider">
                        <Building2 className="h-3.5 w-3.5" />
                        {section.banner.title}
                      </span>
                      <p className="mt-1.5 text-[11px] text-blue-700 leading-snug">
                        {section.banner.description}
                      </p>
                      <span className="mt-2 inline-block text-[11px] font-bold text-blue-900 group-hover:underline">
                        {section.banner.cta}
                      </span>
                    </Link>
                  ) : null}
                </div>
              )
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
            <Link
              href="/tienda"
              onClick={close}
              className="inline-flex items-center gap-1 text-xs font-semibold text-eset-700 hover:text-eset-800"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Ver toda la tienda
            </Link>
            <Link
              href="/mercado-publico"
              onClick={close}
              className="text-xs font-semibold text-blue-700 hover:text-blue-800"
            >
              ¿Compras para el Estado? →
            </Link>
          </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
