import React, { useState, useEffect } from 'react';
import api from '../services/api';

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const response = await api.get('/orders/all');
            setOrders(response.data);
            setError(null);
        } catch (err) {
            setError('Error al cargar los pedidos');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            loadOrders();
        } catch (err) {
            setError('Error al actualizar el estado');
        }
    };

    const getStatusBadgeClass = (status) => {
        const classes = {
            'pendiente': 'status-pendiente',
            'pagado': 'status-pagado',
            'enviado': 'status-enviado',
            'entregado': 'status-entregado',
            'cancelado': 'status-cancelado'
        };
        return classes[status] || 'status-pendiente';
    };

    if (loading) return <div className="loading">Cargando pedidos...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h2>Gestión de Pedidos</h2>
                <span className="order-count">Total: {orders.length} pedidos</span>
            </div>

            {orders.length === 0 ? (
                <p>No hay pedidos registrados</p>
            ) : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Usuario</th>
                            <th>Email</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>#{order.id}</td>
                                <td>{order.user_name}</td>
                                <td>{order.user_email}</td>
                                <td>${order.total}</td>
                                <td>
                                    <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                <td>
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className="status-select"
                                    >
                                        <option value="pendiente">Pendiente</option>
                                        <option value="pagado">Pagado</option>
                                        <option value="enviado">Enviado</option>
                                        <option value="entregado">Entregado</option>
                                        <option value="cancelado">Cancelado</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AdminOrders;