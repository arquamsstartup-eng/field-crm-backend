const db = require('../config/db');

exports.createCustomer = (req, res) => {
    const { 
        name, customer_type, industry_id, lead_source_id, website, status, city, state, address, remarks,
        child_contacts 
    } = req.body;
    
    // Auto-generate Customer code
    db.query("SELECT customer_code FROM customers WHERE customer_code LIKE 'CUST-%' ORDER BY id DESC LIMIT 1", (err, rows) => {
        let nextCode = 'CUST-001';
        if (!err && rows.length > 0 && rows[0].customer_code) {
            const lastCode = rows[0].customer_code; 
            const lastNum = parseInt(lastCode.replace('CUST-', '')) || 0;
            nextCode = `CUST-${(lastNum + 1).toString().padStart(3, '0')}`;
        }

        const sqlQuery = `
            INSERT INTO customers 
            (customer_code, name, customer_type, industry_id, lead_source_id, website, status, city, state, address, remarks) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            nextCode, name, customer_type || 'Prospect', industry_id,  
            lead_source_id, website, status || 'Active', city, state, address, remarks
        ];

        db.query(sqlQuery, values, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            
            const customer_id = result.insertId;

            // Save all child contacts
            if (child_contacts && child_contacts.length > 0) {
                let completed = 0;
                
                // Helper to generate codes and insert
                child_contacts.forEach((contact, index) => {
                    db.query("SELECT contact_code FROM contacts WHERE contact_code LIKE 'CONT-%' ORDER BY id DESC LIMIT 1", (err, contactRows) => {
                        let nextContCode = 'CONT-001';
                        if (!err && contactRows.length > 0 && contactRows[0].contact_code) {
                            const lastContCode = contactRows[0].contact_code; 
                            const lastContNum = parseInt(lastContCode.replace('CONT-', '')) || 0;
                            // Adding index to ensure unique codes within the same millisecond loop
                            nextContCode = `CONT-${(lastContNum + 1 + index).toString().padStart(3, '0')}`;
                        }

                        const contQuery = `
                            INSERT INTO contacts 
                            (contact_code, customer_id, name, designation, mobile, email, is_primary) 
                            VALUES (?, ?, ?, ?, ?, ?, ?)
                        `;
                        db.query(contQuery, [nextContCode, customer_id, contact.name, contact.designation, contact.mobile, contact.email, contact.is_primary ? 1 : 0], () => {
                            completed++;
                            if (completed === child_contacts.length) {
                                res.status(201).json({ success: true, message: "Customer and Contacts created successfully!" });
                            }
                        });
                    });
                });
            } else {
                res.status(201).json({ success: true, message: "Customer created perfectly!" });
            }
        });
    });
};

exports.getCustomers = (req, res) => {
    // LEFT JOIN with contacts to fetch the name of the primary contact! (is_primary = 1)
    const sql = `
        SELECT c.*, 
               i.name AS industry_name, 
               ls.name AS lead_source_name,
               cont.name AS primary_contact_name
        FROM customers c
        LEFT JOIN industries i ON c.industry_id = i.id
        LEFT JOIN lead_sources ls ON c.lead_source_id = ls.id
        LEFT JOIN contacts cont ON c.id = cont.customer_id AND cont.is_primary = 1
        ORDER BY c.id DESC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ success: true, data: results });
    });
};

exports.updateCustomer = (req, res) => {
    const { id } = req.params;
    const { name, customer_type, industry_id, lead_source_id, website, status, city, state, address, remarks } = req.body;
    
    const sqlQuery = `
        UPDATE customers 
        SET name = ?, customer_type = ?, industry_id = ?, lead_source_id = ?, website = ?, status = ?, city = ?, state = ?, address = ?, remarks = ?
        WHERE id = ?
    `;
    
    const values = [name, customer_type, industry_id, lead_source_id, website, status, city, state, address, remarks, id];
    
    db.query(sqlQuery, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ success: true, message: "Customer updated successfully!" });
    });
};

exports.deleteCustomer = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM customers WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ success: true, message: "Customer deleted successfully!" });
    });
};