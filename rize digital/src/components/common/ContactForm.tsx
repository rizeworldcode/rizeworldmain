import React, { useState } from 'react';
import { Check } from 'lucide-react';

const SERVICES = [
  "SEO Optimization",
  "Social Media Marketing",
  "Paid Ads",
  "Web Development",
  "WordPress Development",
  "Custom Web Development",
  "Content Marketing",
  "Graphic Design",
  "UI/UX Design",
  "Ecommerce Development",
];

const SocialIconBtn = ({ href, children, label }: { href: string; children: React.ReactNode; label: string }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    aria-label={label}
    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 transition-all duration-300 shadow-sm"
  >
    {children}
  </a>
);

export default function ContactForm() {
  const [selected, setSelected] = useState<string[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const toggleService = (service: string) => {
    setSelected(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service) 
        : [...prev, service]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    const messageText = `Hello RizeWorld! 🚀\n\nI would like to request a consultation. Here are my details:\n\n` +
      `👤 Name: ${firstName} ${lastName}\n` +
      `📞 Contact Number: ${contact}\n` +
      `✉️ Email: ${email}\n` +
      `🌐 Website: ${website || 'N/A'}\n` +
      `🛠️ Services Needed: ${selected.length > 0 ? selected.join(', ') : 'None selected'}`;
    
    // Redirect to WhatsApp with prefilled message details
    const whatsappUrl = `https://wa.me/919024615510?text=${encodeURIComponent(messageText)}`;
    
    // Wait briefly for a nice UI transition
    await new Promise((r) => setTimeout(r, 800));
    window.open(whatsappUrl, '_blank');
    
    setSending(false);
    setSent(true);
  };

  return (
    <div className="w-full bg-white border border-gray-100 rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] overflow-y-auto scrollbar-thin">
      <div className="p-5 sm:p-7 flex flex-col gap-4">
        
        {sent ? (
          <div className="flex flex-col items-center justify-center py-8 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-2xl text-green-600">
              <Check size={32} strokeWidth={3} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Request Sent to WhatsApp!</h2>
              <p className="text-sm text-gray-500 px-4">
                Thank you! Your details have been prepared. Please click send in WhatsApp to share them with our team.
              </p>
            </div>
            <button 
              onClick={() => setSent(false)}
              className="mt-4 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold uppercase tracking-wider text-xs rounded-full transition-colors"
            >
              Fill Again
            </button>
          </div>
        ) : (
          <>
            {/* Header / Social Connections */}
            <div className="text-center sm:text-left flex flex-col gap-2">
              <h2 className="text-2xl font-black text-gray-950 tracking-tight leading-none uppercase">
                Let's Grow Your Brand 🚀
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Connect with our team directly or submit the form below.
              </p>
            </div>

            {/* Social Icons Row */}
            <div className="flex items-center justify-center sm:justify-start gap-3 py-1">
              <SocialIconBtn 
                href="https://www.facebook.com/share/1BcNrvpmuJ/" 
                label="Facebook"
              >
                <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </SocialIconBtn>

              <SocialIconBtn 
                href="https://www.instagram.com/rizeworld?igsh=MWYxOGs5NGhhdnNsNA==" 
                label="Instagram"
              >
                <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </SocialIconBtn>

              <SocialIconBtn 
                href="https://www.linkedin.com/company/rizeworld/" 
                label="LinkedIn"
              >
                <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </SocialIconBtn>
            </div>

            <div className="h-px bg-gray-100 my-1" />

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              {/* Names row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">First Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter first name" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full text-xs sm:text-sm px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-gray-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition duration-200"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Last Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter last name" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full text-xs sm:text-sm px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-gray-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition duration-200"
                  />
                </div>
              </div>

              {/* Contact & Email row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Contact Number</label>
                  <input 
                    type="tel" 
                    placeholder="Enter contact number" 
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                    className="w-full text-xs sm:text-sm px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-gray-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition duration-200"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="Enter email address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full text-xs sm:text-sm px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-gray-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition duration-200"
                  />
                </div>
              </div>

              {/* Website Field */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Website (Optional)</label>
                <input 
                  type="url" 
                  placeholder="https://example.com" 
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full text-xs sm:text-sm px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-gray-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition duration-200"
                />
              </div>

              {/* Services Checklist */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Services You Need</label>
                <div className="flex flex-wrap gap-1.5">
                  {SERVICES.map(service => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => toggleService(service)}
                      className={`text-[10px] sm:text-xs font-bold px-3 py-2 rounded-xl border transition-all duration-300 cursor-pointer ${
                        selected.includes(service)
                          ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-orange-500 hover:text-orange-500'
                      }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={sending}
                className="w-full bg-orange-500 text-white text-xs sm:text-sm font-black py-4 rounded-2xl hover:bg-orange-600 transition-colors uppercase tracking-wider shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 disabled:opacity-60 mt-2 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{sending ? "Processing..." : "Submit & Send to WhatsApp"}</span>
                {!sending && (
                  <svg
                    className="w-4.5 h-4.5 fill-current"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12.031 0C5.397 0 0 5.397 0 12.031c0 2.119.552 4.191 1.603 6.012L0 24l6.155-1.603a12.006 12.006 0 0 0 5.876 1.603h.001c6.634 0 12.031-5.397 12.031-12.031S18.665 0 12.031 0zm0 21.724h-.001c-1.928 0-3.821-.519-5.474-1.499l-.393-.235-4.076 1.064 1.087-3.974-.256-.402c-1.077-1.693-1.644-3.649-1.644-5.659 0-5.892 4.795-10.687 10.687-10.687 2.854 0 5.536 1.112 7.55 3.136 2.014 2.023 3.125 4.707 3.124 7.561-.001 5.891-4.796 10.687-10.687 10.687zm5.85-8.006c-.321-.161-1.901-.938-2.196-1.046-.296-.108-.511-.161-.726.162-.215.323-.834 1.046-1.023 1.261-.189.215-.378.242-.7.081-.321-.161-1.356-.501-2.582-1.595-.953-.85-1.597-1.899-1.785-2.222-.189-.323-.02-.497.141-.658.146-.145.323-.378.484-.567.161-.189.215-.323.323-.54.108-.215.054-.403-.027-.567-.081-.161-.726-1.751-.994-2.395-.262-.631-.532-.544-.726-.554-.188-.011-.403-.011-.617-.011-.215 0-.564.081-.86.403-.296.323-1.129 1.102-1.129 2.688 0 1.585 1.21 3.118 1.378 3.333.161.215 2.25 3.441 5.451 4.829 2.76 1.192 3.456.953 4.075.899.617-.054 1.901-.777 2.17-1.503.269-.726.269-1.349.189-1.483-.081-.135-.304-.215-.625-.376z"/>
                  </svg>
                )}
              </button>

            </form>
          </>
        )}

      </div>
    </div>
  );
}
