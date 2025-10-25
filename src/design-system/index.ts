/**
 * Pure Ohana Design System
 *
 * A luxury design system for photography websites that embodies
 * elegance, emotion, and attention to detail.
 *
 * @version 1.0.0
 */

// Components
export {
  Typography,
  Hero,
  Display,
  Heading1,
  Heading2,
  Heading3,
  BodyText,
  Caption,
  Overline,
  TypographyShowcase,
} from './components/Typography';

export {
  Button,
  IconButton,
  ButtonGroup,
  ButtonShowcase,
} from './components/Button';

export {
  Card,
  PhotoCard,
  ServiceCard,
  TestimonialCard,
  CardShowcase,
} from './components/Card';

export {
  Input,
  Textarea,
  Select,
  InputShowcase,
} from './components/Input';

// Layouts
export {
  Container,
  NarrowContainer,
  WideContainer,
  FullContainer,
} from './layouts/Container';

export {
  Grid,
  MasonryGrid,
  PhotoGrid,
  AutoGrid,
  BentoGrid,
  GridShowcase,
} from './layouts/Grid';

export {
  Section,
  HeroSection,
  SplitSection,
  FeatureSection,
  CTASection,
  StatsSection,
  SectionShowcase,
} from './layouts/Section';

// Hooks
export {
  useScrollReveal,
  useStaggeredReveal,
} from './hooks/useScrollReveal';

export {
  useParallax,
  useMouseParallax,
  useDepthParallax,
} from './hooks/useParallax';

export {
  useFadeIn,
  useStaggeredFadeIn,
  useScaleFadeIn,
  useBlurFadeIn,
  useTextReveal,
  useCurtainReveal,
  useControlledFadeIn,
  useSequentialReveal,
} from './hooks/useFadeIn';

// Type exports
export type { default as TypographyProps } from './components/Typography';
export type { default as ButtonProps } from './components/Button';
export type { default as CardProps } from './components/Card';
export type { default as InputProps } from './components/Input';
