import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowRight, 
  X, 
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';
import diwaliMobileVideo from '../../assets/diwali-wish.mp4';
import diwaliPcVideo from '../../assets/diwali-wish-pc.mp4';

export default function StaffDiwaliLanding({ onClose }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteractedSound, setHasInteractedSound] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(12);
  const [isEnded, setIsEnded] = useState(false);
  const [isMobileScreen, setIsMobileScreen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  // Track screen size changes for responsive video source
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

    const handleLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
      }
    };

    const handleTimeUpdate = () => {
      if (video.duration) {
        setCurrentTime(video.currentTime);
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsEnded(true);
      setIsPlaying(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    // Initial play attempt with muted
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Autoplay prevented:', err);
          setIsPlaying(false);
        });
    }

    // Escape key listener to close immediately
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeVideoSrc, onClose]);

  const togglePlay = (e) => {
    e?.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      if (isEnded) {
        video.currentTime = 0;
        setIsEnded(false);
      }
      video.play().then(() => setIsPlaying(true));
    }
  };

  const toggleSound = (e) => {
    e?.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !isMuted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
    setHasInteractedSound(true);

    if (!isPlaying) {
      video.play().then(() => setIsPlaying(true));
    }
  };

  const handleReplay = (e) => {
    e?.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    setIsEnded(false);
    video.play().then(() => setIsPlaying(true));
  };

  const formatTime = (timeInSec) => {
    const min = Math.floor(timeInSec / 60);
    const sec = Math.floor(timeInSec % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 w-screen h-screen z-50 overflow-hidden bg-black select-none flex items-center justify-center"
    >
      {/* 1. Complete Screen Video Player (Zero frames, pure fullscreen edge-to-edge) */}
      <video
        ref={videoRef}
        key={activeVideoSrc}
        src={activeVideoSrc}
        playsInline
        autoPlay
        muted={isMuted}
        onClick={togglePlay}
        className="absolute inset-0 w-full h-full object-cover cursor-pointer"
      />

      {/* 2. Top Navigation Bar (Floating Overlay) */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 z-20 flex items-center justify-between pointer-events-none bg-gradient-to-b from-black/80 via-black/30 to-transparent">
        {/* Brand & Festival Tag */}
        <div className="flex items-center gap-2.5 pointer-events-auto">
          <img 
            src="/logo.png" 
            alt="RizeWorld" 
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-xl drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-xs font-black tracking-[0.25em] uppercase text-amber-400 drop-shadow-md">
              RizeWorld Staff Portal
            </span>
            <span className="text-xs sm:text-sm font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] flex items-center gap-1">
              <span>✨ Shubh Deepawali 2026</span>
            </span>
          </div>
        </div>

        {/* Skip to Portal / Close Button */}
        <button
          onClick={onClose}
          className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold text-white bg-black/60 hover:bg-black/80 border border-amber-400/40 hover:border-amber-400/80 shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all group cursor-pointer"
          title="Skip and go to Staff Portal"
        >
          <span>Skip to Portal</span>
          <ArrowRight size={15} className="text-amber-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 3. Center "Tap for Festive Music" Prompt (if muted) */}
      {isMuted && !hasInteractedSound && !isEnded && (
        <motion.button
          onClick={toggleSound}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: [1, 1.06, 1], opacity: 1 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute z-20 flex items-center gap-2.5 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-black font-extrabold text-xs sm:text-sm shadow-[0_0_35px_rgba(245,158,11,0.6)] hover:brightness-110 active:scale-95 transition-all cursor-pointer border border-yellow-200 pointer-events-auto"
        >
          <Volume2 size={18} className="animate-pulse" />
          <span>Tap for Festive Music 🔊</span>
        </motion.button>
      )}

      {/* 4. Bottom Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-20 flex items-center justify-between pointer-events-none bg-gradient-to-t from-black/85 via-black/40 to-transparent">
        {/* Play / Pause & Time Indicator */}
        <div className="flex items-center gap-3 pointer-events-auto text-amber-200">
          <button
            onClick={togglePlay}
            className="p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/80 border border-amber-400/40 text-amber-300 hover:text-white transition-all shadow-lg cursor-pointer"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>

          <button
            onClick={handleReplay}
            className="p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/80 border border-amber-400/40 text-amber-300 hover:text-white transition-all shadow-lg cursor-pointer"
            title="Replay from start"
          >
            <RotateCcw size={16} />
          </button>

          <span className="font-mono text-xs sm:text-sm text-amber-300/90 font-bold drop-shadow-md">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        {/* Sound Toggle (Right corner) */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            onClick={toggleSound}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/60 hover:bg-black/80 border border-amber-400/40 text-amber-300 hover:text-white transition-all shadow-lg text-xs font-bold cursor-pointer"
            title={isMuted ? 'Turn on sound' : 'Mute sound'}
          >
            {isMuted ? (
              <>
                <VolumeX size={16} />
                <span className="hidden sm:inline">Muted</span>
              </>
            ) : (
              <>
                <Volume2 size={16} className="text-amber-400 animate-pulse" />
                <span className="hidden sm:inline">Sound On</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 5. Sleek Timeline Progress Line at very bottom */}
      <div 
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pos = (e.clientX - rect.left) / rect.width;
          if (videoRef.current && videoRef.current.duration) {
            videoRef.current.currentTime = pos * videoRef.current.duration;
          }
        }}
        className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20 hover:h-2.5 z-30 cursor-pointer overflow-hidden transition-all"
      >
        <div
          style={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-300 shadow-[0_0_12px_rgba(251,191,36,0.9)]"
        />
      </div>

      {/* 6. Video Completion End Screen */}
      <AnimatePresence>
        {isEnded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/75 backdrop-blur-xs z-40 flex flex-col items-center justify-center p-4 text-center gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 via-orange-500 to-yellow-400 flex items-center justify-center text-black shadow-[0_0_40px_rgba(245,158,11,0.6)]">
              <CheckCircle2 size={32} />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-orange-400">
                Shubh Deepawali!
              </h2>
              <p className="text-xs sm:text-sm text-amber-200/90 max-w-md mx-auto">
                Wishing the entire RizeWorld team joy, prosperity, and sparkling success! ✨
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs mt-2">
              <button
                onClick={onClose}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:brightness-110 text-black font-black text-sm shadow-[0_0_25px_rgba(245,158,11,0.6)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Enter Staff Portal</span>
                <ArrowRight size={17} />
              </button>

              <button
                onClick={handleReplay}
                className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-white/10 hover:bg-white/20 text-amber-200 font-bold text-xs border border-amber-400/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw size={15} />
                <span>Replay</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
