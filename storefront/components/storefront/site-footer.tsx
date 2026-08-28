import Link from "next/link"
import Image from "next/image"
import { Mail, MessageCircle, MapPin, Facebook, Instagram, Linkedin, Lock, Zap, ShieldCheck } from "lucide-react"
import { SITE } from "@/lib/constants"

const PAY_CHIPS = [
  { name: "Webpay Plus", desc: "Débito / Crédito" },
  { name: "Mercado Pago", desc: "Hasta 6 cuotas" },
  { name: "Transferencia", desc: "Factura directa" },
]

const GUARANTEES = [
  { icon: Lock, label: "Transacción Cifrada SSL 256-bit" },
  { icon: Zap, label: "Entrega Digital Inmediata 24/7" },
  { icon: ShieldCheck, label: "Garantía de Activación Oficial" },
]

export function SiteFooter() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Image
              src="/ugarit-logo-corporate.png"
              alt={`${SITE.name} logo`}
              width={140}
              height={36}
              className="h-9 w-auto bg-white p-2 rounded"
            />
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-200">{SITE.legalName}</strong>
              <br />
              RUT {SITE.rut}
              <br />
              Venta y distribución de software, ciberseguridad y soluciones tecnológicas.
            </p>
            <div className="flex gap-3 pt-2">
              <Link href={SITE.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="text-slate-400 hover:text-white">
                <Facebook className="h-4 w-4" />
              </Link>
              <Link href={SITE.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="text-slate-400 hover:text-white">
                <Instagram className="h-4 w-4" />
              </Link>
              <Link href={SITE.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-slate-400 hover:text-white">
                <Linkedin className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
              Software & Licencias
            </h5>
            <ul className="space-y-2 text-sm">
              <li><Link href="/categoria/eset" className="hover:text-eset-400 transition-colors">Ciberseguridad & Antivirus</Link></li>
              <li><Link href="/categoria/software" className="hover:text-white transition-colors">Sistemas Operativos</Link></li>
              <li><Link href="/categoria/software" className="hover:text-white transition-colors">Ofimática y Productividad</Link></li>
              <li><Link href="/categoria/software" className="hover:text-white transition-colors">Soluciones Corporativas B2B</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
              Empresas & Gobierno
            </h5>
            <ul className="space-y-2 text-sm">
              <li><Link href="/mercado-publico" className="hover:text-white transition-colors">Portal Mercado Público</Link></li>
              <li><Link href="/contacto" className="hover:text-white transition-colors">Cotización Empresas (Factura)</Link></li>
              <li><Link href="/software/eset" className="hover:text-eset-400 transition-colors">Alianza ESET Chile</Link></li>
              <li><Link href="/contacto" className="hover:text-white transition-colors">Licitaciones y Convenios</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
              Soporte & Garantía
            </h5>
            <ul className="space-y-2 text-sm mb-6">
              <li><Link href="/preguntas-frecuentes" className="hover:text-white transition-colors">Guía de Activación</Link></li>
              <li><Link href="/preguntas-frecuentes" className="hover:text-white transition-colors">Garantía de Activación</Link></li>
              <li><Link href="/terminos" className="hover:text-white transition-colors">Términos del Servicio</Link></li>
              <li><Link href="/contacto" className="hover:text-white transition-colors">Centro de Ayuda</Link></li>
            </ul>
            <h5 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
              Contacto
            </h5>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <Mail className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <a href={`mailto:${SITE.email}`} className="hover:text-white">{SITE.email}</a>
              </li>
              <li className="flex items-start gap-2">
                <MessageCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <a href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="hover:text-white">
                  {SITE.whatsappDisplay}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <span>{SITE.city}, {SITE.country}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Strip */}
        <div className="border-t border-slate-800 mt-10 pt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-xs text-slate-400 mb-3">Paga 100% seguro con:</p>
              <div className="flex flex-wrap gap-2.5">
                {PAY_CHIPS.map((p) => (
                  <div
                    key={p.name}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-slate-800 border border-slate-700 text-slate-100 text-sm font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-eset-500" />
                    <span>{p.name}</span>
                    <span className="text-xs text-slate-400 border-l border-slate-700 pl-2">
                      {p.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-400">
              {GUARANTEES.map((g) => {
                const Icon = g.icon
                return (
                  <span key={g.label} className="inline-flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 text-eset-500" />
                    {g.label}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-950 border-t border-slate-800">
        <div className="container py-4 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {SITE.legalName}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
