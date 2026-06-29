import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  TrendingUp,
  Clock,
  AlertCircle,
  IndianRupee,
  Briefcase,
  Mail,
  Phone,
  User,
  Edit3,
  X,
  Save,
  Upload,
  Trash2
} from 'lucide-react';

// Helper functions for time calculation
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

const StaffPerformance = ({ staffId, onBack }) => {
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
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
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentName, setDocumentName] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchStaffDetails = async () => {
      try {
        const response = await fetch(`http://localhost:45000/api/staff`);
        const result = await response.json();
        if (result.success) {
          const foundStaff = result.data.find(s => s._id === staffId);
          setStaff(foundStaff);
          // Initialize edit form with staff data, fix legacy department value
          setEditForm({
            name: foundStaff?.name || '',
            phone: foundStaff?.phone || '',
            email: foundStaff?.email || '',
            monthlySalary: foundStaff?.monthlySalary || '',
            department: foundStaff?.department === 'WEB DEvlopment' ? 'WEB Development' : foundStaff?.department || '',
            jobType: foundStaff?.jobType || '',
            joiningDate: foundStaff?.joiningDate ? new Date(foundStaff.joiningDate).toISOString().split('T')[0] : '',
            accountHolder: foundStaff?.accountHolder || '',
            accountNumber: foundStaff?.accountNumber || '',
            ifscCode: foundStaff?.ifscCode || '',
            bankName: foundStaff?.bankName || '',
            password: ''
          });
        }
      } catch (error) {
        console.error('Error fetching staff details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStaffDetails();
  }, [staffId]);

  // Reusable input change handler
  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: field === 'monthlySalary' ? (value ? Number(value) : '') : value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:45000/api/staff/${staffId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...editForm,
          password: editForm.password ? editForm.password : undefined
        })
      });
      const result = await response.json();
      if (result.success) {
        setStaff(result.data);
        // Update edit form with new data
        setEditForm({
          name: result.data.name || '',
          phone: result.data.phone || '',
          email: result.data.email || '',
          monthlySalary: result.data.monthlySalary || '',
          department: result.data.department || '',
          jobType: result.data.jobType || '',
          joiningDate: result.data.joiningDate ? new Date(result.data.joiningDate).toISOString().split('T')[0] : '',
          accountHolder: result.data.accountHolder || '',
          accountNumber: result.data.accountNumber || '',
          ifscCode: result.data.ifscCode || '',
          bankName: result.data.bankName || '',
          password: ''
        });
        setIsEditModalOpen(false);
        alert('Staff details updated successfully!');
      } else {
        alert('Failed to update staff details: ' + result.message);
      }
    } catch (error) {
      console.error('Error updating staff details:', error);
      alert('Error updating staff details!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadDocument = async () => {
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('document', selectedFile);
      formData.append('name', documentName || selectedFile.name);

      const response = await fetch(`http://localhost:45000/api/staff/${staffId}/upload-document`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      if (result.success) {
        setStaff(result.data);
        setSelectedFile(null);
        setDocumentName('');
        alert('Document uploaded successfully');
      } else {
        alert('Failed to upload document: ' + result.message);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Error uploading document');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:45000/api/staff/${staffId}/document/${docId}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      if (result.success) {
        setStaff(result.data);
        alert('Document deleted successfully');
      } else {
        alert('Failed to delete document: ' + result.message);
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Error deleting document');
    }
  };

  const performanceReport = useMemo(() => {
    if (!staff) return null;

    // Use historical data from database if available
    const history = (staff.salaryHistory || []).map(h => ({
      month: h.month,
      presents: 30 - (h.totalLeaves + h.totalHalfDays), // Approximate
      leaves: h.totalLeaves,
      halfDays: h.totalHalfDays,
      casualLeaveUsed: h.casualLeavesUsed, // Fix field name typo (plural)
      deduction: h.baseSalary - h.payoutSalary,
      finalPayout: h.payoutSalary,
      attendancePercentage: Math.round(((30 - h.totalLeaves - (h.totalHalfDays * 0.5)) / 30) * 100)
    }));

    // Current month real-time calculation
    const currentMonthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    
    // Check if current month is already in history (already paid)
    const isCurrentMonthPaid = history.some(h => h.month === currentMonthName);

    if (!isCurrentMonthPaid) {
      const baseSalary = staff.monthlySalary || 0;
      const dailyRate = baseSalary / 30;
      
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const daysInMonthSoFar = today.getDate();

      const monthlyAttendance = (staff.attendance || []).filter(record => {
        const d = new Date(record.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });

      let fullLeaves = 0;
      let halfDays = 0;
      let presents = 0;

      // Loop through each day of the current month up to today
      for (let day = 1; day <= daysInMonthSoFar; day++) {
        const dateToCheck = new Date(currentYear, currentMonth, day);
        const isSunday = dateToCheck.getDay() === 0; // 0 = Sunday

        // Find attendance record for this day
        const record = monthlyAttendance.find(r => {
          const rd = new Date(r.date);
          return rd.getDate() === day && rd.getMonth() === currentMonth && rd.getFullYear() === currentYear;
        });

        // Check if there is an explicit leave set by admin for this day
        const hasAdminLeave = (staff.leaves || []).some(l => {
          const ld = new Date(l.date);
          return ld.getDate() === day && ld.getMonth() === currentMonth && ld.getFullYear() === currentYear;
        });

        if (isSunday || hasAdminLeave || (record && record.status === 'On Leave')) {
          // Sunday or admin-assigned leave is counted as Present!
          presents++;
        } else if (record) {
          if (record.status === 'Half-Day') {
            halfDays++;
          } else if (record.status === 'Present') {
            presents++;
          } else {
            // Treat other statuses (like 'Absent') as full leave
            fullLeaves++;
          }
        } else {
          // No record on a weekday
          fullLeaves++;
        }
      }

      const deductibleLeaves = Math.max(0, fullLeaves - 1);
      const deduction = (deductibleLeaves * dailyRate) + (halfDays * (dailyRate / 2));
      const finalPayout = Math.round(baseSalary - deduction);
      const attendancePercentage = Math.round(((daysInMonthSoFar - fullLeaves - (halfDays * 0.5)) / daysInMonthSoFar) * 100);

      history.push({
        month: currentMonthName + " (Current)",
        presents: presents,
        leaves: fullLeaves,
        halfDays: halfDays,
        casualLeaveUsed: fullLeaves > 0,
        deduction,
        finalPayout,
        attendancePercentage
      });
    }

    return history.reverse();
  }, [staff]);

  // Update edit form when modal opens or staff changes
  useEffect(() => {
    if (isEditModalOpen && staff) {
      setEditForm({
        name: staff.name || '',
        phone: staff.phone || '',
        email: staff.email || '',
        monthlySalary: staff.monthlySalary || '',
        department: staff.department === 'WEB DEvlopment' ? 'WEB Development' : staff.department || '',
        jobType: staff.jobType || '',
        joiningDate: staff.joiningDate ? new Date(staff.joiningDate).toISOString().split('T')[0] : '',
        accountHolder: staff.accountHolder || '',
        accountNumber: staff.accountNumber || '',
        ifscCode: staff.ifscCode || '',
        bankName: staff.bankName || '',
        password: ''
      });
    }
  }, [isEditModalOpen, staff]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!staff) return <div className="p-8 text-center">Staff member not found.</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-gray-100 dark:border-white/5 pb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors self-start"
        >
          <ArrowLeft size={20} />
          <span className="font-bold uppercase tracking-widest text-xs">Back to Staff List</span>
        </button>
        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Performance Report</h1>
            <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest">Monthly Salary & Attendance Breakdown</p>
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all shrink-0"
          >
            <Edit3 size={16} />
            Edit Details
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-[#111] p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm flex flex-col md:flex-row gap-6 sm:gap-8 items-center">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-500 border-2 border-white/10 shrink-0">
          <User size={64} />
        </div>
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">{staff.name}</h2>
            <p className="text-blue-500 font-black uppercase tracking-[0.2em] text-sm mt-1">{staff.department} • {staff.jobType}</p>
          </div>
          <div className="flex flex-wrap gap-6 justify-center md:justify-start">
            <span className="flex items-center gap-2 text-gray-500 font-bold text-sm"><Mail size={16} /> {staff.email}</span>
            <span className="flex items-center gap-2 text-gray-500 font-bold text-sm"><Phone size={16} /> {staff.phone}</span>
            <span className="flex items-center gap-2 text-gray-500 font-bold text-sm"><Briefcase size={16} /> Base: ₹{staff.monthlySalary?.toLocaleString()}</span>
            <span className="flex items-center gap-2 text-gray-500 font-bold text-sm">
              <Clock size={16} />
              {(() => {
                const currentMonthTotalMinutes = calculateCurrentMonthTotalHours(staff.clock || []);
                const expectedMinutes = getCurrentMonthExpectedHours();
                const differenceMinutes = currentMonthTotalMinutes - expectedMinutes;
                const currentMonthTotalFormatted = formatHoursMinutes(currentMonthTotalMinutes);
                const differenceFormatted = formatHoursMinutes(Math.abs(differenceMinutes));
                
                return (
                  <>
                    {currentMonthTotalFormatted} This Month
                    {differenceMinutes !== 0 && (
                      <span className={`ml-2 ${differenceMinutes > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        ({differenceMinutes > 0 ? '+' : '-'}{differenceFormatted})
                      </span>
                    )}
                  </>
                );
              })()}
            </span>
          </div>
        </div>
      </div>

      {/* Working Hours Calculation Breakdown */}
      <div className="bg-white dark:bg-[#111] p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm">
        <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Clock size={24} className="text-blue-500" />
          Working Hours Calculation
        </h3>
        {(() => {
          const now = new Date();
          const daysPassed = now.getDate();
          const currentMonthTotalMinutes = calculateCurrentMonthTotalHours(staff.clock || []);
          const expectedMinutes = getCurrentMonthExpectedHours();
          const differenceMinutes = currentMonthTotalMinutes - expectedMinutes;
          const currentMonthTotalFormatted = formatHoursMinutes(currentMonthTotalMinutes);
          const expectedFormatted = formatHoursMinutes(expectedMinutes);
          const differenceFormatted = formatHoursMinutes(Math.abs(differenceMinutes));
          
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Expected Hours</p>
                  <p className="text-xl font-black text-blue-600 dark:text-blue-400">{expectedFormatted}</p>
                  <p className="text-[10px] text-gray-500 mt-1">9h/day × {daysPassed} days so far</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Actual Hours Worked</p>
                  <p className="text-xl font-black text-gray-900 dark:text-white">{currentMonthTotalFormatted}</p>
                </div>
                <div className={`p-4 border rounded-2xl ${differenceMinutes > 0 ? 'bg-emerald-500/5 border-emerald-500/10' : differenceMinutes < 0 ? 'bg-rose-500/5 border-rose-500/10' : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5'}`}>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Difference</p>
                  <p className={`text-xl font-black ${differenceMinutes > 0 ? 'text-emerald-600 dark:text-emerald-400' : differenceMinutes < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-gray-900 dark:text-white'}`}>
                    {differenceMinutes > 0 ? '+' : ''}{differenceFormatted}
                  </p>
                  <p className={`text-[10px] mt-1 ${differenceMinutes > 0 ? 'text-emerald-500' : differenceMinutes < 0 ? 'text-rose-500' : 'text-gray-500'}`}>
                    {differenceMinutes > 0 ? 'Extra Hours' : differenceMinutes < 0 ? 'Less Hours' : 'On Track'}
                  </p>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Calculation Formula:</p>
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <p><strong>Expected Hours:</strong> 9 hours/day × Days passed this month = {9}h/day × {daysPassed} days = {expectedFormatted}</p>
                  <p><strong>Actual Hours:</strong> Sum of daily hours from clock records up to today = {currentMonthTotalFormatted}</p>
                  <p><strong>Difference:</strong> Actual Hours - Expected Hours = {differenceMinutes > 0 ? '+' : ''}{differenceFormatted}</p>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Monthly Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {performanceReport.map((report, idx) => (
          <motion.div 
            key={report.month} // Use month as unique key
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-[#111] p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm space-y-6 relative overflow-hidden group"
          >
            {/* Background Glow */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/5 blur-3xl rounded-full group-hover:bg-blue-500/10 transition-colors" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
              <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{report.month}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-1 w-20 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${report.attendancePercentage}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-black text-blue-500 uppercase">{report.attendancePercentage}% Efficiency</span>
                </div>
              </div>
              <div className="text-left sm:text-right shrink-0">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Final Payout</p>
                <p className="text-3xl font-black text-emerald-500">₹{report.finalPayout.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 relative z-10">
              <div className="p-3 sm:p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Presents</p>
                <p className="text-base sm:text-xl font-black text-gray-900 dark:text-white">{report.presents} <span className="text-[10px] text-gray-500">Days</span></p>
              </div>
              <div className="p-3 sm:p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Full Leaves</p>
                <p className="text-base sm:text-xl font-black text-rose-500">{report.leaves} <span className="text-[10px] text-gray-500">Days</span></p>
              </div>
              <div className="p-3 sm:p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Half Days</p>
                <p className="text-base sm:text-xl font-black text-amber-500">{report.halfDays} <span className="text-[10px] text-gray-500">Days</span></p>
              </div>
            </div>

            <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <AlertCircle size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Casual Leave Applied:</span>
              </div>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${report.casualLeaveUsed ? 'bg-emerald-500/20 text-emerald-600' : 'bg-gray-200 text-gray-500'}`}>
                {report.casualLeaveUsed ? 'Yes (1 Free)' : 'Not Used'}
              </span>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl relative z-10 text-[10px] text-gray-500 dark:text-gray-400 font-medium space-y-1">
              <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 border-b border-gray-100 dark:border-white/5 pb-1">Salary Calculation Formula:</p>
              <p>Base Salary: ₹{(staff.monthlySalary || 0).toLocaleString('en-IN')}</p>
              <p>Daily Rate (Base / 30): ₹{Math.round((staff.monthlySalary || 0) / 30).toLocaleString('en-IN')}</p>
              <p>Deductible Leaves: {Math.max(0, report.leaves - 1)} day(s) (Total {report.leaves} leaves, 1 casual leave free)</p>
              <p>Half Days Deduction: {report.halfDays} × 50% rate = {report.halfDays * 0.5} day(s)</p>
              <p className="font-bold text-rose-500 pt-1.5 mt-1 border-t border-gray-100 dark:border-white/5">
                Deduction: (Deductible Leaves + Half Days × 0.5) × Daily Rate = -₹{Math.round(report.deduction).toLocaleString('en-IN')}
              </p>
              <p className="text-[8px] text-gray-400 dark:text-gray-500 italic leading-tight">(Sundays & admin-marked leaves counted as Present)</p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-white/5 relative z-10">
              <div className="flex items-center gap-2 text-rose-500">
                <TrendingUp size={16} className="rotate-180" />
                <span className="text-xs font-bold uppercase tracking-widest">Total Deductions:</span>
              </div>
              <span className="text-lg font-black text-rose-500">- ₹{report.deduction.toLocaleString()}</span>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Edit Staff Details Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsEditModalOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-4xl mx-4 bg-white dark:bg-[#111] rounded-3xl sm:rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <form onSubmit={handleEditSubmit} className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white">Edit Staff Details</h2>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <User size={20} />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 dark:text-gray-400">Full Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 dark:text-gray-400">Phone Number</label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 dark:text-gray-400">Email Address</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 dark:text-gray-400">Password (leave blank to keep current)</label>
                    <input
                      type="password"
                      value={editForm.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Enter new password"
                    />
                  </div>
                </div>
              </div>

              {/* Job Information */}
              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-white/10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Briefcase size={20} />
                  Job Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 dark:text-gray-400">Monthly Salary (₹)</label>
                    <input
                      type="number"
                      value={editForm.monthlySalary}
                      onChange={(e) => handleInputChange('monthlySalary', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 dark:text-gray-400">Department</label>
                    <select
                      value={editForm.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="">Select Department</option>
                      <option value="WEB Development">WEB Development</option>
                      <option value="SEO">SEO</option>
                      <option value="Graphic Design">Graphic Design</option>
                      <option value="SMM">SMM</option>
                      <option value="Video Editing">Video Editing</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 dark:text-gray-400">Job Type</label>
                    <select
                      value={editForm.jobType}
                      onChange={(e) => handleInputChange('jobType', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="">Select Job Type</option>
                      <option value="Permanent">Permanent</option>
                      <option value="Intern">Intern</option>
                      <option value="Part-time">Part-time</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 dark:text-gray-400">Joining Date</label>
                    <input
                      type="date"
                      value={editForm.joiningDate}
                      onChange={(e) => handleInputChange('joiningDate', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-white/10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <IndianRupee size={20} />
                  Bank Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 dark:text-gray-400">Account Holder Name</label>
                    <input
                      type="text"
                      value={editForm.accountHolder}
                      onChange={(e) => handleInputChange('accountHolder', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Enter account holder name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 dark:text-gray-400">Bank Name</label>
                    <input
                      type="text"
                      value={editForm.bankName}
                      onChange={(e) => handleInputChange('bankName', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Enter bank name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 dark:text-gray-400">Account Number</label>
                    <input
                      type="text"
                      value={editForm.accountNumber}
                      onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Enter account number"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 dark:text-gray-400">IFSC Code</label>
                    <input
                      type="text"
                      value={editForm.ifscCode}
                      onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Enter IFSC code"
                    />
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-white/10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Upload size={20} />
                  Documents
                </h3>
                
                {/* Upload New Document */}
                <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 dark:text-gray-400">Document Name</label>
                      <input
                        type="text"
                        value={documentName}
                        onChange={(e) => setDocumentName(e.target.value)}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Enter document name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 dark:text-gray-400">Select File</label>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleUploadDocument}
                    disabled={uploading || !selectedFile}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    {uploading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload size={20} />
                    )}
                    {uploading ? 'Uploading...' : 'Upload Document'}
                  </button>
                </div>

                {/* Uploaded Documents List */}
                {staff && staff.documents && staff.documents.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Uploaded Documents</h4>
                    {staff.documents.map((doc) => (
                      <div
                        key={doc._id}
                        className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <Upload size={20} className="text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{doc.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={`http://localhost:45000${doc.path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          >
                            View
                          </a>
                          <button
                            type="button"
                            onClick={() => handleDeleteDocument(doc._id)}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-gray-200 dark:border-white/10 flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-8 py-3 border border-gray-200 dark:border-white/10 rounded-xl text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      </AnimatePresence>
      
      {/* Bottom Padding */}
      <div className="h-8" />
    </motion.div>
  );
};

export default StaffPerformance;
