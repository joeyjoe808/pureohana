import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const HomePageLuxury = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    console.log('HomePageLuxury mounted!');
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* HERO - Full screen, one stunning image, minimal text */}
      <section className="relative h-screen w-full overflow-hidden" style={{backgroundColor: '#2c3e50'}}>
        {/* Single hero image - no carousel, no distractions */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
          <img 
            src="https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/untitled-9870.jpg"
            alt="Luxury Hawaii Wedding"
            className="w-full h-full object-cover opacity-90"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Minimal text - just essentials */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-white text-5xl md:text-7xl font-extralight tracking-wider mb-6" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
            PURE OHANA TREASURES
          </h1>
          <div className="w-20 h-[1px] bg-white/60 mb-6"></div>
          <p className="text-white/80 text-lg font-light tracking-wide mb-12">
            Hawaii Wedding Photographer • Luxury Cinematography
          </p>
          
          {/* Single CTA - no confusion */}
          <a 
            href="mailto:pureohanatreasures@gmail.com?subject=Inquiry%20from%20Website"
            className="border border-white/60 text-white px-8 py-3 
                     hover:bg-white hover:text-black transition-all duration-500
                     text-sm tracking-widest font-light"
          >
            INQUIRE
          </a>
        </div>

        {/* Subtle scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="text-white/40" size={24} />
        </div>
      </section>

      {/* PORTFOLIO - Just 4 stunning images, no text */}
      <section className="bg-white py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-7xl mx-auto">
          {[
            "https://images.pexels.com/photos/1738636/pexels-photo-1738636.jpeg?auto=compress&cs=tinysrgb&w=1920",
            "https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/ashley%20looking%20into%20isaiahs%20eyes.jpg", 
            "https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/rosaries%20grad%20group.jpg",
            "https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/town%20night%20pics-09125.jpg"
          ].map((src, idx) => (
            <div key={idx} className="relative aspect-[3/2] overflow-hidden group">
              <img 
                src={src}
                alt={`Luxury Wedding ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 
                         group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 
                            transition-all duration-500"></div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT - Super minimal */}
      <section className="bg-white py-32">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-extralight tracking-wider mb-8 text-gray-900">
            TIMELESS ELEGANCE
          </h2>
          <div className="w-20 h-[1px] bg-gray-300 mx-auto mb-8"></div>
          <p className="text-gray-600 font-light leading-relaxed text-lg">
            For discerning couples seeking extraordinary photography 
            across the Hawaiian islands. We specialize in intimate ceremonies 
            at exclusive venues, creating heirloom imagery that transcends trends.
          </p>
        </div>
      </section>

      {/* EXPERIENCE - What sets us apart */}
      <section className="bg-gray-50 py-32">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            <div>
              <h3 className="text-6xl font-extralight text-gray-300 mb-4">01</h3>
              <h4 className="text-lg tracking-wider mb-3 text-gray-900">EXCLUSIVE ACCESS</h4>
              <p className="text-gray-600 font-light text-sm leading-relaxed">
                Private estates, secluded beaches, and Hawaii's most coveted locations
              </p>
            </div>
            <div>
              <h3 className="text-6xl font-extralight text-gray-300 mb-4">02</h3>
              <h4 className="text-lg tracking-wider mb-3 text-gray-900">ARTISAN APPROACH</h4>
              <p className="text-gray-600 font-light text-sm leading-relaxed">
                Each image meticulously crafted, never mass-produced
              </p>
            </div>
            <div>
              <h3 className="text-6xl font-extralight text-gray-300 mb-4">03</h3>
              <h4 className="text-lg tracking-wider mb-3 text-gray-900">WHITE GLOVE SERVICE</h4>
              <p className="text-gray-600 font-light text-sm leading-relaxed">
                Concierge-level attention from first contact through delivery
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED - One stunning recent work */}
      <section className="bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="aspect-square md:aspect-auto">
            <img 
              src="https://images.pexels.com/photos/265856/pexels-photo-265856.jpeg?auto=compress&cs=tinysrgb&w=1920"
              alt="Recent Wedding"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center justify-center p-16 md:p-24">
            <div>
              <p className="text-gray-400 text-sm tracking-widest mb-4">RECENT</p>
              <h3 className="text-3xl font-extralight tracking-wide mb-6 text-gray-900">
                Four Seasons Maui
              </h3>
              <p className="text-gray-600 font-light leading-relaxed mb-8">
                An intimate celebration for 30 guests at sunset, 
                featuring traditional Hawaiian blessing ceremonies 
                and contemporary elegance.
              </p>
              <a 
                href="/portfolio"
                className="text-sm tracking-widest text-gray-900 border-b border-gray-300 
                         hover:border-gray-900 transition-colors pb-1"
              >
                VIEW PORTFOLIO
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* INVESTMENT - Subtle pricing indicator */}
      <section className="bg-gray-50 py-32">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-extralight tracking-wider mb-8 text-gray-900">
            INVESTMENT
          </h2>
          <div className="w-20 h-[1px] bg-gray-300 mx-auto mb-8"></div>
          <p className="text-gray-600 font-light leading-relaxed mb-12">
            Wedding collections start at $3,500
          </p>
          <p className="text-gray-500 font-light text-sm leading-relaxed">
            Each collection is bespoke, crafted to match your vision. 
            We accept a limited number of commissions annually to ensure 
            exceptional attention to every detail.
          </p>
        </div>
      </section>

      {/* CONTACT - Clean and simple */}
      <section className="bg-white py-32">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-extralight tracking-wider mb-8 text-gray-900">
            BEGIN YOUR STORY
          </h2>
          <div className="w-20 h-[1px] bg-gray-300 mx-auto mb-12"></div>
          
          <a 
            href="mailto:pureohanatreasures@gmail.com?subject=Wedding%20Photography%20Inquiry&body=Aloha%2C%0A%0AWe%20are%20interested%20in%20your%20photography%20services%20for%20our%20wedding.%0A%0ADate%3A%20%0AVenue%3A%20%0AGuest%20Count%3A%20%0A%0AMahalo"
            className="inline-block border border-gray-900 text-gray-900 px-12 py-4 
                     hover:bg-gray-900 hover:text-white transition-all duration-500
                     text-sm tracking-widest font-light"
          >
            INQUIRE
          </a>
          
          <div className="mt-16 text-gray-400 font-light text-sm">
            <p>Aiea, Oahu • Serving all Hawaiian Islands</p>
            <p className="mt-2">pureohanatreasures@gmail.com</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePageLuxury;