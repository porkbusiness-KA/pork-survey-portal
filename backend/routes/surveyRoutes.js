const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const surveyController = require('../controllers/surveyController');
const { requireAdmin } = require('../middleware/authMiddleware');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'shop-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max per image
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files (JPEG, JPG, PNG, WEBP, GIF) are allowed!'));
  }
});

// Auth Routes
router.post('/auth/verify', (req, res) => {
  const configuredPin = process.env.ADMIN_PIN || 'porkadmin2026';
  const { pin } = req.body;
  if (pin && pin.trim() === configuredPin.trim()) {
    return res.json({ success: true, message: 'Admin authenticated successfully', token: pin.trim() });
  }
  return res.status(401).json({ success: false, message: 'Incorrect Admin PIN. Please try again.' });
});

// Protected Admin API Routes (Analytics, Excel Export, Record Deletion)
router.get('/surveys/stats', requireAdmin, surveyController.getSurveyStats);
router.get('/stats', requireAdmin, surveyController.getSurveyStats);
router.get('/surveys/export', requireAdmin, surveyController.exportCSV);
router.get('/export', requireAdmin, surveyController.exportCSV);
router.delete('/surveys/:id', requireAdmin, surveyController.deleteSurvey);

// Public / Field Team Routes (Survey Submission, Records List & Details)
router.post('/surveys', upload.array('images', 5), surveyController.createSurvey);
router.get('/surveys', surveyController.getAllSurveys);
router.get('/surveys/:id', surveyController.getSurveyById);

module.exports = router;
