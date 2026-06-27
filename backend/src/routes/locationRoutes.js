const express = require('express');
const router = express.Router();
const {
  updateLocation,
  getLiveLocations,
  getLocationHistory,
  uploadPhotoLocation,
  getLocationPhotos
} = require('../controllers/locationController');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/authMiddleware');

// All location routes are protected with JWT auth middleware
router.use(protect);

router.post('/update', updateLocation);
router.post('/photo', upload.single('photo'), uploadPhotoLocation);
router.get('/live', getLiveLocations);
router.get('/history/:employeeId', getLocationHistory);
router.get('/photos', getLocationPhotos);

module.exports = router;
