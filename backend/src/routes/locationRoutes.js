const express = require('express');
const router = express.Router();
const {
  updateLocation,
  getLiveLocations,
  getLocationHistory
} = require('../controllers/locationController');
const { protect } = require('../middleware/authMiddleware');

// All location routes are protected with JWT auth middleware
router.use(protect);

router.post('/update', updateLocation);
router.get('/live', getLiveLocations);
router.get('/history/:employeeId', getLocationHistory);

module.exports = router;
