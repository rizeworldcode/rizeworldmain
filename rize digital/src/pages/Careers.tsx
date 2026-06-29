import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Briefcase, IndianRupee, Users, Award, GraduationCap, ArrowRight } from 'lucide-react';
import { JOBS } from '../data/careers';
import type { Job } from '../data/careers';

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

export default function Careers() {
  const [jobsList, setJobsList] = useState<Job[]>(() => 
    JOBS.map(job => ({ ...job, salary: job.salary.replace(/\$/g, '₹') }))
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/getHearing`);
        const result = await response.json();
        if (result.success && result.data && result.data.length > 0) {
          const activeJobs = result.data
            .filter((bj: any) => bj.status !== 'inactive')
            .map(mapBackendJobToFrontend);
          
          if (activeJobs.length > 0) {
            setJobsList(activeJobs);
          }
        }
      } catch (error) {
        console.error("Error fetching careers from backend:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);
  return (
    <div className="min-h-screen bg-rize-bg overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-36 pb-20 bg-rize-bg text-center flex flex-col items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-gray-950 mb-4"
          >
            Careers at RizeWorld
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center gap-2 text-sm text-gray-500 font-medium mb-6"
          >
            <Link to="/" className="hover:text-rize-primary transition-colors">Home</Link>
            <span className="text-gray-300">/</span>
            <span className="text-rize-primary">Careers</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Explore our open positions. We are always looking for passionate, growth-minded professionals to build next-generation user experiences.
          </motion.p>
        </div>
      </section>

      {/* 2. JOB LISTINGS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {jobsList.map((job) => (
            <div
              key={job.id}
              className="premium-card w-full max-w-[360px] flex flex-col justify-between"
            >
              <div>
                {/* Icon Header */}
                <div className="icon-box icon-box-blue mb-6">
                  <Briefcase size={22} />
                </div>

                <h3 className="text-2xl font-bold uppercase text-gray-950 leading-tight mb-4">
                  {job.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  {job.subtitle}
                </p>

                {/* Parameters list */}
                <div className="space-y-4 border-t border-gray-100 pt-6 mb-8 text-left">
                  <div className="flex items-center gap-3">
                    <IndianRupee size={16} className="text-rize-primary" />
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase block">Salary</span>
                      <span className="text-gray-950 font-bold text-xs">{job.salary}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users size={16} className="text-rize-primary" />
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase block">Vacancy</span>
                      <span className="text-gray-950 font-bold text-xs">{job.vacancy}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Award size={16} className="text-rize-primary" />
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase block">Experience</span>
                      <span className="text-gray-950 font-bold text-xs">{job.experience}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <GraduationCap size={16} className="text-rize-primary" />
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase block">Education</span>
                      <span className="text-gray-950 font-bold text-xs">{job.education}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Link
                  to={`/careers/${job.id}`}
                  className="btn-primary w-full justify-center py-4!"
                >
                  Apply Position <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
