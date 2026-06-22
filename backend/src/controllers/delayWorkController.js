const DelayWork = require('../models/DelayWork');
const Client = require('../models/Client'); // To find client by email
const ExcelJS = require('exceljs');

// Create new Delay Work entry
exports.createDelayWork = async (req, res) => {
  try {
    // If clientEmail is provided instead of clientId, find the client
    let clientId = req.body.clientId;
    if (req.body.clientEmail && !clientId) {
      const client = await Client.findOne({ email: req.body.clientEmail });
      if (!client) {
        return res.status(404).json({ success: false, message: 'Client not found with this email' });
      }
      clientId = client._id;
    }

    // Verify staff has Data Analyst role
    if (req.body.staffId) {
      const Staff = require('../models/Staff');
      const staff = await Staff.findById(req.body.staffId);
      if (!staff || staff.role !== 'Data Analyst') {
        return res.status(403).json({ success: false, message: 'Only Data Analysts can add delay work' });
      }
    }

    const delayWork = new DelayWork({
      ...req.body,
      clientId
    });
    await delayWork.save();
    // Populate the saved delay work
    await delayWork.populate('clientId', 'name email phone');
    await delayWork.populate('staffId', 'name email');
    res.status(201).json({ success: true, data: delayWork });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all Delay Work entries
exports.getAllDelayWork = async (req, res) => {
  try {
    const delayWork = await DelayWork.find()
      .populate('clientId', 'name email phone')
      .populate('staffId', 'name email');
    res.status(200).json({ success: true, count: delayWork.length, data: delayWork });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Delay Work by Staff ID
exports.getDelayWorkByStaff = async (req, res) => {
  try {
    // Verify staff has Data Analyst role
    const Staff = require('../models/Staff');
    const staff = await Staff.findById(req.params.staffId);
    if (!staff || staff.role !== 'Data Analyst') {
      return res.status(403).json({ success: false, message: 'Only Data Analysts can access this data' });
    }

    const delayWork = await DelayWork.find({ staffId: req.params.staffId })
      .populate('clientId', 'name email phone')
      .populate('staffId', 'name email');
    res.status(200).json({ success: true, count: delayWork.length, data: delayWork });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Delay Work by Client ID
exports.getDelayWorkByClient = async (req, res) => {
  try {
    const delayWork = await DelayWork.find({ clientId: req.params.clientId })
      .populate('clientId', 'name email phone')
      .populate('staffId', 'name email');
    res.status(200).json({ success: true, count: delayWork.length, data: delayWork });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Delay Work
exports.updateDelayWork = async (req, res) => {
  try {
    const delayWork = await DelayWork.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('clientId', 'name email phone')
      .populate('staffId', 'name email');
    if (!delayWork) {
      return res.status(404).json({ success: false, message: 'Delay Work not found' });
    }
    res.status(200).json({ success: true, data: delayWork });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete Delay Work
exports.deleteDelayWork = async (req, res) => {
  try {
    const delayWork = await DelayWork.findByIdAndDelete(req.params.id);
    if (!delayWork) {
      return res.status(404).json({ success: false, message: 'Delay Work not found' });
    }
    res.status(200).json({ success: true, message: 'Delay Work deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Export Delay Work to Excel with date range
exports.exportDelayWork = async (req, res) => {
  try {
    const { clientId, startDate, endDate } = req.query;
    
    // Build query
    const query = {};
    if (clientId) {
      query.clientId = clientId;
    }
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    const delayWorks = await DelayWork.find(query)
      .populate('clientId', 'name email phone')
      .populate('staffId', 'name email');

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Delay Work');

    // Add header row with styling
    worksheet.columns = [
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Client Name', key: 'clientName', width: 20 },
      { header: 'Client Email', key: 'clientEmail', width: 25 },
      { header: 'Client Phone', key: 'clientPhone', width: 15 },
      { header: 'Type', key: 'type', width: 10 },
      { header: 'Published Link', key: 'publishedLink', width: 40 },
      { header: 'Total Account Reach', key: 'totalAccountReach', width: 20 },
      { header: 'Total Account Views', key: 'totalAccountViews', width: 20 },
      { header: 'Staff Name', key: 'staffName', width: 20 },
      { header: 'Staff Email', key: 'staffEmail', width: 25 }
    ];

    // Style header
    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF0000' } // Red background
      };
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; // White bold text
    });

    // Add data rows
    delayWorks.forEach(work => {
      worksheet.addRow({
        date: work.createdAt ? new Date(work.createdAt).toLocaleDateString('en-IN') : '',
        clientName: work.clientId?.name || '',
        clientEmail: work.clientId?.email || '',
        clientPhone: work.clientId?.phone || '',
        type: work.type,
        publishedLink: work.publishedLink || '',
        totalAccountReach: work.totalAccountReach || 0,
        totalAccountViews: work.totalAccountViews || 0,
        staffName: work.staffId?.name || '',
        staffEmail: work.staffId?.email || ''
      });
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=delay-work-${Date.now()}.xlsx`);

    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error exporting delay work:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
