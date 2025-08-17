const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../db');

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-fallback-secret';

/* user registration: POST /users */
router.post(
    '/',
    [
        body('email')
            .isEmail().withMessage('invalid email')
            .normalizeEmail()
            .trim(),
        body('password')
            .isLength({ min: 6 }).withMessage('password must be at least 6 characters')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const email = String(req.body.email).toLowerCase().trim();
        const password = String(req.body.password);

        try {
            // check if email already exists
            const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
            if (existing.length > 0) {
                return res.status(409).json({ message: 'email already in use' });
            }

            // hash password and insert
            const hash = await bcrypt.hash(password, 10);
            await db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hash]);

            return res.status(201).json({ message: 'user registered successfully' });
        } catch (err) {
            console.error('register error:', err);
            return res.status(500).json({ message: 'server error' });
        }
    }
);

/* user sign-in: POST /users/sign-in */
router.post(
    '/sign-in',
    [
        body('email')
            .isEmail().withMessage('invalid email')
            .normalizeEmail()
            .trim(),
        body('password')
            .notEmpty().withMessage('password is required')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const email = String(req.body.email).toLowerCase().trim();
        const password = String(req.body.password);

        try {
            // fetch user by email
            const [rows] = await db.query('SELECT id, email, password FROM users WHERE email = ?', [email]);
            if (rows.length === 0) {
                return res.status(401).json({ message: 'invalid credentials' });
            }

            const user = rows[0];

            // compare password
            const ok = await bcrypt.compare(password, user.password);
            if (!ok) {
                return res.status(401).json({ message: 'invalid credentials' });
            }

            // issue jwt
            const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '2h' });

            return res.json({
                message: 'signed in',
                token,
                user: { id: user.id, email: user.email }
            });
        } catch (err) {
            console.error('sign-in error:', err);
            return res.status(500).json({ message: 'server error' });
        }
    }
);

module.exports = router;
