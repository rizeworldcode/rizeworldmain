import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  ArrowLeft, 
  Upload, 
  CreditCard, 
  Briefcase, 
  IndianRupee, 
  Calendar,
  Mail,
  Phone,
  Building2,
  FileText,
  Lock,
  Hash,
  ShieldCheck,
  Check,
  Sparkles
} from 'lucide-react';
import { BASE_URL } from '../api';
import { AVAILABLE_FEATURES, getDefaultPermissionsForRole } from './StaffDetails';

const PREDEFINED_ROLES = ['Counselor', 'HR', 'Client Support', 'Admin', 'Data Analyst', 'Sales Team'];

const AddStaff = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    monthlySalary: '',
    department: 'Development',
    jobType: 'Permanent',
    role: 'HR',
    reportingPerson: '',
    joiningDate: new Date().toISOString().split('T')[0],
    salaryStatus: 'Pending',
    accountHolder: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    documents: [],
    employeeId: '',
    password: '',
    permissions: getDefaultPermissionsForRole('HR', 'Development')
  });

  // Auto-generate employee ID and password on component mount or when needed
  useEffect(() => {
    const generateCredentials = () => {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const newId = `RW-${randomNum}`;
      const newPassword = `RW@${Math.floor(100 + Math.random() * 900)}`;
      setFormData(prev => ({
        ...prev,
        employeeId: newId,
        password: newPassword
      }));
    };
    generateCredentials();
  }, []);

  const [docInput, setDocInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleAddDoc = () => {
    if (docInput.trim()) {
      setFormData({
        ...formData,
        documents: [...formData.documents, { name: docInput.trim(), path: '' }]
      });
      setDocInput('');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({ name: file.name, path: '' }));
      setFormData({
        ...formData,
        documents: [...formData.documents, ...newFiles]
      });
    }
  };

  const removeDoc = (index) => {
    setFormData({
      ...formData,
      documents: formData.documents.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate Indian phone number (10 digits starting with 6-9)
    const phonePattern = /^[6-9]\d{9}$/;
    if (!phonePattern.test(formData.phone)) {
      alert('Please enter a valid 10-digit Indian phone number starting with 6, 7, 8, or 9.');
      return;
    }

    try {
      // Prepend +91 before submitting to the backend
      const payload = {
        ...formData,
        phone: `+91 ${formData.phone}`,
        reportingPerson: typeof formData.reportingPerson === 'string'
          ? formData.reportingPerson.split(',').map(s => s.trim()).filter(Boolean)
          : (formData.reportingPerson || [])
      };

      const response = await fetch(`${BASE_URL}/staff`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (result.success) {
        alert('Staff member added successfully!');
        if (onBack) onBack();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error adding staff:', error);
      alert('Failed to add staff member. Please check if the backend is running.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <UserPlus className="text-blue-500" /> Add New Employee
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Fill in the details to register a new employee</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-20">
        {/* Personal & Professional Info */}
        <div className="glass p-8 rounded-3xl border border-gray-200 dark:border-white/10 space-y-6 transition-colors">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-white/5 pb-4">
            <Briefcase size={20} className="text-blue-500" /> Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block px-1">Full Name</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <input 
                  required
                  type="text" 
                  placeholder="e.g. John Doe"
                  className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block px-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <input 
                  required
                  type="email" 
                  placeholder="john@example.com"
                  className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block px-1">Phone Number</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-gray-500 dark:text-gray-400 font-bold text-sm select-none border-r border-gray-200 dark:border-white/10 pr-3">+91</span>
                <input 
                  required
                  type="tel" 
                  placeholder="Enter 10-digit number"
                  maxLength={10}
                  className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl pl-16 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                  value={formData.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 10) {
                      setFormData({...formData, phone: val});
                    }
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block px-1">Department</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <select 
                  className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
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
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block px-1">Job Type</label>
              <select 
                className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all cursor-pointer"
                value={formData.jobType}
                onChange={(e) => setFormData({...formData, jobType: e.target.value})}
              >
                <option value="Permanent" className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white">Permanent</option>
                <option value="Intern" className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white">Intern</option>
                <option value="Part-time" className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white">Part-time</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block px-1">Employee Role</label>
              {(() => {
                const isCustomRole = formData.role && !PREDEFINED_ROLES.includes(formData.role);
                return (
                  <div className="space-y-2">
                    <select 
                      className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all cursor-pointer"
                      value={isCustomRole ? 'Other' : formData.role}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'Other') {
                          setFormData({...formData, role: ''});
                        } else {
                          setFormData({...formData, role: val});
                        }
                      }}
                    >
                      <option value="Counselor" className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white">Counselor</option>
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
                        className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                        placeholder="Type custom role..."
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                      />
                    )}
                  </div>
                );
              })()}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block px-1">Reporting Person (Employee ID)</label>
              <input 
                type="text" 
                placeholder="e.g. RW-1001"
                className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                value={formData.reportingPerson}
                onChange={(e) => setFormData({...formData, reportingPerson: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block px-1">Joining Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <input 
                  type="date" 
                  className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                  value={formData.joiningDate}
                  onChange={(e) => setFormData({...formData, joiningDate: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block px-1">Monthly Salary (₹)</label>
              <div className="relative group">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  required
                  type="number" 
                  placeholder="5000"
                  className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                  value={formData.monthlySalary}
                  onChange={(e) => setFormData({...formData, monthlySalary: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block px-1">Employee ID (Auto-generated)</label>
              <div className="relative group">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <input 
                  readOnly
                  type="text" 
                  className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-blue-500 font-black focus:border-blue-500 outline-none transition-all cursor-not-allowed"
                  value={formData.employeeId}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block px-1">Portal Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <input 
                  required
                  type="text" 
                  placeholder="Password"
                  className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Permissions (Access Control) */}
        <div className="glass p-8 rounded-3xl border border-gray-200 dark:border-white/10 space-y-6 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-white/5 pb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ShieldCheck size={20} className="text-indigo-500" /> Feature Access & Permissions
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, permissions: AVAILABLE_FEATURES.map(f => f.id) })}
                className="px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-bold transition-all"
              >
                Grant All
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, permissions: getDefaultPermissionsForRole(formData.role, formData.department) })}
                className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-bold transition-all"
              >
                Role Defaults
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            Select the specific portal sections and capabilities granted to this employee ID.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {AVAILABLE_FEATURES.map((feature) => {
              const isSelected = (formData.permissions || []).includes(feature.id);
              return (
                <div
                  key={feature.id}
                  onClick={() => {
                    const current = formData.permissions || [];
                    const updated = isSelected
                      ? current.filter(p => p !== feature.id)
                      : [...current, feature.id];
                    setFormData({ ...formData, permissions: updated });
                  }}
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

        {/* Account Details */}
        <div className="glass p-8 rounded-3xl border border-gray-200 dark:border-white/10 space-y-6 transition-colors">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-white/5 pb-4">
            <CreditCard size={20} className="text-blue-500" /> Banking Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block px-1">Full Name (on Passbook)</label>
              <input 
                type="text" 
                placeholder="Account holder's name"
                className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                value={formData.accountHolder}
                onChange={(e) => setFormData({...formData, accountHolder: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block px-1">Account Number</label>
              <input 
                type="text" 
                placeholder="Enter account number"
                className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                value={formData.accountNumber}
                onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block px-1">IFSC Code</label>
              <input 
                type="text" 
                placeholder="Enter IFSC code"
                className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                value={formData.ifscCode}
                onChange={(e) => setFormData({...formData, ifscCode: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block px-1">Bank Name</label>
              <input 
                type="text" 
                placeholder="Enter bank name"
                className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                value={formData.bankName}
                onChange={(e) => setFormData({...formData, bankName: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="glass p-8 rounded-3xl border border-gray-200 dark:border-white/10 space-y-6 transition-colors">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-white/5 pb-4">
            <FileText size={20} className="text-blue-500" /> Documents & Attachments
          </h3>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="text" 
                  placeholder="e.g. ID Proof, Degree, Experience Letter"
                  className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                  value={docInput}
                  onChange={(e) => setDocInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDoc())}
                />
              </div>
              <button 
                type="button"
                onClick={handleAddDoc}
                className="px-6 py-3 bg-blue-600/10 text-blue-500 border border-blue-500/20 rounded-2xl font-bold hover:bg-blue-600/20 transition-all"
              >
                Add
              </button>
            </div>

            {formData.documents.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {formData.documents.map((doc, index) => (
                  <span key={index} className="flex items-center gap-2 px-3 py-1.5 bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs text-gray-600 dark:text-gray-300">
                    {typeof doc === 'string' ? doc : doc.name}
                    <button 
                      type="button"
                      onClick={() => removeDoc(index)}
                      className="text-gray-500 hover:text-rose-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative group">
                <input 
                  type="file" 
                  id="doc-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  multiple
                />
                <label 
                  htmlFor="doc-upload"
                  className="flex flex-col items-center justify-center gap-2 p-10 bg-black/5 dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-3xl cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 hover:border-blue-500/50 transition-all group-hover:bg-black/10 dark:group-hover:bg-white/10"
                >
                  <div className="p-4 rounded-full bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                    <Upload size={32} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Upload Document Images</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG or PDF up to 10MB</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center gap-4 pt-6">
          <button 
            type="button"
            onClick={onBack}
            className="flex-1 px-8 py-4 rounded-2xl border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="flex-[2] px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20"
          >
            Create Staff Profile
          </button>
        </div>
      </form>
    </motion.div>
  );
};

const X = ({ size, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);

export default AddStaff;
