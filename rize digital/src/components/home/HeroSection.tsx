import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaInstagram, FaFacebook, FaReact, FaBrain } from 'react-icons/fa';
import { SiGoogleanalytics, SiGoogleads, SiMeta } from 'react-icons/si';

// Custom CountUp Hook
function useCountUp(end: number, duration: number = 2000, delay: number = 1200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let timerId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // easeOutCubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * end));

      if (progress < 1) {
        timerId = window.requestAnimationFrame(step);
      }
    };

    const startTimer = setTimeout(() => {
      timerId = window.requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(startTimer);
      cancelAnimationFrame(timerId);
    };
  }, [end, duration, delay]);

  return count;
}

// Typewriter Heading Component
function TypewriterHeading() {
  const fullText = "Grow Your Business Online with Professional Web Design, SEO Services, and Elite Digital Marketing Services!";
  const [typedText, setTypedText] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let interval: any;
    setTypedText("");
    setIsFinished(false);

    const delayTimer = setTimeout(() => {
      interval = setInterval(() => {
        setTypedText((prev) => {
          const nextIndex = prev.length;
          if (nextIndex < fullText.length) {
            return prev + fullText.charAt(nextIndex);
          } else {
            clearInterval(interval);
            setIsFinished(true);
            return prev;
          }
        });
      }, 35);
    }, 400);

    return () => {
      clearTimeout(delayTimer);
      if (interval) clearInterval(interval);
    };
  }, []);

  // Split colored text based on length
  // First 31 characters are white for high contrast, the rest is purple accent!
  const renderText = () => {
    const splitIndex = 31;
    if (typedText.length <= splitIndex) {
      return <span className="text-white">{typedText}</span>;
    } else {
      const part1 = typedText.substring(0, splitIndex);
      const part2 = typedText.substring(splitIndex);
      return (
        <>
          <span className="text-white">{part1}</span>
          <span className="text-[#A068FF] font-black">{part2}</span>
        </>
      );
    }
  };

  return (
    <h1 className="font-sans text-left text-4xl md:text-5xl lg:text-[3.2rem] font-black leading-[1.1] tracking-tight mb-8 select-none relative min-h-[160px] lg:min-h-[220px]">
      {renderText()}
      <span className={`inline-block w-[3px] h-[36px] md:h-[48px] bg-[#A068FF] ml-1 align-middle ${!isFinished ? 'animate-pulse' : 'hidden'}`} />
    </h1>
  );
}

export default function HeroSection() {
  const count = useCountUp(20);

  return (
    <div className="w-full flex flex-col justify-between items-center relative gap-12 lg:gap-16 pt-24 md:pt-28 lg:pt-32">
      
      {/* Styles block for conic gradient borders and animations */}
      <style>{`
        @property --border-angle {
          syntax: '<angle>';
          inherits: false;
          initial-value: 0deg;
        }

        @keyframes rotate-gradient {
          from {
            --border-angle: 0deg;
          }
          to {
            --border-angle: 360deg;
          }
        }

        .btn-border-wrap {
          position: relative;
          border-radius: 50px;
          padding: 2.5px;
          background: transparent;
          display: inline-block;
          overflow: hidden;
        }

        .btn-border-wrap::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50px;
          padding: 2.5px;
          background: conic-gradient(from var(--border-angle), #A068FF, #070319, #A068FF, #070319, #A068FF);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          animation: rotate-gradient 3s linear infinite;
        }

        .btn-slide-hover {
          position: relative;
          overflow: hidden;
          z-index: 1;
        }

        .btn-slide-hover::after {
          content: '';
          position: absolute;
          inset: 0;
          background: #A068FF;
          z-index: -1;
          transform: translateX(-100%);
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .btn-slide-hover:hover::after {
          transform: translateX(0);
        }

        .btn-slide-hover-right::after {
          content: '';
          position: absolute;
          inset: 0;
          background: #A068FF;
          z-index: -1;
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .btn-slide-hover-right:hover::after {
          transform: translateX(0);
        }

        /* Orbits animations */
        @keyframes spin-left {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        @keyframes spin-right {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-spin-left {
          animation: spin-left var(--duration, 30s) linear infinite;
        }

        .animate-spin-right {
          animation: spin-right var(--duration, 40s) linear infinite;
        }

        /* Avatar entry animations */
        @keyframes avatar-fly-in {
          0% {
            opacity: 0;
            filter: blur(10px);
            scale: 0.5;
          }
          100% {
            opacity: 1;
            filter: blur(0);
            scale: 1;
          }
        }

        .avatar-node {
          position: absolute;
          top: 50%;
          left: 50%;
          animation: avatar-fly-in 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          opacity: 0;
        }

        /* Logo ticker animation */
        @keyframes logo-ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .animate-logo-ticker {
          animation: logo-ticker 20s linear infinite;
        }

        /* Orbit gradient border with mask */
        .orbit-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          border: 1px solid transparent;
          background: linear-gradient(180deg, rgba(217, 161, 255, 0) 0%, rgba(217, 161, 255, 0.4) 43%, rgba(217, 161, 255, 0) 100%) border-box;
          pointer-events: none;
        }

        .circle-viz {
          transform: scale(0.35) translateY(-30px);
        }
        @media (min-width: 640px) {
          .circle-viz { transform: scale(0.48) translateY(-20px); }
        }
        @media (min-width: 768px) {
          .circle-viz { transform: scale(0.58) translateY(-10px); }
        }
        @media (min-width: 1024px) {
          .circle-viz { transform: scale(0.55) translateY(0); }
        }
        @media (min-width: 1280px) {
          .circle-viz { transform: scale(0.68) translateY(0); }
        }
        @media (min-width: 1536px) {
          .circle-viz { transform: scale(0.81) translateY(0); }
        }
      `}</style>

      {/* Main Row */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-[1400px]">
        
        {/* Left Hero Content */}
        <div className="flex flex-col items-start text-left max-w-xl md:max-w-2xl">
          <TypewriterHeading />

          {/* Start Project wrap */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full"
          >
            <div className="btn-border-wrap">
              <Link
                to="/contact"
                className="btn-slide-hover-right inline-flex items-center gap-2 rounded-full bg-[#060218] px-8 py-4 text-white font-bold text-sm hover:text-white transition-colors duration-300 shadow-sm cursor-pointer"
              >
                Start Project
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

          </motion.div>
        </div>

        {/* Right Circles/Bubbles Visualization */}
        <div className="relative w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] md:w-[460px] md:h-[460px] lg:w-[440px] lg:h-[440px] xl:w-[540px] xl:h-[540px] 2xl:w-[650px] 2xl:h-[650px] mx-auto flex items-center justify-center select-none circle-viz mt-2 sm:mt-4 lg:mt-6">
          
          {/* Orbit 4 (Outermost) */}
          <div className="orbit-ring w-[797px] h-[797px]" />
          <div className="absolute w-[797px] h-[797px] animate-spin-left" style={{ '--duration': '60s' } as any}>
            {/* React Icon (0deg) */}
            <div className="avatar-node" style={{ transform: 'translate(-50%, -50%) rotate(0deg) translate(398.5px) rotate(-0deg)', animationDelay: '0.2s' }}>
              <div className="w-[88px] h-[88px] flex items-center justify-center bg-[#20232a] text-[#61dafb] rounded-full border-2 border-[#61dafb] shadow-[0_0_20px_rgba(97,218,251,0.5)] hover:scale-115 transition-transform duration-300 cursor-pointer">
                <FaReact size={48} className="animate-spin" style={{ animationDuration: '12s' }} />
              </div>
            </div>
            {/* Mohit Avatar (72deg) */}
            <div className="avatar-node" style={{ transform: 'translate(-50%, -50%) rotate(72deg) translate(398.5px) rotate(-72deg)', animationDelay: '0.6s' }}>
              <img src="/team/mohit.jpg.jpeg" alt="Mohit" decoding="async" className="w-[74px] h-[74px] object-cover rounded-full border-2 border-[#00c8ff] shadow-[0_0_15px_rgba(0,200,255,0.6)] hover:scale-115 transition-transform duration-300 cursor-pointer" />
            </div>
            {/* Aman Avatar (144deg) */}
            <div className="avatar-node" style={{ transform: 'translate(-50%, -50%) rotate(144deg) translate(398.5px) rotate(-144deg)', animationDelay: '1.0s' }}>
              <img src="/team/aman.jpg.jpeg" alt="Aman" decoding="async" className="w-[74px] h-[74px] object-cover rounded-full border-2 border-[#61dafb] shadow-[0_0_15px_rgba(97,218,251,0.6)] hover:scale-115 transition-transform duration-300 cursor-pointer" />
            </div>
            {/* Meta Icon (216deg) */}
            <div className="avatar-node" style={{ transform: 'translate(-50%, -50%) rotate(216deg) translate(398.5px) rotate(-216deg)', animationDelay: '1.4s' }}>
              <div className="w-[58px] h-[58px] flex items-center justify-center bg-[#0064e0] text-white rounded-full border-2 border-white shadow-[0_0_15px_rgba(0,100,224,0.5)] hover:scale-115 transition-transform duration-300 cursor-pointer">
                <SiMeta size={28} />
              </div>
            </div>
            {/* Photoshop Icon (288deg) */}
            <div className="avatar-node" style={{ transform: 'translate(-50%, -50%) rotate(288deg) translate(398.5px) rotate(-288deg)', animationDelay: '1.8s' }}>
              <div className="w-[58px] h-[58px] flex items-center justify-center bg-[#001c3a] text-[#00c8ff] font-extrabold text-xl rounded-2xl border-2 border-[#00c8ff] shadow-[0_0_15px_rgba(0,200,255,0.5)] select-none hover:scale-115 transition-transform duration-300 cursor-pointer">
                Ps
              </div>
            </div>
          </div>

          {/* Orbit 3 */}
          <div className="orbit-ring w-[649px] h-[649px]" />
          <div className="absolute w-[649px] h-[649px] animate-spin-right" style={{ '--duration': '50s' } as any}>
            {/* Google Ads Icon (0deg) */}
            <div className="avatar-node" style={{ transform: 'translate(-50%, -50%) rotate(0deg) translate(324.5px) rotate(-0deg)', animationDelay: '0.4s' }}>
              <div className="w-[88px] h-[88px] flex items-center justify-center bg-white text-[#4285F4] rounded-full border-2 border-[#4285F4] shadow-[0_0_20px_rgba(66,133,244,0.5)] p-4 hover:scale-115 transition-transform duration-300 cursor-pointer">
                <SiGoogleads size={40} />
              </div>
            </div>
            {/* Facebook Icon (180deg) */}
            <div className="avatar-node" style={{ transform: 'translate(-50%, -50%) rotate(180deg) translate(324.5px) rotate(-180deg)', animationDelay: '0.8s' }}>
              <div className="w-[88px] h-[88px] flex items-center justify-center bg-[#1877f2] text-white rounded-full border-2 border-white shadow-[0_0_20px_rgba(24,119,242,0.5)] hover:scale-115 transition-transform duration-300 cursor-pointer">
                <FaFacebook size={44} />
              </div>
            </div>
          </div>

          {/* Orbit 2 */}
          <div className="orbit-ring w-[501px] h-[501px]" />
          <div className="absolute w-[501px] h-[501px] animate-spin-right" style={{ '--duration': '40s' } as any}>
            {/* Instagram Icon (0deg) */}
            <div className="avatar-node" style={{ transform: 'translate(-50%, -50%) rotate(0deg) translate(250.5px) rotate(-0deg)', animationDelay: '0.5s' }}>
              <div className="w-[78px] h-[78px] flex items-center justify-center bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white rounded-full border-2 border-white shadow-[0_0_18px_rgba(238,42,123,0.5)] hover:scale-115 transition-transform duration-300 cursor-pointer">
                <FaInstagram size={38} />
              </div>
            </div>
            {/* Google Analytics Icon (72deg) */}
            <div className="avatar-node" style={{ transform: 'translate(-50%, -50%) rotate(72deg) translate(250.5px) rotate(-72deg)', animationDelay: '0.9s' }}>
              <div className="w-[58px] h-[58px] flex items-center justify-center bg-[#f9ab00] text-white rounded-full border-2 border-white shadow-[0_0_15px_rgba(249,171,0,0.5)] hover:scale-115 transition-transform duration-300 cursor-pointer">
                <SiGoogleanalytics size={28} />
              </div>
            </div>
            {/* AI Brain Icon (144deg) */}
            <div className="avatar-node" style={{ transform: 'translate(-50%, -50%) rotate(144deg) translate(250.5px) rotate(-144deg)', animationDelay: '1.3s' }}>
              <div className="w-[58px] h-[58px] flex items-center justify-center bg-[#0B0F19] text-[#10B981] rounded-2xl border-2 border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.5)] hover:scale-115 transition-transform duration-300 cursor-pointer">
                <FaBrain size={28} />
              </div>
            </div>
            {/* Kavin Avatar (216deg) */}
            <div className="avatar-node" style={{ transform: 'translate(-50%, -50%) rotate(216deg) translate(250.5px) rotate(-216deg)', animationDelay: '1.7s' }}>
              <img src="/team/kavin.jpg.jpeg" alt="Kavin" decoding="async" className="w-[74px] h-[74px] object-cover rounded-full border-2 border-[#ee2a7b] shadow-[0_0_15px_rgba(238,42,123,0.6)] hover:scale-115 transition-transform duration-300 cursor-pointer" />
            </div>
            {/* Manoj Avatar (288deg) */}
            <div className="avatar-node" style={{ transform: 'translate(-50%, -50%) rotate(288deg) translate(250.5px) rotate(-288deg)', animationDelay: '2.1s' }}>
              <img src="/team/manoj.jpg.jpeg" alt="Manoj" decoding="async" className="w-[74px] h-[74px] object-cover rounded-full border-2 border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.6)] hover:scale-115 transition-transform duration-300 cursor-pointer" />
            </div>
          </div>

          {/* Orbit 1 (Innermost) */}
          <div className="orbit-ring w-[353px] h-[353px]" />
          <div className="absolute w-[353px] h-[353px] animate-spin-left" style={{ '--duration': '30s' } as any}>
            {/* After Effects Icon (0deg) */}
            <div className="avatar-node" style={{ transform: 'translate(-50%, -50%) rotate(0deg) translate(176.5px) rotate(-0deg)', animationDelay: '0.7s' }}>
              <div className="w-[58px] h-[58px] flex items-center justify-center bg-[#1d0032] text-[#d19eff] font-extrabold text-xl rounded-2xl border-2 border-[#d19eff] shadow-[0_0_15px_rgba(209,158,255,0.5)] select-none hover:scale-115 transition-transform duration-300 cursor-pointer">
                Ae
              </div>
            </div>
            {/* D1 Avatar (180deg) */}
            <div className="avatar-node" style={{ transform: 'translate(-50%, -50%) rotate(180deg) translate(176.5px) rotate(-180deg)', animationDelay: '1.5s' }}>
              <img src="/team/D1.png" alt="D1" decoding="async" className="w-[68px] h-[68px] object-cover rounded-full border-2 border-[#4285F4] shadow-[0_0_15px_rgba(66,133,244,0.6)] hover:scale-115 transition-transform duration-300 cursor-pointer" />
            </div>
          </div>

          {/* Central Orbit Target */}
          <div className="absolute w-[180px] h-[180px] rounded-full bg-stone-900/60 backdrop-blur-md border border-white/10 flex flex-col justify-center items-center shadow-inner z-20">
            <span className="text-5xl font-black text-white leading-none tracking-tighter uppercase">{count}k+</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">Specialists</span>
          </div>

        </div>

      </div>



    </div>
  );
}
