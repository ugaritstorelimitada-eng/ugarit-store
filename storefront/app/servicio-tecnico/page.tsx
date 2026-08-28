import type { Metadata } from "next"
import Link from "next/link"
import { Wrench, ShieldCheck, Settings, Headphones, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SITE } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Servicio Técnico",
  description: "Reparación, mantenimiento, instalación y soporte remoto profesional en Puerto Montt.",
}

const SERVICES = [
  {
    icon: Wrench,
    title: "Reparación de Equipos",
    description: "Diagnóstico y reparación de computadores, laptops, tablets y dispositivos tecnológicos.",
    items: ["Diagnóstico completo", "Presupuesto sin compromiso", "Reparación con garantía", "Repuestos originales"],
  },
  {
    icon: ShieldCheck,
    title: "Mantenimiento Preventivo",
    description: "Mantén tus equipos en óptimas condiciones con servicio programado.",
    items: ["Limpieza profunda", "Actualización de drivers", "Optimización de software", "Chequeo de hardware"],
  },
  {
    icon: Settings,
    title: "Instalación y Configuración",
    description: "Instalamos y configuramos software, sistemas operativos y redes.",
    items: ["Instalación de software", "Configuración de redes", "Setup de equipos nuevos", "Migración de datos"],
  },
  {
    icon: Headphones,
    title: "Soporte Remoto",
    description: "Atención inmediata sin necesidad de trasladar tu equipo.",
    items: ["Atención 24/7", "Resolución rápida", "Sin costo de traslado", "Seguimiento post-servicio"],
  },
] as const

const STEPS = [
  { n: 1, title: "Solicita el Servicio", desc: "Contáctanos por WhatsApp, email o formulario." },
  { n: 2, title: "Diagnóstico", desc: "Evaluamos tu equipo y entregamos presupuesto." },
  { n: 3, title: "Reparación", desc: "Realizamos el trabajo con repuestos originales." },
  { n: 4, title: "Entrega", desc: "Devolvemos tu equipo con garantía por escrito." },
] as const

export default function ServicioTecnicoPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-ugarit-50 to-ugarit-100 border-b">
        <div className="container py-12 md:py-16">
          <div className="max-w-3xl">
            <p className="text-sm text-ugarit-700 font-medium uppercase tracking-wide mb-2">
              {SITE.legalName}
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Servicio técnico integral
            </h1>
            <p className="text-lg text-muted-foreground mt-3">
              Soporte profesional para mantener tu tecnología funcionando perfectamente.
            </p>
            <div className="flex gap-3 mt-6">
              <Button asChild>
                <Link href="/contacto">
                  Solicitar servicio <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <a
                  href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hola, necesito servicio técnico")}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="container py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {SERVICES.map((s) => {
            const Icon = s.icon
            return (
              <Card key={s.title}>
                <CardContent className="p-6 space-y-3">
                  <Icon className="h-8 w-8 text-ugarit-700" />
                  <h3 className="text-xl font-semibold">{s.title}</h3>
                  <p className="text-muted-foreground">{s.description}</p>
                  <ul className="space-y-1 text-sm">
                    {s.items.map((i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-ugarit-700">✓</span> {i}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Proceso */}
      <section className="bg-muted/30 border-y">
        <div className="container py-12">
          <h2 className="text-3xl font-bold text-center mb-10">¿Cómo funciona?</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {STEPS.map((s) => (
              <Card key={s.n}>
                <CardContent className="p-6 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-ugarit-700 text-white text-xl font-bold flex items-center justify-center mx-auto">
                    {s.n}
                  </div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-12 text-center">
        <h2 className="text-2xl font-bold mb-2">¿Listo para comenzar?</h2>
        <p className="text-muted-foreground mb-6">
          Solicita tu diagnóstico gratuito y te respondemos en menos de 2 horas hábiles.
        </p>
        <div className="flex gap-3 justify-center">
          <Button asChild size="lg">
            <Link href="/contacto">Solicitar diagnóstico</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a
              href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp directo
            </a>
          </Button>
        </div>
      </section>
    </div>
  )
}
