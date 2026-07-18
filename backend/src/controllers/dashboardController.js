const Client = require('../models/Client');
const OldClient = require('../models/OldClient');
const Staff = require('../models/Staff');
const Transaction = require('../models/Transaction');

const getUnifiedTransactions = async () => {
  // 1. Fetch from Transaction model
  const transactions = await Transaction.find();

  // 2. Fetch client payment history
  let clientPayments = [];
  const clients = await Client.find({}, 'name email payments');
  const oldClients = await OldClient.find({}, 'name email payments');

  clients.forEach(client => {
    (client.payments || []).forEach(payment => {
      clientPayments.push({
        _id: payment._id,
        type: 'client_payment',
        name: client.name,
        amount: payment.amount,
        date: payment.date,
        mode: payment.mode,
        method: payment.mode?.toLowerCase() === 'online' ? 'bank_transfer' : 'cash',
        utrNumber: payment.utr || null,
        referenceId: client._id,
        referenceModel: 'Client',
        description: `Payment from client: ${client.name}`,
        source: 'client_payment',
        createdAt: payment.date,
      });
    });
  });

  oldClients.forEach(client => {
    (client.payments || []).forEach(payment => {
      clientPayments.push({
        _id: payment._id,
        type: 'client_payment',
        name: client.name,
        amount: payment.amount,
        date: payment.date,
        mode: payment.mode,
        method: payment.mode?.toLowerCase() === 'online' ? 'bank_transfer' : 'cash',
        utrNumber: payment.utr || null,
        referenceId: client._id,
        referenceModel: 'OldClient',
        description: `Payment from old client: ${client.name}`,
        source: 'client_payment',
        createdAt: payment.date,
      });
    });
  });

  // 3. Merge and sort by date descending
  return [
    ...transactions.map(t => ({ ...t.toObject(), source: t.type })),
    ...clientPayments,
  ].sort((a, b) => new Date(b.date) - new Date(a.date));
};

exports.getDashboardStats = async (req, res) => {
  try {
    // Get total clients count
    const totalClients = await Client.countDocuments();

    // Get total projects count
    const clients = await Client.find();
    const totalProjects = clients.length;

    // Get unified transactions
    const allTransactions = await getUnifiedTransactions();

    // Calculate total income (client payments + other income)
    const totalIncome = allTransactions
      .filter(t => t.type === 'client_payment' || t.type === 'income' || t.source === 'client_payment')
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate total expenses (salaries + other expenses)
    const totalExpense = allTransactions
      .filter(t => t.type === 'salary' || t.type === 'other_expenses' || t.source === 'salary' || t.source === 'other_expenses')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalPaidSalary = allTransactions
      .filter(t => t.type === 'salary' || t.source === 'salary')
      .reduce((sum, t) => sum + t.amount, 0);

    // Net balance = total income - total expense
    const totalRevenue = totalIncome - totalExpense;

    res.status(200).json({
      success: true,
      data: {
        totalClients,
        totalProjects,
        totalRevenue,
        totalClientRevenue: totalIncome,
        totalReceived: totalIncome,
        totalPaidSalary
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching dashboard stats'
    });
  }
};

exports.getRevenueAnalytics = async (req, res) => {
  try {
    const { period } = req.query;
    const validPeriods = ['day', 'week', 'month'];
    const selectedPeriod = validPeriods.includes(period) ? period : 'month';

    const allTransactions = await getUnifiedTransactions();

    // Calculate total income (client payments + other income)
    const totalIncome = allTransactions
      .filter(t => t.type === 'client_payment' || t.type === 'income' || t.source === 'client_payment')
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate total expenses (salaries + other expenses)
    const totalExpense = allTransactions
      .filter(t => t.type === 'salary' || t.type === 'other_expenses' || t.source === 'salary' || t.source === 'other_expenses')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalRevenue = totalIncome - totalExpense;

    const totalPaidSalary = allTransactions
      .filter(t => t.type === 'salary' || t.source === 'salary')
      .reduce((sum, t) => sum + t.amount, 0);

    let chartData = [];

    const isSameDay = (d1, d2) =>
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();

    if (selectedPeriod === 'day') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        // Sum income transactions on this day
        const dayRevenue = allTransactions
          .filter(t => {
            const tDate = new Date(t.date);
            return !isNaN(tDate) &&
              (t.type === 'client_payment' || t.type === 'income' || t.source === 'client_payment') &&
              isSameDay(tDate, date);
          })
          .reduce((acc, t) => acc + t.amount, 0);

        chartData.push({
          name: date.toLocaleDateString('en-IN', { weekday: 'short' }),
          revenue: dayRevenue
        });
      }

    } else if (selectedPeriod === 'week') {
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date();
        weekStart.setHours(0, 0, 0, 0);
        weekStart.setDate(weekStart.getDate() - (i * 7) - weekStart.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        const weekLabel = `${weekStart.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${weekEnd.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;

        // Sum income transactions in this week
        const weekRevenue = allTransactions
          .filter(t => {
            const tDate = new Date(t.date);
            return !isNaN(tDate) &&
              (t.type === 'client_payment' || t.type === 'income' || t.source === 'client_payment') &&
              tDate >= weekStart && tDate <= weekEnd;
          })
          .reduce((acc, t) => acc + t.amount, 0);

        chartData.push({ name: weekLabel, revenue: weekRevenue });
      }

    } else {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthIndex = date.getMonth();
        const year = date.getFullYear();

        // Sum income transactions in this month
        const monthRevenue = allTransactions
          .filter(t => {
            const tDate = new Date(t.date);
            return !isNaN(tDate) &&
              (t.type === 'client_payment' || t.type === 'income' || t.source === 'client_payment') &&
              tDate.getMonth() === monthIndex &&
              tDate.getFullYear() === year;
          })
          .reduce((acc, t) => acc + t.amount, 0);

        chartData.push({ name: monthNames[monthIndex], revenue: monthRevenue });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        totalRevenue: totalRevenue,
        totalClientRevenue: totalIncome,
        totalPaidSalary,
        chartData,
        period: selectedPeriod
      }
    });

  } catch (error) {
    console.error('Revenue analytics error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching revenue analytics'
    });
  }
};

