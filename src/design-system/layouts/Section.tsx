import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Container } from './Container';

type SectionSpacing = 'none' | 'sm' | 'md' | 'lg' | 'xl';
type SectionBackground = 'white' | 'cream' | 'dark' | 'gradient' | 'transparent';

interface SectionProps extends Omit<HTMLMotionProps<'section'>, 'ref'> {
  spacing?: SectionSpacing;
  background?: SectionBackground;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  noPadding?: boolean;
  noContainer?: boolean;
  className?: string;
  children: React.ReactNode;
  id?: string;
}

const spacingStyles: Record<SectionSpacing, string> = {
  none: '',
  sm: 'py-12 md:py-16',
  md: 'py-16 md:py-24',
  lg: 'py-24 md:py-32',
  xl: 'py-32 md:py-40',
};

const backgroundStyles: Record<SectionBackground, string> = {
  white: 'bg-white',
  cream: 'bg-cream-50',
  dark: 'bg-charcoal-950 text-cream-50',
  gradient: 'bg-gradient-to-br from-cream-50 via-white to-gold-50',
  transparent: 'bg-transparent',
};

/**
 * Section component - Full-width section with consistent spacing
 */
export const Section: React.FC<SectionProps> = ({
  spacing = 'md',
  background = 'transparent',
  containerSize = 'xl',
  noPadding = false,
  noContainer = false,
  className = '',
  children,
  ...motionProps
}) => {
  const combinedClassName = `
    w-full
    ${!noPadding ? spacingStyles[spacing] : ''}
    ${backgroundStyles[background]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const content = noContainer ? (
    children
  ) : (
    <Container size={containerSize}>{children}</Container>
  );

  return (
    <motion.section className={combinedClassName} {...motionProps}>
      {content}
    </motion.section>
  );
};

/**
 * Hero Section - Full viewport height hero
 */
interface HeroSectionProps extends Omit<SectionProps, 'spacing'> {
  minHeight?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  backgroundImage?: string;
  imagePosition?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  minHeight = '100vh',
  overlay = false,
  overlayOpacity = 0.5,
  backgroundImage,
  imagePosition = 'center',
  className = '',
  children,
  ...sectionProps
}) => {
  return (
    <Section
      spacing="none"
      noPadding
      className={`relative flex items-center justify-center ${className}`}
      style={{ minHeight }}
      {...sectionProps}
    >
      {/* Background Image */}
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})`, backgroundPosition: imagePosition }}
        />
      )}

      {/* Overlay */}
      {overlay && (
        <div
          className="absolute inset-0 bg-charcoal-950"
          style={{ opacity: overlayOpacity }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </Section>
  );
};

/**
 * Split Section - Two-column layout
 */
interface SplitSectionProps extends Omit<SectionProps, 'children'> {
  left: React.ReactNode;
  right: React.ReactNode;
  reverse?: boolean;
  split?: '1:1' | '1:2' | '2:1' | '1:3' | '3:1';
}

export const SplitSection: React.FC<SplitSectionProps> = ({
  left,
  right,
  reverse = false,
  split = '1:1',
  ...sectionProps
}) => {
  const getSplitClasses = () => {
    switch (split) {
      case '1:1':
        return 'lg:grid-cols-2';
      case '1:2':
        return 'lg:grid-cols-[1fr_2fr]';
      case '2:1':
        return 'lg:grid-cols-[2fr_1fr]';
      case '1:3':
        return 'lg:grid-cols-[1fr_3fr]';
      case '3:1':
        return 'lg:grid-cols-[3fr_1fr]';
    }
  };

  return (
    <Section {...sectionProps}>
      <div className={`grid grid-cols-1 ${getSplitClasses()} gap-12 lg:gap-16 items-center`}>
        <div className={reverse ? 'lg:order-2' : ''}>
          {left}
        </div>
        <div className={reverse ? 'lg:order-1' : ''}>
          {right}
        </div>
      </div>
    </Section>
  );
};

/**
 * Feature Section - With overline, heading, and description
 */
interface FeatureSectionProps extends SectionProps {
  overline?: string;
  heading: string;
  description?: string;
  centered?: boolean;
}

export const FeatureSection: React.FC<FeatureSectionProps> = ({
  overline,
  heading,
  description,
  centered = false,
  children,
  ...sectionProps
}) => {
  return (
    <Section {...sectionProps}>
      <div className={`space-y-16 ${centered ? 'text-center' : ''}`}>
        {/* Header */}
        <div className={`space-y-4 ${centered ? 'max-w-3xl mx-auto' : 'max-w-2xl'}`}>
          {overline && (
            <div className="text-xs font-semibold uppercase tracking-luxury text-gold-600">
              {overline}
            </div>
          )}
          <h2 className="text-heading-1 font-display font-light text-charcoal-950">
            {heading}
          </h2>
          {description && (
            <p className="text-body-lg text-charcoal-600">
              {description}
            </p>
          )}
        </div>

        {/* Content */}
        {children}
      </div>
    </Section>
  );
};

/**
 * CTA Section - Call to action section
 */
interface CTASectionProps extends Omit<SectionProps, 'children'> {
  heading: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export const CTASection: React.FC<CTASectionProps> = ({
  heading,
  description,
  primaryAction,
  secondaryAction,
  background = 'gradient',
  ...sectionProps
}) => {
  return (
    <Section background={background} {...sectionProps}>
      <div className="text-center space-y-8 max-w-3xl mx-auto">
        <h2 className="text-heading-1 font-display font-light text-charcoal-950">
          {heading}
        </h2>
        {description && (
          <p className="text-body-lg text-charcoal-600">
            {description}
          </p>
        )}
        {(primaryAction || secondaryAction) && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {primaryAction && (
              <button
                onClick={primaryAction.onClick}
                className="px-8 py-4 bg-charcoal-950 text-cream-50 rounded-luxury-md hover:bg-charcoal-900 transition-colors font-semibold"
              >
                {primaryAction.label}
              </button>
            )}
            {secondaryAction && (
              <button
                onClick={secondaryAction.onClick}
                className="px-8 py-4 border-2 border-charcoal-950 text-charcoal-950 rounded-luxury-md hover:bg-charcoal-950 hover:text-cream-50 transition-colors font-semibold"
              >
                {secondaryAction.label}
              </button>
            )}
          </div>
        )}
      </div>
    </Section>
  );
};

/**
 * Stats Section - Display statistics
 */
interface Stat {
  value: string;
  label: string;
  description?: string;
}

interface StatsSectionProps extends Omit<SectionProps, 'children'> {
  stats: Stat[];
}

export const StatsSection: React.FC<StatsSectionProps> = ({
  stats,
  background = 'dark',
  ...sectionProps
}) => {
  return (
    <Section background={background} {...sectionProps}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {stats.map((stat, index) => (
          <div key={index} className="text-center space-y-2">
            <div className="text-display font-display font-light text-gold-400">
              {stat.value}
            </div>
            <div className="text-lg font-serif font-medium">
              {stat.label}
            </div>
            {stat.description && (
              <div className="text-body-sm text-cream-300">
                {stat.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
};

// Showcase Component
export const SectionShowcase: React.FC = () => {
  return (
    <div className="space-y-0">
      <Section spacing="lg" background="white">
        <h2 className="text-heading-1 font-display">Standard Section</h2>
        <p className="text-body-lg text-charcoal-600 mt-4">
          This is a standard section with medium spacing.
        </p>
      </Section>

      <FeatureSection
        spacing="lg"
        background="cream"
        overline="Our Services"
        heading="Capturing Life's Precious Moments"
        description="Professional photography services that preserve memories forever"
        centered
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">Feature 1</div>
          <div className="text-center">Feature 2</div>
          <div className="text-center">Feature 3</div>
        </div>
      </FeatureSection>

      <StatsSection
        stats={[
          { value: '500+', label: 'Weddings Captured', description: 'Beautiful moments' },
          { value: '1000+', label: 'Happy Clients', description: 'Satisfied customers' },
          { value: '15+', label: 'Years Experience', description: 'Professional expertise' },
          { value: '50+', label: 'Awards Won', description: 'Industry recognition' },
        ]}
      />

      <CTASection
        heading="Ready to Capture Your Moments?"
        description="Let's create beautiful memories together"
        primaryAction={{ label: 'Book a Session', onClick: () => {} }}
        secondaryAction={{ label: 'View Portfolio', onClick: () => {} }}
      />
    </div>
  );
};

export default Section;
