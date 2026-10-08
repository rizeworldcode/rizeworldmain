/**
 * Helper to extract and deduplicate client payments from Client & OldClient documents,
 * including current cycle payments, archived past cycle payments (history), and legacy paidAmount records.
 */
function extractClientPayments(clientList, modelName, startDate, endDate) {
  const paymentsList = [];
  const seenUniqueIds = new Set();

  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate + 'T23:59:59.999Z') : null;

  (clientList || []).forEach(client => {
    if (!client) return;
    const clientId = client._id ? client._id.toString() : '';

    // 1. Current cycle payments
    (client.payments || []).forEach((p, pIdx) => {
      if (!p || (p.amount === undefined && p.amount === null)) return;
      const amount = Number(p.amount);
      if (isNaN(amount) || amount <= 0) return;

      const pDate = p.date ? new Date(p.date) : new Date(client.createdAt || Date.now());
      if (start && pDate < start) return;
      if (end && pDate > end) return;

      // Unique ID for this payment: prefer standard ObjectId if not collided, or structured index-based ID
      let uniqueId = p._id ? p._id.toString() : `cp_${clientId}_curr_${pIdx}`;
      if (seenUniqueIds.has(uniqueId)) {
        uniqueId = `cp_${clientId}_curr_${pIdx}`;
      }
      seenUniqueIds.add(uniqueId);

      const projectDate = p.periodFrom || client.startDate || client.createdAt || p.date || pDate;
      const projectMonth = (projectDate ? new Date(projectDate) : new Date()).toLocaleString('default', { month: 'long', year: 'numeric' });

      paymentsList.push({
        _id: uniqueId,
        type: 'client_payment',
        name: client.name,
        amount: amount,
        date: p.date || pDate,
        projectDate: projectDate,
        projectMonth: projectMonth,
        cycleDate: projectDate,
        cycleMonth: projectMonth,
        month: projectMonth,
        mode: p.mode || 'Online',
        method: (p.mode || '').toLowerCase() === 'online' ? 'bank_transfer' : ((p.mode || '').toLowerCase() === 'cheque' || (p.mode || '').toLowerCase() === 'cheq' ? 'cheque' : 'cash'),
        utrNumber: p.utr || null,
        referenceId: client._id,
        referenceModel: modelName,
        description: `Payment from ${modelName === 'OldClient' ? 'old client' : 'client'}: ${client.name}`,
        source: 'client_payment',
        createdAt: p.date || pDate,
        isHistory: false,
        paymentIndex: pIdx
      });
    });

    // 2. Archived past cycle payments (history)
    (client.history || []).forEach((hist, hIdx) => {
      (hist.payments || []).forEach((p, pIdx) => {
        if (!p || (p.amount === undefined && p.amount === null)) return;
        const amount = Number(p.amount);
        if (isNaN(amount) || amount <= 0) return;

        const pDate = p.date ? new Date(p.date) : new Date(hist.completedAt || client.createdAt || Date.now());
        if (start && pDate < start) return;
        if (end && pDate > end) return;

        let uniqueId = p._id ? p._id.toString() : `cp_${clientId}_hist_${hIdx}_${pIdx}`;
        if (seenUniqueIds.has(uniqueId)) {
          uniqueId = `cp_${clientId}_hist_${hIdx}_${pIdx}`;
        }
        seenUniqueIds.add(uniqueId);

        const projectDate = p.periodFrom || hist.startDate || hist.completedAt || client.startDate || client.createdAt || p.date || pDate;
        const projectMonth = (projectDate ? new Date(projectDate) : new Date()).toLocaleString('default', { month: 'long', year: 'numeric' });

        paymentsList.push({
          _id: uniqueId,
          type: 'client_payment',
          name: client.name,
          amount: amount,
          date: p.date || pDate,
          projectDate: projectDate,
          projectMonth: projectMonth,
          cycleDate: projectDate,
          cycleMonth: projectMonth,
          month: projectMonth,
          mode: p.mode || 'Online',
          method: (p.mode || '').toLowerCase() === 'online' ? 'bank_transfer' : ((p.mode || '').toLowerCase() === 'cheque' || (p.mode || '').toLowerCase() === 'cheq' ? 'cheque' : 'cash'),
          utrNumber: p.utr || null,
          referenceId: client._id,
          referenceModel: modelName,
          description: `Payment from ${modelName === 'OldClient' ? 'old client' : 'client'} (Past Cycle): ${client.name}`,
          source: 'client_payment',
          createdAt: p.date || pDate,
          isHistory: true,
          historyIndex: hIdx,
          paymentIndex: pIdx
        });
      });
    });

    // 3. Fallback: If client has paidAmount > 0 but no payments array entries (legacy/imported records)
    const currentPaymentsCount = (client.payments || []).length;
    const historyPaymentsCount = (client.history || []).reduce((acc, h) => acc + ((h && h.payments) ? h.payments.length : 0), 0);
    const clientDirectPaid = Number(client.paidAmount || 0);

    if (currentPaymentsCount === 0 && historyPaymentsCount === 0 && clientDirectPaid > 0) {
      const pDate = new Date(client.startDate || client.createdAt || Date.now());
      if ((!start || pDate >= start) && (!end || pDate <= end)) {
        const uniqueId = `cp_${clientId}_direct`;
        seenUniqueIds.add(uniqueId);
        paymentsList.push({
          _id: uniqueId,
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
