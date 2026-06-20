import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById, createProduct, updateProduct } from '../services/productService';
import api from '../services/api';

function ProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        image_url: '',
        category_id: ''
    });
    const [errors, setErrors] = useState({});
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState(null);

    useEffect(() => {
        loadCategories();
        if (isEdit) {
            loadProduct();
        }
    }, [isEdit]);

    const loadCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (err) {
            setGeneralError('Error al cargar categorías');
        }
    };

    const loadProduct = async () => {
        try {
            const product = await getProductById(id);
            setFormData({
                name: product.name,
                description: product.description || '',
                price: product.price,
                stock: product.stock,
                image_url: product.image_url || '',
                category_id: product.category_id || ''
            });
        } catch (err) {
            setGeneralError('Error al cargar el producto');
        }
    };

    const validate = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        } else if (formData.name.trim().length < 3) {
            newErrors.name = 'El nombre debe tener al menos 3 caracteres';
        }
        
        if (!formData.price) {
            newErrors.price = 'El precio es requerido';
        } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
            newErrors.price = 'El precio debe ser un número mayor a 0';
        }
        
        if (!formData.stock) {
            newErrors.stock = 'El stock es requerido';
        } else if (!Number.isInteger(Number(formData.stock)) || parseInt(formData.stock) < 0) {
            newErrors.stock = 'El stock debe ser un número entero mayor o igual a 0';
        }
        
        if (formData.image_url && !/^https?:\/\/.+/.test(formData.image_url) && !formData.image_url.startsWith('/')) {
            newErrors.image_url = 'URL de imagen inválida';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralError(null);
        
        if (!validate()) {
            return;
        }

        setLoading(true);

        try {
            const data = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock)
            };

            if (isEdit) {
                await updateProduct(id, data);
            } else {
                await createProduct(data);
            }
            navigate('/admin/products');
        } catch (err) {
            setGeneralError(err.response?.data?.message || 'Error al guardar el producto');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>{isEdit ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            {generalError && <div className="error-message">{generalError}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={errors.name ? 'input-error' : ''}
                    />
                    {errors.name && <span className="field-error">{errors.name}</span>}
                </div>

                <div className="form-group">
                    <label>Descripción</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                    />
                </div>

                <div className="form-group">
                    <label>Precio</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        className={errors.price ? 'input-error' : ''}
                    />
                    {errors.price && <span className="field-error">{errors.price}</span>}
                </div>

                <div className="form-group">
                    <label>Stock</label>
                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        min="0"
                        className={errors.stock ? 'input-error' : ''}
                    />
                    {errors.stock && <span className="field-error">{errors.stock}</span>}
                </div>

                <div className="form-group">
                    <label>URL de imagen</label>
                    <input
                        type="text"
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleChange}
                        placeholder="ej: https://imagen.com/producto.jpg"
                        className={errors.image_url ? 'input-error' : ''}
                    />
                    {errors.image_url && <span className="field-error">{errors.image_url}</span>}
                </div>

                <div className="form-group">
                    <label>Categoría</label>
                    <select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                    >
                        <option value="">Seleccionar categoría</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'}
                </button>
            </form>
        </div>
    );
}

export default ProductForm;