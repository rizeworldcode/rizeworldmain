import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function DiwaliFestiveSplash({ onClose, duration = 2600 }) {
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

  // Natural warm golden embers drifting like real phuljhadi sparks
  const embers = [
    { left: '15%', delay: 0.2, duration: 2.2, x: -15 },
    { left: '25%', delay: 0.5, duration: 2.5, x: 20 },
    { left: '35%', delay: 0.1, duration: 2.0, x: -10 },
    { left: '48%', delay: 0.6, duration: 2.4, x: 15 },
    { left: '55%', delay: 0.3, duration: 2.1, x: -25 },
    { left: '68%', delay: 0.7, duration: 2.3, x: 10 },
    { left: '78%', delay: 0.2, duration: 2.6, x: -15 },
    { left: '86%', delay: 0.4, duration: 2.0, x: 20 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.45, ease: 'easeInOut' } }}
      onClick={handleDismiss}
      className="fixed inset-0 z-[999999] flex items-center justify-center overflow-hidden bg-[#05020a] text-white select-none cursor-pointer"
    >
      {/* 1. EXPANDING RADIAL LIGHT WAVE — Starts small in center, expands big outward */}
      <motion.div
        initial={{ scale: 0.1, opacity: 1 }}
        animate={{ scale: [0.1, 1.6, 2.8], opacity: [1, 0.75, 0.25] }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] sm:w-[600px] h-[420px] sm:h-[600px] rounded-full bg-radial from-amber-400/40 via-orange-500/20 to-transparent blur-3xl pointer-events-none"
      />

      {/* Warm ambient background bloom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.8, 0.6] }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="absolute inset-0 bg-radial from-amber-950/30 via-[#0e051a]/80 to-[#05020a] pointer-events-none"
      />

      {/* Expanding subtle golden aura rings */}
      <motion.div
        initial={{ scale: 0.2, opacity: 0.8 }}
        animate={{ scale: 2.4, opacity: 0 }}
        transition={{ duration: 1.6, ease: 'easeOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-amber-300/40 pointer-events-none"
      />
      <motion.div
        initial={{ scale: 0.2, opacity: 0.6 }}
        animate={{ scale: 3.2, opacity: 0 }}
        transition={{ duration: 2.0, delay: 0.25, ease: 'easeOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-yellow-200/30 pointer-events-none"
      />

      {/* Floating Sparks / Embers rising naturally */}
      {embers.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 40, x: 0, scale: 0.4 }}
          animate={{
            opacity: [0, 0.9, 0],
            y: [-20, -180],
            x: [0, item.x],
            scale: [0.4, 1.2, 0.2],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
          style={{ left: item.left, bottom: '25%' }}
          className="absolute w-1.5 h-1.5 rounded-full bg-amber-200 shadow-[0_0_8px_#fde047] pointer-events-none"
        />
      ))}

      {/* Top Bar with Minimalist Skip Button */}
      <div className="absolute top-5 right-5 sm:top-7 sm:right-8 z-30">
        <button
          onClick={handleDismiss}
          className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-amber-300/20 text-amber-200/90 hover:text-white text-xs font-medium backdrop-blur-md transition-all shadow-sm active:scale-95"
          title="Press Esc or click anywhere to continue"
        >
          <span>Skip</span>
          <X size={13} className="group-hover:rotate-90 transition-transform duration-200" />
        </button>
      </div>

      {/* 2. MAIN CONTENT — STARTS FROM CENTER, GROWS BIG */}
      <motion.div
        initial={{ scale: 0.25, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{
          duration: 0.75,
          ease: [0.16, 1, 0.3, 1], // Smooth organic deceleration from center to full size
        }}
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-xl mx-auto"
      >
        {/* Subtle Top Traditional Salutation */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="text-amber-300/80 text-xs sm:text-sm font-medium tracking-[0.25em] uppercase mb-4 flex items-center gap-2 drop-shadow-sm"
        >
          <span className="w-6 h-[1px] bg-gradient-to-r from-transparent to-amber-300/60" />
          <span>शुभ दीपावली</span>
          <span className="w-6 h-[1px] bg-gradient-to-l from-transparent to-amber-300/60" />
        </motion.div>

        {/* RADIANT ARTISTIC DIYA (दीपक) */}
        <div className="relative mb-5 flex items-center justify-center">
          {/* Flame Ambient Halo Glow */}
          <motion.div
            animate={{
              scale: [1, 1.25, 0.98, 1.15, 1],
              opacity: [0.65, 0.9, 0.6, 0.85, 0.65],
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -top-12 w-32 sm:w-44 h-32 sm:h-44 rounded-full bg-radial from-amber-400/50 via-orange-500/30 to-transparent blur-2xl pointer-events-none"
          />

          <svg
            viewBox="0 0 180 130"
            className="w-36 sm:w-44 h-auto overflow-visible drop-shadow-[0_12px_28px_rgba(245,158,11,0.45)]"
          >
            <defs>
              <linearGradient id="naturalFlame" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="20%" stopColor="#fef08a" />
                <stop offset="55%" stopColor="#f59e0b" />
                <stop offset="85%" stopColor="#ea580c" />
                <stop offset="100%" stopColor="#b91c1c" />
              </linearGradient>

              <linearGradient id="warmTerracotta" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c2410c" />
                <stop offset="40%" stopColor="#9a3412" />
                <stop offset="80%" stopColor="#7c2d12" />
                <stop offset="100%" stopColor="#431407" />
              </linearGradient>

              <linearGradient id="brassGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="35%" stopColor="#f59e0b" />
                <stop offset="70%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>

            {/* Flickering Flame Body */}
            <motion.g
              animate={{
                scaleY: [1, 1.14, 0.96, 1.08, 1],
                scaleX: [1, 0.94, 1.04, 0.96, 1],
                rotate: [-1.2, 1.5, -1.8, 1.2, -1.2],
              }}
              transition={{
                duration: 1.1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ transformOrigin: '90px 72px' }}
            >
              {/* Outer Golden Flame */}
              <path
                d="M90 14 C104 38, 110 56, 102 70 C96 76, 84 76, 78 70 C70 56, 76 38, 90 14 Z"
                fill="url(#naturalFlame)"
              />
              {/* Inner Luminous Core */}
              <path
                d="M90 28 C98 44, 100 56, 96 66 C93 70, 87 70, 84 66 C80 56, 82 44, 90 28 Z"
                fill="#ffffff"
                opacity="0.9"
              />
            </motion.g>

            {/* Diya Clay Base */}
            <path
              d="M30 72 C42 106, 138 106, 150 72 C135 79, 110 83, 90 83 C70 83, 45 79, 30 72 Z"
              fill="url(#warmTerracotta)"
            />

            {/* Diya Rim */}
            <ellipse
              cx="90"
              cy="72"
              rx="60"
              ry="11"
              fill="#7c2d12"
              stroke="url(#brassGlow)"
              strokeWidth="2.5"
            />

            {/* Inner Oil Basin & Reflection */}
            <ellipse cx="90" cy="73" rx="46" ry="7.5" fill="#431407" />
            <ellipse cx="90" cy="73.5" rx="36" ry="4.5" fill="#f59e0b" opacity="0.45" />

            {/* Subtle Carved Dots on Rim */}
            <circle cx="55" cy="85" r="2.2" fill="#fde047" opacity="0.8" />
            <circle cx="72" cy="89" r="2.4" fill="#fde047" opacity="0.9" />
            <circle cx="90" cy="91" r="2.6" fill="#fde047" />
            <circle cx="108" cy="89" r="2.4" fill="#fde047" opacity="0.9" />
            <circle cx="125" cy="85" r="2.2" fill="#fde047" opacity="0.8" />
          </svg>
        </div>

        {/* HUMANIZED FESTIVE HEADLINE — Deep, Warm Gold */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-2.5"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
          }}
        >
          <span className="bg-gradient-to-r from-amber-100 via-amber-200 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_4px_30px_rgba(251,191,36,0.5)]">
            Happy Diwali
          </span>
        </motion.h1>

        {/* Hindi Greeting */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.42, duration: 0.5 }}
          className="text-amber-200/90 text-sm sm:text-base font-medium mb-3 tracking-wide"
        >
          दीपावली की हार्दिक शुभकामनाएं
        </motion.p>

        {/* Warm Heartfelt Wish — Genuine, Not Robotic */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.52, duration: 0.6 }}
          className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-md mx-auto mb-6 font-normal drop-shadow-sm"
        >
          May the warmth and divine light of this festival bring good health, peace, and endless prosperity to you and your loved ones.
        </motion.p>

        {/* Clean Signature with Official RizeWorld Logo */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/[0.04] border border-amber-300/15 backdrop-blur-md shadow-lg"
        >
          <img
            src="/images/logo_img.png"
            alt="RizeWorld"
            className="h-5 sm:h-6 w-auto object-contain brightness-125 contrast-110"
            onError={(e) => {
              // Graceful fallback if image path isn't loaded
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className="text-amber-200/70 text-xs font-medium">Family Wishes</span>
        </motion.div>
      </motion.div>

      {/* Slim Golden Countdown Line at the very bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          className="h-full bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 shadow-[0_0_10px_rgba(251,191,36,0.7)]"
        />
      </div>
    </motion.div>
  );
}
