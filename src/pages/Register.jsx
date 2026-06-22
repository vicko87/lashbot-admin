import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';



const API_URL = import.meta.env.VITE_API_URL

export default function Register() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user, pass, inviteCode }),
        });
        const data = await res.json();
        if (data.ok) {
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } else {
            setError(data.error || 'Error al regisrarse');
        }
    }

    return (
        <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Crear cuenta</h2>
        <input placeholder="Usuario" value={user} onChange={e => setUser(e.target.value)} />
        <input placeholder="Contraseña" type="password" value={pass} onChange={e => setPass(e.target.value)} />
        <input placeholder="Código de invitación" value={inviteCode} onChange={e => setInviteCode(e.target.value)} />
        {error && <p className="error">{error}</p>}
        {success && <p style={{color:'green'}}>Cuenta creada. Redirigiendo...</p>}
        <button type="submit">Registrarse</button>
        <Link to="/login" className="auth-link">¿Ya tenés cuenta? <span>Iniciar sesión</span></Link>
      </form>
    </div>
  );
}
    