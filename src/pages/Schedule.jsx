import { useState, useEffect } from 'react';
import { apiFetch } from '../api/client';

// Los días con su número (0=Dom ... 6=Sáb, como usa el backend)
const DAYS = [
  { num: 1, label: 'Lunes' },
  { num: 2, label: 'Martes' },
  { num: 3, label: 'Miércoles' },
  { num: 4, label: 'Jueves' },
  { num: 5, label: 'Viernes' },
  { num: 6, label: 'Sábado' },
  { num: 0, label: 'Domingo' },
];

export default function ScheduleSettings() {
  const [openDays, setOpenDays] = useState([]);
  const [openTime, setOpenTime] = useState('10:00');
  const [closeTime, setCloseTime] = useState('20:00');

  useEffect(() => {
    async function load() {
      const data = await apiFetch('/schedule');
      setOpenDays(data.openDays || []);
      setOpenTime(data.openTime || '10:00');
      setCloseTime(data.closeTime || '20:00');
    }
    load();
  }, []);

  // Marca o desmarca un día
  function toggleDay(num) {
    setOpenDays(prev =>
      prev.includes(num) ? prev.filter(d => d !== num) : [...prev, num]
    );
  }

  async function save() {
    await apiFetch('/schedule', {
      method: 'POST',
      body: JSON.stringify({ openDays, openTime, closeTime }),
    });
    alert('Horario guardado ✅');
  }

  return (
    <div className="page">
      <h1>Horario del salón</h1>

      <label>Días que abre el salón</label>
      <div className="days-row">
        {DAYS.map(d => (
          <label
            key={d.num}
            className={`day-check ${openDays.includes(d.num) ? 'active' : ''}`}
          >
            <input
              type="checkbox"
              checked={openDays.includes(d.num)}
              onChange={() => toggleDay(d.num)}
            />
            {d.label}
          </label>
        ))}
      </div>

      <label>Hora de apertura</label>
      <input type="time" value={openTime}
        onChange={e => setOpenTime(e.target.value)} />

      <label>Hora de cierre</label>
      <input type="time" value={closeTime}
        onChange={e => setCloseTime(e.target.value)} />

      <button onClick={save}>Guardar horario</button>
    </div>
  );
}
