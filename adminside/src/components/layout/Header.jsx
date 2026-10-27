import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, 
  User, 
  Sun, 
  Moon, 
  LogOut, 
  KeyRound, 
  Lock, 
  Eye, 
  EyeOff, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  Bell, 
  Phone, 
  Calendar, 
  Clock, 
  UserCheck, 
  ArrowRight, 
  ExternalLink, 
  RefreshCw,
  Building2,
  MessageCircle,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { changeAdminPassword, getLeadReminders } from '../../api';

const Header = ({ onMenuClick, theme, toggleTheme, onLogout, adminEmail }) => {
  const navigate = useNavigate();
  const adminName = adminEmail ? adminEmail.split('@')[0] : 'Admin';

  // Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Notification Bell & Reminders State
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [reminders, setReminders] = useState({ today: [], overdue: [], upcoming: [], all: [] });
  const [reminderCounts, setReminderCounts] = useState({ total: 0, urgent: 0, today: 0, overdue: 0, upcoming: 0 });
  const [loadingReminders, setLoadingReminders] = useState(false);
  const [reminderTab, setReminderTab] = useState('today');
  const notificationRef = useRef(null);

  // Close notification popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };
    if (isNotificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationOpen]);

  // Fetch CRM follow-up reminders
  const fetchReminders = async () => {
    try {
      setLoadingReminders(true);
      const res = await getLeadReminders();
      if (res && res.success && res.data) {
        setReminders(res.data);
        const urgent = res.urgentCount !== undefined ? res.urgentCount : ((res.todayCount || 0) + (res.overdueCount || 0));
        setReminderCounts({
          total: res.totalCount || 0,
          urgent,
          today: res.todayCount || 0,
          overdue: res.overdueCount || 0,
          upcoming: res.upcomingCount || 0,
        });

        // Set initial smart tab
        setReminderTab(prev => {
          if (prev === 'today' && (res.todayCount || 0) === 0 && (res.overdueCount || 0) > 0) {
            return 'overdue';
          }
          return prev;
        });
      }
    } catch (err) {
      console.error('Error fetching lead reminders:', err);
    } finally {
      setLoadingReminders(false);
    }
  };

  useEffect(() => {
    fetchReminders();
    // Poll every 45s for updates
    const interval = setInterval(fetchReminders, 45000);
    // Listen for instant mutations from CRM pages
    const handleLeadUpdate = () => fetchReminders();
    window.addEventListener('leadUpdated', handleLeadUpdate);
    return () => {
      clearInterval(interval);
      window.removeEventListener('leadUpdated', handleLeadUpdate);
    };
  }, []);

  // Format follow-up date and time
  const formatFollowUpTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isOverdue = date < now && !isToday;

    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStrFormatted = date.toLocaleDateString([], { month: 'short', day: 'numeric' });

    if (isToday) return `Today at ${timeStr}`;
    if (isOverdue) return `Overdue (${dateStrFormatted}, ${timeStr})`;
    return `${dateStrFormatted} at ${timeStr}`;
  };

  const activeReminderList = useMemo(() => {
    if (reminderTab === 'today') return reminders.today || [];
    if (reminderTab === 'overdue') return reminders.overdue || [];
    if (reminderTab === 'upcoming') return reminders.upcoming || [];
    return reminders.all || [];
  }, [reminderTab, reminders]);

  const handleOpenModal = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    setShowCurrentPw(false);
    setShowNewPw(false);
    setIsPasswordModalOpen(true);
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    let generated = '';
    for (let i = 0; i < 10; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(generated);
    setConfirmPassword(generated);
    setShowNewPw(true);
  };

  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await changeAdminPassword({
        currentPassword: currentPassword || undefined,
        newPassword: newPassword,
      });

      if (res && res.success) {
        if (res.token) {
          localStorage.setItem('adminToken', res.token);
        }
        setSuccess('Password changed successfully! All other active sessions and devices have been logged out.');
        setTimeout(() => {
          setIsPasswordModalOpen(false);
        }, 2000);
      } else {
        setError(res?.message || 'Failed to update password.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass border-b border-gray-200 dark:border-white/10 px-4 sm:px-6 py-3.5 flex items-center justify-between lg:justify-end backdrop-blur-md transition-colors duration-300">
        {/* Mobile Menu Button */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6 text-gray-500 dark:text-gray-400" />
        </button>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Notification Bell (CRM Follow-up Reminders) */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className={`relative p-2.5 rounded-xl border transition-all ${
                isNotificationOpen
                  ? 'bg-blue-50 dark:bg-white/10 border-blue-500/40 text-blue-600 dark:text-blue-400 shadow-inner'
                  : 'bg-black/5 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-black/10 dark:hover:bg-white/10'
              }`}
              title="CRM Follow-up Reminders & Alerts"
            >
              <Bell 
                size={18} 
                className={reminderCounts.urgent > 0 ? 'text-rose-500 dark:text-rose-400 animate-pulse' : ''} 
              />
              
              {/* Badge Counter */}
              {reminderCounts.total > 0 && (
                <span className={`absolute -top-1 -right-1 flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full text-[10px] font-black text-white shadow-md ${
                  reminderCounts.urgent > 0 ? 'bg-rose-500 shadow-rose-500/40' : 'bg-blue-500 shadow-blue-500/40'
                }`}>
                  {reminderCounts.urgent > 0 ? reminderCounts.urgent : reminderCounts.total}
                  {reminderCounts.urgent > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                  )}
                </span>
              )}
            </button>

            {/* Notification Popover Dropdown */}
            <AnimatePresence>
              {isNotificationOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-[340px] sm:w-[420px] max-w-[94vw] bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden z-50 flex flex-col"
                >
                  {/* Dropdown Header */}
                  <div className="p-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/80 dark:bg-white/[0.02] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <Bell size={16} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                          <span>CRM Follow-up Reminders</span>
                          {reminderCounts.urgent > 0 && (
                            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                              {reminderCounts.urgent} Due
                            </span>
                          )}
                        </h3>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                          Leads scheduled for follow-ups & updates
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={fetchReminders}
                      disabled={loadingReminders}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                      title="Refresh Reminders"
                    >
                      <RefreshCw size={14} className={loadingReminders ? 'animate-spin' : ''} />
                    </button>
                  </div>

                  {/* Tabs */}
                  <div className="px-3 pt-2.5 pb-2 border-b border-gray-100 dark:border-white/10 bg-white dark:bg-gray-900 flex items-center gap-1 overflow-x-auto text-xs font-bold">
                    <button
                      onClick={() => setReminderTab('today')}
                      className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                        reminderTab === 'today'
                          ? 'bg-blue-500 text-white shadow-sm shadow-blue-500/25'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                      }`}
                    >
                      <span>Today</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                        reminderTab === 'today' ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300'
                      }`}>
                        {reminderCounts.today}
                      </span>
                    </button>

                    <button
                      onClick={() => setReminderTab('overdue')}
                      className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                        reminderTab === 'overdue'
                          ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/25'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                      }`}
                    >
                      <span>Overdue</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                        reminderTab === 'overdue' ? 'bg-white/20 text-white' : 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
                      }`}>
                        {reminderCounts.overdue}
                      </span>
                    </button>

                    <button
                      onClick={() => setReminderTab('upcoming')}
                      className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                        reminderTab === 'upcoming'
                          ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/25'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                      }`}
                    >
                      <span>Upcoming</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                        reminderTab === 'upcoming' ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300'
                      }`}>
                        {reminderCounts.upcoming}
                      </span>
                    </button>

                    <button
                      onClick={() => setReminderTab('all')}
                      className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                        reminderTab === 'all'
                          ? 'bg-gray-800 dark:bg-white dark:text-gray-900 text-white shadow-sm'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                      }`}
                    >
                      <span>All</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                        reminderTab === 'all' ? 'bg-white/20 dark:bg-black/10' : 'bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300'
                      }`}>
                        {reminderCounts.total}
                      </span>
                    </button>
                  </div>

                  {/* Notification List */}
                  <div className="max-h-[380px] overflow-y-auto p-3 space-y-2.5 divide-y divide-gray-100 dark:divide-white/5">
                    {loadingReminders && activeReminderList.length === 0 ? (
                      <div className="py-8 flex flex-col items-center justify-center gap-2 text-gray-400 text-xs">
                        <Loader2 size={20} className="animate-spin text-blue-500" />
                        <span>Checking CRM follow-ups...</span>
                      </div>
                    ) : activeReminderList.length === 0 ? (
                      <div className="py-10 text-center space-y-2">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                          <CheckCircle2 size={20} />
                        </div>
                        <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                          No pending follow-ups
                        </p>
                        <p className="text-[11px] text-gray-400 max-w-[200px] mx-auto">
                          {reminderTab === 'today'
                            ? 'All caught up for today! No lead follow-ups due.'
                            : reminderTab === 'overdue'
                            ? 'Great job! Zero overdue follow-up tasks.'
                            : 'No leads scheduled in this category.'}
                        </p>
                      </div>
                    ) : (
                      activeReminderList.map((lead) => {
                        const isOverdue = lead.nextFollowUpDate && new Date(lead.nextFollowUpDate) < new Date() && new Date(lead.nextFollowUpDate).toDateString() !== new Date().toDateString();
                        const isToday = lead.nextFollowUpDate && new Date(lead.nextFollowUpDate).toDateString() === new Date().toDateString();

                        return (
                          <div
                            key={lead._id}
                            className="pt-2.5 first:pt-0 group hover:bg-gray-50/50 dark:hover:bg-white/[0.02] p-2 rounded-2xl transition-all"
                          >
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold text-xs text-gray-900 dark:text-white">
                                    {lead.name}
                                  </span>
                                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300">
                                    {lead.unicId || '—'}
                                  </span>
                                </div>
                                {lead.companyName && (
                                  <div className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                                    <Building2 size={11} />
                                    <span>{lead.companyName}</span>
                                  </div>
                                )}
                              </div>

                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isOverdue
                                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                                  : isToday
                                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                  : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                              }`}>
                                {isOverdue ? 'Overdue' : isToday ? 'Due Today' : 'Upcoming'}
                              </span>
                            </div>

                            {/* Kis ko lena hai follow up */}
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/40 px-2.5 py-1.5 rounded-xl border border-indigo-500/15 mb-2">
                              <UserCheck size={14} className="text-indigo-500 shrink-0" />
                              <span className="text-[11px] font-normal text-indigo-500 dark:text-indigo-400">Kis ko lena hai:</span>
                              <span className="font-bold truncate">
                                {lead.leadPersonName || lead.assignedStaffId?.name || 'Unassigned'}
                              </span>
                            </div>

                            {/* Time & Action Row */}
                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                              <div className="flex items-center gap-1.5">
                                <Clock size={12} className={isOverdue ? 'text-rose-500' : 'text-amber-500'} />
                                <span className={`text-[11px] ${isOverdue ? 'text-rose-600 dark:text-rose-400 font-bold' : isToday ? 'text-amber-600 dark:text-amber-400 font-semibold' : ''}`}>
                                  {formatFollowUpTime(lead.nextFollowUpDate)}
                                </span>
                                <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-[10px] font-bold text-gray-700 dark:text-gray-300">
                                  {lead.nextAction || 'Call'}
                                </span>
                              </div>

                              {/* Quick Actions */}
                              <div className="flex items-center gap-1">
                                {lead.phoneNumber && (
                                  <a
                                    href={`tel:${lead.phoneNumber}`}
                                    title={`Call ${lead.phoneNumber}`}
                                    className="p-1 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                                  >
                                    <Phone size={13} />
                                  </a>
                                )}
                                {lead.whatsappNumber && (
                                  <a
                                    href={`https://wa.me/${lead.whatsappNumber.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="WhatsApp Chat"
                                    className="p-1 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                                  >
                                    <MessageCircle size={13} />
                                  </a>
                                )}
                                <button
                                  onClick={() => {
                                    setIsNotificationOpen(false);
                                    navigate(`/company-leads?search=${encodeURIComponent(lead.unicId || lead.name)}`);
                                  }}
                                  className="px-2 py-0.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center gap-0.5 transition-all"
                                >
                                  <span>Open</span>
                                  <ArrowRight size={10} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Dropdown Footer */}
                  <div className="p-3 border-t border-gray-100 dark:border-white/10 bg-gray-50/70 dark:bg-white/[0.02]">
                    <button
                      onClick={() => {
                        setIsNotificationOpen(false);
                        navigate('/company-leads');
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Open Company Leads CRM & Pipeline</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Change Password Button */}
          <button 
            onClick={handleOpenModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/30 text-xs font-bold transition-all shadow-sm"
            title="Change Admin Password (Logs out other devices)"
          >
            <KeyRound size={16} className="text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Change Password</span>
          </button>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Logout Button */}
          {onLogout && (
            <button 
              onClick={onLogout}
              className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 dark:hover:bg-rose-500/10 transition-all"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          )}

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-3 sm:pl-5 border-l border-gray-200 dark:border-white/10">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900 dark:text-white capitalize">{adminName}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-500">{adminEmail || 'Administrator'}</p>
            </div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-0.5"
            >
              <div className="w-full h-full rounded-full bg-white dark:bg-[#030303] flex items-center justify-center overflow-hidden border border-white/10">
                <User className="w-6 h-6 text-gray-400" />
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* CHANGE PASSWORD MODAL */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#121212] rounded-3xl max-w-md w-full border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden my-8"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <KeyRound size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Change Admin Password</h2>
                    <p className="text-xs text-gray-500">Update login password for {adminEmail}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmitPasswordChange} className="p-6 space-y-5">
                {/* Security Warning Notice */}
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2.5">
                  <AlertTriangle size={18} className="shrink-0 text-amber-600 mt-0.5" />
                  <span>
                    <strong>Security Notice:</strong> Changing this password will immediately revoke all active sessions and <strong>log out all other devices</strong>.
                  </span>
                </div>

                {/* Alerts */}
                {error && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-600 font-semibold flex items-center gap-2">
                    <AlertTriangle size={16} />
                    <span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-600 font-semibold flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>{success}</span>
                  </div>
                )}

                {/* Current Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type={showCurrentPw ? 'text' : 'password'}
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPw(!showCurrentPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">New Password <span className="text-rose-500">*</span></label>
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="text-xs text-blue-600 font-bold hover:underline"
                    >
                      + Generate Strong
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type={showNewPw ? 'text' : 'password'}
                      required
                      placeholder="Minimum 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPw(!showNewPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Confirm New Password <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type={showNewPw ? 'text' : 'password'}
                      required
                      placeholder="Re-type new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all flex items-center gap-2"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                    Update & Logout Others
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
