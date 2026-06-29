import BusinessGrowthModern from './BusinessGrowthModern';

const LOGOS_DATA = [
  // Root logos
  { src: "/logos/7.png", bg: "bg-white" },
  { src: "/logos/Old Rao 100x41.png", bg: "bg-zinc-100" },
  { src: "/logos/m.png", bg: "bg-white" },
  { src: "/logos/yga.png", bg: "bg-white" },
  // Logo1 transparent logos
  { src: "/logos/logo1/bhavikdairy_14050326_165157844.jpg.jpeg_nobg.png", bg: "bg-blue-50" },
  { src: "/logos/logo1/dwps_alwar_14050326_165735543.jpg.jpeg_nobg2.png", bg: "bg-white" },
  { src: "/logos/logo1/golden_fitness_studio_14050326_165901083.jpg.jpeg_nobg2.png", bg: "bg-amber-100" },
  { src: "/logos/logo1/hydrowash___14050326_165141258.jpg-removebg-preview.png", bg: "bg-[#27272a]" },
  { src: "/logos/logo1/jain_event_planner__14050326_165108726.jpg-removebg-preview.png", bg: "bg-black" },
  { src: "/logos/logo1/kafesa_by_tijacafe_14050326_165226870.jpg-removebg-preview.png", bg: "bg-amber-50" },
  { src: "/logos/logo1/mobile_master_alwar_14050326_165925798.jpg.jpeg_nobg2.png", bg: "bg-white" },
  { src: "/logos/logo1/rj02_hotel_14050326_170134229.jpg-removebg-preview (1).png", bg: "bg-stone-900" },
  { src: "/logos/logo1/roastro_cafe_14050326_165747073.jpg-removebg-preview (1).png", bg: "bg-[#451a03]" },
  { src: "/logos/logo1/saniya__hospital_14050326_165809565.jpg-removebg-preview.png", bg: "bg-teal-50" },
  { src: "/logos/logo1/shivaura_in_14050326_165054553.jpg-removebg-preview.png", bg: "bg-[#2d3748]" },
  { src: "/logos/logo1/sigdiresort_14050326_165131449.jpg-removebg-preview.png", bg: "bg-[#1c1917]" },
  { src: "/logos/logo1/zonirazjewel_14050326_165120271.jpg-removebg-preview.png", bg: "bg-black" }
];

export default function AiRankingSection() {
  const repeatedLogos = [...LOGOS_DATA, ...LOGOS_DATA, ...LOGOS_DATA, ...LOGOS_DATA, ...LOGOS_DATA];

  return (
    <section className="relative overflow-hidden pt-16 pb-20 md:pb-28 bg-stone-50 border-t border-gray-200">
      
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
        `}
      </style>

      <BusinessGrowthModern />

      <div className="text-center mb-10 mt-10">
        <h3 className="text-black text-3xl font-bold tracking-tight">Our Trusted Partner</h3>
      </div>

      {/* Bottom Banner: Marquee */}
      <div className="w-full border-t border-b border-gray-200 py-8 flex items-center overflow-hidden bg-[#ffffff] shadow-sm">
        <div className="flex-1 overflow-hidden mask-image-horizontal">
          <div className="flex w-max whitespace-nowrap animate-marquee items-center">
            {repeatedLogos.map((item, idx) => (
              <div key={idx} className={`w-56 h-24 mx-4 flex items-center justify-center shrink-0 p-1 rounded-4xl shadow-sm border border-gray-100 overflow-hidden ${item.bg}`}>
                <img 
                  src={item.src} 
                  alt="Client Logo" 
                  className="max-h-full max-w-full object-contain scale-110 transition-transform duration-300 hover:scale-125 transform-[translateZ(0)] backface-hidden will-change-transform [image-rendering:-webkit-optimize-contrast]" 
                />
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
