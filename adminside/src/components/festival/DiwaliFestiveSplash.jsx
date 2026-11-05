import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

export default function DiwaliFestiveSplash({ onClose, duration = 2200 }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (onClose) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, duration]);

  const handleDismiss = (e) => {
    if (e) e.stopPropagation();
    if (onClose) onClose();
  };

  // Sparkles configuration for ambient floating lights
  const particles = [
    { top: '15%', left: '12%', size: 16, delay: 0.1, duration: 1.8 },
    { top: '22%', right: '14%', size: 20, delay: 0.3, duration: 2.2 },
    { top: '35%', left: '8%', size: 14, delay: 0.5, duration: 2.0 },
    { top: '40%', right: '10%', size: 18, delay: 0.2, duration: 2.4 },
    { top: '70%', left: '15%', size: 16, delay: 0.4, duration: 2.1 },
    { top: '75%', right: '16%', size: 22, delay: 0.6, duration: 1.9 },
    { top: '82%', left: '25%', size: 14, delay: 0.7, duration: 2.3 },
    { top: '85%', right: '28%', size: 16, delay: 0.3, duration: 2.0 },
    { top: '10%', left: '48%', size: 14, delay: 0.5, duration: 2.5 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.45, ease: 'easeInOut' } }}
      onClick={handleDismiss}
      className="fixed inset-0 z-[999999] flex flex-col items-center justify-center overflow-hidden bg-[#090514] text-white select-none cursor-pointer"
      style={{
        background: 'radial-gradient(ellipse at 50% 45%, #25103f 0%, #130724 45%, #080312 85%)'
      }}
    >
      {/* Decorative Golden Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] h-[550px] sm:h-[750px] bg-gradient-to-tr from-amber-500/15 via-yellow-500/20 to-orange-500/10 rounded-full blur-[110px] pointer-events-none animate-pulse-slow" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-amber-400/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Rotating Background Rangoli / Mandala Pattern */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[750px] h-[600px] sm:h-[750px] opacity-[0.06] pointer-events-none"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full stroke-amber-300 fill-none" strokeWidth="0.75">
          <circle cx="100" cy="100" r="95" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="75" />
          <circle cx="100" cy="100" r="55" />
          <circle cx="100" cy="100" r="35" strokeDasharray="2 2" />
          <circle cx="100" cy="100" r="15" />
          {[...Array(16)].map((_, i) => (
            <path
              key={i}
              d="M100 25 C115 50 115 70 100 85 C85 70 85 50 100 25 Z"
              transform={`rotate(${i * 22.5} 100 100)`}
            />
          ))}
          {[...Array(12)].map((_, i) => (
            <path
              key={`petal-${i}`}
              d="M100 5 C120 40 120 70 100 95 C80 70 80 40 100 5 Z"
              transform={`rotate(${i * 30} 100 100)`}
              strokeDasharray="1 2"
            />
          ))}
        </svg>
      </motion.div>

      {/* Hanging Festive Lanterns (Kandils) - Top Left & Right */}
      <motion.div
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 left-6 sm:left-14 origin-top pointer-events-none hidden sm:block opacity-85"
      >
        <div className="w-[1px] h-16 sm:h-24 bg-gradient-to-b from-amber-200/50 via-amber-400 to-amber-500 mx-auto" />
        <div className="w-12 h-16 relative">
          <svg viewBox="0 0 50 70" className="w-full h-full drop-shadow-[0_4px_12px_rgba(245,158,11,0.6)]">
            <polygon points="25,5 45,25 25,45 5,25" fill="#f59e0b" stroke="#fef08a" strokeWidth="1.5" />
            <polygon points="25,12 38,25 25,38 12,25" fill="#ea580c" />
            <circle cx="25" cy="25" r="5" fill="#fef08a" />
            {/* Tassels */}
            <line x1="15" y1="45" x2="12" y2="65" stroke="#f59e0b" strokeWidth="1.5" />
            <line x1="25" y1="45" x2="25" y2="68" stroke="#fbbf24" strokeWidth="2" />
            <line x1="35" y1="45" x2="38" y2="65" stroke="#f59e0b" strokeWidth="1.5" />
          </svg>
        </div>
      </motion.div>

      <motion.div
        animate={{ rotate: [3, -3, 3] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 right-6 sm:right-14 origin-top pointer-events-none hidden sm:block opacity-85"
      >
        <div className="w-[1px] h-20 sm:h-28 bg-gradient-to-b from-amber-200/50 via-amber-400 to-amber-500 mx-auto" />
        <div className="w-12 h-16 relative">
          <svg viewBox="0 0 50 70" className="w-full h-full drop-shadow-[0_4px_12px_rgba(245,158,11,0.6)]">
            <polygon points="25,5 45,25 25,45 5,25" fill="#f59e0b" stroke="#fef08a" strokeWidth="1.5" />
            <polygon points="25,12 38,25 25,38 12,25" fill="#ea580c" />
            <circle cx="25" cy="25" r="5" fill="#fef08a" />
            <line x1="15" y1="45" x2="12" y2="65" stroke="#f59e0b" strokeWidth="1.5" />
            <line x1="25" y1="45" x2="25" y2="68" stroke="#fbbf24" strokeWidth="2" />
            <line x1="35" y1="45" x2="38" y2="65" stroke="#f59e0b" strokeWidth="1.5" />
          </svg>
        </div>
      </motion.div>

      {/* Floating Sparkles & Light Particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.2, scale: 0.6 }}
          animate={{
            opacity: [0.2, 0.9, 0.2],
            scale: [0.7, 1.25, 0.7],
            y: [-4, 6, -4],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top: p.top,
            left: p.left,
            right: p.right,
          }}
          className="text-amber-300 pointer-events-none drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]"
        >
          <Sparkles size={p.size} />
        </motion.div>
      ))}

      {/* Top Bar with Dismiss / Skip Button */}
      <div className="absolute top-5 right-5 sm:top-7 sm:right-8 z-20 flex items-center gap-3">
        <button
          onClick={handleDismiss}
          className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-amber-300/30 text-amber-200 hover:text-white text-xs font-semibold backdrop-blur-md transition-all shadow-[0_2px_12px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95"
          title="Press Esc or click to skip"
        >
          <span>Skip</span>
          <X size={14} className="group-hover:rotate-90 transition-transform duration-200" />
        </button>
      </div>

      {/* Main Festive Content Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center text-center px-4 max-w-xl mx-auto"
      >
        {/* Festive Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-400/25 to-amber-500/20 border border-amber-400/40 text-amber-200 text-xs sm:text-sm font-bold tracking-widest uppercase mb-5 backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.2)]"
        >
          <span>✨</span>
          <span>शुभ दीपावली • FESTIVAL OF LIGHTS</span>
          <span>✨</span>
        </motion.div>

        {/* Traditional Radiant Glowing Diya (दीपक) */}
        <div className="relative mb-5 flex items-center justify-center">
          {/* Flame Halo & Light Glow */}
          <motion.div
            animate={{
              scale: [1, 1.25, 0.95, 1.15, 1],
              opacity: [0.65, 0.95, 0.6, 0.9, 0.65],
            }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -top-12 w-28 sm:w-36 h-28 sm:h-36 rounded-full bg-gradient-to-t from-orange-500/40 via-amber-400/50 to-yellow-200/30 blur-2xl pointer-events-none"
          />

          {/* SVG Handcrafted Diya */}
          <div className="relative w-36 sm:w-44 h-32 sm:h-36 flex items-center justify-center">
            <svg viewBox="0 0 160 140" className="w-full h-full overflow-visible drop-shadow-[0_10px_25px_rgba(245,158,11,0.45)]">
              {/* Outer Radiant Flame with flicker motion */}
              <motion.g
                animate={{
                  scaleY: [1, 1.12, 0.96, 1.08, 1],
                  scaleX: [1, 0.95, 1.04, 0.97, 1],
                  rotate: [-1, 1.5, -1.5, 1, -1],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{ transformOrigin: '80px 72px' }}
              >
                {/* Outermost flame layer */}
                <path
                  d="M80 12 C72 32, 60 50, 68 68 C72 76, 88 76, 92 68 C100 50, 88 32, 80 12 Z"
                  fill="url(#outerFlameGrad)"
                  filter="url(#flameGlow)"
                />
                {/* Middle flame layer */}
                <path
                  d="M80 22 C74 38, 66 52, 72 66 C75 72, 85 72, 88 66 C94 52, 86 38, 80 22 Z"
                  fill="url(#midFlameGrad)"
                />
                {/* Inner White-Hot Flame Core */}
                <path
                  d="M80 36 C76 46, 72 56, 75 64 C77 68, 83 68, 85 64 C88 56, 84 46, 80 36 Z"
                  fill="#ffffff"
                  opacity="0.95"
                />
              </motion.g>

              {/* Diya Clay Base with Gold/Terracotta Accents */}
              <defs>
                <linearGradient id="outerFlameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="35%" stopColor="#fbbf24" />
                  <stop offset="70%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
                <linearGradient id="midFlameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="40%" stopColor="#fef08a" />
                  <stop offset="85%" stopColor="#f59e0b" />
                </linearGradient>
                <linearGradient id="diyaBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d97706" />
                  <stop offset="25%" stopColor="#b45309" />
                  <stop offset="55%" stopColor="#78350f" />
                  <stop offset="100%" stopColor="#451a03" />
                </linearGradient>
                <linearGradient id="diyaRimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="20%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#fef08a" />
                  <stop offset="80%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#fde047" />
                </linearGradient>
                <filter id="flameGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Decorative Diya Lamp Base */}
              <path
                d="M20 72 C32 108, 128 108, 140 72 C125 78, 95 82, 80 82 C65 82, 35 78, 20 72 Z"
                fill="url(#diyaBodyGrad)"
                stroke="#d97706"
                strokeWidth="1.5"
              />

              {/* Diya Rim / Golden Edge */}
              <ellipse
                cx="80"
                cy="72"
                rx="60"
                ry="11"
                fill="#92400e"
                stroke="url(#diyaRimGrad)"
                strokeWidth="2.5"
              />
              {/* Inner Oil Glow Basin */}
              <ellipse
                cx="80"
                cy="73"
                rx="48"
                ry="7.5"
                fill="#451a03"
              />
              <ellipse
                cx="80"
                cy="73.5"
                rx="38"
                ry="5"
                fill="#f59e0b"
                opacity="0.35"
              />

              {/* Decorative Engravings on Diya */}
              <circle cx="50" cy="85" r="2.2" fill="#fef08a" />
              <circle cx="65" cy="89" r="2.5" fill="#fef08a" />
              <circle cx="80" cy="91" r="2.8" fill="#fef08a" />
              <circle cx="95" cy="89" r="2.5" fill="#fef08a" />
              <circle cx="110" cy="85" r="2.2" fill="#fef08a" />

              {/* Bottom Support Pedestal */}
              <path
                d="M66 102 C72 108, 88 108, 94 102 L98 107 C88 111, 72 111, 62 107 Z"
                fill="#b45309"
                stroke="#f59e0b"
                strokeWidth="1"
              />
            </svg>
          </div>
        </div>

        {/* Grand Festive Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-3"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif"
          }}
        >
          <span className="bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_4px_28px_rgba(251,191,36,0.55)]">
            Happy Diwali
          </span>
        </motion.h1>

        {/* Warm Heartfelt Festive Greeting */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-sm sm:text-base text-amber-100/90 leading-relaxed max-w-md mx-auto mb-6 font-normal drop-shadow-sm"
        >
          May the divine light of Diwali illuminate your days with immense prosperity, boundless joy, and continued success.
        </motion.p>

        {/* Company Signature */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-amber-950/40 border border-amber-400/20 backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-amber-200">
            Warm Wishes from <span className="text-amber-100 font-bold">RizeWorld</span>
          </span>
          <span className="text-amber-400">🪔</span>
        </motion.div>
      </motion.div>

      {/* Sleek Golden Countdown Progress Line at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 overflow-hidden">
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          className="h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]"
        />
      </div>
    </motion.div>
  );
}
