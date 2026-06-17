const pool = require('../config/database');
const { validationResult } = require('express-validator');

exports.getAllProducts = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.*, c.name AS category_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.is_active = 1
            ORDER BY p.created_at DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener productos' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.*, c.name AS category_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        `, [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener producto' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                message: 'Error de validación', 
                errors: errors.array() 
            });
        }

        const { name, description, price, stock, image_url, category_id } = req.body;
        
        const [result] = await pool.query(
            `INSERT INTO products (name, description, price, stock, image_url, category_id) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [name, description, price, stock, image_url, category_id || null]
        );
        
        const [newProduct] = await pool.query(`
            SELECT p.*, c.name AS category_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        `, [result.insertId]);
        
        res.status(201).json({
            message: 'Producto creado exitosamente',
            product: newProduct[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear producto' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                message: 'Error de validación', 
                errors: errors.array() 
            });
        }

        const { name, description, price, stock, image_url, category_id, is_active } = req.body;
        
        const [result] = await pool.query(
            `UPDATE products 
             SET name = ?, description = ?, price = ?, stock = ?, 
                 image_url = ?, category_id = ?, is_active = ?
             WHERE id = ?`,
            [name, description, price, stock, image_url, category_id || null, is_active !== undefined ? is_active : 1, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        
        const [updatedProduct] = await pool.query(`
            SELECT p.*, c.name AS category_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        `, [req.params.id]);
        
        res.json({
            message: 'Producto actualizado exitosamente',
            product: updatedProduct[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar producto' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM products WHERE id = ?',
            [req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        
        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar producto' });
    }
};