import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { useCart } from '../context/CartContext';

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {
        const abortController = new AbortController();

        const fetchProduct = async () => {
            try {
                setLoading(true);
                const data = await getProductById(id);
                setProduct(data);
                setError(null);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError('Error al cargar el producto');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();

        return () => {
            abortController.abort();
        };
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product);
    };

    if (loading) return <div className="loading">Cargando producto...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!product) return <div className="error-message">Producto no encontrado</div>;

    return (
        <div className="product-detail">
            <Link to="/catalog" className="back-link">← Volver al catálogo</Link>
            <div className="product-detail-card">
                {product.image_url && (
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="product-detail-image"
                    />
                )}
                <h1>{product.name}</h1>
                <p className="detail-description">{product.description}</p>
                <p className="detail-price">${product.price}</p>
                <p className="detail-stock">Stock: {product.stock} unidades</p>
                <p className="detail-category">Categoría: {product.category_name || 'Sin categoría'}</p>
                <button
                    className="btn-add-cart"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                >
                    {product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
                </button>
            </div>
        </div>
    );
}

export default ProductDetail;
