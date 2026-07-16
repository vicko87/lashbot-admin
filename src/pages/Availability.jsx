import { useState, useEffect } from 'react';
import { apiFetch } from '../api/client';

const DAY_NAMES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

// Convierte un objeto Date a "YYYY-MM-DD" (clave que usan los endpoints)
function toKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function Availability() {
  const [slots, setSlots] = useState({});       // { "2026-07-15": ["09:00", "10:00"] }
  const [holidays, setHolidays] = useState([]);  // [{ id, date, reason }]

  const [viewDate, setViewDate] = useState(new Date()); // mes que se muestra
  const [selected, setSelected] = useState(toKey(new Date())); // día seleccionado (clave)

  const [time, setTime] = useState('');
  const [holidayReason, setHolidayReason] = useState('');

  useEffect(() => {
    loadSlots();
    loadHolidays();
  }, []);

  async function loadSlots() {
    const data = await apiFetch('/availability');
    setSlots(data || {});
  }

  async function loadHolidays() {
    const data = await apiFetch('/holidays');
    setHolidays(data || []);
  }

  // ── Horarios ──
  async function addSlot() {
    if (!selected || !time) return;
    const current = slots[selected] || [];
    if (current.includes(time)) return;
    await apiFetch('/availability', {
      method: 'POST',
      body: JSON.stringify({ date: selected, slots: [...current, time].sort() }),
    });
    loadSlots();
    setTime('');
  }

  async function deleteSlot(d, t) {
    await apiFetch(`/availability/${d}/${t}`, { method: 'DELETE' });
    loadSlots();
  }

  // ── Vacaciones / festivos ──
  async function blockDay() {
    if (!selected) return;
    await apiFetch('/holidays', {
      method: 'POST',
      body: JSON.stringify({ date: selected, reason: holidayReason }),
    });
    loadHolidays();
    setHolidayReason('');
  }

  async function deleteHoliday(id) {
    await apiFetch(`/holidays/${id}`, { method: 'DELETE' });
    loadHolidays();
  }

  // ── Navegación del mes ──
  function changeMonth(delta) {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  }

  // ── Construir las celdas del calendario ──
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  // getDay(): 0=Dom ... 6=Sáb. Lo convertimos para empezar en Lunes.
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null); // huecos antes del día 1
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d));
  }

  // Datos del día seleccionado
  const selectedSlots = slots[selected] || [];
  const selectedHoliday = holidays.find(h => h.date === selected);
  const holidayDates = new Set(holidays.map(h => h.date));

  return (
    <div className="page availability">
      <h1>Disponibilidad</h1>

      <div className="calendar-layout">
        {/* ── Calendario ── */}
        <div className="calendar">
          <div className="calendar-header">
            <button onClick={() => changeMonth(-1)} aria-label="Mes anterior">‹</button>
            <span>{MONTH_NAMES[month]} {year}</span>
            <button onClick={() => changeMonth(1)} aria-label="Mes siguiente">›</button>
          </div>

          <div className="calendar-grid">
            {DAY_NAMES.map(dn => (
              <span key={dn} className="calendar-dayname">{dn}</span>
            ))}

            {cells.map((date, i) => {
              if (!date) return <span key={`empty-${i}`} className="calendar-cell empty" />;
              const key = toKey(date);
              const hasSlots = (slots[key] || []).length > 0;
              const isHoliday = holidayDates.has(key);
              const isSelected = key === selected;
              const isToday = key === toKey(new Date());

              const cls = [
                'calendar-cell',
                isSelected && 'selected',
                isToday && 'today',
                isHoliday && 'holiday',
              ].filter(Boolean).join(' ');

              return (
                <button key={key} className={cls} onClick={() => setSelected(key)}>
                  {date.getDate()}
                  {hasSlots && !isHoliday && <span className="dot" />}
                </button>
              );
            })}
          </div>

          <div className="calendar-legend">
            <span><span className="dot" /> Con horarios</span>
            <span><span className="dot holiday-dot" /> Bloqueado</span>
          </div>
        </div>

        {/* ── Panel del día seleccionado ── */}
        <div className="day-panel">
          <h3>{selected ? formatLong(selected) : 'Selecciona un día'}</h3>

          {selectedHoliday ? (
            <div className="holiday-banner">
              🔴 Día bloqueado{selectedHoliday.reason ? ` — ${selectedHoliday.reason}` : ''}
              <button onClick={() => deleteHoliday(selectedHoliday.id)}>Desbloquear</button>
            </div>
          ) : (
            <>
              <div className="panel-section">
                <label>Horarios disponibles</label>
                <div className="slots">
                  {selectedSlots.length === 0 && (
                    <span className="empty-hint">Sin horarios aún</span>
                  )}
                  {selectedSlots.map(t => (
                    <span key={t} className="slot">
                      {t} <button onClick={() => deleteSlot(selected, t)}>✕</button>
                    </span>
                  ))}
                </div>
                <div className="add-form compact">
                  <input type="time" value={time} onChange={e => setTime(e.target.value)} />
                  <button onClick={addSlot}>Agregar horario</button>
                </div>
              </div>

              <div className="panel-section">
                <label>Bloquear día (vacaciones / festivo)</label>
                <div className="add-form compact">
                  <input type="text" placeholder="Motivo (opcional)"
                    value={holidayReason}
                    onChange={e => setHolidayReason(e.target.value)} />
                  <button className="block-btn" onClick={blockDay}>Bloquear día</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// "2026-07-15" → "15 de Julio de 2026"
function formatLong(key) {
  const [y, m, d] = key.split('-').map(Number);
  return `${d} de ${MONTH_NAMES[m - 1]} de ${y}`;
}
