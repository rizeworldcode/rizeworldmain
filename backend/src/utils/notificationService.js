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

async function createNotification(title, message, type = 'Payment Reminder', priority = 'Medium', recipientRoles = ['HR', 'Client Support'], clientId = null, oldClientId = null) {
  try {
    const notification = new Notification({
      title,
      message,
      type,
      priority,
      recipientRoles,
      clientId,
      oldClientId
    });
    
    const savedNotification = await notification.save();
    console.log('Notification created successfully');
    
    // Emit socket event to notify staff of new notification (does NOT send to clients!)
    const io = getIO();
    io.emit('newNotification', savedNotification);
    
    // Fetch all staff with recipient roles to send emails (only internal staff, no clients!)
    const staffMembers = await Staff.find({ 
      role: { $in: recipientRoles } 
    });
    const emails = staffMembers.map(staff => staff.email).filter(email => email);
    
    // Also add fallback emails from .env (still only HR and Client Support, no clients!)
    if (process.env.HR_EMAIL && !emails.includes(process.env.HR_EMAIL)) {
      emails.push(process.env.HR_EMAIL);
    }
    if (process.env.CLIENT_SUPPORT_EMAIL && !emails.includes(process.env.CLIENT_SUPPORT_EMAIL)) {
      emails.push(process.env.CLIENT_SUPPORT_EMAIL);
    }
    
    const uniqueEmails = [...new Set(emails)]; // Remove duplicates
    if (uniqueEmails.length > 0) {
      await sendEmailNotification(
        uniqueEmails,
        title,
        message + '\n\nPlease check your staff portal for more details.\n\nThank you,\nRizeWorld Team'
      );
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
    ['HR', 'Client Support', 'Admin'],
    clientId,
    oldClientId
  );
}

module.exports = {
  createNotification,
  notifyHRAndSupport
};
