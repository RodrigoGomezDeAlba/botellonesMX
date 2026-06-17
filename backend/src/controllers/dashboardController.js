const pool = require('../config/database');

exports.getDashboardStats = async (req, res) => {
    try {
        const [totalProducts] = await pool.query('SELECT COUNT(*) AS total FROM products');
        const [totalUsers] = await pool.query('SELECT COUNT(*) AS total FROM users');
        const [totalOrders] = await pool.query('SELECT COUNT(*) AS total FROM orders');
        const [recentProducts] = await pool.query(`
            SELECT p.*, c.name AS category_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            ORDER BY p.created_at DESC
            LIMIT 5
        `);
        const [recentOrders] = await pool.query(`
            SELECT o.*, u.name AS user_name 
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
            LIMIT 5
        `);

        res.json({
            totalProducts: totalProducts[0].total,
            totalUsers: totalUsers[0].total,
            totalOrders: totalOrders[0].total,
            recentProducts,
            recentOrders
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener estadísticas del dashboard' });
    }
};