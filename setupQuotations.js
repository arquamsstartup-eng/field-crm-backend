const db = require('./config/db');

const setupQuotations = async () => {
  const createQuotationsTable = `
    CREATE TABLE IF NOT EXISTS quotations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      quote_no VARCHAR(255) UNIQUE,
      customer_id INT,
      contact_id INT,
      opportunity_id INT,
      quote_date DATE,
      validity_days INT DEFAULT 30,
      status VARCHAR(50) DEFAULT 'DRAFT',
      offer_notes TEXT,
      terms_conditions TEXT,
      subtotal DECIMAL(15,2) DEFAULT 0.00,
      discount_amount DECIMAL(15,2) DEFAULT 0.00,
      tax_amount DECIMAL(15,2) DEFAULT 0.00,
      grand_total DECIMAL(15,2) DEFAULT 0.00,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createQuotationItemsTable = `
    CREATE TABLE IF NOT EXISTS quotation_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      quotation_id INT,
      product_name VARCHAR(255),
      qty INT DEFAULT 1,
      unit_rate DECIMAL(15,2) DEFAULT 0.00,
      discount_percent DECIMAL(5,2) DEFAULT 0.00,
      net_amount DECIMAL(15,2) DEFAULT 0.00,
      FOREIGN KEY (quotation_id) REFERENCES quotations(id) ON DELETE CASCADE
    )
  `;

  db.query(createQuotationsTable, (err) => {
    if (err) {
      console.error('Error creating quotations table:', err);
      process.exit(1);
    }
    console.log('quotations table created or already exists.');

    db.query(createQuotationItemsTable, (err) => {
      if (err) {
        console.error('Error creating quotation_items table:', err);
        process.exit(1);
      }
      console.log('quotation_items table created or already exists.');
      process.exit(0);
    });
  });
};

setupQuotations();
