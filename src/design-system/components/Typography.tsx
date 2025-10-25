import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

type TypographyVariant =
  | 'hero'
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body-xl'
  | 'body-lg'
  | 'body'
  | 'body-sm'
  | 'caption'
  | 'overline';

type FontFamily = 'display' | 'serif' | 'sans' | 'mono';

interface TypographyProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  variant?: TypographyVariant;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'label';
  font?: FontFamily;
  className?: string;
  children: React.ReactNode;
  gradient?: boolean;
  animate?: boolean;
}

const variantStyles: Record<TypographyVariant, string> = {
  hero: 'text-hero font-display font-light',
  display: 'text-display font-display font-light',
  h1: 'text-heading-1 font-display font-light',
  h2: 'text-heading-2 font-serif font-normal',
  h3: 'text-heading-3 font-serif font-normal',
  h4: 'text-2xl font-serif font-medium',
  h5: 'text-xl font-sans font-semibold',
  h6: 'text-lg font-sans font-semibold',
  'body-xl': 'text-body-xl font-sans font-normal',
  'body-lg': 'text-body-lg font-sans font-normal',
  'body': 'text-body font-sans font-normal',
  'body-sm': 'text-body-sm font-sans font-normal',
  'caption': 'text-caption font-sans font-medium uppercase tracking-luxury',
  'overline': 'text-xs font-sans font-semibold uppercase tracking-luxury',
};

const defaultTags: Record<TypographyVariant, TypographyProps['as']> = {
  hero: 'h1',
  display: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  'body-xl': 'p',
  'body-lg': 'p',
  'body': 'p',
  'body-sm': 'p',
  'caption': 'span',
  'overline': 'span',
};

const fadeInAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
};

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  as,
  font,
  className = '',
  children,
  gradient = false,
  animate = false,
  ...motionProps
}) => {
  const Component = motion[as || defaultTags[variant]];

  const fontClass = font ? `font-${font}` : '';
  const gradientClass = gradient ? 'bg-gradient-to-r from-gold-400 via-sunset-400 to-gold-400 bg-clip-text text-transparent' : '';

  const combinedClassName = `${variantStyles[variant]} ${fontClass} ${gradientClass} ${className}`.trim();

  const animationProps = animate ? fadeInAnimation : {};

  return (
    <Component
      className={combinedClassName}
      {...animationProps}
      {...motionProps}
    >
      {children}
    </Component>
  );
};

// Convenience components for common use cases
export const Hero: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="hero" {...props} />
);

export const Display: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="display" {...props} />
);

export const Heading1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h1" {...props} />
);

export const Heading2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h2" {...props} />
);

export const Heading3: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h3" {...props} />
);

export const BodyText: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="body" {...props} />
);

export const Caption: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="caption" {...props} />
);

export const Overline: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="overline" {...props} />
);

// Example usage component
export const TypographyShowcase: React.FC = () => {
  return (
    <div className="space-y-8 p-8">
      <div className="space-y-4">
        <Overline className="text-gold-500">Design System</Overline>
        <Hero gradient>Pure Ohana</Hero>
        <BodyText className="text-charcoal-600 max-w-2xl">
          Capturing the purest moments and frozen emotions that people can have as a memory forever.
        </BodyText>
      </div>

      <div className="space-y-6">
        <Display>Elegant Typography</Display>
        <Heading1>Heading Level 1</Heading1>
        <Heading2>Heading Level 2</Heading2>
        <Heading3>Heading Level 3</Heading3>
        <Typography variant="h4">Heading Level 4</Typography>
        <Typography variant="h5">Heading Level 5</Typography>
        <Typography variant="h6">Heading Level 6</Typography>
      </div>

      <div className="space-y-4">
        <Typography variant="body-xl">
          Extra large body text for introductions and emphasis.
        </Typography>
        <Typography variant="body-lg">
          Large body text for comfortable reading and important content.
        </Typography>
        <BodyText>
          Standard body text for general content. Optimized for readability with perfect line height and letter spacing.
        </BodyText>
        <Typography variant="body-sm">
          Small body text for captions and secondary information.
        </Typography>
        <Caption>Caption Text</Caption>
      </div>
    </div>
  );
};

export default Typography;
