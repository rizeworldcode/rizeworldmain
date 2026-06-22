import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, User, Loader2 } from 'lucide-react';

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

const Particles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
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
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        const nextTimer = setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
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
  const [formData, setFormData] = useState({ email: '', password: '', remember: false });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 2000);
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

                {/* Right Side - Login Form */}
                <div
                  className="p-8 md:p-12 flex flex-col justify-center"
                >
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h2>
                    <p className="text-gray-500">Sign in to access the admin dashboard</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
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
                      <a href="#" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                        Forgot password?
                      </a>
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