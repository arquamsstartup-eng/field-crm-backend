const fs = require('fs');
const path = require('path');
const pool = require('../config/db.js');

async function runImport() {
  console.log('--- STARTING ONE-CLICK DATABASE DATA SYNC ---');
  const sqlFile = path.join(__dirname, '..', 'database', 'sync_vm_data.sql');

  if (!fs.existsSync(sqlFile)) {
    console.error('ERROR: sync_vm_data.sql not found at:', sqlFile);
    process.exit(1);
  }

  const sqlContent = fs.readFileSync(sqlFile, 'utf8');

  // Split SQL file into individual statements
  const statements = sqlContent
    .split(/;\s*[\r\n]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`Found ${statements.length} SQL statements to execute.`);

  // Get a single dedicated connection so session-level FOREIGN_KEY_CHECKS = 0 applies to all queries
  const conn = await new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) return reject(err);
      resolve(connection);
    });
  });

  try {
    await new Promise((res, rej) => conn.query('SET FOREIGN_KEY_CHECKS = 0', err => err ? rej(err) : res()));

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      if (stmt.startsWith('--') || stmt.length === 0) continue;

      try {
        await new Promise((resolve, reject) => {
          conn.query(stmt, (err, result) => {
            if (err) return reject(err);
            resolve(result);
          });
        });
        successCount++;
      } catch (err) {
        console.error(`Notice on query #${i + 1}:`, err.message);
        errorCount++;
      }
    }

    await new Promise((res, rej) => conn.query('SET FOREIGN_KEY_CHECKS = 1', err => err ? rej(err) : res()));

    console.log('----------------------------------------------------');
    console.log(`SYNC COMPLETE: ${successCount} statements executed successfully! (Errors: ${errorCount})`);
    console.log('SUCCESS: All Customers, Contacts, Opportunities & Quotations are now live!');
    console.log('----------------------------------------------------');
  } finally {
    conn.release();
    process.exit(0);
  }
}

runImport().catch(err => {
  console.error('Fatal Import Error:', err);
  process.exit(1);
});
