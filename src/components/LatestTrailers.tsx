import React from 'react';
import { Play } from 'lucide-react';

const TrailerCard = ({ title, genre, imageUrl }) => {
  return (
    <div className="group relative overflow-hidden">
      <img 
        src={imageUrl} 
        alt={title} 
        className="w-full h-screen/2 object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-70"></div>
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="text-yellow-400 text-xs font-light mb-3">{genre}</div>
        <h3 className="text-white text-lg font-serif mb-4">{title}</h3>
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-300 transition-colors transform hover:scale-110">
          <Play size={24} className="text-slate-900 ml-1" />
        </button>
      </div>
    </div>
  );
};

const LatestTrailers = () => {
  const trailers = [
    {
      title: "The Hampton Estate Wedding",
      genre: "Luxury Destination Wedding",
      imageUrl: "https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      title: "Four Seasons Maui Celebration",
      genre: "Exclusive Resort Wedding",
      imageUrl: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      title: "Traditional Hawaiian Ceremony",
      genre: "Cultural Heritage Wedding",
      imageUrl: "https://images.pexels.com/photos/931887/pexels-photo-931887.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
  ];

  return (
    <section className="py-24 bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center mb-3">
            <div className="thin-gold-line"></div>
            <span className="text-yellow-400 text-xs tracking-widest font-light">SIGNATURE FILMS</span>
            <div className="thin-gold-line"></div>
          </div>
          <h2 className="text-3xl font-serif mt-2 text-white">FEATURED WEDDING FILMS</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          {trailers.map((trailer, index) => (
            <TrailerCard key={index} {...trailer} />
          ))}
        </div>

        <div className="flex justify-center mt-14">
          <div className="flex space-x-4">
            {[0, 1, 2].map((dot, index) => (
              <div 
                key={index}
                className={`w-2 h-1 ${index === 0 ? 'w-8 bg-yellow-400' : 'bg-gray-600'} 
                           cursor-pointer transition-colors hover:bg-yellow-400`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestTrailers;