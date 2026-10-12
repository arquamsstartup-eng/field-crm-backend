const db = require('../config/db');

const allowedTables = [
  'branches', 'departments', 'designations', 
  'activity_types', 'expense_heads', 'grade_fuel_rates',
  'industries', 'lead_sources', 'products', 'principals'
];

exports.getMasters = (req, res) => {
  const table = req.params.table;
  
  if (!allowedTables.includes(table)) {
    return res.status(400).json({ error: "Invalid Table Name" });
  }

  let sql = `SELECT * FROM ${table} ORDER BY id DESC`;
  
  // NAYA LOGIC: Agar branch table hai, toh Users table se jud kar manager ka naam laao
  if (table === 'branches') {
      sql = `
        SELECT branches.*, users.name AS manager_name 
        FROM branches 
        LEFT JOIN users ON branches.manager_id = users.id
        ORDER BY branches.id DESC
      `;
  }

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

exports.addMaster = (req, res) => {
  const table = req.params.table;
  
  if (!allowedTables.includes(table)) {
    return res.status(400).json({ error: "Invalid Table Name" });
  }

  const data = { ...req.body };

  const processInsert = (finalData) => {
      const sql = `INSERT INTO ${table} SET ?`;
      db.query(sql, finalData, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ success: true, message: "Added successfully", id: result.insertId });
      });
  };

  const getExcelColumn = (n) => {
      let str = '';
      let c = n;
      while (c >= 0) {
          str = String.fromCharCode(65 + (c % 26)) + str;
          c = Math.floor(c / 26) - 1;
      }
      return str;
  };

  if (table === 'branches') {
      db.query(`SELECT branch_code FROM branches WHERE branch_code LIKE 'BR-%' ORDER BY id DESC LIMIT 1`, (err, rows) => {
          let nextCode = 'BR-001';
          if (!err && rows.length > 0 && rows[0].branch_code) {
              let lastNum = parseInt(rows[0].branch_code.replace('BR-', '')) || 0;
              nextCode = `BR-${(lastNum + 1).toString().padStart(3, '0')}`;
          }
          data.branch_code = nextCode;
          processInsert(data);
      });
  } else if (table === 'departments') {
      db.query(`SELECT code FROM departments WHERE code LIKE 'DEPT-%' ORDER BY id DESC LIMIT 1`, (err, rows) => {
          let nextCode = 'DEPT-001';
          if (!err && rows.length > 0 && rows[0].code) {
              let lastNum = parseInt(rows[0].code.replace('DEPT-', '')) || 0;
              nextCode = `DEPT-${(lastNum + 1).toString().padStart(3, '0')}`;
          }
          data.code = nextCode;
          processInsert(data);
      });
  } else if (table === 'designations') {
      db.query(`SELECT code FROM designations WHERE code LIKE 'DESG-%' ORDER BY id DESC LIMIT 1`, (err, rows) => {
          let nextCode = 'DESG-001';
          if (!err && rows.length > 0 && rows[0].code) {
              let lastNum = parseInt(rows[0].code.replace('DESG-', '')) || 0;
              nextCode = `DESG-${(lastNum + 1).toString().padStart(3, '0')}`;
          }
          data.code = nextCode;
          processInsert(data);
      });
  } else if (table === 'grade_fuel_rates') {
      db.query(`SELECT COUNT(*) as count FROM grade_fuel_rates`, (err, rows) => {
          let count = 0;
          if (!err && rows.length > 0) count = rows[0].count;
          data.code = `Grade ${getExcelColumn(count)}`;
          processInsert(data);
      });
  } else if (table === 'industries') {
      db.query(`SELECT code FROM industries WHERE code LIKE 'IND-%' ORDER BY id DESC LIMIT 1`, (err, rows) => {
          let nextCode = 'IND-001';
          if (!err && rows.length > 0 && rows[0].code) {
              let lastNum = parseInt(rows[0].code.replace('IND-', '')) || 0;
              nextCode = `IND-${(lastNum + 1).toString().padStart(3, '0')}`;
          }
          data.code = nextCode;
          processInsert(data);
      });
  } else if (table === 'lead_sources') {
      db.query(`SELECT code FROM lead_sources WHERE code LIKE 'LS-%' ORDER BY id DESC LIMIT 1`, (err, rows) => {
          let nextCode = 'LS-001';
          if (!err && rows.length > 0 && rows[0].code) {
              let lastNum = parseInt(rows[0].code.replace('LS-', '')) || 0;
              nextCode = `LS-${(lastNum + 1).toString().padStart(3, '0')}`;
          }
          data.code = nextCode;
          processInsert(data);
      });

  } else if (table === 'products') {
      db.query("SELECT code FROM products WHERE code LIKE 'PRD-%' ORDER BY id DESC LIMIT 1", (err, rows) => {
          let nextCode = 'PRD-001';
          if (!err && rows.length > 0 && rows[0].code) {
              let lastNum = parseInt(rows[0].code.replace('PRD-', '')) || 0;
              nextCode = `PRD-${(lastNum + 1).toString().padStart(3, '0')}`;
          }
          data.code = nextCode;
          processInsert(data);
      });
  } else if (table === 'activity_types') {
      db.query("SELECT code FROM activity_types WHERE code LIKE 'ACT-%' ORDER BY id DESC LIMIT 1", (err, rows) => {
          let nextCode = 'ACT-001';
          if (!err && rows.length > 0 && rows[0].code) {
              let lastNum = parseInt(rows[0].code.replace('ACT-', '')) || 0;
              nextCode = `ACT-${(lastNum + 1).toString().padStart(3, '0')}`;
          }
          data.code = nextCode;
          processInsert(data);
      });
  } else if (table === 'principals') {
      db.query("SELECT code FROM principals WHERE code LIKE 'OEM-%' ORDER BY id DESC LIMIT 1", (err, rows) => {
          let nextCode = 'OEM-001';
          if (!err && rows.length > 0 && rows[0].code) {
              let lastNum = parseInt(rows[0].code.replace('OEM-', '')) || 0;
              nextCode = `OEM-${(lastNum + 1).toString().padStart(3, '0')}`;
          }
          data.code = nextCode;
          processInsert(data);
      });
  } else {
      processInsert(data);
  }

};

exports.editMaster = (req, res) => {
  const table = req.params.table;
  const id = req.params.id;

  // Security check
  if (!allowedTables.includes(table)) {
    return res.status(400).json({ error: "Invalid Table Name" });
  }

  // SQL Query: Update karo jahan ID match ho
  const sql = `UPDATE ${table} SET ? WHERE id = ?`;
  
  db.query(sql, [req.body, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ success: true, message: "Updated successfully" });
  });
};

exports.deleteMaster = (req, res) => {
  const table = req.params.table;
  const id = req.params.id;

  if (!allowedTables.includes(table)) {
    return res.status(400).json({ error: "Invalid Table Name" });
  }

  // SQL Query: ID match karo aur row uda do
  const sql = `DELETE FROM ${table} WHERE id = ?`;
  
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ success: true, message: "Deleted successfully" });
  });
};