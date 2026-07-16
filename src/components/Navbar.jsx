import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();


    function logout() {
        localStorage.removeItem('token');
        navigate('/login');
    }

    return(
        <nav className="navbar">
            <span className="navbar-brand">Lashbot Admin</span>
            <div className="navbar-links">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/appointments">Citas</Link>
                <Link to="/availability">Disponibilidad</Link>
                <Link to="/schedule">Horario</Link>
                <Link to="/clients">Clientes</Link>
                <Link to="/services">Servicios</Link>
                <Link to="/promotions">Promociones</Link>
                <Link to="/whatsapp">WhatsApp</Link>
                <Link to="/ai-settings">Configuración IA</Link>
                <button onClick={logout}>Cerrar sesión</button>
            </div>
        </nav>
    )
}