import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2,
  Search,
  Calendar,
  Briefcase,
  IndianRupee,
  Mail,
  Phone,
  RotateCw,
  UserPlus,
  X,
  Save,
  Clock,
  RotateCcw,
  Landmark,
  Calculator
} from 'lucide-react';
import { BASE_URL } from '../api';

const REMOVED_STAFF_API = `${BASE_URL}/staff/removed`;
const CALCULATION_START_DATE = new Date('2026-07-01T00:00:00.000Z');
const STANDARD_HOURS_PER_DAY = 8.5;
const EXPECTED_MONTHLY_HOURS = STANDARD_HOURS_PER_DAY * 30; // 255 hours

const parseTotalHours = (str) => {
  if (!str || str === '-') return 0;
  const h = str.match(/(\d+)\s*h/i);
  const m = str.match(/(\d+)\s*m/i);
  return (h ? parseInt(h[1], 10) : 0) + (m ? parseInt(m[1], 10) / 60 : 0);
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

const calculatePayoutForSelectedMonth = (staffInfo, monthStr) => {
  if (!staffInfo || !monthStr) return { payout: 0, daysWorked: 0, totalHoursWorked: 0, isPaid: false };
  const cleanMonth = monthStr.replace(/\s*\(Current\)/i, '').trim();
  const match = cleanMonth.match(/([A-Za-z]+)\s+(\d+)/);
  if (!match) return { payout: staffInfo.monthlySalary || 0, daysWorked: 0, totalHoursWorked: 0, isPaid: false };

  const monthName = match[1];
  const year = parseInt(match[2]);
  const monthIndex = new Date(Date.parse(monthName + " 1, 2012")).getMonth();

  const baseSalary = staffInfo.monthlySalary || 0;
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

  const presents = monthlyClockRecords.length;

  const paidHistory = (staffInfo.salaryHistory || []).find(h => {
    const hClean = h.month ? h.month.replace(/\s*\(Current\)/i, '').trim() : '';
    return hClean === cleanMonth;
  });

  if (presents === 0 && !paidHistory) {
    return {
      payout: 0,
      totalHoursWorked: 0,
      daysWorked: 0,
      isPaid: false
    };
  }

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
  const payout = paidHistory ? paidHistory.payoutSalary : calculatedPayout;

  return {
    payout,
    totalHoursWorked: Math.round(totalHoursWorked * 100) / 100,
    daysWorked: presents,
    isPaid: !!paidHistory
  };
};

const RemovedEmployees = () => {
  const [removedStaff, setRemovedStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Rejoin modal state
  const [isRejoinModalOpen, setIsRejoinModalOpen] = useState(false);
  const [rejoiningEmployee, setRejoiningEmployee] = useState(null);
  const [rejoinForm, setRejoinForm] = useState({
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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Salary modal state
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
  const [selectedStaffForSalary, setSelectedStaffForSalary] = useState(null);
  const [selectedSalaryMonth, setSelectedSalaryMonth] = useState('');
  const [salaryPaymentDetails, setSalaryPaymentDetails] = useState({
    mode: 'online',
    method: 'phonepe',
    utrNumber: '',
    customAmount: ''
  });
  const [isClearingSalary, setIsClearingSalary] = useState(false);

  const fetchRemovedStaff = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(REMOVED_STAFF_API, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const result = await response.json();

      if (result.success) {
        setRemovedStaff(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching removed staff:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRemovedStaff();
  }, [fetchRemovedStaff]);

  const handleOpenRejoinModal = (member) => {
    setRejoiningEmployee(member);
    setRejoinForm({
      name: member.name || '',
      phone: member.phone || '',
      email: member.email || '',
      monthlySalary: member.monthlySalary || '',
      department: member.department === 'WEB DEvlopment' ? 'WEB Development' : member.department || '',
      jobType: member.jobType || '',
      joiningDate: member.joiningDate ? new Date(member.joiningDate).toISOString().split('T')[0] : '',
      accountHolder: member.accountHolder || '',
      accountNumber: member.accountNumber || '',
      ifscCode: member.ifscCode || '',
      bankName: member.bankName || '',
    });
    setIsRejoinModalOpen(true);
  };

  const handleInputChange = (field, value) => {
    setRejoinForm(prev => ({
      ...prev,
      [field]: field === 'monthlySalary' ? (value ? Number(value) : '') : value
    }));
  };

  const handleRejoinSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${BASE_URL}/staff/${rejoiningEmployee._id}/rejoin`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rejoinForm)
      });
      const result = await response.json();
      if (result.success) {
        setIsRejoinModalOpen(false);
        setRejoiningEmployee(null);
        alert('Employee rejoined successfully!');
        fetchRemovedStaff();
      } else {
        alert('Failed to rejoin employee: ' + result.message);
      }
    } catch (error) {
      console.error('Error rejoining employee:', error);
      alert('Error rejoining employee!');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Salary Payment Modal
  const openSalaryModal = (member) => {
    setSelectedStaffForSalary(member);
    const targetMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    const calc = calculatePayoutForSelectedMonth(member, targetMonth);
    const initialAmount = (calc.payout > 0) ? calc.payout : (member.monthlySalary || 0);

    setSelectedSalaryMonth(targetMonth);
    setSalaryPaymentDetails({
      mode: 'online',
      method: 'phonepe',
      utrNumber: '',
      customAmount: initialAmount
    });
    setIsSalaryModalOpen(true);
  };

  // Submit Clear Salary
  const handleConfirmClearSalary = async () => {
    if (!selectedStaffForSalary || !selectedSalaryMonth) return;
    setIsClearingSalary(true);

    const amount = Number(salaryPaymentDetails.customAmount);

    try {
      const response = await fetch(`${BASE_URL}/staff/${selectedStaffForSalary._id}/clear-salary`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month: selectedSalaryMonth,
          baseSalary: selectedStaffForSalary.monthlySalary,
          payoutSalary: amount,
          totalLeaves: 0,
          totalHalfDays: 0,
          casualLeaveUsed: 0,
          mode: salaryPaymentDetails.mode,
          method: salaryPaymentDetails.mode === 'cash' ? 'cash' : salaryPaymentDetails.method,
          utrNumber: salaryPaymentDetails.utrNumber
        })
      });
      const result = await response.json();
      if (result.success) {
        if (result.data) {
          setRemovedStaff(prev => prev.map(m => m._id === selectedStaffForSalary._id ? result.data : m));
        }
        setIsSalaryModalOpen(false);
        setSelectedStaffForSalary(null);
        alert(`Salary of ₹${amount.toLocaleString('en-IN')} for ${selectedSalaryMonth} cleared successfully!`);
        fetchRemovedStaff();
      } else {
        alert(result.message || 'Failed to clear salary');
      }
    } catch (error) {
      console.error('Error clearing salary:', error);
      alert('Failed to clear salary');
    } finally {
      setIsClearingSalary(false);
    }
  };

  // Revert Salary
  const handleRevertSalary = async (member) => {
    const targetMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    if (!window.confirm(`Are you sure you want to revert salary payment status to Pending for ${member.name}?`)) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/staff/${member._id}/revert-salary`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month: targetMonth })
      });
      const result = await response.json();
      if (result.success) {
        if (result.data) {
          setRemovedStaff(prev => prev.map(m => m._id === member._id ? result.data : m));
        }
        alert(`Salary status reverted to Pending for ${member.name}`);
        fetchRemovedStaff();
      } else {
        alert(result.message || 'Failed to revert salary');
      }
    } catch (error) {
      console.error('Error reverting salary:', error);
      alert('Failed to revert salary');
    }
  };

  const filteredRemovedStaff = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return removedStaff.filter((member) => {
      if (!term) return true;

      return (
        member.name?.toLowerCase().includes(term) ||
        member.email?.toLowerCase().includes(term) ||
        member.department?.toLowerCase().includes(term) ||
        member.employeeId?.toLowerCase().includes(term)
      );
    }).sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }, [removedStaff, searchTerm]);

  const removedThisMonth = useMemo(() => {
    const now = new Date();

    return removedStaff.filter((member) => {
      if (!member.removedAt) return false;
      const removedDate = new Date(member.removedAt);
      return removedDate.getMonth() === now.getMonth() && removedDate.getFullYear() === now.getFullYear();
    }).length;
  }, [removedStaff]);

  const pendingSalaryCount = useMemo(() => {
    return filteredRemovedStaff.filter(m => m.salaryStatus !== 'Paid').length;
  }, [filteredRemovedStaff]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-900 dark:text-white text-xl animate-pulse">Loading removed employees...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Removed Employees</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Employees deleted from Employee Details with calculated salary based on present days.</p>
        </div>

        <button
          onClick={fetchRemovedStaff}
          className="flex items-center gap-2 bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-5 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-black/10 dark:hover:bg-white/10 transition-all w-fit cursor-pointer"
        >
          <RotateCw size={18} />
          Refresh List
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Removed', value: filteredRemovedStaff.length, icon: Trash2, color: 'rose' },
          { label: 'Removed This Month', value: removedThisMonth, icon: Calendar, color: 'amber' },
          { label: 'Pending Salaries', value: `${pendingSalaryCount} Members`, icon: Clock, color: 'orange' },
          {
            label: 'Monthly Salary Snapshot',
            value: `Rs ${filteredRemovedStaff.reduce((sum, member) => sum + (member.monthlySalary || 0), 0).toLocaleString('en-IN')}`,
            icon: IndianRupee,
            color: 'blue'
          }
        ].map((stat, index) => (
          <div key={index} className="glass p-6 rounded-3xl border border-gray-200 dark:border-white/10 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-500`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Search removed employee by name, email, department or employee ID..."
          className="w-full bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="glass rounded-3xl border border-gray-200 dark:border-white/10 overflow-hidden transition-colors">
        <div className="overflow-x-auto overflow-y-auto max-h-[650px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/10 bg-black/5 dark:bg-white/5">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Employee</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Department</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Calculated Salary & Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Joining Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-rose-500 dark:text-rose-400 uppercase tracking-widest">Removed On</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {filteredRemovedStaff.length > 0 ? filteredRemovedStaff.map((member) => {
                const targetMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
                const calc = calculatePayoutForSelectedMonth(member, targetMonth);

                return (
                  <tr key={member._id} className="hover:bg-black/[0.02] dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {member.profilePic ? (
                          <>
                            <img
                              src={member.profilePic.startsWith('http') ? member.profilePic : `${(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:45000' : 'https://rizeworldmain.onrender.com'}${member.profilePic.startsWith('/') ? '' : '/'}${member.profilePic}`}
                              alt={member.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-rose-500/20 shadow-sm"
                              onError={(e) => {
                                const img = e.currentTarget;
                                img.style.display = 'none';
                                if (img.nextElementSibling) {
                                  img.nextElementSibling.setAttribute('style', 'display: flex');
                                }
                              }}
                            />
                            <div
                              style={{ display: 'none' }}
                              className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 items-center justify-center text-white font-bold shadow-sm"
                            >
                              {member.name?.charAt(0)?.toUpperCase() || 'R'}
                            </div>
                          </>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white font-bold shadow-sm">
                            {member.name?.charAt(0)?.toUpperCase() || 'R'}
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-bold text-gray-900 dark:text-white">{member.name}</div>
                          <div className="text-xs text-gray-500 flex flex-col gap-0.5 mt-1">
                            <span className="flex items-center gap-1"><Mail size={12} /> {member.email || 'N/A'}</span>
                            <span className="flex items-center gap-1"><Phone size={12} /> {member.phone || 'N/A'}</span>
                            <span className="font-semibold text-gray-700 dark:text-gray-300">{member.employeeId || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <span className="inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                          {member.department || 'N/A'}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                          <Briefcase size={12} /> {member.role || 'Employee'} | {member.jobType || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-1">
                          Rs {(calc.payout || 0).toLocaleString('en-IN')}
                          <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full ml-1">
                            {calc.daysWorked} {calc.daysWorked === 1 ? 'Day' : 'Days'} Present
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-400 font-medium">
                          Base: Rs {(member.monthlySalary || 0).toLocaleString('en-IN')}/mo
                        </div>
                        <div className="mt-0.5 flex items-center gap-1.5">
                          {member.salaryStatus === 'Paid' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              <CheckCircle2 size={11} /> Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              <Clock size={11} /> Pending
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-300">
                        <Calendar size={12} />
                        {member.joiningDate ? new Date(member.joiningDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-rose-600 dark:text-rose-400">
                        {member.removedAt ? new Date(member.removedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        {member.salaryStatus === 'Paid' ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => openSalaryModal(member)}
                              className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
                              title="Salary Paid (Click to view/manage)"
                            >
                              <CheckCircle2 size={13} />
                              Paid
                            </button>
                            <button
                              onClick={() => handleRevertSalary(member)}
                              className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 px-2.5 py-1.5 rounded-xl text-xs font-bold hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                              title="Revert Salary Payment"
                            >
                              <RotateCcw size={13} />
                              Revert
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => openSalaryModal(member)}
                            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                            title="Clear Pending Salary"
                          >
                            <CheckCircle2 size={14} />
                            Clear Salary
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenRejoinModal(member)}
                          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                          title="Rejoin Employee"
                        >
                          <UserPlus size={14} />
                          Rejoin
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center text-gray-500 dark:text-gray-400">
                    No removed employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clear Salary Modal */}
      <AnimatePresence>
        {isSalaryModalOpen && selectedStaffForSalary && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSalaryModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-y-auto max-h-[90vh] z-10 p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-white/5">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="text-emerald-500" size={22} />
                    Clear Salary for {selectedStaffForSalary.name}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Employee ID: <span className="font-semibold text-gray-700 dark:text-gray-300">{selectedStaffForSalary.employeeId || 'N/A'}</span> • Department: <span className="font-semibold text-gray-700 dark:text-gray-300">{selectedStaffForSalary.department}</span>
                  </p>
                </div>
                <button
                  onClick={() => setIsSalaryModalOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Calculated Salary Breakdown Card */}
              {(() => {
                const calc = calculatePayoutForSelectedMonth(selectedStaffForSalary, selectedSalaryMonth);
                return (
                  <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5 font-medium">
                        <Calculator size={14} className="text-emerald-500" />
                        Days Present in {selectedSalaryMonth}:
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                        {calc.daysWorked} {calc.daysWorked === 1 ? 'Day' : 'Days'} Present
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Calculated Salary Earned:</span>
                      <span className="font-extrabold text-base text-emerald-600 dark:text-emerald-400">
                        ₹{calc.payout.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1.5 border-t border-gray-100 dark:border-white/5">
                      <span>Full Monthly Base Salary:</span>
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        ₹{(selectedStaffForSalary.monthlySalary || 0).toLocaleString('en-IN')}/mo
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Bank Account Info Card for Easy Transfer Reference */}
              <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  <Landmark size={14} /> Bank Account Details
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-400 block">Account Holder</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">{selectedStaffForSalary.accountHolder || selectedStaffForSalary.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Bank Name</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">{selectedStaffForSalary.bankName || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Account Number</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">{selectedStaffForSalary.accountNumber || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">IFSC Code</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">{selectedStaffForSalary.ifscCode || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Target Month</label>
                  <input
                    type="text"
                    value={selectedSalaryMonth}
                    onChange={(e) => {
                      const newMonth = e.target.value;
                      setSelectedSalaryMonth(newMonth);
                      const newCalc = calculatePayoutForSelectedMonth(selectedStaffForSalary, newMonth);
                      setSalaryPaymentDetails(prev => ({ ...prev, customAmount: newCalc.payout }));
                    }}
                    placeholder="e.g. August 2026"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-semibold text-gray-900 dark:text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Salary Amount to Clear (₹)</label>
                  <input
                    type="number"
                    value={salaryPaymentDetails.customAmount}
                    onChange={(e) => setSalaryPaymentDetails(prev => ({ ...prev, customAmount: e.target.value }))}
                    placeholder="Enter amount"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Payment Mode</label>
                    <select
                      value={salaryPaymentDetails.mode}
                      onChange={(e) => setSalaryPaymentDetails(prev => ({ ...prev, mode: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white outline-none cursor-pointer"
                    >
                      <option value="online">Online</option>
                      <option value="cash">Cash</option>
                    </select>
                  </div>

                  {salaryPaymentDetails.mode === 'online' && (
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Method</label>
                      <select
                        value={salaryPaymentDetails.method}
                        onChange={(e) => setSalaryPaymentDetails(prev => ({ ...prev, method: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white outline-none cursor-pointer"
                      >
                        <option value="phonepe">PhonePe</option>
                        <option value="paytm">Paytm</option>
                        <option value="google_pay">Google Pay</option>
                        <option value="bank_transfer">Bank Transfer</option>
                      </select>
                    </div>
                  )}
                </div>

                {salaryPaymentDetails.mode === 'online' && (
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">UTR / Reference Number</label>
                    <input
                      type="text"
                      value={salaryPaymentDetails.utrNumber}
                      onChange={(e) => setSalaryPaymentDetails(prev => ({ ...prev, utrNumber: e.target.value }))}
                      placeholder="e.g. UTR123456789"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-emerald-500"
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSalaryModalOpen(false)}
                  disabled={isClearingSalary}
                  className="px-5 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-white/10 transition-colors text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmClearSalary}
                  disabled={isClearingSalary}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 text-sm cursor-pointer"
                >
                  {isClearingSalary ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Clearing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      Confirm & Clear Salary
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Rejoin & Edit Details Modal */}
      {isRejoinModalOpen && rejoiningEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsRejoinModalOpen(false)}
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-4xl bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-y-auto max-h-[90vh] z-10"
          >
            <form onSubmit={handleRejoinSubmit} className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-white/5">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <UserPlus className="text-emerald-500" />
                  Rejoin Employee & Edit Details
                </h2>
                <button
                  type="button"
                  onClick={() => setIsRejoinModalOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                    <input
                      type="text"
                      required
                      value={rejoinForm.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={rejoinForm.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                    <input
                      type="email"
                      required
                      value={rejoinForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Job Info */}
              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Job Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Monthly Salary (₹)</label>
                    <input
                      type="number"
                      required
                      value={rejoinForm.monthlySalary}
                      onChange={(e) => handleInputChange('monthlySalary', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Department</label>
                    <select
                      value={rejoinForm.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none cursor-pointer"
                    >
                      <option value="WEB Development">WEB Development</option>
                      <option value="SEO">SEO</option>
                      <option value="Graphic Design">Graphic Design</option>
                      <option value="SMM">SMM</option>
                      <option value="Video Editing">Video Editing</option>
                      <option value="Accounts">Accounts</option>
                      <option value="HR">HR</option>
                      <option value="Sales Team">Sales Team</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Job Type</label>
                    <select
                      value={rejoinForm.jobType}
                      onChange={(e) => handleInputChange('jobType', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none cursor-pointer"
                    >
                      <option value="Permanent">Permanent</option>
                      <option value="Intern">Intern</option>
                      <option value="Part-time">Part-time</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Joining Date</label>
                    <input
                      type="date"
                      value={rejoinForm.joiningDate}
                      onChange={(e) => handleInputChange('joiningDate', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Bank Account Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Account Holder</label>
                    <input
                      type="text"
                      value={rejoinForm.accountHolder}
                      onChange={(e) => handleInputChange('accountHolder', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none"
                      placeholder="Name on account"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Bank Name</label>
                    <input
                      type="text"
                      value={rejoinForm.bankName}
                      onChange={(e) => handleInputChange('bankName', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none"
                      placeholder="e.g. HDFC Bank"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Account Number</label>
                    <input
                      type="text"
                      value={rejoinForm.accountNumber}
                      onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none"
                      placeholder="Enter account number"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">IFSC Code</label>
                    <input
                      type="text"
                      value={rejoinForm.ifscCode}
                      onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none"
                      placeholder="e.g. HDFC0001234"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRejoinModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-6 py-3 border border-gray-200 dark:border-white/10 rounded-xl text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Rejoining...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Rejoin Employee
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default RemovedEmployees;
