import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { growthLabs } from "../../data/growthLabs";
import { Link } from "react-router-dom";

const VideoModal = ({ isOpen, onClose, videoUrl }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/90 p-4" onClick={onClose}>
      <div className="bg-black w-full max-w-4xl max-h-[90vh] h-full sm:h-auto sm:aspect-video rounded-xl overflow-hidden relative flex justify-center items-center" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-white font-bold text-xl z-10 w-10 h-10 flex items-center justify-center bg-black/60 rounded-full hover:bg-black transition-colors border border-white/20 shadow-lg">✕</button>
        {videoUrl ? (
          <video src={videoUrl} autoPlay controls className="w-full h-full object-contain max-h-[90vh]" />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-white font-medium text-xl">Video not available</div>
        )}
      </div>
    </div>
  );
};

export default function GrowthLabsSection() {
  const [active, setActive] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState("");

  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center overflow-hidden py-24 px-4 bg-stone-50 border-t border-gray-200">
      
      {/* Header */}
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h2 className="text-gray-900 font-bold leading-tight tracking-tight text-5xl md:text-6xl lg:text-7xl">
          Success <span className="text-orange-500">Stories</span>
        </h2>
        <p className="mt-6 text-gray-500 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto font-medium">
          See how our digital solutions company drives business growth through digital marketing, result-oriented search engine optimization, and custom social media marketing services.
        </p>
        <Link to="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full border border-transparent bg-orange-500 px-8 py-4 text-white font-bold text-sm hover:bg-orange-600 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-orange-500/20">
          Get In Touch
        </Link>
      </div>

      {/* Desktop Layout (Accordion) */}
      <div className="hidden md:flex md:flex-row gap-4 md:h-[600px] lg:h-[700px] w-full max-w-[1400px]">
        {growthLabs.map((lab, i) => (
          <motion.div
            key={lab.id}
            onHoverStart={() => setActive(i)}
            onClick={() => setActive(i)}
            animate={{ flex: active === i ? 4 : 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="relative rounded-4xl overflow-hidden cursor-pointer bg-black group h-full"
          >
            <img
              src={lab.image}
              className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-40 transition-opacity duration-500"
              alt={lab.title}
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to bottom, transparent, rgba(0,0,0,0.2), rgba(0,0,0,0.9))`
              }}
            />

            <div className="absolute bottom-0 left-0 w-full p-6 lg:p-10">
              {active === i ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.3, ease: "easeOut" }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="px-4 py-1.5 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
                      {lab.subtitle}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentVideo(lab.video || ""); 
                        setModalOpen(true);
                      }}
                      className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                    >
                      <Play size={20} className="text-black" fill="black" />
                    </button>
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg font-medium mb-6 leading-relaxed text-white/90 max-w-3xl drop-shadow-md">
                    "{lab.description}"
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-white/30 bg-white/10 flex items-center justify-center backdrop-blur-md">
                      <span className="text-white font-bold text-lg">{lab.title.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-bold text-white text-lg drop-shadow-sm">
                        {lab.title}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-10 md:origin-left whitespace-nowrap font-bold uppercase tracking-widest text-lg md:text-xl text-white/80"
                  style={{ transform: `translateX(0) md:rotate(-90deg)` }}
                >
                  {lab.title}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mobile/Tablet Layout (List of Cards) */}
      <div className="flex md:hidden flex-col gap-8 w-full max-w-md mx-auto">
        {growthLabs.map((lab) => (
          <div key={lab.id} className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-150 flex flex-col">
            {/* Image & Play Button Container */}
            <div className="relative aspect-[4/3] w-full bg-black flex items-center justify-center overflow-hidden">
              <img
                src={lab.image}
                alt={lab.title}
                className="w-full h-full object-cover object-top opacity-80"
              />
              <div className="absolute inset-0 bg-black/15" />
              
              {/* Floating Subtitle Badge */}
              <div className="absolute top-4 left-4 px-3 py-1 bg-white/95 text-black rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                {lab.subtitle}
              </div>

              {/* Play Button in Center */}
              <button
                onClick={() => {
                  setCurrentVideo(lab.video || "");
                  setModalOpen(true);
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-xl z-20"
              >
                <Play className="w-6 h-6 text-black fill-black ml-1" />
              </button>
            </div>

            {/* Content Container */}
            <div className="p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold text-base border border-orange-500/20">
                  {lab.title.charAt(0)}
                </div>
                <h3 className="font-bold text-gray-900 text-lg">
                  {lab.title}
                </h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed italic">
                "{lab.description}"
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <VideoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        videoUrl={currentVideo}
      />
    </section>
  );
}
