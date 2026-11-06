import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// ============================================================================
// 1. INTERACTIVE SPARKLER (PHULJHADI) CURSOR TRAIL (Ultra-smooth 60fps Canvas)
// ============================================================================
function SparklerCursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      size: number;
      color: string;
      sparkle: number;
      decay: number;
    }

    const particles: Particle[] = [];
    const colors = ['#ffffff', '#fef08a', '#fbbf24', '#f59e0b', '#f97316', '#e0e7ff'];

    const spawnSparks = (x: number, y: number, count = 3) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.8 + Math.random() * 2.5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed + 0.3,
          alpha: 1,
          size: 1.5 + Math.random() * 2.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          sparkle: Math.random() * Math.PI,
          decay: 0.02 + Math.random() * 0.025,
        });
      }
    };

    let lastMoveTime = 0;
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const now = performance.now();
      if (now - lastMoveTime < 16) return;
      lastMoveTime = now;

      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      spawnSparks(clientX, clientY, 4);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.03;
        p.alpha -= p.decay;
        p.sparkle += 0.2;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const flicker = Math.sin(p.sparkle) * 0.3 + 0.7;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha * flicker);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.size > 2) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(p.x - p.size * 1.5, p.y);
          ctx.lineTo(p.x + p.size * 1.5, p.y);
          ctx.moveTo(p.x, p.y - p.size * 1.5);
          ctx.lineTo(p.x, p.y + p.size * 1.5);
          ctx.stroke();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9998] select-none"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}

// ============================================================================
// 2. DIWALI FESTIVE FAIRY LIGHTS (Jagmagaati Jhalar Garland across Top Edge)
// ============================================================================
function DiwaliFestiveJhalar() {
  // 30 rich Diwali fairy light bulbs with curtain drop heights and vibrant festive colors
  const fairyPalette = [
    { color: '#fbbf24', shadow: '#f59e0b', glow: 'rgba(251,191,36,0.9)' }, // Amber Gold
    { color: '#f97316', shadow: '#ea580c', glow: 'rgba(249,115,22,0.9)' }, // Saffron Orange
    { color: '#22c55e', shadow: '#16a34a', glow: 'rgba(34,197,94,0.85)' }, // Emerald Green
    { color: '#f43f5e', shadow: '#e11d48', glow: 'rgba(244,63,94,0.9)' },  // Ruby Red
    { color: '#facc15', shadow: '#ca8a04', glow: 'rgba(250,204,21,0.9)' }, // Bright Yellow
    { color: '#06b6d4', shadow: '#0891b2', glow: 'rgba(6,182,212,0.85)' }, // Cyan Sky
    { color: '#c084fc', shadow: '#9333ea', glow: 'rgba(192,132,252,0.85)' }, // Royal Violet
  ];

  // Alternating drop heights for authentic festive curtain jhalar look
  const dropHeights = [14, 26, 18, 34, 20, 28, 16, 32, 22, 18, 30, 24, 16, 36, 20];

  const bulbs = Array.from({ length: 30 }).map((_, i) => {
    const pal = fairyPalette[i % fairyPalette.length];
    const height = dropHeights[i % dropHeights.length];
    return {
      ...pal,
      height,
      delay: (i * 0.16) % 1.6,
      dur: 1.3 + (i % 5) * 0.25,
    };
  });

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[96] pointer-events-none select-none overflow-visible"
    >
      {/* 1. Golden Swag Garland Wire across screen */}
      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-amber-500 via-yellow-300 via-amber-400 to-amber-500 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />

      {/* 2. Hanging Jhalar Bulbs */}
      <div className="w-full flex items-start justify-between px-2 sm:px-6 md:px-12">
        {bulbs.map((bulb, idx) => (
          <div key={`jhalar-${idx}`} className="flex flex-col items-center">
            {/* Hanging copper wire drop */}
            <div
              style={{ height: `${bulb.height}px` }}
              className="w-[1.2px] bg-gradient-to-b from-amber-400/80 via-amber-500/60 to-amber-600/90"
            />

            {/* Miniature Bulb Socket */}
            <div className="w-2 h-1 bg-[#261504] border-t border-amber-400/80 rounded-t-xs -mb-[1px] z-10" />

            {/* Glowing Teardrop Fairy Light Bulb */}
            <motion.div
              animate={{
                opacity: [0.65, 1, 0.65],
                scale: [0.88, 1.2, 0.88],
              }}
              transition={{
                duration: bulb.dur,
                delay: bulb.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                backgroundColor: bulb.color,
                boxShadow: `0 0 10px 2.5px ${bulb.shadow}, 0 0 20px 5px ${bulb.glow}`,
              }}
              className="relative w-3 h-4 sm:w-3.5 sm:h-4.5 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] flex items-center justify-center z-20"
            >
              {/* Hot White Glowing Filament Core */}
              <div className="w-1.5 h-1.5 rounded-full bg-white/95 shadow-[0_0_4px_#fff]" />
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 3. ORNATE HANGING DIWALI AKASH KANDIL / ROYAL LANTERNS (Side Lamps)
// ============================================================================
function HangingAkashKandil({
  size = 64,
  chainLength = 70,
  swayDuration = 4.8,
  swayDelay = 0,
  color = 'saffron',
}: {
  size?: number;
  chainLength?: number;
  swayDuration?: number;
  swayDelay?: number;
  color?: 'saffron' | 'crimson';
}) {
  const isCrimson = color === 'crimson';
  const primaryColor = isCrimson ? '#f43f5e' : '#f97316';
  const secondaryColor = isCrimson ? '#be123c' : '#c2410c';
  const glowColor = isCrimson ? 'rgba(244,63,94,0.7)' : 'rgba(251,191,36,0.75)';

  return (
    <motion.div
      animate={{ rotate: [-2.2, 2.2, -2.2] }}
      transition={{
        duration: swayDuration,
        delay: swayDelay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{ transformOrigin: 'top center' }}
      className="relative flex flex-col items-center select-none pointer-events-none drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
    >
      {/* 1. Golden Brass Suspension Chain */}
      <div
        style={{ height: `${chainLength}px` }}
        className="w-[2px] bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-500 shadow-[0_0_8px_rgba(251,191,36,0.7)] relative flex flex-col justify-between items-center"
      >
        {Array.from({ length: Math.max(3, Math.floor(chainLength / 14)) }).map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full border border-amber-200 bg-amber-600/90 -my-0.5 shadow-2xs"
          />
        ))}
      </div>

      {/* 2. Top Brass Canopy / Hanging Ring */}
      <div className="w-5 h-2.5 rounded-t-full bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 border border-amber-300 shadow-xs -mt-0.5 z-10" />

      {/* 3. The Royal Kandil Lantern Body */}
      <div className="relative" style={{ width: `${size}px`, height: `${size * 1.35}px` }}>
        {/* Pulsating Warm Ambient Radial Halo Bloom */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.65, 0.95, 0.65],
          }}
          transition={{
            duration: 1.8,
            delay: swayDelay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            background: `radial-gradient(circle, ${glowColor} 0%, rgba(251,191,36,0.3) 50%, transparent 75%)`,
          }}
          className="absolute inset-0 rounded-full blur-lg pointer-events-none -m-4"
        />

        <svg viewBox="0 0 100 135" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id={`kandilGrad-${color}-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="50%" stopColor={secondaryColor} />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <radialGradient id={`kandilCore-${color}-${size}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#fef08a" />
              <stop offset="70%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor={secondaryColor} />
            </radialGradient>
          </defs>

          {/* Top Pyramid Cap */}
          <polygon points="50,4 82,30 18,30" fill="#b45309" stroke="#fde047" strokeWidth="1.5" />
          <polygon points="50,4 70,30 30,30" fill="#d97706" />

          {/* Main Hexagon/Diamond Kandil Body */}
          <polygon
            points="18,30 82,30 94,68 50,98 6,68"
            fill={`url(#kandilGrad-${color}-${size})`}
            stroke="#fbbf24"
            strokeWidth="2"
          />

          {/* Glowing Inner Cutout Window */}
          <polygon
            points="32,40 68,40 78,66 50,86 22,66"
            fill={`url(#kandilCore-${color}-${size})`}
            stroke="#fef08a"
            strokeWidth="1.5"
          />

          {/* Intricate Indian Star Cutwork */}
          <path
            d="M 50 48 L 54 58 L 65 58 L 56 65 L 59 75 L 50 69 L 41 75 L 44 65 L 35 58 L 46 58 Z"
            fill="#ffffff"
            opacity="0.95"
            className="drop-shadow-[0_0_6px_#fff]"
          />

          {/* Side Triangular Facets with Golden Borders */}
          <polygon points="18,30 32,40 22,66 6,68" fill="#ca8a04" opacity="0.65" stroke="#fbbf24" strokeWidth="0.8" />
          <polygon points="82,30 68,40 78,66 94,68" fill="#ca8a04" opacity="0.65" stroke="#fbbf24" strokeWidth="0.8" />

          {/* Lower Decorative Brass Rim */}
          <rect x="25" y="96" width="50" height="4.5" rx="2" fill="#d97706" stroke="#fef08a" strokeWidth="1" />
          {/* Small Brass Dangling Bells */}
          <circle cx="35" cy="104" r="3" fill="#facc15" stroke="#78350f" strokeWidth="0.6" />
          <circle cx="50" cy="105" r="3.5" fill="#facc15" stroke="#78350f" strokeWidth="0.6" />
          <circle cx="65" cy="104" r="3" fill="#facc15" stroke="#78350f" strokeWidth="0.6" />
        </svg>

        {/* 4. Hanging Golden Ribbons / Frills (तोरण झालर Latkan) */}
        <motion.div
          animate={{ rotate: [-3.5, 3.5, -3.5] }}
          transition={{
            duration: swayDuration * 0.85,
            delay: swayDelay + 0.25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: 'top center' }}
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-start justify-center gap-1.5 w-full pointer-events-none"
        >
          <div className="w-[2px] h-8 bg-gradient-to-b from-amber-400 via-orange-400 to-transparent shadow-xs" />
          <div className="w-[2.2px] h-12 bg-gradient-to-b from-yellow-300 via-amber-400 to-transparent shadow-xs" />
          <div className="w-[3px] h-16 bg-gradient-to-b from-yellow-100 via-yellow-400 to-transparent shadow-[0_0_6px_rgba(250,204,21,0.8)]" />
          <div className="w-[2.2px] h-12 bg-gradient-to-b from-yellow-300 via-amber-400 to-transparent shadow-xs" />
          <div className="w-[2px] h-8 bg-gradient-to-b from-amber-400 via-orange-400 to-transparent shadow-xs" />
        </motion.div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// 4. SIDE HANGING LAMPS (Left & Right Viewport Festive Lanterns)
// ============================================================================
function DiwaliSideHangingLamps() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none z-[95] overflow-visible"
    >
      {/* LEFT SIDE LAMPS */}
      <div className="absolute top-0 left-2 sm:left-6 md:left-8 flex items-start gap-4">
        {/* Main Left Lantern */}
        <div className="scale-80 sm:scale-95 md:scale-100 origin-top">
          <HangingAkashKandil
            size={62}
            chainLength={75}
            swayDuration={5.2}
            swayDelay={0}
            color="saffron"
          />
        </div>

        {/* Secondary Left Lantern (Higher & smaller for artistic depth - hidden on very small mobile) */}
        <div className="hidden sm:block scale-80 md:scale-90 origin-top -ml-2">
          <HangingAkashKandil
            size={46}
            chainLength={38}
            swayDuration={4.4}
            swayDelay={0.8}
            color="crimson"
          />
        </div>
      </div>

      {/* RIGHT SIDE LAMPS */}
      <div className="absolute top-0 right-2 sm:right-6 md:right-8 flex items-start gap-4 flex-row-reverse">
        {/* Main Right Lantern */}
        <div className="scale-80 sm:scale-95 md:scale-100 origin-top">
          <HangingAkashKandil
            size={62}
            chainLength={80}
            swayDuration={5.0}
            swayDelay={0.4}
            color="saffron"
          />
        </div>

        {/* Secondary Right Lantern (Higher & smaller - hidden on very small mobile) */}
        <div className="hidden sm:block scale-80 md:scale-90 origin-top -mr-2">
          <HangingAkashKandil
            size={46}
            chainLength={42}
            swayDuration={4.6}
            swayDelay={1.1}
            color="crimson"
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN SITE-WIDE FESTIVE DECOR COMPONENT (Exported for App.tsx)
// ============================================================================
export default function DiwaliSiteDecor() {
  return (
    <div aria-hidden="true" className="contents">
      {/* 1. Interactive Sparkler (Phuljhadi) Mouse & Touch Trail */}
      <SparklerCursorTrail />

      {/* 2. Top Jagmagaati Diwali Fairy Lights (Garland Jhalar) */}
      <DiwaliFestiveJhalar />

      {/* 3. Traditional Hanging Diwali Side Lamps / Akash Kandils */}
      <DiwaliSideHangingLamps />
    </div>
  );
}
