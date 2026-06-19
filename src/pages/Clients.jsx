import { useState, useEffect } from 'react';
import { apiFetch } from '../api/client';

export default function Clients() {
  const [clients, setClients] = useState({});
  const [selected, setSelected] = useState(null);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await apiFetch('/clients');
      setClients(data);
    }
    load();
  }, []);

  async function selectClient(phone) {
    setSelected(phone);
    const msgs = await apiFetch(`/clients/conversations/${phone}`);
    setConversations(msgs);
  }

  return (
    <div className="page">
      <h1>Clientes</h1>
      <div className="clients-layout">
        <div className="clients-list">
          {Object.entries(clients).map(([phone, client]) => (
            <div key={phone} className={`client-item ${selected === phone ? 'active' : ''}`}
              onClick={() => selectClient(phone)}>
              <strong>{client.name || 'Sin nombre'}</strong>
              <span>{phone}</span>
              <small>{client.visitCount || 0} visitas</small>
            </div>
          ))}
        </div>
        {selected && (
          <div className="conversations">
            <h3>Conversación — {clients[selected]?.name || selected}</h3>
            {conversations.map((m, i) => (
              <div key={i} className={`message ${m.role}`}>
                <p>{m.content}</p>
                <small>{new Date(m.created_at).toLocaleString()}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}