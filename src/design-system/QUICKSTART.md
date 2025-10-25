# Pure Ohana Design System - Quick Start Guide

Get started with the luxury design system in 5 minutes.

## 1. View the Showcase

See all components in action:

```tsx
import DesignSystemShowcase from '@/design-system/DesignSystemShowcase';

function App() {
  return <DesignSystemShowcase />;
}
```

## 2. Basic Page Structure

Create a beautiful page with minimal code:

```tsx
import {
  HeroSection,
  Section,
  Container,
  Hero,
  BodyText,
  Button,
  Grid,
  PhotoCard
} from '@/design-system';

function HomePage() {
  return (
    <>
      {/* Hero */}
      <HeroSection
        backgroundImage="/hero.jpg"
        overlay
        overlayOpacity={0.5}
      >
        <Container className="text-center text-white">
          <Hero>Pure Ohana</Hero>
          <BodyText className="text-cream-100 mt-6">
            Capturing life's purest moments
          </BodyText>
          <Button variant="luxury" size="lg" className="mt-8">
            Book a Session
          </Button>
        </Container>
      </HeroSection>

      {/* Portfolio */}
      <Section spacing="xl" background="white">
        <Container>
          <Grid cols={{ sm: 1, md: 2, lg: 3 }} gap="lg">
            <PhotoCard
              image="/photo1.jpg"
              alt="Wedding"
              title="Beach Wedding"
              category="Wedding"
            />
            <PhotoCard
              image="/photo2.jpg"
              alt="Portrait"
              title="Sunset Portrait"
              category="Portrait"
            />
            <PhotoCard
              image="/photo3.jpg"
              alt="Family"
              title="Family Session"
              category="Family"
            />
          </Grid>
        </Container>
      </Section>
    </>
  );
}
```

## 3. Add Animations

Bring your content to life:

```tsx
import { motion } from 'framer-motion';
import { useFadeIn, useScrollReveal } from '@/design-system';

function AnimatedSection() {
  const fadeInUp = useFadeIn({ direction: 'up' });
  const { ref, isVisible } = useScrollReveal();

  return (
    <motion.div
      ref={ref}
      variants={fadeInUp}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      <h2>This fades in on scroll</h2>
    </motion.div>
  );
}
```

## 4. Form Example

Create elegant contact forms:

```tsx
import { Card, Input, Textarea, Button } from '@/design-system';

function ContactForm() {
  return (
    <Card variant="luxury" padding="lg">
      <form className="space-y-6">
        <Input
          variant="luxury"
          label="Your Name"
          placeholder="John Doe"
          fullWidth
        />
        <Input
          variant="luxury"
          label="Email"
          type="email"
          placeholder="you@example.com"
          fullWidth
        />
        <Textarea
          variant="luxury"
          label="Message"
          rows={5}
          placeholder="Tell us about your event..."
          fullWidth
        />
        <Button variant="luxury" size="lg" fullWidth>
          Send Message
        </Button>
      </form>
    </Card>
  );
}
```

## 5. Common Patterns

### Service Cards Grid

```tsx
<Grid cols={{ sm: 1, md: 2, lg: 3 }} gap="lg">
  <ServiceCard
    icon={<span>📸</span>}
    title="Wedding Photography"
    description="Full-day coverage..."
    features={['8 hours', '500+ photos']}
    price="$2,500"
  />
</Grid>
```

### Split Content Section

```tsx
<SplitSection
  left={
    <img src="/about.jpg" className="rounded-luxury-lg" />
  }
  right={
    <>
      <Heading1>About Us</Heading1>
      <BodyText>We capture moments...</BodyText>
    </>
  }
  split="1:1"
/>
```

### Statistics Display

```tsx
<StatsSection
  stats={[
    { value: '500+', label: 'Weddings' },
    { value: '15+', label: 'Years' },
    { value: '50+', label: 'Awards' },
  ]}
/>
```

### Call-to-Action

```tsx
<CTASection
  heading="Ready to Book?"
  description="Let's create magic together"
  primaryAction={{
    label: 'Book Now',
    onClick: () => navigate('/contact')
  }}
/>
```

## Color Quick Reference

```tsx
// Text colors
<p className="text-charcoal-950">Dark text</p>
<p className="text-charcoal-600">Gray text</p>
<p className="text-gold-500">Gold accent</p>

// Backgrounds
<div className="bg-cream-50">Light background</div>
<div className="bg-white">White background</div>
<div className="bg-charcoal-950">Dark background</div>

// Gradients
<div className="bg-luxury-gradient">Subtle gradient</div>
<div className="bg-sunset-gradient">Sunset gradient</div>
```

## Typography Quick Reference

```tsx
import {
  Hero,      // 3-7rem, main hero text
  Display,   // 2.5-5rem, large display
  Heading1,  // 2-3.5rem, page heading
  Heading2,  // 1.75-2.5rem, section heading
  Heading3,  // 1.5-2rem, subsection heading
  BodyText,  // 1rem, standard text
  Caption,   // 0.75rem, small labels
  Overline   // 0.75rem, uppercase labels
} from '@/design-system';
```

## Responsive Grid Examples

```tsx
// Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols
<Grid cols={{ sm: 1, md: 2, lg: 3 }}>

// Auto-fit with minimum width
<AutoGrid minItemWidth="250px">

// Photo grid with aspect ratio
<PhotoGrid aspectRatio="3/2" cols={{ sm: 1, md: 2, lg: 3 }}>
```

## Animation Examples

```tsx
// Fade in on scroll
const { ref, isVisible } = useScrollReveal();
<div ref={ref} className={isVisible ? 'opacity-100' : 'opacity-0'}>

// Parallax background
const { ref, transform } = useParallax({ speed: 0.5 });
<div ref={ref} style={{ transform: `translateY(${transform.y}px)` }}>

// Staggered children
const staggered = useStaggeredFadeIn(0.1);
<motion.div variants={staggered}>
  {items.map(item => (
    <motion.div variants={itemFade}>
      {item}
    </motion.div>
  ))}
</motion.div>
```

## Tips

1. **Start with Sections**: Use `Section` for consistent spacing
2. **Use Container**: Wrap content in `Container` for proper width
3. **Consistent Variants**: Stick to `luxury` variant for premium feel
4. **Generous Spacing**: Use `gap-lg` or `gap-xl` for breathing room
5. **Animation Sparingly**: Only animate on first view with `triggerOnce`

## Common Mistakes to Avoid

❌ Don't mix design systems
```tsx
<Button className="px-4 py-2"> // Using Tailwind directly
```

✅ Use design system props
```tsx
<Button size="md" variant="luxury">
```

❌ Don't hardcode colors
```tsx
<div className="text-[#1A1A1A]">
```

✅ Use theme colors
```tsx
<div className="text-charcoal-950">
```

❌ Don't skip semantic structure
```tsx
<div>Heading</div>
```

✅ Use proper components
```tsx
<Heading1>Heading</Heading1>
```

## Next Steps

1. Explore `DesignSystemShowcase.tsx` for complete examples
2. Read `README.md` for full documentation
3. Check Tailwind config for available theme tokens
4. Build your first page using the patterns above

## Support

For questions or issues with the design system:
1. Check the README.md documentation
2. Review the showcase examples
3. Inspect the component source code
4. Refer to Tailwind CSS documentation for utilities

Happy building! 🎨✨
