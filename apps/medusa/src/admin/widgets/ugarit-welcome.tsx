import { defineWidgetConfig } from "@medusajs/admin-sdk"

/**
 * UGARIT · Widget de bienvenida en el dashboard
 * Aparece en la home del panel /admin.
 */

const linkStyle: React.CSSProperties = {
  padding: "12px 16px",
  background: "rgba(255,255,255,0.1)",
  borderRadius: "8px",
  color: "#fff",
  textDecoration: "none",
  fontSize: "14px",
  border: "1px solid rgba(255,255,255,0.1)",
}

const UgaritWelcome = () => {
  return (
    <div
      style={{
        padding: "24px",
        background: "linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 100%)",
        color: "#ffffff",
        borderRadius: "12px",
        marginBottom: "24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <img
          src="/ugarit-logo-corporate.png"
          alt="UGARIT"
          style={{
            height: "56px",
            width: "auto",
            background: "#ffffff",
            padding: "8px 12px",
            borderRadius: "8px",
          }}
        />
        <div>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>
            Bienvenido al panel de UGARIT
          </h2>
          <p style={{ margin: "4px 0 0", opacity: 0.9, fontSize: "14px" }}>
            Importadora y Comercializadora Ugarit Limitada · RUT 77.316.893-8
          </p>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "12px",
          marginTop: "20px",
        }}
      >
        <a href="/admin/products" style={linkStyle}>
          📦 Gestionar productos
        </a>
        <a href="/admin/orders" style={linkStyle}>
          🧾 Ver pedidos
        </a>
        <a href="/admin/customers" style={linkStyle}>
          👥 Clientes
        </a>
        <a
          href="https://ugarit.cl"
          target="_blank"
          rel="noreferrer"
          style={linkStyle}
        >
          🌐 Ver tienda en vivo
        </a>
      </div>
    </div>
  )
}

// Zona del dashboard principal
export const config = defineWidgetConfig({
  zone: "product.list.before",
})

export default UgaritWelcome
