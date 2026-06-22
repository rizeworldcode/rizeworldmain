const Notification = require('../models/Notification');
const Staff = require('../models/Staff');

// Get notifications for a staff member based on their role
exports.getNotificationsForStaff = async (req, res) => {
  try {
    const staffId = req.params.staffId;
    
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff not found'
      });
    }

    // Find notifications where the staff's role is in recipientRoles
    const notifications = await Notification.find({
      recipientRoles: { $in: [staff.role] },
      isActive: true
    })
      .sort({ createdAt: -1 })
      .populate('clientId', 'name phone pendingAmount')
      .populate('oldClientId', 'name phone totalAmount paidAmount');

    // Check which notifications have been read by this staff member
    const notificationsWithReadStatus = notifications.map(notification => {
      const isRead = notification.readBy.some(read => 
        read.staffId.toString() === staffId.toString()
      );
      
      return {
        ...notification.toObject(),
        isRead
      };
    });

    res.status(200).json({
      success: true,
      count: notificationsWithReadStatus.length,
      data: notificationsWithReadStatus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Mark a notification as read
exports.markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId, staffId } = req.params;
    
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check if already read by this staff member
    const alreadyRead = notification.readBy.some(read => 
      read.staffId.toString() === staffId.toString()
    );

    if (!alreadyRead) {
      notification.readBy.push({
        staffId: staffId,
        readAt: new Date()
      });
      await notification.save();
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all notifications (admin only)
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .populate('clientId', 'name phone pendingAmount')
      .populate('oldClientId', 'name phone totalAmount paidAmount');

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create a manual notification (admin only)
exports.createManualNotification = async (req, res) => {
  try {
    const { title, message, type, priority, recipientRoles, clientId, oldClientId } = req.body;
    
    const notification = new Notification({
      title,
      message,
      type,
      priority,
      recipientRoles,
      clientId,
      oldClientId
    });
    
    await notification.save();
    
    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: notification
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
