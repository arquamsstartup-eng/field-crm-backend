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

        // If auto_generate_quote is requested, default stage to 'Proposal Sent'
        const finalStage = req.body.auto_generate_quote ? 'Proposal Sent' : (stage || 'New Leads');

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
            assigned_rep || null, finalStage, estimated_value || 0, lead_date || null, expected_closure_date || null,
            is_new_client ? 1 : 0, technical_requirements, competitor_brand, competitor_price || 0,
            competitor_threat_level, competitor_strengths, competitor_weaknesses, win_loss_rationale
        ];

        db.query(sqlQuery, values, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            
            const oppId = result.insertId;

            const handleQuotationCreation = (callback) => {
                if (!req.body.auto_generate_quote) return callback();

                // Generate Quote Code QT-001 (Rev 0)
                db.query("SELECT quote_no FROM quotations WHERE quote_no LIKE 'QT-%' ORDER BY id DESC LIMIT 1", (errQ, qRows) => {
                    let nextQuoteCode = 'QT-001 (Rev 0)';
                    if (!errQ && qRows.length > 0 && qRows[0].quote_no) {
                        const lastQ = qRows[0].quote_no;
                        const match = lastQ.match(/QT-(\d+)/);
                        if (match) {
                            const num = parseInt(match[1]) + 1;
                            nextQuoteCode = `QT-${num.toString().padStart(3, '0')} (Rev 0)`;
                        }
                    }

                    const subtotal = products && products.length > 0 
                        ? products.reduce((acc, p) => acc + (p.qty * p.rate), 0) 
                        : parseFloat(estimated_value) || 0;
                    const tax = subtotal * 0.18;
                    const grandTotal = subtotal + tax;

                    const qSql = `
                        INSERT INTO quotations 
                        (quote_no, customer_id, contact_id, opportunity_id, quote_date, validity_days, status, offer_notes, terms_conditions, subtotal, discount_amount, tax_amount, grand_total) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;

                    const terms = "1. Price Basis: Ex-works manufacturing facility.\n2. Payment: 30% advance, balance against proforma before dispatch.\n3. Taxes: 18% GST Extra as applicable.\n4. Delivery: 4-6 weeks from PO.";
                    const qValues = [
                        nextQuoteCode, customer_id || null, contact_id || null, oppId, 
                        lead_date || new Date().toISOString().split('T')[0], 30, 'SENT', 
                        `Auto-generated from Opportunity ${nextCode}: ${opportunity_name}`,
                        terms, subtotal, 0, tax, grandTotal
                    ];

                    db.query(qSql, qValues, (errInsertQ, resInsertQ) => {
                        if (errInsertQ) {
                            console.error("Auto quotation generation failed:", errInsertQ);
                            return callback();
                        }

                        const quoteId = resInsertQ.insertId;
                        if (products && products.length > 0) {
                            const qItemSql = `INSERT INTO quotation_items (quotation_id, product_name, qty, unit_rate, discount_percent, net_amount) VALUES ?`;
                            const qItemValues = products.map(p => [
                                quoteId, p.name || 'Machinery Item', p.qty || 1, p.rate || 0, 0, (p.qty * p.rate)
                            ]);
                            db.query(qItemSql, [qItemValues], (errItem) => {
                                if (errItem) console.error("Quotation items insertion failed:", errItem);
                                callback();
                            });
                        } else {
                            callback();
                        }
                    });
                });
            };

            // Insert products if any
            if (products && products.length > 0) {
                const prodValues = products.map(p => [
                    oppId, p.id || null, p.principal, p.qty, p.rate, (p.qty * p.rate)
                ]);
                
                const prodSql = `INSERT INTO opportunity_products (opportunity_id, product_id, principal_name, quantity, unit_rate, line_total) VALUES ?`;
                db.query(prodSql, [prodValues], (err) => {
                    if (err) console.error("Error inserting products:", err);
                    handleQuotationCreation(() => {
                        res.status(201).json({ success: true, message: "Opportunity and Auto-Quotation created successfully!", data: { id: oppId, opportunity_no: nextCode } });
                    });
                });
            } else {
                handleQuotationCreation(() => {
                    res.status(201).json({ success: true, message: "Opportunity created successfully!", data: { id: oppId, opportunity_no: nextCode } });
                });
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

exports.getOpportunityById = (req, res) => {
    const { id } = req.params;
    const oppSql = `
        SELECT o.*, c.name as customer_name, u.name as salesperson_name, cp.name as contact_name
        FROM opportunities o
        LEFT JOIN customers c ON o.customer_id = c.id
        LEFT JOIN users u ON o.assigned_salesperson_id = u.id
        LEFT JOIN contacts cp ON o.contact_person_id = cp.id
        WHERE o.id = ?
    `;

    db.query(oppSql, [id], (err, rows) => {
        if (err || rows.length === 0) return res.status(404).json({ error: "Opportunity not found" });

        const opp = rows[0];
        const prodSql = `
            SELECT op.*, COALESCE(p.name, op.principal_name) as name, p.code
            FROM opportunity_products op
            LEFT JOIN products p ON op.product_id = p.id
            WHERE op.opportunity_id = ?
        `;

        db.query(prodSql, [id], (err2, products) => {
            if (err2) return res.status(500).json({ error: err2.message });
            opp.products = products;
            res.status(200).json({ success: true, data: opp });
        });
    });
};

exports.recordLoss = (req, res) => {
    const { id } = req.params;
    const { competitor_brand, competitor_price, win_loss_rationale } = req.body;

    const sql = `
        UPDATE opportunities SET 
        stage = 'Lost Deals', 
        competitor_brand = ?, 
        competitor_price = ?, 
        win_loss_rationale = ? 
        WHERE id = ?
    `;

    db.query(sql, [competitor_brand || null, competitor_price || 0, win_loss_rationale || null, id], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        // Also mark linked quotation(s) as REJECTED if any
        db.query("UPDATE quotations SET status = 'REJECTED' WHERE opportunity_id = ?", [id], (err2) => {
            if (err2) console.error("Error setting quotation to REJECTED:", err2);
            res.json({ success: true, message: "Deal marked as Lost and competitor details recorded!" });
        });
    });
};

