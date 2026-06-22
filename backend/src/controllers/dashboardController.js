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

    totalClientRevenue = allPayments.reduce((acc, payment) => acc + (payment.amount || 0), 0);

    // Calculate total paid salary
    const paidStaff = await Staff.find({ salaryStatus: 'Paid' });
    const totalPaidSalary = paidStaff.reduce((acc, staff) => acc + (staff.monthlySalary || 0), 0);

    // Net revenue after deducting salaries
    const totalRevenue = Math.max(0, totalClientRevenue - totalPaidSalary);

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
    const { period } = req.query; // 'day', 'week', or 'month' (default: 'month')
    const validPeriods = ['day', 'week', 'month'];
    const selectedPeriod = validPeriods.includes(period) ? period : 'month';

    // Get all clients and collect all payments
    const clients = await Client.find();
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
    });

    // Get all staff and calculate paid salaries
    const paidStaff = await Staff.find({ salaryStatus: 'Paid' });
    const totalPaidSalary = paidStaff.reduce((acc, staff) => acc + (staff.monthlySalary || 0), 0);

    // Calculate total revenue (client payments minus paid salaries)
    const totalClientRevenue = allPayments.reduce((acc, payment) => acc + (payment.amount || 0), 0);
    const totalRevenue = totalClientRevenue - totalPaidSalary;

    // Format data based on period
    let chartData = [];
    let numPeriods = 0;

    if (selectedPeriod === 'day') {
      numPeriods = 7; // 7 days
    } else if (selectedPeriod === 'week') {
      numPeriods = 4; // 4 weeks
    } else {
      numPeriods = 6; // 6 months
    }
    
    const salaryPerPeriod = totalPaidSalary / numPeriods;

    if (selectedPeriod === 'day') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStr = date.toLocaleDateString('en-IN', { weekday: 'short' });
        
        const dayPayments = allPayments.filter(payment => {
          const paymentDate = new Date(payment.date);
          return (
            paymentDate.getDate() === date.getDate() &&
            paymentDate.getMonth() === date.getMonth() &&
            paymentDate.getFullYear() === date.getFullYear()
          );
        });
        
        const dayClientRevenue = dayPayments.reduce((acc, payment) => acc + (payment.amount || 0), 0);
        const dayNetRevenue = dayClientRevenue - salaryPerPeriod;
        chartData.push({ name: dayStr, revenue: Math.max(0, dayNetRevenue) });
      }
    } else if (selectedPeriod === 'week') {
      // Last 4 weeks
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - (i * 7) - weekStart.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        const weekLabel = `${weekStart.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${weekEnd.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;
        
        const weekPayments = allPayments.filter(payment => {
          const paymentDate = new Date(payment.date);
          return paymentDate >= weekStart && paymentDate <= weekEnd;
        });
        
        const weekClientRevenue = weekPayments.reduce((acc, payment) => acc + (payment.amount || 0), 0);
        const weekNetRevenue = weekClientRevenue - salaryPerPeriod;
        chartData.push({ name: weekLabel, revenue: Math.max(0, weekNetRevenue) });
      }
    } else {
      // Last 6 months (default)
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthIndex = date.getMonth();
        const year = date.getFullYear();
        
        const monthPayments = allPayments.filter(payment => {
          const paymentDate = new Date(payment.date);
          return paymentDate.getMonth() === monthIndex && paymentDate.getFullYear() === year;
        });
        
        const monthClientRevenue = monthPayments.reduce((acc, payment) => acc + (payment.amount || 0), 0);
        const monthNetRevenue = monthClientRevenue - salaryPerPeriod;
        chartData.push({ name: monthNames[monthIndex], revenue: Math.max(0, monthNetRevenue) });
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
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching revenue analytics'
    });
  }
};
