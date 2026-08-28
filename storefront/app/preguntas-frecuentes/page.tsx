import type { Metadata } from "next"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description: "Resolvemos tus dudas sobre compras, pagos, envíos y devoluciones en UGARIT.",
}

const FAQ = [
  {
    q: "¿Cuánto demora el envío?",
    a: "Los envíos a todo Chile demoran entre 2 y 5 días hábiles dependiendo de la región. En Puerto Montt y zonas cercanas, podemos entregar en 24-48h. Para productos digitales, la entrega es inmediata por email.",
  },
  {
    q: "¿Qué métodos de pago aceptan?",
    a: "Webpay (Transbank) con tarjetas Visa, Mastercard, Redcompra y CMR. También Mercado Pago con hasta 12 cuotas sin interés. Para empresas, aceptamos transferencia bancaria con plazo de pago a 30 días (sujeto a evaluación).",
  },
  {
    q: "¿Emiten factura electrónica?",
    a: "Sí, emitimos boleta o factura electrónica (DTE) según prefieras. La factura requiere RUT de empresa. El documento se envía automáticamente por email después del pago.",
  },
  {
    q: "¿Las licencias de software son originales?",
    a: "100% originales. Somos revendedores autorizados de Microsoft, Adobe y otros proveedores. Cada licencia incluye activación legítima y soporte del fabricante.",
  },
  {
    q: "¿Puedo devolver un producto?",
    a: "Sí, tienes 10 días para devolver un producto sin uso, en su empaque original. Los productos digitales (licencias ya activadas) no tienen devolución. Para devoluciones, escríbenos a contacto@ugarit.cl.",
  },
  {
    q: "¿Hacen entregas en regiones?",
    a: "Sí, enviamos a todo Chile vía Chilexpress y BlueExpress. El costo y plazo depende de la región, lo calculamos en el checkout.",
  },
  {
    q: "¿Tienen descuentos por volumen?",
    a: "Sí, para empresas y compras sobre 5 unidades del mismo producto. Escríbenos a ventas@ugarit.cl con tu RUT y te enviamos cotización personalizada.",
  },
  {
    q: "¿Cómo puedo rastrear mi pedido?",
    a: "Una vez despachado, te enviamos el número de tracking de Chilexpress o BlueExpress por email. También puedes consultarlo en la sección 'Sigue tu pedido'.",
  },
] as const

export default function FaqPage() {
  return (
    <div className="container py-12 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Preguntas frecuentes</h1>
      <p className="text-muted-foreground mb-8">
        Las dudas más comunes de nuestros clientes. Si no encuentras tu respuesta, escríbenos.
      </p>
      <Accordion type="single" className="w-full">
        {FAQ.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger>{item.q}</AccordionTrigger>
            <AccordionContent>{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
