const db = require('../config/db');

exports.createOpportunity = (req, res) => {
    const { 
        opportunity_name, customer_id, contact_id, lead_source, 
        assigned_rep, stage, estimated_value, lead_date, 
        expected_closure_date, is_new_client, technical_requirements, 
        competitor_brand, competitor_price, competitor_threat_level, 
        competitor_strengths, competitor_weaknesses, win_loss_rationale,
        products // array from Tab 2
    } = req.body;

    // Generate OPP-XXX code
    db.query("SELECT opportunity_no FROM opportunities WHERE opportunity_no LIKE 'OPP-%' ORDER BY id DESC LIMIT 1", (err, rows) => {
        let nextCode = 'OPP-001';
        if (!err && rows.length > 0 && rows[0].opportunity_no) {
            const lastCode = rows[0].opportunity_no; 
            const lastNum = parseInt(lastCode.replace('OPP-', '')) || 0;
            nextCode = `OPP-${(lastNum + 1).toString().padStart(3, '0')}`;
        }

        const sqlQuery = `
            INSERT INTO opportunities 
            (opportunity_no, opportunity_name, customer_id, principal_name, contact_person_id, lead_source, 
             assigned_salesperson_id, stage, estimated_value, lead_date, expected_closure_date, 
             is_new_client, technical_requirements, competitor_brand, competitor_price, 
             competitor_threat_level, competitor_strengths, competitor_weaknesses, win_loss_rationale) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            nextCode, opportunity_name, customer_id || null, req.body.principal || null, contact_id || null, lead_source,
            assigned_rep || null, stage, estimated_value || 0, lead_date || null, expected_closure_date || null,
            is_new_client ? 1 : 0, technical_requirements, competitor_brand, competitor_price || 0,
            competitor_threat_level, competitor_strengths, competitor_weaknesses, win_loss_rationale
        ];

        db.query(sqlQuery, values, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            
            const oppId = result.insertId;

            // Insert products if any
            if (products && products.length > 0) {
                const prodValues = products.map(p => [
                    oppId, p.id || null, p.principal, p.qty, p.rate, (p.qty * p.rate)
                ]);
                
                const prodSql = `INSERT INTO opportunity_products (opportunity_id, product_id, principal_name, quantity, unit_rate, line_total) VALUES ?`;
                db.query(prodSql, [prodValues], (err) => {
                    if (err) console.error("Error inserting products:", err);
                    res.status(201).json({ success: true, message: "Opportunity created successfully!", data: { id: oppId, opportunity_no: nextCode } });
                });
            } else {
                res.status(201).json({ success: true, message: "Opportunity created successfully!", data: { id: oppId, opportunity_no: nextCode } });
            }
        });
    });
};

exports.updateOpportunity = (req, res) => {
    const { id } = req.params;
    const { 
        opportunity_name, customer_id, contact_id, lead_source, 
        assigned_rep, stage, estimated_value, lead_date, 
        expected_closure_date, is_new_client, technical_requirements, 
        competitor_brand, competitor_price, competitor_threat_level, 
        competitor_strengths, competitor_weaknesses, win_loss_rationale,
        products // array from Tab 2
    } = req.body;

    const sqlQuery = `
        UPDATE opportunities SET
        opportunity_name = ?, customer_id = ?, principal_name = ?, contact_person_id = ?, lead_source = ?, 
        assigned_salesperson_id = ?, stage = ?, estimated_value = ?, lead_date = ?, expected_closure_date = ?, 
        is_new_client = ?, technical_requirements = ?, competitor_brand = ?, competitor_price = ?, 
        competitor_threat_level = ?, competitor_strengths = ?, competitor_weaknesses = ?, win_loss_rationale = ?
        WHERE id = ?
    `;

    const values = [
        opportunity_name, customer_id || null, req.body.principal || null, contact_id || null, lead_source,
        assigned_rep || null, stage, estimated_value || 0, lead_date || null, expected_closure_date || null,
        is_new_client ? 1 : 0, technical_requirements, competitor_brand, competitor_price || 0,
        competitor_threat_level, competitor_strengths, competitor_weaknesses, win_loss_rationale,
        id
    ];

    db.query(sqlQuery, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        
        // Delete old products
        db.query(`DELETE FROM opportunity_products WHERE opportunity_id = ?`, [id], (err2) => {
            if (err2) console.error("Error deleting old products:", err2);
            
            // Insert new products if any
            if (products && products.length > 0) {
                const prodValues = products.map(p => [
                    id, p.id || null, p.principal, p.qty, p.rate, (p.qty * p.rate)
                ]);
                
                const prodSql = `INSERT INTO opportunity_products (opportunity_id, product_id, principal_name, quantity, unit_rate, line_total) VALUES ?`;
                db.query(prodSql, [prodValues], (err3) => {
                    if (err3) console.error("Error inserting products:", err3);
                    res.status(200).json({ success: true, message: "Opportunity updated successfully!" });
                });
            } else {
                res.status(200).json({ success: true, message: "Opportunity updated successfully!" });
            }
        });
    });
};

exports.getAllOpportunities = (req, res) => {
    const sql = `
        SELECT o.*, c.name as customer_name, u.name as salesperson_name, cp.name as contact_name
        FROM opportunities o
        LEFT JOIN customers c ON o.customer_id = c.id
        LEFT JOIN users u ON o.assigned_salesperson_id = u.id
        LEFT JOIN contacts cp ON o.contact_person_id = cp.id
        ORDER BY o.id DESC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ success: true, data: results });
    });
};

exports.getOpportunityStats = (req, res) => {
    const sql = `
        SELECT 
            COUNT(id) as active_count, 
            SUM(estimated_value) as total_pipeline_value,
            SUM(CASE WHEN stage = 'Won Deals' THEN estimated_value ELSE 0 END) as won_value,
            COUNT(CASE WHEN stage = 'Won Deals' THEN id END) as won_count
        FROM opportunities
    `;
    db.query(sql, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ success: true, data: rows[0] });
    });
};
