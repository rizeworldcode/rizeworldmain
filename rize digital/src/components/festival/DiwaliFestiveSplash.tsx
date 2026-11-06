import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DiwaliFestiveSplashProps {
  onClose?: () => void;
  duration?: number; // duration in ms, default 6000 (6 seconds)
}

// 1. Floating Sky Lantern (Akash Kandil) Component
function SkyLantern({
  className = '',
  size = 64,
  delay = 0,
  duration = 4.5,
  driftX = 12,
  driftY = 18,
}: {
  className?: string;
  size?: number;
  delay?: number;
  duration?: number;
  driftX?: number;
  driftY?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25, scale: 0.9 }}
      animate={{
        opacity: [0.85, 1, 0.9, 1, 0.85],
        y: [-driftY, 0, -driftY],
        x: [-driftX / 2, driftX / 2, -driftX / 2],
        scale: [1, 1.03, 0.98, 1],
      }}
      transition={{
        opacity: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
        y: { duration, repeat: Infinity, ease: 'easeInOut', delay },
        x: { duration: duration * 1.3, repeat: Infinity, ease: 'easeInOut', delay },
        scale: { duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay },
      }}
      style={{ width: size, height: size * 1.25 }}
      className={`absolute pointer-events-none select-none ${className}`}
    >
      {/* Outer Warm Light Halo Bloom */}
      <div
        className="absolute inset-0 rounded-full blur-xl pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(circle, rgba(255,100,130,0.55) 0%, rgba(255,180,60,0.3) 50%, transparent 80%)',
          transform: 'scale(1.8)',
        }}
      />

      <svg
        viewBox="0 0 80 100"
        className="w-full h-full overflow-visible drop-shadow-[0_8px_20px_rgba(255,80,100,0.55)]"
      >
        <defs>
          <linearGradient id={`lanternGrad-${size}-${delay}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff4d6d" />
            <stop offset="45%" stopColor="#ff2a6d" />
            <stop offset="75%" stopColor="#ff758c" />
            <stop offset="100%" stopColor="#ffaa40" />
          </linearGradient>

          <radialGradient id={`lanternFlame-${size}-${delay}`} cx="50%" cy="85%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#fff3bf" />
            <stop offset="60%" stopColor="#ff922b" />
            <stop offset="100%" stopColor="#c92a2a" />
          </radialGradient>
        </defs>

        <line x1="40" y1="0" x2="40" y2="10" stroke="#f08c00" strokeWidth="1.5" strokeOpacity="0.7" />
        <ellipse cx="40" cy="11" rx="14" ry="3" fill="#d9480f" opacity="0.9" />

        <path
          d="M 26 12 C 14 28, 12 55, 18 78 C 22 86, 32 88, 40 88 C 48 88, 58 86, 62 78 C 68 55, 66 28, 54 12 Z"
          fill={`url(#lanternGrad-${size}-${delay})`}
        />

        <path
          d="M 26 12 C 14 28, 12 55, 18 78 C 22 86, 32 88, 40 88 C 48 88, 58 86, 62 78 C 68 55, 66 28, 54 12 Z"
          fill={`url(#lanternFlame-${size}-${delay})`}
          opacity="0.75"
        />

        <path d="M 40 11 Q 39 50 40 88" stroke="#ffa8a8" strokeWidth="1" strokeOpacity="0.4" fill="none" />
        <path d="M 33 12 Q 26 50 28 84" stroke="#ffa8a8" strokeWidth="0.8" strokeOpacity="0.3" fill="none" />
        <path d="M 47 12 Q 54 50 52 84" stroke="#ffa8a8" strokeWidth="0.8" strokeOpacity="0.3" fill="none" />

        <ellipse cx="40" cy="88" rx="16" ry="4.5" fill="#5c1900" />
        <ellipse cx="40" cy="87" rx="13" ry="3.5" fill="#ffe066" />
        <ellipse cx="40" cy="86" rx="8" ry="2" fill="#ffffff" />
        <circle cx="40" cy="94" r="2.5" fill="#ffd43b" opacity="0.9" />
      </svg>
    </motion.div>
  );
}

// 2. Intricate Indian Mandala Arch & Floral Rangoli Motif
function MandalaArch() {
  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] sm:w-[940px] md:w-[1100px] h-[480px] sm:h-[580px] pointer-events-none select-none opacity-40 overflow-hidden">
      <svg
        viewBox="0 0 1000 600"
        className="w-full h-full text-cyan-300"
        fill="none"
        stroke="currentColor"
      >
        <g transform="translate(500, 40)">
          <circle r="120" strokeWidth="1.2" strokeOpacity="0.5" strokeDasharray="3 4" />
          <circle r="160" strokeWidth="1.8" strokeOpacity="0.6" />
          <circle r="200" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="6 6" />
          <circle r="240" strokeWidth="2" strokeOpacity="0.7" />
          <circle r="275" strokeWidth="1" strokeOpacity="0.45" />
          <circle r="310" strokeWidth="2.2" strokeOpacity="0.6" />
          <circle r="350" strokeWidth="1.2" strokeOpacity="0.4" strokeDasharray="4 5" />
          <circle r="390" strokeWidth="2" strokeOpacity="0.65" />
          <circle r="430" strokeWidth="1" strokeOpacity="0.35" strokeDasharray="8 6" />

          {Array.from({ length: 36 }).map((_, i) => {
            const angle = (i * 180) / 36 - 90;
            return (
              <g key={`petal-${i}`} transform={`rotate(${angle})`}>
                <path
                  d="M 0 240 C 14 260 14 290 0 310 C -14 290 -14 260 0 240 Z"
                  strokeWidth="1.2"
                  strokeOpacity="0.6"
                  fill="rgba(34, 211, 238, 0.04)"
                />
                <circle cx="0" cy="275" r="2" fill="currentColor" fillOpacity="0.7" />
                <path
                  d="M -12 310 Q 0 340 12 310"
                  strokeWidth="1.4"
                  strokeOpacity="0.55"
                />
                <circle cx="0" cy="345" r="3.2" fill="currentColor" fillOpacity="0.8" />
                <path
                  d="M 0 390 C 18 405 15 425 0 430 C -15 425 -18 405 0 390 Z"
                  strokeWidth="1.2"
                  strokeOpacity="0.5"
                  fill="rgba(34, 211, 238, 0.05)"
                />
              </g>
            );
          })}

          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 180) / 24 - 90;
            return (
              <g key={`inner-loop-${i}`} transform={`rotate(${angle})`}>
                <path
                  d="M -8 160 Q 0 185 8 160"
                  strokeWidth="1.2"
                  strokeOpacity="0.5"
                />
                <circle cx="0" cy="188" r="2" fill="currentColor" fillOpacity="0.65" />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

// 3. Four Corner Rangoli Lace Flourishes
function CornerFlourishes() {
  const cornerSVG = (
    <svg viewBox="0 0 140 140" className="w-24 sm:w-32 md:w-40 h-24 sm:h-32 md:h-40 text-cyan-400/40" fill="none" stroke="currentColor">
      <path d="M 10 10 L 10 70 Q 10 130 70 130 Q 130 130 130 70 L 130 10" strokeWidth="1" strokeOpacity="0.2" />
      <path d="M 12 12 Q 12 50 35 72 Q 58 95 96 96" strokeWidth="1.5" strokeOpacity="0.6" />
      <path d="M 22 12 Q 22 45 42 65 Q 62 85 96 85" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="3 3" />
      <circle cx="20" cy="20" r="4" fill="currentColor" fillOpacity="0.6" />
      <circle cx="36" cy="36" r="3" fill="currentColor" fillOpacity="0.5" />
      <circle cx="56" cy="56" r="3" fill="currentColor" fillOpacity="0.5" />
      <path d="M 14 40 C 25 45 35 35 25 22 C 18 30 15 35 14 40 Z" strokeWidth="1.2" strokeOpacity="0.5" fill="rgba(34,211,238,0.06)" />
      <path d="M 40 14 C 45 25 35 35 22 25 C 30 18 35 15 40 14 Z" strokeWidth="1.2" strokeOpacity="0.5" fill="rgba(34,211,238,0.06)" />
    </svg>
  );

  return (
    <>
      <div className="absolute top-3 left-3 pointer-events-none select-none">{cornerSVG}</div>
      <div className="absolute top-3 right-3 pointer-events-none select-none scale-x-[-1]">{cornerSVG}</div>
      <div className="absolute bottom-16 sm:bottom-20 left-3 pointer-events-none select-none scale-y-[-1]">{cornerSVG}</div>
      <div className="absolute bottom-16 sm:bottom-20 right-3 pointer-events-none select-none scale-[-1]">{cornerSVG}</div>
    </>
  );
}

// 4. Burning Sparkler Fuse & Crackling Phuljhadi Firework Sparks
function SparklerFuse() {
  return (
    <div className="absolute -top-16 sm:-top-20 md:-top-24 right-1/2 translate-x-12 sm:translate-x-16 md:translate-x-20 w-28 sm:w-36 md:w-44 h-28 sm:h-36 md:h-44 pointer-events-none select-none z-20">
      {/* Twisted Rope Fuse (batti) curving out of the Photoshop icon */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible"
        fill="none"
      >
        <path
          d="M 12 94 C 20 65, 45 52, 68 28"
          stroke="#fde047"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeDasharray="4 2"
          className="drop-shadow-[0_0_8px_rgba(250,204,21,0.85)]"
        />
        <path
          d="M 12 94 C 20 65, 45 52, 68 28"
          stroke="#eab308"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Sparkler Burst at the tip (x: 68, y: 28 approx tip of fuse) */}
      <div className="absolute top-[18px] sm:top-[22px] md:top-[28px] right-[24px] sm:right-[32px] md:right-[38px] -translate-x-1/2 -translate-y-1/2">
        {/* Blinding White-Golden Core Glow */}
        <motion.div
          animate={{
            scale: [1, 1.45, 0.9, 1.35, 1],
            opacity: [0.85, 1, 0.75, 1, 0.85],
          }}
          transition={{
            duration: 0.25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-10 h-10 -ml-5 -mt-5 rounded-full bg-radial from-white via-yellow-200 to-amber-500 blur-sm"
        />

        {/* High-intensity outer radial spark burst */}
        <motion.div
          animate={{
            scale: [1, 1.5, 1.1, 1.6, 1],
            opacity: [0.5, 0.85, 0.45, 0.9, 0.5],
          }}
          transition={{
            duration: 0.35,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="w-24 h-24 -ml-12 -mt-12 rounded-full bg-radial from-amber-300/60 via-yellow-400/25 to-transparent blur-md pointer-events-none"
        />

        {/* Radiating Crackling Spark Lines (Phuljhadi Sparkler) */}
        <motion.svg
          animate={{
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: 'linear',
          }}
          viewBox="0 0 120 120"
          className="w-24 sm:w-32 md:w-36 h-24 sm:h-32 md:h-36 -ml-12 sm:-ml-16 md:-ml-18 -mt-12 sm:-mt-16 md:-mt-18 overflow-visible drop-shadow-[0_0_10px_rgba(254,240,138,0.95)]"
        >
          {Array.from({ length: 28 }).map((_, i) => {
            const angle = (i * 360) / 28;
            const length = 20 + ((i * 17) % 36);
            return (
              <motion.line
                key={`spark-${i}`}
                x1="60"
                y1="60"
                x2={60 + length * Math.cos((angle * Math.PI) / 180)}
                y2={60 + length * Math.sin((angle * Math.PI) / 180)}
                stroke={i % 3 === 0 ? '#ffffff' : i % 3 === 1 ? '#fef08a' : '#f59e0b'}
                strokeWidth={i % 2 === 0 ? 1.6 : 1}
                strokeLinecap="round"
                animate={{
                  opacity: [0.3, 1, 0.2, 0.9, 0.3],
                  strokeWidth: [0.8, 2, 0.8, 1.6, 0.8],
                }}
                transition={{
                  duration: 0.18 + (i % 5) * 0.04,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            );
          })}
        </motion.svg>

        {/* Micro-spark particles shooting out */}
        {Array.from({ length: 8 }).map((_, i) => {
          const sparkAngle = (i * 45 * Math.PI) / 180;
          const dist = 35 + (i * 7);
          return (
            <motion.div
              key={`micro-${i}`}
              animate={{
                x: [0, Math.cos(sparkAngle) * dist],
                y: [0, Math.sin(sparkAngle) * dist],
                opacity: [1, 0.8, 0],
                scale: [1.2, 0.8, 0],
              }}
              transition={{
                duration: 0.5 + (i % 3) * 0.15,
                repeat: Infinity,
                delay: i * 0.08,
                ease: 'easeOut',
              }}
              className="absolute top-0 left-0 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#fbbf24]"
            />
          );
        })}
      </div>
    </div>
  );
}

// 5. Multi-colored Sparkler Starbursts (Behind the row of app cards matching screenshot)
function FireworkSparksFountain() {
  const sparkColors = ['#22d3ee', '#fbbf24', '#f43f5e', '#a855f7', '#4ade80', '#ffffff'];

  return (
    <>
      {/* Left Multi-color Starburst (Behind coding & social media cards) */}
      <div className="absolute -top-12 sm:-top-16 left-6 sm:left-14 md:left-24 w-36 sm:w-48 md:w-56 h-36 sm:h-48 md:h-56 pointer-events-none select-none opacity-85 z-0">
        <motion.div
          animate={{
            scale: [0.9, 1.18, 0.88, 1.15, 0.9],
            opacity: [0.6, 1, 0.5, 0.95, 0.6],
            rotate: [0, 30, 0, -25, 0],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-full h-full"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]">
            {Array.from({ length: 26 }).map((_, i) => {
              const a = (i * 360) / 26;
              const len = 16 + ((i * 15) % 32);
              return (
                <line
                  key={`left-fw-${i}`}
                  x1="50"
                  y1="50"
                  x2={50 + len * Math.cos((a * Math.PI) / 180)}
                  y2={50 + len * Math.sin((a * Math.PI) / 180)}
                  stroke={sparkColors[i % sparkColors.length]}
                  strokeWidth={i % 2 === 0 ? '1.4' : '0.9'}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
        </motion.div>
      </div>

      {/* Right Multi-color Starburst (Behind graphic & Meta Ads cards) */}
      <div className="absolute -top-10 sm:-top-14 right-6 sm:right-14 md:right-24 w-36 sm:w-48 md:w-56 h-36 sm:h-48 md:h-56 pointer-events-none select-none opacity-85 z-0">
        <motion.div
          animate={{
            scale: [0.88, 1.2, 0.92, 1.16, 0.88],
            opacity: [0.55, 1, 0.5, 0.9, 0.55],
            rotate: [0, -35, 0, 30, 0],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.25,
          }}
          className="w-full h-full"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(244,63,94,0.7)]">
            {Array.from({ length: 26 }).map((_, i) => {
              const a = (i * 360) / 26;
              const len = 16 + ((i * 13) % 32);
              return (
                <line
                  key={`right-fw-${i}`}
                  x1="50"
                  y1="50"
                  x2={50 + len * Math.cos((a * Math.PI) / 180)}
                  y2={50 + len * Math.sin((a * Math.PI) / 180)}
                  stroke={sparkColors[(i + 2) % sparkColors.length]}
                  strokeWidth={i % 2 === 0 ? '1.4' : '0.9'}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
        </motion.div>
      </div>
    </>
  );
}

export default function DiwaliFestiveSplash({
  onClose,
  duration = 6000, // 6 seconds duration
}: DiwaliFestiveSplashProps) {
  const [progress, setProgress] = useState(100);

  // Auto-dismiss countdown timer (6 seconds)
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (elapsed >= duration) {
        clearInterval(interval);
        onClose?.();
      }
    }, 30);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [duration, onClose]);

  return (
    <motion.aside
      aria-label="Happy Diwali Festive Greeting"
      role="dialog"
      aria-modal="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03, filter: 'blur(8px)' }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[9999] flex flex-col justify-between items-center overflow-hidden select-none bg-gradient-to-b from-[#021822] via-[#053747] to-[#01141c]"
    >
      {/* Deep Teal/Cyan Radial Light Bloom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 48%, rgba(8, 92, 116, 0.65) 0%, rgba(3, 38, 51, 0.85) 60%, rgba(1, 17, 24, 0.98) 100%)',
        }}
      />

      {/* Top Countdown Progress Bar (6 Seconds) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-cyan-950/60 z-30">
        <motion.div
          style={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-cyan-400 shadow-[0_0_8px_rgba(250,204,21,0.85)]"
        />
      </div>

      {/* Traditional Indian Mandala Floral Semi-circle in Background */}
      <MandalaArch />

      {/* Corner Filigree Rangoli Flourishes */}
      <CornerFlourishes />

      {/* Floating Sky Lanterns (Akash Kandil) matching reference positioning */}
      <SkyLantern
        className="top-12 sm:top-16 left-6 sm:left-[10%]"
        size={76}
        delay={0}
        duration={4.8}
        driftX={14}
        driftY={20}
      />
      <SkyLantern
        className="top-8 sm:top-12 left-28 sm:left-[22%]"
        size={36}
        delay={0.8}
        duration={5.5}
        driftX={8}
        driftY={14}
      />
      <SkyLantern
        className="top-48 sm:top-56 left-4 sm:left-[6%]"
        size={50}
        delay={1.4}
        duration={4.2}
        driftX={12}
        driftY={16}
      />
      <SkyLantern
        className="top-8 sm:top-12 right-12 sm:right-[18%]"
        size={72}
        delay={0.4}
        duration={4.6}
        driftX={-14}
        driftY={22}
      />
      <SkyLantern
        className="top-14 sm:top-20 right-4 sm:right-[7%]"
        size={38}
        delay={1.2}
        duration={5.2}
        driftX={-10}
        driftY={16}
      />
      <SkyLantern
        className="top-52 sm:top-60 right-6 sm:right-[9%]"
        size={46}
        delay={0.6}
        duration={4.4}
        driftX={-12}
        driftY={18}
      />

      {/* CENTERPIECE: Tech & Creative Stack & Diwali Typography */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-5xl px-3 sm:px-4 my-auto">
        {/* Firework Sparks Fountains shooting behind the cards */}
        <FireworkSparksFountain />

        {/* The Row of 5 App "Firecracker" Cards (React, Instagram, Photoshop Ps Hero, Illustrator Ai, Meta Ads) */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 25 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center justify-center gap-2 sm:gap-3.5 md:gap-5 pt-12 sm:pt-16 pb-4"
        >
          {/* Sparkler Fuse and Sparks coming out of the center Photoshop box */}
          <SparklerFuse />

          {/* 1. React Card [CODING] */}
          <motion.div
            whileHover={{ y: -6, scale: 1.06 }}
            transition={{ type: 'spring', stiffness: 350, damping: 18 }}
            className="w-13 h-13 sm:w-16 sm:h-16 md:w-22 md:h-22 rounded-2xl sm:rounded-[22px] bg-gradient-to-b from-[#0c2438] to-[#04121d] border-2 border-cyan-400/85 flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.6),0_0_20px_rgba(6,182,212,0.45)] relative overflow-hidden group cursor-pointer"
            title="React / Web Development Coding"
          >
            <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none rounded-t-2xl" />
            <svg
              viewBox="-11.5 -10.23174 23 20.46348"
              className="w-7 h-7 sm:w-9 sm:h-9 md:w-13 md:h-13 text-cyan-400 group-hover:rotate-180 transition-transform duration-700 drop-shadow-[0_0_10px_rgba(34,211,238,0.9)]"
            >
              <circle cx="0" cy="0" r="2.05" fill="currentColor" />
              <g stroke="currentColor" strokeWidth="1" fill="none">
                <ellipse rx="11" ry="4.2" />
                <ellipse rx="11" ry="4.2" transform="rotate(60)" />
                <ellipse rx="11" ry="4.2" transform="rotate(120)" />
              </g>
            </svg>
          </motion.div>

          {/* 2. Instagram Card [SOCIAL MEDIA] */}
          <motion.div
            whileHover={{ y: -6, scale: 1.06 }}
            transition={{ type: 'spring', stiffness: 350, damping: 18 }}
            className="w-13 h-13 sm:w-16 sm:h-16 md:w-22 md:h-22 rounded-2xl sm:rounded-[22px] bg-gradient-to-b from-[#2b0824] via-[#1c051e] to-[#0d0111] border-2 border-pink-500/85 flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.6),0_0_20px_rgba(236,72,153,0.45)] relative overflow-hidden group cursor-pointer"
            title="Instagram / Social Media Marketing"
          >
            <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none rounded-t-2xl" />
            {/* Instagram Camera Glyph with Gradient */}
            <svg
              viewBox="0 0 24 24"
              className="w-7 h-7 sm:w-9 sm:h-9 md:w-12 md:h-12 drop-shadow-[0_0_10px_rgba(244,114,182,0.9)]"
              fill="none"
              stroke="url(#instaGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <defs>
                <linearGradient id="instaGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffbe0b" />
                  <stop offset="35%" stopColor="#fb5607" />
                  <stop offset="70%" stopColor="#ff006e" />
                  <stop offset="100%" stopColor="#8338ec" />
                </linearGradient>
              </defs>
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2.5" />
            </svg>
          </motion.div>

          {/* 3. HERO CENTER: Photoshop (Ps) [GRAPHIC DESIGN & HERO FIRECRACKER] */}
          <motion.div
            whileHover={{ y: -8, scale: 1.08 }}
            transition={{ type: 'spring', stiffness: 350, damping: 18 }}
            className="w-16 h-16 sm:w-22 sm:h-22 md:w-28 md:h-28 -mt-2 sm:-mt-4 rounded-2xl sm:rounded-[26px] bg-gradient-to-b from-[#03283b] via-[#021d2c] to-[#01111a] border-[3px] border-[#00f2fe] flex items-center justify-center shadow-[0_12px_36px_rgba(0,0,0,0.7),0_0_35px_rgba(0,242,254,0.7),inset_0_0_15px_rgba(0,242,254,0.3)] relative overflow-hidden group cursor-pointer z-10"
            title="Adobe Photoshop / Graphic Design & Editing"
          >
            <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-cyan-200/25 to-transparent pointer-events-none rounded-t-2xl" />

            <div className="flex items-baseline tracking-tight font-black select-none">
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-sans drop-shadow-[0_2px_12px_rgba(255,255,255,0.85)]">
                P
              </span>
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#00f2fe] font-sans -ml-0.5 drop-shadow-[0_2px_12px_rgba(0,242,254,0.9)]">
                s
              </span>
            </div>
          </motion.div>

          {/* 4. Adobe Illustrator (Ai) [GRAPHIC DESIGN] */}
          <motion.div
            whileHover={{ y: -6, scale: 1.06 }}
            transition={{ type: 'spring', stiffness: 350, damping: 18 }}
            className="w-13 h-13 sm:w-16 sm:h-16 md:w-22 md:h-22 rounded-2xl sm:rounded-[22px] bg-gradient-to-b from-[#381a05] to-[#1a0a01] border-2 border-orange-500/85 flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.6),0_0_20px_rgba(249,115,22,0.45)] relative overflow-hidden group cursor-pointer"
            title="Adobe Illustrator / Vector & Graphic Design"
          >
            <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none rounded-t-2xl" />
            <div className="flex items-baseline tracking-tight font-black select-none">
              <span className="text-2xl sm:text-3xl md:text-4xl text-[#ff922b] font-sans drop-shadow-[0_2px_8px_rgba(255,146,43,0.85)]">
                A
              </span>
              <span className="text-2xl sm:text-3xl md:text-4xl text-[#ffaa40] font-sans -ml-0.5 drop-shadow-[0_2px_8px_rgba(255,170,64,0.85)]">
                i
              </span>
            </div>
          </motion.div>

          {/* 5. META ADS Card [META ADS / SOCIAL MEDIA ADS] */}
          <motion.div
            whileHover={{ y: -6, scale: 1.06 }}
            transition={{ type: 'spring', stiffness: 350, damping: 18 }}
            className="w-13 h-13 sm:w-16 sm:h-16 md:w-22 md:h-22 rounded-2xl sm:rounded-[22px] bg-gradient-to-b from-[#082247] via-[#041530] to-[#010917] border-2 border-[#0082fb] flex flex-col items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.6),0_0_22px_rgba(0,130,251,0.55),inset_0_0_12px_rgba(0,130,251,0.25)] relative overflow-hidden group cursor-pointer"
            title="Meta Ads / Facebook & Instagram Advertising"
          >
            <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none rounded-t-2xl" />

            {/* Official Meta Continuous Loop Logo */}
            <svg
              viewBox="0 0 256 171"
              className="w-7 h-7 sm:w-9 sm:h-9 md:w-12 md:h-12 drop-shadow-[0_0_10px_rgba(0,130,251,0.9)]"
            >
              <defs>
                <linearGradient id="metaAdsGradient" x1="13.878%" x2="89.144%" y1="55.934%" y2="58.694%">
                  <stop offset="0%" stopColor="#0064E1" />
                  <stop offset="40%" stopColor="#0064E1" />
                  <stop offset="83%" stopColor="#0073EE" />
                  <stop offset="100%" stopColor="#0082FB" />
                </linearGradient>
              </defs>
              <path
                fill="#0081FB"
                d="M27.651 112.136c0 9.775 2.146 17.28 4.95 21.82 3.677 5.947 9.16 8.466 14.751 8.466 7.211 0 13.808-1.79 26.52-19.372 10.185-14.092 22.186-33.874 30.26-46.275l13.675-21.01c9.499-14.591 20.493-30.811 33.1-41.806C161.196 4.985 172.298 0 183.47 0c18.758 0 36.625 10.87 50.3 31.257C248.735 53.584 256 81.707 256 110.729c0 17.253-3.4 29.93-9.187 39.946-5.591 9.686-16.488 19.363-34.818 19.363v-27.616c15.695 0 19.612-14.422 19.612-30.927 0-23.52-5.484-49.623-17.564-68.273-8.574-13.23-19.684-21.313-31.907-21.313-13.22 0-23.859 9.97-35.815 27.75-6.356 9.445-12.882 20.956-20.208 33.944l-8.066 14.289c-16.203 28.728-20.307 35.271-28.408 46.07-14.2 18.91-26.324 26.076-42.287 26.076-18.935 0-30.91-8.2-38.325-20.556C2.973 139.413 0 126.202 0 111.148l27.651.988Z"
              />
              <path
                fill="url(#metaAdsGradient)"
                d="M21.802 33.206C34.48 13.666 52.774 0 73.757 0 85.91 0 97.99 3.597 110.605 13.897c13.798 11.261 28.505 29.805 46.853 60.368l6.58 10.967c15.881 26.459 24.917 40.07 30.205 46.49 6.802 8.243 14.544 12.357 23.231 12.357 10.556 0 19.232-5.111 26.031-15.334 6.799-10.224 10.2-22.18 10.2-35.867 0-21.353-6.529-45.717-19.587-73.09-8.423-17.585-18.826-28.568-31.209-32.951-6.191-2.191-12.671-3.287-19.441-3.287-15.485 0-30.089 7.733-43.811 23.2-12.597 14.15-24.321 32.846-31.173 43.089l-12.34 18.426C51.68 99.412 41.528 113.88 32.78 122.31c-5.83 5.617-12.191 8.426-19.083 8.426-6.626 0-11.96-2.146-16.002-6.438C-4.348 120.005-5 115.342-5 109.813c0-7.859 2.502-16.149 7.505-24.87 5.004-8.721 12.016-19.243 19.297-31.567Z"
              />
            </svg>

            {/* "ADS" Bold Pill Badge */}
            <span className="text-[9px] sm:text-[10px] md:text-xs font-black tracking-widest text-cyan-200 uppercase -mt-0.5 sm:-mt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              ADS
            </span>
          </motion.div>
        </motion.div>

        {/* DIWALI FESTIVAL OF LIGHTS TYPOGRAPHY */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: 'easeOut' }}
          className="flex flex-col items-center text-center mt-3 sm:mt-5 select-none"
        >
          {/* "HAPPY" in crisp tracked uppercase */}
          <div className="text-white/95 text-[11px] sm:text-xs md:text-sm font-bold tracking-[0.45em] sm:tracking-[0.55em] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            H A P P Y
          </div>

          {/* "Diwali" in flowing calligraphy cursive script matching the reference */}
          <div className="relative my-0 sm:my-1">
            <h1
              style={{
                fontFamily: "'Great Vibes', 'Alex Brush', 'Dancing Script', cursive, serif",
              }}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white font-normal leading-[1.05] tracking-wide select-none drop-shadow-[0_4px_24px_rgba(255,255,255,0.7)]"
            >
              Diwali
            </h1>

            {/* Delicate calligraphy underline flourish swash */}
            <svg
              viewBox="0 0 340 40"
              className="w-56 sm:w-72 md:w-88 h-6 sm:h-8 -mt-2 text-cyan-200/90 mx-auto drop-shadow-[0_2px_10px_rgba(255,255,255,0.6)]"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M 10 18 Q 80 34 170 18 Q 260 2 330 22"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="170" cy="18" r="2.5" fill="currentColor" />
            </svg>
          </div>

          {/* "FESTIVAL OF LIGHTS" in spaced modern uppercase */}
          <div className="text-cyan-100/90 text-[10px] sm:text-xs md:text-sm font-semibold tracking-[0.45em] sm:tracking-[0.55em] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            F E S T I V A L &nbsp; O F &nbsp; L I G H T S
          </div>
        </motion.div>
      </div>

      {/* BOTTOM BRANDING BANNER (Matching reference footer bar) */}
      <footer className="relative w-full max-w-5xl px-4 sm:px-8 pb-5 sm:pb-6 z-20">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="w-full bg-white/95 backdrop-blur-md rounded-2xl py-3 px-5 sm:px-8 flex items-center justify-between shadow-[0_10px_35px_rgba(0,0,0,0.4)] border border-white/60"
        >
          {/* Company Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <img
              src="/images/logo/RW.webp"
              alt="RizeWorld"
              className="w-7 h-7 sm:w-9 sm:h-9 object-contain drop-shadow-sm"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/logo/RW.png';
              }}
            />
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm md:text-base font-extrabold tracking-tight text-gray-900 leading-none">
                RIZE WORLD
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold text-cyan-700 tracking-wider uppercase mt-0.5">
                Digital Growth Agency
              </span>
            </div>
          </div>

          {/* Website Link */}
          <a
            href="https://rizeworld.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm font-bold text-cyan-800 hover:text-cyan-600 transition-colors tracking-wide underline underline-offset-4 decoration-cyan-400"
          >
            www.rizeworld.in
          </a>
        </motion.div>
      </footer>
    </motion.aside>
  );
}
