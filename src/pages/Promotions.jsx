import { useState, useEffect } from "react";
import { apiFetch } from "../api/client";

// Un objeto vacío para reiniciar el formulario
const EMPTY = {
  name: '',
  type: 'descuento',   // descuento | 2x1 | primera_visita | cumpleanos | vip
  value: '',           // ej: 20 (para 20%)
  startDate: '',
  endDate: '',
};

export default function Promotions() {
  const [promotions, setPromotions] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null); // null = creando, id = editando

  useEffect(() => { loadPromotions(); }, []);

  async function loadPromotions() {
    const data = await apiFetch('/promotions');
    setPromotions(data);
  }

  async function savePromotion() {
    if (editingId) {
      // Editar (PUT)
      await apiFetch(`/promotions/${editingId}`, {
        method: 'PUT',
        body: JSON.stringify(form),
      });
    } else {
      // Crear (POST)
      await apiFetch('/promotions', {
        method: 'POST',
        body: JSON.stringify(form),
      });
    }
    setForm(EMPTY);       // limpiar formulario
    setEditingId(null);
    loadPromotions();     // recargar lista
  }

  function editPromotion(promo) {
    setForm(promo);       // rellenar formulario con los datos
    setEditingId(promo.id);
  }

  async function deletePromotion(id) {
    await apiFetch(`/promotions/${id}`, { method: 'DELETE' });
    loadPromotions();
  }

  function updateForm(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  return (
    <div className="page">
      <h1>Promociones</h1>

      <div className="add-form">
        <input placeholder="Nombre de la oferta" value={form.name}
          onChange={e => updateForm('name', e.target.value)} />

        <select value={form.type}
          onChange={e => updateForm('type', e.target.value)}>
          <option value="descuento">Descuento %</option>
          <option value="2x1">2x1</option>
          <option value="primera_visita">Primera visita</option>
          <option value="cumpleanos">Cumpleaños</option>
          <option value="vip">Cliente VIP</option>
        </select>

        <input type="number" placeholder="Valor (ej: 20)" value={form.value}
          onChange={e => updateForm('value', e.target.value)} />

        <input type="date" value={form.startDate}
          onChange={e => updateForm('startDate', e.target.value)} />
        <input type="date" value={form.endDate}
          onChange={e => updateForm('endDate', e.target.value)} />

        <button onClick={savePromotion}>
          {editingId ? 'Guardar cambios' : 'Crear promoción'}
        </button>
      </div>

      <div className="service-list">
        {promotions.map(p => (
          <div key={p.id} className="service-card">
            <strong>{p.name}</strong>
            <span>{p.type} {p.value ? `· ${p.value}%` : ''}</span>
            <p>{p.startDate} → {p.endDate}</p>
            <div>
              <button onClick={() => editPromotion(p)}>Editar</button>
              <button onClick={() => deletePromotion(p.id)}>Borrar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
