import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, Plus, IndianRupee, CreditCard, Filter, Edit2, Trash2, Download, ChevronDown } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  getWalletTransactions, 
  addWalletTransaction, 
  updateWalletTransaction, 
  deleteWalletTransaction,
  getAllClients,
  getAllOldClients
} from '../api';

const WalletPage = () => {
  const [searchParams] = useSearchParams();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState(searchParams.get('filter') || 'all');

  useEffect(() => {
    const filterFromUrl = searchParams.get('filter');
    if (filterFromUrl) {
      setFilterType(filterFromUrl);
    }
  }, [searchParams]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    source: 'client_payment',
    name: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    mode: 'online',
    method: 'phonepe',
    utrNumber: '',
    description: '',
  });

  const [editingTransaction, setEditingTransaction] = useState(null);
  const [pendingDues, setPendingDues] = useState(0);
  const [allClientsList, setAllClientsList] = useState([]);
  const [allOldClientsList, setAllOldClientsList] = useState([]);
  const [isDownloadDropdownOpen, setIsDownloadDropdownOpen] = useState(false);

  const pendingClientsList = useMemo(() => {
    const list = [];
    allClientsList.forEach(c => {
      const pending = parseFloat(c.pendingAmount || 0);
      if (pending > 0) {
        list.push({
          _id: c._id || c.id,
          name: c.name,
          phone: c.phone || '',
          email: c.email || '',
          type: 'New Client',
          totalAmount: c.totalPrice || 0,
          paidAmount: c.paidAmount || 0,
          pendingAmount: pending
        });
      }
    });
    allOldClientsList.forEach(c => {
      const total = parseFloat(c.totalAmount || 0);
      const paid = parseFloat(c.paidAmount || 0);
      const pending = total - paid;
      if (pending > 0) {
        list.push({
          _id: c._id || c.id,
          name: c.name,
          phone: c.phone || '',
          email: c.email || '',
          type: 'Old Client',
          totalAmount: total,
          paidAmount: paid,
          pendingAmount: pending
        });
      }
    });
    return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [allClientsList, allOldClientsList]);

  const filteredTransactions = useMemo(() => {
    if (filterType === 'client_payment') {
      return transactions.filter(t => t.type === 'client_payment' || t.type === 'income' || t.source === 'client_payment');
    }
    if (filterType === 'expense') {
      return transactions.filter(t => t.type === 'salary' || t.type === 'other_expenses' || t.source === 'salary' || t.source === 'other_expenses');
    }
    if (filterType === 'salary') {
      return transactions.filter(t => t.type === 'salary' || t.source === 'salary');
    }
    if (filterType === 'other_expenses') {
      return transactions.filter(t => t.type === 'other_expenses' || t.source === 'other_expenses');
    }
    return transactions;
  }, [transactions, filterType]);

  const totalIncome = useMemo(() => {
    return (transactions || [])
      .filter(t => t.type === 'client_payment' || t.type === 'income' || t.source === 'client_payment')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return (transactions || [])
      .filter(t => t.type === 'salary' || t.type === 'other_expenses' || t.source === 'salary' || t.source === 'other_expenses')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  }, [transactions]);

  const getClientPhone = (t) => {
    if (t.referenceId) {
      const match = allClientsList.find(c => c._id === t.referenceId || c.id === t.referenceId) ||
                    allOldClientsList.find(c => c._id === t.referenceId || c.id === t.referenceId);
      if (match) return match.phone || '';
    }
    const tName = (t.name || '').trim().toLowerCase();
    if (tName) {
      const match = allClientsList.find(c => (c.name || '').trim().toLowerCase() === tName) ||
                    allOldClientsList.find(c => (c.name || '').trim().toLowerCase() === tName);
      if (match) return match.phone || '';
    }
    return '';
  };

  const downloadCSV = (filename, headers, rows) => {
    const csvRows = [
      headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','),
      ...rows.map(row => row.map(val => {
        const str = String(val === null || val === undefined ? '' : val);
        return `"${str.replace(/"/g, '""')}"`;
      }).join(','))
    ];
    const csvContent = '\uFEFF' + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadIncomeReport = () => {
    const incomeTx = transactions.filter(t => t.type === 'client_payment' || t.type === 'income' || t.source === 'client_payment');
    const sorted = [...incomeTx].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    const headers = ['Client/Income Name', 'Phone Number', 'Amount', 'Date', 'Mode', 'Method', 'UTR Number', 'Description'];
    const rows = sorted.map(t => [
      t.name || '',
      getClientPhone(t),
      t.amount || 0,
      t.date ? new Date(t.date).toLocaleDateString('en-IN') : '',
      t.mode || '',
      t.method || '',
      t.utrNumber || '',
      t.description || ''
    ]);
    downloadCSV('total_income_report.csv', headers, rows);
  };

  const downloadExpenseReport = () => {
    const expenseTx = transactions.filter(t => t.type === 'salary' || t.type === 'other_expenses' || t.source === 'salary' || t.source === 'other_expenses');
    const sorted = [...expenseTx].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    const headers = ['Payee/Expense Name', 'Amount', 'Date', 'Mode', 'Method', 'UTR Number', 'Description'];
    const rows = sorted.map(t => [
      t.name || '',
      t.amount || 0,
      t.date ? new Date(t.date).toLocaleDateString('en-IN') : '',
      t.mode || '',
      t.method || '',
      t.utrNumber || '',
      t.description || ''
    ]);
    downloadCSV('total_expense_report.csv', headers, rows);
  };

  const downloadPendingDuesReport = () => {
    const pendingClients = [];
    allClientsList.forEach(c => {
      const pending = parseFloat(c.pendingAmount || 0);
      if (pending > 0) {
        pendingClients.push({
          name: c.name,
          phone: c.phone || '',
          email: c.email || '',
          type: 'New Client',
          totalAmount: c.totalPrice || 0,
          paidAmount: c.paidAmount || 0,
          pendingAmount: pending
        });
      }
    });
    allOldClientsList.forEach(c => {
      const total = parseFloat(c.totalAmount || 0);
      const paid = parseFloat(c.paidAmount || 0);
      const pending = total - paid;
      if (pending > 0) {
        pendingClients.push({
          name: c.name,
          phone: c.phone || '',
          email: c.email || '',
          type: 'Old Client',
          totalAmount: total,
          paidAmount: paid,
          pendingAmount: pending
        });
      }
    });
    pendingClients.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    const headers = ['Client Name', 'Phone Number', 'Email', 'Client Type', 'Total Amount', 'Paid Amount', 'Pending Dues'];
    const rows = pendingClients.map(c => [
      c.name || '',
      c.phone || '',
      c.email || '',
      c.type,
      c.totalAmount,
      c.paidAmount,
      c.pendingAmount
    ]);
    downloadCSV('pending_dues_report.csv', headers, rows);
  };

  const fetchPendingDues = async () => {
    try {
      const [newClientsRes, oldClientsRes] = await Promise.all([
        getAllClients(),
        getAllOldClients()
      ]);
      
      let totalPending = 0;
      if (newClientsRes.success && Array.isArray(newClientsRes.data)) {
        setAllClientsList(newClientsRes.data);
        newClientsRes.data.forEach(client => {
          totalPending += parseFloat(client.pendingAmount || 0);
        });
      }
      if (oldClientsRes.success && Array.isArray(oldClientsRes.data)) {
        setAllOldClientsList(oldClientsRes.data);
        oldClientsRes.data.forEach(client => {
          const clientPending = parseFloat(client.totalAmount || 0) - parseFloat(client.paidAmount || 0);
          if (clientPending > 0) {
            totalPending += clientPending;
          }
        });
      }
      setPendingDues(totalPending);
    } catch (error) {
      console.error('Error fetching pending dues:', error);
    }
  };

  const editUtrTrimmed = (editingTransaction?.utrNumber || '').trim();
  const isEditUtrInvalid = editingTransaction?.mode === 'online' && (editUtrTrimmed.length < 12 || editUtrTrimmed.length > 16);
  const showEditUtrError = editingTransaction?.mode === 'online' && editingTransaction?.utrNumber !== '' && (editUtrTrimmed.length < 12 || editUtrTrimmed.length > 16);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const utrTrimmed = (newTransaction.utrNumber || '').trim();
  const isUtrInvalid = newTransaction.mode === 'online' && (utrTrimmed.length < 12 || utrTrimmed.length > 16);
  const showUtrError = newTransaction.mode === 'online' && newTransaction.utrNumber !== '' && (utrTrimmed.length < 12 || utrTrimmed.length > 16);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const result = await getWalletTransactions('all');
      if (result.success) {
        setTransactions(result.data);
      }
      await fetchPendingDues();
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeChartConfig = useMemo(() => {
    if (filterType === 'client_payment') {
      return {
        title: 'Income Trajectory',
        label: 'Total Cumulative Income',
        strokeColor: '#10b981',
        gradientId: 'colorIncome',
        stopColor: '#10b981',
        value: totalIncome,
        valueColor: 'text-emerald-600 dark:text-emerald-400'
      };
    }
    if (filterType === 'expense' || filterType === 'salary' || filterType === 'other_expenses') {
      return {
        title: 'Expense Trajectory',
        label: 'Total Cumulative Expense',
        strokeColor: '#f43f5e',
        gradientId: 'colorExpense',
        stopColor: '#f43f5e',
        value: totalExpense,
        valueColor: 'text-rose-600 dark:text-rose-400'
      };
    }
    if (filterType === 'pending_dues') {
      return {
        title: 'Pending Dues Breakdown',
        label: 'Total Pending Dues',
        strokeColor: '#f59e0b',
        gradientId: 'colorPending',
        stopColor: '#f59e0b',
        value: pendingDues,
        valueColor: 'text-amber-600 dark:text-amber-400'
      };
    }
    return {
      title: 'Balance Trajectory',
      label: 'Current Balance',
      strokeColor: '#3b82f6',
      gradientId: 'colorBalance',
      stopColor: '#3b82f6',
      value: (totalIncome - totalExpense) || 0,
      valueColor: 'text-gray-900 dark:text-white'
    };
  }, [filterType, totalIncome, totalExpense, pendingDues]);

  const chartData = useMemo(() => {
    if (filterType === 'pending_dues') {
      if (!pendingClientsList || pendingClientsList.length === 0) return [];
      let runningPending = 0;
      return pendingClientsList.map(c => {
        runningPending += c.pendingAmount;
        return {
          date: c.name.length > 10 ? c.name.substring(0, 10) + '...' : c.name,
          fullName: c.name,
          balance: runningPending,
          amount: c.pendingAmount,
          type: 'Pending Due',
          name: c.name
        };
      });
    }

    if (!transactions || transactions.length === 0) return [];
    
    // Sort chronologically (oldest first)
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (filterType === 'client_payment') {
      const incomeOnly = sorted.filter(t => t.type === 'client_payment' || t.type === 'income' || t.source === 'client_payment');
      let cumulativeIncome = 0;
      return incomeOnly.map(t => {
        cumulativeIncome += t.amount;
        return {
          date: new Date(t.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
          fullName: t.name,
          balance: cumulativeIncome,
          amount: t.amount,
          type: 'Income',
          name: t.name
        };
      });
    }

    if (filterType === 'expense' || filterType === 'salary' || filterType === 'other_expenses') {
      let expenseOnly = sorted.filter(t => t.type === 'salary' || t.type === 'other_expenses' || t.source === 'salary' || t.source === 'other_expenses');
      if (filterType === 'salary') expenseOnly = sorted.filter(t => t.type === 'salary' || t.source === 'salary');
      if (filterType === 'other_expenses') expenseOnly = sorted.filter(t => t.type === 'other_expenses' || t.source === 'other_expenses');
      
      let cumulativeExpense = 0;
      return expenseOnly.map(t => {
        cumulativeExpense += t.amount;
        return {
          date: new Date(t.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
          fullName: t.name,
          balance: cumulativeExpense,
          amount: t.amount,
          type: 'Expense',
          name: t.name
        };
      });
    }

    let runningBalance = 0;
    return sorted.map((t) => {
      const isIncome = t.type === 'client_payment' || t.type === 'income' || t.source === 'client_payment';
      if (isIncome) {
        runningBalance += t.amount;
      } else {
        runningBalance -= t.amount;
      }
      return {
        date: new Date(t.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        fullName: t.name,
        balance: runningBalance,
        amount: t.amount,
        type: isIncome ? 'Income' : 'Expense',
        name: t.name
      };
    });
  }, [transactions, filterType, pendingClientsList]);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (newTransaction.mode === 'online') {
      const utrVal = (newTransaction.utrNumber || '').trim();
      if (!utrVal || utrVal.length < 12 || utrVal.length > 16) {
        alert('Error: UTR number must be between 12 and 16 characters.');
        return;
      }
    }
    try {
      const payload = {
        ...newTransaction,
        type: newTransaction.source,
        amount: parseFloat(newTransaction.amount),
      };
      if (payload.mode === 'cash') {
        payload.method = 'cash';
        delete payload.utrNumber;
      }
      const result = await addWalletTransaction(payload);
      if (result.success) {
        setIsAddModalOpen(false);
        setNewTransaction({
          source: 'client_payment',
          name: '',
          amount: '',
          date: new Date().toISOString().split('T')[0],
          mode: 'online',
          method: 'phonepe',
          utrNumber: '',
          description: '',
        });
        fetchTransactions();
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleOpenEditModal = (transaction) => {
    const formattedDate = new Date(transaction.date).toISOString().split('T')[0];
    setEditingTransaction({
      ...transaction,
      date: formattedDate,
      utrNumber: transaction.utrNumber || '',
    });
  };

  const handleUpdateTransaction = async (e) => {
    e.preventDefault();
    if (editingTransaction.mode === 'online') {
      const utrVal = (editingTransaction.utrNumber || '').trim();
      if (!utrVal || utrVal.length < 12 || utrVal.length > 16) {
        alert('Error: UTR number must be between 12 and 16 characters.');
        return;
      }
    }
    try {
      const payload = {
        ...editingTransaction,
        type: editingTransaction.source,
        amount: parseFloat(editingTransaction.amount),
      };
      if (payload.mode === 'cash') {
        payload.method = 'cash';
        payload.utrNumber = '';
      }
      const result = await updateWalletTransaction(editingTransaction._id, payload);
      if (result.success) {
        setEditingTransaction(null);
        fetchTransactions();
      } else {
        alert(result.message || 'Failed to update transaction');
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('Error updating transaction');
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      const result = await deleteWalletTransaction(id);
      if (result.success) {
        fetchTransactions();
      } else {
        alert(result.message || 'Failed to delete transaction');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Error deleting transaction');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatMethod = (method) => {
    const methods = {
      phonepe: 'PhonePe',
      paytm: 'Paytm',
      google_pay: 'Google Pay',
      bank_transfer: 'Bank Transfer',
      cash: 'Cash',
    };
    return methods[method] || method;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <section>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
              Wallet
            </h1>
            <p className="text-gray-500 font-medium">
              Manage all your transactions and payments
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Download CSV Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setIsDownloadDropdownOpen(prev => !prev)}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all cursor-pointer"
              >
                <Download size={18} />
                <span>Download CSV</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${isDownloadDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDownloadDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDownloadDropdownOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl z-50 p-2 space-y-1 bg-white dark:bg-gray-900"
                  >
                    <button
                      onClick={() => {
                        downloadIncomeReport();
                        setIsDownloadDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors"
                    >
                      <IndianRupee size={16} className="text-emerald-500" />
                      <span>Total Income CSV</span>
                    </button>

                    <button
                      onClick={() => {
                        downloadExpenseReport();
                        setIsDownloadDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 transition-colors"
                    >
                      <CreditCard size={16} className="text-rose-500" />
                      <span>Total Expense CSV</span>
                    </button>

                    <button
                      onClick={() => {
                        downloadPendingDuesReport();
                        setIsDownloadDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-600 transition-colors"
                    >
                      <Wallet size={16} className="text-amber-500" />
                      <span>Pending Dues CSV</span>
                    </button>
                  </motion.div>
                </>
              )}
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
            >
              <Plus size={20} />
              Add Transaction
            </button>
          </div>
        </motion.div>
      </section>

      {/* Overview Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Dynamic Trajectory Chart Card */}
        <div className="lg:col-span-2 glass rounded-3xl p-6 border border-gray-200/50 dark:border-white/5 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-gray-400 dark:text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
              {activeChartConfig.title}
            </h3>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-extrabold ${activeChartConfig.valueColor}`}>
                ₹{activeChartConfig.value.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-medium text-gray-400">{activeChartConfig.label}</span>
            </div>
          </div>
          
          <div className="h-48 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id={activeChartConfig.gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activeChartConfig.stopColor} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={activeChartConfig.stopColor} stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(229, 231, 235, 0.1)" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="glass p-4 rounded-xl border border-gray-200 dark:border-white/10 shadow-2xl backdrop-blur-md text-left">
                          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">{data.date}</p>
                          <p className="text-sm font-extrabold text-gray-900 dark:text-white mb-0.5">
                            {activeChartConfig.title.split(' ')[0]}: ₹{data.balance.toLocaleString('en-IN')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {data.fullName || data.name}: <span className={data.type === 'Income' ? 'text-emerald-500' : (data.type === 'Pending Due' ? 'text-amber-500' : 'text-rose-500')}>{data.type === 'Income' ? '+' : (data.type === 'Pending Due' ? '₹' : '-')}₹{data.amount}</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="balance" stroke={activeChartConfig.strokeColor} strokeWidth={2.5} fillOpacity={1} fill={`url(#${activeChartConfig.gradientId})`} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats Stack */}
        <div className="space-y-6 flex flex-col justify-between">
          {/* Income Card */}
          <button 
            type="button"
            onClick={() => setFilterType('client_payment')}
            title="Click to view total income list"
            className="w-full text-left bg-transparent border-0 outline-none p-0 cursor-pointer block"
          >
            <div className={`glass rounded-3xl p-6 border transition-all duration-300 flex items-center justify-between hover:scale-[1.02] hover:shadow-2xl ${
              filterType === 'client_payment'
                ? 'border-emerald-500 shadow-emerald-500/20 ring-2 ring-emerald-500'
                : 'border-gray-200/50 dark:border-white/5 shadow-xl'
            }`}>
              <div className="space-y-1">
                <span className="text-gray-400 dark:text-gray-500 text-xs font-semibold uppercase tracking-wider block">Total Income</span>
                <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 block">
                  ₹{(totalIncome || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                <IndianRupee className="text-white" size={24} />
              </div>
            </div>
          </button>

          {/* Expense Card */}
          <button 
            type="button"
            onClick={() => setFilterType('expense')}
            title="Click to view total expense list"
            className="w-full text-left bg-transparent border-0 outline-none p-0 cursor-pointer block"
          >
            <div className={`glass rounded-3xl p-6 border transition-all duration-300 flex items-center justify-between hover:scale-[1.02] hover:shadow-2xl ${
              filterType === 'expense'
                ? 'border-rose-500 shadow-rose-500/20 ring-2 ring-rose-500'
                : 'border-gray-200/50 dark:border-white/5 shadow-xl'
            }`}>
              <div className="space-y-1">
                <span className="text-gray-400 dark:text-gray-500 text-xs font-semibold uppercase tracking-wider block">Total Expense</span>
                <span className="text-2xl font-extrabold text-rose-600 block">
                  ₹{(totalExpense || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 flex items-center justify-center">
                <CreditCard className="text-white" size={24} />
              </div>
            </div>
          </button>

          {/* Pending Dues Card */}
          <button 
            type="button"
            onClick={() => setFilterType('pending_dues')}
            title="Click to view pending dues client list"
            className="w-full text-left bg-transparent border-0 outline-none p-0 cursor-pointer block"
          >
            <div className={`glass rounded-3xl p-6 border transition-all duration-300 flex items-center justify-between hover:scale-[1.02] hover:shadow-2xl ${
              filterType === 'pending_dues'
                ? 'border-amber-500 shadow-amber-500/20 ring-2 ring-amber-500'
                : 'border-gray-200/50 dark:border-white/5 shadow-xl'
            }`}>
              <div className="space-y-1">
                <span className="text-gray-400 dark:text-gray-500 text-xs font-semibold uppercase tracking-wider block">Pending Dues</span>
                <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 block">
                  ₹{(pendingDues || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center">
                <Wallet className="text-white" size={24} />
              </div>
            </div>
          </button>
        </div>
      </section>


      {/* Filters */}
      <div className="flex items-center gap-4">
        <Filter size={20} className="text-gray-500" />
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All' },
            { id: 'client_payment', label: 'Total Income' },
            { id: 'expense', label: 'Total Expense' },
            { id: 'salary', label: 'Salary' },
            { id: 'other_expenses', label: 'Other Expenses' },
            { id: 'pending_dues', label: 'Pending Dues' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterType(item.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterType === item.id
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold shadow-sm'
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <section className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          {filterType === 'pending_dues' ? (
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Client Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Phone Number</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Client Type</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Total Price</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Paid Amount</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Pending Dues</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">Loading pending dues...</td>
                  </tr>
                ) : pendingClientsList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">No pending dues found</td>
                  </tr>
                ) : (
                  pendingClientsList.map((client) => (
                    <tr key={client._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{client.name}</td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{client.phone || '-'}</td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{client.email || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          client.type === 'New Client'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                          {client.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-white">₹{client.totalAmount.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4 text-right font-bold text-emerald-600">₹{client.paidAmount.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4 text-right font-extrabold text-rose-600">₹{client.pendingAmount.toLocaleString('en-IN')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Mode</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Method</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">UTR</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">Loading transactions...</td>
                  </tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">No transactions yet</td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 dark:text-white">{transaction.name}</div>
                        {transaction.description && (
                          <div className="text-sm text-gray-500">{transaction.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          transaction.source === 'client_payment'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                        }`}>
                          {transaction.source === 'client_payment'
                            ? 'Income'
                            : transaction.source === 'salary'
                            ? 'Salary Expense'
                            : 'Other Expense'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-bold ${
                          transaction.source === 'client_payment' ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                          {transaction.source === 'client_payment' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{formatDate(transaction.date)}</td>
                      <td className="px-6 py-4"><span className="capitalize text-gray-700 dark:text-gray-300">{transaction.mode}</span></td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{formatMethod(transaction.method)}</td>
                      <td className="px-6 py-4 text-gray-500 font-mono">{transaction.utrNumber || '-'}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(transaction)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-450 dark:hover:bg-white/10 rounded-lg transition-colors"
                            title="Edit Transaction"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteTransaction(transaction._id)}
                            className="p-2 text-rose-600 hover:bg-rose-50 dark:text-rose-455 dark:hover:bg-white/10 rounded-lg transition-colors"
                            title="Delete Transaction"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Add Transaction Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsAddModalOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative glass p-6 sm:p-8 rounded-2xl max-w-md w-full mx-auto max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 shrink-0">
              Add Transaction
            </h2>
            <form onSubmit={handleAddTransaction} className="flex-1 flex flex-col min-h-0">
              <div className="space-y-4 overflow-y-auto pr-1 flex-1 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    value={newTransaction.source}
                    onChange={(e) => setNewTransaction({ ...newTransaction, source: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                  >
                    <option value="client_payment" className="text-gray-900 dark:bg-gray-800 dark:text-white">Client Payment</option>
                    <option value="salary" className="text-gray-900 dark:bg-gray-800 dark:text-white">Salary Payment</option>
                    <option value="other_expenses" className="text-gray-900 dark:bg-gray-800 dark:text-white">Other Expenses</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {newTransaction.source === 'other_expenses' ? 'Expense Name / Payee' : 'Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newTransaction.name}
                    onChange={(e) => setNewTransaction({ ...newTransaction, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                    placeholder={newTransaction.source === 'other_expenses' ? 'e.g., Office Rent, Internet' : 'e.g., John Doe'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    required
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mode
                  </label>
                  <select
                    value={newTransaction.mode}
                    onChange={(e) => setNewTransaction({ ...newTransaction, mode: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                  >
                    <option value="online" className="text-gray-900 dark:bg-gray-800 dark:text-white">Online</option>
                    <option value="cash" className="text-gray-900 dark:bg-gray-800 dark:text-white">Cash</option>
                  </select>
                </div>
                {newTransaction.mode === 'online' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Method
                      </label>
                      <select
                        value={newTransaction.method}
                        onChange={(e) => setNewTransaction({ ...newTransaction, method: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                      >
                        <option value="phonepe" className="text-gray-900 dark:bg-gray-800 dark:text-white">PhonePe</option>
                        <option value="paytm" className="text-gray-900 dark:bg-gray-800 dark:text-white">Paytm</option>
                        <option value="google_pay" className="text-gray-900 dark:bg-gray-800 dark:text-white">Google Pay</option>
                        <option value="bank_transfer" className="text-gray-900 dark:bg-gray-800 dark:text-white">Bank Transfer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        UTR Number
                      </label>
                      <input
                        type="text"
                        value={newTransaction.utrNumber}
                        onChange={(e) => setNewTransaction({ ...newTransaction, utrNumber: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border text-gray-900 dark:text-white ${
                          showUtrError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-white/10'
                        }`}
                        placeholder="e.g., 123456789012"
                      />
                      {showUtrError && (
                        <p className="text-[11px] text-red-500 font-semibold mt-1">
                          UTR number must be between 12 and 16 characters. (Current length: {utrTrimmed.length})
                        </p>
                      )}
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                    placeholder={newTransaction.source === 'other_expenses' ? 'e.g., Office maintenance, software licenses' : 'e.g., June salary'}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-white/10 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUtrInvalid}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all ${
                    isUtrInvalid
                      ? 'bg-gray-300 dark:bg-white/10 text-gray-500 dark:text-gray-400 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/20 hover:shadow-blue-500/30'
                  }`}
                >
                  Add Transaction
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Transaction Modal */}
      {editingTransaction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setEditingTransaction(null)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative glass p-6 sm:p-8 rounded-2xl max-w-md w-full mx-auto max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 shrink-0">
              Edit Transaction
            </h2>
            <form onSubmit={handleUpdateTransaction} className="flex-1 flex flex-col min-h-0">
              <div className="space-y-4 overflow-y-auto pr-1 flex-1 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type
                  </label>
                  {editingTransaction.source === 'client_payment' ? (
                    <div className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 font-semibold">
                      Client Payment (Income)
                    </div>
                  ) : (
                    <select
                      value={editingTransaction.source}
                      onChange={(e) => setEditingTransaction({ ...editingTransaction, source: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                    >
                      <option value="salary" className="text-gray-900 dark:bg-gray-800 dark:text-white">Salary Payment</option>
                      <option value="other_expenses" className="text-gray-900 dark:bg-gray-800 dark:text-white">Other Expenses</option>
                      <option value="income" className="text-gray-900 dark:bg-gray-800 dark:text-white">Other Income</option>
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {editingTransaction.source === 'client_payment' ? 'Client Name (Read-Only)' : editingTransaction.source === 'other_expenses' ? 'Expense Name / Payee' : 'Name'}
                  </label>
                  <input
                    type="text"
                    required
                    disabled={editingTransaction.source === 'client_payment'}
                    value={editingTransaction.name}
                    onChange={(e) => setEditingTransaction({ ...editingTransaction, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white disabled:opacity-60"
                    placeholder="e.g., John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    required
                    value={editingTransaction.amount}
                    onChange={(e) => setEditingTransaction({ ...editingTransaction, amount: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={editingTransaction.date}
                    onChange={(e) => setEditingTransaction({ ...editingTransaction, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mode
                  </label>
                  <select
                    value={editingTransaction.mode}
                    onChange={(e) => setEditingTransaction({ ...editingTransaction, mode: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                  >
                    <option value="online" className="text-gray-900 dark:bg-gray-800 dark:text-white">Online</option>
                    <option value="cash" className="text-gray-900 dark:bg-gray-800 dark:text-white">Cash</option>
                  </select>
                </div>
                {editingTransaction.mode === 'online' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Method
                      </label>
                      <select
                        value={editingTransaction.method}
                        onChange={(e) => setEditingTransaction({ ...editingTransaction, method: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                      >
                        <option value="phonepe" className="text-gray-900 dark:bg-gray-800 dark:text-white">PhonePe</option>
                        <option value="paytm" className="text-gray-900 dark:bg-gray-800 dark:text-white">Paytm</option>
                        <option value="google_pay" className="text-gray-900 dark:bg-gray-800 dark:text-white">Google Pay</option>
                        <option value="bank_transfer" className="text-gray-900 dark:bg-gray-800 dark:text-white">Bank Transfer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        UTR Number
                      </label>
                      <input
                        type="text"
                        value={editingTransaction.utrNumber}
                        onChange={(e) => setEditingTransaction({ ...editingTransaction, utrNumber: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border text-gray-900 dark:text-white ${
                          showEditUtrError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-white/10'
                        }`}
                        placeholder="e.g., 123456789012"
                      />
                      {showEditUtrError && (
                        <p className="text-[11px] text-red-500 font-semibold mt-1">
                          UTR number must be between 12 and 16 characters. (Current length: {editUtrTrimmed.length})
                        </p>
                      )}
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingTransaction.description || ''}
                    onChange={(e) => setEditingTransaction({ ...editingTransaction, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                    placeholder="Enter description"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-white/10 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingTransaction(null)}
                  className="flex-1 px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditUtrInvalid}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all ${
                    isEditUtrInvalid
                      ? 'bg-gray-300 dark:bg-white/10 text-gray-500 dark:text-gray-400 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/20 hover:shadow-blue-500/30'
                  }`}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default WalletPage;
