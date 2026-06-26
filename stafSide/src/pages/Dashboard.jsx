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
  Calendar,
  X
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

// Calculate payout salary based on attendance (same logic as admin side)
const calculatePayout = (staffInfo) => {
  const baseSalary = staffInfo.monthlySalary || 0;
  const oneDaySalary = baseSalary / 30;
  
  // Get current date details
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonthSoFar = today.getDate(); // Calculation up to today
  
  const monthlyAttendance = (staffInfo.attendance || []).filter(record => {
    const d = new Date(record.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  // Count present and half-days from recorded attendance
  const presentDays = monthlyAttendance.filter(r => r.status === 'Present').length;
  const halfDays = monthlyAttendance.filter(r => r.status === 'Half-Day').length;
  const explicitlyOnLeave = monthlyAttendance.filter(r => r.status === 'On Leave').length;

  // Days not clocked in at all
  const daysRecorded = monthlyAttendance.length;
  const absentDays = Math.max(0, daysInMonthSoFar - daysRecorded);

  const totalFullLeaves = explicitlyOnLeave + absentDays;

  // 1st leave is casual (no deduction)
  const deductibleLeaves = Math.max(0, totalFullLeaves - 1);
  const deduction = (deductibleLeaves * oneDaySalary) + (halfDays * (oneDaySalary / 2));
  
  const payout = Math.round(baseSalary - deduction);
  return {
    payout,
    fullLeaves: totalFullLeaves,
    halfDays,
    isCasualUsed: totalFullLeaves > 0
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

  const getApiUrl = (endpoint) => {
    const base = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:45000/api'
      : 'https://rizeworldmain.onrender.com/api';
    return `${base}${endpoint}`;
  };
  
  // Get staff info from localStorage
  const staffInfo = JSON.parse(localStorage.getItem('staffInfo') || '{}');
  const baseSalary = staffInfo.monthlySalary || 0;
  const { payout, fullLeaves, halfDays } = calculatePayout(staffInfo);
  const chartData = generateChartData(staffInfo);

  // Check if today is a leave day or Sunday
  const checkLeaveDay = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if Sunday
    if (today.getDay() === 0) {
      return true;
    }
    
    // Check leaves array
    if (staffInfo.leaves && Array.isArray(staffInfo.leaves)) {
      const hasLeave = staffInfo.leaves.some(leave => {
        const leaveDate = new Date(leave.date);
        leaveDate.setHours(0, 0, 0, 0);
        return leaveDate.getTime() === today.getTime();
      });
      if (hasLeave) return true;
    }
    
    // Check attendance array for "On Leave"
    if (staffInfo.attendance && Array.isArray(staffInfo.attendance)) {
      const hasLeaveAttendance = staffInfo.attendance.some(att => {
        const attDate = new Date(att.date);
        attDate.setHours(0, 0, 0, 0);
        return attDate.getTime() === today.getTime() && att.status === 'On Leave';
      });
      return hasLeaveAttendance;
    }
    
    return false;
  };

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
    const staffInfoLocal = JSON.parse(localStorage.getItem('staffInfo') || '{}');
    const staffId = staffInfoLocal.id || staffInfoLocal._id;
    if (staffId) {
      socketRef.current.on(`staff-clock-update-${staffId}`, (updatedStaff) => {
        // Update localStorage
        localStorage.setItem('staffInfo', JSON.stringify(updatedStaff));
        
        // Update local state
        const leaveDay = checkLeaveDay();
        setIsLeaveDay(leaveDay);
        
        if (!leaveDay) {
          const canClockOut = updatedStaff.clock_status === 'clock_in';
          const canClockIn = updatedStaff.clock_status === 'clock_out' || !updatedStaff.clock_status;
          
          const todayClock = updatedStaff.todayClock;
          const sessions = todayClock?.sessions || [];
          
          setAttendanceStatus({
            canClockIn: canClockIn,
            canClockOut: canClockOut,
            sessions: sessions,
            totalHours: todayClock?.totalHours || '-'
          });
          
          // Also update todayTasks
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const todayWorkRec = updatedStaff.work?.find(w => 
            new Date(w.date) >= today && new Date(w.date) < tomorrow
          );
          if (todayWorkRec && todayWorkRec.tasks) {
            setTodayTasks(todayWorkRec.tasks);
          }
        }
      });
    }
    
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 60000);

    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
    
    // Check if leave day
    const leaveDay = checkLeaveDay();
    setIsLeaveDay(leaveDay);

    if (!leaveDay) {
      // Fetch initial status from localStorage
      const staffInfo = JSON.parse(localStorage.getItem('staffInfo') || '{}');
      
      // Use clock_status to determine button states
      const canClockOut = staffInfo.clock_status === 'clock_in';
      const canClockIn = staffInfo.clock_status === 'clock_out' || !staffInfo.clock_status;
      
      // Check for today's clock record using todayClock from login
      if (staffInfo.todayClock && staffInfo.todayClock.sessions) {
        // Employee has clock record for today
        const todayClock = staffInfo.todayClock;
        const sessions = todayClock.sessions || [];
        
        setAttendanceStatus({
          canClockIn: canClockIn,
          canClockOut: canClockOut,
          sessions: sessions,
          totalHours: todayClock.totalHours || '-'
        });
      } else {
        // Employee hasn't clocked in yet today OR no todayClock record
        // Show clock in button, hide clock out button
        setAttendanceStatus({
          canClockIn: canClockIn,
          canClockOut: canClockOut,
          sessions: [],
          totalHours: '-'
        });
      }
      
      // Check if we have today's work
      if (staffInfo.work) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const todayWorkRec = staffInfo.work.find(w => 
          new Date(w.date) >= today && new Date(w.date) < tomorrow
        );
        if (todayWorkRec && todayWorkRec.tasks) {
          setTodayTasks(todayWorkRec.tasks);
        }
      }
    }

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
      alert('Only Data Analysts can add delay work');
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
      type: delayWorkForm.type,
      clientEmail: delayWorkForm.clientEmail,
      extra: delayWorkForm.type === 'extra' ? true : delayWorkForm.extra,
      staffId
    };

    if (delayWorkForm.type === 'extra') {
      payload.extraName = delayWorkForm.extraName;
      payload.count = delayWorkForm.count || 1;
      payload.publishedLink = '';
      payload.totalAccountReach = 0;
      payload.totalAccountViews = 0;
    } else if (delayWorkForm.type === 'shoot') {
      payload.count = delayWorkForm.count || 1;
      payload.publishedLink = '';
      payload.totalAccountReach = 0;
      payload.totalAccountViews = 0;
    } else {
      payload.publishedLink = delayWorkForm.publishedLink;
      payload.totalAccountReach = delayWorkForm.totalAccountReach;
      payload.totalAccountViews = delayWorkForm.totalAccountViews;
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
        alert(result.message || 'Failed to add delay work');
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
        // Update local state
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const todayWorkRec = result.data.work.find(w => 
          new Date(w.date) >= today && new Date(w.date) < tomorrow
        );
        if (todayWorkRec && todayWorkRec.tasks) {
          setTodayTasks(todayWorkRec.tasks);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update task');
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
        setTodayTasks(updatedTasks);
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
        setTodayTasks(updatedTasks);
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

      {/* Employee Info Card */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="clay-card p-6 sm:p-10"
      >
        <div>
          <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#f472b6] flex items-center justify-center text-white font-black text-2xl sm:text-3xl shadow-lg">
              {JSON.parse(localStorage.getItem('staffInfo') || '{}')?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="text-xl sm:text-3xl font-black text-black">{JSON.parse(localStorage.getItem('staffInfo') || '{}')?.name || 'Employee'}</h3>
              <p className="text-sm sm:text-lg font-bold text-black mt-1">{JSON.parse(localStorage.getItem('staffInfo') || '{}')?.department || 'N/A'}</p>
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
          extra={`Payout: ₹${payout.toLocaleString()} | Leaves: ${fullLeaves} | Half Days: ${halfDays}`}
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
                <div className={`p-1.5 rounded-lg transition-all ${
                  task.completed 
                    ? 'bg-emerald-500/20 text-emerald-600' 
                    : 'bg-gray-500/20 text-black'
                }`}>
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
              Delay Work
            </h3>
            <button 
              onClick={() => setIsAddDelayWorkOpen(true)}
              className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-2xl text-xs sm:text-sm font-black uppercase tracking-widest shadow-lg hover:shadow-orange-500/30 transition-all active:scale-95 w-fit"
            >
              <Plus size={16} />
              Add Delay Work
            </button>
          </div>
          
          {delayWorkLoading ? (
            <div className="py-10 text-center">
              <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-sm font-black text-black uppercase tracking-widest mt-4">Loading Delay Work...</p>
            </div>
          ) : delayWork.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-2xl clay-inset bg-amber-100 flex items-center justify-center">
                <Clock size={32} className="text-amber-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-black mb-2">No delay work added yet</h3>
              <p className="text-black font-semibold">Add your first delay work entry above!</p>
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
              Add Delay Work
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
                <button onClick={handleAddDelayWork} className="flex-1 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white font-black hover:shadow-orange-500/30 transition-all">Add Delay Work</button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default Dashboard;
