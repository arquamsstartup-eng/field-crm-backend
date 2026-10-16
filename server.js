const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// 1. Database Connection
const db = require('./config/db');

// 2. Apne Routes (URLs) import kar rahe hain
const userRoutes = require('./routes/userRoutes');
const customerRoutes = require('./routes/customerRoutes');
const contactRoutes = require('./routes/contactRoutes');
const visitRoutes = require('./routes/visitRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const masterRoutes = require('./routes/masterRoutes');
const reportRoutes = require('./routes/reportRoutes');
const quotationRoutes = require('./routes/quotationRoutes');
const opportunityRoutes = require('./routes/opportunityRoutes');

const app = express();
app.use(cors()); 
app.use(express.json()); 

// Make uploads folder accessible publically so React can display images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 3. Engine ko link karna: 
app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/masters', masterRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/opportunities', opportunityRoutes);

// 4. Serve Web Application Portal (React Frontend) if built in ./public
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// Testing Base API / Health Check
app.get('/api/health', (req, res) => {
    res.send('Hello Mr. Stark, CRM Backend is Running!');
});

// Fallback for React Router SPA routes
app.use((req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'), (err) => {
        if (err) {
            res.send('Hello Mr. Stark, CRM Backend is Running!');
        }
    });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Process-level crash prevention
process.on('uncaughtException', (err) => {
    console.error('CRITICAL Uncaught Exception (Handled):', err.message);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('CRITICAL Unhandled Rejection (Handled):', reason);
});

const PORT = process.env.PORT || 5000;

// Auto-align Opportunity stages and won values with Quotations on boot
const syncOpportunitiesOnBoot = () => {
    const syncSql = `
        UPDATE opportunities o
        JOIN (
            SELECT opportunity_id,
                   CASE 
                       WHEN SUM(status = 'ACCEPTED') > 0 THEN 'Won Deals'
                       WHEN SUM(status = 'REJECTED') = COUNT(*) AND COUNT(*) > 0 THEN 'Lost Deals'
                       WHEN SUM(quote_no LIKE '%Rev 1%' OR quote_no LIKE '%Rev 2%' OR quote_no LIKE '%Rev 3%' OR quote_no LIKE '%Rev 4%') > 0 THEN 'Negotiation'
                       WHEN SUM(status = 'SENT' OR status = 'DRAFT') > 0 THEN 'Proposal Sent'
                   END as calculated_stage,
                   MAX(CASE WHEN status = 'ACCEPTED' THEN grand_total ELSE NULL END) as won_grand_total
            FROM quotations
            WHERE opportunity_id IS NOT NULL
            GROUP BY opportunity_id
        ) q_stages ON o.id = q_stages.opportunity_id
        SET o.stage = q_stages.calculated_stage,
            o.estimated_value = CASE 
                WHEN q_stages.calculated_stage = 'Won Deals' AND q_stages.won_grand_total IS NOT NULL AND q_stages.won_grand_total > 0 
                THEN q_stages.won_grand_total 
                ELSE o.estimated_value 
            END
        WHERE q_stages.calculated_stage IS NOT NULL 
          AND (o.stage != q_stages.calculated_stage OR (q_stages.calculated_stage = 'Won Deals' AND q_stages.won_grand_total IS NOT NULL AND o.estimated_value != q_stages.won_grand_total));
    `;
    db.query(syncSql, (err, res) => {
        if (!err && res && res.changedRows > 0) {
            console.log(`[BOOT SYNC] Automatically aligned ${res.changedRows} opportunity stage(s) with quotations!`);
        }
    });
};

app.listen(PORT, () => {
    console.log(`System Online! Server is running on port ${PORT}`);
    syncOpportunitiesOnBoot();
});

if (Number(PORT) !== 80) {
    const server80 = app.listen(80, () => {
        console.log('System Online! Web & API also listening on Port 80');
    });
    server80.on('error', () => {
        // Port 80 might already be in use on local dev machines; safe to ignore
    });
}


