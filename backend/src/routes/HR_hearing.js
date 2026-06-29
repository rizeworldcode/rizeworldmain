const express = require("express");

const { addHearing, updateHearing, deleteHearing, getHearing } = require('../controllers/HR_hearing')

const router = express.Router()
const { protect } = require('../middleware/authMiddleware');

router.post('/addHearing', protect, addHearing)
router.put('/updateHearing/:id', protect, updateHearing)
router.delete('/deleteHearing/:id', protect, deleteHearing)
router.get('/getHearing', getHearing)

module.exports = router;