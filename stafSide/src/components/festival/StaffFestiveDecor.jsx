import React from 'react';

// Light theme presets like Blinkit's "CHANGE LIGHTS"
export const LIGHT_THEMES = {
  GOLD: 'gold', // Classic Blinkit Warm Golden Dhanteras/Diwali
  CARNIVAL: 'carnival', // Vibrant Festival Multicolor
  DIAMOND: 'diamond', // Crystal White & Champagne Sparkle
  OFF: 'off', // Standard work mode
};

// 1. Pixel/LED Dot-Matrix Diya Motif from Blinkit (Ultra-lightweight SVG)
export function BlinkitPixelDiya({ side = 'left', theme = 'gold', className = '' }) {
  const isDiamond = theme === 'diamond';
  const isCarnival = theme === 'carnival';

  const flameColor = isDiamond ? '#ffffff' : isCarnival ? '#f43f5e' : '#fef08a';
  const bowlColor = isDiamond ? '#cbd5e1' : isCarnival ? '#38bdf8' : '#f59e0b';
  const dotRadius = 1.3;

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

  const sparkleDots = side === 'left' ? [
    [-3, 1], [-2, 1], [-4, 1], [-3, 0], [-3, 2],
    [-2, 6], [-1, 6], [-3, 6], [-2, 5], [-2, 7],
  ] : [
    [9, 1], [10, 1], [8, 1], [9, 0], [9, 2],
    [8, 6], [9, 6], [7, 6], [8, 5], [8, 7],
  ];

  return (
    <div className={`relative inline-block select-none pointer-events-none ${className}`}>
      <svg width="60" height="52" viewBox="-5 -2 18 12" className="overflow-visible">
        {/* Flame Pixel Dots */}
        {flameDots.map(([x, y], i) => (
          <circle key={`f-${i}`} cx={x} cy={y} r={dotRadius} fill={flameColor} />
        ))}

        {/* Diya Bowl Pixel Dots */}
        {bowlDots.map(([x, y], i) => (
          <circle key={`b-${i}`} cx={x} cy={y} r={dotRadius} fill={bowlColor} />
        ))}

        {/* Floating Sparkle Dots */}
        {sparkleDots.map(([x, y], i) => (
          <circle key={`s-${i}`} cx={x} cy={y} r={dotRadius * 0.75} fill={flameColor} opacity="0.85" />
        ))}
      </svg>
    </div>
  );
}

// 2. Ultra-smooth CSS-only Blinkit Arched Hanging Fairy Lights (Zero JS load, 100% GPU)
export function BlinkitTopLights({ theme = 'gold' }) {
  if (theme === 'off') return null;

  const bulbCount = 24;
  const bulbs = Array.from({ length: bulbCount });

  const getColor = (i) => {
    if (theme === 'diamond') return i % 2 === 0 ? '#ffffff' : '#fef08a';
    if (theme === 'carnival') {
      const c = ['#f59e0b', '#ef4444', '#10b981', '#38bdf8', '#ec4899', '#facc15'];
      return c[i % c.length];
    }
    return i % 3 === 0 ? '#ffffff' : i % 2 === 0 ? '#fef08a' : '#facc15';
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-30 pointer-events-none select-none h-16 sm:h-20 overflow-hidden">
      {/* Curved Hanging Wire SVG */}
      <svg
        className="absolute top-0 left-0 w-full h-12"
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
      >
        <path
          d="M 0 0 Q 300 35, 600 8 Q 900 35, 1200 0"
          fill="none"
          stroke="rgba(253, 230, 138, 0.4)"
          strokeWidth="1.2"
        />
      </svg>

      {/* Bulbs on Curved Arc */}
      <div className="relative w-full h-full flex justify-between px-4 sm:px-10">
        {bulbs.map((_, i) => {
          const progress = i / (bulbCount - 1);
          const dip = Math.sin(progress * Math.PI) * 26;
          const color = getColor(i);

          return (
            <div
              key={i}
              style={{
                transform: `translateY(${dip}px)`,
                backgroundColor: color,
                boxShadow: `0 0 6px 2px ${color}`,
                animation: `fairyTwinkle ${1.2 + (i % 4) * 0.3}s ease-in-out infinite alternate`,
                animationDelay: `${(i % 5) * 0.2}s`,
              }}
              className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full shrink-0 mt-1"
            />
          );
        })}
      </div>
    </div>
  );
}

// 3. Blinkit Traditional Toran Ribbon (Lightweight SVG)
export function BlinkitToranRibbon({ className = '' }) {
  return (
    <div className={`w-full overflow-hidden select-none pointer-events-none ${className}`}>
      <svg
        className="w-full h-3 sm:h-4"
        viewBox="0 0 1200 20"
        preserveAspectRatio="none"
      >
        <path
          d="M 0 0 Q 25 14, 50 14 Q 75 14, 100 0 Q 125 14, 150 14 Q 175 14, 200 0 Q 225 14, 250 14 Q 275 14, 300 0 Q 325 14, 350 14 Q 375 14, 400 0 Q 425 14, 450 14 Q 475 14, 500 0 Q 525 14, 550 14 Q 575 14, 600 0 Q 625 14, 650 14 Q 675 14, 700 0 Q 725 14, 750 14 Q 775 14, 800 0 Q 825 14, 850 14 Q 875 14, 900 0 Q 925 14, 950 14 Q 975 14, 1000 0 Q 1025 14, 1050 14 Q 1075 14, 1100 0 Q 1125 14, 1150 14 Q 1175 14, 1200 0"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

// 4. Centerpiece Banner with "CELEBRATE Dhanteras/Diwali" & "CHANGE LIGHTS" Button
export function BlinkitFestiveBanner({ currentTheme = 'gold', onChangeTheme, className = '' }) {
  if (currentTheme === 'off') {
    return (
      <div className="flex justify-center py-2">
        <button
          onClick={() => onChangeTheme('gold')}
          className="px-4 py-1.5 rounded-full bg-gradient-to-b from-[#fef3c7] to-[#fde68a] text-[#78350f] font-black text-xs uppercase tracking-wider border-2 border-amber-400 shadow-md hover:scale-105 transition-transform cursor-pointer flex items-center gap-1.5"
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
    <div className={`relative w-full flex flex-col items-center justify-center pt-1 pb-3 text-center select-none ${className}`}>
      {/* Title Row Flanked by Blinkit Pixel Diyas */}
      <div className="flex items-center justify-center gap-3 sm:gap-6 max-w-4xl mx-auto w-full px-4">
        <BlinkitPixelDiya side="left" theme={currentTheme} className="hidden xs:inline-block scale-90 sm:scale-100" />

        <div className="flex flex-col items-center justify-center">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] text-amber-200 drop-shadow">
            CELEBRATE
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-[#fffbeb] drop-shadow-[0_2px_10px_rgba(245,158,11,0.6)] mt-0.5">
            Shubh Deepawali
          </h1>
          <p className="text-amber-200/80 text-[11px] font-medium tracking-wide mt-0.5">
            RizeWorld Festive Staff Hub 🪔
          </p>
        </div>

        <BlinkitPixelDiya side="right" theme={currentTheme} className="hidden xs:inline-block scale-90 sm:scale-100" />
      </div>

      {/* The Iconic Blinkit "CHANGE LIGHTS" Button */}
      <button
        onClick={onChangeTheme}
        className="mt-2.5 px-6 py-2 rounded-full bg-gradient-to-b from-[#fef7ee] via-[#fef3c7] to-[#fde68a] text-[#78350f] font-black text-xs sm:text-sm uppercase tracking-[0.14em] border-2 border-[#f59e0b] shadow-[0_3px_12px_rgba(245,158,11,0.4)] hover:shadow-[0_4px_18px_rgba(245,158,11,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2 group z-20"
        title="Cycle Festive Lighting: Gold → Carnival → Diamond → Off"
      >
        <span className="text-amber-600">💡</span>
        <span>{getThemeLabel()}</span>
      </button>
    </div>
  );
}

// 5. Zero-CPU Static Ambient Golden Atmosphere
export function BlinkitAmbientGlow({ theme = 'gold' }) {
  if (theme === 'off') return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div 
        className="absolute inset-0 transition-colors duration-500"
        style={{
          background: theme === 'carnival' 
            ? 'radial-gradient(ellipse at 50% 0%, #581c87 0%, #3b0764 45%, #1e0538 100%)'
            : theme === 'diamond'
            ? 'radial-gradient(ellipse at 50% 0%, #1e293b 0%, #0f172a 45%, #020617 100%)'
            : 'radial-gradient(ellipse at 50% 0%, #854d0e 0%, #713f12 35%, #451a03 75%, #2a0f01 100%)',
        }}
      />
    </div>
  );
}

// 6. Complete Festive Decor Controller
export default function StaffFestiveDecor({ currentTheme = 'gold', onChangeTheme }) {
  return (
    <>
      <BlinkitTopLights theme={currentTheme} />

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
