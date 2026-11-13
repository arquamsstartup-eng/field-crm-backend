const fs = require('fs');
const path = require('path');
const { Client, Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const config = {
  host: process.env.PG_HOST || '127.0.0.1',
  port: process.env.PG_PORT ? Number(process.env.PG_PORT) : 5432,
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || '',
  targetDb: process.env.PG_DATABASE || 'field_expense_crm'
};

const tables = [
  'branches',
  'departments',
  'designations',
  'grade_fuel_rates',
  'users',
  'expense_heads',
  'activity_types',
  'industries',
  'lead_sources',
  'principals',
  'products',
  'customers',
  'contacts',
  'opportunities',
  'opportunity_products',
  'quotations',
  'quotation_items',
  'visits',
  'visit_expenses'
];

async function setupPostgres() {
  console.log('===============================================================');
  console.log('  FIELD CRM: 1-CLICK POSTGRESQL INITIALIZATION & DATA RESTORE  ');
  console.log('===============================================================');
  console.log(`Connecting to PostgreSQL host: ${config.host}:${config.port} as '${config.user}'...`);

  // Step 1: Connect to default postgres db to ensure target database exists
  const rootClient = new Client({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: 'postgres'
  });

  try {
    await rootClient.connect();
    const checkDb = await rootClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [config.targetDb]
    );

    if (checkDb.rowCount === 0) {
      console.log(`[1/4] Creating target database '${config.targetDb}'...`);
      await rootClient.query(`CREATE DATABASE "${config.targetDb}"`);
      console.log(`✓ Database '${config.targetDb}' created.`);
    } else {
      console.log(`[1/4] Target database '${config.targetDb}' already exists.`);
    }
  } catch (err) {
    console.warn(`Notice on database existence check: ${err.message}`);
  } finally {
    await rootClient.end();
  }

  // Step 2: Connect to target database
  const targetPool = new Pool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.targetDb
  });

  const client = await targetPool.connect();

  try {
    // Step 3: Execute Schema DDL
    console.log('[2/4] Applying PostgreSQL Table Schema (19 Tables & Triggers)...');
    const schemaFile = path.join(__dirname, '..', 'database', 'postgres_schema.sql');
    if (!fs.existsSync(schemaFile)) {
      throw new Error(`postgres_schema.sql not found at ${schemaFile}`);
    }
    const schemaSql = fs.readFileSync(schemaFile, 'utf8');
    await client.query(schemaSql);
    console.log('✓ All 19 tables & trigger functions established successfully.');

    // Step 4: Populate Data from JSON dump
    console.log('[3/4] Restoring all table records from sync_data.json...');
    const jsonFile = path.join(__dirname, '..', 'database', 'sync_data.json');
    if (!fs.existsSync(jsonFile)) {
      throw new Error(`sync_data.json not found at ${jsonFile}`);
    }
    const allData = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

    await client.query('SET session_replication_role = replica;');
    const summary = [];

    for (const table of tables) {
      const rows = allData[table] || [];
      await client.query(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`);

      let insertedCount = 0;
      for (const row of rows) {
        const cols = Object.keys(row);
        const vals = cols.map(c => {
          let v = row[c];
          if (v !== null && v !== undefined && typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(v)) {
            v = v.replace('T', ' ').replace('Z', '').slice(0, 19);
          }
          return v;
        });

        const placeholders = cols.map((_, idx) => `$${idx + 1}`).join(', ');
        const colNames = cols.map(c => `"${c}"`).join(', ');

        const sql = `INSERT INTO "${table}" (${colNames}) VALUES (${placeholders})`;
        await client.query(sql, vals);
        insertedCount++;
      }

      // Synchronize serial sequence
      try {
        await client.query(`SELECT setval(pg_get_serial_sequence('"${table}"', 'id'), coalesce(max(id), 1), max(id) IS NOT NULL) FROM "${table}";`);
      } catch (seqErr) {}

      summary.push({ Table: table, Restored_Rows: insertedCount });
      console.log(`  ✓ ${table.padEnd(24)} -> ${insertedCount} rows restored`);
    }

    await client.query('SET session_replication_role = DEFAULT;');

    console.log('\n[4/4] Verification Summary:');
    console.table(summary);

    const userCheck = await client.query('SELECT id, emp_code, name, email, role FROM users ORDER BY id ASC;');
    console.log('\nActive Verified Accounts:');
    console.table(userCheck.rows);

    console.log('\n===============================================================');
    console.log('         POSTGRESQL INITIALIZATION & RESTORE COMPLETE!          ');
    console.log('===============================================================');
  } finally {
    client.release();
    await targetPool.end();
    process.exit(0);
  }
}

setupPostgres().catch(err => {
  console.error('Fatal Setup Error:', err);
  process.exit(1);
});
