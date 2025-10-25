/**
 * Home Page - Pure Ohana Treasures
 *
 * Luxury photography website homepage showcasing the art of
 * capturing pure moments and frozen emotions.
 *
 * Features:
 * - Hero section with elegant typography
 * - Featured galleries
 * - Services overview
 * - Contact CTA
 * - Optimized images with lazy loading
 */

import {
  HeroSection,
  Hero,
  Caption as Subtitle,
  Button,
  Section,
  Container,
  Grid,
  PhotoCard,
  FeatureSection,
  Display,
  BodyText as Body,
  Heading2,
} from '../design-system';
import { OptimizedImage } from '../components/OptimizedImage';
import { useScrollReveal } from '../design-system/hooks/useScrollReveal';
import { usePortfolioImages } from '../hooks/useSupabaseData';
import { GallerySkeleton } from '../components/SkeletonLoader';

/**
 * Home Page Component
 */
export default function Home() {
  const heroRef = useScrollReveal();
  const featuredRef = useScrollReveal({ delay: 0.2 });
  const servicesRef = useScrollReveal({ delay: 0.3 });

  // Fetch featured portfolio images
  const { data: featuredImages, isLoading } = usePortfolioImages('featured');

  return (
    <>
      {/* Hero Section */}
      <HeroSection
        backgroundImage="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80"
        overlay
        className="min-h-screen flex items-center justify-center"
      >
        <div ref={heroRef} className="text-center text-white max-w-4xl px-4">
          <Hero className="mb-6">Pure Ohana Treasures</Hero>
          <Subtitle className="mb-8 text-cream-100">
            Capturing the purest moments and frozen emotions that become
            cherished memories forever
          </Subtitle>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button variant="luxury" size="lg" href="/portfolio">
              View Portfolio
            </Button>
            <Button variant="outline" size="lg" href="/contact">
              Book a Session
            </Button>
          </div>
        </div>
      </HeroSection>

      {/* Featured Galleries Section */}
      <Section spacing="2xl" className="bg-cream-50">
        <Container>
          <div ref={featuredRef} className="text-center mb-16">
            <Display className="mb-4">Featured Work</Display>
            <Body size="lg" className="text-charcoal-600 max-w-2xl mx-auto">
              Explore our collection of carefully curated moments, each telling
              a unique story of love, joy, and connection
            </Body>
          </div>

          {isLoading ? (
            <GallerySkeleton itemCount={6} />
          ) : (
            <Grid cols={{ sm: 1, md: 2, lg: 3 }} gap="lg">
              {featuredImages?.map((image, index) => (
                <PhotoCard
                  key={image.id}
                  image={image.url}
                  title={image.title}
                  description={image.description}
                  onClick={() => (window.location.href = `/portfolio/${image.gallery_id}`)}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                />
              ))}
            </Grid>
          )}

          <div className="text-center mt-12">
            <Button variant="minimal" size="lg" href="/portfolio">
              View Full Portfolio →
            </Button>
          </div>
        </Container>
      </Section>

      {/* Services Section */}
      <Section spacing="2xl">
        <Container>
          <div ref={servicesRef} className="text-center mb-16">
            <Display className="mb-4">Our Services</Display>
            <Body size="lg" className="text-charcoal-600 max-w-2xl mx-auto">
              Luxury photography services tailored to your unique story
            </Body>
          </div>

          <Grid cols={{ sm: 1, md: 3 }} gap="xl">
            <ServiceCard
              title="Weddings"
              description="Capturing the magic of your special day with elegance and artistry"
              icon="💍"
            />
            <ServiceCard
              title="Portraits"
              description="Timeless portraits that celebrate the beauty of who you are"
              icon="📸"
            />
            <ServiceCard
              title="Events"
              description="Documenting your cherished moments with sophistication"
              icon="🎉"
            />
          </Grid>

          <div className="text-center mt-12">
            <Button variant="primary" size="lg" href="/services">
              Explore Services
            </Button>
          </div>
        </Container>
      </Section>

      {/* About Section */}
      <FeatureSection
        image="https://images.unsplash.com/photo-1554080353-a576cf803bda?w=800&q=80"
        imagePosition="right"
        className="bg-cream-50"
      >
        <Heading2 className="mb-6">The Art of Capturing Emotion</Heading2>
        <Body size="lg" className="mb-6 text-charcoal-700">
          At Pure Ohana Treasures, we believe that photography is more than just
          images—it's about preserving the emotions, connections, and stories
          that make each moment unique.
        </Body>
        <Body className="mb-8 text-charcoal-600">
          With meticulous attention to detail and a passion for authenticity, we
          create timeless photographs that you'll treasure for generations to come.
        </Body>
        <Button variant="minimal" size="md" href="/about">
          Learn More About Us →
        </Button>
      </FeatureSection>

      {/* Contact CTA Section */}
      <Section spacing="2xl" className="bg-gradient-to-br from-sunset-500 to-passion-600 text-white">
        <Container className="text-center">
          <Display className="mb-6 text-white">Ready to Create Magic?</Display>
          <Body size="lg" className="mb-8 text-white/90 max-w-2xl mx-auto">
            Let's discuss how we can capture your unique story with artistry and elegance
          </Body>
          <Button variant="luxury" size="lg" href="/contact">
            Get in Touch
          </Button>
        </Container>
      </Section>
    </>
  );
}

/**
 * Service Card Component
 */
interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
}

function ServiceCard({ title, description, icon }: ServiceCardProps) {
  return (
    <div className="text-center p-8 rounded-lg hover:bg-cream-50 transition-colors duration-300">
      <div className="text-6xl mb-4">{icon}</div>
      <Heading2 className="mb-4 font-serif">{title}</Heading2>
      <Body className="text-charcoal-600">{description}</Body>
    </div>
  );
}
