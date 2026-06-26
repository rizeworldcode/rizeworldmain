import { useState, useEffect } from 'react';
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
  MoreVertical,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  X,
  Upload,
  Image as ImageIcon,
  ListTodo,
  CheckCircle2,
  TrendingUp,
  LogIn,
  LogOut
} from 'lucide-react';
import StaffPerformance from './StaffPerformance';

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

            {/* Editable fields */}
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Monthly Salary (₹)</label>
              <input
                type="number"
                className="w-full bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                value={formData.monthlySalary}
                onChange={(e) => setFormData({ ...formData, monthlySalary: e.target.value })}
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Department</label>
              <input
                type="text"
                className="w-full bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
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
              <select
                className="w-full bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="Employee" className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white">Employee</option>
                <option value="HR" className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white">HR</option>
                <option value="Client Support" className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white">Client Support</option>
                <option value="Admin" className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white">Admin</option>
                <option value="Data Analyst" className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white">Data Analyst</option>
                <option value="Sales Team" className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white">Sales Team</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Salary Status</label>
              <select
                className="w-full bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                value={formData.salaryStatus}
                onChange={(e) => setFormData({ ...formData, salaryStatus: e.target.value })}
              >
                <option value="Paid" className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white">Paid</option>
                <option value="Pending" className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white">Pending</option>
              </select>
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
                <CreditCard size={14} className="text-blue-500" /> Account Details
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
                  {staffMember.documents.map((doc, i) => (
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

// Helper functions for time calculation
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
  // Assuming 9 hours per day
  return daysPassed * 9 * 60;
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStaffForPerformance, setSelectedStaffForPerformance] = useState(null);

  // Fetch staff from backend
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch('http://localhost:45000/api/staff');
        const result = await response.json();
        if (result.success) {
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

    return matchesSearch && matchesJobType && matchesDepartment;
  });

  const handleUpdateStaff = async (id, updatedData) => {
    try {
      const response = await fetch(`http://localhost:45000/api/staff/${id}`, {
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
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        const response = await fetch(`http://localhost:45000/api/staff/${id}`, {
          method: 'DELETE'
        });
        const result = await response.json();
        if (result.success) {
          setStaff(staff.filter(member => member._id !== id));
        }
      } catch (error) {
        console.error('Error deleting staff:', error);
      }
    }
  };

  const handleClockIn = async (member) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:45000/api/staff/${member._id}/clock-in`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
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
      const response = await fetch(`http://localhost:45000/api/staff/${member._id}/clock-out`, {
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

  const openEditModal = (member) => {
    setEditingStaff(member);
    setIsEditModalOpen(true);
  };

  const calculatePayout = (member) => {
    const baseSalary = member.monthlySalary || 0;
    const oneDaySalary = baseSalary / 30;

    // Get current date details
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonthSoFar = today.getDate(); // Calculation up to today

    const monthlyAttendance = (member.attendance || []).filter(record => {
      const d = new Date(record.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    // Count present and half-days from recorded attendance
    const presentDays = monthlyAttendance.filter(r => r.status === 'Present').length;
    const halfDays = monthlyAttendance.filter(r => r.status === 'Half-Day').length;
    const explicitlyOnLeave = monthlyAttendance.filter(r => r.status === 'On Leave').length;

    // Days not clocked in at all (excluding today if not clocked out yet)
    // We assume staff should work every day for this calculation, 
    // or you might want to exclude Sundays. Let's stick to simple 30-day logic.
    const daysRecorded = monthlyAttendance.length;
    const absentDays = Math.max(0, daysInMonthSoFar - daysRecorded);

    const totalFullLeaves = explicitlyOnLeave + absentDays;

    // 1st leave is casual (no deduction)
    const deductibleLeaves = Math.max(0, totalFullLeaves - 1);
    const deduction = (deductibleLeaves * oneDaySalary) + (halfDays * (oneDaySalary / 2));

    const payout = Math.round(baseSalary - deduction);
    return {
      payout,
      fullLeaves: totalFullLeaves,
      halfDays,
      isCasualUsed: totalFullLeaves > 0
    };
  };

  const handleClearSalary = async (member) => {
    const { payout, fullLeaves, halfDays, isCasualUsed } = calculatePayout(member);
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    if (window.confirm(`Are you sure you want to clear the salary (₹${payout.toLocaleString()}) for ${member.name} for ${currentMonth}?`)) {
      try {
        const response = await fetch(`http://localhost:45000/api/staff/${member._id}/clear-salary`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            month: currentMonth,
            baseSalary: member.monthlySalary,
            payoutSalary: payout,
            totalLeaves: fullLeaves,
            totalHalfDays: halfDays,
            casualLeaveUsed: isCasualUsed
          })
        });
        const result = await response.json();
        if (result.success) {
          setStaff(staff.map(m =>
            m._id === member._id ? result.data : m
          ));
          alert('Salary cleared and record saved successfully');
        }
      } catch (error) {
        console.error('Error clearing salary:', error);
        alert('Failed to clear salary');
      }
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Staff', value: filteredStaff.length, icon: Users, color: 'blue' },
          { label: 'Total Monthly Salary', value: `₹${filteredStaff.reduce((acc, curr) => acc + curr.monthlySalary, 0)}`, icon: IndianRupee, color: 'emerald' },
          { label: 'Pending Salaries', value: filteredStaff.filter(s => s.salaryStatus === 'Pending').length, icon: Clock, color: 'orange' },
        ].map((stat, index) => (stat && (
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
        )))}
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
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Base Salary</th>
                <th className="px-6 py-4 text-[10px] font-bold text-emerald-500 dark:text-emerald-400 uppercase tracking-widest">Payout Salary</th>
                {/* <th className="px-6 py-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Current Month Hours</th> */}
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Joining Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Documents</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {filteredStaff.map((member) => {
                // // Calculate current month total hours
                // const currentMonthTotalMinutes = calculateCurrentMonthTotalHours(member.clock || []);
                // const expectedMinutes = getCurrentMonthExpectedHours();
                // const differenceMinutes = currentMonthTotalMinutes - expectedMinutes;
                // const currentMonthTotalFormatted = formatHoursMinutes(currentMonthTotalMinutes);
                // const differenceFormatted = formatHoursMinutes(Math.abs(differenceMinutes));

                return (
                  <tr key={member._id} className="hover:bg-black/[0.02] dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div
                        className="flex items-center gap-3 cursor-pointer group/name"
                        onClick={() => setSelectedStaffForPerformance(member._id)}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold group-hover/name:scale-110 transition-transform">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900 dark:text-white group-hover/name:text-blue-500 transition-colors flex items-center gap-2">
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
                      <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-1.5">
                        {member.department}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Briefcase size={12} /> {member.jobType}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900 dark:text-white">₹{member.monthlySalary}</div>
                      <div className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${member.salaryStatus === 'Paid' ? 'text-emerald-600 dark:text-emerald-500' : 'text-orange-600 dark:text-orange-500'
                        }`}>
                        {member.salaryStatus}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {(() => {
                        const { payout, fullLeaves, halfDays, isCasualUsed } = calculatePayout(member);
                        return (
                          <>
                            <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">₹{payout.toLocaleString('en-IN')}</div>
                            <div className="flex flex-col gap-0.5 mt-1">
                              <span className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">Calculated Payout</span>
                              <div className="flex gap-1.5 mt-0.5">
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1 font-medium">
                        <Calendar size={12} /> {member.joiningDate ? new Date(member.joiningDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {member.documents.map((doc, i) => (
                          <span key={i} className="text-[10px] bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded px-1.5 py-0.5 text-gray-600 dark:text-gray-400">
                            {typeof doc === 'string' ? doc : doc.name}
                          </span>
                        ))}
                      </div>
                      <div className="mt-1.5 flex items-center gap-1 text-[10px] text-gray-500 italic">
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
                                <div className="flex items-center gap-2 text-amber-500 bg-amber-500/5 px-4 py-2 rounded-xl border border-amber-500/10">
                                  <Calendar size={16} />
                                  <span className="text-xs font-black uppercase tracking-widest">{reason}</span>
                                </div>
                              );
                            } else if (member.clock_status === 'clock_in') {
                              return (
                                <button
                                  onClick={() => handleClockOut(member)}
                                  className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white rounded-xl transition-all border border-rose-500/20 shadow-lg shadow-rose-500/10 flex items-center gap-2 group/clockout"
                                  title="Clock Out"
                                >
                                  <LogOut size={16} className="group-hover/clockout:scale-110 transition-transform" />
                                  <span className="text-xs font-black uppercase tracking-widest">Clock Out</span>
                                </button>
                              );
                            } else {
                              return (
                                <button
                                  onClick={() => handleClockIn(member)}
                                  className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white rounded-xl transition-all border border-emerald-500/20 shadow-lg shadow-emerald-500/10 flex items-center gap-2 group/clockin"
                                  title="Clock In"
                                >
                                  <LogIn size={16} className="group-hover/clockin:scale-110 transition-transform" />
                                  <span className="text-xs font-black uppercase tracking-widest">Clock In</span>
                                </button>
                              );
                            }
                          })()}
                          {member.salaryStatus === 'Pending' ? (
                            <button
                              onClick={() => handleClearSalary(member)}
                              className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white rounded-xl transition-all border border-emerald-500/20 shadow-lg shadow-emerald-500/10 flex items-center gap-2 group/salary"
                              title="Clear Salary"
                            >
                              <CheckCircle2 size={16} className="group-hover/salary:scale-110 transition-transform" />
                              <span className="text-xs font-black uppercase tracking-widest">Clear Salary</span>
                            </button>
                          ) : (
                            <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/5 px-4 py-2 rounded-xl border border-emerald-500/10">
                              <CheckCircle2 size={16} />
                              <span className="text-xs font-black uppercase tracking-widest">Salary Paid</span>
                            </div>
                          )}
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
    </motion.div>
  );
};

export default StaffDetails;
