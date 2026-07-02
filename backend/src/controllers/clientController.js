const Client = require('../models/Client');

// Helper to parse work detail into tasks
const parseWorkDetailToTasks = (workDetail) => {
  if (!workDetail) return [];
  
  const tasks = [];
  // Split by newlines or bullet points (•) or other common delimiters
  const lines = workDetail.split(/[\n•]+/).map(line => line.trim()).filter(line => line.length > 0);

  lines.forEach(line => {
    // Check for specific patterns like "Total Posting 8 ( 4 Reel & 4 Post )"
    const postingMatch = line.match(/Total Posting\s+(\d+)\s*\(\s*(\d+)\s*Reel\s*&\s*(\d+)\s*Post\s*\)/i);
    if (postingMatch) {
      tasks.push({ name: 'Reel Posting', total: parseInt(postingMatch[2]), completed: 0, status: 'Pending', unit: 'Reels' });
      tasks.push({ name: 'Static Post Posting', total: parseInt(postingMatch[3]), completed: 0, status: 'Pending', unit: 'Posts' });
      return;
    }

    // Check for pattern like "3 Professional shoot" or "10 Professional shoot"
    const shootMatch = line.match(/(\d+)\+?\s*Professional\s*shoot/i);
    if (shootMatch) {
      tasks.push({ name: 'Professional Shoots', total: parseInt(shootMatch[1]), completed: 0, status: 'Pending', unit: 'Shoots' });
      return;
    }

    // Check for pattern like "Posting Per Month 14 - 16 ( 8 - 10 Reels & 6 Post )"
    const complexPostingMatch = line.match(/Posting\s+Per\s+Month\s+[\d\-\s]+\(\s*(\d+)[\-\d\s]*Reels?\s*&\s*(\d+)[\-\d\s]*Posts?\s*\)/i);
    if (complexPostingMatch) {
      tasks.push({ name: 'Reel Posting', total: parseInt(complexPostingMatch[1]), completed: 0, status: 'Pending', unit: 'Reels' });
      tasks.push({ name: 'Static Post Posting', total: parseInt(complexPostingMatch[2]), completed: 0, status: 'Pending', unit: 'Posts' });
      return;
    }

    // Check for pattern like "Views 10k +"
    const viewsMatch = line.match(/Views\s+(\d+k?\+?)/i);
    if (viewsMatch) {
      tasks.push({ name: 'Target Views', total: 1, completed: 0, status: 'Pending', unit: viewsMatch[1] });
      return;
    }

    // Default: treat line as a single task with total 1
    tasks.push({ name: line, total: 1, completed: 0, status: 'Pending', unit: 'Task' });
  });

  return tasks;
};

exports.createClient = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      workDetail, 
      totalAmount, 
      package, 
      department, 
      startDate,
      deadline 
    } = req.body;

    const total = parseFloat(totalAmount) || 0;
    const generatedTasks = parseWorkDetailToTasks(workDetail);

    const client = new Client({
      name,
      email,
      phone,
      workDetail,
      totalPrice: total,
      pendingAmount: total,
      package,
      department,
      startDate: startDate ? new Date(startDate) : new Date(),
      deadline: deadline ? new Date(deadline) : null,
      tasks: generatedTasks
    });

    await client.save();

    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: client
    });
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating client'
    });
  }
};

exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: clients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching clients'
    });
  }
};

exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }
    res.status(200).json({
      success: true,
      data: client
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching client'
    });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    const {
      name,
      email,
      phone,
      department,
      package: packageName,
      workDetail,
      totalAmount,
      totalPrice,
      startDate,
      deadline,
      status
    } = req.body;

    if (name !== undefined) client.name = name;
    if (email !== undefined) client.email = email;
    if (phone !== undefined) client.phone = phone;
    if (department !== undefined) client.department = department;
    if (packageName !== undefined) client.package = packageName;
    if (workDetail !== undefined) client.workDetail = workDetail;
    if (status !== undefined) client.status = status;
    if (startDate !== undefined) client.startDate = startDate ? new Date(startDate) : null;
    if (deadline !== undefined) client.deadline = deadline ? new Date(deadline) : null;

    if (totalAmount !== undefined || totalPrice !== undefined) {
      const nextTotal = parseFloat(totalAmount ?? totalPrice);
      if (!Number.isNaN(nextTotal)) {
        client.totalPrice = nextTotal;
        client.pendingAmount = Math.max(nextTotal - (client.paidAmount || 0), 0);
      }
    }

    const updatedClient = await client.save();

    res.status(200).json({
      success: true,
      message: 'Client updated successfully',
      data: updatedClient
    });
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating client'
    });
  }
};

exports.updateClientTasks = async (req, res) => {
  try {
    const { tasks, extraTasks } = req.body;
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { tasks, extraTasks },
      { new: true, runValidators: true }
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tasks updated successfully',
      data: client
    });
  } catch (error) {
    console.error('Error updating tasks:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating tasks'
    });
  }
};

exports.renewClientPackage = async (req, res) => {
  try {
    const { package, workDetail, totalAmount, startDate, deadline } = req.body;

    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    // Push current state to history before resetting
    const historyEntry = {
      package: client.package,
      workDetail: client.workDetail,
      totalPrice: client.totalPrice,
      paidAmount: client.paidAmount,
      pendingAmount: client.pendingAmount,
      startDate: client.startDate,
      deadline: client.deadline,
      tasks: client.tasks,
      extraTasks: client.extraTasks,
      payments: client.payments,
      status: client.status,
      completedAt: new Date()
    };

    const generatedTasks = parseWorkDetailToTasks(workDetail);

    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      {
        package,
        workDetail,
        totalPrice: parseFloat(totalAmount),
        pendingAmount: parseFloat(totalAmount),
        paidAmount: 0,
        startDate: startDate ? new Date(startDate) : new Date(),
        deadline: deadline ? new Date(deadline) : null,
        status: 'In Progress',
        tasks: generatedTasks,
        extraTasks: [], // Reset extra tasks for the new month
        payments: [], // Clear payments for the new month
        $push: { history: historyEntry }
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Package renewed successfully',
      data: updatedClient
    });
  } catch (error) {
    console.error('Error renewing package:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error renewing package'
    });
  }
};
