import { useState, useMemo, useEffect, useCallback } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Briefcase,
  Calendar,
  IndianRupee,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ArrowLeft,
  Tag,
  Building2,
  AlertCircle,
  Plus,
  FolderPlus,
  ListChecks,
  Check,
  TrendingUp,
  Minus,
  Sparkles,
  Trash2,
  X,
  Circle,
  RefreshCw,
  CreditCard,
  Download,
  ChevronDown,
  Edit3,
  User
} from 'lucide-react';

// Helper to parse work detail into tasks for UI fallback
const parseWorkDetailToTasks = (workDetail) => {
  if (!workDetail) return [];

  const tasks = [];
  const lines = workDetail.split(/[\n•]+/).map(line => line.trim()).filter(line => line.length > 0);

  lines.forEach(line => {
    // Logic mirror from backend for consistency
    const postingMatch = line.match(/Total Posting\s+(\d+)\s*\(\s*(\d+)\s*Reel\s*&\s*(\d+)\s*Post\s*\)/i);
    if (postingMatch) {
      tasks.push({ name: 'Reel Posting', total: parseInt(postingMatch[2]), completed: 0, status: 'Pending', unit: 'Reels' });
      tasks.push({ name: 'Static Post Posting', total: parseInt(postingMatch[3]), completed: 0, status: 'Pending', unit: 'Posts' });
      return;
    }

    const shootMatch = line.match(/(\d+)\+?\s*Professional\s*shoot/i);
    if (shootMatch) {
      tasks.push({ name: 'Professional Shoots', total: parseInt(shootMatch[1]), completed: 0, status: 'Pending', unit: 'Shoots' });
      return;
    }

    const complexPostingMatch = line.match(/Posting\s+Per\s+Month\s+[\d\-\s]+\(\s*(\d+)[\d\s-]*Reels?\s*&\s*(\d+)[\d\s-]*Posts?\s*\)/i);
    if (complexPostingMatch) {
      tasks.push({ name: 'Reel Posting', total: parseInt(complexPostingMatch[1]), completed: 0, status: 'Pending', unit: 'Reels' });
      tasks.push({ name: 'Static Post Posting', total: parseInt(complexPostingMatch[2]), completed: 0, status: 'Pending', unit: 'Posts' });
      return;
    }

    const viewsMatch = line.match(/Views\s+(\d+k?\+?)/i);
    if (viewsMatch) {
      tasks.push({ name: 'Target Views', total: 1, completed: 0, status: 'Pending', unit: viewsMatch[1] });
      return;
    }

    tasks.push({ name: line, total: 1, completed: 0, status: 'Pending', unit: 'Task' });
  });

  return tasks;
};

const calculateProjectProgress = (project) => {
  const primaryTasks = project.tasks || [];
  const extraTasks = project.extraTasks || [];
  if (primaryTasks.length === 0 && extraTasks.length === 0) return 0;
  const primaryTotal = primaryTasks.reduce((acc, t) => acc + t.total, 0) || 1;
  const totalCompleted = [...primaryTasks, ...extraTasks].reduce((acc, t) => acc + t.completed, 0);
  return Math.round((totalCompleted / primaryTotal) * 100);
};

const CLIENT_DEPARTMENTS = ['SEO', 'SMM', 'PPC', 'Graphic Design', 'Video Editing', 'WEB DEvlopment', 'Email Marketing', 'Ai Marketing'];
const PACKAGE_ENABLED_DEPARTMENTS = CLIENT_DEPARTMENTS;
const PROJECT_STATUS_OPTIONS = ['Pending', 'In Progress', 'On Hold', 'Completed'];

const PACKAGE_DETAILS = {
  'Bronze Package Service': {
    fee: 10000,
    gst: 18,
    details: '• Account management - Instagram\n• Hashtag Research\n• Content Strategy Creation\n• Page Creation\n• Cover and Profile pic Creation\n• Page Optimization\n• Total Posting 8 ( 4 Reel & 4 Post )\n• Page Monitoring\n• Call To Action Button Creation\n• 1 Professional shoot\n• Views 10k +'
  },
  'Sliver Package Service': {
    fee: 15000,
    gst: 18,
    details: '• Setting Goals\n• Account Management – 2 (Facebook , Instagram )\n• Hashtag Research\n• Content Strategy Creation\n• Page Creation\n• Facebook Cover And Profile Picture Creation\n• Page Optimization\n• Posting Per Month 14 - 16 ( 8 - 10 Reels & 6 Post )\n• Facebook Story Creation\n• Video Posting(Provided By Client)\n• Page Monitoring\n• Responding To Comments\n• 1 Month GMB Free (Google My Business)\n• 3 Professional shoot\n• Views 20k +'
  },
  'Platinum Package Service': {
    fee: 25000,
    gst: 18,
    details: '• Setting Goals\n• Account Management – 3 (Facebook , Instagram & Youtube )\n• Hashtag Research\n• Content Strategy Creation\n• Page Creation\n• Facebook Cover And Profile Picture Creation\n• Page Optimization\n• Posting Per Month 20 - 23 ( 12 - 15 Reels & 8 Post )\n• Facebook Story Creation\n• Video Posting(Provided By Client)\n• Page Monitoring\n• Responding To Comments\n• 2 Month GMB Free (Google My Business)\n• 5 Professional shoot\n• Views 25k +'
  },
  'Gold Package Service': {
    fee: 35000,
    gst: 18,
    details: '• Setting Goals\n• Account Management – 3 (Facebook , Instagram & Youtube )\n• Hashtag Research\n• Content Strategy Creation\n• Page Creation\n• Facebook Cover And Profile Picture Creation\n• Page Optimization\n• Posting Per Month 24 - 30 ( 16 - 20 Reels & 10 Post )\n• Facebook Story Creation\n• Video Posting(Provided By Client)\n• Page Monitoring\n• Responding To Comments\n• GMB Life Time Free (Google My Business)\n• 10+ Professional shoot\n• Views 50k +'
  }
};

const normalizePhoneDigits = (phoneValue = '') => {
  let digits = phoneValue.replace(/[^\d]/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  }
  return digits.slice(0, 10);
};

const EditClientModal = ({ isOpen, onClose, client, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (client && isOpen) {
      setFormData({
        name: client.name || '',
        email: client.email || '',
        phone: normalizePhoneDigits(client.phone || '')
      });
    }
  }, [client, isOpen]);

  if (!isOpen || !client) return null;

  const handleSubmit = () => {
    const cleanPhone = normalizePhoneDigits(formData.phone);
    const phonePattern = /^[6-9]\d{9}$/;

    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Please fill client name and email.');
      return;
    }

    if (cleanPhone.length !== 10 || !phonePattern.test(cleanPhone)) {
      alert('Please enter a valid 10-digit Indian phone number.');
      return;
    }

    onSave({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: `+91 ${cleanPhone}`
    });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-xl bg-white dark:bg-[#030303] rounded-3xl border border-gray-200 dark:border-white/10 p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
            <User className="text-blue-500" /> Edit Client Details
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Client Name</label>
            <input
              type="text"
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-blue-500 outline-none transition-all"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Email Address</label>
            <input
              type="email"
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-blue-500 outline-none transition-all"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Phone Number</label>
            <input
              type="text"
              maxLength={10}
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-blue-500 outline-none transition-all"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: normalizePhoneDigits(e.target.value) })}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button onClick={onClose} className="flex-1 px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-white/5 transition-all">Cancel</button>
          <button onClick={handleSubmit} className="flex-1 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
            Save Client
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const EditProjectModal = ({ isOpen, onClose, project, onSave }) => {
  const [formData, setFormData] = useState({
    department: 'WEB DEvlopment',
    package: '',
    workDetail: '',
    totalAmount: '',
    startDate: '',
    deadline: '',
    status: 'In Progress'
  });

  useEffect(() => {
    if (project && isOpen) {
      setFormData({
        department: project.department || 'WEB DEvlopment',
        package: project.package || '',
        workDetail: project.workDetail || '',
        totalAmount: project.totalPrice?.toString() || '',
        startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
        deadline: project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : '',
        status: project.status || 'In Progress'
      });
    }
  }, [project, isOpen]);

  if (!isOpen || !project) return null;

  const showPackages = PACKAGE_ENABLED_DEPARTMENTS.includes(formData.department);

  const handleDepartmentChange = (department) => {
    if (PACKAGE_ENABLED_DEPARTMENTS.includes(department)) {
      const defaultPackage = 'Sliver Package Service';
      const packageDetails = PACKAGE_DETAILS[defaultPackage];
      setFormData({
        ...formData,
        department,
        package: defaultPackage,
        workDetail: packageDetails.details,
        totalAmount: (packageDetails.fee * 1.18).toFixed(0)
      });
      return;
    }

    setFormData({
      ...formData,
      department,
      package: '',
      workDetail: '',
      totalAmount: ''
    });
  };

  const handlePackageChange = (packageName) => {
    const packageDetails = PACKAGE_DETAILS[packageName];
    setFormData({
      ...formData,
      package: packageName,
      workDetail: packageDetails.details,
      totalAmount: (packageDetails.fee * (1 + packageDetails.gst / 100)).toFixed(0)
    });
  };

  const handleSubmit = () => {
    if (!formData.department || !formData.totalAmount) {
      alert('Please fill department and total amount.');
      return;
    }

    onSave({
      department: formData.department,
      package: formData.package,
      workDetail: formData.workDetail,
      totalAmount: formData.totalAmount,
      startDate: formData.startDate,
      deadline: formData.deadline,
      status: formData.status
    });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-2xl bg-white dark:bg-[#030303] rounded-3xl border border-gray-200 dark:border-white/10 p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
            <Edit3 className="text-purple-500" /> Edit Project Details
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Department</label>
              <select
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-purple-500 outline-none transition-all"
                value={formData.department}
                onChange={(e) => handleDepartmentChange(e.target.value)}
              >
                {CLIENT_DEPARTMENTS.map((department) => (
                  <option key={department} value={department} className="bg-white dark:bg-[#030303] text-black dark:text-white">
                    {department}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Status</label>
              <select
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-purple-500 outline-none transition-all"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                {PROJECT_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status} className="bg-white dark:bg-[#030303] text-black dark:text-white">
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {showPackages ? (
            <div>
              <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Package</label>
              <select
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-purple-500 outline-none transition-all"
                value={formData.package}
                onChange={(e) => handlePackageChange(e.target.value)}
              >
                {Object.keys(PACKAGE_DETAILS).map((packageName) => (
                  <option key={packageName} value={packageName} className="bg-white dark:bg-[#030303] text-black dark:text-white">
                    {packageName}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Package Name</label>
              <input
                type="text"
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-purple-500 outline-none transition-all"
                value={formData.package}
                onChange={(e) => setFormData({ ...formData, package: e.target.value })}
              />
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Work Detail</label>
            <textarea
              rows={5}
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-purple-500 outline-none transition-all"
              value={formData.workDetail}
              onChange={(e) => setFormData({ ...formData, workDetail: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Total Amount (₹)</label>
              <input
                type="number"
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-purple-500 outline-none transition-all"
                value={formData.totalAmount}
                onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Start Date</label>
              <input
                type="date"
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-purple-500 outline-none transition-all"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Deadline</label>
              <input
                type="date"
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-purple-500 outline-none transition-all"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button onClick={onClose} className="flex-1 px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-white/5 transition-all">Cancel</button>
          <button onClick={handleSubmit} className="flex-1 px-6 py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20">
            Save Project
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const ProjectSection = ({
  project,
  isHistory = false,
  onUpdate = (_p) => { },
  onRenew = (_p) => { },
  onAddTask = (_p) => { },
  onDeleteExtraTask = (_pid, _idx) => { },
  client
}) => {
  const projectProgress = calculateProjectProgress(project);
  const [invoiceMenuOpen, setInvoiceMenuOpen] = useState(false);

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${isHistory ? 'opacity-95' : ''}`}>
      {/* Left Column: Progress & Scope */}
      <div className="lg:col-span-2 space-y-6">
        {/* Work Progress Card */}
        <div className="bg-white dark:bg-[#111] p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm relative overflow-hidden">
          {isHistory && (
            <div className="absolute top-0 right-0 px-4 py-1 bg-gray-500 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-xl">
              Completed Cycle
            </div>
          )}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <h4 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-500" />
                WORK PROGRESS
              </h4>
              {client && (
                <div className="relative">
                  <button
                    onClick={() => setInvoiceMenuOpen(!invoiceMenuOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase tracking-widest transition-all"
                  >
                    <Download size={12} />
                    Invoice
                    <ChevronDown size={12} />
                  </button>
                  <AnimatePresence>
                    {invoiceMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 mt-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl shadow-lg z-10 overflow-hidden"
                      >
                        <button
                          onClick={async () => {
                            await downloadInvoice(project, client, true);
                            setInvoiceMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                        >
                          With GST (18%)
                        </button>
                        <button
                          onClick={async () => {
                            await downloadInvoice(project, client, false);
                            setInvoiceMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                        >
                          Without GST
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
            <span className="text-sm font-black text-blue-500">{projectProgress}%</span>
          </div>

          <div className="w-full h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden mb-8">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${projectProgress}%` }}
              className={`h-full shadow-[0_0_15px_rgba(59,130,246,0.5)] ${projectProgress >= 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-8">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Price</p>
              <p className="text-lg font-black text-gray-900 dark:text-white">₹{project.totalPrice?.toLocaleString('en-IN')}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Paid</p>
              <p className="text-lg font-black text-emerald-500">₹{project.paidAmount?.toLocaleString('en-IN')}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pending</p>
              <p className="text-lg font-black text-rose-500">₹{project.pendingAmount?.toLocaleString('en-IN')}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Start Date</p>
              <p className="text-xs font-bold text-gray-600 dark:text-gray-300">{project.startDate ? new Date(project.startDate).toLocaleDateString() : '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Deadline</p>
              <p className="text-xs font-bold text-gray-600 dark:text-gray-300">{project.deadline ? new Date(project.deadline).toLocaleDateString() : '-'}</p>
            </div>
          </div>
        </div>

        {/* Scope of Work Table */}
        <div className="bg-white dark:bg-[#111] rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
          <div className="px-8 py-4 border-bottom border-gray-50 dark:border-white/5 flex items-center gap-2 bg-gray-50/50 dark:bg-white/[0.02]">
            <ListChecks size={16} className="text-blue-500" />
            <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">Scope of Work</span>
          </div>
          <div className="p-4">
            <table className="w-full text-left border-collapse">
              <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                {project.workDetail?.split(/[\n•]+/).map(item => item.trim()).filter(i => i).map((item, index) => (
                  <tr key={index} className="group hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-300 flex items-start gap-4">
                      <div className="mt-0.5 p-1 rounded-full bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                        <Check size={10} />
                      </div>
                      <span className="leading-relaxed">{item}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Column: Work in Progress List */}
      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-[#111] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm h-full">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50 dark:border-white/5">
            <h4 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              Work in Progress
            </h4>
            {!isHistory && (
              <div className="flex items-center gap-2">
                <button onClick={() => onRenew?.(project)} className="p-2 hover:bg-purple-500/10 text-purple-600 rounded-xl transition-all" title="Renew">
                  <RefreshCw size={18} />
                </button>
                <button onClick={() => onUpdate?.(project)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20">
                  UPDATE
                </button>
                <button onClick={() => onAddTask?.(project)} className="p-2 hover:bg-blue-500/10 text-blue-600 rounded-xl transition-all">
                  <Plus size={18} />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {project.tasks?.map((task, index) => {
              const progress = Math.round((task.completed / task.total) * 100);
              return (
                <div key={index} className="p-5 rounded-2xl bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-blue-500/30 transition-all group/task">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-xl ${progress === 100 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                        {progress === 100 ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                      </div>
                      <div>
                        <span className={`text-sm font-bold block ${progress === 100 ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-200'}`}>
                          {task.name}
                        </span>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                          {task.completed} / {task.total} TASK
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-2 py-1 rounded-lg">
                      {progress}%
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Extra Tasks */}
            {project.extraTasks?.length > 0 && (
              <div className="pt-6 mt-6 border-t border-gray-50 dark:border-white/5 space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h5 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Sparkles size={12} /> Extra Deliverables
                  </h5>
                </div>
                {project.extraTasks.map((task, idx) => (
                  <div key={`extra-${idx}`} className="p-5 rounded-2xl bg-emerald-500/[0.03] border border-emerald-500/10 hover:border-emerald-500/30 transition-all group/task">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
                          <Sparkles size={16} />
                        </div>
                        <div>
                          <span className="text-sm font-bold block text-emerald-900 dark:text-emerald-200">{task.name}</span>
                          <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">
                            Bonus: {task.completed} / {task.total}
                          </span>
                        </div>
                      </div>
                      {!isHistory && (
                        <button onClick={() => onDeleteExtraTask?.(project._id || project.id, idx)} className="p-2 text-rose-500/30 hover:text-rose-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const generateInvoiceHTML = (project, client, includeGST = true) => {
  const invoiceDate = new Date().toLocaleDateString('en-IN');
  const invoiceNumber = `RWDM/${Date.now().toString().slice(-2)}-${Date.now().toString().slice(-4)}-${Date.now().toString().slice(-6)}`;
  const totalPrice = project.totalPrice || 0;
  const baseAmount = includeGST ? (totalPrice / 1.18).toFixed(2) : totalPrice.toFixed(2);
  const gstAmount = includeGST ? (totalPrice - parseFloat(baseAmount)).toFixed(2) : '0.00';
  const cgstAmount = includeGST ? (parseFloat(gstAmount) / 2).toFixed(2) : '0.00';
  const sgstAmount = cgstAmount;
  const finalTotal = includeGST ? totalPrice.toFixed(2) : baseAmount;

  // HSN/SAC code based on department/service
  let hsnCode = '998365'; // default for digital services
  if (project.department === 'SEO') hsnCode = '998364';
  if (project.department === 'Graphic Design') hsnCode = '998361';
  if (project.department === 'Video Editing') hsnCode = '998362';
  if (project.department === 'Web Development') hsnCode = '998363';

  // Amount in words function
  const numberToWords = (num) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (num === 0) return 'Zero';

    let words = '';
    const str = Math.floor(num).toString().padStart(9, '0');
    const crores = parseInt(str.substring(0, 2));
    const lakhs = parseInt(str.substring(2, 4));
    const thousands = parseInt(str.substring(4, 6));
    const hundreds = parseInt(str.substring(6, 7));
    const lastTwo = parseInt(str.substring(7, 9));

    const convertTwoDigits = (n) => {
      if (n < 20) return ones[n];
      let word = tens[Math.floor(n / 10)];
      if (n % 10 !== 0) word += ' ' + ones[n % 10];
      return word;
    };

    if (crores > 0) words += convertTwoDigits(crores) + ' Crore ';
    if (lakhs > 0) words += convertTwoDigits(lakhs) + ' Lakh ';
    if (thousands > 0) words += convertTwoDigits(thousands) + ' Thousand ';
    if (hundreds > 0) words += ones[hundreds] + ' Hundred ';
    if (lastTwo > 0) words += convertTwoDigits(lastTwo) + ' ';

    const paisa = Math.round((num - Math.floor(num)) * 100);
    if (paisa > 0) words += 'and ' + convertTwoDigits(paisa) + ' Paise ';

    return words.trim() + ' Only';
  };

  const amountInWords = numberToWords(parseFloat(finalTotal));

  return `<!DOCTYPE html>
<html>
<head>
  <title>Tax Invoice - ${client.name}</title>
</head>
<body style="margin:0; padding:20px; background:#fff; font-family:Arial, sans-serif;">

  <div style="width:190mm; min-height:277mm; margin:0 auto; background:#fff; border:1px solid #000;">

    <!-- TITLE -->
    <div style="text-align:center; padding:6px; border-bottom:1px solid #000; font-size:15px; font-weight:bold;">
      Tax Invoice
    </div>

    <!-- TOP SECTION: Company + Invoice Details -->
    <table style="width:100%; border-collapse:collapse;">
      <tr>

        <!-- LEFT: Company Info -->
        <td style="width:50%; border-right:1px solid #000; border-bottom:1px solid #000; padding:8px; vertical-align:top;">
          <table style="width:100%; border-collapse:collapse;">
            <tr>
              <td style="width:70px; vertical-align:top; padding-right:8px;">
                <img src="/rw_bw.png" style="width:65px; height:auto;">
              </td>
              <td style="vertical-align:top;">
                <div style="font-size:13px; font-weight:bold; line-height:1.3;">RIZE WORLD DIGITAL MARKETING PRIVATELIMITED</div>
                <div style="font-size:10px; margin-top:4px;">C-197, Shalimar Nagar,TelcoCirclePoliceChowki</div>
                <div style="font-size:10px;">UIT Colony, Alwar</div>
                <div style="font-size:10px;">GSTIN/UIN: 08AAOCR8626A1Z7</div>
                <div style="font-size:10px;">State Name : Rajasthan, Code : 08</div>
              </td>
            </tr>
          </table>
        </td>

        <!-- RIGHT: Invoice Meta Fields -->
        <td style="width:50%; padding:0; vertical-align:top; border-bottom:1px solid #000;">
          <table style="width:100%; border-collapse:collapse;">
            <tr>
              <td style="border-bottom:1px solid #000; border-right:1px solid #000; padding:5px; font-size:11px; width:50%;">
                Invoice No.<br>
                <strong style="font-size:12px;">${invoiceNumber}</strong>
              </td>
              <td style="border-bottom:1px solid #000; padding:5px; font-size:11px; width:50%;">
                Dated ${invoiceDate}
              </td>
            </tr>
            <tr>
              <td style="border-bottom:1px solid #000; border-right:1px solid #000; padding:5px; font-size:11px;">Delivery Note</td>
              <td style="border-bottom:1px solid #000; padding:5px; font-size:11px;">Mode/Terms of Payment</td>
            </tr>
            <tr>
              <td style="border-bottom:1px solid #000; border-right:1px solid #000; padding:5px; font-size:11px;">Reference No. &amp; Date.</td>
              <td style="border-bottom:1px solid #000; padding:5px; font-size:11px;">Other References</td>
            </tr>
            <tr>
              <td style="border-bottom:1px solid #000; border-right:1px solid #000; padding:5px; font-size:11px;">Buyer's Order No.</td>
              <td style="border-bottom:1px solid #000; padding:5px; font-size:11px;">Dated</td>
            </tr>
            <tr>
              <td style="border-bottom:1px solid #000; border-right:1px solid #000; padding:5px; font-size:11px;">Dispatch Doc No.</td>
              <td style="border-bottom:1px solid #000; padding:5px; font-size:11px;">Delivery Note Date</td>
            </tr>
            <tr>
              <td style="border-bottom:1px solid #000; border-right:1px solid #000; padding:5px; font-size:11px;">Dispatched through</td>
              <td style="border-bottom:1px solid #000; padding:5px; font-size:11px;">Destination</td>
            </tr>
          </table>
        </td>

      </tr>
    </table>

    <!-- CONSIGNEE + BUYER (stacked left) | TERMS OF DELIVERY (right) -->
    <table style="width:100%; border-collapse:collapse;">
      <tr>

        <!-- LEFT: Consignee on top, Buyer below -->
        <td style="width:50%; border-right:1px solid #000; border-bottom:1px solid #000; padding:0; vertical-align:top;">

          <!-- Consignee (Ship to) -->
          <div style="padding:8px; border-bottom:1px solid #000; font-size:11px;">
            <div style="font-size:11px; margin-bottom:4px;">Consignee (Ship to)</div>
            <div style="font-size:13px; font-weight:bold;">${client.name}</div>
            <div style="font-size:12px;">${client.address || 'N/A'}</div>
            <br>
            <div style="font-size:11px;">GSTIN/UIN : ${client.gstin || ''}</div>
            <br>
            <div style="font-size:12px;">State Name : ${client.state || 'Rajasthan'}, Code : ${client.stateCode || '08'}</div>
          </div>

          <!-- Buyer (Bill to) -->
          <div style="padding:8px; font-size:11px;">
            <div style="font-size:11px; margin-bottom:4px;">Buyer(Bill to)</div>
            <div style="font-size:13px; font-weight:bold;">${client.name}</div>
            <div style="font-size:12px;">${client.address || 'N/A'}</div>
            <br>
            <div style="font-size:11px;">GSTIN/UIN : ${client.gstin || ''}</div>
            <br>
            <div style="font-size:12px;">State Name : ${client.state || 'Rajasthan'}, Code : ${client.stateCode || '08'}</div>
          </div>

        </td>

        <!-- RIGHT: Terms of Delivery -->
        <td style="width:50%; border-bottom:1px solid #000; padding:8px; vertical-align:top; font-size:11px;">
          <div style="font-size:11px; font-weight:bold; margin-bottom:6px;">Terms of Delivery</div>
        </td>

      </tr>
    </table>

    <!-- PARTICULARS TABLE -->
    <table style="width:100%; border-collapse:collapse;">
      <thead>
        <tr>
          <th style="border:1px solid #000; padding:6px; font-size:11px; width:5%; text-align:center;"></th>
          <th style="border:1px solid #000; padding:6px; font-size:11px; width:40%; text-align:center;">Particulars</th>
          <th style="border:1px solid #000; padding:6px; font-size:11px; width:10%; text-align:center;">HSN/SAC</th>
          <th style="border:1px solid #000; padding:6px; font-size:11px; width:10%; text-align:center;">Quantity</th>
          <th style="border:1px solid #000; padding:6px; font-size:11px; width:10%; text-align:center;">Rate</th>
          <th style="border:1px solid #000; padding:6px; font-size:11px; width:5%; text-align:center;">per</th>
          <th style="border:1px solid #000; padding:6px; font-size:11px; width:20%; text-align:center;">Amount</th>
        </tr>
      </thead>
      <tbody>

        <!-- Service Row -->
        <tr>
          <td style="border-left:1px solid #000; border-right:1px solid #000; padding:6px; font-size:11px; vertical-align:top; height:200px;"></td>
          <td style="border-right:1px solid #000; padding:6px; font-size:11px; vertical-align:top; height:200px;">
            <div>${project.package || project.workDetail?.split('\n').filter(Boolean)[0] || 'Digital Services'}</div>
            ${includeGST ? `
            <div style="text-align:right; margin-top:8px;">Output CGST</div>
            <div style="text-align:right;">Output SGST</div>
            ` : ''}
          </td>
          <td style="border-right:1px solid #000; padding:6px; font-size:11px; vertical-align:top; text-align:center;">
            ${hsnCode}
          </td>
          <td style="border-right:1px solid #000; padding:6px; font-size:11px; vertical-align:top;"></td>
          <td style="border-right:1px solid #000; padding:6px; font-size:11px; vertical-align:top;"></td>
          <td style="border-right:1px solid #000; padding:6px; font-size:11px; vertical-align:top;"></td>
          <td style="border-right:1px solid #000; border-bottom:1px solid #000; padding:6px; font-size:11px; vertical-align:top; text-align:right;">
            ${includeGST ? `
              <div>&#8377;${baseAmount}</div>
              <div>&#8377;${cgstAmount}</div>
              <div>&#8377;${sgstAmount}</div>
            ` : `<div>&#8377;${baseAmount}</div>`}
          </td>
        </tr>

        <!-- TOTAL ROW -->
        <tr>
          <td style="border:1px solid #000; padding:6px; font-size:11px;"></td>
          <td colspan="5" style="border:1px solid #000; padding:6px; font-size:12px; font-weight:bold; text-align:right;">Total</td>
          <td style="border:1px solid #000; padding:6px; font-size:13px; font-weight:bold; text-align:right;">&#8377;${finalTotal}</td>
        </tr>

      </tbody>
    </table>

    <!-- AMOUNT IN WORDS -->
    <table style="width:100%; border-collapse:collapse;">
      <tr>
        <td style="border:1px solid #000; padding:6px; font-size:11px; width:70%;">
          AmountChargeable(in words)
        </td>
        <td style="border:1px solid #000; padding:6px; font-size:11px; text-align:right; width:30%;">
          E. &amp;O.E
        </td>
      </tr>
      <tr>
        <td colspan="2" style="border:1px solid #000; padding:6px; font-size:13px; font-weight:bold;">
          INR ${amountInWords}
        </td>
      </tr>
    </table>

    <!-- GST SUMMARY TABLE -->
    <table style="width:100%; border-collapse:collapse;">
      <thead>
        <tr>
          <th style="border:1px solid #000; padding:5px; font-size:11px; text-align:center; width:15%;">HSN/SAC</th>
          <th style="border:1px solid #000; padding:5px; font-size:11px; text-align:center; width:20%;">Taxable<br>Value</th>
          <th style="border:1px solid #000; padding:5px; font-size:11px; text-align:center; width:10%;">CGST<br>Rate</th>
          <th style="border:1px solid #000; padding:5px; font-size:11px; text-align:center; width:15%;">CGST<br>Amount</th>
          <th style="border:1px solid #000; padding:5px; font-size:11px; text-align:center; width:15%;">SGST/UTGST<br>Rate</th>
          <th style="border:1px solid #000; padding:5px; font-size:11px; text-align:center; width:15%;">SGST/UTGST<br>Amount</th>
          <th style="border:1px solid #000; padding:5px; font-size:11px; text-align:center; width:10%;"></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="border:1px solid #000; padding:5px; font-size:11px; text-align:center;">${hsnCode}</td>
          <td style="border:1px solid #000; padding:5px; font-size:11px; text-align:center;">${includeGST ? baseAmount : '0.00'}</td>
          <td style="border:1px solid #000; padding:5px; font-size:11px; text-align:center;">${includeGST ? '9%' : ''}</td>
          <td style="border:1px solid #000; padding:5px; font-size:11px; text-align:center;">${includeGST ? cgstAmount : '0.00'}</td>
          <td style="border:1px solid #000; padding:5px; font-size:11px; text-align:center;">${includeGST ? '9%' : ''}</td>
          <td style="border:1px solid #000; padding:5px; font-size:11px; text-align:center;">${includeGST ? sgstAmount : '0.00'}</td>
          <td style="border:1px solid #000; padding:5px; font-size:11px;"></td>
        </tr>
        <tr>
          <td style="border:1px solid #000; padding:5px; font-size:11px; font-weight:bold;">Total</td>
          <td style="border:1px solid #000; padding:5px; font-size:11px; text-align:center;">${includeGST ? baseAmount : '0.00'}</td>
          <td style="border:1px solid #000; padding:5px; font-size:11px;"></td>
          <td style="border:1px solid #000; padding:5px; font-size:11px; text-align:center;">${includeGST ? cgstAmount : '0.00'}</td>
          <td style="border:1px solid #000; padding:5px; font-size:11px;"></td>
          <td style="border:1px solid #000; padding:5px; font-size:11px; text-align:center;">${includeGST ? sgstAmount : '0.00'}</td>
          <td style="border:1px solid #000; padding:5px; font-size:11px;"></td>
        </tr>
      </tbody>
    </table>

    <!-- TAX AMOUNT IN WORDS -->
    <table style="width:100%; border-collapse:collapse;">
      <tr>
        <td style="border:1px solid #000; padding:6px; font-size:11px;">
          Tax Amount (in words) : INR ${includeGST ? numberToWords(parseFloat(gstAmount)) : 'Zero'}
        </td>
      </tr>
    </table>

    <!-- SIGNATURE SECTION -->
    <table style="width:100%; border-collapse:collapse;">
      <tr>
        <td style="border:1px solid #000; padding:10px; font-size:11px; width:50%; height:80px; vertical-align:top;">
          Customer's Seal and Signature
        </td>
        <td style="border:1px solid #000; padding:10px; font-size:11px; width:50%; vertical-align:top; text-align:right;">
          <div>For RIZEWORLDDIGITALMARKETING PRIVATE LIMITED</div>
          <br>
          <img src="/rw_bw.png" style="height:40px; margin-top:5px;"><br>
          <div style="margin-top:4px;">Authorised Signatory</div>
        </td>
      </tr>
    </table>

    <!-- FOOTER -->
    <div style="text-align:center; padding:8px; font-size:11px; border-top:1px solid #000;">
      This is a Computer Generated Invoice
    </div>

  </div>

</body>
</html>`;
};

const generateAllProjectsInvoiceHTML = (projects, client, includeGST = true) => {
  const allCycles = [projects[0], ...(projects[0]?.history || [])].filter(Boolean);
  const invoiceDate = new Date().toLocaleDateString('en-IN');
  const invoiceNumber = `RWDM/ALL-${Date.now().toString().slice(-2)}-${Date.now().toString().slice(-4)}-${Date.now().toString().slice(-6)}`;

  let totalAllPrice = 0;

  allCycles.forEach(cycle => {
    totalAllPrice += cycle.totalPrice || 0;
  });

  const totalBaseAmount = includeGST ? (totalAllPrice / 1.18).toFixed(2) : totalAllPrice.toFixed(2);
  const totalGstAmount = includeGST ? (totalAllPrice - parseFloat(totalBaseAmount)).toFixed(2) : '0.00';
  const totalCgst = includeGST ? (parseFloat(totalGstAmount) / 2).toFixed(2) : '0.00';
  const totalSgst = totalCgst;
  const finalTotalAll = includeGST ? totalAllPrice.toFixed(2) : totalBaseAmount;

  // HSN/SAC code based on department/service
  let hsnCode = '998365';
  if (projects[0]?.department === 'SEO') hsnCode = '998364';
  if (projects[0]?.department === 'Graphic Design') hsnCode = '998361';
  if (projects[0]?.department === 'Video Editing') hsnCode = '998362';
  if (projects[0]?.department === 'Web Development') hsnCode = '998363';

  // Amount in words function
  const numberToWords = (num) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (num === 0) return 'Zero';

    let words = '';
    const str = Math.floor(num).toString().padStart(9, '0');
    const crores = parseInt(str.substring(0, 2));
    const lakhs = parseInt(str.substring(2, 4));
    const thousands = parseInt(str.substring(4, 6));
    const hundreds = parseInt(str.substring(6, 7));
    const lastTwo = parseInt(str.substring(7, 9));

    const convertTwoDigits = (n) => {
      if (n < 20) return ones[n];
      let word = tens[Math.floor(n / 10)];
      if (n % 10 !== 0) word += ' ' + ones[n % 10];
      return word;
    };

    if (crores > 0) words += convertTwoDigits(crores) + ' Crore ';
    if (lakhs > 0) words += convertTwoDigits(lakhs) + ' Lakh ';
    if (thousands > 0) words += convertTwoDigits(thousands) + ' Thousand ';
    if (hundreds > 0) words += ones[hundreds] + ' Hundred ';
    if (lastTwo > 0) words += convertTwoDigits(lastTwo) + ' ';

    const paisa = Math.round((num - Math.floor(num)) * 100);
    if (paisa > 0) words += 'and ' + convertTwoDigits(paisa) + ' Paise ';

    return words.trim() + ' Only';
  };

  const amountInWords = numberToWords(parseFloat(finalTotalAll));

  return `<!DOCTYPE html>
<html>
<head>
  <title>Tax Invoice - ${client.name}</title>
</head>
<body style="margin:0; padding:20px; background:#fff; font-family:Arial, sans-serif;">

  <div style="width:190mm; min-height:277mm; margin:0 auto; background:#fff; border:1px solid #000;">

    <!-- TITLE -->
    <div style="text-align:center; padding:6px; border-bottom:1px solid #000; font-size:15px; font-weight:bold;">
      Tax Invoice
    </div>

    <!-- TOP SECTION: Company + Invoice Details -->
    <table style="width:100%; border-collapse:collapse;">
      <tr>

        <!-- LEFT: Company Info -->
        <td style="width:50%; border-right:1px solid #000; border-bottom:1px solid #000; padding:8px; vertical-align:top;">
          <table style="width:100%; border-collapse:collapse;">
            <tr>
              <td style="width:70px; vertical-align:top; padding-right:8px;">
                <img src="/rw_bw.png" style="width:65px; height:auto;">
              </td>
              <td style="vertical-align:top;">
                <div style="font-size:13px; font-weight:bold; line-height:1.3;">RIZE WORLD DIGITAL MARKETING PRIVATELIMITED</div>
                <div style="font-size:10px; margin-top:4px;">C-197, Shalimar Nagar,TelcoCirclePoliceChowki</div>
                <div style="font-size:10px;">UIT Colony, Alwar</div>
                <div style="font-size:10px;">GSTIN/UIN: 08AAOCR8626A1Z7</div>
                <div style="font-size:10px;">State Name : Rajasthan, Code : 08</div>
              </td>
            </tr>
          </table>
        </td>

        <!-- RIGHT: Invoice Meta Fields -->
        <td style="width:50%; padding:0; vertical-align:top; border-bottom:1px solid #000;">
          <table style="width:100%; border-collapse:collapse;">
            <tr>
              <td style="border-bottom:1px solid #000; border-right:1px solid #000; padding:5px; font-size:11px; width:50%;">
                Invoice No.<br>
                <strong style="font-size:12px;">${invoiceNumber}</strong>
              </td>
              <td style="border-bottom:1px solid #000; padding:5px; font-size:11px; width:50%;">
                Dated ${invoiceDate}
              </td>
            </tr>
            <tr>
              <td style="border-bottom:1px solid #000; border-right:1px solid #000; padding:5px; font-size:11px;">Delivery Note</td>
              <td style="border-bottom:1px solid #000; padding:5px; font-size:11px;">Mode/Terms of Payment</td>
            </tr>
            <tr>
              <td style="border-bottom:1px solid #000; border-right:1px solid #000; padding:5px; font-size:11px;">Reference No. &amp; Date.</td>
              <td style="border-bottom:1px solid #000; padding:5px; font-size:11px;">Other References</td>
            </tr>
            <tr>
              <td style="border-bottom:1px solid #000; border-right:1px solid #000; padding:5px; font-size:11px;">Buyer's Order No.</td>
              <td style="border-bottom:1px solid #000; padding:5px; font-size:11px;">Dated</td>
            </tr>
            <tr>
              <td style="border-bottom:1px solid #000; border-right:1px solid #000; padding:5px; font-size:11px;">Dispatch Doc No.</td>
              <td style="border-bottom:1px solid #000; padding:5px; font-size:11px;">Delivery Note Date</td>
            </tr>
            <tr>
              <td style="border-bottom:1px solid #000; border-right:1px solid #000; padding:5px; font-size:11px;">Dispatched through</td>
              <td style="border-bottom:1px solid #000; padding:5px; font-size:11px;">Destination</td>
            </tr>

          </table>
        </td>

      </tr>
    </table>

    <!-- CONSIGNEE + BUYER (stacked left) | TERMS OF DELIVERY (right) -->
    <table style="width:100%; border-collapse:collapse;">
      <tr>

        <!-- LEFT: Consignee on top, Buyer below -->
        <td style="width:50%; border-right:1px solid #000; border-bottom:1px solid #000; padding:0; vertical-align:top;">

          <!-- Consignee (Ship to) -->
          <div style="padding:8px; border-bottom:1px solid #000; font-size:11px;">
            <div style="font-size:11px; margin-bottom:4px;">Consignee (Ship to)</div>
            <div style="font-size:13px; font-weight:bold;">${client.name}</div>
            <div style="font-size:12px;">${client.address || 'N/A'}</div>
            <br>
            <div style="font-size:11px;">GSTIN/UIN : ${client.gstin || ''}</div>
            <br>
            <div style="font-size:12px;">State Name : ${client.state || 'Rajasthan'}, Code : ${client.stateCode || '08'}</div>
          </div>

          <!-- Buyer (Bill to) -->
          <div style="padding:8px; font-size:11px;">
            <div style="font-size:11px; margin-bottom:4px;">Buyer(Bill to)</div>
            <div style="font-size:13px; font-weight:bold;">${client.name}</div>
            <div style="font-size:12px;">${client.address || 'N/A'}</div>
            <br>
            <div style="font-size:11px;">GSTIN/UIN : ${client.gstin || ''}</div>
            <br>
            <div style="font-size:12px;">State Name : ${client.state || 'Rajasthan'}, Code : ${client.stateCode || '08'}</div>
          </div>

        </td>

        <!-- RIGHT: Terms of Delivery -->
        <td style="width:50%; border-bottom:1px solid #000; padding:8px; vertical-align:top; font-size:11px;">
          <div style="font-size:11px; font-weight:bold; margin-bottom:6px;">Terms of Delivery</div>
        </td>

      </tr>
    </table>

    <!-- PARTICULARS TABLE -->
    <table style="width:100%; border-collapse:collapse;">
      <thead>
        <tr>
          <th style="border:1px solid #000; padding:6px; font-size:11px; width:5%; text-align:center;"></th>
          <th style="border:1px solid #000; padding:6px; font-size:11px; width:40%; text-align:center;">Particulars</th>
          <th style="border:1px solid #000; padding:6px; font-size:11px; width:10%; text-align:center;">HSN/SAC</th>
          <th style="border:1px solid #000; padding:6px; font-size:11px; width:10%; text-align:center;">Quantity</th>
          <th style="border:1px solid #000; padding:6px; font-size:11px; width:10%; text-align:center;">Rate</th>
          <th style="border:1px solid #000; padding:6px; font-size:11px; width:5%; text-align:center;">per</th>
          <th style="border:1px solid #000; padding:6px; font-size:11px; width:20%; text-align:center;">Amount</th>
        </tr>
      </thead>
      <tbody>

        <!-- Service Row with large body area -->
        <tr>
          <td style="border-left:1px solid #000; border-right:1px solid #000; padding:6px; font-size:11px; vertical-align:top; height:200px;"></td>
          <td style="border-right:1px solid #000; padding:6px; font-size:11px; vertical-align:top; height:200px;">
            <div>${allCycles.map((cycle, index) => {
    const label = index === 0 ? 'Services_998361' : `Month ${index} - Completed${cycle.package ? ` - ${cycle.package}` : ''}`;
    return label;
  }).join('<br>')}</div>
            <div style="text-align:right; margin-top:8px;">Output CGST</div>
            <div style="text-align:right;">Output SGST</div>
            <div style="text-align:center; margin-top:12px;">Meta Ads</div>
          </td>
          <td style="border-right:1px solid #000; padding:6px; font-size:11px; vertical-align:top; text-align:center;">
            ${hsnCode}
          </td>
          <td style="border-right:1px solid #000; padding:6px; font-size:11px; vertical-align:top;"></td>
          <td style="border-right:1px solid #000; padding:6px; font-size:11px; vertical-align:top;"></td>
          <td style="border-right:1px solid #000; padding:6px; font-size:11px; vertical-align:top;"></td>
          <td style="border-right:1px solid #000; padding:6px; font-size:11px; vertical-align:top; text-align:right;">
            ${includeGST ? `
              <div>${totalBaseAmount}</div>
              <div>${totalCgst}</div>
              <div>${totalSgst}</div>
            ` : `<div>&#8377;${finalTotalAll}</div>`}
          </td>
        </tr>

        <!-- TOTAL ROW -->
        <tr>
          <td style="border:1px solid #000; padding:6px; font-size:11px;"></td>
          <td colspan="5" style="border:1px solid #000; padding:6px; font-size:12px; font-weight:bold; text-align:right;">Total</td>
          <td style="border:1px solid #000; padding:6px; font-size:13px; font-weight:bold; text-align:right;">&#8377;${finalTotalAll}</td>
        </tr>

      </tbody>
    </table>

    <!-- AMOUNT IN WORDS -->
    <table style="width:100%; border-collapse:collapse;">
      <tr>
        <td style="border:1px solid #000; padding:6px; font-size:11px; width:70%;">
          AmountChargeable(in words)
        </td>
        <td style="border:1px solid #000; padding:6px; font-size:11px; text-align:right; width:30%;">
          E. &amp;O.E
        </td>
      </tr>
      <tr>
        <td colspan="2" style="border:1px solid #000; padding:6px; font-size:13px; font-weight:bold;">
          INR ${amountInWords}
        </td>
      </tr>
    </table>

    <!-- GST SUMMARY TABLE -->
    <table style="width:100%; border-collapse:collapse;">
      <thead>
        <tr>
          <th style="border:1px solid #000; padding:5px; font-size:11px; text-align:center; width:15%;">HSN/SAC</th>
          <th style="border:1px solid #000; padding:5px; font-size:11px; text-align:center; width:20%;">Taxable<br>Value</th>
          <th style="border:1px solid #000; padding:5px; font-size:11px; text-align:center; width:10%;">CGST<br>Rate</th>
          <th style="border:1px solid #000; padding:5px; font-size:11px; text-align:center; width:15%;">CGST<br>Amount</th>
          <th style="border:1px solid #000; padding:5px; font-size:11px; text-align:center; width:15%;">SGST/UTGST<br>Rate</th>
          <th style="border:1px solid #000; padding:5px; font-size:11px; text-align:center; width:15%;">SGST/UTGST<br>Amount</th>
          <th style="border:1px solid #000; padding:5px; font-size:11px; text-align:center; width:10%;"></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="border:1px solid #000; padding:5px; font-size:11px; text-align:center;">${hsnCode}</td>
          <td style="border:1px solid #000; padding:5px; font-size:11px; text-align:center;">${includeGST ? totalBaseAmount : '0.00'}</td>
          <td style="border:1px solid #000; padding:5px; font-size:11px; text-align:center;">${includeGST ? '9%' : ''}</td>
          <td style="border:1px solid #000; padding:5px; font-size:11px; text-align:center;">${includeGST ? totalCgst : '0.00'}</td>
          <td style="border:1px solid #000; padding:5px; font-size:11px; text-align:center;">${includeGST ? '9%' : ''}</td>
          <td style="border:1px solid #000; padding:5px; font-size:11px; text-align:center;">${includeGST ? totalSgst : '0.00'}</td>
          <td style="border:1px solid #000; padding:5px; font-size:11px;"></td>
        </tr>
        <tr>
          <td style="border:1px solid #000; padding:5px; font-size:11px; font-weight:bold;">Total</td>
          <td style="border:1px solid #000; padding:5px; font-size:11px; text-align:center;">${includeGST ? totalBaseAmount : '0.00'}</td>
          <td style="border:1px solid #000; padding:5px; font-size:11px;"></td>
          <td style="border:1px solid #000; padding:5px; font-size:11px; text-align:center;">${includeGST ? totalCgst : '0.00'}</td>
          <td style="border:1px solid #000; padding:5px; font-size:11px;"></td>
          <td style="border:1px solid #000; padding:5px; font-size:11px; text-align:center;">${includeGST ? totalSgst : '0.00'}</td>
          <td style="border:1px solid #000; padding:5px; font-size:11px;"></td>
        </tr>
      </tbody>
    </table>

    <!-- TAX AMOUNT IN WORDS -->
    <table style="width:100%; border-collapse:collapse;">
      <tr>
        <td style="border:1px solid #000; padding:6px; font-size:11px;">
          Tax Amount (in words) : INR ${includeGST ? numberToWords(parseFloat(totalGstAmount)) : 'Zero'}
        </td>
      </tr>
    </table>

    <!-- SIGNATURE SECTION -->
    <table style="width:100%; border-collapse:collapse;">
      <tr>
        <td style="border:1px solid #000; padding:10px; font-size:11px; width:50%; height:80px; vertical-align:top;">
          Customer's Seal and Signature
        </td>
        <td style="border:1px solid #000; padding:10px; font-size:11px; width:50%; vertical-align:top; text-align:right;">
          <div>For RIZEWORLDDIGITALMARKETING PRIVATE LIMITED</div>
          <br>
          <img src="/rw_bw.png" style="height:40px; margin-top:5px;"><br>
          <div style="margin-top:4px;">Authorised Signatory</div>
        </td>
      </tr>
    </table>

    <!-- FOOTER -->
    <div style="text-align:center; padding:8px; font-size:11px; border-top:1px solid #000;">
      This is a Computer Generated Invoice
    </div>

  </div>

</body>
</html>`;
};

const generatePDFInvoice = async (project, client, includeGST = true) => {
  try {
    // Fetch PDF template
    const templatePath = '/GST Invoice No..pdf';
    const templateBytes = await fetch(templatePath).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(templateBytes, { ignoreEncryption: true });

    console.log('PDF loaded successfully!');
    console.log('Number of pages:', pdfDoc.getPageCount());

    // Check for form fields first
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    console.log('Found fields:', fields.map(f => f.getName()));

    // Load fonts
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const page = pdfDoc.getPage(0);
    const { width, height } = page.getSize();
    console.log('Page size:', { width, height });

    const invoiceDate = new Date().toLocaleDateString('en-IN');
    const invoiceNumber = `RWDM/${Date.now().toString().slice(-2)}-${Date.now().toString().slice(-4)}-${Date.now().toString().slice(-6)}`;
    const totalPrice = project.totalPrice || 0;
    const baseAmount = includeGST ? (totalPrice / 1.18).toFixed(2) : totalPrice.toFixed(2);
    const gstAmount = includeGST ? (totalPrice - parseFloat(baseAmount)).toFixed(2) : '0.00';
    const cgstAmount = includeGST ? (parseFloat(gstAmount) / 2).toFixed(2) : '0.00';
    const sgstAmount = cgstAmount;
    const finalTotal = includeGST ? totalPrice.toFixed(2) : baseAmount;

    // HSN/SAC code based on department/service
    let hsnCode = '998365';
    if (project.department === 'SEO') hsnCode = '998364';
    if (project.department === 'Graphic Design') hsnCode = '998361';
    if (project.department === 'Video Editing') hsnCode = '998362';
    if (project.department === 'Web Development') hsnCode = '998363';

    // Amount in words function
    const numberToWords = (num) => {
      const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
      const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

      if (num === 0) return 'Zero';

      let words = '';
      const str = Math.floor(num).toString().padStart(9, '0');
      const crores = parseInt(str.substring(0, 2));
      const lakhs = parseInt(str.substring(2, 4));
      const thousands = parseInt(str.substring(4, 6));
      const hundreds = parseInt(str.substring(6, 7));
      const lastTwo = parseInt(str.substring(7, 9));

      const convertTwoDigits = (n) => {
        if (n < 20) return ones[n];
        let word = tens[Math.floor(n / 10)];
        if (n % 10 !== 0) word += ' ' + ones[n % 10];
        return word;
      };

      if (crores > 0) words += convertTwoDigits(crores) + ' Crore ';
      if (lakhs > 0) words += convertTwoDigits(lakhs) + ' Lakh ';
      if (thousands > 0) words += convertTwoDigits(thousands) + ' Thousand ';
      if (hundreds > 0) words += ones[hundreds] + ' Hundred ';
      if (lastTwo > 0) words += convertTwoDigits(lastTwo) + ' ';

      const paisa = Math.round((num - Math.floor(num)) * 100);
      if (paisa > 0) words += 'and ' + convertTwoDigits(paisa) + ' Paise ';

      return words.trim() + ' Only';
    };
    const amountInWords = numberToWords(parseFloat(finalTotal));

    // Draw a test rectangle so we can see coordinates are working!
    page.drawRectangle({
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      borderColor: rgb(1, 0, 0),
      borderWidth: 2,
    });

    // Draw test text in various positions to help us find the right coordinates!
    const testPositions = [
      { x: 100, y: height - 50, text: 'Test 1' },
      { x: 200, y: height - 100, text: 'Test 2' },
      { x: 300, y: height - 150, text: 'Test 3' },
      { x: 400, y: height - 200, text: 'Test 4' },
      { x: 500, y: height - 250, text: 'Test 5' },
    ];

    testPositions.forEach(pos => {
      page.drawText(pos.text, {
        x: pos.x,
        y: pos.y,
        size: 14,
        font: helveticaBoldFont,
        color: rgb(1, 0, 0),
      });
    });

    // Try to fill form fields if any
    if (fields.length > 0) {
      console.log('Attempting to fill form fields...');
      fields.forEach(field => {
        try {
          if (field.constructor.name === 'PDFField') {
            // Try to set it as text field
            form.getTextField(field.getName()).setText('Test Value');
          }
        } catch (_e) {
          console.log('Field not a text field:', field.getName());
        }
      });
    }

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${client.name.replace(/\s+/g, '-')}-${includeGST ? 'with-gst' : 'without-gst'}-${Date.now().toString().slice(-6)}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating PDF invoice:', error);
    alert(`PDF generation failed: ${error.message}`);
    // Fallback to HTML invoice if PDF fails
    const html = generateInvoiceHTML(project, client, includeGST);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${client.name.replace(/\s+/g, '-')}-${includeGST ? 'with-gst' : 'without-gst'}-${Date.now().toString().slice(-6)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

const downloadAllProjectsInvoice = async (projects, client, includeGST = true) => {
  const html = generateAllProjectsInvoiceHTML(projects, client, includeGST);
  await htmlToPDF(html, `All-Projects-Invoice-${client.name.replace(/\s+/g, '-')}-${includeGST ? 'with-gst' : 'without-gst'}-${Date.now().toString().slice(-6)}.pdf`);
};

const htmlToPDF = async (html, filename) => {
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed; top:-9999px; left:-9999px; width:794px; height:1123px; border:none;';
  document.body.appendChild(iframe);
  iframe.contentDocument.open();
  iframe.contentDocument.write(html);
  iframe.contentDocument.close();
  await new Promise(resolve => setTimeout(resolve, 1000));
  try {
    const canvas = await html2canvas(iframe.contentDocument.body, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794,
      windowWidth: 794,
    });
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    let yOffset = 0;
    while (yOffset < imgHeight) {
      if (yOffset > 0) pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, -yOffset, pdfWidth, imgHeight);
      yOffset += pdfHeight;
    }
    pdf.save(filename);
  } finally {
    document.body.removeChild(iframe);
  }
};

const downloadInvoice = async (project, client, includeGST = true) => {
  const html = generateInvoiceHTML(project, client, includeGST);
  await htmlToPDF(html, `Invoice-${client.name.replace(/\s+/g, '-')}-${includeGST ? 'with-gst' : 'without-gst'}-${Date.now().toString().slice(-6)}.pdf`);
};

const downloadDelayWork = async (clientId, startDate, endDate) => {
  try {
    const params = new URLSearchParams();
    if (clientId) params.append('clientId', clientId);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await fetch(`http://localhost:45000/api/delay-work/export?${params}`);
    if (!response.ok) throw new Error('Failed to download');

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `delay-work-${Date.now()}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading delay work:', error);
    alert('Failed to download delay work');
  }
};

const ClientProjects = ({ onBack }) => {
  const { id: clientId } = useParams();
  const navigateHook = useNavigate();
  const handleBack = onBack || (() => navigateHook('/clients'));
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isUpdateProgressOpen, setIsUpdateProgressOpen] = useState(false);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [selectedProjectForTask, setSelectedProjectForTask] = useState(null);
  const [tempProjectData, setTempProjectData] = useState(null);
  const [isExtraTask, setIsExtraTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskTotal, setNewTaskTotal] = useState('1');
  const [renewFormData, setRenewModalData] = useState({
    package: '',
    workDetail: '',
    totalAmount: '',
    startDate: new Date().toISOString().split('T')[0],
    deadline: ''
  });
  const [allProjectsMenuOpen, setAllProjectsMenuOpen] = useState(false);
  const [currentProjectMenuOpen, setCurrentProjectMenuOpen] = useState(false);
  const [delayWorkStartDate, setDelayWorkStartDate] = useState('');
  const [delayWorkEndDate, setDelayWorkEndDate] = useState('');
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);

  const fetchClientData = useCallback(async () => {
    if (!clientId) return;
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:45000/api/clients/${clientId}`);
      const result = await response.json();
      if (result.success) {
        const clientData = result.data;
        // If tasks array is empty (old data), generate them from workDetail for the UI
        if (!clientData.tasks || clientData.tasks.length === 0) {
          clientData.tasks = parseWorkDetailToTasks(clientData.workDetail);
        }
        setProjects([clientData]);
      }
    } catch (error) {
      console.error('Error fetching client data:', error);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchClientData();
  }, [fetchClientData]);

  const getRequestHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  };

  const openUpdateModal = (project) => {
    const projectToUpdate = JSON.parse(JSON.stringify(project));
    // Ensure tasks exist in the update modal even if they were just generated for UI
    if (!projectToUpdate.tasks || projectToUpdate.tasks.length === 0) {
      projectToUpdate.tasks = parseWorkDetailToTasks(projectToUpdate.workDetail);
    }
    setTempProjectData(projectToUpdate);
    setIsUpdateProgressOpen(true);
  };

  const handleTempTaskUpdate = (taskIndex, delta, isExtra = false) => {
    const taskType = isExtra ? 'extraTasks' : 'tasks';
    const newTasks = [...tempProjectData[taskType]];
    const task = { ...newTasks[taskIndex] };
    const newCount = Math.max(0, Math.min(task.total, task.completed + delta));
    task.completed = newCount;
    if (task.completed === task.total) task.status = 'Completed';
    else if (task.completed > 0) task.status = 'In Progress';
    else task.status = 'Pending';
    newTasks[taskIndex] = task;
    setTempProjectData({ ...tempProjectData, [taskType]: newTasks });
  };

  const handleProgressSubmit = async () => {
    try {
      const id = tempProjectData._id || tempProjectData.id;
      const response = await fetch(`http://localhost:45000/api/clients/${id}/tasks`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks: tempProjectData.tasks,
          extraTasks: tempProjectData.extraTasks
        })
      });
      const result = await response.json();
      if (result.success) {
        setProjects(prevProjects => prevProjects.map(p =>
          (p._id || p.id) === (tempProjectData._id || tempProjectData.id) ? result.data : p
        ));
        setIsUpdateProgressOpen(false);
        setTempProjectData(null);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleClientDetailsSubmit = async (clientData) => {
    try {
      const response = await fetch(`http://localhost:45000/api/clients/${clientId}`, {
        method: 'PUT',
        headers: getRequestHeaders(),
        body: JSON.stringify(clientData)
      });
      const result = await response.json();
      if (result.success) {
        setProjects([result.data]);
        setIsEditClientOpen(false);
        alert('Client details updated successfully');
      } else {
        alert(result.message || 'Failed to update client details');
      }
    } catch (error) {
      console.error('Error updating client details:', error);
      alert('Failed to update client details');
    }
  };

  const handleProjectDetailsSubmit = async (projectData) => {
    try {
      const response = await fetch(`http://localhost:45000/api/clients/${clientId}`, {
        method: 'PUT',
        headers: getRequestHeaders(),
        body: JSON.stringify(projectData)
      });
      const result = await response.json();
      if (result.success) {
        const updatedClient = result.data;
        if (!updatedClient.tasks || updatedClient.tasks.length === 0) {
          updatedClient.tasks = parseWorkDetailToTasks(updatedClient.workDetail);
        }
        setProjects([updatedClient]);
        setIsEditProjectOpen(false);
        alert('Project details updated successfully');
      } else {
        alert(result.message || 'Failed to update project details');
      }
    } catch (error) {
      console.error('Error updating project details:', error);
      alert('Failed to update project details');
    }
  };

  const handleRenewPackage = async () => {
    if (!renewFormData.package || !renewFormData.totalAmount || !renewFormData.deadline) {
      alert('Please fill all required fields');
      return;
    }
    try {
      const id = clientId;
      const response = await fetch(`http://localhost:45000/api/clients/${id}/renew`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(renewFormData)
      });
      const result = await response.json();
      if (result.success) {
        setProjects([result.data]);
        setIsRenewModalOpen(false);
        setRenewModalData({
          package: '',
          workDetail: '',
          totalAmount: '',
          startDate: new Date().toISOString().split('T')[0],
          deadline: ''
        });
        alert('Package renewed successfully for the next month!');
      }
    } catch (error) {
      console.error('Error renewing package:', error);
      alert('Failed to renew package');
    }
  };

  const openRenewModal = (project) => {
    setRenewModalData({
      package: project.package || '',
      workDetail: project.workDetail || '',
      totalAmount: project.totalPrice || '',
      startDate: new Date().toISOString().split('T')[0],
      deadline: '' // Admin should pick a new deadline
    });
    setIsRenewModalOpen(true);
  };

  const deleteExtraTask = async (projectId, taskIndex) => {
    if (window.confirm('Are you sure you want to delete this extra task?')) {
      const project = projects.find(p => (p._id || p.id) === projectId);
      const updatedExtraTasks = project.extraTasks.filter((_, idx) => idx !== taskIndex);
      try {
        const response = await fetch(`http://localhost:45000/api/clients/${projectId}/tasks`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tasks: project.tasks,
            extraTasks: updatedExtraTasks
          })
        });
        const result = await response.json();
        if (result.success) {
          setProjects(prevProjects => prevProjects.map(p => (p._id || p.id) === projectId ? result.data : p));
        }
      } catch (error) {
        console.error('Error deleting extra task:', error);
      }
    }
  };

  const addNewTask = async () => {
    if (!newTaskName.trim()) return;
    const project = projects.find(p => (p._id || p.id) === selectedProjectForTask._id || (p._id || p.id) === selectedProjectForTask.id);
    const total = parseInt(newTaskTotal) || 1;
    const taskType = isExtraTask ? 'extraTasks' : 'tasks';
    const newTask = { name: newTaskName, status: 'Pending', completed: 0, total: total, unit: isExtraTask ? 'Extra Task' : 'Task' };
    const updatedTasks = taskType === 'tasks' ? [...project.tasks, newTask] : project.tasks;
    const updatedExtraTasks = taskType === 'extraTasks' ? [...project.extraTasks, newTask] : project.extraTasks;
    try {
      const response = await fetch(`http://localhost:45000/api/clients/${project._id || project.id}/tasks`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: updatedTasks, extraTasks: updatedExtraTasks })
      });
      const result = await response.json();
      if (result.success) {
        setProjects(prevProjects => prevProjects.map(p => (p._id || p.id) === (project._id || project.id) ? result.data : p));
        setNewTaskName(''); setNewTaskTotal('1'); setIsExtraTask(false); setIsAddTaskModalOpen(false);
      }
    } catch (error) {
      console.error('Error adding new task:', error);
    }
  };

  const overallStats = useMemo(() => {
    if (!projects[0]) return {
      avgProgress: 0,
      tasksDone: 0,
      tasksPending: 0,
      totalRevenue: 0,
      totalPaid: 0,
      totalPending: 0,
      cycleCount: 0
    };

    let totalProgress = 0;
    let totalTasksDone = 0;
    let totalTasksPending = 0;
    let totalRevenue = 0;
    let totalPaid = 0;
    let totalPending = 0;

    const allCycles = [projects[0], ...(projects[0].history || [])];

    allCycles.forEach(cycle => {
      totalProgress += calculateProjectProgress(cycle);
      const allTasks = [...(cycle.tasks || []), ...(cycle.extraTasks || [])];
      allTasks.forEach(task => {
        if (task.status === 'Completed' || task.completed === task.total) totalTasksDone++;
        else totalTasksPending++;
      });
      totalRevenue += cycle.totalPrice || 0;
      totalPaid += cycle.paidAmount || 0;
      totalPending += cycle.pendingAmount || 0;
    });

    return {
      avgProgress: allCycles.length > 0 ? Math.round(totalProgress / allCycles.length) : 0,
      tasksDone: totalTasksDone,
      tasksPending: totalTasksPending,
      totalRevenue,
      totalPaid,
      totalPending,
      cycleCount: allCycles.length
    };
  }, [projects]);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12 pb-20">
      {/* Top Header Section */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={handleBack} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl text-gray-500 transition-colors">
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-600 border border-blue-500/20">
                {projects[0]?.department || 'DEPARTMENT'}
              </span>
              {projects[0]?.package && (
                <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-purple-500/10 text-purple-600 border border-purple-500/20">
                  {projects[0].package}
                </span>
              )}
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${projects[0]?.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                }`}>
                {projects[0]?.status || 'STATUS'}
              </span>
            </div>
          </div>
          {projects.length > 0 && (
            <div className="flex flex-wrap sm:flex-row items-stretch sm:items-center gap-3 w-full justify-end">
              <button
                onClick={() => setIsEditClientOpen(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-bold text-sm transition-all hover:bg-gray-50 dark:hover:bg-white/10 w-full md:w-auto"
              >
                <User size={18} />
                <span className="whitespace-nowrap">Edit Client</span>
              </button>

              <button
                onClick={() => setIsEditProjectOpen(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm transition-all shadow-lg shadow-purple-600/20 w-full md:w-auto"
              >
                <Edit3 size={18} />
                <span className="whitespace-nowrap">Edit Project</span>
              </button>

              {/* Delay Work Download Section */}
              <div className="flex flex-wrap sm:flex-row items-stretch sm:items-center gap-2 w-full">
                <input
                  type="date"
                  value={delayWorkStartDate}
                  onChange={(e) => setDelayWorkStartDate(e.target.value)}
                  className="bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all w-full sm:w-auto"
                  placeholder="Start Date"
                />
                <input
                  type="date"
                  value={delayWorkEndDate}
                  onChange={(e) => setDelayWorkEndDate(e.target.value)}
                  className="bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all w-full sm:w-auto"
                  placeholder="End Date"
                />
                <button
                  onClick={() => downloadDelayWork(clientId, delayWorkStartDate, delayWorkEndDate)}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm transition-all shadow-lg shadow-purple-600/20 w-full sm:w-auto"
                >
                  <Download size={18} />
                  <span className="whitespace-nowrap">Download Daily Work</span>
                </button>
              </div>

              <div className="relative w-full md:w-auto">
                <button
                  onClick={() => setAllProjectsMenuOpen(!allProjectsMenuOpen)}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/20 w-full"
                >
                  <Download size={18} />
                  <span className="whitespace-nowrap">All Projects Invoice</span>
                  <ChevronDown size={18} />
                </button>
                <AnimatePresence>
                  {allProjectsMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full right-0 mt-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl shadow-lg z-10 overflow-hidden min-w-[200px]"
                    >
                      <button
                        onClick={async () => {
                          await downloadAllProjectsInvoice(projects, projects[0], true);
                          setAllProjectsMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                      >
                        With GST (18%)
                      </button>
                      <button
                        onClick={async () => {
                          await downloadAllProjectsInvoice(projects, projects[0], false);
                          setAllProjectsMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                      >
                        Without GST
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative w-full md:w-auto">
                <button
                  onClick={() => setCurrentProjectMenuOpen(!currentProjectMenuOpen)}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-600/20 w-full"
                >
                  <Download size={18} />
                  <span className="whitespace-nowrap">Current Project Invoice</span>
                  <ChevronDown size={18} />
                </button>
                <AnimatePresence>
                  {currentProjectMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full right-0 mt-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl shadow-lg z-10 overflow-hidden min-w-[200px]"
                    >
                      <button
                        onClick={async () => {
                          await downloadInvoice(projects[0], projects[0], true);
                          setCurrentProjectMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                      >
                        With GST (18%)
                      </button>
                      <button
                        onClick={async () => {
                          await downloadInvoice(projects[0], projects[0], false);
                          setCurrentProjectMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                      >
                        Without GST
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
        <h1 className="text-5xl font-black text-blue-600 dark:text-blue-500 lowercase tracking-tight">
          {projects[0]?.name}
        </h1>
      </div>

      {/* Main Content: Current Project */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-black text-gray-500 uppercase tracking-widest">Loading Project Details...</p>
        </div>
      ) : (
        <div className="space-y-20">
          {/* Overall Financial & Progress Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Overall Progress</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-blue-500">{overallStats.avgProgress}%</span>
                <span className="text-[10px] font-bold text-gray-400 mb-1 uppercase">Across {overallStats.cycleCount} Months</span>
              </div>
            </div>
            <div className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Revenue</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-gray-900 dark:text-white">₹{overallStats.totalRevenue.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Received</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-emerald-500">₹{overallStats.totalPaid.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Pending</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-rose-500">₹{overallStats.totalPending.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <ProjectSection
            project={projects[0]}
            client={projects[0]}
            onUpdate={openUpdateModal}
            onRenew={openRenewModal}
            onAddTask={(p) => {
              setSelectedProjectForTask(p);
              setIsAddTaskModalOpen(true);
            }}
            onDeleteExtraTask={deleteExtraTask}
          />

          {/* History */}
          {projects[0].history && projects[0].history.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">Past Cycles</h3>
              {projects[0].history.map((cycle, index) => (
                <ProjectSection
                  key={index}
                  project={cycle}
                  client={projects[0]}
                  isHistory={true}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Update Progress Modal */}
      <AnimatePresence>
        {isEditClientOpen && (
          <EditClientModal
            isOpen={isEditClientOpen}
            onClose={() => setIsEditClientOpen(false)}
            client={projects[0]}
            onSave={handleClientDetailsSubmit}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditProjectOpen && (
          <EditProjectModal
            isOpen={isEditProjectOpen}
            onClose={() => setIsEditProjectOpen(false)}
            project={projects[0]}
            onSave={handleProjectDetailsSubmit}
          />
        )}
      </AnimatePresence>

      {/* Update Progress Modal */}
      <AnimatePresence>
        {isUpdateProgressOpen && tempProjectData && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsUpdateProgressOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl bg-white dark:bg-[#030303] rounded-3xl border border-gray-200 dark:border-white/10 p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
                  <ListChecks className="text-blue-500" /> Update Progress
                </h3>
                <button onClick={() => setIsUpdateProgressOpen(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-gray-500">
                  <X size={20} />
                </button>
              </div>

              {/* Primary Tasks */}
              <div className="space-y-4 mb-8">
                <h4 className="text-sm font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-blue-500" /> Primary Tasks
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tempProjectData.tasks?.map((task, index) => (
                    <div key={index} className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10">
                      <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">{task.name}</p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleTempTaskUpdate(index, -1)}
                          disabled={task.completed <= 0}
                          className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold hover:bg-blue-200 dark:hover:bg-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-lg font-black text-gray-900 dark:text-white flex-1 text-center">{task.completed} / {task.total}</span>
                        <button
                          onClick={() => handleTempTaskUpdate(index, 1)}
                          disabled={task.completed >= task.total}
                          className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Extra Tasks */}
              {tempProjectData.extraTasks && tempProjectData.extraTasks.length > 0 && (
                <div className="space-y-4 mb-8">
                  <h4 className="text-sm font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles size={16} className="text-emerald-500" /> Extra Tasks
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {tempProjectData.extraTasks?.map((task, index) => (
                      <div key={index} className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                        <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200 mb-2">{task.name}</p>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleTempTaskUpdate(index, -1, true)}
                            disabled={task.completed <= 0}
                            className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold hover:bg-emerald-200 dark:hover:bg-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="text-lg font-black text-gray-900 dark:text-white flex-1 text-center">{task.completed} / {task.total}</span>
                          <button
                            onClick={() => handleTempTaskUpdate(index, 1, true)}
                            disabled={task.completed >= task.total}
                            className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-8">
                <button onClick={() => setIsUpdateProgressOpen(false)} className="flex-1 px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-white/5 transition-all">Cancel</button>
                <button
                  onClick={handleProgressSubmit}
                  className="flex-1 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Renew Package Modal */}
      <AnimatePresence>
        {isRenewModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsRenewModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl bg-white dark:bg-[#030303] rounded-3xl border border-gray-200 dark:border-white/10 p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
                  <RefreshCw className="text-purple-500" /> Renew for Next Month
                </h3>
                <button onClick={() => setIsRenewModalOpen(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-gray-500">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Package Name</label>
                  <input
                    type="text"
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-purple-500 outline-none transition-all placeholder:text-gray-400"
                    placeholder="Package name"
                    value={renewFormData.package}
                    onChange={(e) => setRenewModalData({ ...renewFormData, package: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Work Detail</label>
                  <textarea
                    rows={4}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-purple-500 outline-none transition-all placeholder:text-gray-400"
                    placeholder="Work details"
                    value={renewFormData.workDetail}
                    onChange={(e) => setRenewModalData({ ...renewFormData, workDetail: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Total Amount (₹)</label>
                    <input
                      type="number"
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-purple-500 outline-none transition-all placeholder:text-gray-400"
                      placeholder="Total amount"
                      value={renewFormData.totalAmount}
                      onChange={(e) => setRenewModalData({ ...renewFormData, totalAmount: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Deadline</label>
                    <input
                      type="date"
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-purple-500 outline-none transition-all"
                      value={renewFormData.deadline}
                      onChange={(e) => setRenewModalData({ ...renewFormData, deadline: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setIsRenewModalOpen(false)} className="flex-1 px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-white/5 transition-all">Cancel</button>
                <button
                  onClick={handleRenewPackage}
                  className="flex-1 px-6 py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20"
                >
                  Renew Package
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Task Modal */}
      <AnimatePresence>
        {isAddTaskModalOpen && selectedProjectForTask && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddTaskModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#030303] rounded-3xl border border-gray-200 dark:border-white/10 p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
                  <Plus className="text-blue-500" /> Add New Task
                </h3>
                <button onClick={() => setIsAddTaskModalOpen(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-gray-500">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Task Name</label>
                  <input
                    type="text"
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                    placeholder="Task name"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Total Quantity</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                    placeholder="Total"
                    value={newTaskTotal}
                    onChange={(e) => setNewTaskTotal(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10">
                  <input
                    type="checkbox"
                    id="isExtraTask"
                    checked={isExtraTask}
                    onChange={(e) => setIsExtraTask(e.target.checked)}
                    className="w-5 h-5 rounded bg-blue-100 dark:bg-blue-500/20 text-blue-600 border-blue-300 focus:ring-blue-500"
                  />
                  <label htmlFor="isExtraTask" className="text-sm font-bold text-gray-700 dark:text-gray-300">Mark as Extra Task</label>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setIsAddTaskModalOpen(false)} className="flex-1 px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-white/5 transition-all">Cancel</button>
                <button
                  onClick={addNewTask}
                  className="flex-1 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                >
                  Add Task
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default ClientProjects;
