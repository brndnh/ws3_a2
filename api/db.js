// set up mysql connection
const mysql = require('mysql2');

// create connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', 
    password: 'root', 
    database: 'cassette_db', 
    port: 8889,
});

// export the pool with promise support
module.exports = pool.promise();
