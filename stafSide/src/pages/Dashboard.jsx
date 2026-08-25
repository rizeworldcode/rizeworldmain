import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Briefcase,
  DollarSign,
  LogIn,
  LogOut,
  Clock,
  User,
  Users,
  Calendar,
  X,
  Camera,
  RefreshCw,
  CreditCard,
  GraduationCap,
  Minus,
  ListChecks,
  Sparkles,
  CheckCircle2,
  Trash2,
  MessageSquare
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';
import { cn } from '../utils';
import { io } from 'socket.io-client';

// Calculate payout salary based on actual hours worked from clock records
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

const CALCULATION_START_DATE = new Date(2026, 6, 1); // July 1, 2026

const get30DaySequenceDates = (year, monthIndex, createdAt = null) => {
  const dates = [];
  const prevMonthLastDay = new Date(year, monthIndex, 0);
  const prevMonthDays = prevMonthLastDay.getDate();
  
  if (prevMonthDays === 31) {
    const prevYear = prevMonthLastDay.getFullYear();
    const prevMonth = prevMonthLastDay.getMonth();
    dates.push(new Date(prevYear, prevMonth, 31));
    for (let d = 1; d <= 29; d++) {
      dates.push(new Date(year, monthIndex, d));
    }
  } else {
    const currentMonthLastDay = new Date(year, monthIndex + 1, 0).getDate();
    const endDay = Math.min(30, currentMonthLastDay);
    for (let d = 1; d <= endDay; d++) {
      dates.push(new Date(year, monthIndex, d));
    }
  }

  let filtered = dates.filter(d => {
    const copy = new Date(d);
    copy.setHours(0, 0, 0, 0);
    return copy >= CALCULATION_START_DATE;
  });

  if (createdAt) {
    const created = new Date(createdAt);
    created.setHours(0, 0, 0, 0);
    filtered = filtered.filter(d => {
      const copy = new Date(d);
      copy.setHours(0, 0, 0, 0);
      return copy >= created;
    });
  }

  return filtered;
};

const getSalaryForDate = (staffInfo, date) => {
  const defaultSalary = staffInfo?.monthlySalary || 0;
  const defaultJobType = staffInfo?.jobType || '';
  if (!staffInfo?.salaryRevisions || staffInfo.salaryRevisions.length === 0) {
    return { salary: defaultSalary, jobType: defaultJobType };
  }

  const d = new Date(date);
  d.setHours(23, 59, 59, 999);

  let activeSalary = defaultSalary;
  let activeJobType = defaultJobType;
  let found = false;

  for (let i = staffInfo.salaryRevisions.length - 1; i >= 0; i--) {
    const rev = staffInfo.salaryRevisions[i];
    const revDate = new Date(rev.effectiveDate);
    revDate.setHours(0, 0, 0, 0);

    if (revDate <= d) {
      activeSalary = rev.monthlySalary;
      activeJobType = rev.jobType || defaultJobType;
      found = true;
      break;
    }
  }

  if (!found && staffInfo.salaryRevisions.length > 0) {
    activeSalary = staffInfo.salaryRevisions[0].monthlySalary;
    activeJobType = staffInfo.salaryRevisions[0].jobType || defaultJobType;
  }

  return { salary: activeSalary, jobType: activeJobType };
};

const calculatePayout = (staffInfo) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const createdAt = staffInfo.createdAt || staffInfo.joiningDate;
  const sequenceDates = get30DaySequenceDates(currentYear, currentMonth, createdAt);
  
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const validSequenceDates = sequenceDates.filter(d => d <= todayEnd);
  const seqDateStrings = new Set(validSequenceDates.map(d => d.toDateString()));

  const monthlyClockRecords = (staffInfo.clock || []).filter(record => {
    return seqDateStrings.has(new Date(record.date).toDateString());
  });

  const dailyHoursMap = {};
  const creditedDates = new Set();

  monthlyClockRecords.forEach(record => {
    const dStr = new Date(record.date).toDateString();
    const actualHrs = parseTotalHours(record.totalHours);
    let hrs = 0;
    if (actualHrs > 9) {
      hrs = 8.5 + (actualHrs - 9);
    } else if (actualHrs >= 8.5) {
      hrs = 8.5;
    } else {
      hrs = actualHrs;
    }
    dailyHoursMap[dStr] = hrs;
    creditedDates.add(dStr);
  });

  validSequenceDates.forEach(d => {
    const dStr = d.toDateString();
    if (d.getDay() === 0 && !creditedDates.has(dStr)) {
      dailyHoursMap[dStr] = STANDARD_HOURS_PER_DAY;
      creditedDates.add(dStr);
    }
  });

  (staffInfo.leaves || []).forEach(leave => {
    const ld = new Date(leave.date);
    const ldStr = ld.toDateString();
    if (seqDateStrings.has(ldStr) && !creditedDates.has(ldStr)) {
      dailyHoursMap[ldStr] = STANDARD_HOURS_PER_DAY;
      creditedDates.add(ldStr);
    }
  });

  (staffInfo.attendance || []).forEach(att => {
    if (att.status === 'On Leave') {
      const ad = new Date(att.date);
      const adStr = ad.toDateString();
      if (seqDateStrings.has(adStr) && !creditedDates.has(adStr)) {
        dailyHoursMap[adStr] = STANDARD_HOURS_PER_DAY;
        creditedDates.add(adStr);
      }
    }
  });

  const absentDays = validSequenceDates.filter(d => {
    if (d.getDay() === 0) return false;
    return !creditedDates.has(d.toDateString());
  });

  const halfDayRecords = (staffInfo.attendance || []).filter(att => {
    if (att.status !== 'Half-Day') return false;
    const ad = new Date(att.date);
    return seqDateStrings.has(ad.toDateString());
  });
  const halfDayLeaveUnits = Math.floor(halfDayRecords.length / 2);

  let casualLeaveUsed = false;

  if (absentDays.length > 0) {
    const casualLeaveDate = absentDays[0];
    const dStr = casualLeaveDate.toDateString();
    dailyHoursMap[dStr] = STANDARD_HOURS_PER_DAY;
    creditedDates.add(dStr);
    casualLeaveUsed = true;
  } else if (halfDayLeaveUnits > 0) {
    for (let i = 0; i < 2; i++) {
      const hdDate = new Date(halfDayRecords[i].date);
      const dStr = hdDate.toDateString();
      const clockRecord = monthlyClockRecords.find(
        r => new Date(r.date).toDateString() === dStr
      );
      const actualHrs = clockRecord ? parseTotalHours(clockRecord.totalHours) : 0;
      const halfTarget = STANDARD_HOURS_PER_DAY / 2;
      if (actualHrs < halfTarget) {
        dailyHoursMap[dStr] = (dailyHoursMap[dStr] || actualHrs) + (halfTarget - actualHrs);
      }
    }
    casualLeaveUsed = true;
  }

  let totalPayout = 0;
  let totalHoursWorked = 0;

  validSequenceDates.forEach(d => {
    const dStr = d.toDateString();
    const hrs = dailyHoursMap[dStr] || 0;
    totalHoursWorked += hrs;
    const { salary: daySalary } = getSalaryForDate(staffInfo, d);
    const dayHourlyRate = daySalary / EXPECTED_MONTHLY_HOURS;
    totalPayout += hrs * dayHourlyRate;
  });

  const payout = Math.round(totalPayout);
  const daysWorked = monthlyClockRecords.length;
  const fullLeavesCount = Math.max(0, absentDays.length - (casualLeaveUsed && absentDays.length > 0 ? 1 : 0));
  const currentSalary = staffInfo.monthlySalary || 0;
  const hourlyRate = currentSalary / EXPECTED_MONTHLY_HOURS;

  return {
    payout,
    totalHoursWorked: Math.round(totalHoursWorked * 100) / 100,
    daysWorked,
    hourlyRate: Math.round(hourlyRate * 100) / 100,
    fullLeaves: fullLeavesCount,
    halfDays: halfDayRecords.length,
    casualLeaveUsed
  };
};

// Function to generate monthly salary chart data
const generateChartData = (staffInfo) => {
  const months = [];
  const today = new Date();
  
  // Parse joining date
  let joiningDate;
  if (staffInfo.joiningDate) {
    joiningDate = new Date(staffInfo.joiningDate);
  }
  
  // First use salaryHistory data
  const salaryHistory = staffInfo.salaryHistory || [];
  
  // Create a map of month-year to full record
  const salaryMap = new Map();
  salaryHistory.forEach(record => {
    salaryMap.set(record.month, record);
  });
  
  // Generate last 6 months data
  for (let i = 5; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(today.getMonth() - i);
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    const fullMonthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    let salary = 0;
    let baseSalary = staffInfo.monthlySalary || 0;
    let totalLeaves = 0;
    let totalHalfDays = 0;
    
    // Only calculate salary if month is on or after joining date
    if (!joiningDate || 
        (date.getFullYear() > joiningDate.getFullYear()) || 
        (date.getFullYear() === joiningDate.getFullYear() && date.getMonth() >= joiningDate.getMonth())) {
      
      salary = staffInfo.monthlySalary || 0;
      
      // If we have a salaryHistory record for this month, use it
      if (salaryMap.has(fullMonthName)) {
        const record = salaryMap.get(fullMonthName);
        salary = record.payoutSalary;
        baseSalary = record.baseSalary;
        totalLeaves = record.totalLeaves;
        totalHalfDays = record.totalHalfDays;
      } else if (i === 0) {
        // For current month, calculate the payout
        const { payout, fullLeaves, halfDays } = calculatePayout(staffInfo);
        salary = payout;
        totalLeaves = fullLeaves;
        totalHalfDays = halfDays;
      }
    }
    
    months.push({
      name: monthName,
      salary: salary,
      baseSalary: baseSalary,
      totalLeaves: totalLeaves,
      totalHalfDays: totalHalfDays
    });
  }
  return months;
};

const StatCard = ({ title, value, change, isPositive, icon: Icon, color, extra }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="clay-card p-4 sm:p-6 space-y-3 sm:space-y-4"
  >
    <div className="flex justify-between items-start">
      <div className={cn("p-3 sm:p-4 rounded-2xl clay-inset", color)}>
        <Icon size={20} className="text-white" />
      </div>
      {change !== 0 && (
        <div className={cn(
          "flex items-center gap-1 text-[10px] sm:text-xs font-black",
          isPositive ? "text-emerald-500" : "text-rose-500"
        )}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {change}%
        </div>
      )}
    </div>
    <div>
      <p className="text-[10px] sm:text-xs font-black text-black uppercase tracking-widest">{title}</p>
      <h3 className="text-2xl sm:text-3xl font-black text-black mt-1">{value}</h3>
      {extra && (
        <p className="text-[10px] sm:text-xs font-bold text-black mt-2">{extra}</p>
      )}
    </div>
  </motion.div>
);

const ActionCard = ({ title, time, icon: Icon, color, onClick, disabled, type }) => (
  <motion.button 
    whileHover={!disabled ? { y: -5, scale: 1.02 } : {}}
    whileTap={!disabled ? { scale: 0.98 } : {}}
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "clay-card p-4 sm:p-6 space-y-3 sm:space-y-4 text-left w-full relative overflow-hidden group transition-all",
      disabled ? "opacity-60 cursor-not-allowed grayscale" : "hover:shadow-2xl"
    )}
  >
    <div className="flex justify-between items-start">
      <div className={cn(
        "p-3 sm:p-4 rounded-2xl transition-all duration-500",
        disabled ? "bg-gray-200 clay-inset" : cn("clay-inset group-hover:clay-flat", color)
      )}>
        <Icon size={20} className={disabled ? "text-gray-400" : "text-white"} />
      </div>
      <div className={cn(
        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors",
        disabled 
          ? "bg-gray-100 text-gray-400 border-gray-200" 
          : type === 'in' 
            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
            : "bg-rose-500/10 text-rose-600 border-rose-500/20"
      )}>
        {disabled ? 'Completed' : 'Available'}
      </div>
    </div>
    <div>
      <p className="text-[10px] sm:text-xs font-black text-black uppercase tracking-widest">{title}</p>
      <h3 className={cn(
        "text-2xl sm:text-3xl font-black mt-1 tracking-tight",
        disabled ? "text-gray-500" : "text-black"
      )}>
        {time || "00:00 AM"}
      </h3>
    </div>
    
    {/* Decorative Glow */}
    {!disabled && (
      <div className={cn(
        "absolute -right-4 -bottom-4 w-24 h-24 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity rounded-full",
        color
      )} />
    )}
  </motion.button>
);

const Dashboard = () => {
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [todayTasks, setTodayTasks] = useState([]);
  const [newTaskInput, setNewTaskInput] = useState('');
  const [checklistText, setChecklistText] = useState('');
  const [isUpdatingChecklist, setIsUpdatingChecklist] = useState(false);
  const [masterPool, setMasterPool] = useState([]);
  const [masterPoolLoading, setMasterPoolLoading] = useState(false);
  const [newPoolItem, setNewPoolItem] = useState('');
  const [isLeaveDay, setIsLeaveDay] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState({
    canClockIn: true,
    canClockOut: false,
    sessions: [],
    totalHours: '-'
  });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  // Delay Work State
  const [delayWork, setDelayWork] = useState([]);
  const [clients, setClients] = useState([]);
  const [isAddDelayWorkOpen, setIsAddDelayWorkOpen] = useState(false);
  const [isClientTaskUpdateOpen, setIsClientTaskUpdateOpen] = useState(false);
  const [selectedClientForTasks, setSelectedClientForTasks] = useState(null);
  const [isUpdateProgressOpen, setIsUpdateProgressOpen] = useState(false);
  const [tempProjectData, setTempProjectData] = useState(null);
  const [taskMetrics, setTaskMetrics] = useState({});
  const [delayWorkForm, setDelayWorkForm] = useState({
    type: 'reel',
    publishedLink: '',
    totalAccountReach: '',
    totalAccountViews: '',
    clientEmail: '',
    extra: false,
    count: 1,
    extraName: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [delayWorkLoading, setDelayWorkLoading] = useState(false);
  const [memberComments, setMemberComments] = useState({});
  // Admissions State
  const [admissionsCount, setAdmissionsCount] = useState(0);
  const [admissionsLoading, setAdmissionsLoading] = useState(false);

  const getApiUrl = (endpoint) => {
    const base = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:45000/api'
      : 'https://rizeworldmain.onrender.com/api';
    return `${base}${endpoint}`;
  };

  // Get staff info from state & localStorage
  const [staffInfo, setStaffInfo] = useState(JSON.parse(localStorage.getItem('staffInfo') || '{}'));
  const [reportees, setReportees] = useState([]);
  const [loadingReportees, setLoadingReportees] = useState(false);
  const [fullImageModal, setFullImageModal] = useState({ isOpen: false, src: '', title: '' });

  const getProfilePicUrl = (pic) => {
    if (!pic) return null;
    if (pic.startsWith('http://') || pic.startsWith('https://')) return pic;
    return `http://localhost:45000${pic.startsWith('/') ? '' : '/'}${pic}`;
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('profilePic', file);
    const staffId = staffInfo.id || staffInfo._id;
    if (!staffId) {
      alert('Staff ID not found');
      return;
    }
    try {
      const res = await fetch(getApiUrl(`/staff/${staffId}/profile-pic`), {
        method: 'POST',
        body: formData
      });
      const result = await res.json();
      if (result.success) {
        const updatedStaff = result.data;
        setStaffInfo(updatedStaff);
        localStorage.setItem('staffInfo', JSON.stringify(updatedStaff));
        alert('Profile picture updated successfully!');
      } else {
        alert('Failed to upload profile picture: ' + (result.message || 'Error'));
      }
    } catch (err) {
      console.error('Error uploading profile picture:', err);
      alert('Error uploading profile picture');
    }
  };
  const baseSalary = staffInfo.monthlySalary || 0;
  const { payout, totalHoursWorked, daysWorked, hourlyRate, fullLeaves, halfDays } = calculatePayout(staffInfo);
  const chartData = generateChartData(staffInfo);

  // Check if today is a leave day or Sunday
  const checkLeaveDay = (info = staffInfo) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if Sunday
    if (today.getDay() === 0) {
      return true;
    }
    
    // Check leaves array
    if (info.leaves && Array.isArray(info.leaves)) {
      const hasLeave = info.leaves.some(leave => {
        const leaveDate = new Date(leave.date);
        leaveDate.setHours(0, 0, 0, 0);
        return leaveDate.getTime() === today.getTime();
      });
      if (hasLeave) return true;
    }
    
    // Check attendance array for "On Leave"
    if (info.attendance && Array.isArray(info.attendance)) {
      const hasLeaveAttendance = info.attendance.some(att => {
        const attDate = new Date(att.date);
        attDate.setHours(0, 0, 0, 0);
        return attDate.getTime() === today.getTime() && att.status === 'On Leave';
      });
      return hasLeaveAttendance;
    }
    
    return false;
  };

  // Sync staff info across multiple local react states
  const syncStaffDataStates = (updatedStaff) => {
    if (!updatedStaff) return;
    setStaffInfo(updatedStaff);

    const leaveDay = checkLeaveDay(updatedStaff);
    setIsLeaveDay(leaveDay);

    if (!leaveDay) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayClock = updatedStaff.todayClock || (updatedStaff.clock && updatedStaff.clock.find(c => {
        const d = new Date(c.date);
        return d >= today && d < tomorrow;
      }));

      const sessions = todayClock?.sessions || [];
      const lastSession = sessions.length > 0 ? sessions[sessions.length - 1] : null;
      const hasOpenSession = lastSession && lastSession.clockIn && !lastSession.clockOut;

      const canClockOut = updatedStaff.clock_status === 'clock_in' || hasOpenSession;
      const canClockIn = !canClockOut;

      setAttendanceStatus({
        canClockIn: canClockIn,
        canClockOut: canClockOut,
        sessions: sessions,
        totalHours: todayClock?.totalHours || '-'
      });
    }
      
      if (updatedStaff.work) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const todayWorkRec = updatedStaff.work.find(w => 
          new Date(w.date) >= today && new Date(w.date) < tomorrow
        );
        if (todayWorkRec && todayWorkRec.tasks) {
          setTodayTasks(todayWorkRec.tasks);
        } else {
          setTodayTasks([]);
        }
      } else {
        setTodayTasks([]);
      }
  };

  const fetchReportees = async () => {
    const token = localStorage.getItem('staffToken');
    if (!token) return;
    setLoadingReportees(true);
    try {
      const response = await fetch(getApiUrl('/staff/my-reportees'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.success) {
        setReportees(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch reportees:', err);
    } finally {
      setLoadingReportees(false);
    }
  };

  const fetchStaffInfo = async () => {
    const staffInfoLocal = JSON.parse(localStorage.getItem('staffInfo') || '{}');
    const staffId = staffInfoLocal.id || staffInfoLocal._id || staffInfo?.id || staffInfo?._id;
    if (!staffId) return;
    try {
      const response = await fetch(getApiUrl(`/staff/${staffId}`));
      const result = await response.json();
      if (result.success) {
        localStorage.setItem('staffInfo', JSON.stringify(result.data));
        syncStaffDataStates(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch staff info:', err);
    }
  };

  const fetchAdmissionsCount = async () => {
    const staffId = staffInfo.id || staffInfo._id;
    if (!staffId) return;
    setAdmissionsLoading(true);
    try {
      const response = await fetch(getApiUrl(`/staff/admissions?counselorId=${staffId}`));
      const result = await response.json();
      if (result.success) {
        setAdmissionsCount(result.data.length);
      }
    } catch (error) {
      console.error('Failed to fetch admissions count:', error);
    } finally {
      setAdmissionsLoading(false);
    }
  };

  const fetchMasterPoolItems = async () => {
    const staffId = staffInfo.id || staffInfo._id;
    const staffToken = localStorage.getItem('staffToken');
    if (!staffId || !staffToken) return;

    setMasterPoolLoading(true);
    try {
      const response = await fetch(getApiUrl(`/masterpool/${staffId}`), {
        headers: {
          'Authorization': `Bearer ${staffToken}`
        }
      });
      const result = await response.json();
      if (result.success) {
        setMasterPool(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch master pool items:', err);
    } finally {
      setMasterPoolLoading(false);
    }
  };

  const addMasterPoolItem = async (itemName) => {
    const staffId = staffInfo.id || staffInfo._id;
    const staffToken = localStorage.getItem('staffToken');
    const staffRole = staffInfo.role;
    if (!staffId || !staffToken || !staffRole) return;

    try {
      const response = await fetch(getApiUrl('/masterpool'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${staffToken}`
        },
        body: JSON.stringify({ name: itemName, staffId, staffRole })
      });
      const result = await response.json();
      if (result.success) {
        setMasterPool(prev => [...prev, result.data]);
        setNewPoolItem('');
      } else {
        alert(result.message || 'Failed to add item to master pool');
      }
    } catch (err) {
      console.error('Failed to add master pool item:', err);
      alert('Network error: Could not add item to master pool.');
    }
  };

  const deleteMasterPoolItem = async (itemId) => {
    const staffId = staffInfo.id || staffInfo._id;
    const staffToken = localStorage.getItem('staffToken');
    if (!staffId || !staffToken) return;

    try {
      const response = await fetch(getApiUrl(`/masterpool/${itemId}`), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${staffToken}`
        },
        body: JSON.stringify({ staffId }) // Send staffId for authorization check on backend
      });
      const result = await response.json();
      if (result.success) {
        setMasterPool(prev => prev.filter(item => item._id !== itemId));
      } else {
        alert(result.message || 'Failed to delete item from master pool');
      }
    } catch (err) {
      console.error('Failed to delete master pool item:', err);
      alert('Network error: Could not delete item from master pool.');
    }
  };

  const [gpsError, setGpsError] = useState(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [capturedBlob, setCapturedBlob] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');
  const [isCardScanner, setIsCardScanner] = useState(false);
  const [isUploadingCard, setIsUploadingCard] = useState(false);
  const [isExtractingCardText, setIsExtractingCardText] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [cardForm, setCardForm] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    rawText: ''
  });
  const videoRef = useRef(null);

  useEffect(() => {
    if (isCameraActive && !cameraStream && !capturedPhoto) {
      const enableStream = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { 
              facingMode: facingMode,
              width: { ideal: 1280 },
              height: { ideal: 720 }
            }
          });
          setCameraStream(stream);
        } catch (err) {
          console.error('Error accessing camera:', err);
          setCameraError('Could not access camera. Please ensure camera permissions are granted.');
        }
      };
      enableStream();
    }
  }, [isCameraActive, cameraStream, capturedPhoto, facingMode]);

  useEffect(() => {
    if (cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream, isCameraActive, capturedPhoto]);

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
    setCapturedPhoto(null);
    setCapturedBlob(null);
    setCameraError(null);
    setFacingMode('environment'); // Reset to default environment on close
    setIsCardScanner(false);
    setIsExtractingCardText(false);
    setOcrResult(null);
    setCardForm({
      name: '',
      phone: '',
      email: '',
      company: '',
      rawText: ''
    });
  };

  const toggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const runOCR = async (dataUrl) => {
    setIsExtractingCardText(true);
    setCardForm({
      name: 'Extracting...',
      phone: 'Extracting...',
      email: 'Extracting...',
      company: 'Extracting...',
      rawText: 'Running OCR on captured card photo...'
    });

    try {
      const apiKey = import.meta.env.VITE_OCR_SPACE_API_KEY;
      if (!apiKey) {
        throw new Error('VITE_OCR_SPACE_API_KEY is not configured in client environment variables.');
      }
      const blob = dataURItoBlob(dataUrl);
      const formData = new FormData();
      formData.append('file', blob, `visiting_card_ocr_${Date.now()}.jpg`);
      formData.append('apikey', apiKey);
      formData.append('language', 'eng');
      formData.append('detectOrientation', 'true');
      formData.append('scale', 'true');
      formData.append('OCREngine', '2');
      formData.append('isOverlayRequired', 'false');

      const response = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const result = await response.json();
      
      if (result.IsErroredOnProcessing) {
        const errorMsg = result.ErrorMessage ? result.ErrorMessage.join(', ') : 'Unknown OCR.Space error';
        throw new Error(errorMsg);
      }

      const parsedResults = result.ParsedResults;
      if (!parsedResults || parsedResults.length === 0) {
        throw new Error('No parsed text found in the document');
      }

      const rawText = parsedResults[0].ParsedText || '';

      // Parse fields directly on the client using regex
      const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
      let email = '';
      let phone = '';
      let name = '';
      let address = '';

      // 1. Email Extraction
      const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
      const emailMatch = rawText.match(emailPattern);
      if (emailMatch) {
        email = emailMatch[0];
      }

      // 2. Phone Extraction
      const phonePattern = /(?:\+?\d{1,4}[-.\s]?)?\(?\d{3,5}\)?[-.\s]?\d{3,5}[-.\s]?\d{4,6}/;
      const phoneMatch = rawText.match(phonePattern);
      if (phoneMatch) {
        const cleanDigits = phoneMatch[0].replace(/[^\d]/g, '');
        if (cleanDigits.length >= 8) {
          phone = phoneMatch[0].trim();
        }
      }

      // 3. Name Extraction
      const nameMatch = rawText.match(/(?:student\s+)?name[:\-\s]+([a-zA-Z\s.]+)/i);
      if (nameMatch) {
        name = nameMatch[1].trim();
      } else {
        const nameLine = lines.find(l => /^name[:\-\s]+/i.test(l));
        if (nameLine) {
          name = nameLine.replace(/^name[:\-\s]+/i, '').trim();
        } else if (lines.length > 0) {
          const firstLine = lines[0];
          if (firstLine && firstLine.split(' ').length <= 4 && !/\d/.test(firstLine)) {
            name = firstLine;
          }
        }
      }

      // 4. Address Reconstruction
      const addressLines = lines.filter(line => {
        const lower = line.toLowerCase();
        if (line.includes('@')) return false;
        if (phoneMatch && line.includes(phoneMatch[0])) return false;
        if (lower.includes('name:') || lower.includes('roll:') || lower.includes('dob:')) return false;
        return true;
      });
      address = addressLines.slice(0, 4).join(', ');

      setOcrResult({
        name: name || null,
        email: email || null,
        phone: phone || null,
        address: address || null,
        confidence: rawText ? 100 : 0,
        method: 'client-ocr-space'
      });

      setCardForm({
        name: name,
        phone: phone,
        email: email,
        company: '',
        rawText: address || rawText
      });

    } catch (err) {
      console.error('OCR scan failed:', err);
      setOcrResult({
        name: null,
        email: null,
        phone: null,
        address: null,
        confidence: 0,
        method: 'failed'
      });
      setCardForm({
        name: '',
        phone: '',
        email: '',
        company: '',
        rawText: `Scan failed: ${err.message || 'Ensure your Internet connection is stable and API Key is active.'}`
      });
    } finally {
      setIsExtractingCardText(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedPhoto(dataUrl);
      
      canvas.toBlob((blob) => {
        setCapturedBlob(blob);
      }, 'image/jpeg', 0.9);
      
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }

      if (isCardScanner) {
        runOCR(dataUrl);
      }
    }
  };

  const retakePhoto = async () => {
    setCapturedPhoto(null);
    setCapturedBlob(null);
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      setCameraStream(stream);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setCameraError('Could not access camera. Please ensure camera permissions are granted.');
    }
  };

  const handleUploadCapturedPhoto = async () => {
    if (!capturedBlob) {
      alert('No photo captured yet!');
      return;
    }

    if (!('geolocation' in navigator)) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsUploadingPhoto(true);

    const getPositionPromise = (options) => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });
    };

    let position = null;
    let errorDetail = null;

    try {
      // Attempt 1: High accuracy, short timeout
      console.log('Attempting high-accuracy geolocation...');
      position = await getPositionPromise({
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    } catch (err) {
      console.warn('High-accuracy geolocation failed/timed out. Retrying with standard options...', err);
      errorDetail = err;

      // Only attempt fallback if permission wasn't denied
      if (err.code !== err.PERMISSION_DENIED) {
        try {
          // Attempt 2: Low accuracy, accept cached location up to 1 min, longer timeout
          position = await getPositionPromise({
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 60000
          });
        } catch (fallbackErr) {
          console.error('All geolocation attempts failed:', fallbackErr);
          errorDetail = fallbackErr;
        }
      }
    }

    if (!position) {
      setIsUploadingPhoto(false);
      let errorMessage = 'Failed to get location.';
      if (errorDetail) {
        if (errorDetail.code === errorDetail.PERMISSION_DENIED) {
          errorMessage = 'Location permission was denied. Please allow location access in your browser settings and try again.';
        } else if (errorDetail.code === errorDetail.POSITION_UNAVAILABLE) {
          errorMessage = 'Location provider is unavailable. Please ensure your device\'s Location Services/GPS are enabled.';
        } else if (errorDetail.code === errorDetail.TIMEOUT) {
          errorMessage = 'Location request timed out. Please check your network or GPS signal and try again.';
        } else {
          errorMessage = `Geolocation error: ${errorDetail.message}`;
        }
      }
      alert(errorMessage);
      return;
    }

    const { latitude, longitude, accuracy } = position.coords;
    const staffInfoLocal = JSON.parse(localStorage.getItem('staffInfo') || '{}');
    const staffId = staffInfoLocal.id || staffInfoLocal._id;
    const staffToken = localStorage.getItem('staffToken');

    if (!staffId || !staffToken) {
      alert('Staff ID or token not found. Please log in again.');
      setIsUploadingPhoto(false);
      return;
    }

    const formData = new FormData();
    const file = new File([capturedBlob], `location_photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
    formData.append('photo', file);
    formData.append('employeeId', staffId);
    formData.append('employeeName', staffInfoLocal.name);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('accuracy', accuracy);
    formData.append('timestamp', new Date().toISOString());

    try {
      const response = await fetch(getApiUrl('/location/photo'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${staffToken}`
        },
        body: formData
      });
      const result = await response.json();
      if (result.success) {
        alert('Photo uploaded successfully with coordinates!');
        stopCamera();
      } else {
        alert(result.message || 'Failed to upload photo');
      }
    } catch (err) {
      console.error(err);
      alert('Network error: Could not upload photo.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleUploadVisitingCard = async () => {
    if (!capturedBlob) {
      alert('No card photo captured yet!');
      return;
    }

    if (!('geolocation' in navigator)) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsUploadingCard(true);

    const getPositionPromise = (options) => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });
    };

    let position = null;
    let errorDetail = null;

    try {
      position = await getPositionPromise({
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    } catch (err) {
      console.warn('High-accuracy GPS failed. Trying standard triangulation...', err);
      errorDetail = err;
      if (err.code !== err.PERMISSION_DENIED) {
        try {
          position = await getPositionPromise({
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 60000
          });
        } catch (fallbackErr) {
          errorDetail = fallbackErr;
        }
      }
    }

    if (!position) {
      setIsUploadingCard(false);
      let errorMessage = 'Failed to get location coordinates.';
      if (errorDetail) {
        if (errorDetail.code === errorDetail.PERMISSION_DENIED) {
          errorMessage = 'Location permission was denied. Please allow location access in your browser settings and try again.';
        } else if (errorDetail.code === errorDetail.POSITION_UNAVAILABLE) {
          errorMessage = 'Location provider is unavailable. Please ensure your device\'s Location Services/GPS are enabled.';
        } else if (errorDetail.code === errorDetail.TIMEOUT) {
          errorMessage = 'Location request timed out. Please check your network or GPS signal and try again.';
        } else {
          errorMessage = `Geolocation error: ${errorDetail.message}`;
        }
      }
      alert(errorMessage);
      return;
    }

    const { latitude, longitude, accuracy } = position.coords;
    const staffInfoLocal = JSON.parse(localStorage.getItem('staffInfo') || '{}');
    const staffId = staffInfoLocal.id || staffInfoLocal._id;
    const staffToken = localStorage.getItem('staffToken');

    if (!staffId || !staffToken) {
      alert('Staff ID or token not found. Please log in again.');
      setIsUploadingCard(false);
      return;
    }

    const formData = new FormData();
    const file = new File([capturedBlob], `visiting_card_${Date.now()}.jpg`, { type: 'image/jpeg' });
    formData.append('photo', file);
    formData.append('employeeId', staffId);
    formData.append('employeeName', staffInfoLocal.name);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('accuracy', accuracy);
    formData.append('timestamp', new Date().toISOString());
    formData.append('cardName', cardForm.name || '');
    formData.append('cardPhone', cardForm.phone || '');
    formData.append('cardEmail', cardForm.email || '');
    formData.append('cardCompany', cardForm.company || '');
    formData.append('cardRawText', cardForm.rawText || '');

    try {
      const response = await fetch(getApiUrl('/visiting-card/upload'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${staffToken}`
        },
        body: formData
      });
      const result = await response.json();
      if (result.success) {
        alert('Visiting card and coordinates submitted successfully!');
        stopCamera();
      } else {
        alert(result.message || 'Failed to submit visiting card');
      }
    } catch (err) {
      console.error(err);
      alert('Network error: Could not submit visiting card.');
    } finally {
      setIsUploadingCard(false);
    }
  };

  useEffect(() => {
    // Only track if user is Sales Team
    const isSales = staffInfo.role?.toLowerCase() === 'sales team' || staffInfo.role?.toLowerCase() === 'sales';
    if (!isSales) return;




    let watchId = null;
    let lastSentTime = 0;
    let lastSentCoords = null;

    const getDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371e3; // metres
      const φ1 = lat1 * Math.PI/180;
      const φ2 = lat2 * Math.PI/180;
      const Δφ = (lat2-lat1) * Math.PI/180;
      const Δλ = (lon2-lon1) * Math.PI/180;
      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

    const sendLocationUpdate = async (coords) => {
      const staffToken = localStorage.getItem('staffToken');
      if (!staffToken) return;

      try {
        const response = await fetch(getApiUrl('/location/update'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${staffToken}`
          },
          body: JSON.stringify({
            employeeId: staffInfo.id || staffInfo._id,
            employeeName: staffInfo.name,
            latitude: coords.latitude,
            longitude: coords.longitude,
            accuracy: coords.accuracy,
            speed: coords.speed,
            heading: coords.heading,
            deviceInfo: navigator.userAgent,
            timestamp: new Date().toISOString()
          })
        });
        const result = await response.json();
        if (result.success) {
          lastSentCoords = { latitude: coords.latitude, longitude: coords.longitude };
          lastSentTime = Date.now();
        }
      } catch (err) {
        console.error('Failed to send location update:', err);
      }
    };

    const handleSuccess = (position) => {
      setGpsError(null);
      const coords = position.coords;
      const now = Date.now();
      
      // Initial send
      if (!lastSentCoords) {
        sendLocationUpdate(coords);
        return;
      }

      // Check distance and time thresholds
      const distanceMoved = getDistance(
        lastSentCoords.latitude,
        lastSentCoords.longitude,
        coords.latitude,
        coords.longitude
      );
      const timeElapsed = now - lastSentTime;

      // Update backend only every 10-15 seconds OR when moved 20-30 meters
      if (timeElapsed >= 10000 || distanceMoved >= 20) {
        sendLocationUpdate(coords);
      }
    };

    const handleError = (error) => {
      console.warn('Geolocation error:', error);
      if (error.code === error.PERMISSION_DENIED) {
        setGpsError('permission_denied');
      } else {
        setGpsError('unavailable');
      }
    };

    if ('geolocation' in navigator) {
      // Start tracking
      watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });
    } else {
      setGpsError('unavailable');
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [staffInfo]);

  // Fetch notifications
  const fetchNotifications = async () => {
    const staffInfo = JSON.parse(localStorage.getItem('staffInfo') || '{}');
    const staffId = staffInfo.id || staffInfo._id;
    
    if (!staffId) return;
    
    try {
      const response = await fetch(getApiUrl(`/notifications/staff/${staffId}`));
      const result = await response.json();
      if (result.success) {
        setNotifications(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    const staffInfo = JSON.parse(localStorage.getItem('staffInfo') || '{}');
    const staffId = staffInfo.id || staffInfo._id;
    
    try {
      await fetch(getApiUrl(`/notifications/${notificationId}/read/${staffId}`), {
        method: 'PATCH'
      });
      // Update local state to mark as read
      setNotifications(prev => prev.map(n => 
        n._id === notificationId ? { ...n, isRead: true } : n
      ));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const socketRef = useRef(null);

  useEffect(() => {
    // Sync initial state from localStorage immediately
    const staffInfoLocal = JSON.parse(localStorage.getItem('staffInfo') || '{}');
    syncStaffDataStates(staffInfoLocal);

    // Fetch latest staff data from backend on mount/reload
    fetchStaffInfo();
    fetchReportees();
    
    // Fetch admissions count if user is Counselor
    if (staffInfoLocal.role?.toLowerCase() === 'counselor') {
      fetchAdmissionsCount();
    }

    // Fetch master pool items if user is Technical TL or Digital Marketing Specialist
    const allowedRolesForMasterPool = ['technical tl', 'digital marketing specialist', 'technical tl & digital marketing specialist'];
    if (allowedRolesForMasterPool.includes(staffInfoLocal.role?.toLowerCase())) {
      fetchMasterPoolItems();
    }

    // Initialize Socket.IO connection
    const socketBase = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:45000'
      : 'https://rizeworldmain.onrender.com';
    socketRef.current = io(socketBase);
    
    // Listen for new notifications
    socketRef.current.on('newNotification', (newNotification) => {
      // Add the new notification to the state at the beginning
      setNotifications(prev => [newNotification, ...prev]);
      // Automatically show the popup
      setShowNotifications(true);
    });

    // Listen for staff clock updates from admin
    const staffId = staffInfoLocal.id || staffInfoLocal._id;
    if (staffId) {
      socketRef.current.on(`staff-clock-update-${staffId}`, (updatedStaff) => {
        // Update localStorage
        localStorage.setItem('staffInfo', JSON.stringify(updatedStaff));
        syncStaffDataStates(updatedStaff);
      });
    }
    
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 60000);

    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Fetch notifications
    fetchNotifications();
    // Only fetch Clients if user is a Data Analyst
    const staffInfo = JSON.parse(localStorage.getItem('staffInfo') || '{}');
    if (staffInfo.role?.toLowerCase() === 'data analyst') {
      fetchClients();
    }
    // Refresh notifications every 5 minutes
    const notificationTimer = setInterval(fetchNotifications, 300000);

    return () => {
      clearInterval(timer);
      clearInterval(notificationTimer);
      // Disconnect socket on unmount
      if (socketRef.current) {
        if (staffId) {
          socketRef.current.off(`staff-clock-update-${staffId}`);
        }
        socketRef.current.disconnect();
      }
    };
  }, []);

  const handleClockIn = async () => {
    const staffInfo = JSON.parse(localStorage.getItem('staffInfo') || '{}');
    const staffId = staffInfo.id || staffInfo._id;
    
    if (!staffId) {
      alert('Staff ID not found. Please log in again.');
      return;
    }
    
    try {
      const response = await fetch(getApiUrl(`/staff/${staffId}/clock-in`), { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      
      if (result.success) {
        // Update localStorage with full staff data
        localStorage.setItem('staffInfo', JSON.stringify(result.data));
        syncStaffDataStates(result.data);
        fetchStaffInfo();

        const todayClock = result.data.todayClock || (result.data.clock && result.data.clock[result.data.clock.length - 1]);
        const sessions = todayClock?.sessions || [];
        const lastSession = sessions.length > 0 ? sessions[sessions.length - 1] : null;

        alert(`Clocked in successfully at ${lastSession?.clockIn || ''}`);
      } else {
        alert(result.message || 'Failed to clock in');
      }
    } catch (err) {
      console.error(err);
      alert('Network error: Could not connect to server.');
    }
  };

  const handleClockOut = async () => {
    const staffInfoLocal = JSON.parse(localStorage.getItem('staffInfo') || '{}');
    const staffId = staffInfoLocal.id || staffInfoLocal._id || staffInfo?.id || staffInfo?._id;
    
    if (!staffId) {
      alert('Staff ID not found. Please log in again.');
      return;
    }
    
    try {
      const response = await fetch(getApiUrl(`/staff/${staffId}/clock-out`), { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      
      if (result.success) {
        // Update localStorage with full staff data
        localStorage.setItem('staffInfo', JSON.stringify(result.data));
        syncStaffDataStates(result.data);
        fetchStaffInfo();

        const todayClock = result.data.todayClock || (result.data.clock && result.data.clock[result.data.clock.length - 1]);
        const sessions = todayClock?.sessions || [];
        const lastSession = sessions.length > 0 ? sessions[sessions.length - 1] : null;
        const clockOutTime = lastSession?.clockOut || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        alert(`Clocked out successfully at ${clockOutTime}`);
      } else {
        alert(result.message || 'Failed to clock out');
      }
    } catch (err) {
      console.error(err);
      alert('Network error: Could not connect to server.');
    }
  };

  // Delay Work Functions
  const fetchDelayWork = async () => {
    const staffInfo = JSON.parse(localStorage.getItem('staffInfo') || '{}');
    const staffId = staffInfo.id || staffInfo._id;
    
    if (!staffId) return;
    
    try {
      setDelayWorkLoading(true);
      const response = await fetch(getApiUrl(`/delay-work/staff/${staffId}`));
      const result = await response.json();
      if (result.success) {
        setDelayWork(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch delay work:', err);
    } finally {
      setDelayWorkLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch(getApiUrl('/clients'));
      const result = await response.json();
      if (result.success) {
        setClients(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch clients:', err);
    }
  };

  const handleTempTaskUpdate = (taskIndex, change, isExtra = false) => {
    const taskType = isExtra ? 'extraTasks' : 'tasks';
    const newTasks = [...(tempProjectData[taskType] || [])];
    const task = { ...newTasks[taskIndex] };
    const newCount = (task.completed || 0) + change;
    if (newCount < 0 || newCount > task.total) return;
    task.completed = newCount;
    if (task.completed === task.total) task.status = 'Completed';
    else if (task.completed > 0) task.status = 'In Progress';
    else task.status = 'Pending';
    newTasks[taskIndex] = task;
    setTempProjectData({ ...tempProjectData, [taskType]: newTasks });
  };

  const handleMetricChange = (index, key, value) => {
    setTaskMetrics(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        [key]: value
      }
    }));
  };

  const handleProgressSubmit = async () => {
    try {
      const id = tempProjectData.id;
      const staffInfo = JSON.parse(localStorage.getItem('staffInfo') || '{}');
      const staffId = staffInfo.id || staffInfo._id;

      // Construct metrics payload for SMM/Shoot tasks that were incremented
      const metricsPayload = [];
      // Handle single global reach & views if provided
      const globalMetrics = taskMetrics['global'] || {};
      if (globalMetrics.reach || globalMetrics.views) {
        metricsPayload.push({
          type: 'reel',
          publishedLink: '',
          totalAccountReach: globalMetrics.reach ? globalMetrics.reach.toString().trim() : '0',
          totalAccountViews: globalMetrics.views ? globalMetrics.views.toString().trim() : '0',
          count: 1
        });
      }

      Object.keys(taskMetrics).forEach(indexStr => {
        if (indexStr === 'global') return;
        const index = parseInt(indexStr);
        const task = tempProjectData.tasks[index];
        const originalTask = selectedClientForTasks?.tasks?.[index];
        const diff = (task.completed || 0) - (originalTask?.completed || 0);

        const metrics = taskMetrics[index];
        const isReel = task.name.toLowerCase().includes('reel');
        const isPost = task.name.toLowerCase().includes('post');
        const isShoot = task.name.toLowerCase().includes('shoot');

        if ((isReel || isPost) && metrics?.publishedLink) {
          metricsPayload.push({
            type: isReel ? 'reel' : 'post',
            publishedLink: metrics.publishedLink,
            totalAccountReach: '0',
            totalAccountViews: '0',
            count: diff > 0 ? diff : 1
          });
        } else if (isShoot && diff > 0) {
          metricsPayload.push({
            type: 'shoot',
            count: diff
          });
        }
      });

      const response = await fetch(getApiUrl(`/clients/${id}/tasks`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks: tempProjectData.tasks,
          extraTasks: tempProjectData.extraTasks,
          metrics: metricsPayload,
          staffId: staffId
        })
      });
      const result = await response.json();
      if (result.success) {
        setClients(prevClients => prevClients.map(c =>
          (c._id || c.id) === id ? result.data : c
        ));
        setIsUpdateProgressOpen(false);
        setTempProjectData(null);
        setTaskMetrics({});
        alert('Task progress updated successfully!');
      } else {
        alert(result.message || 'Failed to update task progress');
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      alert('Failed to update task progress');
    }
  };



  const handleAddDelayWork = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const staffInfo = JSON.parse(localStorage.getItem('staffInfo') || '{}');
    
    if (staffInfo.role?.toLowerCase() !== 'data analyst') {
      alert('Only Data Analysts can add daily work');
      return;
    }
    
    const staffId = staffInfo.id || staffInfo._id;
    if (!staffId) {
      alert('Staff ID not found. Please log in again.');
      return;
    }
    
    if (!delayWorkForm.clientEmail) {
      alert('Please select client email');
      return;
    }
    
    const payload = {
      staffId,
      type: delayWorkForm.type,
      clientEmail: delayWorkForm.clientEmail,
      extra: delayWorkForm.type === 'extra' ? true : delayWorkForm.extra,
      createdAt: delayWorkForm.date
    };
    
    if (delayWorkForm.type === 'extra') {
      payload.extraName = delayWorkForm.extraName;
      payload.count = delayWorkForm.count || 1;
    } else if (delayWorkForm.type === 'shoot') {
      payload.count = delayWorkForm.count || 1;
    } else {
      payload.publishedLink = delayWorkForm.publishedLink;
      payload.totalAccountReach = delayWorkForm.totalAccountReach;
      payload.totalAccountViews = delayWorkForm.totalAccountViews;
    }
    
    // Default to 1 count for standard deliverables if not set
    if (!payload.count && (payload.type === 'reel' || payload.type === 'post')) {
      payload.count = 1;
    }

    try {
      const response = await fetch(getApiUrl('/delay-work'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (result.success) {
        setDelayWork([...delayWork, result.data]);
        setIsAddDelayWorkOpen(false);
        setDelayWorkForm({
          type: 'reel',
          publishedLink: '',
          totalAccountReach: '',
          totalAccountViews: '',
          clientEmail: '',
          extra: false,
          count: 1,
          extraName: '',
          date: new Date().toISOString().split('T')[0]
        });
      } else {
        alert(result.message || 'Failed to add daily work');
      }
    } catch (err) {
      console.error(err);
      alert('Network error: Could not connect to server.');
    }
  };

  const handleToggleTask = async (taskIndex) => {
    const staffInfo = JSON.parse(localStorage.getItem('staffInfo') || '{}');
    const staffId = staffInfo.id || staffInfo._id;
    if (!staffId) {
      alert('Staff ID not found');
      return;
    }
    try {
      const response = await fetch(getApiUrl(`/staff/${staffId}/toggle-task`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskIndex })
      });
      const result = await response.json();
      if (result.success) {
        // Update localStorage
        localStorage.setItem('staffInfo', JSON.stringify(result.data));
        syncStaffDataStates(result.data);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update task');
    }
  };

  const handleAddToPool = () => {
    if (!newPoolItem.trim()) return;
    addMasterPoolItem(newPoolItem.trim());
  };

  const handleRemoveFromPool = (itemId, itemName) => {
    deleteMasterPoolItem(itemId);
    
    // Also remove from today's work if it was selected
    const isSelected = todayTasks.some(t => t.name === itemName);
    if (isSelected) {
      handleToggleSelectTask(itemName, false);
    }
  };

  const handleToggleSelectTask = async (taskName, selected) => {
    const staffInfo = JSON.parse(localStorage.getItem('staffInfo') || '{}');
    const staffId = staffInfo.id || staffInfo._id;
    if (!staffId) return;

    let updatedTasks = [];
    if (selected) {
      if (!todayTasks.some(t => t.name === taskName)) {
        updatedTasks = [...todayTasks, { name: taskName, completed: false }];
      } else {
        updatedTasks = [...todayTasks];
      }
    } else {
      updatedTasks = todayTasks.filter(t => t.name !== taskName);
    }

    const todayWork = updatedTasks.map(t => t.name).join(', ');
    try {
      const response = await fetch(getApiUrl(`/staff/${staffId}/today-work`), { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todayWork })
      });
      const result = await response.json();
      if (result.success) {
        localStorage.setItem('staffInfo', JSON.stringify(result.data));
        syncStaffDataStates(result.data);
      }
    } catch (err) {
      console.error('Failed to sync selection:', err);
    }
  };

  const handleAddTask = async () => {
    if (!newTaskInput.trim()) {
      alert('Please enter a task');
      return;
    }
    const staffInfo = JSON.parse(localStorage.getItem('staffInfo') || '{}');
    const staffId = staffInfo.id || staffInfo._id;
    if (!staffId) {
      alert('Staff ID not found');
      return;
    }
    // Create updated tasks list
    const updatedTasks = [...todayTasks, { name: newTaskInput.trim(), completed: false }];
    // Convert to comma-separated string for updateTodayWork endpoint
    const todayWork = updatedTasks.map(t => t.name).join(', ');
    try {
      const response = await fetch(getApiUrl(`/staff/${staffId}/today-work`), { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todayWork })
      });
      const result = await response.json();
      if (result.success) {
        // Update localStorage and state
        localStorage.setItem('staffInfo', JSON.stringify(result.data));
        syncStaffDataStates(result.data);
        setNewTaskInput('');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to add task');
    }
  };

  const handleDeleteTask = async (taskIndex) => {
    const staffInfo = JSON.parse(localStorage.getItem('staffInfo') || '{}');
    const allowedEmployeeIds = ['RW-9752', 'RW-1702'];

    if (!staffInfo.employeeId || !allowedEmployeeIds.includes(staffInfo.employeeId)) {
      alert('Access Denied: Only employees with Employee ID RW-9752 or RW-1702 can remove daily work tasks.');
      return;
    }

    const staffId = staffInfo.id || staffInfo._id;
    if (!staffId) {
      alert('Staff ID not found');
      return;
    }
    // Create updated tasks list
    const updatedTasks = todayTasks.filter((_, i) => i !== taskIndex);
    // Convert to comma-separated string for updateTodayWork endpoint
    const todayWork = updatedTasks.map(t => t.name).join(', ');
    try {
      const response = await fetch(getApiUrl(`/staff/${staffId}/today-work`), { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todayWork, employeeId: staffInfo.employeeId })
      });
      const result = await response.json();
      if (result.success) {
        // Update localStorage and state
        localStorage.setItem('staffInfo', JSON.stringify(result.data));
        syncStaffDataStates(result.data);
      } else {
        alert(result.message || 'Failed to delete task');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete task');
    }
  };

  const handleDeleteReporteeTask = async (memberId, taskIndex) => {
    const staffInfo = JSON.parse(localStorage.getItem('staffInfo') || '{}');
    const allowedEmployeeIds = ['RW-9752', 'RW-1702'];

    if (!staffInfo.employeeId || !allowedEmployeeIds.includes(staffInfo.employeeId)) {
      alert('Access Denied: Only employees with Employee ID RW-9752 or RW-1702 can remove team members\' daily work tasks.');
      return;
    }

    const member = reportees.find(m => (m.id || m._id) === memberId);
    if (!member) return;

    const updatedTasks = (member.todayTasks || []).filter((_, i) => i !== taskIndex);
    const todayWork = updatedTasks.map(t => t.name).join(', ');

    try {
      const response = await fetch(getApiUrl(`/staff/${memberId}/today-work`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todayWork, employeeId: staffInfo.employeeId })
      });
      const result = await response.json();
      if (result.success) {
        setReportees(prev => prev.map(m => {
          if ((m.id || m._id) === memberId) {
            return { ...m, todayTasks: updatedTasks };
          }
          return m;
        }));
      } else {
        alert(result.message || 'Failed to remove task');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to remove task');
    }
  };

  const handleUpdateSatisfaction = async (memberId, level) => {
    const staffInfo = JSON.parse(localStorage.getItem('staffInfo') || '{}');
    const allowedEmployeeIds = ['RW-9752', 'RW-1702'];

    if (!staffInfo.employeeId || !allowedEmployeeIds.includes(staffInfo.employeeId)) {
      alert('Access Denied: Only employees with Employee ID RW-9752 or RW-1702 can mark satisfaction levels.');
      return;
    }

    try {
      const response = await fetch(getApiUrl(`/staff/${memberId}/satisfaction-level`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ satisfactionLevel: level, employeeId: staffInfo.employeeId })
      });
      const result = await response.json();
      if (result.success) {
        setReportees(prev => prev.map(m => {
          if ((m.id || m._id) === memberId) {
            return { ...m, todaySatisfaction: level };
          }
          return m;
        }));
      } else {
        alert(result.message || 'Failed to update satisfaction level');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update satisfaction level');
    }
  };

  const handleSaveMemberComment = async (memberId) => {
    const staffInfoLocal = JSON.parse(localStorage.getItem('staffInfo') || '{}');
    const allowedEmployeeIds = ['RW-9752', 'RW-1702'];

    if (!staffInfoLocal.employeeId || !allowedEmployeeIds.includes(staffInfoLocal.employeeId)) {
      alert('Access Denied: Only employees with Employee ID RW-9752 or RW-1702 can add comments.');
      return;
    }

    const commentText = memberComments[memberId] !== undefined 
      ? memberComments[memberId] 
      : (reportees.find(m => (m.id || m._id) === memberId)?.todayComment || '');

    try {
      const response = await fetch(getApiUrl(`/staff/${memberId}/today-comment`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: commentText, employeeId: staffInfoLocal.employeeId })
      });
      const result = await response.json();
      if (result.success) {
        setReportees(prev => prev.map(m => {
          if ((m.id || m._id) === memberId) {
            return { ...m, todayComment: commentText, commentUpdatedBy: staffInfoLocal.employeeId };
          }
          return m;
        }));

        const currentStaffId = staffInfoLocal.id || staffInfoLocal._id;
        if (memberId === currentStaffId) {
          const updatedLocal = { ...staffInfoLocal, todayComment: commentText, commentUpdatedBy: staffInfoLocal.employeeId };
          localStorage.setItem('staffInfo', JSON.stringify(updatedLocal));
          setStaffInfo(updatedLocal);
        }
        alert('Comment saved successfully!');
      } else {
        alert(result.message || 'Failed to save comment');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save comment');
    }
  };

  const handleSaveWork = async () => {
    const staffInfo = JSON.parse(localStorage.getItem('staffInfo') || '{}');
    // We don't need this anymore since tasks are managed individually, but keeping it for compatibility
    const todayWork = todayTasks.map(t => t.name).join(', ');
    try {
      const response = await fetch(getApiUrl(`/staff/${staffInfo.id || staffInfo._id}/today-work`), { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todayWork })
      });
      const result = await response.json();
      if (result.success) alert('Today\'s work saved successfully!');
    } catch (err) {
      alert('Failed to save work');
    }
  };

  return (
    <div className={`space-y-10 pb-12 transition-all duration-500 rounded-[2.5rem] p-4 sm:p-6 ${
      staffInfo.todaySatisfaction === 'red'
        ? 'bg-gradient-to-br from-rose-950/20 via-red-900/15 to-rose-900/20 border-4 border-rose-600/60 shadow-[0_0_50px_rgba(225,29,72,0.25)]'
        : staffInfo.todaySatisfaction === 'yellow'
        ? 'bg-gradient-to-br from-amber-500/15 via-yellow-500/10 to-amber-600/15 border-4 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.2)]'
        : staffInfo.todaySatisfaction === 'green'
        ? 'bg-gradient-to-br from-emerald-500/15 via-green-500/10 to-emerald-600/15 border-4 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
        : ''
    }`}>
      {/* Big Red Zone Warning Banner if satisfaction is RED */}
      {staffInfo.todaySatisfaction === 'red' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-3xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white font-bold flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl shadow-rose-600/40 border-2 border-rose-300/30"
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl animate-bounce">🚨</span>
            <div>
              <h3 className="text-xl font-black uppercase tracking-widest text-white">YOU ARE IN THE RED ZONE 🔴</h3>
              <p className="text-sm text-rose-100 mt-1">Management has marked your daily work satisfaction as RED. Immediate attention and task progress required!</p>
            </div>
          </div>
          <span className="text-xs font-black uppercase tracking-widest bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-white border border-white/30 whitespace-nowrap">
            RED ZONE ALERT
          </span>
        </motion.div>
      )}

      {/* Yellow Zone Notice Banner if satisfaction is YELLOW */}
      {staffInfo.todaySatisfaction === 'yellow' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white font-bold flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl shadow-amber-500/30 border-2 border-amber-200/30"
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">⚠️</span>
            <div>
              <h3 className="text-xl font-black uppercase tracking-widest text-white">YOU ARE IN THE YELLOW ZONE 🟡</h3>
              <p className="text-sm text-amber-100 mt-1">Your work satisfaction is marked YELLOW. Please improve performance and complete your daily goals.</p>
            </div>
          </div>
          <span className="text-xs font-black uppercase tracking-widest bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-white border border-white/30 whitespace-nowrap">
            YELLOW ZONE NOTICE
          </span>
        </motion.div>
      )}

      {/* Green Zone Success Banner if satisfaction is GREEN */}
      {staffInfo.todaySatisfaction === 'green' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white font-bold flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl shadow-emerald-600/30 border-2 border-emerald-200/30"
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">🟢</span>
            <div>
              <h3 className="text-xl font-black uppercase tracking-widest text-white">GREEN ZONE EXCELLENCE 🟢</h3>
              <p className="text-sm text-emerald-100 mt-1">Great job! Your work satisfaction for today is GREEN. Outstanding performance!</p>
            </div>
          </div>
          <span className="text-xs font-black uppercase tracking-widest bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-white border border-white/30 whitespace-nowrap">
            SAFE ZONE ✅
          </span>
        </motion.div>
      )}

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Employee Self Profile Avatar & Upload Button */}
          <div className="relative group/avatar shrink-0">
            <div
              onClick={() => {
                if (staffInfo.profilePic) {
                  setFullImageModal({
                    isOpen: true,
                    src: getProfilePicUrl(staffInfo.profilePic),
                    title: `${staffInfo.name || 'My Profile'}`
                  });
                }
              }}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-lg ring-4 ring-blue-500/30 bg-slate-900 flex items-center justify-center transition-transform hover:scale-105 ${
                staffInfo.profilePic ? 'cursor-pointer' : ''
              }`}
              title={staffInfo.profilePic ? "Click to view full image" : ""}
            >
              {staffInfo.profilePic ? (
                <img
                  src={getProfilePicUrl(staffInfo.profilePic)}
                  alt={staffInfo.name || 'Profile'}
                  className="w-full h-full object-cover rounded-full block border-0 outline-none"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-blue-400">
                    {staffInfo.name?.charAt(0)?.toUpperCase() || 'E'}
                  </span>
                </div>
              )}
            </div>

            {/* Employee Camera Upload Button */}
            <label
              htmlFor="staffSelfProfilePicInput"
              className="absolute -bottom-1 -right-1 p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg cursor-pointer transition-transform hover:scale-110 flex items-center justify-center border-2 border-white"
              title="Change Profile Picture"
            >
              <Camera size={13} />
              <input
                type="file"
                id="staffSelfProfilePicInput"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePicUpload}
              />
            </label>
          </div>

          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl sm:text-4xl font-black text-black tracking-tight"
            >
              {greeting}, {staffInfo.name || JSON.parse(localStorage.getItem('staffInfo') || '{}')?.name || 'Alex'}
            </motion.h2>
            <p className="text-black font-bold mt-1 text-sm sm:text-base">Here's what's happening with your work today.</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Role: {staffInfo.role || 'Not set'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button 
            onClick={() => setShowNotifications(true)}
            className="w-11 h-11 sm:w-12 sm:h-12 clay-flat rounded-2xl flex items-center justify-center text-black hover:clay-inset transition-all relative"
          >
            <Bell size={18} strokeWidth={2.5} />
            {notifications.filter(n => !n.isRead).length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {notifications.filter(n => !n.isRead).length}
              </span>
            )}
          </button>
          
          {/* Notification Full-Screen Popup Modal */}
          {showNotifications && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="clay-card w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative">
                {/* Close Button */}
                <button
                  onClick={() => setShowNotifications(false)}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 clay-flat rounded-2xl flex items-center justify-center text-black hover:clay-inset hover:text-rose-500 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
                
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-black text-black">Notifications</h2>
                  <span className="text-sm font-bold text-black bg-purple-100 px-4 py-2 rounded-2xl w-fit">
                    {notifications.filter(n => !n.isRead).length} unread
                  </span>
                </div>
                
                {notifications.length === 0 ? (
                  <div className="text-center py-12 sm:py-16">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-3xl bg-purple-100 flex items-center justify-center">
                      <Bell size={36} className="text-purple-500" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-black mb-2">No notifications yet</h3>
                    <p className="text-black font-semibold">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {notifications.map((notification) => (
                      <div 
                        key={notification._id}
                        onClick={() => !notification.isRead && markAsRead(notification._id)}
                        className={cn(
                          "p-4 sm:p-6 rounded-3xl transition-all cursor-pointer border-2",
                          notification.isRead 
                            ? "bg-gray-50 border-gray-200" 
                            : "bg-purple-50 border-purple-300 shadow-lg shadow-purple-100"
                        )}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <h4 className={cn(
                              "text-lg sm:text-xl font-bold mb-2",
                              notification.isRead ? "text-black" : "text-black"
                            )}>
                              {notification.title}
                            </h4>
                            <p className="text-black font-semibold text-sm sm:text-base">
                              {notification.message}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600 mt-3 font-medium">
                              {new Date(notification.createdAt).toLocaleString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric', 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                          {!notification.isRead && (
                            <span className="w-4 h-4 bg-purple-500 rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* GPS Status Banners for Sales Team */}
      {(staffInfo.role?.toLowerCase() === 'sales team' || staffInfo.role?.toLowerCase() === 'sales') && gpsError && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-5 rounded-3xl border-2 border-amber-300 bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 font-bold flex items-center gap-4 shadow-sm"
        >
          <span className="text-2xl">⚠️</span>
          <div>
            <h4 className="text-base font-black">
              {gpsError === 'permission_denied' ? 'Location Access Denied' : 'GPS Location Unavailable'}
            </h4>
            <p className="text-sm font-semibold mt-1 opacity-90">
              {gpsError === 'permission_denied' 
                ? 'Please enable location services in your browser settings. Sales Team members must share location to keep portal active.'
                : 'GPS signal is currently unavailable. Please verify that your device has location/GPS turned on.'}
            </p>
          </div>
        </motion.div>
      )}

      {(staffInfo.role?.toLowerCase() === 'sales team' || staffInfo.role?.toLowerCase() === 'sales') && !gpsError && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-5 rounded-3xl border-2 border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200 font-bold flex items-center gap-4 shadow-sm"
        >
          <span className="relative flex h-3.5 w-3.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
          </span>
          <div>
            <h4 className="text-base font-black">MERN GPS Tracking Active</h4>
            <p className="text-sm font-semibold mt-0.5 opacity-90">Your live coordinates are securely shared with the administration team.</p>
          </div>
        </motion.div>
      )}


      {/* Client Task Update for Data Analyst */}
      {staffInfo.role?.toLowerCase() === 'data analyst' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-col sm:flex-row gap-4"
        >
          <button 
            type="button"
            onClick={() => {
              setIsClientTaskUpdateOpen(true);
            }}
            className="clay-card p-5 rounded-3xl flex-1 flex items-center justify-center gap-3 transition-all cursor-pointer font-black text-lg text-left outline-none border-none bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-lg hover:-translate-y-1"
          >
            <ListChecks size={24} />
            Client Task Update
          </button>
        </motion.div>
      )}

      {/* Capture Actions for Sales Team */}
      {(staffInfo.role?.toLowerCase() === 'sales team' || staffInfo.role?.toLowerCase() === 'sales') && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-col sm:flex-row gap-4"
        >
          <button 
            type="button"
            onClick={() => {
              setIsCardScanner(false);
              setIsCameraActive(true);
            }}
            disabled={isUploadingPhoto || isUploadingCard}
            className={cn(
              "clay-card p-5 rounded-3xl flex-1 flex items-center justify-center gap-3 transition-all cursor-pointer font-black text-lg text-left outline-none border-none",
              (isUploadingPhoto || isUploadingCard) ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:-translate-y-1"
            )}
          >
            {isUploadingPhoto ? (
              <div className="w-6 h-6 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Camera size={24} />
            )}
            {isUploadingPhoto ? 'Uploading Photo...' : 'Capture Location Photo'}
          </button>

          <button 
            type="button"
            onClick={() => {
              setIsCardScanner(true);
              setIsCameraActive(true);
            }}
            disabled={isUploadingPhoto || isUploadingCard}
            className={cn(
              "clay-card p-5 rounded-3xl flex-1 flex items-center justify-center gap-3 transition-all cursor-pointer font-black text-lg text-left outline-none border-none",
              (isUploadingPhoto || isUploadingCard) ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-lg hover:-translate-y-1"
            )}
          >
            {isUploadingCard ? (
              <div className="w-6 h-6 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <CreditCard size={24} />
            )}
            {isUploadingCard ? 'Processing Card...' : 'Scan Visiting Card'}
          </button>
        </motion.div>
      )}


      {/* Live Camera Modal */}
      {isCameraActive && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="clay-card w-full max-w-lg overflow-hidden p-6 sm:p-8 relative bg-white rounded-3xl shadow-2xl flex flex-col items-center max-h-[90vh]"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={stopCamera}
              className="absolute top-4 right-4 w-10 h-10 clay-flat rounded-2xl flex items-center justify-center text-black hover:clay-inset hover:text-rose-500 transition-all z-10"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl sm:text-2xl font-black text-black mb-4 flex items-center gap-2">
              {isCardScanner ? (
                <CreditCard className="text-purple-600" size={24} />
              ) : (
                <Camera className="text-blue-600" size={24} />
              )}
              {isCardScanner ? 'Visiting Card Scanner' : 'Live Photo Capture'}
            </h3>

            {/* Video Feed / Image Preview container */}
            <div className={cn(
              "relative w-full bg-black rounded-2xl overflow-hidden shadow-inner border border-gray-100 flex items-center justify-center shrink-0",
              isCardScanner ? "aspect-[7/4]" : "aspect-[4/3]"
            )}>
              {cameraError ? (
                <div className="p-6 text-center text-rose-500 font-bold">
                  <p>{cameraError}</p>
                </div>
              ) : !capturedPhoto ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Switch Camera Trigger */}
                  <button
                    type="button"
                    onClick={toggleFacingMode}
                    className="absolute top-4 left-4 p-3 bg-black/60 hover:bg-black/80 text-white rounded-2xl transition-all border border-white/20 active:scale-95 flex items-center justify-center gap-1.5 shadow-lg z-20 backdrop-blur-sm"
                    title="Switch camera mode"
                  >
                    <RefreshCw size={18} />
                    <span className="text-[10px] font-black uppercase tracking-wider hidden xs:inline-block">
                      {facingMode === 'environment' ? 'Front Camera' : 'Rear Camera'}
                    </span>
                  </button>
                  {/* Overlay guideline */}
                  <div className="absolute inset-0 border-2 border-dashed border-white/30 rounded-2xl pointer-events-none m-4 flex items-center justify-center">
                    <p className="text-white/60 text-xs font-bold bg-black/40 px-3 py-1 rounded-full">
                      {isCardScanner ? 'Align visiting card in landscape' : 'Align subject inside grid'}
                    </p>
                  </div>
                </>
              ) : !isCardScanner ? (
                <img
                  src={capturedPhoto}
                  alt="Captured Location"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                  <img
                    src={capturedPhoto}
                    alt="Captured Card"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>

            {/* Verification Form (Card Scanner only, after capture) */}
            {isCardScanner && capturedPhoto && (
              <div className="w-full flex-1 overflow-y-auto pr-1 mt-4 space-y-4 max-h-[40vh] py-2 relative">
                {isExtractingCardText && (
                  <div className="absolute inset-0 bg-white/85 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center gap-3">
                    <RefreshCw className="text-purple-600 animate-spin" size={32} />
                    <span className="text-sm font-bold text-gray-700 animate-pulse">Extracting text using OCR...</span>
                  </div>
                )}
                
                {/* Structured Confirmation Summary Box */}
                {!isExtractingCardText && ocrResult && (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl text-left space-y-3 shadow-sm">
                    <span className="text-[10px] text-purple-600 font-black uppercase tracking-wider block mb-1">Document Intelligence Summary</span>
                    <div className="space-y-1.5 text-xs text-gray-700 font-semibold font-mono">
                      <div>Name    &rarr; <span className="text-gray-900 font-bold">{cardForm.name || 'Not found'}</span></div>
                      <div>Email   &rarr; <span className="text-gray-900 font-bold">{cardForm.email || 'Not found'}</span></div>
                      <div>Phone   &rarr; <span className="text-gray-900 font-bold">{cardForm.phone || 'Not found'}</span></div>
                      <div>Address &rarr; <span className="text-gray-900 font-bold">{cardForm.rawText || 'Not found'}</span></div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <span className="text-xs font-bold text-gray-500">Confidence: <span className="text-purple-600 font-extrabold">{ocrResult.confidence}%</span></span>
                      <span className="text-[9px] px-2 py-0.5 bg-purple-100 text-purple-700 rounded-md font-bold uppercase">{ocrResult.method}</span>
                    </div>
                    <p className="text-[10px] font-bold text-gray-500 italic mt-2">
                      Are these details correct? You may edit any field below before confirming.
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block mb-1">Verify Card Fields</span>
                  
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Contact Person Name</label>
                    <input
                      type="text"
                      disabled={isExtractingCardText}
                      value={cardForm.name}
                      onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-600 block mb-1">Phone Number</label>
                      <input
                        type="text"
                        disabled={isExtractingCardText}
                        value={cardForm.phone}
                        onChange={(e) => setCardForm({ ...cardForm, phone: e.target.value })}
                        placeholder="e.g. +91 9999999999"
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-600 block mb-1">Email Address</label>
                      <input
                        type="email"
                        disabled={isExtractingCardText}
                        value={cardForm.email}
                        onChange={(e) => setCardForm({ ...cardForm, email: e.target.value })}
                        placeholder="e.g. info@acme.com"
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Address / Raw Card Text</label>
                    <textarea
                      disabled={isExtractingCardText}
                      value={cardForm.rawText}
                      onChange={(e) => setCardForm({ ...cardForm, rawText: e.target.value })}
                      placeholder="Enter address, website or other text printed on the card..."
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 w-full flex flex-col gap-3 shrink-0">
              {!capturedPhoto ? (
                <button
                  type="button"
                  onClick={capturePhoto}
                  disabled={!!cameraError}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed animate-pulse"
                >
                  <span className="w-4 h-4 bg-white rounded-full"></span>
                  {isCardScanner ? 'Capture Visiting Card' : 'Capture Snapshot'}
                </button>
              ) : (
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={retakePhoto}
                    disabled={isUploadingPhoto || isUploadingCard || isExtractingCardText}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-black py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 border border-gray-200 disabled:opacity-50"
                  >
                    Retake
                  </button>
                  <button
                    type="button"
                    onClick={isCardScanner ? handleUploadVisitingCard : handleUploadCapturedPhoto}
                    disabled={isUploadingPhoto || isUploadingCard || isExtractingCardText}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isUploadingPhoto || isUploadingCard ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Confirm & Send'
                    )}
                  </button>
                </div>
              )}
              
              <button
                type="button"
                onClick={stopCamera}
                disabled={isUploadingPhoto || isUploadingCard || isExtractingCardText}
                className="w-full text-center text-sm font-bold text-gray-500 hover:text-gray-700 py-2 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Employee Info Card */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="clay-card p-6 sm:p-10"
      >
        <div>
          <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div 
              onClick={() => {
                if (staffInfo.profilePic) {
                  setFullImageModal({
                    isOpen: true,
                    src: getProfilePicUrl(staffInfo.profilePic),
                    title: `${staffInfo.name || 'My Profile'}`
                  });
                }
              }}
              className={`w-14 h-14 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-[#8b5cf6] to-[#f472b6] flex items-center justify-center text-white font-black text-2xl sm:text-3xl shrink-0 ${
                staffInfo.profilePic ? 'cursor-pointer hover:scale-105 transition-transform' : ''
              }`}
            >
              {staffInfo?.profilePic ? (
                <img
                  src={getProfilePicUrl(staffInfo.profilePic)}
                  alt={staffInfo.name}
                  className="w-full h-full object-cover rounded-2xl block border-0 outline-none"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                staffInfo?.name?.charAt(0) || 'U'
              )}
            </div>
            <div>
              <h3 className="text-xl sm:text-3xl font-black text-black">{staffInfo?.name || 'Employee'}</h3>
              <p className="text-sm sm:text-lg font-bold text-black mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>{staffInfo?.department || 'N/A'}</span>
                {staffInfo?.reportingPerson && (() => {
                  const reportingPersonIds = Array.isArray(staffInfo.reportingPerson)
                    ? staffInfo.reportingPerson
                    : (staffInfo.reportingPerson && staffInfo.reportingPerson !== '-' ? [staffInfo.reportingPerson] : []);

                  if (reportingPersonIds.length === 0) return null;

                  const managerNames = staffInfo.reportingPersonName && staffInfo.reportingPersonName !== '-'
                    ? staffInfo.reportingPersonName
                    : reportingPersonIds.join(', ');

                  return (
                    <span className="text-xs text-gray-500 font-bold bg-black/5 border border-black/10 rounded-full px-2.5 py-0.5 whitespace-nowrap" title={`IDs: ${reportingPersonIds.join(', ')}`}>
                      Report to: {managerNames}
                    </span>
                  );
                })()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Employee ID */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              className="clay-card p-4 sm:p-6 space-y-3 sm:space-y-4 text-left w-full relative overflow-hidden group transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 sm:p-4 rounded-2xl clay-inset bg-[#8b5cf6]">
                  <User size={20} className="text-white" />
                </div>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-black text-black uppercase tracking-widest">Employee ID</p>
                <h3 className="text-2xl sm:text-3xl font-black mt-1 tracking-tight text-black">
                  {JSON.parse(localStorage.getItem('staffInfo') || '{}')?.employeeId || 'N/A'}
                </h3>
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity rounded-full bg-[#8b5cf6]" />
            </motion.div>

            {/* Department */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              className="clay-card p-4 sm:p-6 space-y-3 sm:space-y-4 text-left w-full relative overflow-hidden group transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 sm:p-4 rounded-2xl clay-inset bg-[#34d399]">
                  <Briefcase size={20} className="text-white" />
                </div>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-black text-black uppercase tracking-widest">Department</p>
                <h3 className="text-2xl sm:text-3xl font-black mt-1 tracking-tight text-black">
                  {JSON.parse(localStorage.getItem('staffInfo') || '{}')?.department || 'N/A'}
                </h3>
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity rounded-full bg-[#34d399]" />
            </motion.div>

            {/* Joining Date */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              className="clay-card p-4 sm:p-6 space-y-3 sm:space-y-4 text-left w-full relative overflow-hidden group transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 sm:p-4 rounded-2xl clay-inset bg-[#facc15]">
                  <Calendar size={20} className="text-white" />
                </div>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-black text-black uppercase tracking-widest">Joining Date</p>
                <h3 className="text-2xl sm:text-3xl font-black mt-1 tracking-tight text-black">
                  {JSON.parse(localStorage.getItem('staffInfo') || '{}')?.joiningDate 
                    ? new Date(JSON.parse(localStorage.getItem('staffInfo') || '{}').joiningDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) 
                    : 'N/A'}
                </h3>
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity rounded-full bg-[#facc15]" />
            </motion.div>

            {/* Total Days */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              className="clay-card p-4 sm:p-6 space-y-3 sm:space-y-4 text-left w-full relative overflow-hidden group transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 sm:p-4 rounded-2xl clay-inset bg-[#f472b6]">
                  <TrendingUp size={20} className="text-white" />
                </div>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-black text-black uppercase tracking-widest">Total Days</p>
                <h3 className="text-2xl sm:text-3xl font-black mt-1 tracking-tight text-black">
                  {JSON.parse(localStorage.getItem('staffInfo') || '{}')?.joiningDate 
                    ? Math.floor((new Date() - new Date(JSON.parse(localStorage.getItem('staffInfo') || '{}').joiningDate)) / (1000 * 60 * 60 * 24)) 
                    : '0'}
                </h3>
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity rounded-full bg-[#f472b6]" />
            </motion.div>

            {/* Admissions (Only for Counselor) */}
            {staffInfo.role?.toLowerCase() === 'counselor' && (
              <motion.div 
                whileHover={{ y: -5, scale: 1.02 }}
                className="clay-card p-4 sm:p-6 space-y-3 sm:space-y-4 text-left w-full relative overflow-hidden group transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="p-3 sm:p-4 rounded-2xl clay-inset bg-[#10b981]">
                    <GraduationCap size={20} className="text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs font-black text-black uppercase tracking-widest">Total Admissions</p>
                  <h3 className="text-2xl sm:text-3xl font-black mt-1 tracking-tight text-black">
                    {admissionsLoading ? '...' : admissionsCount}
                  </h3>
                </div>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity rounded-full bg-[#10b981]" />
              </motion.div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Stats & Actions Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {isLeaveDay ? (
          <div className="sm:col-span-2 lg:col-span-4 clay-card p-6 sm:p-10 text-center space-y-4">
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-2xl clay-inset bg-amber-500 flex items-center justify-center">
              <Calendar size={32} className="text-white" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-black">Today is Leave Day</h3>
            <p className="text-black font-bold">Enjoy your day off! No clock in/out needed.</p>
          </div>
        ) : (
          <>
            <ActionCard 
              title="Clock In Today" 
              time={attendanceStatus.sessions?.[attendanceStatus.sessions.length - 1]?.clockIn || currentTime}
              icon={LogIn}
              color="bg-emerald-500"
              type="in"
              onClick={handleClockIn}
              disabled={!attendanceStatus.canClockIn}
            />
            <ActionCard 
              title="Clock Out Today" 
              time={attendanceStatus.sessions?.[attendanceStatus.sessions.length - 1]?.clockOut || (attendanceStatus.canClockOut ? currentTime : "--:--")}
              icon={LogOut}
              color="bg-rose-500"
              type="out"
              onClick={handleClockOut}
              disabled={!attendanceStatus.canClockOut}
            />
          </>
        )}
        
        <div className="clay-card p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div className="flex justify-between items-start">
            <div className="p-3 sm:p-4 rounded-2xl clay-inset bg-blue-500">
              <Clock size={20} className="text-white" />
            </div>
            <div className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-blue-500/10 text-blue-600 border-blue-500/20">
              Total Hours
            </div>
          </div>
          <div>
            <p className="text-[10px] sm:text-xs font-black text-black uppercase tracking-widest">Daily Total</p>
            <h3 className="text-2xl sm:text-3xl font-black text-black mt-1">{isLeaveDay ? "-" : attendanceStatus.totalHours}</h3>
            <div className="mt-4 space-y-2 max-h-32 overflow-y-auto">
              {!isLeaveDay && attendanceStatus.sessions?.map((session, idx) => (
                <div key={idx} className="text-xs bg-blue-50 p-2 rounded">
                  <p className="font-bold text-black">Session {idx + 1}</p>
                  <p className="text-black">{session.clockIn} - {session.clockOut || '...'}</p>
                  {session.duration && <p className="text-blue-600 font-semibold">{session.duration}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
        <StatCard 
          title="Monthly Salary" 
          value={`₹${baseSalary.toLocaleString()}`}
          change={0} 
          isPositive={true} 
          icon={DollarSign}
          color="bg-[#8b5cf6]"
          extra={`Payout: ₹${payout.toLocaleString()} | Hours: ${totalHoursWorked} | ₹${hourlyRate}/hr`}
        />
      </section>

      {/* Analytics & Distribution Grid */}
      <section className="grid grid-cols-1 gap-6 sm:gap-8">
        {/* Salary Chart */}
        <div className="clay-card p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-black uppercase tracking-tight">Salary Analysis</h3>
              <p className="text-[10px] sm:text-xs font-bold text-black mt-1">Monthly Salary (Last 6 Months)</p>
            </div>
          </div>
          <div className="h-[300px] sm:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#000', fontSize: 10, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#000', fontSize: 10, fontWeight: 700 }}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(139, 92, 246, 0.05)' }}
                  contentStyle={{ 
                    borderRadius: '20px', 
                    border: 'none', 
                    boxShadow: '10px 10px 20px #c8d0e7, -10px -10px 20px #ffffff',
                    padding: '12px',
                    color: '#000'
                  }}
                  formatter={(value, name, props) => {
                    const data = props.payload;
                    return [
                      `₹${value.toLocaleString()}`,
                      `Base: ₹${data.baseSalary?.toLocaleString()}\nPayout: ₹${data.salary?.toLocaleString()}\nLeaves: ${data.totalLeaves}\nHalf Days: ${data.totalHalfDays}`
                    ];
                  }}
                />
                <Bar 
                  dataKey="salary" 
                  fill="#8b5cf6" 
                  radius={[10, 10, 0, 0]} 
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Today's Work Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`clay-card p-6 sm:p-8 transition-all ${
          staffInfo.todaySatisfaction === 'red' 
            ? 'bg-rose-500/10 border-2 border-rose-500/50 shadow-xl shadow-rose-500/20' 
            : staffInfo.todaySatisfaction === 'yellow'
            ? 'bg-amber-500/10 border-2 border-amber-500/50 shadow-xl shadow-amber-500/20'
            : staffInfo.todaySatisfaction === 'green'
            ? 'bg-emerald-500/10 border-2 border-emerald-500/50 shadow-xl shadow-emerald-500/20'
            : ''
        }`}
      >
        {/* Red Warning Banner if satisfaction is RED */}
        {staffInfo.todaySatisfaction === 'red' && (
          <div className="p-4 rounded-2xl bg-rose-600 text-white font-bold mb-6 flex items-center justify-between shadow-lg shadow-rose-600/30 animate-pulse">
            <div className="flex items-center gap-3">
              <span className="text-xl">🔴</span>
              <div>
                <h4 className="text-sm font-black uppercase tracking-wider">Work Satisfaction Warning (RED)</h4>
                <p className="text-xs text-rose-100 mt-0.5">Your work satisfaction level for today has been marked RED by management. Please review your assigned tasks immediately.</p>
              </div>
            </div>
          </div>
        )}

        {/* Yellow Notice Banner if satisfaction is YELLOW */}
        {staffInfo.todaySatisfaction === 'yellow' && (
          <div className="p-4 rounded-2xl bg-amber-500 text-white font-bold mb-6 flex items-center justify-between shadow-lg shadow-amber-500/30">
            <div className="flex items-center gap-3">
              <span className="text-xl">🟡</span>
              <div>
                <h4 className="text-sm font-black uppercase tracking-wider">Work Satisfaction Status (YELLOW)</h4>
                <p className="text-xs text-amber-100 mt-0.5">Your work satisfaction level for today is marked YELLOW. Keep pushing to complete all tasks!</p>
              </div>
            </div>
          </div>
        )}

        {/* Green Success Banner if satisfaction is GREEN */}
        {staffInfo.todaySatisfaction === 'green' && (
          <div className="p-4 rounded-2xl bg-emerald-600 text-white font-bold mb-6 flex items-center justify-between shadow-lg shadow-emerald-600/30">
            <div className="flex items-center gap-3">
              <span className="text-xl">🟢</span>
              <div>
                <h4 className="text-sm font-black uppercase tracking-wider">Great Work! (GREEN)</h4>
                <p className="text-xs text-emerald-100 mt-0.5">Your work satisfaction level for today has been marked GREEN by management. Outstanding performance!</p>
              </div>
            </div>
          </div>
        )}

        {/* Management Comment Box on Employee Dashboard */}
        {staffInfo.todayComment && (
          <div className="p-5 rounded-2xl bg-white border-2 border-purple-500/30 text-black font-bold mb-6 shadow-md shadow-purple-500/5">
            <div className="flex items-center gap-2 mb-2 text-black">
              <MessageSquare size={18} className="text-purple-600" />
              <h4 className="text-xs font-black uppercase tracking-widest text-black">Management Comment / Feedback</h4>
            </div>
            <p className="text-sm sm:text-base font-bold leading-relaxed pl-4 border-l-4 border-purple-600 text-black">
              "{staffInfo.todayComment}"
            </p>
            {staffInfo.commentUpdatedBy && (
              <p className="text-[10px] font-bold text-gray-600 mt-2 text-right">
                — Added by Management ({staffInfo.commentUpdatedBy})
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h3 className="text-lg sm:text-xl font-black text-black uppercase tracking-tight">Today's Work</h3>
        </div>
        
        {/* Progress */}
        {(() => {
          const regularTasks = todayTasks.filter(t => !t.isExtra);
          const extraTasks = todayTasks.filter(t => t.isExtra);
          const completedRegularCount = regularTasks.filter(t => t.completed).length;
          const completedExtraCount = extraTasks.filter(t => t.completed).length;
          const totalRegular = regularTasks.length;
          const progress = totalRegular > 0 
            ? Math.round(((completedRegularCount + completedExtraCount) / totalRegular) * 100) 
            : completedExtraCount > 0 ? 100 + (completedExtraCount * 25) : 0;
          return (
            <div className="p-4 rounded-2xl bg-black/5 border border-gray-200 space-y-3 mb-6">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-black uppercase tracking-widest">Day Progress</span>
                <span className="text-xs font-bold text-black">{progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 200)}%` }}
                  className={`h-full ${progress >= 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                />
              </div>
            </div>
          );
        })()}
        
        {/* Add Task Input */}
        <div className="flex gap-3 mb-6">
          <input 
            type="text"
            value={newTaskInput}
            onChange={(e) => setNewTaskInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            placeholder="Enter what you will work on today..."
            className="flex-1 p-4 sm:p-6 clay-inset rounded-2xl text-sm font-bold text-black placeholder-gray-800 focus:outline-none"
          />
          <button 
            onClick={handleAddTask}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-br from-[#8b5cf6] to-[#f472b6] text-white rounded-2xl text-xs sm:text-sm font-black uppercase tracking-widest shadow-lg hover:shadow-purple-500/30 transition-all active:scale-95 flex items-center gap-2"
          >
            <Plus size={16} />
            Add Task
          </button>
        </div>
        {todayTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {todayTasks.map((task, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all w-full ${
                  task.completed 
                    ? 'bg-emerald-500/10 border-emerald-500/20' 
                    : 'bg-black/5 border-gray-200'
                }`}
              >
                <div 
                  onClick={() => {
                    const allowedRolesToComplete = ['technical tl', 'digital marketing'];
                    if (!allowedRolesToComplete.includes(staffInfo.role?.toLowerCase())) {
                      alert("Only Technical TL and Digital Marketing roles can complete/approve tasks.");
                      return;
                    }
                    handleToggleTask(index);
                  }}
                  className={`p-1.5 rounded-lg transition-all ${
                    ['technical tl', 'digital marketing specialist', 'technical tl & digital marketing specialist'].includes(staffInfo.role?.toLowerCase())
                      ? 'cursor-pointer hover:scale-105 active:scale-95'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  } ${
                    task.completed 
                      ? 'bg-emerald-500/20 text-emerald-600' 
                      : 'bg-gray-500/20 text-black'
                  }`}
                  title={['technical tl', 'digital marketing specialist', 'technical tl & digital marketing specialist'].includes(staffInfo.role?.toLowerCase()) ? 'Toggle complete' : 'Approval by admin only'}
                >
                  {task.completed ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                    </svg>
                  )}
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <span className={`text-sm font-bold block transition-all ${
                    task.completed ? 'text-gray-600 line-through' : 'text-black'
                  }`}>
                    {task.name}
                  </span>
                  {task.isExtra && (
                    <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest bg-orange-500/10 px-2 py-0.5 rounded-full w-fit">
                      Extra Work
                    </span>
                  )}
                </div>
                {!task.isExtra && ['RW-9752', 'RW-1702'].includes(staffInfo.employeeId) && (
                  <button
                    onClick={() => handleDeleteTask(index)}
                    className="p-1.5 rounded-lg text-gray-500 hover:bg-red-500/10 hover:text-red-600 transition-all"
                    title="Delete task"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-black/5 rounded-2xl border border-dashed border-gray-200">
            <p className="text-sm text-black font-medium">No tasks added yet</p>
          </div>
        )}
      </motion.section>

      {/* TL Checklist Manager Section - Only for Technical TL & Digital Marketing Specialist */}
      {['technical tl', 'digital marketing specialist', 'technical tl & digital marketing specialist'].includes(staffInfo.role?.toLowerCase()) && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="clay-card p-6 sm:p-8 space-y-6"
        >
          <div className="flex justify-between items-center border-b border-black/5 pb-3">
            <div>
              <h3 className="text-xl font-black text-[#8b5cf6] uppercase tracking-tight flex items-center gap-2">
                <Users size={20} className="text-[#8b5cf6]" />
                TL Master Checklist Pool
              </h3>
              <p className="text-xs text-gray-500 font-bold mt-1">Create checklist items for yourself and select (check) the work you are doing today.</p>
            </div>
          </div>
          
          {/* Add Item to Pool */}
          <div className="flex gap-3">
            <input 
              type="text"
              value={newPoolItem}
              onChange={(e) => setNewPoolItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddToPool()}
              placeholder="Add task to your master pool..."
              className="flex-1 p-4 clay-inset rounded-2xl text-sm font-bold text-black placeholder-gray-800 focus:outline-none"
            />
            <button 
              onClick={handleAddToPool}
              className="px-4 py-2.5 bg-gradient-to-br from-[#8b5cf6] to-[#f472b6] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg hover:shadow-purple-500/30 transition-all active:scale-95 flex items-center gap-2"
            >
              <Plus size={16} />
              Add
            </button>
          </div>

          {/* List of Pool Items with Checkboxes to SELECT Today's Work */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-black uppercase tracking-widest border-b border-black/5 pb-1">Select Work For Today</h4>
            {masterPoolLoading ? (
              <div className="text-center py-6 bg-black/5 rounded-2xl border border-dashed border-gray-200">
                <p className="text-xs text-gray-500 font-bold">Loading master pool...</p>
              </div>
            ) : masterPool.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {masterPool.map((item) => {
                  const isSelected = todayTasks.some(t => t.name === item.name);
                  return (
                    <div key={item._id} className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-200 bg-white/50 relative group">
                      <div className="flex items-center gap-3 flex-1">
                        <button
                          onClick={() => handleToggleSelectTask(item.name, !isSelected)}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all border ${
                            isSelected 
                              ? 'bg-[#8b5cf6] border-[#8b5cf6] text-white shadow-md shadow-purple-500/20' 
                              : 'bg-black/5 border-gray-300 text-transparent'
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </button>
                        <span className="text-sm font-bold text-black">
                          {item.name}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveFromPool(item._id, item.name)}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100"
                        title="Remove from pool"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 bg-black/5 rounded-2xl border border-dashed border-gray-200">
                <p className="text-xs text-gray-500 font-bold">Your master pool is empty. Add items above!</p>
              </div>
            )}
          </div>
        </motion.section>
      )}

      {/* Reportees Section - Only if the staff member has reportees */}
      {reportees && reportees.length > 0 && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="clay-card p-6 sm:p-8 space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-black/5 pb-4">
            <div>
              <h3 className="text-xl font-black text-[#8b5cf6] uppercase tracking-tight flex items-center gap-2">
                <Users size={20} className="text-[#8b5cf6]" />
                My Team's Daily Work
              </h3>
              <p className="text-xs text-gray-500 font-bold mt-1">Today's assigned tasks and attendance status of staff members reporting to you</p>
            </div>
            <span className="text-xs font-bold text-white bg-[#8b5cf6] px-4 py-2 rounded-2xl w-fit shadow-md shadow-purple-500/10">
              {reportees.length} Team Members
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportees.map((member) => (
              <div key={member.id} className="clay-card p-5 border border-black/5 bg-[#f8fafc]/50 relative overflow-hidden group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      onClick={() => {
                        if (member.profilePic) {
                          setFullImageModal({
                            isOpen: true,
                            src: getProfilePicUrl(member.profilePic),
                            title: `${member.name} (${member.employeeId || 'Staff'})`
                          });
                        }
                      }}
                      className={`w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-[#8b5cf6] to-[#f472b6] flex items-center justify-center text-white font-black text-sm shrink-0 ${
                        member.profilePic ? 'cursor-pointer hover:scale-105 transition-transform' : ''
                      }`}
                    >
                      {member.profilePic ? (
                        <img
                          src={getProfilePicUrl(member.profilePic)}
                          alt={member.name}
                          className="w-full h-full object-cover rounded-xl block border-0 outline-none"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        member.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <h4 className="font-black text-black text-sm">{member.name}</h4>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                        {member.role || 'HR'} • {member.department}
                      </p>
                    </div>
                  </div>
                  
                  {/* Clock In Status */}
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Attendance</span>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border ${
                      member.todayClock && member.todayClock.sessions && member.todayClock.sessions.length > 0
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                    }`}>
                      {member.todayClock && member.todayClock.sessions && member.todayClock.sessions.length > 0 ? 'Present' : 'Absent'}
                    </span>
                  </div>
                </div>

                {/* Satisfaction Level Section */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/5 border border-black/5 mb-4">
                  <span className="text-[10px] font-black text-black uppercase tracking-wider">Satisfaction Level</span>
                  {['RW-9752', 'RW-1702'].includes(staffInfo.employeeId) ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleUpdateSatisfaction(member.id || member._id, 'red')}
                        className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all flex items-center gap-1 border-none cursor-pointer ${
                          member.todaySatisfaction === 'red'
                            ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30 scale-105'
                            : 'bg-rose-500/10 text-rose-600 hover:bg-rose-500/20'
                        }`}
                        title="Mark Red (Unsatisfied)"
                      >
                        🔴 Red
                      </button>
                      <button
                        onClick={() => handleUpdateSatisfaction(member.id || member._id, 'yellow')}
                        className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all flex items-center gap-1 border-none cursor-pointer ${
                          member.todaySatisfaction === 'yellow'
                            ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 scale-105'
                            : 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20'
                        }`}
                        title="Mark Yellow (Average)"
                      >
                        🟡 Yellow
                      </button>
                      <button
                        onClick={() => handleUpdateSatisfaction(member.id || member._id, 'green')}
                        className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all flex items-center gap-1 border-none cursor-pointer ${
                          member.todaySatisfaction === 'green'
                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 scale-105'
                            : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                        }`}
                        title="Mark Green (Satisfied)"
                      >
                        🟢 Green
                      </button>
                    </div>
                  ) : (
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border ${
                      member.todaySatisfaction === 'red' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' :
                      member.todaySatisfaction === 'yellow' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                      member.todaySatisfaction === 'green' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                      'bg-gray-100 text-gray-500 border-gray-200'
                    }`}>
                      {member.todaySatisfaction === 'red' ? '🔴 Red' :
                       member.todaySatisfaction === 'yellow' ? '🟡 Yellow' :
                       member.todaySatisfaction === 'green' ? '🟢 Green' : 'Not Set'}
                    </span>
                  )}
                </div>

                {/* Manager Comment Section */}
                {['RW-9752', 'RW-1702'].includes(staffInfo.employeeId) ? (
                  <div className="p-3 rounded-2xl bg-white border border-gray-300 shadow-sm mb-4 space-y-2">
                    <label className="text-[10px] font-black text-black uppercase tracking-widest block flex items-center gap-1.5">
                      <MessageSquare size={14} className="text-purple-600" /> Add Comment / Feedback
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={memberComments[member.id || member._id] !== undefined ? memberComments[member.id || member._id] : (member.todayComment || '')}
                        onChange={(e) => setMemberComments({ ...memberComments, [member.id || member._id]: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveMemberComment(member.id || member._id)}
                        placeholder="Type comment for employee..."
                        className="flex-1 bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-black placeholder:text-gray-500 outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 transition-all shadow-sm"
                      />
                      <button
                        onClick={() => handleSaveMemberComment(member.id || member._id)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-[10px] sm:text-xs uppercase tracking-widest transition-all border-none cursor-pointer shadow-md shadow-purple-600/20 active:scale-95"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  member.todayComment && (
                    <div className="p-3 rounded-2xl bg-white border border-purple-200 shadow-sm mb-4 space-y-1">
                      <span className="text-[10px] font-black text-black uppercase tracking-widest flex items-center gap-1">
                        <MessageSquare size={12} className="text-purple-600" /> Management Comment
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-black italic">"{member.todayComment}"</p>
                    </div>
                  )
                )}

                {/* Today's Tasks */}
                <div>
                  <h5 className="text-[10px] font-black text-black uppercase tracking-widest mb-3 border-b border-black/5 pb-1">Today's Assigned Tasks</h5>
                  {member.todayTasks && member.todayTasks.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {member.todayTasks.map((task, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-2.5 p-2 rounded-xl bg-white/5 border border-black/5 hover:bg-white/10 transition-colors">
                          <div className="flex items-center gap-2.5 flex-1">
                            <div className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${
                              task.completed 
                                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' 
                                : 'bg-black/5 border border-black/10 text-gray-400'
                            }`}>
                              {task.completed ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="10"></circle>
                                </svg>
                              )}
                            </div>
                            <span className={`text-xs font-bold transition-all ${
                              task.completed ? 'text-gray-500 line-through' : 'text-black'
                            }`}>
                              {task.name}
                            </span>
                          </div>
                          {['RW-9752', 'RW-1702'].includes(staffInfo.employeeId) && (
                            <button
                              onClick={() => handleDeleteReporteeTask(member.id || member._id, idx)}
                              className="p-1 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-500/10 transition-all cursor-pointer border-none bg-transparent"
                              title="Remove task"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 bg-black/5 rounded-xl border border-dashed border-gray-200">
                      <p className="text-xs text-gray-500 font-bold">No tasks assigned for today</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Client List for Task Update */}
      {isClientTaskUpdateOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="clay-card w-full max-w-4xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsClientTaskUpdateOpen(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 clay-flat rounded-2xl flex items-center justify-center text-black hover:clay-inset hover:text-rose-500 transition-all border-none cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <h3 className="text-xl sm:text-2xl font-black text-black mb-6 sm:mb-8 flex items-center gap-2">
              <ListChecks className="text-purple-500" />
              Client Task Update
            </h3>

            {clients.length === 0 ? (
              <p className="text-center text-gray-500 py-8 font-bold">No clients found.</p>
            ) : (
              <div className="space-y-4">
                {clients.map((client) => (
                  <div key={client._id || client.id} className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-black text-black">{client.name}</h4>
                      <p className="text-xs text-gray-500 font-bold">{client.email} • {client.department}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        client.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                        client.status === 'In Progress' ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20' :
                        client.status === 'On Hold' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                        'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                      }`}>
                        {client.status}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedClientForTasks(client);
                          setTempProjectData({
                            id: client._id || client.id,
                            name: client.name,
                            workDetail: client.workDetail || '',
                            tasks: JSON.parse(JSON.stringify(client.tasks || [])),
                            extraTasks: JSON.parse(JSON.stringify(client.extraTasks || []))
                          });
                          setIsUpdateProgressOpen(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all shadow-md hover:shadow-purple-500/20 flex items-center gap-1.5 border-none cursor-pointer"
                      >
                        <ListChecks size={14} />
                        Update Tasks
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Update Progress Modal */}
      {isUpdateProgressOpen && tempProjectData && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="clay-card w-full max-w-4xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsUpdateProgressOpen(false);
                setTempProjectData(null);
              }}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 clay-flat rounded-2xl flex items-center justify-center text-black hover:clay-inset hover:text-rose-500 transition-all border-none cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <h3 className="text-xl sm:text-2xl font-black text-black mb-6 sm:mb-8 flex items-center gap-2">
              <ListChecks className="text-blue-500" />
              Update Progress
            </h3>

            {/* Scope of Work */}
            {tempProjectData.workDetail && (
              <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-blue-500/10 dark:to-indigo-500/10 border border-indigo-200 dark:border-blue-500/20">
                <h4 className="text-xs font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                  Scope of Work
                </h4>
                <ul className="space-y-1.5">
                  {tempProjectData.workDetail.split('\n').filter(line => line.trim()).map((line, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-indigo-800 dark:text-indigo-300">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0"></span>
                      <span>{line.replace(/^[•\-\*]+\s*/, '').trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Primary Tasks */}
            <div className="space-y-4 mb-8">
              <h4 className="text-sm font-black text-black uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 size={16} className="text-blue-500" /> Primary Tasks
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tempProjectData.tasks?.map((task, index) => (
                  <div key={index} className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10">
                    <p className="text-sm font-bold text-black mb-2">{task.name}</p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleTempTaskUpdate(index, -1)}
                        disabled={task.completed <= 0}
                        className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold hover:bg-blue-200 dark:hover:bg-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-lg font-black text-black flex-1 text-center">{task.completed} / {task.total}</span>
                      <button
                        onClick={() => handleTempTaskUpdate(index, 1)}
                        disabled={task.completed >= task.total}
                        className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    {/* Published Link option inside task card when incremented (as it was before) */}
                    {(task.name?.toLowerCase().includes('reel') || task.name?.toLowerCase().includes('post')) && 
                     (task.completed || 0) > (selectedClientForTasks?.tasks?.[index]?.completed || 0) && (
                      <div className="mt-4 pt-3 border-t border-dashed border-gray-200">
                        <label className="text-[9px] font-black text-black uppercase tracking-wide block mb-1">Published Link</label>
                        <input 
                          type="text" 
                          className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-black placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                          placeholder="https://instagram.com/p/..."
                          value={taskMetrics[index]?.publishedLink || ''}
                          onChange={(e) => handleMetricChange(index, 'publishedLink', e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Always Visible Single Section for Account Reach & Views */}
            {tempProjectData.tasks?.some((task) => 
              task.name?.toLowerCase().includes('reel') || task.name?.toLowerCase().includes('post')
            ) && (
              <div className="space-y-4 mb-8 p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
                <h4 className="text-sm font-black text-black uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp size={18} className="text-blue-600" /> Account Reach & Views Metrics
                </h4>
                <p className="text-xs font-semibold text-gray-700">
                  Enter overall account reach and account views for this update. String format supported (e.g. <strong>10k</strong>, <strong>1.5M</strong>, <strong>500</strong>).
                </p>

                <div className="p-4 rounded-xl bg-white border border-gray-200 space-y-3 shadow-inner">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-black uppercase tracking-wide block mb-1">Account Reach</label>
                      <input 
                        type="text" 
                        className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-black placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                        placeholder="e.g. 10k, 1.5M, 500"
                        value={taskMetrics['global']?.reach || ''}
                        onChange={(e) => handleMetricChange('global', 'reach', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-black uppercase tracking-wide block mb-1">Account Views</label>
                      <input 
                        type="text" 
                        className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-black placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                        placeholder="e.g. 25k, 2M, 1000"
                        value={taskMetrics['global']?.views || ''}
                        onChange={(e) => handleMetricChange('global', 'views', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Extra Tasks */}
            {tempProjectData.extraTasks && tempProjectData.extraTasks.length > 0 && (
              <div className="space-y-4 mb-8">
                <h4 className="text-sm font-black text-emerald-900 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles size={16} className="text-emerald-500" /> Extra Tasks
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tempProjectData.extraTasks?.map((task, index) => (
                    <div key={index} className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                      <p className="text-sm font-bold text-emerald-950 mb-2">{task.name}</p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleTempTaskUpdate(index, -1, true)}
                          disabled={task.completed <= 0}
                          className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold hover:bg-emerald-200 dark:hover:bg-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-lg font-black text-emerald-950 flex-1 text-center">{task.completed} / {task.total}</span>
                        <button
                          onClick={() => handleTempTaskUpdate(index, 1, true)}
                          disabled={task.completed >= task.total}
                          className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setIsUpdateProgressOpen(false);
                  setTempProjectData(null);
                }}
                className="flex-1 py-2.5 sm:py-3 rounded-2xl border border-gray-200 text-black font-bold hover:bg-gray-50 transition-all cursor-pointer bg-white"
              >
                Cancel
              </button>
              <button
                onClick={handleProgressSubmit}
                className="flex-1 py-2.5 sm:py-3 rounded-2xl bg-blue-600 text-white font-black hover:shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer border-none"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Image Lightbox Modal */}
      {fullImageModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setFullImageModal({ isOpen: false, src: '', title: '' })}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <div className="relative max-w-4xl max-h-[90vh] z-10 flex flex-col items-center justify-center pointer-events-auto">
            <button
              type="button"
              onClick={() => setFullImageModal({ isOpen: false, src: '', title: '' })}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer border-none"
              title="Close"
            >
              <X size={24} />
            </button>
            <img
              src={fullImageModal.src}
              alt={fullImageModal.title || 'Profile Picture'}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/20"
            />
            {fullImageModal.title && (
              <p className="mt-4 text-white font-bold text-sm sm:text-base tracking-wide bg-black/70 px-6 py-2 rounded-full border border-white/10 backdrop-blur-sm">
                {fullImageModal.title}
              </p>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;