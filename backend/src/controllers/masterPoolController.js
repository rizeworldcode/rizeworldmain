const MasterPool = require('../models/MasterPool');

// Get all master pool items for a staff member
exports.getMasterPool = async (req, res) => {
  try {
    const { staffId } = req.params;
    const items = await MasterPool.find({ staffId }).sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching master pool:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch master pool' });
  }
};

// Add a new item to master pool
exports.addMasterPoolItem = async (req, res) => {
  try {
    const { name, staffId, staffRole } = req.body;
    
    if (!name || !staffId || !staffRole) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, staffId, and staffRole are required' 
      });
    }

    const newItem = new MasterPool({
      name,
      staffId,
      staffRole
    });

    const savedItem = await newItem.save();
    res.status(201).json({ success: true, data: savedItem });
  } catch (error) {
    console.error('Error adding master pool item:', error);
    res.status(500).json({ success: false, message: 'Failed to add item' });
  }
};

// Delete an item from master pool
exports.deleteMasterPoolItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { staffId } = req.body;
    
    if (!staffId) {
      return res.status(400).json({ 
        success: false, 
        message: 'staffId is required' 
      });
    }

    const deletedItem = await MasterPool.findOneAndDelete({ 
      _id: id, 
      staffId 
    });
    
    if (!deletedItem) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found' 
      });
    }

    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting master pool item:', error);
    res.status(500).json({ success: false, message: 'Failed to delete item' });
  }
};
