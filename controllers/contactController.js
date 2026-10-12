const db = require('../config/db');

exports.createContact = (req, res) => {
    const { customer_id, name, designation, mobile, email, is_primary } = req.body;
    
    // Auto-generate Contact code (CONT-001)
    db.query("SELECT contact_code FROM contacts WHERE contact_code LIKE 'CONT-%' ORDER BY id DESC LIMIT 1", (err, rows) => {
        let nextCode = 'CONT-001';
        if (!err && rows.length > 0 && rows[0].contact_code) {
            const lastCode = rows[0].contact_code; 
            const lastNum = parseInt(lastCode.replace('CONT-', '')) || 0;
            nextCode = `CONT-${(lastNum + 1).toString().padStart(3, '0')}`;
        }

        const insertContact = () => {
            const sqlQuery = `
                INSERT INTO contacts 
                (contact_code, customer_id, name, designation, mobile, email, is_primary) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [nextCode, customer_id, name, designation, mobile, email, is_primary ? 1 : 0];

            db.query(sqlQuery, values, (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json({ success: true, message: "Contact created successfully!" });
            });
        };

        // Handle is_primary logic
        if (is_primary) {
            db.query("UPDATE contacts SET is_primary = 0 WHERE customer_id = ?", [customer_id], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                insertContact();
            });
        } else {
            insertContact();
        }
    });
};

exports.getContactsByCustomer = (req, res) => {
    const { customer_id } = req.params;
    const sql = `SELECT * FROM contacts WHERE customer_id = ? ORDER BY is_primary DESC, id DESC`;
    
    db.query(sql, [customer_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ success: true, data: results });
    });
};

exports.updateContact = (req, res) => {
    const { id } = req.params;
    const { name, designation, mobile, email, is_primary } = req.body;

    const updateQuery = () => {
        const sqlQuery = `
            UPDATE contacts 
            SET name = ?, designation = ?, mobile = ?, email = ?, is_primary = ?
            WHERE id = ?
        `;
        const values = [name, designation, mobile, email, is_primary ? 1 : 0, id];
        
        db.query(sqlQuery, values, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ success: true, message: "Contact updated successfully!" });
        });
    };

    if (is_primary) {
        // Need customer_id to reset others
        db.query("SELECT customer_id FROM contacts WHERE id = ?", [id], (err, rows) => {
            if (err || rows.length === 0) return res.status(500).json({ error: "Contact not found" });
            const customer_id = rows[0].customer_id;
            
            db.query("UPDATE contacts SET is_primary = 0 WHERE customer_id = ? AND id != ?", [customer_id, id], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                updateQuery();
            });
        });
    } else {
        updateQuery();
    }
};

exports.deleteContact = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM contacts WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ success: true, message: "Contact deleted successfully!" });
    });
};

exports.getAllContacts = (req, res) => {
    const sql = `
        SELECT cont.*, cust.name as company_name 
        FROM contacts cont 
        LEFT JOIN customers cust ON cont.customer_id = cust.id 
        ORDER BY cont.id DESC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ success: true, data: results });
    });
};