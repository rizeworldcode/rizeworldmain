const express = require('express');
const router = express.Router();
const {
  getMasterPool,
  addMasterPoolItem,
  deleteMasterPoolItem
} = require('../controllers/masterPoolController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Get master pool for a staff member
router.get('/:staffId', getMasterPool);

// Add item to master pool
router.post('/', addMasterPoolItem);

// Delete item from master pool
router.delete('/:id', deleteMasterPoolItem);

module.exports = router;
