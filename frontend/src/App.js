import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import Layout from './components/Layout';
import AdminLayout from './pages/AdminLayout';
import './App.css';

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

function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <Suspense fallback={<div className="loading">Cargando página...</div>}>
                        <Routes>
                            <Route path="/" element={<Layout><Home /></Layout>} />
                            <Route path="/catalog" element={<Layout><Catalog /></Layout>} />
                            <Route path="/login" element={<Layout><Login /></Layout>} />
                            <Route path="/register" element={<Layout><Register /></Layout>} />
                            <Route path="/cart" element={<Layout><Cart /></Layout>} />
                            <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
                            
                            <Route path="/orders" element={
                                <ProtectedRoute>
                                    <Layout><Orders /></Layout>
                                </ProtectedRoute>
                            } />

                            <Route path="/admin" element={
                                <ProtectedRoute adminOnly>
                                    <Layout>
                                        <AdminLayout />
                                    </Layout>
                                </ProtectedRoute>
                            }>
                                <Route index element={<AdminDashboard />} />
                                <Route path="products" element={<AdminProducts />} />
                                <Route path="products/new" element={<ProductForm />} />
                                <Route path="products/edit/:id" element={<ProductForm />} />
                                <Route path="users" element={<AdminUsers />} />
                                <Route path="orders" element={<AdminOrders />} />
                            </Route>

                            <Route path="*" element={<Layout><NotFound /></Layout>} />
                        </Routes>
                    </Suspense>
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;