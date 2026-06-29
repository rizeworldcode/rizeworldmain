import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ContactForm from './ContactForm';

export default function PopupModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Open the popup after 2 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6">
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-[480px] flex flex-col animate-in fade-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute -top-12 right-2 sm:-right-12 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all z-10"
        >
          <X size={20} />
        </button>

        {/* Container for the Form */}
        <div className="w-full rounded-2xl sm:rounded-3xl shadow-2xl">
          <ContactForm />
        </div>
      </div>
      
    </div>
  );
}
