const clientModel = require('../models/Client');

exports.updateClientPaidAmount = async (req, res) => {
  const clientID = req.params.clientId;
  const payingAmount = Number(req.body.payingAmount);

  try {
    const client = await clientModel.findById(clientID);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    const newPaidAmount = Number(client.paidAmount) + payingAmount;
    const newPendingAmount = Number(client.totalPrice) - newPaidAmount;

    client.paidAmount = newPaidAmount;
    client.pendingAmount = newPendingAmount;

    // ✅ This is the fix — push to payments array
    client.payments.push({
      date: new Date(),
      amount: payingAmount,
      mode: req.body.paymentMethod === 'Cash' ? 'Cash' : 'Online',
      utr: req.body.utr || ''
    });

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