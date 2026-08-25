// DashboardScreen with Full-Screen Zone Shading
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator, 
  Alert,
  Platform,
  RefreshControl,
  Image,
  Modal,
  StatusBar
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { FileSystemUploadType } from 'expo-file-system/legacy';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  User, 
  Users, 
  Briefcase, 
  Clock, 
  LogOut, 
  LogIn,
  Plus, 
  X, 
  CheckSquare, 
  Square,
  Calendar,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Bell,
  GraduationCap,
  CreditCard,
  BookOpen
} from 'lucide-react-native';

// Helper to check if leave day (Sunday, explicitly on leave, or leave array match)
const checkLeaveDay = (info) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (today.getDay() === 0) return true;
  
  if (info.leaves && Array.isArray(info.leaves)) {
    const hasLeave = info.leaves.some(leave => {
      const leaveDate = new Date(leave.date);
      leaveDate.setHours(0, 0, 0, 0);
      return leaveDate.getTime() === today.getTime();
    });
    if (hasLeave) return true;
  }
  
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

const calculatePayout = (info) => {
  const baseSalary = info.monthlySalary || 0;
  const hourlyRate = baseSalary / EXPECTED_MONTHLY_HOURS;

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Determine the start day: if employee was added to the website this month, start from that date; else day 1
  const createdAt = info.createdAt ? new Date(info.createdAt) : null;
  const startDay = (
    createdAt &&
    createdAt.getMonth() === currentMonth &&
    createdAt.getFullYear() === currentYear
  ) ? createdAt.getDate() : 1;

  // --- Step 1: Sum actual hours from clock records ---
  const monthlyClockRecords = (info.clock || []).filter(record => {
    const d = new Date(record.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  let totalHoursWorked = 0;
  monthlyClockRecords.forEach(record => {
    const actualHrs = parseTotalHours(record.totalHours);
    if (actualHrs > 9) {
      totalHoursWorked += 8.5 + (actualHrs - 9);
    } else if (actualHrs >= 8.5) {
      totalHoursWorked += 8.5;
    } else {
      totalHoursWorked += actualHrs;
    }
  });

  // Build set of credited dates
  const creditedDates = new Set(
    monthlyClockRecords.map(r => new Date(r.date).toDateString())
  );

  // --- Step 2: Credit 8.5 hrs for each SUNDAY (from startDay up to today) ---
  for (let day = startDay; day <= today.getDate(); day++) {
    const d = new Date(currentYear, currentMonth, day);
    if (d.getDay() === 0 && !creditedDates.has(d.toDateString())) {
      totalHoursWorked += STANDARD_HOURS_PER_DAY;
      creditedDates.add(d.toDateString());
    }
  }

  // --- Step 3: Credit 8.5 hrs for each admin-declared leave ---
  (info.leaves || []).forEach(leave => {
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
  const halfDayRecords = (info.attendance || []).filter(att => {
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
    // 1st absent day = auto casual leave → credit 8.5 hrs
    totalHoursWorked += STANDARD_HOURS_PER_DAY;
    creditedDates.add(absentDays[0].toDateString());
    casualLeaveUsed = true;
  } else if (halfDayLeaveUnits > 0) {
    // No absent days but 2+ half-days → use casual leave for 1st pair
    // Top up each of the 2 half-days to 4.25 hrs (half of 8.5 hrs)
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

const DashboardScreen = ({ staffInfo: initialStaffInfo, token, onLogout, onNavigate, getApiUrl, onUpdateStaffInfo, refreshStaffInfo }) => {
  const [staffInfo, setStaffInfo] = useState(initialStaffInfo);

  useEffect(() => {
    if (initialStaffInfo) {
      setStaffInfo(initialStaffInfo);
      syncStaffDataStates(initialStaffInfo, false);
    }
  }, [initialStaffInfo]);

  const userRole = (staffInfo.role || '').toLowerCase();
  const userDept = (staffInfo.department || '').toLowerCase();

  const isHR = userRole === 'hr';
  const isCounselor = userRole === 'counselor';
  const isSalesTeam = userRole === 'sales team' || userRole === 'sales';
  const isVisitingCardsAllowed = ['admin', 'data analyst'].includes(userRole);
  const isMarketing = userDept.includes('marketing') || userRole.includes('marketing');
  const [todayTasks, setTodayTasks] = useState([]);
  const [newTaskInput, setNewTaskInput] = useState('');
  const [isLeaveDay, setIsLeaveDay] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState({
    canClockIn: true,
    canClockOut: false,
    sessions: [],
    totalHours: '-'
  });

  // Payout states
  const [payoutInfo, setPayoutInfo] = useState({ payout: 0, fullLeaves: 0, halfDays: 0 });

  // TL Master Pool
  const [masterPool, setMasterPool] = useState([]);
  const [newPoolItem, setNewPoolItem] = useState('');

  // Reportees
  const [reportees, setReportees] = useState([]);
  const [loadingReportees, setLoadingReportees] = useState(false);

  // Refresh
  const [refreshing, setRefreshing] = useState(false);

  // Notifications states
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const getProfilePicUrl = () => {
    if (!staffInfo.profilePic) return null;
    if (staffInfo.profilePic.startsWith('http://') || staffInfo.profilePic.startsWith('https://')) {
      return staffInfo.profilePic;
    }
    const base = getApiUrl('').replace('/api', '');
    return `${base}${staffInfo.profilePic}`;
  };

  const handleSelectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'You need to allow library access to upload a photo.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (pickerResult.canceled) return;

    const selectedAsset = pickerResult.assets[0];
    uploadProfilePic(selectedAsset);
  };

  const uploadProfilePic = async (asset) => {
    const staffId = staffInfo.id || staffInfo._id;
    console.log('[Upload Debug] Selected Asset:', asset);

    if (!asset || !asset.uri) {
      Alert.alert('Error', 'No valid image file selected.');
      return;
    }

    const uri = asset.uri;
    console.log('[Upload Debug] Uploading natively via expo-file-system:', uri);

    try {
      const response = await FileSystem.uploadAsync(
        getApiUrl(`/staff/${staffId}/profile-pic`),
        uri,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          httpMethod: 'POST',
          uploadType: FileSystemUploadType.MULTIPART,
          fieldName: 'profilePic'
        }
      );

      console.log('[Upload Debug] Native Response status:', response.status);
      const result = JSON.parse(response.body);

      if (result.success) {
        if (onUpdateStaffInfo) onUpdateStaffInfo(result.data);
        syncStaffDataStates(result.data);
        Alert.alert('Success', 'Profile image updated successfully.');
      } else {
        Alert.alert('Upload Failed', result.message || 'Error uploading file.');
      }
    } catch (err) {
      console.error('[Upload Debug] Error during native upload:', err);
      Alert.alert('Error', 'Network error uploading profile image.');
    }
  };

  const fetchNotifications = async () => {
    const staffId = staffInfo.id || staffInfo._id;
    if (!staffId) return;

    try {
      const response = await fetch(getApiUrl(`/notifications/staff/${staffId}`), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.success) {
        setNotifications(result.data || []);
      }
    } catch (err) {
      console.error('[Notification Debug] Failed to fetch:', err);
    }
  };

  const markAsRead = async (notificationId) => {
    const staffId = staffInfo.id || staffInfo._id;
    try {
      const response = await fetch(getApiUrl(`/notifications/${notificationId}/read/${staffId}`), {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.success) {
        setNotifications(prev => prev.map(n => 
          n._id === notificationId ? { ...n, isRead: true } : n
        ));
      }
    } catch (err) {
      console.error('[Notification Debug] Failed to mark read:', err);
    }
  };

  const syncStaffDataStates = (info, notifyParent = true) => {
    if (!info) return;
    setStaffInfo(info);
    if (notifyParent && onUpdateStaffInfo) {
      onUpdateStaffInfo(info);
    }
    
    const leaveDay = checkLeaveDay(info);
    setIsLeaveDay(leaveDay);

    if (!leaveDay) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayClock = info.todayClock || (info.clock && info.clock.find(c => {
        const d = new Date(c.date);
        return d >= today && d < tomorrow;
      }));

      const sessions = todayClock?.sessions || [];
      const lastSession = sessions.length > 0 ? sessions[sessions.length - 1] : null;
      const hasOpenSession = lastSession && lastSession.clockIn && !lastSession.clockOut;

      const canClockOut = info.clock_status === 'clock_in' || hasOpenSession;
      const canClockIn = !canClockOut;

      setAttendanceStatus({
        canClockIn,
        canClockOut,
        sessions,
        totalHours: todayClock?.totalHours || '-'
      });
    }

    // Sync Today's Work Tasks
    if (info.work) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayWorkRec = info.work.find(w => 
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

    // Calculate salary payout
    setPayoutInfo(calculatePayout(info));
  };

  const fetchStaffInfo = async () => {
    const staffId = staffInfo.id || staffInfo._id;
    if (!staffId) return;
    try {
      const response = await fetch(getApiUrl(`/staff/${staffId}`), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success && result.data) {
        syncStaffDataStates(result.data, true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReportees = async () => {
    setLoadingReportees(true);
    try {
      const response = await fetch(getApiUrl('/staff/my-reportees'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setReportees(result.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReportees(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchStaffInfo(), fetchReportees(), fetchNotifications()]);
    setRefreshing(false);
  };

  useEffect(() => {
    syncStaffDataStates(staffInfo);
    fetchReportees();
    fetchStaffInfo();
    fetchNotifications();

    const intervalId = setInterval(fetchNotifications, 30000);

    // Load TL Master Pool
    const loadMasterPool = async () => {
      try {
        const stored = await AsyncStorage.getItem('tlMasterPool');
        if (stored) {
          setMasterPool(JSON.parse(stored));
        }
      } catch (e) {
        console.error(e);
      }
    };
    if (staffInfo.role === 'Technical TL & Digital Marketing Specialist') {
      loadMasterPool();
    }

    return () => clearInterval(intervalId);
  }, []);

  // Clock Actions
  const handleClockIn = async () => {
    const staffId = staffInfo.id || staffInfo._id;
    try {
      const response = await fetch(getApiUrl(`/staff/${staffId}/clock-in`), {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.success) {
        syncStaffDataStates(result.data, true);
        fetchStaffInfo();
        const todayClock = result.data.todayClock || (result.data.clock && result.data.clock[result.data.clock.length - 1]);
        const sessions = todayClock?.sessions || [];
        const lastSession = sessions[sessions.length - 1];
        Alert.alert('Success', `Clocked in successfully at ${lastSession?.clockIn || ''}`);
      } else {
        Alert.alert('Clock In Failed', result.message || 'Verification failed');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Network error. Make sure you are connected to Office WiFi.');
    }
  };

  const handleClockOut = async () => {
    const staffId = staffInfo.id || staffInfo._id;
    try {
      const response = await fetch(getApiUrl(`/staff/${staffId}/clock-out`), {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.success) {
        syncStaffDataStates(result.data, true);
        fetchStaffInfo();
        Alert.alert('Success', 'Clocked out successfully');
      } else {
        Alert.alert('Clock Out Failed', result.message || 'Verification failed');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Network error. Make sure you are connected to Office WiFi.');
    }
  };

  // Today's Work Handlers
  const handleToggleTask = async (taskIndex) => {
    if (staffInfo.role === 'Technical TL & Digital Marketing Specialist') {
      Alert.alert('Auth Blocked', 'Tasks for Technical TL role can only be completed/approved by the Admin.');
      return;
    }

    const staffId = staffInfo.id || staffInfo._id;
    try {
      const response = await fetch(getApiUrl(`/staff/${staffId}/toggle-task`), {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ taskIndex })
      });
      const result = await response.json();
      if (result.success) {
        syncStaffDataStates(result.data, true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTask = async () => {
    if (!newTaskInput.trim()) return;
    const staffId = staffInfo.id || staffInfo._id;
    const updatedTasks = [...todayTasks, { name: newTaskInput.trim(), completed: false }];
    const todayWork = updatedTasks.map(t => t.name).join(', ');

    try {
      const response = await fetch(getApiUrl(`/staff/${staffId}/today-work`), {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ todayWork })
      });
      const result = await response.json();
      if (result.success) {
        syncStaffDataStates(result.data, true);
        setNewTaskInput('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskIndex) => {
    const staffId = staffInfo.id || staffInfo._id;
    const updatedTasks = todayTasks.filter((_, i) => i !== taskIndex);
    const todayWork = updatedTasks.map(t => t.name).join(', ');

    try {
      const response = await fetch(getApiUrl(`/staff/${staffId}/today-work`), {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ todayWork })
      });
      const result = await response.json();
      if (result.success) {
        syncStaffDataStates(result.data, true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Satisfaction Level Handler (Red Zone, Yellow Zone, Green Zone)
  const handleUpdateSatisfaction = async (memberId, level) => {
    const allowedEmployeeIds = ['RW-9752', 'RW-1702'];
    if (!staffInfo.employeeId || !allowedEmployeeIds.includes(staffInfo.employeeId)) {
      Alert.alert('Access Denied', 'Only authorized managers (RW-9752 or RW-1702) can mark satisfaction levels.');
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
        Alert.alert('Updated', `Work satisfaction set to ${level.toUpperCase()}`);
      } else {
        Alert.alert('Error', result.message || 'Failed to update satisfaction level');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to update satisfaction level');
    }
  };

  // Master Pool Handlers
  const handleAddToPool = async () => {
    if (!newPoolItem.trim()) return;
    const updatedPool = [...masterPool, newPoolItem.trim()];
    setMasterPool(updatedPool);
    await AsyncStorage.setItem('tlMasterPool', JSON.stringify(updatedPool));
    setNewPoolItem('');
  };

  const handleRemoveFromPool = async (index) => {
    const itemToRemove = masterPool[index];
    const updatedPool = masterPool.filter((_, i) => i !== index);
    setMasterPool(updatedPool);
    await AsyncStorage.setItem('tlMasterPool', JSON.stringify(updatedPool));
    
    if (todayTasks.some(t => t.name === itemToRemove)) {
      handleToggleSelectTask(itemToRemove, false);
    }
  };

  const handleToggleSelectTask = async (taskName, selected) => {
    const staffId = staffInfo.id || staffInfo._id;
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
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ todayWork })
      });
      const result = await response.json();
      if (result.success) {
        syncStaffDataStates(result.data, true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalDaysText = staffInfo.joiningDate 
    ? Math.floor((new Date() - new Date(staffInfo.joiningDate)) / (1000 * 60 * 60 * 24)) 
    : '0';

  const formattedJoiningDate = staffInfo.joiningDate 
    ? new Date(staffInfo.joiningDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : 'N/A';

  const getZoneGradientColors = () => {
    switch (staffInfo.todaySatisfaction) {
      case 'red':
        return ['#fee2e2', '#fef2f2', '#f8fafc'];
      case 'yellow':
        return ['#fef3c7', '#fffbeb', '#f8fafc'];
      case 'green':
        return ['#dcfce7', '#f0fdf4', '#f8fafc'];
      default:
        return ['#f8fafc', '#f1f5f9', '#f8fafc'];
    }
  };

  const getZoneBorderColor = () => {
    switch (staffInfo.todaySatisfaction) {
      case 'red':
        return '#ef4444';
      case 'yellow':
        return '#f59e0b';
      case 'green':
        return '#10b981';
      default:
        return 'transparent';
    }
  };

  return (
    <View style={[
      styles.container,
      staffInfo.todaySatisfaction ? { borderWidth: 3, borderColor: getZoneBorderColor() } : null
    ]}>
      <LinearGradient
        colors={getZoneGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.fullScreenGradient}
      >
        {/* Header Profile */}
      <LinearGradient
        colors={['#8b5cf6', '#f472b6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>RizeWorld Mobile</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => setShowNotifications(true)} style={styles.headerActionBtn}>
              <Bell size={18} color="#fff" />
              {notifications.filter(n => !n.isRead).length > 0 && (
                <View style={styles.bellBadge}>
                  <Text style={styles.bellBadgeText}>
                    {notifications.filter(n => !n.isRead).length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={onLogout} style={styles.headerActionBtn}>
              <LogOut size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={handleSelectImage} style={styles.avatar}>
            {staffInfo.profilePic ? (
              <Image source={{ uri: getProfilePicUrl() }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{staffInfo.name?.charAt(0)}</Text>
            )}
            <View style={styles.cameraBadge}>
              <Plus size={10} color="#fff" />
            </View>
          </TouchableOpacity>
          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>{staffInfo.name}</Text>
            <Text style={styles.profileMeta}>{staffInfo.department} • {staffInfo.role}</Text>
            {staffInfo.reportingPerson && staffInfo.reportingPerson.length > 0 && (
              <View style={styles.reportingBadge}>
                <Text style={styles.reportingText}>
                  Report to: {staffInfo.reportingPersonName || staffInfo.reportingPerson.join(', ')}
                </Text>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        contentContainerStyle={styles.scrollBody}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8b5cf6']} />
        }
      >
        {/* Red Zone Warning Banner */}
        {staffInfo.todaySatisfaction === 'red' && (
          <LinearGradient
            colors={['#dc2626', '#b91c1c']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.zoneBannerRed}
          >
            <View style={styles.zoneBannerHeaderRow}>
              <Text style={styles.zoneBannerEmoji}>🚨</Text>
              <View style={styles.zoneBannerTextContainer}>
                <Text style={styles.zoneBannerTitleRed}>YOU ARE IN THE RED ZONE 🔴</Text>
                <Text style={styles.zoneBannerSubtextRed}>
                  Management has marked your daily work satisfaction as RED. Immediate attention and task progress required!
                </Text>
              </View>
            </View>
            <View style={styles.zoneBadgeRed}>
              <Text style={styles.zoneBadgeTextRed}>RED ZONE ALERT</Text>
            </View>
          </LinearGradient>
        )}

        {/* Yellow Zone Notice Banner */}
        {staffInfo.todaySatisfaction === 'yellow' && (
          <LinearGradient
            colors={['#d97706', '#b45309']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.zoneBannerYellow}
          >
            <View style={styles.zoneBannerHeaderRow}>
              <Text style={styles.zoneBannerEmoji}>⚠️</Text>
              <View style={styles.zoneBannerTextContainer}>
                <Text style={styles.zoneBannerTitleYellow}>YOU ARE IN THE YELLOW ZONE 🟡</Text>
                <Text style={styles.zoneBannerSubtextYellow}>
                  Your work satisfaction is marked YELLOW. Please improve performance and complete your daily goals.
                </Text>
              </View>
            </View>
            <View style={styles.zoneBadgeYellow}>
              <Text style={styles.zoneBadgeTextYellow}>YELLOW ZONE NOTICE</Text>
            </View>
          </LinearGradient>
        )}

        {/* Green Zone Success Banner */}
        {staffInfo.todaySatisfaction === 'green' && (
          <LinearGradient
            colors={['#10b981', '#047857']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.zoneBannerGreen}
          >
            <View style={styles.zoneBannerHeaderRow}>
              <Text style={styles.zoneBannerEmoji}>🟢</Text>
              <View style={styles.zoneBannerTextContainer}>
                <Text style={styles.zoneBannerTitleGreen}>GREEN ZONE EXCELLENCE 🟢</Text>
                <Text style={styles.zoneBannerSubtextGreen}>
                  Great job! Your work satisfaction for today is GREEN. Outstanding performance!
                </Text>
              </View>
            </View>
            <View style={styles.zoneBadgeGreen}>
              <Text style={styles.zoneBadgeTextGreen}>SAFE ZONE ✅</Text>
            </View>
          </LinearGradient>
        )}
        {/* Role Modules Quick Actions */}
        {(isHR || isCounselor || isSalesTeam || isVisitingCardsAllowed || isMarketing) && (
          <View style={styles.roleModulesContainer}>
            <Text style={styles.roleModulesHeader}>ROLE MODULES</Text>
            <View style={styles.roleModulesGrid}>
              {isHR && (
                <TouchableOpacity onPress={() => onNavigate && onNavigate('hearing')} style={styles.roleModuleCard}>
                  <LinearGradient colors={['#8b5cf6', '#a855f7']} style={styles.roleModuleIconBg}>
                    <Briefcase size={20} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.roleModuleText}>Hearing</Text>
                </TouchableOpacity>
              )}

              {isCounselor && (
                <TouchableOpacity onPress={() => onNavigate && onNavigate('admissions')} style={styles.roleModuleCard}>
                  <LinearGradient colors={['#3b82f6', '#2563eb']} style={styles.roleModuleIconBg}>
                    <GraduationCap size={20} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.roleModuleText}>Admissions</Text>
                </TouchableOpacity>
              )}

              {isSalesTeam && (
                <TouchableOpacity onPress={() => onNavigate && onNavigate('sales')} style={styles.roleModuleCard}>
                  <LinearGradient colors={['#10b981', '#059669']} style={styles.roleModuleIconBg}>
                    <TrendingUp size={20} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.roleModuleText}>Sales Log</Text>
                </TouchableOpacity>
              )}

              {isVisitingCardsAllowed && (
                <>
                  <TouchableOpacity onPress={() => onNavigate && onNavigate('clients')} style={styles.roleModuleCard}>
                    <LinearGradient colors={['#6366f1', '#4f46e5']} style={styles.roleModuleIconBg}>
                      <Users size={20} color="#fff" />
                    </LinearGradient>
                    <Text style={styles.roleModuleText}>Clients</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => onNavigate && onNavigate('visitingCards')} style={styles.roleModuleCard}>
                    <LinearGradient colors={['#f59e0b', '#d97706']} style={styles.roleModuleIconBg}>
                      <CreditCard size={20} color="#fff" />
                    </LinearGradient>
                    <Text style={styles.roleModuleText}>Cards</Text>
                  </TouchableOpacity>
                </>
              )}

              {isMarketing && (
                <TouchableOpacity onPress={() => onNavigate && onNavigate('blogs')} style={styles.roleModuleCard}>
                  <LinearGradient colors={['#ec4899', '#db2777']} style={styles.roleModuleIconBg}>
                    <BookOpen size={20} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.roleModuleText}>Blogs</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Info Grid (Parity with Web Dashboard) */}
        <View style={styles.infoGrid}>
          {/* Employee ID */}
          <View style={[styles.infoCard, { borderLeftColor: '#8b5cf6' }]}>
            <View style={[styles.infoIconBox, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
              <User size={16} color="#8b5cf6" />
            </View>
            <View>
              <Text style={styles.infoCardLabel}>Employee ID</Text>
              <Text style={styles.infoCardValue}>{staffInfo.employeeId || 'N/A'}</Text>
            </View>
          </View>

          {/* Department */}
          <View style={[styles.infoCard, { borderLeftColor: '#10b981' }]}>
            <View style={[styles.infoIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
              <Briefcase size={16} color="#10b981" />
            </View>
            <View>
              <Text style={styles.infoCardLabel}>Department</Text>
              <Text style={styles.infoCardValue}>{staffInfo.department || 'N/A'}</Text>
            </View>
          </View>

          {/* Joining Date */}
          <View style={[styles.infoCard, { borderLeftColor: '#f59e0b' }]}>
            <View style={[styles.infoIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
              <Calendar size={16} color="#f59e0b" />
            </View>
            <View>
              <Text style={styles.infoCardLabel}>Joining Date</Text>
              <Text style={styles.infoCardValue}>{formattedJoiningDate}</Text>
            </View>
          </View>

          {/* Total Days */}
          <View style={[styles.infoCard, { borderLeftColor: '#f472b6' }]}>
            <View style={[styles.infoIconBox, { backgroundColor: 'rgba(244, 114, 182, 0.1)' }]}>
              <TrendingUp size={16} color="#f472b6" />
            </View>
            <View>
              <Text style={styles.infoCardLabel}>Total Days</Text>
              <Text style={styles.infoCardValue}>{totalDaysText} Days</Text>
            </View>
          </View>
        </View>

        {/* Attendance & Clocking Actions */}
        {isLeaveDay ? (
          <View style={styles.leaveCard}>
            <Calendar size={28} color="#f59e0b" style={{ marginBottom: 8 }} />
            <Text style={styles.leaveTitle}>Today is Leave Day</Text>
            <Text style={styles.leaveSub}>Enjoy your day off! No clock-in needed.</Text>
          </View>
        ) : (
          <View style={styles.clockRow}>
            {/* Clock In */}
            <TouchableOpacity 
              onPress={handleClockIn}
              disabled={!attendanceStatus.canClockIn}
              style={[styles.clockBtn, !attendanceStatus.canClockIn && styles.clockBtnDisabled]}
            >
              <LinearGradient
                colors={attendanceStatus.canClockIn ? ['#10b981', '#059669'] : ['#cbd5e1', '#cbd5e1']}
                style={styles.clockBtnGradient}
              >
                <LogIn size={18} color="#fff" />
                <Text style={styles.clockBtnText}>Clock In</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Clock Out */}
            <TouchableOpacity 
              onPress={handleClockOut}
              disabled={!attendanceStatus.canClockOut}
              style={[styles.clockBtn, !attendanceStatus.canClockOut && styles.clockBtnDisabled]}
            >
              <LinearGradient
                colors={attendanceStatus.canClockOut ? ['#ef4444', '#dc2626'] : ['#cbd5e1', '#cbd5e1']}
                style={styles.clockBtnGradient}
              >
                <LogOut size={18} color="#fff" />
                <Text style={styles.clockBtnText}>Clock Out</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Daily Total & Session History */}
        {!isLeaveDay && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Clock size={18} color="#3b82f6" />
              <Text style={styles.cardTitle}>Daily Work Hours</Text>
            </View>
            <View style={styles.hoursSummaryRow}>
              <Text style={styles.hoursLabel}>Total Hours Logged Today:</Text>
              <Text style={styles.hoursValue}>{attendanceStatus.totalHours}</Text>
            </View>
            {attendanceStatus.sessions && attendanceStatus.sessions.length > 0 && (
              <View style={styles.sessionsList}>
                {attendanceStatus.sessions.map((session, idx) => (
                  <View key={idx} style={styles.sessionItem}>
                    <Text style={styles.sessionIndex}>Session {idx + 1}</Text>
                    <Text style={styles.sessionTime}>
                      {session.clockIn} - {session.clockOut || 'Active'}
                    </Text>
                    {session.duration && (
                      <Text style={styles.sessionDuration}>{session.duration}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Monthly Payout Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <DollarSign size={18} color="#8b5cf6" />
            <Text style={styles.cardTitle}>Salary Details</Text>
          </View>
          <View style={styles.salaryGrid}>
            <View style={styles.salaryItem}>
              <Text style={styles.salaryLabel}>Base Monthly Salary</Text>
              <Text style={styles.salaryValue}>₹{(staffInfo.monthlySalary || 0).toLocaleString()}</Text>
            </View>
            <View style={styles.salaryItem}>
              <Text style={styles.salaryLabel}>Calculated Payout</Text>
              <Text style={[styles.salaryValue, { color: '#10b981' }]}>₹{payoutInfo.payout.toLocaleString()}</Text>
            </View>
          </View>
          <View style={styles.salaryFooter}>
            <Text style={styles.salaryFooterText}>
              Leaves Taken: <Text style={{ fontWeight: '900', color: '#1e293b' }}>{payoutInfo.fullLeaves}</Text> | Half Days: <Text style={{ fontWeight: '900', color: '#1e293b' }}>{payoutInfo.halfDays}</Text>
            </Text>
          </View>
        </View>

        {/* Today's Work Card (Matching Web Portal Design) */}
        <View style={styles.todaysWorkCard}>
          {/* Embedded Satisfaction Status Banner */}
          {staffInfo.todaySatisfaction === 'green' && (
            <LinearGradient colors={['#10b981', '#047857']} style={styles.embeddedBannerGreen}>
              <View style={styles.embeddedBannerRow}>
                <Text style={{ fontSize: 20 }}>🟢</Text>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.embeddedBannerTitleGreen}>GREAT WORK! (GREEN)</Text>
                  <Text style={styles.embeddedBannerSubtextGreen}>
                    Your work satisfaction level for today has been marked GREEN by management. Outstanding performance!
                  </Text>
                </View>
              </View>
              <View style={styles.safeZoneBadge}>
                <Text style={styles.safeZoneBadgeText}>SAFE ZONE ✅</Text>
              </View>
            </LinearGradient>
          )}

          {staffInfo.todaySatisfaction === 'yellow' && (
            <LinearGradient colors={['#d97706', '#b45309']} style={styles.embeddedBannerYellow}>
              <View style={styles.embeddedBannerRow}>
                <Text style={{ fontSize: 20 }}>🟡</Text>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.embeddedBannerTitleYellow}>Work Satisfaction Status (YELLOW)</Text>
                  <Text style={styles.embeddedBannerSubtextYellow}>
                    Your work satisfaction level for today is marked YELLOW. Keep pushing to complete all tasks!
                  </Text>
                </View>
              </View>
            </LinearGradient>
          )}

          {staffInfo.todaySatisfaction === 'red' && (
            <LinearGradient colors={['#dc2626', '#b91c1c']} style={styles.embeddedBannerRed}>
              <View style={styles.embeddedBannerRow}>
                <Text style={{ fontSize: 20 }}>🔴</Text>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.embeddedBannerTitleRed}>Work Satisfaction Warning (RED)</Text>
                  <Text style={styles.embeddedBannerSubtextRed}>
                    Your work satisfaction level for today has been marked RED by management. Please review your assigned tasks immediately.
                  </Text>
                </View>
              </View>
            </LinearGradient>
          )}

          {/* Management Comment / Feedback Box */}
          {staffInfo.todayComment ? (
            <View style={styles.managementCommentBox}>
              <Text style={styles.commentHeader}>Management Comment / Feedback</Text>
              <Text style={styles.commentText}>"{staffInfo.todayComment}"</Text>
              {staffInfo.commentUpdatedBy ? (
                <Text style={styles.commentAuthor}>— Added by Management ({staffInfo.commentUpdatedBy})</Text>
              ) : null}
            </View>
          ) : null}

          {/* Card Title */}
          <Text style={styles.todaysWorkTitle}>TODAY'S WORK</Text>

          {/* Day Progress Box */}
          {(() => {
            const regularTasks = todayTasks.filter(t => !t.isExtra);
            const extraTasks = todayTasks.filter(t => t.isExtra);
            const completedRegularCount = regularTasks.filter(t => t.completed).length;
            const completedExtraCount = extraTasks.filter(t => t.completed).length;
            const totalRegular = regularTasks.length;
            const progress = totalRegular > 0 
              ? Math.min(100, Math.round(((completedRegularCount + completedExtraCount) / totalRegular) * 100)) 
              : completedExtraCount > 0 ? 100 : 0;

            return (
              <View style={styles.dayProgressBox}>
                <View style={styles.progressHeaderRow}>
                  <Text style={styles.progressLabel}>DAY PROGRESS</Text>
                  <Text style={styles.progressPercentText}>{progress}%</Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[
                    styles.progressFill,
                    { width: `${progress}%` },
                    progress >= 100 && { backgroundColor: '#10b981' }
                  ]} />
                </View>
              </View>
            );
          })()}

          {/* Add Task Input Row */}
          {staffInfo.role !== 'Technical TL & Digital Marketing Specialist' && (
            <View style={styles.taskInputRow}>
              <TextInput
                value={newTaskInput}
                onChangeText={setNewTaskInput}
                placeholder="Enter what you will work..."
                placeholderTextColor="#94a3b8"
                style={styles.pillTaskInput}
              />
              <TouchableOpacity onPress={handleAddTask} style={styles.addTaskPillBtn}>
                <LinearGradient
                  colors={['#8b5cf6', '#f472b6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.addTaskPillGradient}
                >
                  <Plus size={14} color="#fff" />
                  <Text style={styles.addTaskPillText}>ADD TASK</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* Tasks List / Empty Box */}
          {todayTasks.length > 0 ? (
            <View style={styles.taskListContainer}>
              {todayTasks.map((task, idx) => (
                <View key={idx} style={[styles.taskCardItem, task.completed && styles.taskCardItemCompleted]}>
                  <TouchableOpacity 
                    onPress={() => handleToggleTask(idx)}
                    style={styles.checkboxTouch}
                  >
                    {task.completed ? (
                      <CheckSquare size={18} color="#10b981" />
                    ) : (
                      <Square size={18} color="#94a3b8" />
                    )}
                  </TouchableOpacity>
                  
                  <Text style={[styles.taskCardText, task.completed && styles.taskCardTextCompleted]}>
                    {task.name}
                  </Text>

                  {staffInfo.role !== 'Technical TL & Digital Marketing Specialist' && (
                    <TouchableOpacity onPress={() => handleDeleteTask(idx)} style={styles.taskDeleteBtn}>
                      <X size={16} color="#ef4444" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyTaskBox}>
              <Text style={styles.emptyTaskText}>No tasks added yet</Text>
            </View>
          )}
        </View>

        {/* TL Master Pool Section */}
        {staffInfo.role === 'Technical TL & Digital Marketing Specialist' && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Users size={18} color="#8b5cf6" />
              <Text style={styles.cardTitle}>TL Master Pool</Text>
            </View>
            <Text style={styles.poolDescription}>
              Add items to your pool, and select (check) the ones you are working on today.
            </Text>

            <View style={styles.addTaskContainer}>
              <TextInput
                value={newPoolItem}
                onChangeText={setNewPoolItem}
                placeholder="Add task to master pool..."
                placeholderTextColor="#94a3b8"
                style={styles.addTaskInput}
              />
              <TouchableOpacity onPress={handleAddToPool} style={styles.addTaskBtn}>
                <Plus size={16} color="#fff" />
              </TouchableOpacity>
            </View>

            {masterPool.length > 0 ? (
              <View style={styles.taskList}>
                {masterPool.map((item, idx) => {
                  const isSelected = todayTasks.some(t => t.name === item);
                  return (
                    <View key={idx} style={styles.taskItem}>
                      <TouchableOpacity 
                        onPress={() => handleToggleSelectTask(item, !isSelected)}
                        style={styles.checkboxContainer}
                      >
                        {isSelected ? (
                          <CheckSquare size={20} color="#8b5cf6" />
                        ) : (
                          <Square size={20} color="#94a3b8" />
                        )}
                      </TouchableOpacity>
                      
                      <Text style={styles.taskText}>{item}</Text>

                      <TouchableOpacity onPress={() => handleRemoveFromPool(idx)} style={styles.deleteTaskBtn}>
                        <X size={16} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Master pool is empty.</Text>
              </View>
            )}
          </View>
        )}

        {/* My Team's Daily Work Section */}
        {reportees.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Users size={18} color="#6366f1" />
              <Text style={styles.cardTitle}>My Team ({reportees.length})</Text>
            </View>

            {loadingReportees ? (
              <ActivityIndicator color="#6366f1" style={{ marginVertical: 20 }} />
            ) : (
              <View style={styles.teamList}>
                {reportees.map((member) => (
                  <View key={member.id} style={styles.memberCard}>
                    <View style={styles.memberHeader}>
                      <View style={styles.memberAvatar}>
                        <Text style={styles.memberAvatarText}>{member.name.charAt(0)}</Text>
                      </View>
                      <View style={styles.memberMeta}>
                        <Text style={styles.memberName}>{member.name}</Text>
                        <Text style={styles.memberRole}>{member.role} • {member.department}</Text>
                      </View>
                      <View style={[
                        styles.statusBadge,
                        member.todayClock ? styles.statusPresent : styles.statusAbsent
                      ]}>
                        <Text style={styles.statusText}>
                          {member.todayClock ? 'Present' : 'Absent'}
                        </Text>
                      </View>
                    </View>

                    {/* Reportee Tasks */}
                    <View style={styles.memberTasksContainer}>
                      <Text style={styles.memberTasksTitle}>Today's Tasks:</Text>
                      {member.todayTasks && member.todayTasks.length > 0 ? (
                        member.todayTasks.map((t, idx) => (
                          <View key={idx} style={styles.memberTaskItem}>
                            <View style={[styles.bulletPoint, t.completed && styles.bulletPointCompleted]} />
                            <Text style={[styles.memberTaskText, t.completed && styles.bulletPointCompleted && styles.memberTaskTextCompleted]}>
                              {t.name}
                            </Text>
                          </View>
                        ))
                      ) : (
                        <Text style={styles.noTasksText}>No tasks assigned for today.</Text>
                      )}
                    </View>

                    {/* Member Satisfaction Controls */}
                    <View style={styles.memberSatisfactionRow}>
                      <Text style={styles.satisfactionLabel}>Satisfaction Zone:</Text>
                      <View style={styles.satisfactionButtonsRow}>
                        <TouchableOpacity
                          onPress={() => handleUpdateSatisfaction(member.id || member._id, 'red')}
                          style={[
                            styles.satBtn,
                            styles.satBtnRed,
                            member.todaySatisfaction === 'red' && styles.satBtnActiveRed
                          ]}
                        >
                          <Text style={styles.satBtnText}>🔴 Red</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => handleUpdateSatisfaction(member.id || member._id, 'yellow')}
                          style={[
                            styles.satBtn,
                            styles.satBtnYellow,
                            member.todaySatisfaction === 'yellow' && styles.satBtnActiveYellow
                          ]}
                        >
                          <Text style={styles.satBtnText}>🟡 Yellow</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => handleUpdateSatisfaction(member.id || member._id, 'green')}
                          style={[
                            styles.satBtn,
                            styles.satBtnGreen,
                            member.todaySatisfaction === 'green' && styles.satBtnActiveGreen
                          ]}
                        >
                          <Text style={styles.satBtnText}>🟢 Green</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
      </LinearGradient>

      {/* Notifications Modal Popup */}
      <Modal
        visible={showNotifications}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowNotifications(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Notifications</Text>
              <Text style={styles.modalSubtitle}>
                {notifications.filter(n => !n.isRead).length} unread
              </Text>
            </View>
            <TouchableOpacity onPress={() => setShowNotifications(false)} style={styles.closeModalBtn}>
              <X size={20} color="#1e293b" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.notificationsList}>
            {notifications.length === 0 ? (
              <View style={styles.emptyNotifications}>
                <Bell size={36} color="#cbd5e1" />
                <Text style={styles.emptyNotifText}>No notifications yet.</Text>
              </View>
            ) : (
              notifications.map((notif) => (
                <TouchableOpacity
                  key={notif._id}
                  onPress={() => handleMarkNotificationRead(notif._id)}
                  style={[
                    styles.notifCard,
                    notif.isRead ? styles.notifRead : styles.notifUnread
                  ]}
                >
                  <View style={styles.notifContent}>
                    <View style={styles.notifHeaderRow}>
                      <Text style={[styles.notifItemTitle, !notif.isRead && styles.notifItemTitleUnread]}>
                        {notif.title}
                      </Text>
                      {!notif.isRead && (
                        <View style={styles.unreadIndicatorDot} />
                      )}
                    </View>
                    <Text style={styles.notifMessage}>{notif.message}</Text>
                    <Text style={styles.notifTime}>
                      {new Date(notif.createdAt).toLocaleString()}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  fullScreenGradient: {
    flex: 1
  },
  header: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 16 : Platform.OS === 'ios' ? 70 : 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  headerActionBtn: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    position: 'relative'
  },
  bellBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2
  },
  bellBadgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '950'
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#8b5cf6'
  },
  avatarImage: {
    width: 56,
    height: 56,
    borderRadius: 18
  },
  cameraBadge: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    backgroundColor: '#8b5cf6',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  profileDetails: {
    flex: 1
  },
  profileName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff'
  },
  profileMeta: {
    fontSize: 11,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2
  },
  reportingBadge: {
    marginTop: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    alignSelf: 'flex-start'
  },
  reportingText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold'
  },
  scrollBody: {
    padding: 16,
    gap: 16,
    paddingBottom: 32
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  infoCard: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    borderLeftWidth: 4,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1
  },
  infoIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  infoCardLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  infoCardValue: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1e293b',
    marginTop: 2
  },
  clockRow: {
    flexDirection: 'row',
    gap: 12
  },
  clockBtn: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  clockBtnDisabled: {
    opacity: 0.5
  },
  clockBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48
  },
  clockBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  leaveCard: {
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.15)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center'
  },
  leaveTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#d97706'
  },
  leaveSub: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#78350f',
    marginTop: 2
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 8
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1e293b',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  hoursSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  hoursLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#475569'
  },
  hoursValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1e293b'
  },
  sessionsList: {
    gap: 8
  },
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  sessionIndex: {
    fontSize: 11,
    fontWeight: '900',
    color: '#475569'
  },
  sessionTime: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b'
  },
  sessionDuration: {
    fontSize: 10,
    fontWeight: '900',
    color: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6
  },
  salaryGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12
  },
  salaryItem: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  salaryLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748b'
  },
  salaryValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1e293b',
    marginTop: 4
  },
  salaryFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 8
  },
  salaryFooterText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#64748b',
    textAlign: 'center'
  },
  poolDescription: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#64748b',
    marginBottom: 12
  },
  addTaskContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    alignItems: 'center',
    height: 44,
    marginBottom: 12
  },
  addTaskInput: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b'
  },
  addTaskBtn: {
    backgroundColor: '#8b5cf6',
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  taskList: {
    gap: 8
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    gap: 10
  },
  taskCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderColor: 'rgba(16, 185, 129, 0.1)'
  },
  checkboxContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  taskText: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b'
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#64748b'
  },
  deleteTaskBtn: {
    padding: 6
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 16
  },
  emptyText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#94a3b8'
  },
  teamList: {
    gap: 12
  },
  memberCard: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 12,
    backgroundColor: '#f8fafc'
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 10,
    marginBottom: 10
  },
  memberAvatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center'
  },
  memberAvatarText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14
  },
  memberMeta: {
    flex: 1
  },
  memberName: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1e293b'
  },
  memberRole: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#64748b',
    marginTop: 1
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    borderWidth: 1
  },
  statusPresent: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.2)'
  },
  statusAbsent: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.2)'
  },
  statusText: {
    fontSize: 8,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  memberTasksContainer: {
    gap: 4
  },
  memberTasksTitle: {
    fontSize: 9,
    fontWeight: '900',
    color: '#1e293b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2
  },
  memberTaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 6,
    borderRadius: 8
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#94a3b8'
  },
  bulletPointCompleted: {
    backgroundColor: '#10b981'
  },
  memberTaskText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b'
  },
  memberTaskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#64748b'
  },
  noTasksText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94a3b8',
    fontStyle: 'italic'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#fff'
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1e293b'
  },
  modalSubtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748b',
    marginTop: 2
  },
  closeModalBtn: {
    padding: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 12
  },
  notificationsList: {
    padding: 20,
    gap: 12
  },
  emptyNotifications: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 8
  },
  emptyNotificationsTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1e293b',
    marginTop: 8
  },
  emptyNotificationsText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    paddingHorizontal: 40
  },
  notifItem: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1
  },
  notifRead: {
    borderColor: '#e2e8f0',
    opacity: 0.8
  },
  notifUnread: {
    borderColor: 'rgba(139, 92, 246, 0.2)',
    backgroundColor: 'rgba(139, 92, 246, 0.02)',
    borderLeftWidth: 4,
    borderLeftColor: '#8b5cf6'
  },
  notifContent: {
    gap: 6
  },
  notifHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  notifItemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#64748b',
    flex: 1
  },
  notifItemTitleUnread: {
    color: '#1e293b',
    fontWeight: '900'
  },
  unreadIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8b5cf6'
  },
  notifMessage: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18
  },
  notifTime: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: 'bold',
    marginTop: 2
  },
  roleModulesContainer: {
    marginBottom: 16
  },
  roleModulesHeader: {
    fontSize: 11,
    fontWeight: '900',
    color: '#64748b',
    letterSpacing: 1.5,
    marginBottom: 10,
    marginLeft: 4
  },
  roleModulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  roleModuleCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2
  },
  roleModuleIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  roleModuleText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center'
  },
  // Zone Banners
  zoneBannerRed: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4
  },
  zoneBannerYellow: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#d97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4
  },
  zoneBannerGreen: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4
  },
  zoneBannerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12
  },
  zoneBannerEmoji: {
    fontSize: 32
  },
  zoneBannerTextContainer: {
    flex: 1
  },
  zoneBannerTitleRed: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.5
  },
  zoneBannerSubtextRed: {
    fontSize: 12,
    color: '#fecdd3',
    fontWeight: '600',
    marginTop: 2,
    lineHeight: 16
  },
  zoneBannerTitleYellow: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.5
  },
  zoneBannerSubtextYellow: {
    fontSize: 12,
    color: '#fef3c7',
    fontWeight: '600',
    marginTop: 2,
    lineHeight: 16
  },
  zoneBannerTitleGreen: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.5
  },
  zoneBannerSubtextGreen: {
    fontSize: 12,
    color: '#d1fae5',
    fontWeight: '600',
    marginTop: 2,
    lineHeight: 16
  },
  zoneBadgeRed: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)'
  },
  zoneBadgeTextRed: {
    fontSize: 10,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1
  },
  zoneBadgeYellow: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)'
  },
  zoneBadgeTextYellow: {
    fontSize: 10,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1
  },
  zoneBadgeGreen: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)'
  },
  zoneBadgeTextGreen: {
    fontSize: 10,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1
  },
  // Member Satisfaction Controls
  memberSatisfactionRow: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9'
  },
  satisfactionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 6
  },
  satisfactionButtonsRow: {
    flexDirection: 'row',
    gap: 8
  },
  satBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  satBtnRed: {},
  satBtnActiveRed: {
    backgroundColor: '#fee2e2',
    borderColor: '#ef4444'
  },
  satBtnYellow: {},
  satBtnActiveYellow: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b'
  },
  satBtnGreen: {},
  satBtnActiveGreen: {
    backgroundColor: '#dcfce7',
    borderColor: '#10b981'
  },
  satBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1e293b'
  },
  // Today's Work Card (Matching Web Portal)
  todaysWorkCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3
  },
  embeddedBannerGreen: {
    borderRadius: 18,
    padding: 14,
    marginBottom: 16
  },
  embeddedBannerYellow: {
    borderRadius: 18,
    padding: 14,
    marginBottom: 16
  },
  embeddedBannerRed: {
    borderRadius: 18,
    padding: 14,
    marginBottom: 16
  },
  embeddedBannerRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  embeddedBannerTitleGreen: {
    fontSize: 13,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.5
  },
  embeddedBannerSubtextGreen: {
    fontSize: 11,
    color: '#d1fae5',
    fontWeight: '600',
    marginTop: 2,
    lineHeight: 15
  },
  embeddedBannerTitleYellow: {
    fontSize: 13,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.5
  },
  embeddedBannerSubtextYellow: {
    fontSize: 11,
    color: '#fef3c7',
    fontWeight: '600',
    marginTop: 2,
    lineHeight: 15
  },
  embeddedBannerTitleRed: {
    fontSize: 13,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.5
  },
  embeddedBannerSubtextRed: {
    fontSize: 11,
    color: '#fecdd3',
    fontWeight: '600',
    marginTop: 2,
    lineHeight: 15
  },
  safeZoneBadge: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)'
  },
  safeZoneBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1
  },
  managementCommentBox: {
    backgroundColor: '#fff',
    borderLeftWidth: 4,
    borderLeftColor: '#8b5cf6',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  commentHeader: {
    fontSize: 10,
    fontWeight: '900',
    color: '#8b5cf6',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4
  },
  commentText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
    fontStyle: 'italic'
  },
  commentAuthor: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 4,
    textAlign: 'right'
  },
  todaysWorkTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: 0.5,
    marginBottom: 14
  },
  dayProgressBox: {
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    padding: 12,
    marginBottom: 14
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#64748b',
    letterSpacing: 1.5
  },
  progressPercentText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1e293b'
  },
  progressTrack: {
    height: 7,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 4
  },
  taskInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14
  },
  pillTaskInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    paddingHorizontal: 14,
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b'
  },
  addTaskPillBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3
  },
  addTaskPillGradient: {
    height: 48,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  addTaskPillText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1
  },
  taskListContainer: {
    gap: 8
  },
  taskCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10
  },
  taskCardItemCompleted: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0'
  },
  checkboxTouch: {
    padding: 2
  },
  taskCardText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b'
  },
  taskCardTextCompleted: {
    color: '#94a3b8',
    textDecorationLine: 'line-through'
  },
  taskDeleteBtn: {
    padding: 4
  },
  emptyTaskBox: {
    backgroundColor: 'rgba(241, 245, 249, 0.7)',
    borderRadius: 16,
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  emptyTaskText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b'
  }
});

export default DashboardScreen;
