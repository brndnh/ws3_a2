const mysql = require('mysql2');

// connect to mamp mysql (default: root / root, port 8889)
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'cassette_collection',
    port: 8889,
});
// MAMP port set to 8889, default is 3306

module.exports = pool.promise();
