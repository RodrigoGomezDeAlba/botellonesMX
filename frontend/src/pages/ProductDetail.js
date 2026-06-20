import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { useCart } from '../context/CartContext';
import { getProductImage } from '../utils/productImages';

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const { addToCart } = useCart();

    useEffect(() => {
        const abortController = new AbortController();

        const fetchProduct = async () => {
            try {
                setLoading(true);
                setImageLoaded(false);
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

    useEffect(() => {
        setImageLoaded(false);
    }, [product]);

    const handleAddToCart = () => {
        addToCart(product);
    };

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    if (loading) return <div className="loading">Cargando producto...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!product) return <div className="error-message">Producto no encontrado</div>;

    const productImage = getProductImage(product);

    return (
        <div className="product-detail">
            <Link to="/catalog" className="back-link">← Volver al catálogo</Link>
            <div className="product-detail-card">
                {productImage && (
                    <>
                        <img
                            src={productImage}
                            alt={product.name}
                            className="product-detail-image"
                            onLoad={handleImageLoad}
                            style={{ display: imageLoaded ? 'block' : 'none' }}
                        />
                        {!imageLoaded && (
                            <div className="image-placeholder">Cargando imagen...</div>
                        )}
                    </>
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