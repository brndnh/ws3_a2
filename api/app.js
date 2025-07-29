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
app.use('/api/items', itemRoutes); // all item routes are mounted here

// start the server
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});
