import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import { SITE } from "@/lib/constants"
import { RetailHeader } from "@/components/storefront/retail-header"
import { SiteFooter } from "@/components/storefront/site-footer"
import { TrustSection } from "@/components/storefront/trust-section"
import { Providers } from "@/components/storefront/providers"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} · ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "tecnología",
    "software",
    "Chile",
    "Windows",
    "Office",
    "Adobe",
    "Puerto Montt",
    "tienda online",
  ],
  authors: [{ name: SITE.legalName }],
  creator: SITE.name,
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} · ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.tagline,
    creator: "@StoreUgarit",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es-CL" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <Providers>
          <RetailHeader />
          <main className="flex-1">{children}</main>
          <TrustSection />
          <SiteFooter />
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  )
}
