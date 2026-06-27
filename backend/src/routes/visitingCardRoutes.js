const express = require('express');
const router = express.Router();
const {
  uploadVisitingCard,
  getAllVisitingCards
} = require('../controllers/visitingCardController');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/authMiddleware');

// All visiting card routes are protected with JWT auth middleware
router.use(protect);

router.post('/upload', upload.single('photo'), uploadVisitingCard);
router.get('/all', getAllVisitingCards);

module.exports = router;
