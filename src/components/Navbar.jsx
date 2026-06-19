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
                <Link to="/availability">Disponibilidad</Link>
                <Link to="/clients">Clientes</Link>
                <button onClick={logout}>Cerrar sesión</button>
            </div>
        </nav>
    )
}