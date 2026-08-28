import type { Metadata } from "next"
import Link from "next/link"
import { User, Mail, Lock, Building2, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Mi cuenta",
  description: "Ingresa a tu cuenta de UGARIT o regístrate.",
}

export default function CuentaPage() {
  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Mi cuenta</h1>
          <p className="text-muted-foreground mt-1">
            Ingresa o regístrate para continuar
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Ingresar</TabsTrigger>
            <TabsTrigger value="register">Registrarme</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Ingresa a tu cuenta</CardTitle>
                <CardDescription>Accede a tus pedidos y facturas</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="email-login">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email-login"
                        type="email"
                        placeholder="tu@email.cl"
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="password-login">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password-login"
                        type="password"
                        placeholder="••••••••"
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      Recordarme
                    </label>
                    <Link href="#" className="text-ugarit-700 hover:underline">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    <User className="h-4 w-4" />
                    Ingresar
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Crea tu cuenta</CardTitle>
                <CardDescription>Te tomará menos de 1 minuto</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="firstname">Nombre</Label>
                      <Input id="firstname" placeholder="Juan" required />
                    </div>
                    <div>
                      <Label htmlFor="lastname">Apellido</Label>
                      <Input id="lastname" placeholder="Pérez" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="rut">RUT</Label>
                    <Input id="rut" placeholder="12.345.678-9" required />
                  </div>
                  <div>
                    <Label htmlFor="email-reg">Email</Label>
                    <Input id="email-reg" type="email" placeholder="tu@email.cl" required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" type="tel" placeholder="+56 9 1234 5678" />
                  </div>
                  <div>
                    <Label htmlFor="password-reg">Contraseña</Label>
                    <Input id="password-reg" type="password" placeholder="Mínimo 8 caracteres" required />
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <input type="checkbox" className="rounded mt-1" required />
                    <span className="text-muted-foreground">
                      Acepto los{" "}
                      <Link href="/terminos" className="text-ugarit-700 hover:underline">
                        términos y condiciones
                      </Link>{" "}
                      y la política de privacidad.
                    </span>
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    Crear cuenta
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    ¿Eres empresa? Te contactaremos para activar tu cuenta B2B con RUT y lista de precios.
                  </p>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center text-sm text-muted-foreground space-y-1">
          <p className="flex items-center justify-center gap-1">
            <Shield className="h-3 w-3" />
            Tus datos están protegidos con encriptación SSL
          </p>
          <p className="flex items-center justify-center gap-1">
            <Building2 className="h-3 w-3" />
            ¿Compras para tu empresa? <Link href="/contacto" className="text-ugarit-700 hover:underline">Contáctanos</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
