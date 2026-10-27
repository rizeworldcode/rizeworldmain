const express = require('express');
const router = express.Router();
const {
  getNextUnicId,
  getLeadReminders,
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead
} = require('../controllers/companyLeadController');
const { protect } = require('../middleware/authMiddleware');

// Protect all CRM leads endpoints
router.use(protect);

router.get('/next-id', getNextUnicId);
router.get('/reminders', getLeadReminders);
router.post('/', createLead);
router.get('/', getAllLeads);
router.get('/:id', getLeadById);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

module.exports = router;
