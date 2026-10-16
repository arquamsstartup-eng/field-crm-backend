const fs = require('fs');
const path = require('path');
const db = require('../config/db.js');

// Topological order to respect logical dependencies
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

async function generateSyncData() {
  console.log('--- STARTING LOCAL DATABASE EXTRACTION ---');
  const allData = {};
  let sqlScript = '-- ========================================================\n';
  sqlScript += '-- FIELD CRM COMPLETE DATA PURGE & RESTORE SCRIPT FOR VM\n';
  sqlScript += '-- Generated at: ' + new Date().toISOString() + '\n';
  sqlScript += '-- ========================================================\n\n';
  sqlScript += 'SET FOREIGN_KEY_CHECKS = 0;\n\n';

  for (const table of tables) {
    const rows = await new Promise((resolve, reject) => {
      db.query(`SELECT * FROM \`${table}\``, (err, results) => {
        if (err) {
          console.warn(`Warning reading table ${table}:`, err.message);
          return resolve([]);
        }
        resolve(results || []);
      });
    });

    allData[table] = rows;
    console.log(`Extracted ${table.padEnd(24)}: ${rows.length} rows`);

    // Add purge & reset
    sqlScript += `-- Purge and restore table: ${table} (${rows.length} rows)\n`;
    sqlScript += `DELETE FROM \`${table}\`;\n`;
    sqlScript += `ALTER TABLE \`${table}\` AUTO_INCREMENT = 1;\n`;

    if (rows.length > 0) {
      for (const row of rows) {
        const cols = Object.keys(row);
        const vals = cols.map(c => {
          const v = row[c];
          if (v === null || v === undefined) return 'NULL';
          if (typeof v === 'number') return v;
          if (v instanceof Date) {
            return `'${v.toISOString().slice(0, 19).replace('T', ' ')}'`;
          }
          if (typeof v === 'boolean') return v ? 1 : 0;
          const escaped = String(v)
            .replace(/\\/g, '\\\\')
            .replace(/'/g, "\\'")
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r');
          return `'${escaped}'`;
        });
        sqlScript += `INSERT INTO \`${table}\` (\`${cols.join('`, `')}\`) VALUES (${vals.join(', ')});\n`;
      }
    }
    sqlScript += '\n';
  }

  sqlScript += 'SET FOREIGN_KEY_CHECKS = 1;\n';

  const outDir = path.join(__dirname, '..', 'database');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // 1. Write JSON Dump (Used by NodeJS bulk importer)
  const jsonPath = path.join(outDir, 'sync_data.json');
  fs.writeFileSync(jsonPath, JSON.stringify(allData, null, 2), 'utf8');
  console.log(`JSON dump written to: ${jsonPath}`);

  // 2. Write SQL Script (Used for direct MySQL execution or fallback)
  const sqlPath = path.join(outDir, 'sync_vm_data.sql');
  fs.writeFileSync(sqlPath, sqlScript, 'utf8');
  console.log(`SQL script written to: ${sqlPath}`);

  console.log('--- LOCAL DATABASE EXTRACTION COMPLETE! ---');
  process.exit(0);
}

generateSyncData().catch(err => {
  console.error('Extraction fatal error:', err);
  process.exit(1);
});
