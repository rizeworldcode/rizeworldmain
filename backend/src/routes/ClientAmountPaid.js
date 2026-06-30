const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/ClientAmountPaid");
const { protect } = require("../middleware/authMiddleware");

// Create booking
router.post("/clientPayment/:clientId", protect, bookingController.updateClientPaidAmount);

module.exports = router;
