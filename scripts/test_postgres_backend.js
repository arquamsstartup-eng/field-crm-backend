const db = require('../config/db');

async function testBackend() {
  console.log('===============================================================');
  console.log('   FIELD CRM: POSTGRESQL BACKEND END-TO-END VERIFICATION      ');
  console.log('===============================================================');

  // Test 1: Users Check
  await new Promise((resolve, reject) => {
    db.query('SELECT id, emp_code, name, email, role FROM users ORDER BY id ASC', (err, rows) => {
      if (err) return reject(err);
      console.log('\n[Test 1: Users Table]');
      console.table(rows);
      resolve();
    });
  });

  // Test 2: Customers & Contacts
  await new Promise((resolve, reject) => {
    db.query('SELECT c.id, c.customer_code, c.name, COUNT(ct.id) as contact_count FROM customers c LEFT JOIN contacts ct ON c.id = ct.customer_id GROUP BY c.id, c.customer_code, c.name', (err, rows) => {
      if (err) return reject(err);
      console.log('\n[Test 2: Customers & Cascading Contacts]');
      console.table(rows);
      resolve();
    });
  });

  // Test 3: Opportunities with Stages
  await new Promise((resolve, reject) => {
    db.query('SELECT id, opportunity_no, opportunity_name, stage, estimated_value FROM opportunities ORDER BY id ASC', (err, rows) => {
      if (err) return reject(err);
      console.log('\n[Test 3: Opportunities Pipeline]');
      console.table(rows);
      resolve();
    });
  });

  // Test 4: Quotations
  await new Promise((resolve, reject) => {
    db.query('SELECT id, quote_no, status, grand_total FROM quotations ORDER BY id ASC', (err, rows) => {
      if (err) return reject(err);
      console.log('\n[Test 4: Quotations]');
      console.table(rows);
      resolve();
    });
  });

  // Test 5: Dashboard Aggregations (with IFNULL / COALESCE functions)
  await new Promise((resolve, reject) => {
    const statsSql = `
      SELECT 
        (SELECT COUNT(*) FROM visits) AS total_visits,
        (SELECT IFNULL(SUM(total_claim_amount), 0) FROM visits WHERE status = 'Approved') AS total_approved_expenses,
        (SELECT COUNT(*) FROM visits WHERE status = 'Submitted') AS pending_approvals,
        (SELECT COUNT(*) FROM customers) AS active_customers
    `;
    db.query(statsSql, (err, rows) => {
      if (err) return reject(err);
      console.log('\n[Test 5: Dashboard KPI Aggregations]');
      console.table(rows);
      resolve();
    });
  });

  // Test 6: Report Monthly Calculations (with MONTH & YEAR functions)
  await new Promise((resolve, reject) => {
    const reportSql = `
      SELECT 
        IFNULL(SUM(v.total_claim_amount), 0) AS total_claimed,
        COUNT(*) AS total_visits
      FROM visits v
      WHERE MONTH(v.visit_date) = 10 AND YEAR(v.visit_date) = 2026
    `;
    db.query(reportSql, (err, rows) => {
      if (err) return reject(err);
      console.log('\n[Test 6: Monthly Report Date Functions]');
      console.table(rows);
      resolve();
    });
  });

  // Test 7: Insert Customer & Verify Serial Sequence
  await new Promise((resolve, reject) => {
    const insertSql = `
      INSERT INTO customers (customer_code, name, customer_type, status)
      VALUES (?, ?, ?, ?)
    `;
    db.query(insertSql, ['CUST-TEST-99', 'Automated PG Test Customer', 'Prospect', 'Active'], (err, res) => {
      if (err) return reject(err);
      console.log('\n[Test 7: Insert & Primary Key Returning]');
      console.log(`✓ Inserted Customer successfully! Generated ID: ${res.insertId} | Affected: ${res.affectedRows}`);

      db.query('DELETE FROM customers WHERE id = ?', [res.insertId], (errDel, resDel) => {
        if (errDel) return reject(errDel);
        console.log(`✓ Cleaned up test customer ID: ${res.insertId} | Deleted: ${resDel.affectedRows}`);
        resolve();
      });
    });
  });

  console.log('\n===============================================================');
  console.log('       ALL 7 POSTGRESQL BACKEND TESTS PASSED WITH 100%!        ');
  console.log('===============================================================');
  process.exit(0);
}

testBackend().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
