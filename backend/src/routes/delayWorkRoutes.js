const express = require('express');
const router = express.Router();
const {
  createDelayWork,
  getAllDelayWork,
  getDelayWorkByClient,
  getDelayWorkByStaff,
  updateDelayWork,
  deleteDelayWork,
  exportDelayWork
} = require('../controllers/delayWorkController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createDelayWork);
router.get('/', getAllDelayWork);
router.get('/export', exportDelayWork);
router.get('/client/:clientId', getDelayWorkByClient);
router.get('/staff/:staffId', getDelayWorkByStaff);
router.put('/:id', updateDelayWork);
router.delete('/:id', deleteDelayWork);

module.exports = router;
