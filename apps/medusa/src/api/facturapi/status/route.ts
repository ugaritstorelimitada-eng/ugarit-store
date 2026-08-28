/**
 * GET /facturapi/status/:dteId
 *
 * Consulta el estado de un DTE ya emitido en Facturapi.
 */

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import FacturapiService from "../../../../services/facturapi.service"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { dteId } = req.params as { dteId?: string }

  if (!dteId) {
    return res.status(400).json({ error: "dteId requerido" })
  }

  try {
    const container = req.scope as unknown as Record<string, unknown>
    const facturapiService = new FacturapiService(container)
    const status = await facturapiService.getDteStatus(dteId)

    return res.status(200).json({ success: true, status })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido"
    return res.status(500).json({ error: "Error consultando DTE", message })
  }
}
