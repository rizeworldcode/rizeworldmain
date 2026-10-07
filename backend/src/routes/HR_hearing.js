const express = require("express");

const {
    addHearing,
    updateHearing,
    deleteHearing,
    getHearing,
    applyForHearing,
    updateApplicationStatus,
    deleteApplication
} = require('../controllers/HR_hearing')

const router = express.Router()
const { protect } = require('../middleware/authMiddleware');

router.post('/addHearing', protect, addHearing)
router.put('/updateHearing/:id', protect, updateHearing)
router.delete('/deleteHearing/:id', protect, deleteHearing)
router.get('/getHearing', getHearing)

// Public route for job applicants
router.post('/hearing/:id/apply', applyForHearing)

// Admin routes for application management
router.patch('/hearing/:id/applications/:appId/status', protect, updateApplicationStatus)
router.delete('/hearing/:id/applications/:appId', protect, deleteApplication)

module.exports = router;