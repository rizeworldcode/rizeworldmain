import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ShieldAlert,
  RefreshCw
} from 'lucide-react';
import { BASE_URL } from '../../api';

const API_BASE = BASE_URL;

const PasswordGate = ({
  title = 'Confidential Page',
  subtitle = 'This page is confidential. Enter the admin password to gain access.',
  storageKey = 'admin_unlocked',
  icon: IconComponent = Lock,
  gradient = 'from-indigo-500 to-purple-600',
  buttonText,
  onUnlock
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE}/staff/salary-sheet/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (data.success) {
        if (storageKey) {
          sessionStorage.setItem(storageKey, 'true');
        }
        if (onUnlock) {
          onUnlock();
        }
      } else {
        setError(data.message || 'Incorrect password.');
        setShake(true);
        setTimeout(() => setShake(false), 600);
      }
    } catch {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        <motion.div
          animate={shake ? { x: [-12, 12, -10, 10, -6, 6, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl shadow-black/10 dark:shadow-black/40 border border-gray-100 dark:border-white/10 overflow-hidden"
        >
          <div className={`h-1.5 w-full bg-gradient-to-r ${gradient}`} />
          <div className="p-8 sm:p-10">
            <div className="flex justify-center mb-8">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg shadow-indigo-500/25`}>
                <IconComponent className="w-9 h-9 text-white" />
              </div>
            </div>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">{title}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Access Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="Enter security password"
                    className="w-full px-4 py-3.5 pr-12 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    autoFocus
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5 mt-2">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <p className="text-xs text-red-500">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button
                type="submit"
                disabled={loading || !password.trim()}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r ${gradient} text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Unlock className="w-4 h-4" />}
                {loading ? 'Verifying…' : (buttonText || `Unlock ${title}`)}
              </button>
            </form>
            <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6">🔒 Session automatically locks when you close the tab</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PasswordGate;
