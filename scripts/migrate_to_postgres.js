const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PG_HOST || '127.0.0.1',
  port: process.env.PG_PORT ? Number(process.env.PG_PORT) : 5432,
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || '',
  database: process.env.PG_DATABASE || 'field_expense_crm',
});

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

async function runMigration() {
  console.log('===============================================================');
  console.log('   FIELD CRM: DATA MIGRATION FROM JSON DUMP TO POSTGRESQL      ');
  console.log('===============================================================');

  const jsonFile = path.join(__dirname, '..', 'database', 'sync_data.json');
  if (!fs.existsSync(jsonFile)) {
    console.error('ERROR: sync_data.json not found at:', jsonFile);
    process.exit(1);
  }

  const allData = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
  const client = await pool.connect();

  try {
    console.log('[1/3] Disabling constraint triggers for clean bulk insertion...');
    await client.query('SET session_replication_role = replica;');

    console.log('[2/3] Migrating data into PostgreSQL tables...');
    const summary = [];

    for (const table of tables) {
      const rows = allData[table] || [];

      // Clear existing records in postgres table
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

      // Synchronize serial sequence to max(id)
      try {
        await client.query(`SELECT setval(pg_get_serial_sequence('"${table}"', 'id'), coalesce(max(id), 1), max(id) IS NOT NULL) FROM "${table}";`);
      } catch (seqErr) {
        // Table might not have id serial
      }

      summary.push({ Table: table, Rows_Migrated: insertedCount });
      console.log(`  ✓ ${table.padEnd(24)} -> ${insertedCount} rows migrated`);
    }

    console.log('[3/3] Re-enabling normal constraint triggers...');
    await client.query('SET session_replication_role = DEFAULT;');

    console.log('\n===============================================================');
    console.log('              POSTGRESQL MIGRATION SUCCESSFUL!                 ');
    console.log('===============================================================');
    console.table(summary);

    // Verify key accounts
    const userCheck = await client.query('SELECT id, emp_code, name, email, role FROM users ORDER BY id ASC;');
    console.log('\nActive Users in PostgreSQL:');
    console.table(userCheck.rows);

  } catch (err) {
    console.error('Fatal Migration Error:', err);
  } finally {
    client.release();
    await pool.end();
    process.exit(0);
  }
}

runMigration().catch(err => {
  console.error('Migration script failure:', err);
  process.exit(1);
});
