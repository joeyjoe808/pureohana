import React from 'react';
import { Camera, Video, PartyPopper, Book } from 'lucide-react';

const ServiceCard = ({ icon, title, description }) => {
  return (
    <div className="bg-slate-800/80 p-10 rounded-sm transition-all duration-300 hover:bg-slate-700 group">
      <div className="w-14 h-14 bg-yellow-400/10 flex items-center justify-center rounded-sm mb-8 group-hover:bg-yellow-400/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-serif mb-4 text-white">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      <button className="mt-8 text-yellow-400 text-sm font-light flex items-center group-hover:text-yellow-300 transition-colors">
        Discover More
        <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </div>
  );
};

const ServicesSection = () => {
  const services = [
    {
      icon: <Camera size={24} className="text-yellow-400" />,
      title: "LUXURY PORTRAIT SESSIONS",
      description: "Bespoke portrait experiences at Hawaii's most exclusive locations. Each session is meticulously curated to capture your essence against paradise backdrops."
    },
    {
      icon: <Video size={24} className="text-yellow-400" />,
      title: "CINEMATIC STORYTELLING",
      description: "Artfully crafted films that transcend ordinary videography. We blend narrative techniques with cinematic visuals to immortalize your Hawaiian experience."
    },
    {
      icon: <PartyPopper size={24} className="text-yellow-400" />,
      title: "DESTINATION WEDDINGS & EVENTS",
      description: "From intimate ceremonies to grand celebrations, our team documents every emotional moment and exquisite detail of your Hawaiian gathering."
    },
    {
      icon: <Book size={24} className="text-yellow-400" />,
      title: "BESPOKE HEIRLOOM COLLECTIONS",
      description: "Preserve your memories in museum-quality albums, fine art prints, and custom designed collections that become cherished family treasures."
    },
  ];

  return (
    <section id="services-section" className="py-24 bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center mb-3">
            <div className="thin-gold-line"></div>
            <span className="text-yellow-400 text-xs tracking-widest font-light">EXCLUSIVE SERVICES</span>
            <div className="thin-gold-line"></div>
          </div>
          <h2 className="text-3xl font-serif mt-2 text-white">CURATED EXPERIENCES</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;