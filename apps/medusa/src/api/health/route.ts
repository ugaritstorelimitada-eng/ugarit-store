import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

/**
 * GET /health
 * Endpoint de healthcheck para Railway / Vercel.
 */
export const GET = async (_req: MedusaRequest, res: MedusaResponse) => {
  res.status(200).json({
    status: "ok",
    service: "ugarit-medusa",
    timestamp: new Date().toISOString(),
  })
}
