import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  TrendingUp,
  Clock,
  AlertCircle,
  IndianRupee,
  Briefcase,
  Mail,
  Phone,
  User,
  Edit3,
  X,
  Save,
  Upload,
  Trash2,
  Calendar,
  LogIn,
  LogOut,
  CheckCircle2,
  Download,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ShieldAlert,
  RefreshCw
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Helper functions for time calculation
const calculateTotalMinutesFromDuration = (durationStr) => {
  if (durationStr === '-') return 0;
  const match = durationStr.match(/(\d+)h (\d+)m/);
  if (match) {
    const hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    return hours * 60 + minutes;
  }
  return 0;
};

const formatHoursMinutes = (totalMinutes) => {
  const rounded = Math.round(totalMinutes);
  const hours = Math.floor(rounded / 60);
  const minutes = rounded % 60;
  return `${hours}h ${minutes}m`;
};

const calculateCurrentMonthTotalHours = (clockRecords) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  let totalMinutes = 0;
  
  clockRecords.forEach(record => {
    const recordDate = new Date(record.date);
    if (recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear) {
      if (record.totalHours && record.totalHours !== '-') {
        totalMinutes += calculateTotalMinutesFromDuration(record.totalHours);
      }
    }
  });
  
  return totalMinutes;
};

const getCurrentMonthExpectedHours = () => {
  const now = new Date();
  const daysPassed = now.getDate(); // Current day of month = days passed so far
  // Assuming 8.5 hours per day (8h 30m)
  return daysPassed * 8.5 * 60;
};

const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getLocalDateString = (dateInput) => {
  if (!dateInput) return '';
  return new Date(dateInput).toDateString();
};

const getLocalDateStringFromInput = (dateInputStr) => {
  if (!dateInputStr) return '';
  const [year, month, day] = dateInputStr.split('-').map(Number);
  return new Date(year, month - 1, day).toDateString();
};

const formatSelectedDateNice = (dateInputStr) => {
  if (!dateInputStr) return '';
  const [year, month, day] = dateInputStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('default', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

const calculateDetailedMonthData = (staff, monthStr) => {
  if (!staff || !monthStr) return null;

  const cleanMonth = monthStr.replace(/\s*\(Current\)/i, '').trim();

  const paidHistory = (staff.salaryHistory || []).find(h => {
    const hCleaned = h.month.replace(/\s*\(Current\)/i, '').trim();
    return hCleaned === cleanMonth;
  });

  const baseSalary = paidHistory ? paidHistory.baseSalary : (staff.monthlySalary || 0);
  const STANDARD_HOURS_PER_DAY = 8.5;
  const EXPECTED_MONTHLY_HOURS = STANDARD_HOURS_PER_DAY * 30;
  const hourlyRate = baseSalary / EXPECTED_MONTHLY_HOURS;

  const match = cleanMonth.match(/([A-Za-z]+)\s+(\d+)/);
  if (!match) return null;
  const monthName = match[1];
  const year = parseInt(match[2]);
  const monthIndex = new Date(Date.parse(monthName + " 1, 2012")).getMonth();

  const today = new Date();
  const isCurrentMonth = today.getMonth() === monthIndex && today.getFullYear() === year;

  let daysToCount = new Date(year, monthIndex + 1, 0).getDate();
  if (isCurrentMonth) {
    daysToCount = today.getDate();
  }

  const expectedMinutes = daysToCount * STANDARD_HOURS_PER_DAY * 60;

  if (paidHistory) {
    const presents = 30 - (paidHistory.totalLeaves + paidHistory.totalHalfDays);
    const leaves = paidHistory.totalLeaves;
    const halfDays = paidHistory.totalHalfDays;
    const finalPayout = paidHistory.payoutSalary;
    const deduction = baseSalary - finalPayout;
    const attendancePercentage = Math.round(((30 - leaves - (halfDays * 0.5)) / 30) * 100);

    return {
      expectedMinutes,
      actualMinutes: presents * STANDARD_HOURS_PER_DAY * 60,
      differenceMinutes: 0,
      daysToCount,
      isCurrentMonth,
      presents,
      leaves,
      halfDays,
      casualLeaveUsed: !!paidHistory.casualLeavesUsed,
      deduction,
      finalPayout,
      attendancePercentage: Math.min(100, attendancePercentage),
      totalHoursWorked: '-',
      hourlyRate: Math.round(hourlyRate * 100) / 100,
      baseSalary
    };
  }

  const monthlyClockRecords = (staff.clock || []).filter(r => {
    const d = new Date(r.date);
    return d.getMonth() === monthIndex && d.getFullYear() === year;
  });

  const parseTotalHours = (str) => {
    if (!str || str === '-') return 0;
    const h = str.match(/(\d+)\s*h/i);
    const m = str.match(/(\d+)\s*m/i);
    return (h ? parseInt(h[1]) : 0) + (m ? parseInt(m[1]) / 60 : 0);
  };

  let totalHoursWorked = 0;
  monthlyClockRecords.forEach(r => {
    const actualHrs = parseTotalHours(r.totalHours);
    if (actualHrs > 9) {
      totalHoursWorked += 8.5 + (actualHrs - 9);
    } else if (actualHrs >= 8.5) {
      totalHoursWorked += 8.5;
    } else {
      totalHoursWorked += actualHrs;
    }
  });

  const creditedDates = new Set(monthlyClockRecords.map(r => new Date(r.date).toDateString()));

  const createdAt = staff.createdAt ? new Date(staff.createdAt) : null;
  const startDay = (
    createdAt &&
    createdAt.getMonth() === monthIndex &&
    createdAt.getFullYear() === year
  ) ? createdAt.getDate() : 1;

  const endDay = isCurrentMonth ? today.getDate() : new Date(year, monthIndex + 1, 0).getDate();
  for (let day = startDay; day <= endDay; day++) {
    const d = new Date(year, monthIndex, day);
    if (d.getDay() === 0 && !creditedDates.has(d.toDateString())) {
      totalHoursWorked += STANDARD_HOURS_PER_DAY;
      creditedDates.add(d.toDateString());
    }
  }

  (staff.leaves || []).forEach(leave => {
    const ld = new Date(leave.date);
    if (ld.getMonth() === monthIndex && ld.getFullYear() === year) {
      if (isCurrentMonth && ld > today) return;
      if (!creditedDates.has(ld.toDateString())) {
        totalHoursWorked += STANDARD_HOURS_PER_DAY;
        creditedDates.add(ld.toDateString());
      }
    }
  });

  (staff.attendance || []).forEach(att => {
    const ld = new Date(att.date);
    if (att.status === 'On Leave' && ld.getMonth() === monthIndex && ld.getFullYear() === year) {
      if (isCurrentMonth && ld > today) return;
      if (!creditedDates.has(ld.toDateString())) {
        totalHoursWorked += STANDARD_HOURS_PER_DAY;
        creditedDates.add(ld.toDateString());
      }
    }
  });

  const absentDaysList = [];
  for (let day = startDay; day <= endDay; day++) {
    const d = new Date(year, monthIndex, day);
    if (d.getDay() === 0) continue;
    if (!creditedDates.has(d.toDateString())) absentDaysList.push(d);
  }

  const halfDayRecords = (staff.attendance || []).filter(att => {
    const d = new Date(att.date);
    return att.status === 'Half-Day' && d.getMonth() === monthIndex && d.getFullYear() === year && (!isCurrentMonth || d <= today);
  });
  const halfDayLeaveUnits = Math.floor(halfDayRecords.length / 2);

  let casualLeaveUsed = false;
  if (absentDaysList.length > 0) {
    totalHoursWorked += STANDARD_HOURS_PER_DAY;
    creditedDates.add(absentDaysList[0].toDateString());
    casualLeaveUsed = true;
  } else if (halfDayLeaveUnits > 0) {
    for (let i = 0; i < 2; i++) {
      const hdDate = new Date(halfDayRecords[i].date);
      const cr = monthlyClockRecords.find(r => new Date(r.date).toDateString() === hdDate.toDateString());
      const actualHrs = cr ? parseTotalHours(cr.totalHours) : 0;
      const halfTarget = STANDARD_HOURS_PER_DAY / 2;
      if (actualHrs < halfTarget) totalHoursWorked += halfTarget - actualHrs;
    }
    casualLeaveUsed = true;
  }

  const presents = monthlyClockRecords.length;
  const finalPayout = Math.round(hourlyRate * totalHoursWorked);
  const deduction = Math.max(0, baseSalary - finalPayout);
  const attendancePercentage = Math.round((totalHoursWorked / EXPECTED_MONTHLY_HOURS) * 100);

  return {
    expectedMinutes,
    actualMinutes: totalHoursWorked * 60,
    differenceMinutes: (totalHoursWorked * 60) - expectedMinutes,
    daysToCount,
    isCurrentMonth,
    presents,
    leaves: Math.max(0, absentDaysList.length - (casualLeaveUsed && absentDaysList.length > 0 ? 1 : 0)),
    halfDays: halfDayRecords.length,
    casualLeaveUsed: !!casualLeaveUsed,
    deduction,
    finalPayout,
    attendancePercentage: Math.min(100, attendancePercentage),
    totalHoursWorked: Math.round(totalHoursWorked * 100) / 100,
    hourlyRate: Math.round(hourlyRate * 100) / 100,
    baseSalary
  };
};

const calculateMonthPerformance = (staff, monthStr) => {
  return calculateDetailedMonthData(staff, monthStr);
};

const calculateMonthMetrics = (staff, monthStr) => {
  return calculateDetailedMonthData(staff, monthStr);
};

const htmlToPDF = async (html, filename) => {
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed; top:-9999px; left:-9999px; width:794px; height:1123px; border:none;';
  document.body.appendChild(iframe);
  iframe.contentDocument.open();
  iframe.contentDocument.write(html);
  iframe.contentDocument.close();
  await new Promise(resolve => setTimeout(resolve, 1000));
  try {
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
    pdf.save(filename);
  } finally {
    document.body.removeChild(iframe);
  }
};

const generateMonthlyReportHTML = (staff, selectedMonthStr) => {
  const monthReport = calculateMonthMetrics(staff, selectedMonthStr);
  const match = selectedMonthStr.match(/([A-Za-z]+)\s+(\d+)/);
  const monthName = match ? match[1] : '';
  const year = match ? parseInt(match[2]) : new Date().getFullYear();
  const monthIndex = new Date(Date.parse(monthName + " 1, 2012")).getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  // Generate Daily Logs HTML
  let dailyRowsHTML = '';
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, monthIndex, day);
    const dateStr = d.toDateString();
    
    // Stop listing future dates beyond today if it's the current month
    const today = new Date();
    today.setHours(0,0,0,0);
    if (d > today) break;

    const clockRecord = (staff.clock || []).find(r => new Date(r.date).toDateString() === dateStr);
    const attRecord = (staff.attendance || []).find(a => new Date(a.date).toDateString() === dateStr);
    const leaveRecord = (staff.leaves || []).find(l => new Date(l.date).toDateString() === dateStr);
    const workRecord = (staff.work || []).find(w => new Date(w.date).toDateString() === dateStr);
    
    const isSunday = d.getDay() === 0;

    let status = 'Absent';
    let statusClass = 'color: #ef4444; font-weight: bold;'; // absent = red
    
    if (clockRecord) {
      const active = clockRecord.sessions.some(s => !s.clockOut);
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

    // Sessions text
    let sessionsText = '-';
    if (clockRecord && clockRecord.sessions && clockRecord.sessions.length > 0) {
      sessionsText = clockRecord.sessions.map((s, i) => 
        `S${i+1}: ${s.clockIn} - ${s.clockOut || 'Active'} (${s.duration || '-'})`
      ).join('<br>');
    }

    // Tasks text
    let tasksText = '-';
    if (workRecord && workRecord.tasks && workRecord.tasks.length > 0) {
      tasksText = workRecord.tasks.map(t => 
        `<div style="margin-bottom: 2px; font-size: 10px;">
          ${t.completed ? '<span style="color:#10b981;">[✓]</span>' : '<span style="color:#ef4444;">[✗]</span>'} 
          ${t.name} ${t.isExtra ? '<span style="color:#3b82f6; font-size:8px; font-weight:bold;">(EXTRA)</span>' : ''}
        </div>`
      ).join('');
    }

    const totalHours = clockRecord ? clockRecord.totalHours : '-';

    dailyRowsHTML += `
      <tr style="border-bottom: 1px solid #e5e7eb; font-size: 11px;">
        <td style="padding: 8px; vertical-align: top;">${d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', weekday: 'short' })}</td>
        <td style="padding: 8px; vertical-align: top; ${statusClass}">${status}</td>
        <td style="padding: 8px; vertical-align: top; font-weight: bold; text-align: center;">${totalHours}</td>
        <td style="padding: 8px; vertical-align: top; font-size: 10px; line-height: 1.4;">${sessionsText}</td>
        <td style="padding: 8px; vertical-align: top;">${tasksText}</td>
      </tr>
    `;
  }

  const baseSalary = monthReport?.baseSalary ?? staff.monthlySalary ?? 0;
  const payout = monthReport?.finalPayout ?? 0;
  const deduction = monthReport?.deduction ?? 0;
  const presents = monthReport?.presents ?? 0;
  const leaves = monthReport?.leaves ?? 0;
  const halfDays = monthReport?.halfDays ?? 0;
  const efficiency = monthReport?.attendancePercentage ?? 0;
  const totalHoursWorked = monthReport?.totalHoursWorked ?? 0;
  const hourlyRate = monthReport?.hourlyRate ?? 0;
  const clUsed = monthReport?.casualLeaveUsed ? 'Yes' : 'No';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Monthly Performance Report - ${staff.name}</title>
    </head>
    <body style="margin: 0; padding: 25px; background: #fff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1f2937;">
      
      <div style="width: 190mm; margin: 0 auto; background: #fff;">
        
        <!-- HEADER -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
          <tr>
            <td style="vertical-align: top;">
              <div style="font-size: 22px; font-weight: 800; letter-spacing: -0.5px; color: #1e3a8a;">RIZE WORLD DIGITAL MARKETING</div>
              <div style="font-size: 11px; color: #6b7280; font-weight: bold; text-transform: uppercase; margin-top: 3px; letter-spacing: 1px;">Monthly Performance & Payout Report</div>
            </td>
            <td style="text-align: right; vertical-align: top;">
              <div style="font-size: 16px; font-weight: 800; color: #0d9488;">${selectedMonthStr}</div>
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
              <div style="font-size: 16px; font-weight: 800; color: #0f172a; margin-bottom: 6px;">${staff.name}</div>
              <table style="width: 100%; font-size: 11px; line-height: 1.6;">
                <tr><td style="color:#64748b; width: 35%;">ID:</td><td style="font-weight:bold;">${staff.employeeId || '-'}</td></tr>
                <tr><td style="color:#64748b;">Department:</td><td style="font-weight:bold;">${staff.department}</td></tr>
                <tr><td style="color:#64748b;">Role:</td><td style="font-weight:bold;">${staff.role || 'Employee'}</td></tr>
                <tr><td style="color:#64748b;">Job Type:</td><td style="font-weight:bold;">${staff.jobType}</td></tr>
                <tr><td style="color:#64748b;">Email:</td><td>${staff.email}</td></tr>
                <tr><td style="color:#64748b;">Phone:</td><td>${staff.phone}</td></tr>
              </table>
            </td>
            
            <td style="width: 4%;"></td>

            <!-- Payout Summary Card -->
            <td style="width: 48%; vertical-align: top; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
              <div style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Payout Summary</div>
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
              <th style="padding: 8px; width: 15%;">Date</th>
              <th style="padding: 8px; width: 22%;">Status</th>
              <th style="padding: 8px; width: 13%; text-align: center;">Hours</th>
              <th style="padding: 8px; width: 25%;">Sessions Details</th>
              <th style="padding: 8px; width: 25%;">Working Tasks</th>
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
};

// ─── Password Gate (shared with Salary Sheet) ────────────────────────────────────────
const PerformancePasswordGate = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('http://localhost:45000/api/staff/salary-sheet/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem('salary_unlocked', 'true');
        onUnlock();
      } else {
        setError(data.message || 'Incorrect password.');
        setShake(true);
        setTimeout(() => setShake(false), 600);
      }
    } catch {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        <motion.div
          animate={shake ? { x: [-12, 12, -10, 10, -6, 6, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl shadow-black/10 dark:shadow-black/40 border border-gray-100 dark:border-white/10 overflow-hidden"
        >
          <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          <div className="p-8 sm:p-10">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Lock className="w-9 h-9 text-white" />
              </div>
            </div>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Staff Performance</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">This page contains confidential salary and performance data. Enter the admin password to continue.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Access Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="Enter admin password"
                    className="w-full px-4 py-3.5 pr-12 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    autoFocus
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5 mt-2">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <p className="text-xs text-red-500">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button
                type="submit"
                disabled={loading || !password.trim()}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Unlock className="w-4 h-4" />}
                {loading ? 'Verifying…' : 'Unlock Performance Page'}
              </button>
            </form>
            <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6">🔒 Session automatically locks when you close the tab</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const StaffPerformance = ({ staffId, onBack }) => {
  const [staff, setStaff] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [allStaff, setAllStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    email: '',
    monthlySalary: '',
    department: '',
    jobType: '',
    joiningDate: '',
    accountHolder: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentName, setDocumentName] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchStaffDetails = async () => {
      try {
        const response = await fetch(`http://localhost:45000/api/staff`);
        const result = await response.json();
        if (result.success) {
          setAllStaff(result.data);
          const foundStaff = result.data.find(s => s._id === staffId);
          setStaff(foundStaff);
          // Initialize edit form with staff data, fix legacy department value
          setEditForm({
            name: foundStaff?.name || '',
            phone: foundStaff?.phone || '',
            email: foundStaff?.email || '',
            monthlySalary: foundStaff?.monthlySalary || '',
            department: foundStaff?.department === 'WEB DEvlopment' ? 'WEB Development' : foundStaff?.department || '',
            jobType: foundStaff?.jobType || '',
            joiningDate: foundStaff?.joiningDate ? new Date(foundStaff.joiningDate).toISOString().split('T')[0] : '',
            accountHolder: foundStaff?.accountHolder || '',
            accountNumber: foundStaff?.accountNumber || '',
            ifscCode: foundStaff?.ifscCode || '',
            bankName: foundStaff?.bankName || '',
            password: ''
          });
        }
      } catch (error) {
        console.error('Error fetching staff details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStaffDetails();
  }, [staffId]);

  // Reusable input change handler
  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: field === 'monthlySalary' ? (value ? Number(value) : '') : value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:45000/api/staff/${staffId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...editForm,
          password: editForm.password ? editForm.password : undefined
        })
      });
      const result = await response.json();
      if (result.success) {
        setStaff(result.data);
        // Update edit form with new data
        setEditForm({
          name: result.data.name || '',
          phone: result.data.phone || '',
          email: result.data.email || '',
          monthlySalary: result.data.monthlySalary || '',
          department: result.data.department || '',
          jobType: result.data.jobType || '',
          joiningDate: result.data.joiningDate ? new Date(result.data.joiningDate).toISOString().split('T')[0] : '',
          accountHolder: result.data.accountHolder || '',
          accountNumber: result.data.accountNumber || '',
          ifscCode: result.data.ifscCode || '',
          bankName: result.data.bankName || '',
          password: ''
        });
        setIsEditModalOpen(false);
        alert('Staff details updated successfully!');
      } else {
        alert('Failed to update staff details: ' + result.message);
      }
    } catch (error) {
      console.error('Error updating staff details:', error);
      alert('Error updating staff details!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadDocument = async () => {
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('document', selectedFile);
      formData.append('name', documentName || selectedFile.name);

      const response = await fetch(`http://localhost:45000/api/staff/${staffId}/upload-document`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      if (result.success) {
        setStaff(result.data);
        setSelectedFile(null);
        setDocumentName('');
        alert('Document uploaded successfully');
      } else {
        alert('Failed to upload document: ' + result.message);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Error uploading document');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:45000/api/staff/${staffId}/document/${docId}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      if (result.success) {
        setStaff(result.data);
        alert('Document deleted successfully');
      } else {
        alert('Failed to delete document: ' + result.message);
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Error deleting document');
    }
  };

  const performanceReport = useMemo(() => {
    if (!staff) return null;

    // Use historical data from database if available
    const history = (staff.salaryHistory || []).map(h => ({
      month: h.month,
      presents: 30 - (h.totalLeaves + h.totalHalfDays), // Approximate
      leaves: h.totalLeaves,
      halfDays: h.totalHalfDays,
      casualLeaveUsed: h.casualLeavesUsed, // Fix field name typo (plural)
      deduction: h.baseSalary - h.payoutSalary,
      finalPayout: h.payoutSalary,
      attendancePercentage: Math.round(((30 - h.totalLeaves - (h.totalHalfDays * 0.5)) / 30) * 100)
    }));

    // Current month real-time calculation
    const currentMonthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    
    // Check if current month is already in history (already paid)
    const isCurrentMonthPaid = history.some(h => h.month === currentMonthName);

    if (!isCurrentMonthPaid) {
      const baseSalary = staff.monthlySalary || 0;
      const STANDARD_HOURS_PER_DAY = 8.5;
      const EXPECTED_MONTHLY_HOURS = STANDARD_HOURS_PER_DAY * 30; // 255 hrs
      const hourlyRate = baseSalary / EXPECTED_MONTHLY_HOURS;

      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      // Start from createdAt date if added this month, else day 1
      const createdAt = staff.createdAt ? new Date(staff.createdAt) : null;
      const startDay = (
        createdAt &&
        createdAt.getMonth() === currentMonth &&
        createdAt.getFullYear() === currentYear
      ) ? createdAt.getDate() : 1;

      const parseTotalHours = (str) => {
        if (!str || str === '-') return 0;
        const h = str.match(/(\d+)\s*h/i);
        const m = str.match(/(\d+)\s*m/i);
        return (h ? parseInt(h[1]) : 0) + (m ? parseInt(m[1]) / 60 : 0);
      };

      // Step 1: Sum actual clock hours
      const monthlyClockRecords = (staff.clock || []).filter(r => {
        const d = new Date(r.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });
      let totalHoursWorked = 0;
      monthlyClockRecords.forEach(r => {
        const actualHrs = parseTotalHours(r.totalHours);
        if (actualHrs > 9) {
          totalHoursWorked += 8.5 + (actualHrs - 9);
        } else if (actualHrs >= 8.5) {
          totalHoursWorked += 8.5;
        } else {
          totalHoursWorked += actualHrs;
        }
      });

      const creditedDates = new Set(monthlyClockRecords.map(r => new Date(r.date).toDateString()));

      // Step 2: Credit Sundays
      for (let day = startDay; day <= today.getDate(); day++) {
        const d = new Date(currentYear, currentMonth, day);
        if (d.getDay() === 0 && !creditedDates.has(d.toDateString())) {
          totalHoursWorked += STANDARD_HOURS_PER_DAY;
          creditedDates.add(d.toDateString());
        }
      }

      // Step 3: Credit admin-declared leaves
      (staff.leaves || []).forEach(leave => {
        const ld = new Date(leave.date);
        if (ld.getMonth() === currentMonth && ld.getFullYear() === currentYear && ld <= today && !creditedDates.has(ld.toDateString())) {
          totalHoursWorked += STANDARD_HOURS_PER_DAY;
          creditedDates.add(ld.toDateString());
        }
      });

      // Credit 8.5 hrs for manual daily attendance marked as 'On Leave'
      (staff.attendance || []).forEach(att => {
        const attDate = new Date(att.date);
        if (
          att.status === 'On Leave' &&
          attDate.getMonth() === currentMonth &&
          attDate.getFullYear() === currentYear &&
          attDate <= today &&
          !creditedDates.has(attDate.toDateString())
        ) {
          totalHoursWorked += STANDARD_HOURS_PER_DAY;
          creditedDates.add(attDate.toDateString());
        }
      });

      // Step 4: Find absent days
      const absentDaysList = [];
      for (let day = startDay; day <= today.getDate(); day++) {
        const d = new Date(currentYear, currentMonth, day);
        if (!creditedDates.has(d.toDateString())) absentDaysList.push(d);
      }

      // Step 5: Find half-days from attendance
      const halfDayRecords = (staff.attendance || []).filter(att => {
        const d = new Date(att.date);
        return att.status === 'Half-Day' && d.getMonth() === currentMonth && d.getFullYear() === currentYear && d <= today;
      });
      const halfDayLeaveUnits = Math.floor(halfDayRecords.length / 2);

      // Step 6: Apply 1 free casual leave
      let casualLeaveUsed = false;
      if (absentDaysList.length > 0) {
        totalHoursWorked += STANDARD_HOURS_PER_DAY;
        creditedDates.add(absentDaysList[0].toDateString());
        casualLeaveUsed = true;
      } else if (halfDayLeaveUnits > 0) {
        for (let i = 0; i < 2; i++) {
          const hdDate = new Date(halfDayRecords[i].date);
          const cr = monthlyClockRecords.find(r => new Date(r.date).toDateString() === hdDate.toDateString());
          const actualHrs = cr ? parseTotalHours(cr.totalHours) : 0;
          const halfTarget = STANDARD_HOURS_PER_DAY / 2;
          if (actualHrs < halfTarget) totalHoursWorked += halfTarget - actualHrs;
        }
        casualLeaveUsed = true;
      }

      const finalPayout = Math.round(hourlyRate * totalHoursWorked);
      const deduction = Math.max(0, baseSalary - finalPayout);
      const daysWorked = monthlyClockRecords.length;
      const presents = daysWorked;
      const fullLeaves = absentDaysList.length;
      const halfDays = halfDayRecords.length;
      const attendancePercentage = Math.round((totalHoursWorked / EXPECTED_MONTHLY_HOURS) * 100);

      history.push({
        month: currentMonthName + " (Current)",
        presents,
        leaves: fullLeaves,
        halfDays,
        casualLeaveUsed,
        deduction,
        finalPayout,
        attendancePercentage,
        // hours-based extras for display
        totalHoursWorked: Math.round(totalHoursWorked * 100) / 100,
        hourlyRate: Math.round(hourlyRate * 100) / 100,
        baseSalary
      });
    }

    return history.reverse();
  }, [staff]);

  const [selectedReportMonth, setSelectedReportMonth] = useState('');

  const availableMonths = useMemo(() => {
    if (!staff) return [];
    
    const months = new Set();
    
    const now = new Date();
    const currentMonthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });
    months.add(currentMonthName);

    (staff.clock || []).forEach(r => {
      if (r.date) {
        const d = new Date(r.date);
        months.add(d.toLocaleString('default', { month: 'long', year: 'numeric' }));
      }
    });

    (staff.salaryHistory || []).forEach(h => {
      if (h.month) {
        const cleaned = h.month.replace(/\s*\(Current\)/i, '').trim();
        months.add(cleaned);
      }
    });

    (staff.attendance || []).forEach(a => {
      if (a.date) {
        const d = new Date(a.date);
        months.add(d.toLocaleString('default', { month: 'long', year: 'numeric' }));
      }
    });

    (staff.leaves || []).forEach(l => {
      if (l.date) {
        const d = new Date(l.date);
        months.add(d.toLocaleString('default', { month: 'long', year: 'numeric' }));
      }
    });

    (staff.work || []).forEach(w => {
      if (w.date) {
        const d = new Date(w.date);
        months.add(d.toLocaleString('default', { month: 'long', year: 'numeric' }));
      }
    });

    const sortedMonths = Array.from(months).sort((a, b) => {
      const dateA = new Date(Date.parse(a + " 1"));
      const dateB = new Date(Date.parse(b + " 1"));
      return dateB.getTime() - dateA.getTime();
    });

    return sortedMonths;
  }, [staff]);

  useEffect(() => {
    if (availableMonths && availableMonths.length > 0 && !selectedReportMonth) {
      setSelectedReportMonth(availableMonths[0]);
    }
  }, [availableMonths, selectedReportMonth]);

  useEffect(() => {
    if (selectedReportMonth) {
      const match = selectedReportMonth.match(/([A-Za-z]+)\s+(\d+)/);
      if (match) {
        const monthName = match[1];
        const year = parseInt(match[2]);
        const monthIndex = new Date(Date.parse(monthName + " 1, 2012")).getMonth();
        
        const today = new Date();
        if (today.getMonth() === monthIndex && today.getFullYear() === year) {
          setSelectedDate(getTodayDateString());
        } else {
          const monthStr = String(monthIndex + 1).padStart(2, '0');
          setSelectedDate(`${year}-${monthStr}-01`);
        }
      }
    }
  }, [selectedReportMonth]);

  const handleDownloadMonthlyReport = async () => {
    if (!staff || !selectedReportMonth) return;
    try {
      const filename = `Monthly_Report_${staff.name.replace(/\s+/g, '_')}_${selectedReportMonth.replace(/\s+/g, '_')}.pdf`;
      const html = generateMonthlyReportHTML(staff, selectedReportMonth);
      
      alert('Generating monthly report PDF, please wait...');
      await htmlToPDF(html, filename);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF monthly report: ' + err.message);
    }
  };

  const renderDailyClockCycle = () => {
    if (!staff) return null;

    const selectedLocalDateStr = getLocalDateStringFromInput(selectedDate);
    
    // Find daily records
    const dailyClockRecord = (staff.clock || []).find(
      r => getLocalDateString(r.date) === selectedLocalDateStr
    );
    const dailyAttendanceRecord = (staff.attendance || []).find(
      a => getLocalDateString(a.date) === selectedLocalDateStr
    );
    const dailyLeaveRecord = (staff.leaves || []).find(
      l => getLocalDateString(l.date) === selectedLocalDateStr
    );

    const [year, month, day] = selectedDate.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const isSunday = dateObj.getDay() === 0;

    const niceDate = formatSelectedDateNice(selectedDate);

    // Determine status badge
    let statusText = "No Record";
    let statusColor = "bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400";
    
    if (dailyClockRecord) {
      const hasActiveSession = dailyClockRecord.sessions.some(s => !s.clockOut);
      if (hasActiveSession) {
        statusText = "Active Now";
        statusColor = "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 animate-pulse";
      } else {
        statusText = dailyAttendanceRecord?.status || "Present";
        if (statusText === "Half-Day") {
          statusColor = "bg-amber-500/20 text-amber-600 dark:text-amber-400";
        } else {
          statusColor = "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400";
        }
      }
    } else if (isSunday) {
      statusText = "Sunday (Paid)";
      statusColor = "bg-blue-500/20 text-blue-600 dark:text-blue-400";
    } else if (dailyLeaveRecord) {
      statusText = `Leave (${dailyLeaveRecord.type || 'Casual'})`;
      statusColor = "bg-purple-500/20 text-purple-600 dark:text-purple-400";
    } else if (dailyAttendanceRecord) {
      statusText = dailyAttendanceRecord.status;
      if (statusText === "Absent") {
        statusColor = "bg-rose-500/20 text-rose-600 dark:text-rose-400";
      } else if (statusText === "On Leave") {
        statusText = "On Leave";
        statusColor = "bg-purple-500/20 text-purple-600 dark:text-purple-400";
      } else if (statusText === "Half-Day") {
        statusColor = "bg-amber-500/20 text-amber-600 dark:text-amber-400";
      }
    } else {
      // Check if date is in the future
      const today = new Date();
      today.setHours(0,0,0,0);
      if (dateObj > today) {
        statusText = "Scheduled";
        statusColor = "bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400";
      } else {
        statusText = "Absent (Unmarked)";
        statusColor = "bg-rose-500/10 text-rose-500/70";
      }
    }

    return (
      <div className="space-y-4">
        {/* Day Header Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 gap-3">
          <div>
            <h4 className="text-sm font-black text-gray-400 uppercase tracking-wider">Selected Date</h4>
            <p className="text-base sm:text-lg font-black text-gray-900 dark:text-white mt-0.5">{niceDate}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${statusColor}`}>
              {statusText}
            </span>
            {dailyClockRecord && (
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-500/20 text-blue-600 dark:text-blue-400">
                Total: {dailyClockRecord.totalHours || '-'}
              </span>
            )}
          </div>
        </div>

        {/* Sessions list */}
        {dailyClockRecord && dailyClockRecord.sessions && dailyClockRecord.sessions.length > 0 ? (
          <div className="relative border-l-2 border-blue-500/20 ml-4 pl-6 space-y-6 py-2">
            {dailyClockRecord.sessions.map((session, idx) => (
              <div key={session._id || idx} className="relative group">
                {/* Timeline Dot Icon */}
                <div className="absolute -left-[35px] top-0.5 w-6.5 h-6.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 border-2 border-white dark:border-[#111] flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                  <Clock size={12} className="text-blue-500" />
                </div>
                
                {/* Session Card */}
                <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-blue-500 uppercase tracking-widest">Session {idx + 1}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${session.clockOut ? 'bg-gray-200 text-gray-600 dark:bg-white/10 dark:text-gray-300' : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'}`}>
                      {session.clockOut ? 'Completed' : 'In Progress'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Clock In */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                        <LogIn size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Clock In</p>
                        <p className="text-sm font-black text-gray-900 dark:text-white">{session.clockIn}</p>
                      </div>
                    </div>

                    {/* Clock Out */}
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${session.clockOut ? 'bg-rose-500/10 text-rose-500' : 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}>
                        <LogOut size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Clock Out</p>
                        <p className="text-sm font-black text-gray-900 dark:text-white">{session.clockOut || '-'}</p>
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                        <Clock size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Duration</p>
                        <p className="text-sm font-black text-gray-900 dark:text-white">{session.duration || '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty / Holiday / Absent State */
          <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 text-center space-y-3">
            <div className="p-4 rounded-full bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500">
              <Calendar size={36} />
            </div>
            <div>
              <p className="text-base font-black text-gray-900 dark:text-white">No Clock Cycle Record</p>
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mt-1 max-w-sm">
                {isSunday 
                  ? "This date falls on a Sunday, which is a paid holiday. No attendance or clock-in records are expected." 
                  : dailyLeaveRecord 
                    ? `The employee is marked on leave (${dailyLeaveRecord.type || 'Casual'}) for this date.` 
                    : dailyAttendanceRecord?.status === "On Leave"
                      ? "The employee is marked on leave for this date."
                      : dailyAttendanceRecord?.status === "Absent"
                        ? "The employee has been marked as absent for this date."
                        : "No clock-in or clock-out sessions exist for this day."
                }
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Update edit form when modal opens or staff changes
  useEffect(() => {
    if (isEditModalOpen && staff) {
      setEditForm({
        name: staff.name || '',
        phone: staff.phone || '',
        email: staff.email || '',
        monthlySalary: staff.monthlySalary || '',
        department: staff.department === 'WEB DEvlopment' ? 'WEB Development' : staff.department || '',
        jobType: staff.jobType || '',
        joiningDate: staff.joiningDate ? new Date(staff.joiningDate).toISOString().split('T')[0] : '',
        accountHolder: staff.accountHolder || '',
        accountNumber: staff.accountNumber || '',
        ifscCode: staff.ifscCode || '',
        bankName: staff.bankName || '',
        password: ''
      });
    }
  }, [isEditModalOpen, staff]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!staff) return <div className="p-8 text-center">Staff member not found.</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-gray-100 dark:border-white/5 pb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors self-start"
        >
          <ArrowLeft size={20} />
          <span className="font-bold uppercase tracking-widest text-xs">Back to Staff List</span>
        </button>
        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Performance Report</h1>
            <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest">Monthly Salary & Attendance Breakdown</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <select
              value={selectedReportMonth}
              onChange={(e) => setSelectedReportMonth(e.target.value)}
              className="bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-200 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {availableMonths.map(m => (
                <option key={m} value={m} className="text-gray-900 dark:bg-gray-900 dark:text-white">
                  {m}
                </option>
              ))}
            </select>
            <button
              onClick={handleDownloadMonthlyReport}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              <Download size={16} />
              Download Report
            </button>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              <Edit3 size={16} />
              Edit Details
            </button>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-[#111] p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm flex flex-col md:flex-row gap-6 sm:gap-8 items-center">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-500 border-2 border-white/10 shrink-0">
          <User size={64} />
        </div>
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">{staff.name}</h2>
            <p className="text-blue-500 font-black uppercase tracking-[0.2em] text-sm mt-1">{staff.department} • {staff.jobType}</p>
          </div>
          <div className="flex flex-wrap gap-6 justify-center md:justify-start">
            <span className="flex items-center gap-2 text-gray-500 font-bold text-sm"><Mail size={16} /> {staff.email}</span>
            <span className="flex items-center gap-2 text-gray-500 font-bold text-sm"><Phone size={16} /> {staff.phone}</span>
            <span className="flex items-center gap-2 text-gray-500 font-bold text-sm"><Briefcase size={16} /> Base: ₹{staff.monthlySalary?.toLocaleString()}</span>
            {staff.reportingPerson && (() => {
              const reportingPersonIds = Array.isArray(staff.reportingPerson)
                ? staff.reportingPerson
                : (staff.reportingPerson && staff.reportingPerson !== '-' ? [staff.reportingPerson] : []);

              if (reportingPersonIds.length === 0) return null;

              const managerNames = reportingPersonIds
                .map(id => {
                  const match = allStaff.find(s => s.employeeId === id);
                  return match ? match.name : id;
                })
                .join(', ');

              return (
                <span className="flex items-center gap-2 text-gray-500 font-bold text-sm" title={`IDs: ${reportingPersonIds.join(', ')}`}>
                  <User size={16} /> Repo: {managerNames || '-'}
                </span>
              );
            })()}
            <span className="flex items-center gap-2 text-gray-500 font-bold text-sm">
              <Clock size={16} />
              {(() => {
                const currentMonthTotalMinutes = calculateCurrentMonthTotalHours(staff.clock || []);
                const expectedMinutes = getCurrentMonthExpectedHours();
                const differenceMinutes = currentMonthTotalMinutes - expectedMinutes;
                const currentMonthTotalFormatted = formatHoursMinutes(currentMonthTotalMinutes);
                const differenceFormatted = formatHoursMinutes(Math.abs(differenceMinutes));
                
                return (
                  <>
                    {currentMonthTotalFormatted} This Month
                    {differenceMinutes !== 0 && (
                      <span className={`ml-2 ${differenceMinutes > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        ({differenceMinutes > 0 ? '+' : '-'}{differenceFormatted})
                      </span>
                    )}
                  </>
                );
              })()}
            </span>
          </div>
        </div>
      </div>

      {/* Daily Clock Cycle (Individual Clock Cycle of Selected Date) */}
      <div className="bg-white dark:bg-[#111] p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="text-blue-500" size={24} />
              Daily Clock Cycle
            </h3>
            <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Select a date to view detailed log</p>
          </div>
          <div className="flex items-center gap-3">
            <Calendar size={18} className="text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            />
          </div>
        </div>

        {/* Selected Date Details */}
        {renderDailyClockCycle()}
      </div>

      {/* Working Hours Calculation Breakdown */}
      <div className="bg-white dark:bg-[#111] p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm">
        <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Clock size={24} className="text-blue-500" />
          Working Hours Calculation
        </h3>
        {(() => {
          const perf = calculateMonthPerformance(staff, selectedReportMonth);
          if (!perf) return null;

          const currentMonthTotalFormatted = formatHoursMinutes(perf.actualMinutes);
          const expectedFormatted = formatHoursMinutes(perf.expectedMinutes);
          const differenceFormatted = formatHoursMinutes(Math.abs(perf.differenceMinutes));
          
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Expected Hours</p>
                  <p className="text-xl font-black text-blue-600 dark:text-blue-400">{expectedFormatted}</p>
                  <p className="text-[10px] text-gray-500 mt-1">8.5h/day × {perf.daysToCount} days {perf.isCurrentMonth ? 'so far' : 'in month'}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Actual Hours Worked</p>
                  <p className="text-xl font-black text-gray-900 dark:text-white">{currentMonthTotalFormatted}</p>
                </div>
                <div className={`p-4 border rounded-2xl ${perf.differenceMinutes > 0 ? 'bg-emerald-500/5 border-emerald-500/10' : perf.differenceMinutes < 0 ? 'bg-rose-500/5 border-rose-500/10' : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5'}`}>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Difference</p>
                  <p className={`text-xl font-black ${perf.differenceMinutes > 0 ? 'text-emerald-600 dark:text-emerald-400' : perf.differenceMinutes < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-gray-900 dark:text-white'}`}>
                    {perf.differenceMinutes > 0 ? '+' : ''}{differenceFormatted}
                  </p>
                  <p className={`text-[10px] mt-1 ${perf.differenceMinutes > 0 ? 'text-emerald-500' : perf.differenceMinutes < 0 ? 'text-rose-500' : 'text-gray-500'}`}>
                    {perf.differenceMinutes > 0 ? 'Extra Hours' : perf.differenceMinutes < 0 ? 'Less Hours' : 'On Track'}
                  </p>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Calculation Formula:</p>
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <p><strong>Expected Hours:</strong> 8.5 hours/day × Days = 8.5h/day × {perf.daysToCount} days = {expectedFormatted}</p>
                  <p><strong>Actual Hours:</strong> Sum of daily hours from clock records = {currentMonthTotalFormatted}</p>
                  <p><strong>Difference:</strong> Actual Hours - Expected Hours = {perf.differenceMinutes > 0 ? '+' : ''}{differenceFormatted}</p>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Monthly Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {performanceReport.map((report, idx) => (
          <motion.div 
            key={report.month} // Use month as unique key
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-[#111] p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm space-y-6 relative overflow-hidden group"
          >
            {/* Background Glow */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/5 blur-3xl rounded-full group-hover:bg-blue-500/10 transition-colors" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
              <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{report.month}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-1 w-20 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${report.attendancePercentage}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-black text-blue-500 uppercase">{report.attendancePercentage}% Efficiency</span>
                </div>
              </div>
              <div className="text-left sm:text-right shrink-0">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Final Payout</p>
                <p className="text-3xl font-black text-emerald-500">₹{report.finalPayout.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 relative z-10">
              <div className="p-3 sm:p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Presents</p>
                <p className="text-base sm:text-xl font-black text-gray-900 dark:text-white">{report.presents} <span className="text-[10px] text-gray-500">Days</span></p>
              </div>
              <div className="p-3 sm:p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Full Leaves</p>
                <p className="text-base sm:text-xl font-black text-rose-500">{report.leaves} <span className="text-[10px] text-gray-500">Days</span></p>
              </div>
              <div className="p-3 sm:p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Half Days</p>
                <p className="text-base sm:text-xl font-black text-amber-500">{report.halfDays} <span className="text-[10px] text-gray-500">Days</span></p>
              </div>
            </div>

            <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <AlertCircle size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Casual Leave Applied:</span>
              </div>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${report.casualLeaveUsed ? 'bg-emerald-500/20 text-emerald-600' : 'bg-gray-200 text-gray-500'}`}>
                {report.casualLeaveUsed ? 'Yes (1 Free)' : 'Not Used'}
              </span>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl relative z-10 text-[10px] text-gray-500 dark:text-gray-400 font-medium space-y-1">
              <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 border-b border-gray-100 dark:border-white/5 pb-1">Salary Calculation Formula:</p>
              <p>Base Salary: ₹{(report.baseSalary || staff.monthlySalary || 0).toLocaleString('en-IN')}</p>
              <p>Standard Hours/Day: 8.5 hrs × 30 days = 255 hrs/month</p>
              <p>Hourly Rate: ₹{report.hourlyRate ?? Math.round((staff.monthlySalary || 0) / 255)} /hr</p>
              <p>Total Hours Worked (incl. overtime): {report.totalHoursWorked ?? '-'} hrs</p>
              <p>Sundays & Admin Leaves → credited as 8.5 hrs each ✅</p>
              <p>1st Absent Day → auto Casual Leave → 8.5 hrs credited ✅</p>
              <p>2 Half-Days = 1 leave unit (topped up to 4.25 hrs each if &lt; 4.25) ✅</p>
              <p className="font-bold text-rose-500 pt-1.5 mt-1 border-t border-gray-100 dark:border-white/5">
                Payout = Hourly Rate × Total Credited Hrs = ₹{report.finalPayout.toLocaleString('en-IN')}
              </p>
              <p className="text-[8px] text-gray-400 dark:text-gray-500 italic leading-tight">(Overtime hours are included — extra hrs beyond 9 increase payout; hours between 8.5 and 9 are not credited)</p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-white/5 relative z-10">
              <div className="flex items-center gap-2 text-rose-500">
                <TrendingUp size={16} className="rotate-180" />
                <span className="text-xs font-bold uppercase tracking-widest">Total Deductions:</span>
              </div>
              <span className="text-lg font-black text-rose-500">- ₹{report.deduction.toLocaleString()}</span>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Edit Staff Details Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsEditModalOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-4xl mx-4 bg-white dark:bg-[#111] rounded-3xl sm:rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <form onSubmit={handleEditSubmit} className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white">Edit Staff Details</h2>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <User size={20} />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 dark:text-gray-400">Full Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 dark:text-gray-400">Phone Number</label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 dark:text-gray-400">Email Address</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 dark:text-gray-400">Password (leave blank to keep current)</label>
                    <input
                      type="password"
                      value={editForm.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Enter new password"
                    />
                  </div>
                </div>
              </div>

              {/* Job Information */}
              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-white/10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Briefcase size={20} />
                  Job Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 dark:text-gray-400">Monthly Salary (₹)</label>
                    <input
                      type="number"
                      value={editForm.monthlySalary}
                      onChange={(e) => handleInputChange('monthlySalary', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 dark:text-gray-400">Department</label>
                    <select
                      value={editForm.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="">Select Department</option>
                      <option value="WEB Development">WEB Development</option>
                      <option value="SEO">SEO</option>
                      <option value="Graphic Design">Graphic Design</option>
                      <option value="SMM">SMM</option>
                      <option value="Video Editing">Video Editing</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 dark:text-gray-400">Job Type</label>
                    <select
                      value={editForm.jobType}
                      onChange={(e) => handleInputChange('jobType', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="">Select Job Type</option>
                      <option value="Permanent">Permanent</option>
                      <option value="Intern">Intern</option>
                      <option value="Part-time">Part-time</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 dark:text-gray-400">Joining Date</label>
                    <input
                      type="date"
                      value={editForm.joiningDate}
                      onChange={(e) => handleInputChange('joiningDate', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-white/10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <IndianRupee size={20} />
                  Bank Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 dark:text-gray-400">Account Holder Name</label>
                    <input
                      type="text"
                      value={editForm.accountHolder}
                      onChange={(e) => handleInputChange('accountHolder', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Enter account holder name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 dark:text-gray-400">Bank Name</label>
                    <input
                      type="text"
                      value={editForm.bankName}
                      onChange={(e) => handleInputChange('bankName', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Enter bank name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 dark:text-gray-400">Account Number</label>
                    <input
                      type="text"
                      value={editForm.accountNumber}
                      onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Enter account number"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 dark:text-gray-400">IFSC Code</label>
                    <input
                      type="text"
                      value={editForm.ifscCode}
                      onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Enter IFSC code"
                    />
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-white/10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Upload size={20} />
                  Documents
                </h3>
                
                {/* Upload New Document */}
                <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 dark:text-gray-400">Document Name</label>
                      <input
                        type="text"
                        value={documentName}
                        onChange={(e) => setDocumentName(e.target.value)}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Enter document name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 dark:text-gray-400">Select File</label>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleUploadDocument}
                    disabled={uploading || !selectedFile}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    {uploading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload size={20} />
                    )}
                    {uploading ? 'Uploading...' : 'Upload Document'}
                  </button>
                </div>

                {/* Uploaded Documents List */}
                {staff && staff.documents && staff.documents.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Uploaded Documents</h4>
                    {staff.documents.map((doc) => (
                      <div
                        key={doc._id}
                        className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <Upload size={20} className="text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{doc.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={`http://localhost:45000${doc.path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          >
                            View
                          </a>
                          <button
                            type="button"
                            onClick={() => handleDeleteDocument(doc._id)}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-gray-200 dark:border-white/10 flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-8 py-3 border border-gray-200 dark:border-white/10 rounded-xl text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      </AnimatePresence>
      
      {/* Bottom Padding */}
      <div className="h-8" />
    </motion.div>
  );
};

const StaffPerformanceWithAuth = (props) => {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('salary_unlocked') === 'true');
  if (!unlocked) return <PerformancePasswordGate onUnlock={() => setUnlocked(true)} />;
  return <StaffPerformance {...props} />;
};

export default StaffPerformanceWithAuth;
