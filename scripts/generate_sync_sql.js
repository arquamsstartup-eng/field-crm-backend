const fs = require('fs');
const path = require('path');
const db = require('../config/db.js');

const tables = [
  'branches', 'departments', 'designations', 'users', 'grade_fuel_rates',
  'expense_heads', 'activity_types', 'industries', 'lead_sources',
  'principals', 'products', 'customers', 'contacts',
  'opportunities', 'opportunity_products', 'quotations', 'quotation_items',
  'visits', 'visit_expenses'
];

let sqlOutput = '-- ========================================================\n';
sqlOutput += '-- FIELD CRM COMPLETE DATA SYNC SCRIPT FOR PRODUCTION VM\n';
sqlOutput += '-- Automatically generated to populate all testing data\n';
sqlOutput += '-- ========================================================\n\n';
sqlOutput += 'SET FOREIGN_KEY_CHECKS = 0;\n\n';

let completed = 0;
tables.forEach(tableName => {
  db.query(`SELECT * FROM ${tableName}`, (err, rows) => {
    if (!err && rows && rows.length > 0) {
      sqlOutput += `-- Data for table: ${tableName} (${rows.length} rows)\n`;
      rows.forEach(row => {
        const cols = Object.keys(row);
        const vals = cols.map(c => {
          const v = row[c];
          if (v === null || v === undefined) return 'NULL';
          if (typeof v === 'number') return v;
          if (v instanceof Date) return `'${v.toISOString().slice(0, 19).replace('T', ' ')}'`;
          const escaped = String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r');
          return `'${escaped}'`;
        });
        sqlOutput += `REPLACE INTO ${tableName} (${cols.join(', ')}) VALUES (${vals.join(', ')});\n`;
      });
      sqlOutput += '\n';
    }
    completed++;
    if (completed === tables.length) {
      sqlOutput += 'SET FOREIGN_KEY_CHECKS = 1;\n';
      const outDir = path.join(__dirname, '..', 'database');
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, 'sync_vm_data.sql'), sqlOutput, 'utf8');
      console.log('SQL SCRIPT GENERATED SUCCESSFULLY at database/sync_vm_data.sql');
      process.exit(0);
    }
  });
});
