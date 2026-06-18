import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/productService';
import { useCart } from '../context/CartContext';

function Catalog() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar los productos');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleAddToCart = (product) => {
        addToCart(product);
        alert('Producto agregado al carrito');
    };

    if (loading) {
        return <div className="loading">Cargando productos...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div>
            <h2>Catálogo de Productos</h2>
            <div className="product-list">
                {products.map(product => (
                    <div key={product.id} className="product-card">
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p className="price">${product.price}</p>
                        <p className="stock">Stock: {product.stock}</p>
                        <span className="category">{product.category_name || 'Sin categoría'}</span>
                        <button 
                            className="btn-add-cart"
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock === 0}
                        >
                            {product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Catalog;