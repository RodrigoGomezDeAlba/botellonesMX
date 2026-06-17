import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/dashboardService';
import { Link } from 'react-router-dom';

function AdminDashboard() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalUsers: 0,
        totalOrders: 0,
        recentProducts: [],
        recentOrders: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            const data = await getDashboardStats();
            setStats(data);
            setError(null);
        } catch (err) {
            setError('Error al cargar el dashboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Cargando dashboard...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="dashboard-container">
            <h2>Dashboard de Administración</h2>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Productos</h3>
                    <p className="stat-number">{stats.totalProducts}</p>
                    <Link to="/admin/products" className="stat-link">Ver productos</Link>
                </div>

                <div className="stat-card">
                    <h3>Usuarios</h3>
                    <p className="stat-number">{stats.totalUsers}</p>
                    <Link to="/admin/users" className="stat-link">Ver usuarios</Link>
                </div>

                <div className="stat-card">
                    <h3>Pedidos</h3>
                    <p className="stat-number">{stats.totalOrders}</p>
                    <Link to="/admin/orders" className="stat-link">Ver pedidos</Link>
                </div>
            </div>

            <div className="dashboard-sections">
                <div className="section">
                    <h3>Productos Recientes</h3>
                    {stats.recentProducts.length === 0 ? (
                        <p>No hay productos recientes</p>
                    ) : (
                        <ul className="recent-list">
                            {stats.recentProducts.map(product => (
                                <li key={product.id}>
                                    <span className="item-name">{product.name}</span>
                                    <span className="item-price">${product.price}</span>
                                    <span className="item-category">{product.category_name || 'Sin categoría'}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="section">
                    <h3>Pedidos Recientes</h3>
                    {stats.recentOrders.length === 0 ? (
                        <p>No hay pedidos recientes</p>
                    ) : (
                        <ul className="recent-list">
                            {stats.recentOrders.map(order => (
                                <li key={order.id}>
                                    <span className="item-name">Pedido #{order.id}</span>
                                    <span className="item-price">${order.total}</span>
                                    <span className="item-status">{order.status}</span>
                                    <span className="item-user">{order.user_name}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;