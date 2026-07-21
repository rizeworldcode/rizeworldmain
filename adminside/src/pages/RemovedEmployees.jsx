import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trash2,
  Search,
  Calendar,
  Briefcase,
  IndianRupee,
  Mail,
  Phone,
  RotateCw,
  UserPlus,
  X,
  Save
} from 'lucide-react';

const REMOVED_STAFF_API = 'http://localhost:45000/api/staff/removed';

const RemovedEmployees = () => {
  const [removedStaff, setRemovedStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isRejoinModalOpen, setIsRejoinModalOpen] = useState(false);
  const [rejoiningEmployee, setRejoiningEmployee] = useState(null);
  const [rejoinForm, setRejoinForm] = useState({
    name: '',
    phone: '',
    email: '',
    monthlySalary: '',
    department: '',
    jobType: '',
    joiningDate: '',
    accountHolder: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenRejoinModal = (member) => {
    setRejoiningEmployee(member);
    setRejoinForm({
      name: member.name || '',
      phone: member.phone || '',
      email: member.email || '',
      monthlySalary: member.monthlySalary || '',
      department: member.department === 'WEB DEvlopment' ? 'WEB Development' : member.department || '',
      jobType: member.jobType || '',
      joiningDate: member.joiningDate ? new Date(member.joiningDate).toISOString().split('T')[0] : '',
      accountHolder: member.accountHolder || '',
      accountNumber: member.accountNumber || '',
      ifscCode: member.ifscCode || '',
      bankName: member.bankName || '',
    });
    setIsRejoinModalOpen(true);
  };

  const handleInputChange = (field, value) => {
    setRejoinForm(prev => ({
      ...prev,
      [field]: field === 'monthlySalary' ? (value ? Number(value) : '') : value
    }));
  };

  const handleRejoinSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:45000/api/staff/${rejoiningEmployee._id}/rejoin`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(rejoinForm)
      });
      const result = await response.json();
      if (result.success) {
        setIsRejoinModalOpen(false);
        setRejoiningEmployee(null);
        alert('Employee rejoined successfully!');
        fetchRemovedStaff();
      } else {
        alert('Failed to rejoin employee: ' + result.message);
      }
    } catch (error) {
      console.error('Error rejoining employee:', error);
      alert('Error rejoining employee!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchRemovedStaff = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(REMOVED_STAFF_API, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const result = await response.json();

      if (result.success) {
        setRemovedStaff(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching removed staff:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRemovedStaff();
  }, [fetchRemovedStaff]);

  const filteredRemovedStaff = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return removedStaff.filter((member) => {
      if (!term) return true;

      return (
        member.name?.toLowerCase().includes(term) ||
        member.email?.toLowerCase().includes(term) ||
        member.department?.toLowerCase().includes(term) ||
        member.employeeId?.toLowerCase().includes(term)
      );
    }).sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }, [removedStaff, searchTerm]);

  const removedThisMonth = useMemo(() => {
    const now = new Date();

    return removedStaff.filter((member) => {
      if (!member.removedAt) return false;
      const removedDate = new Date(member.removedAt);
      return removedDate.getMonth() === now.getMonth() && removedDate.getFullYear() === now.getFullYear();
    }).length;
  }, [removedStaff]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-900 dark:text-white text-xl animate-pulse">Loading removed employees...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Removed Employees</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Employees deleted from Employee Details are stored here.</p>
        </div>

        <button
          onClick={fetchRemovedStaff}
          className="flex items-center gap-2 bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-5 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-black/10 dark:hover:bg-white/10 transition-all w-fit"
        >
          <RotateCw size={18} />
          Refresh List
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Removed', value: filteredRemovedStaff.length, icon: Trash2, color: 'rose' },
          { label: 'Removed This Month', value: removedThisMonth, icon: Calendar, color: 'amber' },
          {
            label: 'Monthly Salary Snapshot',
            value: `Rs ${filteredRemovedStaff.reduce((sum, member) => sum + (member.monthlySalary || 0), 0).toLocaleString('en-IN')}`,
            icon: IndianRupee,
            color: 'blue'
          }
        ].map((stat, index) => (
          <div key={index} className="glass p-6 rounded-3xl border border-gray-200 dark:border-white/10 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-500`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Search removed employee by name, email, department or employee ID..."
          className="w-full bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="glass rounded-3xl border border-gray-200 dark:border-white/10 overflow-hidden transition-colors">
        <div className="overflow-x-auto overflow-y-auto max-h-[650px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/10 bg-black/5 dark:bg-white/5">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Employee</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Department</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Salary</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Joining Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-rose-500 dark:text-rose-400 uppercase tracking-widest">Removed On</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {filteredRemovedStaff.length > 0 ? filteredRemovedStaff.map((member) => (
                <tr key={member._id} className="hover:bg-black/[0.02] dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white font-bold">
                        {member.name?.charAt(0) || 'R'}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">{member.name}</div>
                        <div className="text-xs text-gray-500 flex flex-col gap-0.5 mt-1">
                          <span className="flex items-center gap-1"><Mail size={12} /> {member.email || 'N/A'}</span>
                          <span className="flex items-center gap-1"><Phone size={12} /> {member.phone || 'N/A'}</span>
                          <span className="font-semibold text-gray-700 dark:text-gray-300">{member.employeeId || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <span className="inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        {member.department || 'N/A'}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                        <Briefcase size={12} /> {member.role || 'Employee'} | {member.jobType || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                      Rs {(member.monthlySalary || 0).toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-wider mt-1 text-rose-600 dark:text-rose-400">
                      Removed
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-300">
                      <Calendar size={12} />
                      {member.joiningDate ? new Date(member.joiningDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-rose-600 dark:text-rose-400">
                      {member.removedAt ? new Date(member.removedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleOpenRejoinModal(member)}
                      className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all"
                    >
                      <UserPlus size={14} />
                      Rejoin
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center text-gray-500 dark:text-gray-400">
                    No removed employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rejoin & Edit Details Modal */}
      {isRejoinModalOpen && rejoiningEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsRejoinModalOpen(false)}
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-4xl bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-y-auto max-h-[90vh] z-10"
          >
            <form onSubmit={handleRejoinSubmit} className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-white/5">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <UserPlus className="text-emerald-500" />
                  Rejoin Employee & Edit Details
                </h2>
                <button
                  type="button"
                  onClick={() => setIsRejoinModalOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                    <input
                      type="text"
                      required
                      value={rejoinForm.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={rejoinForm.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                    <input
                      type="email"
                      required
                      value={rejoinForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Job Info */}
              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Job Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Monthly Salary (₹)</label>
                    <input
                      type="number"
                      required
                      value={rejoinForm.monthlySalary}
                      onChange={(e) => handleInputChange('monthlySalary', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Department</label>
                    <select
                      value={rejoinForm.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none cursor-pointer"
                    >
                      <option value="WEB Development">WEB Development</option>
                      <option value="SEO">SEO</option>
                      <option value="Graphic Design">Graphic Design</option>
                      <option value="SMM">SMM</option>
                      <option value="Video Editing">Video Editing</option>
                      <option value="Accounts">Accounts</option>
                      <option value="HR">HR</option>
                      <option value="Sales Team">Sales Team</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Job Type</label>
                    <select
                      value={rejoinForm.jobType}
                      onChange={(e) => handleInputChange('jobType', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none cursor-pointer"
                    >
                      <option value="Permanent">Permanent</option>
                      <option value="Intern">Intern</option>
                      <option value="Part-time">Part-time</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Joining Date</label>
                    <input
                      type="date"
                      value={rejoinForm.joiningDate}
                      onChange={(e) => handleInputChange('joiningDate', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Bank Account Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Account Holder</label>
                    <input
                      type="text"
                      value={rejoinForm.accountHolder}
                      onChange={(e) => handleInputChange('accountHolder', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none"
                      placeholder="Name on account"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Bank Name</label>
                    <input
                      type="text"
                      value={rejoinForm.bankName}
                      onChange={(e) => handleInputChange('bankName', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none"
                      placeholder="e.g. HDFC Bank"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Account Number</label>
                    <input
                      type="text"
                      value={rejoinForm.accountNumber}
                      onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none"
                      placeholder="Enter account number"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">IFSC Code</label>
                    <input
                      type="text"
                      value={rejoinForm.ifscCode}
                      onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none"
                      placeholder="e.g. HDFC0001234"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRejoinModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-6 py-3 border border-gray-200 dark:border-white/10 rounded-xl text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Rejoining...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Rejoin Employee
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default RemovedEmployees;
