import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return <div>Cargando...</div>;
    }
    
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    
    return children;
};

function AppContent() {
    const { user, logout, isAuthenticated } = useAuth();

    return (
        <div className="App">
            <nav className="navbar">
                <h1>BotellonesMX</h1>
                <div className="nav-links">
                    <Link to="/">Inicio</Link>
                    <Link to="/catalog">Catálogo</Link>
                    {isAuthenticated ? (
                        <>
                            <span className="user-name">Hola, {user?.name}</span>
                            <button onClick={logout} className="logout-btn">Cerrar Sesión</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Iniciar Sesión</Link>
                            <Link to="/register">Registrarse</Link>
                        </>
                    )}
                </div>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </div>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}

export default App;