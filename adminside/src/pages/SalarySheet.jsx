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
  RefreshCw
} from 'lucide-react';

const API_BASE = 'http://localhost:45000/api';

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

// ─── Payout Calculation (mirrors StaffDetails.jsx logic) ───────────────────────
const STANDARD_HOURS_PER_DAY = 8.5;
const DAYS_IN_MONTH = 30;
const EXPECTED_MONTHLY_HOURS = STANDARD_HOURS_PER_DAY * DAYS_IN_MONTH;

const parseTotalHours = (str) => {
  if (!str || str === '-') return 0;
  const hM = str.match(/(\d+)\s*h/i);
  const mM = str.match(/(\d+)\s*m/i);
  return (hM ? parseInt(hM[1], 10) : 0) + (mM ? parseInt(mM[1], 10) / 60 : 0);
};

const calculatePayout = (emp) => {
  const baseSalary = emp.monthlySalary || 0;
  const hourlyRate = baseSalary / EXPECTED_MONTHLY_HOURS;
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const createdAt = emp.createdAt ? new Date(emp.createdAt) : null;
  const startDay = (
    createdAt &&
    createdAt.getMonth() === currentMonth &&
    createdAt.getFullYear() === currentYear
  ) ? createdAt.getDate() : 1;

  const monthlyClockRecords = (emp.clock || []).filter(r => {
    const d = new Date(r.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  let totalHours = 0;
  monthlyClockRecords.forEach(r => {
    const h = parseTotalHours(r.totalHours);
    if (h > 9) totalHours += 8.5 + (h - 9);
    else if (h >= 8.5) totalHours += 8.5;
    else totalHours += h;
  });

  const creditedDates = new Set(monthlyClockRecords.map(r => new Date(r.date).toDateString()));

  // Sundays
  for (let day = startDay; day <= today.getDate(); day++) {
    const d = new Date(currentYear, currentMonth, day);
    if (d.getDay() === 0 && !creditedDates.has(d.toDateString())) {
      totalHours += STANDARD_HOURS_PER_DAY;
      creditedDates.add(d.toDateString());
    }
  }

  // Admin-declared leaves
  (emp.leaves || []).forEach(leave => {
    const d = new Date(leave.date);
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear && d <= today && !creditedDates.has(d.toDateString())) {
      totalHours += STANDARD_HOURS_PER_DAY;
      creditedDates.add(d.toDateString());
    }
  });

  // Attendance 'On Leave'
  (emp.attendance || []).forEach(att => {
    const d = new Date(att.date);
    if (att.status === 'On Leave' && d.getMonth() === currentMonth && d.getFullYear() === currentYear && d <= today && !creditedDates.has(d.toDateString())) {
      totalHours += STANDARD_HOURS_PER_DAY;
      creditedDates.add(d.toDateString());
    }
  });

  // Absent days
  const absentDays = [];
  for (let day = startDay; day <= today.getDate(); day++) {
    const d = new Date(currentYear, currentMonth, day);
    if (!creditedDates.has(d.toDateString())) absentDays.push(d);
  }

  // Half-days
  const halfDayRecords = (emp.attendance || []).filter(att => {
    const d = new Date(att.date);
    return att.status === 'Half-Day' && d.getMonth() === currentMonth && d.getFullYear() === currentYear && d <= today;
  });
  const halfDayLeaveUnits = Math.floor(halfDayRecords.length / 2);

  // 1 free casual leave
  if (absentDays.length > 0) {
    totalHours += STANDARD_HOURS_PER_DAY;
    creditedDates.add(absentDays[0].toDateString());
  } else if (halfDayLeaveUnits > 0) {
    for (let i = 0; i < 2; i++) {
      const hdDate = new Date(halfDayRecords[i].date);
      const cr = monthlyClockRecords.find(r => new Date(r.date).toDateString() === hdDate.toDateString());
      const actualHrs = cr ? parseTotalHours(cr.totalHours) : 0;
      const halfTarget = STANDARD_HOURS_PER_DAY / 2;
      if (actualHrs < halfTarget) totalHours += halfTarget - actualHrs;
    }
  }

  return Math.round(hourlyRate * totalHours);
};


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
        (s.department || '').toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      let valA = a[sortBy], valB = b[sortBy];
      if (sortBy === 'monthlySalary' || sortBy === 'payoutSalary') {
        valA = Number(valA) || 0; valB = Number(valB) || 0;
      } else {
        valA = String(valA || '').toLowerCase(); valB = String(valB || '').toLowerCase();
      }
      const cmp = valA < valB ? -1 : valA > valB ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
    // Attach payout to each result
    return result.map(emp => ({ ...emp, _payout: calculatePayout(emp) }));
  }, [staff, search, filterDept, filterType, sortBy, sortDir]);

  const filteredTotal = useMemo(() => filtered.reduce((sum, s) => sum + (s.monthlySalary || 0), 0), [filtered]);
  const filteredPayout = useMemo(() => filtered.reduce((sum, s) => sum + (s._payout || 0), 0), [filtered]);

  const handleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
  };

  const SortIcon = ({ col }) => {
    if (sortBy !== col) return <ChevronDown className="w-3 h-3 text-gray-300" />;
    return <ChevronDown className={`w-3 h-3 text-indigo-500 transition-transform ${sortDir === 'desc' ? 'rotate-180' : ''}`} />;
  };

  const handleExportCSV = () => {
    const rows = [
      ['Employee ID', 'Name', 'Department', 'Job Type', 'Base Salary (INR)', 'Payout Salary (INR)'],
      ...filtered.map(s => [s.employeeId || '', s.name || '', s.department || '', s.jobType || '', s.monthlySalary || 0, s._payout || 0])
    ];
    const csvContent = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Salary_Sheet_${new Date().toLocaleDateString('en-IN').replace(/\//g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
        <div className="flex items-center gap-2">
          <button onClick={fetchData} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button onClick={handleExportCSV} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => { sessionStorage.removeItem('salary_unlocked'); onLock(); }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
          >
            <Lock className="w-4 h-4" />
            Lock
          </button>
        </div>
      </div>

      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Users2, label: 'Total Employees', value: staff.length, color: 'from-blue-500 to-cyan-500' },
            { icon: IndianRupee, label: 'Total Payroll', value: formatCurrency(totalPayroll), color: 'from-emerald-500 to-teal-500' },
            { icon: Briefcase, label: 'Departments', value: departments.length - 1, color: 'from-purple-500 to-pink-500' },
            { icon: TrendingUp, label: 'Avg. Salary', value: formatCurrency(staff.length ? Math.round(totalPayroll / staff.length) : 0), color: 'from-orange-500 to-amber-500' }
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
                      { key: 'name', label: 'Employee Name' },
                      { key: 'department', label: 'Department' },
                      { key: 'jobType', label: 'Type' },
                      { key: 'monthlySalary', label: 'Base Salary / Month' },
                      { key: 'payoutSalary', label: 'Payout Salary' }
                    ].map(({ key, label }) => (
                      <th key={key} className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors select-none" onClick={() => handleSort(key)}>
                        <div className="flex items-center gap-1">{label}<SortIcon col={key} /></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="px-5 py-16 text-center text-sm text-gray-400 dark:text-gray-600">No employees match your filters.</td></tr>
                  ) : filtered.map((emp, idx) => (
                    <motion.tr key={emp._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }}
                      className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-5 py-3.5 text-gray-400 dark:text-gray-600 text-xs">{idx + 1}</td>
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md">{emp.employeeId || '—'}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-gray-900 dark:text-white">{emp.name}</div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600 dark:text-gray-400 text-xs">{emp.department || '—'}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${JOB_TYPE_COLORS[emp.jobType] || 'bg-gray-100 text-gray-600'}`}>{emp.jobType || '—'}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">{formatCurrency(emp.monthlySalary)}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">{formatCurrency(emp._payout)}</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                  <span className="text-xs text-gray-500 dark:text-gray-400">{filtered.length === staff.length ? 'Total Payroll:' : 'Filtered Payroll:'}</span>
                  <span className="text-base font-bold text-gray-500 dark:text-gray-400">{formatCurrency(filteredTotal)}</span>
                </div>
                <div className="w-px h-4 bg-gray-200 dark:bg-white/10" />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Est. Payout Total:</span>
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
