const VisitingCard = require('../models/VisitingCard');
const Staff = require('../models/Staff');
const socketUtil = require('../../socket');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');

// Helper to validate coordinates
const isValidCoordinates = (lat, lng) => {
  return typeof lat === 'number' && typeof lng === 'number' &&
         lat >= -90 && lat <= 90 &&
         lng >= -180 && lng <= 180;
};

// POST /api/visiting-card/upload
exports.uploadVisitingCard = async (req, res) => {
  try {
    const { 
      employeeId, 
      employeeName, 
      latitude, 
      longitude, 
      accuracy, 
      timestamp,
      cardName,
      cardPhone,
      cardEmail,
      cardCompany,
      cardRawText
    } = req.body;

    // Validate request
    if (!employeeId || !latitude || !longitude) {
      return res.status(400).json({ success: false, message: 'employeeId, latitude, and longitude are required' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Visiting card photo file is required' });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (!isValidCoordinates(lat, lng)) {
      return res.status(400).json({ success: false, message: 'Invalid coordinates' });
    }

    // Security check
    if (req.role !== 'admin' && String(req.user._id) !== String(employeeId)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const employee = await Staff.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    const name = employeeName || employee.name;
    const timeVal = timestamp ? new Date(timestamp) : new Date();

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'visiting_cards',
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

    // Create record
    const newRecord = await VisitingCard.create({
      employeeId,
      employeeName: name,
      photoUrl,
      cardData: {
        name: cardName || '',
        phone: cardPhone || '',
        email: cardEmail || '',
        company: cardCompany || '',
        rawText: cardRawText || ''
      },
      latitude: lat,
      longitude: lng,
      accuracy: accuracy ? parseFloat(accuracy) : undefined,
      timestamp: timeVal
    });

    // Socket notification
    try {
      const io = socketUtil.getIO();
      io.emit('new-visiting-card', newRecord);
    } catch (socketErr) {
      console.warn('Socket emit failed for new visiting card:', socketErr.message);
    }

    res.status(200).json({ success: true, data: newRecord, message: 'Visiting card uploaded successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/visiting-card/all
exports.getAllVisitingCards = async (req, res) => {
  try {
    if (req.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized: Admins only' });
    }

    const cards = await VisitingCard.find().sort({ timestamp: -1 });
    res.status(200).json({ success: true, data: cards });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


