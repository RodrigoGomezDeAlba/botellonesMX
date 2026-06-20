import React, { useState, useEffect } from 'react';
import { getProducts, deleteProduct } from '../services/productService';
import { Link } from 'react-router-dom';

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await getProducts();
            setProducts(data);
            setError(null);
        } catch (err) {
            setError('Error al cargar los productos');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
        
        try {
            await deleteProduct(id);
            setProducts(products.filter(p => p.id !== id));
        } catch (err) {
            setError('Error al eliminar el producto');
        }
    };

    if (loading) return <div className="loading">Cargando productos...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h2>Gestión de Productos</h2>
                <Link to="/admin/products/new" className="btn-primary">
                    Nuevo Producto
                </Link>
            </div>

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Categoría</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>${product.price}</td>
                            <td>{product.stock}</td>
                            <td>{product.category_name || 'Sin categoría'}</td>
                            <td>
                                <Link to={`/admin/products/edit/${product.id}`} className="btn-edit">
                                    Editar
                                </Link>
                                <button 
                                    onClick={() => handleDelete(product.id)} 
                                    className="btn-delete"
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminProducts;
