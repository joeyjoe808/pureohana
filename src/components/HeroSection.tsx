import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface HeroSlide {
  id: number;
  image_url: string;
  video_url: string;
  subtitle: string;
  title: string;
  description: string;
  subtitle_color: string;
  title_color: string;
  description_color: string;
  overlay_color: string;
  primary_btn_text: string;
  primary_btn_link: string;
  secondary_btn_text: string;
  secondary_btn_link: string;
}

interface HeroSettings {
  autoplay: boolean;
  loop: boolean;
  pause_on_hover: boolean;
  show_indicators: boolean;
  show_controls: boolean;
  default_display_duration: number;
  default_transition_duration: number;
}

const HeroSection = () => {
  const [loaded, setLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [settings, setSettings] = useState<HeroSettings | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Default slides in case database fetch fails
  const defaultSlides = [
    {
      id: 1,
      image_url: "https://images.pexels.com/photos/3894874/pexels-photo-3894874.jpeg?auto=compress&cs=tinysrgb&w=1920",
      video_url: "",
      subtitle: "EXTRAORDINARY MOMENTS",
      title: "CAPTURING THE AUTHENTIC SPIRIT OF YOUR OHANA",
      description: "Beautiful family photography and films that preserve your most precious Hawaiian memories for generations to come.",
      subtitle_color: "#FACC15",
      title_color: "#FFFFFF",
      description_color: "#E5E7EB",
      overlay_color: "from-slate-900/90 to-slate-900/40"
    },
    {
      id: 2,
      image_url: "/IMG_8209.jpg",
      video_url: "",
      subtitle: "HEARTFELT MOMENTS, ISLAND ROOTS",
      title: "CREATING TIMELESS FAMILY TREASURES",
      description: "Our signature approach blends artistic vision with the natural beauty of Hawaii to tell your family's unique story.",
      subtitle_color: "#FACC15",
      title_color: "#FFFFFF",
      description_color: "#E5E7EB",
      overlay_color: "from-slate-900/90 to-slate-900/40"
    },
    {
      id: 3,
      image_url: "https://lh3.googleusercontent.com/pw/ADCreHfQYSBVl5hWYgG5Uz0HUL0a_jnGCDIX-YzPbjywYYQXOEpBfjQ6K46C1XEiGdZaHgD03ErZRZrdymKmGCdvz9YKTnfD-UHfCg-5MwFsSKGl4uj_l2s-hGmr9f1bpZhGKQyDzXVVLJJKPSl1UlmADUdr=w1920",
      video_url: "",
      subtitle: "PURE OHANA MOMENTS",
      title: "PRESERVING YOUR LEGACY ACROSS GENERATIONS",
      description: "From keiki to kupuna, we document the deep connections and joy that make your family unique against Hawaii's stunning landscapes.",
      subtitle_color: "#FACC15",
      title_color: "#FFFFFF",
      description_color: "#E5E7EB",
      overlay_color: "from-slate-900/90 to-slate-900/40"
    }
  ];

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        // Fetch slides
        const { data: slidesData, error: slidesError } = await supabase
          .from('hero_slides')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });
          
        if (slidesError) throw slidesError;
        
        // Fetch settings - use limit(1) instead of single() to avoid errors with multiple rows
        const { data: settingsData, error: settingsError } = await supabase
          .from('hero_settings')
          .select('*')
          .limit(1);
          
        if (settingsError) {
          throw settingsError;
        }
        
        // Use data from database or fallbacks
        setHeroSlides(slidesData && slidesData.length > 0 ? slidesData : defaultSlides);
        // Get the first settings row if available
        setSettings(settingsData && settingsData.length > 0 ? settingsData[0] : null);
      } catch (error) {
        console.error('Error fetching hero content:', error);
        setHeroSlides(defaultSlides);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHeroContent();
    setLoaded(true);
  }, []);

  useEffect(() => {
    // Don't start autoplay until content is loaded
    if (loading || heroSlides.length === 0) return;
    
    // Autoplay rotation (if enabled in settings)
    const displayDuration = 
      heroSlides[currentSlide]?.display_duration || 
      settings?.default_display_duration || 
      6000;
      
    const shouldAutoplay = settings?.autoplay !== false;
    
    if (shouldAutoplay) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => {
          // If loop is enabled or we're not on the last slide
          if (settings?.loop !== false || prev < heroSlides.length - 1) {
            return (prev + 1) % heroSlides.length;
          }
          return prev; // Stay on last slide if loop is disabled
        });
      }, displayDuration);
      
      return () => clearInterval(interval);
    }
  }, [currentSlide, heroSlides, loading, settings]);

  const scrollToServices = () => {
    const servicesSection = document.getElementById('services-section');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToPortfolio = () => {
    const portfolioSection = document.getElementById('portfolio-section');
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  // Handle CTA button clicks
  const handlePrimaryBtnClick = (link) => {
    if (link) {
      if (link.startsWith('http')) {
        window.open(link, '_blank');
      } else {
        window.location.href = link;
      }
    } else {
      // Default to scrolling to services if no link
      scrollToServices();
    }
  };

  const handleSecondaryBtnClick = (link) => {
    if (link) {
      if (link.startsWith('http')) {
        window.open(link, '_blank');
      } else {
        window.location.href = link;
      }
    } else {
      // Default to scrolling to portfolio if no link
      scrollToPortfolio();
    }
  };

  if (loading || heroSlides.length === 0) {
    return (
      <div className="relative h-screen w-full flex items-center justify-center bg-slate-900">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image Slides */}
      {heroSlides.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 z-0 transition-opacity duration-1500 ease-in-out ${
            currentSlide === index ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {slide.video_url ? (
            <video
              src={slide.video_url}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img 
              src={slide.image_url} 
              alt={slide.title || "Hero slide"} 
              className="w-full h-full object-cover"
            />
          )}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlay_color || 'from-slate-900/90 to-slate-900/40'}`}></div>
        </div>
      ))}

      {/* Hero Content */}
      <div className="container mx-auto h-full flex items-center relative z-10">
        <div 
          className={`hero-content transition-all duration-1000 ease-out ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-[1px] bg-yellow-400"></div>
            <span 
              className="tracking-widest font-light"
              style={{ 
                color: heroSlides[currentSlide].subtitle_color || '#FACC15',
                fontSize: heroSlides[currentSlide].subtitle_size === 'text-xs' ? '0.75rem' : 
                           heroSlides[currentSlide].subtitle_size === 'text-sm' ? '0.875rem' :
                           heroSlides[currentSlide].subtitle_size === 'text-base' ? '1rem' :
                           heroSlides[currentSlide].subtitle_size === 'text-lg' ? '1.125rem' : '0.875rem'
              }}
            >
              {heroSlides[currentSlide].subtitle}
            </span>
          </div>
          <h1 
            className={`${heroSlides[currentSlide].title_size || 'heading-xl'} font-light leading-tight mb-8`}
            style={{ color: heroSlides[currentSlide].title_color || '#FFFFFF' }}
          >
            {heroSlides[currentSlide].title}
          </h1>
          <p 
            className={`${heroSlides[currentSlide].description_size || 'text-lg'} mb-12 max-w-xl leading-relaxed`}
            style={{ color: heroSlides[currentSlide].description_color || '#E5E7EB' }}
          >
            {heroSlides[currentSlide].description}
          </p>
          <div className="flex flex-wrap gap-6">
            {heroSlides[currentSlide].primary_btn_text && (
              <button 
                className="btn-primary"
                onClick={() => handlePrimaryBtnClick(heroSlides[currentSlide].primary_btn_link)}
              >
                {heroSlides[currentSlide].primary_btn_text}
                <ChevronRight size={18} className="ml-2" />
              </button>
            )}
            
            {heroSlides[currentSlide].secondary_btn_text && (
              <button 
                className="btn-secondary"
                onClick={() => handleSecondaryBtnClick(heroSlides[currentSlide].secondary_btn_link)}
              >
                {heroSlides[currentSlide].secondary_btn_text}
              </button>
            )}
            
            {/* Show default buttons if no custom buttons defined */}
            {!heroSlides[currentSlide].primary_btn_text && !heroSlides[currentSlide].secondary_btn_text && (
              <>
                <a 
                  href="mailto:aloha@pureohanatreasures.com?subject=Quick%20Availability%20Check&body=Aloha!%0A%0AAre%20you%20available%20on%20%5BDATE%5D%3F%0A%0AWe%20need%3A%20%5BService%20Type%5D%0ALocation%3A%20%5BWhere%5D%0A%0AThanks!%0A%5BName%5D%20%5BPhone%5D"
                  className="btn-primary"
                >
                  CHECK AVAILABILITY
                  <ChevronRight size={18} className="ml-2" />
                </a>
                <a 
                  href="mailto:aloha@pureohanatreasures.com?subject=Photography%20Inquiry&body=Aloha!%0A%0AI'd%20like%20to%20learn%20more%20about%20your%20photography%20services.%0A%0APlease%20send%20information%20and%20availability!%0A%0AMahalo%2C%0A%5BName%5D%20%5BPhone%5D"
                  className="btn-secondary"
                >
                  GET PRICING
                </a>
              </>
            )}
          </div>
          
          {/* Page Indicators */}
          {settings?.show_indicators !== false && heroSlides.length > 1 && (
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-3">
              {heroSlides.map((_, index) => (
                <button 
                  key={index} 
                  onClick={() => handleSlideChange(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-yellow-400 w-8' : 'bg-white/40 w-2'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;