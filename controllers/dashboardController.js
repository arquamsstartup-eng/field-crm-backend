const db = require('../config/db');

exports.getDashboardStats = (req, res) => {
    const statsSql = `
        SELECT 
            (SELECT COUNT(*) FROM visits) AS total_visits,
            (SELECT IFNULL(SUM(total_claim_amount), 0) FROM visits WHERE status = 'Approved') AS total_approved_expenses,
            (SELECT COUNT(*) FROM visits WHERE status = 'Submitted') AS pending_approvals,
            (SELECT COUNT(*) FROM customers) AS active_customers
    `;
    
    db.query(statsSql, (err, statsResults) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const recentVisitsSql = `
            SELECT 
                v.*, 
                u.name as employee_name, 
                c.name as customer_name,
                a.name as activity_name
            FROM visits v
            LEFT JOIN users u ON v.emp_id = u.id
            LEFT JOIN customers c ON v.customer_id = c.id
            LEFT JOIN activity_types a ON v.activity_type_id = a.id
            ORDER BY v.id DESC LIMIT 5
        `;

        db.query(recentVisitsSql, (err, visitResults) => {
            if (err) return res.status(500).json({ error: err.message });

            res.status(200).json({ 
                success: true, 
                stats: statsResults[0],
                recentVisits: visitResults
            });
        });
    });
};