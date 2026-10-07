import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Calendar,
  IndianRupee,
  Users,
  Award,
  Trash2,
  Edit2,
  AlertCircle,
  Plus,
  Minus,
  Check,
  Clock,
  User,
  PlusCircle,
  FileText,
  TrendingUp,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
  X,
  Building,
  Sparkles,
  ChevronRight,
  HelpCircle,
  GraduationCap,
  Gift,
  Mail,
  Phone,
  ExternalLink,
  FileCheck,
  UserCheck
} from 'lucide-react';
import { getHearings, addHearing, updateHearing, deleteHearing, updateApplicationStatus, deleteApplication } from '../api';

const HearingManagement = () => {
  const [hearings, setHearings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // all, active, inactive, applications
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [viewDetailsHearing, setViewDetailsHearing] = useState(null);
  const [applicationsModalHearing, setApplicationsModalHearing] = useState(null);
  const [appStatusUpdating, setAppStatusUpdating] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    post: '',
    overview: '',
    description: '',
    lastDate: '',
    salary: '',
    vacancy: '',
    experience: '',
    gender: 'both',
    status: 'active'
  });

  // Dynamic list states
  const [responsibilities, setResponsibilities] = useState(['']);
  const [qualifications, setQualifications] = useState(['']);
  const [offers, setOffers] = useState(['']);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3500);
  };

  // Fetch Hearings
  const fetchHearings = async () => {
    setLoading(true);
    try {
      const result = await getHearings();
      if (result && result.success) {
        setHearings(result.data || []);
      } else {
        showToast(result?.message || 'Failed to fetch job postings', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Could not load job postings from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHearings();
  }, []);

  // Open Create Modal
  const openCreateModal = () => {
    resetForm();
    setIsEditing(false);
    setEditId(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const startEdit = (hearing) => {
    setIsEditing(true);
    setEditId(hearing._id);

    let formattedDate = '';
    if (hearing.lastDate) {
      formattedDate = new Date(hearing.lastDate).toISOString().split('T')[0];
    }

    setFormData({
      post: hearing.post || '',
      overview: hearing.overview || '',
      description: hearing.description || '',
      lastDate: formattedDate,
      salary: hearing.salary || '',
      vacancy: hearing.vacancy || '',
      experience: hearing.experience || '',
      gender: hearing.gender || 'both',
      status: hearing.status || 'active'
    });

    setResponsibilities(hearing.keyResponsibilities?.length ? [...hearing.keyResponsibilities] : ['']);
    setQualifications(hearing.qulification?.length ? [...hearing.qulification] : ['']);
    setOffers(hearing.whatWeOffer?.length ? [...hearing.whatWeOffer] : ['']);

    setIsModalOpen(true);
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
      post: '',
      overview: '',
      description: '',
      lastDate: '',
      salary: '',
      vacancy: '',
      experience: '',
      gender: 'both',
      status: 'active'
    });
    setResponsibilities(['']);
    setQualifications(['']);
    setOffers(['']);
    setIsEditing(false);
    setEditId(null);
  };

  // Dynamic List Handlers
  const handleDynamicChange = (index, value, setter, list) => {
    const updated = [...list];
    updated[index] = value;
    setter(updated);
  };

  const addDynamicField = (setter, list) => {
    setter([...list, '']);
  };

  const removeDynamicField = (index, setter, list) => {
    if (list.length === 1) {
      setter(['']);
    } else {
      const updated = list.filter((_, i) => i !== index);
      setter(updated);
    }
  };

  // Form Submit (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    const cleanResponsibilities = responsibilities.filter(item => item.trim() !== '');
    const cleanQualifications = qualifications.filter(item => item.trim() !== '');
    const cleanOffers = offers.filter(item => item.trim() !== '');

    const requestBody = {
      ...formData,
      keyResponsibilities: cleanResponsibilities,
      qulification: cleanQualifications, // Spelled according to backend schema: qulification
      whatWeOffer: cleanOffers
    };

    try {
      let result;
      if (isEditing) {
        result = await updateHearing(editId, requestBody);
      } else {
        result = await addHearing(requestBody);
      }

      if (result && result.success) {
        showToast(isEditing ? 'Job opening updated successfully!' : 'New job opening posted successfully!');
        setIsModalOpen(false);
        resetForm();
        fetchHearings();
      } else {
        showToast(result?.message || 'Failed to save job opening', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error saving job opening', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Hearing
  const handleDelete = async (id, postTitle) => {
    if (!window.confirm(`Are you sure you want to delete the hiring post for "${postTitle || 'this job'}"?`)) return;

    setActionLoading(true);
    try {
      const result = await deleteHearing(id);
      if (result && result.success) {
        showToast('Job opening deleted successfully!');
        fetchHearings();
        if (viewDetailsHearing?._id === id) setViewDetailsHearing(null);
      } else {
        showToast(result?.message || 'Failed to delete job opening', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error connecting to server', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle Status (Active / Inactive)
  const handleToggleStatus = async (hearing) => {
    const newStatus = hearing.status === 'active' ? 'inactive' : 'active';
    try {
      const result = await updateHearing(hearing._id, { status: newStatus });
      if (result && result.success) {
        showToast(`Job post marked as ${newStatus}!`);
        setHearings(prev => prev.map(h => h._id === hearing._id ? { ...h, status: newStatus } : h));
        if (viewDetailsHearing?._id === hearing._id) {
          setViewDetailsHearing(prev => ({ ...prev, status: newStatus }));
        }
      } else {
        showToast(result?.message || 'Failed to update status', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Server connection error', 'error');
    }
  };

  // Applicant status updater
  const handleUpdateApplicantStatus = async (hearingId, appId, newStatus) => {
    setAppStatusUpdating(appId);
    try {
      const result = await updateApplicationStatus(hearingId, appId, newStatus);
      if (result && result.success) {
        showToast(`Applicant marked as ${newStatus}!`);
        // Update local state
        setHearings(prev => prev.map(h => {
          if (h._id === hearingId) {
            const updatedApps = (h.applications || []).map(a => a._id === appId ? { ...a, status: newStatus } : a);
            const updatedH = { ...h, applications: updatedApps };
            if (applicationsModalHearing?._id === hearingId) {
              setApplicationsModalHearing(updatedH);
            }
            return updatedH;
          }
          return h;
        }));
      } else {
        showToast(result?.message || 'Failed to update applicant status', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error updating applicant status', 'error');
    } finally {
      setAppStatusUpdating(null);
    }
  };

  // Delete applicant
  const handleDeleteApplicant = async (hearingId, appId, applicantName) => {
    if (!window.confirm(`Are you sure you want to delete application of "${applicantName || 'this candidate'}"?`)) return;

    try {
      const result = await deleteApplication(hearingId, appId);
      if (result && result.success) {
        showToast('Application deleted successfully');
        setHearings(prev => prev.map(h => {
          if (h._id === hearingId) {
            const updatedApps = (h.applications || []).filter(a => a._id !== appId);
            const updatedH = { ...h, applications: updatedApps };
            if (applicationsModalHearing?._id === hearingId) {
              setApplicationsModalHearing(updatedH);
            }
            return updatedH;
          }
          return h;
        }));
      } else {
        showToast(result?.message || 'Failed to delete application', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error deleting application', 'error');
    }
  };

  // Filter & Search Logic
  const filteredHearings = useMemo(() => {
    return hearings.filter(h => {
      const matchesFilter = activeFilter === 'all' ? true : h.status === activeFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        (h.post || '').toLowerCase().includes(q) ||
        (h.overview || '').toLowerCase().includes(q) ||
        (h.experience || '').toLowerCase().includes(q) ||
        (h.salary || '').toLowerCase().includes(q) ||
        (h.applications || []).some(a => 
          (a.name || '').toLowerCase().includes(q) ||
          (a.email || '').toLowerCase().includes(q) ||
          (a.phone || '').toLowerCase().includes(q)
        );
      return matchesFilter && matchesSearch;
    });
  }, [hearings, activeFilter, searchQuery]);

  // Quick stats
  const stats = useMemo(() => {
    const total = hearings.length;
    const active = hearings.filter(h => h.status === 'active').length;
    const inactive = hearings.filter(h => h.status === 'inactive').length;
    const totalVacancies = hearings.reduce((acc, h) => {
      const count = parseInt(h.vacancy) || 1;
      return acc + count;
    }, 0);
    const totalApplications = hearings.reduce((acc, h) => acc + (h.applications?.length || 0), 0);
    return { total, active, inactive, totalVacancies, totalApplications };
  }, [hearings]);

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-[120] px-5 py-3 rounded-2xl shadow-xl border flex items-center gap-3 text-sm font-bold ${
              toast.type === 'error'
                ? 'bg-rose-500/90 text-white border-rose-600 backdrop-blur-md'
                : 'bg-emerald-600/90 text-white border-emerald-700 backdrop-blur-md'
            }`}
          >
            {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/25">
            <Briefcase size={26} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
              Hiring & Candidate Applications
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Manage job postings, requirements, and review applications received from candidates
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={fetchHearings}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-purple-500/25 hover:scale-[1.02] active:scale-100 transition-all"
          >
            <Plus size={18} />
            <span>Post New Job Opening</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { icon: Briefcase, label: 'Job Postings', value: stats.total, color: 'from-purple-500 to-indigo-500' },
          { icon: CheckCircle2, label: 'Active Openings', value: stats.active, color: 'from-emerald-500 to-teal-500' },
          { icon: XCircle, label: 'Inactive / Closed', value: stats.inactive, color: 'from-gray-500 to-slate-600' },
          { icon: Users, label: 'Vacancies', value: stats.totalVacancies, color: 'from-blue-500 to-cyan-500' },
          { icon: UserCheck, label: 'Total Applications', value: stats.totalApplications, color: 'from-amber-500 to-orange-500' }
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/10 p-4 sm:p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 text-white shadow-md`}>
              <Icon size={20} />
            </div>
            <div className="text-2xl font-black text-gray-900 dark:text-white">{value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">{label}</div>
          </div>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/10 p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by job title, skills, experience, or salary..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
          {[
            { id: 'all', label: `All (${stats.total})` },
            { id: 'active', label: `Active (${stats.active})` },
            { id: 'inactive', label: `Inactive (${stats.inactive})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeFilter === tab.id
                  ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading hiring posts...</p>
        </div>
      ) : filteredHearings.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-white/10 p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center mx-auto">
            <Briefcase size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No job openings found</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-1">
              {searchQuery || activeFilter !== 'all'
                ? 'Try adjusting your search query or status filter.'
                : 'No job openings have been posted yet. Create your first vacancy post now!'}
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-lg shadow-purple-500/20 hover:bg-purple-700 transition-all inline-flex items-center gap-1.5"
          >
            <Plus size={16} />
            Post First Job Opening
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredHearings.map((hearing) => (
            <motion.div
              key={hearing._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-white/10 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Top Row: Post Title & Status Badge */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {hearing.post}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400 font-medium">
                      <span>{hearing.experience || 'Experience: Any'}</span>
                      <span>•</span>
                      <span>{hearing.gender === 'male' ? '👨 Male Only' : hearing.gender === 'female' ? '👩 Female Only' : '👥 Both Male / Female'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleStatus(hearing)}
                    title={`Click to switch to ${hearing.status === 'active' ? 'inactive' : 'active'}`}
                    className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border transition-all ${
                      hearing.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                        : 'bg-gray-500/10 text-gray-500 dark:text-gray-400 border-gray-500/20 hover:bg-gray-500/20'
                    }`}
                  >
                    {hearing.status === 'active' ? '🟢 Active' : '⚪ Inactive'}
                  </button>
                </div>

                {/* Overview Text */}
                {hearing.overview && (
                  <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
                    {hearing.overview}
                  </p>
                )}

                {/* Badges Grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-gray-50 dark:bg-white/5 p-2.5 rounded-xl border border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-1.5 text-gray-400 text-[10px] uppercase font-bold">
                      <IndianRupee size={12} className="text-emerald-500" />
                      <span>Salary Range</span>
                    </div>
                    <p className="text-xs font-extrabold text-gray-900 dark:text-white mt-0.5 truncate">
                      {hearing.salary || 'Negotiable'}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-white/5 p-2.5 rounded-xl border border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-1.5 text-gray-400 text-[10px] uppercase font-bold">
                      <Users size={12} className="text-blue-500" />
                      <span>Vacancies</span>
                    </div>
                    <p className="text-xs font-extrabold text-gray-900 dark:text-white mt-0.5 truncate">
                      {hearing.vacancy ? `${hearing.vacancy} Seats` : '1 Seat'}
                    </p>
                  </div>
                </div>

                {/* Last Date to Apply */}
                {hearing.lastDate && (
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 font-semibold mb-3 bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-200/40">
                    <Clock size={14} />
                    <span>Apply before: {new Date(hearing.lastDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                )}

                {/* Candidate Applications Button */}
                <button
                  onClick={() => setApplicationsModalHearing(hearing)}
                  className={`w-full mb-2 flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    (hearing.applications?.length || 0) > 0
                      ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/20 shadow-sm'
                      : 'bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <UserCheck size={15} className="text-purple-600 dark:text-purple-400" />
                    <span>Candidate Applications</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    (hearing.applications?.length || 0) > 0
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}>
                    {hearing.applications?.length || 0} Applied
                  </span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between gap-2">
                <button
                  onClick={() => setViewDetailsHearing(hearing)}
                  className="flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
                >
                  <Eye size={14} />
                  <span>View Details</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => startEdit(hearing)}
                    className="p-2 rounded-xl text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-colors"
                    title="Edit Job Post"
                  >
                    <Edit2 size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(hearing._id, hearing.post)}
                    className="p-2 rounded-xl text-gray-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                    title="Delete Job Post"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Post / Edit Job Opening Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-3xl bg-white dark:bg-[#0c0c0e] rounded-3xl border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[92vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white">
                      {isEditing ? 'Edit Job Opening Post' : 'Create New Hiring Post'}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Fill out the job vacancy details, requirements, and benefits
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Primary Information */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                    <FileText size={14} /> 1. Job Role & Overview
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                        Job Post Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.post}
                        onChange={(e) => setFormData({ ...formData, post: e.target.value })}
                        placeholder="e.g. Senior Full Stack Web Developer / Digital Marketing Executive"
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                        Number of Vacancies
                      </label>
                      <input
                        type="text"
                        value={formData.vacancy}
                        onChange={(e) => setFormData({ ...formData, vacancy: e.target.value })}
                        placeholder="e.g. 03 Seats"
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                        Salary / Compensation Range
                      </label>
                      <input
                        type="text"
                        value={formData.salary}
                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                        placeholder="e.g. ₹25,000 - ₹45,000 / month"
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                        Experience Required
                      </label>
                      <input
                        type="text"
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        placeholder="e.g. 1 - 3 Years / Freshers Welcome"
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                        Last Date to Apply
                      </label>
                      <input
                        type="date"
                        value={formData.lastDate}
                        onChange={(e) => setFormData({ ...formData, lastDate: e.target.value })}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                        Gender Preference
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                      >
                        <option value="both" className="dark:bg-gray-900">Both Male & Female</option>
                        <option value="male" className="dark:bg-gray-900">Male Only</option>
                        <option value="female" className="dark:bg-gray-900">Female Only</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                        Posting Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                      >
                        <option value="active" className="dark:bg-gray-900">Active (Visible on Careers Page)</option>
                        <option value="inactive" className="dark:bg-gray-900">Inactive (Hidden / Closed)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                        Job Overview / Short Summary
                      </label>
                      <textarea
                        rows={2}
                        value={formData.overview}
                        onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                        placeholder="Brief summary of the role to be shown on the careers preview card..."
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                        Complete Role Description
                      </label>
                      <textarea
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Comprehensive details about the department, team mission, and expectations..."
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Key Responsibilities Builder */}
                <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Award size={14} /> 2. Key Responsibilities ({responsibilities.filter(r => r.trim()).length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => addDynamicField(setResponsibilities, responsibilities)}
                      className="text-xs font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400 inline-flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Point
                    </button>
                  </div>

                  <div className="space-y-2">
                    {responsibilities.map((resp, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 w-5 text-right">{index + 1}.</span>
                        <input
                          type="text"
                          value={resp}
                          onChange={(e) => handleDynamicChange(index, e.target.value, setResponsibilities, responsibilities)}
                          placeholder="e.g. Build reusable front-end modules and optimize UI rendering speed"
                          className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeDynamicField(index, setResponsibilities, responsibilities)}
                          className="p-2 text-gray-400 hover:text-rose-500 rounded-lg"
                        >
                          <Minus size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Qualifications & Skills Builder */}
                <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                      <GraduationCap size={14} /> 3. Qualifications & Skills ({qualifications.filter(q => q.trim()).length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => addDynamicField(setQualifications, qualifications)}
                      className="text-xs font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400 inline-flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Requirement
                    </button>
                  </div>

                  <div className="space-y-2">
                    {qualifications.map((qual, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 w-5 text-right">{index + 1}.</span>
                        <input
                          type="text"
                          value={qual}
                          onChange={(e) => handleDynamicChange(index, e.target.value, setQualifications, qualifications)}
                          placeholder="e.g. Bachelor's in Computer Science or 2+ years of hands-on React/Node experience"
                          className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeDynamicField(index, setQualifications, qualifications)}
                          className="p-2 text-gray-400 hover:text-rose-500 rounded-lg"
                        >
                          <Minus size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What We Offer / Perks Builder */}
                <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Gift size={14} /> 4. What We Offer / Benefits ({offers.filter(o => o.trim()).length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => addDynamicField(setOffers, offers)}
                      className="text-xs font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400 inline-flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Perk
                    </button>
                  </div>

                  <div className="space-y-2">
                    {offers.map((offer, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 w-5 text-right">{index + 1}.</span>
                        <input
                          type="text"
                          value={offer}
                          onChange={(e) => handleDynamicChange(index, e.target.value, setOffers, offers)}
                          placeholder="e.g. Performance bonus, paid casual leaves, rapid career growth path"
                          className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeDynamicField(index, setOffers, offers)}
                          className="p-2 text-gray-400 hover:text-rose-500 rounded-lg"
                        >
                          <Minus size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="pt-6 border-t border-gray-100 dark:border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {actionLoading && <RefreshCw size={16} className="animate-spin" />}
                    <span>{isEditing ? 'Update Job Post' : 'Publish Job Opening'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Job Details Modal */}
      <AnimatePresence>
        {viewDetailsHearing && (
          <div className="fixed inset-0 z-[115] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewDetailsHearing(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-white dark:bg-[#0c0c0e] rounded-3xl border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] space-y-5"
            >
              <div className="flex items-start justify-between border-b border-gray-100 dark:border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      viewDetailsHearing.status === 'active'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : 'bg-gray-500/15 text-gray-500 dark:text-gray-400 border-gray-500/20'
                    }`}>
                      {viewDetailsHearing.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      Posted on: {new Date(viewDetailsHearing.created_at || Date.now()).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white">
                    {viewDetailsHearing.post}
                  </h2>
                </div>
                <button
                  onClick={() => setViewDetailsHearing(null)}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Badges strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Salary</p>
                  <p className="text-xs font-black text-gray-900 dark:text-white mt-0.5">{viewDetailsHearing.salary || 'Negotiable'}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Vacancies</p>
                  <p className="text-xs font-black text-gray-900 dark:text-white mt-0.5">{viewDetailsHearing.vacancy || '1'}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Experience</p>
                  <p className="text-xs font-black text-gray-900 dark:text-white mt-0.5">{viewDetailsHearing.experience || 'Any'}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Gender</p>
                  <p className="text-xs font-black text-gray-900 dark:text-white mt-0.5 capitalize">{viewDetailsHearing.gender || 'both'}</p>
                </div>
              </div>

              {viewDetailsHearing.overview && (
                <div>
                  <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider mb-1.5">Overview</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-white/5 p-3 rounded-xl">
                    {viewDetailsHearing.overview}
                  </p>
                </div>
              )}

              {viewDetailsHearing.description && (
                <div>
                  <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider mb-1.5">Full Description</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-white/5 p-3 rounded-xl whitespace-pre-line">
                    {viewDetailsHearing.description}
                  </p>
                </div>
              )}

              {viewDetailsHearing.keyResponsibilities?.length > 0 && (
                <div>
                  <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider mb-2">Key Responsibilities</h4>
                  <ul className="space-y-1.5">
                    {viewDetailsHearing.keyResponsibilities.map((resp, i) => (
                      <li key={i} className="text-xs text-gray-600 dark:text-gray-300 flex items-start gap-2">
                        <Check size={14} className="text-purple-500 mt-0.5 shrink-0" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {viewDetailsHearing.qulification?.length > 0 && (
                <div>
                  <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider mb-2">Qualifications & Skills</h4>
                  <ul className="space-y-1.5">
                    {viewDetailsHearing.qulification.map((qual, i) => (
                      <li key={i} className="text-xs text-gray-600 dark:text-gray-300 flex items-start gap-2">
                        <GraduationCap size={14} className="text-indigo-500 mt-0.5 shrink-0" />
                        <span>{qual}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {viewDetailsHearing.whatWeOffer?.length > 0 && (
                <div>
                  <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider mb-2">What We Offer</h4>
                  <ul className="space-y-1.5">
                    {viewDetailsHearing.whatWeOffer.map((offer, i) => (
                      <li key={i} className="text-xs text-gray-600 dark:text-gray-300 flex items-start gap-2">
                        <Gift size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                        <span>{offer}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    const h = viewDetailsHearing;
                    setViewDetailsHearing(null);
                    startEdit(h);
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md"
                >
                  Edit This Post
                </button>
                <button
                  onClick={() => setViewDetailsHearing(null)}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 font-bold text-xs"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Candidate Applications Modal */}
      <AnimatePresence>
        {applicationsModalHearing && (
          <div className="fixed inset-0 z-[115] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setApplicationsModalHearing(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-white dark:bg-[#0c0c0e] rounded-3xl border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[92vh] z-10"
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-gray-100 dark:border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                    <UserCheck size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                      <span>Candidate Applications</span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                        {applicationsModalHearing.applications?.length || 0} Total
                      </span>
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
                      Applied for: <span className="font-bold text-gray-800 dark:text-gray-200">{applicationsModalHearing.post}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setApplicationsModalHearing(null)}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-gray-500 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Status summary pills */}
              {applicationsModalHearing.applications?.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
                  {[
                    {
                      label: 'Pending Review',
                      count: applicationsModalHearing.applications.filter(a => (a.status || 'Pending') === 'Pending').length,
                      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                    },
                    {
                      label: 'Shortlisted',
                      count: applicationsModalHearing.applications.filter(a => a.status === 'Shortlisted').length,
                      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                    },
                    {
                      label: 'Interviewed',
                      count: applicationsModalHearing.applications.filter(a => a.status === 'Interviewed').length,
                      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
                    },
                    {
                      label: 'Hired',
                      count: applicationsModalHearing.applications.filter(a => a.status === 'Hired').length,
                      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    }
                  ].map((stat, i) => (
                    <div key={i} className={`p-3 rounded-2xl border ${stat.color} flex items-center justify-between`}>
                      <span className="text-xs font-bold">{stat.label}</span>
                      <span className="text-sm font-black">{stat.count}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Applications List */}
              {(!applicationsModalHearing.applications || applicationsModalHearing.applications.length === 0) ? (
                <div className="py-14 text-center flex flex-col items-center justify-center space-y-3">
                  <div className="w-16 h-16 rounded-3xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center shadow-inner">
                    <Users size={32} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">No applications yet</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm">
                    When candidates apply for this position from the Careers website page, their details, resume, and contact information will automatically show up here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applicationsModalHearing.applications.map((applicant, index) => {
                    const statusColors = {
                      Pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
                      Reviewing: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
                      Shortlisted: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
                      Interviewed: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
                      Hired: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
                      Rejected: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                    };

                    const currentStatus = applicant.status || 'Pending';

                    return (
                      <div
                        key={applicant._id || index}
                        className="bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl p-5 hover:border-purple-300 dark:hover:border-purple-500/30 transition-all space-y-4"
                      >
                        {/* Top: Candidate Name, Applied Time, and Status */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200/60 dark:border-white/5 pb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                              {applicant.name?.charAt(0)?.toUpperCase() || 'C'}
                            </div>
                            <div>
                              <h4 className="text-base font-bold text-gray-900 dark:text-white leading-snug">
                                {applicant.name}
                              </h4>
                              <p className="text-[11px] text-gray-400 font-medium">
                                Applied on {applicant.appliedAt ? new Date(applicant.appliedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Recently'}
                              </p>
                            </div>
                          </div>

                          {/* Status Badge & Dropdown */}
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${statusColors[currentStatus] || statusColors.Pending}`}>
                              ● {currentStatus}
                            </span>

                            <select
                              disabled={appStatusUpdating === applicant._id}
                              value={currentStatus}
                              onChange={(e) => handleUpdateApplicantStatus(applicationsModalHearing._id, applicant._id, e.target.value)}
                              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-xs font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Reviewing">Reviewing</option>
                              <option value="Shortlisted">Shortlisted</option>
                              <option value="Interviewed">Interviewed</option>
                              <option value="Hired">Hired</option>
                              <option value="Rejected">Rejected</option>
                            </select>

                            <button
                              onClick={() => handleDeleteApplicant(applicationsModalHearing._id, applicant._id, applicant.name)}
                              className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                              title="Delete application"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Middle: Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                          {applicant.email && (
                            <a
                              href={`mailto:${applicant.email}`}
                              className="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200/70 dark:border-white/5 flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-purple-600 transition-colors group"
                            >
                              <Mail size={15} className="text-purple-500 group-hover:scale-110 transition-transform shrink-0" />
                              <span className="truncate">{applicant.email}</span>
                            </a>
                          )}

                          {applicant.phone && (
                            <a
                              href={`tel:${applicant.phone}`}
                              className="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200/70 dark:border-white/5 flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-emerald-600 transition-colors group"
                            >
                              <Phone size={15} className="text-emerald-500 group-hover:scale-110 transition-transform shrink-0" />
                              <span className="truncate">{applicant.phone}</span>
                            </a>
                          )}

                          {applicant.experience && (
                            <div className="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200/70 dark:border-white/5 flex items-center gap-2 text-gray-700 dark:text-gray-200">
                              <Award size={15} className="text-blue-500 shrink-0" />
                              <span className="truncate">Exp: <strong>{applicant.experience}</strong></span>
                            </div>
                          )}

                          {applicant.linkedin && (
                            <a
                              href={applicant.linkedin.startsWith('http') ? applicant.linkedin : `https://${applicant.linkedin}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200/70 dark:border-white/5 flex items-center justify-between text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors group"
                            >
                              <span className="truncate">LinkedIn Profile</span>
                              <ExternalLink size={13} className="shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </a>
                          )}

                          {applicant.resume && (
                            <a
                              href={applicant.resume.startsWith('http') ? applicant.resume : `https://${applicant.resume}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 flex items-center justify-between text-purple-700 dark:text-purple-300 font-bold hover:bg-purple-100 transition-colors group"
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <FileCheck size={15} className="text-purple-600 shrink-0" />
                                <span className="truncate">View CV / Resume</span>
                              </div>
                              <ExternalLink size={13} className="shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </a>
                          )}
                        </div>

                        {/* Cover Note / Message */}
                        {applicant.notes && (
                          <div className="bg-white dark:bg-white/5 p-3.5 rounded-xl border border-gray-200/70 dark:border-white/5">
                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">
                              Cover Note / Candidate Message
                            </p>
                            <p className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed italic">
                              "{applicant.notes}"
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Modal Footer */}
              <div className="pt-6 mt-6 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  Showing {applicationsModalHearing.applications?.length || 0} applications
                </p>
                <button
                  onClick={() => setApplicationsModalHearing(null)}
                  className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-200 dark:hover:bg-white/20 transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HearingManagement;
