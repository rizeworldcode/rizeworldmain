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
          vy: Math.sin(angle) * speed + 0.3, // slight downward drift
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
      if (now - lastMoveTime < 16) return; // throttle to ~60fps
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

    // Listen for custom trigger to burst fireworks (e.g. clicking diya)
    const handleFireworkBurst = (e: CustomEvent<{ x: number; y: number }>) => {
      const bx = e.detail?.x || width / 2;
      const by = e.detail?.y || height / 2;
      for (let i = 0; i < 45; i++) {
        const angle = (i * Math.PI * 2) / 45;
        const speed = 2 + Math.random() * 4.5;
        particles.push({
          x: bx,
          y: by,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          size: 2 + Math.random() * 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          sparkle: Math.random() * Math.PI,
          decay: 0.015 + Math.random() * 0.02,
        });
      }
    };
    window.addEventListener('rize_diwali_firework' as any, handleFireworkBurst);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // gravity
        p.vx *= 0.98; // air drag
        p.alpha -= p.decay;
        p.sparkle += 0.3;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Draw twinkling spark particle with soft light aura
        const flicker = 0.7 + Math.sin(p.sparkle) * 0.3;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha * flicker);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fillStyle = p.color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // 4-point star glint for larger particles
        if (p.size > 2.5) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(p.x - p.size * 1.6, p.y);
          ctx.lineTo(p.x + p.size * 1.6, p.y);
          ctx.moveTo(p.x, p.y - p.size * 1.6);
          ctx.lineTo(p.x, p.y + p.size * 1.6);
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
      window.removeEventListener('rize_diwali_firework' as any, handleFireworkBurst);
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
// 2. MINIMALIST LUXURY GOLDEN FAIRY LIGHT WIRE (Ultra-thin Golden Micro LEDs)
// ============================================================================
function LuxuryGoldenFairyWire() {
  // 24 subtle, warm micro-LEDs along top edge
  const leds = Array.from({ length: 24 }).map((_, i) => ({
    delay: (i * 0.18) % 1.8,
    dur: 1.4 + (i % 4) * 0.3,
    color: i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#f59e0b' : '#fef08a',
  }));

  return (
    <div className="fixed top-0 left-0 right-0 z-[96] pointer-events-none select-none h-4 overflow-hidden">
      {/* Delicate golden copper wire */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

      {/* Warm Golden Micro LED Drops */}
      <div className="w-full flex items-start justify-between px-4 sm:px-8">
        {leds.map((led, idx) => (
          <div key={`led-${idx}`} className="flex flex-col items-center">
            {/* Fine wire drop */}
            <div className="w-[0.8px] h-2 bg-gradient-to-b from-amber-400/40 to-amber-500/80" />
            {/* Glowing Golden Micro LED */}
            <motion.div
              animate={{
                opacity: [0.55, 1, 0.55],
                scale: [0.85, 1.25, 0.85],
              }}
              transition={{
                duration: led.dur,
                delay: led.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                backgroundColor: led.color,
                boxShadow: `0 0 8px 2px rgba(251,191,36,0.75)`,
              }}
              className="w-1.5 h-1.5 rounded-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 3. ELEGANT FLOATING FESTIVE DIYA PILL (Bottom-Left Corner)
// ============================================================================
function FloatingDiyaPill() {
  const [isOpen, setIsOpen] = useState(true);
  const [flicker, setFlicker] = useState(false);

  const triggerCelebration = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    window.dispatchEvent(
      new CustomEvent('rize_diwali_firework', {
        detail: { x: rect.left + rect.width / 2, y: rect.top },
      })
    );
    setFlicker(true);
    setTimeout(() => setFlicker(false), 600);
  };

  if (!isOpen) return null;

  return (
    <motion.aside
      aria-label="Diwali Celebration"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="fixed bottom-6 left-6 z-[90] select-none"
    >
      <div
        onClick={triggerCelebration}
        title="Happy Diwali from RizeWorld! Click for festive sparks ✨"
        className="group relative flex items-center gap-3 px-3.5 py-2 rounded-full bg-gradient-to-r from-slate-950/90 via-[#1a1205]/95 to-slate-950/90 text-amber-100 border border-amber-400/40 hover:border-amber-400/80 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.5),0_0_18px_rgba(251,191,36,0.25)] hover:shadow-[0_8px_32px_rgba(251,191,36,0.4)] transition-all duration-300 cursor-pointer active:scale-95"
      >
        {/* Golden Diya with Dancing Flame */}
        <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
          {/* Flame Halo Bloom */}
          <motion.div
            animate={{
              scale: flicker ? [1, 1.8, 1] : [1, 1.3, 1],
              opacity: flicker ? [0.8, 1, 0.8] : [0.6, 0.9, 0.6],
            }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-1 w-8 h-8 rounded-full bg-radial from-amber-400/60 via-orange-500/30 to-transparent blur-sm pointer-events-none"
          />

          <svg viewBox="0 0 32 26" className="w-6 h-5 overflow-visible drop-shadow-[0_2px_8px_rgba(245,158,11,0.7)]">
            <defs>
              <linearGradient id="floatingFlameGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#fef08a" />
                <stop offset="70%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
              <linearGradient id="floatingDiyaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#451a03" />
              </linearGradient>
            </defs>

            {/* Dancing Flame */}
            <motion.path
              d="M 16 2 C 19 6, 20 10, 18 13 C 17 14.5, 15 14.5, 14 13 C 12 10, 13 6, 16 2 Z"
              fill="url(#floatingFlameGrad)"
              animate={{
                scaleY: [1, 1.2, 0.95, 1.15, 1],
                scaleX: [1, 0.9, 1.05, 0.95, 1],
                rotate: [-2, 2, -2],
              }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: '16px 14px' }}
            />

            {/* Clay Diya Body */}
            <path
              d="M 6 13 C 8 21, 24 21, 26 13 C 23 15, 9 15, 6 13 Z"
              fill="url(#floatingDiyaGrad)"
              stroke="#fbbf24"
              strokeWidth="0.8"
            />
            <ellipse cx="16" cy="13" rx="10" ry="2.2" fill="#78350f" stroke="#fbbf24" strokeWidth="0.6" />
          </svg>
        </div>

        {/* Text */}
        <div className="flex flex-col pr-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black tracking-wide text-amber-200">
              Happy Diwali
            </span>
            <span className="text-[10px] text-amber-400">✨</span>
          </div>
          <span className="text-[9px] text-amber-300/80 tracking-wider uppercase font-semibold">
            Click to Celebrate
          </span>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
          }}
          className="w-4 h-4 -mr-1 rounded-full flex items-center justify-center text-amber-400/60 hover:text-amber-200 hover:bg-white/10 transition-colors text-xs"
          title="Dismiss"
        >
          ×
        </button>
      </div>
    </motion.aside>
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

      {/* 2. Minimalist Luxury Golden Fairy Wire */}
      <LuxuryGoldenFairyWire />
    </div>
  );
}
