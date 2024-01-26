// a utility function used by controller functions to make database queries

require('dotenv').config()

async function createConnection() {
    const mysql = require('mysql2/promise');
    const db = mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        namedPlaceholders: true,
        multipleStatements: true
    });

    return db;
}



module.exports = createConnection;