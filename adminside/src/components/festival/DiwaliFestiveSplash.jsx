import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

// Ornate Hanging Diya Hoop Component (Matching reference image)
function HangingDiyaHoop({
  chainHeight = 120,
  swayDuration = 4.2,
  swayAngle = 2.2,
  swayDelay = 0,
  gemColor = '#2a7c37', // Rize Green or Orange
  scale = 1,
  className = '',
}) {
  // 24 decorative filigree loops around the circular hoop
  const hoopRadius = 50;
  const loopRadius = 5.5;
  const numLoops = 24;
  const loops = Array.from({ length: numLoops }).map((_, i) => {
    const angle = (i * 2 * Math.PI) / numLoops;
    const cx = 90 + hoopRadius * Math.cos(angle);
    const cy = 90 + hoopRadius * Math.sin(angle);
    return { cx, cy, angle };
  });

  return (
    <motion.div
      animate={{
        rotate: [-swayAngle, swayAngle, -swayAngle],
      }}
      transition={{
        duration: swayDuration,
        delay: swayDelay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        transformOrigin: 'top center',
        transform: `scale(${scale})`,
      }}
      className={`relative flex flex-col items-center pointer-events-none select-none ${className}`}
    >
      {/* 1. Golden Hanging Beaded Chain from Top */}
      <div
        style={{ height: `${chainHeight}px` }}
        className="w-1.5 flex flex-col items-center justify-between overflow-hidden"
      >
        <div className="w-[1.5px] h-full bg-gradient-to-b from-amber-200/40 via-yellow-400 to-amber-500 shadow-[0_0_6px_rgba(251,191,36,0.5)]" />
      </div>

      {/* Chain link ring connector */}
      <div className="-mt-1 w-3.5 h-3.5 rounded-full border-2 border-yellow-300 bg-amber-600/40 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />

      {/* 2. Ornate Filigree Hoop with Diya Inside & Pendant Below */}
      <div className="relative w-44 sm:w-52 h-52 sm:h-60 -mt-1 flex items-center justify-center">
        {/* Warm Golden Candlelight Halo Glow */}
        <motion.div
          animate={{
            scale: [1, 1.22, 0.98, 1.15, 1],
            opacity: [0.65, 0.92, 0.6, 0.88, 0.65],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full bg-radial from-amber-400/45 via-orange-500/25 to-transparent blur-xl pointer-events-none"
        />

        <svg
          viewBox="0 0 180 200"
          className="w-full h-full overflow-visible drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
        >
          <defs>
            {/* Metallic Gold Gradient for Ornate Ring & Chain */}
            <linearGradient id="goldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="25%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#fef08a" />
              <stop offset="75%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>

            {/* Bronze/Clay Gradient for Diya Bowl */}
            <linearGradient id="diyaBowlGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="40%" stopColor="#451a03" />
              <stop offset="100%" stopColor="#1e0c03" />
            </linearGradient>

            {/* Vibrant Festive Flame Gradient */}
            <linearGradient id="vibrantFlame" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="20%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="80%" stopColor="#ee591e" /> {/* Rize Orange */}
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>

            {/* Subtle glow filter */}
            <filter id="diyaGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* A. Outer Ornate Filigree Ring (24 decorative swirl loops) */}
          <g>
            {/* Outer decorative scallop loops */}
            {loops.map((loop, idx) => (
              <circle
                key={idx}
                cx={loop.cx}
                cy={loop.cy}
                r={loopRadius}
                fill="none"
                stroke="url(#goldMetallic)"
                strokeWidth="1.6"
              />
            ))}

            {/* Inner Concentric Golden Rings */}
            <circle
              cx="90"
              cy="90"
              r={hoopRadius - 4}
              fill="none"
              stroke="url(#goldMetallic)"
              strokeWidth="2.5"
            />
            <circle
              cx="90"
              cy="90"
              r={hoopRadius - 9}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="1"
              opacity="0.8"
            />
          </g>

          {/* B. The Diya Base Sitting Inside the Ring */}
          <g>
            {/* Diya Clay Bowl */}
            <path
              d="M 52 92 C 58 116, 122 116, 128 92 C 114 98, 66 98, 52 92 Z"
              fill="url(#diyaBowlGrad)"
              stroke="url(#goldMetallic)"
              strokeWidth="1.2"
            />

            {/* Diya Golden Rim */}
            <ellipse
              cx="90"
              cy="92"
              rx="38"
              ry="7.5"
              fill="#592508"
              stroke="url(#goldMetallic)"
              strokeWidth="2"
            />

            {/* Inner Glowing Oil Basin with Rize Orange Tone */}
            <ellipse cx="90" cy="93" rx="30" ry="5" fill="#2d1003" />
            <ellipse cx="90" cy="93.5" rx="22" ry="3.5" fill="#ee591e" opacity="0.6" />
          </g>

          {/* C. Luminous Flickering Flame */}
          <motion.g
            animate={{
              scaleY: [1, 1.15, 0.94, 1.1, 1],
              scaleX: [1, 0.93, 1.05, 0.95, 1],
              rotate: [-1.2, 1.5, -1.8, 1.2, -1.2],
            }}
            transition={{
              duration: 1.15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: '90px 80px' }}
          >
            {/* Outer Flame */}
            <path
              d="M 90 40 C 99 58, 102 72, 97 82 C 94 86, 86 86, 83 82 C 78 72, 81 58, 90 40 Z"
              fill="url(#vibrantFlame)"
              filter="url(#diyaGlow)"
            />
            {/* Inner White-Hot Core */}
            <path
              d="M 90 52 C 95 64, 96 74, 93 80 C 91 82, 89 82, 87 80 C 84 74, 85 64, 90 52 Z"
              fill="#ffffff"
              opacity="0.95"
            />
          </motion.g>

          {/* D. Decorative Golden Bottom Filigree Pendant */}
          <g>
            {/* Top Connector Ring */}
            <circle cx="90" cy="144" r="3.5" fill="none" stroke="url(#goldMetallic)" strokeWidth="1.8" />
            {/* Filigree Swirls */}
            <path
              d="M 90 148 C 82 158, 76 168, 86 174 C 92 178, 98 172, 90 166 C 82 172, 88 178, 94 174 C 104 168, 98 158, 90 148 Z"
              fill="none"
              stroke="url(#goldMetallic)"
              strokeWidth="2"
            />
            {/* Bottom Accent Jewel (Rize Emerald Green / Saffron Orange) */}
            <circle
              cx="90"
              cy="182"
              r="4.5"
              fill={gemColor}
              stroke="url(#goldMetallic)"
              strokeWidth="1.5"
              className="drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]"
            />
            <circle cx="90" cy="182" r="1.5" fill="#ffffff" opacity="0.8" />
          </g>
        </svg>
      </div>
    </motion.div>
  );
}

export default function DiwaliFestiveSplash({ onClose, duration = 2800 }) {
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

  // Golden bokeh lights and sparkling stars in the night sky (like reference)
  const bokehLights = [
    { top: '12%', left: '8%', size: 48, opacity: 0.18, delay: 0 },
    { top: '25%', left: '22%', size: 64, opacity: 0.22, delay: 0.3 },
    { top: '18%', right: '14%', size: 56, opacity: 0.25, delay: 0.6 },
    { top: '55%', right: '8%', size: 72, opacity: 0.15, delay: 0.2 },
    { top: '65%', left: '15%', size: 52, opacity: 0.2, delay: 0.5 },
    { top: '78%', right: '28%', size: 60, opacity: 0.18, delay: 0.4 },
  ];

  const stars = [
    { top: '8%', left: '18%', size: 2.5, delay: 0.1 },
    { top: '15%', left: '38%', size: 2, delay: 0.4 },
    { top: '22%', right: '32%', size: 3, delay: 0.2 },
    { top: '12%', right: '10%', size: 2, delay: 0.6 },
    { top: '42%', left: '28%', size: 2.5, delay: 0.3 },
    { top: '48%', right: '18%', size: 3, delay: 0.5 },
    { top: '68%', left: '42%', size: 2, delay: 0.2 },
    { top: '75%', right: '12%', size: 2.5, delay: 0.7 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.45, ease: 'easeInOut' } }}
      onClick={handleDismiss}
      className="fixed inset-0 z-[999999] flex items-center justify-center overflow-hidden text-white select-none cursor-pointer"
      style={{
        background: 'radial-gradient(ellipse at 65% 50%, #0d2753 0%, #081a3d 40%, #040e24 75%, #020712 100%)',
      }}
    >
      {/* 1. EXPANDING RADIAL LIGHT BLOOM ("start from center then big") */}
      <motion.div
        initial={{ scale: 0.1, opacity: 1 }}
        animate={{ scale: [0.1, 1.8, 3.2], opacity: [1, 0.65, 0.18] }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-radial from-amber-400/40 via-yellow-500/20 to-transparent blur-3xl pointer-events-none"
      />

      {/* Rize Brand Ambient Auras (Emerald Green + Saffron Orange) */}
      <div className="absolute top-1/4 left-1/6 w-96 h-96 rounded-full bg-[#2a7c37]/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/6 w-96 h-96 rounded-full bg-[#ee591e]/20 blur-[130px] pointer-events-none" />

      {/* Subtle Elegant Floral Mandala / Lace Watermark in Deep Blue */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[700px] sm:h-[900px] opacity-[0.07] pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full stroke-cyan-200 fill-none" strokeWidth="0.6">
          <circle cx="100" cy="100" r="95" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="75" />
          <circle cx="100" cy="100" r="55" />
          <circle cx="100" cy="100" r="35" strokeDasharray="2 2" />
          {[...Array(16)].map((_, i) => (
            <path
              key={i}
              d="M100 25 C115 50 115 70 100 85 C85 70 85 50 100 25 Z"
              transform={`rotate(${i * 22.5} 100 100)`}
            />
          ))}
        </svg>
      </div>

      {/* Golden Bokeh Lights Floating in Night Sky */}
      {bokehLights.map((b, i) => (
        <motion.div
          key={i}
          animate={{
            opacity: [b.opacity, b.opacity * 1.5, b.opacity],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 3 + i,
            delay: b.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            top: b.top,
            left: b.left,
            right: b.right,
            width: `${b.size}px`,
            height: `${b.size}px`,
          }}
          className="absolute rounded-full bg-radial from-amber-200/40 via-yellow-400/20 to-transparent blur-md pointer-events-none"
        />
      ))}

      {/* Twinkling Golden Star Dots */}
      {stars.map((s, i) => (
        <motion.div
          key={`star-${i}`}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1.4, 0.8],
          }}
          transition={{
            duration: 1.8 + (i % 3) * 0.4,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            top: s.top,
            left: s.left,
            right: s.right,
            width: `${s.size}px`,
            height: `${s.size}px`,
          }}
          className="absolute rounded-full bg-yellow-200 shadow-[0_0_6px_#fde047] pointer-events-none"
        />
      ))}

      {/* Top Bar with Minimalist Skip Button */}
      <div className="absolute top-5 right-5 sm:top-7 sm:right-8 z-30">
        <button
          onClick={handleDismiss}
          className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-amber-300/30 text-amber-200 hover:text-white text-xs font-medium backdrop-blur-md transition-all shadow-sm active:scale-95"
          title="Press Esc or click anywhere to skip"
        >
          <span>Skip</span>
          <X size={13} className="group-hover:rotate-90 transition-transform duration-200" />
        </button>
      </div>

      {/* 2. MAIN FESTIVE STAGE (CENTER-TO-BIG SCALE ANIMATION) */}
      <motion.div
        initial={{ scale: 0.25, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1], // Smooth organic deceleration from center to full size
        }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 flex flex-col lg:flex-row items-center justify-between min-h-[500px]"
      >
        {/* LEFT / CENTER: 3 ORNATE HANGING DIYA HOOPS (Matching Reference Image) */}
        <div className="relative flex items-start justify-center gap-2 sm:gap-6 lg:gap-8 w-full lg:w-1/2 pt-2 sm:pt-6">
          {/* Hanging Diya 1 (Left - Medium Chain) */}
          <HangingDiyaHoop
            chainHeight={100}
            swayDuration={4.0}
            swayAngle={2.4}
            swayDelay={0}
            gemColor="#2a7c37" // Rize Emerald Green
            scale={0.92}
            className="hidden sm:flex"
          />

          {/* Hanging Diya 2 (Center - Longest Chain, Lower Hanging) */}
          <HangingDiyaHoop
            chainHeight={190}
            swayDuration={4.6}
            swayAngle={1.8}
            swayDelay={0.4}
            gemColor="#ee591e" // Rize Saffron Orange
            scale={1.05}
          />

          {/* Hanging Diya 3 (Right - Shortest Chain, Higher Hanging) */}
          <HangingDiyaHoop
            chainHeight={75}
            swayDuration={3.8}
            swayAngle={2.6}
            swayDelay={0.8}
            gemColor="#fbbf24" // Sparkling Gold
            scale={1}
          />
        </div>

        {/* RIGHT SIDE: LUXURIOUS GOLDEN CALLIGRAPHY & WISHES (Matching Reference Image) */}
        <div className="relative flex flex-col items-center lg:items-end text-center lg:text-right w-full lg:w-1/2 mt-8 lg:mt-0 lg:pr-6">
          {/* Subtle Top Salutation */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-amber-200/80 text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase mb-1 drop-shadow-sm flex items-center gap-2"
            style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          >
            <span>✨</span>
            <span>SHUBH DEEPAVALI</span>
            <span>✨</span>
          </motion.div>

          {/* "Happy" Serif Typography */}
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.5 }}
            className="text-amber-100/90 text-2xl sm:text-3xl md:text-4xl font-normal tracking-[0.25em] uppercase drop-shadow-[0_2px_12px_rgba(251,191,36,0.3)]"
            style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          >
            Happy
          </motion.span>

          {/* "Diwali" Grand 3D Golden Calligraphy (Exact Reference Style) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <h1
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-normal tracking-wide py-1 select-none leading-none"
              style={{
                fontFamily: "'Great Vibes', cursive, 'Brush Script MT', serif",
                background: 'linear-gradient(135deg, #fffbeb 0%, #fef08a 25%, #fbbf24 50%, #f59e0b 75%, #ee591e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 4px 28px rgba(251, 191, 36, 0.55)) drop-shadow(0 2px 8px rgba(238, 89, 30, 0.45))',
              }}
            >
              Diwali
            </h1>

            {/* Sparkling Lens Flare Glint on the letter "i" */}
            <motion.div
              animate={{
                scale: [0.8, 1.35, 0.8],
                opacity: [0.6, 1, 0.6],
                rotate: [0, 90, 0],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -top-1 left-[28%] text-yellow-100 pointer-events-none drop-shadow-[0_0_12px_#ffffff]"
            >
              <Sparkles size={22} />
            </motion.div>
          </motion.div>

          {/* "A festival of light" Cursive Script Underneath (Exact Reference Style) */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="text-amber-100/90 text-xl sm:text-2xl md:text-3xl font-normal italic tracking-wider mb-3 drop-shadow-sm"
            style={{ fontFamily: "'Great Vibes', cursive, serif" }}
          >
            A festival of light
          </motion.p>

          {/* Authentic Hindi Greeting */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="text-amber-200/85 text-xs sm:text-sm font-medium tracking-wide mb-5 drop-shadow-sm"
          >
            दीपावली की हार्दिक शुभकामनाएं
          </motion.p>

          {/* Brand Signature with RizeWorld Logo & Logo Brand Colors */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.5 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-md shadow-2xl"
          >
            <img
              src="/images/logo_img.png"
              alt="RizeWorld"
              className="h-6 sm:h-7 w-auto object-contain brightness-125 contrast-110"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="h-4 w-[1px] bg-white/20" />
            <span className="text-xs sm:text-sm font-medium text-amber-100/90">
              Wishing You <span className="text-[#ee591e] font-bold">Joy</span> & <span className="text-[#2a7c37] font-bold">Prosperity</span>
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Slim Golden Countdown Progress Line at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          className="h-full bg-gradient-to-r from-[#2a7c37] via-yellow-300 to-[#ee591e] shadow-[0_0_12px_rgba(251,191,36,0.8)]"
        />
      </div>
    </motion.div>
  );
}
