/**
 * UGARIT · Formateador de moneda CLP
 *
 * Formatea un número como peso chileno con Intl.NumberFormat.
 * No incluye decimales porque los CLP no usan centavos.
 */

export const formatCLP = (amount: number): string =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(amount)
