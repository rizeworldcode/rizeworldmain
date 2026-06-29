import { ArrowRight, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative w-full bg-white pt-16 pb-8 px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden mt-10 z-10 border-t border-gray-200">
      
      {/* Top Gradient Border */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-rize-primary via-rize-indigo to-rize-cyan" />

      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(26,86,219,0.04)_0%,transparent_50%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1600px] mx-auto">
        
        {/* TOP ROW: LOGO, LOCATIONS, SOCIALS */}
        <div className="flex flex-col xl:flex-row items-center justify-between gap-10 pb-12 border-b border-gray-200">
          
          {/* Logo & Main HQ */}
          <div className="flex flex-col sm:flex-row items-center gap-6 shrink-0 w-full xl:w-auto justify-between xl:justify-start">
            <Link to="/" className="flex items-center">
              <img src="/images/logo/RW.png" alt="RizeWorld" className="h-24 object-contain" />
            </Link>
          </div>

          {/* Socials & Email */}
          <div className="flex flex-col sm:flex-row items-center gap-8 shrink-0 w-full xl:w-auto justify-center xl:justify-end">
            <div className="flex items-center gap-6 text-gray-500">
              {/* Facebook */}
              <a href="https://www.facebook.com/share/1BcNrvpmuJ/" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 hover:text-rize-primary cursor-pointer transition-colors"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              {/* LinkedIn */}
              <a href="https://www.linkedin.com/company/rizeworld/" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 hover:text-rize-primary cursor-pointer transition-colors"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              {/* Instagram */}
              <a href="https://www.instagram.com/rizeworld?igsh=MWYxOGs5NGhhdnNsNA==" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 hover:text-rize-primary cursor-pointer transition-colors"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
            </div>
            <button 
              onClick={() => window.location.href = 'mailto:hr.rizeworld@gmail.com'}
              className="flex items-center gap-3 rounded-full bg-gray-50 border border-gray-200 px-8 py-3 text-gray-800 font-medium hover:border-rize-primary hover:bg-gray-100 hover:text-rize-primary transition-all duration-300"
            >
              hr.rizeworld@gmail.com
              <ArrowRight className="w-4 h-4 text-rize-primary" />
            </button>
          </div>
        </div>

        {/* MIDDLE GRID: NAVIGATION LINKS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-6 pt-12 pb-36">
          
          {/* Column 1: Quick Links */}
          <div className="flex flex-col">
            <h4 className="text-gray-900 font-bold text-sm tracking-widest mb-5 uppercase">Quick Links</h4>
            <ul className="flex flex-col gap-3">
              <li><Link to="/" className="text-gray-600 hover:text-rize-primary transition-colors text-sm">Home</Link></li>
              <li><Link to="/services" className="text-gray-600 hover:text-rize-primary transition-colors text-sm">Services</Link></li>
              <li><Link to="/portfolio" className="text-gray-600 hover:text-rize-primary transition-colors text-sm">Portfolio</Link></li>
              <li><Link to="/locations" className="text-gray-600 hover:text-rize-primary transition-colors text-sm">Locations</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-rize-primary transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          {/* Column 2: Services */}
          <div className="flex flex-col">
            <h4 className="text-gray-900 font-bold text-sm tracking-widest mb-5 uppercase">Services</h4>
            <ul className="flex flex-col gap-3">
              <li><Link to="/services/digital-marketing" className="text-gray-600 hover:text-rize-primary transition-colors text-sm">Digital Marketing</Link></li>
              <li><Link to="/services/seo" className="text-gray-600 hover:text-rize-primary transition-colors text-sm">SEO</Link></li>
              <li><Link to="/services/social-media-marketing" className="text-gray-600 hover:text-rize-primary transition-colors text-sm">Social Media</Link></li>
              <li><Link to="/services/paid-ads" className="text-gray-600 hover:text-rize-primary transition-colors text-sm">Paid Ads</Link></li>
              <li><Link to="/services/web-development" className="text-gray-600 hover:text-rize-primary transition-colors text-sm">Web Development</Link></li>
              <li><Link to="/services/content-marketing" className="text-gray-600 hover:text-rize-primary transition-colors text-sm">Content Marketing</Link></li>
              <li><Link to="/services/graphic-design" className="text-gray-600 hover:text-rize-primary transition-colors text-sm">Graphic Design</Link></li>
            </ul>
          </div>

          {/* Column 3: Locations */}
          <div className="flex flex-col">
            <h4 className="text-gray-900 font-bold text-sm tracking-widest mb-5 uppercase">Locations</h4>
            <ul className="flex flex-col gap-3">
              <li><Link to="/locations/delhi-ncr" className="text-gray-600 hover:text-rize-primary transition-colors text-sm">Delhi NCR</Link></li>
              <li><Link to="/locations/rajasthan" className="text-gray-600 hover:text-rize-primary transition-colors text-sm">Rajasthan</Link></li>
              <li><Link to="/locations/maharashtra" className="text-gray-600 hover:text-rize-primary transition-colors text-sm">Maharashtra</Link></li>
              <li><Link to="/locations/karnataka" className="text-gray-600 hover:text-rize-primary transition-colors text-sm">Karnataka</Link></li>
              <li><Link to="/locations/gujarat" className="text-gray-600 hover:text-rize-primary transition-colors text-sm">Gujarat</Link></li>
              <li><Link to="/locations/tamil-nadu" className="text-gray-600 hover:text-rize-primary transition-colors text-sm">Tamil Nadu</Link></li>
              <li><Link to="/locations/uttar-pradesh" className="text-gray-600 hover:text-rize-primary transition-colors text-sm">Uttar Pradesh</Link></li>
            </ul>
          </div>

          {/* Column 4: Resources */}
          <div className="flex flex-col">
            <h4 className="text-gray-900 font-bold text-sm tracking-widest mb-5 uppercase">Resources</h4>
            <ul className="flex flex-col gap-3">
              <li><Link to="/blogs" className="text-gray-600 hover:text-rize-primary transition-colors text-sm">Blogs</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-rize-primary transition-colors text-sm">FAQ</Link></li>
              <li><Link to="/case-studies" className="text-gray-600 hover:text-rize-primary transition-colors text-sm">Case Studies</Link></li>
              <li><Link to="/pricing" className="text-gray-600 hover:text-rize-primary transition-colors text-sm">Pricing</Link></li>
            </ul>
          </div>

          {/* Column 5: Company */}
          <div className="flex flex-col">
            <h4 className="text-gray-900 font-bold text-sm tracking-widest mb-5 uppercase">Company</h4>
            <ul className="flex flex-col gap-3">
              <li><Link to="/about" className="text-gray-600 hover:text-rize-primary transition-colors text-sm">About Us</Link></li>
              <li><Link to="/team" className="text-gray-600 hover:text-rize-primary transition-colors text-sm">Our Team</Link></li>
              <li><Link to="/careers" className="text-gray-600 hover:text-rize-primary transition-colors text-sm">Careers</Link></li>
            </ul>
          </div>

          {/* Column 6: Get in Touch */}
          <div className="flex flex-col">
            <h4 className="text-gray-900 font-bold text-sm tracking-widest mb-5 uppercase">Get in Touch</h4>
            <ul className="flex flex-col gap-5">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-rize-primary shrink-0 mt-0.5" />
                <div>
                  <span className="block text-gray-900 font-medium text-sm mb-0.5">Phone</span>
                  <a href="tel:9024615510" className="text-gray-600 hover:text-rize-primary transition-colors text-sm">90246 15510</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-rize-primary shrink-0 mt-0.5" />
                <div>
                  <span className="block text-gray-900 font-medium text-sm mb-0.5">Email</span>
                  <a href="mailto:hr.rizeworld@gmail.com" className="text-gray-600 hover:text-rize-primary transition-colors text-sm">hr.rizeworld@gmail.com</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-rize-primary shrink-0 mt-0.5" />
                <div>
                  <span className="block text-gray-900 font-medium text-sm mb-0.5">HQ</span>
                  <span className="text-gray-600 text-sm leading-relaxed block max-w-[200px]">Alwar, Rajasthan 301001</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM ROW: MASCOTS & CTA */}
        <div className="relative flex flex-col xl:flex-row items-center justify-between pt-0 pb-0 gap-8 -mt-24 pointer-events-none">
          
          {/* Mascots (Inline Flex Item) */}
          <div className="w-[280px] sm:w-[350px] lg:w-[450px] pointer-events-none z-10 shrink-0">
            <img 
              src="/images/footer/mascots_transparent.png" 
              alt="RizeWorld Mascots"
              className="w-full h-auto object-contain filter drop-shadow-[0_0_25px_rgba(34,211,238,0.15)] brightness-95"
            />
          </div>

          {/* CTA Text */}
          <div className="flex-1 text-center xl:text-left relative z-20 px-4 pointer-events-auto -mt-6 sm:mt-0">
            <h3 className="text-gray-900 text-3xl sm:text-4xl lg:text-5xl font-medium leading-[1.3] tracking-tight">
              <span className="text-rize-primary">Still here? Perfect.</span><br />
              That means you're ready. <span className="underline decoration-2 underline-offset-8 decoration-gray-300">Let's chat.</span>
            </h3>
          </div>

          {/* CTA Button */}
          <div className="relative z-20 shrink-0 pointer-events-auto mt-4 sm:mt-0">
            <Link to="/portfolio" className="flex items-center gap-2 sm:gap-3 rounded-full bg-linear-to-r from-rize-primary to-rize-indigo px-5 sm:px-7 lg:px-10 py-3 sm:py-4 lg:py-5 text-white font-medium text-sm sm:text-base lg:text-lg hover:shadow-[0_0_30px_rgba(26,86,219,0.3)] transition-all duration-300 group">
              Let's build your growth story
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>
        </div>

        {/* COPYRIGHT BOTTOM */}
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-6 sm:gap-10 pt-4 border-t border-gray-200 text-xs sm:text-sm text-gray-600 font-medium mt-6 sm:mt-0">
          <span>© All Rights Reserved. Crafted by RizeWorld.</span>
          <Link to="/privacy" className="hover:text-rize-primary transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-rize-primary transition-colors">Terms of Service</Link>
          <Link to="/accessibility" className="hover:text-rize-primary transition-colors">Accessibility Arrangements</Link>
        </div>
      </div>
    </footer>
  );
}
