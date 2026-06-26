import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  MoreVertical,
  CreditCard,
  Edit3,
  X,
  TrendingUp,
  Banknote,
  PlusCircle,
  FolderPlus,
  IndianRupee
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

const STATUS_OPTIONS = {
  'Pending': ['In Progress', 'On Hold'],
  'In Progress': ['Completed', 'On Hold'],
  'On Hold': ['In Progress', 'Completed'],
  'Completed': ['In Progress']
};

const ActionMenu = ({ onAddPayment }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);

  const handleOpen = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const dropdownWidth = 224;
      let left = rect.right - dropdownWidth;
      if (left < 8) left = 8;
      if (left + dropdownWidth > window.innerWidth - 8) left = window.innerWidth - dropdownWidth - 8;
      setCoords({ top: rect.bottom + 8, left });
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={handleOpen}
        className="p-2 hover:bg-white/10 rounded-lg text-gray-500 transition-colors"
      >
        <MoreVertical size={18} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[9998]" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              style={{ position: 'fixed', top: coords.top, left: coords.left, zIndex: 9999 }}
              className="w-56 bg-white dark:bg-[#030303] rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl py-2 overflow-hidden"
            >
              <button
                onClick={() => { onAddPayment(); setIsOpen(false); }}
                className="w-full text-left px-4 py-3 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-black dark:hover:text-white transition-colors flex items-center gap-3"
              >
                <PlusCircle size={16} className="text-emerald-500" />
                Add New Payment
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const AddPaymentModal = ({ isOpen, onClose, onAdd, maxAmount }) => {
  const [formData, setFormData] = useState({
    amount: '',
    mode: 'Online',
    utr: '',
    date: new Date().toISOString().split('T')[0]
  });

  if (!isOpen) return null;

  const amountVal = parseFloat(formData.amount) || 0;
  const isOverLimit = maxAmount !== undefined && amountVal > maxAmount;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md bg-white dark:bg-[#030303] rounded-3xl border border-gray-200 dark:border-white/10 p-8 shadow-2xl">
        <h3 className="text-xl font-bold text-black dark:text-white mb-6 flex items-center gap-2">
          <PlusCircle className="text-emerald-500" /> Add New Payment
        </h3>
        
        {maxAmount !== undefined && (
          <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-bold">
              Remaining Pending Amount: ₹{maxAmount.toLocaleString('en-IN')}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Amount (₹)</label>
            <input
              type="number"
              className={`w-full bg-gray-50 dark:bg-white/5 border rounded-xl px-4 py-2.5 text-sm text-black dark:text-white outline-none transition-all placeholder:text-gray-400 ${
                isOverLimit ? 'border-red-500 focus:border-red-500' : 'border-gray-200 dark:border-white/10 focus:border-blue-500'
              }`}
              placeholder="Enter amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
            {isOverLimit && (
              <p className="text-[11px] text-red-500 font-semibold mt-1">
                Amount cannot exceed the remaining pending amount of ₹{maxAmount.toLocaleString('en-IN')}.
              </p>
            )}
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Payment Mode</label>
            <select
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-blue-500 outline-none transition-all cursor-pointer"
              value={formData.mode}
              onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
            >
              <option value="Online" className="bg-white dark:bg-[#030303] text-black dark:text-white">Online</option>
              <option value="Cash" className="bg-white dark:bg-[#030303] text-black dark:text-white">Cash</option>
            </select>
          </div>
          {formData.mode === 'Online' && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
              <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">UTR Number</label>
              <input
                type="text"
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                placeholder="Enter UTR number"
                value={formData.utr}
                onChange={(e) => setFormData({ ...formData, utr: e.target.value })}
              />
            </motion.div>
          )}
          <div>
            <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Date Received</label>
            <input
              type="date"
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-blue-500 outline-none transition-all"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div className="flex gap-3 mt-8">
            <button onClick={onClose} className="flex-1 px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-white/5 transition-all">Cancel</button>
            <button
              onClick={() => {
                if (isOverLimit) return;
                onAdd(formData);
              }}
              disabled={isOverLimit || !formData.amount}
              className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${
                isOverLimit || !formData.amount
                  ? 'bg-gray-300 dark:bg-white/10 text-gray-500 dark:text-gray-400 cursor-not-allowed shadow-none'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20'
              }`}
            >
              Add Payment
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

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

const AddProjectModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    workDetail: '',
    totalAmount: '',
    package: '',
    department: 'WEB DEvlopment',
    startDate: new Date().toISOString().split('T')[0],
    deadline: ''
  });

  const showPackages = ['SEO', 'Graphic Design', 'Video Editing'].includes(formData.department);

  const handleDepartmentChange = (dept) => {
    const isPackageDept = ['SEO', 'Graphic Design', 'Video Editing'].includes(dept);
    if (isPackageDept) {
      const pkg = 'Sliver Package Service';
      setFormData({
        ...formData,
        department: dept,
        package: pkg,
        workDetail: PACKAGE_DETAILS[pkg].details,
        totalAmount: (PACKAGE_DETAILS[pkg].fee * 1.18).toFixed(0)
      });
    } else {
      setFormData({
        ...formData,
        department: dept,
        package: '',
        workDetail: '',
        totalAmount: ''
      });
    }
  };

  const handlePackageChange = (pkgName) => {
    const details = PACKAGE_DETAILS[pkgName];
    setFormData({
      ...formData,
      package: pkgName,
      workDetail: details.details,
      totalAmount: (details.fee * (1 + details.gst / 100)).toFixed(0)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-2xl bg-white dark:bg-[#030303] rounded-3xl border border-gray-200 dark:border-white/10 p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <h3 className="text-xl font-bold text-black dark:text-white mb-6 flex items-center gap-2">
          <FolderPlus className="text-blue-500" /> Add New Client
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Client Name</label>
              <input
                type="text"
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                placeholder="Client/Project Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Email Address</label>
              <input
                type="email"
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                placeholder="client@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Phone Number</label>
              <input
                type="text"
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Select Department</label>
              <select
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                value={formData.department}
                onChange={(e) => handleDepartmentChange(e.target.value)}
              >
                <option value="SEO" className="bg-white dark:bg-[#030303] text-black dark:text-white">SEO</option>
                <option value="SMM" className="bg-white dark:bg-[#030303] text-black dark:text-white">SMM</option>
                <option value="PPC" className="bg-white dark:bg-[#030303] text-black dark:text-white">PPC</option>
                <option value="Graphic Design" className="bg-white dark:bg-[#030303] text-black dark:text-white">Graphic Design</option>
                <option value="Video Editing" className="bg-white dark:bg-[#030303] text-black dark:text-white">Video Editing</option>
                <option value="WEB DEvlopment" className="bg-white dark:bg-[#030303] text-black dark:text-white">Web Development</option>
                <option value="Email Marketing" className="bg-white dark:bg-[#030303] text-black dark:text-white">Email Marketing</option>
                <option value="Ai Marketing" className="bg-white dark:bg-[#030303] text-black dark:text-white">Ai Marketing</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Project Start Date</label>
              <input
                type="date"
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-blue-500 outline-none transition-all"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Project Deadline</label>
              <input
                type="date"
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-blue-500 outline-none transition-all"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
          </div>

          {showPackages && (
            <div>
              <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Select Package</label>
              <select
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-blue-500 outline-none transition-all"
                value={formData.package}
                onChange={(e) => handlePackageChange(e.target.value)}
              >
                <option value="Sliver Package Service" className="bg-white dark:bg-[#030303] text-black dark:text-white">Sliver Package Service</option>
                <option value="Bronze Package Service" className="bg-white dark:bg-[#030303] text-black dark:text-white">Bronze Package Service</option>
                <option value="Platinum Package Service" className="bg-white dark:bg-[#030303] text-black dark:text-white">Platinum Package Service</option>
                <option value="Gold Package Service" className="bg-white dark:bg-[#030303] text-black dark:text-white">Gold Package Service</option>
              </select>
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Work Detail</label>
            <textarea
              rows={4}
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
              placeholder="Describe the work in detail"
              value={formData.workDetail}
              onChange={(e) => setFormData({ ...formData, workDetail: e.target.value })}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Total Amount (Incl. 18% GST) (₹)</label>
            <input
              type="number"
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
              placeholder="Total budget"
              value={formData.totalAmount}
              onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
            />
          </div>
          <div className="flex gap-3 mt-8">
            <button onClick={onClose} className="flex-1 px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-white/5 transition-all">Cancel</button>
            <button
              onClick={() => onAdd(formData)}
              className="flex-1 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
            >
              Add Client
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const AddOldClientModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    projectDetail: '',
    startDate: new Date().toISOString().split('T')[0],
    deliveredDate: '',
    totalAmount: '',
    paidAmount: '',
    address: ''
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-2xl bg-white dark:bg-[#030303] rounded-3xl border border-gray-200 dark:border-white/10 p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <h3 className="text-xl font-bold text-black dark:text-white mb-6 flex items-center gap-2">
          <FolderPlus className="text-amber-500" /> Add Old Client
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Client Name</label>
              <input
                type="text"
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-amber-500 outline-none transition-all placeholder:text-gray-400"
                placeholder="Client Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Phone Number</label>
              <input
                type="text"
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-amber-500 outline-none transition-all placeholder:text-gray-400"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Email Address</label>
            <input
              type="email"
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-amber-500 outline-none transition-all placeholder:text-gray-400"
              placeholder="client@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Project Detail</label>
            <textarea
              rows={3}
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-amber-500 outline-none transition-all placeholder:text-gray-400"
              placeholder="Describe the project"
              value={formData.projectDetail}
              onChange={(e) => setFormData({ ...formData, projectDetail: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Start Date</label>
              <input
                type="date"
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-amber-500 outline-none transition-all"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Delivered Date</label>
              <input
                type="date"
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-amber-500 outline-none transition-all"
                value={formData.deliveredDate}
                onChange={(e) => setFormData({ ...formData, deliveredDate: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Total Amount (₹)</label>
              <input
                type="number"
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-amber-500 outline-none transition-all placeholder:text-gray-400"
                placeholder="Total Amount"
                value={formData.totalAmount}
                onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Paid Amount (₹)</label>
              <input
                type="number"
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-amber-500 outline-none transition-all placeholder:text-gray-400"
                placeholder="Paid Amount"
                value={formData.paidAmount}
                onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest block mb-1.5">Address</label>
            <textarea
              rows={2}
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-black dark:text-white focus:border-amber-500 outline-none transition-all placeholder:text-gray-400"
              placeholder="Client Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="flex gap-3 mt-8">
            <button onClick={onClose} className="flex-1 px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-white/5 transition-all">Cancel</button>
            <button
              onClick={() => onAdd(formData)}
              className="flex-1 px-6 py-3 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20"
            >
              Add Old Client
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const StatusDropdown = ({ currentStatus, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const options = STATUS_OPTIONS[currentStatus] || [];

  const handleOpen = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const dropdownWidth = 192;
      let left = rect.right - dropdownWidth;
      if (left < 8) left = 8;
      if (left + dropdownWidth > window.innerWidth - 8) left = window.innerWidth - dropdownWidth - 8;
      setCoords({ top: rect.bottom + 8, left });
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={handleOpen}
        className="p-2 hover:bg-blue-500/10 rounded-lg text-blue-500 transition-colors group"
        title="Change Status"
      >
        <Edit3 size={18} className="group-hover:scale-110 transition-transform" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[9998]" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              style={{ position: 'fixed', top: coords.top, left: coords.left, zIndex: 9999 }}
              className="w-48 bg-white dark:bg-[#030303] rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl py-2 overflow-hidden"
            >
              <div className="px-4 py-2 border-b border-gray-100 dark:border-white/5 mb-1">
                <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Change Status To</p>
              </div>
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => { onStatusChange(option); setIsOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-black dark:hover:text-white transition-colors flex items-center gap-3"
                >
                  <div className={`w-2 h-2 rounded-full ${
                    option === 'Completed' ? 'bg-emerald-500' :
                    option === 'In Progress' ? 'bg-blue-500' :
                    'bg-amber-500'
                  }`} />
                  {option}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const PaymentModal = ({ client, isOpen, onClose, theme }) => {
  if (!isOpen || !client) return null;

  const paidPercent = Math.round((client.paidAmount / client.totalPrice) * 100);
  const data = [
    { name: 'Paid', value: client.paidAmount, color: '#10b981' },
    { name: 'Pending', value: client.pendingAmount, color: '#ef4444' }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl bg-white dark:bg-[#030303] rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 dark:text-blue-400">
              <Banknote size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-black dark:text-white">Payment Details</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{client.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-8">
          {/* Top Summary & Graph */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                <p className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest mb-1">Project Status</p>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${client.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border border-emerald-500/20' :
                    client.status === 'In Progress' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                      'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                  }`}>
                  {client.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                  <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest mb-1">Paid</p>
                  <p className="text-xl font-bold text-black dark:text-white">₹{client.paidAmount.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                  <p className="text-[10px] font-bold text-rose-600 dark:text-rose-500 uppercase tracking-widest mb-1">Pending</p>
                  <p className="text-xl font-bold text-black dark:text-white">₹{client.pendingAmount.toLocaleString('en-IN')}</p>
                </div>
              </div>
              <div className="bg-blue-500/5 p-4 rounded-2xl border border-blue-500/20">
                <p className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest mb-1">Total Project Value</p>
                <p className="text-2xl font-black text-black dark:text-white tracking-tight">₹{client.totalPrice.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="h-[200px] flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <PieChart>
                  <Pie
                    data={data}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: theme === 'dark' ? '#111' : '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', color: theme === 'dark' ? '#fff' : '#000' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-black dark:text-white">{paidPercent}%</span>
                <span className="text-[10px] font-bold text-gray-500 uppercase">Received</span>
              </div>
            </div>
          </div>

          {/* Payment Tree/List */}
          <div>
            <h4 className="text-sm font-bold text-black dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-500" /> Payment History
            </h4>
            <div className="space-y-4 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-[1px] before:bg-gray-100 dark:before:bg-white/10">
              {client.payments.map((payment) => (
                <div key={payment.id} className="relative pl-12">
                  <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-white dark:bg-[#030303] border border-gray-200 dark:border-white/10 flex items-center justify-center z-10">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  </div>
                  <div className="bg-white dark:bg-[#030303] p-4 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-black dark:text-white">₹{payment.amount.toLocaleString('en-IN')}</p>
                        <p className="text-[11px] text-gray-600 font-medium mt-1">{payment.date}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded uppercase">
                          {payment.mode}
                        </span>
                        {payment.utr && (
                          <p className="text-[10px] text-gray-600 dark:text-gray-600 mt-1 font-mono">#{payment.utr}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
          >
            Close Details
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const clientsDataRaw = [
  {
    id: 1,
    name: 'Emma Wilson',
    email: 'emma@wilson.com',
    phone: '+1 (555) 012-3456',
    workDetail: PACKAGE_DETAILS['Gold Package Service'].details,
    totalPrice: 41300,
    paidAmount: 20000,
    pendingAmount: 21300,
    deadline: '2024-08-15',
    department: 'SEO',
    package: 'Gold Package Service',
    status: 'In Progress',
    payments: [
      { id: 1, date: '2024-05-10', amount: 10000, mode: 'Online', utr: 'UTR892347120' },
      { id: 2, date: '2024-06-15', amount: 10000, mode: 'Online', utr: 'UTR110293847' }
    ]
  },
  {
    id: 2,
    name: 'James Miller',
    email: 'james@miller.io',
    phone: '+1 (555) 012-7890',
    workDetail: PACKAGE_DETAILS['Platinum Package Service'].details,
    totalPrice: 29500,
    paidAmount: 29500,
    pendingAmount: 0,
    deadline: '2024-07-20',
    department: 'Graphic Design',
    package: 'Platinum Package Service',
    status: 'Completed',
    payments: [
      { id: 1, date: '2024-04-20', amount: 15000, mode: 'Cash', utr: null },
      { id: 2, date: '2024-05-25', amount: 14500, mode: 'Online', utr: 'UTR998877665' }
    ]
  },
  {
    id: 3,
    name: 'Sarah Chen',
    email: 'sarah.c@tech.com',
    phone: '+1 (555) 012-4567',
    workDetail: 'Custom Website Development for a Tech Startup with specialized requirements.',
    totalPrice: 50000,
    paidAmount: 15000,
    pendingAmount: 35000,
    deadline: '2024-09-01',
    department: 'WEB DEvlopment',
    package: '',
    status: 'Pending',
    payments: [
      { id: 1, date: '2024-06-01', amount: 15000, mode: 'Online', utr: 'UTR445566778' }
    ]
  }
];

const Clients = ({ onClientClick, theme }) => {
  const [clients, setClients] = useState([]);
  const [oldClients, setOldClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [oldClientsLoading, setOldClientsLoading] = useState(true);
  const [paymentModalClient, setPaymentModalClient] = useState(null);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isAddOldClientOpen, setIsAddOldClientOpen] = useState(false);
  const [activeClientId, setActiveClientId] = useState(null);

  const fetchClients = async () => {
    try {
      const response = await fetch('http://localhost:45000/api/clients');
      const result = await response.json();
      if (result.success) {
        setClients(result.data);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOldClients = async () => {
    try {
      const response = await fetch('http://localhost:45000/api/old-clients');
      const result = await response.json();
      if (result.success) {
        setOldClients(result.data);
      }
    } catch (error) {
      console.error('Error fetching old clients:', error);
    } finally {
      setOldClientsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchOldClients();
  }, []);

  const handleStatusChange = (clientId, newStatus) => {
    // Optimistic update
    setClients(prev => prev.map(c =>
      c.id === clientId || c._id === clientId ? { ...c, status: newStatus } : c
    ));
    // TODO: Add backend integration for status update if needed
  };

const handleAddPayment = async (data) => {
  const activeClient = clients.find(c => c.id === activeClientId || c._id === activeClientId);
  const amount = parseFloat(data.amount);

  if (activeClient && amount > activeClient.pendingAmount) {
    alert(`Error: Payment amount (₹${amount.toLocaleString('en-IN')}) cannot exceed the pending amount (₹${activeClient.pendingAmount.toLocaleString('en-IN')})`);
    return;
  }

  try {
    const response = await fetch(`http://localhost:45000/api/clientPayment/${activeClientId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        payingAmount: parseFloat(data.amount),
        paymentMethod: data.mode,
        ...(data.mode === 'Online' && { utr: data.utr })
      })
    });

    const result = await response.json();

    if (result.success) {
      // Optimistic UI update
      setClients(prev => prev.map(c => {
        if (c.id === activeClientId || c._id === activeClientId) {
          const amount = parseFloat(data.amount);
          return {
            ...c,
            paidAmount: c.paidAmount + amount,
            pendingAmount: c.pendingAmount - amount,
            payments: [
              ...c.payments,
              {
                id: c.payments.length + 1,
                date: data.date,
                amount: amount,
                mode: data.mode,
                utr: data.utr || null
              }
            ]
          };
        }
        return c;
      }));
      alert('Payment added successfully!');
      fetchClients(); // Refresh from backend to sync latest data
      setIsAddPaymentOpen(false);
    } else {
      alert(`Error: ${result.message}`);
    }
  } catch (error) {
    console.error('Error adding payment:', error);
    alert('Failed to add payment. Please try again.');
  }
};

  const handleAddProject = async (data) => {
    try {
      const response = await fetch('http://localhost:45000/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.success) {
        alert('Client added successfully!');
        fetchClients(); // Refresh the list
        setIsAddProjectOpen(false);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error adding client:', error);
      alert('Failed to add client. Please try again.');
    }
  };

  const handleAddOldClient = async (data) => {
    try {
      const response = await fetch('http://localhost:45000/api/old-clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.success) {
        alert('Old client added successfully!');
        fetchOldClients(); // Refresh old clients list
        setIsAddOldClientOpen(false);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error adding old client:', error);
      alert('Failed to add old client. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <AnimatePresence>
        {paymentModalClient && (
          <PaymentModal
            client={paymentModalClient}
            isOpen={!!paymentModalClient}
            onClose={() => setPaymentModalClient(null)}
            theme={theme}
          />
        )}
        {isAddPaymentOpen && (
          <AddPaymentModal
            isOpen={isAddPaymentOpen}
            onClose={() => setIsAddPaymentOpen(false)}
            onAdd={handleAddPayment}
            maxAmount={clients.find(c => c.id === activeClientId || c._id === activeClientId)?.pendingAmount}
          />
        )}
        {isAddProjectOpen && (
          <AddProjectModal
            isOpen={isAddProjectOpen}
            onClose={() => setIsAddProjectOpen(false)}
            onAdd={handleAddProject}
          />
        )}
        {isAddOldClientOpen && (
          <AddOldClientModal
            isOpen={isAddOldClientOpen}
            onClose={() => setIsAddOldClientOpen(false)}
            onAdd={handleAddOldClient}
          />
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-black dark:text-white">Clients</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your client relationships and project finances</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsAddOldClientOpen(true)}
            className="px-6 py-2.5 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20"
          >
            Add Old Client
          </button>
          <button
            onClick={() => setIsAddProjectOpen(true)}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
          >
            Add New Client
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#030303] rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5 text-[11px] uppercase tracking-widest text-gray-700 dark:text-gray-500 font-bold">
                <th className="py-5 px-6">Client Info</th>
                <th className="py-5 px-4">Total Projects</th>
                <th className="py-5 px-4">Finance</th>
                <th className="py-5 px-4">Deadline</th>
                <th className="py-5 px-4">Status</th>
                <th className="py-5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Loading Clients...</p>
                    </div>
                  </td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td className="py-20 text-center">
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">No Clients Found</p>
                  </td>
                </tr>
              ) : clients.map((client) => (
                <motion.tr
                  key={client._id || client.id}
                  layout
                  className="group border-b border-gray-50 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-6 px-6">
                    <button
                      onClick={() => onClientClick?.(client)}
                      className="flex items-center gap-4 text-left hover:opacity-80 transition-opacity group/client"
                    >
                      <div className="flex items-center gap-3">
                        {client.pendingAmount > 0 && (
                          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                        )}
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-gray-100 dark:border-white/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover/client:bg-blue-500 group-hover/client:text-white transition-all">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-black dark:text-white group-hover/client:text-blue-600 dark:group-hover/client:text-blue-400 transition-colors">{client.name}</p>
                          <div className="flex flex-col gap-0.5 mt-1">
                            <span className="text-[10px] text-gray-600 dark:text-gray-500 flex items-center gap-1"><Mail size={10} /> {client.email}</span>
                            <span className="text-[10px] text-gray-600 dark:text-gray-500 flex items-center gap-1"><Phone size={10} /> {client.phone}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  </td>
                  <td className="py-6 px-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
                          {client.id === 1 ? '2' : '1'}
                        </div>
                        <span className="text-xs font-bold text-black dark:text-white">Projects</span>
                      </div>
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tighter bg-blue-500/10 px-2 py-0.5 rounded w-fit">
                        {client.department}
                      </span>
                    </div>
                  </td>
                  <td className="py-6 px-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-gray-600 dark:text-gray-500">Total:</span>
                        <span className="text-black dark:text-white font-bold">₹{client.totalPrice.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-gray-600 dark:text-gray-500">Paid:</span>
                        <span className="text-emerald-600 dark:text-emerald-500 font-bold">₹{client.paidAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-gray-600 dark:text-gray-500">Pending:</span>
                        <span className="text-rose-600 dark:text-rose-500 font-bold">₹{client.pendingAmount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-4 text-xs font-medium text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400 dark:text-gray-600" />
                      {client.deadline ? new Date(client.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'}
                    </div>
                  </td>
                  <td className="py-6 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${client.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                        client.status === 'In Progress' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                          client.status === 'On Hold' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                            'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                      }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="py-6 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setPaymentModalClient(client)}
                        title="Payment Details"
                        className="p-2 hover:bg-emerald-500/10 rounded-lg text-emerald-500 transition-colors"
                      >
                        <CreditCard size={18} />
                      </button>
                      <StatusDropdown
                        currentStatus={client.status}
                        onStatusChange={(newStatus) => handleStatusChange(client._id || client.id, newStatus)}
                      />
                      <ActionMenu
                        onAddPayment={() => {
                          setActiveClientId(client._id || client.id);
                          setIsAddPaymentOpen(true);
                        }}
                      />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Old Clients Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-black dark:text-white flex items-center gap-2">
          <Calendar size={24} className="text-amber-500" />
          Old Clients
        </h2>
        <div className="bg-white dark:bg-[#030303] rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm transition-colors">
          <div className="overflow-visible">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5 text-[11px] uppercase tracking-widest text-gray-700 dark:text-gray-500 font-bold">
                  <th className="py-5 px-6">Client Name</th>
                  <th className="py-5 px-6">Phone</th>
                  <th className="py-5 px-6">Email</th>
                  <th className="py-5 px-6">Project Detail</th>
                  <th className="py-5 px-6">Duration</th>
                  <th className="py-5 px-6 text-right">Total Amount</th>
                  <th className="py-5 px-6 text-right">Paid Amount</th>
                  <th className="py-5 px-6 text-right">Pending Amount</th>
                  <th className="py-5 px-6">Address</th>
                </tr>
              </thead>
              <tbody>
                {oldClientsLoading ? (
                  <tr>
                    <td className="py-20 text-center" colSpan={9}>
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Loading Old Clients...</p>
                      </div>
                    </td>
                  </tr>
                ) : oldClients.length === 0 ? (
                  <tr>
                    <td className="py-20 text-center" colSpan={9}>
                      <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">No Old Clients Found</p>
                    </td>
                  </tr>
                ) : (
                  oldClients.map((oldClient) => {
                    const pendingAmount = (oldClient.totalAmount || 0) - (oldClient.paidAmount || 0);
                    return (
                      <motion.tr
                        key={oldClient._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border-b border-gray-50 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-6 px-6">
                          <div className="flex items-center gap-3">
                            {pendingAmount > 0 && (
                              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                            )}
                            <p className="text-sm font-bold text-black dark:text-white">{oldClient.name}</p>
                          </div>
                        </td>
                        <td className="py-6 px-6">
                          <p className="text-sm text-gray-600 dark:text-gray-300">{oldClient.phone}</p>
                        </td>
                        <td className="py-6 px-6">
                          <p className="text-sm text-gray-600 dark:text-gray-300">{oldClient.email}</p>
                        </td>
                        <td className="py-6 px-6 max-w-xs">
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{oldClient.projectDetail}</p>
                        </td>
                        <td className="py-6 px-6">
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {new Date(oldClient.startDate).toLocaleDateString('en-IN')} - {new Date(oldClient.deliveredDate).toLocaleDateString('en-IN')}
                          </p>
                        </td>
                        <td className="py-6 px-6 text-right">
                          <p className="text-sm font-bold text-black dark:text-white">₹{oldClient.totalAmount?.toLocaleString('en-IN') || '0'}</p>
                        </td>
                        <td className="py-6 px-6 text-right">
                          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-500">₹{oldClient.paidAmount?.toLocaleString('en-IN') || '0'}</p>
                        </td>
                        <td className="py-6 px-6 text-right">
                          <p className={`text-sm font-bold ${pendingAmount > 0 ? 'text-red-600 dark:text-red-500' : 'text-emerald-600 dark:text-emerald-500'}`}>
                            ₹{pendingAmount.toLocaleString('en-IN')}
                          </p>
                        </td>
                        <td className="py-6 px-6 max-w-xs">
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{oldClient.address}</p>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Clients;
