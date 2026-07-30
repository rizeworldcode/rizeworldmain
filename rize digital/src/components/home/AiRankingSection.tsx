import BusinessGrowthModern from './BusinessGrowthModern';
import { LOGOS } from '../../data/logos';

export default function AiRankingSection() {
  const repeatedLogos = [...LOGOS, ...LOGOS];

  return (
    <section className="relative overflow-hidden pt-16 pb-20 md:pb-28 bg-stone-50 border-t border-gray-200">
      
      <style>
        {`
          @keyframes marquee {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-50%, 0, 0); }
          }
          .animate-marquee {
            animation: marquee 60s linear infinite;
            will-change: transform;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
          }
        `}
      </style>

      <BusinessGrowthModern />

      <div className="text-center mb-10 mt-10">
        <h3 className="text-black text-3xl font-bold tracking-tight">Our Trusted Partner</h3>
      </div>

      {/* Bottom Banner: Marquee */}
      <div className="w-full border-t border-b border-gray-200 py-10 flex items-center overflow-hidden bg-[#f5f9fb] shadow-sm">
        <div className="flex w-max whitespace-nowrap animate-marquee items-center">
          {repeatedLogos.map((item, idx) => (
            <div key={idx} className={`w-56 h-24 mx-4 flex items-center justify-center shrink-0 p-2 rounded-4xl shadow-sm border border-gray-100/50 overflow-hidden ${item.bg}`}>
              <img 
                src={item.src} 
                alt="Client Logo" 
                className={`${item.customClass || "max-h-[92%] max-w-[92%]"} object-contain`} 
              />
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
