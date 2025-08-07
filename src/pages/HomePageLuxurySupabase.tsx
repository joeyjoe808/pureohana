import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';

const HomePageLuxurySupabase = () => {
  const [heroImage, setHeroImage] = useState('');
  const [portfolioImages, setPortfolioImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      // Fetch hero image from your media table
      const { data: heroData } = await supabase
        .from('media')
        .select('file_url')
        .eq('category', 'hero')
        .eq('is_featured', true)
        .limit(1)
        .single();

      if (heroData) {
        setHeroImage(heroData.file_url);
      }

      // Fetch portfolio images - only the best 4
      const { data: portfolioData } = await supabase
        .from('media')
        .select('file_url, title, alt_text')
        .eq('category', 'portfolio')
        .eq('is_featured', true)
        .order('display_order', { ascending: true })
        .limit(4);

      if (portfolioData) {
        setPortfolioImages(portfolioData);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-gray-300 font-light tracking-widest">LOADING</div>
      </div>
    );
  }

  return (
    <>
      {/* HERO - Ultra minimal with your actual photo */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage || "https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/untitled-1720.jpg"}
            alt="Pure Ohana Treasures"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30"></div>
        </div>

        {/* Minimal branding */}
        <div className="relative z-10 h-full flex flex-col justify-between">
          {/* Top - Just the logo */}
          <div className="pt-12 px-12">
            <h1 className="text-white text-2xl font-extralight tracking-[0.3em]">
              PURE OHANA
            </h1>
          </div>

          {/* Bottom - Essential info only */}
          <div className="pb-20 px-12 text-center">
            <p className="text-white/70 text-sm font-light tracking-[0.2em] mb-8">
              HAWAII WEDDING PHOTOGRAPHER
            </p>
            <a 
              href="mailto:pureohanatreasures@gmail.com?subject=Wedding%20Inquiry"
              className="inline-block text-white text-xs tracking-[0.3em] font-light 
                       border border-white/40 px-8 py-3 
                       hover:bg-white hover:text-black transition-all duration-700"
            >
              INQUIRE
            </a>
          </div>
        </div>

        {/* Subtle scroll hint */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <ChevronDown className="text-white/30 animate-pulse" size={20} />
        </div>
      </section>

      {/* SELECTED WORKS - Just 4 images, no captions */}
      <section className="bg-white">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {portfolioImages.map((img, idx) => (
            <div key={idx} className="relative aspect-square overflow-hidden group">
              <img 
                src={img.file_url}
                alt={img.alt_text || `Portfolio ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-1000 
                         group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 
                            transition-all duration-700"></div>
            </div>
          ))}
        </div>
      </section>

      {/* PHILOSOPHY - Extremely minimal */}
      <section className="bg-white py-32">
        <div className="max-w-2xl mx-auto px-8 text-center">
          <p className="text-gray-600 font-light leading-loose text-lg">
            For those who value artistry over trends.
            <br />
            Intimacy over spectacle.
            <br />
            Authenticity over perfection.
          </p>
        </div>
      </section>

      {/* FEATURED VENUE - Single image, minimal text */}
      <section className="bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="aspect-[4/5] md:aspect-auto">
            <img 
              src="https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/untitled-1781.jpg"
              alt="Featured Wedding"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="aspect-[4/5] md:aspect-auto flex items-center justify-center p-16 bg-gray-50">
            <div className="text-center">
              <p className="text-gray-400 text-xs tracking-[0.3em] mb-6">RECENT</p>
              <h3 className="text-2xl font-extralight tracking-wider mb-6 text-gray-800">
                Four Seasons Maui
              </h3>
              <div className="w-12 h-[1px] bg-gray-300 mx-auto mb-6"></div>
              <p className="text-gray-500 font-light text-sm leading-relaxed">
                June 2024
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AVAILABILITY - Super clean */}
      <section className="bg-white py-32">
        <div className="max-w-xl mx-auto px-8 text-center">
          <h2 className="text-2xl font-extralight tracking-[0.2em] mb-12 text-gray-800">
            2025 AVAILABILITY
          </h2>
          <div className="space-y-3 text-sm font-light text-gray-500">
            <p>March — 2 dates remaining</p>
            <p>April — Available</p>
            <p>May — 1 date remaining</p>
            <p>June — Fully booked</p>
          </div>
          <div className="mt-16">
            <a 
              href="mailto:pureohanatreasures@gmail.com?subject=2025%20Availability"
              className="text-gray-800 text-xs tracking-[0.3em] border-b border-gray-300 
                       hover:border-gray-800 transition-colors pb-1"
            >
              CHECK YOUR DATE
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER - Minimal contact */}
      <footer className="bg-gray-50 py-20">
        <div className="text-center">
          <h3 className="text-xl font-extralight tracking-[0.3em] mb-8 text-gray-800">
            PURE OHANA
          </h3>
          <div className="text-xs font-light text-gray-500 space-y-2">
            <p>OAHU • MAUI • KAUAI • BIG ISLAND</p>
            <p className="tracking-wider">pureohanatreasures@gmail.com</p>
          </div>
          <div className="mt-12 flex justify-center space-x-8">
            <a href="/instagram" className="text-gray-400 hover:text-gray-600 transition-colors">
              <span className="text-xs tracking-wider">INSTAGRAM</span>
            </a>
            <a href="/pinterest" className="text-gray-400 hover:text-gray-600 transition-colors">
              <span className="text-xs tracking-wider">PINTEREST</span>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default HomePageLuxurySupabase;