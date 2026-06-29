import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mail, Calendar, IndianRupee, Users, Award, GraduationCap, MapPin, Check, Briefcase, X } from 'lucide-react';
import { JOBS } from '../data/careers';
import type { Job } from '../data/careers';
import SEO from '../components/common/SEO';
import Breadcrumbs from '../components/common/Breadcrumbs';

const getApiBaseUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:45000/api';
  }
  return 'https://rizeworldmain.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl();

const mapBackendJobToFrontend = (bj: any): Job => {
  // Format the deadline date nicely (e.g., DD/MM/YYYY)
  let deadline = 'N/A';
  if (bj.lastDate) {
    const d = new Date(bj.lastDate);
    if (!isNaN(d.getTime())) {
      deadline = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    }
  }

  // Capitalize gender or map "both" to "Male/Female"
  let gender = 'Male/Female';
  if (bj.gender === 'male') gender = 'Male';
  else if (bj.gender === 'female') gender = 'Female';

  return {
    id: bj._id || bj.id,
    title: bj.post || 'Open Position',
    subtitle: bj.description || 'Join our growing team of professionals.',
    salary: bj.salary ? bj.salary.replace(/\$/g, '₹') : 'Negotiable',
    vacancy: bj.vacancy || 'Not specified',
    experience: bj.experience || 'Not specified',
    education: bj.qulification && bj.qulification.length > 0 ? bj.qulification[0] : 'Graduate / Equivalent',
    gender: gender,
    deadline: deadline,
    location: 'C-198, near Telco Circle, UIT colony, Shalimar Nagar, Alwar, Rajasthan 301001',
    overview: bj.overview || bj.description || '',
    responsibilities: bj.keyResponsibilities || [],
    qualifications: bj.qulification || [],
    offers: bj.whatWeOffer || []
  };
};

export default function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [job, setJob] = useState<Job | undefined>(() => {
    const found = JOBS.find(j => j.id === jobId);
    return found ? { ...found, salary: found.salary.replace(/\$/g, '₹') } : undefined;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/getHearing`);
        const result = await response.json();
        if (result.success && result.data) {
          const backendJobs = result.data.map(mapBackendJobToFrontend);
          const found = backendJobs.find((j: Job) => j.id === jobId);
          if (found) {
            setJob(found);
          }
        }
      } catch (error) {
        console.error("Error fetching job details from backend:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  if (loading && !job) {
    return (
      <div className="min-h-screen pt-36 pb-20 px-4 text-center bg-stone-50 flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-gray-950 mb-4 uppercase">Loading Position...</h2>
        <p className="text-gray-500 mb-8">Please wait while we fetch the job details.</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen pt-36 pb-20 px-4 text-center bg-stone-50 flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-gray-950 mb-4 uppercase">Position Not Found</h2>
        <p className="text-gray-500 mb-8">The career position you are looking for does not exist.</p>
        <Link to="/careers" className="bg-orange-500 text-white font-bold px-6 py-3 rounded-full hover:bg-orange-600 transition-colors uppercase text-xs tracking-wider">
          Back to Careers
        </Link>
      </div>
    );
  }

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowApplyModal(false);
    }, 2000);
  };

  const jobUrl = `${window.location.origin}/careers/${job.id}`;

  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.overview,
    "datePosted": "2026-06-20",
    "validThrough": job.deadline ? job.deadline.split('/').reverse().join('-') : "2026-12-31",
    "employmentType": "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": "RizeWorld Digital",
      "sameAs": window.location.origin
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": job.location,
        "addressLocality": "Alwar",
        "addressRegion": "Rajasthan",
        "addressCountry": "IN"
      }
    },
    "baseSalary": {
      "@type": "MonetaryAmount",
      "currency": "INR",
      "value": {
        "@type": "QuantitativeValue",
        "value": job.salary,
        "unitText": "MONTH"
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
        "item": `${window.location.origin}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Careers",
        "item": `${window.location.origin}/careers`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": job.title,
        "item": jobUrl
      }
    ]
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-24 overflow-hidden">
      <SEO
        title={`${job.title} - Careers | RizeWorld Digital`}
        description={job.overview}
        canonicalUrl={jobUrl}
        ogType="website"
        schema={[jobPostingSchema, breadcrumbSchema]}
      />

      {/* 1. BREADCRUMBS & NAVIGATION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/careers')}
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-900 hover:text-orange-500 transition-colors group cursor-pointer w-fit"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Careers
        </button>

        <Breadcrumbs items={[{ name: 'Careers', path: '/careers' }, { name: job.title }]} />
      </div>

      {/* 2. MAIN SPLIT DETAILS BLOCK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[2fr_1.1fr] gap-16 items-start">

        {/* Left Side: Job specifics */}
        <div className="flex flex-col text-left">
          <span className="text-orange-500 font-bold uppercase tracking-widest text-xs mb-3 block">
            Apply {job.title}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-950 leading-none uppercase tracking-tighter mb-4">
            {job.title}
          </h1>
          <p className="text-gray-500 text-base md:text-lg mb-10 italic">
            {job.subtitle}
          </p>

          {/* Job Overview */}
          <div className="mb-10">
            <h3 className="text-lg font-bold uppercase text-gray-950 mb-4 tracking-wide">Job Overview:</h3>
            <p className="text-gray-600 leading-relaxed">
              {job.overview}
            </p>
          </div>

          {/* Key Responsibilities */}
          <div className="mb-10">
            <h3 className="text-lg font-bold uppercase text-gray-950 mb-4 tracking-wide">Key Responsibilities:</h3>
            <ul className="space-y-3">
              {job.responsibilities.map((resp, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-600 leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} />
                  </span>
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Qualification */}
          <div className="mb-10">
            <h3 className="text-lg font-bold uppercase text-gray-950 mb-4 tracking-wide">Qualification:</h3>
            <ul className="space-y-3">
              {job.qualifications.map((qual, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-600 leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} />
                  </span>
                  <span>{qual}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Job Location & Salary info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 border-t border-b border-gray-200/80 py-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Job Location</p>
                <p className="text-gray-950 font-bold text-sm">{job.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center">
                <IndianRupee size={18} />
              </div>
              <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Salary</p>
                <p className="text-gray-950 font-bold text-sm">{job.salary.replace('$', '₹')}</p>
              </div>
            </div>
          </div>

          {/* What We Offer */}
          <div className="mb-12">
            <h3 className="text-lg font-bold uppercase text-gray-950 mb-4 tracking-wide">What We Offer:</h3>
            <ul className="space-y-3">
              {job.offers.map((offer, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-600 leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} />
                  </span>
                  <span>{offer}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Ready to Join Us */}
          <div className="bg-white border border-gray-200/80 p-8 rounded-4xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h4 className="text-xl font-bold uppercase text-gray-950 mb-2">Ready to Join Us?</h4>
              <p className="text-xs text-gray-500 max-w-md">
                If you are excited about the prospect of contributing to innovative projects and being part of a forward-thinking team, apply now or send your CV!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <button
                onClick={() => setShowApplyModal(true)}
                className="px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-wider text-xs rounded-full transition-colors cursor-pointer text-center"
              >
                Apply Position
              </button>
              <a
                href="mailto:info@rizeworld.com"
                className="px-6 py-3.5 bg-gray-950 hover:bg-orange-500 text-white font-bold uppercase tracking-wider text-xs rounded-full transition-colors text-center inline-flex items-center justify-center gap-2"
              >
                <Mail size={14} /> Apply by Email
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: Key Job Info Card */}
        <div className="lg:sticky lg:top-36 bg-white border border-gray-200/80 rounded-4xl p-6 md:p-8 text-left shadow-sm">
          <h3 className="text-lg font-bold uppercase text-gray-950 mb-6 border-b border-gray-100 pb-4 tracking-wide flex items-center gap-2">
            <Briefcase size={18} className="text-orange-500" /> Job Key Info
          </h3>

          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <IndianRupee size={16} className="text-orange-500" />
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Salary</span>
                <span className="text-gray-950 font-bold text-xs">{job.salary.replace('$', '₹')}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users size={16} className="text-orange-500" />
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Vacancy</span>
                <span className="text-gray-950 font-bold text-xs">{job.vacancy}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Award size={16} className="text-orange-500" />
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Experiences</span>
                <span className="text-gray-950 font-bold text-xs">{job.experience}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <GraduationCap size={16} className="text-orange-500" />
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Education</span>
                <span className="text-gray-950 font-bold text-xs">{job.education}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users size={16} className="text-orange-500" />
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Gender</span>
                <span className="text-gray-950 font-bold text-xs">{job.gender}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-orange-500" />
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Deadline</span>
                <span className="text-gray-950 font-bold text-xs">{job.deadline}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-100 pt-6">
            <span className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Company Contact</span>
            <p className="text-gray-900 font-bold text-sm">hr.rizeworld@gmail.com</p>
          </div>
        </div>

      </section>

      {/* APPLICATION MODAL */}
      <AnimatePresence>
        {showApplyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowApplyModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md bg-white rounded-4xl p-6 md:p-8 overflow-hidden shadow-2xl z-10 border border-gray-100 flex flex-col text-left"
            >

              <button
                onClick={() => setShowApplyModal(false)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-gray-100 text-gray-900 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-bold uppercase text-gray-950 mb-1 leading-none mt-4">
                Apply Position
              </h2>
              <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-6">
                {job.title}
              </p>

              {submitted ? (
                <div className="py-12 text-center flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mb-4 animate-bounce">
                    ✓
                  </div>
                  <h4 className="text-lg font-bold text-gray-950 uppercase mb-2">Application Sent</h4>
                  <p className="text-sm text-gray-500">Thank you! We will get in touch with you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Full Name</label>
                    <input type="text" required placeholder="John Doe" className="w-full bg-stone-50 border border-gray-200 rounded-2xl py-3 px-4 text-xs font-medium text-gray-950 focus:outline-none focus:border-orange-500" />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Email Address</label>
                    <input type="email" required placeholder="john@example.com" className="w-full bg-stone-50 border border-gray-200 rounded-2xl py-3 px-4 text-xs font-medium text-gray-950 focus:outline-none focus:border-orange-500" />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">LinkedIn Profile</label>
                    <input type="url" placeholder="https://linkedin.com/in/username" className="w-full bg-stone-50 border border-gray-200 rounded-2xl py-3 px-4 text-xs font-medium text-gray-950 focus:outline-none focus:border-orange-500" />
                  </div>

                  <div className="pt-4">
                    <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-wider text-xs py-4 px-6 rounded-full transition-colors cursor-pointer">
                      Submit Application
                    </button>
                  </div>
                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
