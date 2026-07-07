import {useState, useEffect, useRef} from 'react';
import { apiFetch } from '../api/client';
import QRCode from 'qrcode';

export default function WhatsApp() {
    const [status, setStatus] = useState('loading');
    const [qr, setQr] = useState(null);
    const canvasRef = useRef(null);

    async function fetchStatus() {
        try {
            const data = await apiFetch('/whatsapp/status');
            setStatus(data.status);
            setQr(data.qr);
        } catch {
            setStatus('error');
        }
        }

        async function startBot() {
            setStatus('loading');
            await apiFetch('/whatsapp/start', { method: 'POST' });
            fetchStatus();
        }

        useEffect(() => {
            async function load() {
                try {
                    const data = await apiFetch('/whatsapp/status');
                    setStatus(data.status);
                    setQr(data.qr);
                } catch {
                    setStatus('error');
                }
            }
            load();
            const interval = setInterval(load, 5000);
            return () => clearInterval(interval);
        }, []);

    useEffect(() => {
        if (qr && canvasRef.current) {
            QRCode.toCanvas(canvasRef.current, qr, { width: 256 });
        }
    }, [qr]);
             return (
    <div style={{ padding: '2rem' }}>
      <h2>WhatsApp Bot</h2>

      <p>Estado: <strong>{status}</strong></p>

      {status === 'not_started' || status === 'disconnected' ? (
        <button onClick={startBot}>Conectar WhatsApp</button>
      ) : null}

      {status === 'qr' && qr ? (
        <div>
          <p>Escanea este QR con tu WhatsApp:</p>
          <canvas ref={canvasRef} />
        </div>
      ) : null}

      {status === 'ready' ? (
        <p style={{ color: 'green' }}>✅ Bot conectado y funcionando</p>
      ) : null}

      {status === 'initializing' ? (
        <p>⏳ Iniciando...</p>
      ) : null}
    </div>
  );
}