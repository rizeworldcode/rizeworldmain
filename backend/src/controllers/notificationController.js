const Notification = require('../models/Notification');
const Staff = require('../models/Staff');
const Client = require('../models/Client');
const OldClient = require('../models/OldClient');
const CompanyLead = require('../models/CompanyLead');
const cache = require('../utils/cache');

// Get notifications for a staff member based on their role
exports.getNotificationsForStaff = async (req, res) => {
  try {
    const staffId = req.params.staffId;
    const cacheKey = `notifications:staff:${staffId}`;

    const responseData = await cache.fetchOrCompute(cacheKey, async () => {
      const staff = await Staff.findById(staffId).select('role permissions employeeId').lean();
      if (!staff) return null;

      const staffRole = (staff.role || '').trim();
      const roleRegex = staffRole ? new RegExp(`^${staffRole.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') : null;

      const orConditions = [];
      if (roleRegex) {
        orConditions.push({ recipientRoles: { $regex: roleRegex } });
      }
      orConditions.push({ recipientStaff: staffId });

      // Find notifications where staff's role matches or staff is directly targeted
      const notifications = await Notification.find({
        isActive: true,
        $or: orConditions
      })
        .sort({ createdAt: -1 })
        .populate('clientId', 'name phone pendingAmount deadline')
        .populate('oldClientId', 'name phone totalAmount paidAmount deadline')
        .populate('leadId', 'name companyName unicId nextFollowUpDate')
        .lean();

      // Check which notifications have been read by this staff member
      return notifications.map(notification => {
        const isRead = (notification.readBy || []).some(read => 
          read.staffId && read.staffId.toString() === staffId.toString()
        );
        const dueDate = notification.dueDate || notification.leadId?.nextFollowUpDate || notification.clientId?.deadline || notification.createdAt;
        return {
          ...notification,
          dueDate,
          isRead
        };
      });
    }, 30);

    if (responseData === null) {
      return res.status(404).json({
        success: false,
        message: 'Staff not found'
      });
    }

    res.status(200).json({
      success: true,
      count: responseData.length,
      data: responseData
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
      read.staffId && read.staffId.toString() === staffId.toString()
    );

    if (!alreadyRead) {
      notification.readBy.push({
        staffId: staffId,
        readAt: new Date()
      });
      await notification.save();
    }

    cache.flushByPrefix('notifications:');

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

// Mark all notifications as read for a staff member
exports.markAllNotificationsAsRead = async (req, res) => {
  try {
    const { staffId } = req.params;
    await Notification.updateMany(
      {
        isActive: true,
        'readBy.staffId': { $ne: staffId }
      },
      {
        $addToSet: {
          readBy: {
            staffId: staffId,
            readAt: new Date()
          }
        }
      }
    );

    cache.flushByPrefix('notifications:');

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
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
    const cacheKey = 'notifications:all';

    const notifications = await cache.fetchOrCompute(cacheKey, async () => {
      return await Notification.find()
        .sort({ createdAt: -1 })
        .populate('clientId', 'name phone pendingAmount')
        .populate('oldClientId', 'name phone totalAmount paidAmount')
        .populate('leadId', 'name companyName unicId')
        .lean();
    }, 30);

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
    cache.flushByPrefix('notifications:');
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
    cache.flushByPrefix('notifications:');
    
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
