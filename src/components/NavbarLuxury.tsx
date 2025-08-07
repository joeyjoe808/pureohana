import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NavbarLuxury = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${
      scrolled ? 'bg-white/95 backdrop-blur-md py-4' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex justify-between items-center">
          {/* Logo - Minimal */}
          <Link to="/" className={`text-2xl font-extralight tracking-widest transition-colors ${
            scrolled ? 'text-gray-900' : 'text-white'
          }`}>
            PURE OHANA TREASURES
          </Link>

          {/* Desktop Menu - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-12">
            <Link 
              to="/portfolio" 
              className={`text-sm font-light tracking-wider transition-colors hover:opacity-70 ${
                scrolled ? 'text-gray-700' : 'text-white/90'
              }`}
            >
              PORTFOLIO
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-light tracking-wider transition-colors hover:opacity-70 ${
                scrolled ? 'text-gray-700' : 'text-white/90'
              }`}
            >
              ABOUT
            </Link>
            <Link 
              to="/investment" 
              className={`text-sm font-light tracking-wider transition-colors hover:opacity-70 ${
                scrolled ? 'text-gray-700' : 'text-white/90'
              }`}
            >
              INVESTMENT
            </Link>
            <a 
              href="mailto:pureohanatreasures@gmail.com?subject=Inquiry"
              className={`text-sm font-light tracking-wider border px-6 py-2 transition-all hover:bg-white hover:text-gray-900 ${
                scrolled 
                  ? 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white' 
                  : 'border-white/80 text-white/90'
              }`}
            >
              INQUIRE
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden transition-colors ${
              scrolled ? 'text-gray-900' : 'text-white'
            }`}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg">
          <div className="flex flex-col p-6 space-y-4">
            <Link 
              to="/portfolio" 
              className="text-gray-700 text-sm tracking-wider py-2"
              onClick={() => setIsOpen(false)}
            >
              PORTFOLIO
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 text-sm tracking-wider py-2"
              onClick={() => setIsOpen(false)}
            >
              ABOUT
            </Link>
            <Link 
              to="/investment" 
              className="text-gray-700 text-sm tracking-wider py-2"
              onClick={() => setIsOpen(false)}
            >
              INVESTMENT
            </Link>
            <a 
              href="mailto:pureohanatreasures@gmail.com?subject=Inquiry"
              className="text-gray-900 text-sm tracking-wider border border-gray-900 px-6 py-3 text-center"
              onClick={() => setIsOpen(false)}
            >
              INQUIRE
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarLuxury;