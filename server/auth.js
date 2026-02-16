const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

/**
 * Middleware: Authenticate JWT
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token.' });
        req.user = user;
        next();
    });
};

/**
 * POST /api/auth/signup
 */
router.post('/signup', async (req, res) => {
    const { username, email, password, full_name } = req.body;

    if (!username || !email || !password || !full_name) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const userRole = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userRole.rows.length > 0) {
            return res.status(400).json({ message: 'Email already registered.' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await db.query(
            'INSERT INTO users (username, email, password_hash, full_name) VALUES ($1, $2, $3, $4) RETURNING id, username, email, full_name',
            [username, email, passwordHash, full_name]
        );

        const token = jwt.sign({ id: newUser.rows[0].id, email: newUser.rows[0].email }, JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({ token, user: newUser.rows[0] });
    } catch (err) {
        console.error('Signup Error:', err);
        res.status(500).json({ message: `Server error during signup: ${err.message}` });
    }
});

/**
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                full_name: user.full_name,
            },
        });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: `Server error during login: ${err.message}` });
    }
});

/**
 * GET /api/auth/me
 */
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const userResult = await db.query('SELECT id, username, email, full_name FROM users WHERE id = $1', [req.user.id]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching user profile.' });
    }
});

module.exports = { router, authenticateToken };
