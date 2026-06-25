const express = require('express');
const router = express.Router();
const {
  getNotificationsForStaff,
  markNotificationAsRead,
  getAllNotifications,
  deleteNotification,
  createManualNotification
} = require('../controllers/notificationController');
const { notifyHRAndSupport } = require('../utils/notificationService');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// Get notifications for a specific staff member
router.get('/staff/:staffId', getNotificationsForStaff);

// Mark a notification as read
router.patch('/:notificationId/read/:staffId', markNotificationAsRead);

// Test endpoint to trigger a demo notification
router.post('/test', async (req, res) => {
  await notifyHRAndSupport(
    'Test Notification',
    'This is a test notification to verify automatic popup is working!',
    'High'
  );
  res.json({ success: true, message: 'Test notification sent!' });
});

// Admin routes
router.get('/', getAllNotifications);
router.delete('/:id', deleteNotification);
router.post('/', createManualNotification);

module.exports = router;
