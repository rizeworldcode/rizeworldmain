const Client = require('../models/Client');
const OldClient = require('../models/OldClient');
const Staff = require('../models/Staff');
const Transaction = require('../models/Transaction');
const cache = require('../utils/cache');

const getUnifiedTransactions = async () => {
  // Execute database reads concurrently with Promise.all
  const [transactions, clients, oldClients] = await Promise.all([
    Transaction.find().lean(),
    Client.find({}, 'name email payments').lean(),
    OldClient.find({}, 'name email payments').lean()
  ]);

  let clientPayments = [];

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

  // Merge and sort by date descending
  return [
    ...transactions.map(t => ({ ...t, source: t.type })),
    ...clientPayments,
  ].sort((a, b) => new Date(b.date) - new Date(a.date));
};

exports.getDashboardStats = async (req, res) => {
  try {
    const cacheKey = 'dashboard:stats';

    // Use Single-Flight Request Coalescing to prevent cache stampedes
    const responseData = await cache.fetchOrCompute(cacheKey, async () => {
      // Execute all independent database queries in parallel
      const [totalClients, activeStaff, allTransactions] = await Promise.all([
        Client.countDocuments(),
        Staff.find({ isRemoved: { $ne: true } }).select('work').lean(),
        getUnifiedTransactions()
      ]);

      const totalProjects = totalClients;

      // Get today's assigned work count across active staff
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date(todayStart);
      todayEnd.setDate(todayEnd.getDate() + 1);

      const totalStaff = activeStaff.length;
      let staffWithWorkCount = 0;
      activeStaff.forEach(staff => {
        const todayWork = (staff.work || []).find(w => {
          const workDate = new Date(w.date);
          return workDate >= todayStart && workDate < todayEnd;
        });
        if (todayWork && todayWork.tasks && todayWork.tasks.length > 0) {
          staffWithWorkCount++;
        }
      });

      const todayAssignedWork = `${staffWithWorkCount}/${totalStaff}`;

      // Calculate income and expenses
      const totalIncome = allTransactions
        .filter(t => t.type === 'client_payment' || t.type === 'income' || t.source === 'client_payment')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalExpense = allTransactions
        .filter(t => t.type === 'salary' || t.type === 'other_expenses' || t.source === 'salary' || t.source === 'other_expenses')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalPaidSalary = allTransactions
        .filter(t => t.type === 'salary' || t.source === 'salary')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalRevenue = totalIncome - totalExpense;

      return {
        totalClients,
        totalProjects,
        totalRevenue,
        todayAssignedWork,
        totalClientRevenue: totalIncome,
        totalReceived: totalIncome,
        totalPaidSalary
      };
    }, 60);

    res.status(200).json({
      success: true,
      data: responseData
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

    const cacheKey = `dashboard:revenue:${selectedPeriod}`;

    const responseData = await cache.fetchOrCompute(cacheKey, async () => {
      const allTransactions = await getUnifiedTransactions();

      const totalIncome = allTransactions
        .filter(t => t.type === 'client_payment' || t.type === 'income' || t.source === 'client_payment')
        .reduce((sum, t) => sum + t.amount, 0);

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

      return {
        totalRevenue,
        totalClientRevenue: totalIncome,
        totalPaidSalary,
        chartData,
        period: selectedPeriod
      };
    }, 60);

    res.status(200).json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Revenue analytics error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching revenue analytics'
    });
  }
};
