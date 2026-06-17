const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};

exports.register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                message: 'Error de validación', 
                errors: errors.array() 
            });
        }

        const { name, email, password, phone, address } = req.body;

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'El email ya está registrado.' });
        }

        const userId = await User.create({
            name,
            email,
            password,
            phone,
            address
        });

        const token = generateToken(userId);
        const user = await User.findById(userId);

        res.status(201).json({
            message: 'Usuario registrado exitosamente.',
            token,
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar usuario.' });
    }
};

exports.login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                message: 'Error de validación', 
                errors: errors.array() 
            });
        }

        const { email, password } = req.body;

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        const isPasswordValid = await User.comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        const token = generateToken(user.id);
        const userData = await User.findById(user.id);

        res.json({
            message: 'Login exitoso.',
            token,
            user: userData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al iniciar sesión.' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener perfil.' });
    }
};