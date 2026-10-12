const db = require('./config/db');

const updates = [
  { old: 'PRIN-AMADA', new: 'PRIN-001' },
  { old: 'PRIN-DMGMORI', new: 'PRIN-002' },
  { old: 'PRIN-FANUC', new: 'PRIN-003' },
  { old: 'PRIN-GEN', new: 'PRIN-004' },
  { old: 'PRIN-HAAS', new: 'PRIN-005' },
  { old: 'PRIN-MAZAK', new: 'PRIN-006' },
  { old: 'PRIN-MITSUBISHI', new: 'PRIN-007' },
  { old: 'PRIN-SIEMENS', new: 'PRIN-008' }
];

async function runUpdates() {
  for (let u of updates) {
    await new Promise((resolve, reject) => {
      db.query("UPDATE principals SET code = ? WHERE code = ?", [u.new, u.old], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
  console.log("Updated all principal codes to PRIN-00X format.");
  process.exit(0);
}

runUpdates();
