import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// 1. Hanging Traditional Lantern (Akashkandil) for top corners
function HangingLantern({ side = 'left', className = '' }) {
  return (
    <motion.div
      animate={{
        rotate: side === 'left' ? [-3, 3, -3] : [3, -3, 3],
      }}
      transition={{
        duration: 4.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{ transformOrigin: 'top center' }}
      className={`fixed top-0 ${side === 'left' ? 'left-3 sm:left-6' : 'right-3 sm:right-6'} z-40 pointer-events-none select-none flex flex-col items-center ${className}`}
    >
      {/* Hanging Chain/String from ceiling */}
      <div className="w-[1.5px] h-7 sm:h-11 bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-500 shadow-[0_0_6px_rgba(251,191,36,0.6)]" />

      {/* Traditional Glowing Paper Lantern Body */}
      <div className="relative flex flex-col items-center">
        {/* Warm Ambient Lantern Glow */}
        <div className="absolute inset-0 -inset-x-3 bg-radial from-amber-400/60 via-orange-500/25 to-transparent blur-md pointer-events-none rounded-full" />

        <svg width="42" height="72" viewBox="0 0 44 74" className="overflow-visible drop-shadow-[0_4px_16px_rgba(245,158,11,0.7)]">
          <defs>
            <linearGradient id={`staffLanternCap-${side}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id={`staffLanternGlow-${side}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
            <linearGradient id={`staffInnerCore-${side}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#fed7aa" />
            </linearGradient>
          </defs>

          {/* Top Cap */}
          <rect x="14" y="0" width="16" height="5" rx="2" fill={`url(#staffLanternCap-${side})`} />

          {/* Lantern Body */}
          <rect
            x="6"
            y="5"
            width="32"
            height="34"
            rx="10"
            fill={`url(#staffLanternGlow-${side})`}
            stroke="#fde047"
            strokeWidth="1.2"
          />

          {/* Glowing Core */}
          <rect
            x="14"
            y="11"
            width="16"
            height="22"
            rx="6"
            fill={`url(#staffInnerCore-${side})`}
            opacity="0.9"
          />

          {/* Bottom Cap */}
          <rect x="14" y="39" width="16" height="4" rx="1.5" fill={`url(#staffLanternCap-${side})`} />

          {/* Dangling Tassels */}
          <line x1="12" y1="43" x2="12" y2="65" stroke="#facc15" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="16" y1="43" x2="16" y2="71" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="20" y1="43" x2="20" y2="74" stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="24" y1="43" x2="24" y2="74" stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="28" y1="43" x2="28" y2="71" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="32" y1="43" x2="32" y2="65" stroke="#facc15" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </motion.div>
  );
}

// 2. Bottom-Left Glowing Clay Diya Widget with "SHUBH DIWALI" Badge
function BottomCornerDiya() {
  return (
    <div className="fixed bottom-3 sm:bottom-4 left-3 sm:left-6 z-40 select-none flex flex-col items-center pointer-events-auto group">
      {/* Flame Halo Light Bloom */}
      <motion.div
        animate={{
          scale: [1, 1.25, 0.95, 1.2, 1],
          opacity: [0.65, 0.95, 0.6, 0.9, 0.65],
        }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-6 w-16 h-16 rounded-full bg-radial from-amber-400/50 via-orange-500/25 to-transparent blur-md pointer-events-none"
      />

      {/* Glowing Diya Bowl */}
      <div className="relative w-13 sm:w-15 h-9 sm:h-10 flex items-center justify-center">
        <svg viewBox="0 0 70 52" className="w-full h-full overflow-visible drop-shadow-[0_4px_14px_rgba(245,158,11,0.6)]">
          <defs>
            <linearGradient id="staffCornerFlame" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="20%" stopColor="#fef08a" />
              <stop offset="60%" stopColor="#f59e0b" />
              <stop offset="90%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
            <linearGradient id="staffCornerClay" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="50%" stopColor="#9a3412" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>
            <linearGradient id="staffCornerRim" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>

          {/* Flickering Flame */}
          <motion.g
            animate={{
              scaleY: [1, 1.15, 0.95, 1.12, 1],
              scaleX: [1, 0.94, 1.04, 0.96, 1],
              rotate: [-1.5, 1.5, -2, 1, -1.5],
            }}
            transition={{
              duration: 1.1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: '35px 26px' }}
          >
            <path
              d="M 35 4 C 40 12, 42 19, 39 25 C 36 28, 34 28, 31 25 C 28 19, 30 12, 35 4 Z"
              fill="url(#staffCornerFlame)"
            />
            <path
              d="M 35 9 C 38 14, 39 19, 37 23 C 35 24, 34 24, 33 23 C 31 19, 32 14, 35 9 Z"
              fill="#ffffff"
              opacity="0.95"
            />
          </motion.g>

          {/* Clay Bowl Base */}
          <path
            d="M 12 26 C 16 42, 54 42, 58 26 C 51 30, 40 31, 35 31 C 30 31, 19 30, 12 26 Z"
            fill="url(#staffCornerClay)"
          />
          <ellipse cx="35" cy="26" rx="23" ry="5" fill="#78350f" stroke="url(#staffCornerRim)" strokeWidth="1.2" />
          <ellipse cx="35" cy="26.5" rx="17" ry="2.5" fill="#ea580c" opacity="0.75" />

          {/* Dotted Golden Ring Underneath */}
          <ellipse
            cx="35"
            cy="46"
            rx="20"
            ry="3.5"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="1.2"
            strokeDasharray="2 3"
            opacity="0.7"
          />
        </svg>
      </div>

      {/* "SHUBH DIWALI" Oval Pill Badge */}
      <div className="mt-1 px-3 py-0.5 rounded-full bg-[#fef7ee]/95 border border-amber-400/50 text-[#b45309] text-[9px] sm:text-[10px] font-extrabold tracking-[0.18em] uppercase shadow-md backdrop-blur-md flex items-center gap-1">
        <span>SHUBH DIWALI</span>
      </div>
    </div>
  );
}

// 3. Top Hanging Lights Wire Component
export function StaffTopLights() {
  const bulbs = [
    { color: '#facc15', shadow: 'rgba(250, 204, 21, 0.7)', delay: 0 },
    { color: '#f97316', shadow: 'rgba(249, 115, 22, 0.7)', delay: 0.3 },
    { color: '#06b6d4', shadow: 'rgba(6, 182, 212, 0.7)', delay: 0.6 },
    { color: '#f43f5e', shadow: 'rgba(244, 63, 94, 0.7)', delay: 0.2 },
    { color: '#10b981', shadow: 'rgba(16, 185, 129, 0.7)', delay: 0.8 },
    { color: '#fef08a', shadow: 'rgba(254, 240, 138, 0.7)', delay: 0.5 },
    { color: '#facc15', shadow: 'rgba(250, 204, 21, 0.7)', delay: 0.1 },
    { color: '#f97316', shadow: 'rgba(249, 115, 22, 0.7)', delay: 0.4 },
    { color: '#06b6d4', shadow: 'rgba(6, 182, 212, 0.7)', delay: 0.7 },
    { color: '#f43f5e', shadow: 'rgba(244, 63, 94, 0.7)', delay: 0.3 },
    { color: '#10b981', shadow: 'rgba(16, 185, 129, 0.7)', delay: 0.9 },
    { color: '#fef08a', shadow: 'rgba(254, 240, 138, 0.7)', delay: 0.2 },
    { color: '#facc15', shadow: 'rgba(250, 204, 21, 0.7)', delay: 0.5 },
    { color: '#f97316', shadow: 'rgba(249, 115, 22, 0.7)', delay: 0.8 },
    { color: '#06b6d4', shadow: 'rgba(6, 182, 212, 0.7)', delay: 0.2 },
    { color: '#f43f5e', shadow: 'rgba(244, 63, 94, 0.7)', delay: 0.6 },
    { color: '#10b981', shadow: 'rgba(16, 185, 129, 0.7)', delay: 0.4 },
    { color: '#fef08a', shadow: 'rgba(254, 240, 138, 0.7)', delay: 0.7 },
    { color: '#facc15', shadow: 'rgba(250, 204, 21, 0.7)', delay: 0.3 },
    { color: '#f97316', shadow: 'rgba(249, 115, 22, 0.7)', delay: 0.9 },
    { color: '#06b6d4', shadow: 'rgba(6, 182, 212, 0.7)', delay: 0.1 },
    { color: '#f43f5e', shadow: 'rgba(244, 63, 94, 0.7)', delay: 0.5 },
    { color: '#10b981', shadow: 'rgba(16, 185, 129, 0.7)', delay: 0.3 },
    { color: '#fef08a', shadow: 'rgba(254, 240, 138, 0.7)', delay: 0.6 },
  ];

  return (
    <>
      {/* Top Scalloped Hanging Wire across viewport */}
      <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none select-none overflow-visible h-9 sm:h-11">
        <svg
          className="absolute top-0 left-0 w-full h-5 overflow-visible"
          preserveAspectRatio="none"
          viewBox="0 0 1200 20"
        >
          <path
            d="M 0 0 
               Q 25 10, 50 10 Q 75 10, 100 0 
               Q 125 10, 150 10 Q 175 10, 200 0 
               Q 225 10, 250 10 Q 275 10, 300 0 
               Q 325 10, 350 10 Q 375 10, 400 0 
               Q 425 10, 450 10 Q 475 10, 500 0 
               Q 525 10, 550 10 Q 575 10, 600 0 
               Q 625 10, 650 10 Q 675 10, 700 0 
               Q 725 10, 750 10 Q 775 10, 800 0 
               Q 825 10, 850 10 Q 875 10, 900 0 
               Q 925 10, 950 10 Q 975 10, 1000 0 
               Q 1025 10, 1050 10 Q 1075 10, 1100 0 
               Q 1125 10, 1150 10 Q 1175 10, 1200 0"
            fill="none"
            stroke="rgba(100, 116, 139, 0.45)"
            strokeWidth="1.5"
          />
        </svg>

        {/* Hanging Bulbs */}
        <div className="relative w-full h-full flex items-start justify-between px-5 sm:px-14 pt-1.5">
          {bulbs.map((bulb, idx) => (
            <div key={idx} className="relative flex flex-col items-center">
              <div className="w-1.5 h-1.5 bg-gray-700 rounded-t-xs" />
              <motion.div
                animate={{
                  opacity: [0.75, 1, 0.75],
                  scale: [0.94, 1.12, 0.94],
                }}
                transition={{
                  duration: 1.4 + (idx % 4) * 0.25,
                  delay: bulb.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  backgroundColor: bulb.color,
                  boxShadow: `0 2px 12px 3px ${bulb.shadow}`,
                }}
                className="w-2 sm:w-2.5 h-3 sm:h-3.5 rounded-b-full rounded-t-xs"
              />
              <div
                className="absolute top-4 w-5 h-8 pointer-events-none rounded-b-full blur-xs opacity-35"
                style={{
                  background: `radial-gradient(ellipse at top, ${bulb.color} 0%, transparent 80%)`,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Hanging Corner Lanterns */}
      <HangingLantern side="left" />
      <HangingLantern side="right" />

      {/* Bottom Corner Diya */}
      <BottomCornerDiya />
    </>
  );
}

// 4. Main Festive Decor Manager with Navbar Toggle
export default function StaffFestiveDecor() {
  const [isEnabled, setIsEnabled] = useState(() => {
    return localStorage.getItem('staffFestiveDecor') !== 'false';
  });

  const toggleDecor = () => {
    const nextState = !isEnabled;
    setIsEnabled(nextState);
    localStorage.setItem('staffFestiveDecor', String(nextState));
    window.dispatchEvent(new CustomEvent('staffFestiveDecorChanged', { detail: { enabled: nextState } }));
  };

  return (
    <>
      {/* Festive Lights & Lanterns */}
      {isEnabled && <StaffTopLights />}

      {/* Navbar Toggle Pill */}
      <button
        onClick={toggleDecor}
        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 select-none cursor-pointer ${
          isEnabled
            ? 'clay-flat text-amber-700 bg-amber-500/15 border border-amber-500/30 shadow-md shadow-amber-500/10'
            : 'clay-flat text-gray-400 hover:text-gray-600'
        }`}
        title={isEnabled ? 'Turn off Diwali Lights' : 'Turn on Diwali Lights'}
      >
        <span className={isEnabled ? 'animate-bounce' : 'opacity-60'}>🪔</span>
        <span className="hidden sm:inline">
          {isEnabled ? 'Festive Mode' : 'Festive Off'}
        </span>
      </button>
    </>
  );
}
