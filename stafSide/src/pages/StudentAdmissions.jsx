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
  Clock,
  GraduationCap
} from 'lucide-react';
import { cn } from '../utils';

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
  const staffInfo = JSON.parse(localStorage.getItem('staffInfo') || '{}');

  const getApiUrl = (endpoint) => {
    const base = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:45000/api'
      : 'https://rizeworldmain.onrender.com/api';
    return `${base}${endpoint}`;
  };

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    try {
      const url = `${getApiUrl('/staff/admissions')}?counselorId=${staffInfo._id || staffInfo.id}`;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = {
        ...formData,
        counselorId: staffInfo._id || staffInfo.id,
        counselorName: staffInfo.name || ''
      };
      
      let response;
      if (editingAdmission) {
        response = await fetch(`${getApiUrl('/staff/admissions')}/${editingAdmission._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } else {
        response = await fetch(getApiUrl('/staff/admissions'), {
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
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this admission?')) return;
    
    try {
      const response = await fetch(`${getApiUrl('/staff/admissions')}/${id}`, {
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
      'Lead': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      'Interested': 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
      'Enrolled': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      'Lost': 'bg-red-500/10 text-red-600 border-red-500/20'
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-3 clay-flat rounded-2xl text-[#64748b] hover:text-[#8b5cf6] transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1e293b]">Student Admissions</h1>
            <p className="text-sm font-bold text-[#64748b] mt-1">Manage student admissions and leads</p>
          </div>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-6 py-3 rounded-2xl font-black transition-all clay-flat"
        >
          <PlusCircle size={20} />
          Add New Admission
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: 'Total Leads', value: admissions.length, icon: Users, color: 'bg-blue-500/10 text-blue-600' },
          { label: 'Interested', value: admissions.filter(a => a.status === 'Interested').length, icon: CheckCircle2, color: 'bg-yellow-500/10 text-yellow-600' },
          { label: 'Enrolled', value: admissions.filter(a => a.status === 'Enrolled').length, icon: Save, color: 'bg-emerald-500/10 text-emerald-600' },
          { label: 'Lost', value: admissions.filter(a => a.status === 'Lost').length, icon: Clock, color: 'bg-red-500/10 text-red-600' }
        ].map((stat, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="clay-card p-4 sm:p-6"
          >
            <div className="flex items-center gap-4">
              <div className={cn("p-3 sm:p-4 rounded-2xl clay-inset", stat.color)}>
                <stat.icon size={20} sm={24} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-black text-[#64748b] uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-xl sm:text-2xl font-black text-[#1e293b] mt-1">{stat.value}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Admissions List */}
      <div className="clay-card rounded-3xl overflow-hidden">
        {loading ? (
          <div className="p-12 flex items-center justify-center">
            <div className="text-[#64748b] text-xl animate-pulse font-black">Loading admissions...</div>
          </div>
        ) : admissions.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-[#64748b] font-bold">No admissions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#eef2f6]">
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-black text-[#64748b] uppercase tracking-widest">Student Details</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-black text-[#64748b] uppercase tracking-widest">Course</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-black text-[#64748b] uppercase tracking-widest">Status</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-black text-[#64748b] uppercase tracking-widest">Date</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-black text-[#64748b] uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d1d5db]">
                {admissions.map((admission) => (
                  <tr key={admission._id} className="hover:bg-white/50 transition-colors">
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div>
                        <p className="text-sm font-black text-[#1e293b]">{admission.studentName}</p>
                        <div className="flex flex-col gap-1 mt-1">
                          <p className="text-xs font-bold text-[#64748b] flex items-center gap-1">
                            <Phone size={12} /> {admission.phoneNumber}
                          </p>
                          {admission.email && (
                            <p className="text-xs font-bold text-[#64748b] flex items-center gap-1">
                              <Mail size={12} /> {admission.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <p className="text-sm font-bold text-[#475569]">{admission.courseInterested || '-'}</p>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black border", getStatusBadge(admission.status))}>
                        {admission.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <p className="text-xs font-bold text-[#64748b]">
                        {new Date(admission.admissionDate).toLocaleDateString('en-IN')}
                      </p>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(admission)}
                          className="p-2 hover:bg-[#8b5cf6]/10 text-[#8b5cf6] rounded-xl transition-colors"
                          title="Edit"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(admission._id)}
                          className="p-2 hover:bg-rose-500/10 text-rose-500 rounded-xl transition-colors"
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
              className="relative w-full max-w-lg clay-card rounded-3xl p-6 sm:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-[#1e293b] flex items-center gap-2">
                  <User size={24} className="text-[#8b5cf6]" />
                  {editingAdmission ? 'Edit Admission' : 'Add New Admission'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl text-[#64748b] hover:text-[#1e293b] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-[#64748b] uppercase tracking-widest block mb-1.5">
                    Student Name *
                  </label>
                  <input
                    type="text"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full clay-inset rounded-xl px-4 py-3 text-sm text-[#1e293b] focus:border-[#8b5cf6] outline-none transition-all"
                    placeholder="Enter student name"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-[#64748b] uppercase tracking-widest block mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="text"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="w-full clay-inset rounded-xl px-4 py-3 text-sm text-[#1e293b] focus:border-[#8b5cf6] outline-none transition-all"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-[#64748b] uppercase tracking-widest block mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full clay-inset rounded-xl px-4 py-3 text-sm text-[#1e293b] focus:border-[#8b5cf6] outline-none transition-all"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-[#64748b] uppercase tracking-widest block mb-1.5">
                    Course Interested
                  </label>
                  <input
                    type="text"
                    value={formData.courseInterested}
                    onChange={(e) => setFormData({ ...formData, courseInterested: e.target.value })}
                    className="w-full clay-inset rounded-xl px-4 py-3 text-sm text-[#1e293b] focus:border-[#8b5cf6] outline-none transition-all"
                    placeholder="Course the student is interested in"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-[#64748b] uppercase tracking-widest block mb-1.5">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full clay-inset rounded-xl px-4 py-3 text-sm text-[#1e293b] focus:border-[#8b5cf6] outline-none transition-all"
                  >
                    <option value="Lead">Lead</option>
                    <option value="Interested">Interested</option>
                    <option value="Enrolled">Enrolled</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-[#64748b] uppercase tracking-widest block mb-1.5">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full clay-inset rounded-xl px-4 py-3 text-sm text-[#1e293b] focus:border-[#8b5cf6] outline-none transition-all"
                    rows={3}
                    placeholder="Additional notes about the student"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 rounded-xl clay-flat text-[#64748b] font-black hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 rounded-xl bg-[#8b5cf6] text-white font-black hover:bg-[#7c3aed] transition-all clay-flat"
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