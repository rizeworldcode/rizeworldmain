import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Globe, CheckCircle, Send } from 'lucide-react';
import SEO from '../components/common/SEO';
import Breadcrumbs from '../components/common/Breadcrumbs';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    saveInfo: false
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        saveInfo: false
      });
    }, 3000);
  };

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact RizeWorld Digital",
    "description": "Get in touch with RizeWorld Digital's consultation team. Submit your project requirements, call or email us directly.",
    "url": "https://rizeworld.in/contact",
    "mainEntity": {
      "@type": "LocalBusiness",
      "name": "RizeWorld Digital Marketing Pvt Ltd",
      "telephone": "+91 90246 15510",
      "email": "hr.rizeworld@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "C-198, near Telco Circle, UIT colony, Shalimar Nagar",
        "addressLocality": "Alwar",
        "addressRegion": "Rajasthan",
        "postalCode": "301001",
        "addressCountry": "India"
      }
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://rizeworld.in/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Contact Us",
        "item": "https://rizeworld.in/contact"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-rize-bg overflow-hidden font-sans">
      <SEO 
        title="Contact Us | Hire Full-Service Digital Experts - RizeWorld"
        description="Get in touch with RizeWorld Digital. Submit your project brief for custom web applications, local SEO optimization, PPC campaigns, and branding design."
        canonicalUrl="https://rizeworld.in/contact"
        schema={[contactSchema, breadcrumbSchema]}
      />
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-36 pb-16 bg-rize-bg text-center flex flex-col items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center">
          <Breadcrumbs items={[{ name: "Contact Us" }]} />
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-gray-950 mb-4"
          >
            Contact Us
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed"
          >
            Have a project in mind or want to join our team? Drop us a message, and we'll get back to you shortly.
          </motion.p>
        </div>
      </section>

      {/* 2. CONTACT DETAILS & FORM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 grid grid-cols-1 lg:grid-cols-[1.1fr_1.9fr] gap-16 items-start">
        
        {/* Left Side: Contact Information */}
        <div className="flex flex-col text-left space-y-8 lg:sticky lg:top-36 font-sans">
          <div>
            <span className="text-[10px] font-bold text-rize-primary uppercase tracking-widest block mb-2">Get Info</span>
            <h2 className="text-4xl font-extrabold text-gray-950 uppercase tracking-tight leading-none mb-4">
              Our Offices
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Reach out directly or visit us at our offices in Rajasthan, India.
            </p>
          </div>

          <div className="space-y-6">
            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="icon-box icon-box-blue">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Location Address</p>
                <p className="text-gray-950 font-normal text-sm leading-snug">
                  C-198, near Telco Circle, UIT colony, Shalimar Nagar, Alwar, Rajasthan 301001, India
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="icon-box icon-box-blue">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Phone Number</p>
                <div className="flex flex-col">
                  <a href="tel:+919024615510" className="text-gray-950 font-normal text-sm hover:text-rize-primary transition-colors">
                    +91 90246 15510
                  </a>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="icon-box icon-box-blue">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Email Address</p>
                <a href="mailto:hr.rizeworld@gmail.com" className="text-gray-950 font-normal text-sm hover:text-rize-primary transition-colors">
                  hr.rizeworld@gmail.com
                </a>
              </div>
            </div>

            {/* Regional Info */}
            <div className="flex items-start gap-4">
              <div className="icon-box icon-box-blue">
                <Globe size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Region Location</p>
                <p className="text-gray-950 font-normal text-sm">
                  Alwar, Rajasthan, India
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Dynamic Form */}
        <div className="bg-white border border-gray-200/80 rounded-4xl p-6 md:p-10 shadow-sm text-left">
          {submitted ? (
            <div className="py-20 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold uppercase text-gray-950 mb-2">Message Sent</h3>
              <p className="text-gray-500 text-sm max-w-sm">
                Thank you for reaching out! We have received your query and will reply within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Full Name*</label>
                  <input
                    type="text"
                    required
                    placeholder=""
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-stone-50 border border-gray-200/80 rounded-2xl py-3.5 px-5 text-xs font-semibold text-gray-950 focus:outline-none focus:border-rize-primary focus:ring-1 focus:ring-rize-primary transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Your Email*</label>
                  <input
                    type="email"
                    required
                    placeholder=""
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-stone-50 border border-gray-200/80 rounded-2xl py-3.5 px-5 text-xs font-semibold text-gray-950 focus:outline-none focus:border-rize-primary focus:ring-1 focus:ring-rize-primary transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Phone Number (Optional)</label>
                  <input
                    type="text"
                    placeholder=""
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-stone-50 border border-gray-200/80 rounded-2xl py-3.5 px-5 text-xs font-semibold text-gray-950 focus:outline-none focus:border-rize-primary focus:ring-1 focus:ring-rize-primary transition-colors"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Subject</label>
                  <input
                    type="text"
                    placeholder=""
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-stone-50 border border-gray-200/80 rounded-2xl py-3.5 px-5 text-xs font-semibold text-gray-950 focus:outline-none focus:border-rize-primary focus:ring-1 focus:ring-rize-primary transition-colors"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">How can We Help You?</label>
                <textarea
                  rows={5}
                  placeholder=""
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-stone-50 border border-gray-200/80 rounded-2xl py-3.5 px-5 text-xs font-semibold text-gray-950 focus:outline-none focus:border-rize-primary focus:ring-1 focus:ring-rize-primary transition-colors resize-none"
                />
              </div>

              {/* Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="saveInfo"
                  checked={formData.saveInfo}
                  onChange={(e) => setFormData({ ...formData, saveInfo: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-rize-primary focus:ring-rize-primary"
                />
                <label htmlFor="saveInfo" className="text-xs text-gray-500 cursor-pointer select-none">
                  Please save my name, email address for the next time I message
                </label>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Submit Now <Send size={14} />
                </button>
              </div>
            </form>
          )}
        </div>

      </section>

      {/* 3. GOOGLE MAP EMBED BOX */}
      <section className="w-full bg-gray-100 h-[450px] relative shadow-inner overflow-hidden border-t border-gray-200">
        {/* Swappable iframe embed link mapping Alwar location */}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7071.256436237604!2d76.62151957524998!3d27.605053776241363!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397299b899b566c7%3A0xe68fc99d665ba773!2sRizeworld%20Digital%20Marketing%20Pvt%20Ltd%20Company!5e0!3m2!1sen!2sin!4v1781598175401!5m2!1sen!2sin"
          className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
          allowFullScreen
          loading="lazy"
          title="RizeWorld Office Map Location"
        />
      </section>

    </div>
  );
}
