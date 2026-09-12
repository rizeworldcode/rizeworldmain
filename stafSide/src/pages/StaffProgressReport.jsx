import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  ArrowLeft,
  ChevronDown,
  IndianRupee,
  Briefcase,
  User,
  ShieldAlert,
  MessageSquare,
  ListFilter,
  FileSpreadsheet,
  Printer
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { cn } from '../utils';

// Time Calculation Helpers
const STANDARD_HOURS_PER_DAY = 8.5;
const EXPECTED_MONTHLY_HOURS = STANDARD_HOURS_PER_DAY * 30; // 255 hours
const CALCULATION_START_DATE = new Date(2026, 6, 1); // July 1, 2026

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

const calculatePayoutForMonth = (staffInfo, year, monthIndex, paidHistory = null) => {
  if (!staffInfo) return null;
  const baseSalary = paidHistory ? paidHistory.baseSalary : (staffInfo.monthlySalary || 0);
  const hourlyRate = baseSalary / EXPECTED_MONTHLY_HOURS;

  const today = new Date();
  const isCurrentMonth = today.getMonth() === monthIndex && today.getFullYear() === year;

  const createdAt = staffInfo.createdAt || staffInfo.joiningDate;
  const sequenceDates = get30DaySequenceDates(year, monthIndex, createdAt);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const validSequenceDates = isCurrentMonth
    ? sequenceDates.filter(d => d <= todayEnd)
    : sequenceDates;

  const seqDateStrings = new Set(validSequenceDates.map(d => d.toDateString()));

  const monthlyClockRecords = (staffInfo.clock || []).filter(r => {
    return seqDateStrings.has(new Date(r.date).toDateString());
  });

  const dailyHoursMap = {};
  const creditedDates = new Set();

  monthlyClockRecords.forEach(r => {
    const dStr = new Date(r.date).toDateString();
    const actualHrs = parseTotalHours(r.totalHours);
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

  const absentDaysList = validSequenceDates.filter(d => {
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
  if (absentDaysList.length > 0) {
    const casualLeaveDate = absentDaysList[0];
    const dStr = casualLeaveDate.toDateString();
    dailyHoursMap[dStr] = STANDARD_HOURS_PER_DAY;
    creditedDates.add(dStr);
    casualLeaveUsed = true;
  } else if (halfDayLeaveUnits > 0) {
    for (let i = 0; i < 2; i++) {
      const hdDate = new Date(halfDayRecords[i].date);
      const dStr = hdDate.toDateString();
      const cr = monthlyClockRecords.find(r => new Date(r.date).toDateString() === dStr);
      const actualHrs = cr ? parseTotalHours(cr.totalHours) : 0;
      const halfTarget = STANDARD_HOURS_PER_DAY / 2;
      if (actualHrs < halfTarget) {
        dailyHoursMap[dStr] = (dailyHoursMap[dStr] || actualHrs) + (halfTarget - actualHrs);
      }
    }
    casualLeaveUsed = true;
  }

  let calculatedPayout = 0;
  let totalHoursWorked = 0;

  validSequenceDates.forEach(d => {
    const dStr = d.toDateString();
    const hrs = dailyHoursMap[dStr] || 0;
    totalHoursWorked += hrs;
    const { salary: daySalary } = getSalaryForDate(staffInfo, d);
    const dayHourlyRate = daySalary / EXPECTED_MONTHLY_HOURS;
    calculatedPayout += hrs * dayHourlyRate;
  });

  calculatedPayout = Math.round(calculatedPayout);

  const presents = monthlyClockRecords.length;
  const fullLeaves = Math.max(0, absentDaysList.length - (casualLeaveUsed && absentDaysList.length > 0 ? 1 : 0));
  const finalPayout = paidHistory ? paidHistory.payoutSalary : calculatedPayout;
  const deduction = Math.max(0, baseSalary - finalPayout);

  const daysToCount = validSequenceDates.length;
  const expectedMinutes = daysToCount * STANDARD_HOURS_PER_DAY * 60;
  const actualMinutes = totalHoursWorked * 60;
  const differenceMinutes = actualMinutes - expectedMinutes;
  const attendancePercentage = Math.round((totalHoursWorked / (daysToCount * STANDARD_HOURS_PER_DAY || 1)) * 100);

  return {
    expectedMinutes,
    actualMinutes,
    differenceMinutes,
    daysToCount,
    isCurrentMonth,
    presents,
    daysWorked: presents,
    leaves: fullLeaves,
    fullLeaves,
    halfDays: halfDayRecords.length,
    casualLeaveUsed: !!casualLeaveUsed,
    deduction,
    finalPayout,
    payout: finalPayout,
    attendancePercentage: Math.min(100, attendancePercentage),
    totalHoursWorked: Math.round(totalHoursWorked * 100) / 100,
    hourlyRate: Math.round(hourlyRate * 100) / 100,
    baseSalary,
    sequenceDates,
    validSequenceDates
  };
};

const calculateDetailedMonthData = (staff, monthStr) => {
  if (!staff || !monthStr) return null;
  const cleanMonth = monthStr.replace(/\s*\(Current\)/i, '').trim();

  const paidHistory = (staff.salaryHistory || []).find(h => {
    const hCleaned = h.month.replace(/\s*\(Current\)/i, '').trim();
    return hCleaned === cleanMonth;
  });

  const match = cleanMonth.match(/([A-Za-z]+)\s+(\d+)/);
  if (!match) return null;
  const monthName = match[1];
  const year = parseInt(match[2]);
  const monthIndex = new Date(Date.parse(monthName + " 1, 2012")).getMonth();

  return calculatePayoutForMonth(staff, year, monthIndex, paidHistory);
};

const StaffProgressReport = ({ onBack }) => {
  const [staffInfo, setStaffInfo] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('staffInfo') || '{}');
    } catch {
      return {};
    }
  });

  const [loading, setLoading] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingCsv, setDownloadingCsv] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateSearchQuery, setDateSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  const getApiUrl = (endpoint) => {
    const defaultPort = '5000';
    let host = window.location.hostname;
    const protocol = window.location.protocol;

    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) {
      return `${protocol}//${host}:${defaultPort}/api${endpoint}`;
    }
    if (host === 'localhost' || host === '127.0.0.1') {
      return `http://localhost:${defaultPort}/api${endpoint}`;
    }
    const baseDomain = host.replace(/^staf\./, '').replace(/^admin\./, '');
    return `${protocol}//api.${baseDomain}/api${endpoint}`;
  };

  const fetchStaffData = async () => {
    const staffId = staffInfo.id || staffInfo._id;
    if (!staffId) return;
    setLoading(true);
    try {
      const response = await fetch(getApiUrl(`/staff/${staffId}`));
      const result = await response.json();
      if (result.success && result.data) {
        setStaffInfo(result.data);
        localStorage.setItem('staffInfo', JSON.stringify(result.data));
      }
    } catch (err) {
      console.error('Error fetching staff data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  // Generate Month Options from July 2026 / joining date to current month
  const monthOptions = useMemo(() => {
    const options = [];
    const now = new Date();
    const start = CALCULATION_START_DATE;
    let cursor = new Date(start.getFullYear(), start.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 1);

    while (cursor <= end) {
      const monthStr = cursor.toLocaleDateString('default', { month: 'long', year: 'numeric' });
      const isCurrent = cursor.getFullYear() === now.getFullYear() && cursor.getMonth() === now.getMonth();
      options.unshift({
        value: monthStr,
        label: isCurrent ? `${monthStr} (Current)` : monthStr,
        isCurrent
      });
      cursor.setMonth(cursor.getMonth() + 1);
    }
    return options;
  }, []);

  useEffect(() => {
    if (monthOptions.length > 0 && !selectedMonth) {
      setSelectedMonth(monthOptions[0].value);
    }
  }, [monthOptions, selectedMonth]);

  // Performance & Payout calculations for selected month
  const monthMetrics = useMemo(() => {
    if (!selectedMonth || !staffInfo) return null;
    return calculateDetailedMonthData(staffInfo, selectedMonth);
  }, [staffInfo, selectedMonth]);

  // Daily Records List for selected month
  const dailyLogs = useMemo(() => {
    if (!selectedMonth || !staffInfo) return [];
    const cleanMonth = selectedMonth.replace(/\s*\(Current\)/i, '').trim();
    const match = cleanMonth.match(/([A-Za-z]+)\s+(\d+)/);
    if (!match) return [];

    const monthName = match[1];
    const year = parseInt(match[2]);
    const monthIndex = new Date(Date.parse(monthName + " 1, 2012")).getMonth();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    const logs = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, monthIndex, day);
      d.setHours(0, 0, 0, 0);

      // Skip future dates if current month
      if (d > today) break;

      const dateStr = d.toDateString();
      const yStr = d.getFullYear();
      const mStr = String(d.getMonth() + 1).padStart(2, '0');
      const dStr = String(d.getDate()).padStart(2, '0');
      const dateYYYYMMDD = `${yStr}-${mStr}-${dStr}`;

      const clockRecord = (staffInfo.clock || []).find(r => new Date(r.date).toDateString() === dateStr);
      const attRecord = (staffInfo.attendance || []).find(a => new Date(a.date).toDateString() === dateStr);
      const leaveRecord = (staffInfo.leaves || []).find(l => new Date(l.date).toDateString() === dateStr);
      const workRecord = (staffInfo.work || []).find(w => new Date(w.date).toDateString() === dateStr);

      const isSunday = d.getDay() === 0;

      let status = 'Absent';
      let statusType = 'absent';

      if (clockRecord) {
        const active = clockRecord.sessions && clockRecord.sessions.some(s => !s.clockOut);
        status = active ? 'Active In' : (attRecord?.status || 'Present');
        statusType = active ? 'active' : (status === 'Half-Day' ? 'halfday' : 'present');
      } else if (isSunday) {
        status = 'Sunday (Holiday)';
        statusType = 'sunday';
      } else if (leaveRecord) {
        status = `Leave (${leaveRecord.type || 'Casual'})`;
        statusType = 'leave';
      } else if (attRecord) {
        status = attRecord.status;
        statusType = status === 'On Leave' ? 'leave' : (status === 'Half-Day' ? 'halfday' : (status === 'Present' ? 'present' : 'absent'));
      }

      // Satisfaction Zone
      const satRecord = (staffInfo.satisfactionHistory || []).find(s => s.date === dateYYYYMMDD);
      let satisfactionLevel = satRecord ? satRecord.level : null;
      const todayStr = new Date().toISOString().split('T')[0];
      if (!satisfactionLevel && dateYYYYMMDD === todayStr && staffInfo.todaySatisfaction && staffInfo.todaySatisfaction !== 'none') {
        satisfactionLevel = staffInfo.todaySatisfaction;
      }

      // Daily Comment
      const commRecord = (staffInfo.commentHistory || []).find(c => c.date === dateYYYYMMDD);
      let dailyComment = commRecord ? commRecord.comment : '';
      if (!dailyComment && dateYYYYMMDD === todayStr) {
        dailyComment = staffInfo.todayComment || '';
      }

      logs.push({
        date: d,
        dateFormatted: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        weekday: d.toLocaleDateString('en-IN', { weekday: 'short' }),
        dateYYYYMMDD,
        status,
        statusType,
        satisfactionLevel,
        dailyComment,
        clockRecord,
        sessions: clockRecord?.sessions || [],
        totalHours: clockRecord?.totalHours || '-',
        tasks: workRecord?.tasks || []
      });
    }

    // Sort descending by date (most recent first)
    return logs.reverse();
  }, [staffInfo, selectedMonth]);

  // Filtered Daily Logs
  const filteredDailyLogs = useMemo(() => {
    return dailyLogs.filter(log => {
      // Search filter by date or day
      if (dateSearchQuery) {
        const q = dateSearchQuery.toLowerCase();
        const matchesDate = log.dateFormatted.toLowerCase().includes(q) ||
          log.weekday.toLowerCase().includes(q) ||
          log.dateYYYYMMDD.includes(q);
        if (!matchesDate) return false;
      }

      // Status filter
      if (statusFilter === 'all') return true;
      if (statusFilter === 'present') return log.statusType === 'present' || log.statusType === 'active';
      if (statusFilter === 'leave') return log.statusType === 'leave';
      if (statusFilter === 'halfday') return log.statusType === 'halfday';
      if (statusFilter === 'absent') return log.statusType === 'absent';
      if (statusFilter === 'sunday') return log.statusType === 'sunday';
      if (statusFilter === 'red') return log.satisfactionLevel === 'red';
      if (statusFilter === 'yellow') return log.satisfactionLevel === 'yellow';
      if (statusFilter === 'green') return log.satisfactionLevel === 'green';
      return true;
    });
  }, [dailyLogs, statusFilter, dateSearchQuery]);

  // Zone Breakdown Counts
  const zoneCounts = useMemo(() => {
    let red = 0, yellow = 0, green = 0;
    dailyLogs.forEach(log => {
      if (log.satisfactionLevel === 'red') red++;
      if (log.satisfactionLevel === 'yellow') yellow++;
      if (log.satisfactionLevel === 'green') green++;
    });
    return { red, yellow, green };
  }, [dailyLogs]);

  // PDF Download Handler
  const handleDownloadPDF = async () => {
    if (!staffInfo || !selectedMonth) return;
    setDownloadingPdf(true);

    try {
      const match = selectedMonth.match(/([A-Za-z]+)\s+(\d+)/);
      const monthName = match ? match[1] : '';
      const year = match ? parseInt(match[2]) : new Date().getFullYear();
      const monthIndex = new Date(Date.parse(monthName + " 1, 2012")).getMonth();
      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

      let dailyRowsHTML = '';
      for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(year, monthIndex, day);
        const dateStr = d.toDateString();
        const yStr = d.getFullYear();
        const mStr = String(d.getMonth() + 1).padStart(2, '0');
        const dStr = String(d.getDate()).padStart(2, '0');
        const dateYYYYMMDD = `${yStr}-${mStr}-${dStr}`;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (d > today) break;

        const clockRecord = (staffInfo.clock || []).find(r => new Date(r.date).toDateString() === dateStr);
        const attRecord = (staffInfo.attendance || []).find(a => new Date(a.date).toDateString() === dateStr);
        const leaveRecord = (staffInfo.leaves || []).find(l => new Date(l.date).toDateString() === dateStr);
        const workRecord = (staffInfo.work || []).find(w => new Date(w.date).toDateString() === dateStr);

        const isSunday = d.getDay() === 0;

        let status = 'Absent';
        let statusClass = 'color: #ef4444; font-weight: bold;';

        if (clockRecord) {
          const active = clockRecord.sessions && clockRecord.sessions.some(s => !s.clockOut);
          status = active ? 'Active' : (attRecord?.status || 'Present');
          statusClass = status === 'Half-Day' ? 'color: #f59e0b; font-weight: bold;' : 'color: #10b981; font-weight: bold;';
        } else if (isSunday) {
          status = 'Sunday (Holiday)';
          statusClass = 'color: #3b82f6; font-weight: bold;';
        } else if (leaveRecord) {
          status = `Leave (${leaveRecord.type || 'Casual'})`;
          statusClass = 'color: #8b5cf6; font-weight: bold;';
        } else if (attRecord) {
          status = attRecord.status;
          if (status === 'On Leave') statusClass = 'color: #8b5cf6; font-weight: bold;';
          else if (status === 'Half-Day') statusClass = 'color: #f59e0b; font-weight: bold;';
          else if (status === 'Present') statusClass = 'color: #10b981; font-weight: bold;';
        }

        const satRecord = (staffInfo.satisfactionHistory || []).find(s => s.date === dateYYYYMMDD);
        let satisfactionLevel = satRecord ? satRecord.level : null;
        const todayStr = new Date().toISOString().split('T')[0];
        if (!satisfactionLevel && dateYYYYMMDD === todayStr && staffInfo.todaySatisfaction && staffInfo.todaySatisfaction !== 'none') {
          satisfactionLevel = staffInfo.todaySatisfaction;
        }

        let satisfactionHTML = '<span style="color:#9ca3af; font-size:10px;">-</span>';
        if (satisfactionLevel === 'red') {
          satisfactionHTML = '<span style="background:#fef2f2; color:#dc2626; border:1px solid #fca5a5; padding:2px 6px; border-radius:4px; font-weight:bold; font-size:10px; display:inline-block;">🔴 Red Zone</span>';
        } else if (satisfactionLevel === 'yellow') {
          satisfactionHTML = '<span style="background:#fffbeb; color:#d97706; border:1px solid #fcd34d; padding:2px 6px; border-radius:4px; font-weight:bold; font-size:10px; display:inline-block;">🟡 Yellow Zone</span>';
        } else if (satisfactionLevel === 'green') {
          satisfactionHTML = '<span style="background:#f0fdf4; color:#16a34a; border:1px solid #86efac; padding:2px 6px; border-radius:4px; font-weight:bold; font-size:10px; display:inline-block;">🟢 Green Zone</span>';
        }

        const commRecord = (staffInfo.commentHistory || []).find(c => c.date === dateYYYYMMDD);
        let dailyComment = commRecord ? commRecord.comment : '';
        if (!dailyComment && dateYYYYMMDD === todayStr) {
          dailyComment = staffInfo.todayComment || '';
        }

        let commentHTML = '';
        if (dailyComment) {
          commentHTML = `<div style="margin-top: 4px; padding: 4px 6px; background: #f8fafc; border-left: 3px solid #6366f1; border-radius: 4px; font-size: 10px; color: #334155;">
            <strong style="color: #4f46e5;">💬 Feedback:</strong> ${dailyComment}
          </div>`;
        }

        let sessionsText = '-';
        if (clockRecord && clockRecord.sessions && clockRecord.sessions.length > 0) {
          sessionsText = clockRecord.sessions.map((s, i) =>
            `S${i + 1}: ${s.clockIn} - ${s.clockOut || 'Active'} (${s.duration || '-'})`
          ).join('<br>');
        }

        let tasksText = '-';
        if (workRecord && workRecord.tasks && workRecord.tasks.length > 0) {
          tasksText = workRecord.tasks.map(t =>
            `<div style="margin-bottom: 2px; font-size: 10px;">
              ${t.completed ? '<span style="color:#10b981; font-weight:bold;">[✓]</span>' : '<span style="color:#ef4444; font-weight:bold;">[✗]</span>'} 
              ${t.name} ${t.isExtra ? '<span style="color:#3b82f6; font-size:8px; font-weight:bold;">(EXTRA)</span>' : ''}
            </div>`
          ).join('');
        }

        const tasksAndCommentHTML = (tasksText !== '-' || commentHTML)
          ? `${tasksText !== '-' ? tasksText : ''}${commentHTML}`
          : '-';

        const totalHours = clockRecord ? clockRecord.totalHours : '-';

        dailyRowsHTML += `
          <tr style="border-bottom: 1px solid #e5e7eb; font-size: 11px;">
            <td style="padding: 8px; vertical-align: top;">${d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', weekday: 'short' })}</td>
            <td style="padding: 8px; vertical-align: top; ${statusClass}">${status}</td>
            <td style="padding: 8px; vertical-align: top;">${satisfactionHTML}</td>
            <td style="padding: 8px; vertical-align: top; font-weight: bold; text-align: center;">${totalHours}</td>
            <td style="padding: 8px; vertical-align: top; font-size: 10px; line-height: 1.4;">${sessionsText}</td>
            <td style="padding: 8px; vertical-align: top;">${tasksAndCommentHTML}</td>
          </tr>
        `;
      }

      const baseSalary = monthMetrics?.baseSalary ?? staffInfo.monthlySalary ?? 0;
      const payout = monthMetrics?.finalPayout ?? 0;
      const deduction = monthMetrics?.deduction ?? 0;
      const presents = monthMetrics?.presents ?? 0;
      const leaves = monthMetrics?.leaves ?? 0;
      const halfDays = monthMetrics?.halfDays ?? 0;
      const efficiency = monthMetrics?.attendancePercentage ?? 0;
      const totalHoursWorked = monthMetrics?.totalHoursWorked ?? 0;
      const hourlyRate = monthMetrics?.hourlyRate ?? 0;
      const clUsed = monthMetrics?.casualLeaveUsed ? 'Yes' : 'No';

      const fullHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Monthly Performance Report - ${staffInfo.name}</title>
        </head>
        <body style="margin: 0; padding: 25px; background: #fff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1f2937;">
          <div style="width: 190mm; margin: 0 auto; background: #fff;">
            
            <!-- HEADER -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
              <tr>
                <td style="vertical-align: top;">
                  <div style="font-size: 22px; font-weight: 800; letter-spacing: -0.5px; color: #1e3a8a;">RIZE WORLD DIGITAL MARKETING</div>
                  <div style="font-size: 11px; color: #6b7280; font-weight: bold; text-transform: uppercase; margin-top: 3px; letter-spacing: 1px;">Employee Clock Cycle & Performance Statement</div>
                </td>
                <td style="text-align: right; vertical-align: top;">
                  <div style="font-size: 16px; font-weight: 800; color: #0d9488;">${selectedMonth}</div>
                  <div style="font-size: 10px; color: #9ca3af; margin-top: 3px;">Generated on: ${new Date().toLocaleDateString('en-IN')}</div>
                </td>
              </tr>
            </table>

            <!-- PROFILE AND CALCULATIONS GRID -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
              <tr>
                <!-- Employee Details Card -->
                <td style="width: 48%; vertical-align: top; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
                  <div style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Employee Profile</div>
                  <div style="font-size: 16px; font-weight: 800; color: #0f172a; margin-bottom: 6px;">${staffInfo.name}</div>
                  <table style="width: 100%; font-size: 11px; line-height: 1.6;">
                    <tr><td style="color:#64748b; width: 35%;">ID:</td><td style="font-weight:bold;">${staffInfo.employeeId || '-'}</td></tr>
                    <tr><td style="color:#64748b;">Department:</td><td style="font-weight:bold;">${staffInfo.department || '-'}</td></tr>
                    <tr><td style="color:#64748b;">Role:</td><td style="font-weight:bold;">${staffInfo.role || 'Employee'}</td></tr>
                    <tr><td style="color:#64748b;">Job Type:</td><td style="font-weight:bold;">${staffInfo.jobType || 'Permanent'}</td></tr>
                    <tr><td style="color:#64748b;">Email:</td><td>${staffInfo.email || '-'}</td></tr>
                    <tr><td style="color:#64748b;">Phone:</td><td>${staffInfo.phone || '-'}</td></tr>
                  </table>
                </td>
                
                <td style="width: 4%;"></td>

                <!-- Payout Summary Card -->
                <td style="width: 48%; vertical-align: top; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
                  <div style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Monthly Payout Summary</div>
                  <div style="font-size: 20px; font-weight: 800; color: #10b981; margin-bottom: 6px;">₹${payout.toLocaleString('en-IN')}</div>
                  <table style="width: 100%; font-size: 11px; line-height: 1.6;">
                    <tr><td style="color:#64748b; width: 45%;">Base Salary:</td><td style="font-weight:bold;">₹${baseSalary.toLocaleString('en-IN')}</td></tr>
                    <tr><td style="color:#64748b;">Hourly Rate:</td><td style="font-weight:bold;">₹${hourlyRate} / hr</td></tr>
                    <tr><td style="color:#64748b;">Hours Worked:</td><td style="font-weight:bold;">${totalHoursWorked} hrs</td></tr>
                    <tr><td style="color:#64748b;">Deductions:</td><td style="font-weight:bold; color:#ef4444;">- ₹${deduction.toLocaleString('en-IN')}</td></tr>
                    <tr><td style="color:#64748b;">Efficiency:</td><td style="font-weight:bold; color:#2563eb;">${efficiency}%</td></tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- ATTENDANCE BREAKDOWN CARDS -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
              <tr>
                <td style="width: 23%; padding: 10px; text-align: center; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
                  <div style="font-size: 9px; font-weight: bold; color: #15803d; text-transform: uppercase; letter-spacing: 0.5px;">Presents</div>
                  <div style="font-size: 18px; font-weight: 800; color: #166534; margin-top: 4px;">${presents} <span style="font-size: 10px; font-weight: 500; color: #15803d;">Days</span></div>
                </td>
                <td style="width: 2%;"></td>
                <td style="width: 23%; padding: 10px; text-align: center; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px;">
                  <div style="font-size: 9px; font-weight: bold; color: #b91c1c; text-transform: uppercase; letter-spacing: 0.5px;">Full Leaves</div>
                  <div style="font-size: 18px; font-weight: 800; color: #991b1b; margin-top: 4px;">${leaves} <span style="font-size: 10px; font-weight: 500; color: #b91c1c;">Days</span></div>
                </td>
                <td style="width: 2%;"></td>
                <td style="width: 23%; padding: 10px; text-align: center; background: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px;">
                  <div style="font-size: 9px; font-weight: bold; color: #b45309; text-transform: uppercase; letter-spacing: 0.5px;">Half-Days</div>
                  <div style="font-size: 18px; font-weight: 800; color: #92400e; margin-top: 4px;">${halfDays} <span style="font-size: 10px; font-weight: 500; color: #b45309;">Days</span></div>
                </td>
                <td style="width: 2%;"></td>
                <td style="width: 23%; padding: 10px; text-align: center; background: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 8px;">
                  <div style="font-size: 9px; font-weight: bold; color: #6d28d9; text-transform: uppercase; letter-spacing: 0.5px;">CL Applied</div>
                  <div style="font-size: 18px; font-weight: 800; color: #5b21b6; margin-top: 4px;">${clUsed}</div>
                </td>
              </tr>
            </table>

            <!-- DAILY LOG TITLE -->
            <div style="font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 12px; color: #1e3a8a;">
              Daily Clock Cycle & Task Log
            </div>

            <!-- DAILY LOGS TABLE -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1; font-size: 10px; font-weight: bold; text-transform: uppercase; color: #475569; text-align: left;">
                  <th style="padding: 8px; width: 12%;">Date</th>
                  <th style="padding: 8px; width: 14%;">Status</th>
                  <th style="padding: 8px; width: 14%;">Satisfaction Zone</th>
                  <th style="padding: 8px; width: 8%; text-align: center;">Hours</th>
                  <th style="padding: 8px; width: 22%;">Sessions Details</th>
                  <th style="padding: 8px; width: 30%;">Working Tasks & Comments</th>
                </tr>
              </thead>
              <tbody>
                ${dailyRowsHTML}
              </tbody>
            </table>

          </div>
        </body>
        </html>
      `;

      const iframe = document.createElement('iframe');
      iframe.style.cssText = 'position:fixed; top:-9999px; left:-9999px; width:794px; height:1123px; border:none;';
      document.body.appendChild(iframe);
      iframe.contentDocument.open();
      iframe.contentDocument.write(fullHTML);
      iframe.contentDocument.close();

      await new Promise(resolve => setTimeout(resolve, 800));

      const canvas = await html2canvas(iframe.contentDocument.body, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794,
        windowWidth: 794,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      let yOffset = 0;

      while (yOffset < imgHeight) {
        if (yOffset > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, -yOffset, pdfWidth, imgHeight);
        yOffset += pdfHeight;
      }

      const filename = `${staffInfo.name.replace(/\s+/g, '_')}_Progress_Report_${selectedMonth.replace(/\s+/g, '_')}.pdf`;
      pdf.save(filename);

      document.body.removeChild(iframe);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      alert('Error generating PDF report. Please try again.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    if (!staffInfo || !dailyLogs.length) return;
    setDownloadingCsv(true);

    try {
      const headers = ['Date', 'Day', 'Status', 'Satisfaction Zone', 'Total Hours', 'Clock Sessions', 'Tasks', 'Management Feedback'];
      const rows = dailyLogs.map(log => {
        const sessionsStr = log.sessions.map((s, i) => `S${i + 1}: ${s.clockIn} - ${s.clockOut || 'Active'} (${s.duration || '-'})`).join(' | ');
        const tasksStr = log.tasks.map(t => `[${t.completed ? 'Done' : 'Pending'}] ${t.name}`).join(' | ');
        const zoneStr = log.satisfactionLevel ? `${log.satisfactionLevel.toUpperCase()} ZONE` : '-';
        return [
          `"${log.dateFormatted}"`,
          `"${log.weekday}"`,
          `"${log.status}"`,
          `"${zoneStr}"`,
          `"${log.totalHours}"`,
          `"${sessionsStr || '-'}"`,
          `"${tasksStr || '-'}"`,
          `"${(log.dailyComment || '').replace(/"/g, '""')}"`
        ];
      });

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${staffInfo.name.replace(/\s+/g, '_')}_Clock_Report_${selectedMonth.replace(/\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error generating CSV:', err);
    } finally {
      setDownloadingCsv(false);
    }
  };

  const getStatusBadge = (statusType, status) => {
    switch (statusType) {
      case 'present':
        return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-xl font-bold text-xs">✓ Present</span>;
      case 'active':
        return <span className="px-3 py-1 bg-emerald-500 text-white rounded-xl font-black text-xs animate-pulse">● Active Now</span>;
      case 'halfday':
        return <span className="px-3 py-1 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-xl font-bold text-xs">½ Half-Day</span>;
      case 'leave':
        return <span className="px-3 py-1 bg-purple-500/10 text-purple-600 border border-purple-500/20 rounded-xl font-bold text-xs">🌴 On Leave</span>;
      case 'sunday':
        return <span className="px-3 py-1 bg-blue-500/10 text-blue-600 border border-blue-500/20 rounded-xl font-bold text-xs">☀️ Sunday Off</span>;
      default:
        return <span className="px-3 py-1 bg-rose-500/10 text-rose-600 border border-rose-500/20 rounded-xl font-bold text-xs">✗ Absent</span>;
    }
  };

  const getZoneBadge = (level) => {
    if (level === 'red') {
      return (
        <span className="px-2.5 py-1 bg-rose-500/15 text-rose-700 border border-rose-500/30 rounded-lg text-xs font-black flex items-center gap-1">
          🔴 Red Zone
        </span>
      );
    }
    if (level === 'yellow') {
      return (
        <span className="px-2.5 py-1 bg-amber-500/15 text-amber-700 border border-amber-500/30 rounded-lg text-xs font-black flex items-center gap-1">
          🟡 Yellow Zone
        </span>
      );
    }
    if (level === 'green') {
      return (
        <span className="px-2.5 py-1 bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 rounded-lg text-xs font-black flex items-center gap-1">
          🟢 Green Zone
        </span>
      );
    }
    return <span className="text-slate-400 text-xs font-medium">-</span>;
  };

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Top Banner & Title */}
      <div className="clay-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 clay-flat hover:clay-inset rounded-xl text-slate-600 hover:text-purple-600 transition-all"
                title="Back to Dashboard"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <span className="px-3 py-1 bg-purple-500/10 text-purple-700 border border-purple-500/20 rounded-xl text-xs font-black uppercase tracking-wider">
              Official Employee Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            My Progress & Clock Report 📈
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl font-medium">
            View your complete daily clock cycles, in/out sessions, working duration, daily tasks, satisfaction zones, and download your monthly performance statement.
          </p>
        </div>

        {/* Month Selector & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 z-10">
          {/* Month Selector Dropdown */}
          <div className="relative min-w-[200px]">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
              Select Statement Month
            </label>
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full bg-[#eef2f6] clay-inset py-2.5 px-4 pr-10 rounded-2xl text-sm font-black text-slate-800 border-none outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-purple-500/30 transition-all"
              >
                {monthOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="text-slate-800 font-bold">
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchStaffData}
            disabled={loading}
            className="p-3 clay-flat hover:clay-inset rounded-2xl text-slate-600 hover:text-purple-600 transition-all self-end"
            title="Refresh Data"
          >
            <RefreshCw size={18} className={loading ? "animate-spin text-purple-600" : ""} />
          </button>

          {/* Download PDF Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownloadPDF}
            disabled={downloadingPdf}
            className="px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl font-black text-sm shadow-lg shadow-purple-500/25 flex items-center gap-2 transition-all self-end disabled:opacity-50"
          >
            {downloadingPdf ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download size={18} />
                <span>Download Report (PDF)</span>
              </>
            )}
          </motion.button>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            disabled={downloadingCsv}
            className="px-4 py-3 clay-flat hover:clay-inset text-slate-700 hover:text-purple-600 rounded-2xl font-black text-sm flex items-center gap-2 transition-all self-end"
            title="Export CSV Data"
          >
            <FileSpreadsheet size={18} />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Estimated / Final Payout Card */}
        <motion.div whileHover={{ y: -4 }} className="clay-card p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div className="p-3.5 rounded-2xl clay-inset bg-emerald-500 text-white">
              <IndianRupee size={22} />
            </div>
            <span className="text-[11px] font-black text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl">
              {monthMetrics?.isCurrentMonth ? 'Estimated' : 'Final Payout'}
            </span>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-500">Monthly Payout</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">
              ₹{(monthMetrics?.finalPayout || 0).toLocaleString('en-IN')}
            </h3>
          </div>
          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600 font-bold">
            <span>Base Salary:</span>
            <span>₹{(monthMetrics?.baseSalary || staffInfo?.monthlySalary || 0).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-rose-500 font-bold">
            <span>Deductions:</span>
            <span>- ₹{(monthMetrics?.deduction || 0).toLocaleString('en-IN')}</span>
          </div>
        </motion.div>

        {/* Clocked Hours Card */}
        <motion.div whileHover={{ y: -4 }} className="clay-card p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div className="p-3.5 rounded-2xl clay-inset bg-blue-500 text-white">
              <Clock size={22} />
            </div>
            <span className="text-[11px] font-black text-blue-600 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-xl">
              Rate: ₹{monthMetrics?.hourlyRate || 0}/hr
            </span>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-500">Total Hours Clocked</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">
              {monthMetrics?.totalHoursWorked || 0} <span className="text-sm text-slate-500 font-bold">hrs</span>
            </h3>
          </div>
          <div className="space-y-1 pt-2 border-t border-slate-200/60">
            <div className="flex justify-between text-xs font-bold text-slate-600">
              <span>Attendance Ratio:</span>
              <span className="text-blue-600">{monthMetrics?.attendancePercentage || 0}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, monthMetrics?.attendancePercentage || 0)}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Days Breakdown Card */}
        <motion.div whileHover={{ y: -4 }} className="clay-card p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div className="p-3.5 rounded-2xl clay-inset bg-purple-500 text-white">
              <Calendar size={22} />
            </div>
            <span className="text-[11px] font-black text-purple-600 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-xl">
              {monthMetrics?.casualLeaveUsed ? 'CL Applied' : 'No CL Used'}
            </span>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-500">Days Present / Worked</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">
              {monthMetrics?.presents || 0} <span className="text-sm text-slate-500 font-bold">Days</span>
            </h3>
          </div>
          <div className="pt-2 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-xs font-bold">
            <div className="flex justify-between text-rose-600 bg-rose-50 p-1.5 rounded-lg">
              <span>Leaves:</span>
              <span>{monthMetrics?.leaves || 0}d</span>
            </div>
            <div className="flex justify-between text-amber-600 bg-amber-50 p-1.5 rounded-lg">
              <span>Half-Days:</span>
              <span>{monthMetrics?.halfDays || 0}d</span>
            </div>
          </div>
        </motion.div>

        {/* Satisfaction Zones Card */}
        <motion.div whileHover={{ y: -4 }} className="clay-card p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div className="p-3.5 rounded-2xl clay-inset bg-amber-500 text-white">
              <ShieldAlert size={22} />
            </div>
            <span className="text-[11px] font-black text-slate-700 bg-slate-200/70 px-2.5 py-1 rounded-xl">
              Performance Standing
            </span>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-500">Satisfaction Zones</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-black">
                🟢 {zoneCounts.green}
              </span>
              <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-black">
                🟡 {zoneCounts.yellow}
              </span>
              <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-lg text-xs font-black">
                🔴 {zoneCounts.red}
              </span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-200/60 text-xs font-bold text-slate-600">
            {zoneCounts.red > 0 ? (
              <span className="text-rose-600 flex items-center gap-1 font-black">
                ⚠️ {zoneCounts.red} Red Zone days recorded
              </span>
            ) : zoneCounts.yellow > 0 ? (
              <span className="text-amber-600 font-black">
                Keep progressing to Green Zone
              </span>
            ) : (
              <span className="text-emerald-600 font-black">
                ✨ Excellent performance!
              </span>
            )}
          </div>
        </motion.div>
      </div>

      {/* Daily Clock Cycles & Progress Explorer */}
      <div className="clay-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <Clock className="text-purple-600" size={24} />
              Daily Clock Cycles & Session Breakdown
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Detailed breakdown of each day's clock-in & clock-out times, multiple sessions, and assigned tasks.
            </p>
          </div>

          {/* Search, Filter & View Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search by date */}
            <div className="relative min-w-[180px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search date / day..."
                value={dateSearchQuery}
                onChange={(e) => setDateSearchQuery(e.target.value)}
                className="w-full bg-[#eef2f6] clay-inset pl-9 pr-3 py-2 rounded-xl text-xs font-bold text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-[#eef2f6] p-1 rounded-xl clay-inset">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                  viewMode === 'cards' ? 'clay-flat text-purple-600' : 'text-slate-500 hover:text-purple-600'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                  viewMode === 'table' ? 'clay-flat text-purple-600' : 'text-slate-500 hover:text-purple-600'
                }`}
              >
                Table
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pb-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1 mr-2">
            <Filter size={14} /> Filter:
          </span>
          {[
            { id: 'all', label: 'All Days' },
            { id: 'present', label: 'Presents' },
            { id: 'halfday', label: 'Half-Days' },
            { id: 'leave', label: 'Leaves' },
            { id: 'absent', label: 'Absents' },
            { id: 'sunday', label: 'Sundays' },
            { id: 'green', label: '🟢 Green Zone' },
            { id: 'yellow', label: '🟡 Yellow Zone' },
            { id: 'red', label: '🔴 Red Zone' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                statusFilter === tab.id
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'clay-flat text-slate-600 hover:text-purple-600 hover:clay-inset'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Daily Logs Content */}
        {filteredDailyLogs.length === 0 ? (
          <div className="text-center py-16 clay-inset rounded-3xl space-y-3">
            <Clock size={40} className="mx-auto text-slate-300" />
            <h4 className="text-base font-black text-slate-700">No records found</h4>
            <p className="text-xs text-slate-400 font-medium">Try changing your search query or status filter.</p>
          </div>
        ) : viewMode === 'cards' ? (
          /* Cards View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDailyLogs.map((log) => (
              <motion.div
                key={log.dateYYYYMMDD}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "p-5 rounded-2xl border transition-all space-y-4",
                  log.satisfactionLevel === 'red'
                    ? "bg-rose-50/70 border-rose-300 shadow-sm"
                    : log.satisfactionLevel === 'yellow'
                    ? "bg-amber-50/70 border-amber-300 shadow-sm"
                    : log.satisfactionLevel === 'green'
                    ? "bg-emerald-50/70 border-emerald-300 shadow-sm"
                    : "clay-card border-slate-200/70"
                )}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-slate-900 text-base">{log.dateFormatted}</h4>
                      <span className="text-xs font-bold text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-md">
                        {log.weekday}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      {getStatusBadge(log.statusType, log.status)}
                      {log.satisfactionLevel && getZoneBadge(log.satisfactionLevel)}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      Daily Total
                    </span>
                    <span className="text-lg font-black text-purple-700">
                      {log.totalHours}
                    </span>
                  </div>
                </div>

                {/* Clock In / Out Sessions */}
                <div className="space-y-2 pt-3 border-t border-slate-200/70">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Clock size={13} className="text-purple-600" />
                      Clock Sessions ({log.sessions.length})
                    </span>
                  </div>

                  {log.sessions.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {log.sessions.map((session, idx) => (
                        <div
                          key={idx}
                          className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 text-xs font-medium space-y-1"
                        >
                          <div className="flex items-center justify-between font-black text-slate-700">
                            <span>Session #{idx + 1}</span>
                            <span className="text-purple-600">{session.duration || '-'}</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold">
                            <span>In: {session.clockIn}</span>
                            <span>Out: {session.clockOut || 'Active'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No clock sessions recorded for this day.</p>
                  )}
                </div>

                {/* Daily Tasks */}
                {log.tasks.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-200/70">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Working Tasks ({log.tasks.filter(t => t.completed).length}/{log.tasks.length} Completed)
                    </span>
                    <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                      {log.tasks.map((task, tidx) => (
                        <div
                          key={tidx}
                          className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-white/60"
                        >
                          <span className={cn(
                            "flex items-center gap-1.5 font-medium",
                            task.completed ? "text-emerald-700 line-through opacity-80" : "text-slate-700 font-bold"
                          )}>
                            {task.completed ? (
                              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                            ) : (
                              <XCircle size={14} className="text-slate-400 shrink-0" />
                            )}
                            {task.name}
                          </span>
                          {task.isExtra && (
                            <span className="text-[9px] font-black bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                              EXTRA
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Feedback / Management Comment */}
                {log.dailyComment && (
                  <div className="p-3 bg-indigo-50/90 border border-indigo-200/80 rounded-xl text-xs space-y-1">
                    <span className="font-black text-indigo-900 flex items-center gap-1">
                      <MessageSquare size={13} /> Management Feedback:
                    </span>
                    <p className="text-indigo-800 font-medium">{log.dailyComment}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-black uppercase text-[10px] tracking-wider">
                  <th className="p-3.5">Date & Day</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Zone</th>
                  <th className="p-3.5 text-center">Total Hours</th>
                  <th className="p-3.5">Clock Sessions</th>
                  <th className="p-3.5">Tasks & Comments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white/70">
                {filteredDailyLogs.map((log) => (
                  <tr key={log.dateYYYYMMDD} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 align-top font-bold text-slate-800 whitespace-nowrap">
                      {log.dateFormatted}
                      <span className="block text-[10px] text-slate-400 font-medium">{log.weekday}</span>
                    </td>
                    <td className="p-3.5 align-top">
                      {getStatusBadge(log.statusType, log.status)}
                    </td>
                    <td className="p-3.5 align-top">
                      {log.satisfactionLevel ? getZoneBadge(log.satisfactionLevel) : '-'}
                    </td>
                    <td className="p-3.5 align-top font-black text-center text-purple-700 text-sm whitespace-nowrap">
                      {log.totalHours}
                    </td>
                    <td className="p-3.5 align-top text-slate-700 space-y-1">
                      {log.sessions.length > 0 ? (
                        log.sessions.map((s, i) => (
                          <div key={i} className="text-[11px] whitespace-nowrap">
                            <span className="font-bold text-slate-900">S{i + 1}:</span> {s.clockIn} - {s.clockOut || 'Active'} <span className="text-purple-600 font-bold">({s.duration || '-'})</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-400 italic">-</span>
                      )}
                    </td>
                    <td className="p-3.5 align-top space-y-1 max-w-xs">
                      {log.tasks.length > 0 && (
                        <div className="space-y-0.5">
                          {log.tasks.map((t, tidx) => (
                            <div key={tidx} className="text-[11px] flex items-center gap-1">
                              {t.completed ? <span className="text-emerald-600 font-bold">✓</span> : <span className="text-slate-400">✗</span>}
                              <span className={t.completed ? "text-slate-500 line-through" : "text-slate-800 font-medium"}>
                                {t.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      {log.dailyComment && (
                        <div className="mt-1 p-2 bg-indigo-50 border-l-2 border-indigo-500 rounded text-[11px] text-indigo-900">
                          <strong>💬 Feedback:</strong> {log.dailyComment}
                        </div>
                      )}
                      {log.tasks.length === 0 && !log.dailyComment && (
                        <span className="text-slate-400 italic">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffProgressReport;
