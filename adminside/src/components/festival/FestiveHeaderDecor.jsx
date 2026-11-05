import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function FestiveHeaderDecor() {
  const [isEnabled, setIsEnabled] = useState(() => {
    return localStorage.getItem('festiveDecorEnabled') !== 'false';
  });

  const toggleDecor = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    localStorage.setItem('festiveDecorEnabled', String(newState));
    window.dispatchEvent(
      new CustomEvent('festiveDecorChanged', { detail: { enabled: newState } })
    );
  };

  // 18 hanging fairy light bulbs across header
  const headerBulbs = [
    { color: '#fbbf24', shadow: '#f59e0b', height: 14, delay: 0 },
    { color: '#ee591e', shadow: '#ea580c', height: 22, delay: 0.3 },
    { color: '#22c55e', shadow: '#16a34a', height: 16, delay: 0.6 },
    { color: '#f43f5e', shadow: '#e11d48', height: 20, delay: 0.1 },
    { color: '#facc15', shadow: '#ca8a04', height: 12, delay: 0.5 },
    { color: '#38bdf8', shadow: '#0284c7', height: 18, delay: 0.8 },
    { color: '#fbbf24', shadow: '#f59e0b', height: 24, delay: 0.2 },
    { color: '#ee591e', shadow: '#ea580c', height: 15, delay: 0.7 },
    { color: '#22c55e', shadow: '#16a34a', height: 20, delay: 0.4 },
    { color: '#f43f5e', shadow: '#e11d48', height: 14, delay: 0.9 },
    { color: '#facc15', shadow: '#ca8a04', height: 22, delay: 0.2 },
    { color: '#38bdf8', shadow: '#0284c7', height: 16, delay: 0.6 },
    { color: '#ee591e', shadow: '#ea580c', height: 20, delay: 0.1 },
    { color: '#22c55e', shadow: '#16a34a', height: 14, delay: 0.5 },
    { color: '#fbbf24', shadow: '#f59e0b', height: 22, delay: 0.8 },
    { color: '#f43f5e', shadow: '#e11d48', height: 16, delay: 0.3 },
    { color: '#facc15', shadow: '#ca8a04', height: 24, delay: 0.7 },
    { color: '#38bdf8', shadow: '#0284c7', height: 15, delay: 0.4 },
  ];

  // 14 Marigold flowers in the toran
  const toranFlowers = [
    { type: 'orange', hasDrop: true },
    { type: 'yellow', hasDrop: false },
    { type: 'orange', hasDrop: true },
    { type: 'yellow', hasDrop: false },
    { type: 'orange', hasDrop: true },
    { type: 'yellow', hasDrop: false },
    { type: 'orange', hasDrop: true },
    { type: 'yellow', hasDrop: false },
    { type: 'orange', hasDrop: true },
    { type: 'yellow', hasDrop: false },
    { type: 'orange', hasDrop: true },
    { type: 'yellow', hasDrop: false },
    { type: 'orange', hasDrop: true },
    { type: 'yellow', hasDrop: false },
  ];

  return (
    <>
      {/* 1. Festive Toggle Button in Header (Allows Admin to Toggle ON/OFF anytime) */}
      <button
        onClick={toggleDecor}
        className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-sm select-none cursor-pointer ${
          isEnabled
            ? 'bg-gradient-to-r from-amber-500/15 to-orange-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300 shadow-amber-500/10 hover:border-amber-500/60'
            : 'bg-black/5 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
        }`}
        title={isEnabled ? 'Click to turn off festive lights & garlands' : 'Click to turn on festive lights & garlands'}
      >
        <span className={isEnabled ? 'animate-bounce' : 'opacity-60'}>🪔</span>
        <span className="hidden sm:inline">
          {isEnabled ? 'Festive Mode' : 'Festive Off'}
        </span>
        {isEnabled && (
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping ml-0.5" />
        )}
      </button>

      {/* 2. Hanging Fairy Lights & Marigold Toran across the Header Bar */}
      {isEnabled && (
        <div className="absolute -bottom-4 left-0 right-0 z-30 pointer-events-none select-none overflow-visible">
          {/* Top Hanging Fairy Lights Wire & Bulbs */}
          <div className="relative w-full flex items-start justify-between px-4">
            {headerBulbs.map((bulb, i) => (
              <div key={i} className="flex flex-col items-center">
                {/* Thin dangling wire */}
                <div
                  style={{ height: `${bulb.height}px` }}
                  className="w-[1px] bg-gradient-to-b from-gray-400/40 via-amber-400/50 to-amber-500/80"
                />
                {/* Glowing Twinkling Bulb */}
                <motion.div
                  animate={{
                    opacity: [0.65, 1, 0.65],
                    scale: [0.85, 1.2, 0.85],
                  }}
                  transition={{
                    duration: 1.5 + (i % 4) * 0.25,
                    delay: bulb.delay,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{
                    backgroundColor: bulb.color,
                    boxShadow: `0 0 10px 3px ${bulb.shadow}`,
                  }}
                  className="w-2.5 h-2.5 rounded-full"
                />
              </div>
            ))}
          </div>

          {/* Marigold Toran Garland (तोरण माला) */}
          <div className="relative w-full flex items-center justify-between px-3 -mt-1.5">
            {toranFlowers.map((item, idx) => (
              <div key={idx} className="relative flex flex-col items-center">
                {/* Hanging Mango Leaf (आम का पत्ता) */}
                {item.hasDrop && (
                  <div className="absolute top-1 w-2.5 h-5 bg-gradient-to-b from-[#15803d] to-[#14532d] rounded-b-full shadow-sm z-0" />
                )}

                {/* Marigold Flower */}
                <div
                  className={`relative z-10 rounded-full flex items-center justify-center shadow-md ${
                    item.type === 'orange'
                      ? 'w-4 h-4 sm:w-4.5 sm:h-4.5 bg-gradient-to-br from-[#f97316] to-[#c2410c] border border-amber-300/60'
                      : 'w-3.5 h-3.5 sm:w-4 sm:h-4 bg-gradient-to-br from-[#fef08a] to-[#ca8a04] border border-yellow-200/80'
                  }`}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
