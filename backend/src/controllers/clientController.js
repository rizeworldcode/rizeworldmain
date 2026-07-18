const Client = require('../models/Client');

// Helper to parse work detail into tasks
const parseWorkDetailToTasks = (workDetail) => {
  if (!workDetail) return [];
  
  const tasks = [];
  const lines = workDetail.split(/[\n•]+/).map(line => line.trim()).filter(line => line.length > 0);

  lines.forEach(line => {
    // Ignore department section headers like "--- SMM ---" or "--- SEO ---"
    if (line.match(/^---\s*.+\s*---$/)) {
      return;
    }

    // Ignore rate info lines
    if (line.match(/^(Rate\s+Per\s+)/i)) {
      return;
    }

    // Clean up leading bullets, hyphens or spaces from the display name
    const cleanedName = line.replace(/^[•\-\*\s]+/, '').trim();
    if (!cleanedName) return;

    // Check for SMM Posting pattern to split into individual Reels and Posts
    const postingMatch = cleanedName.match(/Total\s+Posting\s+\d+\s*\(\s*(\d+)[\-\s]*Reel[s]?\s*&\s*(\d+)[\-\s]*Post[s]?\s*\)/i);
    const complexPostingMatch = cleanedName.match(/Posting\s+Per\s+Month\s+[\d\-\s]+\(\s*(\d+)[\-\d\s]*Reels?\s*&\s*(\d+)[\-\d\s]*Posts?\s*\)/i);

    if (postingMatch) {
      const reelsCount = parseInt(postingMatch[1]) || 0;
      const postsCount = parseInt(postingMatch[2]) || 0;
      if (reelsCount > 0) {
        tasks.push({ name: 'Reel Posting', total: reelsCount, completed: 0, status: 'Pending', unit: 'Reels' });
      }
      if (postsCount > 0) {
        tasks.push({ name: 'Static Post Posting', total: postsCount, completed: 0, status: 'Pending', unit: 'Posts' });
      }
      return;
    }

    if (complexPostingMatch) {
      const reelsCount = parseInt(complexPostingMatch[1]) || 0;
      const postsCount = parseInt(complexPostingMatch[2]) || 0;
      if (reelsCount > 0) {
        tasks.push({ name: 'Reel Posting', total: reelsCount, completed: 0, status: 'Pending', unit: 'Reels' });
      }
      if (postsCount > 0) {
        tasks.push({ name: 'Static Post Posting', total: postsCount, completed: 0, status: 'Pending', unit: 'Posts' });
      }
      return;
    }

    // Determine the total count for other tasks
    let total = 1;
    let unit = 'Task';

    // 1. Try to match "Accounts Handled: X"
    const accountsHandledMatch = cleanedName.match(/Accounts\s+Handled:\s*(\d+)/i);
    // 2. Try to match leading number e.g. "2 Professional shoot" or "3 Pages"
    const leadingNumberMatch = cleanedName.match(/^(\d+)/);

    if (accountsHandledMatch) {
      total = parseInt(accountsHandledMatch[1]) || 1;
      unit = 'Accounts';
    } else if (leadingNumberMatch) {
      total = parseInt(leadingNumberMatch[1]) || 1;
      unit = 'Tasks';
    }

    tasks.push({
      name: cleanedName,
      total,
      completed: 0,
      status: 'Pending',
      unit
    });
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

    // If workDetail changed, regenerate tasks from new workDetail
    // Preserve completed progress for any matching task names
    if (workDetail !== undefined) {
      const newTasks = parseWorkDetailToTasks(workDetail);
      if (newTasks.length > 0) {
        // Build a map of old task progress: name → { completed, status }
        const oldProgressMap = {};
        (client.tasks || []).forEach(t => {
          oldProgressMap[t.name] = { completed: t.completed || 0, status: t.status || 'Pending' };
        });
        // Apply old progress to matching new tasks
        const mergedTasks = newTasks.map(t => {
          const oldProgress = oldProgressMap[t.name];
          if (oldProgress) {
            const completed = Math.min(oldProgress.completed, t.total);
            return { ...t, completed, status: oldProgress.status };
          }
          return t;
        });
        client.tasks = mergedTasks;
      }
    }

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
    const { tasks, extraTasks, metrics, staffId } = req.body;
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

    // Save SMM metrics to DelayWork collection if sent
    if (metrics && metrics.length > 0 && staffId) {
      const DelayWork = require('../models/DelayWork');
      for (const m of metrics) {
        const delayWork = new DelayWork({
          type: m.type, // 'reel', 'post', 'shoot'
          publishedLink: m.publishedLink || '',
          totalAccountReach: m.totalAccountReach || 0,
          totalAccountViews: m.totalAccountViews || 0,
          count: m.count || 1,
          clientId: req.params.id,
          staffId: staffId
        });
        await delayWork.save();
      }
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

exports.parseWorkDetailToTasks = parseWorkDetailToTasks;

