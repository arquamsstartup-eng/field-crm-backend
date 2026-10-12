const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected. Running CRM Database Setup...');

    const queries = `
        CREATE TABLE IF NOT EXISTS opportunities (
            id INT AUTO_INCREMENT PRIMARY KEY,
            opportunity_no VARCHAR(50) UNIQUE,
            opportunity_name VARCHAR(255),
            customer_id INT,
            contact_person_id INT,
            lead_source VARCHAR(100),
            assigned_salesperson_id INT,
            stage VARCHAR(100) DEFAULT 'New Leads',
            estimated_value DECIMAL(15,2) DEFAULT 0.00,
            lead_date DATE,
            expected_closure_date DATE,
            is_new_client BOOLEAN DEFAULT FALSE,
            
            -- Technical Scope Tab
            technical_requirements TEXT,
            
            -- Competitor Tab
            competitor_brand VARCHAR(255),
            competitor_price DECIMAL(15,2),
            competitor_threat_level VARCHAR(100),
            competitor_strengths TEXT,
            competitor_weaknesses TEXT,
            win_loss_rationale TEXT,
            
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            
            FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
            FOREIGN KEY (assigned_salesperson_id) REFERENCES users(id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS opportunity_products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            opportunity_id INT,
            product_id INT,
            principal_name VARCHAR(255),
            quantity INT DEFAULT 1,
            unit_rate DECIMAL(15,2),
            line_total DECIMAL(15,2),
            FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE
        );
    `;

    db.query(queries, (err, results) => {
        if (err) {
            console.error('Error creating CRM tables:', err);
        } else {
            console.log('CRM Tables (Opportunities) created successfully!');
            
            // Add opportunity_id to visits table safely
            const alterVisits = `
                ALTER TABLE visits 
                ADD COLUMN opportunity_id INT DEFAULT NULL,
                ADD FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE SET NULL;
            `;
            db.query(alterVisits, (alterErr) => {
                if (alterErr && alterErr.code !== 'ER_DUP_FIELDNAME') {
                    console.error('Note: Could not alter visits table or it already exists.', alterErr.message);
                } else {
                    console.log('visits table updated successfully!');
                }
                process.exit();
            });
        }
    });
});
