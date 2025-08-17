const express = require('express');
const path = require('path');
const multer = require('multer');
const db = require('../db');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname) || '';
        const name = `${Date.now()}${ext}`;
        cb(null, name);
    }
});
const upload = multer({ storage });

/* get all items for the logged-in user */
router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const [rows] = await db.query(
            `SELECT i.id, i.name, i.description, i.image, i.category_id, c.name AS category_name
       FROM items i
       LEFT JOIN categories c ON c.id = i.category_id
       WHERE i.user_id = ?
       ORDER BY i.id DESC`,
            [userId]
        );
        res.json(rows);
    } catch (err) {
        console.error('get items error:', err);
        res.status(500).json({ message: 'server error' });
    }
});

/* get single item (only if it belongs to the user) */
router.get('/:id', auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const [rows] = await db.query(
            `SELECT id, name, description, image, category_id
       FROM items
       WHERE id = ? AND user_id = ?`,
            [req.params.id, userId]
        );
        if (rows.length === 0) return res.status(404).json({ message: 'not found' });
        res.json(rows[0]);
    } catch (err) {
        console.error('get item error:', err);
        res.status(500).json({ message: 'server error' });
    }
});

/* create item (sets user_id from token) */
router.post('/', auth, upload.single('image'), async (req, res) => {
    const userId = req.user.userId;
    const { name, description, category_id } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name) return res.status(400).json({ message: 'name is required' });

    try {
        const [result] = await db.query(
            `INSERT INTO items (name, description, image, category_id, user_id)
       VALUES (?, ?, ?, ?, ?)`,
            [name, description || null, image, category_id || null, userId]
        );
        res.status(201).json({ id: result.insertId });
    } catch (err) {
        console.error('create item error:', err);
        res.status(500).json({ message: 'server error' });
    }
});

/* update item (only if user owns it); supports optional new image */
router.put('/:id', auth, upload.single('image'), async (req, res) => {
    const userId = req.user.userId;
    const { name, description, category_id } = req.body;
    const newImage = req.file ? req.file.filename : null;

    try {
        // fetch current item for ownership + current image
        const [rows] = await db.query(
            'SELECT id, image FROM items WHERE id = ? AND user_id = ?',
            [req.params.id, userId]
        );
        if (rows.length === 0) return res.status(404).json({ message: 'not found' });

        const current = rows[0];
        const imageToSave = newImage || current.image;

        await db.query(
            `UPDATE items
       SET name = ?, description = ?, image = ?, category_id = ?
       WHERE id = ? AND user_id = ?`,
            [name || null, description || null, imageToSave, category_id || null, req.params.id, userId]
        );

        res.json({ message: 'updated' });
    } catch (err) {
        console.error('update item error:', err);
        res.status(500).json({ message: 'server error' });
    }
});

/* delete item (only if user owns it) */
router.delete('/:id', auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const [result] = await db.query(
            'DELETE FROM items WHERE id = ? AND user_id = ?',
            [req.params.id, userId]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'not found' });
        res.json({ message: 'deleted' });
    } catch (err) {
        console.error('delete item error:', err);
        res.status(500).json({ message: 'server error' });
    }
});

module.exports = router;
