// config/db.js
const mysql = require('mysql2');
require('dotenv').config();

// SQL Connection Pool Configuration
const poolConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000 // Send keepalive probe every 10s to prevent cloud idle disconnects
};

if (process.env.DB_SSL === 'true') {
    poolConfig.ssl = {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    };
}

// Use createPool instead of createConnection to guarantee automatic reconnects
const pool = mysql.createPool(poolConfig);

pool.getConnection((err, connection) => {
    if (err) {
        console.error('CRITICAL: Initial Database connection failed:', err.message);
    } else {
        console.log('SQL Database Connection Pool Initialized Successfully, Boss!');
        connection.release();
    }
});

pool.on('error', (err) => {
    console.error('MySQL Pool Error (Handled):', err.message);
});

module.exports = pool;