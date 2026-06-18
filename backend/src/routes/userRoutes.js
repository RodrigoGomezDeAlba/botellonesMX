const express = require('express');
const { body } = require('express-validator');
const {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserOrders
} = require('../controllers/userController');
const { auth, admin } = require('../middlewares/auth');

const router = express.Router();

router.get('/', [auth, admin], getAllUsers);
router.get('/:id', [auth, admin], getUserById);
router.get('/:id/orders', [auth, admin], getUserOrders);

router.put('/:id', [
    auth,
    admin,
    body('name').notEmpty().withMessage('El nombre es requerido'),
    body('email').isEmail().withMessage('Email inválido'),
    body('role').isIn(['admin', 'user']).withMessage('Rol inválido')
], updateUser);

router.delete('/:id', [auth, admin], deleteUser);

module.exports = router;