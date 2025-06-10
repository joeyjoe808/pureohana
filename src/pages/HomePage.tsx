import React from 'react';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import AboutSection from '../components/AboutSection';
import VideoShowcase from '../components/VideoShowcase';
import LatestTrailers from '../components/LatestTrailers';
import StatsSection from '../components/StatsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import BlogSection from '../components/BlogSection';
import ContactCTA from '../components/ContactCTA';

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <VideoShowcase />
      <LatestTrailers />
      <StatsSection />
      <TestimonialsSection />
      <BlogSection />
      <ContactCTA />
    </>
  );
};

export default HomePage;