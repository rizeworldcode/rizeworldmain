const EmployeeLiveLocation = require('../models/EmployeeLiveLocation');
const EmployeeLocationHistory = require('../models/EmployeeLocationHistory');
const Staff = require('../models/Staff');
const socketUtil = require('../../socket');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');

// Helper to validate coordinates
const isValidCoordinates = (lat, lng) => {
  return typeof lat === 'number' && typeof lng === 'number' &&
         lat >= -90 && lat <= 90 &&
         lng >= -180 && lng <= 180;
};

// POST /api/location/update
exports.updateLocation = async (req, res) => {
  try {
    const { employeeId, employeeName, latitude, longitude, accuracy, speed, heading, deviceInfo, timestamp } = req.body;

    // Validate request
    if (!employeeId || !latitude || !longitude) {
      return res.status(400).json({ success: false, message: 'employeeId, latitude, and longitude are required' });
    }

    if (!isValidCoordinates(latitude, longitude)) {
      return res.status(400).json({ success: false, message: 'Invalid coordinates' });
    }

    // Security check: Employees can update only their own location
    if (req.role !== 'admin' && String(req.user._id) !== String(employeeId)) {
      return res.status(403).json({ success: false, message: 'Unauthorized: You can only update your own location' });
    }

    // Role check: Only "Sales Team" role should have tracking enabled
    const employee = await Staff.findById(employeeId);
    if (!employee || employee.role !== 'Sales Team') {
      return res.status(403).json({ success: false, message: 'Tracking is only enabled for Sales Team role' });
    }

    const name = employeeName || employee.name;
    const timeVal = timestamp ? new Date(timestamp) : new Date();

    // 1. Update Live Location (Upsert)
    const liveLoc = await EmployeeLiveLocation.findOneAndUpdate(
      { employeeId },
      {
        employeeName: name,
        latitude,
        longitude,
        accuracy,
        speed,
        heading,
        deviceInfo,
        lastUpdated: timeVal
      },
      { new: true, upsert: true }
    );

    // 2. Add to Location History
    await EmployeeLocationHistory.create({
      employeeId,
      employeeName: name,
      latitude,
      longitude,
      accuracy,
      speed,
      heading,
      timestamp: timeVal
    });

    // 3. Emit real-time update via Socket.IO
    try {
      const io = socketUtil.getIO();
      const updatePayload = {
        employeeId,
        employeeName: name,
        latitude,
        longitude,
        accuracy,
        speed,
        heading,
        lastUpdated: timeVal,
        phone: employee.phone
      };
      io.emit(`location-update-${employeeId}`, updatePayload);
      io.emit('live-locations-update', updatePayload);
    } catch (socketErr) {
      console.warn('Socket emit failed (perhaps socket.io is not initialized yet):', socketErr.message);
    }

    res.status(200).json({ success: true, data: liveLoc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/location/live
// Returns all active Sales Team employees live locations
exports.getLiveLocations = async (req, res) => {
  try {
    // Security check: Only admins can view live tracking
    if (req.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const liveLocations = await EmployeeLiveLocation.find().sort({ lastUpdated: -1 });
    
    // Add employee phone to live locations
    const result = await Promise.all(liveLocations.map(async (loc) => {
      const staff = await Staff.findById(loc.employeeId).select('phone');
      return {
        ...loc.toObject(),
        phone: staff ? staff.phone : 'N/A'
      };
    }));

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/location/history/:employeeId
// Returns route history for a specific employee
exports.getLocationHistory = async (req, res) => {
  try {
    // Security check: Only admins can view location history
    if (req.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const { employeeId } = req.params;
    const { date } = req.query; // format: YYYY-MM-DD

    let filter = { employeeId };

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);

      filter.timestamp = {
        $gte: startOfDay,
        $lte: endOfDay
      };
    } else {
      // Default to today
      const startOfDay = new Date();
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setUTCHours(23, 59, 59, 999);
      filter.timestamp = {
        $gte: startOfDay,
        $lte: endOfDay
      };
    }

    const history = await EmployeeLocationHistory.find(filter).sort({ timestamp: 1 });
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/location/photo
// Handles photo upload with GPS coordinates for Sales Team
exports.uploadPhotoLocation = async (req, res) => {
  try {
    const { employeeId, employeeName, latitude, longitude, accuracy, timestamp } = req.body;
    
    // Validate request
    if (!employeeId || !latitude || !longitude) {
      return res.status(400).json({ success: false, message: 'employeeId, latitude, and longitude are required' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Photo file is required' });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (!isValidCoordinates(lat, lng)) {
      return res.status(400).json({ success: false, message: 'Invalid coordinates' });
    }

    // Security check
    if (req.role !== 'admin' && String(req.user._id) !== String(employeeId)) {
      return res.status(403).json({ success: false, message: 'Unauthorized: You can only upload photos for yourself' });
    }

    // Role check
    const employee = await Staff.findById(employeeId);
    if (!employee || employee.role !== 'Sales Team') {
      return res.status(403).json({ success: false, message: 'Only Sales Team can use this feature' });
    }

    const name = employeeName || employee.name;
    const timeVal = timestamp ? new Date(timestamp) : new Date();

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'sales_photos',
      resource_type: 'auto'
    });
    const photoUrl = result.secure_url;

    // Clean up local temp file
    try {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } catch (unlinkError) {
      console.error(`Failed to delete local temp file ${req.file.path}:`, unlinkError);
    }

    // Add to Location History with photoUrl
    const newRecord = await EmployeeLocationHistory.create({
      employeeId,
      employeeName: name,
      latitude: lat,
      longitude: lng,
      accuracy: accuracy ? parseFloat(accuracy) : undefined,
      timestamp: timeVal,
      photoUrl
    });

    // Optionally emit a socket event to inform admin immediately
    try {
      const io = socketUtil.getIO();
      io.emit(`location-photo-${employeeId}`, newRecord);
      io.emit('live-locations-photo', newRecord);
    } catch (socketErr) {
      console.warn('Socket emit failed:', socketErr.message);
    }

    res.status(200).json({ success: true, data: newRecord, message: 'Photo uploaded successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/location/photos
exports.getLocationPhotos = async (req, res) => {
  try {
    if (req.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized: Only admins can view photo history' });
    }

    const photos = await EmployeeLocationHistory.find({ photoUrl: { $exists: true, $ne: null } })
      .sort({ timestamp: -1 });

    res.status(200).json({ success: true, data: photos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
