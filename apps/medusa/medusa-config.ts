import { defineConfig, loadEnv } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

/**
 * UGARIT · Medusa.js v2 config
 * @see https://docs.medusajs.com/learn/configurations/medusa-config
 */
export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
    // El branding del Admin se configura via widget (ver src/admin/widgets/)
    // y los assets están en apps/medusa/public/
  },
  modules: {
    // Cache (default memory, cambiamos a Redis en prod)
    cacheService: {
      resolve: process.env.REDIS_URL
        ? "@medusajs/framework/cache-redis"
        : "@medusajs/framework/cache-inmemory",
      options: process.env.REDIS_URL
        ? { redisUrl: process.env.REDIS_URL }
        : { },
    },
    // Event bus
    eventBus: {
      resolve: process.env.REDIS_URL
        ? "@medusajs/framework/event-bus-redis"
        : "@medusajs/framework/event-bus-local",
      options: process.env.REDIS_URL
        ? { redisUrl: process.env.REDIS_URL }
        : { },
    },
  },
  plugins: [
    // Los plugins Chile se cargan aquí cuando los implementemos:
    // require.resolve("@ugarit/plugin-webpay"),
    // require.resolve("@ugarit/plugin-chilexpress"),
    // require.resolve("@ugarit/plugin-dte"),
  ],
})
