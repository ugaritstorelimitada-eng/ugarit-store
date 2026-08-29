"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ShieldCheck, ArrowRight, Zap, Building2 } from "lucide-react"

interface Slide {
  id: number
  tag: string
  titleLine1: string
  titleHighlight: string
  description: string
  ctaText: string
  ctaLink: string
  badgeBg: string
  badgeText: string
  accentColor: string
  btnBg: string
  imageMockup: string
}

const SLIDES: Slide[] = [
  {
    id: 1,
    tag: "PARTNER AUTORIZADO ESET CHILE",
    titleLine1: "Ciberseguridad Total",
    titleHighlight: "Hasta 35% de Descuento",
    description:
      "Protección integral para endpoints, servidores y dispositivos móviles. Entrega de claves 100% digital y automática 24/7.",
    ctaText: "Ver Catálogo ESET",
    ctaLink: "/categoria/eset",
    badgeBg: "bg-emerald-50 border-emerald-200",
    badgeText: "text-emerald-700",
    accentColor: "text-emerald-600",
    btnBg: "bg-emerald-600 hover:bg-emerald-700 text-white",
    imageMockup: "/assets/banners/eset-box-mockup.webp",
  },
  {
    id: 2,
    tag: "LICENCIAMIENTO ORIGINAL & FACTURA INMEDIATA",
    titleLine1: "Windows 11 Pro & Office",
    titleHighlight: "Entrega Digital en Segundos",
    description:
      "Licencias legítimas listas para auditorías corporativas. Emisión automática de Boleta o Factura con RUT para empresas.",
    ctaText: "Explorar Software",
    ctaLink: "/categoria/software",
    badgeBg: "bg-blue-50 border-blue-200",
    badgeText: "text-blue-700",
    accentColor: "text-blue-600",
    btnBg: "bg-blue-600 hover:bg-blue-700 text-white",
    imageMockup: "/assets/banners/microsoft-bundle-mockup.webp",
  },
  {
    id: 3,
    tag: "CONVENIO ESTADO & B2B",
    titleLine1: "Proveedor Oficial en",
    titleHighlight: "Mercado Público Chile",
    description:
      "Atendemos compras ágiles, órdenes de compra y licitaciones del sector público. Cotizaciones formales en PDF al instante.",
    ctaText: "Portal Institucional",
    ctaLink: "/mercado-publico",
    badgeBg: "bg-indigo-50 border-indigo-200",
    badgeText: "text-indigo-700",
    accentColor: "text-indigo-600",
    btnBg: "bg-slate-900 hover:bg-slate-800 text-white",
    imageMockup: "/assets/banners/mercado-publico-mockup.webp",
  },
]

export function HeroBannerSlider() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length)
    }, 6500)
    return () => clearInterval(timer)
  }, [])

  const slide = SLIDES[current]

  return (
    <section className="container mx-auto px-4 pt-4 pb-2">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-r from-slate-50 via-white to-slate-100 shadow-sm min-h-[380px] md:min-h-[420px] flex items-center">
        {/* Contenido Textual / Oferta */}
        <div className="relative z-10 max-w-xl p-8 md:p-12">
          {/* Badge de Oferta / Marca */}
          <div className="inline-flex items-center gap-2">
            <span
              className={`rounded-full border px-3.5 py-1 text-[11px] font-extrabold tracking-wider ${slide.badgeBg} ${slide.badgeText}`}
            >
              {slide.tag}
            </span>
          </div>

          {/* Título Principal */}
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl leading-[1.1]">
            {slide.titleLine1}
            <br />
            <span className={slide.accentColor}>{slide.titleHighlight}</span>
          </h1>

          {/* Bajada Comercial */}
          <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg">
            {slide.description}
          </p>

          {/* CTAs */}
          <div className="mt-7 flex flex-wrap items-center gap-3.5">
            <Link
              href={slide.ctaLink}
              className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95 ${slide.btnBg}`}
            >
              <span>{slide.ctaText}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/cotizador"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-5 py-3 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Building2 className="h-4 w-4 text-slate-500" />
              <span>Cotización B2B (PDF)</span>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              Licencias originales
            </span>
            <span className="flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              Entrega en segundos
            </span>
          </div>
        </div>

        {/* Zona Visual / Render de Producto (Derecha) */}
        <div className="absolute right-0 top-0 bottom-0 hidden w-5/12 items-center justify-center p-8 lg:flex pointer-events-none">
          <div className="relative flex h-72 w-72 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-200/60 via-slate-100/40 to-transparent">
            <img
              src={slide.imageMockup}
              alt={slide.titleLine1}
              className="max-h-64 object-contain drop-shadow-2xl transition-all duration-500"
              onError={(e) => {
                e.currentTarget.style.display = "none"
              }}
            />
          </div>
        </div>

        {/* Flechas de Navegación */}
        <button
          onClick={() => setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1))}
          className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-xs hover:bg-white hover:scale-105 transition-all"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => setCurrent((prev) => (prev + 1) % SLIDES.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-xs hover:bg-white hover:scale-105 transition-all"
          aria-label="Siguiente"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Indicadores / Bullets de posición */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              aria-label={`Ir al slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                current === idx ? "w-6 bg-slate-900" : "w-2 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
