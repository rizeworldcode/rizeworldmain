import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Plus, IndianRupee, CreditCard, Filter } from 'lucide-react';

const WalletPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
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

  useEffect(() => {
    fetchTransactions();
  }, [filterType]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const url = filterType === 'all'
        ? 'http://localhost:45000/api/transactions'
        : `http://localhost:45000/api/transactions?type=${filterType}`;
      const response = await fetch(url);
      const result = await response.json();
      if (result.success) {
        setTransactions(result.data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:45000/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTransaction,
          type: newTransaction.source,
          amount: parseFloat(newTransaction.amount),
        }),
      });
      const result = await response.json();
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

  const totalIncome = transactions
    .filter(t => t.type === 'client_payment' || t.type === 'income' || t.source === 'client_payment')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter(t => t.type === 'salary')
    .reduce((sum, t) => sum + t.amount, 0);

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
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
          >
            <Plus size={20} />
            Add Transaction
          </button>
        </motion.div>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-medium mb-1">Total Balance</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                ₹{(totalIncome - totalExpense).toLocaleString('en-IN')}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
              <Wallet className="text-white" size={24} />
            </div>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-medium mb-1">Total Income</p>
              <h3 className="text-3xl font-bold text-emerald-600">
                ₹{totalIncome.toLocaleString('en-IN')}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
              <IndianRupee className="text-white" size={24} />
            </div>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-medium mb-1">Total Expense</p>
              <h3 className="text-3xl font-bold text-rose-600">
                ₹{totalExpense.toLocaleString('en-IN')}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 flex items-center justify-center">
              <CreditCard className="text-white" size={24} />
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Filter size={20} className="text-gray-500" />
        <div className="flex gap-2">
          {['all', 'client_payment', 'salary'].map((source) => (
            <button
              key={source}
              onClick={() => setFilterType(source)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterType === source
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
            >
              {source === 'all' ? 'All' : source === 'client_payment' ? 'Client Payments' : 'Salary'}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <section className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Mode
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Method
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  UTR
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Loading transactions...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No transactions yet
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {transaction.name}
                      </div>
                      {transaction.description && (
                        <div className="text-sm text-gray-500">{transaction.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          transaction.source === 'client_payment'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                        }`}
                      >
                        {transaction.source === 'client_payment' ? 'income' : 'Expense'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-bold ${
                          transaction.source === 'client_payment' ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {transaction.source === 'client_payment' ? '+' : '-'}₹
                        {transaction.amount.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize text-gray-700 dark:text-gray-300">
                        {transaction.mode}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {formatMethod(transaction.method)}
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-mono">
                      {transaction.utrNumber || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add Transaction Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsAddModalOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative glass p-8 rounded-2xl max-w-md w-full mx-4"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Add Transaction
            </h2>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type
                </label>
                <select
                  value={newTransaction.source}
                  onChange={(e) => setNewTransaction({ ...newTransaction, source: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                >
                  <option value="client_payment">Client Payment</option>
                  <option value="salary">Salary Payment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={newTransaction.name}
                  onChange={(e) => setNewTransaction({ ...newTransaction, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
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
                  <option value="online">Online</option>
                  <option value="cash">Cash</option>
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
                      <option value="phonepe">PhonePe</option>
                      <option value="paytm">Paytm</option>
                      <option value="google_pay">Google Pay</option>
                      <option value="bank_transfer">Bank Transfer</option>
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
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                      placeholder="e.g., 123456789012"
                    />
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
                  placeholder="e.g., June salary"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/20"
                >
                  Add Transaction
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
