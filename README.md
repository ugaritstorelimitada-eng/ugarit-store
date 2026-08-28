# UGARIT Store · Next.js + Medusa.js

Tienda online oficial de **UGARIT · Importadora y Comercializadora Ugarit Limitada** (RUT 77.316.893-8).

Migración desde WordPress + WooCommerce a un stack moderno headless: **Next.js 15** (frontend) + **Medusa.js v2** (backend commerce) + **PostgreSQL** (Supabase).

---

## 🏗️ Arquitectura

```
ugarit.cl  ─┐                          ┌─→  PostgreSQL (Supabase)
            │                          │
            ├─→  Vercel CDN            ├─→  Meilisearch Cloud
            │     (Next.js 15)         │
            │     ┌─────────────────┐  ├─→  Cloudflare R2
            │     │ storefront/     │  │   (imágenes)
            │     │ - home          │  │
            │     │ - /tienda       │  └─→  Redis (Railway)
            │     │ - /p/[slug]     │      (cache + event bus)
            │     │ - /cart         │
            │     │ - /checkout     │  ┌─→  Transbank Webpay
            │     │ - /cuenta       │  ├─→  Mercado Pago
            │     └─────────────────┘  ├─→  Chilexpress
            │                          ├─→  Facturapi (DTE)
            │                          └─→  Resend (emails)
            └─→  Railway               │
                  (Medusa v2)          │
                  ┌─────────────────┐  │
                  │ medusa/         │  │
                  │ - REST API      │  │
                  │ - /admin        │  │
                  │ - /store        │  │
                  └─────────────────┘  │
```

---

## 📁 Estructura del monorepo

```
ugarit-store/
├── apps/
│   ├── medusa/                # Backend commerce (Medusa.js v2)
│   └── ...                    # (storefront está en /storefront por ahora)
├── packages/
│   └── shared-types/          # Tipos TypeScript compartidos
├── storefront/                # Frontend (Next.js 15 App Router)
├── pnpm-workspace.yaml
├── turbo.json
└── README.md (este archivo)
```

---

## 🚀 Setup local

### Requisitos
- **Node.js 20+** (usar `nvm install 20`)
- **pnpm 9+** (`npm install -g pnpm@9`)
- **PostgreSQL 15+** corriendo local o Supabase
- **Redis 7+** (opcional, recomendado)

### Instalación

```bash
# 1. Clonar e instalar
git clone <repo>
cd ugarit-store
nvm use   # usa Node 20 desde .nvmrc
pnpm install

# 2. Variables de entorno
cp apps/medusa/.env.example apps/medusa/.env
cp storefront/.env.example storefront/.env
# Editar ambos con tus credenciales

# 3. Iniciar base de datos (Supabase o local)
# Si usas Supabase, copia el DATABASE_URL desde su panel
# Si es local:
#   docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres --name ugarit-pg postgres:15

# 4. Migrar y seedear Medusa
cd apps/medusa
pnpm exec medusa db:create
pnpm exec medusa db:migrate
pnpm seed

# 5. Iniciar dev (en 2 terminales)
# Terminal 1: Medusa backend
cd apps/medusa
pnpm dev          # http://localhost:9000

# Terminal 2: Storefront
cd storefront
pnpm dev          # http://localhost:3000

# Admin de Medusa: http://localhost:7001
# Storefront:     http://localhost:3000
```

---

## 🗺️ Roadmap de implementación

| Fase | Alcance | Estado |
|---|---|---|
| **0. Setup** | Monorepo, Medusa, Next.js, deploys | ✅ En curso |
| **1. Catálogo + Admin** | Cargar 14 productos, customizar Medusa Admin | ⏳ |
| **2. Storefront público** | Home, catálogo, producto, carrito, checkout Webpay + MP | ⏳ |
| **3. B2B + DTE + Envíos** | Login RUT, listas precio, cotizaciones, Facturapi, Chilexpress | ⏳ |
| **4. Migración + Go-live** | 301 redirects, DNS cutover, monitoreo | ⏳ |

### Servicios externos a integrar
- **Pagos**: Webpay (Transbank SDK Node) + Mercado Pago
- **Envíos**: Chilexpress API + BlueExpress
- **DTE**: Facturapi (boleta/factura automática)
- **Email**: Resend (transaccional desde contacto@ugarit.cl)
- **Búsqueda**: Meilisearch
- **Storage**: Cloudflare R2
- **Auth**: NextAuth.js + verificación RUT

---

## 💰 Costos mensuales estimados

| Servicio | Plan | Costo |
|---|---|---|
| Vercel Pro | Frontend + edge | $20 |
| Railway | Medusa + Redis | $25-50 |
| Supabase Pro | PostgreSQL 8GB | $25 |
| Meilisearch Cloud | Búsqueda | $30 |
| Resend | Email | $20 |
| Cloudflare R2 | Storage | ~$5 |
| **Total** | | **~$125-150/mes** |

Comparado con lo que hoy se paga en hosting WP + plugins premium (~$70-100/mes + dolores de cabeza), el nuevo stack se paga solo.

---

## 📝 Convenciones del proyecto

### Commits
Seguir [Conventional Commits](https://www.conventionalcommits.org/):
- `feat: agregar filtro de marca en catálogo`
- `fix: corregir validación de RUT en checkout`
- `chore: actualizar deps`
- `docs: actualizar README`

### Estructura de código (storefront)
```
storefront/
├── app/                       # Rutas (App Router)
│   ├── (storefront)/          # Grupo: páginas públicas
│   │   ├── page.tsx           # Home
│   │   ├── tienda/page.tsx
│   │   ├── p/[handle]/page.tsx
│   │   └── categoria/[slug]/page.tsx
│   ├── (account)/             # Grupo: páginas autenticadas
│   │   ├── cuenta/page.tsx
│   │   └── checkout/page.tsx
│   └── layout.tsx
├── components/
│   ├── ui/                    # Componentes base (shadcn-style)
│   ├── storefront/            # Componentes específicos
│   └── account/
├── lib/                       # Utilidades y clientes
│   ├── medusa.ts              # Cliente Medusa
│   ├── constants.ts           # Constantes globales
│   └── utils.ts               # Helpers
├── hooks/                     # Custom hooks
├── types/                     # Tipos específicos
└── public/                    # Assets estáticos
```

### Tipos compartidos
`packages/shared-types/src/index.ts` contiene tipos y helpers reusables:
- `formatCLP(amount)` — formatea CLP
- `isValidRut(rut)` — valida RUT chileno
- Tipos de dominio Chile: `DteType`, `DteStatus`, `CustomerType`, etc.

Importar como:
```ts
import { formatCLP, isValidRut, type ProductCategorySlug } from "@ugarit/shared-types"
```

---

## 🆘 Soporte

- **Rodrigo Gallardo** — Gerencia Logística, Ugarit
  - WhatsApp: +56 9 5739 9216
  - Email: contacto@ugarit.cl

- **Repositorio GitHub**: `ugaritstorelimitada-eng/ugarit-store` (próximamente)

---

**Estado actual:** scaffolding inicial. Próximos pasos: configurar Supabase + Railway + Vercel, levantar staging, empezar migración de productos desde WP.
