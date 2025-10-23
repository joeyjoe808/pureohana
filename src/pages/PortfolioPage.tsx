import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, X } from 'lucide-react';
import ContactCTA from '../components/ContactCTA';

const PortfolioPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [activeVideo, setActiveVideo] = useState('');

  const openModal = (videoId) => {
    setActiveVideo(videoId);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setActiveVideo('');
    document.body.style.overflow = 'auto';
  };

  const projects = [
    {
      id: "dQw4w9WgXcQ",
      title: "Downtown City Lights",
      category: "portraits",
      thumbnail: "/downtown lights.jpg",
      client: "Pure Ohana Treasures",
      year: "2023"
    },
    {
      id: "dQw4w9WgXcQ",
      title: "Town Night Scenes",
      category: "video",
      thumbnail: "/town night pics-08995.jpg",
      client: "Pure Ohana Treasures",
      year: "2023"
    },
    {
      id: "dQw4w9WgXcQ",
      title: "Evening Town Photography",
      category: "events",
      thumbnail: "/town night pics 2-08947.jpg",
      client: "Pure Ohana Treasures",
      year: "2023"
    },
    {
      id: "dQw4w9WgXcQ",
      title: "Night Urban Portraits",
      category: "portraits",
      thumbnail: "/town night pics-09125.jpg",
      client: "Pure Ohana Treasures",
      year: "2023"
    },
    {
      id: "dQw4w9WgXcQ",
      title: "Family Moments Film",
      category: "video",
      thumbnail: "/IMG_8175.jpg",
      client: "Pure Ohana Treasures",
      year: "2022"
    },
    {
      id: "dQw4w9WgXcQ",
      title: "Special Celebration",
      category: "events",
      thumbnail: "/IMG_8209.jpg",
      client: "Pure Ohana Treasures",
      year: "2022"
    },
    {
      id: "dQw4w9WgXcQ",
      title: "Artistic Portrait Session",
      category: "portraits",
      thumbnail: "/untitled-5774.jpg",
      client: "Pure Ohana Treasures",
      year: "2023"
    },
    {
      id: "dQw4w9WgXcQ",
      title: "Creative Documentary",
      category: "video",
      thumbnail: "/untitled-03371.jpg",
      client: "Pure Ohana Treasures",
      year: "2022"
    },
    {
      id: "dQw4w9WgXcQ",
      title: "Contemporary Portraits",
      category: "events",
      thumbnail: "/untitled-5857.jpg",
      client: "Pure Ohana Treasures",
      year: "2023"
    }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-slate-950">
        <div className="absolute inset-0 z-0 opacity-80">
          <img 
            src="https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/untitled-7287.jpg" 
            alt="Family portrait session" 
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
              OUR PORTFOLIO
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              BEAUTIFUL HAWAIIAN FAMILY MEMORIES
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Explore our collection of family portrait sessions, adventure films, and special event coverage across the Hawaiian islands.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Gallery */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          {/* Filter Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center mb-12"
          >
            {['all', 'portraits', 'video', 'events'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 mx-2 mb-3 rounded transition-colors ${
                  activeFilter === filter 
                    ? 'bg-yellow-400 text-slate-900 font-semibold' 
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                }`}
              >
                {filter === 'all' ? 'All' : 
                 filter === 'portraits' ? 'Family Portraits' : 
                 filter === 'video' ? 'Adventure Films' : 'Special Events'}
              </button>
            ))}
          </motion.div>
          
          {/* Projects Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-lg"
                layout
              >
                <img 
                  src={project.thumbnail} 
                  alt={project.title} 
                  className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <span className="text-yellow-400 text-sm font-medium mb-2">
                      {project.category === 'portraits' ? 'Family Portraits' : 
                       project.category === 'video' ? 'Adventure Films' : 'Special Events'}
                    </span>
                    <h3 className="text-white text-xl font-semibold mb-2">{project.title}</h3>
                    <div className="flex items-center text-gray-400 text-sm mb-4">
                      <span className="mr-3">{project.client}</span>
                      <span>{project.year}</span>
                    </div>
                    {project.category === 'video' && (
                      <button 
                        onClick={() => openModal(project.id)}
                        className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center hover:bg-yellow-300 transition-colors"
                      >
                        <Play size={20} className="text-slate-900 ml-1" />
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Play Button Overlay (Only for Videos) */}
                {project.category === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button 
                      onClick={() => openModal(project.id)}
                      className="w-16 h-16 rounded-full bg-yellow-400/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-90 group-hover:scale-100"
                    >
                      <Play size={24} className="text-slate-900 ml-1" />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-slate-950">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-yellow-400 font-semibold tracking-wider text-sm uppercase">FEATURED WORK</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 text-white">SPECIAL OHANA PROJECTS</h2>
            <p className="text-gray-400 max-w-2xl mx-auto mt-4">
              A closer look at some of our most meaningful family photography and videography projects.
            </p>
          </motion.div>
          
          {/* Featured Project */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 inline-block">
                <span className="text-yellow-400 font-semibold tracking-wider text-sm uppercase">ADVENTURE FILM</span>
              </div>
              <h3 className="text-3xl font-bold mb-4 text-white">
                The Wilson Family Island Adventure
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                A heartwarming family adventure film capturing the Wilson family's exploration of the Big Island. From volcanic landscapes to pristine beaches, this cinematic journey follows three generations as they connect with Hawaiian culture and create lifelong memories together.
              </p>
              
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-400 font-semibold mb-1">Family</div>
                    <div className="text-white">The Wilson Ohana</div>
                  </div>
                  <div>
                    <div className="text-gray-400 font-semibold mb-1">Year</div>
                    <div className="text-white">2023</div>
                  </div>
                  <div>
                    <div className="text-gray-400 font-semibold mb-1">Services</div>
                    <div className="text-white">Adventure Film, Photography</div>
                  </div>
                  <div>
                    <div className="text-gray-400 font-semibold mb-1">Location</div>
                    <div className="text-white">Big Island, Hawaii</div>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => openModal("dQw4w9WgXcQ")}
                className="px-6 py-3 bg-yellow-400 text-slate-900 font-semibold rounded hover:bg-yellow-500 transition-colors flex items-center"
              >
                WATCH THE FILM
                <Play size={18} className="ml-2" />
              </button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="overflow-hidden rounded-lg">
                <img
                  src="/IMG_8175.jpg"
                  alt="Wilson Family Adventure"
                  className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <button 
                onClick={() => openModal("dQw4w9WgXcQ")}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center">
                  <Play size={30} className="text-slate-900 ml-1" />
                </div>
              </button>
            </motion.div>
          </div>
          
          {/* Second Featured Project */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-2 lg:order-2"
            >
              <div className="mb-4 inline-block">
                <span className="text-yellow-400 font-semibold tracking-wider text-sm uppercase">SPECIAL EVENT</span>
              </div>
              <h3 className="text-3xl font-bold mb-4 text-white">
                Kealoha First Paina Luau
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                A beautiful celebration of little Leilani's first paina with a traditional Hawaiian luau. Our team captured the emotional family moments, traditional ceremonies, and joyful celebrations that made this day so special for the Kealoha ohana.
              </p>
              
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-400 font-semibold mb-1">Family</div>
                    <div className="text-white">The Kealoha Ohana</div>
                  </div>
                  <div>
                    <div className="text-gray-400 font-semibold mb-1">Year</div>
                    <div className="text-white">2023</div>
                  </div>
                  <div>
                    <div className="text-gray-400 font-semibold mb-1">Services</div>
                    <div className="text-white">Event Photography & Film</div>
                  </div>
                  <div>
                    <div className="text-gray-400 font-semibold mb-1">Location</div>
                    <div className="text-white">Kailua-Kona, Hawaii</div>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => openModal("dQw4w9WgXcQ")}
                className="px-6 py-3 bg-yellow-400 text-slate-900 font-semibold rounded hover:bg-yellow-500 transition-colors flex items-center"
              >
                VIEW HIGHLIGHTS
                <Play size={18} className="ml-2" />
              </button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative group order-1 lg:order-1"
            >
              <div className="overflow-hidden rounded-lg">
                <img
                  src="/IMG_8209.jpg"
                  alt="First Paina Luau"
                  className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <button 
                onClick={() => openModal("dQw4w9WgXcQ")}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center">
                  <Play size={30} className="text-slate-900 ml-1" />
                </div>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <button 
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-yellow-400 transition-colors"
            >
              <X size={24} />
            </button>
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      <ContactCTA />
    </>
  );
};

export default PortfolioPage;