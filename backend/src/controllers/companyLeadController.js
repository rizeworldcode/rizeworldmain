const CompanyLead = require('../models/CompanyLead');

// Helper to calculate the next unique lead ID (e.g. CL-1001, CL-1002...)
const generateNextLeadId = async () => {
  try {
    const lastLead = await CompanyLead.findOne({ unicId: /^CL-\d+$/i }).sort({ createdAt: -1 });
    if (lastLead && lastLead.unicId) {
      const match = lastLead.unicId.match(/\d+/);
      if (match) {
        const nextNum = parseInt(match[0], 10) + 1;
        return `CL-${nextNum}`;
      }
    }
    const count = await CompanyLead.countDocuments();
    return `CL-${1001 + count}`;
  } catch {
    return `CL-${Date.now().toString().slice(-4)}`;
  }
};

// GET /api/company-leads/next-id
exports.getNextUnicId = async (req, res) => {
  try {
    const nextUnicId = await generateNextLeadId();
    return res.status(200).json({
      success: true,
      nextUnicId
    });
  } catch (error) {
    console.error('Error getting next lead ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate next unique ID',
      error: error.message
    });
  }
};

// GET /api/company-leads/reminders
exports.getLeadReminders = async (req, res) => {
  try {
    const { assignedStaffId, leadPersonName, targetDate } = req.query;

    const baseDate = targetDate ? new Date(targetDate) : new Date();
    const startOfDay = new Date(baseDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(baseDate);
    endOfDay.setHours(23, 59, 59, 999);

    const baseQuery = {
      leadStatus: { $nin: ['Converted', 'Lost'] },
      nextFollowUpDate: { $exists: true, $ne: null }
    };

    if (assignedStaffId) {
      baseQuery.assignedStaffId = assignedStaffId;
    } else if (leadPersonName && leadPersonName !== 'All') {
      baseQuery.leadPersonName = new RegExp(leadPersonName.trim(), 'i');
    }

    const todayQuery = {
      ...baseQuery,
      nextFollowUpDate: { $gte: startOfDay, $lte: endOfDay }
    };

    const overdueQuery = {
      ...baseQuery,
      nextFollowUpDate: { $lt: startOfDay }
    };

    const next48Hours = new Date(endOfDay.getTime() + 48 * 60 * 60 * 1000);
    const upcomingQuery = {
      ...baseQuery,
      nextFollowUpDate: { $gt: endOfDay, $lte: next48Hours }
    };

    const [todayLeads, overdueLeads, upcomingLeads] = await Promise.all([
      CompanyLead.find(todayQuery)
        .populate('assignedStaffId', 'name employeeId department')
        .sort({ nextFollowUpDate: 1 })
        .lean(),
      CompanyLead.find(overdueQuery)
        .populate('assignedStaffId', 'name employeeId department')
        .sort({ nextFollowUpDate: 1 })
        .lean(),
      CompanyLead.find(upcomingQuery)
        .populate('assignedStaffId', 'name employeeId department')
        .sort({ nextFollowUpDate: 1 })
        .lean()
    ]);

    const urgentCount = todayLeads.length + overdueLeads.length;
    const totalCount = urgentCount + upcomingLeads.length;

    return res.status(200).json({
      success: true,
      totalCount,
      urgentCount,
      todayCount: todayLeads.length,
      overdueCount: overdueLeads.length,
      upcomingCount: upcomingLeads.length,
      data: {
        today: todayLeads,
        overdue: overdueLeads,
        upcoming: upcomingLeads,
        all: [...overdueLeads, ...todayLeads, ...upcomingLeads]
      }
    });
  } catch (error) {
    console.error('Error fetching lead reminders:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch lead reminders',
      error: error.message
    });
  }
};

// POST /api/company-leads
exports.createLead = async (req, res) => {
  try {
    let {
      unicId,
      name,
      companyName,
      phoneNumber,
      whatsappNumber,
      email,
      address,
      state,
      purpose,
      leadType,
      leadSource,
      enquiryDate,
      leadStatus,
      leadPersonName,
      assignedStaffId,
      lastConversation,
      nextFollowUpDate,
      nextAction,
      lostReason,
      notes
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Lead or contact name is required' });
    }

    if (!phoneNumber || !phoneNumber.trim()) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    // Auto-generate unique ID if missing
    if (!unicId || !unicId.trim()) {
      unicId = await generateNextLeadId();
    } else {
      unicId = unicId.trim().toUpperCase();
      // Check for collision
      const existing = await CompanyLead.findOne({ unicId });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: `Lead ID "${unicId}" already exists. Please choose a different unique ID or leave empty to auto-generate.`
        });
      }
    }

    const history = [];
    if (lastConversation || notes) {
      history.push({
        message: lastConversation || notes,
        action: nextAction || 'Call',
        nextFollowUpDate: nextFollowUpDate ? new Date(nextFollowUpDate) : null,
        updatedBy: leadPersonName || (req.user && req.user.name) || 'Admin',
        date: new Date()
      });
    }

    const newLead = new CompanyLead({
      unicId,
      name: name.trim(),
      companyName: companyName ? companyName.trim() : '',
      phoneNumber: phoneNumber.trim(),
      whatsappNumber: whatsappNumber ? whatsappNumber.trim() : (phoneNumber ? phoneNumber.trim() : ''),
      email: email ? email.trim().toLowerCase() : '',
      address: address ? address.trim() : '',
      state: state ? state.trim() : '',
      purpose: purpose ? purpose.trim() : '',
      leadType: leadType || 'Warm',
      leadSource: leadSource || 'Website',
      enquiryDate: enquiryDate ? new Date(enquiryDate) : new Date(),
      leadStatus: leadStatus || 'New Inquiry',
      leadPersonName: leadPersonName ? leadPersonName.trim() : '',
      assignedStaffId: assignedStaffId || null,
      lastConversation: lastConversation ? lastConversation.trim() : '',
      nextFollowUpDate: nextFollowUpDate ? new Date(nextFollowUpDate) : null,
      nextAction: nextAction || 'Call',
      lostReason: lostReason ? lostReason.trim() : '',
      notes: notes ? notes.trim() : '',
      history
    });

    await newLead.save();

    // Send notification to the assigned employee's panel (Brand & Date/Time only)
    if (newLead.assignedStaffId && newLead.nextFollowUpDate) {
      try {
        const { notifyLeadAssignedStaff } = require('../utils/notificationService');
        await notifyLeadAssignedStaff(newLead);
      } catch (notifErr) {
        console.error('Error notifying assigned staff for lead creation:', notifErr);
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: newLead
    });
  } catch (error) {
    console.error('Error creating company lead:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A lead with this Unique ID or information already exists.'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to create lead',
      error: error.message
    });
  }
};

// GET /api/company-leads
exports.getAllLeads = async (req, res) => {
  try {
    const {
      search,
      status,
      leadType,
      leadSource,
      assignedStaffId,
      leadPersonName,
      startDate,
      endDate
    } = req.query;

    const query = {};

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { companyName: regex },
        { phoneNumber: regex },
        { whatsappNumber: regex },
        { email: regex },
        { unicId: regex },
        { purpose: regex },
        { address: regex }
      ];
    }

    if (status && status !== 'All') {
      query.leadStatus = status;
    }

    if (leadType && leadType !== 'All') {
      query.leadType = leadType;
    }

    if (leadSource && leadSource !== 'All') {
      query.leadSource = leadSource;
    }

    if (assignedStaffId) {
      query.assignedStaffId = assignedStaffId;
    }

    if (leadPersonName && leadPersonName !== 'All') {
      query.leadPersonName = new RegExp(leadPersonName.trim(), 'i');
    }

    if (startDate || endDate) {
      query.enquiryDate = {};
      if (startDate) query.enquiryDate.$gte = new Date(startDate);
      if (endDate) {
        const eDate = new Date(endDate);
        eDate.setHours(23, 59, 59, 999);
        query.enquiryDate.$lte = eDate;
      }
    }

    const leads = await CompanyLead.find(query)
      .populate('assignedStaffId', 'name employeeId department')
      .sort({ createdAt: -1 })
      .lean();

    // Summary stats
    const total = leads.length;
    const newInquiries = leads.filter(l => l.leadStatus === 'New Inquiry').length;
    const inFollowUp = leads.filter(l => l.leadStatus === 'In Follow-up' || l.leadStatus === 'Contacted').length;
    const converted = leads.filter(l => l.leadStatus === 'Converted').length;
    const lost = leads.filter(l => l.leadStatus === 'Lost').length;

    return res.status(200).json({
      success: true,
      count: total,
      stats: {
        total,
        newInquiries,
        inFollowUp,
        converted,
        lost
      },
      data: leads
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch company leads',
      error: error.message
    });
  }
};

// GET /api/company-leads/:id
exports.getLeadById = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await CompanyLead.findById(id).populate('assignedStaffId', 'name employeeId department');
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    return res.status(200).json({ success: true, data: lead });
  } catch (error) {
    console.error('Error fetching lead by id:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// PUT /api/company-leads/:id
exports.updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const existingLead = await CompanyLead.findById(id);

    if (!existingLead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const updates = { ...req.body };

    // Record follow-up message update in history if provided
    if (updates.newConversationMessage || (updates.lastConversation && updates.lastConversation !== existingLead.lastConversation)) {
      const msg = updates.newConversationMessage || updates.lastConversation;
      existingLead.history.unshift({
        message: msg,
        action: updates.nextAction || existingLead.nextAction,
        nextFollowUpDate: updates.nextFollowUpDate ? new Date(updates.nextFollowUpDate) : existingLead.nextFollowUpDate,
        updatedBy: updates.leadPersonName || (req.user && req.user.name) || 'Admin',
        date: new Date()
      });
    }

    Object.assign(existingLead, updates);
    await existingLead.save();

    // Send notification to the assigned employee's panel (Brand & Date/Time only)
    if (existingLead.assignedStaffId && existingLead.nextFollowUpDate && existingLead.leadStatus !== 'Converted' && existingLead.leadStatus !== 'Lost') {
      try {
        const { notifyLeadAssignedStaff } = require('../utils/notificationService');
        await notifyLeadAssignedStaff(existingLead);
      } catch (notifErr) {
        console.error('Error notifying assigned staff for lead update:', notifErr);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: existingLead
    });
  } catch (error) {
    console.error('Error updating lead:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update lead',
      error: error.message
    });
  }
};

// DELETE /api/company-leads/:id
exports.deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CompanyLead.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete lead',
      error: error.message
    });
  }
};
