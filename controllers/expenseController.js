const db = require('../config/db');

// 1. Naya Kharcha Add Karna (POST)
exports.createExpense = (req, res) => {
    const { visit_id, user_id, expense_type, distance_km, amount } = req.body;
    
    // AUTO-CALCULATION 
    let finalAmount = amount || 0; 
    
    // Agar kharcha 'Travel' ka hai aur Employee ne KM bataye hain, toh apne aap amount nikalo
    if (expense_type === 'Travel' && distance_km) {
        const ratePerKm = 8; // Maan lo company 8 Rs per KM deti hai
        finalAmount = distance_km * ratePerKm;
    }

    const sql = 'INSERT INTO expenses (visit_id, user_id, expense_type, amount) VALUES (?, ?, ?, ?)';
    
    db.query(sql, [visit_id, user_id, expense_type, finalAmount], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ 
            success: true,
            message: "Expense claimed successfully!", 
            calculated_amount: finalAmount 
        });
    });
};

// 2. Saare Kharche Dekhna (GET)
exports.getExpenses = (req, res) => {
    const sql = 'SELECT * FROM expenses ORDER BY created_at DESC';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
};

// 3. Manager ke liye: Kharcha Approve/Reject karna (PUT)
exports.updateExpenseStatus = (req, res) => {
    // URL se id aayegi, aur Body se naya status (approved ya rejected)
    const { id } = req.params; 
    const { status } = req.body; 

    // SQL Query: Update karo expenses table jahan id match ho
    const sql = 'UPDATE expenses SET status = ? WHERE id = ?';
    
    db.query(sql, [status, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ 
            success: true, 
            message: `Expense officially ${status}, Boss!` 
        });
    });
};