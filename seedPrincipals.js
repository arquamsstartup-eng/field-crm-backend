const db = require('./config/db');

const alterQuery = `
  ALTER TABLE principals
  ADD COLUMN IF NOT EXISTS code VARCHAR(50) UNIQUE,
  ADD COLUMN IF NOT EXISTS country VARCHAR(100),
  ADD COLUMN IF NOT EXISTS contact_person VARCHAR(100),
  ADD COLUMN IF NOT EXISTS email VARCHAR(100),
  ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'Active'
`;

const principalsData = [
  ['PRIN-AMADA', 'Amada', 'Japan', 'Hiroshi Tanaka', 'htanaka@amada.example.com', '+81 463 96 1111', 'Active'],
  ['PRIN-DMGMORI', 'DMG Mori', 'Germany / Japan', 'Stefan Weber', 'sweber@dmgmori.example.com', '+49 5205 74 0', 'Active'],
  ['PRIN-FANUC', 'Fanuc', 'Japan', 'Takashi Watanabe', 'twatanabe@fanuc.example.com', '+81 555 84 5555', 'Active'],
  ['PRIN-GEN', 'General Machinery', 'India', 'Suresh Patel', 'spatel@generalmachinery.example.com', '+91 22 2580 1234', 'Active'],
  ['PRIN-HAAS', 'Haas Automation', 'United States', 'Robert Miller', 'rmiller@haascnc.example.com', '+1 805 278 1800', 'Active'],
  ['PRIN-MAZAK', 'Mazak', 'Japan', 'Kenji Sato', 'ksato@mazak.example.com', '+81 587 95 5511', 'Active'],
  ['PRIN-MITSUBISHI', 'Mitsubishi Electric', 'Japan', 'Daisuke Yamada', 'dyamada@mitsubishi.example.com', '+81 3 3218 2111', 'Active'],
  ['PRIN-SIEMENS', 'Siemens', 'Germany', 'Markus Schmidt', 'm.schmidt@siemens.example.com', '+49 89 636 00', 'Active']
];

const insertQuery = `
  INSERT INTO principals (code, name, country, contact_person, email, phone, status)
  VALUES ?
  ON DUPLICATE KEY UPDATE 
    name = VALUES(name),
    country = VALUES(country),
    contact_person = VALUES(contact_person),
    email = VALUES(email),
    phone = VALUES(phone),
    status = VALUES(status)
`;

db.query(alterQuery, (err) => {
  if (err && err.code !== 'ER_DUP_FIELDNAME') {
    // Note: MariaDB supports IF NOT EXISTS for ALTER TABLE, but older MySQL might not.
    // If it fails with syntax error, we can ignore or run individual alters.
    console.log("Alter might have failed or columns exist:", err.message);
  } else {
    console.log("Columns added or already exist.");
  }
  
  db.query(insertQuery, [principalsData], (err, results) => {
    if (err) {
      console.error("Error inserting data:", err);
    } else {
      console.log(`Successfully inserted/updated ${results.affectedRows} principals in the database.`);
    }
    process.exit(0);
  });
});
