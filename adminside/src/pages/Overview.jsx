import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IndianRupee, CalendarCheck, Briefcase, Wallet, Calendar, X, ChevronDown, Lock } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import RevenueChart from '../components/dashboard/RevenueChart';
import RecentClients from '../components/dashboard/RecentClients';
import StaffList from '../components/dashboard/StaffList';
import DashboardMap from '../components/dashboard/DashboardMap';
import { getDashboardStats, getAllStaff, markStaffLeave, prefetchAdminData } from '../api';
import { getAvailableSalaryMonths, getMonthlySalarySummary } from '../utils/salaryCalculator';

const Overview = ({ onViewClient, onViewStaff }) => {
  const navigate = useNavigate();

  const getAdminNameFromEmail = () => {
    const email = localStorage.getItem('currentAdminEmail');
    if (!email || email === 'Admin') return 'Alex';
    const namePart = email.split('@')[0];
    const cleanName = namePart.replace(/[._-]/g, ' ');
    return cleanName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const [stats, setStats] = useState({
    totalRevenue: 0,
    todayAssignedWork: '0/0',
    totalProjects: 0,
    totalPaidSalary: 0
  });
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(null);
  const [leaveType, setLeaveType] = useState('Casual');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const now = new Date();
  const currentMonthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });
  const [selectedSalaryMonth, setSelectedSalaryMonth] = useState(currentMonthName);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, staffRes] = await Promise.all([
          getDashboardStats(),
          getAllStaff(true)
        ]);
        if (statsRes.success) {
          setStats(statsRes.data);
        }
        if (staffRes.success && Array.isArray(staffRes.data)) {
          setStaffList(staffRes.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
    prefetchAdminData();
  }, []);

  const availableSalaryMonths = useMemo(() => {
    return getAvailableSalaryMonths(staffList);
  }, [staffList]);

  const monthlySalarySummary = useMemo(() => {
    return getMonthlySalarySummary(staffList, selectedSalaryMonth);
  }, [staffList, selectedSalaryMonth]);

  const salaryPaidPercentage = useMemo(() => {
    if (!monthlySalarySummary.totalPayable || monthlySalarySummary.totalPayable === 0) return '0%';
    const pct = Math.min(100, Math.round((monthlySalarySummary.totalPaid / monthlySalarySummary.totalPayable) * 100));
    return `${pct}%`;
  }, [monthlySalarySummary]);

  const fetchStaffAndMarkLeave = async () => {
    setIsSubmitting(true);
    try {
      // First get all staff
      const staffResult = await getAllStaff();
      
      if (!staffResult.success) {
        alert('Failed to fetch staff list!');
        return;
      }

      const allStaffIds = staffResult.data.map(s => s._id);

      // Now mark leave for all staff
      const result = await markStaffLeave(allStaffIds, startDate, endDate || startDate, leaveType);
      
      if (result.success) {
        alert('Company-wide leave marked successfully!');
        setIsLeaveModalOpen(false);
      } else {
        alert('Failed to mark leave: ' + result.message);
      }
    } catch (error) {
      console.error('Error marking leave:', error);
      alert('Failed to mark leave!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 sm:space-y-5"
    >
      {/* Hero Section */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2"
            >
              Overview Dashboard
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-500 font-medium"
            >
              Welcome back, {getAdminNameFromEmail()}. Here's what's happening with your business today.
            </motion.p>
          </div>
          <button
            onClick={() => setIsLeaveModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all"
          >
            <Calendar size={20} />
            Leave
          </button>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatsCard 
          title="Total Revenue" 
          value={
            <span className="flex items-center gap-2 text-xl sm:text-2xl tracking-wider text-gray-500 dark:text-gray-400 font-mono font-bold">
              <span>••••••••</span>
              <Lock className="w-4 h-4 text-blue-500 dark:text-blue-400 inline shrink-0" />
            </span>
          }
          icon={IndianRupee}
          gradient="from-blue-600 to-indigo-600"
          loading={loading}
          onClick={() => navigate('/wallet')}
          headerAction={
            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 shadow-sm">
              <Lock className="w-2.5 h-2.5" />
              Locked
            </span>
          }
          subtitle={
            <div className="text-[11px] font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 pt-0.5">
              <span>Click to view in Wallet (Password Required)</span>
            </div>
          }
        />
        <StatsCard 
          title="Today's Assigned Work" 
          value={stats.todayAssignedWork || '0/0'} 
          icon={CalendarCheck}
          gradient="from-purple-600 to-pink-600"
          loading={loading}
          onClick={() => navigate('/today-work')}
        />
        <StatsCard 
          title="Total Projects" 
          value={stats.totalProjects.toLocaleString()} 
          icon={Briefcase}
          gradient="from-emerald-600 to-teal-600"
          loading={loading}
          onClick={() => navigate('/clients')}
        />
        <StatsCard 
          title="Monthly Salary (To Pay)" 
          value={`₹${monthlySalarySummary.totalPayable.toLocaleString('en-IN')}`} 
          icon={Wallet}
          gradient="from-orange-500 to-rose-500"
          loading={loading}
          onClick={() => navigate('/salary-sheet')}
          progress={salaryPaidPercentage}
          headerAction={
            <div className="relative">
              <select
                value={selectedSalaryMonth}
                onChange={(e) => setSelectedSalaryMonth(e.target.value)}
                className="pl-2.5 pr-6 py-1 rounded-lg text-xs font-bold bg-white/70 dark:bg-gray-800/80 border border-orange-200 dark:border-white/10 text-orange-700 dark:text-orange-300 hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer appearance-none shadow-sm backdrop-blur-md transition-all"
                title="Select month to view salary to pay"
              >
                {availableSalaryMonths.map(m => (
                  <option key={m} value={m} className="text-gray-900 dark:bg-gray-900 dark:text-white font-medium">
                    {m === currentMonthName ? `${m} (Current)` : m}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-orange-600 dark:text-orange-400 pointer-events-none" />
            </div>
          }
          subtitle={
            <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500 dark:text-gray-400 pt-0.5">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                Paid: ₹{monthlySalarySummary.totalPaid.toLocaleString('en-IN')}
              </span>
              <span className={monthlySalarySummary.totalPending > 0 ? "text-amber-600 dark:text-amber-400 font-bold" : "text-emerald-600 dark:text-emerald-400 font-bold"}>
                {monthlySalarySummary.totalPending > 0 ? `To Pay: ₹${monthlySalarySummary.totalPending.toLocaleString('en-IN')}` : 'All Paid ✓'}
              </span>
            </div>
          }
        />
      </section>

      {/* Sales Team Live Tracking Map Section (100% Width) */}
      <section className="w-full">
        <DashboardMap />
      </section>

      {/* Analytics Grid */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 min-h-[480px] sm:min-h-[450px]">
          <RevenueChart />
        </div>
        <div className="xl:col-span-1 min-h-[350px] sm:min-h-[450px]">
          <RecentClients onClientClick={onViewClient} />
        </div>
      </section>

      {/* Staff List Section */}
      <section>
        <StaffList onViewAll={onViewStaff} />
      </section>
      
      {/* Leave Modal */}
      <AnimatePresence>
        {isLeaveModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLeaveModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Mark Leave
                </h2>
                <button
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 space-y-6">
                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      End Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={endDate || ''}
                      onChange={(e) => setEndDate(e.target.value || null)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                </div>

                {/* Leave Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Leave Type
                  </label>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  >
                    <option value="Casual">Casual Leave</option>
                    <option value="Sick">Sick Leave</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-500/30">
                  <p className="text-amber-800 dark:text-amber-200 text-sm">
                    This will mark leave for all staff members.
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-6 border-t border-gray-200 dark:border-white/10 flex gap-3 justify-end">
                <button
                  onClick={() => setIsLeaveModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-6 py-3 border border-gray-200 dark:border-white/10 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={fetchStaffAndMarkLeave}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Marking...
                    </>
                  ) : (
                    'Mark Company Leave'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Bottom Padding */}
      <div className="h-8" />
    </motion.div>
  );
};

export default Overview;
