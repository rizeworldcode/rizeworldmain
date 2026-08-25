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
  AlertTriangle
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

const CALCULATION_START_DATE = new Date(2026, 6, 1); // July 1, 2026

const get30DaySequenceDates = (year, monthIndex, createdAt = null) => {
  const dates = [];
  const prevMonthLastDay = new Date(year, monthIndex, 0);
  const prevMonthDays = prevMonthLastDay.getDate();
  
  if (prevMonthDays === 31) {
    const prevYear = prevMonthLastDay.getFullYear();
    const prevMonth = prevMonthLastDay.getMonth();
    dates.push(new Date(prevYear, prevMonth, 31));
    for (let d = 1; d <= 29; d++) {
      dates.push(new Date(year, monthIndex, d));
    }
  } else {
    const currentMonthLastDay = new Date(year, monthIndex + 1, 0).getDate();
    const endDay = Math.min(30, currentMonthLastDay);
    for (let d = 1; d <= endDay; d++) {
      dates.push(new Date(year, monthIndex, d));
    }
  }

  let filtered = dates.filter(d => {
    const copy = new Date(d);
    copy.setHours(0, 0, 0, 0);
    return copy >= CALCULATION_START_DATE;
  });

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
  const [fullImageModal, setFullImageModal] = useState({ isOpen: false, src: '', title: '' });

  const getProfilePicUrl = (pic) => {
    if (!pic) return null;
    if (pic.startsWith('http://') || pic.startsWith('https://')) return pic;
    const base = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:45000'
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

  // Salary modal state
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
  const [selectedStaffForSalary, setSelectedStaffForSalary] = useState(null);
  const [selectedSalaryMonth, setSelectedSalaryMonth] = useState('');
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
      const check = new Date(d);
      check.setHours(0, 0, 0, 0);
      if (check < CALCULATION_START_DATE) return;
      if (d.getDate() === 31) {
        const nextMonth = new Date(d.getFullYear(), d.getMonth() + 1, 1);
        months.add(nextMonth.toLocaleString('default', { month: 'long', year: 'numeric' }));
      } else {
        months.add(d.toLocaleString('default', { month: 'long', year: 'numeric' }));
      }
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
    const matchesRedZone = redZoneFilter === 'All' || (redZoneFilter === 'RedZone' && getRedZoneDaysCount(member) >= 7);

    return matchesSearch && matchesJobType && matchesDepartment && matchesRedZone;
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

    const paidHistory = (staffInfo.salaryHistory || []).find(h => {
      const hClean = h.month ? h.month.replace(/\s*\(Current\)/i, '').trim() : '';
      return hClean === cleanMonth;
    });

    const payout = paidHistory ? paidHistory.payoutSalary : calculatedPayout;

    return {
      payout,
      totalHoursWorked: Math.round(totalHoursWorked * 100) / 100,
      daysWorked: presents,
      hourlyRate: Math.round(hourlyRate * 100) / 100,
      fullLeaves,
      halfDays: halfDayRecords.length,
      casualLeaveUsed: !!casualLeaveUsed,
      isPaid: !!paidHistory
    };
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

    // Compute available months for member and select the first pending month
    const months = new Set();
    const now = new Date();
    const currentMonthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });
    months.add(currentMonthName);

    const addDateMonth = (dateInput) => {
      if (!dateInput) return;
      const d = new Date(dateInput);
      if (isNaN(d.getTime())) return;
      const check = new Date(d);
      check.setHours(0, 0, 0, 0);
      if (check < CALCULATION_START_DATE) return;
      if (d.getDate() === 31) {
        const nextMonth = new Date(d.getFullYear(), d.getMonth() + 1, 1);
        months.add(nextMonth.toLocaleString('default', { month: 'long', year: 'numeric' }));
      } else {
        months.add(d.toLocaleString('default', { month: 'long', year: 'numeric' }));
      }
    };

    (member.clock || []).forEach(r => addDateMonth(r.date));
    (member.salaryHistory || []).forEach(h => {
      if (h.month) months.add(h.month.replace(/\s*\(Current\)/i, '').trim());
    });
    (member.attendance || []).forEach(a => addDateMonth(a.date));
    (member.leaves || []).forEach(l => addDateMonth(l.date));

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

    const paidSet = new Set((member.salaryHistory || []).map(h => (h.month || '').replace(/\s*\(Current\)/i, '').trim()));
    // Prefer past pending months first (exclude current month from auto-default if past pending month exists)
    const pendingMonths = sorted.filter(m => !paidSet.has(m));
    const pendingPastMonth = pendingMonths.find(m => m !== currentMonthName);

    setSelectedSalaryMonth(pendingPastMonth || pendingMonths[0] || sorted[0] || currentMonthName);
    setIsSalaryModalOpen(true);
  };

  const handleConfirmClearSalary = async () => {
    if (!selectedStaffForSalary || !selectedSalaryMonth) return;

    const payoutData = calculatePayoutForSelectedMonth(selectedStaffForSalary, selectedSalaryMonth);
    const { payout, fullLeaves, halfDays, casualLeaveUsed } = payoutData;

    try {
      const response = await fetch(`http://localhost:45000/api/staff/${selectedStaffForSalary._id}/clear-salary`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month: selectedSalaryMonth,
          baseSalary: selectedStaffForSalary.monthlySalary,
          payoutSalary: payout,
          totalLeaves: fullLeaves,
          totalHalfDays: halfDays,
          casualLeaveUsed,
          mode: salaryPaymentDetails.mode,
          method: salaryPaymentDetails.mode === 'cash' ? 'cash' : salaryPaymentDetails.method
        })
      });
      const result = await response.json();
      if (result.success) {
        setStaff(staff.map(m =>
          m._id === selectedStaffForSalary._id ? result.data : m
        ));
        setIsSalaryModalOpen(false);
        setSelectedStaffForSalary(null);
        alert(`Salary for ${selectedSalaryMonth} cleared, record saved, and transaction recorded successfully`);
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
      const response = await fetch(`http://localhost:45000/api/staff/${member._id}/revert-salary`, {
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
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Clear Salary
                </h3>
                <button
                  onClick={() => setIsSalaryModalOpen(false)}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Employee Name */}
                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Employee</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedStaffForSalary.name}</p>
                </div>

                {/* Select Month to Clear */}
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                    Select Month to Clear Salary
                  </label>
                  <select
                    value={selectedSalaryMonth}
                    onChange={(e) => setSelectedSalaryMonth(e.target.value)}
                    className="w-full bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all cursor-pointer"
                  >
                    {availableSalaryMonths.map(mStr => {
                      const isPaid = (selectedStaffForSalary.salaryHistory || []).some(h => {
                        const hClean = h.month ? h.month.replace(/\s*\(Current\)/i, '').trim() : '';
                        return hClean === mStr;
                      });
                      return (
                        <option key={mStr} value={mStr} className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white">
                          {mStr} {isPaid ? '(Already Paid)' : '(Pending)'}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Calculated Payout for Selected Month */}
                {(() => {
                  const calc = calculatePayoutForSelectedMonth(selectedStaffForSalary, selectedSalaryMonth);
                  return (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Calculated Payout</span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${calc.isPaid ? 'bg-blue-500/20 text-blue-600' : 'bg-amber-500/20 text-amber-600'}`}>
                          {calc.isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                        ₹{calc.payout.toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        for <strong>{selectedSalaryMonth}</strong> ({calc.daysWorked} days present, {calc.fullLeaves} leaves, {calc.halfDays} half days)
                      </p>
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
                )}
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setIsSalaryModalOpen(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                {(() => {
                  const calc = calculatePayoutForSelectedMonth(selectedStaffForSalary, selectedSalaryMonth);
                  if (calc.isPaid) {
                    return (
                      <button
                        onClick={() => handleRevertSalary(selectedStaffForSalary, selectedSalaryMonth)}
                        className="flex-1 px-6 py-3 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2"
                      >
                        <RotateCcw size={18} /> Revert Payment
                      </button>
                    );
                  }
                  return (
                    <button
                      onClick={handleConfirmClearSalary}
                      className="flex-1 px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                    >
                      Confirm Payment
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