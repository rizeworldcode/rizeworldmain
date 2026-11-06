import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  ArrowRight, 
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

    // 2. Safety check near end of playback
    const onTimeUpdate = () => {
      if (video.duration && video.currentTime >= video.duration - 0.25) {
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
      onClick={handleRedirect}
      className="fixed inset-0 w-screen h-screen z-50 overflow-hidden bg-black select-none flex flex-col justify-end cursor-pointer"
      title="Click anywhere to enter Dashboard"
    >
      {/* 1. Fullscreen Ultra-HD Video (Plays once to completion then auto-redirects) */}
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

      {/* Subtle bottom vignette so footer controls are cleanly visible */}
      <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

      {/* 2. Minimal Bottom Action Bar */}
      <footer 
        onClick={(e) => e.stopPropagation()} 
        className="relative w-full px-5 py-5 sm:px-10 sm:py-7 z-20 flex items-center justify-between pointer-events-auto"
      >
        {/* Festive Wish Message */}
        <div className="flex items-center gap-2 text-left">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0">
            <Flame size={16} className="text-orange-400 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-orange-400 drop-shadow">
              Shubh Deepawali 2026
            </h2>
            <p className="text-[11px] sm:text-xs text-amber-200/80 drop-shadow hidden sm:block">
              Wishing the entire RizeWorld team joy, prosperity & sparkling success!
            </p>
          </div>
        </div>

        {/* Action Controls: Enter Dashboard + Sound Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleRedirect}
            className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:via-amber-400 hover:to-orange-400 text-black font-black text-xs sm:text-sm tracking-wide shadow-[0_0_25px_rgba(245,158,11,0.55)] hover:shadow-[0_0_35px_rgba(245,158,11,0.75)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Enter Dashboard</span>
            <ArrowRight size={15} className="text-black" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2.5 sm:p-3 rounded-2xl bg-black/60 hover:bg-black/80 border border-amber-400/40 text-amber-300 hover:text-white backdrop-blur-md transition-all shadow-lg cursor-pointer"
            title={isMuted ? 'Unmute Festive Music' : 'Mute Music'}
          >
            {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} className="text-amber-400 animate-pulse" />}
          </button>
        </div>
      </footer>
    </motion.div>
  );
}
