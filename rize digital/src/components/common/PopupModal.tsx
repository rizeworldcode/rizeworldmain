import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import ContactForm from './ContactForm';

export default function PopupModal() {
  const [isOpen, setIsOpen] = useState(false);
  const autoCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Do not auto-open during prerendering or headless environments
    if (typeof navigator !== 'undefined' && (navigator.userAgent.includes('Headless') || navigator.userAgent.includes('Puppeteer'))) {
      return;
    }

    // 1. Open the popup after 1.5 seconds on page load
    const openTimer = setTimeout(() => {
      setIsOpen(true);
    }, 1500);

    return () => clearTimeout(openTimer);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // 2. Automatically remove/hide the popup after 7 seconds
      autoCloseTimerRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 7000);

      return () => {
        if (autoCloseTimerRef.current) {
          clearTimeout(autoCloseTimerRef.current);
        }
      };
    }
  }, [isOpen]);

  // If user starts interacting with the form, cancel auto-close so it doesn't vanish while typing
  const handleInteraction = () => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity cursor-pointer"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal Content */}
      <div 
        onMouseEnter={handleInteraction}
        onTouchStart={handleInteraction}
        onFocus={handleInteraction}
        className="relative w-full max-w-[480px] flex flex-col animate-in fade-in zoom-in-95 duration-300 z-10"
      >
        
        {/* Close Button */}
        <button 
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Close consultation modal"
          className="absolute top-0 right-2 sm:-top-10 sm:right-0 w-10 h-10 text-gray-500 hover:text-gray-800 sm:text-white/80 sm:hover:text-white flex items-center justify-center transition-all z-50 cursor-pointer"
        >
          <X size={24} style={{ width: 24, height: 24 }} aria-hidden="true" />
        </button>

        {/* Container for the Form */}
        <div className="w-full rounded-2xl sm:rounded-3xl shadow-2xl">
          <ContactForm />
        </div>
      </div>
      
    </div>
  );
}
