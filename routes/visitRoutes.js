const express = require('express');
const router = express.Router();
const visitController = require('../controllers/visitController');
const multer = require('multer');
const path = require('path');

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Uploads will go to backend/uploads folder
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Define Routes
// We use .any() so it accepts 'report_file' and 'receipt_X' dynamic names
router.post('/add', upload.any(), visitController.createVisit);
router.get('/all', visitController.getAllVisits);
router.get('/:id', visitController.getVisitById);
router.put('/update-status/:id', visitController.updateVisitStatus);

module.exports = router;
