const pool = require('../config/database');
const { validationResult } = require('express-validator');

exports.createOrder = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                message: 'Error de validación', 
                errors: errors.array() 
            });
        }

        const { items, shipping_address, payment_method, notes } = req.body;
        const userId = req.user.id;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'El carrito está vacío' });
        }

        let total = 0;
        const orderItems = [];

        for (const item of items) {
            const [product] = await pool.query(
                'SELECT * FROM products WHERE id = ? AND is_active = 1',
                [item.product_id]
            );

            if (product.length === 0) {
                return res.status(400).json({ 
                    message: `Producto con ID ${item.product_id} no encontrado` 
                });
            }

            if (product[0].stock < item.quantity) {
                return res.status(400).json({ 
                    message: `Stock insuficiente para: ${product[0].name}` 
                });
            }

            total += product[0].price * item.quantity;
            orderItems.push({
                product_id: item.product_id,
                quantity: item.quantity,
                price: product[0].price
            });

            await pool.query(
                'UPDATE products SET stock = stock - ? WHERE id = ?',
                [item.quantity, item.product_id]
            );
        }

        const [orderResult] = await pool.query(
            `INSERT INTO orders (user_id, total, shipping_address, payment_method, notes) 
             VALUES (?, ?, ?, ?, ?)`,
            [userId, total, shipping_address, payment_method, notes]
        );

        const orderId = orderResult.insertId;

        for (const item of orderItems) {
            await pool.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price) 
                 VALUES (?, ?, ?, ?)`,
                [orderId, item.product_id, item.quantity, item.price]
            );
        }

        const [newOrder] = await pool.query(`
            SELECT o.*, u.name AS user_name 
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            WHERE o.id = ?
        `, [orderId]);

        const [orderItemsData] = await pool.query(`
            SELECT oi.*, p.name AS product_name 
            FROM order_items oi
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        `, [orderId]);

        res.status(201).json({
            message: 'Pedido creado exitosamente',
            order: {
                ...newOrder[0],
                items: orderItemsData
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el pedido' });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT o.*, 
                   (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) AS item_count
            FROM orders o
            WHERE o.user_id = ?
            ORDER BY o.created_at DESC
        `, [req.user.id]);

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener pedidos' });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const [order] = await pool.query(`
            SELECT o.*, u.name AS user_name 
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            WHERE o.id = ? AND o.user_id = ?
        `, [req.params.id, req.user.id]);

        if (order.length === 0) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        const [items] = await pool.query(`
            SELECT oi.*, p.name AS product_name, p.image_url
            FROM order_items oi
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        `, [req.params.id]);

        res.json({ ...order[0], items });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el pedido' });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT o.*, u.name AS user_name, u.email AS user_email,
                   (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) AS item_count
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        `);

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener pedidos' });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Estado inválido' });
        }

        const [result] = await pool.query(
            'UPDATE orders SET status = ? WHERE id = ?',
            [status, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        res.json({ message: 'Estado del pedido actualizado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el pedido' });
    }
};