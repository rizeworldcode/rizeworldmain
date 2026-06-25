import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IndianRupee, Users, Briefcase, Wallet, Calendar, X } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import RevenueChart from '../components/dashboard/RevenueChart';
import RecentClients from '../components/dashboard/RecentClients';
import StaffList from '../components/dashboard/StaffList';
import { getDashboardStats, getAllStaff, markStaffLeave } from '../api';

const Overview = ({ onViewClient, onViewStaff }) => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalClients: 0,
    totalProjects: 0,
    totalPaidSalary: 0
  });
  const [loading, setLoading] = useState(true);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(null);
  const [leaveType, setLeaveType] = useState('Casual');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await getDashboardStats();
        if (result.success) {
          setStats(result.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

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
      className="space-y-8"
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
              Welcome back, Alex. Here's what's happening with your business today.
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
          value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`} 
          icon={IndianRupee}
          gradient="from-blue-600 to-indigo-600"
          loading={loading}
        />
        <StatsCard 
          title="Total Client" 
          value={stats.totalClients.toLocaleString()} 
          icon={Users}
          gradient="from-purple-600 to-pink-600"
          loading={loading}
        />
        <StatsCard 
          title="Total Projects" 
          value={stats.totalProjects.toLocaleString()} 
          icon={Briefcase}
          gradient="from-emerald-600 to-teal-600"
          loading={loading}
        />
        <StatsCard 
          title="Paid Salary (Monthly)" 
          value={`₹${stats.totalPaidSalary.toLocaleString('en-IN')}`} 
          icon={Wallet}
          gradient="from-orange-500 to-rose-500"
          loading={loading}
        />
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
