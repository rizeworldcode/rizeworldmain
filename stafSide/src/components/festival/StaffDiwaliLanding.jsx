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
  Flame, 
  CheckCircle2 
} from 'lucide-react';
import diwaliVideo from '../../assets/diwali-wish.mp4';

export default function StaffDiwaliLanding({ onClose }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteractedSound, setHasInteractedSound] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(12);
  const [isEnded, setIsEnded] = useState(false);

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

    // Escape key listener to close
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
  }, [onClose]);

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

    // If currently paused, play upon unmuting
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
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-b from-[#090401] via-[#140802] to-[#070301] text-amber-50 flex flex-col items-center justify-between p-3 sm:p-6 select-none"
    >
      {/* Background Ambient Festive Bloom */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-radial from-amber-500/25 via-orange-600/10 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-1/2 -left-40 w-[450px] h-[450px] bg-radial from-orange-600/15 via-amber-700/5 to-transparent blur-3xl rounded-full" />
        <div className="absolute bottom-0 -right-40 w-[450px] h-[450px] bg-radial from-yellow-500/15 via-orange-600/5 to-transparent blur-3xl rounded-full" />

        {/* Floating Sparkles & Light Orbs */}
        {[...Array(16)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -35, 0],
              opacity: [0.2, 0.85, 0.2],
              scale: [0.8, 1.25, 0.8],
            }}
            transition={{
              duration: 3 + (i % 4) * 1.2,
              repeat: Infinity,
              delay: (i * 0.35) % 3,
              ease: 'easeInOut',
            }}
            style={{
              top: `${10 + (i * 5.5) % 80}%`,
              left: `${5 + (i * 6.2) % 90}%`,
            }}
            className="absolute w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.9)]"
          />
        ))}
      </div>

      {/* Top Header Bar */}
      <header className="relative w-full max-w-5xl flex items-center justify-between py-2 sm:py-3 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative p-1 rounded-2xl bg-gradient-to-tr from-amber-500/30 to-orange-500/30 border border-amber-400/40 shadow-lg shadow-amber-500/10 backdrop-blur-md">
            <img 
              src="/logo.png" 
              alt="RizeWorld Logo" 
              className="w-9 h-9 sm:w-11 sm:h-11 object-contain rounded-xl"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-black tracking-[0.25em] uppercase text-amber-400/90 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">
                Staff Portal
              </span>
              <span className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-yellow-300/80">
                <Sparkles size={11} className="text-amber-400" />
                Diwali 2026
              </span>
            </div>
            <h1 className="text-sm sm:text-lg font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-orange-400">
              RizeWorld Institute & Agency
            </h1>
          </div>
        </div>

        {/* Skip to Portal / Close Button */}
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold text-amber-200/90 bg-white/5 hover:bg-white/10 border border-amber-400/30 hover:border-amber-400/60 shadow-md backdrop-blur-md transition-all group"
          title="Skip to Staff Portal (Esc)"
        >
          <span>Skip to Portal</span>
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform text-amber-400" />
        </button>
      </header>

      {/* Main Showcase Area */}
      <main className="relative w-full max-w-4xl flex-1 flex flex-col lg:flex-row items-center justify-center gap-5 lg:gap-10 py-3 sm:py-6 z-10">
        
        {/* Left/Center: Video Showcase Card */}
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative w-full max-w-[270px] sm:max-w-[320px] md:max-w-[350px] aspect-[9/16] shrink-0 group flex items-center justify-center"
        >
          {/* Ambient Video Glow Behind */}
          <div className="absolute -inset-3 bg-radial from-amber-500/40 via-orange-500/20 to-transparent rounded-[2.5rem] blur-xl opacity-80 pointer-events-none group-hover:opacity-100 transition-opacity" />

          {/* Ornate Frame Border */}
          <div className="relative w-full h-full rounded-[2rem] overflow-hidden border-2 border-amber-400/60 shadow-[0_12px_45px_rgba(0,0,0,0.8),0_0_25px_rgba(251,191,36,0.35)] bg-black/90 flex flex-col justify-between">
            
            {/* The Video Element */}
            <video
              ref={videoRef}
              src={diwaliVideo}
              playsInline
              autoPlay
              muted={isMuted}
              onClick={togglePlay}
              className="w-full h-full object-cover cursor-pointer"
            />

            {/* Top Badges over Video */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-400/40 text-[10px] font-bold text-amber-300">
                <Flame size={12} className="text-orange-400 animate-pulse" />
                <span>Happy Diwali</span>
              </div>

              {/* Sound Toggle Button (interactive) */}
              <button
                onClick={toggleSound}
                className="pointer-events-auto p-2 rounded-full bg-black/65 hover:bg-black/85 backdrop-blur-md border border-amber-400/50 text-amber-300 hover:text-amber-100 hover:scale-105 transition-all shadow-lg"
                title={isMuted ? 'Turn on sound' : 'Mute sound'}
              >
                {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="text-amber-400 animate-pulse" />}
              </button>
            </div>

            {/* Floating "Unmute Sound" Banner if user hasn't clicked unmute */}
            {isMuted && !hasInteractedSound && (
              <motion.button
                onClick={toggleSound}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-black font-extrabold text-xs shadow-2xl shadow-amber-500/50 hover:brightness-110 active:scale-95 transition-all cursor-pointer whitespace-nowrap border border-yellow-200"
              >
                <Volume2 size={16} />
                <span>Tap for Festive Music</span>
              </motion.button>
            )}

            {/* Video Controls & Progress Bar Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/95 via-black/60 to-transparent z-20 flex flex-col gap-2">
              {/* Progress Slider */}
              <div 
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  if (videoRef.current && videoRef.current.duration) {
                    videoRef.current.currentTime = pos * videoRef.current.duration;
                  }
                }}
                className="w-full h-1.5 bg-white/20 hover:h-2 rounded-full cursor-pointer relative overflow-hidden transition-all"
              >
                <div 
                  style={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                />
              </div>

              {/* Bottom Video Controls Row */}
              <div className="flex items-center justify-between text-xs text-amber-200/90 font-medium">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={togglePlay}
                    className="p-1 hover:text-white transition-colors cursor-pointer"
                  >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                  <button 
                    onClick={handleReplay}
                    className="p-1 hover:text-white transition-colors cursor-pointer"
                    title="Replay from start"
                  >
                    <RotateCcw size={13} />
                  </button>
                </div>

                <div className="text-[11px] font-mono tracking-wider text-amber-300/80">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>
            </div>

            {/* Ended Screen Overlay with Replay button */}
            <AnimatePresence>
              {isEnded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/80 backdrop-blur-xs z-30 flex flex-col items-center justify-center p-4 text-center gap-3"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-black shadow-lg shadow-amber-500/40">
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="text-base font-black text-amber-300">Shubh Deepawali!</h3>
                  <div className="flex flex-col gap-2 w-full max-w-[200px] mt-1">
                    <button
                      onClick={onClose}
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Enter Portal</span>
                      <ArrowRight size={14} />
                    </button>
                    <button
                      onClick={handleReplay}
                      className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-amber-200 font-bold text-xs border border-amber-400/30 transition-all flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw size={13} />
                      <span>Watch Again</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right: Team Greeting Message & Portal CTA */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex-1 max-w-lg flex flex-col items-center lg:items-start text-center lg:text-left gap-4"
        >
          {/* Decorative Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-yellow-500/15 border border-amber-400/40 text-amber-300 text-xs font-black tracking-widest uppercase shadow-sm">
            <span>🪔</span>
            <span>RizeWorld Diwali Celebration</span>
            <Sparkles size={13} className="text-amber-400" />
          </div>

          {/* Festive Wish Headline */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Wishing the Entire{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400">
              RizeWorld Team
            </span>{' '}
            a Joyous & Sparkling Diwali!
          </h2>

          {/* Personal Staff Message */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-amber-400/25 backdrop-blur-md shadow-lg text-amber-100/90 text-xs sm:text-sm leading-relaxed space-y-2">
            <p>
              To every dedicated member of our family—your hard work, passion, and spirit illuminate RizeWorld's growth each and every day.
            </p>
            <p className="text-amber-300/90 font-medium">
              May the divine lights of Deepawali bring limitless joy, good health, peace, and high achievements to you and your loved ones! ✨
            </p>
          </div>

          {/* Highlight Points */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full text-xs">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/20 flex items-center gap-2">
              <span className="text-base">🪔</span>
              <span className="text-amber-200 font-semibold">Peace & Prosperity</span>
            </div>
            <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-400/20 flex items-center gap-2">
              <span className="text-base">🚀</span>
              <span className="text-amber-200 font-semibold">Shared Success</span>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2 w-full flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:via-amber-400 hover:to-orange-400 text-black font-black text-sm tracking-wide shadow-[0_6px_25px_rgba(245,158,11,0.45)] hover:shadow-[0_8px_30px_rgba(245,158,11,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue to Staff Portal</span>
              <ArrowRight size={17} className="text-black" />
            </button>

            <button
              onClick={toggleSound}
              className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-amber-400/30 text-amber-200 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isMuted ? (
                <>
                  <Volume2 size={15} className="text-amber-400" />
                  <span>Unmute Video</span>
                </>
              ) : (
                <>
                  <VolumeX size={15} />
                  <span>Mute Audio</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

      </main>

      {/* Bottom Footer Info */}
      <footer className="relative w-full max-w-5xl py-2 flex items-center justify-between text-[11px] text-amber-300/60 z-10 shrink-0 border-t border-amber-400/15">
        <div className="flex items-center gap-1.5">
          <span>🪔</span>
          <span>Shubh Deepawali to all Team Members</span>
        </div>
        <div className="font-mono text-[10px]">
          Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-amber-200 border border-white/20">Esc</kbd> to skip
        </div>
      </footer>
    </motion.div>
  );
}
