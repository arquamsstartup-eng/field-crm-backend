const db = require('../config/db');

exports.createQuotation = (req, res) => {
    const {
        quote_no, customer_id, contact_id, opportunity_id, quote_date,
        validity_days, status, offer_notes, terms_conditions,
        subtotal, discount_amount, tax_amount, grand_total, items
    } = req.body;

    const q = `INSERT INTO quotations 
               (quote_no, customer_id, contact_id, opportunity_id, quote_date, validity_days, status, offer_notes, terms_conditions, subtotal, discount_amount, tax_amount, grand_total) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(q, [quote_no, customer_id, contact_id, opportunity_id, quote_date, validity_days, status, offer_notes, terms_conditions, subtotal, discount_amount, tax_amount, grand_total], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const quotationId = result.insertId;

        if (items && items.length > 0) {
            const itemQ = `INSERT INTO quotation_items (quotation_id, product_name, qty, unit_rate, discount_percent, net_amount) VALUES ?`;
            const values = items.map(i => [quotationId, i.name, i.qty, i.rate, i.disc_percent, i.net_amount]);
            
            db.query(itemQ, [values], (err2) => {
                if (err2) return res.status(500).json({ error: err2.message });
                return res.json({ success: true, message: 'Quotation and items created!', quotation_id: quotationId });
            });
        } else {
            return res.json({ success: true, message: 'Quotation created without items!', quotation_id: quotationId });
        }
    });
};

exports.getQuotations = (req, res) => {
    const q = `SELECT q.*, c.name as customer_name FROM quotations q LEFT JOIN customers c ON q.customer_id = c.id`;
    db.query(q, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, data: results });
    });
};
