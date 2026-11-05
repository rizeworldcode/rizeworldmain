import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function FestiveCardGarland({ 
  showDiya = true, 
  showLights = true, 
  className = "" 
}) {
  const [isEnabled, setIsEnabled] = useState(() => {
    return localStorage.getItem('festiveDecorEnabled') !== 'false';
  });

  useEffect(() => {
    const handleToggle = (e) => {
      if (e.detail && typeof e.detail.enabled === 'boolean') {
        setIsEnabled(e.detail.enabled);
      }
    };
    window.addEventListener('festiveDecorChanged', handleToggle);
    return () => window.removeEventListener('festiveDecorChanged', handleToggle);
  }, []);

  if (!isEnabled) return null;

  // 11 decorative marigold flowers across the garland
  const flowers = [
    { type: 'orange', leaf: false },
    { type: 'yellow', leaf: true },
    { type: 'orange', leaf: false },
    { type: 'yellow', leaf: true },
    { type: 'orange', leaf: false },
    { type: 'yellow', leaf: true },
    { type: 'orange', leaf: false },
    { type: 'yellow', leaf: true },
    { type: 'orange', leaf: false },
    { type: 'yellow', leaf: true },
    { type: 'orange', leaf: false },
  ];

  // 12 Twinkling fairy light bulbs
  const fairyBulbs = [
    { color: '#fbbf24', shadow: '#f59e0b', delay: 0 },
    { color: '#ee591e', shadow: '#ea580c', delay: 0.4 },
    { color: '#22c55e', shadow: '#16a34a', delay: 0.8 },
    { color: '#f43f5e', shadow: '#e11d48', delay: 0.2 },
    { color: '#facc15', shadow: '#ca8a04', delay: 0.6 },
    { color: '#38bdf8', shadow: '#0284c7', delay: 1.0 },
    { color: '#ee591e', shadow: '#ea580c', delay: 0.3 },
    { color: '#22c55e', shadow: '#16a34a', delay: 0.7 },
    { color: '#fbbf24', shadow: '#f59e0b', delay: 0.1 },
    { color: '#f43f5e', shadow: '#e11d48', delay: 0.5 },
    { color: '#facc15', shadow: '#ca8a04', delay: 0.9 },
    { color: '#38bdf8', shadow: '#0284c7', delay: 0.3 },
  ];

  return (
    <div className={`absolute -top-3 left-0 right-0 z-20 pointer-events-none select-none overflow-visible ${className}`}>
      {/* 1. FAIRY LIGHT STRING (Jagmagaati Lightein) */}
      {showLights && (
        <div className="relative w-full h-4 flex items-center justify-between px-3">
          {/* Wire connecting bulbs */}
          <div className="absolute top-1 left-2 right-2 h-[1px] bg-gradient-to-r from-amber-400/30 via-yellow-300/40 to-amber-400/30" />
          
          {fairyBulbs.map((bulb, idx) => (
            <motion.div
              key={idx}
              animate={{
                opacity: [0.65, 1, 0.65],
                scale: [0.85, 1.15, 0.85],
              }}
              transition={{
                duration: 1.4 + (idx % 3) * 0.3,
                delay: bulb.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                backgroundColor: bulb.color,
                boxShadow: `0 0 8px 2px ${bulb.shadow}`,
              }}
              className="relative w-2 h-2 rounded-full z-10"
            >
              {/* Bulb collar / socket */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1 bg-gray-700/80 rounded-t-xs" />
            </motion.div>
          ))}
        </div>
      )}

      {/* 2. PHOOL MALA & FLOWERS (Marigold Garland with Mango Leaves) */}
      <div className="relative w-full flex items-center justify-between px-2 -mt-1.5">
        {flowers.map((flw, i) => (
          <div key={i} className="relative flex flex-col items-center">
            {/* Mango Leaf (Aam ka patta) hanging between flowers */}
            {flw.leaf && (
              <div className="absolute -top-1 w-2.5 h-4.5 bg-gradient-to-b from-[#15803d] to-[#166534] rounded-b-full shadow-sm -rotate-6 transform origin-top z-0" />
            )}

            {/* Marigold Flower (Genda Phool) with realistic layered petals */}
            <div
              className={`relative z-10 rounded-full flex items-center justify-center shadow-md transition-transform duration-300 hover:scale-125 ${
                flw.type === 'orange'
                  ? 'w-4.5 h-4.5 sm:w-5 sm:h-5 bg-gradient-to-br from-[#f97316] via-[#ea580c] to-[#c2410c] border border-amber-300/60'
                  : 'w-4 h-4 sm:w-4.5 sm:h-4.5 bg-gradient-to-br from-[#fef08a] via-[#facc15] to-[#ca8a04] border border-yellow-200/80'
              }`}
            >
              {/* Inner Petal Ring */}
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  flw.type === 'orange' ? 'bg-[#fed7aa]' : 'bg-[#fef9c3]'
                } opacity-90`}
              />
              {/* Center Core */}
              <div
                className={`absolute w-1.5 h-1.5 rounded-full ${
                  flw.type === 'orange' ? 'bg-[#9a3412]' : 'bg-[#854d0e]'
                }`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 3. MINI CORNER DIYA WITH GLOWING FLICKER */}
      {showDiya && (
        <div className="absolute -top-3.5 right-2 z-30 flex items-center justify-center">
          {/* Flame Light Bloom */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.6, 0.9, 0.6],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -top-2 w-7 h-7 rounded-full bg-amber-400/50 blur-sm pointer-events-none"
          />

          <svg viewBox="0 0 32 26" className="w-6 h-5 overflow-visible drop-shadow-[0_2px_6px_rgba(238,89,30,0.6)]">
            <defs>
              <linearGradient id="miniFlameGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#fef08a" />
                <stop offset="70%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
              <linearGradient id="miniDiyaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#451a03" />
              </linearGradient>
            </defs>

            {/* Flickering Flame */}
            <motion.path
              d="M 16 2 C 19 6, 20 10, 18 13 C 17 14.5, 15 14.5, 14 13 C 12 10, 13 6, 16 2 Z"
              fill="url(#miniFlameGrad)"
              animate={{
                scaleY: [1, 1.18, 0.94, 1.12, 1],
                scaleX: [1, 0.92, 1.06, 0.95, 1],
                rotate: [-2, 2, -2],
              }}
              transition={{
                duration: 1.1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ transformOrigin: '16px 14px' }}
            />

            {/* Diya Clay Body */}
            <path
              d="M 6 13 C 8 21, 24 21, 26 13 C 23 15, 9 15, 6 13 Z"
              fill="url(#miniDiyaGrad)"
              stroke="#fbbf24"
              strokeWidth="0.8"
            />
            <ellipse cx="16" cy="13" rx="10" ry="2.2" fill="#78350f" stroke="#fbbf24" strokeWidth="0.6" />
          </svg>
        </div>
      )}
    </div>
  );
}
