import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  ShieldCheck,
  UserPlus,
  KeyRound,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Search,
  CheckSquare,
  Square,
  Lock,
  Mail,
  User,
  AlertTriangle,
  X
} from 'lucide-react';
import { getAllSubAdmins, createSubAdmin, updateSubAdmin, deleteSubAdmin } from '../api';

const AVAILABLE_PERMISSIONS = [
  { id: 'dashboard', label: 'Dashboard / Overview', description: 'View analytics, stats, and business overview' },
  { id: 'todayWork', label: 'Today Assigned Work', description: 'Monitor daily tasks, progress, and approvals' },
  { id: 'staffDetail', label: 'Employee Detail', description: 'View and manage employee profiles and status' },
  { id: 'addStaff', label: 'Add Employee', description: 'Onboard new staff and team members' },
  { id: 'removedEmployees', label: 'Removed Employees', description: 'View archived or deleted employee records' },
  { id: 'hiring', label: 'Hiring Posts', description: 'Create and manage job openings and recruitment posts' },
  { id: 'clients', label: 'Clients & Projects', description: 'Access clients list, project milestones, and billing' },
  { id: 'wallet', label: 'Wallet & Transactions', description: 'View financial transactions and wallet balances' },
  { id: 'salesTracking', label: 'Sales Tracking', description: 'Track sales personnel live location and visits' },
  { id: 'salesPhotos', label: 'Sales Photos', description: 'View client visit verification photos' },
  { id: 'visitingCards', label: 'Visiting Cards', description: 'View scanned visiting cards from field visits' },
  { id: 'salarySheet', label: 'Salary Sheet', description: 'Generate and review staff payroll sheets' },
];

const AdminUsers = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    permissions: [],
    isActive: true,
  });
  const [showPassword, setShowPassword] = useState(false);

  const showToastMsg = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await getAllSubAdmins();
      if (res && res.success) {
        setAdmins(res.data || []);
      } else {
        showToastMsg(res?.message || 'Failed to load admin accounts', 'error');
      }
    } catch (err) {
      console.error('Fetch admins error:', err);
      showToastMsg('Failed to connect to server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleOpenCreateModal = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      permissions: ['dashboard', 'todayWork', 'clients'],
      isActive: true,
    });
    setShowPassword(false);
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (admin) => {
    setSelectedAdmin(admin);
    setFormData({
      name: admin.name || '',
      email: admin.email || '',
      password: '', // blank unless updating
      permissions: admin.permissions || [],
      isActive: admin.isActive !== false,
    });
    setShowPassword(false);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (admin) => {
    setSelectedAdmin(admin);
    setIsDeleteModalOpen(true);
  };

  const handleTogglePermission = (permId) => {
    setFormData((prev) => {
      const exists = prev.permissions.includes(permId);
      if (exists) {
        return { ...prev, permissions: prev.permissions.filter((p) => p !== permId) };
      } else {
        return { ...prev, permissions: [...prev.permissions, permId] };
      }
    });
  };

  const handleSelectAllPermissions = () => {
    if (formData.permissions.length === AVAILABLE_PERMISSIONS.length) {
      setFormData((prev) => ({ ...prev, permissions: [] }));
    } else {
      setFormData((prev) => ({
        ...prev,
        permissions: AVAILABLE_PERMISSIONS.map((p) => p.id),
      }));
    }
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    let generated = '';
    for (let i = 0; i < 10; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, password: generated }));
    setShowPassword(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      showToastMsg('Email and password are required', 'error');
      return;
    }
    setActionLoading(true);
    try {
      const res = await createSubAdmin({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        permissions: formData.permissions,
      });
      if (res && res.success) {
        showToastMsg('Sub-admin account created successfully!');
        setIsCreateModalOpen(false);
        fetchAdmins();
      } else {
        showToastMsg(res?.message || 'Failed to create sub-admin', 'error');
      }
    } catch (err) {
      console.error(err);
      showToastMsg('Error creating sub-admin', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAdmin) return;
    setActionLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        permissions: formData.permissions,
        isActive: formData.isActive,
      };
      if (formData.password && formData.password.trim().length > 0) {
        payload.password = formData.password.trim();
      }

      const res = await updateSubAdmin(selectedAdmin._id, payload);
      if (res && res.success) {
        showToastMsg('Admin account updated successfully!');
        setIsEditModalOpen(false);
        fetchAdmins();
      } else {
        showToastMsg(res?.message || 'Failed to update admin account', 'error');
      }
    } catch (err) {
      console.error(err);
      showToastMsg('Error updating admin account', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedAdmin) return;
    setActionLoading(true);
    try {
      const res = await deleteSubAdmin(selectedAdmin._id);
      if (res && res.success) {
        showToastMsg('Admin account deleted successfully!');
        setIsDeleteModalOpen(false);
        fetchAdmins();
      } else {
        showToastMsg(res?.message || 'Failed to delete account', 'error');
      }
    } catch (err) {
      console.error(err);
      showToastMsg('Error deleting account', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredAdmins = admins.filter((admin) => {
    const q = searchQuery.toLowerCase();
    return (
      (admin.name && admin.name.toLowerCase().includes(q)) ||
      (admin.email && admin.email.toLowerCase().includes(q)) ||
      (admin.role && admin.role.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-xl ${
              toast.type === 'error'
                ? 'bg-rose-500/90 text-white border-rose-400'
                : 'bg-emerald-600/90 text-white border-emerald-400'
            }`}
          >
            {toast.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
            <span className="font-semibold text-sm">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-xl shadow-blue-500/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase mb-3">
              <ShieldCheck size={14} /> Role-Based Access Control
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Admin Accounts & Access</h1>
            <p className="text-blue-100 mt-2 max-w-xl text-sm sm:text-base">
              Create sub-admin logins with custom email & password. Control precisely which sections they can access. Passwords and permissions can only be managed by the Super Admin.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white text-blue-700 font-bold shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all shrink-0 self-start md:self-auto"
          >
            <UserPlus size={20} />
            Create Sub-Admin
          </motion.button>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search admins by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 dark:text-white"
          />
        </div>

        <button
          onClick={fetchAdmins}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 text-sm font-medium transition-all"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Admin Cards Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mb-3" />
          <p className="text-gray-500 font-medium">Loading admin accounts...</p>
        </div>
      ) : filteredAdmins.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/10 p-8">
          <Shield className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">No Admin Accounts Found</h3>
          <p className="text-gray-500 text-sm mt-1">Try adjusting your search query or create a new sub-admin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAdmins.map((admin) => {
            const isSuper = admin.role === 'superadmin' || !admin.role;
            const perms = isSuper ? ['Full Access (All Features)'] : admin.permissions || [];

            return (
              <motion.div
                key={admin._id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative bg-white dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/10 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top info badge & status */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        isSuper
                          ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                          : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                      }`}
                    >
                      {isSuper ? <Shield size={12} /> : <ShieldCheck size={12} />}
                      {isSuper ? 'Super Admin' : 'Sub-Admin'}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        admin.isActive !== false
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {admin.isActive !== false ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {admin.isActive !== false ? 'Active' : 'Disabled'}
                    </span>
                  </div>

                  {/* Name and Email */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                      {admin.name || (isSuper ? 'Super Admin' : 'Admin User')}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1 truncate">
                      <Mail size={13} className="shrink-0" />
                      {admin.email}
                    </p>
                  </div>

                  {/* Feature Permissions Chips */}
                  <div className="mb-6">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                      Allowed Features ({isSuper ? 'All' : perms.length})
                    </label>

                    {isSuper ? (
                      <div className="inline-block px-3 py-1.5 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-purple-700 dark:text-purple-300 rounded-xl text-xs font-semibold border border-purple-200/50 dark:border-purple-800/50">
                        ⚡ Unrestricted Super Admin Access
                      </div>
                    ) : perms.length === 0 ? (
                      <div className="text-xs text-rose-500 font-medium italic">
                        No features permitted yet
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                        {perms.map((pId) => {
                          const matched = AVAILABLE_PERMISSIONS.find((ap) => ap.id === pId);
                          return (
                            <span
                              key={pId}
                              className="px-2.5 py-1 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium"
                            >
                              {matched ? matched.label : pId}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Bottom Actions */}
                <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-gray-400">
                    {admin.created_at ? new Date(admin.created_at).toLocaleDateString() : 'Active'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(admin)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                      title="Edit Permissions & Password"
                    >
                      <Edit2 size={13} />
                      Edit Access
                    </button>

                    {!isSuper && (
                      <button
                        onClick={() => handleOpenDeleteModal(admin)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                        title="Delete Sub-Admin"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* CREATE SUB-ADMIN MODAL */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#121212] rounded-3xl max-w-2xl w-full border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden my-8"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
                    <UserPlus size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Sub-Admin</h2>
                    <p className="text-xs text-gray-500">Provide login credentials and feature permissions</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleCreateSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Name / Label</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        placeholder="e.g. Sales Manager"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Admin Email <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="email"
                        required
                        placeholder="manager@rizeworld.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Login Password <span className="text-rose-500">*</span></label>
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="text-xs text-blue-600 font-bold hover:underline"
                    >
                      + Generate Strong Password
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Minimum 6 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-12 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Permissions Picker */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-bold text-gray-900 dark:text-white">Feature Permissions</label>
                      <p className="text-xs text-gray-500">Select which sections this admin account can view and manage</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleSelectAllPermissions}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200 transition-colors"
                    >
                      {formData.permissions.length === AVAILABLE_PERMISSIONS.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                    {AVAILABLE_PERMISSIONS.map((perm) => {
                      const isSelected = formData.permissions.includes(perm.id);
                      return (
                        <div
                          key={perm.id}
                          onClick={() => handleTogglePermission(perm.id)}
                          className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                            isSelected
                              ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800'
                              : 'bg-gray-50/40 dark:bg-white/[0.02] border-gray-200 dark:border-white/10 hover:border-gray-300'
                          }`}
                        >
                          <div className={`mt-0.5 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`}>
                            {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-gray-900 dark:text-white">{perm.label}</div>
                            <div className="text-[11px] text-gray-500 line-clamp-1">{perm.description}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all flex items-center gap-2"
                  >
                    {actionLoading && <RefreshCw size={14} className="animate-spin" />}
                    Create Account
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT SUB-ADMIN MODAL */}
      <AnimatePresence>
        {isEditModalOpen && selectedAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#121212] rounded-3xl max-w-2xl w-full border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden my-8"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center">
                    <KeyRound size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Access & Password</h2>
                    <p className="text-xs text-gray-500">{selectedAdmin.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Name / Label</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Admin Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Password reset field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      Update Password <span className="text-gray-400 font-normal">(leave blank to keep unchanged)</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="text-xs text-blue-600 font-bold hover:underline"
                    >
                      + Generate Password
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Type new password or leave blank"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-12 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Active Switch */}
                {selectedAdmin.role !== 'superadmin' && (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                    <div>
                      <div className="text-xs font-bold text-gray-900 dark:text-white">Account Status</div>
                      <div className="text-[11px] text-gray-500">Allow or block this admin from logging in</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                )}

                {/* Permissions Picker */}
                {selectedAdmin.role !== 'superadmin' && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-bold text-gray-900 dark:text-white">Feature Permissions</label>
                        <p className="text-xs text-gray-500">Update the granted features for this sub-admin</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleSelectAllPermissions}
                        className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200 transition-colors"
                      >
                        {formData.permissions.length === AVAILABLE_PERMISSIONS.length ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                      {AVAILABLE_PERMISSIONS.map((perm) => {
                        const isSelected = formData.permissions.includes(perm.id);
                        return (
                          <div
                            key={perm.id}
                            onClick={() => handleTogglePermission(perm.id)}
                            className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                              isSelected
                                ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800'
                                : 'bg-gray-50/40 dark:bg-white/[0.02] border-gray-200 dark:border-white/10 hover:border-gray-300'
                            }`}
                          >
                            <div className={`mt-0.5 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`}>
                              {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-gray-900 dark:text-white">{perm.label}</div>
                              <div className="text-[11px] text-gray-500 line-clamp-1">{perm.description}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all flex items-center gap-2"
                  >
                    {actionLoading && <RefreshCw size={14} className="animate-spin" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#121212] rounded-3xl max-w-md w-full border border-gray-200 dark:border-white/10 shadow-2xl p-6 space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 size={24} />
              </div>

              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Sub-Admin Account</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Are you sure you want to remove <strong>{selectedAdmin.email}</strong>? They will no longer be able to log in to the admin panel.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteSubmit}
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-lg shadow-rose-500/20 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {actionLoading && <RefreshCw size={14} className="animate-spin" />}
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUsers;
