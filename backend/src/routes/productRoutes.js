const express = require('express');
const { body } = require('express-validator');
const { 
    getAllProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/productController');
const { auth, admin } = require('../middlewares/auth');

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);

router.post('/', [
    auth,
    admin,
    body('name').notEmpty().withMessage('El nombre es requerido'),
    body('price').isNumeric().withMessage('El precio debe ser un número'),
    body('stock').isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo')
], createProduct);

router.put('/:id', [
    auth,
    admin,
    body('name').notEmpty().withMessage('El nombre es requerido'),
    body('price').isNumeric().withMessage('El precio debe ser un número'),
    body('stock').isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo')
], updateProduct);

router.delete('/:id', [auth, admin], deleteProduct);

module.exports = router;