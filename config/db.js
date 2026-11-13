// config/db.js
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbType = process.env.DB_TYPE || 'postgres';

console.log(`[Database Engine] Initializing database in ${dbType.toUpperCase()} mode...`);

if (dbType === 'mysql') {
    // --- Legacy MySQL/TiDB Connection ---
    const mysql = require('mysql2');
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
        keepAliveInitialDelay: 10000
    };

    if (process.env.DB_SSL === 'true') {
        poolConfig.ssl = { minVersion: 'TLSv1.2', rejectUnauthorized: true };
    }

    const pool = mysql.createPool(poolConfig);
    pool.getConnection((err, connection) => {
        if (err) console.error('CRITICAL: Initial MySQL connection failed:', err.message);
        else {
            console.log('SQL Database Connection Pool Initialized Successfully, Boss!');
            connection.release();
        }
    });

    module.exports = pool;

} else {
    // --- High-Performance PostgreSQL Connection & Compatibility Engine ---
    const pgConfig = {
        host: process.env.PG_HOST || process.env.DB_HOST || '127.0.0.1',
        port: process.env.PG_PORT ? Number(process.env.PG_PORT) : (process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432),
        user: process.env.PG_USER || process.env.DB_USER || 'postgres',
        password: process.env.PG_PASSWORD || process.env.DB_PASSWORD || '',
        database: process.env.PG_DATABASE || process.env.DB_NAME || 'field_expense_crm',
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
    };

    if (process.env.DB_SSL === 'true') {
        pgConfig.ssl = { rejectUnauthorized: false };
    }

    const pgPool = new Pool(pgConfig);

    pgPool.connect((err, client, release) => {
        if (err) {
            console.error('CRITICAL: Initial PostgreSQL connection failed:', err.message);
        } else {
            console.log('PostgreSQL Database Connection Pool Initialized Successfully, Boss!');
            release();
        }
    });

    pgPool.on('error', (err) => {
        console.error('PostgreSQL Pool Error (Handled):', err.message);
    });

    // Converts MySQL dialect specific constructs & placeholders to PostgreSQL
    function adaptSqlToPostgres(sql) {
        // 1. Replace MySQL IFNULL with PostgreSQL COALESCE
        let adapted = sql.replace(/\bIFNULL\s*\(/gi, 'COALESCE(');

        // 2. Replace MONTH(x) and YEAR(x) with EXTRACT(MONTH FROM x) and EXTRACT(YEAR FROM x)
        adapted = adapted
            .replace(/\bMONTH\s*\(([^)]+)\)/gi, 'EXTRACT(MONTH FROM $1)')
            .replace(/\bYEAR\s*\(([^)]+)\)/gi, 'EXTRACT(YEAR FROM $1)');

        // 3. Convert '?' outside quotes to '$1, $2, ...'
        let paramIndex = 1;
        let inQuote = false;
        let result = '';
        for (let i = 0; i < adapted.length; i++) {
            const char = adapted[i];
            if (char === "'" && adapted[i - 1] !== '\\') {
                inQuote = !inQuote;
                result += char;
            } else if (char === '?' && !inQuote) {
                result += '$' + (paramIndex++);
            } else {
                result += char;
            }
        }
        return result;
    }

    // Unified query adapter maintaining exact MySQL2 results interface
    const dbAdapter = {
        query: function (sql, params, callback) {
            if (typeof params === 'function') {
                callback = params;
                params = [];
            }
            if (!params) params = [];

            // 1. Handle MySQL bulk insert syntax: INSERT INTO table (...) VALUES ?
            if (/VALUES\s+\?/i.test(sql) && params.length === 1 && Array.isArray(params[0])) {
                const rows = params[0];
                if (!rows || rows.length === 0) {
                    const emptyRes = [];
                    emptyRes.affectedRows = 0;
                    return callback ? callback(null, emptyRes) : Promise.resolve(emptyRes);
                }

                let paramIndex = 1;
                const valueTuples = [];
                const flatParams = [];
                for (const row of rows) {
                    const placeholders = [];
                    for (const val of row) {
                        placeholders.push(`$${paramIndex++}`);
                        flatParams.push(val);
                    }
                    valueTuples.push(`(${placeholders.join(', ')})`);
                }

                let expandedSql = sql.replace(/VALUES\s+\?/i, `VALUES ${valueTuples.join(', ')}`);
                if (/^\s*INSERT\s+INTO\b/i.test(expandedSql) && !/\bRETURNING\b/i.test(expandedSql)) {
                    expandedSql = expandedSql.trim().replace(/;+$/, '') + ' RETURNING id';
                }

                return pgPool.query(expandedSql, flatParams, (err, res) => {
                    if (err) return callback ? callback(err) : null;
                    const resRows = res ? (res.rows || []) : [];
                    resRows.insertId = res && res.rows && res.rows[0] && res.rows[0].id ? res.rows[0].id : null;
                    resRows.affectedRows = res ? res.rowCount : 0;
                    if (callback) callback(null, resRows);
                });
            }

            // 2. Regular query with dialect & '?' placeholder adaptation
            let converted = adaptSqlToPostgres(sql);

            // 3. For INSERT queries without explicit RETURNING, auto-append RETURNING id
            const isInsert = /^\s*INSERT\s+INTO\b/i.test(converted);
            if (isInsert && !/\bRETURNING\b/i.test(converted)) {
                converted = converted.trim().replace(/;+$/, '') + ' RETURNING id';
            }

            return pgPool.query(converted, params, (err, res) => {
                if (err) return callback ? callback(err) : null;
                const rows = res ? (res.rows || []) : [];
                rows.insertId = res && res.rows && res.rows[0] && res.rows[0].id ? res.rows[0].id : null;
                rows.affectedRows = res ? res.rowCount : 0;
                rows.rowCount = res ? res.rowCount : 0;
                if (callback) callback(null, rows);
            });
        },

        getConnection: function (cb) {
            pgPool.connect((err, client, release) => {
                if (err) return cb(err);
                client.release = release;
                cb(null, client);
            });
        },

        on: function (event, handler) {
            pgPool.on(event, handler);
        },

        end: function (cb) {
            pgPool.end(cb);
        },

        pool: pgPool
    };

    module.exports = dbAdapter;
}
