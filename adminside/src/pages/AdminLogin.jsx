import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, Loader2, KeyRound, ArrowLeft, CheckCircle } from 'lucide-react';
import { adminLoginNew, sendOtpToAdmin, verifyOtp, adminForgotPassword } from '../api';

const letters = [
  { char: 'R', color: '#EF4444' },
  { char: 'I', color: '#3B82F6' },
  { char: 'Z', color: '#8B5CF6' },
  { char: 'E', color: '#06B6D4' },
  { char: 'W', color: '#10B981' },
  { char: 'O', color: '#F97316' },
  { char: 'R', color: '#EC4899' },
  { char: 'L', color: '#F59E0B' },
  { char: 'D', color: '#7C3AED' },
];

const staticParticles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  size: ((i * 3) % 4) + 2, // 2 to 5 px
  x: (i * 17) % 100,       // Pre-spaced coordinates
  y: (i * 29) % 100,
  duration: 10 + (i * 7) % 15, // 10s to 25s
  delay: (i * 3) % 5,       // 0s to 5s delay
}));

const Particles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {staticParticles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gray-800/10"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

const IntroAnimation = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (currentIndex < letters.length) {
      const timer = setTimeout(() => {
        setVisible(false);
        const nextTimer = setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
          setVisible(true);
        }, 50);
        return () => clearTimeout(nextTimer);
      }, 200); // Super fast!
      return () => clearTimeout(timer);
    } else {
      const finalTimer = setTimeout(onComplete, 150);
      return () => clearTimeout(finalTimer);
    }
  }, [currentIndex, onComplete]);

  const currentLetter = letters[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }} // Super fast exit to login!
      className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200"
    >
      <Particles />
      <div className="relative w-full h-full flex items-center justify-center">
        {currentLetter && (
          <motion.div
            key={`letter-${currentIndex}`}
            initial={{
              opacity: 0,
              scale: 0.5,
            }}
            animate={{
              opacity: visible ? 1 : 0,
              scale: visible ? 1.6 : 1.9,
            }}
            transition={{
              duration: 0.1,
              ease: 'easeInOut',
            }}
            className="text-center"
          >
            <span
              className="text-[12rem] font-black tracking-widest"
              style={{
                color: currentLetter.color,
              }}
            >
              {currentLetter.char}
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const AdminLogin = ({ onLogin }) => {
  const [showIntro, setShowIntro] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(() => {
    const savedEmail = localStorage.getItem('adminEmail');
    return {
      email: savedEmail || '',
      password: '',
      remember: !!savedEmail
    };
  });

  // Forgot Password States
  const [forgotStep, setForgotStep] = useState('login'); // 'login', 'sendOtp', 'verifyOtp', 'resetPassword'
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const result = await adminLoginNew(formData.email, formData.password);
      if (result.success) {
        localStorage.setItem('adminToken', result.token);
        if (formData.remember) {
          localStorage.setItem('adminEmail', formData.email);
        } else {
          localStorage.removeItem('adminEmail');
        }
        onLogin(formData.email);
      } else {
        setError(result.message || 'Invalid email or password');
      }
    } catch (err) {
      console.error(err);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const result = await sendOtpToAdmin(formData.email);
      if (result.success) {
        setSuccess('OTP verification code sent to your email.');
        setForgotStep('verifyOtp');
      } else {
        setError(result.message || 'Admin not found with this email.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const result = await verifyOtp(formData.email, otp);
      if (result.success) {
        setSuccess('OTP verified successfully. Set your new password.');
        setForgotStep('resetPassword');
      } else {
        setError(result.message || 'Invalid or expired OTP.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to verify OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const result = await adminForgotPassword(formData.email, newPassword);
      if (result.success) {
        setSuccess('Password updated successfully. Please login with your new password.');
        setForgotStep('login');
        setNewPassword('');
        setConfirmPassword('');
        setOtp('');
      } else {
        setError(result.message || 'Password update failed.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 overflow-hidden">
      <Particles />
      
      <AnimatePresence mode="wait">
        {showIntro ? (
          <IntroAnimation key="intro" onComplete={() => setShowIntro(false)} />
        ) : (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }} // Instantly visible!
            className="min-h-screen flex items-center justify-center p-4"
          >
            <div className="w-full max-w-7xl">
              <div className="grid md:grid-cols-2 bg-white/70 backdrop-blur-3xl rounded-3xl border border-gray-200 shadow-2xl overflow-hidden min-h-[60vh]">
                {/* Left Side - Illustration */}
                <div
                  className="relative hidden md:flex items-center justify-center overflow-hidden"
                >
                  <img
                    src="/images/adminIMG.jpeg"
                    alt="Admin Illustration"
                    className="w-full h-[80vh] object-cover"
                  />
                </div>

                {/* Right Side - Forms */}
                <div
                  className="p-8 md:p-12 flex flex-col justify-center"
                >
                  {/* Alert banners */}
                  <AnimatePresence>
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-xl text-sm font-bold flex items-center gap-2"
                      >
                        <span>{error}</span>
                      </motion.div>
                    )}
                    {success && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-xl text-sm font-bold flex items-center gap-2"
                      >
                        <CheckCircle size={18} />
                        <span>{success}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* 1. Login Form */}
                  {forgotStep === 'login' && (
                    <>
                      <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h2>
                        <p className="text-gray-500">Sign in to access the admin dashboard</p>
                      </div>

                      <form onSubmit={handleLoginSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Admin Email</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                              placeholder="admin@rizeworld.com"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Password</label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              type={showPassword ? 'text' : 'password'}
                              required
                              value={formData.password}
                              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                              className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.remember}
                              onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                              className="w-4 h-4 rounded border-gray-300 bg-gray-50 text-blue-600 focus:ring-blue-500/20"
                            />
                            <span className="text-sm text-gray-600">Remember me</span>
                          </label>
                          <button 
                            type="button"
                            onClick={() => {
                              setError('');
                              setSuccess('');
                              setForgotStep('sendOtp');
                            }}
                            className="text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium"
                          >
                            Forgot password?
                          </button>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={loading}
                          className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-xl font-bold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <div className="flex items-center justify-center gap-2">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Signing in...
                            </div>
                          ) : (
                            'Sign In'
                          )}
                        </motion.button>
                      </form>
                    </>
                  )}

                  {/* 2. Forgot Password - Send OTP Form */}
                  {forgotStep === 'sendOtp' && (
                    <>
                      <div className="mb-8">
                        <button 
                          type="button" 
                          onClick={() => setForgotStep('login')} 
                          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors"
                        >
                          <ArrowLeft size={16} /> Back to Login
                        </button>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h2>
                        <p className="text-gray-500">Enter your email address and we'll send you an OTP code to verify.</p>
                      </div>

                      <form onSubmit={handleSendOtp} className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Admin Email</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                              placeholder="admin@rizeworld.com"
                            />
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={loading}
                          className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-xl font-bold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <div className="flex items-center justify-center gap-2">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Sending OTP...
                            </div>
                          ) : (
                            'Send Verification Code'
                          )}
                        </motion.button>
                      </form>
                    </>
                  )}

                  {/* 3. Forgot Password - Verify OTP Form */}
                  {forgotStep === 'verifyOtp' && (
                    <>
                      <div className="mb-8">
                        <button 
                          type="button" 
                          onClick={() => setForgotStep('sendOtp')} 
                          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors"
                        >
                          <ArrowLeft size={16} /> Change Email
                        </button>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify OTP</h2>
                        <p className="text-gray-500">We've sent a 4-digit code to <strong>{formData.email}</strong>. Enter it below.</p>
                      </div>

                      <form onSubmit={handleVerifyOtp} className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Verification Code</label>
                          <div className="relative">
                            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              type="text"
                              required
                              maxLength={4}
                              value={otp}
                              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 tracking-[0.5em] text-center font-bold text-xl"
                              placeholder="••••"
                            />
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={loading}
                          className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-xl font-bold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <div className="flex items-center justify-center gap-2">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Verifying...
                            </div>
                          ) : (
                            'Verify Code'
                          )}
                        </motion.button>
                      </form>
                    </>
                  )}

                  {/* 4. Forgot Password - Reset Password Form */}
                  {forgotStep === 'resetPassword' && (
                    <>
                      <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
                        <p className="text-gray-500">Please choose a secure new password for your admin account.</p>
                      </div>

                      <form onSubmit={handleResetPassword} className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">New Password</label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              type="password"
                              required
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                              placeholder="••••••••"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              type="password"
                              required
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                              placeholder="••••••••"
                            />
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={loading}
                          className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-xl font-bold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <div className="flex items-center justify-center gap-2">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Resetting Password...
                            </div>
                          ) : (
                            'Reset Password'
                          )}
                        </motion.button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLogin;