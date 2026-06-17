import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Catalog() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                setProducts(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar los productos');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <div>Cargando productos...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Catálogo de Productos</h1>
            <div className="product-list">
                {products.map(product => (
                    <div key={product.id} className="product-card">
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p>Precio: ${product.price}</p>
                        <p>Stock: {product.stock}</p>
                        <p>Categoría: {product.category_name || 'Sin categoría'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Catalog;