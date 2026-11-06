import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Fun comical Diwali sound effect shouts
const COMIC_LABELS = [
  { text: 'DHAMAKA! 💥', color: 'from-amber-400 to-red-500' },
  { text: 'PATAAKHA! 🧨', color: 'from-red-500 to-orange-500' },
  { text: 'BOOM! 🚀', color: 'from-purple-500 to-pink-500' },
  { text: 'CHAKRI! 🌀', color: 'from-cyan-400 to-blue-500' },
  { text: 'ANAR BLAST! 🌋', color: 'from-yellow-400 to-amber-600' },
  { text: 'ROCKET! 🚀', color: 'from-emerald-400 to-teal-600' },
  { text: 'PHUSSS! 💨', color: 'from-slate-400 to-gray-500', isPhuss: true },
  { text: '10,000 WALA! 💥', color: 'from-rose-500 to-red-600' },
  { text: 'SHUBH DIWALI! ✨', color: 'from-amber-300 to-yellow-500' },
  { text: 'DHOOM! 💣', color: 'from-orange-500 to-amber-500' },
];

const SPARK_COLORS = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#facc15', '#06b6d4'];
const FESTIVE_EMOJIS = ['✨', '💥', '🧨', '🎆', '🎇', '⭐', '🔥'];

export default function FirecrackerClickBursts() {
  const [bursts, setBursts] = useState([]);
  const [decorEnabled, setDecorEnabled] = useState(() => {
    return localStorage.getItem('staffFestiveDecor') !== 'false';
  });

  useEffect(() => {
    const handleDecorChange = (e) => {
      if (e?.detail?.enabled !== undefined) {
        setDecorEnabled(e.detail.enabled);
      } else {
        setDecorEnabled(localStorage.getItem('staffFestiveDecor') !== 'false');
      }
    };

    window.addEventListener('staffFestiveDecorChanged', handleDecorChange);
    window.addEventListener('storage', handleDecorChange);
    return () => {
      window.removeEventListener('staffFestiveDecorChanged', handleDecorChange);
      window.removeEventListener('storage', handleDecorChange);
    };
  }, []);

  const spawnBurst = useCallback((x, y) => {
    if (!decorEnabled) return;

    const burstId = Date.now() + Math.random();
    const labelObj = COMIC_LABELS[Math.floor(Math.random() * COMIC_LABELS.length)];

    // Generate 10-14 sparks radiating outward
    const sparkCount = labelObj.isPhuss ? 6 : 12;
    const sparks = Array.from({ length: sparkCount }).map((_, i) => {
      const angle = (i / sparkCount) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
      const distance = labelObj.isPhuss ? 25 + Math.random() * 25 : 50 + Math.random() * 70;
      return {
        id: i,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance - (labelObj.isPhuss ? 15 : 20), // slight upward lift
        color: labelObj.isPhuss ? '#cbd5e1' : SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
        size: labelObj.isPhuss ? 6 : 4 + Math.random() * 4,
        emoji: !labelObj.isPhuss && i % 3 === 0 ? FESTIVE_EMOJIS[Math.floor(Math.random() * FESTIVE_EMOJIS.length)] : null,
      };
    });

    const newBurst = {
      id: burstId,
      x,
      y,
      label: labelObj.text,
      gradient: labelObj.color,
      isPhuss: labelObj.isPhuss,
      sparks,
    };

    setBursts((prev) => [...prev.slice(-8), newBurst]); // Keep max 8 active bursts

    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== burstId));
    }, 950);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      // Check if target is interactive (button, a, role=button, clay classes, etc.)
      const interactive = e.target.closest(
        'button, a, [role="button"], input[type="button"], input[type="submit"], .clay-flat, .clay-inset, .clay-card, [tabindex="0"]'
      );

      if (interactive) {
        spawnBurst(e.clientX, e.clientY);
      }
    };

    window.addEventListener('click', handleClick, { capture: true, passive: true });
    return () => {
      window.removeEventListener('click', handleClick, { capture: true });
    };
  }, [spawnBurst]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none">
      <AnimatePresence>
        {bursts.map((burst) => (
          <div
            key={burst.id}
            className="absolute"
            style={{ left: burst.x, top: burst.y }}
          >
            {/* Shockwave expanding ring */}
            {!burst.isPhuss && (
              <motion.div
                initial={{ scale: 0.1, opacity: 0.85 }}
                animate={{ scale: 2.4, opacity: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border-2 border-amber-400"
              />
            )}

            {/* Central flash */}
            <motion.div
              initial={{ scale: 0.4, opacity: 1 }}
              animate={{ scale: burst.isPhuss ? 1.5 : 2.2, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-xs ${
                burst.isPhuss ? 'w-8 h-8 bg-slate-300' : 'w-10 h-10 bg-radial from-white via-amber-300 to-orange-500'
              }`}
            />

            {/* Funny Comic Shout Bubble */}
            <motion.div
              initial={{ scale: 0.2, y: 0, opacity: 0, rotate: Math.random() * 20 - 10 }}
              animate={{
                scale: [0.2, 1.25, 1],
                y: burst.isPhuss ? -30 : -55,
                opacity: [0, 1, 1, 0],
                rotate: [0, (Math.random() - 0.5) * 16, (Math.random() - 0.5) * 8],
              }}
              transition={{ duration: 0.85, times: [0, 0.25, 0.65, 1], ease: 'easeOut' }}
              className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
            >
              <div
                className={`px-3 py-1 rounded-full font-black text-xs sm:text-sm tracking-wide text-white uppercase shadow-lg shadow-black/25 border-2 border-white/80 bg-gradient-to-r ${burst.gradient} flex items-center gap-1 drop-shadow-md`}
              >
                <span>{burst.label}</span>
              </div>
            </motion.div>

            {/* Flying sparks & emojis */}
            {burst.sparks.map((spark) => (
              <motion.div
                key={spark.id}
                initial={{ x: 0, y: 0, scale: 0.8, opacity: 1 }}
                animate={{
                  x: spark.dx,
                  y: spark.dy + (burst.isPhuss ? 10 : 35), // gravity pull downwards
                  scale: [0.8, 1.3, 0],
                  opacity: [1, 1, 0],
                }}
                transition={{ duration: burst.isPhuss ? 0.6 : 0.75, ease: 'easeOut' }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
              >
                {spark.emoji ? (
                  <span className="text-sm select-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                    {spark.emoji}
                  </span>
                ) : (
                  <div
                    style={{
                      width: `${spark.size}px`,
                      height: `${spark.size}px`,
                      backgroundColor: spark.color,
                      boxShadow: `0 0 8px ${spark.color}`,
                    }}
                    className="rounded-full"
                  />
                )}
              </motion.div>
            ))}
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
