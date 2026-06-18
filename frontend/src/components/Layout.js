import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Layout({ children }) {
    const { user, logout, isAuthenticated } = useAuth();
    const { getItemCount } = useCart();

    return (
        <div className="App">
            <nav className="navbar">
                <h1>BotellonesMX</h1>
                <div className="nav-links">
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
            </footer>
        </div>
    );
}

export default Layout;