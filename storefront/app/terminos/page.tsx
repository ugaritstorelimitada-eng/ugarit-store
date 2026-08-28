import type { Metadata } from "next"
import { SITE } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: `Términos y condiciones de uso de ${SITE.name}.`,
}

export default function TerminosPage() {
  return (
    <div className="container py-12 max-w-3xl prose prose-sm max-w-none">
      <h1>Términos y condiciones</h1>
      <p className="text-muted-foreground">Última actualización: agosto 2026</p>

      <h2>1. Identificación del proveedor</h2>
      <p>
        {SITE.legalName}, RUT {SITE.rut}, con domicilio en {SITE.city}, {SITE.region_label}, Chile.
        Para efectos del presente contrato, se denominará &ldquo;UGARIT&rdquo; o &ldquo;el proveedor&rdquo;.
      </p>

      <h2>2. Aceptación de los términos</h2>
      <p>
        Al utilizar este sitio web y/o realizar una compra, el usuario acepta los presentes términos y
        condiciones. Si no está de acuerdo con alguno de estos términos, le solicitamos no utilizar el sitio.
      </p>

      <h2>3. Productos y precios</h2>
      <p>
        Todos los precios están expresados en pesos chilenos (CLP) e incluyen IVA. Los precios pueden
        cambiar sin previo aviso. Las imágenes son referenciales.
      </p>

      <h2>4. Pagos</h2>
      <p>
        Aceptamos pagos mediante Webpay (Transbank), Mercado Pago y transferencia bancaria para empresas.
        El procesamiento del pago se realiza a través de plataformas seguras con encriptación SSL.
      </p>

      <h2>5. Despachos y entregas</h2>
      <p>
        Los plazos de entrega son referenciales y dependen del transportista (Chilexpress o BlueExpress).
        UGARIT no se responsabiliza por retrasos atribuibles al transportista o fuerza mayor.
      </p>

      <h2>6. Política de devoluciones</h2>
      <p>
        El usuario tiene derecho a retracto dentro de 10 días desde la recepción, conforme al artículo 3
        bis de la Ley 19.496. Los productos deben estar sin uso, en su empaque original.
        Los productos digitales (licencias ya activadas) no son susceptibles de devolución.
      </p>

      <h2>7. Garantía</h2>
      <p>
        Todos los productos cuentan con garantía legal de 6 meses para productos nuevos y 3 meses para
        productos usados o reacondicionados, según la Ley 19.496.
      </p>

      <h2>8. Datos personales</h2>
      <p>
        El tratamiento de datos personales se realiza conforme a la Ley 19.628 y la Política de Privacidad
        disponible en este sitio.
      </p>

      <h2>9. Contacto</h2>
      <p>
        Para cualquier consulta: <a href={`mailto:${SITE.email}`}>{SITE.email}</a> · WhatsApp {SITE.whatsappDisplay}
      </p>
    </div>
  )
}
