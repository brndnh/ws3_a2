// app.js (api)
// bootstraps express, mounts routes, and serves uploads

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// basic middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// routes
const userRoutes = require('./routes/users');
const itemRoutes = require('./routes/items');
const categoryRoutes = require('./routes/categories');

app.use('/users', userRoutes);           // signup + sign-in (public)
app.use('/api/items', itemRoutes);       // protected by jwt
app.use('/api/categories', categoryRoutes); // public

// healthcheck
app.get('/', (_req, res) => res.json({ ok: true, service: 'api' }));

// 404
app.use((_req, res) => res.status(404).json({ message: 'not found' }));

// error handler
app.use((err, _req, res, _next) => {
    console.error('unhandled error:', err);
    res.status(500).json({ message: 'server error' });
});

app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
});
