import { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import PopupModal from './components/common/PopupModal';
import ScrollToTop from './components/common/ScrollToTop';
import FloatingButtons from './components/common/FloatingButtons';

// Eagerly loaded primary landing page for instant FCP/LCP
import Home from './pages/Home';

// Lazy-loaded main pages
const Services = lazy(() => import('./pages/Services'));
const About = lazy(() => import('./pages/About'));
const Team = lazy(() => import('./pages/Team'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'));
const Careers = lazy(() => import('./pages/Careers'));
const JobDetails = lazy(() => import('./pages/JobDetails'));
const Contact = lazy(() => import('./pages/Contact'));
const Blogs = lazy(() => import('./pages/Blogs'));
const BlogDetails = lazy(() => import('./pages/BlogDetails'));
const BlogCategoryPage = lazy(() => import('./pages/blogs/BlogCategoryPage'));

const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const AccessibilityArrangements = lazy(() => import('./pages/AccessibilityArrangements'));
const Faq = lazy(() => import('./pages/Faq'));
const Pricing = lazy(() => import('./pages/Pricing'));
const PackageProposal = lazy(() => import('./pages/PackageProposal'));
const CaseStudies = lazy(() => import('./pages/CaseStudies'));
const CaseStudyDetails = lazy(() => import('./pages/CaseStudyDetails'));
const Locations = lazy(() => import('./pages/Locations'));
const StateLandingPage = lazy(() => import('./pages/locations/StateLandingPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Individual Solution Pages
const DigitalMarketingService = lazy(() => import('./pages/services/DigitalMarketingService'));
const WebDevelopment = lazy(() => import('./pages/services/WebDevelopment'));
const SearchEngineOptimization = lazy(() => import('./pages/services/SearchEngineOptimization'));
const SocialMediaMarketing = lazy(() => import('./pages/services/SocialMediaMarketing'));
const PaidAds = lazy(() => import('./pages/services/PaidAds'));
const WordPressDevelopmentServices = lazy(() => import('./pages/services/WordPressDevelopmentServices'));
const CustomWebsiteDevelopment = lazy(() => import('./pages/services/CustomWebsiteDevelopment'));
const ContentMarketing = lazy(() => import('./pages/services/ContentMarketing'));
const GraphicDesign = lazy(() => import('./pages/services/GraphicDesign'));
const EcommerceDevelopment = lazy(() => import('./pages/services/EcommerceDevelopment'));
const UiUxDesign = lazy(() => import('./pages/services/UiUxDesign'));

// City SEO Landing Pages
const DigitalMarketingAgencyInAlwar = lazy(() => import('./pages/services/DigitalMarketingAgencyInAlwar'));
const DigitalMarketingAgencyInUdaipur = lazy(() => import('./pages/services/DigitalMarketingAgencyInUdaipur'));
const DigitalMarketingAgencyInPrayagraj = lazy(() => import('./pages/services/DigitalMarketingAgencyInPrayagraj'));
const DigitalMarketingAgencyInIndore = lazy(() => import('./pages/services/DigitalMarketingAgencyInIndore'));
const DigitalMarketingAgencyInChandigarh = lazy(() => import('./pages/services/DigitalMarketingAgencyInChandigarh'));
const DynamicCityLandingPage = lazy(() => import('./pages/services/DynamicCityLandingPage'));

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.hash === '#services') {
      navigate('/services', { replace: true });
    }
  }, [location.hash, navigate]);

  const validRoutePrefixes = [
    '/services',
    '/about',
    '/team',
    '/portfolio',
    '/careers',
    '/blogs',
    '/privacy',
    '/terms',
    '/accessibility',
    '/faq',
    '/pricing',
    '/case-studies',
    '/locations',
    '/service',
    '/contact'
  ];

  const isNotFound = location.pathname !== '/' && !validRoutePrefixes.some(prefix => location.pathname.startsWith(prefix));

  return (
    <div className="min-h-screen bg-rize-bg flex flex-col relative z-0 overflow-x-hidden">
      {!isNotFound && <ScrollToTop />}
      {!isNotFound && <PopupModal />}
      {!isNotFound && <FloatingButtons />}
      {!isNotFound && <Header />}
      
      <main className="flex-1 w-full relative">
        <Suspense fallback={<div className="min-h-screen bg-rize-bg" />}>
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
            <Route path="/blogs/category/:categorySlug" element={<BlogCategoryPage />} />
            
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/accessibility" element={<AccessibilityArrangements />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/pricing/:packageId" element={<PackageProposal />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/case-studies/:slug" element={<CaseStudyDetails />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/locations/:stateSlug" element={<StateLandingPage />} />
            
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      {!isNotFound && <Footer />}
    </div>
  );
}

export default App;
