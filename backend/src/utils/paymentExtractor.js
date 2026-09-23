/**
 * Helper to extract and deduplicate client payments from Client & OldClient documents,
 * including current cycle payments, archived past cycle payments (history), and legacy paidAmount records.
 */
function extractClientPayments(clientList, modelName, startDate, endDate) {
  const paymentsList = [];
  const seenIds = new Set();
  const seenComposite = new Set();

  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate + 'T23:59:59.999Z') : null;

  (clientList || []).forEach(client => {
    const rawPayments = [];

    // 1. Current cycle payments
    (client.payments || []).forEach(p => {
      rawPayments.push({ ...p, isHistory: false });
    });

    // 2. Archived past cycle payments (history)
    (client.history || []).forEach((hist, hIdx) => {
      (hist.payments || []).forEach(p => {
        rawPayments.push({ ...p, isHistory: true, historyIndex: hIdx });
      });
    });

    rawPayments.forEach(payment => {
      if (!payment || (!payment.amount && payment.amount !== 0)) return;
      if (Number(payment.amount) <= 0) return;

      const pDate = new Date(payment.date || client.createdAt || Date.now());
      if (start && pDate < start) return;
      if (end && pDate > end) return;

      const idStr = payment._id ? payment._id.toString() : null;
      const periodKey = payment.projectPeriod || (payment.periodFrom ? new Date(payment.periodFrom).toISOString().slice(0, 10) : '');
      const compKey = `${client._id}_${payment.amount}_${pDate.toISOString().slice(0, 10)}_${payment.utr || ''}_${periodKey}`;

      if (idStr && seenIds.has(idStr)) return;
      if (seenComposite.has(compKey)) return;

      if (idStr) seenIds.add(idStr);
      seenComposite.add(compKey);

      paymentsList.push({
        _id: payment._id || `${client._id}_${payment.amount}_${pDate.getTime()}`,
        type: 'client_payment',
        name: client.name,
        amount: Number(payment.amount),
        date: payment.date || pDate,
        mode: payment.mode || 'Online',
        method: (payment.mode || '').toLowerCase() === 'online' ? 'bank_transfer' : 'cash',
        utrNumber: payment.utr || null,
        referenceId: client._id,
        referenceModel: modelName,
        description: `Payment from ${modelName === 'OldClient' ? 'old client' : 'client'}: ${client.name}`,
        source: 'client_payment',
        createdAt: payment.date || pDate,
        historyIndex: payment.isHistory ? payment.historyIndex : undefined
      });
    });

    // 3. Fallback: If client has paidAmount > 0 but no payments array entries (e.g. legacy/manually created old client)
    const totalRecordedInPayments = rawPayments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
    const clientDirectPaid = Number(client.paidAmount || 0);
    if (totalRecordedInPayments === 0 && clientDirectPaid > 0) {
      const pDate = new Date(client.startDate || client.createdAt || Date.now());
      if ((!start || pDate >= start) && (!end || pDate <= end)) {
        paymentsList.push({
          _id: `${client._id}_direct_payment`,
          type: 'client_payment',
          name: client.name,
          amount: clientDirectPaid,
          date: pDate,
          mode: 'Online',
          method: 'bank_transfer',
          utrNumber: null,
          referenceId: client._id,
          referenceModel: modelName,
          description: `Payment from ${modelName === 'OldClient' ? 'old client' : 'client'}: ${client.name}`,
          source: 'client_payment',
          createdAt: pDate,
        });
      }
    }
  });

  return paymentsList;
}

module.exports = {
  extractClientPayments
};
