const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

// configure multer to handle image uploads
const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // creates a unique filename
    }
});
const upload = multer({ storage });

// get all items (read)
router.get('/', async (req, res) => {
    const [rows] = await db.query(`
        select items.*, categories.name as category_name
        from items
        join categories on items.category_id = categories.id
    `);
    res.json(rows);
});

// get a single item by id (read)
router.get('/:id', async (req, res) => {
    const [rows] = await db.query('select * from items where id = ?', [req.params.id]);
    res.json(rows[0]);
});

// add a new item with image (create)
router.post('/', upload.single('image'), async (req, res) => {
    const { name, description, category_id } = req.body;
    const image = req.file?.filename;

    const [result] = await db.query(
        'insert into items (name, description, image, category_id) values (?, ?, ?, ?)',
        [name, description, image, category_id]
    );

    res.json({ id: result.insertId });
});

// update an existing item (update)
router.put('/:id', async (req, res) => {
    const { name, description, category_id } = req.body;

    await db.query(
        'update items set name = ?, description = ?, category_id = ? where id = ?',
        [name, description, category_id, req.params.id]
    );

    res.json({ message: 'item updated' });
});

// delete an item by id (delete)
router.delete('/:id', async (req, res) => {
    await db.query('delete from items where id = ?', [req.params.id]);
    res.json({ message: 'item deleted' });
});

module.exports = router;
