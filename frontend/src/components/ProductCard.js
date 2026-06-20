import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getProductImage } from '../utils/productImages';

const ProductCard = React.memo(({ product, onAddToCart }) => {
    const productImage = getProductImage(product);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        setImageLoaded(false);
    }, [productImage]);

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    return (
        <div className="product-card">
            {productImage && (
                <img
                    src={productImage}
                    alt={product.name}
                    className="product-image"
                    loading="lazy"
                    onLoad={handleImageLoad}
                    style={{ display: imageLoaded ? 'block' : 'none' }}
                />
            )}
            {productImage && !imageLoaded && (
                <div className="image-placeholder">Cargando imagen...</div>
            )}
            <Link to={`/product/${product.id}`} className="product-link">
                <h3>{product.name}</h3>
            </Link>
            <p>{product.description}</p>
            <p className="price">${product.price}</p>
            <p className="stock">Stock: {product.stock}</p>
            <span className="category">{product.category_name || 'Sin categoría'}</span>
            <button
                className="btn-add-cart"
                onClick={() => onAddToCart(product)}
                disabled={product.stock === 0}
            >
                {product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
            </button>
        </div>
    );
});

ProductCard.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        price: PropTypes.number.isRequired,
        stock: PropTypes.number.isRequired,
        category_name: PropTypes.string,
        image_url: PropTypes.string
    }).isRequired,
    onAddToCart: PropTypes.func.isRequired
};

export default ProductCard;