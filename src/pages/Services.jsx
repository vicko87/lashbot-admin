import {useState, useEffect} from "react";
import { apiFetch } from "../api/client";

const EMPTY = { name: '', price: '', duration: '', description: '' };

export default function Services() {
    const [services, setServices] = useState([]);
    const [form, setForm] = useState(EMPTY);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => { loadServices(); }, []);

    async function loadServices() {
        const data = await apiFetch('/services');
        setServices(data);
    }

    async function saveService() {
        if (editingId) {
            //Editar Put
            await apiFetch(`/services/${editingId}`, {
                method: 'PUT',
                body: JSON.stringify(form),
            });
        } else {
            //Crear Post
            await apiFetch('/services', {
                method: 'POST',
                body: JSON.stringify(form),
            });
        }
        setForm(EMPTY); //limpiar formulario
        setEditingId(null);
        loadServices(); //recargar lista
    }

    function editService(service) {
        setForm(service); //rellenar formulario con los datos del servicio
        setEditingId(service.id);
    }

    async function deleteService(id) {
        await apiFetch(`/services/${id}`, { method: 'DELETE' });
        loadServices(); //recargar lista
    }
    function updateForm(key, value) {
        setForm(prev => ({ ...prev, [key]: value }));
    }
    return (
    <div className="page">
      <h1>Servicios</h1>

      <div className="add-form">
        <input placeholder="Nombre" value={form.name}
          onChange={e => updateForm('name', e.target.value)} />
        <input type="number" placeholder="Precio €" value={form.price}
          onChange={e => updateForm('price', e.target.value)} />
        <input type="number" placeholder="Duración (min)" value={form.duration}
          onChange={e => updateForm('duration', e.target.value)} />
        <input placeholder="Descripción" value={form.description}
          onChange={e => updateForm('description', e.target.value)} />
        <button onClick={saveService}>
          {editingId ? 'Guardar cambios' : 'Crear servicio'}
        </button>
      </div>

      <div className="service-list">
        {services.map(s => (
          <div key={s.id} className="service-card">
            <strong>{s.name}</strong>
            <span>{s.price} € · {s.duration} min</span>
            <p>{s.description}</p>
            <div>
              <button onClick={() => editService(s)}>Editar</button>
              <button onClick={() => deleteService(s.id)}>Borrar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
