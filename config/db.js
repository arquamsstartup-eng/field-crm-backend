// config/db.js

const mysql = require('mysql2');
require('dotenv').config();

// SQL Connection ka setup
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
};

if (process.env.DB_SSL === 'true') {
    dbConfig.ssl = {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    };
}

const db = mysql.createConnection(dbConfig);

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ', err);
    } else {
        console.log('SQL Database Connected Successfully, Boss!');
    }
});

// Ye sabse zaroori line hai: Hum is connection ko "export" kar rahe hain
// Taaki hamara koi bhi Controller (Chef) isko import karke database me changes kar sake.
module.exports = db;