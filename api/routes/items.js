const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

// set up multer for image uploads
const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// get all items
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            select items.*, categories.name as category_name
            from items
            join categories on items.category_id = categories.id
        `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'database query failed' });
    }
});

// get single item by id
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('select * from items where id = ?', [req.params.id]);
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'could not fetch item' });
    }
});

// add item
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { name, description, category_id } = req.body;
        const image = req.file?.filename;

        const [result] = await db.query(
            'insert into items (name, description, image, category_id) values (?, ?, ?, ?)',
            [name, description, image, category_id]
        );

        res.json({ id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'could not insert item' });
    }
});

// update item
router.put('/:id', async (req, res) => {
    try {
        const { name, description, category_id } = req.body;

        await db.query(
            'update items set name = ?, description = ?, category_id = ? where id = ?',
            [name, description, category_id, req.params.id]
        );

        res.json({ message: 'item updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'could not update item' });
    }
});

// delete item
router.delete('/:id', async (req, res) => {
    try {
        await db.query('delete from items where id = ?', [req.params.id]);
        res.json({ message: 'item deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'could not delete item' });
    }
});

module.exports = router;
