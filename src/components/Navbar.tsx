import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Instagram, Twitter, Facebook, Calendar, Youtube } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'ABOUT', path: '/about' },
    { name: 'SERVICES', path: '/services' },
    { name: 'PORTFOLIO', path: '/portfolio' },
    { name: 'BLOG', path: '/blog' },
    { name: 'CONTACT', path: '/contact' },
  ];

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-slate-900/95 backdrop-blur-md py-4 shadow-lg' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl md:text-2xl font-serif tracking-wide text-white">
              Pure<span className="text-yellow-400">Ohana</span>Treasures
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-12">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs tracking-widest hover:text-yellow-400 transition-colors nav-link ${
                  location.pathname === link.path ? 'text-yellow-400 active-nav' : 'text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Book Now Button & Social Icons */}
          <div className="hidden lg:flex items-center space-x-6">
            <a 
              href="https://www.instagram.com/pureohanatreasures/" 
              className="text-gray-400 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Instagram size={16} />
            </a>
            <a 
              href="https://twitter.com" 
              className="text-gray-400 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <Twitter size={16} />
            </a>
            <a 
              href="https://facebook.com" 
              className="text-gray-400 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <Facebook size={16} />
            </a>
            <a 
              href="https://www.youtube.com/channel/UCf9hwe3GW-svA1mfI-znTQA" 
              className="text-gray-400 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <Youtube size={16} />
            </a>
            <a 
              href="https://pureohanatreasures.as.me/schedule/0caada86"
              target="_blank"
              rel="noopener noreferrer" 
              className="bg-yellow-400 text-slate-900 px-5 py-2.5 rounded-sm text-xs tracking-widest flex items-center hover:bg-yellow-300 transition-colors uppercase font-medium"
            >
              <Calendar size={14} className="mr-1" />
              Inquire
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden text-white focus:outline-none"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden absolute left-0 right-0 bg-slate-900 backdrop-blur-lg shadow-lg transition-all duration-300 overflow-hidden ${
            isMenuOpen ? 'max-h-screen py-5' : 'max-h-0'
          }`}
        >
          <div className="container mx-auto px-4 flex flex-col space-y-4 pb-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm tracking-widest hover:text-yellow-400 transition-colors py-2 ${
                  location.pathname === link.path ? 'text-yellow-400' : 'text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <a 
              href="https://pureohanatreasures.as.me/schedule/0caada86"
              className="bg-yellow-400 text-slate-900 px-4 py-3 rounded-sm text-sm font-medium tracking-widest flex items-center justify-center mt-4 uppercase"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
            >
              <Calendar size={16} className="mr-2" />
              Inquire
            </a>
            <div className="flex items-center space-x-4 pt-2 justify-center">
              <a 
                href="https://www.instagram.com/pureohanatreasures/" 
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://twitter.com" 
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="https://facebook.com" 
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://www.youtube.com/channel/UCf9hwe3GW-svA1mfI-znTQA" 
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;