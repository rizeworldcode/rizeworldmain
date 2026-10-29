const cron = require('node-cron');
const moment = require('moment');
const Client = require('../models/Client');
const OldClient = require('../models/OldClient');
const Notification = require('../models/Notification');
const { notifyHRAndSupport } = require('./notificationService');

function calculateDaysDifference(date1, date2) {
  const d1 = moment(date1).startOf('day');
  const d2 = moment(date2).startOf('day');
  return d2.diff(d1, 'days');
}

async function checkAndSendClientNotifications() {
  console.log('Checking client notifications...');
  const today = moment();
  const startOfToday = moment().startOf('day').toDate();
  
  try {
    const clients = await Client.find({ status: { $ne: 'Completed' } });
    const oldClients = await OldClient.find();
    
    for (const client of clients) {
      const pending = Number(client.pendingAmount !== undefined ? client.pendingAmount : ((client.totalPrice || client.totalAmount || 0) - (client.paidAmount || 0)));
      if (pending > 0 && client.deadline) {
        const daysUntilDeadline = calculateDaysDifference(today, client.deadline);

        // Check if a payment reminder for this client has already been created today
        const alreadyNotified = await Notification.findOne({
          clientId: client._id,
          createdAt: { $gte: startOfToday }
        });
        if (alreadyNotified) {
          continue;
        }
        
        if (daysUntilDeadline > 0 && daysUntilDeadline <= 5) {
          await notifyHRAndSupportPreDeadline(client, daysUntilDeadline);
        } else if (daysUntilDeadline <= 0) {
          await notifyHRAndSupportPostDeadline(client, Math.abs(daysUntilDeadline));
        }
      }
    }
    
    for (const oldClient of oldClients) {
      const pending = Number((oldClient.totalAmount || 0) - (oldClient.paidAmount || 0));
      if (pending > 0 && oldClient.deliveredDate) {
        const daysSinceDelivery = calculateDaysDifference(oldClient.deliveredDate, today);

        // Check if an old client payment reminder has already been created today
        const alreadyNotifiedOld = await Notification.findOne({
          oldClientId: oldClient._id,
          createdAt: { $gte: startOfToday }
        });
        if (alreadyNotifiedOld) {
          continue;
        }
        
        if (daysSinceDelivery > 0 && daysSinceDelivery <= 5) {
          await notifyHRAndSupportOldClientPreDeadline(oldClient, daysSinceDelivery);
        } else if (daysSinceDelivery > 5) {
          await notifyHRAndSupportOldClientPostDeadline(oldClient, daysSinceDelivery);
        }
      }
    }
    
    console.log('Notification check complete.');
  } catch (error) {
    console.error('Error checking notifications:', error);
  }
}

async function notifyHRAndSupportPreDeadline(client, daysLeft) {
  const title = `Payment Reminder: ${client.name}`;
  const message = `Client ${client.name} (${client.phone}) has a project deadline in ${daysLeft} day${daysLeft > 1 ? 's' : ''}. Pending amount: ₹${client.pendingAmount}. Please follow up for payment.`;
  
  await notifyHRAndSupport(title, message, 'High', client._id, null);
  console.log(`Client Support notified about pre-deadline for client ${client.name}`);
}

async function notifyHRAndSupportPostDeadline(client, daysOverdue) {
  const title = `URGENT: Overdue Payment - ${client.name}`;
  const message = `URGENT: Client ${client.name} (${client.phone}) project deadline has passed by ${daysOverdue} day${daysOverdue > 1 ? 's' : ''}. Pending amount: ₹${client.pendingAmount}. Please follow up immediately for payment collection.`;
  
  await notifyHRAndSupport(title, message, 'Urgent', client._id, null);
  console.log(`Client Support notified about post-deadline for client ${client.name}`);
}

async function notifyHRAndSupportOldClientPreDeadline(oldClient, daysSinceDelivery) {
  const daysLeft = 5 - daysSinceDelivery;
  const title = `Old Client Payment Reminder: ${oldClient.name}`;
  const message = `Old Client ${oldClient.name} (${oldClient.phone}) payment deadline in ${daysLeft} day${daysLeft > 1 ? 's' : ''}. Pending amount: ₹${oldClient.totalAmount - oldClient.paidAmount}. Please follow up.`;
  
  await notifyHRAndSupport(title, message, 'High', null, oldClient._id);
  console.log(`Client Support notified about pre-deadline for old client ${oldClient.name}`);
}

async function notifyHRAndSupportOldClientPostDeadline(oldClient, daysSinceDelivery) {
  const daysOverdue = daysSinceDelivery - 5;
  const title = `URGENT: Old Client Overdue Payment - ${oldClient.name}`;
  const message = `URGENT: Old Client ${oldClient.name} (${oldClient.phone}) payment deadline passed by ${daysOverdue} day${daysOverdue > 1 ? 's' : ''}. Pending amount: ₹${oldClient.totalAmount - oldClient.paidAmount}. Please follow up immediately.`;
  
  await notifyHRAndSupport(title, message, 'Urgent', null, oldClient._id);
  console.log(`Client Support notified about post-deadline for old client ${oldClient.name}`);
}

async function checkAndSendLeadFollowUpNotifications() {
  console.log('Checking CRM lead follow-up notifications...');
  const startOfToday = moment().startOf('day').toDate();
  const endOfToday = moment().endOf('day').toDate();

  try {
    const CompanyLead = require('../models/CompanyLead');
    const { notifyLeadAssignedStaff } = require('./notificationService');

    // Find active leads whose follow-up is scheduled for today or overdue
    const leads = await CompanyLead.find({
      leadStatus: { $nin: ['Converted', 'Lost'] },
      assignedStaffId: { $exists: true, $ne: null },
      nextFollowUpDate: { $lte: endOfToday }
    }).lean();

    for (const lead of leads) {
      // Check if notification already exists and is active for this lead with the current follow up date
      const alreadyNotified = await Notification.findOne({
        leadId: lead._id,
        recipientStaff: lead.assignedStaffId,
        isActive: true,
        dueDate: lead.nextFollowUpDate
      });

      if (alreadyNotified) {
        continue;
      }

      await notifyLeadAssignedStaff(lead);
      console.log(`Notified assigned staff for lead: ${lead.companyName || lead.name}`);
    }

    console.log('CRM lead follow-up notifications check complete.');
  } catch (error) {
    console.error('Error checking lead follow-up notifications:', error);
  }
}

function initCronJobs() {
  const { checkAndTransferCompletedClients } = require('../controllers/clientController');

  // Daily notification check at 2:00 PM IST
  cron.schedule('7 15 * * *', async () => {
    console.log('Running daily notification check at 2:00 PM IST');
    await checkAndSendClientNotifications();
  }, {
    timezone: 'Asia/Kolkata'
  });

  // Daily CRM lead follow-up check at 9:30 AM IST
  cron.schedule('30 9 * * *', async () => {
    console.log('Running daily CRM lead follow-up check at 9:30 AM IST');
    await checkAndSendLeadFollowUpNotifications();
  }, {
    timezone: 'Asia/Kolkata'
  });

  // Hourly check for completed clients transfer to OldClients
  cron.schedule('0 * * * *', async () => {
    console.log('Running hourly check for completed clients transfer...');
    await checkAndTransferCompletedClients();
  });

  // Run auto-transfer initial check shortly after server startup
  setTimeout(async () => {
    try {
      await checkAndTransferCompletedClients();
      await checkAndSendLeadFollowUpNotifications();
    } catch (e) {
      console.error('Initial cron checks failed:', e);
    }
  }, 10000);
  
  console.log('Cron jobs initialized - daily notifications, lead follow-ups & hourly completed client check');
}

module.exports = {
  initCronJobs,
  checkAndSendClientNotifications,
  checkAndSendLeadFollowUpNotifications
};
