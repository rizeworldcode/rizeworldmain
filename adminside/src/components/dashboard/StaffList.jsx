import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Briefcase, Clock, Calendar, CheckCircle2, XCircle, MoreVertical, LogOut, LogIn, Trash2, Edit3 } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

const StaffList = ({ onViewAll }) => {
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const menuRef = useRef(null);

  // Helper function to get today's clock data
  const getTodayClockData = (staff) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayClockRecord = staff.clock?.find(c => 
      new Date(c.date) >= today && new Date(c.date) < tomorrow
    );

    if (!todayClockRecord || !todayClockRecord.sessions?.length) {
      return { clockIn: '-', clockOut: '-', totalHours: '-' };
    }

    const lastSession = todayClockRecord.sessions[todayClockRecord.sessions.length - 1];
    return {
      clockIn: lastSession.clockIn || '-',
      clockOut: lastSession.clockOut || '-',
      totalHours: todayClockRecord.totalHours || '-'
    };
  };

  const fetchStaff = async () => {
    try {
      const response = await fetch('http://localhost:45000/api/staff');
      const result = await response.json();
      if (result.success) {
        setStaffMembers(result.data);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClockOut = async (id) => {
    try {
      const response = await fetch(`http://localhost:45000/api/staff/${id}/clock-out`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      if (result.success) {
        setStaffMembers(prev => prev.map(s => s._id === id ? result.data : s));
        setActiveMenu(null);
        alert('Staff clocked out successfully');
      }
    } catch (error) {
      console.error('Error clocking out staff:', error);
      alert('Failed to clock out staff');
    }
  };

  const handleClockIn = async (id) => {
    try {
      const response = await fetch(`http://localhost:45000/api/staff/${id}/clock-in`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      if (result.success) {
        setStaffMembers(prev => prev.map(s => s._id === id ? result.data : s));
        setActiveMenu(null);
        alert('Staff clocked in successfully');
      }
    } catch (error) {
      console.error('Error clocking in staff:', error);
      alert('Failed to clock in staff');
    }
  };

  if (loading) {
    return (
      <div className="glass-card p-6 rounded-2xl h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-2xl overflow-hidden transition-colors">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Staff Management</h3>
          <p className="text-sm text-gray-500 font-medium">Daily attendance and work tracking</p>
        </div>
        <button 
          onClick={onViewAll}
          className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-all"
        >
          View All Staff
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/5 text-[11px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-bold">
              <th className="pb-4 pl-2">Staff Member</th>
              <th className="pb-4">Department</th>
              <th className="pb-4">Job Status</th>
              <th className="pb-4">Clock In</th>
              <th className="pb-4">Clock Out</th>
              <th className="pb-4">Today's Work</th>
              <th className="pb-4 pr-2 text-right">Status / Action</th>
            </tr>
          </thead>
          <motion.tbody
            variants={container}
            initial="hidden"
            animate="show"
          >
            {staffMembers.map((staff) => (
              <motion.tr
                key={staff._id}
                variants={item}
                className="group border-b border-gray-50 dark:border-white/5 last:border-0 hover:bg-black/[0.01] dark:hover:bg-white/[0.02] transition-colors"
              >
                <td className="py-4 pl-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-blue-500 dark:text-blue-400">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{staff.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-gray-500 flex items-center gap-1"><Mail size={10} /> {staff.email}</span>
                        <span className="text-[10px] text-gray-500 flex items-center gap-1"><Phone size={10} /> {staff.phone}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-1.5">
                    <Briefcase size={14} className="text-gray-400 dark:text-gray-600" />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{staff.department}</span>
                  </div>
                </td>
                <td className="py-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                    staff.jobType === 'Permanent' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' :
                    staff.jobType === 'Intern' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' :
                    'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                  }`}>
                    {staff.jobType}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                    <Clock size={14} />
                    <span className="text-xs">{getTodayClockData(staff).clockIn}</span>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                    <LogOut size={14} className="rotate-180" />
                    <span className="text-xs">{getTodayClockData(staff).clockOut}</span>
                  </div>
                </td>
                <td className="py-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[180px] truncate">{staff.todayWork || '-'}</p>
                </td>
                <td className="py-4 pr-2 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                      staff.status === 'Present' 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border border-emerald-500/20' 
                        : staff.status === 'Clocked Out'
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-500 border border-blue-500/20'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-500 border border-rose-500/20'
                    }`}>
                      {staff.status === 'Present' ? <CheckCircle2 size={12} /> : staff.status === 'Clocked Out' ? <LogOut size={12} /> : <XCircle size={12} />}
                      {staff.status || 'Absent'}
                    </span>
                    
                    {staff.clock_status === 'clock_in' ? (
                      <button 
                        onClick={() => handleClockOut(staff._id)}
                        className="p-2 bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white rounded-xl transition-all border border-rose-500/20 shadow-lg shadow-rose-500/10 flex items-center gap-2 group/btn"
                        title="Clock Out Staff"
                      >
                        <LogOut size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest pr-1">Clock Out</span>
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleClockIn(staff._id)}
                        className="p-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white rounded-xl transition-all border border-emerald-500/20 shadow-lg shadow-emerald-500/10 flex items-center gap-2 group/btn"
                        title="Clock In Staff"
                      >
                        <LogIn size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest pr-1">Clock In</span>
                      </button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffList;
