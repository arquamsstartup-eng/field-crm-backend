const db = require('../config/db'); 

const createUser = (req, res) => {
    const { 
        name, email, password, role, 
        branch_id, department_id, grade_id, 
        designation_id, gender, dob, joining_date, mobile, status 
    } = req.body; 
    
    // Auto-generate EMP code
    db.query("SELECT emp_code FROM users WHERE emp_code LIKE 'EMP-%' ORDER BY id DESC LIMIT 1", (err, rows) => {
        let nextCode = 'EMP-001';
        if (!err && rows.length > 0 && rows[0].emp_code) {
            const lastCode = rows[0].emp_code; 
            const lastNum = parseInt(lastCode.replace('EMP-', '')) || 0;
            nextCode = `EMP-${(lastNum + 1).toString().padStart(3, '0')}`;
        }

        const sqlQuery = `
            INSERT INTO users 
            (emp_code, name, email, password, role, branch_id, department_id, grade_id, designation_id, gender, dob, joining_date, mobile, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            nextCode, name, email, password, role, 
            branch_id, department_id, grade_id, 
            designation_id, gender, dob, joining_date, mobile, status || 'Active'
        ];

        db.query(sqlQuery, values, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ success: true, message: "Employee account created perfectly!" });
        });
    });
};
// --- Function 2: Saare users nikalna (GET) ---
const getUsers = (req, res) => {
    const sqlQuery = `
        SELECT 
            u.*,
            d.name AS department_name,
            des.name AS designation_name,
            b.name AS branch_name,
            g.code AS grade_code
        FROM users u
        LEFT JOIN departments d ON u.department_id = d.id
        LEFT JOIN designations des ON u.designation_id = des.id
        LEFT JOIN branches b ON u.branch_id = b.id
        LEFT JOIN grade_fuel_rates g ON u.grade_id = g.id
        ORDER BY u.id DESC
    `;
    
    db.query(sqlQuery, (err, results) => {
        if (err) return res.status(500).json({ error: "Failed to fetch users" });
        res.status(200).json({ success: true, data: results });
    });
};

const updateUser = (req, res) => {
    const id = req.params.id;
    const { 
        name, email, password, role, branch_id, department_id, 
        grade_id, designation_id, gender, dob, joining_date, mobile, status 
    } = req.body;

    // Password ko conditionally update karenge (agar pass kiya hai)
    let sqlQuery = `UPDATE users SET name=?, email=?, role=?, branch_id=?, department_id=?, grade_id=?, designation_id=?, gender=?, dob=?, joining_date=?, mobile=?, status=?`;
    let values = [name, email, role, branch_id, department_id, grade_id, designation_id, gender, dob, joining_date, mobile, status];

    if (password) {
        sqlQuery += `, password=?`;
        values.push(password);
    }
    
    sqlQuery += ` WHERE id=?`;
    values.push(id);

    db.query(sqlQuery, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ success: true, message: "Employee updated successfully!" });
    });
};

const deleteUser = (req, res) => {
    const id = req.params.id;
    const sqlQuery = `DELETE FROM users WHERE id=?`;
    db.query(sqlQuery, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ success: true, message: "Employee deleted successfully!" });
    });
};


const loginUser = (req, res) => {
    const { email, password } = req.body;
    
    // SQL me check kar rahe hain ki is email/password wala koi user hai ya nahi
    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    
    db.query(sql, [email, password], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        
        // Agar result 0 hai, matlab galat password
        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid Email or Password" });
        }
        
        // Agar mil gaya, toh uski details bhej do
        res.status(200).json({ message: "Login successful", user: results[0] });
    });
};

// Sirf Managers aur Admins ki list laane ke liye
const getManagers = (req, res) => {
    const sql = "SELECT id, name FROM users WHERE role IN ('MANAGER', 'ADMIN')";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
};


// --- Dono Functions ko aakhiri mein export karna ---
module.exports = { createUser, getUsers, loginUser, getManagers, updateUser, deleteUser };