const db = require('../config/db');

// Helper to sync opportunity stage based on quotation status / revision
const syncOpportunityStage = (opportunityId, quoteNo, status) => {
    if (!opportunityId) return;

    let targetStage = null;
    if (status === 'ACCEPTED') {
        targetStage = 'Won Deals';
    } else if (status === 'REJECTED') {
        targetStage = 'Lost Deals';
    } else if (quoteNo && (quoteNo.includes('Rev 1') || quoteNo.includes('Rev 2') || quoteNo.includes('Rev 3') || quoteNo.includes('Rev 4'))) {
        targetStage = 'Negotiation';
    } else if (status === 'SENT' || status === 'DRAFT') {
        targetStage = 'Proposal Sent';
    }

    if (targetStage) {
        db.query("UPDATE opportunities SET stage = ? WHERE id = ?", [targetStage, opportunityId], (err) => {
            if (err) console.error("Error syncing opportunity stage:", err);
            else console.log(`Opportunity #${opportunityId} stage automatically shifted to '${targetStage}'`);
        });
    }
};

exports.createQuotation = (req, res) => {
    let {
        quote_no, customer_id, contact_id, opportunity_id, quote_date,
        validity_days, status, offer_notes, terms_conditions,
        subtotal, discount_amount, tax_amount, grand_total, items
    } = req.body;

    if (!opportunity_id) {
        return res.status(400).json({ error: "Quotation must be linked to a valid Opportunity!" });
    }

    const generateCodeAndInsert = () => {
        db.query("SELECT quote_no FROM quotations WHERE quote_no LIKE 'QT-%' ORDER BY id DESC LIMIT 1", (err, rows) => {
            let nextCode = 'QT-001 (Rev 0)';
            if (!err && rows.length > 0 && rows[0].quote_no) {
                const lastCode = rows[0].quote_no;
                const match = lastCode.match(/QT-(\d+)/);
                if (match) {
                    const num = parseInt(match[1]) + 1;
                    nextCode = `QT-${num.toString().padStart(3, '0')} (Rev 0)`;
                }
            }
            if (!quote_no) quote_no = nextCode;

            const q = `INSERT INTO quotations 
                       (quote_no, customer_id, contact_id, opportunity_id, quote_date, validity_days, status, offer_notes, terms_conditions, subtotal, discount_amount, tax_amount, grand_total) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            db.query(q, [
                quote_no, customer_id || null, contact_id || null, opportunity_id || null, 
                quote_date || new Date().toISOString().split('T')[0], validity_days || 30, 
                status || 'DRAFT', offer_notes || '', terms_conditions || '', 
                subtotal || 0, discount_amount || 0, tax_amount || 0, grand_total || 0
            ], (err2, result) => {
                if (err2) return res.status(500).json({ error: err2.message });
                
                const quotationId = result.insertId;

                // Sync Opportunity Stage
                syncOpportunityStage(opportunity_id, quote_no, status || 'DRAFT');

                if (items && items.length > 0) {
                    const itemQ = `INSERT INTO quotation_items (quotation_id, product_name, qty, unit_rate, discount_percent, net_amount) VALUES ?`;
                    const values = items.map(i => [quotationId, i.name || i.product_name, i.qty || 1, i.rate || i.unit_rate || 0, i.disc_percent || i.discount_percent || 0, i.net_amount || (i.qty * i.rate)]);
                    
                    db.query(itemQ, [values], (err3) => {
                        if (err3) console.error("Error inserting quotation items:", err3);
                        return res.json({ success: true, message: 'Quotation created successfully!', quotation_id: quotationId, quote_no: quote_no });
                    });
                } else {
                    return res.json({ success: true, message: 'Quotation created successfully!', quotation_id: quotationId, quote_no: quote_no });
                }
            });
        });
    };

    generateCodeAndInsert();
};

exports.updateQuotation = (req, res) => {
    const { id } = req.params;
    const {
        quote_no, customer_id, contact_id, opportunity_id, quote_date,
        validity_days, status, offer_notes, terms_conditions,
        subtotal, discount_amount, tax_amount, grand_total, items
    } = req.body;

    const sql = `
        UPDATE quotations SET
        quote_no = ?, customer_id = ?, contact_id = ?, opportunity_id = ?, quote_date = ?,
        validity_days = ?, status = ?, offer_notes = ?, terms_conditions = ?,
        subtotal = ?, discount_amount = ?, tax_amount = ?, grand_total = ?
        WHERE id = ?
    `;

    db.query(sql, [
        quote_no, customer_id || null, contact_id || null, opportunity_id || null,
        quote_date || new Date().toISOString().split('T')[0], validity_days || 30,
        status || 'DRAFT', offer_notes || '', terms_conditions || '',
        subtotal || 0, discount_amount || 0, tax_amount || 0, grand_total || 0,
        id
    ], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        // Sync Opportunity Stage
        syncOpportunityStage(opportunity_id, quote_no, status);

        // Replace Items
        db.query("DELETE FROM quotation_items WHERE quotation_id = ?", [id], (errDel) => {
            if (errDel) console.error("Error deleting old quote items:", errDel);

            if (items && items.length > 0) {
                const itemQ = `INSERT INTO quotation_items (quotation_id, product_name, qty, unit_rate, discount_percent, net_amount) VALUES ?`;
                const values = items.map(i => [id, i.name || i.product_name, i.qty || 1, i.rate || i.unit_rate || 0, i.disc_percent || i.discount_percent || 0, i.net_amount || (i.qty * i.rate)]);
                
                db.query(itemQ, [values], (errInsert) => {
                    if (errInsert) console.error("Error updating quote items:", errInsert);
                    return res.json({ success: true, message: 'Quotation updated successfully!' });
                });
            } else {
                return res.json({ success: true, message: 'Quotation updated successfully!' });
            }
        });
    });
};

exports.createRevision = (req, res) => {
    const { id } = req.params;
    const { items, discount_amount, subtotal, tax_amount, grand_total, offer_notes, terms_conditions } = req.body;

    // Fetch existing quote details and its items
    db.query("SELECT * FROM quotations WHERE id = ?", [id], (err, rows) => {
        if (err || rows.length === 0) return res.status(404).json({ error: "Quotation not found" });

        const prev = rows[0];
        const baseNo = prev.quote_no.split('(')[0].trim(); // e.g. "QT-001"
        const currentRevMatch = prev.quote_no.match(/Rev (\d+)/);
        const currentRev = currentRevMatch ? parseInt(currentRevMatch[1]) : 0;
        const newRevNo = `${baseNo} (Rev ${currentRev + 1})`;

        // Mark previous quote as REVISED
        db.query("UPDATE quotations SET status = 'REVISED' WHERE id = ?", [id], (errUpdatePrev) => {
            if (errUpdatePrev) console.error("Error updating previous quote status:", errUpdatePrev);
        });

        // Fetch previous items to copy if new ones not sent
        db.query("SELECT * FROM quotation_items WHERE quotation_id = ?", [id], (errItemsFetch, prevItems) => {
            const finalItems = (items && items.length > 0) ? items : (prevItems || []);

            const q = `INSERT INTO quotations 
                       (quote_no, customer_id, contact_id, opportunity_id, quote_date, validity_days, status, offer_notes, terms_conditions, subtotal, discount_amount, tax_amount, grand_total) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            db.query(q, [
                newRevNo, prev.customer_id, prev.contact_id, prev.opportunity_id,
                new Date().toISOString().split('T')[0], prev.validity_days, 'SENT',
                offer_notes || prev.offer_notes, terms_conditions || prev.terms_conditions,
                subtotal !== undefined ? subtotal : prev.subtotal,
                discount_amount !== undefined ? discount_amount : prev.discount_amount,
                tax_amount !== undefined ? tax_amount : prev.tax_amount,
                grand_total !== undefined ? grand_total : prev.grand_total
            ], (errInsert, result) => {
                if (errInsert) return res.status(500).json({ error: errInsert.message });

                const newQuoteId = result.insertId;

                // Automatically sync opportunity to 'Negotiation'
                syncOpportunityStage(prev.opportunity_id, newRevNo, 'SENT');

                if (finalItems.length > 0) {
                    const itemQ = `INSERT INTO quotation_items (quotation_id, product_name, qty, unit_rate, discount_percent, net_amount) VALUES ?`;
                    const values = finalItems.map(i => [newQuoteId, i.name || i.product_name, i.qty || 1, i.rate || i.unit_rate || 0, i.disc_percent || i.discount_percent || 0, i.net_amount || (i.qty * i.rate)]);
                    db.query(itemQ, [values], (errItems) => {
                        if (errItems) console.error("Error inserting revision items:", errItems);
                        return res.json({ success: true, message: `Quotation Revision ${newRevNo} created! Opportunity moved to Negotiation.`, quotation_id: newQuoteId, quote_no: newRevNo });
                    });
                } else {
                    return res.json({ success: true, message: `Quotation Revision ${newRevNo} created! Opportunity moved to Negotiation.`, quotation_id: newQuoteId, quote_no: newRevNo });
                }
            });
        });
    });
};

exports.getQuotations = (req, res) => {
    const q = `
        SELECT q.*, c.name as customer_name, o.opportunity_no, o.opportunity_name as deal_subject, cp.name as contact_name 
        FROM quotations q 
        LEFT JOIN customers c ON q.customer_id = c.id
        LEFT JOIN opportunities o ON q.opportunity_id = o.id
        LEFT JOIN contacts cp ON q.contact_id = cp.id
        ORDER BY q.id DESC
    `;
    db.query(q, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, data: results });
    });
};

exports.getQuotationById = (req, res) => {
    const { id } = req.params;
    const q = `
        SELECT q.*, c.name as customer_name, o.opportunity_no, o.opportunity_name, cp.name as contact_name 
        FROM quotations q 
        LEFT JOIN customers c ON q.customer_id = c.id
        LEFT JOIN opportunities o ON q.opportunity_id = o.id
        LEFT JOIN contacts cp ON q.contact_id = cp.id
        WHERE q.id = ?
    `;
    db.query(q, [id], (err, rows) => {
        if (err || rows.length === 0) return res.status(404).json({ error: "Quotation not found" });

        const quotation = rows[0];
        db.query("SELECT * FROM quotation_items WHERE quotation_id = ?", [id], (errItems, items) => {
            if (errItems) return res.status(500).json({ error: errItems.message });
            quotation.items = items;
            res.json({ success: true, data: quotation });
        });
    });
};
