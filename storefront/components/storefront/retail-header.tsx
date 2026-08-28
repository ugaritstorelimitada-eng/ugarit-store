"use client"

import Link from "next/link"
import Image from "next/image"
import { Suspense } from "react"
import {
  ShoppingBag,
  User,
  Building2,
  Zap,
  HelpCircle,
  FileText,
  Shield,
  type LucideIcon,
} from "lucide-react"
import { MegaMenu } from "@/components/storefront/mega-menu"
import { HeaderSearch } from "@/components/storefront/header-search"
import { useCart } from "@/lib/cart-store"
import { SITE } from "@/lib/constants"

type QuickLink = {
  readonly label: string
  readonly href: string
  readonly icon?: LucideIcon
  readonly accent?: "eset" | "blue" | "slate"
}

const QUICK_LINKS: readonly QuickLink[] = [
  { label: "ESET Ciberseguridad", href: "/categoria/eset", icon: Shield, accent: "eset" },
  { label: "Sistemas Operativos", href: "/categoria/windows" },
  { label: "Microsoft Office", href: "/categoria/office" },
  { label: "Equipos & Notebooks", href: "/categoria/notebooks-y-pc" },
]

/**
 * RetailHeader · Header retail profesional de 3 capas.
 *
 *  Capa 1 (Top utility): Bar oscuro con entrega 24/7 + links B2B/Gobierno
 *  Capa 2 (Main nav):    Logo + MegaMenu + Buscador grande + Auth/Cart
 *  Capa 3 (Quick links): Pills de categorías rápidas
 *
 * Tipado estricto, sin emojis (Lucide icons).
 */
export function RetailHeader(): React.JSX.Element {
  const cartCount = useCart((s) => s.totalItems())

  return (
    <header className="w-full border-b border-slate-200 bg-white sticky top-0 z-50">
      {/* ── Capa 1 · Top Utility Bar (B2B & Soporte) ── */}
      <div className="bg-slate-900 text-slate-300 text-xs">
        <div className="container mx-auto px-4 py-1.5 flex justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-eset-400 font-medium">
            <Zap className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              Entrega digital automática <span className="font-bold">24/7</span> en segundos
            </span>
            <span className="sm:hidden">Entrega 24/7</span>
          </div>
          <nav className="flex items-center gap-5">
            <Link
              href="/contacto?asunto=empresa"
              className="hover:text-white flex items-center gap-1.5 font-semibold text-blue-300"
            >
              <Building2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Venta Empresas & Facturación</span>
              <span className="sm:hidden">Empresas</span>
            </Link>
            <Link
              href="/mercado-publico"
              className="hover:text-white font-semibold text-slate-100"
            >
              Mercado Público
            </Link>
            <Link
              href="/preguntas-frecuentes"
              className="hover:text-white flex items-center gap-1.5"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Centro de Ayuda</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* ── Capa 2 · Main Navigation Bar ── */}
      <div className="container mx-auto px-4 py-3.5 flex items-center gap-5">
        {/* Logo */}
        <Link
          href="/"
          className="shrink-0"
          aria-label={`${SITE.name} - Inicio`}
        >
          <Image
            src="/ugarit-logo-corporate.png"
            alt={`${SITE.name} logo`}
            width={140}
            height={36}
            priority
            className="h-9 w-auto"
          />
        </Link>

        {/* MegaMenu */}
        <div className="hidden md:block shrink-0">
          <MegaMenu />
        </div>

        {/* Search de gran cobertura */}
        <Suspense
          fallback={
            <div className="hidden md:block flex-1 h-10 rounded-full bg-slate-100 animate-pulse" />
          }
        >
          <HeaderSearch />
        </Suspense>

        {/* Acciones de usuario — bloque v7b con peso visual retail */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Iniciar Sesión — pastilla con borde + icono en caja azul */}
          <Link
            href="/cuenta"
            className="hidden sm:flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 px-3 py-2 text-slate-700 transition-all hover:border-slate-300 hover:bg-white hover:shadow-sm"
            aria-label="Iniciar sesión"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <User className="h-4.5 w-4.5" strokeWidth={2.2} />
            </div>
            <div className="text-left leading-tight">
              <span className="block text-[10px] font-medium leading-none text-slate-400">
                Mi Cuenta
              </span>
              <span className="text-xs font-bold leading-tight text-slate-900">
                Iniciar sesión
              </span>
            </div>
          </Link>

          {/* Iniciar Sesión — solo icono en móvil */}
          <Link
            href="/cuenta"
            aria-label="Iniciar sesión"
            className="sm:hidden flex items-center justify-center h-10 w-10 rounded-lg border border-slate-200/80 bg-slate-50/60 text-slate-700 transition-all hover:bg-white"
          >
            <User className="h-5 w-5" strokeWidth={2.2} />
          </Link>

          {/* Carrito — pastilla con badge emerald prominente */}
          <Link
            href="/cart"
            className="hidden sm:flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 px-3 py-2 text-slate-700 transition-all hover:border-slate-300 hover:bg-white hover:shadow-sm relative"
            aria-label={`Carrito con ${cartCount} ${cartCount === 1 ? "producto" : "productos"}`}
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <ShoppingBag className="h-4.5 w-4.5" strokeWidth={2.2} />
              <span
                className={`absolute -right-2 -top-1.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-extrabold text-white shadow-sm ring-2 ring-white ${
                  cartCount > 0 ? "bg-emerald-600" : "bg-slate-400"
                }`}
              >
                {cartCount}
              </span>
            </div>
            <div className="text-left leading-tight">
              <span className="block text-[10px] font-medium leading-none text-slate-400">
                Total $0
              </span>
              <span className="text-xs font-bold leading-tight text-slate-900">
                Carrito
              </span>
            </div>
          </Link>

          {/* Carrito — solo icono en móvil con badge prominente */}
          <Link
            href="/cart"
            aria-label={`Carrito con ${cartCount} ${cartCount === 1 ? "producto" : "productos"}`}
            className="sm:hidden relative flex items-center justify-center h-10 w-10 rounded-lg border border-slate-200/80 bg-slate-50/60 text-slate-700 transition-all hover:bg-white"
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={2.2} />
            <span
              className={`absolute -right-1 -top-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-extrabold text-white shadow-sm ring-2 ring-white ${
                cartCount > 0 ? "bg-emerald-600" : "bg-slate-400"
              }`}
            >
              {cartCount}
            </span>
          </Link>
        </div>
      </div>

      {/* ── Capa 3 · Quick Links Bar (categorías rápidas) ── */}
      <div className="border-t border-slate-100 bg-slate-50/60">
        <div className="container mx-auto px-4 py-2 flex items-center gap-6 text-xs font-semibold text-slate-600">
          {QUICK_LINKS.map((link) => {
            const Icon = link.icon
            const colorClass =
              link.accent === "eset"
                ? "text-eset-700 hover:text-eset-800"
                : "hover:text-eset-700"
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 transition-colors ${colorClass}`}
              >
                {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
                {link.label}
              </Link>
            )
          })}
          <Link
            href="/contacto?asunto=cotizacion"
            className="ml-auto flex items-center gap-1.5 text-blue-700 hover:text-blue-800 transition-colors"
          >
            <FileText className="h-3.5 w-3.5" />
            Cotizador Rápido PDF →
          </Link>
        </div>
      </div>
    </header>
  )
}
