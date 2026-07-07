import {useState, useEffect} from "react";
import { apiFetch } from "../api/client";


export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
      // Un solo objeto para todos los filtros
  const [filters, setFilters] = useState({
    date: '', employee: '', service: '', status: '',
  });

  // Cada vez que cambian los filtros, recarga las citas
  useEffect(() => {
    async function loadAppointments() {
      // Convierte los filtros en ?date=...&status=... (ignora los vacíos)
      const params = new URLSearchParams(
        Object.entries(filters).filter(([, v]) => v)
      ).toString();
      const data = await apiFetch(`/appointments?${params}`);
      setAppointments(data);
    }
    loadAppointments();
  }, [filters]);

    // Función genérica para actualizar cualquier filtro
  function updateFilter(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }));
  }
    return (
    <div className="page">
      <h1>Citas</h1>

      <div className="add-form">
        <input type="date" value={filters.date}
          onChange={e => updateFilter('date', e.target.value)} />

        <input type="text" placeholder="Empleado" value={filters.employee}
          onChange={e => updateFilter('employee', e.target.value)} />

        <input type="text" placeholder="Servicio" value={filters.service}
          onChange={e => updateFilter('service', e.target.value)} />

        <select value={filters.status}
          onChange={e => updateFilter('status', e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="confirmada">Confirmada</option>
          <option value="pendiente">Pendiente</option>
          <option value="cancelada">Cancelada</option>
        </select>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Fecha</th><th>Hora</th><th>Cliente</th>
            <th>Servicio</th><th>Empleado</th><th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(a => (
            <tr key={a.id}>
              <td>{a.date}</td>
              <td>{a.time}</td>
              <td>{a.clientName}</td>
              <td>{a.service}</td>
              <td>{a.employee}</td>
              <td><span className={`badge ${a.status}`}>{a.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}