import { useState } from 'react';
import { ArrowUpRight, MoreVertical, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path && location.hash === '';
  const isServicesActive = () => location.pathname === '/services' || (location.pathname === '/' && location.hash === '#services');

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleServicesClick = (e: React.MouseEvent) => {
    // If we're on Home, smooth scroll to #services, otherwise let the router navigate to /services
    if (location.pathname === '/') {
      e.preventDefault();
      window.history.replaceState(null, '', '#services');
      const el = document.getElementById('services');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  return (
    <header className="fixed top-6 left-0 w-full z-50 pointer-events-auto flex flex-col items-center px-4 sm:px-8">
      
      {/* Floating Pill Navbar */}
      <div className="w-full max-w-7xl bg-white/92 backdrop-blur-md rounded-full py-2.5 px-4 sm:px-6 flex items-center justify-between shadow-sm border border-gray-100 transition-all duration-300">
        
        {/* Logo */}
        <Link to="/" onClick={handleLogoClick} className="flex items-center gap-2 cursor-pointer shrink-0">
          <img src="/images/logo/RW.png" alt="RizeWorld" className="h-8 md:h-10 object-contain scale-[1.7] origin-left pl-1 shrink-0" />
        </Link>

        {/* Center Pill Nav */}
        <nav className="hidden xl:flex items-center bg-gray-50/80 backdrop-blur-sm rounded-full p-1 gap-0.5 border border-gray-100">
          <Link to="/" className={`${isActive('/') ? 'bg-rize-primary text-white shadow-sm' : 'text-gray-600 hover:text-rize-primary'} text-xs font-bold tracking-wide px-5 py-2.5 rounded-full transition-all uppercase`}>Home</Link>
          
          {/* Services Dropdown */}
          <div className="relative group">
            <Link 
              to="/services" 
              onClick={handleServicesClick} 
              className={`${isServicesActive() ? 'bg-rize-primary text-white shadow-sm' : 'text-gray-600 hover:text-rize-primary'} text-xs font-bold tracking-wide px-5 py-2.5 rounded-full transition-all uppercase block`}
            >
              Services
            </Link>
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 min-w-[260px]">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 flex flex-col gap-0.5">
                <div className="relative group/sub">
                  <Link 
                    to="/services/digital-marketing" 
                    className="text-gray-700 hover:bg-blue-50 hover:text-rize-primary text-[10px] font-bold tracking-wide px-4 py-3 rounded-xl transition-all uppercase flex justify-between items-center w-full"
                  >
                    <span>Digital Marketing</span>
                    <span className="text-[8px] text-gray-400 group-hover/sub:text-rize-primary transition-colors">▶</span>
                  </Link>
                  <div className="absolute top-0 left-full pl-3 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-300 min-w-[260px]">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 flex flex-col gap-0.5">
                      <Link to="/services/seo" className="text-gray-700 hover:bg-blue-50 hover:text-rize-primary text-[10px] font-bold tracking-wide px-4 py-3 rounded-xl transition-all uppercase block text-left">Search Engine Optimization</Link>
                      <Link to="/services/social-media-marketing" className="text-gray-700 hover:bg-blue-50 hover:text-rize-primary text-[10px] font-bold tracking-wide px-4 py-3 rounded-xl transition-all uppercase block text-left">Social Media Marketing</Link>
                      <Link to="/services/content-marketing" className="text-gray-700 hover:bg-blue-50 hover:text-rize-primary text-[10px] font-bold tracking-wide px-4 py-3 rounded-xl transition-all uppercase block text-left">Content Marketing</Link>
                      <Link to="/services/graphic-design" className="text-gray-700 hover:bg-blue-50 hover:text-rize-primary text-[10px] font-bold tracking-wide px-4 py-3 rounded-xl transition-all uppercase block text-left">Graphic Design</Link>
                      <Link to="/services/paid-ads" className="text-gray-700 hover:bg-blue-50 hover:text-rize-primary text-[10px] font-bold tracking-wide px-4 py-3 rounded-xl transition-all uppercase block text-left">Paid Ads</Link>
                    </div>
                  </div>
                </div>
                <div className="relative group/sub">
                  <Link 
                    to="/services/web-development" 
                    className="text-gray-700 hover:bg-blue-50 hover:text-rize-primary text-[10px] font-bold tracking-wide px-4 py-3 rounded-xl transition-all uppercase flex justify-between items-center w-full"
                  >
                    <span>Web Development</span>
                    <span className="text-[8px] text-gray-400 group-hover/sub:text-rize-primary transition-colors">▶</span>
                  </Link>
                  <div className="absolute top-0 left-full pl-3 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-300 min-w-[260px]">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 flex flex-col gap-0.5">
                      <Link to="/services/wordpress-development" className="text-gray-700 hover:bg-blue-50 hover:text-rize-primary text-[10px] font-bold tracking-wide px-4 py-3 rounded-xl transition-all uppercase block text-left">WordPress Development</Link>
                      <Link to="/services/custom-website-development" className="text-gray-700 hover:bg-blue-50 hover:text-rize-primary text-[10px] font-bold tracking-wide px-4 py-3 rounded-xl transition-all uppercase block text-left">Custom Website Development</Link>
                      <Link to="/services/ecommerce-development" className="text-gray-700 hover:bg-blue-50 hover:text-rize-primary text-[10px] font-bold tracking-wide px-4 py-3 rounded-xl transition-all uppercase block text-left">Ecommerce Development</Link>
                      <Link to="/services/ui-ux-design" className="text-gray-700 hover:bg-blue-50 hover:text-rize-primary text-[10px] font-bold tracking-wide px-4 py-3 rounded-xl transition-all uppercase block text-left">UI/UX Design</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Link to="/portfolio" className={`${isActive('/portfolio') ? 'bg-rize-primary text-white shadow-sm' : 'text-gray-600 hover:text-rize-primary'} text-xs font-bold tracking-wide px-5 py-2.5 rounded-full transition-all uppercase`}>Portfolio</Link>
          
          {/* Locations Dropdown */}
          <div className="relative group">
            <Link to="/locations" className={`${isActive('/locations') || location.pathname.startsWith('/locations/') ? 'bg-rize-primary text-white shadow-sm' : 'text-gray-600 hover:text-rize-primary'} text-xs font-bold tracking-wide px-5 py-2.5 rounded-full transition-all uppercase block`}>
              Locations
            </Link>
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 min-w-[240px]">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 flex flex-col gap-0.5 max-h-[400px] overflow-y-auto">
                <Link to="/locations" className="text-gray-700 hover:bg-blue-50 hover:text-rize-primary text-[10px] font-bold tracking-wide px-4 py-3 rounded-xl transition-all uppercase block text-left border-b border-gray-100">All Locations</Link>
                <Link to="/locations/delhi-ncr" className="text-gray-700 hover:bg-blue-50 hover:text-rize-primary text-[10px] font-bold tracking-wide px-4 py-2.5 rounded-xl transition-all uppercase block text-left">Delhi NCR</Link>
                <Link to="/locations/rajasthan" className="text-gray-700 hover:bg-blue-50 hover:text-rize-primary text-[10px] font-bold tracking-wide px-4 py-2.5 rounded-xl transition-all uppercase block text-left">Rajasthan</Link>
                <Link to="/locations/maharashtra" className="text-gray-700 hover:bg-blue-50 hover:text-rize-primary text-[10px] font-bold tracking-wide px-4 py-2.5 rounded-xl transition-all uppercase block text-left">Maharashtra</Link>
                <Link to="/locations/karnataka" className="text-gray-700 hover:bg-blue-50 hover:text-rize-primary text-[10px] font-bold tracking-wide px-4 py-2.5 rounded-xl transition-all uppercase block text-left">Karnataka</Link>
                <Link to="/locations/gujarat" className="text-gray-700 hover:bg-blue-50 hover:text-rize-primary text-[10px] font-bold tracking-wide px-4 py-2.5 rounded-xl transition-all uppercase block text-left">Gujarat</Link>
                <Link to="/locations/uttar-pradesh" className="text-gray-700 hover:bg-blue-50 hover:text-rize-primary text-[10px] font-bold tracking-wide px-4 py-2.5 rounded-xl transition-all uppercase block text-left">Uttar Pradesh</Link>
                <Link to="/locations/punjab" className="text-gray-700 hover:bg-blue-50 hover:text-rize-primary text-[10px] font-bold tracking-wide px-4 py-2.5 rounded-xl transition-all uppercase block text-left">Punjab</Link>
                <Link to="/locations/tamil-nadu" className="text-gray-700 hover:bg-blue-50 hover:text-rize-primary text-[10px] font-bold tracking-wide px-4 py-2.5 rounded-xl transition-all uppercase block text-left">Tamil Nadu</Link>
                <Link to="/locations/madhya-pradesh" className="text-gray-700 hover:bg-blue-50 hover:text-rize-primary text-[10px] font-bold tracking-wide px-4 py-2.5 rounded-xl transition-all uppercase block text-left">Madhya Pradesh</Link>
                <Link to="/locations/kerala" className="text-gray-700 hover:bg-blue-50 hover:text-rize-primary text-[10px] font-bold tracking-wide px-4 py-2.5 rounded-xl transition-all uppercase block text-left">Kerala</Link>
                <Link to="/locations/telangana" className="text-gray-700 hover:bg-blue-50 hover:text-rize-primary text-[10px] font-bold tracking-wide px-4 py-2.5 rounded-xl transition-all uppercase block text-left">Telangana</Link>
                <Link to="/locations/andhra-pradesh" className="text-gray-700 hover:bg-blue-50 hover:text-rize-primary text-[10px] font-bold tracking-wide px-4 py-2.5 rounded-xl transition-all uppercase block text-left">Andhra Pradesh</Link>
                <Link to="/locations/west-bengal" className="text-gray-700 hover:bg-blue-50 hover:text-rize-primary text-[10px] font-bold tracking-wide px-4 py-2.5 rounded-xl transition-all uppercase block text-left">West Bengal</Link>
                <Link to="/locations/uttarakhand" className="text-gray-700 hover:bg-blue-50 hover:text-rize-primary text-[10px] font-bold tracking-wide px-4 py-2.5 rounded-xl transition-all uppercase block text-left">Uttarakhand</Link>
                <Link to="/locations/assam" className="text-gray-700 hover:bg-blue-50 hover:text-rize-primary text-[10px] font-bold tracking-wide px-4 py-2.5 rounded-xl transition-all uppercase block text-left">Assam</Link>
                <Link to="/locations/haryana" className="text-gray-700 hover:bg-blue-50 hover:text-rize-primary text-[10px] font-bold tracking-wide px-4 py-2.5 rounded-xl transition-all uppercase block text-left">Haryana</Link>
              </div>
            </div>
          </div>

          {/* Company Dropdown */}
          <div className="relative group">
            <span className={`${location.pathname.startsWith('/about') || location.pathname.startsWith('/team') || location.pathname.startsWith('/careers') ? 'bg-rize-primary text-white shadow-sm' : 'text-gray-600 hover:text-rize-primary'} text-xs font-bold tracking-wide px-5 py-2.5 rounded-full transition-all uppercase block cursor-pointer`}>
              Company
            </span>
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 min-w-[200px]">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 flex flex-col gap-0.5">
                <Link to="/about" className="text-gray-700 hover:bg-blue-50 hover:text-rize-primary text-[10px] font-bold tracking-wide px-4 py-3 rounded-xl transition-all uppercase block text-left">About Us</Link>
                <Link to="/team" className="text-gray-700 hover:bg-blue-50 hover:text-rize-primary text-[10px] font-bold tracking-wide px-4 py-3 rounded-xl transition-all uppercase block text-left">Our Team</Link>
                <Link to="/careers" className="text-gray-700 hover:bg-blue-50 hover:text-rize-primary text-[10px] font-bold tracking-wide px-4 py-3 rounded-xl transition-all uppercase block text-left">Careers</Link>
              </div>
            </div>
          </div>

          {/* Resources Dropdown */}
          <div className="relative group">
            <span className={`${location.pathname.startsWith('/blogs') || location.pathname.startsWith('/faq') || location.pathname.startsWith('/case-studies') || location.pathname.startsWith('/pricing') ? 'bg-rize-primary text-white shadow-sm' : 'text-gray-600 hover:text-rize-primary'} text-xs font-bold tracking-wide px-5 py-2.5 rounded-full transition-all uppercase block cursor-pointer`}>
              Resources
            </span>
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 min-w-[200px]">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 flex flex-col gap-0.5">
                <Link to="/blogs" className="text-gray-700 hover:bg-blue-50 hover:text-rize-primary text-[10px] font-bold tracking-wide px-4 py-3 rounded-xl transition-all uppercase block text-left">Blogs</Link>
                <Link to="/faq" className="text-gray-700 hover:bg-blue-50 hover:text-rize-primary text-[10px] font-bold tracking-wide px-4 py-3 rounded-xl transition-all uppercase block text-left">FAQ</Link>
                <Link to="/case-studies" className="text-gray-700 hover:bg-blue-50 hover:text-rize-primary text-[10px] font-bold tracking-wide px-4 py-3 rounded-xl transition-all uppercase block text-left">Case Studies</Link>
                <Link to="/pricing" className="text-gray-700 hover:bg-blue-50 hover:text-rize-primary text-[10px] font-bold tracking-wide px-4 py-3 rounded-xl transition-all uppercase block text-left">Pricing</Link>
                <Link to="/locations" className="text-gray-700 hover:bg-blue-50 hover:text-rize-primary text-[10px] font-bold tracking-wide px-4 py-3 rounded-xl transition-all uppercase block text-left">Locations</Link>
              </div>
            </div>
          </div>

          <Link to="/contact" className={`${isActive('/contact') ? 'bg-rize-primary text-white shadow-sm' : 'text-gray-600 hover:text-rize-primary'} text-xs font-bold tracking-wide px-5 py-2.5 rounded-full transition-all uppercase`}>Contact</Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a 
            href="https://wa.me/919024615510" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hidden sm:flex items-center gap-2 btn-primary py-2.5! px-6! text-xs! rounded-full! uppercase tracking-wide shadow-none"
          >
            Let's Talk
          </a>
          

          {/* Mobile Menu Button (3-dots) */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="xl:hidden flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors shrink-0 border border-gray-100"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={20} /> : <MoreVertical size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="w-full max-w-7xl mt-2 bg-white rounded-3xl p-4 shadow-lg border border-gray-100 flex flex-col gap-1 xl:hidden max-h-[70vh] overflow-y-auto">
          <Link 
            to="/" 
            onClick={() => setIsOpen(false)}
            className={`${isActive('/') ? 'bg-rize-primary text-white' : 'text-gray-700 hover:bg-gray-50'} text-xs font-bold tracking-wide px-5 py-3 rounded-2xl transition-colors uppercase block`}
          >
            Company
          </Link>
          <Link 
            to="/about" 
            onClick={() => setIsOpen(false)}
            className={`${isActive('/about') ? 'bg-rize-primary text-white' : 'text-gray-700 hover:bg-gray-50'} text-xs font-bold tracking-wide px-5 py-3 rounded-2xl transition-colors uppercase block`}
          >
            About Us
          </Link>
          <div className="flex flex-col">
            <button 
              onClick={() => setIsServicesOpen(!isServicesOpen)}
              className={`${isServicesOpen || isServicesActive() ? 'bg-rize-primary text-white' : 'text-gray-700 hover:bg-gray-50'} text-xs font-bold tracking-wide px-5 py-3 rounded-2xl transition-colors uppercase flex justify-between items-center w-full cursor-pointer`}
            >
              <span>Our Services</span>
              <span className={`text-[8px] transition-transform duration-300 ${isServicesOpen ? 'rotate-90' : ''}`}>▶</span>
            </button>
            
            {isServicesOpen && (
              <div className="pl-6 flex flex-col gap-1 mt-1 border-l-2 border-blue-500/20 ml-5">
                <div className="flex flex-col">
                  <Link 
                    to="/services/digital-marketing" 
                    onClick={() => setIsOpen(false)}
                    className="text-gray-600 hover:bg-gray-50 text-xs font-bold tracking-wide px-4 py-2.5 rounded-xl transition-colors uppercase block text-left"
                  >
                    Digital Marketing Service
                  </Link>
                  <div className="pl-6 flex flex-col gap-1 mt-0.5 border-l border-blue-500/10 ml-4">
                    <Link 
                      to="/services/seo" 
                      onClick={() => setIsOpen(false)}
                      className="text-gray-500 hover:bg-gray-50 text-[10px] font-semibold tracking-wide px-4 py-2 rounded-xl transition-colors uppercase block text-left"
                    >
                      Search Engine Optimization
                    </Link>
                    <Link 
                      to="/services/social-media-marketing" 
                      onClick={() => setIsOpen(false)}
                      className="text-gray-500 hover:bg-gray-50 text-[10px] font-semibold tracking-wide px-4 py-2 rounded-xl transition-colors uppercase block text-left"
                    >
                      Social Media Marketing
                    </Link>
                    <Link 
                      to="/services/content-marketing" 
                      onClick={() => setIsOpen(false)}
                      className="text-gray-500 hover:bg-gray-50 text-[10px] font-semibold tracking-wide px-4 py-2 rounded-xl transition-colors uppercase block text-left"
                    >
                      Content Marketing
                    </Link>
                    <Link 
                      to="/services/graphic-design" 
                      onClick={() => setIsOpen(false)}
                      className="text-gray-500 hover:bg-gray-50 text-[10px] font-semibold tracking-wide px-4 py-2 rounded-xl transition-colors uppercase block text-left"
                    >
                      Graphic Design
                    </Link>
                    <Link 
                      to="/services/paid-ads" 
                      onClick={() => setIsOpen(false)}
                      className="text-gray-500 hover:bg-gray-50 text-[10px] font-semibold tracking-wide px-4 py-2 rounded-xl transition-colors uppercase block text-left"
                    >
                      Paid Ads
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col">
                  <Link 
                    to="/services/web-development" 
                    onClick={() => setIsOpen(false)}
                    className="text-gray-600 hover:bg-gray-50 text-xs font-bold tracking-wide px-4 py-2.5 rounded-xl transition-colors uppercase block text-left"
                  >
                    Web Development
                  </Link>
                  <div className="pl-6 flex flex-col gap-1 mt-0.5 border-l border-blue-500/10 ml-4">
                    <Link 
                      to="/services/wordpress-development" 
                      onClick={() => setIsOpen(false)}
                      className="text-gray-500 hover:bg-gray-50 text-[10px] font-semibold tracking-wide px-4 py-2 rounded-xl transition-colors uppercase block text-left"
                    >
                      WordPress Development Services
                    </Link>
                    <Link 
                      to="/services/custom-website-development" 
                      onClick={() => setIsOpen(false)}
                      className="text-gray-500 hover:bg-gray-50 text-[10px] font-semibold tracking-wide px-4 py-2 rounded-xl transition-colors uppercase block text-left"
                    >
                      Custom Website Development
                    </Link>
                    <Link 
                      to="/services/ecommerce-development" 
                      onClick={() => setIsOpen(false)}
                      className="text-gray-500 hover:bg-gray-50 text-[10px] font-semibold tracking-wide px-4 py-2 rounded-xl transition-colors uppercase block text-left"
                    >
                      Ecommerce Development
                    </Link>
                    <Link 
                      to="/services/ui-ux-design" 
                      onClick={() => setIsOpen(false)}
                      className="text-gray-500 hover:bg-gray-50 text-[10px] font-semibold tracking-wide px-4 py-2 rounded-xl transition-colors uppercase block text-left"
                    >
                      UI/UX Design
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Link 
            to="/team" 
            onClick={() => setIsOpen(false)}
            className={`${isActive('/team') ? 'bg-rize-primary text-white' : 'text-gray-700 hover:bg-gray-50'} text-xs font-bold tracking-wide px-5 py-3 rounded-2xl transition-colors uppercase block`}
          >
            Our Team
          </Link>
          <Link 
            to="/portfolio" 
            onClick={() => setIsOpen(false)}
            className={`${isActive('/portfolio') ? 'bg-rize-primary text-white' : 'text-gray-700 hover:bg-gray-50'} text-xs font-bold tracking-wide px-5 py-3 rounded-2xl transition-colors uppercase block`}
          >
            Our Portfolio
          </Link>
          <Link 
            to="/locations" 
            onClick={() => setIsOpen(false)}
            className={`${isActive('/locations') ? 'bg-rize-primary text-white' : 'text-gray-700 hover:bg-gray-50'} text-xs font-bold tracking-wide px-5 py-3 rounded-2xl transition-colors uppercase block`}
          >
            Our Locations
          </Link>
          <Link 
            to="/careers" 
            onClick={() => setIsOpen(false)}
            className={`${isActive('/careers') ? 'bg-rize-primary text-white' : 'text-gray-700 hover:bg-gray-50'} text-xs font-bold tracking-wide px-5 py-3 rounded-2xl transition-colors uppercase block`}
          >
            Careers
          </Link>
          <Link 
            to="/blogs" 
            onClick={() => setIsOpen(false)}
            className={`${isActive('/blogs') ? 'bg-rize-primary text-white' : 'text-gray-700 hover:bg-gray-50'} text-xs font-bold tracking-wide px-5 py-3 rounded-2xl transition-colors uppercase block`}
          >
            Blogs
          </Link>
          <Link 
            to="/contact" 
            onClick={() => setIsOpen(false)}
            className={`${isActive('/contact') ? 'bg-rize-primary text-white' : 'text-gray-700 hover:bg-gray-50'} text-xs font-bold tracking-wide px-5 py-3 rounded-2xl transition-colors uppercase block`}
          >
            Contact Us
          </Link>
          <a 
            href="https://wa.me/919024615510" 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={() => setIsOpen(false)}
            className="flex sm:hidden items-center justify-between btn-primary text-xs font-bold px-5 py-3 rounded-2xl uppercase tracking-wide mt-2"
          >
            <span>Let's Talk</span>
            <ArrowUpRight size={16} strokeWidth={2.5} />
          </a>
        </div>
      )}
      
    </header>
  );
}
