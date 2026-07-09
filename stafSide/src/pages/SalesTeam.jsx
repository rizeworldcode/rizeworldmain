import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  PlusCircle,
  Edit3,
  Trash2,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Package,
  Calendar,
  X,
  Save,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { cn } from '../utils';

const SalesTeam = ({ onBack }) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [formData, setFormData] = useState({
    clientName: '',
    productName: '',
    saleAmount: '',
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
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const url = `${getApiUrl('/staff/sales')}?salesPersonId=${staffInfo._id || staffInfo.id}`;
      const response = await fetch(url);
      const result = await response.json();
      if (result.success) {
        setSales(result.data);
      }
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.clientName.trim() || !formData.productName.trim() || !formData.saleAmount) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const data = {
        ...formData,
        saleAmount: parseFloat(formData.saleAmount),
        salesPersonId: staffInfo._id || staffInfo.id,
        salesPersonName: staffInfo.name || ''
      };

      let response;
      if (editingSale) {
        response = await fetch(`${getApiUrl('/staff/sales')}/${editingSale._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } else {
        response = await fetch(getApiUrl('/staff/sales'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      }

      const result = await response.json();
      if (result.success) {
        alert(editingSale ? 'Sale updated successfully!' : 'Sale added successfully!');
        fetchSales();
        resetForm();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error saving sale:', error);
      alert('Failed to save sale');
    }
  };

  const handleEdit = (sale) => {
    setEditingSale(sale);
    setFormData({
      clientName: sale.clientName,
      productName: sale.productName,
      saleAmount: sale.saleAmount.toString(),
      notes: sale.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sale record?')) return;

    try {
      const response = await fetch(`${getApiUrl('/staff/sales')}/${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (result.success) {
        alert('Sale record deleted successfully!');
        fetchSales();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error deleting sale:', error);
      alert('Failed to delete sale record');
    }
  };

  const resetForm = () => {
    setFormData({
      clientName: '',
      productName: '',
      saleAmount: '',
      notes: ''
    });
    setEditingSale(null);
    setIsModalOpen(false);
  };

  const totalSalesAmount = sales.reduce((acc, curr) => acc + (curr.saleAmount || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 max-w-7xl mx-auto pb-10"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-3 clay-flat hover:clay-inset rounded-2xl text-gray-600 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-800 tracking-tight">Sales Panel</h1>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Log & View Sales History</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-wider shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-100 transition-all"
        >
          <PlusCircle size={18} />
          Add New Sale
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="clay-flat p-6 rounded-3xl flex items-center gap-4 bg-[#eef2f6]">
          <div className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-600 shadow-inner">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Sales Count</p>
            <h3 className="text-3xl font-black text-gray-800 tracking-tighter mt-1">{sales.length}</h3>
          </div>
        </div>

        <div className="clay-flat p-6 rounded-3xl flex items-center gap-4 bg-[#eef2f6]">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-600 shadow-inner">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Revenue Generated</p>
            <h3 className="text-3xl font-black text-emerald-600 tracking-tighter mt-1">
              ₹{totalSalesAmount.toLocaleString('en-IN')}
            </h3>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="clay-flat p-6 rounded-3xl bg-[#eef2f6]">
        <div className="flex items-center gap-2 mb-6">
          <Package size={20} className="text-purple-500" />
          <h2 className="text-lg font-black text-gray-800 uppercase tracking-wider">Sales Log History</h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : sales.length === 0 ? (
          <div className="text-center py-16 text-gray-500 font-bold uppercase tracking-wider text-xs">
            No sales logged yet. Click 'Add New Sale' to record one.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200/50 bg-black/5">
                  <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Client Name</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Product / Service</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Sale Amount</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Sale Date</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Notes</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-gray-500 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50">
                {sales.map((sale) => (
                  <tr key={sale._id} className="hover:bg-white/10 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-gray-800">{sale.clientName}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-600">
                      <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-purple-500/10 text-purple-600 border border-purple-500/20">
                        {sale.productName}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-emerald-600">
                      ₹{sale.saleAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-500">
                      {new Date(sale.saleDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 italic max-w-xs truncate">{sale.notes || '—'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(sale)}
                          className="p-2 text-purple-600 hover:bg-purple-500/10 rounded-xl transition-all"
                          title="Edit Sale Record"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(sale._id)}
                          className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                          title="Delete Record"
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
        )}
      </div>

      {/* Add / Edit Sale Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetForm}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#eef2f6] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden border border-white/20 z-10"
            >
              <div className="flex items-center justify-between mb-6 border-b border-gray-200/50 pb-4">
                <h2 className="text-xl font-black text-gray-800 uppercase tracking-wider">
                  {editingSale ? 'Edit Sale Entry' : 'Log New Sale'}
                </h2>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full bg-[#eef2f6] clay-inset rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none placeholder-gray-400 font-bold"
                    placeholder="e.g. Acme Corp"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Product / Service Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    className="w-full bg-[#eef2f6] clay-inset rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none placeholder-gray-400 font-bold"
                    placeholder="e.g. SEO Campaign"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Sale Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.saleAmount}
                    onChange={(e) => setFormData({ ...formData, saleAmount: e.target.value })}
                    className="w-full bg-[#eef2f6] clay-inset rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none placeholder-gray-400 font-bold text-emerald-600"
                    placeholder="e.g. 15000"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Additional Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full bg-[#eef2f6] clay-inset rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none placeholder-gray-400 font-bold resize-none"
                    placeholder="Payment method, milestones, etc..."
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200/50 mt-6 justify-end">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-5 py-3 clay-flat hover:clay-inset rounded-xl text-xs font-bold uppercase tracking-wider text-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:scale-[1.02] transition-all"
                  >
                    <Save size={16} />
                    {editingSale ? 'Save Changes' : 'Record Sale'}
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

export default SalesTeam;
