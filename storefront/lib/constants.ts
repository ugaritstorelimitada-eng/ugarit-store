/**
 * UGARIT · Constantes globales
 *
 * Reposicionamiento 2026-08-27: "Tienda oficial de ciberseguridad + software en Chile".
 * Partners oficiales: ESET, Mercado Público Chile.
 */

export const SITE = {
  name: "UGARIT",
  legalName: "Importadora y Comercializadora Ugarit Limitada",
  rut: "77.316.893-8",
  tagline: "Ciberseguridad y Software para Empresas y Gobierno",
  description:
    "Tienda oficial de ESET Chile, licencias Microsoft, Adobe y más. Atendemos Mercado Público, licitaciones y órdenes de compra para organismos públicos y empresas.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://ugarit.cl",
  ogImage: "/og.jpg",
  locale: "es-CL",
  region: "CL",
  currency: "CLP",
  // Contacto
  email: "contacto@ugarit.cl",
  emailVentas: "ventas@ugarit.cl",
  emailMercadoPublico: "licitaciones@ugarit.cl",
  whatsapp: "+56957399216",
  whatsappDisplay: "+56 9 5739 9216",
  // Ubicación
  city: "Puerto Montt",
  region_label: "Región de Los Lagos",
  country: "Chile",
  // Social
  facebook: "https://www.facebook.com/ugaritstorelimitadacl",
  instagram: "https://www.instagram.com/ugaritchile/",
  twitter: "https://x.com/StoreUgarit",
  linkedin: "https://www.linkedin.com/in/ugarit-store-9b3905331/",
  // Partners y validación institucional
  partners: {
    eset: {
      tier: "Distribuidor Autorizado",
      since: 2023,
      esetUrl: "https://www.eset.com/cl/",
    },
    mercadoPublico: {
      codigo: "1700XXX-X", // REEMPLAZAR con el código real
      url: "https://www.mercadopublico.cl",
    },
  },
} as const

export const NAV = {
  primary: [
    { label: "Tienda", href: "/tienda" },
    { label: "Ciberseguridad ESET", href: "/software/eset" },
    { label: "Software", href: "/categoria/software" },
    { label: "Mercado Público", href: "/mercado-publico" },
    { label: "Servicio Técnico", href: "/servicio-tecnico" },
    { label: "Contacto", href: "/contacto" },
  ],
  secondary: [
    { label: "Preguntas frecuentes", href: "/preguntas-frecuentes" },
    { label: "Sigue tu pedido", href: "/sigue-tu-pedido" },
  ],
} as const

export const CATEGORIES = [
  { slug: "eset", label: "ESET Ciberseguridad", icon: "🛡️" },
  { slug: "software", label: "Software", icon: "💻" },
  { slug: "windows", label: "Windows", icon: "🪟" },
  { slug: "office", label: "Office", icon: "📊" },
  { slug: "seguridad-y-vigilancia", label: "Seguridad Física", icon: "📹" },
  { slug: "notebooks-y-pc", label: "Notebooks y PC", icon: "🖥️" },
  { slug: "audifonos", label: "Audífonos", icon: "🎧" },
  { slug: "relojes", label: "Relojes", icon: "⌚" },
  { slug: "cargadores", label: "Cargadores", icon: "🔌" },
  { slug: "servicio-tecnico", label: "Servicio Técnico", icon: "🛠️" },
] as const

export const PRODUCT_BADGES = {
  digital: { label: "Entrega Digital Inmediata", icon: "⚡" },
  original: { label: "Licencia 100% Original", icon: "✓" },
  warranty: { label: "Garantía de Activación", icon: "🛡️" },
  eset: { label: "ESET Oficial", icon: "🛡️" },
  microsoft: { label: "Microsoft Partner", icon: "🏢" },
  adobe: { label: "Adobe Autorizado", icon: "🎨" },
} as const

export const PAYMENT_METHODS = [
  { id: "webpay", name: "Webpay Plus", desc: "Visa, Mastercard, Redcompra" },
  { id: "mercadopago", name: "Mercado Pago", desc: "Hasta 12 cuotas" },
  { id: "transfer", name: "Transferencia", desc: "Para empresas (30 días)" },
] as const
