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

        async function stopBot() {
            if (!window.confirm('¿Seguro que quieres desconectar el bot de WhatsApp?')) return;
            setStatus('loading');
            await apiFetch('/whatsapp/stop', { method: 'POST' });
            setQr(null);
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
        if (status === 'qr' && qr && canvasRef.current) {
            QRCode.toCanvas(canvasRef.current, qr, { width: 256 }, err => {
                if (err) console.error('Error al dibujar el QR:', err);
            });
        }
    }, [qr, status]);
  // Traduce el estado técnico a un texto y color para la dueña
  const STATUS_INFO = {
    loading:      { label: 'Cargando…',            cls: 'muted' },
    not_started:  { label: 'Sin iniciar',          cls: 'muted' },
    disconnected: { label: 'Desconectado',         cls: 'danger' },
    qr:           { label: 'Esperando escaneo',    cls: 'warn' },
    initializing: { label: 'Iniciando…',           cls: 'warn' },
    ready:        { label: 'Conectado',            cls: 'ok' },
    error:        { label: 'Error de conexión',    cls: 'danger' },
  };
  const info = STATUS_INFO[status] || { label: status, cls: 'muted' };

  return (
    <div className="page whatsapp">
      <h1>WhatsApp Bot</h1>

      <div className="wa-card">
        <div className="wa-status">
          <span className={`wa-dot ${info.cls}`} />
          <span>Estado: <strong>{info.label}</strong></span>
        </div>

        {(status === 'not_started' || status === 'disconnected') && (
          <button className="wa-connect" onClick={startBot}>
            Conectar WhatsApp
          </button>
        )}

        {status === 'qr' && qr && (
          <div className="wa-qr">
            <p>Escanea este código con tu WhatsApp:</p>
            <canvas ref={canvasRef} />
            <small>WhatsApp › Dispositivos vinculados › Vincular dispositivo</small>
          </div>
        )}

        {status === 'initializing' && (
          <p className="wa-hint">⏳ Iniciando el bot, espera unos segundos…</p>
        )}

        {status === 'ready' && (
          <p className="wa-hint ok">✅ Bot conectado y funcionando</p>
        )}

        {(status === 'ready' || status === 'qr' || status === 'initializing') && (
          <button className="wa-disconnect" onClick={stopBot}>
            Desconectar WhatsApp
          </button>
        )}
      </div>
    </div>
  );
}