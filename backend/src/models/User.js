const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    static async findByEmail(email) {
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await pool.query(
            'SELECT id, name, email, role, phone, address, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async create(userData) {
        const { name, email, password, phone, address } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await pool.query(
            `INSERT INTO users (name, email, password, phone, address) 
             VALUES (?, ?, ?, ?, ?)`,
            [name, email, hashedPassword, phone, address]
        );
        
        return result.insertId;
    }

    static async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
}

module.exports = User;