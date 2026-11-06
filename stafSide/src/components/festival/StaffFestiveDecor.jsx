import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Light theme presets like Blinkit's "CHANGE LIGHTS"
export const LIGHT_THEMES = {
  GOLD: 'gold', // Classic Blinkit Warm Golden Dhanteras/Diwali
  CARNIVAL: 'carnival', // Vibrant Festival Multicolor
  DIAMOND: 'diamond', // Crystal White & Champagne Sparkle
  OFF: 'off', // Standard work mode
};

// 1. Pixel/LED Dot-Matrix Diya Motif from Blinkit
export function BlinkitPixelDiya({ side = 'left', theme = 'gold', className = '' }) {
  const isGold = theme === 'gold';
  const isDiamond = theme === 'diamond';

  const flameColor = isDiamond ? '#ffffff' : isGold ? '#fef08a' : '#f43f5e';
  const flameGlow = isDiamond ? 'rgba(255,255,255,0.8)' : isGold ? 'rgba(254,240,138,0.9)' : 'rgba(244,63,94,0.8)';
  const bowlColor = isDiamond ? '#e2e8f0' : isGold ? '#f59e0b' : '#38bdf8';
  const bowlGlow = isDiamond ? 'rgba(226,232,240,0.6)' : isGold ? 'rgba(245,158,11,0.8)' : 'rgba(56,189,248,0.8)';
  const dotSize = 3;

  // Grid coordinates (x, y) for pixel art Diya
  const flameDots = [
    [3, 0],
    [2, 1], [3, 1], [4, 1],
    [2, 2], [3, 2], [4, 2],
    [3, 3]
  ];

  const bowlDots = [
    [0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4],
    [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5],
    [1, 6], [2, 6], [3, 6], [4, 6], [5, 6],
    [2, 7], [3, 7], [4, 7]
  ];

  // Little star sparkle dots (✦) next to the diya
  const sparkleDots = side === 'left' ? [
    [-3, 1], [-2, 1], [-4, 1], [-3, 0], [-3, 2],
    [-2, 6], [-1, 6], [-3, 6], [-2, 5], [-2, 7],
  ] : [
    [9, 1], [10, 1], [8, 1], [9, 0], [9, 2],
    [8, 6], [9, 6], [7, 6], [8, 5], [8, 7],
  ];

  return (
    <motion.div
      animate={{
        scale: [1, 1.04, 0.98, 1.03, 1],
        opacity: [0.85, 1, 0.9, 1, 0.85],
      }}
      transition={{
        duration: 2.2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={`relative inline-block select-none pointer-events-none ${className}`}
    >
      {/* Ambient Radial Bloom */}
      <div 
        className="absolute inset-0 -inset-x-4 -inset-y-3 rounded-full blur-md opacity-70 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${isDiamond ? 'rgba(255,255,255,0.4)' : 'rgba(245,158,11,0.5)'} 0%, transparent 75%)`
        }}
      />

      <svg width="68" height="60" viewBox="-5 -2 18 12" className="overflow-visible drop-shadow-[0_2px_8px_rgba(245,158,11,0.6)]">
        {/* Flame Pixel Dots */}
        {flameDots.map(([x, y], i) => (
          <circle
            key={`f-${i}`}
            cx={x}
            cy={y}
            r={dotSize / 2}
            fill={flameColor}
            style={{ filter: `drop-shadow(0 0 3px ${flameGlow})` }}
          />
        ))}

        {/* Diya Bowl Pixel Dots */}
        {bowlDots.map(([x, y], i) => (
          <circle
            key={`b-${i}`}
            cx={x}
            cy={y}
            r={dotSize / 2}
            fill={bowlColor}
            style={{ filter: `drop-shadow(0 0 2.5px ${bowlGlow})` }}
          />
        ))}

        {/* Floating Sparkle Dots */}
        {sparkleDots.map(([x, y], i) => (
          <circle
            key={`s-${i}`}
            cx={x}
            cy={y}
            r={dotSize / 3}
            fill={flameColor}
            opacity={0.8}
            style={{ filter: `drop-shadow(0 0 2px ${flameGlow})` }}
          />
        ))}
      </svg>
    </motion.div>
  );
}

// 2. Blinkit Arched Micro-LED Hanging Fairy Lights
export function BlinkitTopLights({ theme = 'gold' }) {
  if (theme === 'off') return null;

  // Swag 1 and Swag 2 bulb points along parabolic hanging wires
  const swags = [
    { yOffset: 0, amp: 26, bulbCount: 28, delayOffset: 0 },
    { yOffset: 12, amp: 32, bulbCount: 30, delayOffset: 0.25 },
  ];

  const getBulbColor = (index, swagIdx) => {
    if (theme === 'diamond') {
      return index % 2 === 0 ? '#ffffff' : '#fef08a';
    }
    if (theme === 'carnival') {
      const colors = ['#f59e0b', '#ef4444', '#10b981', '#38bdf8', '#ec4899', '#facc15'];
      return colors[(index + swagIdx) % colors.length];
    }
    // Default Gold
    return index % 3 === 0 ? '#ffffff' : index % 2 === 0 ? '#fef08a' : '#facc15';
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-30 pointer-events-none select-none overflow-hidden h-24 sm:h-28">
      {swags.map((swag, sIdx) => {
        // Generate SVG parabolic curve path
        const pathD = `M -20 ${swag.yOffset} Q 300 ${swag.yOffset + swag.amp * 1.5}, 600 ${swag.yOffset + 6} Q 900 ${swag.yOffset + swag.amp * 1.5}, 1220 ${swag.yOffset}`;
        const bulbs = Array.from({ length: swag.bulbCount });

        return (
          <div key={sIdx} className="absolute inset-0">
            {/* The Delicate Wire */}
            <svg
              className="absolute top-0 left-0 w-full h-full"
              viewBox="0 0 1200 65"
              preserveAspectRatio="none"
            >
              <path
                d={pathD}
                fill="none"
                stroke="rgba(253, 230, 138, 0.35)"
                strokeWidth="1.2"
              />
            </svg>

            {/* Glowing Bead Bulbs spaced along the arched swag */}
            <div className="relative w-full h-full flex justify-between px-3 sm:px-8">
              {bulbs.map((_, bIdx) => {
                const color = getBulbColor(bIdx, sIdx);
                // Compute arched dip using normalized sine curve
                const progress = bIdx / (swag.bulbCount - 1);
                const dip = Math.sin(progress * Math.PI) * swag.amp + swag.yOffset;

                return (
                  <motion.div
                    key={bIdx}
                    animate={{
                      scale: [0.92, 1.25, 0.92],
                      opacity: [0.65, 1, 0.65],
                    }}
                    transition={{
                      duration: 1.2 + ((bIdx * 3) % 5) * 0.3,
                      delay: swag.delayOffset + (bIdx % 4) * 0.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    style={{
                      transform: `translateY(${dip}px)`,
                    }}
                    className="relative flex flex-col items-center shrink-0"
                  >
                    {/* Glowing Round Micro-LED Bead */}
                    <div
                      style={{
                        backgroundColor: color,
                        boxShadow: `0 0 8px 3px ${color === '#ffffff' ? 'rgba(255,255,255,0.9)' : 'rgba(251,191,36,0.95)'}, 0 0 18px 6px rgba(245,158,11,0.5)`,
                      }}
                      className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full"
                    />

                    {/* Subtle Downward Glow Halo */}
                    <div
                      style={{
                        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                      }}
                      className="absolute -top-1 w-4 h-5 rounded-full blur-xs opacity-60"
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// 3. Blinkit Traditional Toran / Marigold Floral Ribbon Border
export function BlinkitToranRibbon({ className = '' }) {
  return (
    <div className={`w-full overflow-hidden select-none pointer-events-none relative ${className}`}>
      {/* Decorative Traditional Scalloped Toran Band */}
      <svg
        className="w-full h-4 sm:h-5 text-amber-500"
        viewBox="0 0 1200 24"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="toranGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="25%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="75%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>

        {/* Continuous Scalloped Toran Garland */}
        <path
          d="M 0 0 
             Q 25 18, 50 18 Q 75 18, 100 0 
             Q 125 18, 150 18 Q 175 18, 200 0 
             Q 225 18, 250 18 Q 275 18, 300 0 
             Q 325 18, 350 18 Q 375 18, 400 0 
             Q 425 18, 450 18 Q 475 18, 500 0 
             Q 525 18, 550 18 Q 575 18, 600 0 
             Q 625 18, 650 18 Q 675 18, 700 0 
             Q 725 18, 750 18 Q 775 18, 800 0 
             Q 825 18, 850 18 Q 875 18, 900 0 
             Q 925 18, 950 18 Q 975 18, 1000 0 
             Q 1025 18, 1050 18 Q 1075 18, 1100 0 
             Q 1125 18, 1150 18 Q 1175 18, 1200 0"
          fill="none"
          stroke="url(#toranGold)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Small Marigold Pendants hanging at peaks */}
        {Array.from({ length: 24 }).map((_, i) => (
          <circle
            key={i}
            cx={50 * i + 25}
            cy={18}
            r={2.5}
            fill={i % 2 === 0 ? '#ef4444' : '#facc15'}
          />
        ))}
      </svg>
    </div>
  );
}

// 4. Iconic Blinkit Centerpiece Banner with "CELEBRATE Dhanteras/Diwali" & "CHANGE LIGHTS" Button
export function BlinkitFestiveBanner({ currentTheme = 'gold', onChangeTheme, className = '' }) {
  if (currentTheme === 'off') {
    return (
      <div className="flex justify-center py-2">
        <button
          onClick={() => onChangeTheme('gold')}
          className="px-4 py-1.5 rounded-full bg-gradient-to-b from-[#fef3c7] to-[#fde68a] text-[#78350f] font-black text-xs uppercase tracking-wider border-2 border-amber-400 shadow-md hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>🪔</span>
          <span>TURN ON FESTIVE LIGHTS</span>
        </button>
      </div>
    );
  }

  const getThemeLabel = () => {
    switch (currentTheme) {
      case 'gold': return 'CHANGE LIGHTS';
      case 'carnival': return 'CHANGE LIGHTS (CARNIVAL)';
      case 'diamond': return 'CHANGE LIGHTS (DIAMOND)';
      default: return 'CHANGE LIGHTS';
    }
  };

  return (
    <div className={`relative w-full flex flex-col items-center justify-center pt-2 pb-4 text-center select-none ${className}`}>
      {/* Background Soft Golden Halo */}
      <div className="absolute inset-0 bg-radial from-amber-400/25 via-orange-500/10 to-transparent blur-2xl pointer-events-none" />

      {/* Main Title Row Flanked by Blinkit Pixel Diyas */}
      <div className="relative flex items-center justify-center gap-3 sm:gap-8 max-w-4xl mx-auto w-full px-4">
        {/* Left Pixel Diya */}
        <BlinkitPixelDiya side="left" theme={currentTheme} className="hidden xs:inline-block sm:block scale-90 sm:scale-110" />

        {/* Center Typography */}
        <div className="flex flex-col items-center justify-center">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.35em] text-amber-200/90 drop-shadow">
            CELEBRATE
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-[#fffbeb] drop-shadow-[0_4px_16px_rgba(245,158,11,0.65)] mt-0.5 sm:mt-1">
            Shubh Deepawali
          </h1>
          <p className="text-amber-200/80 text-[11px] sm:text-xs font-medium tracking-wide mt-1">
            RizeWorld Festive Staff Hub 🪔
          </p>
        </div>

        {/* Right Pixel Diya */}
        <BlinkitPixelDiya side="right" theme={currentTheme} className="hidden xs:inline-block sm:block scale-90 sm:scale-110" />
      </div>

      {/* The Iconic Blinkit "CHANGE LIGHTS" Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        onClick={onChangeTheme}
        className="mt-3 sm:mt-4 px-6 sm:px-8 py-2 sm:py-2.5 rounded-full bg-gradient-to-b from-[#fef7ee] via-[#fef3c7] to-[#fde68a] text-[#78350f] font-black text-xs sm:text-sm uppercase tracking-[0.14em] border-2 border-[#f59e0b] shadow-[0_4px_16px_rgba(245,158,11,0.45)] hover:shadow-[0_6px_24px_rgba(245,158,11,0.7)] transition-all cursor-pointer flex items-center gap-2 group z-20"
        title="Cycle Festive Lighting: Gold → Carnival → Diamond → Off"
      >
        <span className="text-amber-600 group-hover:rotate-45 transition-transform duration-300">💡</span>
        <span>{getThemeLabel()}</span>
        <span className="text-[10px] text-amber-700/70 font-semibold lowercase hidden md:inline">
          (click to toggle)
        </span>
      </motion.button>
    </div>
  );
}

// 5. Ambient Golden Atmosphere with Floating Bokeh Orbs
export function BlinkitAmbientGlow({ theme = 'gold' }) {
  if (theme === 'off') return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Deep Golden Ambient Gradient */}
      <div 
        className="absolute inset-0 transition-colors duration-700 opacity-95"
        style={{
          background: theme === 'carnival' 
            ? 'radial-gradient(circle at 50% 10%, #701a75 0%, #4a044e 35%, #2e0234 100%)'
            : theme === 'diamond'
            ? 'radial-gradient(circle at 50% 10%, #1e293b 0%, #0f172a 45%, #020617 100%)'
            : 'radial-gradient(circle at 50% 0%, #92400e 0%, #713f12 35%, #451a03 75%, #291001 100%)',
        }}
      />

      {/* Floating Golden Bokeh Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.15, 0.35, 0.15],
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/4 left-1/5 w-[500px] h-[500px] rounded-full bg-radial from-amber-400/40 via-yellow-500/20 to-transparent blur-3xl"
      />

      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.3, 0.15],
          x: [0, -50, 0],
          y: [0, 40, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-1/4 right-1/6 w-[550px] h-[550px] rounded-full bg-radial from-orange-500/35 via-amber-600/15 to-transparent blur-3xl"
      />

      {/* Soft Gold Shimmer Dust particles */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-300/10 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}

// 6. Complete Festive Decor Controller
export default function StaffFestiveDecor({ currentTheme = 'gold', onChangeTheme }) {
  return (
    <>
      {/* Top Arched Hanging Fairy Lights */}
      <BlinkitTopLights theme={currentTheme} />

      {/* Navbar Quick Button */}
      <button
        onClick={onChangeTheme}
        className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer select-none ${
          currentTheme !== 'off'
            ? 'bg-gradient-to-r from-amber-300 to-yellow-400 text-[#78350f] shadow-md shadow-amber-500/30 border border-amber-300'
            : 'bg-white/20 text-gray-500 hover:text-gray-700'
        }`}
        title="Change Festive Lights Theme"
      >
        <span className={currentTheme !== 'off' ? 'animate-bounce' : 'opacity-60'}>🪔</span>
        <span className="hidden sm:inline">
          {currentTheme === 'off' ? 'Lights Off' : 'CHANGE LIGHTS'}
        </span>
      </button>
    </>
  );
}
