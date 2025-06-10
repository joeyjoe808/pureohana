import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube, Mail, MapPin, Phone } from 'lucide-react';
import NewsletterForm from './NewsletterForm';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 pt-20 pb-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-light mb-6 text-white">Pure<span className="text-yellow-400">Ohana</span>Treasures</h3>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              We create beautiful memories for families across Hawaii. Our team captures the authentic spirit of your ohana through photography and videography.
            </p>
            <div className="flex space-x-5">
              <a 
                href="https://www.instagram.com/pureohanatreasures/" 
                className="text-gray-500 hover:text-yellow-400 transition-colors"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://twitter.com" 
                className="text-gray-500 hover:text-yellow-400 transition-colors"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="https://facebook.com/joseph.medina.52493" 
                className="text-gray-500 hover:text-yellow-400 transition-colors"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://www.youtube.com/channel/UCf9hwe3GW-svA1mfI-znTQA" 
                className="text-gray-500 hover:text-yellow-400 transition-colors"
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-base font-light mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Our Story</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Experiences</Link></li>
              <li><Link to="/portfolio" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Portfolio</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Journal</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Connect</Link></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-base font-light mb-6 text-white">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={16} className="text-yellow-400 mt-1 mr-3" />
                <span className="text-gray-400 text-sm">Aiea, Hawaii, on the island of Oahu</span>
              </li>
              <li className="flex items-start">
                <Phone size={16} className="text-yellow-400 mt-1 mr-3" />
                <a 
                  href="https://pureohanatreasures.as.me/schedule/0caada86" 
                  className="text-gray-400 text-sm hover:text-yellow-400 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book an appointment
                </a>
              </li>
              <li className="flex items-start">
                <Mail size={16} className="text-yellow-400 mt-1 mr-3" />
                <a 
                  href="mailto:pureohanatreasures@gmail.com" 
                  className="text-gray-400 text-sm hover:text-yellow-400 transition-colors"
                >
                  pureohanatreasures@gmail.com
                </a>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-base font-light mb-6 text-white">Newsletter</h3>
            <p className="text-gray-400 mb-4 text-sm">Subscribe to our newsletter for the latest updates and special offers.</p>
            <NewsletterForm location="footer" />
          </div>
        </div>
        
        <div className="border-t border-slate-800/50 pt-8">
          <div className="text-center text-gray-600 text-xs">
            <p>© {currentYear} Pure Ohana Treasures. All rights reserved.</p>
            <div className="mt-2">
              <a href="#" className="text-gray-500 hover:text-yellow-400 transition-colors mx-2">Privacy Policy</a>
              <span className="text-gray-700">|</span>
              <a href="#" className="text-gray-500 hover:text-yellow-400 transition-colors mx-2">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;