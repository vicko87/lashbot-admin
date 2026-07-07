import { useState, useEffect } from "react";
import { apiFetch } from "../api/client";


export default function AISettings() {
    const [config, setConfig] = useState({
        faq: '', cancelPolicy: '', welcomeMessage: '',
    })

    useEffect (() => {
        async function load() {
            const data = await apiFetch('/ai-config')
            setConfig(data)
        }
        load();
}, []);

async function save() {
    await apiFetch('/ai-config', {
        method: 'POST',
        body: JSON.stringify(config),
    });
    alert('Configuración guardada ✅');
}

function update(key, value) {
    setConfig(prev => ({ ...prev, [key]: value }));
  }

  return (
    <div className="page">
    <h1>Configuración de la IA</h1>
    

    <label>Mensaje de bienvenida</label>
     <textarea value={config.welcomeMessage}
        onChange={e => update('welcomeMessage', e.target.value)} rows={3} />

      <label>Preguntas frecuentes (FAQ)</label>
      <textarea value={config.faq}
        onChange={e => update('faq', e.target.value)} rows={6} />

      <label>Política de cancelación</label>
      <textarea value={config.cancelPolicy}
        onChange={e => update('cancelPolicy', e.target.value)} rows={4} />

      <button onClick={save}>Guardar configuración</button>
    </div>
  )
}