import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  CheckCircle2, 
  Clock, 
  Search,
  Building2,
  Calendar,
  ListTodo,
  Circle,
  FileText,
  X,
  Plus,
  Zap,
  Star
} from 'lucide-react';

const TodayAssignedWork = ({ initialSearch = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [submittingReport, setSubmittingReport] = useState(null);
  const [submittingAllReports, setSubmittingAllReports] = useState(false);
  const [newTasks, setNewTasks] = useState({});

  const fetchStaff = async () => {
    try {
      const response = await fetch('http://localhost:45000/api/staff');
      const result = await response.json();
      if (result.success) setStaffList(result.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStaff(); }, []);

  const getTodayTasks = (staff) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const todayWork = staff.work?.find(w => {
      const workDate = new Date(w.date);
      return workDate >= today && workDate < tomorrow;
    });
    return todayWork?.tasks || [];
  };

  // KEY CHANGE: Progress now goes beyond 100% for bonus/extra tasks
  const calcProgress = (tasks) => {
    const regularTasks = tasks.filter(t => !t.isExtra);
    const extraTasks = tasks.filter(t => t.isExtra);
    const completedRegular = regularTasks.filter(t => t.completed).length;
    const completedExtra = extraTasks.filter(t => t.completed).length;
    const totalRegular = regularTasks.length;

    if (totalRegular === 0) {
      // Only extra tasks exist
      return completedExtra > 0 ? completedExtra * 25 : 0;
    }

    const baseProgress = Math.round((completedRegular / totalRegular) * 100);
    const bonusProgress = Math.round((completedExtra / totalRegular) * 100);
    return baseProgress + bonusProgress;
  };

  const handleToggleTask = async (staffId, taskIndex) => {
    try {
      const response = await fetch(`http://localhost:45000/api/staff/${staffId}/toggle-task`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskIndex })
      });
      const result = await response.json();
      if (result.success) fetchStaff();
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const handleAddTask = async (staffId) => {
    const taskName = newTasks[staffId]?.trim();
    if (!taskName) return;
    try {
      const response = await fetch(`http://localhost:45000/api/staff/${staffId}/add-extra-task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskName })
      });
      const result = await response.json();
      if (result.success) {
        fetchStaff();
        setNewTasks(prev => ({ ...prev, [staffId]: '' }));
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleSubmitReport = async (staffId) => {
    setSubmittingReport(staffId);
    try {
      const response = await fetch(`http://localhost:45000/api/staff/${staffId}/submit-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      alert(result.success ? 'Report submitted successfully!' : result.message || 'Failed to submit report');
    } catch (error) {
      alert('Failed to submit report');
    } finally {
      setSubmittingReport(null);
    }
  };

  const handleSubmitAllReports = async () => {
    setSubmittingAllReports(true);
    try {
      const response = await fetch('http://localhost:45000/api/staff/submit-all-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      alert(result.message || (result.success ? 'All reports submitted!' : 'Failed to submit reports'));
    } catch (error) {
      alert('Failed to submit reports');
    } finally {
      setSubmittingAllReports(false);
    }
  };

  const fetchReports = async () => {
    try {
      const response = await fetch(`http://localhost:45000/api/staff/reports?date=${selectedDate}`);
      const result = await response.json();
      if (result.success) setReports(result.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const openReportModal = () => {
    fetchReports();
    setIsReportModalOpen(true);
  };

  const filteredStaff = staffList.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = useMemo(() => {
    let totalTasks = 0, completedTasks = 0, pendingTasks = 0;
    staffList.forEach(staff => {
      getTodayTasks(staff).forEach(task => {
        totalTasks++;
        if (task.completed) completedTasks++;
        else pendingTasks++;
      });
    });
    return { totalTasks, completedTasks, pendingTasks };
  }, [staffList]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Today's Assigned Work</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
            <Calendar size={14} />
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • Real-time Employee tracking
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={openReportModal}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-5 py-2.5 rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-purple-500/30 transition-all"
          >
            <FileText size={18} /> View Reports
          </button>
          <button
            onClick={handleSubmitAllReports}
            disabled={submittingAllReports}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-5 py-2.5 rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText size={18} />
            {submittingAllReports ? 'Submitting All...' : 'Submit All Reports'}
          </button>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search staff or department..."
              className="bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-3xl border border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500"><User size={24} /></div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Staff</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{filteredStaff.length} Members</h3>
            </div>
          </div>
        </div>
        <div className="glass p-6 rounded-3xl border border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500"><CheckCircle2 size={24} /></div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tasks Done</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedTasks} Completed</h3>
            </div>
          </div>
        </div>
        <div className="glass p-6 rounded-3xl border border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500"><Clock size={24} /></div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Pending</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingTasks} Tasks</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Cards */}
      <div className="grid grid-cols-1 gap-6">
        {filteredStaff.map((staff) => {
          const tasks = getTodayTasks(staff);
          const regularTasks = tasks.filter(t => !t.isExtra);
          const extraTasks = tasks.filter(t => t.isExtra);
          const progress = calcProgress(tasks);
          const isBonus = progress > 100;
          // For the progress bar, cap visual at 100% for regular, show bonus segment separately
          const regularProgress = Math.min(progress, 100);
          const bonusProgress = Math.max(progress - 100, 0);

          return (
            <motion.div
              key={staff._id}
              layout
              className="glass-card p-6 rounded-3xl border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 transition-all relative overflow-hidden group"
            >
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Staff Info */}
                <div className="lg:w-1/3 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {staff.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white">{staff.name}</h4>
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tighter bg-blue-500/10 px-2 py-0.5 rounded">
                        {staff.department}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 flex items-center gap-2"><Building2 size={14} /> Employee ID:</span>
                      <span className="text-gray-900 dark:text-white font-bold">{staff.employeeId}</span>
                    </div>

                    {/* Progress section */}
                    <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-white/5">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Day Progress</span>
                        <div className="flex items-center gap-1.5">
                          {/* KEY CHANGE: Show bonus % with star icon and golden color */}
                          {isBonus && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="flex items-center gap-0.5 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-full"
                            >
                              <Star size={9} fill="currentColor" /> BONUS
                            </motion.span>
                          )}
                          <span className={`text-xs font-bold ${isBonus ? 'text-amber-500' : progress === 100 ? 'text-emerald-500' : 'text-blue-600 dark:text-blue-400'}`}>
                            {progress}%
                          </span>
                        </div>
                      </div>

                      {/* Progress bar: regular (blue/green) + bonus (amber) segment */}
                      <div className="relative w-full h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                        {/* Base bar */}
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${regularProgress}%` }}
                          transition={{ duration: 0.5 }}
                          className={`absolute left-0 top-0 h-full ${progress >= 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                        />
                        {/* Bonus segment on top — amber, pulsing */}
                        {isBonus && (
                          <motion.div
                            initial={{ opacity: 0, scaleX: 0 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            transition={{ delay: 0.4 }}
                            style={{ width: `${Math.min(bonusProgress, 100)}%` }}
                            className="absolute left-0 top-0 h-full bg-gradient-to-r from-amber-400 to-orange-400 origin-left"
                          />
                        )}
                      </div>

                      {/* Bonus breakdown label */}
                      {isBonus && (
                        <p className="text-[9px] text-amber-500 font-bold tracking-wider">
                          100% base + {bonusProgress}% bonus work
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tasks */}
                <div className="lg:w-2/3 space-y-6">
                  {/* Add New Extra Task */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Zap size={16} className="text-amber-500" />
                      <h5 className="text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest">Assign Extra Task</h5>
                    </div>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newTasks[staff._id] || ''}
                        onChange={(e) => setNewTasks(prev => ({ ...prev, [staff._id]: e.target.value }))}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTask(staff._id)}
                        placeholder="Type extra task and press Enter..."
                        className="flex-1 bg-black/5 dark:bg-white/5 border border-amber-200 dark:border-amber-500/20 rounded-2xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-amber-400 outline-none transition-all placeholder:text-gray-400"
                      />
                      <button
                        onClick={() => handleAddTask(staff._id)}
                        className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:shadow-lg hover:shadow-amber-500/30 transition-all active:scale-95 flex items-center gap-2"
                      >
                        <Plus size={14} /> Add
                      </button>
                    </div>
                  </div>

                  {/* Regular Tasks */}
                  {regularTasks.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <ListTodo size={16} className="text-gray-400 dark:text-gray-500" />
                        <h5 className="text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest">
                          Today's Tasks
                          <span className="ml-2 text-gray-400 font-normal normal-case tracking-normal">
                            {regularTasks.filter(t => t.completed).length}/{regularTasks.length} done
                          </span>
                        </h5>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {regularTasks.map((task, idx) => (
                          <TaskButton
                            key={idx}
                            task={task}
                            onClick={() => handleToggleTask(staff._id, tasks.indexOf(task))}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* KEY CHANGE: Bonus / Extra Tasks section — visually distinct */}
                  {extraTasks.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Star size={16} className="text-amber-500" fill="currentColor" />
                        <h5 className="text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                          Bonus Work
                          <span className="ml-2 text-amber-400 font-normal normal-case tracking-normal">
                            {extraTasks.filter(t => t.completed).length}/{extraTasks.length} done
                          </span>
                        </h5>
                      </div>
                      {/* Amber tinted section */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                        {extraTasks.map((task, idx) => (
                          <TaskButton
                            key={idx}
                            task={task}
                            isExtra
                            onClick={() => handleToggleTask(staff._id, tasks.indexOf(task))}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {tasks.length === 0 && (
                    <div className="text-center py-6 bg-black/5 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
                      <p className="text-xs text-gray-500 font-medium">No tasks assigned for today.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Report Modal */}
      <AnimatePresence>
        {isReportModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsReportModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed inset-0 z-[110] flex items-center justify-center p-4"
            >
              <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Work Reports</h2>
                    <button onClick={() => setIsReportModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                      <X size={24} className="text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mb-6">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Select Date:</label>
                    <input
                      type="date" value={selectedDate}
                      onChange={(e) => { setSelectedDate(e.target.value); fetchReports(); }}
                      className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-4">
                    {reports.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                        <p className="text-gray-500 dark:text-gray-400">No reports found for this date</p>
                      </div>
                    ) : (
                      reports.map((report) => {
                        const isBonus = report.progressPercentage > 100;
                        return (
                          <div key={report._id} className="p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{report.staffName}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {new Date(report.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                              </div>
                              <div className={`px-4 py-2 rounded-full font-bold text-sm flex items-center gap-1.5 ${
                                isBonus ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                report.progressPercentage >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                report.progressPercentage >= 50 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              }`}>
                                {isBonus && <Star size={12} fill="currentColor" />}
                                {report.progressPercentage}% {isBonus ? 'Bonus!' : 'Complete'}
                              </div>
                            </div>
                            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 overflow-hidden">
                              <div
                                className={`h-full transition-all duration-500 ${
                                  isBonus ? 'bg-gradient-to-r from-emerald-500 to-amber-400' :
                                  report.progressPercentage >= 80 ? 'bg-green-500' :
                                  report.progressPercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${Math.min(report.progressPercentage, 100)}%` }}
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {report.tasks.map((task, idx) => (
                                <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl border ${
                                  task.isExtra
                                    ? task.completed
                                      ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                                      : 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30'
                                    : task.completed
                                      ? 'bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                      : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                                }`}>
                                  <div className={`p-1.5 rounded-lg ${
                                    task.isExtra
                                      ? task.completed ? 'bg-amber-500 text-white' : 'bg-amber-200 text-amber-600'
                                      : task.completed ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'
                                  }`}>
                                    {task.completed ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                                  </div>
                                  <div className="flex flex-col gap-0.5">
                                    <span className={`text-sm font-semibold ${
                                      task.completed
                                        ? task.isExtra ? 'text-amber-700 dark:text-amber-300 line-through' : 'text-green-800 dark:text-green-300 line-through'
                                        : 'text-gray-700 dark:text-gray-300'
                                    }`}>{task.name}</span>
                                    {task.isExtra && (
                                      <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">Bonus</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Extracted task button component
const TaskButton = ({ task, onClick, isExtra = false }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all text-left w-full group/task cursor-pointer ${
      task.completed
        ? isExtra
          ? 'bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10 hover:border-amber-500/30'
          : 'bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10 hover:border-emerald-500/30'
        : isExtra
          ? 'bg-amber-500/5 border-amber-500/10 hover:bg-amber-500/10 hover:border-amber-500/30'
          : 'bg-black/5 dark:bg-white/5 border-gray-100 dark:border-white/5 hover:bg-blue-500/10 hover:border-blue-500/30'
    }`}
  >
    <div className={`p-1.5 rounded-lg transition-all ${
      task.completed
        ? isExtra
          ? 'bg-amber-500/20 text-amber-500'
          : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
        : isExtra
          ? 'bg-amber-500/10 text-amber-400 group-hover/task:bg-amber-500/20 group-hover/task:text-amber-500'
          : 'bg-gray-500/20 text-gray-500 dark:text-gray-400 group-hover/task:bg-blue-500/20 group-hover/task:text-blue-600 dark:group-hover/task:text-blue-400'
    }`}>
      {task.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
    </div>
    <span className={`text-sm font-bold block transition-all ${
      task.completed
        ? isExtra ? 'text-amber-400 line-through' : 'text-gray-400 line-through'
        : 'text-gray-900 dark:text-white'
    }`}>
      {task.name}
    </span>
  </button>
);

export default TodayAssignedWork;