import React, { useState, useEffect, useRef } from 'react';

const StatItem = ({ icon, value, label, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime;
          const animateCount = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            setCount(Math.floor(percentage * value));
            
            if (percentage < 1) {
              window.requestAnimationFrame(animateCount);
            }
          };
          window.requestAnimationFrame(animateCount);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [value, duration, hasAnimated]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-yellow-400 mb-4">{icon}</div>
      <div className="text-4xl font-serif text-white mb-2">{count}+</div>
      <div className="text-gray-400 text-sm tracking-wider uppercase">{label}</div>
    </div>
  );
};

const StatsSection = () => {
  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="diagonalLines" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 0 40 L 40 0" stroke="white" strokeWidth="0.5" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diagonalLines)" />
        </svg>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          <StatItem 
            icon={<svg className="w-10 h-10 mx-auto\" fill="currentColor\" viewBox="0 0 24 24"><path d="M12 14a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd\" d="M12 2a6 6 0 016 6c0 4.618 2.4 7.361 3.179 8.12l.821.82h-20l.821-.82C3.6 15.361 6 12.618 6 8a6 6 0 016-6z\" clipRule="evenodd"/></svg>}
            value={325}
            label="LUXURY WEDDINGS"
          />
          <StatItem 
            icon={<svg className="w-10 h-10 mx-auto\" fill="currentColor\" viewBox="0 0 24 24"><path d="M19.999 4h-16c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm-13.5 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm5.5 10h-7l4-5 1.5 2 3-4 5.5 7h-7z"/></svg>}
            value={175000}
            label="CURATED IMAGES"
          />
          <StatItem 
            icon={<svg className="w-10 h-10 mx-auto\" fill="currentColor\" viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1 16.5v-3h2v3h-2zm0-5V7h2v6.5h-2z"/></svg>}
            value={10}
            label="YEARS OF EXCELLENCE"
          />
          <StatItem 
            icon={<svg className="w-10 h-10 mx-auto\" fill="currentColor\" viewBox="0 0 24 24"><path d="M21 4h-3V3a1 1 0 00-1-1H7a1 1 0 00-1 1v1H3a1 1 0 00-1 1v14a3 3 0 003 3h14a3 3 0 003-3V5a1 1 0 00-1-1zm-9 14a5 5 0 110-10 5 5 0 010 10z"/></svg>}
            value={65}
            label="EXCLUSIVE VENUES"
          />
        </div>
      </div>
    </section>
  );
};

export default StatsSection;