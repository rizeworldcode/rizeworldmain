const OldClient = require('../models/OldClient');

// Create Old Client
exports.createOldClient = async (req, res) => {
  try {
    const oldClient = new OldClient(req.body);
    await oldClient.save();
    res.status(201).json({
      success: true,
      message: 'Old client created successfully',
      data: oldClient
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Old Clients
exports.getAllOldClients = async (req, res) => {
  try {
    const oldClients = await OldClient.find();
    res.status(200).json({
      success: true,
      count: oldClients.length,
      data: oldClients
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get Single Old Client
exports.getOldClient = async (req, res) => {
  try {
    const oldClient = await OldClient.findById(req.params.id);
    if (!oldClient) {
      return res.status(404).json({
        success: false,
        message: 'Old client not found'
      });
    }
    res.status(200).json({
      success: true,
      data: oldClient
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update Old Client
exports.updateOldClient = async (req, res) => {
  try {
    const oldClient = await OldClient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!oldClient) {
      return res.status(404).json({
        success: false,
        message: 'Old client not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Old client updated successfully',
      data: oldClient
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete Old Client
exports.deleteOldClient = async (req, res) => {
  try {
    const oldClient = await OldClient.findByIdAndDelete(req.params.id);
    if (!oldClient) {
      return res.status(404).json({
        success: false,
        message: 'Old client not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Old client deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
