import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "Pure Ohana Treasures captured our destination wedding with unparalleled elegance. Their artistry transformed our celebration into timeless imagery that far exceeded our expectations. Every detail, every emotion was preserved with exquisite taste.",
      author: "Sarah & James Wilson",
      position: "Four Seasons Hualalai Wedding",
      image: "https://images.pexels.com/photos/1707741/pexels-photo-1707741.jpeg?auto=compress&cs=tinysrgb&w=200"
    },
    {
      quote: "We commissioned Pure Ohana Treasures for our vow renewal at Turtle Bay Resort, and the results were nothing short of extraordinary. Their team's artistic vision and meticulous approach captured the essence of our celebration with sophistication and emotional depth.",
      author: "The Nakamura Family",
      position: "Turtle Bay Resort Vow Renewal",
      image: "https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=200"
    },
    {
      quote: "Our private estate wedding required the utmost discretion and artistic excellence. Pure Ohana Treasures delivered beyond our wildest dreams, creating a visual legacy of our celebration that balances grandeur with intimate emotion. Truly masters of their craft.",
      author: "Elizabeth & Michael Hampton",
      position: "Private Estate Wedding, Maui",
      image: "https://images.pexels.com/photos/1813554/pexels-photo-1813554.jpeg?auto=compress&cs=tinysrgb&w=200"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center mb-3">
            <div className="thin-gold-line"></div>
            <span className="text-yellow-400 text-xs tracking-widest font-light">CLIENT EXPERIENCES</span>
            <div className="thin-gold-line"></div>
          </div>
          <h2 className="text-3xl font-serif mt-2 text-white">TESTIMONIALS</h2>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Testimonial */}
            <div className="bg-slate-800/50 rounded-sm p-12 shadow-xl relative">
              <div className="absolute -top-6 left-10 text-yellow-400">
                <Quote size={48} className="opacity-30" />
              </div>
              
              <div className="mb-10 pt-4">
                <p className="text-gray-300 text-lg md:text-xl italic relative z-10 leading-relaxed font-serif">
                  "{testimonials[currentIndex].quote}"
                </p>
              </div>
              
              <div className="flex items-center">
                <img 
                  src={testimonials[currentIndex].image} 
                  alt={testimonials[currentIndex].author} 
                  className="w-14 h-14 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="text-white font-medium">{testimonials[currentIndex].author}</h4>
                  <p className="text-gray-400 text-sm">{testimonials[currentIndex].position}</p>
                </div>
              </div>
            </div>
            
            {/* Navigation */}
            <div className="flex justify-between mt-12">
              <button 
                onClick={prevSlide}
                className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center hover:bg-yellow-400 transition-colors group"
              >
                <ChevronLeft size={20} className="text-white group-hover:text-slate-900 transition-colors" />
              </button>
              
              <div className="flex items-center space-x-4">
                {testimonials.map((_, index) => (
                  <button 
                    key={index}
                    className={`w-2 h-1 transition-all ${
                      index === currentIndex ? 'bg-yellow-400 w-8' : 'bg-slate-700'
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>
              
              <button 
                onClick={nextSlide}
                className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center hover:bg-yellow-400 transition-colors group"
              >
                <ChevronRight size={20} className="text-white group-hover:text-slate-900 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;