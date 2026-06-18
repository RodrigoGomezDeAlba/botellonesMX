import React, { useState, useEffect, useRef } from 'react';
import { getProducts } from '../services/productService';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

function Catalog() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();
    const searchInput = useRef(null);

    useEffect(() => {
        const abortController = new AbortController();

        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await getProducts();
                setProducts(data);
                setFilteredProducts(data);
                setError(null);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError('Error al cargar los productos');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();

        return () => {
            abortController.abort();
        };
    }, []);

    const handleSearch = () => {
        const searchTerm = searchInput.current.value.toLowerCase().trim();
        if (!searchTerm) {
            setFilteredProducts(products);
            return;
        }
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description?.toLowerCase().includes(searchTerm)
        );
        setFilteredProducts(filtered);
    };

    const handleAddToCart = (product) => {
        addToCart(product);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
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

            <div className="search-container">
                <input
                    type="text"
                    ref={searchInput}
                    placeholder="Buscar productos..."
                    onChange={handleSearch}
                    onKeyDown={handleKeyDown}
                    className="search-input"
                />
                <button onClick={handleSearch} className="btn-search">
                    Buscar
                </button>
                {searchInput.current?.value && (
                    <button
                        onClick={() => {
                            searchInput.current.value = '';
                            handleSearch();
                        }}
                        className="btn-clear"
                    >
                        Limpiar
                    </button>
                )}
            </div>

            {filteredProducts.length === 0 ? (
                <p className="no-results">No se encontraron productos</p>
            ) : (
                <div className="product-list">
                    {filteredProducts.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={handleAddToCart}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Catalog;