import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  IndianRupee,
  CreditCard,
  FileText,
  Clock,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  X,
  Upload,
  CheckCircle2,
  TrendingUp,
  LogIn,
  LogOut,
  RotateCcw,
  AlertTriangle,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  Lock,
  Shield,
  Check,
  HandCoins,
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  History,
  Receipt
} from 'lucide-react';
import StaffPerformance from './StaffPerformance';
import { 
  getAllStaff, 
  getStaffById, 
  clockOutAllStaff, 
  updateStaffAccess, 
  addStaffAdvance, 
  deleteStaffAdvance, 
  updateStaffAdvance, 
  BASE_URL 
} from '../api';
import { getStaffAdvanceSummary } from '../utils/salaryCalculator';

const PREDEFINED_ROLES = ['HR', 'Client Support', 'Admin', 'Data Analyst', 'Sales Team'];

const EditStaffModal = ({ isOpen, onClose, staffMember, onUpdate }) => {
  const [formData, setFormData] = useState({
    monthlySalary: '',
    department: '',
    accountHolder: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    joiningDate: '',
    salaryStatus: '',
    jobType: '',
    role: '',
    reportingPerson: '',
    newDocumentName: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (staffMember) {
      setFormData({
        monthlySalary: staffMember.monthlySalary,
        department: staffMember.department,
        accountHolder: staffMember.accountHolder || '',
        accountNumber: staffMember.accountNumber || '',
        ifscCode: staffMember.ifscCode || '',
        bankName: staffMember.bankName || '',
        joiningDate: staffMember.joiningDate,
        salaryStatus: staffMember.salaryStatus,
        jobType: staffMember.jobType,
        role: staffMember.role || 'Employee',
        reportingPerson: Array.isArray(staffMember.reportingPerson) ? staffMember.reportingPerson.join(', ') : (staffMember.reportingPerson || ''),
        newDocumentName: ''
      });
      setSelectedFile(null);
    }
  }, [staffMember]);

  if (!isOpen || !staffMember) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const { newDocumentName, ...rest } = formData;

    // Create the updated object
    const updatedData = {
      ...rest,
      reportingPerson: typeof rest.reportingPerson === 'string'
        ? rest.reportingPerson.split(',').map(s => s.trim()).filter(Boolean)
        : (rest.reportingPerson || []),
      documents: staffMember.documents
    };

    // Add new document if provided
    if (newDocumentName || selectedFile) {
      const docName = newDocumentName || (selectedFile ? selectedFile.name : 'New Document');
      updatedData.documents = [...staffMember.documents, { name: docName, path: '' }];
    }

    onUpdate(staffMember.id, updatedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-2xl glass rounded-3xl border border-white/10 p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Edit3 className="text-blue-500" /> Edit Staff: {staffMember.name}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full text-gray-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Read-only info */}
            <div className="md:col-span-2 p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Non-editable Info</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Name</p>
                  <p className="text-sm text-gray-900 dark:text-white font-bold">{staffMember.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-sm text-gray-900 dark:text-white font-bold">{staffMember.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="text-sm text-gray-900 dark:text-white font-bold">{staffMember.phone}</p>
                </div>
              </div>
            </div>


            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Department</label>
              <select
                className="w-full bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all cursor-pointer"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <option value="Development" className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white">Development</option>
                <option value="Designing & Editing" className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white">Designing & Editing</option>
                <option value="Marketing" className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white">Marketing</option>
                <option value="Accounts" className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white">Accounts</option>
                <option value="HR" className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white">HR</option>
                <option value="Sales Team" className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white">Sales Team</option>
                <option value="Other" className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white">Other</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Job Type</label>
              <select
                className="w-full bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                value={formData.jobType}
                onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
              >
                <option value="Permanent" className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white">Permanent</option>
                <option value="Intern" className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white">Intern</option>
                <option value="Part-time" className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white">Part-time</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Employee Role</label>
              {(() => {
                const isCustomRole = formData.role && !PREDEFINED_ROLES.includes(formData.role);
                return (
                  <div className="space-y-2">
                    <select
                      className="w-full bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all cursor-pointer"
                      value={isCustomRole ? 'Other' : formData.role}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'Other') {
                          setFormData({ ...formData, role: '' });
                        } else {
                          setFormData({ ...formData, role: val });
                        }
                      }}
                    >
                      <option value="HR" className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white">HR</option>
                      <option value="Client Support" className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white">Client Support</option>
                      <option value="Admin" className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white">Admin</option>
                      <option value="Data Analyst" className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white">Data Analyst</option>
                      <option value="Sales Team" className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white">Sales Team</option>
                      <option value="Other" className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white">Other (Type custom role)</option>
                    </select>
                    {(isCustomRole || formData.role === '' || !PREDEFINED_ROLES.includes(formData.role)) && (
                      <input
                        type="text"
                        className="w-full bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                        placeholder="Type custom role..."
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      />
                    )}
                  </div>
                );
              })()}
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Reporting Person (Employee ID)</label>
              <input
                type="text"
                className="w-full bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                placeholder="e.g. RW-1001"
                value={formData.reportingPerson}
                onChange={(e) => setFormData({ ...formData, reportingPerson: e.target.value })}
              />
            </div>


            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                Joining Date
              </label>
              <input
                type="date"
                className="w-full bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                value={formData.joiningDate ? formData.joiningDate.slice(0, 10) : ''}
                onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
              />
            </div>

            <div className="md:col-span-2 p-6 bg-black/5 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 space-y-4">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <CreditCard size={14} /> Account Details
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Full Name (on Passbook)</label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    className="w-full bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                    value={formData.accountHolder}
                    onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Account Number</label>
                  <input
                    type="text"
                    placeholder="Enter account number"
                    className="w-full bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">IFSC Code</label>
                  <input
                    type="text"
                    placeholder="Enter IFSC code"
                    className="w-full bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                    value={formData.ifscCode}
                    onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Bank Name</label>
                  <input
                    type="text"
                    placeholder="Enter bank name"
                    className="w-full bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Update Documents</label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative group">
                  <input
                    type="file"
                    id="doc-upload"
                    className="hidden"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    accept="image/*,.pdf"
                  />
                  <label
                    htmlFor="doc-upload"
                    className="flex flex-col items-center justify-center gap-2 p-6 bg-black/5 dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 hover:border-blue-500/50 transition-all group-hover:bg-black/10 dark:group-hover:bg-white/10"
                  >
                    <div className="p-3 rounded-full bg-blue-500/10 text-blue-500">
                      <Upload size={24} />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {selectedFile ? selectedFile.name : 'Upload Document Image/PDF'}
                    </span>
                  </label>
                </div>

                <div className="flex flex-col justify-center">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Or enter document name</p>
                  <input
                    type="text"
                    placeholder="e.g. Health Certificate"
                    className="w-full bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                    value={formData.newDocumentName}
                    onChange={(e) => setFormData({ ...formData, newDocumentName: e.target.value })}
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mb-2 flex items-center gap-2">
                  <FileText size={14} /> Current Documents:
                </p>
                <div className="flex flex-wrap gap-2">
                  {(staffMember.documents || []).map((doc, i) => (
                    <span key={i} className="text-[10px] bg-black/5 dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded px-2 py-1 text-gray-600 dark:text-gray-300">
                      {typeof doc === 'string' ? doc : doc.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
            >
              Update Staff Member
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export const AVAILABLE_FEATURES = [
  {
    id: 'dashboard',
    name: 'Dashboard & Attendance',
    description: 'View basic staff dashboard, task list, clock in / clock out',
    category: 'Core',
    color: 'emerald'
  },
  {
    id: 'progress',
    name: 'Progress Report',
    description: 'View personal performance, satisfaction history & monthly stats',
    category: 'Core',
    color: 'blue'
  },
  {
    id: 'clients',
    name: 'Clients Section',
    description: 'View client list, access client profile pages and project history',
    category: 'Clients',
    color: 'purple'
  },
  {
    id: 'visitingCards',
    name: 'Visiting Cards Section',
    description: 'Scan new cards and view company visiting cards directory',
    category: 'Sales & Field',
    color: 'amber'
  },
  {
    id: 'clientTaskUpdate',
    name: 'Client Task Update',
    description: 'Submit daily work reports directly against client accounts',
    category: 'Clients',
    color: 'orange'
  },
  {
    id: 'hearing',
    name: 'Hearing Management',
    description: 'Manage staff hearing disputes, resolutions and logs',
    category: 'HR',
    color: 'violet'
  },
  {
    id: 'admissions',
    name: 'Student Admissions',
    description: 'Access student admissions CRM, leads and counseling records',
    category: 'Counseling',
    color: 'cyan'
  },
  {
    id: 'sales',
    name: 'Sales Log & Team',
    description: 'Submit daily sales logs, field visit reports and tracking',
    category: 'Sales & Field',
    color: 'green'
  },
  {
    id: 'blogs',
    name: 'Blog Management',
    description: 'Create, edit and manage digital marketing blogs and posts',
    category: 'Marketing',
    color: 'pink'
  },
  {
    id: 'satisfactionUpdate',
    name: 'Staff Rating & Satisfaction',
    description: 'Rate team performance (Green/Yellow/Red) and leave feedback',
    category: 'Management',
    color: 'rose'
  }
];

export const getDefaultPermissionsForRole = (role = '', department = '', employeeId = '') => {
  const r = (role || '').toLowerCase();
  const d = (department || '').toLowerCase();
  const perms = ['dashboard', 'progress'];

  if (['admin', 'data analyst'].includes(r) && employeeId !== 'RW-4559') {
    perms.push('clients', 'visitingCards', 'clientTaskUpdate');
  }
  if (r === 'hr') perms.push('hearing');
  if (r === 'counselor') perms.push('admissions');
  if (r === 'sales team' || r === 'sales') perms.push('sales', 'visitingCards');
  if (d.includes('marketing') || r.includes('marketing')) perms.push('blogs');
  if (['RW-9752', 'RW-1702'].includes(employeeId)) perms.push('satisfactionUpdate');

  return perms;
};

const ManageAccessModal = ({ isOpen, onClose, staffMember, onSaveSuccess }) => {
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (staffMember) {
      if (Array.isArray(staffMember.permissions) && staffMember.permissions.length > 0) {
        setSelectedPermissions(staffMember.permissions);
      } else {
        setSelectedPermissions(getDefaultPermissionsForRole(staffMember.role, staffMember.department, staffMember.employeeId));
      }
      setNewPassword('');
      setShowPassword(false);
      setSuccessMsg('');
      setErrorMsg('');
    }
  }, [staffMember]);

  if (!isOpen || !staffMember) return null;

  const togglePermission = (permId) => {
    setSelectedPermissions(prev =>
      prev.includes(permId) ? prev.filter(p => p !== permId) : [...prev, permId]
    );
  };

  const handleGrantAll = () => {
    setSelectedPermissions(AVAILABLE_FEATURES.map(f => f.id));
  };

  const handleResetToRoleDefault = () => {
    setSelectedPermissions(getDefaultPermissionsForRole(staffMember.role, staffMember.department, staffMember.employeeId));
  };

  const handleClearAll = () => {
    setSelectedPermissions([]);
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$';
    let pass = 'RW@';
    for (let i = 0; i < 5; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(pass);
    setShowPassword(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const payload = {
        permissions: selectedPermissions
      };
      if (newPassword.trim()) {
        payload.password = newPassword.trim();
      }

      const res = await updateStaffAccess(staffMember._id || staffMember.id, payload);
      if (res && res.success) {
        setSuccessMsg('Access permissions & security updated successfully!');
        if (onSaveSuccess) onSaveSuccess(staffMember._id || staffMember.id, selectedPermissions);
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setErrorMsg(res?.message || 'Failed to update access');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update access permissions');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="relative w-full max-w-3xl glass rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[92vh]"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6 border-b border-gray-100 dark:border-white/10 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
              <ShieldCheck size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                  Access & Security Controls
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  {staffMember.employeeId || 'Staff'}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
                Configure module access permissions and update login password for <span className="font-bold text-gray-800 dark:text-gray-200">{staffMember.name}</span> ({staffMember.role} • {staffMember.department})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-bold flex items-center gap-2">
            <AlertTriangle size={18} />
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-bold flex items-center gap-2">
            <CheckCircle2 size={18} />
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Password Management */}
          <div className="p-5 sm:p-6 bg-black/5 dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 dark:border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Lock size={18} className="text-amber-500" />
                <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                  Update Staff Password
                </h4>
              </div>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20 w-fit">
                Only Admin can update password
              </span>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Enter a new password for this staff ID if you wish to change it. Leave blank to keep their current password.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password (leave blank to keep unchanged)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-2xl pl-4 pr-12 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-indigo-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                type="button"
                onClick={handleGeneratePassword}
                className="px-4 py-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-2xl text-amber-600 dark:text-amber-400 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shrink-0"
              >
                <Sparkles size={16} />
                Generate Password
              </button>
            </div>
          </div>

          {/* Section 2: Granular Feature Access Permissions */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-indigo-500" />
                <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                  Granted Feature Permissions ({selectedPermissions.length}/{AVAILABLE_FEATURES.length})
                </h4>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleGrantAll}
                  className="px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-bold transition-all"
                >
                  Grant All
                </button>
                <button
                  type="button"
                  onClick={handleResetToRoleDefault}
                  className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-bold transition-all"
                >
                  Role Defaults
                </button>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold transition-all"
                >
                  Revoke All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {AVAILABLE_FEATURES.map((feature) => {
                const isSelected = selectedPermissions.includes(feature.id);
                return (
                  <div
                    key={feature.id}
                    onClick={() => togglePermission(feature.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/40 shadow-md shadow-indigo-500/5'
                        : 'bg-black/5 dark:bg-white/5 border-gray-200 dark:border-white/5 opacity-60 hover:opacity-90'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'border-2 border-gray-300 dark:border-white/20 bg-white/50 dark:bg-black/30'
                      }`}
                    >
                      {isSelected && <Check size={14} strokeWidth={3} />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`text-sm font-black ${isSelected ? 'text-indigo-600 dark:text-indigo-300' : 'text-gray-900 dark:text-white'}`}>
                          {feature.name}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {feature.category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium line-clamp-2">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-2xl border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  Save Access & Security
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Advance Payment Management Modal
const ManageAdvanceModal = ({ isOpen, onClose, staffMember, onAdvanceUpdated }) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('Emergency');
  const [customReason, setCustomReason] = useState('');
  const [mode, setMode] = useState('online');
  const [method, setMethod] = useState('phonepe');
  const [utrNumber, setUtrNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  if (!isOpen || !staffMember) return null;

  const advanceSummary = getStaffAdvanceSummary(staffMember);
  const REASON_PRESETS = ['Emergency', 'Festival / Personal', 'Medical', 'Travel / Transport', 'Salary Advance', 'Other'];
  const QUICK_AMOUNTS = [1000, 2000, 3000, 5000, 10000];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid advance amount greater than 0.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccessMsg('');

    try {
      const finalReason = reason === 'Other' ? (customReason.trim() || 'Advance Pay') : reason;
      const payload = {
        amount: numAmount,
        date,
        reason: finalReason,
        mode,
        method: mode === 'cash' ? 'cash' : method,
        utrNumber: mode === 'online' ? utrNumber : '',
        notes
      };

      const res = await addStaffAdvance(staffMember._id || staffMember.id, payload);
      if (res && res.success) {
        setSuccessMsg(`Advance payment of ₹${numAmount.toLocaleString('en-IN')} added successfully!`);
        setAmount('');
        setCustomReason('');
        setUtrNumber('');
        setNotes('');
        onAdvanceUpdated(res.data);
      } else {
        setError(res?.message || 'Failed to record advance payment.');
      }
    } catch (err) {
      console.error('Error adding advance:', err);
      setError(err?.message || 'Server error while adding advance.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (advId) => {
    if (!window.confirm('Are you sure you want to delete this advance payment record?')) return;
    setDeletingId(advId);
    try {
      const res = await deleteStaffAdvance(staffMember._id || staffMember.id, advId);
      if (res && res.success) {
        onAdvanceUpdated(res.data);
      } else {
        alert(res?.message || 'Failed to delete advance payment');
      }
    } catch (err) {
      console.error('Error deleting advance:', err);
      alert('Network error while deleting advance');
    } finally {
      setDeletingId(null);
    }
  };

  const sortedAdvances = [...(staffMember.advances || [])].sort((a, b) => {
    const timeA = new Date(a.date || a.createdAt).getTime();
    const timeB = new Date(b.date || b.createdAt).getTime();
    return timeB - timeA;
  });

  return (
    <div className="fixed inset-0 z-[115] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-3xl bg-white dark:bg-[#0c0c0e] rounded-3xl border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[92vh] space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/25">
              <HandCoins size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-gray-900 dark:text-white">Advance Payments</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  {staffMember.employeeId || 'Staff'}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Manage advance pay and view settlement history for <strong className="text-gray-800 dark:text-gray-200">{staffMember.name}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-2xl text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">Active Advance Balance</span>
              <Wallet size={16} className="text-amber-600" />
            </div>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
              ₹{advanceSummary.pendingBalance.toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
              {advanceSummary.pendingCount} pending advance(s)
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">Total Given</span>
              <ArrowDownRight size={16} className="text-blue-600" />
            </div>
            <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
              ₹{advanceSummary.totalGiven.toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Lifetime advance amount</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Total Settled</span>
              <CheckCircle2 size={16} className="text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              ₹{advanceSummary.totalSettled.toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Deducted from past payouts</p>
          </div>
        </div>

        {/* Give Advance Form */}
        <form onSubmit={handleSubmit} className="p-5 rounded-3xl bg-black/5 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2">
              <HandCoins size={16} className="text-amber-500" /> Give New Advance Pay
            </h3>
            <span className="text-[11px] font-semibold text-gray-400">Auto-links to salary deduction</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Amount */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Advance Amount (₹) *</label>
              <div className="relative">
                <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 5000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm font-bold text-gray-900 dark:text-white focus:border-amber-500 outline-none transition-all"
                />
              </div>
              {/* Quick Amount Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {QUICK_AMOUNTS.map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(String(amt))}
                    className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 transition-all"
                  >
                    +₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Date Given *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-2.5 text-sm font-bold text-gray-900 dark:text-white focus:border-amber-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Reason / Purpose</label>
            <div className="flex flex-wrap gap-1.5">
              {REASON_PRESETS.map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    reason === r
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
                      : 'bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/5'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            {reason === 'Other' && (
              <input
                type="text"
                placeholder="Specify reason..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-2 text-sm text-gray-900 dark:text-white focus:border-amber-500 outline-none transition-all mt-2"
              />
            )}
          </div>

          {/* Payment Mode & Method */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Mode</label>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setMode('online')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    mode === 'online' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Online
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('cash'); setMethod('cash'); }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    mode === 'cash' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Cash
                </button>
              </div>
            </div>

            {mode === 'online' && (
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Method</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 dark:text-white focus:border-amber-500 outline-none cursor-pointer"
                >
                  <option value="phonepe">PhonePe</option>
                  <option value="paytm">Paytm</option>
                  <option value="google_pay">Google Pay</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="other">Other UPI</option>
                </select>
              </div>
            )}

            {mode === 'online' && (
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">UTR / Ref No. (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. UPI Ref / UTR"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:border-amber-500 outline-none"
                />
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold">
              <AlertTriangle size={15} /> {error}
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold">
              <CheckCircle2 size={15} /> {successMsg}
            </div>
          )}

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={submitting || !amount || Number(amount) <= 0}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-500/25 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Recording...
                </>
              ) : (
                <>
                  <HandCoins size={14} /> Record Advance Payment
                </>
              )}
            </button>
          </div>
        </form>

        {/* Advances History & Settlement Breakout */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2">
              <History size={16} className="text-indigo-500" /> Advance Records & Settlements
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {sortedAdvances.length} Total Record(s)
            </span>
          </div>

          {sortedAdvances.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-gray-200 dark:border-white/10 bg-black/5 dark:bg-white/[0.02]">
              <HandCoins size={32} className="mx-auto text-gray-400 mb-2 opacity-60" />
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">No advance payments recorded yet</p>
              <p className="text-xs text-gray-400 mt-0.5">Use the form above to record an advance given to this employee.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {sortedAdvances.map((adv) => {
                const isSettled = adv.status === 'Settled';
                const advDateStr = adv.date ? new Date(adv.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
                return (
                  <div
                    key={adv._id || adv.createdAt}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSettled
                        ? 'bg-emerald-500/[0.03] border-emerald-500/20'
                        : 'bg-amber-500/[0.04] border-amber-500/25'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-xl shrink-0 ${isSettled ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                        {isSettled ? <CheckCircle2 size={18} /> : <HandCoins size={18} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-base font-black text-gray-900 dark:text-white">
                            ₹{(adv.amount || 0).toLocaleString('en-IN')}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                            isSettled
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                          }`}>
                            {isSettled ? `Settled in ${adv.settledInMonth || 'Salary'}` : 'Pending (Active)'}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            • {adv.reason || 'Advance Pay'}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} /> {advDateStr}
                          </span>
                          <span className="capitalize">
                            • Mode: <strong>{adv.mode || 'Online'}</strong> ({adv.method || 'PhonePe'})
                          </span>
                          {adv.utrNumber && (
                            <span className="font-mono text-[11px] bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded">
                              UTR: {adv.utrNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {!isSettled && (
                        <button
                          onClick={() => handleDelete(adv._id)}
                          disabled={deletingId === adv._id}
                          className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                          title="Delete Advance Record"
                        >
                          {deletingId === adv._id ? (
                            <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-gray-100 dark:border-white/10">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-gray-700 dark:text-gray-200 text-xs font-bold transition-all"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Calculate payout salary based on actual hours worked from clock records
const STANDARD_HOURS_PER_DAY = 8.5;
const DAYS_IN_MONTH = 30;
const EXPECTED_MONTHLY_HOURS = STANDARD_HOURS_PER_DAY * DAYS_IN_MONTH; // 255 hours

const CALCULATION_START_DATE = new Date(2026, 6, 1); // July 1, 2026

const get30DaySequenceDates = (year, monthIndex, createdAt = null) => {
  const monthOffset = (year - 2026) * 12 + (monthIndex - 6);
  if (monthOffset < 0) return [];

  const cycleStart = new Date(CALCULATION_START_DATE);
  cycleStart.setDate(cycleStart.getDate() + monthOffset * 30);

  const dates = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(cycleStart);
    d.setDate(d.getDate() + i);
    dates.push(d);
  }

  let filtered = dates;
  if (createdAt) {
    const created = new Date(createdAt);
    created.setHours(0, 0, 0, 0);
    filtered = filtered.filter(d => {
      const copy = new Date(d);
      copy.setHours(0, 0, 0, 0);
      return copy >= created;
    });
  }

  return filtered;
};

const parseTotalHours = (totalHoursStr) => {
  if (!totalHoursStr || totalHoursStr === '-') return 0;
  let hours = 0;
  let minutes = 0;
  const hMatch = totalHoursStr.match(/(\d+)\s*h/i);
  const mMatch = totalHoursStr.match(/(\d+)\s*m/i);
  if (hMatch) hours = parseInt(hMatch[1], 10);
  if (mMatch) minutes = parseInt(mMatch[1], 10);
  return hours + (minutes / 60);
};

const getSalaryForDate = (staffInfo, date) => {
  const defaultSalary = staffInfo?.monthlySalary || 0;
  const defaultJobType = staffInfo?.jobType || '';
  if (!staffInfo?.salaryRevisions || staffInfo.salaryRevisions.length === 0) {
    return { salary: defaultSalary, jobType: defaultJobType };
  }

  const d = new Date(date);
  d.setHours(23, 59, 59, 999);

  let activeSalary = defaultSalary;
  let activeJobType = defaultJobType;
  let found = false;

  for (let i = staffInfo.salaryRevisions.length - 1; i >= 0; i--) {
    const rev = staffInfo.salaryRevisions[i];
    const revDate = new Date(rev.effectiveDate);
    revDate.setHours(0, 0, 0, 0);

    if (revDate <= d) {
      activeSalary = rev.monthlySalary;
      activeJobType = rev.jobType || defaultJobType;
      found = true;
      break;
    }
  }

  if (!found && staffInfo.salaryRevisions.length > 0) {
    activeSalary = staffInfo.salaryRevisions[0].monthlySalary;
    activeJobType = staffInfo.salaryRevisions[0].jobType || defaultJobType;
  }

  return { salary: activeSalary, jobType: activeJobType };
};

const calculatePayout = (staffInfo) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const createdAt = staffInfo.createdAt || staffInfo.joiningDate;
  const sequenceDates = get30DaySequenceDates(currentYear, currentMonth, createdAt);
  
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const validSequenceDates = sequenceDates.filter(d => d <= todayEnd);
  const seqDateStrings = new Set(validSequenceDates.map(d => d.toDateString()));

  const monthlyClockRecords = (staffInfo.clock || []).filter(record => {
    return seqDateStrings.has(new Date(record.date).toDateString());
  });

  const dailyHoursMap = {};
  const creditedDates = new Set();

  monthlyClockRecords.forEach(record => {
    const dStr = new Date(record.date).toDateString();
    const actualHrs = parseTotalHours(record.totalHours);
    let hrs = 0;
    if (actualHrs > 9) {
      hrs = 8.5 + (actualHrs - 9);
    } else if (actualHrs >= 8.5) {
      hrs = 8.5;
    } else {
      hrs = actualHrs;
    }
    dailyHoursMap[dStr] = hrs;
    creditedDates.add(dStr);
  });

  validSequenceDates.forEach(d => {
    const dStr = d.toDateString();
    if (d.getDay() === 0 && !creditedDates.has(dStr)) {
      dailyHoursMap[dStr] = STANDARD_HOURS_PER_DAY;
      creditedDates.add(dStr);
    }
  });

  (staffInfo.leaves || []).forEach(leave => {
    const ld = new Date(leave.date);
    const ldStr = ld.toDateString();
    if (seqDateStrings.has(ldStr) && !creditedDates.has(ldStr)) {
      dailyHoursMap[ldStr] = STANDARD_HOURS_PER_DAY;
      creditedDates.add(ldStr);
    }
  });

  (staffInfo.attendance || []).forEach(att => {
    if (att.status === 'On Leave') {
      const ad = new Date(att.date);
      const adStr = ad.toDateString();
      if (seqDateStrings.has(adStr) && !creditedDates.has(adStr)) {
        dailyHoursMap[adStr] = STANDARD_HOURS_PER_DAY;
        creditedDates.add(adStr);
      }
    }
  });

  const absentDays = validSequenceDates.filter(d => {
    if (d.getDay() === 0) return false;
    return !creditedDates.has(d.toDateString());
  });

  const halfDayRecords = (staffInfo.attendance || []).filter(att => {
    if (att.status !== 'Half-Day') return false;
    const ad = new Date(att.date);
    return seqDateStrings.has(ad.toDateString());
  });
  const halfDayLeaveUnits = Math.floor(halfDayRecords.length / 2);

  let casualLeaveUsed = false;

  if (absentDays.length > 0) {
    const casualLeaveDate = absentDays[0];
    const dStr = casualLeaveDate.toDateString();
    dailyHoursMap[dStr] = STANDARD_HOURS_PER_DAY;
    creditedDates.add(dStr);
    casualLeaveUsed = true;
  } else if (halfDayLeaveUnits > 0) {
    for (let i = 0; i < 2; i++) {
      const hdDate = new Date(halfDayRecords[i].date);
      const dStr = hdDate.toDateString();
      const clockRecord = monthlyClockRecords.find(
        r => new Date(r.date).toDateString() === dStr
      );
      const actualHrs = clockRecord ? parseTotalHours(clockRecord.totalHours) : 0;
      const halfTarget = STANDARD_HOURS_PER_DAY / 2;
      if (actualHrs < halfTarget) {
        dailyHoursMap[dStr] = (dailyHoursMap[dStr] || actualHrs) + (halfTarget - actualHrs);
      }
    }
    casualLeaveUsed = true;
  }

  let totalPayout = 0;
  let totalHoursWorked = 0;

  validSequenceDates.forEach(d => {
    const dStr = d.toDateString();
    const hrs = dailyHoursMap[dStr] || 0;
    totalHoursWorked += hrs;
    const { salary: daySalary } = getSalaryForDate(staffInfo, d);
    const dayHourlyRate = daySalary / EXPECTED_MONTHLY_HOURS;
    totalPayout += hrs * dayHourlyRate;
  });

  const payout = Math.round(totalPayout);
  const daysWorked = monthlyClockRecords.length;
  const fullLeavesCount = Math.max(0, absentDays.length - (casualLeaveUsed && absentDays.length > 0 ? 1 : 0));
  const baseSalary = staffInfo.monthlySalary || 0;
  const hourlyRate = baseSalary / EXPECTED_MONTHLY_HOURS;

  return {
    payout,
    totalHoursWorked: Math.round(totalHoursWorked * 100) / 100,
    daysWorked,
    hourlyRate: Math.round(hourlyRate * 100) / 100,
    fullLeaves: fullLeavesCount,
    halfDays: halfDayRecords.length,
    casualLeaveUsed
  };
};

// Helper functions for time calculation (keep these for backward compatibility)
const timeToMinutes = (timeStr) => {
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

const calculateTotalMinutesFromDuration = (durationStr) => {
  if (durationStr === '-') return 0;
  const match = durationStr.match(/(\d+)h (\d+)m/);
  if (match) {
    const hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    return hours * 60 + minutes;
  }
  return 0;
};

const formatHoursMinutes = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
};

const calculateCurrentMonthTotalHours = (clockRecords) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  let totalMinutes = 0;

  clockRecords.forEach(record => {
    const recordDate = new Date(record.date);
    if (recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear) {
      if (record.totalHours && record.totalHours !== '-') {
        totalMinutes += calculateTotalMinutesFromDuration(record.totalHours);
      }
    }
  });

  return totalMinutes;
};

const getCurrentMonthExpectedHours = () => {
  const now = new Date();
  const daysPassed = now.getDate(); // Current day of month = days passed so far
  // Assuming 8.5 hours per day (8h 30m)
  return daysPassed * 8.5 * 60;
};

// Helper function to check if today is Sunday or leave day for staff
const isLeaveDayOrSunday = (member) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if Sunday
  if (today.getDay() === 0) {
    return { isLeave: true, reason: 'Sunday' };
  }

  // Check leaves array
  if (member.leaves && Array.isArray(member.leaves)) {
    const hasLeave = member.leaves.some(leave => {
      const leaveDate = new Date(leave.date);
      leaveDate.setHours(0, 0, 0, 0);
      return leaveDate.getTime() === today.getTime();
    });
    if (hasLeave) return { isLeave: true, reason: 'Leave Day' };
  }

  // Check attendance array for "On Leave"
  if (member.attendance && Array.isArray(member.attendance)) {
    const hasLeaveAttendance = member.attendance.some(att => {
      const attDate = new Date(att.date);
      attDate.setHours(0, 0, 0, 0);
      return attDate.getTime() === today.getTime() && att.status === 'On Leave';
    });
    if (hasLeaveAttendance) return { isLeave: true, reason: 'Leave Day' };
  }

  return { isLeave: false, reason: null };
};

const StaffDetails = ({ onAddStaff, onViewTasks }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [redZoneFilter, setRedZoneFilter] = useState('All');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStaffForPerformance, setSelectedStaffForPerformance] = useState(null);
  const [isClockingOutAll, setIsClockingOutAll] = useState(false);
  const [fullImageModal, setFullImageModal] = useState({ isOpen: false, src: '', title: '' });

  const getProfilePicUrl = (pic) => {
    if (!pic) return null;
    if (pic.startsWith('http://') || pic.startsWith('https://')) return pic;
    const base = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? `${BASE_URL.replace('/api', '')}`
      : 'https://rizeworldmain.onrender.com';
    return `${base}${pic.startsWith('/') ? '' : '/'}${pic}`;
  };

  const getRedZoneDaysCount = (member) => {
    if (!member) return 0;
    const history = member.satisfactionHistory || [];
    const redDates = new Set(history.filter(h => h.level === 'red').map(h => h.date));
    if (member.todaySatisfaction === 'red') {
      const todayStr = new Date().toISOString().split('T')[0];
      redDates.add(todayStr);
    }
    return redDates.size;
  };

  const redZoneMembers = useMemo(() => {
    return staff.filter(m => getRedZoneDaysCount(m) >= 7);
  }, [staff]);

  // Access & Security modal state
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [selectedStaffForAccess, setSelectedStaffForAccess] = useState(null);

  // Advance Payment modal state
  const [isAdvanceModalOpen, setIsAdvanceModalOpen] = useState(false);
  const [selectedStaffForAdvance, setSelectedStaffForAdvance] = useState(null);

  const openAccessModal = (member) => {
    setSelectedStaffForAccess(member);
    setIsAccessModalOpen(true);
  };

  const openAdvanceModal = async (member) => {
    let fullMember = member;
    try {
      const res = await getStaffById(member._id);
      if (res?.success && res.data) {
        fullMember = res.data;
      }
    } catch (err) {
      console.warn('Using member summary for advance modal:', err);
    }
    setSelectedStaffForAdvance(fullMember);
    setIsAdvanceModalOpen(true);
  };

  const handleAdvanceUpdated = (updatedStaff) => {
    if (!updatedStaff) return;
    setStaff(prev => prev.map(m =>
      (m._id === updatedStaff._id || m.id === updatedStaff._id) ? updatedStaff : m
    ));
    if (selectedStaffForAdvance && (selectedStaffForAdvance._id === updatedStaff._id || selectedStaffForAdvance.id === updatedStaff._id)) {
      setSelectedStaffForAdvance(updatedStaff);
    }
    if (selectedStaffForSalary && (selectedStaffForSalary._id === updatedStaff._id || selectedStaffForSalary.id === updatedStaff._id)) {
      setSelectedStaffForSalary(updatedStaff);
    }
  };

  const handleAccessSaved = (id, newPermissions) => {
    setStaff(prev => prev.map(m =>
      (m._id === id || m.id === id) ? { ...m, permissions: newPermissions } : m
    ));
  };

  // Salary modal state
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
  const [selectedStaffForSalary, setSelectedStaffForSalary] = useState(null);
  const [selectedSalaryMonth, setSelectedSalaryMonth] = useState('');
  const [advanceSettlementChoice, setAdvanceSettlementChoice] = useState('settle'); // 'settle' | 'defer'
  const [customAdvanceCut, setCustomAdvanceCut] = useState('');
  const [salaryPaymentDetails, setSalaryPaymentDetails] = useState({
    mode: 'online',
    method: 'phonepe',
    utrNumber: ''
  });

  const availableSalaryMonths = useMemo(() => {
    if (!selectedStaffForSalary) return [];
    const months = new Set();
    const now = new Date();
    const currentMonthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });
    months.add(currentMonthName);

    const addDateMonth = (dateInput) => {
      if (!dateInput) return;
      const d = new Date(dateInput);
      if (isNaN(d.getTime())) return;
      d.setHours(0, 0, 0, 0);
      const start = new Date(CALCULATION_START_DATE);
      start.setHours(0, 0, 0, 0);
      const diffDays = Math.round((d.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 0) return;
      const monthOffset = Math.floor(diffDays / 30);
      const targetDate = new Date(2026, 6 + monthOffset, 1);
      months.add(targetDate.toLocaleString('default', { month: 'long', year: 'numeric' }));
    };

    (selectedStaffForSalary.clock || []).forEach(r => addDateMonth(r.date));
    (selectedStaffForSalary.salaryHistory || []).forEach(h => {
      if (h.month) months.add(h.month.replace(/\s*\(Current\)/i, '').trim());
    });
    (selectedStaffForSalary.attendance || []).forEach(a => addDateMonth(a.date));
    (selectedStaffForSalary.leaves || []).forEach(l => addDateMonth(l.date));

    const sorted = Array.from(months).filter(mStr => {
      const match = mStr.match(/([A-Za-z]+)\s+(\d+)/);
      if (!match) return false;
      const mName = match[1];
      const yr = parseInt(match[2]);
      const mIdx = new Date(Date.parse(mName + " 1, 2012")).getMonth();
      return yr > 2026 || (yr === 2026 && mIdx >= 6);
    }).sort((a, b) => {
      const dateA = new Date(Date.parse(a + " 1"));
      const dateB = new Date(Date.parse(b + " 1"));
      return dateB.getTime() - dateA.getTime();
    });

    return sorted;
  }, [selectedStaffForSalary]);

  // Fetch staff from backend
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const result = await getAllStaff();
        if (result && result.success) {
          setStaff(result.data);
        }
      } catch (error) {
        console.error('Error fetching staff:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  // Get unique departments for the dropdown
  const departments = ['All', ...new Set(staff.map(member => member.department))];

  const filteredStaff = staff.filter(member => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesJobType = jobTypeFilter === 'All' || member.jobType === jobTypeFilter;
    const matchesDepartment = departmentFilter === 'All' || member.department === departmentFilter;
    const matchesRedZone = redZoneFilter === 'All' || (redZoneFilter === 'RedZone' && getRedZoneDaysCount(member) >= 7);

    return matchesSearch && matchesJobType && matchesDepartment && matchesRedZone;
  }).sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  const handleUpdateStaff = async (id, updatedData) => {
    try {
      const response = await fetch(`${BASE_URL}/staff/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      const result = await response.json();
      if (result.success) {
        setStaff(staff.map(member =>
          member._id === id ? result.data : member
        ));
      }
    } catch (error) {
      console.error('Error updating staff:', error);
    }
  };

  const handleDeleteStaff = async (id) => {
    if (window.confirm('Are you sure you want to remove this employee? It will move them to the Removed Employees page.')) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${BASE_URL}/staff/${id}`, {
          method: 'DELETE',
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        const result = await response.json();
        if (result.success) {
          setStaff(staff.filter(member => member._id !== id));
          alert('Employee moved to Removed Employees successfully');
        }
      } catch (error) {
        console.error('Error deleting staff:', error);
      }
    }
  };

  const handleClockIn = async (member) => {
    const defaultTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const inputTime = prompt(`Enter clock-in time for ${member.name} (e.g. "09:30 AM" or "09:30"):`, defaultTime);
    if (inputTime === null) return;
    if (!inputTime.trim()) {
      alert('Invalid time');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/staff/${member._id}/clock-in`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ clockInTime: inputTime.trim() })
      });
      const result = await response.json();

      if (result.success) {
        setStaff(staff.map(m =>
          m._id === member._id ? result.data : m
        ));
        alert(`${member.name} clocked in successfully`);
      } else {
        alert(result.message || 'Failed to clock in');
      }
    } catch (error) {
      console.error('Error clocking in:', error);
      alert('Network error: Could not connect to server');
    }
  };

  const handleClockOut = async (member) => {
    const defaultTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const inputTime = prompt(`Enter clock-out time for ${member.name} (e.g. "05:30 PM" or "17:30"):`, defaultTime);
    if (inputTime === null) return;
    if (!inputTime.trim()) {
      alert('Invalid time');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/staff/${member._id}/clock-out`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ clockOutTime: inputTime.trim() })
      });
      const result = await response.json();

      if (result.success) {
        setStaff(staff.map(m =>
          m._id === member._id ? result.data : m
        ));
        alert(`${member.name} clocked out successfully`);
      } else {
        alert(result.message || 'Failed to clock out');
      }
    } catch (error) {
      console.error('Error clocking out:', error);
      alert('Network error: Could not connect to server');
    }
  };

  const handleClockOutAll = async () => {
    const clockedInCount = staff.filter(s => s.clock_status === 'clock_in').length;
    if (clockedInCount === 0) {
      alert('No employees are currently clocked in.');
      return;
    }

    const defaultTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const inputTime = prompt(
      `Enter clock-out time for all ${clockedInCount} clocked-in employee(s) (e.g. "05:30 PM" or "17:30"):`,
      defaultTime
    );

    if (inputTime === null) return;
    if (!inputTime.trim()) {
      alert('Invalid time entered');
      return;
    }

    try {
      setIsClockingOutAll(true);
      const result = await clockOutAllStaff(inputTime.trim());
      if (result && result.success) {
        alert(result.message || `Successfully clocked out ${clockedInCount} employee(s)`);
        const staffRes = await getAllStaff();
        if (staffRes?.success) setStaff(staffRes.data);
      } else {
        alert(result?.message || 'Failed to clock out all staff');
      }
    } catch (error) {
      console.error('Error clocking out all staff:', error);
      alert('Network error while clocking out all staff');
    } finally {
      setIsClockingOutAll(false);
    }
  };

  const calculatePayoutForSelectedMonth = (staffInfo, monthStr) => {
    if (!staffInfo || !monthStr) return { payout: 0, fullLeaves: 0, halfDays: 0, casualLeaveUsed: false, isPaid: false, daysWorked: 0 };
    const cleanMonth = monthStr.replace(/\s*\(Current\)/i, '').trim();
    const match = cleanMonth.match(/([A-Za-z]+)\s+(\d+)/);
    if (!match) return calculatePayout(staffInfo);

    const monthName = match[1];
    const year = parseInt(match[2]);
    const monthIndex = new Date(Date.parse(monthName + " 1, 2012")).getMonth();

    const baseSalary = staffInfo.monthlySalary || 0;
    const STANDARD_HOURS_PER_DAY = 8.5;
    const EXPECTED_MONTHLY_HOURS = STANDARD_HOURS_PER_DAY * 30;
    const hourlyRate = baseSalary / EXPECTED_MONTHLY_HOURS;

    const today = new Date();
    const isCurrentMonth = today.getMonth() === monthIndex && today.getFullYear() === year;

    const createdAt = staffInfo.createdAt || staffInfo.joiningDate;
    const sequenceDates = get30DaySequenceDates(year, monthIndex, createdAt);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const validSequenceDates = isCurrentMonth
      ? sequenceDates.filter(d => d <= todayEnd)
      : sequenceDates;

    const seqDateStrings = new Set(validSequenceDates.map(d => d.toDateString()));

    const parseTotalHours = (str) => {
      if (!str || str === '-') return 0;
      const h = str.match(/(\d+)\s*h/i);
      const m = str.match(/(\d+)\s*m/i);
      return (h ? parseInt(h[1], 10) : 0) + (m ? parseInt(m[1], 10) / 60 : 0);
    };

    const monthlyClockRecords = (staffInfo.clock || []).filter(r => {
      return seqDateStrings.has(new Date(r.date).toDateString());
    });

    const dailyHoursMap = {};
    const creditedDates = new Set();

    monthlyClockRecords.forEach(r => {
      const dStr = new Date(r.date).toDateString();
      const actualHrs = parseTotalHours(r.totalHours);
      let hrs = 0;
      if (actualHrs > 9) {
        hrs = 8.5 + (actualHrs - 9);
      } else if (actualHrs >= 8.5) {
        hrs = 8.5;
      } else {
        hrs = actualHrs;
      }
      dailyHoursMap[dStr] = hrs;
      creditedDates.add(dStr);
    });

    validSequenceDates.forEach(d => {
      const dStr = d.toDateString();
      if (d.getDay() === 0 && !creditedDates.has(dStr)) {
        dailyHoursMap[dStr] = STANDARD_HOURS_PER_DAY;
        creditedDates.add(dStr);
      }
    });

    (staffInfo.leaves || []).forEach(leave => {
      const ld = new Date(leave.date);
      const ldStr = ld.toDateString();
      if (seqDateStrings.has(ldStr) && !creditedDates.has(ldStr)) {
        dailyHoursMap[ldStr] = STANDARD_HOURS_PER_DAY;
        creditedDates.add(ldStr);
      }
    });

    (staffInfo.attendance || []).forEach(att => {
      if (att.status === 'On Leave') {
        const ad = new Date(att.date);
        const adStr = ad.toDateString();
        if (seqDateStrings.has(adStr) && !creditedDates.has(adStr)) {
          dailyHoursMap[adStr] = STANDARD_HOURS_PER_DAY;
          creditedDates.add(adStr);
        }
      }
    });

    const absentDaysList = validSequenceDates.filter(d => {
      if (d.getDay() === 0) return false;
      return !creditedDates.has(d.toDateString());
    });

    const halfDayRecords = (staffInfo.attendance || []).filter(att => {
      if (att.status !== 'Half-Day') return false;
      const ad = new Date(att.date);
      return seqDateStrings.has(ad.toDateString());
    });
    const halfDayLeaveUnits = Math.floor(halfDayRecords.length / 2);

    let casualLeaveUsed = false;
    if (absentDaysList.length > 0) {
      const casualLeaveDate = absentDaysList[0];
      const dStr = casualLeaveDate.toDateString();
      dailyHoursMap[dStr] = STANDARD_HOURS_PER_DAY;
      creditedDates.add(dStr);
      casualLeaveUsed = true;
    } else if (halfDayLeaveUnits > 0) {
      for (let i = 0; i < 2; i++) {
        const hdDate = new Date(halfDayRecords[i].date);
        const dStr = hdDate.toDateString();
        const cr = monthlyClockRecords.find(r => new Date(r.date).toDateString() === dStr);
        const actualHrs = cr ? parseTotalHours(cr.totalHours) : 0;
        const halfTarget = STANDARD_HOURS_PER_DAY / 2;
        if (actualHrs < halfTarget) {
          dailyHoursMap[dStr] = (dailyHoursMap[dStr] || actualHrs) + (halfTarget - actualHrs);
        }
      }
      casualLeaveUsed = true;
    }

    let calculatedPayout = 0;
    let totalHoursWorked = 0;

    validSequenceDates.forEach(d => {
      const dStr = d.toDateString();
      const hrs = dailyHoursMap[dStr] || 0;
      totalHoursWorked += hrs;
      const { salary: daySalary } = getSalaryForDate(staffInfo, d);
      const dayHourlyRate = daySalary / EXPECTED_MONTHLY_HOURS;
      calculatedPayout += hrs * dayHourlyRate;
    });

    calculatedPayout = Math.round(calculatedPayout);

    const presents = monthlyClockRecords.length;
    const fullLeaves = Math.max(0, absentDaysList.length - (casualLeaveUsed && absentDaysList.length > 0 ? 1 : 0));
    const advanceSummary = getStaffAdvanceSummary(staffInfo);
    const activeAdvanceBalance = advanceSummary.pendingBalance || 0;

    const paidHistory = (staffInfo.salaryHistory || []).find(h => {
      const hClean = h.month ? h.month.replace(/\s*\(Current\)/i, '').trim() : '';
      return hClean === cleanMonth;
    });

    // If paid, use historical recorded numbers
    if (paidHistory) {
      const earnedSalary = paidHistory.earnedSalary ?? paidHistory.baseSalary ?? paidHistory.payoutSalary;
      const advanceDeduction = paidHistory.advanceDeduction || 0;
      const payout = paidHistory.payoutSalary;
      const advanceBalanceRemaining = paidHistory.advanceBalanceRemaining ?? 0;

      return {
        payout,
        earnedSalary,
        baseSalary,
        advanceDeduction,
        advanceBalanceRemaining,
        activeAdvanceBalance,
        totalHoursWorked: Math.round(totalHoursWorked * 100) / 100,
        daysWorked: presents,
        hourlyRate: Math.round(hourlyRate * 100) / 100,
        fullLeaves,
        halfDays: halfDayRecords.length,
        casualLeaveUsed: !!casualLeaveUsed,
        isPaid: true
      };
    }

    // If pending, calculate based on selected settlement choice
    const earnedSalary = calculatedPayout;
    let advanceDeduction = 0;
    if (advanceSettlementChoice === 'defer' || advanceSettlementChoice === 'no_deduction') {
      advanceDeduction = 0;
    } else if (advanceSettlementChoice === 'partial') {
      if (customAdvanceCut !== '' && !isNaN(Number(customAdvanceCut))) {
        advanceDeduction = Math.min(activeAdvanceBalance, Math.max(0, Number(customAdvanceCut)));
      } else {
        advanceDeduction = Math.round(activeAdvanceBalance / 2);
      }
    } else {
      // 'full' or 'settle' default
      if (customAdvanceCut !== '' && !isNaN(Number(customAdvanceCut))) {
        advanceDeduction = Math.min(activeAdvanceBalance, Math.max(0, Number(customAdvanceCut)));
      } else {
        advanceDeduction = activeAdvanceBalance;
      }
    }

    const payout = Math.max(0, earnedSalary - advanceDeduction);
    const advanceBalanceRemaining = Math.max(0, activeAdvanceBalance - advanceDeduction);

    return {
      payout,
      earnedSalary,
      baseSalary,
      advanceDeduction,
      advanceBalanceRemaining,
      activeAdvanceBalance,
      totalHoursWorked: Math.round(totalHoursWorked * 100) / 100,
      daysWorked: presents,
      hourlyRate: Math.round(hourlyRate * 100) / 100,
      fullLeaves,
      halfDays: halfDayRecords.length,
      casualLeaveUsed: !!casualLeaveUsed,
      isPaid: false
    };
  };

  const openEditModal = (member) => {
    setEditingStaff(member);
    setIsEditModalOpen(true);
  };

  const openSalaryModal = async (member) => {
    let fullMember = member;
    try {
      const res = await getStaffById(member._id);
      if (res?.success && res.data) {
        fullMember = res.data;
      }
    } catch (err) {
      console.warn('Could not fetch full staff details for salary modal, using summary:', err);
    }

    setSelectedStaffForSalary(fullMember);
    setAdvanceSettlementChoice('settle');
    setCustomAdvanceCut('');
    setSalaryPaymentDetails({
      mode: 'online',
      method: 'phonepe',
      utrNumber: ''
    });

    // Compute available months for member and select the first pending month
    const months = new Set();
    const now = new Date();
    const currentMonthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });
    months.add(currentMonthName);

    const addDateMonth = (dateInput) => {
      if (!dateInput) return;
      const d = new Date(dateInput);
      if (isNaN(d.getTime())) return;
      d.setHours(0, 0, 0, 0);
      const start = new Date(CALCULATION_START_DATE);
      start.setHours(0, 0, 0, 0);
      const diffDays = Math.round((d.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 0) return;
      const monthOffset = Math.floor(diffDays / 30);
      const targetDate = new Date(2026, 6 + monthOffset, 1);
      months.add(targetDate.toLocaleString('default', { month: 'long', year: 'numeric' }));
    };

    (fullMember.clock || []).forEach(r => addDateMonth(r.date));
    (fullMember.salaryHistory || []).forEach(h => {
      if (h.month) months.add(h.month.replace(/\s*\(Current\)/i, '').trim());
    });
    (fullMember.attendance || []).forEach(a => addDateMonth(a.date));
    (fullMember.leaves || []).forEach(l => addDateMonth(l.date));

    const sorted = Array.from(months).filter(mStr => {
      const match = mStr.match(/([A-Za-z]+)\s+(\d+)/);
      if (!match) return false;
      const mName = match[1];
      const yr = parseInt(match[2]);
      const mIdx = new Date(Date.parse(mName + " 1, 2012")).getMonth();
      return yr > 2026 || (yr === 2026 && mIdx >= 6);
    }).sort((a, b) => {
      const dateA = new Date(Date.parse(a + " 1"));
      const dateB = new Date(Date.parse(b + " 1"));
      return dateB.getTime() - dateA.getTime();
    });

    const paidSet = new Set((fullMember.salaryHistory || []).map(h => (h.month || '').replace(/\s*\(Current\)/i, '').trim()));
    // Prefer past pending months first (exclude current month from auto-default if past pending month exists)
    const pendingMonths = sorted.filter(m => !paidSet.has(m));
    const pendingPastMonth = pendingMonths.find(m => m !== currentMonthName);

    setSelectedSalaryMonth(pendingPastMonth || pendingMonths[0] || sorted[0] || currentMonthName);
    setIsSalaryModalOpen(true);
  };

  const handleConfirmClearSalary = async () => {
    if (!selectedStaffForSalary || !selectedSalaryMonth) return;

    const payoutData = calculatePayoutForSelectedMonth(selectedStaffForSalary, selectedSalaryMonth);
    const { payout, earnedSalary, advanceDeduction, fullLeaves, halfDays, casualLeaveUsed } = payoutData;

    try {
      const response = await fetch(`${BASE_URL}/staff/${selectedStaffForSalary._id}/clear-salary`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month: selectedSalaryMonth,
          baseSalary: selectedStaffForSalary.monthlySalary,
          earnedSalary,
          advanceDeduction,
          payoutSalary: payout,
          totalLeaves: fullLeaves,
          totalHalfDays: halfDays,
          casualLeaveUsed,
          mode: salaryPaymentDetails.mode,
          method: salaryPaymentDetails.mode === 'cash' ? 'cash' : salaryPaymentDetails.method,
          utrNumber: salaryPaymentDetails.utrNumber
        })
      });
      const result = await response.json();
      if (result.success) {
        setStaff(staff.map(m =>
          m._id === selectedStaffForSalary._id ? result.data : m
        ));
        setIsSalaryModalOpen(false);
        setSelectedStaffForSalary(null);
        alert(`Salary for ${selectedSalaryMonth} cleared successfully! Net payout: ₹${payout.toLocaleString('en-IN')}${advanceDeduction > 0 ? ` (after ₹${advanceDeduction.toLocaleString('en-IN')} advance deduction)` : ''}`);
      }
    } catch (error) {
      console.error('Error clearing salary:', error);
      alert('Failed to clear salary');
    }
  };

  const handleRevertSalary = async (member, monthToRevert = null) => {
    const targetMonth = monthToRevert || selectedSalaryMonth || new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!window.confirm(`Are you sure you want to revert/undo salary payment for ${targetMonth} for ${member.name}?`)) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/staff/${member._id}/revert-salary`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month: targetMonth })
      });

      const result = await response.json();
      if (result.success) {
        setStaff(staff.map(m => m._id === member._id ? result.data : m));
        if (selectedStaffForSalary && selectedStaffForSalary._id === member._id) {
          setSelectedStaffForSalary(result.data);
        }
        setIsSalaryModalOpen(false);
        alert(`Salary for ${targetMonth} reverted successfully!`);
      } else {
        alert(result.message || 'Failed to revert salary');
      }
    } catch (error) {
      console.error('Error reverting salary:', error);
      alert('Error reverting salary');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-900 dark:text-white text-xl animate-pulse">Loading staff data...</div>
      </div>
    );
  }

  if (selectedStaffForPerformance) {
    return (
      <StaffPerformance
        staffId={selectedStaffForPerformance}
        onBack={() => setSelectedStaffForPerformance(null)}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >


      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Employee Details</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and view your team members</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Job Type Dropdown */}
          <select
            value={jobTypeFilter}
            onChange={(e) => setJobTypeFilter(e.target.value)}
            className="bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-gray-300 focus:border-blue-500 outline-none transition-all cursor-pointer hover:bg-black/10 dark:hover:bg-white/10"
          >
            <option value="All" className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white">All Job Types</option>
            <option value="Permanent" className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white">Permanent</option>
            <option value="Intern" className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white">Intern</option>
            <option value="Part-time" className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white">Part-time</option>
          </select>

          {/* Department Dropdown */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-gray-300 focus:border-blue-500 outline-none transition-all cursor-pointer hover:bg-black/10 dark:hover:bg-white/10"
          >
            {departments.map(dept => (
              <option key={dept} value={dept} className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white">
                {dept === 'All' ? 'All Departments' : dept}
              </option>
            ))}
          </select>



          {(() => {
            const clockedInCount = staff.filter(s => s.clock_status === 'clock_in').length;
            return (
              <button
                onClick={handleClockOutAll}
                disabled={isClockingOutAll || clockedInCount === 0}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all shadow-sm border ${
                  clockedInCount > 0
                    ? 'bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white border-rose-500/20 shadow-rose-500/10 active:scale-95'
                    : 'bg-black/5 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60'
                }`}
                title={clockedInCount > 0 ? `Clock out all ${clockedInCount} active staff` : 'No staff currently clocked in'}
              >
                {isClockingOutAll ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <LogOut size={18} />
                )}
                <span>Clock Out All</span>
                {clockedInCount > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-black rounded-full bg-rose-500 text-white">
                    {clockedInCount}
                  </span>
                )}
              </button>
            );
          })()}

          <button
            onClick={onAddStaff}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 w-fit"
          >
            <Plus size={20} />
            Add New Employee
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6">
        <div className="glass p-6 rounded-3xl border border-gray-200 dark:border-white/10 transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Total Staff</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{filteredStaff.length}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search Employee by name, email or department..."
            className="w-full bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-600 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10 transition-all font-bold">
          <Filter size={20} />
          Filters
        </button>
      </div>

      {/* Staff Table */}
      <div className="glass rounded-3xl border border-gray-200 dark:border-white/10 overflow-hidden transition-colors">
        <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/10 bg-black/5 dark:bg-white/5">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Employee Info</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Department & Role</th>

                {/* <th className="px-6 py-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Current Month Hours</th> */}
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Joining Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Documents</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {filteredStaff.map((member) => {
                return (
                  <tr key={member._id} className="transition-colors group hover:bg-black/[0.02] dark:hover:bg-white/5">
                    <td className="px-6 py-4">
                      <div
                        className="flex items-center gap-3 cursor-pointer group/name"
                        onClick={() => setSelectedStaffForPerformance(member._id)}
                      >
                        {member.profilePic ? (
                          <>
                            <img
                              src={getProfilePicUrl(member.profilePic)}
                              alt={member.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-blue-500/20 group-hover/name:scale-110 transition-transform shadow-sm cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFullImageModal({
                                  isOpen: true,
                                  src: getProfilePicUrl(member.profilePic),
                                  title: `${member.name} (${member.employeeId || 'Staff'})`
                                });
                              }}
                              onError={(e) => {
                                const img = e.currentTarget;
                                img.style.display = 'none';
                                if (img.nextElementSibling) {
                                  img.nextElementSibling.setAttribute('style', 'display: flex');
                                }
                              }}
                            />
                            <div
                              style={{ display: 'none' }}
                              className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center text-white font-bold group-hover/name:scale-110 transition-transform shadow-sm"
                            >
                              {member.name?.charAt(0)?.toUpperCase() || 'E'}
                            </div>
                          </>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold group-hover/name:scale-110 transition-transform shadow-sm">
                            {member.name?.charAt(0)?.toUpperCase() || 'E'}
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-bold text-gray-900 dark:text-white group-hover/name:text-blue-500 transition-colors flex items-center gap-2 flex-wrap">
                            {member.name}
                            <TrendingUp size={14} className="opacity-0 group-hover/name:opacity-100 transition-opacity" />
                          </div>
                          <div className="text-xs text-gray-500 flex flex-col gap-0.5 mt-1">
                            <span className="flex items-center gap-1"><Mail size={12} /> {member.email}</span>
                            <span className="flex items-center gap-1"><Phone size={12} /> {member.phone}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {(() => {
                        const reportingPersonIds = Array.isArray(member.reportingPerson)
                          ? member.reportingPerson
                          : (member.reportingPerson && member.reportingPerson !== '-' ? [member.reportingPerson] : []);

                        const managerNames = reportingPersonIds
                          .map(id => {
                            const match = staff.find(s => s.employeeId === id);
                            return match ? match.name : id;
                          })
                          .join(', ');

                        return (
                          <div className="flex flex-col gap-1.5">
                            <div className="flex flex-wrap gap-1.5 items-center">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                {member.department}
                              </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                                {member.role || 'Employee'}
                              </span>
                            </div>
                            <div className="text-[11px] text-gray-500 dark:text-gray-400 flex flex-col gap-1">
                              <span className="flex items-center gap-1">
                                <Briefcase size={12} className="text-gray-400" /> {member.jobType}
                              </span>
                              {reportingPersonIds.length > 0 && (
                                <span className="flex items-center gap-1 font-semibold text-gray-700 dark:text-gray-300" title={`IDs: ${reportingPersonIds.join(', ')}`}>
                                  Repo: {managerNames || '-'}

                                </span>
                              )}
                              {/* Show admissions count if role is Counselor */}
                              {member.role === 'Counselor' && (
                                <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                                  <Users size={12} className="text-amber-500" />
                                  Admissions: {member.admissionsCount || 0}
                                </span>
                              )}
                              {/* Show sales count if role is Sales Team */}
                              {(member.role === 'Sales Team' || member.role === 'Sales') && (
                                <span className="flex items-center gap-1 font-semibold text-purple-600 dark:text-purple-400">
                                  <TrendingUp size={12} className="text-purple-500" />
                                  Sales: {member.salesCount || 0}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-300">
                        <Calendar size={12} /> {member.joiningDate ? new Date(member.joiningDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(member.documents || []).map((doc, i) => (
                          <span key={i} className="rounded border border-gray-200 bg-black/5 px-1.5 py-0.5 text-[10px] text-gray-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-400">
                            {typeof doc === 'string' ? doc : doc.name}
                          </span>
                        ))}
                      </div>
                      <div className="mt-1.5 flex items-center gap-1 text-[10px] italic text-gray-500">
                        <CreditCard size={10} />
                        {member.bankName} - {member.accountNumber?.slice(-4).padStart(member.accountNumber.length, '*')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          {(() => {
                            const { isLeave, reason } = isLeaveDayOrSunday(member);
                            if (isLeave) {
                              return (
                                <div className="flex items-center gap-2 rounded-xl border border-amber-500/10 bg-amber-500/5 px-4 py-2 text-amber-500">
                                  <Calendar size={16} />
                                  <span className="text-xs font-black uppercase tracking-widest">{reason}</span>
                                </div>
                              );
                            } else if (member.clock_status === 'clock_in') {
                              return (
                                <button
                                  onClick={() => handleClockOut(member)}
                                  className="group/clockout flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-rose-600 shadow-lg shadow-rose-500/10 transition-all hover:bg-rose-500 hover:text-white"
                                  title="Clock Out"
                                >
                                  <LogOut size={16} className="transition-transform group-hover/clockout:scale-110" />
                                  <span className="text-xs font-black uppercase tracking-widest">Clock Out</span>
                                </button>
                              );
                            } else {
                              return (
                                <button
                                  onClick={() => handleClockIn(member)}
                                  className="group/clockin flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-emerald-600 shadow-lg shadow-emerald-500/10 transition-all hover:bg-emerald-500 hover:text-white"
                                  title="Clock In"
                                >
                                  <LogIn size={16} className="transition-transform group-hover/clockin:scale-110" />
                                  <span className="text-xs font-black uppercase tracking-widest">Clock In</span>
                                </button>
                              );
                            }
                          })()}
                          {(() => {
                            const now = new Date();
                            const currentMonthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });
                            const isCurrentMonthPaid = (member.salaryHistory || []).some(h => {
                              const hClean = (h.month || '').replace(/\s*\(Current\)/i, '').trim();
                              return hClean === currentMonthName;
                            });

                            if (!isCurrentMonthPaid) {
                              return (
                                <button
                                  onClick={() => openSalaryModal(member)}
                                  className="group/salary flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-emerald-600 shadow-lg shadow-emerald-500/10 transition-all hover:bg-emerald-500 hover:text-white"
                                  title="Clear Salary"
                                >
                                  <CheckCircle2 size={16} className="transition-transform group-hover/salary:scale-110" />
                                  <span className="text-xs font-black uppercase tracking-widest">Clear Salary</span>
                                </button>
                              );
                            }

                            return (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => openSalaryModal(member)}
                                  className="flex items-center gap-1.5 rounded-xl border border-emerald-500/10 bg-emerald-500/5 px-3 py-2 text-emerald-500 hover:bg-emerald-500/20 transition-all"
                                  title="Salary Paid (Click to manage)"
                                >
                                  <CheckCircle2 size={16} />
                                  <span className="text-xs font-black uppercase tracking-widest">Paid</span>
                                </button>
                                <button
                                  onClick={() => handleRevertSalary(member)}
                                  className="group/revert flex items-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-rose-600 shadow-sm transition-all hover:bg-rose-500 hover:text-white"
                                  title="Revert Salary Payment"
                                >
                                  <RotateCcw size={15} className="transition-transform group-hover/revert:-rotate-90" />
                                  <span className="text-xs font-black uppercase tracking-widest">Revert</span>
                                </button>
                              </div>
                            );
                          })()}
                        </div>
                        <div className="flex items-center gap-1.5">
                          {(() => {
                            const advSummary = getStaffAdvanceSummary(member);
                            return (
                              <button
                                onClick={() => openAdvanceModal(member)}
                                className={`group/adv flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-black uppercase tracking-widest transition-all shadow-sm ${
                                  advSummary.pendingBalance > 0
                                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500 hover:text-white shadow-amber-500/10'
                                    : 'bg-black/5 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-amber-500/10 hover:text-amber-600 hover:border-amber-500/20'
                                }`}
                                title={`Advance Pay (Active: ₹${advSummary.pendingBalance.toLocaleString('en-IN')})`}
                              >
                                <HandCoins size={15} className="transition-transform group-hover/adv:scale-110" />
                                <span>Advance</span>
                                {advSummary.pendingBalance > 0 && (
                                  <span className="px-1.5 py-0.2 rounded-md bg-amber-500 text-white text-[10px]">
                                    ₹{advSummary.pendingBalance.toLocaleString('en-IN')}
                                  </span>
                                )}
                              </button>
                            );
                          })()}
                          <button
                            onClick={() => openAccessModal(member)}
                            className="group/access flex items-center gap-1.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-3 py-2 text-indigo-600 dark:text-indigo-400 shadow-lg shadow-indigo-500/10 transition-all hover:bg-indigo-600 hover:text-white"
                            title="Manage Feature Access & Password"
                          >
                            <KeyRound size={15} className="transition-transform group-hover/access:scale-110" />
                            <span className="text-xs font-black uppercase tracking-widest">Access & Pass</span>
                          </button>
                          <button
                            onClick={() => openEditModal(member)}
                            className="group/edit flex items-center gap-1.5 rounded-xl border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-blue-600 dark:text-blue-400 shadow-lg shadow-blue-500/10 transition-all hover:bg-blue-600 hover:text-white"
                            title="Edit Employee Details"
                          >
                            <Edit3 size={15} className="transition-transform group-hover/edit:scale-110" />
                            <span className="text-xs font-black uppercase tracking-widest">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteStaff(member._id)}
                            className="group/remove flex items-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-rose-600 shadow-lg shadow-rose-500/10 transition-all hover:bg-rose-500 hover:text-white"
                            title="Remove Employee"
                          >
                            <Trash2 size={15} className="transition-transform group-hover/remove:scale-110" />
                            <span className="text-xs font-black uppercase tracking-widest">Remove</span>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isEditModalOpen && (
          <EditStaffModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            staffMember={editingStaff}
            onUpdate={handleUpdateStaff}
          />
        )}
      </AnimatePresence>

      {/* Access & Password Management Modal */}
      <AnimatePresence>
        {isAccessModalOpen && selectedStaffForAccess && (
          <ManageAccessModal
            isOpen={isAccessModalOpen}
            onClose={() => setIsAccessModalOpen(false)}
            staffMember={selectedStaffForAccess}
            onSaveSuccess={handleAccessSaved}
          />
        )}
      </AnimatePresence>

      {/* Advance Payment Modal */}
      <AnimatePresence>
        {isAdvanceModalOpen && selectedStaffForAdvance && (
          <ManageAdvanceModal
            isOpen={isAdvanceModalOpen}
            onClose={() => setIsAdvanceModalOpen(false)}
            staffMember={selectedStaffForAdvance}
            onAdvanceUpdated={handleAdvanceUpdated}
          />
        )}
      </AnimatePresence>

      {/* Salary Payment Modal with Full Breakout & Advance Settlement Selection */}
      <AnimatePresence>
        {isSalaryModalOpen && selectedStaffForSalary && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSalaryModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#0c0c0e] rounded-3xl border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[92vh]"
            >
              <div className="flex items-center justify-between mb-5 border-b border-gray-100 dark:border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                    <Receipt size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white">
                      Clear Monthly Salary
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Complete salary & advance breakout</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSalaryModalOpen(false)}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Employee Info Header */}
                <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Employee</p>
                    <p className="text-base font-black text-gray-900 dark:text-white">{selectedStaffForSalary.name}</p>
                    <p className="text-[11px] text-gray-500">{selectedStaffForSalary.employeeId} • {selectedStaffForSalary.department}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Base Salary</p>
                    <p className="text-base font-black text-indigo-600 dark:text-indigo-400">
                      ₹{(selectedStaffForSalary.monthlySalary || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Select Month to Clear */}
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                    Select Month
                  </label>
                  <select
                    value={selectedSalaryMonth}
                    onChange={(e) => setSelectedSalaryMonth(e.target.value)}
                    className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all cursor-pointer shadow-sm"
                  >
                    {availableSalaryMonths.map(mStr => {
                      const isPaid = (selectedStaffForSalary.salaryHistory || []).some(h => {
                        const hClean = h.month ? h.month.replace(/\s*\(Current\)/i, '').trim() : '';
                        return hClean === mStr;
                      });
                      return (
                        <option key={mStr} value={mStr} className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white">
                          {mStr} {isPaid ? '(Already Paid)' : '(Pending Payment)'}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Calculation Details */}
                {(() => {
                  const calc = calculatePayoutForSelectedMonth(selectedStaffForSalary, selectedSalaryMonth);
                  return (
                    <div className="space-y-3">
                      {/* Advance Settlement Choice (If not paid and employee has active advance) */}
                      {!calc.isPaid && calc.activeAdvanceBalance > 0 && (
                        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <HandCoins size={16} className="text-amber-600 dark:text-amber-400" />
                              <span className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                                Active Advance Balance
                              </span>
                            </div>
                            <span className="text-sm font-black text-amber-600 dark:text-amber-400">
                              ₹{calc.activeAdvanceBalance.toLocaleString('en-IN')}
                            </span>
                          </div>

                          <div className="space-y-2 pt-1 border-t border-amber-500/20">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                              Advance Settlement Options:
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              {/* Option 1: No Deduction / Full Salary */}
                              <button
                                type="button"
                                onClick={() => { setAdvanceSettlementChoice('defer'); setCustomAdvanceCut('0'); }}
                                className={`p-2.5 rounded-xl text-left border transition-all ${
                                  advanceSettlementChoice === 'defer' || advanceSettlementChoice === 'no_deduction'
                                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-md shadow-emerald-600/20 ring-2 ring-emerald-500/40'
                                    : 'bg-white dark:bg-black/30 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-white/60'
                                }`}
                              >
                                <p className="text-xs font-black flex items-center gap-1">💰 Full Salary</p>
                                <p className={`text-[10px] mt-0.5 leading-tight ${advanceSettlementChoice === 'defer' || advanceSettlementChoice === 'no_deduction' ? 'text-emerald-100' : 'text-gray-400'}`}>
                                  No advance cut (Settle next time)
                                </p>
                              </button>

                              {/* Option 2: Full Advance Cut */}
                              <button
                                type="button"
                                onClick={() => { setAdvanceSettlementChoice('full'); setCustomAdvanceCut(''); }}
                                className={`p-2.5 rounded-xl text-left border transition-all ${
                                  advanceSettlementChoice === 'full' || advanceSettlementChoice === 'settle'
                                    ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20 ring-2 ring-amber-500/40'
                                    : 'bg-white dark:bg-black/30 border-amber-500/20 text-gray-700 dark:text-gray-300 hover:bg-white/60'
                                }`}
                              >
                                <p className="text-xs font-black flex items-center gap-1">✂️ Cut Full Adv.</p>
                                <p className={`text-[10px] mt-0.5 leading-tight ${advanceSettlementChoice === 'full' || advanceSettlementChoice === 'settle' ? 'text-amber-100' : 'text-gray-400'}`}>
                                  Deduct ₹{calc.activeAdvanceBalance.toLocaleString('en-IN')} now
                                </p>
                              </button>

                              {/* Option 3: Partial / Custom Deduction */}
                              <button
                                type="button"
                                onClick={() => { setAdvanceSettlementChoice('partial'); if (!customAdvanceCut) setCustomAdvanceCut(String(Math.round(calc.activeAdvanceBalance / 2))); }}
                                className={`p-2.5 rounded-xl text-left border transition-all ${
                                  advanceSettlementChoice === 'partial'
                                    ? 'bg-purple-600 text-white border-purple-700 shadow-md shadow-purple-600/20 ring-2 ring-purple-500/40'
                                    : 'bg-white dark:bg-black/30 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-white/60'
                                }`}
                              >
                                <p className="text-xs font-black flex items-center gap-1">🔢 Partial Cut</p>
                                <p className={`text-[10px] mt-0.5 leading-tight ${advanceSettlementChoice === 'partial' ? 'text-purple-100' : 'text-gray-400'}`}>
                                  Custom amount deduction
                                </p>
                              </button>
                            </div>

                            {/* Informational banner when Full Salary (No Cut) is chosen */}
                            {(advanceSettlementChoice === 'defer' || advanceSettlementChoice === 'no_deduction') && (
                              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300">
                                <strong>✅ No Advance Deduction:</strong> Employee will receive their full earned salary of <strong>₹{(calc.earnedSalary || 0).toLocaleString('en-IN')}</strong>. The active advance balance of <strong>₹{calc.activeAdvanceBalance.toLocaleString('en-IN')}</strong> will remain pending and carry forward to next month.
                              </div>
                            )}

                            {/* Custom Deduction Input if Partial is selected */}
                            {advanceSettlementChoice === 'partial' && (
                              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                  <label className="font-bold text-gray-700 dark:text-gray-300">
                                    Enter Amount to Deduct this Month:
                                  </label>
                                  <span className="text-[11px] text-purple-600 dark:text-purple-400 font-bold">
                                    Remaining Balance: ₹{Math.max(0, calc.activeAdvanceBalance - (Number(customAdvanceCut) || 0)).toLocaleString('en-IN')}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">₹</span>
                                    <input
                                      type="number"
                                      min="0"
                                      max={calc.activeAdvanceBalance}
                                      placeholder="e.g. 2000"
                                      value={customAdvanceCut}
                                      onChange={(e) => setCustomAdvanceCut(e.target.value)}
                                      className="w-full bg-white dark:bg-black/40 border border-purple-500/30 rounded-xl pl-7 pr-3 py-1.5 text-xs font-bold text-gray-900 dark:text-white focus:border-purple-500 outline-none"
                                    />
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {[
                                      { label: '25%', amt: Math.round(calc.activeAdvanceBalance * 0.25) },
                                      { label: '50%', amt: Math.round(calc.activeAdvanceBalance * 0.5) },
                                      { label: '75%', amt: Math.round(calc.activeAdvanceBalance * 0.75) },
                                      { label: 'Full', amt: calc.activeAdvanceBalance }
                                    ].map((preset) => (
                                      <button
                                        key={preset.label}
                                        type="button"
                                        onClick={() => setCustomAdvanceCut(String(preset.amt))}
                                        className="px-2 py-1 rounded-lg text-[10px] font-bold bg-purple-500/20 text-purple-700 dark:text-purple-300 hover:bg-purple-500/30 transition-all"
                                      >
                                        {preset.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Full Breakout Card */}
                      <div className="p-4 rounded-2xl bg-emerald-500/[0.08] border border-emerald-500/20 space-y-2.5">
                        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                          <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Receipt size={14} /> Salary & Payout Breakout
                          </span>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${calc.isPaid ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'}`}>
                            {calc.isPaid ? 'Already Paid' : 'Pending Payment'}
                          </span>
                        </div>

                        {/* Breakdown lines */}
                        <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                          <div className="flex justify-between items-center">
                            <span>⏱️ Gross Earned (Attendance & Hours):</span>
                            <span className="font-bold text-gray-900 dark:text-white">
                              ₹{(calc.earnedSalary || 0).toLocaleString('en-IN')}
                            </span>
                          </div>

                          {calc.advanceDeduction > 0 && (
                            <div className="flex justify-between items-center text-rose-600 dark:text-rose-400 font-semibold">
                              <span>✂️ Advance Pay Deduction (Cut):</span>
                              <span>- ₹{calc.advanceDeduction.toLocaleString('en-IN')}</span>
                            </div>
                          )}

                          {calc.advanceDeduction === 0 && calc.activeAdvanceBalance > 0 && !calc.isPaid && (
                            <div className="flex justify-between items-center text-purple-600 dark:text-purple-400 text-[11px] italic">
                              <span>⏳ Advance Settled Next Time (Deferred):</span>
                              <span>₹0 cut (₹{calc.activeAdvanceBalance.toLocaleString('en-IN')} carried over)</span>
                            </div>
                          )}

                          <div className="flex justify-between items-center pt-2 border-t border-emerald-500/20">
                            <span className="text-sm font-black text-gray-900 dark:text-white">
                              💰 Final Net Payout:
                            </span>
                            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                              ₹{calc.payout.toLocaleString('en-IN')}
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-[11px] text-gray-500 dark:text-gray-400 pt-1">
                            <span>Remaining Advance Balance After Payment:</span>
                            <span className="font-bold text-amber-600 dark:text-amber-400">
                              ₹{calc.advanceBalanceRemaining.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 border-t border-emerald-500/10 pt-1.5">
                          Calculated for <strong>{selectedSalaryMonth}</strong> ({calc.daysWorked} days present, {calc.fullLeaves} leaves, {calc.halfDays} half days)
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* Payment Mode */}
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                    Payment Mode
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSalaryPaymentDetails({ ...salaryPaymentDetails, mode: 'cash', method: 'cash' })}
                      className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${salaryPaymentDetails.mode === 'cash'
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                          : 'bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                      Cash
                    </button>
                    <button
                      type="button"
                      onClick={() => setSalaryPaymentDetails({ ...salaryPaymentDetails, mode: 'online' })}
                      className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${salaryPaymentDetails.mode === 'online'
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                          : 'bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                      Online
                    </button>
                  </div>
                </div>

                {salaryPaymentDetails.mode === 'online' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                        Payment Method
                      </label>
                      <select
                        value={salaryPaymentDetails.method}
                        onChange={(e) => setSalaryPaymentDetails({ ...salaryPaymentDetails, method: e.target.value })}
                        className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all cursor-pointer"
                      >
                        <option value="phonepe">PhonePe</option>
                        <option value="paytm">Paytm</option>
                        <option value="google_pay">Google Pay</option>
                        <option value="bank_transfer">Bank Transfer</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                        UTR / Ref No. (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. UTR / Ref ID"
                        value={salaryPaymentDetails.utrNumber}
                        onChange={(e) => setSalaryPaymentDetails({ ...salaryPaymentDetails, utrNumber: e.target.value })}
                        className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsSalaryModalOpen(false)}
                  className="flex-1 px-5 py-3 rounded-2xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                {(() => {
                  const calc = calculatePayoutForSelectedMonth(selectedStaffForSalary, selectedSalaryMonth);
                  if (calc.isPaid) {
                    return (
                      <button
                        type="button"
                        onClick={() => handleRevertSalary(selectedStaffForSalary, selectedSalaryMonth)}
                        className="flex-1 px-5 py-3 rounded-2xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2"
                      >
                        <RotateCcw size={16} /> Revert Payment
                      </button>
                    );
                  }
                  return (
                    <button
                      type="button"
                      onClick={handleConfirmClearSalary}
                      className="flex-1 px-5 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-black uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={16} /> Confirm Payment
                    </button>
                  );
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full Image Lightbox Modal */}
      <AnimatePresence>
        {fullImageModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFullImageModal({ isOpen: false, src: '', title: '' })}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-4xl max-h-[90vh] z-10 flex flex-col items-center justify-center pointer-events-auto"
            >
              <button
                type="button"
                onClick={() => setFullImageModal({ isOpen: false, src: '', title: '' })}
                className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                title="Close"
              >
                <X size={24} />
              </button>
              <img
                src={fullImageModal.src}
                alt={fullImageModal.title || 'Profile Picture'}
                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/20"
              />
              {fullImageModal.title && (
                <p className="mt-4 text-white font-bold text-sm sm:text-base tracking-wide bg-black/70 px-6 py-2 rounded-full border border-white/10 backdrop-blur-sm">
                  {fullImageModal.title}
                </p>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StaffDetails;