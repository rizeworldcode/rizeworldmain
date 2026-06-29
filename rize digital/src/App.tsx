import { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import PopupModal from './components/common/PopupModal';
import ScrollToTop from './components/common/ScrollToTop';
import FloatingButtons from './components/common/FloatingButtons';

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Team from './pages/Team';
import Portfolio from './pages/Portfolio';
import ProjectDetails from './pages/ProjectDetails';
import Careers from './pages/Careers';
import JobDetails from './pages/JobDetails';
import Contact from './pages/Contact';
import Blogs from './pages/Blogs';
import BlogDetails from './pages/BlogDetails';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import AccessibilityArrangements from './pages/AccessibilityArrangements';
import Faq from './pages/Faq';
import Pricing from './pages/Pricing';
import CaseStudies from './pages/CaseStudies';
import DynamicCityLandingPage from './pages/services/DynamicCityLandingPage';
import Locations from './pages/Locations';

// Lazy-loaded new architecture pages
const StateLandingPage = lazy(() => import('./pages/locations/StateLandingPage'));
const BlogCategoryPage = lazy(() => import('./pages/blogs/BlogCategoryPage'));
const CaseStudyDetails = lazy(() => import('./pages/CaseStudyDetails'));

// Individual Solution Pages
import DigitalMarketingService from './pages/services/DigitalMarketingService';
import WebDevelopment from './pages/services/WebDevelopment';
import SearchEngineOptimization from './pages/services/SearchEngineOptimization';
import SocialMediaMarketing from './pages/services/SocialMediaMarketing';
import PaidAds from './pages/services/PaidAds';
import WordPressDevelopmentServices from './pages/services/WordPressDevelopmentServices';
import CustomWebsiteDevelopment from './pages/services/CustomWebsiteDevelopment';
import ContentMarketing from './pages/services/ContentMarketing';
import GraphicDesign from './pages/services/GraphicDesign';
import EcommerceDevelopment from './pages/services/EcommerceDevelopment';
import UiUxDesign from './pages/services/UiUxDesign';

// City SEO Landing Pages
import DigitalMarketingAgencyInAlwar from './pages/services/DigitalMarketingAgencyInAlwar';
import DigitalMarketingAgencyInUdaipur from './pages/services/DigitalMarketingAgencyInUdaipur';
import DigitalMarketingAgencyInPrayagraj from './pages/services/DigitalMarketingAgencyInPrayagraj';
import DigitalMarketingAgencyInIndore from './pages/services/DigitalMarketingAgencyInIndore';
import DigitalMarketingAgencyInChandigarh from './pages/services/DigitalMarketingAgencyInChandigarh';

function App() {
  const location = useLocation();

  useEffect(() => {
    // Clear any previous ScrollTrigger instances to prevent accumulation
    ScrollTrigger.getAll().forEach(t => t.kill());

    // ScrollTrigger setup for Header/Navbar shadow on scroll
    const headerTrigger = ScrollTrigger.create({
      start: 'top -60',
      onUpdate: (self) => {
        gsap.to('header', {
          boxShadow: self.isActive ? '0 4px 24px rgba(0,0,0,0.08)' : 'none',
          backgroundColor: self.isActive ? 'rgba(255, 255, 255, 0.96)' : 'rgba(255, 255, 255, 0.92)',
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });

    // Section labels entrance animations
    gsap.utils.toArray('.section-label').forEach((el: any) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 88%' },
        y: 15, opacity: 0, duration: 0.5, ease: 'power2.out'
      });
    });

    // Section titles
    gsap.utils.toArray('.section-title').forEach((el: any) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 85%' },
        y: 30, opacity: 0, duration: 0.8, ease: 'power3.out'
      });
    });

    // Section subtitles
    gsap.utils.toArray('.section-subtitle').forEach((el: any) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 85%' },
        y: 20, opacity: 0, duration: 0.7, delay: 0.15, ease: 'power2.out'
      });
    });

    // Cards entrance animation
    gsap.utils.toArray('.premium-card').forEach((card: any, i: number) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 0.7,
        delay: (i % 3) * 0.12,
        ease: 'power3.out'
      });
    });

    // Card 3D tilt effect
    const cards = document.querySelectorAll('.premium-card');
    cards.forEach((card: any) => {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, {
          rotateY: x * 8,
          rotateX: -y * 8,
          duration: 0.4,
          ease: 'power2.out',
          transformPerspective: 1000,
          transformOrigin: 'center center'
        });
      };
      
      const handleMouseLeave = () => {
        gsap.to(card, {
          rotateY: 0,
          rotateX: 0,
          duration: 0.6,
          ease: 'power2.out'
        });
      };

      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
      (card as any)._cleanup = () => {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      };
    });

    // Counter numbers animation
    gsap.utils.toArray('.counter-number').forEach((el: any) => {
      const target = parseInt(el.dataset.value || '0', 10);
      gsap.fromTo(el,
        { innerText: 0 },
        {
          scrollTrigger: { trigger: el, start: 'top 80%' },
          innerText: target,
          duration: 2.2,
          snap: { innerText: 1 },
          ease: 'power2.out',
          onUpdate: function () {
            el.innerText = Math.round(this.targets()[0].innerText).toLocaleString();
          }
        }
      );
    });

    // Refresh ScrollTrigger to recalculate DOM elements positioning
    ScrollTrigger.refresh();

    return () => {
      headerTrigger.kill();
      cards.forEach((card: any) => {
        if (card._cleanup) card._cleanup();
      });
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-rize-bg flex flex-col relative z-0 overflow-x-hidden">
      <ScrollToTop />
      <PopupModal />
      <FloatingButtons />
      <Header />
      
      <main className="flex-1 w-full relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/team" element={<Team />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/:projectId" element={<ProjectDetails />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/careers/:jobId" element={<JobDetails />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogDetails />} />
          <Route path="/blogs/category/:categorySlug" element={<Suspense fallback={<div className="min-h-screen" />}><BlogCategoryPage /></Suspense>} />
          
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/accessibility" element={<AccessibilityArrangements />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/case-studies/:slug" element={<Suspense fallback={<div className="min-h-screen" />}><CaseStudyDetails /></Suspense>} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/locations/:stateSlug" element={<Suspense fallback={<div className="min-h-screen" />}><StateLandingPage /></Suspense>} />
          
          {/* City SEO Landing Routes */}
          <Route path="/service/digital-marketing-agency-in-alwar" element={<DigitalMarketingAgencyInAlwar />} />
          <Route path="/service/digital-marketing-agency-in-udaipur" element={<DigitalMarketingAgencyInUdaipur />} />
          <Route path="/service/digital-marketing-agency-in-prayagraj" element={<DigitalMarketingAgencyInPrayagraj />} />
          <Route path="/service/digital-marketing-agency-in-indore" element={<DigitalMarketingAgencyInIndore />} />
          <Route path="/service/digital-marketing-agency-in-chandigarh" element={<DigitalMarketingAgencyInChandigarh />} />
          <Route path="/service/:citySlug" element={<DynamicCityLandingPage />} />
          
          {/* Individual Solution Routes */}
          <Route path="/services/digital-marketing" element={<DigitalMarketingService />} />
          <Route path="/services/web-development" element={<WebDevelopment />} />
          <Route path="/services/seo" element={<SearchEngineOptimization />} />
          <Route path="/services/social-media-marketing" element={<SocialMediaMarketing />} />
          <Route path="/services/paid-ads" element={<PaidAds />} />
          <Route path="/services/wordpress-development" element={<WordPressDevelopmentServices />} />
          <Route path="/services/custom-website-development" element={<CustomWebsiteDevelopment />} />
          <Route path="/services/content-marketing" element={<ContentMarketing />} />
          <Route path="/services/graphic-design" element={<GraphicDesign />} />
          <Route path="/services/ecommerce-development" element={<EcommerceDevelopment />} />
          <Route path="/services/ui-ux-design" element={<UiUxDesign />} />
          
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
