import React, { useEffect, useRef } from 'react';

// Lightweight, ultra-smooth 60fps Diwali Firecrackers Engine
// 1. Idle-Sleeping: 0% CPU when no crackers active.
// 2. Hardware Accelerated: Uses 'lighter' blend mode, zero expensive shadowBlur.
// 3. Capped particle count: Prevents any frame drops or browser hanging.

const PALETTES = [
  ['#facc15', '#f59e0b', '#fbbf24', '#ffffff'], // Gold
  ['#ef4444', '#f97316', '#facc15', '#ffffff'], // Red-Orange
  ['#38bdf8', '#06b6d4', '#818cf8', '#ffffff'], // Electric Blue
  ['#10b981', '#34d399', '#fef08a', '#ffffff'], // Emerald
  ['#ec4899', '#f43f5e', '#fb7185', '#ffffff'], // Ruby
];

export default function FirecrackerCanvas() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animIdRef = useRef(null);
  const isRunningRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animIdRef.current) {
        cancelAnimationFrame(animIdRef.current);
      }
    };
  }, []);

  // Main animation loop that automatically sleeps when idle
  const startLoopIfNeeded = () => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    const step = () => {
      const particles = particlesRef.current;

      if (particles.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        isRunningRef.current = false;
        animIdRef.current = null;
        return; // Auto-sleep to 0% CPU
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter'; // Fast GPU glow blend

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y > canvas.height + 20) {
          if (p.isRocketHead && p.onApex) {
            p.onApex(p.x, p.y);
          }
          particles.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';
      animIdRef.current = requestAnimationFrame(step);
    };

    animIdRef.current = requestAnimationFrame(step);
  };

  const addParticles = (newBatch) => {
    // Keep max 100 particles in flight at any time to guarantee silky smooth 60fps
    const current = particlesRef.current;
    if (current.length > 80) {
      current.splice(0, current.length - 60);
    }
    particlesRef.current.push(...newBatch);
    startLoopIfNeeded();
  };

  // 1. Rocket Launch & Burst
  const launchRocket = (startX, startY) => {
    const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
    const rocket = {
      x: startX,
      y: startY,
      vx: (Math.random() - 0.5) * 2,
      vy: -(6.5 + Math.random() * 2),
      gravity: 0.1,
      friction: 0.99,
      size: 3,
      color: '#fef08a',
      alpha: 1,
      decay: 0.026,
      isRocketHead: true,
      onApex: (apexX, apexY) => {
        // Explode into 22 glowing sparks
        const sparks = [];
        const count = 22;
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2;
          const speed = 2 + Math.random() * 4;
          sparks.push({
            x: apexX,
            y: apexY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            gravity: 0.12,
            friction: 0.96,
            size: 2 + Math.random() * 1.5,
            color: palette[i % palette.length],
            alpha: 1,
            decay: 0.02 + Math.random() * 0.015,
          });
        }
        addParticles(sparks);
      },
    };
    addParticles([rocket]);
  };

  // 2. Anar Golden Fountain
  const launchAnar = (x, y) => {
    const sparks = [];
    const count = 24;
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.7;
      const speed = 3.5 + Math.random() * 5.5;
      sparks.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: 0.22,
        friction: 0.98,
        size: 1.8 + Math.random() * 1.6,
        color: i % 2 === 0 ? '#facc15' : '#ffffff',
        alpha: 1,
        decay: 0.022 + Math.random() * 0.018,
      });
    }
    addParticles(sparks);
  };

  // 3. Chakri Fire Spinner
  const launchChakri = (x, y) => {
    const sparks = [];
    const count = 24;
    for (let i = 0; i < count; i++) {
      const angle = (i * 0.5);
      const speed = 2 + Math.random() * 3.5;
      sparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: 0.03,
        friction: 0.97,
        size: 2,
        color: i % 3 === 0 ? '#ffffff' : i % 2 === 0 ? '#f59e0b' : '#ef4444',
        alpha: 1,
        decay: 0.03,
      });
    }
    addParticles(sparks);
  };

  // 4. Sparkler Starburst
  const launchSparkler = (x, y) => {
    const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
    const sparks = [];
    const count = 20;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4.5;
      sparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: 0.07,
        friction: 0.95,
        size: 2.2,
        color: palette[i % palette.length],
        alpha: 1,
        decay: 0.025 + Math.random() * 0.015,
      });
    }
    addParticles(sparks);
  };

  // Global Click Listener
  useEffect(() => {
    const handleGlobalClick = (e) => {
      const isDecorEnabled = localStorage.getItem('staffFestiveDecor') !== 'false';
      if (!isDecorEnabled) return;

      const target = e.target.closest(
        'button, a, [role="button"], input[type="button"], input[type="submit"], .clay-flat, .clay-card, [tabindex="0"]'
      );

      if (target) {
        const x = e.clientX;
        const y = e.clientY;
        const r = Math.random();

        if (r < 0.35) {
          launchRocket(x, y);
        } else if (r < 0.65) {
          launchAnar(x, y);
        } else if (r < 0.85) {
          launchChakri(x, y);
        } else {
          launchSparkler(x, y);
        }
      }
    };

    window.addEventListener('click', handleGlobalClick, { capture: true, passive: true });
    return () => {
      window.removeEventListener('click', handleGlobalClick, { capture: true });
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
    />
  );
}
