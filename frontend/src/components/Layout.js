import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Layout({ children }) {
    const { user, logout, isAuthenticated } = useAuth();
    const { getItemCount } = useCart();
    const [currentTime, setCurrentTime] = useState(new Date());
    const roleLabel = user?.role === 'admin' ? 'Admin' : isAuthenticated ? 'Usuario' : 'Visitante';

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        const handleResize = () => {
            console.log('Ventana redimensionada');
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="App">
            <nav className="navbar">
                <NavLink to="/" className="brand">
                    <img src="/botellones-logo.png" alt="Logo BotellonesMX" className="brand-logo" />
                    <span>BotellonesMX</span>
                </NavLink>
                <div className="nav-links">
                    <span className={`session-badge ${user?.role === 'admin' ? 'admin' : isAuthenticated ? 'user' : 'guest'}`}>
                        {roleLabel}
                    </span>
                    <NavLink
                        to="/"
                        className={({ isActive }) => (isActive ? 'active-link' : '')}
                    >
                        Inicio
                    </NavLink>
                    <NavLink
                        to="/catalog"
                        className={({ isActive }) => (isActive ? 'active-link' : '')}
                    >
                        Catálogo
                    </NavLink>
                    <NavLink
                        to="/cart"
                        className={({ isActive }) => (isActive ? 'active-link' : '')}
                    >
                        Carrito ({getItemCount()})
                    </NavLink>

                    {isAuthenticated && (
                        <NavLink
                            to="/orders"
                            className={({ isActive }) => (isActive ? 'active-link' : '')}
                        >
                            Mis Pedidos
                        </NavLink>
                    )}

                    {user?.role === 'admin' && (
                        <>
                            <NavLink
                                to="/admin"
                                className={({ isActive }) => (isActive ? 'active-link' : '')}
                            >
                                Admin
                            </NavLink>
                        </>
                    )}

                    {isAuthenticated ? (
                        <>
                            <span className="user-name">Hola, {user?.name}</span>
                            <button onClick={logout} className="logout-btn">
                                Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink
                                to="/login"
                                className={({ isActive }) => (isActive ? 'active-link' : '')}
                            >
                                Iniciar Sesión
                            </NavLink>
                            <NavLink
                                to="/register"
                                className={({ isActive }) => (isActive ? 'active-link' : '')}
                            >
                                Registrarse
                            </NavLink>
                        </>
                    )}
                </div>
            </nav>

            <main className="main-content">
                {children}
            </main>

            <footer className="footer">
                <p>BotellonesMX © 2026 - Todos los derechos reservados</p>
                <p className="footer-time">{currentTime.toLocaleTimeString()}</p>
            </footer>
        </div>
    );
}

export default Layout;