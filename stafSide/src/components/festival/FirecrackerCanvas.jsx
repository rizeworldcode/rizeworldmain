import React, { useEffect, useRef } from 'react';

// Authentic Diwali Cracker Types:
// 1. ROCKET: Launches upwards with smoke trail, then explodes into vibrant firework shell
// 2. ANAR: Cone fountain shooting intense golden/sparkling fire upward
// 3. CHAKRI: Ground spinner throwing whirling spirals of sparks
// 4. PHULJHADI: Crackling sparkler burst with diamond-star glitter
// 5. LADI: Rapid successive firecracker mini-pops with smoke

const SPARK_PALETTES = [
  ['#facc15', '#f59e0b', '#fbbf24', '#ffffff'], // Golden Spark
  ['#ef4444', '#f97316', '#facc15', '#ffffff'], // Fiery Red & Orange
  ['#38bdf8', '#06b6d4', '#818cf8', '#ffffff'], // Neon Blue
  ['#10b981', '#34d399', '#a7f3d0', '#fef08a'], // Emerald Green
  ['#ec4899', '#f43f5e', '#fb7185', '#ffffff'], // Ruby Pink
  ['#a855f7', '#c084fc', '#f472b6', '#fef08a'], // Royal Purple
];

export default function FirecrackerCanvas() {
  const canvasRef = useRef(null);
  const activeParticlesRef = useRef([]);
  const animFrameIdRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Particle manager loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = activeParticlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);

        if (p.isDead()) {
          // If rocket reaches apex, trigger secondary shell explosion!
          if (p.type === 'rocket_head' && p.onApex) {
            p.onApex(p.x, p.y);
          }
          particles.splice(i, 1);
        }
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, []);

  // Spawn functions for each cracker type
  const spawnRocket = (startX, startY) => {
    const targetX = startX + (Math.random() - 0.5) * 60;
    const targetY = Math.max(40, startY - (120 + Math.random() * 80));
    const speed = 7.5 + Math.random() * 2.5;
    const angle = Math.atan2(targetY - startY, targetX - startX);
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    const palette = SPARK_PALETTES[Math.floor(Math.random() * SPARK_PALETTES.length)];

    const rocket = {
      type: 'rocket_head',
      x: startX,
      y: startY,
      vx,
      vy,
      targetY,
      life: 1,
      decay: 0.02,
      color: '#facc15',
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.08; // slight drag/gravity
        this.life -= this.decay;

        // Trail sparks behind rocket
        if (Math.random() > 0.2) {
          activeParticlesRef.current.push(createSmokeSpark(this.x, this.y, '#f97316'));
        }
      },
      draw(ctx) {
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      },
      isDead() {
        return this.life <= 0 || this.y <= this.targetY || this.vy >= 0;
      },
      onApex: (apexX, apexY) => {
        // Boom! Secondary Firework Shell Explosion
        const sparkCount = 35 + Math.floor(Math.random() * 20);
        for (let i = 0; i < sparkCount; i++) {
          const sparkAngle = (i / sparkCount) * Math.PI * 2 + (Math.random() * 0.2 - 0.1);
          const sparkSpeed = 2 + Math.random() * 5.5;
          const color = palette[Math.floor(Math.random() * palette.length)];

          activeParticlesRef.current.push({
            x: apexX,
            y: apexY,
            vx: Math.cos(sparkAngle) * sparkSpeed,
            vy: Math.sin(sparkAngle) * sparkSpeed,
            gravity: 0.1,
            friction: 0.96,
            size: 2.5 + Math.random() * 2,
            color,
            alpha: 1,
            decay: 0.016 + Math.random() * 0.015,
            update() {
              this.vx *= this.friction;
              this.vy *= this.friction;
              this.vy += this.gravity;
              this.x += this.vx;
              this.y += this.vy;
              this.alpha -= this.decay;
            },
            draw(ctx) {
              ctx.save();
              ctx.globalAlpha = Math.max(0, this.alpha);
              ctx.fillStyle = this.color;
              ctx.shadowColor = this.color;
              ctx.shadowBlur = 8;
              ctx.beginPath();
              ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            },
            isDead() {
              return this.alpha <= 0;
            },
          });
        }
      },
    };

    activeParticlesRef.current.push(rocket);
  };

  const spawnAnar = (x, y) => {
    // Erupting conical fountain of high-speed golden/silver sparks
    const count = 40;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const spreadAngle = -Math.PI / 2 + (Math.random() - 0.5) * 0.75;
        const speed = 4 + Math.random() * 7;
        const color = Math.random() > 0.3 ? '#facc15' : Math.random() > 0.5 ? '#ffffff' : '#fb923c';

        activeParticlesRef.current.push({
          x: x + (Math.random() - 0.5) * 12,
          y: y,
          vx: Math.cos(spreadAngle) * speed,
          vy: Math.sin(spreadAngle) * speed,
          gravity: 0.22,
          friction: 0.98,
          size: 1.8 + Math.random() * 2.2,
          color,
          alpha: 1,
          decay: 0.02 + Math.random() * 0.018,
          update() {
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= this.decay;
          },
          draw(ctx) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.alpha);
            ctx.fillStyle = this.color;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          },
          isDead() {
            return this.alpha <= 0;
          },
        });
      }, (i * 14));
    }
  };

  const spawnChakri = (x, y) => {
    // Whirling Ground Spinner spitting spiral fiery arcs
    const count = 45;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const angle = (i * 0.45);
        const speed = 2.5 + Math.random() * 4.5;
        const color = i % 3 === 0 ? '#ffffff' : i % 2 === 0 ? '#f59e0b' : '#ef4444';

        activeParticlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          gravity: 0.04,
          friction: 0.97,
          size: 2.2 + Math.random() * 1.8,
          color,
          alpha: 1,
          decay: 0.024,
          update() {
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= this.decay;
          },
          draw(ctx) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.alpha);
            ctx.fillStyle = this.color;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          },
          isDead() {
            return this.alpha <= 0;
          },
        });
      }, i * 16);
    }
  };

  const spawnPhuljhadi = (x, y) => {
    // Crackling Starburst with Diamond-needles
    const count = 30;
    const palette = SPARK_PALETTES[Math.floor(Math.random() * SPARK_PALETTES.length)];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 5.5;
      const color = palette[Math.floor(Math.random() * palette.length)];

      activeParticlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: 0.06,
        friction: 0.96,
        size: 2.2 + Math.random() * 2,
        color,
        alpha: 1,
        decay: 0.02 + Math.random() * 0.02,
        twinkle: Math.random() > 0.5,
        update() {
          this.vx *= this.friction;
          this.vy *= this.friction;
          this.vy += this.gravity;
          this.x += this.vx;
          this.y += this.vy;
          this.alpha -= this.decay;
        },
        draw(ctx) {
          ctx.save();
          const currentAlpha = this.twinkle ? (Math.random() > 0.3 ? this.alpha : this.alpha * 0.3) : this.alpha;
          ctx.globalAlpha = Math.max(0, currentAlpha);
          ctx.fillStyle = this.color;
          ctx.shadowColor = this.color;
          ctx.shadowBlur = 10;
          
          // Draw diamond sparkle star
          ctx.beginPath();
          ctx.moveTo(this.x, this.y - this.size * 1.5);
          ctx.lineTo(this.x + this.size, this.y);
          ctx.lineTo(this.x, this.y + this.size * 1.5);
          ctx.lineTo(this.x - this.size, this.y);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        },
        isDead() {
          return this.alpha <= 0;
        },
      });
    }
  };

  const spawnLadi = (x, y) => {
    // Sequence of 4-6 rapid mini-crack pops with smoke
    const pops = 5;
    for (let p = 0; p < pops; p++) {
      setTimeout(() => {
        const popX = x + (Math.random() - 0.5) * 35;
        const popY = y + (Math.random() - 0.5) * 35;

        // Smoke puff
        activeParticlesRef.current.push(createSmokePuff(popX, popY));

        // Mini flash sparks
        for (let s = 0; s < 10; s++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1.5 + Math.random() * 3.5;
          activeParticlesRef.current.push({
            x: popX,
            y: popY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            gravity: 0.08,
            friction: 0.95,
            size: 2,
            color: '#facc15',
            alpha: 1,
            decay: 0.035,
            update() {
              this.vx *= this.friction;
              this.vy *= this.friction;
              this.vy += this.gravity;
              this.x += this.vx;
              this.y += this.vy;
              this.alpha -= this.decay;
            },
            draw(ctx) {
              ctx.save();
              ctx.globalAlpha = Math.max(0, this.alpha);
              ctx.fillStyle = this.color;
              ctx.shadowColor = '#f59e0b';
              ctx.shadowBlur = 6;
              ctx.beginPath();
              ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            },
            isDead() {
              return this.alpha <= 0;
            },
          });
        }
      }, p * 70);
    }
  };

  function createSmokeSpark(x, y, color) {
    return {
      x,
      y,
      vx: (Math.random() - 0.5) * 1.5,
      vy: Math.random() * 1.5,
      size: 1.5 + Math.random() * 1.5,
      color,
      alpha: 0.9,
      decay: 0.04,
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      },
      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      },
      isDead() {
        return this.alpha <= 0;
      },
    };
  }

  function createSmokePuff(x, y) {
    return {
      x,
      y,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -0.4 - Math.random() * 0.4,
      radius: 4,
      maxRadius: 18,
      alpha: 0.45,
      decay: 0.015,
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.radius += 0.4;
        this.alpha -= this.decay;
      },
      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      },
      isDead() {
        return this.alpha <= 0;
      },
    };
  }

  // Global Click Listener
  useEffect(() => {
    const handleGlobalClick = (e) => {
      // Check if user clicked any interactive element (buttons, tabs, inputs, cards, links)
      const target = e.target.closest(
        'button, a, [role="button"], input[type="button"], input[type="submit"], .clay-flat, .clay-inset, .clay-card, [tabindex="0"]'
      );

      if (target) {
        const x = e.clientX;
        const y = e.clientY;

        // Randomly trigger one of the 5 authentic Diwali crackers!
        const rand = Math.random();
        if (rand < 0.28) {
          spawnRocket(x, y);
        } else if (rand < 0.50) {
          spawnAnar(x, y);
        } else if (rand < 0.70) {
          spawnChakri(x, y);
        } else if (rand < 0.88) {
          spawnPhuljhadi(x, y);
        } else {
          spawnLadi(x, y);
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
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}
