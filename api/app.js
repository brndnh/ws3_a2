// import required modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3001;

// middleware setup
app.use(cors()); // allows requests from react frontend
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // serves image files

// import and use routes
const itemRoutes = require('./routes/items');
const userRoutes = require('./routes/users'); // ← NEW

// Mount routes
app.use('/api/items', itemRoutes);
app.use('/users', userRoutes); // ← NEW

// test route to check if API is running
app.get('/', (req, res) => {
    res.send('API is running');
});

// start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
