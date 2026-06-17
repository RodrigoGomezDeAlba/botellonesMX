const express = require('express');
const { body } = require('express-validator');
const { register, login, getProfile } = require('../controllers/authController');
const { auth } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', [
    body('name').notEmpty().withMessage('El nombre es requerido.'),
    body('email').isEmail().withMessage('Email inválido.'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
    body('phone').optional().isString(),
    body('address').optional().isString()
], register);

router.post('/login', [
    body('email').isEmail().withMessage('Email inválido.'),
    body('password').notEmpty().withMessage('La contraseña es requerida.')
], login);

router.get('/profile', auth, getProfile);

module.exports = router;