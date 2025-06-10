import React from 'react';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutSection = () => {
  return (
    <section className="py-24 bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-[1px] bg-yellow-400"></div>
              <span className="text-yellow-400 text-xs tracking-widest font-light">OUR PHILOSOPHY</span>
            </div>
            <h2 className="text-3xl font-serif mb-8 text-white">
              THE ART OF CAPTURING TIMELESS LUXURY
            </h2>
            <p className="text-gray-400 mb-6 leading-relaxed text-sm">
              Pure Ohana Treasures has established itself as Hawaii's premier choice for discerning clients seeking exceptional photography and cinematography. Our team brings an unparalleled artistic vision to every commission, creating visual narratives that resonate with sophistication and emotional depth.
            </p>
            <p className="text-gray-400 mb-10 leading-relaxed text-sm">
              We believe that truly extraordinary imagery transcends mere documentation—it evokes emotion, tells stories, and preserves legacies. From secluded beaches accessible only to the privileged few to exclusive private estates, we capture the essence of Hawaii's most extraordinary settings and the authentic connections of those who gather there.
            </p>
            <Link to="/about" className="px-6 py-3 bg-transparent border border-yellow-400 text-yellow-400 font-light rounded-sm hover:bg-yellow-400/10 transition-colors inline-flex items-center">
              OUR APPROACH
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
          
          {/* Image Grid */}
          <div className="order-1 lg:order-2 grid grid-cols-12 gap-2">
            <div className="col-span-5 space-y-2">
              <div className="overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/1589825/pexels-photo-1589825.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Luxury wedding couple" 
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/2253867/pexels-photo-2253867.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Hawaii luxury resort" 
                  className="w-full h-40 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="col-span-7 space-y-2 pt-10">
              <div className="overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/1701304/pexels-photo-1701304.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Close-up of groom placing ring on bride's finger" 
                  className="w-full h-40 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="overflow-hidden relative group">
                <img 
                  src="https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Elegant wedding ceremony" 
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-14 h-14 rounded-full bg-yellow-400 flex items-center justify-center">
                    <Play size={20} className="text-slate-900 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;