const Staff = require('../models/Staff');
const Client = require('../models/Client');
const StudentAdmission = require('../models/StudentAdmission');
const AssignedWorkReport = require('../models/AssignedWorkReport');
const jwt = require('jsonwebtoken');
const upload = require('../middleware/upload');
const socketUtil = require('../../socket');

// Staff Login
exports.loginStaff = async (req, res) => {
  try {
    const { employeeId, password } = req.body;

    const staff = await Staff.findOne({ employeeId });
    if (!staff) {
      return res.status(401).json({ success: false, message: 'Invalid Employee ID' });
    }

    const isMatch = await staff.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid Password' });
    }

    // Generate real JWT token
    const token = jwt.sign(
      { id: staff._id, employeeId: staff.employeeId, role: 'staff' },
      process.env.SECRET_KEY || 'default_secret',
      { expiresIn: '24h' }
    );

    // Save token in database as auth key
    staff.authToken = token;
    await staff.save();

    // Get today's clock record for sending to frontend
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayClockRecord = staff.clock?.find(c =>
      new Date(c.date) >= today && new Date(c.date) < tomorrow
    );

    let reportingPersonName = '-';
    if (staff.reportingPerson && staff.reportingPerson.length > 0) {
      const managers = await Staff.find({ employeeId: { $in: staff.reportingPerson } });
      if (managers && managers.length > 0) {
        reportingPersonName = managers.map(m => m.name).join(', ');
      }
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: staff._id,
        name: staff.name,
        employeeId: staff.employeeId,
        department: staff.department,
        email: staff.email,
        joiningDate: staff.joiningDate,
        monthlySalary: staff.monthlySalary,
        clock: staff.clock,
        work: staff.work,
        status: staff.status,
        clock_status: staff.clock_status,
        attendance: staff.attendance,
        salaryHistory: staff.salaryHistory,
        leaves: staff.leaves,
        totalCasualLeaves: staff.totalCasualLeaves,
        todayClock: todayClockRecord || null, // Send today's specific clock record
        role: staff.role, // Include role for notifications
        reportingPerson: staff.reportingPerson || [],
        reportingPersonName
      },
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create staff
exports.createStaff = async (req, res) => {
  try {
    // Validate required fields for creation
    if (!req.body.name || !req.body.phone || !req.body.email ||
      !req.body.monthlySalary || !req.body.department ||
      !req.body.jobType || !req.body.password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, phone, email, monthlySalary, department, jobType, password'
      });
    }

    // Auto-generate employee ID if not provided
    if (!req.body.employeeId) {
      const count = await Staff.countDocuments();
      req.body.employeeId = `RW-${1000 + count + 1}`;
    }

    // Process documents: if they are strings, convert to objects
    if (req.body.documents && Array.isArray(req.body.documents)) {
      req.body.documents = req.body.documents.map(doc => {
        if (typeof doc === 'string') {
          return { name: doc, path: '' };
        }
        return doc;
      });
    }

    const staff = new Staff(req.body);
    await staff.save();
    res.status(201).json({
      success: true,
      data: staff
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all staff
exports.getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find().sort({ createdAt: -1 });
    
    // For each staff member, if they are a counselor, get their admissions count
    const staffWithCounts = await Promise.all(
      staff.map(async (staffMember) => {
        const staffObj = staffMember.toObject();
        if (staffObj.role === 'Counselor') {
          const admissionsCount = await StudentAdmission.countDocuments({ counselorId: staffObj._id });
          staffObj.admissionsCount = admissionsCount;
        }
        return staffObj;
      })
    );

    res.status(200).json({
      success: true,
      count: staff.length,
      data: staffWithCounts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all counselors
exports.getAllCounselors = async (req, res) => {
  try {
    const counselors = await Staff.find({ role: 'Counselor' })
      .select('name employeeId email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: counselors.length,
      data: counselors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create student admission
exports.createAdmission = async (req, res) => {
  try {
    const admission = new StudentAdmission(req.body);
    await admission.save();
    res.status(201).json({
      success: true,
      data: admission
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all admissions
exports.getAllAdmissions = async (req, res) => {
  try {
    // If counselorId is provided, filter by that counselor
    const filter = req.query.counselorId ? { counselorId: req.query.counselorId } : {};
    const admissions = await StudentAdmission.find(filter).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: admissions.length,
      data: admissions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update admission
exports.updateAdmission = async (req, res) => {
  try {
    const admission = await StudentAdmission.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }
    res.status(200).json({
      success: true,
      data: admission
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete admission
exports.deleteAdmission = async (req, res) => {
  try {
    const admission = await StudentAdmission.findByIdAndDelete(req.params.id);
    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Admission deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get single staff by ID
exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff not found'
      });
    }

    // Get today's clock record for sending to frontend
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayClockRecord = staff.clock?.find(c =>
      new Date(c.date) >= today && new Date(c.date) < tomorrow
    );

    let reportingPersonName = '-';
    if (staff.reportingPerson && staff.reportingPerson.length > 0) {
      const managers = await Staff.find({ employeeId: { $in: staff.reportingPerson } });
      if (managers && managers.length > 0) {
        reportingPersonName = managers.map(m => m.name).join(', ');
      }
    }

    res.status(200).json({
      success: true,
      data: {
        id: staff._id,
        name: staff.name,
        employeeId: staff.employeeId,
        department: staff.department,
        email: staff.email,
        joiningDate: staff.joiningDate,
        monthlySalary: staff.monthlySalary,
        clock: staff.clock,
        work: staff.work,
        status: staff.status,
        clock_status: staff.clock_status,
        attendance: staff.attendance,
        salaryHistory: staff.salaryHistory,
        leaves: staff.leaves,
        totalCasualLeaves: staff.totalCasualLeaves,
        todayClock: todayClockRecord || null,
        role: staff.role,
        reportingPerson: staff.reportingPerson || [],
        reportingPersonName
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update staff
exports.updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff not found'
      });
    }

    // Clean request body - remove empty strings and undefined values
    const updateData = {};
    Object.keys(req.body).forEach(key => {
      const value = req.body[key];
      if (value !== '' && value !== undefined && value !== null) {
        updateData[key] = value;
      }
    });

    // Process documents: if they are strings, convert to objects
    if (updateData.documents && Array.isArray(updateData.documents)) {
      updateData.documents = updateData.documents.map(doc => {
        if (typeof doc === 'string') {
          return { name: doc, path: '' };
        }
        return doc;
      });
    }

    // Update fields from cleaned data
    Object.keys(updateData).forEach(key => {
      staff[key] = updateData[key];
    });

    // Save the staff (this will trigger pre-save middleware for password hashing)
    const updatedStaff = await staff.save();

    res.status(200).json({
      success: true,
      data: updatedStaff
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete staff
exports.deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Staff deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Helper function to format time
const formatTime = (date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Helper function to parse time string to minutes since midnight
const timeToMinutes = (timeStr) => {
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

// Helper function to calculate duration between two times
const calculateDuration = (clockInStr, clockOutStr) => {
  try {
    const clockInMins = timeToMinutes(clockInStr);
    const clockOutMins = timeToMinutes(clockOutStr);

    let diffMins = clockOutMins - clockInMins;
    if (diffMins < 0) diffMins += 24 * 60; // Handle overnight clock out

    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;

    return `${hours}h ${mins}m`;
  } catch (e) {
    console.error('Error calculating duration:', e);
    return '-';
  }
};

// Helper function to calculate total hours from all sessions in a day
const calculateTotalHours = (sessions) => {
  try {
    let totalMins = 0;
    sessions.forEach(session => {
      if (session.clockIn && session.clockOut) {
        const clockInMins = timeToMinutes(session.clockIn);
        const clockOutMins = timeToMinutes(session.clockOut);
        let diffMins = clockOutMins - clockInMins;
        if (diffMins < 0) diffMins += 24 * 60;
        totalMins += diffMins;
      }
    });

    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;

    return `${hours}h ${mins}m`;
  } catch (e) {
    console.error('Error calculating total hours:', e);
    return '-';
  }
};

// ========== Payout Calculation Functions ==========
const STANDARD_HOURS_PER_DAY = 8.5;
const DAYS_IN_MONTH = 30;
const EXPECTED_MONTHLY_HOURS = STANDARD_HOURS_PER_DAY * DAYS_IN_MONTH; // 255 hours

const parseTotalHours = (totalHoursStr) => {
  if (!totalHoursStr || totalHoursStr === '-') return 0;
  let hours = 0;
  let minutes = 0;
  const hMatch = totalHoursStr.match(/(\d+)\s*h/i);
  const mMatch = totalHoursStr.match(/(\d+)\s*m/i);
  if (hMatch) hours = parseInt(hMatch[1], 10);
  if (mMatch) minutes = parseInt(mMatch[1], 10);
  return hours + (minutes / 60);
};

const calculatePayout = (staffInfo) => {
  const baseSalary = staffInfo.monthlySalary || 0;
  const hourlyRate = baseSalary / EXPECTED_MONTHLY_HOURS;

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Determine the start day: if employee was added to the website this month, start from that date; else day 1
  const createdAt = staffInfo.createdAt ? new Date(staffInfo.createdAt) : null;
  const startDay = (
    createdAt &&
    createdAt.getMonth() === currentMonth &&
    createdAt.getFullYear() === currentYear
  ) ? createdAt.getDate() : 1;

  // --- Step 1: Sum actual hours from clock records ---
  const monthlyClockRecords = (staffInfo.clock || []).filter(record => {
    const d = new Date(record.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  let totalHoursWorked = 0;
  monthlyClockRecords.forEach(record => {
    totalHoursWorked += parseTotalHours(record.totalHours);
  });

  // Build set of clocked dates (to avoid double-counting)
  const creditedDates = new Set(
    monthlyClockRecords.map(r => new Date(r.date).toDateString())
  );

  // --- Step 2: Credit 8.5 hrs for each SUNDAY in the month (from startDay up to today) ---
  for (let day = startDay; day <= today.getDate(); day++) {
    const d = new Date(currentYear, currentMonth, day);
    if (d.getDay() === 0 && !creditedDates.has(d.toDateString())) {
      totalHoursWorked += STANDARD_HOURS_PER_DAY;
      creditedDates.add(d.toDateString());
    }
  }

  // --- Step 3: Credit 8.5 hrs for each admin-declared leave day ---
  (staffInfo.leaves || []).forEach(leave => {
    const leaveDate = new Date(leave.date);
    if (
      leaveDate.getMonth() === currentMonth &&
      leaveDate.getFullYear() === currentYear &&
      leaveDate <= today &&
      !creditedDates.has(leaveDate.toDateString())
    ) {
      totalHoursWorked += STANDARD_HOURS_PER_DAY;
      creditedDates.add(leaveDate.toDateString());
    }
  });

  // --- Step 4: Find truly absent days (from startDay, no clock, not Sunday, not admin leave) ---
  const absentDays = [];
  for (let day = startDay; day <= today.getDate(); day++) {
    const d = new Date(currentYear, currentMonth, day);
    if (!creditedDates.has(d.toDateString())) {
      absentDays.push(d);
    }
  }

  // --- Step 5: Find half-days from attendance records ---
  const halfDayRecords = (staffInfo.attendance || []).filter(att => {
    const d = new Date(att.date);
    return (
      att.status === 'Half-Day' &&
      d.getMonth() === currentMonth &&
      d.getFullYear() === currentYear &&
      d <= today
    );
  });
  // 2 half-days = 1 leave unit
  const halfDayLeaveUnits = Math.floor(halfDayRecords.length / 2);

  // --- Step 6: Apply 1 FREE casual leave per month ---
  // Priority: 1st absent day → then 1st pair of half-days
  let casualLeaveUsed = false;

  if (absentDays.length > 0) {
    // 1st absent day is auto casual leave → credit full 8.5 hrs
    totalHoursWorked += STANDARD_HOURS_PER_DAY;
    creditedDates.add(absentDays[0].toDateString());
    casualLeaveUsed = true;
  } else if (halfDayLeaveUnits > 0) {
    // No absent days but 2+ half-days → use casual leave for 1st pair
    // Top up each of those 2 half-days to 4.25 hrs (half of 8.5)
    // so the pair together = 8.5 hrs (1 full day equivalent)
    for (let i = 0; i < 2; i++) {
      const hdDate = new Date(halfDayRecords[i].date);
      const clockRecord = monthlyClockRecords.find(
        r => new Date(r.date).toDateString() === hdDate.toDateString()
      );
      const actualHrs = clockRecord ? parseTotalHours(clockRecord.totalHours) : 0;
      const halfTarget = STANDARD_HOURS_PER_DAY / 2; // 4.25 hrs
      if (actualHrs < halfTarget) {
        totalHoursWorked += halfTarget - actualHrs;
      }
    }
    casualLeaveUsed = true;
  }

  const payout = Math.round(hourlyRate * totalHoursWorked);
  const daysWorked = monthlyClockRecords.length;

  return {
    payout,
    totalHoursWorked: Math.round(totalHoursWorked * 100) / 100,
    daysWorked,
    hourlyRate: Math.round(hourlyRate * 100) / 100,
    fullLeaves: absentDays.length,
    halfDays: halfDayRecords.length,
    casualLeaveUsed
  };
};

// Clock In staff
exports.clockInStaff = async (req, res) => {
  try {
    console.log('=== Starting clock in ===');
    if (!req.params.id) {
      console.log('Missing staff ID');
      return res.status(400).json({ success: false, message: 'Staff ID is required' });
    }

    const now = new Date();
    const istNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const clockInTime = formatTime(istNow);
    console.log('Clock in time:', clockInTime);

    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      console.log('Staff not found');
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }

    console.log('Found staff:', staff._id, staff.name);
    console.log('Staff clock_status:', staff.clock_status);
    console.log('Staff clock:', staff.clock);

    // Check if today is Sunday
    if (now.getDay() === 0) {
      console.log('It\'s Sunday');
      return res.status(400).json({
        success: false,
        message: 'Cannot clock in/out on Sunday. Enjoy your day off!'
      });
    }

    // Check if today is a leave day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const hasLeave = staff.leaves?.some(l => {
      const leaveDate = new Date(l.date);
      leaveDate.setHours(0, 0, 0, 0);
      return leaveDate.getTime() === today.getTime();
    });

    const hasLeaveAttendance = staff.attendance?.some(a => {
      const attDate = new Date(a.date);
      attDate.setHours(0, 0, 0, 0);
      return attDate.getTime() === today.getTime() && a.status === 'On Leave';
    });

    if (hasLeave || hasLeaveAttendance) {
      console.log('It\'s a leave day');
      return res.status(400).json({
        success: false,
        message: 'Cannot clock in/out today. It is marked as leave day.'
      });
    }

    // Check if already clocked in today
    const todayClockIndex = staff.clock?.findIndex(c =>
      new Date(c.date) >= today && new Date(c.date) < tomorrow
    );
    console.log('Today clock index:', todayClockIndex);

    let updatedStaff;

    if (todayClockIndex !== -1 && todayClockIndex !== undefined) {
      // Clock record exists for today
      const todayClockRecord = staff.clock[todayClockIndex];
      const lastSession = todayClockRecord.sessions[todayClockRecord.sessions.length - 1];
      console.log('Last session:', lastSession);

      // Check if last session is already clocked in (no clockOut)
      if (lastSession && !lastSession.clockOut) {
        console.log('Already clocked in');
        return res.status(400).json({
          success: false,
          message: 'You already clocked in. Please clock out before clocking in again.'
        });
      }

      // Last session is completed, add new session
      updatedStaff = await Staff.findOneAndUpdate(
        { _id: req.params.id, "clock.date": { $gte: today, $lt: tomorrow } },
        {
          $push: {
            "clock.$.sessions": {
              clockIn: clockInTime,
              clockOut: null,
              duration: '-'
            }
          },
          $set: { status: 'Present', clock_status: 'clock_in' }
        },
        { new: true }
      );
    } else {
      // Create new clock record with first session
      console.log('Creating new clock record');
      updatedStaff = await Staff.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            clock: {
              date: now,
              sessions: [{
                clockIn: clockInTime,
                clockOut: null,
                duration: '-'
              }],
              totalHours: '-'
            }
          },
          $set: { status: 'Present', clock_status: 'clock_in' }
        },
        { new: true }
      );
    }

    // Fetch today's updated clock data to send back
    const updatedTodayClockIndex = updatedStaff.clock?.findIndex(c =>
      new Date(c.date) >= today && new Date(c.date) < tomorrow
    );
    const updatedTodayClock = updatedStaff.clock[updatedTodayClockIndex];
    console.log('Updated today clock:', updatedTodayClock);

    const staffObj = updatedStaff.toObject();
    // Emit Socket.IO event to notify staff of clock update
    try {
      const io = socketUtil.getIO();
      io.emit(`staff-clock-update-${staffObj._id}`, {
        ...staffObj,
        id: staffObj._id,
        todayClock: updatedTodayClock
      });
    } catch (err) {
      console.error('Error emitting socket event:', err);
    }
    res.status(200).json({
      success: true,
      message: 'Clocked in successfully',
      data: {
        ...staffObj,
        id: staffObj._id,
        todayClock: updatedTodayClock
      }
    });
  } catch (error) {
    console.error('=== Clock in error ===');
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Clock out staff
exports.clockOutStaff = async (req, res) => {
  try {
    console.log('=== Starting clock out ===');
    if (!req.params.id) {
      return res.status(400).json({ success: false, message: 'Staff ID is required' });
    }

    const now = new Date();
    const istNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

    let clockOutTime;
    if (req.role === 'admin' && req.body.clockOutTime) {
      let rawTime = req.body.clockOutTime.trim();
      // Check if it's in 24-hour format (e.g. "17:30")
      const time24Pattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (time24Pattern.test(rawTime)) {
        const [h, m] = rawTime.split(':').map(Number);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 || 12;
        const displayM = m < 10 ? `0${m}` : m;
        clockOutTime = `${displayH}:${displayM} ${ampm}`;
      } else {
        clockOutTime = rawTime;
      }
    } else {
      clockOutTime = formatTime(istNow);
    }
    console.log('Clock out time:', clockOutTime);

    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }

    // ✅ Check clock_status instead of date
    if (staff.clock_status !== 'clock_in') {
      return res.status(400).json({
        success: false,
        message: 'You must clock in first before clocking out.'
      });
    }

    // Check Sunday
    if (istNow.getDay() === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot clock in/out on Sunday. Enjoy your day off!'
      });
    }

    // ✅ Find the most recent clock record that has an open session (no clockOut)
    let targetClockIndex = -1;
    let targetSessionIndex = -1;

    for (let i = staff.clock.length - 1; i >= 0; i--) {
      const record = staff.clock[i];
      for (let j = record.sessions.length - 1; j >= 0; j--) {
        if (!record.sessions[j].clockOut) {
          targetClockIndex = i;
          targetSessionIndex = j;
          break;
        }
      }
      if (targetClockIndex !== -1) break;
    }

    if (targetClockIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'No open clock-in session found.'
      });
    }

    // Calculate duration and update session
    const openSession = staff.clock[targetClockIndex].sessions[targetSessionIndex];
    const sessionDuration = calculateDuration(openSession.clockIn, clockOutTime);

    staff.clock[targetClockIndex].sessions[targetSessionIndex].clockOut = clockOutTime;
    staff.clock[targetClockIndex].sessions[targetSessionIndex].duration = sessionDuration;
    staff.clock[targetClockIndex].totalHours = calculateTotalHours(staff.clock[targetClockIndex].sessions);

    staff.status = 'Clocked Out';
    staff.clock_status = 'clock_out';

    const updatedStaff = await staff.save();
    console.log('Saved staff successfully');

    const updatedTodayClock = updatedStaff.clock[targetClockIndex];

    // Update attendance record
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const totalHoursStr = updatedTodayClock?.totalHours || '-';
    const [hours] = totalHoursStr.split('h').map(Number);
    const attendanceStatus = hours < 4 ? 'Half-Day' : 'Present';

    const todayAttendanceIndex = staff.attendance?.findIndex(a =>
      new Date(a.date) >= today && new Date(a.date) < tomorrow
    );

    if (todayAttendanceIndex !== -1) {
      await Staff.findOneAndUpdate(
        { _id: req.params.id, "attendance.date": { $gte: today, $lt: tomorrow } },
        { $set: { "attendance.$.status": attendanceStatus } }
      );
    } else {
      await Staff.findByIdAndUpdate(req.params.id, {
        $push: { attendance: { date: now, status: attendanceStatus } }
      });
    }

    const staffObj = updatedStaff.toObject();

    try {
      const io = socketUtil.getIO();
      io.emit(`staff-clock-update-${staffObj._id}`, {
        ...staffObj,
        id: staffObj._id,
        todayClock: updatedTodayClock
      });
    } catch (err) {
      console.error('Error emitting socket event:', err);
    }

    res.status(200).json({
      success: true,
      message: 'Clocked out successfully',
      data: {
        ...staffObj,
        id: staffObj._id,
        todayClock: updatedTodayClock
      }
    });
  } catch (error) {
    console.error('=== Clock out error ===');
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};// Update today's work
exports.updateTodayWork = async (req, res) => {
  try {
    const { todayWork } = req.body;
    const now = new Date();

    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }

    // Split the input string into individual tasks (comma-separated)
    const taskNames = todayWork.split(',').map(t => t.trim()).filter(t => t.length > 0);

    // Check if today's work record exists
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayWorkIndex = staff.work?.findIndex(w =>
      new Date(w.date) >= today && new Date(w.date) < tomorrow
    );

    let tasks;
    if (todayWorkIndex !== -1 && staff.work[todayWorkIndex].tasks) {
      // Preserve completion status for existing tasks
      const existingTasks = staff.work[todayWorkIndex].tasks;
      tasks = taskNames.map(name => {
        const existingTask = existingTasks.find(t => t.name === name);
        return existingTask ? existingTask : { name, completed: false };
      });
    } else {
      tasks = taskNames.map(name => ({ name, completed: false }));
    }

    let updatedStaff;
    if (todayWorkIndex !== -1) {
      updatedStaff = await Staff.findOneAndUpdate(
        { _id: req.params.id, "work.date": { $gte: today, $lt: tomorrow } },
        {
          $set: { "work.$.tasks": tasks }
        },
        { new: true }
      );
    } else {
      updatedStaff = await Staff.findByIdAndUpdate(
        req.params.id,
        {
          $push: { work: { tasks, date: now } }
        },
        { new: true }
      );
    }

    // Emit socket event
    const staffObj = updatedStaff.toObject();
    const updatedTodayClock = staffObj.work?.find(w =>
      new Date(w.date) >= today && new Date(w.date) < tomorrow
    );
    try {
      const io = socketUtil.getIO();
      io.emit(`staff-clock-update-${staffObj._id}`, {
        ...staffObj,
        id: staffObj._id,
        todayClock: updatedTodayClock
      });
    } catch (err) {
      console.error('Error emitting socket event:', err);
    }

    res.status(200).json({
      success: true,
      message: 'Today\'s work updated successfully',
      data: updatedStaff
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Toggle task completion status
exports.toggleTaskComplete = async (req, res) => {
  try {
    const { taskIndex } = req.body;
    const staffId = req.params.id;

    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }

    // Check if today's work record exists
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayWorkIndex = staff.work?.findIndex(w =>
      new Date(w.date) >= today && new Date(w.date) < tomorrow
    );

    if (todayWorkIndex === -1) {
      return res.status(404).json({ success: false, message: 'No work record found for today' });
    }

    // Toggle the task's completed status
    staff.work[todayWorkIndex].tasks[taskIndex].completed = !staff.work[todayWorkIndex].tasks[taskIndex].completed;
    const updatedStaff = await staff.save();

    // Get todayClock
    const todayClock = updatedStaff.work?.find(w =>
      new Date(w.date) >= today && new Date(w.date) < tomorrow
    );

    // Emit socket event
    const staffObj = updatedStaff.toObject();
    try {
      const io = socketUtil.getIO();
      io.emit(`staff-clock-update-${staffObj._id}`, {
        ...staffObj,
        id: staffObj._id,
        todayClock: todayClock
      });
    } catch (err) {
      console.error('Error emitting socket event:', err);
    }

    res.status(200).json({
      success: true,
      message: 'Task status updated',
      data: updatedStaff
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Add extra task (admin-only)
exports.addExtraTask = async (req, res) => {
  try {
    const { taskName } = req.body;
    const staffId = req.params.id;

    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }

    const now = new Date();
    // Check if today's work record exists
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayWorkIndex = staff.work?.findIndex(w =>
      new Date(w.date) >= today && new Date(w.date) < tomorrow
    );

    let updatedStaff;
    if (todayWorkIndex !== -1) {
      staff.work[todayWorkIndex].tasks.push({
        name: taskName,
        completed: false,
        isExtra: true
      });
      updatedStaff = await staff.save();
    } else {
      updatedStaff = await Staff.findByIdAndUpdate(
        staffId,
        {
          $push: { work: { tasks: [{ name: taskName, completed: false, isExtra: true }], date: now } }
        },
        { new: true }
      );
    }

    // Emit socket event
    const staffObj = updatedStaff.toObject();
    const updatedTodayClock = staffObj.work?.find(w =>
      new Date(w.date) >= today && new Date(w.date) < tomorrow
    );
    try {
      const io = socketUtil.getIO();
      io.emit(`staff-clock-update-${staffObj._id}`, {
        ...staffObj,
        id: staffObj._id,
        todayClock: updatedTodayClock
      });
    } catch (err) {
      console.error('Error emitting socket event:', err);
    }

    res.status(200).json({
      success: true,
      message: 'Extra task added',
      data: updatedStaff
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Submit work report
exports.submitWorkReport = async (req, res) => {
  try {
    const staffId = req.params.id;

    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }

    // Get today's tasks
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayWork = staff.work?.find(w => {
      const workDate = new Date(w.date);
      return workDate >= today && workDate < tomorrow;
    });

    if (!todayWork || !todayWork.tasks || todayWork.tasks.length === 0) {
      return res.status(400).json({ success: false, message: 'No tasks found for today' });
    }

    // Calculate progress percentage
    const completedTasks = todayWork.tasks.filter(t => t.completed).length;
    const progressPercentage = todayWork.tasks.length > 0
      ? Math.round((completedTasks / todayWork.tasks.length) * 100)
      : 0;

    // Check if report already exists for today
    const existingReport = await AssignedWorkReport.findOne({
      staffId: staffId,
      date: { $gte: today, $lt: tomorrow }
    });

    let report;
    if (existingReport) {
      // Update existing report
      report = await AssignedWorkReport.findByIdAndUpdate(
        existingReport._id,
        {
          tasks: todayWork.tasks,
          progressPercentage: progressPercentage
        },
        { new: true }
      );
    } else {
      // Create new report
      report = new AssignedWorkReport({
        staffId: staffId,
        staffName: staff.name,
        date: today,
        tasks: todayWork.tasks,
        progressPercentage: progressPercentage
      });
      await report.save();
    }

    res.status(200).json({
      success: true,
      message: 'Work report submitted successfully',
      data: report
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get work reports
exports.getWorkReports = async (req, res) => {
  try {
    const { date, staffId } = req.query;

    let query = {};

    if (date) {
      const [year, month, day] = date.split('-').map(Number);
      const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
      const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    if (staffId) {
      query.staffId = staffId;
    }

    const reports = await AssignedWorkReport.find(query)
      .sort({ date: -1 })
      .populate('staffId', 'name department employeeId');

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Submit all reports
exports.submitAllReports = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const allStaff = await Staff.find({});
    const results = [];

    for (const staff of allStaff) {
      const todayWork = staff.work?.find(w => {
        const workDate = new Date(w.date);
        return workDate >= today && workDate < tomorrow;
      });

      if (todayWork && todayWork.tasks && todayWork.tasks.length > 0) {
        const completedTasks = todayWork.tasks.filter(t => t.completed).length;
        const progressPercentage = todayWork.tasks.length > 0
          ? Math.round((completedTasks / todayWork.tasks.length) * 100)
          : 0;

        // Check if report already exists
        const existingReport = await AssignedWorkReport.findOne({
          staffId: staff._id,
          date: { $gte: today, $lt: tomorrow }
        });

        if (existingReport) {
          // Update existing report
          await AssignedWorkReport.findByIdAndUpdate(
            existingReport._id,
            {
              tasks: todayWork.tasks,
              progressPercentage: progressPercentage
            }
          );
          results.push({ staffId: staff._id, staffName: staff.name, status: 'updated' });
        } else {
          // Create new report
          const report = new AssignedWorkReport({
            staffId: staff._id,
            staffName: staff.name,
            date: today,
            tasks: todayWork.tasks,
            progressPercentage: progressPercentage
          });
          await report.save();
          results.push({ staffId: staff._id, staffName: staff.name, status: 'created' });
        }
      }
    }

    res.status(200).json({
      success: true,
      message: `Successfully processed ${results.length} reports`,
      data: results
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update attendance manually (Admin feature)
exports.updateAttendance = async (req, res) => {
  try {
    const { status, date } = req.body; // status: 'Absent', 'Half-Day', 'On Leave', etc.
    const staffId = req.params.id;

    const recordDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(recordDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(recordDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Remove existing attendance for this day if any
    await Staff.findByIdAndUpdate(staffId, {
      $pull: { attendance: { date: { $gte: startOfDay, $lte: endOfDay } } }
    });

    // Add new attendance record
    const staff = await Staff.findByIdAndUpdate(
      staffId,
      {
        $push: { attendance: { date: recordDate, status } },
        status: status // Also update current status
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Attendance updated successfully',
      data: staff
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Clear salary status and save to history
exports.clearSalary = async (req, res) => {
  try {
    const {
      month,
      baseSalary,
      payoutSalary,
      totalLeaves,
      totalHalfDays,
      casualLeaveUsed
    } = req.body;

    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      {
        salaryStatus: 'Paid',
        $push: {
          salaryHistory: {
            month,
            baseSalary,
            payoutSalary,
            totalLeaves,
            totalHalfDays,
            casualLeaveUsed,
            paidAt: new Date()
          }
        }
      },
      { new: true }
    );

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Salary cleared and history saved successfully',
      data: staff
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Mark leave for staff (single or range)
exports.markLeave = async (req, res) => {
  try {
    const { staffIds, startDate, endDate, type = 'Casual' } = req.body;

    if (!staffIds || !Array.isArray(staffIds) || staffIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Staff IDs are required'
      });
    }

    if (!startDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date is required'
      });
    }

    let datesToMark = [];
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : start;

    // Generate all dates in range
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const currentDate = new Date(d);
      datesToMark.push(new Date(currentDate));
    }

    // Process each staff
    const results = [];

    for (const staffId of staffIds) {
      const staff = await Staff.findById(staffId);
      if (!staff) {
        continue;
      }

      for (const date of datesToMark) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // Check if leave already exists
        const existingLeave = staff.leaves.find(l => {
          const leaveDate = new Date(l.date);
          return leaveDate >= startOfDay && leaveDate <= endOfDay;
        });

        if (!existingLeave) {
          // Add leave
          await Staff.findByIdAndUpdate(staffId, {
            $push: { leaves: { date, type } },
            $inc: { totalCasualLeaves: type === 'Casual' ? 1 : 0 }
          });

          // Remove any existing attendance for this day
          await Staff.findByIdAndUpdate(staffId, {
            $pull: { attendance: { date: { $gte: startOfDay, $lte: endOfDay } } }
          });

          // Add attendance as On Leave
          await Staff.findByIdAndUpdate(staffId, {
            $push: { attendance: { date, status: 'On Leave' } },
            status: 'On Leave'
          });
        }
      }

      const updatedStaff = await Staff.findById(staffId);
      results.push(updatedStaff);
    }

    res.status(200).json({
      success: true,
      message: 'Leave marked successfully',
      data: results
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all staff leaves
exports.getStaffLeaves = async (req, res) => {
  try {
    const staff = await Staff.find({}, 'name employeeId leaves totalCasualLeaves');
    res.status(200).json({
      success: true,
      count: staff.length,
      data: staff
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Upload document for staff
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }

    // Get document name from request or use original filename
    const documentName = req.body.name || req.file.originalname;

    // Add document to staff
    staff.documents.push({
      name: documentName,
      path: `/uploads/${req.file.filename}`
    });

    const updatedStaff = await staff.save();
    res.status(200).json({ success: true, data: updatedStaff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete document from staff
exports.deleteDocument = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }

    // Remove document from staff's documents array
    staff.documents = staff.documents.filter(doc => doc._id.toString() !== req.params.docId);

    const updatedStaff = await staff.save();
    res.status(200).json({ success: true, data: updatedStaff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get staff members who report to the logged in user
exports.getMyReportees = async (req, res) => {
  try {
    const managerId = req.user.employeeId;
    if (!managerId) {
      return res.status(400).json({ success: false, message: 'Manager employee ID not found' });
    }

    const reportees = await Staff.find({ reportingPerson: managerId })
      .select('name employeeId department role jobType status clock work attendance');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const reporteesData = reportees.map(staff => {
      const todayWorkRecord = staff.work?.find(w =>
        new Date(w.date) >= today && new Date(w.date) < tomorrow
      );

      const todayClockRecord = staff.clock?.find(c =>
        new Date(c.date) >= today && new Date(c.date) < tomorrow
      );

      return {
        id: staff._id,
        name: staff.name,
        employeeId: staff.employeeId,
        department: staff.department,
        role: staff.role,
        jobType: staff.jobType,
        status: staff.status,
        todayTasks: todayWorkRecord ? todayWorkRecord.tasks : [],
        todayClock: todayClockRecord || null
      };
    });

    res.status(200).json({
      success: true,
      count: reporteesData.length,
      data: reporteesData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update profile picture for staff
exports.updateProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }

    // Set the profile picture path
    staff.profilePic = `/uploads/${req.file.filename}`;

    const updatedStaff = await staff.save();
    res.status(200).json({ success: true, data: updatedStaff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};