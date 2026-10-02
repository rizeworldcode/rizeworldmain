// Utility for calculating monthly salary, payouts, and attendance-based deductions
export const STANDARD_HOURS_PER_DAY = 8.5;
export const DAYS_IN_MONTH = 30;
export const EXPECTED_MONTHLY_HOURS = STANDARD_HOURS_PER_DAY * DAYS_IN_MONTH; // 255 hrs
export const CALCULATION_START_DATE = new Date(2026, 6, 1); // July 1, 2026

export const parseTotalHours = (str) => {
  if (!str || str === '-') return 0;
  const hM = str.match(/(\d+)\s*h/i);
  const mM = str.match(/(\d+)\s*m/i);
  return (hM ? parseInt(hM[1], 10) : 0) + (mM ? parseInt(mM[1], 10) / 60 : 0);
};

export const get30DaySequenceDates = (year, monthIndex, createdAt = null) => {
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

export const getSalaryForDate = (staffInfo, date) => {
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

export const calculatePayoutForMonth = (emp, monthStr) => {
  if (!emp) return { payout: 0, baseSalary: 0, isPaid: false, paidAmount: 0, daysWorked: 0 };

  const now = new Date();
  const defaultMonthStr = now.toLocaleString('default', { month: 'long', year: 'numeric' });
  const targetMonth = monthStr || defaultMonthStr;
  const cleanMonth = targetMonth.replace(/\s*\(Current\)/i, '').trim();

  const baseSalary = emp.monthlySalary || 0;

  const match = cleanMonth.match(/([A-Za-z]+)\s+(\d+)/);
  if (!match) return { payout: baseSalary, baseSalary, isPaid: false, paidAmount: 0, daysWorked: 0 };

  const monthName = match[1];
  const year = parseInt(match[2], 10);
  const monthIndex = new Date(Date.parse(monthName + " 1, 2012")).getMonth();

  const isCurrentMonth = now.getMonth() === monthIndex && now.getFullYear() === year;

  // Check paid salary history for this specific month
  const paidHistory = (emp.salaryHistory || []).find(h => {
    const hClean = (h.month || '').replace(/\s*\(Current\)/i, '').trim();
    return hClean === cleanMonth;
  });

  const createdAt = emp.createdAt || emp.joiningDate;
  const sequenceDates = get30DaySequenceDates(year, monthIndex, createdAt);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const validSequenceDates = isCurrentMonth
    ? sequenceDates.filter(d => d <= todayEnd)
    : sequenceDates;
  const seqDateStrings = new Set(validSequenceDates.map(d => d.toDateString()));

  const monthlyClockRecords = (emp.clock || []).filter(r => {
    return seqDateStrings.has(new Date(r.date).toDateString());
  });

  const dailyHoursMap = {};
  const creditedDates = new Set();

  monthlyClockRecords.forEach(r => {
    const dStr = new Date(r.date).toDateString();
    const h = parseTotalHours(r.totalHours);
    let hrs = 0;
    if (h > 9) hrs = 8.5 + (h - 9);
    else if (h >= 8.5) hrs = 8.5;
    else hrs = h;
    dailyHoursMap[dStr] = hrs;
    creditedDates.add(dStr);
  });

  // Sundays
  validSequenceDates.forEach(d => {
    const dStr = d.toDateString();
    if (d.getDay() === 0 && !creditedDates.has(dStr)) {
      dailyHoursMap[dStr] = STANDARD_HOURS_PER_DAY;
      creditedDates.add(dStr);
    }
  });

  // Admin-declared leaves
  (emp.leaves || []).forEach(leave => {
    const d = new Date(leave.date);
    const dStr = d.toDateString();
    if (seqDateStrings.has(dStr) && !creditedDates.has(dStr)) {
      dailyHoursMap[dStr] = STANDARD_HOURS_PER_DAY;
      creditedDates.add(dStr);
    }
  });

  // Attendance 'On Leave'
  (emp.attendance || []).forEach(att => {
    if (att.status === 'On Leave') {
      const d = new Date(att.date);
      const dStr = d.toDateString();
      if (seqDateStrings.has(dStr) && !creditedDates.has(dStr)) {
        dailyHoursMap[dStr] = STANDARD_HOURS_PER_DAY;
        creditedDates.add(dStr);
      }
    }
  });

  // Absent days
  const absentDays = validSequenceDates.filter(d => {
    if (d.getDay() === 0) return false;
    return !creditedDates.has(d.toDateString());
  });

  // Half-days
  const halfDayRecords = (emp.attendance || []).filter(att => {
    if (att.status !== 'Half-Day') return false;
    const d = new Date(att.date);
    return seqDateStrings.has(d.toDateString());
  });
  const halfDayLeaveUnits = Math.floor(halfDayRecords.length / 2);

  // 1 free casual leave
  if (absentDays.length > 0) {
    const casualLeaveDate = absentDays[0];
    const dStr = casualLeaveDate.toDateString();
    dailyHoursMap[dStr] = STANDARD_HOURS_PER_DAY;
    creditedDates.add(dStr);
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
  }

  let totalPayout = 0;
  validSequenceDates.forEach(d => {
    const dStr = d.toDateString();
    const hrs = dailyHoursMap[dStr] || 0;
    const { salary: daySalary } = getSalaryForDate(emp, d);
    const dayHourlyRate = daySalary / EXPECTED_MONTHLY_HOURS;
    totalPayout += hrs * dayHourlyRate;
  });

  const calculated = Math.round(totalPayout);
  // For the current month if under 5 days worked, default to base salary for projected monthly payable
  const payout = paidHistory ? paidHistory.payoutSalary : (isCurrentMonth && validSequenceDates.length < 5 && calculated < baseSalary * 0.2 ? baseSalary : calculated);

  return {
    payout,
    baseSalary,
    isPaid: !!paidHistory,
    paidAmount: paidHistory ? (paidHistory.payoutSalary || payout) : 0,
    daysWorked: monthlyClockRecords.length
  };
};

export const getAvailableSalaryMonths = (staffList = []) => {
  const now = new Date();
  const currentMonthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });
  const months = new Set();
  months.add(currentMonthName);

  const addDateMonth = (dateInput) => {
    if (!dateInput) return;
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return;
    const check = new Date(d);
    check.setHours(0, 0, 0, 0);
    if (check < CALCULATION_START_DATE) return;
    if (d.getDate() === 31) {
      const nextMonth = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      months.add(nextMonth.toLocaleString('default', { month: 'long', year: 'numeric' }));
    } else {
      months.add(d.toLocaleString('default', { month: 'long', year: 'numeric' }));
    }
  };

  (staffList || []).forEach(emp => {
    (emp.clock || []).forEach(r => addDateMonth(r.date));
    (emp.salaryHistory || []).forEach(h => {
      if (h.month) months.add(h.month.replace(/\s*\(Current\)/i, '').trim());
    });
    (emp.attendance || []).forEach(a => addDateMonth(a.date));
    (emp.leaves || []).forEach(l => addDateMonth(l.date));
  });

  // Ensure recent 6 months are always available in the selector
  for (let i = 0; i < 6; i++) {
    const past = new Date(now.getFullYear(), now.getMonth() - i, 1);
    if (past >= CALCULATION_START_DATE) {
      months.add(past.toLocaleString('default', { month: 'long', year: 'numeric' }));
    }
  }

  return Array.from(months).filter(mStr => {
    const match = mStr.match(/([A-Za-z]+)\s+(\d+)/);
    if (!match) return false;
    const mName = match[1];
    const yr = parseInt(match[2], 10);
    const mIdx = new Date(Date.parse(mName + " 1, 2012")).getMonth();
    return yr > 2026 || (yr === 2026 && mIdx >= 6);
  }).sort((a, b) => {
    const dateA = new Date(Date.parse(a + " 1"));
    const dateB = new Date(Date.parse(b + " 1"));
    return dateB.getTime() - dateA.getTime();
  });
};

export const getMonthlySalarySummary = (staffList = [], monthStr) => {
  const now = new Date();
  const defaultMonthStr = now.toLocaleString('default', { month: 'long', year: 'numeric' });
  const targetMonth = monthStr || defaultMonthStr;
  const cleanMonth = targetMonth.replace(/\s*\(Current\)/i, '').trim();

  let totalPayable = 0;
  let totalBase = 0;
  let totalPaid = 0;
  let paidCount = 0;
  let pendingCount = 0;

  const activeStaff = (staffList || []).filter(s => !s.isRemoved);

  activeStaff.forEach(emp => {
    const res = calculatePayoutForMonth(emp, cleanMonth);
    totalPayable += res.payout;
    totalBase += res.baseSalary;
    if (res.isPaid) {
      totalPaid += res.paidAmount;
      paidCount++;
    } else {
      pendingCount++;
    }
  });

  const totalPending = Math.max(0, totalPayable - totalPaid);

  return {
    month: cleanMonth,
    totalPayable,
    totalBase,
    totalPaid,
    totalPending,
    staffCount: activeStaff.length,
    paidCount,
    pendingCount,
    isFullyPaid: activeStaff.length > 0 && paidCount === activeStaff.length
  };
};
