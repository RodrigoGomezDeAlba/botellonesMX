import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const response = await api.get('/orders/my-orders');
            setOrders(response.data);
            setError(null);
        } catch (err) {
            setError('Error al cargar los pedidos');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Cargando pedidos...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="orders-container">
            <h2>Mis Pedidos</h2>

            {orders.length === 0 ? (
                <p className="empty-orders">No has realizado ningún pedido</p>
            ) : (
                orders.map(order => (
                    <div key={order.id} className="order-card">
                        <div className="order-header">
                            <span className="order-id">Pedido #{order.id}</span>
                            <span className="order-date">
                                {new Date(order.created_at).toLocaleDateString()}
                            </span>
                            <span className={`order-status ${order.status}`}>
                                {order.status}
                            </span>
                        </div>
                        <div className="order-details">
                            <p>Total: ${order.total}</p>
                            <p>Artículos: {order.item_count}</p>
                            <p>Dirección: {order.shipping_address}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default Orders;