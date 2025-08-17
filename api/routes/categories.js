// returns categories as { id, name }

const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (_req, res) => {
    try {
        const [rows] = await db.query(
            'select id, coalesce(name, NAME) as name from categories order by name asc'
        );
        res.json(rows);
    } catch (e) {
        console.error('get categories error:', e);
        res.status(500).json({ message: 'server error' });
    }
});

module.exports = router;
