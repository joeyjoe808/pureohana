import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Video, PartyPopper, Book, Users, Sun, Heart, Leaf } from 'lucide-react';
import ContactCTA from '../components/ContactCTA';

const ServicesPage = () => {
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

  const services = [
    {
      icon: <Camera size={40} className="text-yellow-400" />,
      title: "Island Portrait Sessions",
      description: "Candid or styled, barefoot or dressed to the nines—we'll capture your Ohana just as they are. Natural light, real laughter, beautiful results.",
      features: [
        "Beach, jungle, or volcanic landscape settings",
        "Natural, candid family interactions",
        "Professional lighting and equipment",
        "Multiple outfit changes available",
        "Same-day sneak peek images"
      ]
    },
    {
      icon: <Video size={40} className="text-yellow-400" />,
      title: "Adventure Films & Story Videos",
      description: "We craft short family films with emotion and movement. Perfect for vacations, milestones, or just everyday magic.",
      features: [
        "Cinematic-quality family film (3-5 minutes)",
        "Professional audio recording for narration",
        "Drone footage for breathtaking Hawaiian vistas",
        "Story development and creative direction",
        "Licensed Hawaiian music options available"
      ]
    },
    {
      icon: <PartyPopper size={40} className="text-yellow-400" />,
      title: "Events, Luau, & Special Days",
      description: "From paina beach bashes to graduation lei ceremonies—we capture the spirit of your special day so it can live on.",
      features: [
        "Full event coverage (2-8 hours available)",
        "Multiple photographer options for larger events",
        "Traditional Hawaiian ceremony expertise",
        "Family gathering and reunion documentation",
        "Quick turnaround for special occasion sharing"
      ]
    },
    {
      icon: <Book size={40} className="text-yellow-400" />,
      title: "Custom Memory Treasures",
      description: "Receive beautifully edited digital albums, printed keepsakes, or a custom family video with island-style music and narration.",
      features: [
        "Fine art albums",
        "Archival prints",
        "Custom presentation boxes",
        "Digital preservation",
        "Family legacy planning"
      ]
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-slate-950">
        <div className="absolute inset-0 z-0 opacity-80">
          <img 
            src="https://images.pexels.com/photos/1000445/pexels-photo-1000445.jpeg?auto=compress&cs=tinysrgb&w=1920" 
            alt="Hawaiian beach sunset" 
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
              OUR SERVICES
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              CAPTURING YOUR OHANA'S PRECIOUS MOMENTS
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              From beach portraits to family adventure films, we offer a range of services to preserve your family's Hawaiian memories. Based in Aiea, Oahu, we serve clients across all Hawaiian islands.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {services.slice(0, 4).map((service, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="bg-slate-800 p-8 rounded-lg transition-all duration-300 hover:bg-slate-700 group"
              >
                <div className="w-16 h-16 bg-yellow-400/10 flex items-center justify-center rounded-lg mb-6 group-hover:bg-yellow-400/20 transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{service.title}</h3>
                <p className="text-gray-400 mb-6">{service.description}</p>
                <a 
                  href="mailto:pureohanatreasures@gmail.com?subject=Photography%20Session%20Inquiry&body=Aloha!%0A%0AI'm%20interested%20in%20booking%20a%20session.%0A%0AService%20Type%3A%20%5BPortrait%2FFilm%2FEvent%2FMemory%5D%0APreferred%20Date%3A%20%0ANumber%20of%20People%3A%20%0A%0AMahalo%2C%0A%5BName%5D%20%5BPhone%5D"
                  className="text-yellow-400 font-medium flex items-center group-hover:text-yellow-300 transition-colors"
                >
                  Get Quote
                  <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Service Details */}
      {services.map((service, index) => (
        <section key={index} className={`py-20 ${index % 2 === 0 ? 'bg-slate-950' : 'bg-slate-900'}`}>
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              <div className={`${index % 2 === 0 ? 'order-1 lg:order-1' : 'order-1 lg:order-2'}`}>
                <div className="mb-4 inline-block">
                  <span className="text-yellow-400 font-semibold tracking-wider text-sm uppercase">OUR EXPERTISE</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                  {service.title.toUpperCase()}
                </h2>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  {service.description}
                </p>
                
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, i) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start"
                    >
                      <svg className="h-6 w-6 text-yellow-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
                
                <a 
                  href="mailto:pureohanatreasures@gmail.com?subject=Photography%20Services%20Inquiry&body=Aloha!%0A%0AI'd%20like%20to%20learn%20more%20about%20your%20services.%0A%0AService%20Interested%20In%3A%20%0APreferred%20Dates%3A%20%0ANumber%20of%20People%3A%20%0ALocation%3A%20%0A%0APlease%20send%20information!%0A%0AMahalo%2C%0A%5BName%5D%20%5BPhone%5D"
                  className="px-6 py-3 bg-yellow-400 text-slate-900 font-semibold rounded hover:bg-yellow-500 transition-colors"
                >
                  GET PERSONALIZED QUOTE
                </a>
              </div>
              
              <div className={`${index % 2 === 0 ? 'order-2 lg:order-2' : 'order-2 lg:order-1'}`}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <img 
                    src={`${index === 3 ? 'https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures//Recent%20contact%203.jpg' : `https://images.pexels.com/photos/${[1000445, 3932951, 5486845][index % 3]}/pexels-photo-${[1000445, 3932951, 5486845][index % 3]}.jpeg?auto=compress&cs=tinysrgb&w=800`}`} 
                    alt={service.title} 
                    className="w-full h-auto rounded-lg shadow-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/20 to-transparent rounded-lg"></div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      ))}

      {/* Process */}
      <section className="py-20 bg-slate-950">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-yellow-400 font-semibold tracking-wider text-sm uppercase">HOW WE WORK</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 text-white">OUR ALOHA PROCESS</h2>
            <p className="text-gray-400 max-w-2xl mx-auto mt-4">
              We believe in creating an enjoyable, stress-free experience from first contact to final delivery.
            </p>
          </motion.div>

          <div className="relative">
            {/* Process Steps */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-slate-700 transform -translate-x-1/2"></div>
            
            {[
              {
                number: "01",
                title: "Initial Consultation",
                description: "We'll learn about your family, your vision, and which services best fit your needs. For neighbor island clients, we can arrange video consultations."
              },
              {
                number: "02",
                title: "Location & Style Planning",
                description: "We'll help you choose the perfect Hawaiian setting and style for your portraits or video. We have experience with locations across all major islands."
              },
              {
                number: "03",
                title: "The Session Experience",
                description: "Relaxed, fun, and authentic—we'll guide you through a memorable photography or video experience at your chosen location."
              },
              {
                number: "04",
                title: "Professional Editing",
                description: "Your images and videos are carefully edited to enhance their natural beauty while maintaining authenticity."
              },
              {
                number: "05",
                title: "Delivery & Sharing",
                description: "Receive your beautifully packaged digital files, albums, or videos ready to share with loved ones near and far."
              },
              {
                number: "06",
                title: "Ohana for Life",
                description: "Return for annual sessions as your family grows—we offer special packages for returning clients, no matter which island you choose."
              }
            ].map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative flex md:items-center mb-12 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className={`hidden md:block w-1/2 ${index % 2 === 0 ? 'text-right pr-12' : 'text-left pl-12'}`}>
                  <div className="bg-slate-800 p-6 rounded-lg inline-block">
                    <div className="text-yellow-400 text-lg font-bold mb-2">{step.number}</div>
                    <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                </div>
                
                <div className="hidden md:flex items-center justify-center relative z-10">
                  <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-slate-900 font-bold">
                    {step.number}
                  </div>
                </div>
                
                <div className={`md:hidden w-full bg-slate-800 p-6 rounded-lg`}>
                  <div className="text-yellow-400 text-lg font-bold mb-2">{step.number}</div>
                  <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
                
                <div className="hidden md:block w-1/2"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-yellow-400 font-semibold tracking-wider text-sm uppercase">WHERE WE SERVE</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 text-white">ISLAND COVERAGE</h2>
            <p className="text-gray-400 max-w-2xl mx-auto mt-4">
              Based in Aiea on Oahu, we offer our services across all Hawaiian islands when it makes sense for our clients.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                island: "Oahu",
                description: "Our home base - offering the most flexible scheduling and no travel fees.",
                locations: "Waikiki, North Shore, Kailua, Ko Olina, Lanikai"
              },
              {
                island: "Maui",
                description: "Regular visits to capture families against Maui's diverse landscapes.",
                locations: "Wailea, Kaanapali, Lahaina, Hana, Upcountry"
              },
              {
                island: "Big Island",
                description: "Scheduled trips to Hawaii Island for unique volcanic and tropical backdrops.",
                locations: "Kona, Kohala Coast, Waipio Valley, Volcanic areas"
              },
              {
                island: "Kauai",
                description: "The Garden Isle offers dramatic scenery for unforgettable family portraits.",
                locations: "Na Pali Coast, Poipu, Hanalei, Waimea Canyon"
              },
              {
                island: "Molokai & Lanai",
                description: "Limited availability for these less-visited islands with advance booking.",
                locations: "Contact us for specific locations and availability"
              },
              {
                island: "Custom Travel",
                description: "For unique locations or special requirements, let's discuss your vision.",
                locations: "Private estates, remote beaches, helicopter-access locations"
              }
            ].map((area, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-800/40 p-8 rounded-lg hover:bg-slate-800/60 transition-colors"
              >
                <h3 className="text-xl font-bold mb-3 text-white border-b border-yellow-400/30 pb-2">{area.island}</h3>
                <p className="text-gray-400 mb-4">{area.description}</p>
                <div>
                  <span className="text-xs text-yellow-400 uppercase font-semibold">Popular Locations</span>
                  <p className="text-gray-300 mt-1">{area.locations}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-400">
              Travel fees may apply for some locations. We'll discuss all details during your consultation.
            </p>
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
};

export default ServicesPage;