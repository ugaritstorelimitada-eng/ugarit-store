# GitHub Secrets · UGARIT Store

Lista de secrets que deben estar configurados en GitHub para que los deploys funcionen. Ir a **Settings → Secrets and variables → Actions → New repository secret**.

## 🔐 Para deploy del storefront (Vercel)

| Secret | Descripción | Cómo obtenerlo |
|---|---|---|
| `VERCEL_TOKEN` | Token de API de Vercel para deploy automatizado | Vercel → Account Settings → Tokens → Create Token |
| `SLACK_WEBHOOK_URL` | (Opcional) Webhook de Slack para notificaciones de deploy | Slack → Apps → Incoming Webhooks |

## 🔐 Para deploy del backend (Railway)

| Secret | Descripción | Cómo obtenerlo |
|---|---|---|
| `RAILWAY_TOKEN` | Token de API de Railway | Railway → Account Settings → Tokens → Create Token |
| `RAILWAY_SERVICE_ID_MEDUSA` | ID del servicio de Medusa en Railway | Railway → Medusa service → Settings → Service ID |
| `MEDUSA_BACKEND_URL` | URL pública del backend (para healthcheck) | Railway → Medusa service → Settings → Domains |

## 🔐 Para migraciones de DB

| Secret | Descripción |
|---|---|
| `DATABASE_URL_STAGING` | `postgres://...` de Supabase staging |
| `DATABASE_URL_PRODUCTION` | `postgres://...` de Supabase producción |
| `JWT_SECRET` | Mismo que usa Medusa en runtime |
| `COOKIE_SECRET` | Mismo que usa Medusa en runtime |
| `STORE_CORS` | URL del storefront (`https://ugarit.cl`) |
| `ADMIN_CORS` | URL del admin (`https://admin.ugarit.cl`) |
| `AUTH_CORS` | Combinación de los anteriores |

## 🔐 Secrets adicionales para Medusa runtime

Estos se configuran en Railway directamente (no en GitHub), pero los documento acá:

| Variable | Servicio |
|---|---|
| `TRANSBANK_COMMERCE_CODE` | Transbank Webpay |
| `TRANSBANK_API_KEY` | Transbank Webpay |
| `MERCADOPAGO_ACCESS_TOKEN` | Mercado Pago |
| `CHILEXPRESS_CARD_CODE` | Chilexpress API |
| `FACTURAPI_KEY` | DTE vía Facturapi |
| `RESEND_API_KEY` | Emails transaccionales |
| `R2_*` | Cloudflare R2 (storage) |

## 🚀 Setup inicial

1. Crear cuenta en [Vercel](https://vercel.com) y [Railway](https://railway.app)
2. Vincular el repo de GitHub a ambos
3. Generar los tokens de arriba
4. Configurar los secrets en GitHub
5. Hacer push a `main` → deploy automático
