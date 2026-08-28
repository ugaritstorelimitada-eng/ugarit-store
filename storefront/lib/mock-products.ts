/**
 * UGARIT · Mock products
 * Data extraída de ugarit.cl + productos ESET nuevos (partner oficial).
 * Se reemplaza por data de Medusa cuando el backend esté conectado.
 */

export type LicenseVariant = {
  /** "1 device", "3 devices", "5 devices", "10 users", etc. */
  label: string
  /** Duración en años (1, 2, 3) */
  years: number
  /** Cantidad de dispositivos/usuarios */
  devices: number
  /** Precio CLP */
  price: number
  /** Precio original (si está en oferta) */
  compareAtPrice?: number
  /** SKU único */
  sku: string
}

export type MockProduct = {
  id: string
  handle: string
  title: string
  description: string
  shortDescription: string
  price: number
  compareAtPrice?: number
  currency: "CLP"
  images: string[]
  category: string
  categories: string[]
  tags: string[]
  stock: number
  virtual: boolean
  featured?: boolean
  onSale?: boolean
  sku: string
  brand?: string
  discountPercent?: number
  /** Si el producto tiene variantes (ESET, suscripciones) */
  hasVariants?: boolean
  variants?: LicenseVariant[]
  /** Badges específicos para este producto */
  productBadges?: string[]
}

const ESET_BADGES = ["eset", "digital", "original", "warranty"] as const
const MS_BADGES = ["microsoft", "digital", "original", "warranty"] as const

export const MOCK_PRODUCTS: MockProduct[] = [
  // ─── ESET Ciberseguridad (línea nueva) ────────────────────
  {
    id: "eset-hsu",
    handle: "eset-home-security-ultimate",
    title: "ESET Home Security Ultimate",
    shortDescription: "Protección integral multidispositivo con VPN y gestor de contraseñas.",
    description:
      "ESET Home Security Ultimate ofrece la protección más avanzada de ESET para tu hogar digital. Incluye antivirus premium, anti-phishing, firewall, protección de webcam, VPN ilimitada, gestor de contraseñas y monitoreo de dark web. Compatible con Windows, macOS, Android y iOS.",
    price: 34990,
    compareAtPrice: 45990,
    currency: "CLP",
    images: ["https://ugarit.cl/wp-content/uploads/2025/11/Windows-11.png"],
    category: "eset",
    categories: ["eset", "software", "seguridad-y-vigilancia"],
    tags: ["eset", "antivirus", "ciberseguridad", "vpn"],
    stock: 9999,
    virtual: true,
    featured: true,
    onSale: true,
    sku: "ESET-HSU",
    brand: "ESET",
    discountPercent: 24,
    hasVariants: true,
    productBadges: [...ESET_BADGES],
    variants: [
      { label: "1 dispositivo / 1 año", years: 1, devices: 1, price: 24990, compareAtPrice: 34990, sku: "ESET-HSU-1D1Y" },
      { label: "3 dispositivos / 1 año", years: 1, devices: 3, price: 34990, compareAtPrice: 45990, sku: "ESET-HSU-3D1Y" },
      { label: "5 dispositivos / 1 año", years: 1, devices: 5, price: 44990, compareAtPrice: 59990, sku: "ESET-HSU-5D1Y" },
      { label: "5 dispositivos / 2 años", years: 2, devices: 5, price: 79990, compareAtPrice: 119980, sku: "ESET-HSU-5D2Y" },
    ],
  },
  {
    id: "eset-smart-security",
    handle: "eset-smart-security-premium",
    title: "ESET Smart Security Premium",
    shortDescription: "Antivirus premium con protección de identidad y ransomware.",
    description:
      "ESET Smart Security Premium combina la legendaria protección antivirus de ESET con funciones avanzadas de seguridad: anti-ransomware, protección de banca online, inspector de red y protección de cámara web.",
    price: 24990,
    compareAtPrice: 34990,
    currency: "CLP",
    images: ["https://ugarit.cl/wp-content/uploads/2025/11/Windows-11.png"],
    category: "eset",
    categories: ["eset", "software"],
    tags: ["eset", "antivirus", "ciberseguridad"],
    stock: 9999,
    virtual: true,
    onSale: true,
    sku: "ESET-SSP",
    brand: "ESET",
    discountPercent: 28,
    hasVariants: true,
    productBadges: [...ESET_BADGES],
    variants: [
      { label: "1 dispositivo / 1 año", years: 1, devices: 1, price: 17990, compareAtPrice: 24990, sku: "ESET-SSP-1D1Y" },
      { label: "3 dispositivos / 1 año", years: 1, devices: 3, price: 24990, compareAtPrice: 34990, sku: "ESET-SSP-3D1Y" },
      { label: "5 dispositivos / 1 año", years: 1, devices: 5, price: 34990, compareAtPrice: 49990, sku: "ESET-SSP-5D1Y" },
    ],
  },
  {
    id: "eset-business",
    handle: "eset-protect-business",
    title: "ESET PROTECT — Solución Empresarial",
    shortDescription: "Plataforma EDR para empresas. Protección centralizada de endpoints.",
    description:
      "ESET PROTECT es la plataforma de seguridad empresarial que combina protección de endpoints (EDR) con administración centralizada en la nube. Mínimo 5 equipos.",
    price: 89990,
    currency: "CLP",
    images: ["https://ugarit.cl/wp-content/uploads/2025/11/Windows-11.png"],
    category: "eset",
    categories: ["eset", "software"],
    tags: ["eset", "empresarial", "edr", "b2b"],
    stock: 9999,
    virtual: true,
    sku: "ESET-PROTECT",
    brand: "ESET",
    hasVariants: true,
    productBadges: [...ESET_BADGES, "b2b"],
    variants: [
      { label: "5 equipos / 1 año", years: 1, devices: 5, price: 89990, sku: "ESET-PROTECT-5E" },
      { label: "10 equipos / 1 año", years: 1, devices: 10, price: 169990, sku: "ESET-PROTECT-10E" },
      { label: "25 equipos / 1 año", years: 1, devices: 25, price: 399990, sku: "ESET-PROTECT-25E" },
      { label: "50 equipos / 1 año", years: 1, devices: 50, price: 749990, sku: "ESET-PROTECT-50E" },
    ],
  },

  // ─── Software Microsoft ───────────────────────────────────
  {
    id: "wp_27923",
    handle: "windows-11-pro-licencia-digital",
    title: "Windows 11 Pro (Licencia Digital)",
    shortDescription: "Licencia digital oficial Windows 11 Pro (64 bits).",
    description: "Windows 11 Pro con BitLocker, Hyper-V, escritorio remoto y Active Directory.",
    price: 14990,
    currency: "CLP",
    images: ["https://ugarit.cl/wp-content/uploads/2021/08/Windows-11.png"],
    category: "windows",
    categories: ["software", "windows", "ofertas"],
    tags: ["microsoft", "windows", "destacado"],
    stock: 100,
    virtual: true,
    featured: true,
    sku: "WIN11PRO-1PC",
    brand: "Microsoft",
    productBadges: [...MS_BADGES],
  },
  {
    id: "wp_28187",
    handle: "windows-10-enterprise-1pc",
    title: "Windows 10 Enterprise 1PC",
    shortDescription: "Sistema operativo empresarial con funciones avanzadas.",
    description: "Windows 10 Enterprise: funciones avanzadas de seguridad, administración y productividad.",
    price: 24990,
    compareAtPrice: 29990,
    currency: "CLP",
    images: ["https://ugarit.cl/wp-content/uploads/2025/11/Windows-365-Personal1-ano.jpg"],
    category: "windows",
    categories: ["software", "windows"],
    tags: ["microsoft", "windows", "enterprise", "b2b"],
    stock: 50,
    virtual: true,
    onSale: true,
    sku: "WIN10ENT-1PC",
    brand: "Microsoft",
    discountPercent: 17,
    productBadges: [...MS_BADGES],
  },
  {
    id: "wp_28165",
    handle: "office-2024-pro-plus-ltsc-1pc-activacion-por-telefono",
    title: "Office 2024 Pro Plus LTSC 1PC",
    shortDescription: "Suite ofimática empresarial con activación telefónica.",
    description: "Office 2024 Pro Plus LTSC: Word, Excel, PowerPoint, Outlook, Access y Publisher.",
    price: 39990,
    compareAtPrice: 49990,
    currency: "CLP",
    images: ["https://ugarit.cl/wp-content/uploads/2025/11/Windows-365-Personal1-ano.jpg"],
    category: "office",
    categories: ["software", "office"],
    tags: ["microsoft", "office", "b2b"],
    stock: 50,
    virtual: true,
    onSale: true,
    sku: "OFF2024LTSC-1PC",
    brand: "Microsoft",
    discountPercent: 20,
    productBadges: [...MS_BADGES],
  },
  {
    id: "wp_27955",
    handle: "microsoft-365-personal-1-ano-apps-premium-1tb-onedrive",
    title: "Microsoft 365 Personal | 1 Año",
    shortDescription: "Word, Excel, PowerPoint, 1TB OneDrive, Copilot IA.",
    description: "Microsoft 365 Personal para 1 usuario en hasta 5 dispositivos.",
    price: 14990,
    compareAtPrice: 22990,
    currency: "CLP",
    images: ["https://ugarit.cl/wp-content/uploads/2025/11/Windows-365-Personal1-ano.jpg"],
    category: "office",
    categories: ["software", "office", "ofertas"],
    tags: ["microsoft", "office", "oferta", "suscripcion"],
    stock: 100,
    virtual: true,
    onSale: true,
    featured: true,
    sku: "M365PERS-1Y",
    brand: "Microsoft",
    discountPercent: 35,
    productBadges: [...MS_BADGES],
  },
  {
    id: "wp_28168",
    handle: "adobe-creative-cloud-pro-3-meses-subscription-key",
    title: "Adobe Creative Cloud Pro – 3 Meses",
    shortDescription: "3 meses de acceso a 20+ apps con IA Firefly.",
    description: "Adobe Creative Cloud Pro: Photoshop, Illustrator, Premiere Pro con IA Firefly.",
    price: 29990,
    currency: "CLP",
    images: ["https://ugarit.cl/wp-content/uploads/2025/11/Windows-365-Personal1-ano.jpg"],
    category: "software",
    categories: ["software"],
    tags: ["adobe", "creative", "suscripcion"],
    stock: 30,
    virtual: true,
    sku: "ACC-PRO-3M",
    brand: "Adobe",
    productBadges: ["adobe", "digital", "original", "warranty"],
  },
  {
    id: "wp_28180",
    handle: "power-bi-premium-para-100-usuarios-durante-1-ano",
    title: "Power BI Premium 100 usuarios / 1 año",
    shortDescription: "Análisis avanzado empresarial.",
    description: "Power BI Premium 100 usuarios con funciones premium.",
    price: 1299990,
    currency: "CLP",
    images: ["https://ugarit.cl/wp-content/uploads/2025/11/Windows-365-Personal1-ano.jpg"],
    category: "software",
    categories: ["software"],
    tags: ["microsoft", "powerbi", "b2b", "enterprise"],
    stock: 10,
    virtual: true,
    sku: "PBI-PREM-100U-1Y",
    brand: "Microsoft",
    productBadges: [...MS_BADGES],
  },
  {
    id: "wp_27951",
    handle: "instalacion-de-windows-y-office-remota",
    title: "Instalación de Windows y Office Remota",
    shortDescription: "Servicio profesional remoto.",
    description: "Servicio de instalación remota. Windows, Office, drivers.",
    price: 19990,
    currency: "CLP",
    images: ["https://ugarit.cl/wp-content/uploads/2025/11/Windows-365-Personal1-ano.jpg"],
    category: "servicio-tecnico",
    categories: ["servicio-tecnico"],
    tags: ["servicio", "remoto", "destacado"],
    stock: 100,
    virtual: true,
    featured: true,
    sku: "SVC-INSTALL-REMOTE",
  },
  {
    id: "wp_27966",
    handle: "audifonos-inalambricos-airpods-pro-2a-gen-con-estuche-magsafe-usb-c-oem",
    title: "AirPods Pro (2ª Gen) MagSafe USB-C",
    shortDescription: "ANC, modo ambiente, audio espacial.",
    description: "AirPods Pro 2ª Gen OEM con ANC y estuche MagSafe USB-C.",
    price: 34990,
    currency: "CLP",
    images: ["https://ugarit.cl/wp-content/uploads/2025/11/Cargador-tipo-c-800x800.webp"],
    category: "audifonos",
    categories: ["audifonos"],
    tags: ["apple", "audifonos"],
    stock: 15,
    virtual: false,
    sku: "AIRPODS-PRO-2-OEM",
    brand: "Apple",
  },
  {
    id: "wp_27960",
    handle: "audifonos-inalambricos-tws-genericos",
    title: "Audífonos TWS Genéricos",
    shortDescription: "TWS con estuche, micrófono.",
    description: "Audífonos TWS con estuche de carga.",
    price: 7990,
    compareAtPrice: 9990,
    currency: "CLP",
    images: ["https://ugarit.cl/wp-content/uploads/2025/11/Cargador-tipo-c-800x800.webp"],
    category: "audifonos",
    categories: ["audifonos"],
    tags: ["audifonos", "tws"],
    stock: 30,
    virtual: false,
    onSale: true,
    sku: "TWS-GENERIC-GRAY",
    discountPercent: 20,
  },
  {
    id: "wp_27962",
    handle: "notebook-generico-8gb-256gb-156",
    title: "Notebook 8GB RAM, 256GB SSD, 15.6\"",
    shortDescription: "15.6\" FHD, 8GB RAM, 256GB SSD, Windows 11.",
    description: "Notebook 15.6\" FHD, Intel/AMD, 8GB RAM, 256GB SSD, Windows 11.",
    price: 299990,
    currency: "CLP",
    images: ["https://ugarit.cl/wp-content/uploads/2025/11/Windows-11.png"],
    category: "notebooks-y-pc",
    categories: ["notebooks-y-pc"],
    tags: ["notebook", "laptop"],
    stock: 5,
    virtual: false,
    sku: "NB-8GB-256GB-15.6",
  },
  {
    id: "wp_27958",
    handle: "cargador-inalambrico-smartwatch-universal",
    title: "Cargador Inalámbrico Smartwatch",
    shortDescription: "Cargador magnético universal USB-C.",
    description: "Cargador inalámbrico magnético universal.",
    price: 9990,
    compareAtPrice: 12990,
    currency: "CLP",
    images: ["https://ugarit.cl/wp-content/uploads/2025/11/Cargador-tipo-c-800x800.webp"],
    category: "cargadores",
    categories: ["cargadores", "ofertas", "relojes"],
    tags: ["cargador", "smartwatch"],
    stock: 0,
    virtual: false,
    onSale: true,
    sku: "CHRGR-SMWTCH-USB-C",
    discountPercent: 23,
  },
  {
    id: "wp_27969",
    handle: "cargador-usb-inteligente-con-cable-tipo-c-carga-rapida-y-segura",
    title: "Cargador USB-C 20W",
    shortDescription: "Cargador 20W con cable USB-C.",
    description: "Cargador USB de pared 20W con cable Tipo C.",
    price: 9990,
    compareAtPrice: 12990,
    currency: "CLP",
    images: ["https://ugarit.cl/wp-content/uploads/2025/11/Cargador-tipo-c-800x800.webp"],
    category: "cargadores",
    categories: ["cargadores", "ofertas"],
    tags: ["cargador", "usbc"],
    stock: 25,
    virtual: false,
    onSale: true,
    sku: "CHRGR-USBC-20W",
    discountPercent: 23,
  },
  {
    id: "wp_27946",
    handle: "smartwatch-s8-ultra",
    title: "SmartWatch S8 Ultra",
    shortDescription: "Pantalla HD, GPS, salud 24/7.",
    description: "SmartWatch S8 Ultra con GPS y salud 24/7.",
    price: 24990,
    compareAtPrice: 29990,
    currency: "CLP",
    images: ["https://ugarit.cl/wp-content/uploads/2025/11/SmartWatch-S8-Ultra-El-Companero-Inteligente-Definitivo.jpg"],
    category: "relojes",
    categories: ["relojes", "ofertas"],
    tags: ["smartwatch", "reloj"],
    stock: 0,
    virtual: false,
    onSale: true,
    sku: "SMW-S8-ULTRA",
    discountPercent: 17,
  },
]

// ─── Helpers ─────────────────────────────────────────────────────

export const findProductByHandle = (handle: string) =>
  MOCK_PRODUCTS.find((p) => p.handle === handle)

export const findProductsByCategory = (categorySlug: string) =>
  MOCK_PRODUCTS.filter((p) => p.categories.includes(categorySlug))

export const getRelatedProducts = (product: MockProduct, limit = 4) =>
  MOCK_PRODUCTS.filter(
    (p) => p.id !== product.id && p.categories.some((c) => product.categories.includes(c))
  ).slice(0, limit)

export const getFeaturedProducts = () =>
  MOCK_PRODUCTS.filter((p) => p.featured)

export const getOnSaleProducts = () =>
  MOCK_PRODUCTS.filter((p) => p.onSale)

export const getEsetProducts = () =>
  MOCK_PRODUCTS.filter((p) => p.brand === "ESET")

// Re-export desde shared-types (evita duplicación)
export { formatCLP } from "@ugarit/shared-types"
