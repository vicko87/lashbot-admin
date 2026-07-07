import { useState, useEffect } from "react";
import { apiFetch } from "../api/client";


export default function Dashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        async function load() {
      //backend devuelve algo como:
      // { citasHoy: 5, proximas: 12, cancelaciones: 1, nuevosClientes: 3, ingresos: 340 }
      const data = await apiFetch('/dashboard');
      setStats(data);
    }
    load();
  }, []);

  if (!stats) {
    return <div><h1>Cargando...</h1></div>;
  }
    return(
        <div className='page'>
            <h1>Dashboard</h1>
             <div className="stats-grid">
        <StatCard title="Citas de hoy"     value={stats.citasHoy} />
        <StatCard title="Próximas citas"   value={stats.proximas} />
        <StatCard title="Cancelaciones"    value={stats.cancelaciones} />
        <StatCard title="Nuevos clientes"  value={stats.nuevosClientes} />
        <StatCard title="Ingresos (€)"     value={stats.ingresos} />
      </div>
    </div>
  );
}

// Componente pequeño reutilizable para cada tarjeta
function StatCard({ title, value }) {
  return (
    <div className="stat-card">
      <span className="stat-value">{value}</span>
      <span className="stat-title">{title}</span>
    </div>

    );
  }