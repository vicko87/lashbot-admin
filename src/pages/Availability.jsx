import { useState, useEffect } from 'react';
import { apiFetch } from '../api/client';

export default function Availability() {
  const [slots, setSlots] = useState({});
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // --- Vacaciones / festivos / bloqueos ---
  const [holidays, setHolidays] = useState([]);
  const [holidayDate, setHolidayDate] = useState('');
  const [holidayReason, setHolidayReason] = useState('');

  useEffect(() => {
    loadSlots();
    loadHolidays();
  }, []);

  async function loadSlots() {
    const data = await apiFetch('/availability');
    setSlots(data);
  }

  async function loadHolidays() {
    const data = await apiFetch('/holidays');
    setHolidays(data);
  }

  async function addHoliday() {
    if (!holidayDate) return;
    await apiFetch('/holidays', {
      method: 'POST',
      body: JSON.stringify({ date: holidayDate, reason: holidayReason }),
    });
    loadHolidays();
    setHolidayDate('');
    setHolidayReason('');
  }

  async function deleteHoliday(id) {
    await apiFetch(`/holidays/${id}`, { method: 'DELETE' });
    loadHolidays();
  }

  async function addSlot() {
    if (!date || !time) return;
    const current = slots[date] || [];
    if (current.includes(time)) return;
    await apiFetch('/availability', {
      method: 'POST',
      body: JSON.stringify({ date, slots: [...current, time].sort() }),
    });
    loadSlots();
    setTime('');
  }

  async function deleteSlot(d, t) {
    await apiFetch(`/availability/${d}/${t}`, { method: 'DELETE' });
    loadSlots();
  }

  return (
    <div className="page">
      <h1>Disponibilidad</h1>
      <div className="add-form">
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input type="time" value={time} onChange={e => setTime(e.target.value)} />
        <button onClick={addSlot}>Agregar horario</button>
      </div>
      {Object.keys(slots).sort().map(d => (
        <div key={d} className="day-block">
          <h3>{d}</h3>
          <div className="slots">
            {slots[d].map(t => (
              <span key={t} className="slot">
                {t} <button onClick={() => deleteSlot(d, t)}>✕</button>
              </span>
            ))}
          </div>
        </div>
      ))}

      <h2>Vacaciones y días festivos</h2>
      <div className="add-form">
        <input type="date" value={holidayDate}
          onChange={e => setHolidayDate(e.target.value)} />
        <input type="text" placeholder="Motivo (ej: Navidad, vacaciones)"
          value={holidayReason} onChange={e => setHolidayReason(e.target.value)} />
        <button onClick={addHoliday}>Bloquear día</button>
      </div>
      <div className="slots">
        {holidays.map(h => (
          <span key={h.id} className="slot">
            {h.date} {h.reason ? `— ${h.reason}` : ''}
            <button onClick={() => deleteHoliday(h.id)}>✕</button>
          </span>
        ))}
      </div>
    </div>
  );
}