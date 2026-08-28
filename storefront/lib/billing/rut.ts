import type { RutValidation } from "./types"

/**
 * UGARIT · Validador de RUT chileno
 *
 * Implementa el algoritmo del "Módulo 11" usado por el SII.
 *
 * Formato aceptado:
 *   - "12345678-9"  (con guión)
 *   - "12.345.678-9" (con puntos y guión)
 *   - "123456789"   (sin separadores)
 *
 * Salida normalizada: "12345678-9"
 */

/** Limpia un RUT: deja solo dígitos y la letra K/k al final */
function cleanRut(input: string): string {
  return input.replace(/[^0-9kK]/g, "").toUpperCase()
}

/** Calcula el dígito verificador con módulo 11 */
function computeDv(body: string): string {
  let sum = 0
  let multiplier = 2
  for (let i = body.length - 1; i >= 0; i--) {
    const digit = body.charAt(i)
    sum += parseInt(digit, 10) * multiplier
    multiplier = multiplier === 7 ? 2 : multiplier + 1
  }
  const remainder = 11 - (sum % 11)
  if (remainder === 11) return "0"
  if (remainder === 10) return "K"
  return String(remainder)
}

/** Formatea un RUT limpio a "12345678-9" */
export function formatRut(cleaned: string): string {
  if (cleaned.length < 2) return cleaned
  const body = cleaned.slice(0, -1)
  const dv = cleaned.slice(-1)
  // Inserta puntos cada 3 dígitos desde la derecha
  const reversed = body.split("").reverse().join("")
  const groups = reversed.match(/.{1,3}/g) ?? []
  return `${groups.reverse().join(".")}-${dv}`
}

/** Valida un RUT chileno */
export function validateRut(input: string): RutValidation {
  if (!input || typeof input !== "string") {
    return { valid: false, reason: "RUT vacío" }
  }
  const cleaned = cleanRut(input)
  if (cleaned.length < 2) {
    return { valid: false, reason: "RUT demasiado corto" }
  }
  if (cleaned.length > 9) {
    return { valid: false, reason: "RUT demasiado largo" }
  }
  const body = cleaned.slice(0, -1)
  const dv = cleaned.slice(-1)
  if (!/^\d+$/.test(body)) {
    return { valid: false, reason: "Cuerpo del RUT debe ser numérico" }
  }
  const expected = computeDv(body)
  if (dv !== expected) {
    return {
      valid: false,
      reason: `Dígito verificador incorrecto (esperado ${expected})`,
    }
  }
  return { valid: true, normalized: formatRut(cleaned) }
}

/** Normaliza un RUT a formato estándar (sin validar) */
export function normalizeRut(input: string): string {
  return formatRut(cleanRut(input))
}

/** Formatea un RUT en tiempo real mientras el usuario escribe (best-effort, no valida) */
export function formatRutLive(input: string): string {
  const cleaned = cleanRut(input)
  if (cleaned.length === 0) return ""
  // Mientras escribe, no tenemos DV todavía
  if (cleaned.length === 1) return cleaned
  return formatRut(cleaned)
}
