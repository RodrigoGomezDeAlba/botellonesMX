import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Cart() {
    const { cartItems, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [shippingAddress, setShippingAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (!shippingAddress) {
            setError('La dirección de envío es requerida');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const items = cartItems.map(item => ({
                product_id: item.id,
                quantity: item.quantity
            }));

            const response = await api.post('/orders', {
                items,
                shipping_address: shippingAddress,
                payment_method: paymentMethod || 'No especificado'
            });

            setSuccess(true);
            clearCart();
            setTimeout(() => {
                navigate('/orders');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al procesar el pedido');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="cart-container">
                <h2>Carrito de Compras</h2>
                <p className="empty-cart">Tu carrito está vacío</p>
                <button onClick={() => navigate('/catalog')} className="btn-primary">
                    Ir al Catálogo
                </button>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h2>Carrito de Compras</h2>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">Pedido realizado exitosamente</div>}

            <div className="cart-items">
                {cartItems.map(item => (
                    <div key={item.id} className="cart-item">
                        <div className="cart-item-info">
                            <h3>{item.name}</h3>
                            <p className="cart-item-price">${item.price}</p>
                            <p className="cart-item-category">{item.category_name || 'Sin categoría'}</p>
                        </div>
                        <div className="cart-item-actions">
                            <div className="quantity-control">
                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="btn-remove">
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="cart-summary">
                <div className="cart-total">
                    <h3>Total: ${getTotal().toFixed(2)}</h3>
                </div>

                {isAuthenticated ? (
                    <div className="checkout-form">
                        <div className="form-group">
                            <label>Dirección de Envío</label>
                            <textarea
                                value={shippingAddress}
                                onChange={(e) => setShippingAddress(e.target.value)}
                                rows="3"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Método de Pago</label>
                            <input
                                type="text"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                placeholder="Ej: Tarjeta de crédito, Efectivo"
                            />
                        </div>
                        <button 
                            onClick={handleCheckout} 
                            className="btn-checkout"
                            disabled={loading}
                        >
                            {loading ? 'Procesando...' : 'Realizar Pedido'}
                        </button>
                    </div>
                ) : (
                    <div className="login-prompt">
                        <p>Inicia sesión para realizar tu pedido</p>
                        <button onClick={() => navigate('/login')} className="btn-primary">
                            Iniciar Sesión
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cart;