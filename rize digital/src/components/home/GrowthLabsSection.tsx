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
          Success <span className="text-orange-500">Story</span>
        </h2>
        <p className="mt-6 text-gray-500 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto font-medium">
          Within 8 months we will provide the best services to our clients, make their social media strong and enhance their brand visibility. By providing a wide range of services we help them to grow their business.
        </p>
        <Link to="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full border border-transparent bg-orange-500 px-8 py-4 text-white font-bold text-sm hover:bg-orange-600 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-orange-500/20">
          Get In Touch
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 h-[800px] md:h-[600px] lg:h-[700px] w-full max-w-[1400px]">
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
      
      <VideoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        videoUrl={currentVideo}
      />
    </section>
  );
}
