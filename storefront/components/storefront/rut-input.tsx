"use client"

import { useState, useEffect } from "react"
import { Check, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatRutLive, validateRut, RUT_ERROR_MESSAGES, type RutError } from "@ugarit/shared-types"
import { cn } from "@/lib/utils"

type RutInputProps = {
  readonly value: string
  readonly onChange: (value: string, isValid: boolean) => void
  readonly label?: string
  readonly required?: boolean
  readonly autoFocus?: boolean
  readonly placeholder?: string
  readonly id?: string
}

/**
 * RutInput · Input con formato XX.XXX.XXX-X y validación con dígito verificador.
 *
 * Comportamiento:
 * - Formatea mientras el usuario escribe (live)
 * - Valida con módulo 11 (algoritmo del SII)
 * - Muestra ✓ verde cuando es válido, ✗ rojo si el DV es incorrecto
 */
export function RutInput({
  value,
  onChange,
  label = "RUT",
  required = false,
  autoFocus = false,
  placeholder = "12.345.678-9",
  id = "rut",
}: RutInputProps): React.JSX.Element {
  const [displayValue, setDisplayValue] = useState(value)
  const [error, setError] = useState<RutError | null>(null)

  useEffect(() => {
    setDisplayValue(value)
    if (!value) {
      setError(null)
      return
    }
    const result = validateRut(value)
    setError(result.valid ? null : result.error)
  }, [value])

  function handleInput(e: React.ChangeEvent<HTMLInputElement>): void {
    const raw = e.target.value
    const formatted = formatRutLive(raw)
    setDisplayValue(formatted)
    const result = validateRut(formatted)
    setError(result.valid ? null : result.error)
    onChange(formatted, result.valid)
  }

  const isValid = displayValue.length > 0 && error === null
  const isInvalid = displayValue.length > 0 && error !== null

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label}
        {required ? <span className="text-red-500 ml-0.5">*</span> : null}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleInput}
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-invalid={isInvalid}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "pr-10 font-mono",
            isValid && "border-eset-500 focus-visible:ring-eset-200",
            isInvalid && "border-red-500 focus-visible:ring-red-200"
          )}
          maxLength={12}
        />
        {isValid ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-eset-600">
            <Check className="h-4 w-4" aria-label="RUT válido" />
          </div>
        ) : isInvalid ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
            <X className="h-4 w-4" aria-label="RUT inválido" />
          </div>
        ) : null}
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-600">
          {RUT_ERROR_MESSAGES[error]}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">Formato: 12.345.678-9</p>
      )}
    </div>
  )
}
