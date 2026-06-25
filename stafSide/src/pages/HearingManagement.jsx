import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  Calendar, 
  IndianRupee, 
  Users, 
  Award, 
  Trash2, 
  Edit2, 
  AlertCircle, 
  Plus, 
  Minus, 
  Check, 
  Clock, 
  User, 
  PlusCircle,
  HelpCircle,
  FileText,
  TrendingUp
} from 'lucide-react';

const getApiBaseUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:45000/api';
  }
  return 'https://rizeworldmain.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl();

const HearingManagement = () => {
  const [hearings, setHearings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // all, active, inactive
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    post: '',
    overview: '',
    description: '',
    lastDate: '',
    salary: '',
    vacancy: '',
    experience: '',
    gender: 'both',
    status: 'active'
  });

  // Dynamic list states
  const [responsibilities, setResponsibilities] = useState(['']);
  const [qualifications, setQualifications] = useState(['']);
  const [offers, setOffers] = useState(['']);

  // Fetch Hearings
  const fetchHearings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/getHearing`);
      const result = await response.json();
      if (result.success) {
        setHearings(result.data || []);
      } else {
        setError(result.message || 'Failed to fetch hearings');
      }
    } catch (err) {
      console.error(err);
      setError('Connection error. Could not load hearings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHearings();
  }, []);

  // Form Submit (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Filter empty values from dynamic arrays
    const cleanResponsibilities = responsibilities.filter(item => item.trim() !== '');
    const cleanQualifications = qualifications.filter(item => item.trim() !== '');
    const cleanOffers = offers.filter(item => item.trim() !== '');

    const requestBody = {
      ...formData,
      keyResponsibilities: cleanResponsibilities,
      qulification: cleanQualifications, // Spelled exactly like schema: qulification
      whatWeOffer: cleanOffers
    };

    try {
      let url = `${API_BASE_URL}/addHearing`;
      let method = 'POST';

      if (isEditing) {
        url = `${API_BASE_URL}/updateHearing/${editId}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const result = await response.json();
      if (result.success) {
        setSuccess(isEditing ? 'Hearing updated successfully!' : 'Hearing created successfully!');
        resetForm();
        fetchHearings();
        // Clear message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message || 'Failed to save hearing');
      }
    } catch (err) {
      console.error(err);
      setError('Server connection error. Please try again.');
    }
  };

  // Delete Hearing
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hearing?')) return;
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/deleteHearing/${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (result.success) {
        setSuccess('Hearing deleted successfully!');
        fetchHearings();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message || 'Failed to delete hearing');
      }
    } catch (err) {
      console.error(err);
      setError('Server connection error.');
    }
  };

  // Toggle Hearing Status (Active / Inactive)
  const handleToggleStatus = async (hearing) => {
    setError('');
    setSuccess('');
    const newStatus = hearing.status === 'active' ? 'inactive' : 'active';

    try {
      const response = await fetch(`${API_BASE_URL}/updateHearing/${hearing._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const result = await response.json();
      if (result.success) {
        setSuccess(`Hearing marked as ${newStatus}!`);
        fetchHearings();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message || 'Failed to change status');
      }
    } catch (err) {
      console.error(err);
      setError('Server connection error.');
    }
  };

  // Start Edit Mode
  const startEdit = (hearing) => {
    setIsEditing(true);
    setEditId(hearing._id);
    
    // Format date string to YYYY-MM-DD for date input
    let formattedDate = '';
    if (hearing.lastDate) {
      formattedDate = new Date(hearing.lastDate).toISOString().split('T')[0];
    }

    setFormData({
      post: hearing.post || '',
      overview: hearing.overview || '',
      description: hearing.description || '',
      lastDate: formattedDate,
      salary: hearing.salary || '',
      vacancy: hearing.vacancy || '',
      experience: hearing.experience || '',
      gender: hearing.gender || 'both',
      status: hearing.status || 'active'
    });

    setResponsibilities(hearing.keyResponsibilities?.length ? [...hearing.keyResponsibilities] : ['']);
    setQualifications(hearing.qulification?.length ? [...hearing.qulification] : ['']); // Spelled exactly like schema: qulification
    setOffers(hearing.whatWeOffer?.length ? [...hearing.whatWeOffer] : ['']);
    
    // Scroll to form smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
      post: '',
      overview: '',
      description: '',
      lastDate: '',
      salary: '',
      vacancy: '',
      experience: '',
      gender: 'both',
      status: 'active'
    });
    setResponsibilities(['']);
    setQualifications(['']);
    setOffers(['']);
    setIsEditing(false);
    setEditId(null);
  };

  // Dynamic List Handlers
  const handleDynamicChange = (index, value, setter, list) => {
    const updated = [...list];
    updated[index] = value;
    setter(updated);
  };

  const addDynamicField = (setter, list) => {
    setter([...list, '']);
  };

  const removeDynamicField = (index, setter, list) => {
    if (list.length === 1) {
      setter(['']);
    } else {
      const updated = list.filter((_, i) => i !== index);
      setter(updated);
    }
  };

  // Filtered hearings list
  const filteredHearings = hearings.filter(h => {
    if (activeFilter === 'all') return true;
    return h.status === activeFilter;
  });

  return (
    <div className="space-y-10">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight uppercase">
            Hearing Management
          </h1>
          <p className="text-black font-bold mt-2 text-sm sm:text-base">
            Create, view and manage job hearings
          </p>
        </div>
        <div className="flex bg-[#eef2f6] p-1 rounded-2xl clay-inset self-start">
          {['all', 'active', 'inactive'].map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeFilter === filter
                  ? 'clay-flat text-[#8b5cf6] font-bold shadow-md shadow-purple-500/10'
                  : 'text-black hover:text-[#8b5cf6]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Success/Error Alerts */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex items-center gap-3 text-rose-600 text-sm font-bold shadow-md"
          >
            <AlertCircle size={20} className="flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center gap-3 text-emerald-600 text-sm font-bold shadow-md"
          >
            <Check size={20} className="flex-shrink-0" />
            <span>{success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Container (5 columns on large screen) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="clay-card p-6 sm:p-8 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              <PlusCircle size={100} className="text-[#8b5cf6]" />
            </div>

            <div className="relative z-10">
              <h2 className="text-xl sm:text-2xl font-black text-black uppercase tracking-tight">
                {isEditing ? 'Update Hearing' : 'Add New Hearing'}
              </h2>
              <p className="text-black font-bold mt-2 text-sm sm:text-base">
                {isEditing ? 'Modify existing hearing details' : 'Post a new job opening'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              {/* Post Title */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-black uppercase tracking-widest block mb-1 sm:mb-2 ml-1">Job Post Title</label>
                <input 
                  type="text" 
                  value={formData.post}
                  onChange={(e) => setFormData({ ...formData, post: e.target.value })}
                  placeholder="EX: Senior Full Stack Developer"
                  className="w-full p-3 sm:p-4 clay-inset rounded-2xl text-sm font-bold text-black focus:outline-none"
                  required
                />
              </div>

              {/* Grid Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-black uppercase tracking-widest block mb-1 sm:mb-2 ml-1">Vacancy</label>
                  <input 
                    type="text" 
                    value={formData.vacancy}
                    onChange={(e) => setFormData({ ...formData, vacancy: e.target.value })}
                    placeholder="EX: 4 Posts"
                    className="w-full p-3 sm:p-4 clay-inset rounded-2xl text-sm font-bold text-black focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-black uppercase tracking-widest block mb-1 sm:mb-2 ml-1">Experience</label>
                  <input 
                    type="text" 
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="EX: 2-3 Years"
                    className="w-full p-3 sm:p-4 clay-inset rounded-2xl text-sm font-bold text-black focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-black uppercase tracking-widest block mb-1 sm:mb-2 ml-1">Salary Range</label>
                  <input 
                    type="text" 
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    placeholder="EX: ₹40,000 - ₹60,000"
                    className="w-full p-3 sm:p-4 clay-inset rounded-2xl text-sm font-bold text-black focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-black uppercase tracking-widest block mb-1 sm:mb-2 ml-1">Last Date to Apply</label>
                  <input 
                    type="date" 
                    value={formData.lastDate}
                    onChange={(e) => setFormData({ ...formData, lastDate: e.target.value })}
                    className="w-full p-3 sm:p-4 clay-inset rounded-2xl text-sm font-bold text-black focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-black uppercase tracking-widest block mb-1 sm:mb-2 ml-1">Gender Pref.</label>
                  <select 
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full p-3 sm:p-4 clay-inset rounded-2xl text-sm font-bold text-black focus:outline-none cursor-pointer"
                  >
                    <option value="both">Both</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-black uppercase tracking-widest block mb-1 sm:mb-2 ml-1">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-3 sm:p-4 clay-inset rounded-2xl text-sm font-bold text-black focus:outline-none cursor-pointer"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Overview */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-black uppercase tracking-widest block mb-1 sm:mb-2 ml-1">Job Overview</label>
                <textarea 
                  value={formData.overview}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  placeholder="Provide a brief summary of the role..."
                  rows="3"
                  className="w-full p-3 sm:p-4 clay-inset rounded-2xl text-sm font-bold text-black focus:outline-none resize-none"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-black uppercase tracking-widest block mb-1 sm:mb-2 ml-1">Job Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide detailed duties, expectations, etc..."
                  rows="4"
                  className="w-full p-3 sm:p-4 clay-inset rounded-2xl text-sm font-bold text-black focus:outline-none resize-none"
                  required
                />
              </div>

              {/* Key Responsibilities (Dynamic Array) */}
              <div className="space-y-3">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black text-black uppercase tracking-widest block mb-1">Key Responsibilities</label>
                  <button 
                    type="button" 
                    onClick={() => addDynamicField(setResponsibilities, responsibilities)}
                    className="p-1 rounded-lg bg-purple-500/10 text-[#8b5cf6] hover:bg-purple-500 hover:text-white transition-all"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {responsibilities.map((resp, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input 
                        type="text" 
                        value={resp}
                        onChange={(e) => handleDynamicChange(index, e.target.value, setResponsibilities, responsibilities)}
                        placeholder={`Responsibility #${index + 1}`}
                        className="flex-1 p-2 sm:p-3 clay-inset rounded-xl text-xs font-bold text-black focus:outline-none"
                      />
                      <button 
                        type="button" 
                        onClick={() => removeDynamicField(index, setResponsibilities, responsibilities)}
                        className="p-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex-shrink-0"
                      >
                        <Minus size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Qualifications (Dynamic Array) */}
              <div className="space-y-3">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black text-black uppercase tracking-widest block mb-1">Qualifications</label>
                  <button 
                    type="button" 
                    onClick={() => addDynamicField(setQualifications, qualifications)}
                    className="p-1 rounded-lg bg-purple-500/10 text-[#8b5cf6] hover:bg-purple-500 hover:text-white transition-all"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {qualifications.map((qual, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input 
                        type="text" 
                        value={qual}
                        onChange={(e) => handleDynamicChange(index, e.target.value, setQualifications, qualifications)}
                        placeholder={`Qualification #${index + 1}`}
                        className="flex-1 p-2 sm:p-3 clay-inset rounded-xl text-xs font-bold text-black focus:outline-none"
                      />
                      <button 
                        type="button" 
                        onClick={() => removeDynamicField(index, setQualifications, qualifications)}
                        className="p-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex-shrink-0"
                      >
                        <Minus size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* What We Offer (Dynamic Array) */}
              <div className="space-y-3">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black text-black uppercase tracking-widest block mb-1">What We Offer</label>
                  <button 
                    type="button" 
                    onClick={() => addDynamicField(setOffers, offers)}
                    className="p-1 rounded-lg bg-purple-500/10 text-[#8b5cf6] hover:bg-purple-500 hover:text-white transition-all"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {offers.map((offer, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input 
                        type="text" 
                        value={offer}
                        onChange={(e) => handleDynamicChange(index, e.target.value, setOffers, offers)}
                        placeholder={`Benefit/Offer #${index + 1}`}
                        className="flex-1 p-2 sm:p-3 clay-inset rounded-xl text-xs font-bold text-black focus:outline-none"
                      />
                      <button 
                        type="button" 
                        onClick={() => removeDynamicField(index, setOffers, offers)}
                        className="p-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex-shrink-0"
                      >
                        <Minus size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                {isEditing && (
                  <button 
                    type="button" 
                    onClick={resetForm}
                    className="flex-1 py-3 px-4 clay-flat rounded-2xl text-xs font-black uppercase tracking-wider text-black hover:text-rose-500 transition-all"
                  >
                    Cancel
                  </button>
                )}
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex-1 py-3 px-4 bg-gradient-to-br from-[#8b5cf6] to-[#f472b6] text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all text-center"
                >
                  {isEditing ? 'Save Changes' : 'Create Hearing'}
                </motion.button>
              </div>
            </form>
          </div>
        </div>

        {/* Hearings List Container (7 columns on large screen) */}
        <div className="lg:col-span-7 space-y-6">
          {loading ? (
            <div className="clay-card p-12 text-center text-[#64748b] flex flex-col items-center gap-4 justify-center">
              <div className="w-12 h-12 rounded-full border-4 border-purple-500/25 border-t-purple-600 animate-spin" />
              <span className="font-bold text-sm uppercase tracking-widest">Loading Hearings...</span>
            </div>
          ) : filteredHearings.length === 0 ? (
            <div className="clay-card p-12 text-center text-[#64748b] flex flex-col items-center gap-4 justify-center">
              <div className="w-16 h-16 rounded-3xl clay-inset flex items-center justify-center text-[#64748b]">
                <Briefcase size={32} />
              </div>
              <div>
                <h3 className="font-black text-lg uppercase tracking-tight text-black">No Hearings Found</h3>
                <p className="text-xs text-black mt-1 uppercase tracking-wider">There are no hearings matching the filter.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredHearings.map((hearing) => (
                <HearingItem 
                  key={hearing._id} 
                  hearing={hearing} 
                  onEdit={startEdit} 
                  onDelete={handleDelete}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Sub-component for individual Hearing card
const HearingItem = ({ hearing, onEdit, onDelete, onToggleStatus }) => {
  const [expanded, setExpanded] = useState(false);

  const formattedDate = hearing.lastDate 
    ? new Date(hearing.lastDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Not Specified';

  return (
    <motion.div 
      layout
      className="clay-card p-6 flex flex-col space-y-4 relative overflow-hidden"
    >
      {/* Top Banner details */}
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
              hearing.status === 'active' 
                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
            }`}>
              {hearing.status}
            </span>
            <span className="text-[10px] font-bold text-black flex items-center gap-1">
              <Clock size={10} />
              Last Date: {formattedDate}
            </span>
          </div>
          <h3 className="text-xl font-black text-black tracking-tight">{hearing.post}</h3>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onToggleStatus(hearing)}
            title={hearing.status === 'active' ? 'Deactivate hearing' : 'Activate hearing'}
            className={`p-2 rounded-xl transition-all ${
              hearing.status === 'active' 
                ? 'clay-flat text-emerald-600 hover:text-rose-600 hover:clay-inset' 
                : 'clay-flat text-rose-600 hover:text-emerald-600 hover:clay-inset'
            }`}
          >
            {hearing.status === 'active' ? <CheckCircleIcon /> : <Clock size={16} />}
          </button>
          <button
            onClick={() => onEdit(hearing)}
            title="Edit hearing"
            className="p-2 clay-flat rounded-xl text-blue-600 hover:clay-inset transition-all"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(hearing._id)}
            title="Delete hearing"
            className="p-2 clay-flat rounded-xl text-rose-600 hover:clay-inset transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Overview */}
      <p className="text-xs font-bold text-black leading-relaxed uppercase tracking-wider max-w-xl">
        {hearing.overview}
      </p>

      {/* Meta Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#eef2f6] p-3 rounded-2xl clay-inset">
        <div className="flex items-center gap-2">
          <IndianRupee size={16} className="text-purple-600 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-black uppercase tracking-wider">Salary</span>
            <span className="text-xs font-black text-black">{hearing.salary}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Users size={16} className="text-purple-600" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-black uppercase tracking-wider">Vacancies</span>
            <span className="text-xs font-black text-black">{hearing.vacancy}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Award size={16} className="text-purple-600" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-black uppercase tracking-wider">Experience</span>
            <span className="text-xs font-black text-black">{hearing.experience}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <User size={16} className="text-purple-600" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-black uppercase tracking-wider">Gender</span>
            <span className="text-xs font-black text-black capitalize">{hearing.gender}</span>
          </div>
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 pt-2 overflow-hidden"
          >
            <div className="border-t border-gray-200/50 pt-4 space-y-4">
              {/* Detailed Description */}
              <div className="space-y-1">
                <h4 className="text-xs font-black text-black uppercase tracking-wider flex items-center gap-1.5">
                  <FileText size={12} />
                  Job Description
                </h4>
                <p className="text-xs font-bold text-black leading-relaxed whitespace-pre-wrap">
                  {hearing.description}
                </p>
              </div>

              {/* Responsibilities list */}
              {hearing.keyResponsibilities?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-black uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp size={12} />
                    Key Responsibilities
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {hearing.keyResponsibilities.map((item, idx) => (
                      <li key={idx} className="text-xs font-bold text-black leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Qualifications list */}
              {hearing.qulification?.length > 0 && ( // Spelled exactly like schema: qulification
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-black uppercase tracking-wider flex items-center gap-1.5">
                    <Award size={12} />
                    Qualifications & Skills
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {hearing.qulification.map((item, idx) => (
                      <li key={idx} className="text-xs font-bold text-black leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What We Offer list */}
              {hearing.whatWeOffer?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-black uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircleIcon size={12} />
                    What We Offer
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {hearing.whatWeOffer.map((item, idx) => (
                      <li key={idx} className="text-xs font-bold text-black leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expand/Collapse Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full py-2.5 bg-[#eef2f6] text-[#8b5cf6] hover:bg-[#e8ebf0] hover:clay-inset rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm"
      >
        {expanded ? 'Hide Details' : 'View Full Details'}
      </button>
    </motion.div>
  );
};

// Check circle icon with correct sizing
const CheckCircleIcon = ({ size = 16 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default HearingManagement;
