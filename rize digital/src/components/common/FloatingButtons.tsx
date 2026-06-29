import { Phone } from 'lucide-react';

export default function FloatingButtons() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      {/* WhatsApp Button */}
      <a
        href="https://wa.me/919024615510"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/40 hover:-translate-y-1 transition-all duration-300 animate-pulse-subtle"
      >
        {/* Tooltip */}
        <span className="absolute right-16 scale-0 group-hover:scale-100 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 shadow-md whitespace-nowrap">
          WhatsApp Us
        </span>
        <svg
          className="w-7 h-7 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.031 0C5.397 0 0 5.397 0 12.031c0 2.119.552 4.191 1.603 6.012L0 24l6.155-1.603a12.006 12.006 0 0 0 5.876 1.603h.001c6.634 0 12.031-5.397 12.031-12.031S18.665 0 12.031 0zm0 21.724h-.001c-1.928 0-3.821-.519-5.474-1.499l-.393-.235-4.076 1.064 1.087-3.974-.256-.402c-1.077-1.693-1.644-3.649-1.644-5.659 0-5.892 4.795-10.687 10.687-10.687 2.854 0 5.536 1.112 7.55 3.136 2.014 2.023 3.125 4.707 3.124 7.561-.001 5.891-4.796 10.687-10.687 10.687zm5.85-8.006c-.321-.161-1.901-.938-2.196-1.046-.296-.108-.511-.161-.726.162-.215.323-.834 1.046-1.023 1.261-.189.215-.378.242-.7.081-.321-.161-1.356-.501-2.582-1.595-.953-.85-1.597-1.899-1.785-2.222-.189-.323-.02-.497.141-.658.146-.145.323-.378.484-.567.161-.189.215-.323.323-.54.108-.215.054-.403-.027-.567-.081-.161-.726-1.751-.994-2.395-.262-.631-.532-.544-.726-.554-.188-.011-.403-.011-.617-.011-.215 0-.564.081-.86.403-.296.323-1.129 1.102-1.129 2.688 0 1.585 1.21 3.118 1.378 3.333.161.215 2.25 3.441 5.451 4.829 2.76 1.192 3.456.953 4.075.899.617-.054 1.901-.777 2.17-1.503.269-.726.269-1.349.189-1.483-.081-.135-.304-.215-.625-.376z"/>
        </svg>
      </a>

      <a
        href="tel:+919024615510"
        aria-label="Call Us"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 transition-all duration-300 animate-pulse-subtle"
      >
        {/* Tooltip */}
        <span className="absolute right-16 scale-0 group-hover:scale-100 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 shadow-md whitespace-nowrap">
          Call Us
        </span>
        <Phone className="w-6 h-6" />
      </a>
    </div>
  );
}
