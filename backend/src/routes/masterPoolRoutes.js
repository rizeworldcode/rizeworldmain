const express = require('express');
const router = express.Router();
const {
  addMasterPoolItem,
  getMasterPoolItems,
  deleteMasterPoolItem,
} = require('../controllers/masterPoolController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All master pool routes are protected

router.post('/', addMasterPoolItem);
router.get('/:staffId', getMasterPoolItems);
router.delete('/:id', deleteMasterPoolItem);

module.exports = router;