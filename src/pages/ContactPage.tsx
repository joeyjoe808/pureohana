import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, MessageSquare, User, AtSign, Calendar, Phone, Check, Sparkles } from 'lucide-react';
import ContactCTA from '../components/ContactCTA';
import NewsletterForm from '../components/NewsletterForm';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    event_type: '',
    date: '',
    vision: '',
    referral: ''
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send the form data to a server here
    console.log('Form submitted:', formData);
    setFormSubmitted(true);
    
    // Reset form after submission
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        event_type: '',
        date: '',
        vision: '',
        referral: ''
      });
      setFormSubmitted(false);
    }, 5000);
  };

  const eventTypes = [
    'Destination Wedding',
    'Elopement',
    'Vow Renewal',
    'Engagement',
    'Family Portrait Session',
    'Special Event',
    'Other'
  ];

  const referralSources = [
    'Instagram',
    'Google Search',
    'Wedding Planner',
    'Past Client',
    'Wedding Publication',
    'Venue Recommendation',
    'Other'
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-slate-950">
        <div className="absolute inset-0 z-0 opacity-80">
          <img 
            src="https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures//town%20night%20pics-09125.jpg" 
            alt="Honolulu night cityscape" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/40"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="bg-yellow-400 inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-slate-900">
              BEGIN YOUR JOURNEY
            </div>
            <h1 className="text-4xl md:text-5xl font-serif mb-6 text-white">
              LET'S CREATE SOMETHING EXTRAORDINARY
            </h1>
            <p className="text-xl text-gray-300 mb-8 font-light">
              We're honored you're considering Pure Ohana Treasures to capture your most precious moments. Share your vision with us, and we'll begin crafting your bespoke experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3 bg-slate-800 rounded-lg p-8 elegant-shadow"
            >
              <h2 className="text-2xl font-serif mb-8 text-white">Begin Your Consultation</h2>
              
              {formSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-500/10 border border-green-500/30 rounded-lg p-8 text-center"
                >
                  <div className="text-green-400 mb-6">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                      <Check size={32} className="text-green-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-serif text-white mb-4">Mahalo for Sharing Your Vision</h3>
                  <p className="text-gray-300 mb-6">
                    Your inquiry has been received. Our concierge team will be in touch within 24 hours to discuss your bespoke experience in detail.
                  </p>
                  <p className="text-yellow-400 text-sm">
                    We look forward to creating something extraordinary together.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 mb-2 font-light">Your Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User size={18} className="text-yellow-400/50" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                          placeholder="Your Full Name"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2 font-light">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <AtSign size={18} className="text-yellow-400/50" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2 font-light">Phone Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone size={18} className="text-yellow-400/50" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-10 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                          placeholder="Your Phone Number"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2 font-light">Event Type</label>
                      <div className="relative">
                        <select
                          name="event_type"
                          value={formData.event_type}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white appearance-none"
                        >
                          <option value="">Select Event Type</option>
                          {eventTypes.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-yellow-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2 font-light">Envisioned Date(s)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar size={18} className="text-yellow-400/50" />
                        </div>
                        <input
                          type="text"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          className="w-full pl-10 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                          placeholder="Month/Year or Specific Date"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2 font-light">How Did You Hear About Us?</label>
                      <div className="relative">
                        <select
                          name="referral"
                          value={formData.referral}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white appearance-none"
                        >
                          <option value="">Select Source</option>
                          {referralSources.map((source, index) => (
                            <option key={index} value={source}>{source}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-yellow-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2 font-light">Tell Us About Your Vision</label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <Sparkles size={18} className="text-yellow-400/50" />
                      </div>
                      <textarea
                        name="vision"
                        value={formData.vision}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full pl-10 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                        placeholder="Share your vision for your special day, including any specific details, locations, or style preferences you have in mind..."
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-yellow-400 text-slate-900 font-medium rounded hover:bg-yellow-500 transition-colors text-center"
                    >
                      SHARE YOUR VISION
                    </button>
                    <span className="text-gray-400 text-center sm:text-left">or</span>
                    <a 
                      href="https://pureohanatreasures.as.me/schedule/0caada86" 
                      className="px-6 py-3 border border-yellow-400 text-yellow-400 font-medium rounded hover:bg-yellow-400/10 transition-colors flex items-center justify-center"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Calendar size={18} className="mr-2" />
                      SCHEDULE A CONSULTATION
                    </a>
                  </div>
                  
                  <div className="text-gray-400 text-xs italic pt-2">
                    Your privacy matters. All inquiries are confidential and protected by our privacy policy.
                  </div>
                </form>
              )}
            </motion.div>
            
            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-slate-800 rounded-lg p-8 mb-8 elegant-shadow">
                <h2 className="text-2xl font-serif mb-6 text-white">Concierge Contact</h2>
                
                <ul className="space-y-6">
                  <li className="flex items-start">
                    <div className="bg-slate-700/50 p-3 rounded-lg mr-4">
                      <MapPin size={20} className="text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Our Studio</h3>
                      <p className="text-gray-400">Honolulu, Hawaii</p>
                      <p className="text-gray-400 mt-1">Serving all Hawaiian islands</p>
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="bg-slate-700/50 p-3 rounded-lg mr-4">
                      <Mail size={20} className="text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Email</h3>
                      <p className="text-gray-400">pureohanatreasures@gmail.com</p>
                      <p className="text-gray-400 mt-1">We respond within 24 hours</p>
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="bg-slate-700/50 p-3 rounded-lg mr-4">
                      <Calendar size={20} className="text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Availability</h3>
                      <p className="text-gray-400 mb-1">We accept a limited number of commissions each year</p>
                      <a 
                        href="https://pureohanatreasures.as.me/schedule/0caada86"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-400 hover:text-yellow-300 transition-colors text-sm"
                      >
                        Check our calendar →
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-8 elegant-shadow">
                <h2 className="text-2xl font-serif mb-6 text-white">Join Our List</h2>
                <p className="text-gray-400 text-sm mb-6">
                  Subscribe to receive exclusive photography insights, luxury venue spotlights, and first access to limited availability dates.
                </p>
                <NewsletterForm location="contact_page" buttonText="Subscribe" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-20 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="diagonalLines" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 0 40 L 40 0" stroke="white" strokeWidth="0.5" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#diagonalLines)" />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-yellow-400 font-medium tracking-wider text-sm uppercase">OUR APPROACH</span>
            <h2 className="text-3xl md:text-4xl font-serif mt-2 mb-6 text-white">THE PURE OHANA EXPERIENCE</h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              Our concierge approach ensures that every detail of your photography or cinematography experience is tailored to your unique vision.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Initial Conversation",
                description: "We begin with a personalized consultation to understand your vision, preferences, and the unique aspects of your celebration."
              },
              {
                step: "02",
                title: "Custom Proposal",
                description: "Based on your vision, we craft a bespoke proposal detailing our approach, creative direction, and comprehensive investment options."
              },
              {
                step: "03",
                title: "Creative Planning",
                description: "We collaborate with you and your planner to develop a sophisticated timeline and artistic direction for your photography or film."
              },
              {
                step: "04",
                title: "The Experience",
                description: "On your special day, our team works with unobtrusive elegance to capture authentic moments while ensuring you remain fully present."
              },
              {
                step: "05",
                title: "Artful Editing",
                description: "Your images undergo meticulous editing to create a cohesive visual narrative that reflects our signature artistic aesthetic."
              },
              {
                step: "06",
                title: "Elegant Delivery",
                description: "Your final collection is presented in a luxurious package, with both digital assets and bespoke print options for your heirloom collection."
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-800/50 p-8 rounded-lg border-b border-yellow-400/30"
              >
                <div className="text-yellow-400 font-serif text-4xl mb-4">{item.step}</div>
                <h3 className="text-xl font-serif text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-yellow-400 font-medium tracking-wider text-sm uppercase">FREQUENTLY ASKED</span>
            <h2 className="text-3xl md:text-4xl font-serif mt-2 text-white">QUESTIONS & ANSWERS</h2>
            <p className="text-gray-400 max-w-2xl mx-auto mt-4">
              Common inquiries about our luxury wedding photography and cinematography services.
            </p>
          </motion.div>
          
          <div className="max-w-3xl mx-auto">
            {[
              {
                question: "How far in advance should we book your services?",
                answer: "For luxury weddings and events, we recommend booking 9-18 months in advance. For certain dates during peak season, we may be fully committed up to two years ahead. We accept a limited number of commissions each year to ensure our unwavering dedication to each celebration."
              },
              {
                question: "What makes Pure Ohana Treasures different from other photographers?",
                answer: "We distinguish ourselves through our artistic approach to luxury documentation, treating each wedding as a unique creative commission rather than a standardized service. Our team specializes exclusively in sophisticated celebrations, bringing both technical excellence and artistic vision to each event. Additionally, we offer a concierge-level experience from first inquiry through final delivery."
              },
              {
                question: "Do you photograph destination weddings beyond Hawaii?",
                answer: "While we specialize in Hawaiian luxury weddings, we accept a select number of destination commissions annually for clients whose vision aligns with our artistic approach. These typically include locations in the South Pacific, Mediterranean, and Caribbean. Please inquire about our destination offerings and availability."
              },
              {
                question: "What is your approach to capturing wedding day moments?",
                answer: "Our philosophy balances refined artistic direction with authentic moment capture. Rather than heavily posing or interrupting your celebration, we create an environment where genuine moments unfold naturally within thoughtfully composed frames. Our presence is unobtrusive yet purposeful, allowing you to remain fully immersed in your celebration while we document both emotional moments and sophisticated details."
              },
              {
                question: "When and how will we receive our images?",
                answer: "For luxury weddings, we provide a curated preview gallery within one week of your celebration, featuring 75-100 signature images. Your complete collection of artfully edited images is delivered within 8-10 weeks via a sophisticated online gallery. Physical deliverables, including bespoke albums and fine art prints, are typically completed 3-4 months after your final selections."
              }
            ].map((faq, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="mb-5"
              >
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none bg-slate-800/70 p-5 rounded-lg">
                    <span className="text-white font-serif">{faq.question}</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" className="text-yellow-400">
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <p className="text-gray-400 mt-3 mb-5 px-5 font-light leading-relaxed">{faq.answer}</p>
                </details>
              </motion.div>
            ))}
            
            <div className="text-center mt-12">
              <p className="text-gray-400 mb-6">
                Have a question that wasn't answered here? We'd be delighted to speak with you directly.
              </p>
              <a 
                href="mailto:pureohanatreasures@gmail.com" 
                className="inline-flex items-center px-6 py-3 border border-yellow-400 text-yellow-400 font-light text-sm rounded-sm hover:bg-yellow-400/10 transition-colors"
              >
                <Mail size={16} className="mr-2" />
                EMAIL US DIRECTLY
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-slate-950">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-yellow-400 font-medium tracking-wider text-sm uppercase">OUR LOCATION</span>
            <h2 className="text-3xl font-serif mt-2 text-white">HONOLULU STUDIO</h2>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-lg overflow-hidden shadow-xl h-96 elegant-shadow"
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59532.69493511565!2d-157.91339418356042!3d21.306904699999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c006df54afb7571%3A0x5d783c0f93c41227!2sHonolulu%2C%20HI!5e0!3m2!1sen!2sus!4v1713186962236!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy"
              title="Our Studio Location"
            ></iframe>
          </motion.div>
          
          <div className="mt-8 text-center text-sm text-gray-400">
            Our studio is available for consultations by appointment only. For your convenience, we also offer virtual consultations via Zoom.
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
};

export default ContactPage;