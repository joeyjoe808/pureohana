import React from 'react';
import { ArrowRight } from 'lucide-react';

const ContactCTA = () => {
  return (
    <section className="py-24 bg-yellow-400 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="stripes" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 0 0 L 60 60" stroke="black" strokeWidth="1" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#stripes)" />
        </svg>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-10 md:mb-0 md:max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-serif mb-6 text-slate-900">
              Elevate your celebration with exceptional artistry
            </h2>
            <p className="text-slate-800 text-lg font-light">
              Contact us to begin crafting your bespoke photography or cinematography experience. Limited bookings available to ensure our unwavering dedication to each client.
            </p>
          </div>
          <div>
            <a 
              href="https://pureohanatreasures.as.me/schedule/0caada86" 
              className="px-8 py-4 bg-slate-900 text-white font-light rounded-sm hover:bg-slate-800 transition-colors flex items-center text-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              INQUIRE
              <ArrowRight size={20} className="ml-2" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;