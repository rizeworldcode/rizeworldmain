import { PrimaryButton } from '../common/PrimaryButton';
import { thoughtLeadershipData } from '../../data/thoughtLeadership';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ThoughtLeadershipSection() {
  // We duplicate the array to create a seamless infinite scroll effect
  const repeatedCards = [...thoughtLeadershipData, ...thoughtLeadershipData];

  return (
    <section className="relative overflow-hidden px-4 sm:px-6 md:px-8 lg:px-12 py-20 md:py-28 bg-transparent">
      
      <style>
        {`
          @keyframes verticalLoopUp {
            0% { transform: translateY(0%); }
            100% { transform: translateY(-50%); }
          }
          @keyframes verticalLoopDown {
            0% { transform: translateY(-50%); }
            100% { transform: translateY(0%); }
          }
          .animate-vertical-loop-up {
            animation: verticalLoopUp 30s linear infinite;
          }
          .animate-vertical-loop-down {
            animation: verticalLoopDown 30s linear infinite;
          }
          .animate-vertical-loop-up:hover, .animate-vertical-loop-down:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      <div className="relative z-10 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1fr] gap-10 items-center">
          
          {/* Left Side — Auto Scrolling Media Grid */}
          <div className="relative h-[600px] lg:h-[800px] overflow-hidden rounded-[32px] mask-image-vertical">
            {/* CSS Mask for fading out top and bottom edges smoothly */}
            <div 
              className="absolute inset-0 pointer-events-none z-10" 
              style={{
                background: 'linear-gradient(to bottom, rgba(250,250,249,1) 0%, rgba(250,250,249,0) 15%, rgba(250,250,249,0) 85%, rgba(250,250,249,1) 100%)',
              }}
            />

            <div className="grid grid-cols-2 gap-4 h-max">
              {/* Column 1 (Scrolls Down for Anti-Clockwise effect) */}
              <div className="flex flex-col gap-4 animate-vertical-loop-down">
                {repeatedCards.map((card, idx) => (
                  <div key={`col1-${card.id}-${idx}`} className="group overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] flex flex-col">
                    <img 
                      src={card.image} 
                      alt={card.title} 
                      className={`w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${card.aspectRatio === 'portrait' ? 'aspect-3/4' : card.aspectRatio === 'landscape' ? 'aspect-video' : 'aspect-square'}`}
                    />
                    <div className="p-4 sm:p-5 bg-white relative z-10 border-t border-gray-100 flex-1 flex flex-col justify-center">
                      <h3 className="text-gray-900 text-base sm:text-lg font-semibold leading-snug">{card.title}</h3>
                      <p className="text-gray-500 text-xs sm:text-sm mt-2">{card.source}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Column 2 (Scrolls Up for Anti-Clockwise effect) */}
              <div className="flex flex-col gap-4 animate-vertical-loop-up">
                {[...repeatedCards].reverse().map((card, idx) => (
                  <div key={`col2-${card.id}-${idx}`} className="group overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] flex flex-col">
                    <img 
                      src={card.image} 
                      alt={card.title} 
                      className={`w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${card.aspectRatio === 'portrait' ? 'aspect-square' : card.aspectRatio === 'landscape' ? 'aspect-3/4' : 'aspect-video'}`}
                    />
                    <div className="p-4 sm:p-5 bg-white relative z-10 border-t border-gray-100 flex-1 flex flex-col justify-center">
                      <h3 className="text-gray-900 text-base sm:text-lg font-semibold leading-snug">{card.title}</h3>
                      <p className="text-gray-500 text-xs sm:text-sm mt-2">{card.source}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side Content */}
          <div className="max-w-2xl lg:pl-10">
            <h2 className="text-gray-900 font-semibold leading-tight tracking-tight text-4xl sm:text-5xl lg:text-6xl">
              Getting the <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 400 }}>Headlines</span>,<br className="hidden sm:block" />
              Leading with Thought Leadership
            </h2>
            
            <p className="mt-8 text-gray-500 text-lg md:text-xl leading-relaxed">
              RizeWorld doesn’t wait for attention — we engineer it. Through strategic PR campaigns, viral storytelling, and high-impact media positioning, we help brands dominate conversations and shape industry narratives.
            </p>

            <Link to="/portfolio" className="inline-block mt-10">
              <PrimaryButton className="mt-0">
                Make Your Brand Unmissable
                <ArrowRight className="w-5 h-5 ml-2" />
              </PrimaryButton>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
