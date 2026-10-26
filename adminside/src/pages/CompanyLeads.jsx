import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Plus, 
  Search, 
  Filter, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Building2,
  Sparkles,
  Phone,
  Mail,
  Calendar,
  MapPin,
  AlertCircle,
  MessageSquare,
  Check,
  X,
  Trash2,
  Edit3,
  ExternalLink,
  Copy,
  FileText,
  RefreshCw,
  AlertTriangle,
  UserCheck,
  ArrowRight,
  HelpCircle,
  Flame,
  CheckSquare,
  Square
} from 'lucide-react';
import {
  getNextLeadId,
  createCompanyLead,
  getAllCompanyLeads,
  updateCompanyLead,
  deleteCompanyLead,
  getAllStaff
} from '../api';

const LEAD_SOURCES = ['Website', 'Referral', 'Social Media', 'Google Ads', 'Cold Call', 'Exhibition', 'WhatsApp', 'Direct Walk-in', 'Other'];
const LEAD_STATUSES = ['New Inquiry', 'Contacted', 'In Follow-up', 'Meeting Scheduled', 'Proposal Sent', 'Converted', 'Lost'];
const NEXT_ACTIONS = ['Call', 'Meeting', 'WhatsApp', 'Email', 'Visit', 'Demo', 'Other'];

export default function CompanyLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [staffList, setStaffList] = useState([]);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    newInquiries: 0,
    inFollowUp: 0,
    converted: 0,
    lost: 0
  });

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState(null);
  const [editingLead, setEditingLead] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [copiedText, setCopiedText] = useState('');

  // Initial Form Data template matching the handwritten notes
  const initialFormData = {
    unicId: '',
    name: '',
    companyName: '',
    phoneNumber: '',
    sameAsPhone: true,
    whatsappNumber: '',
    email: '',
    address: '',
    state: '',
    purpose: '',
    leadSource: 'Website',
    enquiryDate: new Date().toISOString().split('T')[0],
    leadStatus: 'New Inquiry',
    leadPersonName: '',
    assignedStaffId: '',
    lastConversation: '',
    nextFollowUpDate: '',
    nextAction: 'Call',
    lostReason: '',
    notes: ''
  };

  const [formData, setFormData] = useState(initialFormData);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  const copyToClipboard = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedText(label || text);
    showToast(`Copied ${label || 'text'} to clipboard!`);
    setTimeout(() => setCopiedText(''), 2000);
  };

  // Fetch Leads from Backend
  const fetchLeads = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await getAllCompanyLeads({
        search: searchTerm,
        status: selectedStatus
      });

      if (res && res.success) {
        setLeads(res.data || []);
        if (res.stats) {
          setStats(res.stats);
        }
      } else {
        showToast(res?.message || 'Failed to fetch leads', 'error');
      }
    } catch (err) {
      console.error('Fetch leads error:', err);
      showToast('Error connecting to backend for leads', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch Staff for assignment dropdown
  const fetchStaffData = async () => {
    try {
      const res = await getAllStaff();
      if (res && res.success && Array.isArray(res.data)) {
        setStaffList(res.data.filter(s => !s.isRemoved));
      }
    } catch (err) {
      console.error('Failed to load staff list for CRM:', err);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchStaffData();
  }, [selectedStatus]);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeads(true);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Open Form for New Lead
  const handleOpenNewLeadModal = async () => {
    setEditingLead(null);
    setFormData(initialFormData);
    setIsFormOpen(true);

    // Fetch next auto unique ID
    try {
      const idRes = await getNextLeadId();
      if (idRes && idRes.success && idRes.nextUnicId) {
        setFormData(prev => ({
          ...prev,
          unicId: idRes.nextUnicId
        }));
      }
    } catch (err) {
      console.error('Error fetching next unic ID:', err);
    }
  };

  // Open Form to Edit Lead
  const handleOpenEditModal = (lead) => {
    setEditingLead(lead);
    const dateFormatted = lead.enquiryDate 
      ? new Date(lead.enquiryDate).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0];

    const followUpFormatted = lead.nextFollowUpDate
      ? new Date(lead.nextFollowUpDate).toISOString().slice(0, 16)
      : '';

    setFormData({
      unicId: lead.unicId || '',
      name: lead.name || '',
      companyName: lead.companyName || '',
      phoneNumber: lead.phoneNumber || '',
      sameAsPhone: lead.whatsappNumber === lead.phoneNumber,
      whatsappNumber: lead.whatsappNumber || '',
      email: lead.email || '',
      address: lead.address || '',
      state: lead.state || '',
      purpose: lead.purpose || '',
      leadSource: leadSourceFormatted(lead.leadSource),
      enquiryDate: dateFormatted,
      leadStatus: lead.leadStatus || 'New Inquiry',
      leadPersonName: lead.leadPersonName || '',
      assignedStaffId: lead.assignedStaffId?._id || lead.assignedStaffId || '',
      lastConversation: lead.lastConversation || '',
      nextFollowUpDate: followUpFormatted,
      nextAction: lead.nextAction || 'Call',
      lostReason: lead.lostReason || '',
      notes: lead.notes || ''
    });
    setIsFormOpen(true);
  };

  const leadSourceFormatted = (source) => {
    return LEAD_SOURCES.includes(source) ? source : 'Website';
  };

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'sameAsPhone') {
        setFormData(prev => ({
          ...prev,
          sameAsPhone: checked,
          whatsappNumber: checked ? prev.phoneNumber : prev.whatsappNumber
        }));
      }
    } else {
      setFormData(prev => {
        const next = { ...prev, [name]: value };
        if (name === 'phoneNumber' && prev.sameAsPhone) {
          next.whatsappNumber = value;
        }
        return next;
      });
    }
  };

  // Handle staff select change
  const handleStaffSelect = (e) => {
    const staffId = e.target.value;
    const selected = staffList.find(s => s._id === staffId);
    setFormData(prev => ({
      ...prev,
      assignedStaffId: staffId,
      leadPersonName: selected ? selected.name : prev.leadPersonName
    }));
  };

  // Form Submit
  const handleSubmitLeadForm = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Lead name is required', 'error');
      return;
    }
    if (!formData.phoneNumber.trim()) {
      showToast('Phone number is required', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        whatsappNumber: formData.sameAsPhone ? formData.phoneNumber : formData.whatsappNumber
      };

      if (editingLead) {
        // Update existing lead
        const res = await updateCompanyLead(editingLead._id, payload);
        if (res && res.success) {
          showToast('Lead updated successfully!');
          setIsFormOpen(false);
          fetchLeads(true);
        } else {
          showToast(res?.message || 'Failed to update lead', 'error');
        }
      } else {
        // Create new lead
        const res = await createCompanyLead(payload);
        if (res && res.success) {
          showToast('New lead added to CRM successfully!');
          setIsFormOpen(false);
          fetchLeads(true);
        } else {
          showToast(res?.message || 'Failed to create lead', 'error');
        }
      }
    } catch (err) {
      console.error('Submit lead error:', err);
      showToast(err?.message || 'Server error occurred while saving lead', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Lead
  const handleDeleteLead = async (id) => {
    try {
      const res = await deleteCompanyLead(id);
      if (res && res.success) {
        showToast('Lead deleted successfully');
        setDeleteConfirmId(null);
        fetchLeads(true);
      } else {
        showToast(res?.message || 'Failed to delete lead', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error deleting lead', 'error');
    }
  };

  // Quick Status Badge Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'New Inquiry':
        return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20';
      case 'Contacted':
        return 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20';
      case 'In Follow-up':
        return 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20';
      case 'Meeting Scheduled':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20';
      case 'Proposal Sent':
        return 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20';
      case 'Converted':
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
      case 'Lost':
        return 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20';
      default:
        return 'bg-gray-500/15 text-gray-600 dark:text-gray-400 border border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Alert */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-[100] px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 backdrop-blur-md text-sm font-semibold ${
              toast.type === 'error'
                ? 'bg-rose-500/90 text-white border-rose-400'
                : 'bg-emerald-600/95 text-white border-emerald-400'
            }`}
          >
            {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
              <Sparkles size={12} />
              CRM Leads Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Company Leads CRM
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track inquiries, manage follow-up schedules, assign team members, and convert prospects.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => fetchLeads(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-sm"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleOpenNewLeadModal}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:scale-[1.02] active:scale-100 transition-all"
          >
            <Plus size={18} />
            <span>Enter New Lead</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        {[
          { icon: Building2, label: 'Total Leads', value: stats.total, color: 'from-blue-500 to-indigo-500' },
          { icon: Clock, label: 'New Inquiries', value: stats.newInquiries, color: 'from-cyan-500 to-blue-500' },
          { icon: TrendingUp, label: 'In Follow-up', value: stats.inFollowUp, color: 'from-purple-500 to-pink-500' },
          { icon: CheckCircle2, label: 'Converted', value: stats.converted, color: 'from-emerald-500 to-teal-500' },
          { icon: AlertCircle, label: 'Lost Leads', value: stats.lost, color: 'from-rose-500 to-orange-500' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/10 p-4 sm:p-5 shadow-sm">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 text-white shadow-md`}>
              <Icon size={18} />
            </div>
            <div className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">{value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">{label}</div>
          </div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/10 p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, name, phone, company, purpose..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs text-gray-400 font-medium">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Statuses</option>
              {LEAD_STATUSES.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Leads Table / List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading company leads...</p>
        </div>
      ) : leads.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-white/10 p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-inner">
            <Target size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No company leads found</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-1">
              {searchTerm || selectedStatus !== 'All'
                ? 'Try adjusting your search criteria or filter options.'
                : 'No leads entered yet. Click the button below to add your first company lead!'}
            </p>
          </div>
          <button
            onClick={handleOpenNewLeadModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all"
          >
            <Plus size={16} />
            <span>Enter First Lead</span>
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/75 dark:bg-white/5 border-b border-gray-100 dark:border-white/10 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-4">Unique ID</th>
                  <th className="px-5 py-4">Lead / Company</th>
                  <th className="px-5 py-4">Contact & WhatsApp</th>
                  <th className="px-5 py-4">Lead Source</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Assigned Staff</th>
                  <th className="px-5 py-4">Next Follow-Up</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {leads.map((lead) => (
                  <tr 
                    key={lead._id}
                    className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Unique ID */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200">
                          {lead.unicId || '—'}
                        </span>
                        <button
                          onClick={() => copyToClipboard(lead.unicId, 'Lead ID')}
                          title="Copy Unique ID"
                          className="text-gray-400 hover:text-blue-500 p-1"
                        >
                          <Copy size={12} />
                        </button>
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        {lead.enquiryDate ? new Date(lead.enquiryDate).toLocaleDateString() : ''}
                      </div>
                    </td>

                    {/* Lead / Company */}
                    <td className="px-5 py-4">
                      <div className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                        <span>{lead.name}</span>
                      </div>
                      {lead.companyName && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                          <Building2 size={12} />
                          <span>{lead.companyName}</span>
                        </div>
                      )}
                      {lead.purpose && (
                        <div className="text-[11px] text-blue-600 dark:text-blue-400 truncate max-w-[200px] mt-0.5" title={lead.purpose}>
                          Purpose: {lead.purpose}
                        </div>
                      )}
                    </td>

                    {/* Contact Info */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${lead.phoneNumber}`}
                          className="text-xs font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-600 flex items-center gap-1"
                          title="Call"
                        >
                          <Phone size={12} className="text-blue-500" />
                          <span>{lead.phoneNumber}</span>
                        </a>
                        <button
                          onClick={() => copyToClipboard(lead.phoneNumber, 'Phone')}
                          className="text-gray-400 hover:text-blue-500"
                        >
                          <Copy size={12} />
                        </button>
                      </div>

                      {lead.whatsappNumber && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <a
                            href={`https://wa.me/${lead.whatsappNumber.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                            title="Chat on WhatsApp"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>WA: {lead.whatsappNumber}</span>
                          </a>
                        </div>
                      )}
                    </td>

                    {/* Lead Source */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300">
                        {lead.leadSource || 'Website'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${getStatusBadge(lead.leadStatus)}`}>
                        {lead.leadStatus}
                      </span>
                      {lead.leadStatus === 'Lost' && lead.lostReason && (
                        <div className="text-[11px] text-rose-500 max-w-[150px] truncate mt-0.5" title={lead.lostReason}>
                          Reason: {lead.lostReason}
                        </div>
                      )}
                    </td>

                    {/* Assigned Staff */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-xs font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                        <UserCheck size={14} className="text-indigo-500" />
                        <span>{lead.leadPersonName || lead.assignedStaffId?.name || 'Unassigned'}</span>
                      </div>
                      {lead.assignedStaffId?.department && (
                        <div className="text-[11px] text-gray-400 ml-5">
                          {lead.assignedStaffId.department}
                        </div>
                      )}
                    </td>

                    {/* Next Follow Up */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      {lead.nextFollowUpDate ? (
                        <div>
                          <div className="text-xs font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                            <Calendar size={13} className="text-amber-500" />
                            <span>{new Date(lead.nextFollowUpDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                            <span className="text-gray-400 font-normal">
                              {new Date(lead.nextFollowUpDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium ml-4 mt-0.5">
                            Action: {lead.nextAction || 'Call'}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Not Scheduled</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedLeadForDetail(lead)}
                          title="View Full Details & Notes"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-white/10 transition-colors"
                        >
                          <FileText size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(lead)}
                          title="Edit Lead"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-white/10 transition-colors"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(lead._id)}
                          title="Delete Lead"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-white/10 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CRM Entry & Edit Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-white/10 w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 glass border-b border-gray-100 dark:border-white/10 px-6 py-4 flex items-center justify-between backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Target size={22} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      {editingLead ? 'Edit Company Lead' : 'Enter New Company Lead'}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Fill all lead details as per CRM tracking criteria
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmitLeadForm} className="p-6 space-y-6 flex-1">
                {/* 1. Identification Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <span>1. Lead Identification</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Unique ID */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Unique ID (Unic ID) *
                      </label>
                      <input
                        type="text"
                        name="unicId"
                        value={formData.unicId}
                        onChange={handleInputChange}
                        placeholder="e.g. CL-1001"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Lead / Contact Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    {/* Company Name */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Company Name (if applicable)
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="e.g. Rize Technologies"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Contact Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <span>2. Contact Details</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="e.g. 9876543210"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    {/* WhatsApp Number */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                          WhatsApp Number
                        </label>
                        <label className="flex items-center gap-1.5 text-[11px] text-blue-600 dark:text-blue-400 cursor-pointer">
                          <input
                            type="checkbox"
                            name="sameAsPhone"
                            checked={formData.sameAsPhone}
                            onChange={handleInputChange}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span>Same as phone</span>
                        </label>
                      </div>
                      <input
                        type="text"
                        name="whatsappNumber"
                        disabled={formData.sameAsPhone}
                        value={formData.whatsappNumber}
                        onChange={handleInputChange}
                        placeholder="e.g. 9876543210"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="name@company.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Address */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Address / Location
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="e.g. Sector 62, Noida"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Purpose / Requirements */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Purpose / Service Required
                      </label>
                      <input
                        type="text"
                        name="purpose"
                        value={formData.purpose}
                        onChange={handleInputChange}
                        placeholder="e.g. Web Development, SEO, Software"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Classification & Source */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <span>3. Classification & Source</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Lead Source */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Lead Source
                      </label>
                      <select
                        name="leadSource"
                        value={formData.leadSource}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {LEAD_SOURCES.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    {/* Enquiry Date (first data when come) */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Enquiry Date (First Date When Come)
                      </label>
                      <input
                        type="date"
                        name="enquiryDate"
                        value={formData.enquiryDate}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Follow-up & Status */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <span>4. Status & Follow-Up Management</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Lead Status */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Lead Status *
                      </label>
                      <select
                        name="leadStatus"
                        value={formData.leadStatus}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                      >
                        {LEAD_STATUSES.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    {/* Lead Person Name / Kis ko lena hai follow up */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Lead Person Name (Kis ko lena hai follow up)
                      </label>
                      {staffList.length > 0 ? (
                        <select
                          value={formData.assignedStaffId}
                          onChange={handleStaffSelect}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">-- Select Team Member --</option>
                          {staffList.map(s => (
                            <option key={s._id} value={s._id}>
                              {s.name} ({s.department || s.role || 'Staff'})
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          name="leadPersonName"
                          value={formData.leadPersonName}
                          onChange={handleInputChange}
                          placeholder="e.g. Amit Sharma"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                    </div>

                    {/* Next Action */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Next Action
                      </label>
                      <select
                        name="nextAction"
                        value={formData.nextAction}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {NEXT_ACTIONS.map(a => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Next Follow-up Date & Time */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Next Follow-up Date and Time
                      </label>
                      <input
                        type="datetime-local"
                        name="nextFollowUpDate"
                        value={formData.nextFollowUpDate}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Lost Reason (Conditional) */}
                    {formData.leadStatus === 'Lost' && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <label className="block text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1.5">
                          Lost Reason (if lost) *
                        </label>
                        <input
                          type="text"
                          name="lostReason"
                          value={formData.lostReason}
                          onChange={handleInputChange}
                          placeholder="e.g. Budget too low, Competitor chosen, Unreachable"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-rose-300 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                          required={formData.leadStatus === 'Lost'}
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Last Conversation */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Last Conversation / Discussion Summary
                    </label>
                    <textarea
                      name="lastConversation"
                      rows={2}
                      value={formData.lastConversation}
                      onChange={handleInputChange}
                      placeholder="Summary of what was discussed in the last call/meeting..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Notes & Additional Info */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Notes / Any Additional Info
                    </label>
                    <textarea
                      name="notes"
                      rows={2}
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any specific client preferences, background, budget or remarks..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check size={18} />
                        <span>{editingLead ? 'Update Lead' : 'Save New Lead'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Detail Modal */}
      <AnimatePresence>
        {selectedLeadForDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                    <Target size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-gray-100 dark:bg-white/10">
                        {selectedLeadForDetail.unicId}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${getStatusBadge(selectedLeadForDetail.leadStatus)}`}>
                        {selectedLeadForDetail.leadStatus}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                      {selectedLeadForDetail.name}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedLeadForDetail(null)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Lead Details Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-white/5">
                  <span className="text-gray-400 block font-medium">Company</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5 block">
                    {selectedLeadForDetail.companyName || '—'}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-white/5">
                  <span className="text-gray-400 block font-medium">Phone & WhatsApp</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5 block">
                    {selectedLeadForDetail.phoneNumber} {selectedLeadForDetail.whatsappNumber && `(WA: ${selectedLeadForDetail.whatsappNumber})`}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-white/5">
                  <span className="text-gray-400 block font-medium">Lead Source</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5 block">
                    {selectedLeadForDetail.leadSource || 'Website'}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-white/5">
                  <span className="text-gray-400 block font-medium">Assigned Follow-Up Person</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5 block">
                    {selectedLeadForDetail.leadPersonName || 'Unassigned'}
                  </span>
                </div>
              </div>

              {/* Purpose & Location */}
              {(selectedLeadForDetail.purpose || selectedLeadForDetail.address) && (
                <div className="space-y-2 text-xs">
                  {selectedLeadForDetail.purpose && (
                    <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-500/20 text-blue-700 dark:text-blue-300">
                      <strong>Purpose / Requirement:</strong> {selectedLeadForDetail.purpose}
                    </div>
                  )}
                  {selectedLeadForDetail.address && (
                    <div className="text-gray-500 dark:text-gray-400">
                      <strong>Address:</strong> {selectedLeadForDetail.address}
                    </div>
                  )}
                </div>
              )}

              {/* Next Scheduled Follow-up */}
              {selectedLeadForDetail.nextFollowUpDate && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-bold block uppercase tracking-wider">
                      Next Follow-up Scheduled
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5 block">
                      {new Date(selectedLeadForDetail.nextFollowUpDate).toLocaleString()}
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-amber-500 text-white text-xs font-bold">
                    Action: {selectedLeadForDetail.nextAction || 'Call'}
                  </span>
                </div>
              )}

              {/* Last Conversation */}
              {selectedLeadForDetail.lastConversation && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Last Conversation
                  </h4>
                  <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-white/5 text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                    {selectedLeadForDetail.lastConversation}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedLeadForDetail.notes && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Notes & Additional Info
                  </h4>
                  <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-white/5 text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                    {selectedLeadForDetail.notes}
                  </div>
                </div>
              )}

              {/* History Timeline */}
              {selectedLeadForDetail.history && selectedLeadForDetail.history.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Follow-Up History
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {selectedLeadForDetail.history.map((h, i) => (
                      <div key={i} className="p-2.5 rounded-lg border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] text-xs">
                        <div className="flex items-center justify-between text-gray-400 text-[11px] mb-1">
                          <span>{h.date ? new Date(h.date).toLocaleString() : ''}</span>
                          <span className="font-semibold text-indigo-500">{h.updatedBy || 'Team'}</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{h.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-white/10">
                <button
                  onClick={() => {
                    const toEdit = selectedLeadForDetail;
                    setSelectedLeadForDetail(null);
                    handleOpenEditModal(toEdit);
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all flex items-center gap-1.5"
                >
                  <Edit3 size={14} />
                  <span>Edit Lead Details</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-white/10 p-6 max-w-sm w-full shadow-2xl text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Delete Lead Entry</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Are you sure you want to permanently delete this company lead record?
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-600 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteLead(deleteConfirmId)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
