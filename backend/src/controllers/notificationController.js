const Notification = require('../models/Notification');
const Staff = require('../models/Staff');
const Client = require('../models/Client');
const OldClient = require('../models/OldClient');
const CompanyLead = require('../models/CompanyLead');
const cache = require('../utils/cache');
const moment = require('moment-timezone');

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
      // and exclude notifications already dismissed/marked done by this staff member
      const notifications = await Notification.find({
        isActive: true,
        'dismissedBy.staffId': { $ne: staffId },
        $or: orConditions
      })
        .sort({ updatedAt: -1, createdAt: -1 })
        .populate('clientId', 'name phone pendingAmount deadline')
        .populate('oldClientId', 'name phone totalAmount paidAmount deadline')
        .populate('leadId', 'name companyName unicId nextFollowUpDate leadStatus assignedStaffId')
        .lean();

      const seenLeadIds = new Set();
      const duplicateNotifIdsToDelete = [];
      const deduplicatedNotifications = [];

      for (const notification of notifications) {
        if (notification.leadId) {
          const leadObj = notification.leadId;
          const leadIdStr = (leadObj._id || leadObj).toString();

          // 1. If lead is Converted or Lost, or reassigned to another staff member, do not show
          if (leadObj && typeof leadObj === 'object') {
            if (leadObj.leadStatus === 'Converted' || leadObj.leadStatus === 'Lost') {
              duplicateNotifIdsToDelete.push(notification._id);
              continue;
            }
            if (leadObj.assignedStaffId) {
              const assignedId = (leadObj.assignedStaffId._id || leadObj.assignedStaffId).toString();
              if (assignedId !== staffId.toString()) {
                duplicateNotifIdsToDelete.push(notification._id);
                continue;
              }
            }
          }

          // 2. Ensure only ONE notification per lead exists (the latest one)
          if (seenLeadIds.has(leadIdStr)) {
            duplicateNotifIdsToDelete.push(notification._id);
            continue;
          }
          seenLeadIds.add(leadIdStr);

          // 3. Format title & message to strictly match the latest brand name and follow-up date/time
          const brandName = (leadObj?.companyName && leadObj.companyName.trim()) 
            ? leadObj.companyName.trim() 
            : (leadObj?.name ? leadObj.name.trim() : 'Brand');

          const latestDueDate = leadObj?.nextFollowUpDate || notification.dueDate;
          const formattedDateTime = latestDueDate 
            ? moment(latestDueDate).tz('Asia/Kolkata').format('DD MMM YYYY, hh:mm A')
            : null;

          const isRead = (notification.readBy || []).some(read => 
            read.staffId && read.staffId.toString() === staffId.toString()
          );

          deduplicatedNotifications.push({
            ...notification,
            title: `Brand: ${brandName}`,
            message: formattedDateTime ? `Date & Time: ${formattedDateTime}` : notification.message,
            dueDate: latestDueDate || notification.createdAt,
            isRead
          });
        } else {
          // Client payment reminder or system alert
          const isRead = (notification.readBy || []).some(read => 
            read.staffId && read.staffId.toString() === staffId.toString()
          );
          const dueDate = notification.dueDate || notification.clientId?.deadline || notification.oldClientId?.deadline || notification.createdAt;
          deduplicatedNotifications.push({
            ...notification,
            dueDate,
            isRead
          });
        }
      }

      // Clean up duplicate / obsolete notifications in the background
      if (duplicateNotifIdsToDelete.length > 0) {
        Notification.deleteMany({ _id: { $in: duplicateNotifIdsToDelete } })
          .catch(err => console.error('Error deleting duplicate notifications:', err));
      }

      return deduplicatedNotifications;
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

// Mark notification as Done / Dismissed by staff
exports.dismissNotification = async (req, res) => {
  try {
    const { notificationId, staffId } = req.params;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Add to dismissedBy if not already present
    const alreadyDismissed = (notification.dismissedBy || []).some(d =>
      d.staffId && d.staffId.toString() === staffId.toString()
    );

    if (!alreadyDismissed) {
      notification.dismissedBy = notification.dismissedBy || [];
      notification.dismissedBy.push({
        staffId: staffId,
        dismissedAt: new Date()
      });
    }

    // Also mark as read
    const alreadyRead = (notification.readBy || []).some(r =>
      r.staffId && r.staffId.toString() === staffId.toString()
    );
    if (!alreadyRead) {
      notification.readBy = notification.readBy || [];
      notification.readBy.push({
        staffId: staffId,
        readAt: new Date()
      });
    }

    // If targeted solely to this staff member (e.g. CRM Follow-up), mark inactive
    const isSingleRecipient = (!notification.recipientRoles || notification.recipientRoles.length === 0) &&
      (notification.recipientStaff || []).length <= 1;
    if (isSingleRecipient) {
      notification.isActive = false;
    }

    await notification.save();

    cache.flushByPrefix('notifications:');

    res.status(200).json({
      success: true,
      message: 'Notification marked as done and removed',
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
