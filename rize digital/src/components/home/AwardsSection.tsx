import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { awardsData } from '../../data/awards';

export default function AwardsSection() {
  return (
    <section className="relative w-full overflow-hidden px-4 sm:px-6 md:px-8 lg:px-12 py-20 md:py-32 bg-stone-50 border-t border-gray-200">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        
        {/* Left: Large Image */}
        <div className="w-full h-[500px] lg:h-[700px] rounded-4xl overflow-hidden bg-gray-200 relative shadow-lg">
          <img 
            src="/images/agency_office.png" 
            alt="Agency Office" 
            className="absolute inset-0 w-full h-full object-cover grayscale" 
          />
        </div>

        {/* Right: Content */}
        <div className="flex flex-col items-start justify-center py-10 lg:py-0">
          <span className="text-gray-500 font-bold tracking-widest text-sm uppercase mb-6">
            [ FOUNDER ]
          </span>
          
          <h2 className="text-black font-bold leading-[1.1] tracking-tight text-5xl sm:text-6xl lg:text-7xl mb-8">
            Achievment<br />Recognitions<br />& Award.
          </h2>
          
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed font-medium mb-12 max-w-xl">
            The specific goals of a marketing agency can vary depending on the clients needs, industry.
          </p>

          {/* Awards Table replacing the golden trophies for a minimal look */}
          <div className="w-full border-t border-gray-200 pt-8 mb-12">
            <div className="grid grid-cols-[2fr_1fr_1fr] gap-4 mb-4 text-xs sm:text-sm font-bold tracking-widest text-gray-400 uppercase">
              <div>Award</div>
              <div>Platform</div>
              <div>Year</div>
            </div>
            
            <div className="flex flex-col gap-6">
              {awardsData.map((award, idx) => (
                <div key={idx} className="grid grid-cols-[2fr_1fr_1fr] gap-4 items-center text-sm sm:text-base font-medium text-black">
                  <div className="font-bold">{award.award}</div>
                  <div className="text-gray-500">{award.platform}</div>
                  <div className="text-gray-500">{award.year}</div>
                </div>
              ))}
            </div>
          </div>

          <Link to="/about" className="flex items-center gap-3 rounded-full bg-white border border-gray-300 px-8 py-4 text-black font-bold text-sm hover:bg-gray-100 transition-all duration-300 shadow-sm">
            Learn More About Us
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
