import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  {
    id: 1,
    title: "STRATEGY-FIRST",
    sub: "100% CUSTOMIZED",
    desc: "We don't follow templates—we tailor every solution to fit your brand's specific goals.",
    color: "#eaddff",
  },
  {
    id: 2,
    title: "CREATIVE & IMPACTFUL",
    sub: "BEAUTY MEETS RESULTS",
    desc: "Design isn't just for show. We build interfaces that not only look good but also drive action.",
    color: "#d3e3fd",
  },
  {
    id: 3,
    title: "FAST & FLEXIBLE",
    sub: "MOVE QUICK, STAY SHARP",
    desc: "Our agile team delivers with speed while staying open to changes along the way. No bottlenecks.",
    color: "#ffcbed",
  },
];

export default function MailboxRevealSection() {
  const wrapperRef = useRef<HTMLDivElement>(null); // outer scroll spacer
  const sectionRef = useRef<HTMLElement>(null);    // the sticky panel
  const trainRef = useRef<HTMLDivElement>(null);   // the card train

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const section = sectionRef.current;
    const train = trainRef.current;
    if (!wrapper || !section || !train) return;

    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)"
    }, (context) => {
      const isMobile = context.conditions?.isMobile;
      
      const style = window.getComputedStyle(section);
      const cardW = parseFloat(style.getPropertyValue('--card-w')) || (isMobile ? 220 : 300);
      const cardGap = parseFloat(style.getPropertyValue('--card-gap')) || (isMobile ? 12 : 20);

      const offset = isMobile ? 18 : 15;
      const totalSlide = (CARDS.length - 1) * (cardW + cardGap) - offset;
      const scrollDistance = totalSlide * 5;

      wrapper.style.height = `calc(100vh + ${scrollDistance}px)`;

      ScrollTrigger.create({
        trigger: wrapper,
        start: 'top top',
        end: `+=${scrollDistance}`,
        pin: section,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        scrub: 1.2,
        onUpdate: (self) => {
          gsap.set(train, {
            x: -self.progress * totalSlide,
          });
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full mailbox-reveal-section" style={{ zIndex: 50 }}>
      {/* Responsive variables block */}
      <style>
        {`
          .mailbox-reveal-section {
            --card-w: 300px;
            --card-gap: 20px;
            --mailbox-front-w: 300px;
            --mailbox-body-w: 400px;
            --mailbox-h: 350px;
          }
          @media (max-width: 767px) {
            .mailbox-reveal-section {
              --card-w: 220px;
              --card-gap: 12px;
              --mailbox-front-w: 150px;
              --mailbox-body-w: 190px;
              --mailbox-h: 260px;
            }
          }
        `}
      </style>

      <section
        ref={sectionRef}
        className="w-full h-screen bg-white flex items-center"
        style={{
          position: 'sticky',
          top: 0,
          overflow: 'visible',
          zIndex: 50,
        }}
      >
        {/* ── Mailbox Body (back, yellow) ─────────────────────────── */}
        <div
          className="absolute right-0 bg-[#fff570] rounded-tl-[60px] sm:rounded-tl-[100px] rounded-bl-xl transition-all duration-300"
          style={{
            top: '40%',
            transform: 'translateY(-50%)',
            width: 'var(--mailbox-body-w)',
            height: 'var(--mailbox-h)',
            zIndex: 10,
          }}
        >
          {/* Pole */}
          <div
            className="absolute bg-[#ebe3b5]"
            style={{ right: '28%', top: '100%', width: 20, height: '50vh' }}
          />
          {/* Flag */}
          <div className="absolute flex items-end" style={{ right: '35%', top: -48 }}>
            <div className="w-1.5 h-12 bg-[#b3e099] rounded-t-full" />
            <div className="w-8 h-5 bg-[#b3e099] rounded-r-lg mb-8 -ml-0.5" />
          </div>
        </div>

        {/* ── Card Train ──────────────────────────────────────────── */}
        <div
          ref={trainRef}
          className="absolute flex items-center will-change-transform"
          style={{
            left: 'calc(100% - var(--mailbox-front-w) - var(--card-w))',
            top: '40%',
            transform: 'translateY(-50%)',
            gap: 'var(--card-gap)',
            zIndex: 20,
            overflow: 'visible',
          }}
        >
          {CARDS.map((card) => (
            <div
              key={card.id}
              className="shrink-0 p-4 sm:p-6 flex flex-col justify-center rounded-2xl shadow-lg border border-black/5"
              style={{
                width: 'var(--card-w)',
                height: 'calc(var(--mailbox-h) - 30px)',
                backgroundColor: card.color,
              }}
            >
              <h3 className="text-lg sm:text-2xl font-black mb-0.5 sm:mb-1 uppercase text-black tracking-tight leading-none">
                {card.title}
              </h3>
              <span className="text-[10px] sm:text-sm font-bold uppercase text-gray-800 mb-3 sm:mb-5 block tracking-widest">
                {card.sub}
              </span>
              <p className="text-gray-700 font-medium leading-relaxed text-xs sm:text-sm">
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ── Mailbox Front Panel (the opening mask) ──────────────── */}
        <div
          className="absolute right-0 bg-[#e6dd68] rounded-tl-[60px] sm:rounded-tl-[100px] rounded-bl-[20px] sm:rounded-bl-[40px] pointer-events-none transition-all duration-300"
          style={{
            top: '40%',
            transform: 'translateY(-50%)',
            width: 'var(--mailbox-front-w)',
            height: 'var(--mailbox-h)',
            zIndex: 30,
            boxShadow: '-10px 0 20px rgba(0,0,0,0.06)',
          }}
        >
          {/* Decorative knob */}
          <div
            className="absolute rounded-full bg-white/50"
            style={{ right: '15%', top: '50%', transform: 'translateY(-50%)', width: 12, height: 12 }}
          />
        </div>
      </section>
    </div>
  );
}
