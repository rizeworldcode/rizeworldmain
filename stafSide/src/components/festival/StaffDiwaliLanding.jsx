import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  Sparkles,
  Flame
} from 'lucide-react';
import diwaliMobileVideo from '../../assets/diwali-wish.mp4';
import diwaliPcVideo from '../../assets/diwali-wish-pc.mp4';

export default function StaffDiwaliLanding({ onClose }) {
  const videoRef = useRef(null);
  const hasRedirectedRef = useRef(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isMobileScreen, setIsMobileScreen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  const handleRedirect = useCallback(() => {
    if (hasRedirectedRef.current) return;
    hasRedirectedRef.current = true;
    if (onClose) onClose();
  }, [onClose]);

  // Responsive video selection based on device screen
  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeVideoSrc = isMobileScreen ? diwaliMobileVideo : diwaliPcVideo;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Autoplay smoothly from beginning without looping (plays once then auto-redirects)
    video.currentTime = 0;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Autoplay prevented:', err);
      });
    }

    // 1. Auto redirect on native video 'ended' event
    const onEnded = () => {
      handleRedirect();
    };

    // 2. Safety check near end of playback (in case browser doesn't dispatch ended)
    const onTimeUpdate = () => {
      if (video.duration && video.currentTime >= video.duration - 0.2) {
        handleRedirect();
      }
    };

    video.addEventListener('ended', onEnded);
    video.addEventListener('timeupdate', onTimeUpdate);

    // 3. Fallback safety timer: auto-redirect after 12.5 seconds max
    const fallbackTimer = setTimeout(() => {
      handleRedirect();
    }, 12500);

    // 4. Escape key listener to skip immediately
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleRedirect();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('timeupdate', onTimeUpdate);
      clearTimeout(fallbackTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeVideoSrc, handleRedirect]);

  const toggleSound = (e) => {
    e?.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !isMuted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);

    if (video.paused) {
      video.play().catch(() => {});
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
      className="fixed inset-0 w-screen h-screen z-50 overflow-hidden bg-[#070301] select-none flex flex-col justify-between"
    >
      {/* 1. Fullscreen Festive Video (Plays once to completion then auto-redirects) */}
      <video
        ref={videoRef}
        key={activeVideoSrc}
        src={activeVideoSrc}
        playsInline
        autoPlay
        muted={isMuted}
        onEnded={handleRedirect}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Subtle Cinematic Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/75 via-transparent to-black/85" />

      {/* 2. Top Navigation Bar */}
      <header className="relative w-full px-5 py-4 sm:px-10 sm:py-6 z-20 flex items-center justify-between">
        {/* Brand & Portal Identity */}
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="RizeWorld Logo" 
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-2xl drop-shadow-[0_4px_16px_rgba(251,191,36,0.6)]"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-black tracking-[0.25em] uppercase text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-400/30 backdrop-blur-md">
                Staff Portal
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-yellow-200/90 hidden sm:flex items-center gap-1">
                <Sparkles size={11} className="text-amber-400" />
                Diwali 2026
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-extrabold tracking-wide text-white drop-shadow-md">
              RizeWorld Institute & Agency
            </h1>
          </div>
        </div>

        {/* Top-Right: Quick Skip to Dashboard */}
        <button
          onClick={handleRedirect}
          className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold text-amber-200 bg-black/60 hover:bg-black/80 border border-amber-400/40 hover:border-amber-400/80 shadow-[0_4px_20px_rgba(0,0,0,0.7)] backdrop-blur-md transition-all group cursor-pointer"
          title="Skip to Dashboard (Esc)"
        >
          <span>Skip to Dashboard</span>
          <ArrowRight size={15} className="text-amber-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </header>

      {/* 3. Center Space: Left completely open so video's "Happy Diwali", diyas & fireworks shine with ZERO obstruction! */}
      <div className="flex-1 w-full" />

      {/* 4. Bottom Section: Festive Greetings & Direct Portal Action */}
      <footer className="relative w-full px-5 py-6 sm:px-10 sm:py-8 z-20 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Festive Wish Message */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1.5 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[10px] sm:text-xs font-bold tracking-widest uppercase backdrop-blur-md">
            <Flame size={12} className="text-orange-400 animate-pulse" />
            <span>Festival of Lights 2026</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-orange-400 drop-shadow-md">
            Wishing the Entire RizeWorld Team a Happy Diwali!
          </h2>
          <p className="text-xs sm:text-sm text-amber-100/85 drop-shadow leading-relaxed">
            May this Diwali bring boundless happiness, good health, and glorious success to you and your family.
          </p>
        </div>

        {/* Action Buttons: Enter Dashboard + Audio Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleRedirect}
            className="px-6 py-3 sm:px-8 sm:py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:via-amber-400 hover:to-orange-400 text-black font-black text-xs sm:text-sm tracking-wide shadow-[0_0_30px_rgba(245,158,11,0.55)] hover:shadow-[0_0_40px_rgba(245,158,11,0.75)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Enter Dashboard</span>
            <ArrowRight size={16} className="text-black" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-3 rounded-2xl bg-black/60 hover:bg-black/80 border border-amber-400/40 text-amber-300 hover:text-white backdrop-blur-md transition-all shadow-lg cursor-pointer"
            title={isMuted ? 'Unmute Festive Music' : 'Mute Music'}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} className="text-amber-400 animate-pulse" />}
          </button>
        </div>
      </footer>
    </motion.div>
  );
}
