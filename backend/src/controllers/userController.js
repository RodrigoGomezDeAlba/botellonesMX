const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

exports.getAllUsers = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, name, email, role, phone, address, created_at FROM users ORDER BY created_at DESC'
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, name, email, role, phone, address, created_at FROM users WHERE id = ?',
            [req.params.id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener usuario' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                message: 'Error de validación', 
                errors: errors.array() 
            });
        }

        const { name, email, role, phone, address, password } = req.body;
        const userId = req.params.id;

        const [existing] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        let query = 'UPDATE users SET name = ?, email = ?, role = ?, phone = ?, address = ?';
        const values = [name, email, role, phone, address];

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query += ', password = ?';
            values.push(hashedPassword);
        }

        query += ' WHERE id = ?';
        values.push(userId);

        await pool.query(query, values);

        const [updated] = await pool.query(
            'SELECT id, name, email, role, phone, address, created_at FROM users WHERE id = ?',
            [userId]
        );

        res.json({
            message: 'Usuario actualizado exitosamente',
            user: updated[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar usuario' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const [existing] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (userId == req.user.id) {
            return res.status(400).json({ message: 'No puedes eliminar tu propia cuenta' });
        }

        await pool.query('DELETE FROM users WHERE id = ?', [userId]);

        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar usuario' });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT o.*, 
                    (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) AS item_count
             FROM orders o
             WHERE o.user_id = ?
             ORDER BY o.created_at DESC`,
            [req.params.id]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener pedidos del usuario' });
    }
};