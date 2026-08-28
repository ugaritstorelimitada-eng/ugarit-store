import type { Metadata } from "next"
import { Mail, MessageCircle, MapPin, Clock, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SITE } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escríbenos por WhatsApp, email o formulario. Respondemos en menos de 24h.",
}

export default function ContactoPage() {
  return (
    <div className="container py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Contacto</h1>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
          Estamos para ayudarte. Elige el canal que prefieras.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Info de contacto */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-start gap-3 hover:text-ugarit-700"
              >
                <Mail className="h-5 w-5 text-ugarit-700 mt-0.5" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-sm text-muted-foreground">{SITE.email}</p>
                </div>
              </a>
              <a
                href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 hover:text-ugarit-700"
              >
                <MessageCircle className="h-5 w-5 text-ugarit-700 mt-0.5" />
                <div>
                  <p className="font-semibold">WhatsApp</p>
                  <p className="text-sm text-muted-foreground">{SITE.whatsappDisplay}</p>
                </div>
              </a>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-ugarit-700 mt-0.5" />
                <div>
                  <p className="font-semibold">Ubicación</p>
                  <p className="text-sm text-muted-foreground">{SITE.city}, {SITE.region_label}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-ugarit-700 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold">Horario de Atención</p>
                    <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                      <span className="pulse-dot" />
                      Abierto 24/7
                    </span>
                  </div>
                  <p className="text-sm text-slate-900 mt-1">
                    Tienda online & entrega digital: <strong>24/7 automatizado</strong>
                  </p>
                  <p className="text-xs text-slate-500">
                    Soporte B2B y WhatsApp: Lun a Vie 9:00–18:00 hrs
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">
                <strong>¿Eres empresa?</strong> Si quieres cotización formal, lista de precios B2B o factura
                con plazo de pago, escríbenos a <a href={`mailto:${SITE.emailVentas}`} className="text-ugarit-700 hover:underline">{SITE.emailVentas}</a>{" "}
                adjuntando tu RUT.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Formulario */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Envíanos un mensaje</h2>
            <form className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Nombre</Label>
                  <Input placeholder="Juan" required />
                </div>
                <div>
                  <Label>Apellido</Label>
                  <Input placeholder="Pérez" required />
                </div>
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" placeholder="tu@email.cl" required />
              </div>
              <div>
                <Label>Teléfono (opcional)</Label>
                <Input type="tel" placeholder="+56 9 1234 5678" />
              </div>
              <div>
                <Label>Asunto</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option>Consulta sobre producto</option>
                  <option>Cotización B2B</option>
                  <option>Servicio técnico</option>
                  <option>Estado de mi pedido</option>
                  <option>Otro</option>
                </select>
              </div>
              <div>
                <Label>Mensaje</Label>
                <Textarea
                  placeholder="Cuéntanos en qué te podemos ayudar…"
                  rows={5}
                  required
                />
              </div>
              <Button type="submit" className="w-full" size="lg">
                <Send className="h-4 w-4" />
                Enviar mensaje
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Protegido con reCAPTCHA y SSL.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
