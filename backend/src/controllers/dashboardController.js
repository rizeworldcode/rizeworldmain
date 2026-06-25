const Client = require('../models/Client');
const Staff = require('../models/Staff');

exports.getDashboardStats = async (req, res) => {
  try {
    // Get total clients count
    const totalClients = await Client.countDocuments();

    // Get total projects count (this might be same as clients if 1 client = 1 project,
    // but the user's dashboard separates them. Let's assume projects = active clients or similar)
    // Looking at Overview.jsx, it has Total Revenue, Total Client, Total Projects.
    const clients = await Client.find();
    const totalProjects = clients.length; // Based on current implementation
    
    // Calculate total client revenue from payments (not from totalPrice)
    let totalClientRevenue = 0;
    let totalReceived = 0;
    let allPayments = [];

    clients.forEach(client => {
      // Current client payments
      if (client.payments && client.payments.length > 0) {
        allPayments = [...allPayments, ...client.payments];
      }

      // History payments
      if (client.history && client.history.length > 0) {
        client.history.forEach(h => {
          if (h.payments && h.payments.length > 0) {
            allPayments = [...allPayments, ...h.payments];
          }
        });
      }
      
      // Also add paidAmount for totalReceived (as before)
      totalReceived += (client.paidAmount || 0);
      if (client.history && client.history.length > 0) {
        client.history.forEach(h => {
          totalReceived += (h.paidAmount || 0);
        });
      }
    });

    // Calculate total paid salary
    const paidStaff = await Staff.find({ salaryStatus: 'Paid' });
    const totalPaidSalary = paidStaff.reduce((acc, staff) => acc + (staff.monthlySalary || 0), 0);


    // Net revenue after deducting salaries
    const totalRevenue =  Math.max(0, totalReceived-totalPaidSalary);




    res.status(200).json({
      success: true,
      data: {
        totalClients,
        totalProjects,
        totalRevenue,
        totalClientRevenue,
        totalReceived,
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

    const clients = await Client.find();
    let allPayments = [];

    clients.forEach(client => {
      if (client.payments && client.payments.length > 0) {
        client.payments.forEach(p => {
          allPayments.push({
            amount: p.amount || 0,
            date: new Date(p.date) // force convert here
          });
        });
      }

      if (client.history && client.history.length > 0) {
        client.history.forEach(h => {
          if (h.payments && h.payments.length > 0) {
            h.payments.forEach(p => {
              allPayments.push({
                amount: p.amount || 0,
                date: new Date(p.date) // force convert here too
              });
            });
          }
        });
      }
    });



    const paidStaff = await Staff.find({ salaryStatus: 'Paid' });
    const totalPaidSalary = paidStaff.reduce((acc, staff) => acc + (staff.monthlySalary || 0), 0);
    const totalClientRevenue = allPayments.reduce((acc, p) => acc + p.amount, 0);
    const totalRevenue = totalClientRevenue - totalPaidSalary;

    let chartData = [];

    const isSameDay = (d1, d2) =>
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();

    if (selectedPeriod === 'day') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        const dayRevenue = allPayments
          .filter(p => !isNaN(p.date) && isSameDay(p.date, date))
          .reduce((acc, p) => acc + p.amount, 0);

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

        const weekRevenue = allPayments
          .filter(p => !isNaN(p.date) && p.date >= weekStart && p.date <= weekEnd)
          .reduce((acc, p) => acc + p.amount, 0);

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

        const monthRevenue = allPayments
          .filter(p => !isNaN(p.date) &&
            p.date.getMonth() === monthIndex &&
            p.date.getFullYear() === year)
          .reduce((acc, p) => acc + p.amount, 0);

        chartData.push({ name: monthNames[monthIndex], revenue: monthRevenue });
      }
    }


    res.status(200).json({
      success: true,
      data: {
        totalRevenue: Math.max(0, totalRevenue),
        totalClientRevenue,
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
