import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../services/productService';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

function Catalog() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();
    const searchInput = useRef(null);

    // Obtener parámetros de la URL
    const categoryFilter = searchParams.get('category') || '';
    const searchFilter = searchParams.get('search') || '';

    useEffect(() => {
        const abortController = new AbortController();

        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Cargar productos
                const productsData = await getProducts();
                setProducts(productsData);
                
                // Cargar categorías
                const categoriesResponse = await api.get('/categories');
                const categoriesData = categoriesResponse.data;
                setCategories(categoriesData);
                
                // Aplicar filtros
                applyFilters(productsData, categoriesData);
                
                setError(null);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError('Error al cargar los datos');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            abortController.abort();
        };
    }, []);

    // Aplicar filtros cuando cambian los parámetros de búsqueda
    useEffect(() => {
        if (products.length > 0) {
            applyFilters(products, categories);
        }
    }, [categoryFilter, searchFilter]);

    const applyFilters = (productsData, categoriesData) => {
        let filtered = [...productsData];

        // Filtrar por categoría (query param)
        if (categoryFilter) {
            const category = categoriesData.find(c => 
                c.name.toLowerCase() === categoryFilter.toLowerCase()
            );
            if (category) {
                filtered = filtered.filter(p => p.category_id === category.id);
            }
        }

        // Filtrar por búsqueda (query param)
        if (searchFilter) {
            const searchLower = searchFilter.toLowerCase();
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchLower) ||
                product.description?.toLowerCase().includes(searchLower)
            );
        }

        setFilteredProducts(filtered);
    };

    const handleSearch = () => {
        const searchTerm = searchInput.current.value.trim();
        // Actualizar query params
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (categoryFilter) params.category = categoryFilter;
        setSearchParams(params);
    };

    const handleCategoryFilter = (categoryName) => {
        const params = {};
        if (categoryName) params.category = categoryName;
        if (searchFilter) params.search = searchFilter;
        setSearchParams(params);
    };

    const clearFilters = () => {
        searchInput.current.value = '';
        setSearchParams({});
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

            {/* Filtros */}
            <div className="filters-container">
                <div className="search-container">
                    <input
                        type="text"
                        ref={searchInput}
                        placeholder="Buscar productos..."
                        onChange={handleSearch}
                        onKeyDown={handleKeyDown}
                        className="search-input"
                        defaultValue={searchFilter}
                    />
                    <button onClick={handleSearch} className="btn-search">
                        Buscar
                    </button>
                    {(categoryFilter || searchFilter) && (
                        <button onClick={clearFilters} className="btn-clear">
                            Limpiar filtros
                        </button>
                    )}
                </div>

                <div className="category-filters">
                    <span className="filter-label">Categorías:</span>
                    <button 
                        className={`filter-btn ${!categoryFilter ? 'active' : ''}`}
                        onClick={() => handleCategoryFilter('')}
                    >
                        Todas
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`filter-btn ${categoryFilter === cat.name.toLowerCase() ? 'active' : ''}`}
                            onClick={() => handleCategoryFilter(cat.name.toLowerCase())}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {(categoryFilter || searchFilter) && (
                    <div className="active-filters">
                        <span>Filtros activos:</span>
                        {categoryFilter && (
                            <span className="filter-tag">
                                Categoría: {categoryFilter}
                            </span>
                        )}
                        {searchFilter && (
                            <span className="filter-tag">
                                Búsqueda: {searchFilter}
                            </span>
                        )}
                    </div>
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
