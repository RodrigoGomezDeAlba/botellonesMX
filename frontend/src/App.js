import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import './App.css';

// Lazy loading para todas las páginas
const Home = lazy(() => import('./pages/Home'));
const Catalog = lazy(() => import('./pages/Catalog'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Cart = lazy(() => import('./pages/Cart'));
const Orders = lazy(() => import('./pages/Orders'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/AdminProducts'));
const AdminUsers = lazy(() => import('./pages/AdminUsers'));
const AdminOrders = lazy(() => import('./pages/AdminOrders'));
const ProductForm = lazy(() => import('./pages/ProductForm'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isAuthenticated, loading, user } = useAuth();

    if (loading) {
        return <div className="loading">Cargando...</div>;
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
                                Dashboard
                            </NavLink>
                            <NavLink
                                to="/admin/products"
                                className={({ isActive }) => (isActive ? 'active-link' : '')}
                            >
                                Productos
                            </NavLink>
                            <NavLink
                                to="/admin/users"
                                className={({ isActive }) => (isActive ? 'active-link' : '')}
                            >
                                Usuarios
                            </NavLink>
                            <NavLink
                                to="/admin/orders"
                                className={({ isActive }) => (isActive ? 'active-link' : '')}
                            >
                                Pedidos
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

            <Suspense fallback={<div className="loading">Cargando página...</div>}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/catalog" element={<Catalog />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/product/:id" element={<ProductDetail />} />

                    <Route
                        path="/orders"
                        element={
                            <ProtectedRoute>
                                <Orders />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute adminOnly>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/products"
                        element={
                            <ProtectedRoute adminOnly>
                                <AdminProducts />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/products/new"
                        element={
                            <ProtectedRoute adminOnly>
                                <ProductForm />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/products/edit/:id"
                        element={
                            <ProtectedRoute adminOnly>
                                <ProductForm />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/users"
                        element={
                            <ProtectedRoute adminOnly>
                                <AdminUsers />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/orders"
                        element={
                            <ProtectedRoute adminOnly>
                                <AdminOrders />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </div>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <AppContent />
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;