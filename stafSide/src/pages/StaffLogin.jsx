import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, Eye, EyeOff, Loader2, Fingerprint, Sparkles, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  loginWithBiometrics, 
  getDeviceBiometricLabel, 
  isBiometricSupported,
  getStaffApiBase
} from '../biometricAuth';

const StaffLogin = ({ onLogin, onOpenDiwaliLanding }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [biometricLabel, setBiometricLabel] = useState('Fingerprint / Face ID');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setBiometricLabel(getDeviceBiometricLabel());
    (async () => {
      const supported = await isBiometricSupported();
      setBiometricSupported(supported);
    })();

    const savedId = localStorage.getItem('savedEmployeeId');
    if (savedId) {
      setEmployeeId(savedId);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const response = await fetch(`${getStaffApiBase()}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId, password })
      });

      const result = await response.json();
      if (result.success) {
        localStorage.setItem('staffToken', result.token);
        localStorage.setItem('staffInfo', JSON.stringify(result.data));
        if (employeeId) {
          localStorage.setItem('savedEmployeeId', employeeId.trim());
        }
        
        setTimeout(() => {
          onLogin();
        }, 400);
      } else {
        setError(result.message || 'Invalid Employee ID or Password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    setBiometricLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const result = await loginWithBiometrics(employeeId);
      if (result.success && result.token) {
        localStorage.setItem('staffToken', result.token);
        localStorage.setItem('staffInfo', JSON.stringify(result.data));
        if (result.data?.employeeId) {
          localStorage.setItem('savedEmployeeId', result.data.employeeId);
        }
        setSuccessMsg(`Welcome back, ${result.data?.name || 'Staff Member'}! Verifying...`);
        setTimeout(() => {
          onLogin();
        }, 500);
      } else {
        setError(result.message || 'Biometric authentication failed.');
      }
    } catch (err) {
      console.error('Biometric login error:', err);
      setError(err.message || 'Biometric authentication was cancelled or device is not yet registered.');
    } finally {
      setBiometricLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#030303] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Animated Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md z-10"
      >
        <div className="glass-card p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl relative overflow-hidden">
          <div className="text-center mb-6 relative z-10">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, delay: 0.2 }}
              className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 flex items-center justify-center p-2.5 rounded-3xl bg-white/[0.06] border border-white/10 shadow-2xl shadow-blue-500/15 backdrop-blur-xl"
            >
              <img 
                src="/rw-logo.png" 
                alt="RizeWorld Logo" 
                className="w-full h-full object-contain rounded-2xl drop-shadow-[0_10px_20px_rgba(59,130,246,0.35)]" 
              />
            </motion.div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Employee Portal</h2>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-widest">
              Fast Access & Attendance
            </p>
          </div>

          {/* 1-Tap Biometric Login Card (When WebAuthn Supported) */}
          {biometricSupported && (
            <div className="mb-6 relative z-10">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleBiometricLogin}
                disabled={biometricLoading || loading}
                className="w-full relative group overflow-hidden p-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-black shadow-xl shadow-teal-500/25 transition-all flex items-center justify-between cursor-pointer border border-emerald-400/30 disabled:opacity-60"
              >
                {/* Glow shimmer */}
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />

                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                    {biometricLoading ? (
                      <Loader2 size={24} className="animate-spin text-white" />
                    ) : (
                      <Fingerprint size={24} className="text-white drop-shadow" />
                    )}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs uppercase tracking-widest text-emerald-100 font-extrabold">Instant 1-Tap</span>
                      <Sparkles size={13} className="text-amber-300 animate-pulse" />
                    </div>
                    <div className="text-sm sm:text-base font-black tracking-tight leading-snug">
                      {biometricLoading ? 'Scanning Sensor...' : `${biometricLabel} Login`}
                    </div>
                  </div>
                </div>

                <div className="px-2.5 py-1 rounded-lg bg-white/20 text-[11px] font-black tracking-wider uppercase backdrop-blur-sm">
                  Tap 👆
                </div>
              </motion.button>

              <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-gray-200 dark:border-white/10" />
                <span className="flex-shrink mx-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Or Sign In With Password
                </span>
                <div className="flex-grow border-t border-gray-200 dark:border-white/10" />
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5 relative z-10">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Employee ID</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 rounded-2xl text-sm font-bold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="EX: RW-1001"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3.5 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 rounded-2xl text-sm font-bold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-500 text-xs font-bold"
                >
                  <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center text-white flex-shrink-0">!</div>
                  <span>{error}</span>
                </motion.div>
              )}

              {successMsg && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-500 text-xs font-bold"
                >
                  <ShieldCheck size={18} className="shrink-0" />
                  <span>{successMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || biometricLoading}
              className="w-full py-4 bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                'Sign In With Password'
              )}
            </motion.button>

            {onOpenDiwaliLanding && (
              <button
                type="button"
                onClick={onOpenDiwaliLanding}
                className="w-full mt-2 py-2.5 rounded-xl border border-amber-400/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span className="animate-bounce">🪔</span>
                <span>Watch Diwali Celebration Wish ✨</span>
              </button>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default StaffLogin;
