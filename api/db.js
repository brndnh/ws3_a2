// mysql connection pool for mamp (default root/root, port 8889)

const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'cassette_collection', // or 'cassette_db' if that's your schema
    port: 8889
});

module.exports = pool.promise();
