const db = require('../config/db');

exports.getMonthlyReport = (req, res) => {
    const { month, year, emp_id, customer_id } = req.query;

    let conditions = '1=1';
    let params = [];

    // Filter by Month and Year
    if (month) {
        conditions += ' AND MONTH(v.visit_date) = ?';
        params.push(month);
    }
    if (year) {
        conditions += ' AND YEAR(v.visit_date) = ?';
        params.push(year);
    }

    // Filter by Employee
    if (emp_id) {
        conditions += ' AND v.emp_id = ?';
        params.push(emp_id);
    }

    // Filter by Customer
    if (customer_id) {
        conditions += ' AND v.customer_id = ?';
        params.push(customer_id);
    }

    // Query 1: Summary Cards
    const summarySql = `
        SELECT 
            IFNULL(SUM(v.total_claim_amount), 0) AS total_claimed,
            IFNULL(SUM(CASE WHEN v.status = 'Approved' THEN v.total_claim_amount ELSE 0 END), 0) AS approved_amount,
            IFNULL(SUM(CASE WHEN v.status = 'Submitted' THEN v.total_claim_amount ELSE 0 END), 0) AS pending_amount,
            IFNULL(SUM(CASE WHEN v.status = 'Rejected' THEN v.total_claim_amount ELSE 0 END), 0) AS rejected_amount,
            COUNT(*) AS total_visits,
            SUM(CASE WHEN v.status = 'Approved' THEN 1 ELSE 0 END) AS approved_visits,
            SUM(CASE WHEN v.status = 'Submitted' THEN 1 ELSE 0 END) AS pending_visits,
            SUM(CASE WHEN v.status = 'Rejected' THEN 1 ELSE 0 END) AS rejected_visits
        FROM visits v
        WHERE ${conditions}
    `;

    // Query 2: Detailed Table Data
    const dataSql = `
        SELECT 
            v.*, 
            u.name as employee_name, 
            c.name as customer_name,
            a.name as activity_name,
            b.name as branch_name
        FROM visits v
        LEFT JOIN users u ON v.emp_id = u.id
        LEFT JOIN customers c ON v.customer_id = c.id
        LEFT JOIN activity_types a ON v.activity_type_id = a.id
        LEFT JOIN branches b ON u.branch_id = b.id
        WHERE ${conditions}
        ORDER BY v.visit_date DESC
    `;

    db.query(summarySql, params, (err, summaryResults) => {
        if (err) return res.status(500).json({ error: err.message });

        db.query(dataSql, params, (err, dataResults) => {
            if (err) return res.status(500).json({ error: err.message });

            res.status(200).json({
                success: true,
                summary: summaryResults[0],
                data: dataResults
            });
        });
    });
};

exports.getWeeklyReport = (req, res) => {
    const { year, week, start_date, end_date, emp_id, customer_id } = req.query;

    let conditions = '1=1';
    let params = [];

    // Filter by Date Range (Start Date - End Date) or Year + Week
    if (start_date && end_date) {
        conditions += ' AND DATE(v.visit_date) BETWEEN ? AND ?';
        params.push(start_date, end_date);
    } else if (start_date) {
        conditions += ' AND DATE(v.visit_date) >= ?';
        params.push(start_date);
    } else if (end_date) {
        conditions += ' AND DATE(v.visit_date) <= ?';
        params.push(end_date);
    } else {
        if (year) {
            conditions += ' AND YEAR(v.visit_date) = ?';
            params.push(year);
        }
        if (week) {
            conditions += ' AND WEEK(v.visit_date, 1) = ?';
            params.push(week);
        }
    }

    // Filter by Employee
    if (emp_id) {
        conditions += ' AND v.emp_id = ?';
        params.push(emp_id);
    }

    // Filter by Customer
    if (customer_id) {
        conditions += ' AND v.customer_id = ?';
        params.push(customer_id);
    }

    // Query 1: Summary Cards
    const summarySql = `
        SELECT 
            IFNULL(SUM(v.total_claim_amount), 0) AS total_claimed,
            IFNULL(SUM(CASE WHEN v.status = 'Approved' THEN v.total_claim_amount ELSE 0 END), 0) AS approved_amount,
            IFNULL(SUM(CASE WHEN v.status = 'Submitted' THEN v.total_claim_amount ELSE 0 END), 0) AS pending_amount,
            IFNULL(SUM(CASE WHEN v.status = 'Rejected' THEN v.total_claim_amount ELSE 0 END), 0) AS rejected_amount,
            COUNT(*) AS total_visits,
            SUM(CASE WHEN v.status = 'Approved' THEN 1 ELSE 0 END) AS approved_visits,
            SUM(CASE WHEN v.status = 'Submitted' THEN 1 ELSE 0 END) AS pending_visits,
            SUM(CASE WHEN v.status = 'Rejected' THEN 1 ELSE 0 END) AS rejected_visits
        FROM visits v
        WHERE ${conditions}
    `;

    // Query 2: Detailed Table Data
    const dataSql = `
        SELECT 
            v.*, 
            u.name as employee_name, 
            c.name as customer_name,
            a.name as activity_name,
            b.name as branch_name
        FROM visits v
        LEFT JOIN users u ON v.emp_id = u.id
        LEFT JOIN customers c ON v.customer_id = c.id
        LEFT JOIN activity_types a ON v.activity_type_id = a.id
        LEFT JOIN branches b ON u.branch_id = b.id
        WHERE ${conditions}
        ORDER BY v.visit_date DESC
    `;

    db.query(summarySql, params, (err, summaryResults) => {
        if (err) return res.status(500).json({ error: err.message });

        db.query(dataSql, params, (err, dataResults) => {
            if (err) return res.status(500).json({ error: err.message });

            res.status(200).json({
                success: true,
                summary: summaryResults[0],
                data: dataResults
            });
        });
    });
};

