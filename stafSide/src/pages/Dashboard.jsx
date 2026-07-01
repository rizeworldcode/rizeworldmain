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
  GraduationCap
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
  const [delayWorkForm, setDelayWorkForm] = useState({
    type: 'reel',
    publishedLink: '',
    totalAccountReach: 0,
    totalAccountViews: 0,
    clientEmail: '',
    extra: false,
    count: 1,
    extraName: ''
  });
  const [delayWorkLoading, setDelayWorkLoading] = useState(false);
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
    setStaffInfo(updatedStaff);

    const leaveDay = checkLeaveDay(updatedStaff);
    setIsLeaveDay(leaveDay);

    if (!leaveDay) {
      const canClockOut = updatedStaff.clock_status === 'clock_in';
      const canClockIn = updatedStaff.clock_status === 'clock_out' || !updatedStaff.clock_status;
      
      if (updatedStaff.todayClock && updatedStaff.todayClock.sessions) {
        const todayClock = updatedStaff.todayClock;
        const sessions = todayClock.sessions || [];
        setAttendanceStatus({
          canClockIn: canClockIn,
          canClockOut: canClockOut,
          sessions: sessions,
          totalHours: todayClock.totalHours || '-'
        });
      } else {
        setAttendanceStatus({
          canClockIn: canClockIn,
          canClockOut: canClockOut,
          sessions: [],
          totalHours: '-'
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
    const staffId = staffInfo.id || staffInfo._id;
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
    // Only track if user is exactly "Sales Team"
    if (staffInfo.role !== 'Sales Team') return;

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
    const allowedRolesForMasterPool = ['technical tl', 'digital marketing specialist'];
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
    // Only fetch Delay Work and Clients if user is a Data Analyst
    const staffInfo = JSON.parse(localStorage.getItem('staffInfo') || '{}');
    if (staffInfo.role?.toLowerCase() === 'data analyst') {
      fetchDelayWork();
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
        const todayClock = result.data.todayClock;
        const sessions = todayClock.sessions || [];
        const lastSession = sessions.length > 0 ? sessions[sessions.length - 1] : null;

        setAttendanceStatus({
          canClockIn: false,
          canClockOut: true,
          sessions: sessions,
          totalHours: todayClock.totalHours || '-'
        });

        // Update localStorage with full staff data
        localStorage.setItem('staffInfo', JSON.stringify(result.data));
        syncStaffDataStates(result.data);

        alert(`Clocked in successfully at ${lastSession.clockIn}`);
      } else {
        alert(result.message || 'Failed to clock in');
      }
    } catch (err) {
      console.error(err);
      alert('Network error: Could not connect to server.');
    }
  };

  const handleClockOut = async () => {
    const staffInfo = JSON.parse(localStorage.getItem('staffInfo') || '{}');
    const staffId = staffInfo.id || staffInfo._id;
    
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
        const todayClock = result.data.todayClock || {};
        const sessions = todayClock.sessions || [];
        const lastSession = sessions.length > 0 ? sessions[sessions.length - 1] : null;
        const clockOutTime = lastSession?.clockOut || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        setAttendanceStatus({
          canClockIn: true,
          canClockOut: false,
          sessions: sessions,
          totalHours: todayClock.totalHours || '-'
        });

        // Update localStorage with full staff data
        localStorage.setItem('staffInfo', JSON.stringify(result.data));
        syncStaffDataStates(result.data);

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
          totalAccountReach: 0,
          totalAccountViews: 0,
          clientEmail: '',
          extra: false,
          count: 1,
          extraName: ''
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
        body: JSON.stringify({ todayWork })
      });
      const result = await response.json();
      if (result.success) {
        // Update localStorage and state
        localStorage.setItem('staffInfo', JSON.stringify(result.data));
        syncStaffDataStates(result.data);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete task');
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
    <div className="space-y-10 pb-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl sm:text-4xl font-black text-black tracking-tight"
          >
            {greeting}, {JSON.parse(localStorage.getItem('staffInfo') || '{}')?.name || 'Alex'}
          </motion.h2>
          <p className="text-black font-bold mt-2 text-sm sm:text-base">Here's what's happening with your work today.</p>
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
      {staffInfo.role === 'Sales Team' && gpsError && (
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

      {staffInfo.role === 'Sales Team' && !gpsError && (
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

      {/* Capture Actions for Sales Team */}
      {staffInfo.role === 'Sales Team' && (
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
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#f472b6] flex items-center justify-center text-white font-black text-2xl sm:text-3xl shadow-lg">
              {staffInfo?.name?.charAt(0) || 'U'}
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
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
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
        className="clay-card p-6 sm:p-8"
      >
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
                    ['technical tl', 'digital marketing'].includes(staffInfo.role?.toLowerCase())
                      ? 'cursor-pointer hover:scale-105 active:scale-95'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  } ${
                    task.completed 
                      ? 'bg-emerald-500/20 text-emerald-600' 
                      : 'bg-gray-500/20 text-black'
                  }`}
                  title={['technical tl', 'digital marketing'].includes(staffInfo.role?.toLowerCase()) ? 'Toggle complete' : 'Approval by admin only'}
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
                {!task.isExtra && (
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
      {['technical tl', 'digital marketing'].includes(staffInfo.role?.toLowerCase()) && (
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
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#f472b6] flex items-center justify-center text-white font-black text-sm">
                      {member.name.charAt(0)}
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

                {/* Today's Tasks */}
                <div>
                  <h5 className="text-[10px] font-black text-black uppercase tracking-widest mb-3 border-b border-black/5 pb-1">Today's Assigned Tasks</h5>
                  {member.todayTasks && member.todayTasks.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {member.todayTasks.map((task, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-black/5 hover:bg-white/10 transition-colors">
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

      {/* Delay Work Section - Only for Data Analysts */}
      {staffInfo.role?.toLowerCase() === 'data analyst' && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="clay-card p-6 sm:p-8"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-black text-black uppercase tracking-tight flex items-center gap-2">
              <Clock size={20} className="text-amber-500" />
              Daily Work
            </h3>
            <button 
              onClick={() => setIsAddDelayWorkOpen(true)}
              className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-2xl text-xs sm:text-sm font-black uppercase tracking-widest shadow-lg hover:shadow-orange-500/30 transition-all active:scale-95 w-fit"
            >
              <Plus size={16} />
              Add Daily Work
            </button>
          </div>
          
          {delayWorkLoading ? (
            <div className="py-10 text-center">
              <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-sm font-black text-black uppercase tracking-widest mt-4">Loading Daily Work...</p>
            </div>
          ) : delayWork.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-2xl clay-inset bg-amber-100 flex items-center justify-center">
                <Clock size={32} className="text-amber-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-black mb-2">No daily work added yet</h3>
              <p className="text-black font-semibold">Add your first daily work entry above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {delayWork.map((work, index) => (
                <div key={index} className="clay-card p-4 sm:p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-wrap gap-2">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                        work.type === 'reel' ? "bg-purple-100 text-purple-600" : 
                        work.type === 'post' ? "bg-blue-100 text-blue-600" : 
                        work.type === 'shot' ? "bg-pink-100 text-pink-600" :
                        work.type === 'extra' ? "bg-orange-100 text-orange-600" :
                        "bg-emerald-100 text-emerald-600"
                      )}>
                        {work.type}
                      </span>
                      {work.extra && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-600">
                          Extra
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-[10px] font-black text-black uppercase tracking-widest mb-1">Client</p>
                    <p className="text-sm font-bold text-black">{work.clientId?.name || 'N/A'}</p>
                  </div>
                   {work.type === 'extra' ? (
                    <>
                      {work.extraName && (
                        <div className="mb-3">
                          <p className="text-[10px] font-black text-black uppercase tracking-widest mb-1">Extra Work Detail</p>
                          <p className="text-sm font-bold text-black">{work.extraName}</p>
                        </div>
                      )}
                      <div className="mb-4">
                        <p className="text-[10px] font-black text-black uppercase tracking-widest mb-1">Count</p>
                        <p className="text-xl sm:text-2xl font-black text-black">{work.count || 1}</p>
                      </div>
                    </>
                  ) : work.type === 'shoot' ? (
                    <div className="mb-4">
                      <p className="text-[10px] font-black text-black uppercase tracking-widest mb-1">Shoot Count</p>
                      <p className="text-xl sm:text-2xl font-black text-black">{work.count || 1}</p>
                    </div>
                  ) : (
                    <>
                      {work.publishedLink && (
                        <div className="mb-3">
                          <p className="text-[10px] font-black text-black uppercase tracking-widest mb-1">Published Link</p>
                          <a href={work.publishedLink} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-600 hover:underline break-all">
                            {work.publishedLink}
                          </a>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-[10px] font-black text-black uppercase tracking-widest mb-1">Account Reach</p>
                          <p className="text-xl sm:text-2xl font-black text-black">{(work.totalAccountReach || 0).toLocaleString('en-IN')}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-black uppercase tracking-widest mb-1">Account Views</p>
                          <p className="text-xl sm:text-2xl font-black text-black">{(work.totalAccountViews || 0).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    </>
                  )}
                  <div>
                    <p className="text-[10px] font-black text-black uppercase tracking-widest mb-1">Date Added</p>
                    <p className="text-sm font-bold text-gray-600">
                      {new Date(work.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.section>
      )}

      {/* Add Delay Work Modal - Only for Data Analysts */}
      {staffInfo.role?.toLowerCase() === 'data analyst' && isAddDelayWorkOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="clay-card w-full max-w-md p-6 sm:p-8 relative">
            <button
              onClick={() => setIsAddDelayWorkOpen(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 clay-flat rounded-2xl flex items-center justify-center text-black hover:clay-inset hover:text-rose-500 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <h3 className="text-xl sm:text-2xl font-black text-black mb-6 sm:mb-8 flex items-center gap-2">
              <Clock className="text-amber-500" />
              Add Daily Work
            </h3>
             <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="text-[10px] font-black text-black uppercase tracking-widest block mb-1 sm:mb-2">Client Email</label>
                <select 
                  className="w-full p-3 sm:p-4 clay-inset rounded-2xl text-sm font-bold text-black focus:outline-none cursor-pointer"
                  value={delayWorkForm.clientEmail}
                  onChange={(e) => setDelayWorkForm({ ...delayWorkForm, clientEmail: e.target.value })}
                >
                  <option value="">Select Client Email</option>
                  {clients.map((c) => (
                    <option key={c._id || c.id} value={c.email}>
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-black uppercase tracking-widest block mb-1 sm:mb-2">Type</label>
                <select 
                  className="w-full p-3 sm:p-4 clay-inset rounded-2xl text-sm font-bold text-black focus:outline-none cursor-pointer"
                  value={delayWorkForm.type}
                  onChange={(e) => setDelayWorkForm({ ...delayWorkForm, type: e.target.value })}
                >
                  <option value="reel">Reel</option>
                  <option value="post">Post</option>
                  <option value="shoot">Shoot</option>
                  <option value="extra">Extra</option>
                </select>
              </div>

              {delayWorkForm.type !== 'extra' && (
                <div className="flex gap-6 py-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={delayWorkForm.extra}
                      onChange={(e) => setDelayWorkForm({ ...delayWorkForm, extra: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                    />
                    <span className="text-xs font-bold text-black uppercase tracking-wider">Extra</span>
                  </label>
                </div>
              )}

              {delayWorkForm.type === 'extra' ? (
                <>
                  <div>
                    <label className="text-[10px] font-black text-black uppercase tracking-widest block mb-1 sm:mb-2">Extra</label>
                    <input 
                      type="text" 
                      className="w-full p-3 sm:p-4 clay-inset rounded-2xl text-sm font-bold text-black focus:outline-none"
                      placeholder="Enter extra work name"
                      value={delayWorkForm.extraName || ''}
                      onChange={(e) => setDelayWorkForm({ ...delayWorkForm, extraName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-black uppercase tracking-widest block mb-1 sm:mb-2">Count</label>
                    <input 
                      type="number" 
                      min="1"
                      className="w-full p-3 sm:p-4 clay-inset rounded-2xl text-sm font-bold text-black focus:outline-none"
                      placeholder="1"
                      value={delayWorkForm.count}
                      onChange={(e) => setDelayWorkForm({ ...delayWorkForm, count: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                </>
              ) : delayWorkForm.type === 'shoot' ? (
                <div>
                  <label className="text-[10px] font-black text-black uppercase tracking-widest block mb-1 sm:mb-2">Count</label>
                  <input 
                    type="number" 
                    min="1"
                    className="w-full p-3 sm:p-4 clay-inset rounded-2xl text-sm font-bold text-black focus:outline-none"
                    placeholder="1"
                    value={delayWorkForm.count}
                    onChange={(e) => setDelayWorkForm({ ...delayWorkForm, count: parseInt(e.target.value) || 1 })}
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-[10px] font-black text-black uppercase tracking-widest block mb-1 sm:mb-2">Published Link</label>
                    <input 
                      type="text" 
                      className="w-full p-3 sm:p-4 clay-inset rounded-2xl text-sm font-bold text-black focus:outline-none"
                      placeholder="https://..."
                      value={delayWorkForm.publishedLink}
                      onChange={(e) => setDelayWorkForm({ ...delayWorkForm, publishedLink: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-[10px] font-black text-black uppercase tracking-widest block mb-1 sm:mb-2">Total Account Reach</label>
                      <input 
                        type="number" 
                        className="w-full p-3 sm:p-4 clay-inset rounded-2xl text-sm font-bold text-black focus:outline-none"
                        placeholder="0"
                        value={delayWorkForm.totalAccountReach}
                        onChange={(e) => setDelayWorkForm({ ...delayWorkForm, totalAccountReach: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-black uppercase tracking-widest block mb-1 sm:mb-2">Total Account Views</label>
                      <input 
                        type="number" 
                        className="w-full p-3 sm:p-4 clay-inset rounded-2xl text-sm font-bold text-black focus:outline-none"
                        placeholder="0"
                        value={delayWorkForm.totalAccountViews}
                        onChange={(e) => setDelayWorkForm({ ...delayWorkForm, totalAccountViews: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                </>
              )}
              <div className="flex gap-3 mt-6 sm:mt-8">
                <button onClick={() => setIsAddDelayWorkOpen(false)} className="flex-1 py-2.5 sm:py-3 rounded-2xl border border-gray-200 text-black font-bold hover:bg-gray-50 transition-all">Cancel</button>
                <button onClick={handleAddDelayWork} className="flex-1 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white font-black hover:shadow-orange-500/30 transition-all">Add Daily Work</button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default Dashboard;
