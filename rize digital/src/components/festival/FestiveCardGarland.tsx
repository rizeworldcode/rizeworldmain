import { motion } from 'framer-motion';

interface FestiveCardGarlandProps {
  showDiya?: boolean;
  showLights?: boolean;
  showTopBorder?: boolean;
  className?: string;
}

export default function FestiveCardGarland({
  showDiya = true,
  showLights = true,
  showTopBorder = true,
  className = '',
}: FestiveCardGarlandProps) {
  // Delicate fairy light bulbs along the card top wire
  const fairyBulbs = [
    { color: '#fbbf24', shadow: '#f59e0b', delay: 0 },
    { color: '#f97316', shadow: '#ea580c', delay: 0.35 },
    { color: '#22c55e', shadow: '#16a34a', delay: 0.7 },
    { color: '#f43f5e', shadow: '#e11d48', delay: 0.2 },
    { color: '#facc15', shadow: '#ca8a04', delay: 0.55 },
    { color: '#38bdf8', shadow: '#0284c7', delay: 0.85 },
    { color: '#f97316', shadow: '#ea580c', delay: 0.15 },
    { color: '#fbbf24', shadow: '#f59e0b', delay: 0.6 },
  ];

  return (
    <div
      aria-hidden="true"
      className={`absolute top-0 left-0 right-0 z-20 pointer-events-none select-none overflow-visible ${className}`}
    >
      {/* 1. Golden Glowing Top Border Line (Diwali Shimmer) */}
      {showTopBorder && (
        <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-amber-500 via-yellow-300 via-amber-400 to-amber-500 shadow-[0_0_8px_rgba(251,191,36,0.7)]" />
      )}

      {/* 2. Twinkling Fairy Light Bulbs along Card Top Wire */}
      {showLights && (
        <div className="relative w-full h-3 flex items-center justify-between px-3 sm:px-5 -mt-0.5 pr-14 sm:pr-16">
          {fairyBulbs.map((bulb, idx) => (
            <motion.div
              key={idx}
              animate={{
                opacity: [0.55, 1, 0.55],
                scale: [0.85, 1.25, 0.85],
              }}
              transition={{
                duration: 1.3 + (idx % 3) * 0.3,
                delay: bulb.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                backgroundColor: bulb.color,
                boxShadow: `0 0 6px 1.5px ${bulb.shadow}`,
              }}
              className="relative w-1.5 h-1.5 rounded-full"
            />
          ))}
        </div>
      )}

      {/* 3. Glowing Corner Diya with Dancing Flame & Warm Circular Halo */}
      {showDiya && (
        <div className="absolute top-1.5 right-3 z-30 flex items-center justify-center">
          {/* Flame Light Bloom (Circular warm halo matching reference screenshot) */}
          <motion.div
            animate={{
              scale: [1, 1.35, 1],
              opacity: [0.55, 0.92, 0.55],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -top-1 w-8 h-8 rounded-full bg-amber-400/40 blur-[5px] pointer-events-none"
          />

          <svg
            viewBox="0 0 32 26"
            className="w-7 h-6 sm:w-8 sm:h-7 overflow-visible drop-shadow-[0_2px_8px_rgba(238,89,30,0.65)]"
          >
            <defs>
              <linearGradient id="festiveCardFlame" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="25%" stopColor="#fef08a" />
                <stop offset="65%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
              <linearGradient id="festiveCardDiya" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#451a03" />
              </linearGradient>
            </defs>

            {/* Flickering Animated Flame */}
            <motion.path
              d="M 16 2 C 19 6, 20 10, 18 13 C 17 14.5, 15 14.5, 14 13 C 12 10, 13 6, 16 2 Z"
              fill="url(#festiveCardFlame)"
              animate={{
                scaleY: [1, 1.2, 0.92, 1.15, 1],
                scaleX: [1, 0.9, 1.08, 0.93, 1],
                rotate: [-2, 2, -2],
              }}
              transition={{
                duration: 1.1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ transformOrigin: '16px 14px' }}
            />

            {/* Diya Clay Bowl Body */}
            <path
              d="M 6 13 C 8 21, 24 21, 26 13 C 23 15, 9 15, 6 13 Z"
              fill="url(#festiveCardDiya)"
              stroke="#fbbf24"
              strokeWidth="0.8"
            />
            {/* Diya Rim */}
            <ellipse
              cx="16"
              cy="13"
              rx="10"
              ry="2.2"
              fill="#78350f"
              stroke="#fbbf24"
              strokeWidth="0.6"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
