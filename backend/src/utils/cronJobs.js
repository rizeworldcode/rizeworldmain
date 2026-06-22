const cron = require('node-cron');
const moment = require('moment');
const Client = require('../models/Client');
const OldClient = require('../models/OldClient');
const { notifyHRAndSupport } = require('./notificationService');

function calculateDaysDifference(date1, date2) {
  const d1 = moment(date1).startOf('day');
  const d2 = moment(date2).startOf('day');
  return d2.diff(d1, 'days');
}

async function checkAndSendClientNotifications() {
  console.log('Checking client notifications...');
  const today = moment();
  
  try {
    const clients = await Client.find({ status: { $ne: 'Completed' } });
    const oldClients = await OldClient.find();
    
    for (const client of clients) {
      if (client.deadline) {
        const daysUntilDeadline = calculateDaysDifference(today, client.deadline);
        
        if (daysUntilDeadline > 0 && daysUntilDeadline <= 5) {
          await notifyHRAndSupportPreDeadline(client, daysUntilDeadline);
        } else if (daysUntilDeadline < 0) {
          await notifyHRAndSupportPostDeadline(client, Math.abs(daysUntilDeadline));
        }
      }
    }
    
    for (const oldClient of oldClients) {
      if (oldClient.deliveredDate) {
        const daysSinceDelivery = calculateDaysDifference(oldClient.deliveredDate, today);
        
        if (daysSinceDelivery > 0 && daysSinceDelivery <= 5) {
          await notifyHRAndSupportOldClientPreDeadline(oldClient, daysSinceDelivery);
        } else if (daysSinceDelivery > 5 && oldClient.totalAmount > oldClient.paidAmount) {
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
  console.log(`HR/Support notified about pre-deadline for client ${client.name}`);
}

async function notifyHRAndSupportPostDeadline(client, daysOverdue) {
  const title = `URGENT: Overdue Payment - ${client.name}`;
  const message = `URGENT: Client ${client.name} (${client.phone}) project deadline has passed by ${daysOverdue} day${daysOverdue > 1 ? 's' : ''}. Pending amount: ₹${client.pendingAmount}. Please follow up immediately for payment collection.`;
  
  await notifyHRAndSupport(title, message, 'Urgent', client._id, null);
  console.log(`HR/Support notified about post-deadline for client ${client.name}`);
}

async function notifyHRAndSupportOldClientPreDeadline(oldClient, daysSinceDelivery) {
  const daysLeft = 5 - daysSinceDelivery;
  const title = `Old Client Payment Reminder: ${oldClient.name}`;
  const message = `Old Client ${oldClient.name} (${oldClient.phone}) payment deadline in ${daysLeft} day${daysLeft > 1 ? 's' : ''}. Pending amount: ₹${oldClient.totalAmount - oldClient.paidAmount}. Please follow up.`;
  
  await notifyHRAndSupport(title, message, 'High', null, oldClient._id);
  console.log(`HR/Support notified about pre-deadline for old client ${oldClient.name}`);
}

async function notifyHRAndSupportOldClientPostDeadline(oldClient, daysSinceDelivery) {
  const daysOverdue = daysSinceDelivery - 5;
  const title = `URGENT: Old Client Overdue Payment - ${oldClient.name}`;
  const message = `URGENT: Old Client ${oldClient.name} (${oldClient.phone}) payment deadline passed by ${daysOverdue} day${daysOverdue > 1 ? 's' : ''}. Pending amount: ₹${oldClient.totalAmount - oldClient.paidAmount}. Please follow up immediately.`;
  
  await notifyHRAndSupport(title, message, 'Urgent', null, oldClient._id);
  console.log(`HR/Support notified about post-deadline for old client ${oldClient.name}`);
}

function initCronJobs() {
  cron.schedule('7 15 * * *', async () => {
    console.log('Running daily notification check at 2:00 PM IST');
    await checkAndSendClientNotifications();
  }, {
    timezone: 'Asia/Kolkata'
  });
  
  console.log('Cron jobs initialized - daily notifications at 2:00 PM IST');
}

module.exports = {
  initCronJobs,
  checkAndSendClientNotifications
};
