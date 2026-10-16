const fs = require('fs');
const path = require('path');
const pool = require('../config/db.js');

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

async function runImport() {
  console.log('===============================================================');
  console.log('  FIELD CRM: COMPLETE DATABASE PURGE & RESTORE SCRIPT (VM)    ');
  console.log('===============================================================');
  
  const jsonFile = path.join(__dirname, '..', 'database', 'sync_data.json');
  if (!fs.existsSync(jsonFile)) {
    console.error('ERROR: sync_data.json not found at:', jsonFile);
    process.exit(1);
  }

  const allData = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

  const conn = await new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) return reject(err);
      resolve(connection);
    });
  });

  try {
    console.log('\n[1/4] Disabling Foreign Key Constraints...');
    await new Promise((res, rej) => conn.query('SET FOREIGN_KEY_CHECKS = 0', err => err ? rej(err) : res()));

    console.log('[2/4] Purging old dummy data and restoring latest records...');
    const summary = [];

    for (const table of tables) {
      const rows = allData[table] || [];

      // 1. Purge table completely
      await new Promise((res, rej) => conn.query(`DELETE FROM \`${table}\``, err => err ? rej(err) : res()));
      try {
        await new Promise((res, rej) => conn.query(`ALTER TABLE \`${table}\` AUTO_INCREMENT = 1`, err => err ? rej(err) : res()));
      } catch (e) {
        // Ignore if AUTO_INCREMENT not applicable
      }

      // 2. Insert records row by row to ensure clean data types and date formatting
      let inserted = 0;
      for (const row of rows) {
        const cols = Object.keys(row);
        const vals = cols.map(c => {
          let v = row[c];
          if (v !== null && v !== undefined && typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(v)) {
            v = v.replace('T', ' ').replace('Z', '').slice(0, 19);
          }
          return v;
        });

        await new Promise((resolve, reject) => {
          const sql = `INSERT INTO \`${table}\` (\`${cols.join('`, `')}\`) VALUES (?)`;
          conn.query(sql, [vals], (err) => {
            if (err) {
              console.warn(`Notice on ${table} row:`, err.message);
              return resolve();
            }
            inserted++;
            resolve();
          });
        });
      }

      summary.push({ Table: table, Restored: inserted });
      console.log(`  ✓ ${table.padEnd(24)} -> Purged & Restored ${inserted} rows`);
    }

    console.log('\n[3/4] Re-enabling Foreign Key Constraints...');
    await new Promise((res, rej) => conn.query('SET FOREIGN_KEY_CHECKS = 1', err => err ? rej(err) : res()));

    console.log('\n===============================================================');
    console.log('                 DATABASE SYNC SUCCESSFUL!                     ');
    console.log('===============================================================');
    console.log('Summary of Restored Data:');
    console.table(summary);
    console.log('\nKey Accounts Active on VM:');
    console.log('  👑 Admin        (EMP-001) -> admin@gmail.com   [Password: admin@123]');
    console.log('  🏢 Noor         (EMP-004) -> noor@gmail.com    [Password: admin] (Branch Manager - Delhi)');
    console.log('  💼 Alfahad      (EMP-002) -> alfahad@gmail.com [Password: admin] (Sales Exec)');
    console.log('  🔧 Saqlain      (EMP-003) -> saqlain@gmail.com [Password: admin] (Service Eng)');
    console.log('===============================================================\n');

  } catch (fatalErr) {
    console.error('Fatal Database Sync Error:', fatalErr);
  } finally {
    conn.release();
    process.exit(0);
  }
}

runImport().catch(err => {
  console.error('Process Execution Error:', err);
  process.exit(1);
});
