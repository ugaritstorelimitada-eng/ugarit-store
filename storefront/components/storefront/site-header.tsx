import Link from "next/link"
import Image from "next/image"
import { Suspense } from "react"
import { ShoppingCart, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeaderSearch } from "@/components/storefront/header-search"
import { MegaMenu } from "@/components/storefront/mega-menu"
import { NAV, SITE } from "@/lib/constants"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top bar */}
      <div className="bg-ugarit-800 text-white text-xs">
        <div className="container flex h-9 items-center justify-between">
          <p className="hidden sm:block">
            <Link href="/tienda" className="hover:underline">
              {SITE.tagline}
            </Link>
          </p>
          <nav className="flex items-center gap-4">
            {NAV.secondary.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:underline hidden sm:inline"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main header */}
      <div className="container flex h-16 items-center gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label={`${SITE.name} - Inicio`}>
          <Image
            src="/ugarit-logo-corporate.png"
            alt={`${SITE.name} logo`}
            width={140}
            height={36}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        {/* MegaMenu — visible solo en desktop */}
        <div className="hidden md:block shrink-0">
          <MegaMenu />
        </div>

        <Suspense fallback={<div className="hidden md:flex flex-1 max-w-xl" />}>
          <HeaderSearch />
        </Suspense>

        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex">
            <Link href="/cuenta" aria-label="Mi cuenta">
              <User className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart" aria-label="Carrito">
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Sub-nav auxiliar: links de B2B + Gobierno (desktop) */}
      <nav className="hidden md:block border-t bg-muted/20">
        <div className="container flex h-9 items-center gap-6 text-sm">
          {NAV.primary.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
