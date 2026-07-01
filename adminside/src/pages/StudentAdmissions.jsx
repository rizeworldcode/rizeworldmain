import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Phone,
  Mail,
  Calendar,
  PlusCircle,
  Edit3,
  Trash2,
  ArrowLeft,
  Users,
  Filter,
  X,
  Save,
  CheckCircle2,
  Clock
} from 'lucide-react';

const StudentAdmissions = ({ onBack }) => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmission, setEditingAdmission] = useState(null);
  const [formData, setFormData] = useState({
    studentName: '',
    phoneNumber: '',
    email: '',
    courseInterested: '',
    status: 'Lead',
    notes: ''
  });
  const [counselors, setCounselors] = useState([]);
  const [selectedCounselor, setSelectedCounselor] = useState('');

  useEffect(() => {
    fetchAdmissions();
    fetchCounselors();
  }, []);

  const fetchAdmissions = async () => {
    try {
      const url = selectedCounselor 
        ? `http://localhost:45000/api/staff/admissions?counselorId=${selectedCounselor}`
        : 'http://localhost:45000/api/staff/admissions';
      const response = await fetch(url);
      const result = await response.json();
      if (result.success) {
        setAdmissions(result.data);
      }
    } catch (error) {
      console.error('Error fetching admissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCounselors = async () => {
    try {
      const response = await fetch('http://localhost:45000/api/staff/counselors');
      const result = await response.json();
      if (result.success) {
        setCounselors(result.data);
      }
    } catch (error) {
      console.error('Error fetching counselors:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedCounselor) {
      alert('Please select a counselor');
      return;
    }

    const selectedCounselorObj = counselors.find(c => c._id === selectedCounselor);
    
    try {
      const data = {
        ...formData,
        counselorId: selectedCounselor,
        counselorName: selectedCounselorObj?.name || ''
      };
      
      let response;
      if (editingAdmission) {
        response = await fetch(`http://localhost:45000/api/staff/admissions/${editingAdmission._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } else {
        response = await fetch('http://localhost:45000/api/staff/admissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      }
      
      const result = await response.json();
      if (result.success) {
        alert(editingAdmission ? 'Admission updated successfully!' : 'Admission added successfully!');
        fetchAdmissions();
        resetForm();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error saving admission:', error);
      alert('Failed to save admission');
    }
  };

  const handleEdit = (admission) => {
    setEditingAdmission(admission);
    setFormData({
      studentName: admission.studentName,
      phoneNumber: admission.phoneNumber,
      email: admission.email || '',
      courseInterested: admission.courseInterested || '',
      status: admission.status,
      notes: admission.notes || ''
    });
    setSelectedCounselor(admission.counselorId);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this admission?')) return;
    
    try {
      const response = await fetch(`http://localhost:45000/api/staff/admissions/${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (result.success) {
        alert('Admission deleted successfully');
        fetchAdmissions();
      }
    } catch (error) {
      console.error('Error deleting admission:', error);
      alert('Failed to delete admission');
    }
  };

  const resetForm = () => {
    setFormData({
      studentName: '',
      phoneNumber: '',
      email: '',
      courseInterested: '',
      status: 'Lead',
      notes: ''
    });
    setEditingAdmission(null);
    setIsModalOpen(false);
  };

  const getStatusBadge = (status) => {
    const colors = {
      'Lead': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      'Interested': 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
      'Enrolled': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      'Lost': 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
    };
    return colors[status] || colors['Lead'];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Student Admissions</h1>
            <p className="text-gray-400 mt-1">Manage student admissions and leads</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={selectedCounselor}
              onChange={(e) => {
                setSelectedCounselor(e.target.value);
                fetchAdmissions();
              }}
              className="pl-12 pr-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="">All Counselors</option>
              {counselors.map(c => (
                <option key={c._id} value={c._id} className="bg-[#030303]">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20"
          >
            <PlusCircle size={20} />
            Add New Admission
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Leads', value: admissions.length, icon: Users, color: 'blue' },
          { label: 'Interested', value: admissions.filter(a => a.status === 'Interested').length, icon: CheckCircle2, color: 'yellow' },
          { label: 'Enrolled', value: admissions.filter(a => a.status === 'Enrolled').length, icon: Save, color: 'emerald' },
          { label: 'Lost', value: admissions.filter(a => a.status === 'Lost').length, icon: Clock, color: 'red' }
        ].map((stat, index) => (
          <div key={index} className="glass p-6 rounded-3xl border border-white/10 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-500`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-400">{stat.label}</p>
                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Admissions List */}
      <div className="glass rounded-3xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="p-12 flex items-center justify-center">
            <div className="text-white text-xl animate-pulse">Loading admissions...</div>
          </div>
        ) : admissions.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400">No admissions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student Details</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Counselor</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Course</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {admissions.map((admission) => (
                  <tr key={admission._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold text-white">{admission.studentName}</p>
                        <div className="flex flex-col gap-1 mt-1">
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Phone size={12} /> {admission.phoneNumber}
                          </p>
                          {admission.email && (
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                              <Mail size={12} /> {admission.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-white">{admission.counselorName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-300">{admission.courseInterested || '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(admission.status)}`}>
                        {admission.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-gray-300">
                        {new Date(admission.admissionDate).toLocaleDateString('en-IN')}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(admission)}
                          className="p-2 hover:bg-blue-500/10 text-blue-400 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(admission._id)}
                          className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-[#030303] rounded-3xl border border-white/10 p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <User size={24} className="text-blue-500" />
                  {editingAdmission ? 'Edit Admission' : 'Add New Admission'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
                    Counselor *
                  </label>
                  <select
                    value={selectedCounselor}
                    onChange={(e) => setSelectedCounselor(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition-all"
                    required
                  >
                    <option value="">Select Counselor</option>
                    {counselors.map(c => (
                      <option key={c._id} value={c._id} className="bg-[#030303]">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
                    Student Name *
                  </label>
                  <input
                    type="text"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter student name"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="text"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition-all"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition-all"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
                    Course Interested
                  </label>
                  <input
                    type="text"
                    value={formData.courseInterested}
                    onChange={(e) => setFormData({ ...formData, courseInterested: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition-all"
                    placeholder="Course the student is interested in"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="Lead" className="bg-[#030303]">Lead</option>
                    <option value="Interested" className="bg-[#030303]">Interested</option>
                    <option value="Enrolled" className="bg-[#030303]">Enrolled</option>
                    <option value="Lost" className="bg-[#030303]">Lost</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition-all"
                    rows={3}
                    placeholder="Additional notes about the student"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                  >
                    {editingAdmission ? 'Update Admission' : 'Add Admission'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StudentAdmissions;
