const db = require('../config/db');

exports.createVisit = (req, res) => {
    let {
        emp_id, customer_id, contact_id, activity_type_id, principal_id,
        visit_date, start_time, end_time, person_count, place_from, place_to,
        sales_report_text, status
    } = req.body;
    
    // Parse expenses (if coming from FormData, it might be a JSON string)
    let expenses = [];
    if (req.body.expenses) {
        try {
            expenses = typeof req.body.expenses === 'string' ? JSON.parse(req.body.expenses) : req.body.expenses;
        } catch (e) {
            console.error('Error parsing expenses:', e);
        }
    }

    // Extract file paths from multer
    let report_file = null;
    const fileMap = {};
    if (req.files) {
        req.files.forEach(f => {
            if (f.fieldname === 'report_file') {
                report_file = f.filename;
            } else if (f.fieldname.startsWith('receipt_')) {
                const expId = f.fieldname.split('_')[1];
                fileMap[expId] = f.filename;
            }
        });
    }

    // Calculate the total claim securely on backend
    let calculated_total = 0;
    if (expenses && expenses.length > 0) {
        expenses.forEach(exp => {
            calculated_total += parseFloat(exp.amount || 0);
        });
    }

    db.query(`SELECT visit_code FROM visits WHERE visit_code LIKE 'VST-%' ORDER BY id DESC LIMIT 1`, (err, rows) => {
        let nextCode = 'VST-001';
        if (!err && rows.length > 0 && rows[0].visit_code) {
            const lastCode = rows[0].visit_code;
            const lastNum = parseInt(lastCode.replace('VST-', '')) || 0;
            nextCode = 'VST-' + (lastNum + 1).toString().padStart(3, '0');
        }

        const sqlQuery = `
            INSERT INTO visits 
            (visit_code, emp_id, customer_id, contact_id, activity_type_id, principal_id, 
            visit_date, start_time, end_time, person_count, place_from, place_to, 
            sales_report_text, total_claim_amount, status, report_file)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            nextCode, emp_id, customer_id, contact_id, activity_type_id, principal_id || null,
            visit_date, start_time, end_time, person_count || 1, place_from, place_to,
            sales_report_text, calculated_total, status || 'Submitted', report_file
        ];

        db.query(sqlQuery, values, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            
            const visit_id = result.insertId;

            if (expenses && expenses.length > 0) {
                let completed = 0;
                expenses.forEach(exp => {
                    const expReceipt = fileMap[exp.id] || null;

                    const expQuery = `
                        INSERT INTO visit_expenses 
                        (visit_id, expense_head_id, start_km, end_km, total_km, fuel_rate, toll_tax, amount, remarks, receipt_file)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;
                    const expValues = [
                        visit_id, exp.expense_head_id, 
                        exp.start_km || 0, exp.end_km || 0, exp.total_km || 0, 
                        exp.fuel_rate || 0.00, exp.toll_tax || 0.00, exp.amount || 0.00, exp.remarks || '', expReceipt
                    ];

                    db.query(expQuery, expValues, (expErr) => {
                        if (expErr) console.error("Expense Insert Error:", expErr);
                        completed++;
                        if (completed === expenses.length) {
                            res.status(201).json({ success: true, message: "Visit & Expenses saved successfully with files!" });
                        }
                    });
                });
            } else {
                res.status(201).json({ success: true, message: "Visit saved without expenses!" });
            }
        });
    });
};

exports.getAllVisits = (req, res) => {
    const sql = `
        SELECT 
            v.*, 
            u.name as employee_name, 
            b.name as branch_name,
            c.name as customer_name,
            a.name as activity_name,
            p.name as principal_name
        FROM visits v
        LEFT JOIN users u ON v.emp_id = u.id
        LEFT JOIN branches b ON u.branch_id = b.id
        LEFT JOIN customers c ON v.customer_id = c.id
        LEFT JOIN activity_types a ON v.activity_type_id = a.id
        LEFT JOIN principals p ON v.principal_id = p.id
        ORDER BY v.id DESC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ success: true, data: results });
    });
};

exports.getVisitById = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM visits WHERE id = ?', [id], (err, visitRows) => {
        if (err) return res.status(500).json({ error: err.message });
        if (visitRows.length === 0) return res.status(404).json({ error: "Visit not found" });
        const visit = visitRows[0];
        const expSql = `
            SELECT ve.*, eh.name as expense_head_name 
            FROM visit_expenses ve
            LEFT JOIN expense_heads eh ON ve.expense_head_id = eh.id
            WHERE ve.visit_id = ?
        `;
        db.query(expSql, [id], (err, expenseRows) => {
            if (err) return res.status(500).json({ error: err.message });
            visit.expenses = expenseRows;
            res.status(200).json({ success: true, data: visit });
        });
    });
};

exports.updateVisitStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['Approved', 'Rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    db.query('UPDATE visits SET status = ? WHERE id = ?', [status, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ success: true, message: 'Visit marked as ' + status });
    });
};
