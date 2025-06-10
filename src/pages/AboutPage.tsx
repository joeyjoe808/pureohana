import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Clock, Video, Heart, Sun, Leaf } from 'lucide-react';
import ContactCTA from '../components/ContactCTA';

const AboutPage = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-slate-950">
        <div className="absolute inset-0 z-0 opacity-80">
          <img 
            src="https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures//ashley%20looking%20into%20isaiahs%20eyes.jpg" 
            alt="Ashley looking into Isaiah's eyes" 
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
              ABOUT US
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              WE ARE STORYTELLERS & VISUAL ARTISTS
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              With a passion for photography and a deep appreciation for Hawaiian culture, we craft visual stories that capture the essence of your ohana.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={itemVariants} className="order-2 lg:order-1">
              <span className="text-yellow-400 font-semibold tracking-wider text-sm uppercase">OUR STORY</span>
              <h2 className="text-3xl md:text-4xl font-bold my-4 text-white">
                CAPTURING OHANA MOMENTS ACROSS HAWAII
              </h2>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Pure Ohana Treasures was founded with a simple mission: to help families preserve their most precious Hawaiian moments through beautiful photography and videography. Based in Aiea on the island of Oahu, our journey began with a passion for capturing authentic family connections against the stunning backdrop of our island home.
              </p>
              <p className="text-gray-400 mb-6 leading-relaxed">
                What makes us unique is our deep understanding of Hawaiian family culture and traditions. We know that ohana extends beyond immediate family, and we specialize in capturing those meaningful connections between generations, from keiki to kupuna.
              </p>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Today, our team serves families across all Hawaiian islands when it makes sense for our clients. We've developed a reputation for creating relaxed, joyful photography experiences that result in timeless images families treasure for generations.
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="order-1 lg:order-2">
              <div className="relative">
                <img 
                  src="https://images.pexels.com/photos/3062541/pexels-photo-3062541.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Our team" 
                  className="w-full h-auto rounded-lg shadow-xl"
                />
                <div className="absolute -bottom-10 -left-10 bg-slate-800 p-6 rounded-lg shadow-lg hidden md:block">
                  <div className="flex items-center">
                    <Award size={40} className="text-yellow-400 mr-4" />
                    <div>
                      <div className="text-white text-2xl font-bold">25+</div>
                      <div className="text-gray-400">Industry Awards</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-slate-950">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-yellow-400 font-semibold tracking-wider text-sm uppercase">OUR PURPOSE</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 text-white">MISSION & VISION</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-slate-800/50 p-8 rounded-lg border-l-4 border-yellow-400"
            >
              <h3 className="text-2xl font-bold mb-4 text-white">Our Mission</h3>
              <p className="text-gray-400 leading-relaxed">
                To create authentic visual stories that capture the true essence of ohana. We believe every family deserves beautiful imagery that reflects their unique connections, cultural heritage, and island lifestyle. Our mission is to provide a relaxed, joyful photography experience that results in timeless keepsakes for generations to come.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-slate-800/50 p-8 rounded-lg border-l-4 border-yellow-400"
            >
              <h3 className="text-2xl font-bold mb-4 text-white">Our Vision</h3>
              <p className="text-gray-400 leading-relaxed">
                To be Hawaii's most trusted family photography and videography studio, known for capturing authentic moments across all islands. We envision a world where every ohana has access to beautiful imagery that celebrates their connections, preserves their traditions, and honors the stunning natural beauty of our island home.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="diagonalStripes" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 0 40 L 40 0" stroke="white" strokeWidth="1" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#diagonalStripes)" />
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
            <span className="text-yellow-400 font-semibold tracking-wider text-sm uppercase">OUR VALUES</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 text-white">WHAT DRIVES US</h2>
            <p className="text-gray-400 max-w-2xl mx-auto mt-4">
              These core principles guide our approach to family photography and our relationships with clients.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Heart size={30} className="text-yellow-400" />,
                title: "Ohana First",
                description: "We believe in the power of family and treat every client's ohana with the same care and respect we show our own."
              },
              {
                icon: <Users size={30} className="text-yellow-400" />,
                title: "Authentic Moments",
                description: "We focus on capturing genuine interactions and emotions rather than overly posed or artificial setups."
              },
              {
                icon: <Award size={30} className="text-yellow-400" />,
                title: "Quality Craftsmanship",
                description: "From our photography equipment to our final deliverables, we never compromise on quality."
              },
              {
                icon: <Clock size={30} className="text-yellow-400" />,
                title: "Island Time Respect",
                description: "We value your time while embracing the relaxed pace that makes for the best Hawaiian photography experiences."
              },
              {
                icon: <Sun size={30} className="text-yellow-400" />,
                title: "Natural Beauty",
                description: "We showcase Hawaii's stunning landscapes while ensuring they complement, not overshadow, your family."
              },
              {
                icon: <Leaf size={30} className="text-yellow-400" />,
                title: "Cultural Sensitivity",
                description: "We approach Hawaiian traditions and customs with knowledge, respect, and appropriate reverence."
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-800/40 p-8 rounded-lg border-b-2 border-yellow-400 hover:bg-slate-800/60 transition-colors"
              >
                <div className="mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-white">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
};

export default AboutPage;