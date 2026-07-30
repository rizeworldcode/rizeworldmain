import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  { 
    id: 1, 
    user: "rizeworld",
    location: "",
    avatar: "/card/RW.png",
    src: "/card/rizeworld linkedin poster.jpg" 
  },
  { 
    id: 2, 
    user: "rizeworld",
    location: "",
    avatar: "/card/RW.png",
    src: "/card/IMG_8748.PNG" 
  },
  { 
    id: 3, 
    user: "rizeworld",
    location: "",
    avatar: "/card/RW.png",
    src: "/card/rw linkedinnnn.jpg" 
  }
];

export default function AgencyHighlightsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const centerCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mm = gsap.matchMedia();

    // Mobile/Tablet (< 640px)
    mm.add("(max-width: 639px)", () => {
      gsap.set(leftCardRef.current, { x: 20, y: 150, rotation: -5 });
      gsap.set(centerCardRef.current, { x: 0, y: 150, rotation: 0 });
      gsap.set(rightCardRef.current, { x: -20, y: 150, rotation: 5 });

      gsap.to([leftCardRef.current, centerCardRef.current, rightCardRef.current], {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "top 15%",
          scrub: 1,
        },
        x: (i) => {
          if (i === 0) return -70; // Spread slightly to the left
          if (i === 2) return 70;  // Spread slightly to the right
          return 0;
        },
        y: (i) => {
          if (i === 1) return -10;
          return 30;
        },
        rotation: (i) => {
          if (i === 0) return -10;
          if (i === 2) return 10;
          return 0;
        },
        scale: (i) => {
          if (i === 1) return 1.0;
          return 0.9; // Slightly scale down side cards for visual hierarchy
        },
        ease: "power2.out"
      });
    });

    // Desktop (>= 640px)
    mm.add("(min-width: 640px)", () => {
      gsap.set(leftCardRef.current, { x: 50, y: 200, rotation: -5 });
      gsap.set(centerCardRef.current, { x: 0, y: 200, rotation: 0 });
      gsap.set(rightCardRef.current, { x: -50, y: 200, rotation: 5 });

      gsap.to([leftCardRef.current, centerCardRef.current, rightCardRef.current], {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "top 10%",
          scrub: 1,
        },
        x: (i) => {
          if (i === 0) return -340;
          if (i === 2) return 340;
          return 0;
        },
        y: (i) => {
          if (i === 1) return -20;
          return 40;
        },
        rotation: (i) => {
          if (i === 0) return -15;
          if (i === 2) return 15;
          return 0;
        },
        scale: 1,
        ease: "power2.out"
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full py-24 sm:py-32 overflow-hidden flex flex-col items-center justify-center z-20">
      
      {/* Cards Container */}
      <div className="relative flex items-center justify-center w-full max-w-5xl mx-auto px-4 mt-10 min-h-[500px]">
        
        {CARDS.map((card, i) => {
          let ref = centerCardRef;
          let zIndex = 20;
          if (i === 0) { ref = leftCardRef; zIndex = 10; }
          if (i === 2) { ref = rightCardRef; zIndex = 10; }

          return (
            <div
              key={card.id}
              ref={ref}
              className="absolute w-[220px] sm:w-[320px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 will-change-transform"
              style={{ zIndex }}
            >
              {/* Header */}
              <div className="flex items-center px-4 py-3 gap-3">
                <img src={card.avatar} alt={card.user} className="w-10 h-10 rounded-full object-cover bg-gray-100" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900 leading-tight">{card.user}</span>
                  <span className="text-xs text-gray-500">{card.location}</span>
                </div>
              </div>

              {/* Image */}
              <div className="w-full aspect-square bg-gray-100">
                <img src={card.src} alt="Post" className="w-full h-full object-cover" />
              </div>

              {/* Footer Icons */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-4">
                  <Heart size={24} className="text-gray-800 hover:text-red-500 cursor-pointer transition-colors" />
                  <MessageCircle size={24} className="text-gray-800 hover:text-gray-500 cursor-pointer transition-colors" />
                  <Send size={24} className="text-gray-800 hover:text-gray-500 cursor-pointer transition-colors" />
                </div>
                <Bookmark size={24} className="text-gray-800 hover:text-gray-500 cursor-pointer transition-colors" />
              </div>
            </div>
          );
        })}

      </div>

    </section>
  );
}
