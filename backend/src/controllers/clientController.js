const Client = require('../models/Client');
const OldClient = require('../models/OldClient');
const cache = require('../utils/cache');

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

// Helper to check and transfer clients whose work reached 100% completion 2+ days ago without renewal
const checkAndTransferCompletedClients = async () => {
  try {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    const clients = await Client.find();

    for (const client of clients) {
      const primaryTasks = client.tasks || [];
      const extraTasks = client.extraTasks || [];
      const primaryTotal = primaryTasks.reduce((acc, t) => acc + (t.total || 0), 0);
      const totalCompleted = [...primaryTasks, ...extraTasks].reduce((acc, t) => acc + (t.completed || 0), 0);
      const is100Percent = (primaryTotal > 0 && totalCompleted >= primaryTotal) || client.status === 'Completed';

      if (is100Percent) {
        if (!client.completedAt) {
          client.completedAt = client.updatedAt || new Date();
          await client.save();
        }

        if (client.completedAt && new Date(client.completedAt) <= twoDaysAgo) {
          // Transfer client to OldClient collection
          const projectDetailText = (client.workDetail && client.workDetail.trim()) || client.package || 'Completed Service Package';
          const emailText = (client.email && client.email.trim()) || `${(client.name || 'client').toLowerCase().replace(/\s+/g, '')}@example.com`;
          const phoneText = (client.phone && client.phone.trim()) || 'N/A';

          const clientTasks = (client.tasks && client.tasks.length > 0)
            ? client.tasks.map(t => ({ ...t, completed: t.total, status: 'Completed' }))
            : parseWorkDetailToTasks(client.workDetail).map(t => ({ ...t, completed: t.total, status: 'Completed' }));

          const oldClientData = {
            name: client.name || 'Client',
            phone: phoneText,
            email: emailText,
            projectDetail: projectDetailText,
            workDetail: client.workDetail || projectDetailText,
            package: client.package || 'Service Package',
            department: client.department || 'Completed Project',
            startDate: client.startDate || client.createdAt || new Date(),
            deliveredDate: client.completedAt || client.deadline || new Date(),
            totalAmount: client.totalPrice || 0,
            paidAmount: client.paidAmount || 0,
            address: 'N/A',
            payments: client.payments || [],
            tasks: clientTasks,
            extraTasks: client.extraTasks || [],
            history: client.history || []
          };

          const oldClient = new OldClient(oldClientData);
          await oldClient.save();
          await Client.findByIdAndDelete(client._id);
          console.log(`[Auto-Transfer] Transferred client ${client.name} (${client._id}) to OldClients (100% completed > 2 days ago without renewal).`);
        }
      } else {
        if (client.completedAt) {
          client.completedAt = null;
          await client.save();
        }
      }
    }
  } catch (error) {
    console.error('Error auto-transferring completed clients:', error);
  }
};

exports.checkAndTransferCompletedClients = checkAndTransferCompletedClients;


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
      status: req.body.status || 'Present',
      tasks: generatedTasks
    });

    await client.save();
    cache.flushByPrefix('clients:');
    cache.flushByPrefix('dashboard:');

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
    const { limit, search, select } = req.query;

    if (limit || search || select) {
      let query = Client.find();
      if (search) {
        query = query.find({
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
            { department: { $regex: search, $options: 'i' } }
          ]
        });
      }
      if (select) {
        query = query.select(select);
      }
      query = query.sort({ createdAt: -1 });
      if (limit) {
        query = query.limit(parseInt(limit, 10));
      }
      const clients = await query.lean();
      return res.status(200).json({
        success: true,
        count: clients.length,
        data: clients
      });
    }

    const cacheKey = 'clients:all';
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        success: true,
        data: cachedData
      });
    }

    const clients = await Client.find().sort({ createdAt: -1 }).lean();
    cache.set(cacheKey, clients, 60);

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
    let client = await Client.findById(req.params.id).lean();
    if (!client) {
      const oldClientDoc = await OldClient.findById(req.params.id).lean();
      if (oldClientDoc) {
        let tasks = (oldClientDoc.tasks && oldClientDoc.tasks.length > 0)
          ? oldClientDoc.tasks
          : parseWorkDetailToTasks(oldClientDoc.workDetail || oldClientDoc.projectDetail);

        // Ensure tasks for completed/old client show 100% completed progress
        tasks = tasks.map(t => ({
          ...t,
          completed: (t.completed !== undefined && t.completed > 0) ? t.completed : (t.total || 1),
          status: 'Completed'
        }));

        const extraTasks = (oldClientDoc.extraTasks || []).map(t => ({
          ...t,
          completed: (t.completed !== undefined && t.completed > 0) ? t.completed : (t.total || 1),
          status: 'Completed'
        }));

        client = {
          _id: oldClientDoc._id,
          id: oldClientDoc._id,
          name: oldClientDoc.name,
          email: oldClientDoc.email,
          phone: oldClientDoc.phone,
          workDetail: oldClientDoc.workDetail || oldClientDoc.projectDetail,
          totalPrice: oldClientDoc.totalAmount || 0,
          paidAmount: oldClientDoc.paidAmount || 0,
          pendingAmount: Math.max(0, (oldClientDoc.totalAmount || 0) - (oldClientDoc.paidAmount || 0)),
          startDate: oldClientDoc.startDate,
          deadline: oldClientDoc.deliveredDate,
          department: oldClientDoc.department || 'Completed Project',
          package: oldClientDoc.package || 'Old Client',
          status: 'Completed',
          payments: oldClientDoc.payments || [],
          tasks: tasks,
          extraTasks: extraTasks,
          history: oldClientDoc.history || [],
          isOldClient: true
        };
      }
    }
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
    cache.flushByPrefix('clients:');
    cache.flushByPrefix('dashboard:');

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

    if (tasks && Array.isArray(tasks) && tasks.length > 0) {
      const allCompleted = tasks.every(t => t.completed >= t.total);
      const anyInProgress = tasks.some(t => t.completed > 0 || t.status === 'In Progress');
      if (allCompleted) {
        client.status = 'Completed';
        if (!client.completedAt) client.completedAt = new Date();
        await client.save();
      } else {
        if (client.completedAt) client.completedAt = null;
        if (anyInProgress && client.status === 'Pending') {
          client.status = 'In Progress';
        }
        await client.save();
      }
    }

    // Save SMM metrics to DelayWork collection if sent
    if (metrics && metrics.length > 0 && staffId) {
      const DelayWork = require('../models/DelayWork');
      for (const m of metrics) {
        const delayWork = new DelayWork({
          type: m.type, // 'reel', 'post', 'shoot'
          publishedLink: m.publishedLink || '',
          totalAccountReach: m.totalAccountReach !== undefined ? m.totalAccountReach : '0',
          totalAccountViews: m.totalAccountViews !== undefined ? m.totalAccountViews : '0',
          count: m.count || 1,
          clientId: req.params.id,
          staffId: staffId
        });
        await delayWork.save();
      }
    }

    cache.flushByPrefix('clients:');
    cache.flushByPrefix('dashboard:');

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

    let client = await Client.findById(req.params.id);

    // If client is in OldClient collection, restore to active Client collection
    if (!client) {
      const oldClientDoc = await OldClient.findById(req.params.id);
      if (oldClientDoc) {
        const historyEntry = {
          package: oldClientDoc.package || 'Old Client',
          workDetail: oldClientDoc.workDetail || oldClientDoc.projectDetail,
          totalPrice: oldClientDoc.totalAmount || 0,
          paidAmount: oldClientDoc.paidAmount || 0,
          pendingAmount: Math.max(0, (oldClientDoc.totalAmount || 0) - (oldClientDoc.paidAmount || 0)),
          startDate: oldClientDoc.startDate,
          deadline: oldClientDoc.deliveredDate,
          tasks: oldClientDoc.tasks || [],
          extraTasks: oldClientDoc.extraTasks || [],
          payments: oldClientDoc.payments || [],
          status: 'Completed',
          completedAt: oldClientDoc.deliveredDate || new Date()
        };

        const generatedTasks = parseWorkDetailToTasks(workDetail);

        const activeClient = new Client({
          _id: oldClientDoc._id,
          name: oldClientDoc.name,
          email: oldClientDoc.email,
          phone: oldClientDoc.phone,
          department: oldClientDoc.department || 'SEO',
          package: package,
          workDetail: workDetail,
          totalPrice: parseFloat(totalAmount) || 0,
          pendingAmount: parseFloat(totalAmount) || 0,
          paidAmount: 0,
          startDate: startDate ? new Date(startDate) : new Date(),
          deadline: deadline ? new Date(deadline) : null,
          status: 'Present',
          completedAt: null,
          tasks: generatedTasks,
          extraTasks: [],
          payments: [],
          history: [historyEntry]
        });

        await activeClient.save();
        await OldClient.findByIdAndDelete(oldClientDoc._id);
        console.log(`[Auto-Reactivate] Renewed old client ${oldClientDoc.name} (${oldClientDoc._id}) and moved back to active Clients collection.`);

        return res.status(200).json({
          success: true,
          message: 'Package renewed successfully and client moved back to active clients list',
          data: activeClient
        });
      }
    }

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
        status: 'Present',
        completedAt: null,
        tasks: generatedTasks,
        extraTasks: [], // Reset extra tasks for the new month
        payments: [], // Clear payments for the new month
        $push: { history: historyEntry }
      },
      { new: true, runValidators: true }
    );

    cache.flushByPrefix('clients:');
    cache.flushByPrefix('dashboard:');

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

