// set up mysql connection
const mysql = require('mysql2');

// create connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', 
    password: '', 
    database: 'cassette_db' 
});

// export the pool with promise support
module.exports = pool.promise();
