import React, { useState } from 'react';

const PortfolioLuxury = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const portfolioItems = [
    {
      id: 1,
      category: 'weddings',
      image: 'https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/ashley%20looking%20into%20isaiahs%20eyes.jpg',
      title: 'Island Love Story',
      location: 'Oahu'
    },
    {
      id: 2, 
      category: 'weddings',
      image: 'https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/wedding%20shot%203.jpg',
      title: 'Sunset Ceremony',
      location: 'Ko Olina'
    },
    {
      id: 3,
      category: 'portraits',
      image: 'https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/Family%20About%20.jpg',
      title: 'Family Session',
      location: 'Kailua'
    },
    {
      id: 4,
      category: 'weddings',
      image: 'https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/wedding%20shot%202.jpg',
      title: 'Garden Wedding',
      location: 'Maui'
    },
    {
      id: 5,
      category: 'elopements',
      image: 'https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/medium%20wide%20dancing.jpg',
      title: 'Intimate Elopement',
      location: 'Kauai'
    },
    {
      id: 6,
      category: 'portraits',
      image: 'https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/rosaries%20grad%20group.jpg',
      title: 'Graduation Celebration',
      location: 'North Shore'
    }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === selectedCategory);

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h1 className="text-4xl md:text-5xl font-extralight tracking-wider text-center text-gray-900 mb-4">
            PORTFOLIO
          </h1>
          <div className="w-20 h-[1px] bg-gray-300 mx-auto"></div>
        </div>
      </section>

      {/* Filter - Minimal */}
      <section className="pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex justify-center space-x-8 md:space-x-12">
            {['all', 'weddings', 'elopements', 'portraits'].map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`text-sm tracking-wider font-light transition-all pb-2 ${
                  selectedCategory === category 
                    ? 'text-gray-900 border-b border-gray-900' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {category.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid - Clean, no text overlay */}
      <section className="pb-32 bg-white">
        <div className="max-w-7xl mx-auto px-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {filteredItems.map(item => (
              <div 
                key={item.id} 
                className="relative group cursor-pointer overflow-hidden"
              >
                <div className="aspect-[3/2]">
                  <img 
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 
                             group-hover:scale-105"
                  />
                </div>
                {/* Subtle overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 
                              transition-all duration-500 flex items-end justify-start p-8 
                              opacity-0 group-hover:opacity-100">
                  <div className="text-white">
                    <p className="text-sm font-light tracking-wider">{item.title}</p>
                    <p className="text-xs font-light opacity-80 mt-1">{item.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-extralight tracking-wider mb-8 text-gray-900">
            CREATE WITH US
          </h2>
          <div className="w-20 h-[1px] bg-gray-300 mx-auto mb-8"></div>
          <p className="text-gray-600 font-light leading-relaxed mb-12">
            Now accepting limited commissions for 2025-2026
          </p>
          <a 
            href="mailto:pureohanatreasures@gmail.com?subject=Portfolio%20Inquiry"
            className="inline-block border border-gray-900 text-gray-900 px-12 py-4 
                     hover:bg-gray-900 hover:text-white transition-all duration-500
                     text-sm tracking-widest font-light"
          >
            INQUIRE
          </a>
        </div>
      </section>
    </>
  );
};

export default PortfolioLuxury;