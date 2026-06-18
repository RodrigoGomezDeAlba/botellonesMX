const express = require('express');
const { body } = require('express-validator');
const {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus
} = require('../controllers/orderController');
const { auth, admin } = require('../middlewares/auth');

const router = express.Router();

router.post('/', [
    auth,
    body('items').isArray().withMessage('El carrito debe ser un array'),
    body('shipping_address').notEmpty().withMessage('La dirección de envío es requerida')
], createOrder);

router.get('/my-orders', auth, getMyOrders);
router.get('/my-orders/:id', auth, getOrderById);
router.get('/all', [auth, admin], getAllOrders);
router.put('/:id/status', [auth, admin], updateOrderStatus);

module.exports = router;