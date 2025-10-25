import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Import all design system components
import {
  Hero,
  Display,
  Heading1,
  Heading2,
  Heading3,
  BodyText,
  Caption,
  Overline,
  Button,
  ButtonGroup,
  Card,
  PhotoCard,
  ServiceCard,
  TestimonialCard,
  Input,
  Textarea,
  Select,
  Container,
  Grid,
  PhotoGrid,
  AutoGrid,
  BentoGrid,
  Section,
  HeroSection,
  FeatureSection,
  SplitSection,
  CTASection,
  StatsSection,
  useScrollReveal,
  useFadeIn,
  useParallax,
  useMouseParallax,
} from './index';

/**
 * Complete Design System Showcase
 * Demonstrates all components and patterns in context
 */
const DesignSystemShowcase: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: '',
  });

  // Animation hooks
  const fadeInUp = useFadeIn({ direction: 'up' });
  const { ref: parallaxRef, transform: parallaxTransform } = useParallax({ speed: 0.3 });
  const { ref: mouseParallaxRef, transform: mouseTransform } = useMouseParallax(15);

  return (
    <div className="min-h-screen bg-cream-50">
      {/* ============================================
          HERO SECTION
          ============================================ */}
      <HeroSection
        backgroundImage="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920"
        overlay
        overlayOpacity={0.4}
        minHeight="100vh"
      >
        <Container className="text-center text-white">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="space-y-6"
          >
            <Overline className="text-gold-300">Pure Ohana Photography</Overline>
            <Hero className="text-white">
              Capturing Life's
              <br />
              Purest Moments
            </Hero>
            <BodyText className="text-cream-100 max-w-2xl mx-auto text-body-lg">
              Professional photography that freezes emotions and creates memories
              that last forever. Experience the art of storytelling through the lens.
            </BodyText>
            <div className="flex gap-4 justify-center pt-6">
              <Button variant="luxury" size="lg">
                Book a Session
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-charcoal-950">
                View Portfolio
              </Button>
            </div>
          </motion.div>
        </Container>
      </HeroSection>

      {/* ============================================
          TYPOGRAPHY SECTION
          ============================================ */}
      <Section spacing="lg" background="white">
        <Container>
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <Overline className="text-gold-600">Design System</Overline>
              <Display>Typography Elegance</Display>
              <BodyText className="text-charcoal-600 max-w-2xl mx-auto">
                Carefully crafted typography system using Playfair Display and Inter
                for perfect harmony between elegance and readability.
              </BodyText>
            </div>

            <Grid cols={{ sm: 1, md: 2 }} gap="xl">
              <div className="space-y-6">
                <div>
                  <Caption className="text-charcoal-500 mb-2">Display Fonts</Caption>
                  <Hero className="text-charcoal-950">Hero Text</Hero>
                </div>
                <div>
                  <Caption className="text-charcoal-500 mb-2">Headings</Caption>
                  <Heading1>Heading One</Heading1>
                  <Heading2>Heading Two</Heading2>
                  <Heading3>Heading Three</Heading3>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Caption className="text-charcoal-500 mb-2">Body Text</Caption>
                  <BodyText className="mb-4">
                    Our carefully chosen fonts create a hierarchy that guides the eye
                    naturally through the content. Every detail matters in creating
                    the perfect reading experience.
                  </BodyText>
                  <BodyText className="text-body-sm text-charcoal-600">
                    Small body text for captions and secondary information maintains
                    the same elegant feel while staying perfectly readable.
                  </BodyText>
                </div>
              </div>
            </Grid>
          </div>
        </Container>
      </Section>

      {/* ============================================
          BUTTON COMPONENTS
          ============================================ */}
      <Section spacing="lg" background="cream">
        <Container>
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <Overline className="text-gold-600">Interactive Elements</Overline>
              <Heading1>Buttons & Actions</Heading1>
            </div>

            <Grid cols={{ sm: 1, md: 2, lg: 4 }} gap="lg">
              <div className="space-y-4">
                <Caption>Primary</Caption>
                <Button variant="primary" fullWidth>Primary Action</Button>
              </div>
              <div className="space-y-4">
                <Caption>Luxury</Caption>
                <Button variant="luxury" fullWidth>Luxury Action</Button>
              </div>
              <div className="space-y-4">
                <Caption>Outline</Caption>
                <Button variant="outline" fullWidth>Outline Action</Button>
              </div>
              <div className="space-y-4">
                <Caption>Ghost</Caption>
                <Button variant="ghost" fullWidth>Ghost Action</Button>
              </div>
            </Grid>

            <div className="space-y-4">
              <Caption>Button Sizes</Caption>
              <div className="flex flex-wrap gap-4 items-center">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </div>
            </div>

            <div className="space-y-4">
              <Caption>Button Groups</Caption>
              <ButtonGroup>
                <Button variant="outline">Wedding</Button>
                <Button variant="outline">Portrait</Button>
                <Button variant="outline">Event</Button>
                <Button variant="outline">Commercial</Button>
              </ButtonGroup>
            </div>
          </div>
        </Container>
      </Section>

      {/* ============================================
          PHOTO GRID SECTION
          ============================================ */}
      <Section spacing="xl" background="white">
        <Container size="2xl">
          <div className="space-y-12">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <Overline className="text-gold-600">Portfolio</Overline>
              <Heading1>Recent Work</Heading1>
              <BodyText className="text-charcoal-600">
                A curated selection of our most cherished moments, captured with
                attention to every detail and emotion.
              </BodyText>
            </div>

            <PhotoGrid
              layout="grid"
              cols={{ sm: 1, md: 2, lg: 3 }}
              gap="md"
              aspectRatio="3/2"
            >
              <PhotoCard
                image="https://images.unsplash.com/photo-1519741497674-611481863552?w=800"
                alt="Wedding"
                title="Intimate Beach Wedding"
                description="A beautiful ceremony at sunset on the shores of Maui"
                category="Wedding"
              />
              <PhotoCard
                image="https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800"
                alt="Portrait"
                title="Golden Hour Portrait"
                description="Capturing authentic emotions in natural light"
                category="Portrait"
              />
              <PhotoCard
                image="https://images.unsplash.com/photo-1523438097201-512ae7d59c44?w=800"
                alt="Landscape"
                title="Hawaiian Paradise"
                description="The breathtaking beauty of island landscapes"
                category="Landscape"
              />
              <PhotoCard
                image="https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800"
                alt="Family"
                title="Family Moments"
                description="Precious memories with loved ones"
                category="Family"
              />
              <PhotoCard
                image="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800"
                alt="Engagement"
                title="Love Story"
                description="Celebrating the journey of love"
                category="Engagement"
              />
              <PhotoCard
                image="https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800"
                alt="Nature"
                title="Island Beauty"
                description="Nature's perfection in every frame"
                category="Nature"
              />
            </PhotoGrid>
          </div>
        </Container>
      </Section>

      {/* ============================================
          SERVICES SECTION
          ============================================ */}
      <FeatureSection
        spacing="xl"
        background="gradient"
        overline="Our Services"
        heading="Photography Packages"
        description="Tailored experiences designed to capture your unique story"
        centered
      >
        <Grid cols={{ sm: 1, md: 2, lg: 3 }} gap="lg">
          <ServiceCard
            icon={<span className="text-3xl">💍</span>}
            title="Wedding Photography"
            description="Full-day coverage of your special day, from preparation to the last dance."
            features={[
              '8 hours of coverage',
              '500+ edited photos',
              'Engagement session included',
              'Online gallery & prints',
            ]}
            price="$2,500"
            cta={{ label: 'Learn More', onClick: () => console.log('Wedding clicked') }}
            hoverable
          />
          <ServiceCard
            icon={<span className="text-3xl">📸</span>}
            title="Portrait Session"
            description="Personal and family portraits that capture your authentic self."
            features={[
              '2 hours session',
              '50+ edited photos',
              'Multiple locations',
              'Wardrobe changes',
            ]}
            price="$500"
            cta={{ label: 'Learn More', onClick: () => console.log('Portrait clicked') }}
            hoverable
          />
          <ServiceCard
            icon={<span className="text-3xl">🎉</span>}
            title="Event Coverage"
            description="Professional documentation of your corporate or social events."
            features={[
              'Flexible hours',
              'Fast turnaround',
              'Social media ready',
              'Candid & posed shots',
            ]}
            price="Custom"
            cta={{ label: 'Learn More', onClick: () => console.log('Event clicked') }}
            hoverable
          />
        </Grid>
      </FeatureSection>

      {/* ============================================
          TESTIMONIALS SECTION
          ============================================ */}
      <Section spacing="xl" background="white">
        <Container>
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <Overline className="text-gold-600">Testimonials</Overline>
              <Heading1>What Clients Say</Heading1>
            </div>

            <Grid cols={{ sm: 1, md: 2, lg: 3 }} gap="lg">
              <TestimonialCard
                quote="Pure Ohana captured our wedding day with such artistry and emotion. Every photo tells our story perfectly."
                author="Sarah & Michael"
                role="Wedding Clients"
                rating={5}
                variant="luxury"
              />
              <TestimonialCard
                quote="The attention to detail and ability to capture genuine moments is unmatched. We treasure these photos forever."
                author="Emily Chen"
                role="Portrait Client"
                rating={5}
                variant="luxury"
              />
              <TestimonialCard
                quote="Professional, creative, and so easy to work with. The photos exceeded all our expectations!"
                author="David & Lisa"
                role="Engagement Session"
                rating={5}
                variant="luxury"
              />
            </Grid>
          </div>
        </Container>
      </Section>

      {/* ============================================
          FORM SECTION
          ============================================ */}
      <SplitSection
        spacing="xl"
        background="cream"
        split="1:1"
        left={
          <div className="space-y-6">
            <Overline className="text-gold-600">Contact Us</Overline>
            <Heading1>Let's Create Together</Heading1>
            <BodyText className="text-charcoal-600 text-body-lg">
              Ready to capture your special moments? Fill out the form and we'll get
              back to you within 24 hours to discuss your photography needs.
            </BodyText>
            <div className="space-y-4 pt-6">
              <div className="flex items-center gap-3 text-charcoal-700">
                <span className="text-gold-500">✉</span>
                <span>info@pureohana.com</span>
              </div>
              <div className="flex items-center gap-3 text-charcoal-700">
                <span className="text-gold-500">📞</span>
                <span>(808) 555-0123</span>
              </div>
              <div className="flex items-center gap-3 text-charcoal-700">
                <span className="text-gold-500">📍</span>
                <span>Honolulu, Hawaii</span>
              </div>
            </div>
          </div>
        }
        right={
          <Card variant="luxury" padding="lg">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <Input
                variant="luxury"
                label="Your Name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
              />
              <Input
                variant="luxury"
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                fullWidth
              />
              <Select
                variant="luxury"
                label="Service Interested In"
                options={[
                  { value: '', label: 'Select a service' },
                  { value: 'wedding', label: 'Wedding Photography' },
                  { value: 'portrait', label: 'Portrait Session' },
                  { value: 'event', label: 'Event Coverage' },
                  { value: 'other', label: 'Other' },
                ]}
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                fullWidth
              />
              <Textarea
                variant="luxury"
                label="Tell Us About Your Event"
                placeholder="Share your vision and we'll bring it to life..."
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                fullWidth
              />
              <Button variant="luxury" size="lg" fullWidth type="submit">
                Send Message
              </Button>
            </form>
          </Card>
        }
      />

      {/* ============================================
          STATS SECTION
          ============================================ */}
      <StatsSection
        spacing="lg"
        stats={[
          { value: '500+', label: 'Weddings Captured', description: 'Beautiful ceremonies' },
          { value: '1,000+', label: 'Happy Clients', description: 'Satisfied customers' },
          { value: '15+', label: 'Years Experience', description: 'Professional expertise' },
          { value: '50+', label: 'Awards Won', description: 'Industry recognition' },
        ]}
      />

      {/* ============================================
          CTA SECTION
          ============================================ */}
      <CTASection
        spacing="xl"
        background="gradient"
        heading="Ready to Capture Your Moments?"
        description="Let's create beautiful memories together that you'll treasure for a lifetime."
        primaryAction={{
          label: 'Book a Session',
          onClick: () => console.log('Book clicked'),
        }}
        secondaryAction={{
          label: 'View Portfolio',
          onClick: () => console.log('Portfolio clicked'),
        }}
      />

      {/* ============================================
          CARD VARIANTS SECTION
          ============================================ */}
      <Section spacing="xl" background="white">
        <Container>
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <Overline className="text-gold-600">Components</Overline>
              <Heading1>Card Variants</Heading1>
            </div>

            <Grid cols={{ sm: 1, md: 2, lg: 4 }} gap="lg">
              <Card variant="elevated" hoverable>
                <Caption className="mb-2">Elevated</Caption>
                <BodyText className="text-charcoal-600">
                  Soft shadows create depth
                </BodyText>
              </Card>
              <Card variant="outlined" hoverable>
                <Caption className="mb-2">Outlined</Caption>
                <BodyText className="text-charcoal-600">
                  Clean minimal borders
                </BodyText>
              </Card>
              <Card variant="luxury" hoverable>
                <Caption className="mb-2">Luxury</Caption>
                <BodyText className="text-charcoal-600">
                  Premium gradient effect
                </BodyText>
              </Card>
              <Card variant="glass" hoverable>
                <Caption className="mb-2">Glass</Caption>
                <BodyText className="text-charcoal-600">
                  Frosted glass aesthetic
                </BodyText>
              </Card>
            </Grid>
          </div>
        </Container>
      </Section>

      {/* ============================================
          FOOTER
          ============================================ */}
      <Section spacing="lg" background="dark" className="border-t border-charcoal-800">
        <Container>
          <div className="text-center space-y-6">
            <Display className="text-cream-50">Pure Ohana</Display>
            <BodyText className="text-cream-300">
              Capturing life's purest moments with elegance and emotion
            </BodyText>
            <div className="flex justify-center gap-6">
              <a href="#" className="text-cream-400 hover:text-gold-400 transition-colors">
                Instagram
              </a>
              <a href="#" className="text-cream-400 hover:text-gold-400 transition-colors">
                Facebook
              </a>
              <a href="#" className="text-cream-400 hover:text-gold-400 transition-colors">
                Pinterest
              </a>
            </div>
            <Caption className="text-cream-500">
              © 2024 Pure Ohana Photography. All rights reserved.
            </Caption>
          </div>
        </Container>
      </Section>
    </div>
  );
};

export default DesignSystemShowcase;
