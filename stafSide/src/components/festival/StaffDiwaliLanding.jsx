import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import diwaliMobileVideo from '../../assets/diwali-wish.mp4';
import diwaliPcVideo from '../../assets/diwali-wish-pc.mp4';

export default function StaffDiwaliLanding({ onClose }) {
  const videoRef = useRef(null);
  const hasRedirectedRef = useRef(false);
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
      onClick={handleRedirect}
      className="fixed inset-0 w-screen h-screen z-50 overflow-hidden bg-black select-none cursor-pointer"
      title="Click anywhere to enter Dashboard"
    >
      {/* Pure Fullscreen Silent Ultra-HD Video (Zero sound, zero overlays) */}
      <video
        ref={videoRef}
        key={activeVideoSrc}
        src={activeVideoSrc}
        playsInline
        autoPlay
        muted
        onEnded={handleRedirect}
        className="w-full h-full object-cover pointer-events-none"
      />
    </motion.div>
  );
}
