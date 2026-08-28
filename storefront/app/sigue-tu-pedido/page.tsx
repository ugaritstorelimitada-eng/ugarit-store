import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Package, Truck, CheckCircle2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Sigue tu pedido",
  description: "Consulta el estado y tracking de tu pedido en UGARIT.",
}

export default function TrackingPage() {
  return (
    <div className="container py-12 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Sigue tu pedido</h1>
        <p className="text-muted-foreground mt-2">
          Ingresa tu número de pedido o email para ver el estado en tiempo real.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label>Número de pedido</Label>
            <Input placeholder="#UG-2026-0001" />
          </div>
          <div className="text-center text-sm text-muted-foreground">o</div>
          <div>
            <Label>Email con el que compraste</Label>
            <Input type="email" placeholder="tu@email.cl" />
          </div>
          <Button className="w-full" size="lg">
            <Search className="h-4 w-4" />
            Buscar pedido
          </Button>
        </CardContent>
      </Card>

      {/* Estado demo */}
      <div className="mt-10 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Ejemplo de estados
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Package, label: "Recibido" },
            { icon: CheckCircle2, label: "Pagado" },
            { icon: Package, label: "Preparando" },
            { icon: Truck, label: "En camino" },
          ].map((s, i) => {
            const Icon = s.icon
            return (
              <Card key={i}>
                <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                  <Icon className="h-6 w-6 text-ugarit-700" />
                  <span className="text-sm font-medium">{s.label}</span>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
