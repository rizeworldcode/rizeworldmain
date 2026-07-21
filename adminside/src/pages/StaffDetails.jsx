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
  LogOut
} from 'lucide-react';
import StaffPerformance from './StaffPerformance';

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

// Calculate payout salary based on actual hours worked from clock records
const STANDARD_HOURS_PER_DAY = 8.5;
const DAYS_IN_MONTH = 30;
const EXPECTED_MONTHLY_HOURS = STANDARD_HOURS_PER_DAY * DAYS_IN_MONTH; // 255 hours

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

const calculatePayout = (staffInfo) => {
  const baseSalary = staffInfo.monthlySalary || 0;
  const hourlyRate = baseSalary / EXPECTED_MONTHLY_HOURS;

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Determine the start day: if employee was added to the website this month, start from that date; else day 1
  const createdAt = staffInfo.createdAt ? new Date(staffInfo.createdAt) : null;
  const startDay = (
    createdAt &&
    createdAt.getMonth() === currentMonth &&
    createdAt.getFullYear() === currentYear
  ) ? createdAt.getDate() : 1;

  // --- Step 1: Sum actual hours from clock records ---
  const monthlyClockRecords = (staffInfo.clock || []).filter(record => {
    const d = new Date(record.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  let totalHoursWorked = 0;
  monthlyClockRecords.forEach(record => {
    const actualHrs = parseTotalHours(record.totalHours);
    if (actualHrs > 9) {
      totalHoursWorked += 8.5 + (actualHrs - 9);
    } else if (actualHrs >= 8.5) {
      totalHoursWorked += 8.5;
    } else {
      totalHoursWorked += actualHrs;
    }
  });

  // Build set of clocked dates (to avoid double-counting)
  const creditedDates = new Set(
    monthlyClockRecords.map(r => new Date(r.date).toDateString())
  );

  // --- Step 2: Credit 8.5 hrs for each SUNDAY in the month (from startDay up to today) ---
  for (let day = startDay; day <= today.getDate(); day++) {
    const d = new Date(currentYear, currentMonth, day);
    if (d.getDay() === 0 && !creditedDates.has(d.toDateString())) {
      totalHoursWorked += STANDARD_HOURS_PER_DAY;
      creditedDates.add(d.toDateString());
    }
  }

  // --- Step 3: Credit 8.5 hrs for each admin-declared leave day ---
  (staffInfo.leaves || []).forEach(leave => {
    const leaveDate = new Date(leave.date);
    if (
      leaveDate.getMonth() === currentMonth &&
      leaveDate.getFullYear() === currentYear &&
      leaveDate <= today &&
      !creditedDates.has(leaveDate.toDateString())
    ) {
      totalHoursWorked += STANDARD_HOURS_PER_DAY;
      creditedDates.add(leaveDate.toDateString());
    }
  });

  // Credit 8.5 hrs for manual daily attendance marked as 'On Leave'
  (staffInfo.attendance || []).forEach(att => {
    const attDate = new Date(att.date);
    if (
      att.status === 'On Leave' &&
      attDate.getMonth() === currentMonth &&
      attDate.getFullYear() === currentYear &&
      attDate <= today &&
      !creditedDates.has(attDate.toDateString())
    ) {
      totalHoursWorked += STANDARD_HOURS_PER_DAY;
      creditedDates.add(attDate.toDateString());
    }
  });

  // --- Step 4: Find truly absent days (from startDay, no clock, not Sunday, not admin leave) ---
  const absentDays = [];
  for (let day = startDay; day <= today.getDate(); day++) {
    const d = new Date(currentYear, currentMonth, day);
    if (!creditedDates.has(d.toDateString())) {
      absentDays.push(d);
    }
  }

  // --- Step 5: Find half-days from attendance records ---
  const halfDayRecords = (staffInfo.attendance || []).filter(att => {
    const d = new Date(att.date);
    return (
      att.status === 'Half-Day' &&
      d.getMonth() === currentMonth &&
      d.getFullYear() === currentYear &&
      d <= today
    );
  });
  // 2 half-days = 1 leave unit
  const halfDayLeaveUnits = Math.floor(halfDayRecords.length / 2);

  // --- Step 6: Apply 1 FREE casual leave per month ---
  // Priority: 1st absent day → then 1st pair of half-days
  let casualLeaveUsed = false;

  if (absentDays.length > 0) {
    // 1st absent day is auto casual leave → credit full 8.5 hrs
    totalHoursWorked += STANDARD_HOURS_PER_DAY;
    creditedDates.add(absentDays[0].toDateString());
    casualLeaveUsed = true;
  } else if (halfDayLeaveUnits > 0) {
    // No absent days but 2+ half-days → use casual leave for 1st pair
    // Top up each of those 2 half-days to 4.25 hrs (half of 8.5)
    // so the pair together = 8.5 hrs (1 full day equivalent)
    for (let i = 0; i < 2; i++) {
      const hdDate = new Date(halfDayRecords[i].date);
      const clockRecord = monthlyClockRecords.find(
        r => new Date(r.date).toDateString() === hdDate.toDateString()
      );
      const actualHrs = clockRecord ? parseTotalHours(clockRecord.totalHours) : 0;
      const halfTarget = STANDARD_HOURS_PER_DAY / 2; // 4.25 hrs
      if (actualHrs < halfTarget) {
        totalHoursWorked += halfTarget - actualHrs;
      }
    }
    casualLeaveUsed = true;
  }

  const payout = Math.round(hourlyRate * totalHoursWorked);
  const daysWorked = monthlyClockRecords.length;

  return {
    payout,
    totalHoursWorked: Math.round(totalHoursWorked * 100) / 100,
    daysWorked,
    hourlyRate: Math.round(hourlyRate * 100) / 100,
    fullLeaves: absentDays.length,
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStaffForPerformance, setSelectedStaffForPerformance] = useState(null);

  // Salary modal state
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
  const [selectedStaffForSalary, setSelectedStaffForSalary] = useState(null);
  const [salaryPaymentDetails, setSalaryPaymentDetails] = useState({
    mode: 'online',
    method: 'phonepe',
    utrNumber: ''
  });

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
  }).sort((a, b) => (a.name || "").localeCompare(b.name || ""));

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
    if (window.confirm('Are you sure you want to remove this employee? It will move them to the Removed Employees page.')) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`http://localhost:45000/api/staff/${id}`, {
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
      const response = await fetch(`http://localhost:45000/api/staff/${member._id}/clock-in`, {
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

  const openSalaryModal = (member) => {
    setSelectedStaffForSalary(member);
    setSalaryPaymentDetails({
      mode: 'online',
      method: 'phonepe',
      utrNumber: ''
    });
    setIsSalaryModalOpen(true);
  };

  const handleConfirmClearSalary = async () => {
    if (!selectedStaffForSalary) return;

    // Validate UTR if online mode
    if (salaryPaymentDetails.mode === 'online') {
      const utrTrimmed = salaryPaymentDetails.utrNumber.trim();
      if (utrTrimmed.length < 12 || utrTrimmed.length > 16) {
        alert('UTR number must be between 12 and 16 characters.');
        return;
      }
    }

    const payoutData = calculatePayout(selectedStaffForSalary);
    const { payout, fullLeaves, halfDays, casualLeaveUsed } = payoutData;
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    try {
      const response = await fetch(`http://localhost:45000/api/staff/${selectedStaffForSalary._id}/clear-salary`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month: currentMonth,
          baseSalary: selectedStaffForSalary.monthlySalary,
          payoutSalary: payout,
          totalLeaves: fullLeaves,
          totalHalfDays: halfDays,
          casualLeaveUsed,
          mode: salaryPaymentDetails.mode,
          method: salaryPaymentDetails.mode === 'cash' ? 'cash' : salaryPaymentDetails.method,
          utrNumber: salaryPaymentDetails.mode === 'online' ? salaryPaymentDetails.utrNumber : undefined
        })
      });
      const result = await response.json();
      if (result.success) {
        setStaff(staff.map(m =>
          m._id === selectedStaffForSalary._id ? result.data : m
        ));
        setIsSalaryModalOpen(false);
        setSelectedStaffForSalary(null);
        alert('Salary cleared, record saved, and transaction recorded successfully');
      }
    } catch (error) {
      console.error('Error clearing salary:', error);
      alert('Failed to clear salary');
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
                            <div className="flex flex-wrap gap-1.5">
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
                        {member.documents.map((doc, i) => (
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
                          {member.salaryStatus === 'Pending' ? (
                            <button
                              onClick={() => openSalaryModal(member)}
                              className="group/salary flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-emerald-600 shadow-lg shadow-emerald-500/10 transition-all hover:bg-emerald-500 hover:text-white"
                              title="Clear Salary"
                            >
                              <CheckCircle2 size={16} className="transition-transform group-hover/salary:scale-110" />
                              <span className="text-xs font-black uppercase tracking-widest">Clear Salary</span>
                            </button>
                          ) : (
                            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/10 bg-emerald-500/5 px-4 py-2 text-emerald-500">
                              <CheckCircle2 size={16} />
                              <span className="text-xs font-black uppercase tracking-widest">Salary Paid</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDeleteStaff(member._id)}
                            className="group/remove flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-rose-600 shadow-lg shadow-rose-500/10 transition-all hover:bg-rose-500 hover:text-white"
                            title="Remove Employee"
                          >
                            <Trash2 size={16} className="transition-transform group-hover/remove:scale-110" />
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

      {/* Salary Payment Modal */}
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
              className="relative w-full max-w-md bg-white dark:bg-[#030303] rounded-3xl border border-gray-200 dark:border-white/10 p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="text-emerald-500" /> Clear Salary
                </h3>
                <button
                  onClick={() => setIsSalaryModalOpen(false)}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Employee Name & Payout */}
                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Employee</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedStaffForSalary.name}</p>
                  <p className="text-2xl font-black text-emerald-600 mt-2">
                    ₹{calculatePayout(selectedStaffForSalary).payout.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-gray-500">
                    for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </p>
                </div>

                {/* Payment Mode */}
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                    Payment Mode
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSalaryPaymentDetails({ ...salaryPaymentDetails, mode: 'cash', method: 'cash' })}
                      className={`flex-1 px-4 py-3 rounded-xl text-sm font-bold transition-all ${salaryPaymentDetails.mode === 'cash'
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                          : 'bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                      Cash
                    </button>
                    <button
                      onClick={() => setSalaryPaymentDetails({ ...salaryPaymentDetails, mode: 'online' })}
                      className={`flex-1 px-4 py-3 rounded-xl text-sm font-bold transition-all ${salaryPaymentDetails.mode === 'online'
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                          : 'bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                      Online
                    </button>
                  </div>
                </div>

                {salaryPaymentDetails.mode === 'online' && (
                  <>
                    {/* Payment Method */}
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                        Payment Method
                      </label>
                      <select
                        value={salaryPaymentDetails.method}
                        onChange={(e) => setSalaryPaymentDetails({ ...salaryPaymentDetails, method: e.target.value })}
                        className="w-full bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                      >
                        <option value="phonepe">PhonePe</option>
                        <option value="paytm">Paytm</option>
                        <option value="google_pay">Google Pay</option>
                        <option value="bank_transfer">Bank Transfer</option>
                      </select>
                    </div>

                    {/* UTR Number */}
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                        UTR Number
                      </label>
                      <input
                        type="text"
                        value={salaryPaymentDetails.utrNumber}
                        onChange={(e) => setSalaryPaymentDetails({ ...salaryPaymentDetails, utrNumber: e.target.value })}
                        className="w-full bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                        placeholder="Enter 12-16 digit UTR number"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setIsSalaryModalOpen(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmClearSalary}
                  className="flex-1 px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                >
                  Confirm Payment
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StaffDetails;