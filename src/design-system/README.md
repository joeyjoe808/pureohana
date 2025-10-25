# Pure Ohana Design System

> A luxury design system for photography websites that embodies elegance, emotion, and attention to detail.

## Philosophy

"Fonts need the elegance of a person who carefully pays attention to details to capture the purest moments and frozen emotions that people can have as a memory forever."

This design system was created specifically for Pure Ohana Photography to reflect the beauty, emotion, and attention to detail that goes into every photograph.

## Features

- **Elegant Typography**: Playfair Display and Inter fonts for perfect hierarchy
- **Sophisticated Colors**: Warm neutrals, Hawaiian-inspired accents, and emotional tones
- **Luxury Components**: Buttons, cards, inputs with refined interactions
- **Advanced Animations**: Scroll reveals, parallax effects, and smooth transitions
- **Responsive Layouts**: Grid systems, containers, and sections for all screen sizes
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

## Installation

The design system is already integrated into the project. To use components:

```tsx
import {
  Button,
  Card,
  Typography,
  Section,
  Grid,
  useFadeIn,
  useScrollReveal
} from '@/design-system';
```

## Typography

### Display Fonts
- **Hero**: Large display text for main headings (3-7rem)
- **Display**: Secondary large display (2.5-5rem)
- **Heading 1-6**: Hierarchical headings with responsive scaling

### Body Text
- **Body XL**: Extra large body text (1.25rem)
- **Body LG**: Large body text (1.125rem)
- **Body**: Standard body text (1rem)
- **Body SM**: Small body text (0.875rem)
- **Caption**: Small caption text (0.75rem)

### Usage

```tsx
import { Hero, Heading1, BodyText, Caption } from '@/design-system';

<Hero gradient>Pure Ohana</Hero>
<Heading1>Capturing Moments</Heading1>
<BodyText>Professional photography services...</BodyText>
<Caption>Since 2024</Caption>
```

## Color Palette

### Neutrals
- **Cream**: Warm neutrals (50-900)
- **Charcoal**: Sophisticated grays and blacks (50-950)

### Accents
- **Gold**: Luxury accent color
- **Sunset**: Hawaiian sunset orange/coral
- **Ocean**: Hawaiian ocean blues

### Emotion Colors
- **Passion**: Warm coral (#FF6B7A)
- **Serenity**: Soft blue (#95C7E1)
- **Joy**: Warm yellow (#FFD93D)
- **Elegance**: Lavender (#DCC9E2)

## Components

### Buttons

```tsx
import { Button, IconButton, ButtonGroup } from '@/design-system';

// Variants
<Button variant="primary">Primary</Button>
<Button variant="luxury">Luxury</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>

// With icons
<Button icon={<Icon />} iconPosition="right">
  Next
</Button>

// Loading state
<Button loading>Processing...</Button>

// Button groups
<ButtonGroup>
  <Button variant="outline">Left</Button>
  <Button variant="outline">Center</Button>
  <Button variant="outline">Right</Button>
</ButtonGroup>
```

### Cards

```tsx
import { Card, PhotoCard, ServiceCard, TestimonialCard } from '@/design-system';

// Basic card
<Card variant="luxury" hoverable>
  <h3>Card Title</h3>
  <p>Card content...</p>
</Card>

// Photo card for portfolio
<PhotoCard
  image="photo.jpg"
  alt="Wedding photo"
  title="Beach Wedding"
  description="A beautiful ceremony..."
  category="Wedding"
  aspectRatio="3/2"
/>

// Service card
<ServiceCard
  icon={<Icon />}
  title="Wedding Photography"
  description="Full-day coverage..."
  features={['8 hours', '500+ photos']}
  price="$2,500"
  cta={{ label: 'Book Now', onClick: handleBook }}
/>

// Testimonial card
<TestimonialCard
  quote="Amazing work!"
  author="Sarah Smith"
  role="Bride"
  rating={5}
/>
```

### Inputs

```tsx
import { Input, Textarea, Select } from '@/design-system';

// Text input
<Input
  variant="luxury"
  label="Your Name"
  placeholder="John Doe"
  helperText="We'll never share your name"
  fullWidth
/>

// Textarea
<Textarea
  label="Message"
  rows={5}
  placeholder="Tell us your story..."
  fullWidth
/>

// Select dropdown
<Select
  label="Service"
  options={[
    { value: 'wedding', label: 'Wedding' },
    { value: 'portrait', label: 'Portrait' },
  ]}
  fullWidth
/>

// Error states
<Input
  error
  errorMessage="This field is required"
/>
```

## Layouts

### Container

```tsx
import { Container, NarrowContainer, WideContainer } from '@/design-system';

// Standard container (max-width: 1280px)
<Container>
  <h1>Content</h1>
</Container>

// Narrow container for articles
<NarrowContainer>
  <article>...</article>
</NarrowContainer>

// Wide container for galleries
<WideContainer>
  <PhotoGrid>...</PhotoGrid>
</WideContainer>
```

### Grid

```tsx
import { Grid, PhotoGrid, AutoGrid, BentoGrid } from '@/design-system';

// Responsive grid
<Grid cols={{ sm: 1, md: 2, lg: 3 }} gap="lg">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</Grid>

// Photo grid with aspect ratios
<PhotoGrid
  layout="grid"
  cols={{ sm: 1, md: 2, lg: 3 }}
  aspectRatio="3/2"
  gap="md"
>
  <PhotoCard />
  <PhotoCard />
</PhotoGrid>

// Auto-fit grid
<AutoGrid minItemWidth="250px" gap="md">
  <Card />
  <Card />
</AutoGrid>

// Bento grid (modern asymmetric)
<BentoGrid>
  <Card />
  <Card />
  <Card />
</BentoGrid>
```

### Sections

```tsx
import {
  Section,
  HeroSection,
  FeatureSection,
  SplitSection,
  CTASection,
  StatsSection
} from '@/design-system';

// Hero section
<HeroSection
  backgroundImage="hero.jpg"
  overlay
  overlayOpacity={0.5}
>
  <Hero>Welcome</Hero>
</HeroSection>

// Feature section with header
<FeatureSection
  overline="Our Services"
  heading="What We Offer"
  description="Professional photography..."
  centered
>
  <Grid cols={3}>
    <ServiceCard />
  </Grid>
</FeatureSection>

// Split section (two columns)
<SplitSection
  left={<Image />}
  right={<Content />}
  split="1:2"
  reverse
/>

// CTA section
<CTASection
  heading="Ready to Book?"
  description="Let's create magic together"
  primaryAction={{ label: 'Book Now', onClick: handleBook }}
  secondaryAction={{ label: 'Learn More', onClick: handleLearn }}
/>

// Stats section
<StatsSection
  stats={[
    { value: '500+', label: 'Weddings', description: 'Captured' },
    { value: '15+', label: 'Years', description: 'Experience' },
  ]}
/>
```

## Animation Hooks

### useScrollReveal

Trigger animations when elements enter viewport:

```tsx
import { useScrollReveal } from '@/design-system';

const MyComponent = () => {
  const { ref, isVisible } = useScrollReveal({
    threshold: 0.1,
    triggerOnce: true,
    delay: 200
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
    >
      Content reveals on scroll
    </motion.div>
  );
};
```

### useFadeIn

Pre-configured fade-in animations:

```tsx
import { useFadeIn, useStaggeredFadeIn } from '@/design-system';

const MyComponent = () => {
  const fadeInUp = useFadeIn({ direction: 'up', duration: 0.6 });
  const staggered = useStaggeredFadeIn(0.1);

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible">
      Fades in from bottom
    </motion.div>
  );
};
```

### useParallax

Create parallax scrolling effects:

```tsx
import { useParallax, useMouseParallax } from '@/design-system';

const MyComponent = () => {
  const { ref, transform } = useParallax({ speed: 0.5 });

  return (
    <div ref={ref} style={{ transform: `translateY(${transform.y}px)` }}>
      Parallax element
    </div>
  );
};

// Mouse parallax
const MouseComponent = () => {
  const { ref, transform } = useMouseParallax(20);

  return (
    <div
      ref={ref}
      style={{ transform: `translate(${transform.x}px, ${transform.y}px)` }}
    >
      Follows mouse
    </div>
  );
};
```

## Best Practices

### Typography Hierarchy

1. Use **Hero** or **Display** for main page headings
2. Use **Heading1-3** for section headings
3. Use **BodyText** for paragraphs
4. Use **Caption** for small labels and metadata
5. Use **Overline** for category labels

### Color Usage

1. **Primary text**: charcoal-950
2. **Secondary text**: charcoal-600
3. **Disabled text**: charcoal-400
4. **Backgrounds**: cream-50, white
5. **Accents**: gold-500, sunset-500
6. **CTAs**: Use luxury or primary buttons

### Spacing

1. Use **Section** component for consistent vertical rhythm
2. Use spacing utilities: `gap-md`, `space-y-6`
3. Maintain generous whitespace around content
4. Use `section` spacing variants: sm, md, lg, xl

### Accessibility

1. Always include `alt` text for images
2. Use semantic HTML elements
3. Ensure color contrast ratios meet WCAG AA
4. Include `aria-label` for icon buttons
5. Test keyboard navigation

## Responsive Design

All components are mobile-first and responsive:

```tsx
// Responsive grid
<Grid cols={{ sm: 1, md: 2, lg: 3, xl: 4 }} />

// Responsive typography
<Hero>Automatically scales from 3rem to 7rem</Hero>

// Responsive spacing
<Section spacing="md">Auto adjusts: py-16 md:py-24</Section>
```

## Dark Mode Support

The design system includes dark mode with the **dark** background:

```tsx
<Section background="dark">
  <Typography className="text-cream-50">
    Content in dark mode
  </Typography>
</Section>
```

## Examples

See `DesignSystemShowcase.tsx` for comprehensive examples of all components in use.

## Performance

- All components use Framer Motion for optimized animations
- Images should use lazy loading
- Use `triggerOnce` on scroll animations to prevent re-triggering
- Parallax effects use `requestAnimationFrame` for smooth 60fps

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## License

© 2024 Pure Ohana Photography. All rights reserved.
