import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminProducts from './pages/AdminProducts';
import ProductForm from './pages/ProductForm';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isAuthenticated, loading, user } = useAuth();
    
    if (loading) {
        return <div>Cargando...</div>;
    }
    
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    
    if (adminOnly && user?.role !== 'admin') {
        return <Navigate to="/" />;
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
                    {user?.role === 'admin' && (
                        <>
                            <Link to="/admin">Dashboard</Link>
                            <Link to="/admin/products">Productos</Link>
                        </>
                    )}
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
                <Route path="/admin" element={
                    <ProtectedRoute adminOnly>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/admin/products" element={
                    <ProtectedRoute adminOnly>
                        <AdminProducts />
                    </ProtectedRoute>
                } />
                <Route path="/admin/products/new" element={
                    <ProtectedRoute adminOnly>
                        <ProductForm />
                    </ProtectedRoute>
                } />
                <Route path="/admin/products/edit/:id" element={
                    <ProtectedRoute adminOnly>
                        <ProductForm />
                    </ProtectedRoute>
                } />
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