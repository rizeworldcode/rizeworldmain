const Notification = require('../models/Notification');
const Staff = require('../models/Staff');
const { getIO } = require('../../socket');
const axios = require('axios');
const nodemailer = require('nodemailer');

// Send email via Brevo (Sendinblue)
const sendEmailViaBrevo = async (toEmails, subject, textContent) => {
  if (!process.env.BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY not set');
  }

  const response = await axios.post(
    'https://api.brevo.com/v3/smtp/email',
    {
      sender: { email:'rizeworldcode@gmail.com', name:'RizeWorld' },
      to: toEmails.map(email => ({ email })),
      subject: subject,
      textContent: textContent
    },
    {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Send email via Gmail (Nodemailer) as fallback
const sendEmailViaGmail = async (toEmails, subject, textContent) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Gmail credentials not set');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmails.join(','),
    subject: subject,
    text: textContent
  };

  return await transporter.sendMail(mailOptions);
};

// Main email function that tries Brevo first, then Gmail
const sendEmailNotification = async (toEmails, subject, textContent) => {
  if (toEmails.length === 0) {
    console.log('No emails to send, skipping');
    return;
  }

  try {
    console.log('Trying to send email via Brevo...');
    const result = await sendEmailViaBrevo(toEmails, subject, textContent);
    console.log('Email sent via Brevo successfully:', result);
    return result;
  } catch (brevoError) {
    console.error('Brevo failed, trying Gmail:', brevoError.response?.data || brevoError.message);
    try {
      console.log('Trying to send email via Gmail...');
      const result = await sendEmailViaGmail(toEmails, subject, textContent);
      console.log('Email sent via Gmail successfully:', result);
      return result;
    } catch (gmailError) {
      console.error('Both email methods failed:', gmailError);
    }
  }
};

const cache = require('./cache');
const moment = require('moment');

async function createNotification(title, message, type = 'Payment Reminder', priority = 'Medium', recipientRoles = ['Client Support'], clientId = null, oldClientId = null, recipientStaff = [], leadId = null, dueDate = null) {
  try {
    // Look up staff members matching recipientRoles (case-insensitive)
    const roleRegexes = (recipientRoles || []).map(r => new RegExp(`^${(r || '').trim()}$`, 'i'));
    const staffMembers = roleRegexes.length > 0 ? await Staff.find({ 
      role: { $in: roleRegexes },
      isRemoved: false
    }).select('_id email role').lean() : [];

    const staffIdsFromRoles = staffMembers.map(s => s._id.toString());
    const explicitStaffIds = (Array.isArray(recipientStaff) ? recipientStaff : []).map(s => (s._id || s).toString());
    const combinedStaffIds = [...new Set([...staffIdsFromRoles, ...explicitStaffIds])];

    const notification = new Notification({
      title,
      message,
      type,
      priority,
      recipientRoles: recipientRoles || [],
      recipientStaff: combinedStaffIds,
      clientId,
      oldClientId,
      leadId,
      dueDate
    });
    
    const savedNotification = await notification.save();
    console.log('Notification created successfully for type:', type, 'staff count:', combinedStaffIds.length);
    
    // Flush notification caches
    cache.flushByPrefix('notifications:');

    // Emit targeted socket events ONLY to designated staff & role rooms (NEVER global broadcast)
    try {
      const io = getIO();
      if (io) {
        // Emit to role rooms (e.g., 'role-client-support')
        (recipientRoles || []).forEach(r => {
          const roomName = `role-${(r || '').trim().toLowerCase().replace(/\s+/g, '-')}`;
          io.to(roomName).emit('newNotification', savedNotification);
        });

        // Emit to specific staff member rooms (e.g., 'staff-6a425103c259e2493e5b94f3')
        combinedStaffIds.forEach(sId => {
          io.to(`staff-${sId}`).emit('newNotification', savedNotification);
        });

        // Also notify admin room
        io.to('admin').emit('newNotification', savedNotification);
      }
    } catch (socketErr) {
      console.warn('Socket emit error in notificationService:', socketErr.message);
    }
    
    // Send email only for Payment Reminder
    if (type === 'Payment Reminder') {
      const emails = staffMembers.map(staff => staff.email).filter(email => email);
      
      if (process.env.CLIENT_SUPPORT_EMAIL && !emails.includes(process.env.CLIENT_SUPPORT_EMAIL)) {
        emails.push(process.env.CLIENT_SUPPORT_EMAIL);
      }
      
      const uniqueEmails = [...new Set(emails)];
      if (uniqueEmails.length > 0) {
        await sendEmailNotification(
          uniqueEmails,
          title,
          message + '\n\nPlease check your staff portal for more details.\n\nThank you,\nRizeWorld Team'
        );
      }
    }
    
    return { success: true, notification: savedNotification };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error: error.message };
  }
}

async function notifyHRAndSupport(title, message, priority = 'High', clientId = null, oldClientId = null) {
  return await createNotification(
    title,
    message,
    'Payment Reminder',
    priority,
    ['Client Support'],
    clientId,
    oldClientId
  );
}

// Send CRM notification to the specific assigned employee's panel (Brand Name & Date/Time only)
async function notifyLeadAssignedStaff(lead) {
  try {
    if (!lead || !lead.assignedStaffId || !lead.nextFollowUpDate) {
      return { success: false, message: 'Missing assigned staff or next follow-up date' };
    }

    const staffId = lead.assignedStaffId._id ? lead.assignedStaffId._id.toString() : lead.assignedStaffId.toString();

    // Brand name: only companyName or name
    const brandName = (lead.companyName && lead.companyName.trim()) 
      ? lead.companyName.trim() 
      : (lead.name ? lead.name.trim() : 'Brand');

    // Date and time format
    const formattedDateTime = moment(lead.nextFollowUpDate).format('DD MMM YYYY, hh:mm A');

    const title = `Brand: ${brandName}`;
    const message = `Date & Time: ${formattedDateTime}`;

    // Check if an existing notification exists for this lead
    let existingNotification = await Notification.findOne({
      leadId: lead._id,
      type: 'CRM Follow-up'
    }).sort({ createdAt: -1 });

    if (existingNotification) {
      existingNotification.title = title;
      existingNotification.message = message;
      existingNotification.dueDate = lead.nextFollowUpDate;
      existingNotification.recipientStaff = [staffId];
      existingNotification.isActive = true;
      // Reset readBy & dismissedBy so employee sees the updated follow-up time
      existingNotification.readBy = [];
      existingNotification.dismissedBy = [];

      const savedNotification = await existingNotification.save();

      // Deactivate any duplicate notifications for this lead if any exist
      await Notification.updateMany(
        {
          leadId: lead._id,
          _id: { $ne: savedNotification._id }
        },
        { isActive: false }
      );

      // Flush notification caches
      cache.flushByPrefix('notifications:');

      // Emit targeted socket events ONLY to designated staff member
      try {
        const io = getIO();
        if (io) {
          io.to(`staff-${staffId}`).emit('newNotification', savedNotification);
        }
      } catch (socketError) {
        console.error('Socket emission failed in notifyLeadAssignedStaff:', socketError);
      }

      console.log('Updated existing CRM notification for lead:', lead._id, 'time:', formattedDateTime);
      return { success: true, notification: savedNotification };
    }

    return await createNotification(
      title,
      message,
      'CRM Follow-up',
      'Medium',
      [], // No role broadcast, strictly to the assigned staff member
      null,
      null,
      [staffId],
      lead._id,
      lead.nextFollowUpDate
    );
  } catch (error) {
    console.error('Error in notifyLeadAssignedStaff:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  createNotification,
  notifyHRAndSupport,
  notifyLeadAssignedStaff
};
