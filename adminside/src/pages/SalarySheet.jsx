import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Search,
  Filter,
  IndianRupee,
  Users2,
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
  Briefcase,
  ChevronDown,
  Download,
  RefreshCw,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { BASE_URL } from '../api';

const API_BASE = BASE_URL;

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

const JOB_TYPE_COLORS = {
  Permanent: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
  Intern: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20',
  'Part-time': 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20'
};

import { 
  calculatePayoutForMonth, 
  getAvailableSalaryMonths,
  isDailyRatedStaff 
} from '../utils/salaryCalculator';
import ManageAttendanceModal from '../components/attendance/ManageAttendanceModal';


const PasswordGate = ({ onUnlock }) => {
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
      const res = await fetch(`${API_BASE}/staff/salary-sheet/verify`, {
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
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Salary Sheet</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">This page is confidential. Enter the admin password to view employee salary data.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Access Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="Enter salary sheet password"
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
                {loading ? 'Verifying…' : 'Unlock Salary Sheet'}
              </button>
            </form>
            <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6">🔒 Session automatically locks when you close the tab</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const SalarySheetView = ({ onLock }) => {
  const [staff, setStaff] = useState([]);
  const [totalPayroll, setTotalPayroll] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  const now = new Date();
  const currentMonthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });
  const [selectedMonth, setSelectedMonth] = useState(currentMonthName);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE}/staff/salary-sheet`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (data.success) {
        setStaff(data.data || []);
        setTotalPayroll(data.totalPayroll || 0);
      } else {
        setError(data.message || 'Failed to load salary data.');
      }
    } catch {
      setError('Could not reach server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const [selectedStaffForAttendance, setSelectedStaffForAttendance] = useState(null);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);

  const handleOpenAttendance = (emp) => {
    setSelectedStaffForAttendance(emp);
    setIsAttendanceModalOpen(true);
  };

  const handleAttendanceUpdated = (updatedStaff) => {
    if (!updatedStaff) return;
    setStaff(prev => prev.map(s => 
      (s._id === updatedStaff._id || s.id === updatedStaff._id) ? updatedStaff : s
    ));
    if (selectedStaffForAttendance && (selectedStaffForAttendance._id === updatedStaff._id || selectedStaffForAttendance.id === updatedStaff._id)) {
      setSelectedStaffForAttendance(updatedStaff);
    }
  };

  // Compute available months dynamically using the shared helper
  const availableMonths = useMemo(() => {
    return getAvailableSalaryMonths(staff);
  }, [staff]);

  const departments = useMemo(() => {
    const depts = [...new Set(staff.map(s => s.department).filter(Boolean))].sort();
    return ['All', ...depts];
  }, [staff]);

  const jobTypes = useMemo(() => {
    const types = [...new Set(staff.map(s => s.jobType).filter(Boolean))].sort();
    return ['All', ...types];
  }, [staff]);

  const filtered = useMemo(() => {
    let result = [...staff];
    if (filterDept !== 'All') result = result.filter(s => s.department === filterDept);
    if (filterType !== 'All') result = result.filter(s => s.jobType === filterType);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        (s.name || '').toLowerCase().includes(q) ||
        (s.employeeId || '').toLowerCase().includes(q) ||
        (s.department || '').toLowerCase().includes(q) ||
        (s.role || '').toLowerCase().includes(q)
      );
    }
    
    // Attach payout and paid status for the selected month to each result
    const withPayout = result.map(emp => {
      const pInfo = calculatePayoutForMonth(emp, selectedMonth);
      return {
        ...emp,
        _payout: pInfo.payout,
        _earnedSalary: pInfo.earnedSalary,
        _advanceDeduction: pInfo.advanceDeduction || 0,
        _totalPendingAdvance: pInfo.totalPendingAdvance || 0,
        _advanceBalance: pInfo.advanceBalanceRemaining ?? pInfo.totalPendingAdvance,
        _isPaid: pInfo.isPaid,
        _daysWorked: pInfo.daysWorked,
        _isDaily: pInfo.isDailyRated,
        _dailyRate: pInfo.dailyRate,
        _presentDays: pInfo.presentDays,
        _absentDays: pInfo.absentDays,
        _halfDays: pInfo.halfDays,
        _totalCycleDays: pInfo.totalCycleDays
      };
    });

    withPayout.sort((a, b) => {
      let valA = a[sortBy], valB = b[sortBy];
      if (sortBy === '_payout' || sortBy === 'payoutSalary') {
        valA = Number(a._payout) || 0; valB = Number(b._payout) || 0;
      } else if (sortBy === 'monthlySalary') {
        valA = Number(valA) || 0; valB = Number(valB) || 0;
      } else if (sortBy === '_advanceDeduction') {
        valA = Number(a._advanceDeduction) || 0; valB = Number(b._advanceDeduction) || 0;
      } else if (sortBy === '_totalPendingAdvance') {
        valA = Number(a._totalPendingAdvance) || 0; valB = Number(b._totalPendingAdvance) || 0;
      } else {
        valA = String(valA || '').toLowerCase(); valB = String(valB || '').toLowerCase();
      }
      const cmp = valA < valB ? -1 : valA > valB ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return withPayout;
  }, [staff, search, filterDept, filterType, sortBy, sortDir, selectedMonth]);

  const filteredTotal = useMemo(() => filtered.reduce((sum, s) => sum + (s.monthlySalary || 0), 0), [filtered]);
  const filteredPayout = useMemo(() => filtered.reduce((sum, s) => sum + (s._payout || 0), 0), [filtered]);
  const filteredAdvanceDeductions = useMemo(() => filtered.reduce((sum, s) => sum + (s._advanceDeduction || 0), 0), [filtered]);
  const filteredPendingAdvance = useMemo(() => filtered.reduce((sum, s) => sum + (s._totalPendingAdvance || 0), 0), [filtered]);

  const handleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
  };

  const SortIcon = ({ col }) => {
    if (sortBy !== col) return <ChevronDown className="w-3 h-3 text-gray-300" />;
    return <ChevronDown className={`w-3 h-3 text-indigo-500 transition-transform ${sortDir === 'desc' ? 'rotate-180' : ''}`} />;
  };

  const handleExportCSV = () => {
    const cleanMonth = selectedMonth.replace(/\s*\(Current\)/i, '').trim();
    const rows = [
      ['Employee ID', 'Name', 'Role', 'Department', 'Calculation Type', 'Daily Rate (INR)', 'Days Present', 'Salary Month', 'Base Salary (INR)', 'Earned Gross (INR)', 'Advance Deducted (INR)', 'Pending Advance Balance (INR)', 'Net Payout (INR)', 'Payment Status'],
      ...filtered.map(s => [
        s.employeeId || '',
        s.name || '',
        s.role || 'Staff',
        s.department || '',
        s._isDaily ? '30-Day Day-Wise (Auto-Present)' : 'Standard Hourly Clock-In',
        s._isDaily ? (s._dailyRate || Math.round(s.monthlySalary / 30)) : Math.round(s.monthlySalary / 30),
        `${s._daysWorked || 0}/${s._totalCycleDays || 30}`,
        cleanMonth,
        s.monthlySalary || 0,
        s._earnedSalary || 0,
        s._advanceDeduction || 0,
        s._totalPendingAdvance || 0,
        s._payout || 0,
        s._isPaid ? 'PAID' : 'PENDING'
      ])
    ];
    const csvContent = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Salary_Sheet_${cleanMonth.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <IndianRupee className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Salary Sheet</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Confidential — Session Protected</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Month Selector */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500 pointer-events-none" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="pl-9 pr-8 py-2.5 rounded-xl text-sm font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50/90 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 hover:border-indigo-400 dark:hover:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none shadow-sm transition-all"
            >
              {availableMonths.map(m => (
                <option key={m} value={m} className="text-gray-900 dark:bg-gray-900 dark:text-white font-semibold">
                  {m === currentMonthName ? `${m} (Current)` : m}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-indigo-500 pointer-events-none" />
          </div>

          <button onClick={fetchData} className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button onClick={handleExportCSV} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => { sessionStorage.removeItem('salary_unlocked'); onLock(); }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
          >
            <Lock className="w-4 h-4" />
            Lock
          </button>
        </div>
      </div>

      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { icon: Users2, label: 'Total Employees', value: staff.length, color: 'from-blue-500 to-cyan-500' },
            { icon: IndianRupee, label: 'Base Payroll', value: formatCurrency(totalPayroll), color: 'from-purple-500 to-indigo-500' },
            { icon: TrendingUp, label: `${selectedMonth.replace(/\s*\(Current\)/i, '').trim()} Net Payout`, value: formatCurrency(filteredPayout), color: 'from-emerald-500 to-teal-500' },
            { icon: IndianRupee, label: 'Adv. Deducted', value: formatCurrency(filteredAdvanceDeductions), color: 'from-rose-500 to-red-500' },
            { icon: Briefcase, label: 'Pending Advances', value: formatCurrency(filteredPendingAdvance), color: 'from-amber-500 to-orange-500' }
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/10 p-4 shadow-sm">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-md`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-xl font-extrabold text-gray-900 dark:text-white">{value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, ID or department…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all" />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}
              className="pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm appearance-none cursor-pointer">
              {departments.map(d => <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>)}
            </select>
          </div>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
              className="pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm appearance-none cursor-pointer">
              {jobTypes.map(t => <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-indigo-500 border-t-transparent rounded-full animate-spin" style={{ borderWidth: 3, borderStyle: 'solid' }} />
            <p className="text-sm text-gray-400">Loading salary data…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <ShieldAlert className="w-10 h-10 text-red-400" />
            <p className="text-sm text-red-500 font-medium">{error}</p>
            <button onClick={fetchData} className="text-xs text-indigo-500 hover:underline">Try Again</button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10">
                    <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">#</th>
                    {[
                      { key: 'employeeId', label: 'Emp ID' },
                      { key: 'name', label: 'Employee & Role' },
                      { key: 'department', label: 'Department' },
                      { key: '_isDaily', label: 'Mode & Days' },
                      { key: 'monthlySalary', label: 'Base Salary' },
                      { key: '_advanceDeduction', label: 'Adv. Deducted' },
                      { key: '_totalPendingAdvance', label: 'Pending Adv.' },
                      { key: '_payout', label: `Net Payout (${selectedMonth.replace(/\s*\(Current\)/i, '').trim()})` },
                      { key: '_isPaid', label: 'Status' }
                    ].map(({ key, label }) => (
                      <th key={key} className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors select-none" onClick={() => handleSort(key)}>
                        <div className="flex items-center gap-1">{label}<SortIcon col={key} /></div>
                      </th>
                    ))}
                    <th className="px-5 py-3.5 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={10} className="px-5 py-16 text-center text-sm text-gray-400 dark:text-gray-600">No employees match your filters.</td></tr>
                  ) : filtered.map((emp, idx) => (
                    <motion.tr key={emp._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }}
                      className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-5 py-3.5 text-gray-400 dark:text-gray-600 text-xs">{idx + 1}</td>
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md">{emp.employeeId || '—'}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                          {emp.name}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <span className="px-1.5 py-0.2 rounded bg-black/5 dark:bg-white/10 text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase">
                            {emp.role || 'Staff'}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600 dark:text-gray-400 text-xs">{emp.department || '—'}</td>
                      <td className="px-5 py-3.5">
                        <div className="space-y-1">
                          {emp._isDaily ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              📅 30-Day Day-Wise
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
                              🕒 Hourly Clock
                            </span>
                          )}
                          <div className="text-[11px] font-bold text-gray-700 dark:text-gray-300">
                            {emp._daysWorked || 0}/{emp._totalCycleDays || 30} Days Present
                            {emp._absentDays > 0 && (
                              <span className="ml-1 text-rose-500 text-[10px] font-black">
                                (-{emp._absentDays}A)
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="space-y-0.5">
                          <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">{formatCurrency(emp.monthlySalary)}</span>
                          {emp._isDaily && (
                            <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                              ₹{emp._dailyRate || Math.round((emp.monthlySalary || 0) / 30)}/day
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        {emp._advanceDeduction > 0 ? (
                          <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-200/50">
                            - {formatCurrency(emp._advanceDeduction)}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        {emp._totalPendingAdvance > 0 ? (
                          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-200/50">
                            {formatCurrency(emp._totalPendingAdvance)}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">{formatCurrency(emp._payout)}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        {emp._isPaid ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 size={12} />
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenAttendance(emp)}
                          className="px-2.5 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/20 text-xs font-bold transition-all inline-flex items-center gap-1 shadow-sm"
                          title="View / Mark Attendance & Absences"
                        >
                          <Calendar size={13} />
                          <span>Attendance</span>
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Attendance & Absences Modal */}
            <AnimatePresence>
              {isAttendanceModalOpen && selectedStaffForAttendance && (
                <ManageAttendanceModal
                  isOpen={isAttendanceModalOpen}
                  onClose={() => setIsAttendanceModalOpen(false)}
                  staffMember={selectedStaffForAttendance}
                  monthStr={selectedMonth}
                  onAttendanceUpdated={handleAttendanceUpdated}
                />
              )}
            </AnimatePresence>

            <div className="px-5 py-4 border-t border-gray-100 dark:border-white/10 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/5 dark:to-purple-500/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Users2 className="w-4 h-4" />
                <span>
                  Showing <span className="font-bold text-gray-900 dark:text-white">{filtered.length}</span> of {staff.length} employees
                  {(filterDept !== 'All' || filterType !== 'All' || search) && (
                    <button onClick={() => { setSearch(''); setFilterDept('All'); setFilterType('All'); }} className="ml-2 text-indigo-500 hover:underline">Clear filters</button>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{filtered.length === staff.length ? 'Total Base Payroll:' : 'Filtered Base Payroll:'}</span>
                  <span className="text-base font-bold text-gray-500 dark:text-gray-400">{formatCurrency(filteredTotal)}</span>
                </div>
                {filteredAdvanceDeductions > 0 && (
                  <>
                    <div className="w-px h-4 bg-gray-200 dark:bg-white/10" />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-rose-500 font-semibold">Total Adv Deducted:</span>
                      <span className="text-base font-bold text-rose-600 dark:text-rose-400">- {formatCurrency(filteredAdvanceDeductions)}</span>
                    </div>
                  </>
                )}
                <div className="w-px h-4 bg-gray-200 dark:bg-white/10" />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{selectedMonth.replace(/\s*\(Current\)/i, '').trim()} Net Payout Total:</span>
                  <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{formatCurrency(filteredPayout)}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl px-4 py-3">
        <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 dark:text-amber-400">
          <strong>Confidential:</strong> This salary data is restricted to authorised personnel only. Do not share screenshots or exports outside the organisation.
        </p>
      </div>
    </motion.div>
  );
};

const SalarySheet = () => {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('salary_unlocked') === 'true');
  return unlocked ? <SalarySheetView onLock={() => setUnlocked(false)} /> : <PasswordGate onUnlock={() => setUnlocked(true)} />;
};

export default SalarySheet;
