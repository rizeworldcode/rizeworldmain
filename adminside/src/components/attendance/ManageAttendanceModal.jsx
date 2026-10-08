import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  X,
  CheckCircle2,
  XCircle,
  Clock,
  IndianRupee,
  User,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { updateStaffAttendance } from '../../api';
import { 
  get30DaySequenceDates, 
  getSalaryForDate, 
  isDailyRatedStaff,
  calculatePayoutForMonth,
  getAvailableSalaryMonths
} from '../../utils/salaryCalculator';

export const ManageAttendanceModal = ({
  isOpen,
  onClose,
  staffMember,
  monthStr,
  onAttendanceUpdated
}) => {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    return monthStr || new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  });
  const [updatingDate, setUpdatingDate] = useState(null);
  const [currentStaff, setCurrentStaff] = useState(staffMember);

  // Sync currentStaff when prop changes
  useMemo(() => {
    if (staffMember) {
      setCurrentStaff(staffMember);
    }
  }, [staffMember]);

  if (!isOpen || !currentStaff) return null;

  const isDaily = isDailyRatedStaff(currentStaff);
  const baseSalary = currentStaff.monthlySalary || 0;
  const dailyRate = Math.round(baseSalary / 30);

  const cleanMonth = (selectedMonth || '').replace(/\s*\(Current\)/i, '').trim();
  const match = cleanMonth.match(/([A-Za-z]+)\s+(\d+)/);
  const monthName = match ? match[1] : '';
  const year = match ? parseInt(match[2], 10) : new Date().getFullYear();
  const monthIndex = match ? new Date(Date.parse(monthName + " 1, 2012")).getMonth() : new Date().getMonth();

  const createdAt = currentStaff.createdAt || currentStaff.joiningDate;
  const sequenceDates = get30DaySequenceDates(year, monthIndex, createdAt);
  
  const today = new Date();
  const isCurrentMonth = today.getMonth() === monthIndex && today.getFullYear() === year;
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const validSequenceDates = isCurrentMonth
    ? sequenceDates.filter(d => d <= todayEnd)
    : sequenceDates;

  // Compute day credits & attendance
  const dayRecords = validSequenceDates.map(d => {
    const dStr = d.toDateString();
    const att = (currentStaff.attendance || []).find(a => new Date(a.date).toDateString() === dStr);
    const clockRec = (currentStaff.clock || []).find(c => new Date(c.date).toDateString() === dStr);
    const leaveRec = (currentStaff.leaves || []).find(l => new Date(l.date).toDateString() === dStr);
    
    let status = 'Present'; // Default for daily-rated
    if (att) {
      status = att.status;
    } else if (leaveRec) {
      status = 'On Leave';
    } else if (d.getDay() === 0) {
      status = 'Present'; // Sunday credit
    } else if (!isDaily && !clockRec) {
      status = 'Absent';
    }

    return {
      date: d,
      dateStr: dStr,
      formattedDate: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      dayName: d.toLocaleDateString('en-IN', { weekday: 'short' }),
      isSunday: d.getDay() === 0,
      status,
      clockHours: clockRec ? clockRec.totalHours : '-'
    };
  });

  const presentCount = dayRecords.filter(r => r.status === 'Present').length;
  const absentCount = dayRecords.filter(r => r.status === 'Absent').length;
  const halfDayCount = dayRecords.filter(r => r.status === 'Half-Day').length;
  const leaveCount = dayRecords.filter(r => r.status === 'On Leave').length;

  const netPresentDays = presentCount + (halfDayCount * 0.5) + leaveCount;
  const calculatedEarnedSalary = Math.round(netPresentDays * (baseSalary / 30));

  const handleSetStatus = async (date, newStatus) => {
    setUpdatingDate(date.toDateString());
    try {
      const res = await updateStaffAttendance(currentStaff._id || currentStaff.id, {
        date: date.toISOString(),
        status: newStatus
      });

      if (res && res.success && res.data) {
        setCurrentStaff(res.data);
        if (onAttendanceUpdated) {
          onAttendanceUpdated(res.data);
        }
      }
    } catch (err) {
      console.error('Failed to update attendance:', err);
      alert('Failed to update attendance. Please try again.');
    } finally {
      setUpdatingDate(null);
    }
  };

  const availableMonths = getAvailableSalaryMonths([currentStaff]);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 10 }}
        className="relative w-full max-w-3xl bg-white dark:bg-[#0c0c0e] rounded-3xl border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[92vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Calendar size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-gray-900 dark:text-white">
                  Manage Attendance & Absences
                </h3>
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                  isDaily ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                }`}>
                  {isDaily ? '30-Day Day-Wise (Auto-Present)' : 'Standard Clock-In'}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {currentStaff.name} ({currentStaff.employeeId}) • Role: {currentStaff.role || 'Staff'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Month Selector & Salary Summary Cards */}
        <div className="space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50 dark:bg-white/[0.03] p-4 rounded-2xl border border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Salary Month:</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-white dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-900 dark:text-white outline-none cursor-pointer focus:border-indigo-500"
              >
                {availableMonths.map(m => (
                  <option key={m} value={m} className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white">
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs font-bold text-gray-600 dark:text-gray-300">
              Daily Rate: <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">₹{dailyRate}/day</span> (Monthly ₹{baseSalary.toLocaleString('en-IN')})
            </div>
          </div>

          {/* Real-time stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Present Days</p>
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                {netPresentDays} <span className="text-xs font-bold text-gray-400">/ {validSequenceDates.length}</span>
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20">
              <p className="text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">Absent Days</p>
              <p className="text-xl font-black text-rose-600 dark:text-rose-400 mt-0.5">
                {absentCount}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Half-Days</p>
              <p className="text-xl font-black text-amber-600 dark:text-amber-400 mt-0.5">
                {halfDayCount}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
              <p className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">Calculated Earned</p>
              <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                ₹{calculatedEarnedSalary.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 px-1 mb-2">
          <span>Click any day to change status (Present / Absent / Half-Day):</span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            {isDaily ? '✨ All days default to Present for Day-Wise Staff' : 'Office Staff Attendance'}
          </span>
        </div>

        {/* 30-Day Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {dayRecords.map((r, idx) => {
            const isUpdating = updatingDate === r.dateStr;
            const isAbsent = r.status === 'Absent';
            const isHalfDay = r.status === 'Half-Day';
            const isLeave = r.status === 'On Leave';
            const isPresent = r.status === 'Present';

            let cardBg = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300';
            if (isAbsent) cardBg = 'bg-rose-500/15 border-rose-500/40 text-rose-700 dark:text-rose-300 shadow-sm';
            if (isHalfDay) cardBg = 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300 shadow-sm';
            if (isLeave) cardBg = 'bg-blue-500/15 border-blue-500/40 text-blue-700 dark:text-blue-300 shadow-sm';

            return (
              <div
                key={r.dateStr}
                className={`p-3 rounded-2xl border transition-all ${cardBg} relative group flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black">
                      Day {idx + 1}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${r.isSunday ? 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300' : 'bg-black/5 dark:bg-white/10 text-gray-500'}`}>
                      {r.dayName}
                    </span>
                  </div>
                  <p className="text-[11px] font-bold opacity-80 mb-2">
                    {r.formattedDate}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider">
                      {r.status}
                    </span>
                    {isUpdating && <RefreshCw size={12} className="animate-spin text-gray-500" />}
                  </div>

                  {/* Status Toggle buttons */}
                  <div className="grid grid-cols-3 gap-1 pt-1 border-t border-black/5 dark:border-white/10">
                    <button
                      type="button"
                      disabled={isUpdating || isPresent}
                      onClick={() => handleSetStatus(r.date, 'Present')}
                      title="Mark Present"
                      className={`p-1 rounded text-[10px] font-black transition-all flex items-center justify-center ${
                        isPresent ? 'bg-emerald-600 text-white' : 'bg-black/5 dark:bg-white/10 hover:bg-emerald-500/20 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      P
                    </button>
                    <button
                      type="button"
                      disabled={isUpdating || isHalfDay}
                      onClick={() => handleSetStatus(r.date, 'Half-Day')}
                      title="Mark Half-Day"
                      className={`p-1 rounded text-[10px] font-black transition-all flex items-center justify-center ${
                        isHalfDay ? 'bg-amber-500 text-white' : 'bg-black/5 dark:bg-white/10 hover:bg-amber-500/20 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      HD
                    </button>
                    <button
                      type="button"
                      disabled={isUpdating || isAbsent}
                      onClick={() => handleSetStatus(r.date, 'Absent')}
                      title="Mark Absent"
                      className={`p-1 rounded text-[10px] font-black transition-all flex items-center justify-center ${
                        isAbsent ? 'bg-rose-600 text-white' : 'bg-black/5 dark:bg-white/10 hover:bg-rose-500/20 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      A
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/10 pt-4 mt-6">
          <p className="text-xs text-gray-400">
            Changes save automatically and reflect across all salary sheets.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ManageAttendanceModal;
