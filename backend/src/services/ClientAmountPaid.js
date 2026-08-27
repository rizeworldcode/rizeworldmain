const clientModel = require('../models/Client');

exports.updateClientPaidAmount = async (req, res) => {
  const clientID = req.params.clientId;
  const payingAmount = Number(req.body.payingAmount);

  try {
    const client = await clientModel.findById(clientID);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    const historyIndex = req.body.historyIndex !== undefined && req.body.historyIndex !== null && req.body.historyIndex !== '' ? Number(req.body.historyIndex) : -1;

    let targetPending = Number(client.pendingAmount);
    if (historyIndex >= 0 && client.history && client.history[historyIndex]) {
      const histItem = client.history[historyIndex];
      const hTotal = Number(histItem.totalPrice !== undefined ? histItem.totalPrice : (histItem.totalAmount !== undefined ? histItem.totalAmount : 0));
      const hPaid = Number(histItem.paidAmount || 0);
      targetPending = histItem.pendingAmount !== undefined ? Number(histItem.pendingAmount) : Math.max(0, hTotal - hPaid);
    }

    if (payingAmount > targetPending) {
      return res.status(400).json({ success: false, message: `Payment amount (₹${payingAmount}) cannot exceed the pending amount (₹${targetPending})` });
    }

    const paymentMode = req.body.paymentMethod === 'Cash' ? 'Cash' : 'Online';
    if (paymentMode === 'Online') {
      const utrStr = (req.body.utr || '').trim();
      if (!utrStr || utrStr.length < 12 || utrStr.length > 16) {
        return res.status(400).json({ success: false, message: 'UTR number must be between 12 and 16 characters for online payments.' });
      }
    }

    const paymentEntry = {
      date: req.body.date ? new Date(req.body.date) : new Date(),
      amount: payingAmount,
      mode: req.body.paymentMethod === 'Cash' ? 'Cash' : 'Online',
      utr: req.body.utr || '',
      month: req.body.month || '',
      periodFrom: req.body.periodFrom ? new Date(req.body.periodFrom) : undefined,
      periodTo: req.body.periodTo ? new Date(req.body.periodTo) : undefined,
      projectPeriod: req.body.projectPeriod || ''
    };

    if (historyIndex >= 0 && client.history && client.history[historyIndex]) {
      const histItem = client.history[historyIndex];
      const hTotal = Number(histItem.totalPrice !== undefined ? histItem.totalPrice : (histItem.totalAmount !== undefined ? histItem.totalAmount : 0));
      const newHistPaid = Number(histItem.paidAmount || 0) + payingAmount;
      const newHistPending = Math.max(0, hTotal - newHistPaid);
      histItem.paidAmount = newHistPaid;
      histItem.pendingAmount = newHistPending;
      if (!histItem.payments) histItem.payments = [];
      histItem.payments.push(paymentEntry);
      client.markModified('history');
    } else {
      const newPaidAmount = Number(client.paidAmount) + payingAmount;
      const newPendingAmount = Number(client.totalPrice) - newPaidAmount;
      client.paidAmount = newPaidAmount;
      client.pendingAmount = newPendingAmount;
    }

    // Always record payment entry in client.payments array for global history
    client.payments.push(paymentEntry);

    const updatedClient = await client.save();
    return res.status(200).json({
      success: true,
      client: updatedClient,
      message: 'Payment updated successfully',
    });

  } catch (error) {
    console.error('Error updating payment:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};