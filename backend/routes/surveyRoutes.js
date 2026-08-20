const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const surveyController = require('../controllers/surveyController');

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

// API Routes
router.get('/surveys/stats', surveyController.getSurveyStats);
router.get('/stats', surveyController.getSurveyStats);
router.get('/surveys/export', surveyController.exportCSV);
router.get('/export', surveyController.exportCSV);
router.post('/surveys', upload.array('images', 5), surveyController.createSurvey);
router.get('/surveys', surveyController.getAllSurveys);
router.get('/surveys/:id', surveyController.getSurveyById);
router.delete('/surveys/:id', surveyController.deleteSurvey);

module.exports = router;
