import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL

export default function Login() {
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user, pass })
            });
            if (!res.ok) {
                setError('Usuario o contraseña incorrectos');
                return;
            }
            const data = await res.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                navigate('/availability');
            } else {
                setError('Usuario o contraseña incorrectos');
            }
        } catch {
            setError('Error de conexión. Verificá tu red e intentá de nuevo.');
        }
    }

    return (
        <div className="login-container">
              <form className="login-form" onSubmit={handleSubmit}>
        <h2>Lashbot Admin</h2>
        <input placeholder="Usuario" value={user} onChange={e => setUser(e.target.value)} />
        <input placeholder="Contraseña" type="password" value={pass} onChange={e => setPass(e.target.value)} />
        {error && <p className="error">{error}</p>}
        <button type="submit">Entrar</button>
        <Link to="/register" className="auth-link">¿No tenés cuenta? <span>Crear cuenta</span></Link>
      </form>
    </div>
  );
}