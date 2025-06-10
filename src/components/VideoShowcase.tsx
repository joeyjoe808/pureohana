import React, { useState } from 'react';
import { Play, X } from 'lucide-react';

const VideoShowcase = () => {
  const [showModal, setShowModal] = useState(false);
  const [activeVideo, setActiveVideo] = useState('');

  const openModal = (videoId) => {
    setActiveVideo(videoId);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setActiveVideo('');
    document.body.style.overflow = 'auto';
  };

  return (
    <section id="portfolio-section" className="relative py-28 bg-slate-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 0 10 L 40 10 M 10 0 L 10 40" stroke="white" strokeWidth="0.5" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center mb-3">
            <div className="thin-gold-line"></div>
            <span className="text-yellow-400 text-xs tracking-widest font-light">FEATURED WORK</span>
            <div className="thin-gold-line"></div>
          </div>
          <h2 className="text-3xl font-serif mt-2 mb-4 text-white">CINEMATIC ELEGANCE</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm">
            Immersive visual narratives that elevate extraordinary moments through sophisticated cinematography and artistic vision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          {[
            { 
              id: "dQw4w9WgXcQ", 
              title: "The Hamptons' Hawaiian Wedding", 
              category: "Destination Wedding",
              thumbnail: "https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=800"
            },
            { 
              id: "dQw4w9WgXcQ", 
              title: "Sunset Vows at Four Seasons", 
              category: "Luxury Ceremony",
              thumbnail: "https://images.pexels.com/photos/2959192/pexels-photo-2959192.jpeg?auto=compress&cs=tinysrgb&w=800"
            },
            { 
              id: "dQw4w9WgXcQ", 
              title: "Private Estate Celebration", 
              category: "Exclusive Event",
              thumbnail: "https://images.pexels.com/photos/931887/pexels-photo-931887.jpeg?auto=compress&cs=tinysrgb&w=800"
            },
            { 
              id: "dQw4w9WgXcQ", 
              title: "Hawaiian Cultural Ceremony", 
              category: "Heritage Celebration",
              thumbnail: "https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=800"
            },
            { 
              id: "dQw4w9WgXcQ", 
              title: "Seaside Luxury Reception", 
              category: "Elegant Gathering",
              thumbnail: "https://images.pexels.com/photos/1730877/pexels-photo-1730877.jpeg?auto=compress&cs=tinysrgb&w=800"
            },
            { 
              id: "dQw4w9WgXcQ", 
              title: "Maui Clifftop Ceremony", 
              category: "Destination Wedding",
              thumbnail: "https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=800"
            },
          ].map((video, index) => (
            <div key={index} className="relative group overflow-hidden">
              <img 
                src={video.thumbnail} 
                alt={video.title} 
                className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-slate-900/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-yellow-400 text-xs font-light mb-2">{video.category}</span>
                <h3 className="text-white text-lg font-serif mb-4 text-left">{video.title}</h3>
                <button 
                  onClick={() => openModal(video.id)}
                  className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center hover:bg-yellow-300 transition-colors"
                >
                  <Play size={20} className="text-slate-900 ml-1" />
                </button>
              </div>
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button 
                  onClick={() => openModal(video.id)}
                  className="w-16 h-16 rounded-full bg-yellow-400/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-90 group-hover:scale-100"
                >
                  <Play size={24} className="text-slate-900 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <button className="px-8 py-3 border border-white text-white font-light text-sm rounded-sm hover:bg-white/5 transition-colors">
            VIEW COMPLETE PORTFOLIO
          </button>
        </div>
      </div>

      {/* Video Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <button 
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-yellow-400 transition-colors"
            >
              <X size={24} />
            </button>
            <div className="aspect-video rounded-sm overflow-hidden">
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default VideoShowcase;