import { useState, useEffect } from "react";
import { apiFetch } from "../api/client";

// Configuración de cada tarjeta: título, clave del dato, icono y color de acento
const CARDS = [
  { key: "citasHoy",       title: "Citas de hoy",    accent: "#7c3aed", soft: "rgba(124,58,237,0.15)", icon: CalendarIcon },
  { key: "proximas",       title: "Próximas citas",  accent: "#a855f7", soft: "rgba(168,85,247,0.15)", icon: ClockIcon },
  { key: "cancelaciones",  title: "Cancelaciones",   accent: "#f59e0b", soft: "rgba(245,158,11,0.15)", icon: XCircleIcon },
  { key: "nuevosClientes", title: "Nuevos clientes", accent: "#22c55e", soft: "rgba(34,197,94,0.15)",  icon: UserPlusIcon },
  { key: "ingresos",       title: "Ingresos (€)",    accent: "#e94560", soft: "rgba(233,69,96,0.15)",  icon: EuroIcon },
];


export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function load() {
      // backend devuelve algo como:
      // { citasHoy: 5, proximas: 12, cancelaciones: 1, nuevosClientes: 3, ingresos: 340 }
      const data = await apiFetch("/dashboard");
      setStats(data);
    }
    load();
  }, []);

  return (
    <div className="page dashboard">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        {CARDS.map(card => (
          <StatCard
            key={card.key}
            title={card.title}
            value={stats ? stats[card.key] : null}
            accent={card.accent}
            soft={card.soft}
            Icon={card.icon}
            loading={!stats}
          />
        ))}
      </div>
    </div>
  );
}

// Tarjeta reutilizable. Muestra skeleton mientras carga.
function StatCard({ title, value, accent, soft, Icon, loading }) {
  return (
    <div className="stat-card" style={{ "--card-accent": accent, "--card-accent-soft": soft }}>
      <div className="stat-icon">
        <Icon />
      </div>
      {loading ? (
        <span className="stat-value skeleton">&nbsp;</span>
      ) : (
        <span className="stat-value">{value ?? "—"}</span>
      )}
      <span className="stat-title">{title}</span>
    </div>
  );
}

/* ── Iconos SVG (línea, heredan el color con currentColor) ── */
function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
function XCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  );
}
function UserPlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M19 8v6M22 11h-6" />
    </svg>
  );
}
function EuroIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <path d="M14.5 4A6.5 6.5 0 1 0 14.5 20M4 10h8M4 14h7" />
    </svg>
  );
}
