import type { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

/**
 * UGARIT · Seed inicial
 * Carga categorías, marcas y los 14 productos del catálogo actual de ugarit.cl.
 *
 * Uso: pnpm --filter @ugarit/medusa seed
 *
 * Pre-requisito: haber corrido `medusa db:migrate` antes.
 *
 * TODO Fase 1: Validar contra API actual de Medusa 2.19 (algunos métodos cambiaron de nombre).
 * Por ahora se compila con @ts-ignore en las llamadas a módulos.
 */

type SeedProduct = {
  title: string
  handle: string
  description: string
  category: string
  price: number // CLP
  compareAtPrice?: number
  virtual?: boolean
  stock?: number
  images: string[]
  tags: string[]
}

const CATEGORIES = [
  // Top-level
  { name: "Software", handle: "software" },
  { name: "Ofertas", handle: "ofertas" },
  { name: "Audífonos", handle: "audifonos" },
  { name: "Cargadores", handle: "cargadores" },
  { name: "Notebooks y PC", handle: "notebooks-y-pc" },
  { name: "Relojes", handle: "relojes" },
  { name: "Seguridad y Vigilancia", handle: "seguridad-y-vigilancia" },
  { name: "Mouse", handle: "mouse" },
  { name: "Teclados", handle: "teclados" },
  { name: "Webcams", handle: "webcams" },
  { name: "Servicio Técnico", handle: "servicio-tecnico" },
  // Hijas
  { name: "Windows", handle: "windows", parent: "software" },
  { name: "Office", handle: "office", parent: "software" },
  { name: "Antivirus", handle: "antivirus", parent: "software" },
  { name: "Cámaras", handle: "camaras", parent: "seguridad-y-vigilancia" },
  { name: "Kits de Instalación", handle: "kits-de-instalacion", parent: "seguridad-y-vigilancia" },
] as const

const PRODUCTS: SeedProduct[] = [
  // Software
  {
    title: "Windows 11 Pro (Licencia Digital)",
    handle: "windows-11-pro-licencia-digital",
    description: "Licencia digital oficial de Windows 11 Pro (64 bits). Activación permanente. Entrega inmediata por email.",
    category: "windows",
    price: 14990,
    virtual: true,
    stock: 100,
    images: ["https://ugarit.cl/wp-content/uploads/2021/08/Windows-11.png"],
    tags: ["microsoft", "windows", "destacado"],
  },
  {
    title: "Windows 10 Enterprise 1PC",
    handle: "windows-10-enterprise-1pc",
    description: "Windows 10 Enterprise: sistema operativo empresarial con funciones avanzadas de seguridad, administración y productividad para organizaciones.",
    category: "windows",
    price: 24990,
    virtual: true,
    stock: 50,
    images: ["https://ugarit.cl/wp-content/uploads/2025/11/Windows-365-Personal1-ano.jpg"],
    tags: ["microsoft", "windows", "enterprise", "b2b"],
  },
  {
    title: "Office 2024 Pro Plus LTSC 1PC [Activación por teléfono]",
    handle: "office-2024-pro-plus-ltsc-1pc-activacion-por-telefono",
    description: "Office 2024 Professional Plus LTSC. Versión más reciente para empresas que priorizan estabilidad. Activación telefónica segura.",
    category: "office",
    price: 39990,
    virtual: true,
    stock: 50,
    images: ["https://ugarit.cl/wp-content/uploads/2025/11/Windows-365-Personal1-ano.jpg"],
    tags: ["microsoft", "office", "b2b"],
  },
  {
    title: "Microsoft 365 Personal | 1 Año, Apps Premium",
    handle: "microsoft-365-personal-1-ano-apps-premium-1tb-onedrive",
    description: "Suscripción anual Microsoft 365 Personal. Word, Excel, PowerPoint, 1TB OneDrive, Copilot IA. Hasta 5 dispositivos.",
    category: "office",
    price: 14990,
    compareAtPrice: 22990,
    virtual: true,
    stock: 100,
    images: ["https://ugarit.cl/wp-content/uploads/2025/11/Windows-365-Personal1-ano.jpg"],
    tags: ["microsoft", "office", "oferta", "suscripcion"],
  },
  {
    title: "Adobe Creative Cloud Pro - 3 Meses Subscription Key",
    handle: "adobe-creative-cloud-pro-3-meses-subscription-key",
    description: "Adobe Creative Cloud Pro: 3 meses de acceso a más de 20 apps premium (Photoshop, Illustrator, Premiere Pro, etc.) con IA Firefly.",
    category: "software",
    price: 29990,
    virtual: true,
    stock: 30,
    images: ["https://ugarit.cl/wp-content/uploads/2025/11/Windows-365-Personal1-ano.jpg"],
    tags: ["adobe", "creative", "suscripcion"],
  },
  {
    title: "Adobe Creative Cloud Pro + 1 Mes Subscription Key",
    handle: "adobe-creative-cloud-pro-1-mes-subscription-key",
    description: "Adobe Creative Cloud Pro 1 mes. Acceso completo a la suite creativa de Adobe con funciones IA.",
    category: "software",
    price: 12990,
    virtual: true,
    stock: 30,
    images: ["https://ugarit.cl/wp-content/uploads/2025/11/Windows-365-Personal1-ano.jpg"],
    tags: ["adobe", "creative", "suscripcion"],
  },
  {
    title: "Power BI Premium para 100 usuarios durante 1 año",
    handle: "power-bi-premium-para-100-usuarios-durante-1-ano",
    description: "Power BI Premium 100 usuarios: análisis avanzado, visualizaciones interactivas, colaboración empresarial de alto rendimiento.",
    category: "software",
    price: 1299990,
    virtual: true,
    stock: 10,
    images: ["https://ugarit.cl/wp-content/uploads/2025/11/Windows-365-Personal1-ano.jpg"],
    tags: ["microsoft", "powerbi", "b2b", "enterprise"],
  },
  {
    title: "Instalación de Windows y Office Remota",
    handle: "instalacion-de-windows-y-office-remota",
    description: "Servicio de instalación remota profesional. Windows + Office + drivers, con configuración inicial y soporte post-instalación.",
    category: "servicio-tecnico",
    price: 19990,
    virtual: true,
    stock: 100,
    images: ["https://ugarit.cl/wp-content/uploads/2025/11/Windows-365-Personal1-ano.jpg"],
    tags: ["servicio", "remoto", "destacado"],
  },
  {
    title: "Audífonos Inalámbricos AirPods Pro (2ª Gen) con Estuche MagSafe USB-C (OEM)",
    handle: "audifonos-inalambricos-airpods-pro-2a-gen-con-estuche-magsafe-usb-c-oem",
    description: "AirPods Pro 2ª Gen OEM con cancelación activa de ruido, modo ambiente adaptativo, audio espacial y estuche MagSafe USB-C.",
    category: "audifonos",
    price: 34990,
    stock: 15,
    images: ["https://ugarit.cl/wp-content/uploads/2025/11/Cargador-tipo-c-800x800.webp"],
    tags: ["apple", "audifonos", "inalambricos"],
  },
  {
    title: "Audífonos Inalámbricos TWS Genéricos",
    handle: "audifonos-inalambricos-tws-genericos",
    description: "Audífonos TWS genéricos con estuche de carga, micrófono integrado, control táctil y Bluetooth universal.",
    category: "audifonos",
    price: 7990,
    stock: 30,
    images: ["https://ugarit.cl/wp-content/uploads/2025/11/Cargador-tipo-c-800x800.webp"],
    tags: ["audifonos", "genericos", "tws"],
  },
  {
    title: "Notebook Genérico 8GB RAM, 256GB SSD, 15.6\"",
    handle: "notebook-generico-8gb-256gb-156",
    description: "Notebook 15.6\" Full HD, Intel/AMD, 8GB RAM, 256GB SSD, Windows 11 preinstalado. Ideal para estudio y oficina.",
    category: "notebooks-y-pc",
    price: 299990,
    stock: 5,
    images: ["https://ugarit.cl/wp-content/uploads/2025/11/Windows-11.png"],
    tags: ["notebook", "laptop", "estudio"],
  },
  {
    title: "Cargador Inalámbrico Smartwatch Universal",
    handle: "cargador-inalambrico-smartwatch-universal",
    description: "Cargador inalámbrico magnético universal para smartwatch. USB-C, diseño compacto, compatible con la mayoría de marcas.",
    category: "cargadores",
    price: 9990,
    compareAtPrice: 12990,
    stock: 0,
    images: ["https://ugarit.cl/wp-content/uploads/2025/11/Cargador-tipo-c-800x800.webp"],
    tags: ["cargador", "smartwatch", "oferta"],
  },
  {
    title: "Cargador USB Inteligente con Cable Tipo C: Carga Rápida y Segura",
    handle: "cargador-usb-inteligente-con-cable-tipo-c-carga-rapida-y-segura",
    description: "Cargador USB de pared inteligente 20W con cable Tipo C. Carga rápida con protección múltiple. Compatible universal.",
    category: "cargadores",
    price: 9990,
    compareAtPrice: 12990,
    stock: 25,
    images: ["https://ugarit.cl/wp-content/uploads/2025/11/Cargador-tipo-c-800x800.webp"],
    tags: ["cargador", "usbc", "oferta"],
  },
  {
    title: "SmartWatch S8 Ultra",
    handle: "smartwatch-s8-ultra",
    description: "SmartWatch S8 Ultra: pantalla de alta resolución, GPS, monitoreo de salud 24/7, llamadas Bluetooth, resistente al agua.",
    category: "relojes",
    price: 24990,
    compareAtPrice: 29990,
    stock: 0,
    images: ["https://ugarit.cl/wp-content/uploads/2025/11/SmartWatch-S8-Ultra-El-Companero-Inteligente-Definitivo.jpg"],
    tags: ["smartwatch", "reloj", "oferta"],
  },
]

export default async function seed({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  // @ts-ignore - módulos del container
  const productModule = container.resolve(Modules.PRODUCT)
  // @ts-ignore
  const inventoryModule = container.resolve(Modules.INVENTORY)
  // @ts-ignore
  const salesChannelModule = container.resolve(Modules.SALES_CHANNEL)
  // @ts-ignore
  const pricingModule = container.resolve(Modules.PRICING)

  logger.info("🟦 UGARIT · Iniciando seed...")

  // 1) Categorías (en 2 pasadas: padres primero, luego hijas)
  logger.info("→ Creando categorías...")
  const categoryMap = new Map<string, string>()

  // 1a) Categorías top-level (sin parent)
  for (const cat of CATEGORIES.filter((c) => !("parent" in c))) {
    const [created] = await productModule.createProductCategories([
      { name: cat.name, handle: cat.handle, is_active: true },
    ])
    categoryMap.set(cat.handle, created.id)
  }

  // 1b) Subcategorías (con parent)
  for (const cat of CATEGORIES.filter((c) => "parent" in c)) {
    const parentId = categoryMap.get((cat as any).parent)
    const [created] = await productModule.createProductCategories([
      {
        name: cat.name,
        handle: cat.handle,
        is_active: true,
        ...(parentId ? { parent_category_id: parentId } : {}),
      },
    ])
    categoryMap.set(cat.handle, created.id)
  }
  logger.info(`  ✓ ${CATEGORIES.length} categorías`)

  // 2) Stock location
  logger.info("→ Creando ubicación de inventario...")
  const [stockLocation] = await inventoryModule.createStockLocation([
    { name: "UGARIT Puerto Montt" },
  ])

  // 3) Sales channel (buscar o crear el default)
  logger.info("→ Asegurando sales channel 'Default'...")
  const salesChannels = await salesChannelModule.listSalesChannels({})
  const salesChannelId =
    salesChannels && salesChannels.length > 0
      ? salesChannels[0]!.id
      : (
          await salesChannelModule.createSalesChannels([
            { name: "Default Sales Channel" },
          ])
        )[0]!.id

  // 4) Productos
  logger.info(`→ Creando ${PRODUCTS.length} productos...`)
  for (const p of PRODUCTS) {
    const categoryId = categoryMap.get(p.category)

    // Crear inventory item (solo si es producto físico)
    let inventoryItemId: string | undefined
    if (!p.virtual) {
      const [invItem] = await inventoryModule.createInventoryItems([
        { sku: p.handle.toUpperCase().slice(0, 32) },
      ])
      inventoryItemId = invItem.id

      // Crear nivel de inventario (asociar item a location)
      await inventoryModule.createInventoryLevels([
        {
          inventory_item_id: inventoryItemId,
          location_id: stockLocation.id,
          stocked_quantity: p.stock ?? 0,
        },
      ])
    }

    // Crear producto (sin precios en variantes, se agregan después)
    const [created] = await productModule.createProducts([
      {
        title: p.title,
        handle: p.handle,
        description: p.description,
        status: "published",
        is_giftcard: false,
        discountable: true,
        category_ids: categoryId ? [categoryId] : [],
        tags: p.tags.map((t) => ({ value: t })),
        images: p.images.map((url) => ({ url })),
        sales_channels: [{ id: salesChannelId }],
        variants: [
          {
            title: "Default",
            sku: p.handle.toUpperCase().slice(0, 32),
            manage_inventory: !p.virtual,
            ...(inventoryItemId
              ? { inventory_items: [{ inventory_item_id: inventoryItemId }] }
              : {}),
            ...(p.compareAtPrice
              ? {
                  metadata: {
                    compare_at_price: String(p.compareAtPrice),
                  },
                }
              : {}),
          },
        ],
      },
    ])

    // Asignar precio CLP a la variante
    const variant = created.variants?.[0]
    if (variant) {
      await pricingModule.createPrices([
        {
          price_set_id: variant.price_set?.id ?? "",
          amount: p.price,
          currency_code: "clp",
        },
      ])
    }

    logger.info(`  ✓ ${created.title}`)
  }

  logger.info("🟩 Seed completo.")
  logger.info(`   → ${CATEGORIES.length} categorías`)
  logger.info(`   → ${PRODUCTS.length} productos`)
  logger.info(`   → Stock location: ${stockLocation.name}`)
}
