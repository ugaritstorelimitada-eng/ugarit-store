"use client"

import { useState, useMemo, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  Loader2,
  Mail,
  MapPin,
  ShieldCheck,
  User,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCart } from "@/lib/cart-store"
import { formatCLP } from "@/lib/mock-products"
import {
  formatRutLive,
  isValidRut,
  cleanRut,
  type DteType,
  type PaymentMethod,
  getCartFulfillmentType,
  getCheckoutSteps,
  type CheckoutStepId,
} from "@ugarit/shared-types"
import { toast } from "sonner"

// ─── Constants ────────────────────────────────────────────────────────────────

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL ?? "http://localhost:9000"
const STORE_TOKEN = process.env.NEXT_PUBLIC_STORE_TOKEN ?? ""

const ICONS: Record<CheckoutStepId, typeof User> = {
  contact: User,
  shipping: MapPin,
  payment: CreditCard,
  confirm: FileText,
}

const IVA_RATE = 0.19

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface ContactForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  rut: string
}

interface ShippingForm {
  street: string
  department: string
  commune: string
  region: string
  shippingMethod: "chilexpress" | "bluexpress" | "retiro" | "digital"
}

interface BillingForm {
  dteType: DteType
  rut: string
  razonSocial: string
  giro: string
  direccion: string
  comuna: string
}

interface PaymentForm {
  method: PaymentMethod
}

// ─── Etapa: contacto ──────────────────────────────────────────────────────────

function ContactStep({
  form,
  onChange,
  onNext,
  isAllDigital,
}: {
  form: ContactForm
  onChange: (f: ContactForm) => void
  onNext: () => void
  isAllDigital: boolean
}) {
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({})

  const validate = (): boolean => {
    const e: typeof errors = {}

    if (!form.firstName.trim()) e.firstName = "Nombre requerido"
    if (!form.lastName.trim()) e.lastName = "Apellido requerido"
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      e.email = "Email inválido"
    if (!form.phone.match(/^\+?[\d\s-]{8,}$/)) e.phone = "Teléfono inválido"

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (validate()) onNext()
  }

  const handleRutChange = (value: string) => {
    const formatted = formatRutLive(value)
    onChange({ ...form, rut: formatted })

    // Validación en tiempo real
    if (formatted.length >= 7) {
      const clean = cleanRut(formatted)
      if (!isValidRut(clean) && clean.length === 9) {
        setErrors((prev) => ({ ...prev, rut: "Dígito verificador incorrecto" }))
      } else {
        setErrors((prev) => ({ ...prev, rut: undefined }))
      }
    }
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-eset-100 flex items-center justify-center shrink-0">
            <User className="h-4 w-4 text-eset-700" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Datos de contacto</h2>
            <p className="text-xs text-muted-foreground">
              Tus datos para la entrega y emisión del documento tributario
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="firstName">Nombre *</Label>
            <Input
              id="firstName"
              value={form.firstName}
              onChange={(e) => onChange({ ...form, firstName: e.target.value })}
              placeholder="Juan"
            />
            {errors.firstName && (
              <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
            )}
          </div>
          <div>
            <Label htmlFor="lastName">Apellido *</Label>
            <Input
              id="lastName"
              value={form.lastName}
              onChange={(e) => onChange({ ...form, lastName: e.target.value })}
              placeholder="Pérez"
            />
            {errors.lastName && (
              <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="email">Correo electrónico *</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => onChange({ ...form, email: e.target.value })}
            placeholder="tu@email.cl"
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1.5 flex items-start gap-1.5">
            <Mail className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>
              {isAllDigital ? (
                <>
                  <strong>Clave de activación + guía de instalación</strong> se
                  envían aquí al instante tras el pago.
                </>
              ) : (
                <>Confirmación del pedido y seguimiento de envío.</>
              )}
            </span>
          </p>
        </div>

        <div>
          <Label htmlFor="phone">Teléfono *</Label>
          <Input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => onChange({ ...form, phone: e.target.value })}
            placeholder="+56 9 1234 5678"
          />
          {errors.phone && (
            <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <Label htmlFor="rut">RUT (opcional)</Label>
          <Input
            id="rut"
            value={form.rut}
            onChange={(e) => handleRutChange(e.target.value)}
            placeholder="12.345.678-9"
            maxLength={12}
          />
          {errors.rut ? (
            <p className="text-xs text-red-500 mt-1">{errors.rut}</p>
          ) : form.rut.length >= 8 && isValidRut(cleanRut(form.rut)) ? (
            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
              <Check className="h-3 w-3" /> RUT válido
            </p>
          ) : null}
          <p className="text-xs text-muted-foreground mt-1">
            Requerido para factura. La boleta se emite a nombre del cliente.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={handleNext} className="bg-eset-600 hover:bg-eset-700">
            {isAllDigital ? "Ir al pago" : "Continuar a envío"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Etapa: envío ─────────────────────────────────────────────────────────────

const SHIPPING_OPTIONS = [
  {
    id: "chilexpress" as const,
    name: "Chilexpress Estándar",
    price: 4990,
    days: "2-4 días hábiles",
    icon: "📦",
  },
  {
    id: "bluexpress" as const,
    name: "BlueExpress",
    price: 3990,
    days: "3-5 días hábiles",
    icon: "🚚",
  },
  {
    id: "retiro" as const,
    name: "Retiro en tienda — Puerto Montt",
    price: 0,
    days: "Disponible en 24h",
    icon: "🏪",
  },
]

function ShippingStep({
  form,
  onChange,
  onNext,
  onBack,
}: {
  form: ShippingForm
  onChange: (f: ShippingForm) => void
  onNext: (shippingCost: number) => void
  onBack: () => void
}) {
  const selected = SHIPPING_OPTIONS.find((o) => o.id === form.shippingMethod)!

  return (
    <Card>
      <CardContent className="p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-eset-100 flex items-center justify-center shrink-0">
            <MapPin className="h-4 w-4 text-eset-700" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Dirección de envío</h2>
            <p className="text-xs text-muted-foreground">
              {form.shippingMethod === "retiro"
                ? "Retiro en Av. Américas 830, Puerto Montt"
                : "Ingresa la dirección de entrega"}
            </p>
          </div>
        </div>

        {form.shippingMethod !== "retiro" && (
          <>
            <div>
              <Label htmlFor="street">Calle y número *</Label>
              <Input
                id="street"
                value={form.street}
                onChange={(e) => onChange({ ...form, street: e.target.value })}
                placeholder="Av. Principal 123, Depto 45"
              />
            </div>
            <div>
              <Label htmlFor="department">Depto / Casa / Oficina (opcional)</Label>
              <Input
                id="department"
                value={form.department}
                onChange={(e) =>
                  onChange({ ...form, department: e.target.value })
                }
                placeholder="Torre A, Piso 3"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="commune">Comuna *</Label>
                <Input
                  id="commune"
                  value={form.commune}
                  onChange={(e) =>
                    onChange({ ...form, commune: e.target.value })
                  }
                  placeholder="Puerto Montt"
                />
              </div>
              <div>
                <Label htmlFor="region">Región *</Label>
                <Input
                  id="region"
                  value={form.region}
                  onChange={(e) =>
                    onChange({ ...form, region: e.target.value })
                  }
                  placeholder="Los Lagos"
                />
              </div>
            </div>
          </>
        )}

        <div>
          <Label>Método de envío</Label>
          <div className="space-y-2 mt-2">
            {SHIPPING_OPTIONS.map((opt) => (
              <label
                key={opt.id}
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                  form.shippingMethod === opt.id
                    ? "border-eset-600 bg-eset-50/40"
                    : "hover:border-eset-300"
                }`}
              >
                <input
                  type="radio"
                  name="shipping"
                  value={opt.id}
                  checked={form.shippingMethod === opt.id}
                  onChange={() =>
                    onChange({ ...form, shippingMethod: opt.id })
                  }
                  className="accent-eset-600"
                />
                <span className="text-base">{opt.icon}</span>
                <div className="flex-1">
                  <p className="font-medium text-sm">{opt.name}</p>
                  <p className="text-xs text-muted-foreground">{opt.days}</p>
                </div>
                <span className="font-semibold text-sm">
                  {opt.price === 0 ? (
                    <span className="text-emerald-600">Gratis</span>
                  ) : (
                    formatCLP(opt.price)
                  )}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t pt-4 flex justify-between">
          <Button variant="ghost" onClick={onBack}>
            <ChevronLeft className="h-4 w-4" /> Volver
          </Button>
          <Button
            onClick={() => onNext(selected.price)}
            className="bg-eset-600 hover:bg-eset-700"
          >
            Ir al pago <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Etapa: pago ──────────────────────────────────────────────────────────────

function PaymentStep({
  paymentForm,
  billingForm,
  onPaymentChange,
  onBillingChange,
  onNext,
  onBack,
  subtotal,
  shippingCost,
  isSubmitting,
}: {
  paymentForm: PaymentForm
  billingForm: BillingForm
  onPaymentChange: (f: PaymentForm) => void
  onBillingChange: (f: BillingForm) => void
  onNext: () => void
  onBack: () => void
  subtotal: number
  shippingCost: number
  isSubmitting: boolean
}) {
  const [rutError, setRutError] = useState<string | undefined>()
  const tax = Math.round((subtotal + shippingCost) * IVA_RATE)
  const total = subtotal + shippingCost + tax

  const handleDteTypeChange = (type: DteType) => {
    onBillingChange({ ...billingForm, dteType: type })
  }

  const handleRutChange = (value: string) => {
    const formatted = formatRutLive(value)
    onBillingChange({ ...billingForm, rut: formatted })

    if (formatted.length >= 8) {
      if (!isValidRut(cleanRut(formatted))) {
        setRutError("Dígito verificador incorrecto")
      } else {
        setRutError(undefined)
      }
    } else {
      setRutError(undefined)
    }
  }

  const isFactura = billingForm.dteType === "factura"

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        {/* Método de pago */}
        <div>
          <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Método de pago
          </h3>
          <div className="space-y-2">
            {PAYMENT_METHODS.map((pm) => (
              <label
                key={pm.id}
                className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                  paymentForm.method === pm.id
                    ? "border-eset-600 bg-eset-50/40"
                    : "hover:border-eset-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={pm.id}
                  checked={paymentForm.method === pm.id}
                  onChange={() =>
                    onPaymentChange({ method: pm.id as PaymentMethod })
                  }
                  className="accent-eset-600"
                />
                <pm.Icon className="h-5 w-5 text-eset-600 shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{pm.name}</p>
                  <p className="text-xs text-muted-foreground">{pm.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Documento tributario */}
        <div className="border-t pt-5">
          <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documento tributario
          </h3>

          {/* Toggle boleta / factura */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              type="button"
              onClick={() => handleDteTypeChange("boleta")}
              className={`p-3 border rounded-lg text-sm font-medium transition-all ${
                !isFactura
                  ? "border-eset-600 bg-eset-50/60 text-eset-800 ring-1 ring-eset-600"
                  : "border-border bg-background text-muted-foreground hover:border-eset-300"
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-base">🧾</span>
                <span>Boleta</span>
                <span className="text-[10px] font-normal opacity-70">
                  Persona natural
                </span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleDteTypeChange("factura")}
              className={`p-3 border rounded-lg text-sm font-medium transition-all ${
                isFactura
                  ? "border-eset-600 bg-eset-50/60 text-eset-800 ring-1 ring-eset-600"
                  : "border-border bg-background text-muted-foreground hover:border-eset-300"
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-base">📄</span>
                <span>Factura</span>
                <span className="text-[10px] font-normal opacity-70">
                  Empresa / B2B
                </span>
              </div>
            </button>
          </div>

          {/* Campos comunes */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="billing-rut">
                RUT {isFactura ? "*" : "(opcional)"}
              </Label>
              <Input
                id="billing-rut"
                value={billingForm.rut}
                onChange={(e) => handleRutChange(e.target.value)}
                placeholder="76.543.210-1"
                maxLength={12}
              />
              {rutError && (
                <p className="text-xs text-red-500 mt-1">{rutError}</p>
              )}
            </div>

            {/* Campos exclusivos para factura */}
            {isFactura && (
              <div className="p-3 border border-blue-200 bg-blue-50/50 rounded-lg space-y-3">
                <p className="text-xs text-blue-700 font-medium flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Campos requeridos para factura electrónica SII
                </p>
                <div>
                  <Label htmlFor="razonSocial">Razón Social *</Label>
                  <Input
                    id="razonSocial"
                    value={billingForm.razonSocial}
                    onChange={(e) =>
                      onBillingChange({
                        ...billingForm,
                        razonSocial: e.target.value,
                      })
                    }
                    placeholder="Importadora y Comercializadora Ugarit Limitada"
                  />
                </div>
                <div>
                  <Label htmlFor="giro">Giro comercial *</Label>
                  <Input
                    id="giro"
                    value={billingForm.giro}
                    onChange={(e) =>
                      onBillingChange({ ...billingForm, giro: e.target.value })
                    }
                    placeholder="Comercialización de software y servicios TI"
                  />
                </div>
                <div>
                  <Label htmlFor="billing-address">Dirección comercial *</Label>
                  <Input
                    id="billing-address"
                    value={billingForm.direccion}
                    onChange={(e) =>
                      onBillingChange({
                        ...billingForm,
                        direccion: e.target.value,
                      })
                    }
                    placeholder="Av. Américas 830, Puerto Montt"
                  />
                </div>
                <div>
                  <Label htmlFor="billing-comuna">Comuna *</Label>
                  <Input
                    id="billing-comuna"
                    value={billingForm.comuna}
                    onChange={(e) =>
                      onBillingChange({
                        ...billingForm,
                        comuna: e.target.value,
                      })
                    }
                    placeholder="Puerto Montt"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Resumen */}
        <div className="border-t pt-4 space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCLP(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Envío</span>
            <span>
              {shippingCost === 0 ? (
                <span className="text-emerald-600">Gratis</span>
              ) : (
                formatCLP(shippingCost)
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">IVA 19%</span>
            <span>{formatCLP(tax)}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-2 border-t">
            <span>Total</span>
            <span className="text-eset-700">{formatCLP(total)}</span>
          </div>
        </div>

        <div className="border-t pt-4 flex justify-between">
          <Button variant="ghost" onClick={onBack} disabled={isSubmitting}>
            <ChevronLeft className="h-4 w-4" /> Volver
          </Button>
          <Button
            onClick={onNext}
            disabled={isSubmitting}
            className="bg-eset-600 hover:bg-eset-700 min-w-[160px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Procesando…
              </>
            ) : (
              <>
                Confirmar pedido
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Etapa: confirmación ───────────────────────────────────────────────────────

function ConfirmStep({
  paymentMethod,
  dteType,
  orderId,
}: {
  paymentMethod: PaymentMethod
  dteType: DteType
  orderId: string | null
}) {
  return (
    <Card>
      <CardContent className="p-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
          <Check className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold">¡Pedido confirmado!</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          {paymentMethod === "webpay" || paymentMethod === "mercadopago" ? (
            <>
              Serás redirigido al portal de pago en un momento. Una vez
              confirmado, recibirás tu{" "}
              <strong>
                {dteType === "factura"
                  ? "factura electrónica"
                  : "boleta electrónica"}
              </strong>{" "}
              por email junto con los detalles del pedido.
            </>
          ) : (
            <>
              Te enviamos los datos para transferencia bancaria por email.
              Recibirás tu{" "}
              <strong>
                {dteType === "factura"
                  ? "factura electrónica"
                  : "boleta electrónica"}
              </strong>{" "}
              una vez confirmado el pago (24h).
            </>
          )}
        </p>

        {orderId && (
          <div className="inline-block bg-muted rounded-lg px-4 py-2 text-sm">
            <span className="text-muted-foreground">Orden #</span>
            <span className="font-mono font-semibold ml-1">{orderId}</span>
          </div>
        )}

        <div className="flex gap-3 justify-center flex-wrap pt-2">
          <Button asChild>
            <Link href="/sigue-tu-pedido">Seguir mi pedido</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/tienda">Seguir comprando</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Método de pago helpers ───────────────────────────────────────────────────

function WebpayIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={{ width: 20, height: 20 }}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
    </svg>
  )
}

function MercadoPagoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={{ width: 20, height: 20 }}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
    </svg>
  )
}

const PAYMENT_METHODS = [
  {
    id: "webpay",
    name: "Webpay Plus",
    desc: "Visa, Mastercard, Redcompra, CMR — pago inmediato",
    Icon: WebpayIcon,
  },
  {
    id: "mercadopago",
    name: "Mercado Pago",
    desc: "Tarjetas, debito, cuotas sin interés",
    Icon: MercadoPagoIcon,
  },
  {
    id: "transferencia",
    name: "Transferencia bancaria",
    desc: "Datos para transferencia + confirmación en 24h",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5 text-eset-600">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
      </svg>
    ),
  },
] as const

// ─── Página principal ─────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const items = useCart((s) => s.items)
  const subtotal = useCart((s) => s.subtotal)()
  const clear = useCart((s) => s.clear)

  const fulfillment = useMemo(
    () => getCartFulfillmentType(items),
    [items]
  )
  const isAllDigital = fulfillment.isAllDigital
  const STEPS = useMemo(() => getCheckoutSteps(fulfillment.type), [fulfillment])

  const [step, setStep] = useState<CheckoutStepId>("contact")
  const [shippingCost, setShippingCost] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  // Formularios
  const [contactForm, setContactForm] = useState<ContactForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    rut: "",
  })

  const [shippingForm, setShippingForm] = useState<ShippingForm>({
    street: "",
    department: "",
    commune: "",
    region: "",
    shippingMethod: "chilexpress",
  })

  const [billingForm, setBillingForm] = useState<BillingForm>({
    dteType: "boleta",
    rut: "",
    razonSocial: "",
    giro: "",
    direccion: "",
    comuna: "",
  })

  const [paymentForm, setPaymentForm] = useState<PaymentForm>({
    method: "webpay",
  })

  const tax = Math.round((subtotal + shippingCost) * IVA_RATE)
  const total = subtotal + shippingCost + tax

  const currentStepIndex = STEPS.findIndex((s) => s.id === step)

  const goNext = useCallback(
    (nextStep?: CheckoutStepId) => {
      if (nextStep) {
        setStep(nextStep)
        return
      }
      const idx = STEPS.findIndex((s) => s.id === step)
      const next = STEPS[idx + 1]
      if (next) setStep(next.id)
    },
    [step, STEPS]
  )

  const goBack = useCallback(() => {
    const idx = STEPS.findIndex((s) => s.id === step)
    const prev = STEPS[idx - 1]
    if (prev) setStep(prev.id)
  }, [step, STEPS])

  // ── Vacío ──
  if (items.length === 0 && step !== "confirm") {
    return (
      <div className="container py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold">Carrito vacío</h1>
        <p className="text-muted-foreground">
          Agrega productos para continuar al checkout
        </p>
        <Button asChild>
          <Link href="/tienda">Ir a la tienda</Link>
        </Button>
      </div>
    )
  }

  // ── Submit: crear orden + emitir DTE ──
  const handlePaymentSubmit = async () => {
    setIsSubmitting(true)

    try {
      // 1. Crear cart en Medusa (o usar cart existente)
      const cartRes = await fetch(`${MEDUSA_URL}/store/carts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${STORE_TOKEN}`,
        },
        body: JSON.stringify({
          region_id: "reg_ chileregion", // completar con region de Chile
        }),
      })

      if (!cartRes.ok) {
        // En desarrollo sin Medusa, simulamos la orden
        console.warn("[Checkout] Medusa no disponible, simulando orden")
        await new Promise((r) => setTimeout(r, 1500))
        setOrderId(`ORD-${Date.now()}`)
        clear()
        goNext("confirm")
        toast.success("¡Pedido confirmado!", {
          description:
            "Recibirás tu documento tributario por email tras el pago.",
        })
        return
      }

      const { cart } = await cartRes.json()
      const cartId = cart.id

      // 2. Agregar línea de items al cart
      for (const item of items) {
        await fetch(`${MEDUSA_URL}/store/carts/${cartId}/line-items`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${STORE_TOKEN}`,
          },
          body: JSON.stringify({
            variant_id: item.id,
            quantity: item.quantity,
          }),
        })
      }

      // 3. Completar el cart (crea la orden)
      const completeRes = await fetch(
        `${MEDUSA_URL}/store/carts/${cartId}/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${STORE_TOKEN}`,
          },
        }
      )

      const { order } = await completeRes.json()

      if (!order) {
        throw new Error("No se pudo crear la orden")
      }

      // 4. Emitir DTE
      const dteType = billingForm.dteType === "factura" ? "factura_electronica" : "boleta_electronica"

      await fetch(`${MEDUSA_URL}/facturapi/dte`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          type: dteType,
          billing: {
            rut: billingForm.rut || contactForm.rut,
            razonSocial: billingForm.razonSocial,
            giro: billingForm.giro,
            direccion: billingForm.direccion,
            comuna: billingForm.comuna,
            email: contactForm.email,
          },
          items: items.map((i) => ({
            id: i.id,
            handle: i.handle,
            title: i.title,
            price: i.price,
            image: i.image,
            quantity: i.quantity,
            maxStock: i.maxStock,
            virtual: i.virtual,
          })),
          subtotal,
          tax,
          total,
          paymentMethod: paymentForm.method,
          customerEmail: contactForm.email,
          customerName: `${contactForm.firstName} ${contactForm.lastName}`,
        }),
      })

      // 5. Iniciar flujo de pago según método
      if (paymentForm.method === "webpay") {
        // Redirigir a Webpay (crear transacción primero)
        const txRes = await fetch(`${MEDUSA_URL}/store/payments/webpay/init`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_id: order.id, amount: total }),
        })
        const { redirect_url } = await txRes.json()
        if (redirect_url) {
          window.location.href = redirect_url
          return
        }
      } else if (paymentForm.method === "mercadopago") {
        // Similar para Mercado Pago
        const mpRes = await fetch(`${MEDUSA_URL}/store/payments/mercadopago/init`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_id: order.id, amount: total }),
        })
        const { preference_id } = await mpRes.json()
        if (preference_id) {
          // En producción: inicializar Mercado Pago SDK con preference_id
          // redirect_url de Mercado Pago
        }
      }

      // Transferencia o fallback
      setOrderId(order.id)
      clear()
      goNext("confirm")
      toast.success("¡Pedido confirmado!", {
        description:
          "Recibirás tu documento tributario por email tras el pago.",
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido"
      toast.error("Error al procesar el pedido", { description: msg })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        Checkout
        {orderId && (
          <span className="ml-3 text-base font-normal text-muted-foreground">
            #{orderId}
          </span>
        )}
      </h1>

      {/* Banner digital */}
      {isAllDigital && step !== "confirm" && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50/60 p-3 text-sm">
          <div className="shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
            <Zap className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-emerald-800">
              <strong>Carrito 100% digital.</strong> Claves de activación y guía
              de instalación se envían <strong>inmediatamente</strong> tras el
              pago. Sin costo de envío.
            </p>
          </div>
        </div>
      )}

      {/* Stepper */}
      {step !== "confirm" && (
        <div className="mb-8 flex items-center justify-between max-w-2xl">
          {STEPS.map((s, i) => {
            const isActive = currentStepIndex >= i
            const Icon = ICONS[s.id]
            return (
              <div key={s.id} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isActive
                        ? "bg-eset-600 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStepIndex > i ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className="text-xs mt-1 hidden sm:block">{s.label}</span>
                </div>
                {i < STEPS.length - 1 ? (
                  <div
                    className={`h-0.5 flex-1 mx-2 transition-colors ${
                      currentStepIndex > i ? "bg-eset-600" : "bg-muted"
                    }`}
                  />
                ) : null}
              </div>
            )
          })}
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        {/* Panel izquierdo */}
        <div>
          {step === "contact" && (
            <ContactStep
              form={contactForm}
              onChange={setContactForm}
              onNext={() => goNext()}
              isAllDigital={isAllDigital}
            />
          )}

          {step === "shipping" && !isAllDigital && (
            <ShippingStep
              form={shippingForm}
              onChange={setShippingForm}
              onNext={(cost) => {
                setShippingCost(cost)
                goNext()
              }}
              onBack={goBack}
            />
          )}

          {step === "payment" && (
            <PaymentStep
              paymentForm={paymentForm}
              billingForm={billingForm}
              onPaymentChange={setPaymentForm}
              onBillingChange={setBillingForm}
              onNext={handlePaymentSubmit}
              onBack={goBack}
              subtotal={subtotal}
              shippingCost={isAllDigital ? 0 : shippingCost}
              isSubmitting={isSubmitting}
            />
          )}

          {step === "confirm" && (
            <ConfirmStep
              paymentMethod={paymentForm.method}
              dteType={billingForm.dteType}
              orderId={orderId}
            />
          )}
        </div>

        {/* Resumen del pedido (sidebar) */}
        {step !== "confirm" && (
          <div className="lg:sticky lg:top-32 h-fit">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="font-semibold flex items-center gap-2">
                  Tu pedido
                  <span className="ml-auto text-xs bg-muted px-2 py-0.5 rounded-full font-normal">
                    {items.length} {items.length === 1 ? "producto" : "productos"}
                  </span>
                </h2>

                <ul className="space-y-3">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-3 text-sm">
                      <div className="relative w-12 h-12 rounded overflow-hidden bg-muted shrink-0">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="60px"
                            className="object-cover"
                          />
                        ) : null}
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-eset-600 text-white text-[10px] font-bold flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="line-clamp-2 leading-tight text-xs">
                          {item.title}
                        </p>
                      </div>
                      <span className="font-medium whitespace-nowrap text-xs">
                        {formatCLP(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="border-t pt-3 space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCLP(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Envío</span>
                    <span>
                      {isAllDigital ? (
                        <span className="text-emerald-600 text-xs flex items-center gap-1">
                          <Zap className="h-3 w-3" /> Digital
                        </span>
                      ) : shippingCost === 0 ? (
                        <span className="text-emerald-600">Gratis</span>
                      ) : (
                        formatCLP(shippingCost)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground text-xs">
                    <span>IVA 19%</span>
                    <span>{formatCLP(tax)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t">
                    <span>Total</span>
                    <span className="text-eset-700">{formatCLP(total)}</span>
                  </div>
                </div>

                {isAllDigital && (
                  <p className="text-xs text-muted-foreground flex items-start gap-1.5 pt-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      Entrega digital inmediata por email: clave de activación +
                      guía de instalación.
                    </span>
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
