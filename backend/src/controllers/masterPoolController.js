const MasterPoolItem = require('../models/MasterPoolItem');
const Staff = require('../models/Staff');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// @desc    Add a new master pool item
// @route   POST /api/masterpool
// @access  Private (Staff)
exports.addMasterPoolItem = catchAsync(async (req, res, next) => {
  const { name, staffId, staffRole } = req.body;

  if (!name || !staffId || !staffRole) {
    return next(new AppError('Please provide name, staffId, and staffRole', 400));
  }

  const staff = await Staff.findById(staffId);
  if (!staff) {
    return next(new AppError('Staff not found', 404));
  }

  // Ensure only authorized roles can add items
  const allowedRoles = ['technical tl', 'digital marketing specialist'];
  if (!allowedRoles.includes(staffRole.toLowerCase())) {
    return next(new AppError('Unauthorized: Only Technical TL and Digital Marketing Specialist can add master pool items', 403));
  }

  const newItem = await MasterPoolItem.create({
    name,
    staffId,
    staffRole,
  });

  res.status(201).json({
    success: true,
    data: newItem,
  });
});

// @desc    Get all master pool items for a specific staff member
// @route   GET /api/masterpool/:staffId
// @access  Private (Staff)
exports.getMasterPoolItems = catchAsync(async (req, res, next) => {
  const { staffId } = req.params;

  const items = await MasterPoolItem.find({ staffId }).sort('name');

  res.status(200).json({
    success: true,
    data: items,
  });
});

// @desc    Delete a master pool item
// @route   DELETE /api/masterpool/:id
// @access  Private (Staff)
exports.deleteMasterPoolItem = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { staffId } = req.body; // Assuming staffId is sent in body for authorization

  const item = await MasterPoolItem.findById(id);

  if (!item) {
    return next(new AppError('Master pool item not found', 404));
  }

  // Ensure only the owner can delete their item
  if (item.staffId.toString() !== staffId) {
    return next(new AppError('Unauthorized: You can only delete your own master pool items', 403));
  }

  await item.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Master pool item deleted successfully',
  });
});
