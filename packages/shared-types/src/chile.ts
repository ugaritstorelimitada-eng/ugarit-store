/**
 * UGARIT · Utilidades de RUT chileno
 *
 * Funciones puras y testeables para validar, formatear y limpiar
 * el Rol Único Tributario según el algoritmo del SII.
 *
 * Formatos aceptados:
 *   - 12345678-9
 *   - 12.345.678-9
 *   - 123456789
 *
 * @example
 *   isValidRut("12.345.678-9")  // true
 *   isValidRut("12345678-5")    // false (DV incorrecto)
 *   formatRut("123456789")      // "12.345.678-9"
 *   cleanRut("12.345.678-9")    // "123456789"
 */

export type Rut = string

/**
 * Limpia el RUT: elimina puntos, guiones y espacios.
 * Convierte a mayúsculas. Acepta cualquier formato de entrada.
 */
export function cleanRut(rut: string): string {
  if (!rut) return ""
  return rut.replace(/[^0-9kK]/g, "").toUpperCase()
}

/**
 * Formatea un RUT al formato chileno XX.XXX.XXX-X.
 * Si el RUT es inválido, devuelve el string limpio sin formato.
 */
export function formatRut(rut: string): string {
  const cleaned = cleanRut(rut)
  if (cleaned.length < 2) return cleaned

  const dv = cleaned.slice(-1)
  const body = cleaned.slice(0, -1)
  // Insertar puntos cada 3 dígitos desde la derecha
  const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  return `${formatted}-${dv}`
}

/**
 * Valida un RUT chileno con su dígito verificador.
 * Algoritmo: módulo 11.
 */
export function isValidRut(rut: string): boolean {
  const cleaned = cleanRut(rut)
  if (cleaned.length < 2) return false

  const body = cleaned.slice(0, -1)
  const dv = cleaned.slice(-1)

  let sum = 0
  let multiplier = 2
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i] ?? "0", 10) * multiplier
    multiplier = multiplier === 7 ? 2 : multiplier + 1
  }

  const remainder = sum % 11
  const expected = remainder < 2 ? String(11 - remainder) : remainder === 10 ? "K" : String(11 - remainder)
  return expected === dv
}

export type RutValidation =
  | { readonly valid: true; readonly formatted: string }
  | { readonly valid: false; readonly error: RutError }

export type RutError =
  | "empty"
  | "too-short"
  | "invalid-format"
  | "invalid-check-digit"

export function validateRut(input: string): RutValidation {
  if (!input || input.trim().length === 0) {
    return { valid: false, error: "empty" }
  }

  const cleaned = cleanRut(input)
  if (cleaned.length < 2) {
    return { valid: false, error: "too-short" }
  }
  if (!/^[0-9]+[0-9K]$/.test(cleaned)) {
    return { valid: false, error: "invalid-format" }
  }
  if (!isValidRut(cleaned)) {
    return { valid: false, error: "invalid-check-digit" }
  }
  return { valid: true, formatted: formatRut(cleaned) }
}

/** Mensajes user-friendly para cada tipo de error */
export const RUT_ERROR_MESSAGES: Record<RutError, string> = {
  empty: "Ingresa tu RUT",
  "too-short": "RUT muy corto",
  "invalid-format": "Formato de RUT inválido",
  "invalid-check-digit": "Dígito verificador incorrecto",
}

/**
 * Formatea un RUT mientras el usuario escribe.
 * Aplica formato XX.XXX.XXX-X automáticamente.
 */
export function formatRutLive(input: string): string {
  // Eliminar todo lo que no sea número o K
  const cleaned = cleanRut(input)
  if (!cleaned) return ""

  // Limitar a 9 caracteres (8 dígitos + DV)
  const limited = cleaned.slice(0, 9)

  // Separar body y DV
  if (limited.length <= 1) return limited
  const dv = limited.slice(-1)
  const body = limited.slice(0, -1)

  // Aplicar formato con puntos
  const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  return `${formatted}-${dv}`
}
