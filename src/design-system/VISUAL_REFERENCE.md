# Pure Ohana Design System - Visual Reference

Quick visual guide to colors, typography, spacing, and components.

## Color Palette

### Neutrals - Warm and Sophisticated

**Cream** (Primary Light)
```
cream-50  #FDFCFB  Background, cards
cream-100 #FAF8F6  Subtle backgrounds
cream-200 #F5F1ED  Borders, dividers
cream-500 #C9BDB0  Medium tones
cream-900 #3E352C  Dark accents
```

**Charcoal** (Primary Dark)
```
charcoal-50   #F7F7F7  Very light backgrounds
charcoal-200  #DCDCDC  Light borders
charcoal-600  #656565  Secondary text
charcoal-900  #3D3D3D  Primary text (dark)
charcoal-950  #1A1A1A  Deepest black, CTAs
```

### Accents - Hawaiian Inspiration

**Gold** (Luxury Accent)
```
gold-400  #FACC15  Primary luxury accent
gold-500  #EAB308  Hover states
gold-600  #CA8A04  Active states
```

**Sunset** (Warmth & Passion)
```
sunset-400  #FB923C  Warm accents
sunset-500  #F97316  Primary sunset
sunset-600  #EA580C  Deep sunset
```

**Ocean** (Serenity & Trust)
```
ocean-400  #38BDF8  Light ocean
ocean-500  #0EA5E9  Primary ocean
ocean-600  #0284C7  Deep ocean
```

### Emotion Colors
```
passion   #FF6B7A  Warm coral for love, energy
serenity  #95C7E1  Soft blue for calm, peace
joy       #FFD93D  Warm yellow for happiness
elegance  #DCC9E2  Lavender for sophistication
```

## Typography Scale

### Display Fonts (Playfair Display)

```
Hero     3-7rem    (48-112px)  Main hero headings
Display  2.5-5rem  (40-80px)   Large display text
H1       2-3.5rem  (32-56px)   Page headings
```

### Serif Fonts (Cormorant Garamond)

```
H2       1.75-2.5rem (28-40px)  Section headings
H3       1.5-2rem    (24-32px)  Subsection headings
H4       1.5rem      (24px)     Smaller headings
```

### Sans-Serif Fonts (Inter)

```
Body XL  1.25rem    (20px)      Large body text
Body LG  1.125rem   (18px)      Emphasized body
Body     1rem       (16px)      Standard text
Body SM  0.875rem   (14px)      Small text
Caption  0.75rem    (12px)      Captions, labels
```

### Font Weights

```
Light      300   Display and headings
Normal     400   Body text
Medium     500   Emphasized text
Semibold   600   Strong emphasis
Bold       700   Very strong emphasis
```

### Letter Spacing

```
-0.02em   Hero, display (tighter)
-0.01em   Large headings
0em       Body text (normal)
0.05em    Relaxed (readable)
0.15em    Luxury (uppercase labels)
```

## Spacing System

### Base Scale
```
0     0px      None
1     0.25rem  (4px)
2     0.5rem   (8px)
3     0.75rem  (12px)
4     1rem     (16px)   ← Base unit
6     1.5rem   (24px)
8     2rem     (32px)
10    2.5rem   (40px)
12    3rem     (48px)
16    4rem     (64px)
20    5rem     (80px)
24    6rem     (96px)
```

### Custom Spacing
```
section     6rem    (96px)   Section padding
section-lg  8rem    (128px)  Large section padding
section-xl  10rem   (160px)  Extra large section
```

### Container Padding
```
Mobile      1.5rem  (24px)
Tablet      2rem    (32px)
Desktop     4rem    (64px)
Large       5rem    (80px)
XL          6rem    (96px)
```

## Shadows

```css
luxury-sm   Subtle:      0 2px 8px rgba(0,0,0,0.04)
luxury      Standard:    0 4px 20px rgba(0,0,0,0.08)
luxury-lg   Large:       0 10px 40px rgba(0,0,0,0.12)
luxury-xl   Extra Large: 0 20px 60px rgba(0,0,0,0.15)
glow        Gold glow:   0 0 20px rgba(250,204,21,0.3)
```

## Border Radius

```
luxury     2px    Minimal curves
luxury-md  4px    Small elements
luxury-lg  8px    Cards, photos
luxury-xl  12px   Large containers
```

## Component Variants Quick Reference

### Buttons
```
primary   Dark charcoal background
secondary Gold accent background
outline   Border with hover fill
ghost     Transparent with hover
luxury    Gold gradient with shimmer
minimal   Underlined text link
```

### Cards
```
elevated  Soft shadow, white background
outlined  Border, minimal style
filled    Subtle cream background
luxury    Gradient with effects
glass     Frosted glass aesthetic
```

### Inputs
```
standard  Underline only
filled    Filled background
outlined  Full border
luxury    Gradient background
```

## Grid Breakpoints

```
sm   640px   Mobile landscape, tablet portrait
md   768px   Tablet landscape
lg   1024px  Desktop
xl   1280px  Large desktop
2xl  1536px  Extra large screens
```

## Common Grid Configurations

```tsx
// Mobile-first responsive
cols={{ sm: 1, md: 2, lg: 3 }}

// Photo galleries
cols={{ sm: 1, md: 2, lg: 3, xl: 4 }}

// Services/Features
cols={{ sm: 1, md: 2, lg: 3 }}

// Testimonials
cols={{ sm: 1, lg: 2, xl: 3 }}

// Blog posts
cols={{ sm: 1, md: 2 }}
```

## Animation Timing

```
Duration   Use Case
200ms      Micro-interactions (hover)
300ms      Small elements (buttons)
400ms      Medium elements (cards)
600ms      Large elements (modals)
800ms      Page transitions
```

### Easing Curves

```
luxury       cubic-bezier(0.4, 0, 0.2, 1)    Standard
luxury-in    cubic-bezier(0.4, 0, 1, 1)      Accelerate
luxury-out   cubic-bezier(0, 0, 0.2, 1)      Decelerate
bounce       cubic-bezier(0.34, 1.56, 0.64, 1) Subtle bounce
```

## Common Color Combinations

### Light Theme (Default)
```
Background:  cream-50 or white
Text:        charcoal-950
Secondary:   charcoal-600
Accent:      gold-500
Border:      cream-200
```

### Dark Theme
```
Background:  charcoal-950
Text:        cream-50
Secondary:   cream-300
Accent:      gold-400
Border:      charcoal-800
```

### Luxury Sections
```
Background:  gradient (cream-50 → white → gold-50)
Text:        charcoal-950
Accent:      gold-500
Border:      gold-200/50
```

## Aspect Ratios for Photos

```
1:1    Square (Instagram-style)
4:3    Classic photo
3:2    DSLR standard (recommended)
16:9   Widescreen
21:9   Ultra-wide
```

## Icon Sizes

```
sm   16px   Small icons in text
md   20px   Standard UI icons
lg   24px   Larger UI icons
xl   32px   Feature icons
2xl  48px   Hero icons
```

## Recommended Usage Patterns

### Hero Section
```
Background:  Full-width image with dark overlay (0.4-0.6)
Heading:     Hero component in white
Body:        cream-100 text
CTA:         luxury button
Padding:     100vh min-height
```

### Content Section
```
Background:  white or cream-50
Spacing:     section-lg (8rem)
Heading:     Heading1 or Heading2
Body:        charcoal-600
Container:   xl (1280px max)
```

### Photo Gallery
```
Layout:      PhotoGrid with 3/2 aspect ratio
Columns:     sm:1, md:2, lg:3
Gap:         md or lg
Hover:       Scale 1.1 on image
Overlay:     Dark gradient on hover
```

### Service Cards
```
Variant:     luxury
Padding:     lg
Icon:        2xl size in gold-700
Title:       Heading3
Description: Body text in charcoal-600
CTA:         Minimal or ghost button
```

### Contact Form
```
Container:   Card with luxury variant
Inputs:      luxury variant
Spacing:     6 units between fields
Button:      luxury variant, full width
Width:       Max 600px
```

### Testimonials
```
Card:        luxury variant
Quote:       Body-lg in charcoal-800
Author:      Semibold in charcoal-950
Role:        Body-sm in charcoal-600
Rating:      Gold stars
```

## Performance Tips

1. **Images**: Use WebP format, lazy load, proper aspect ratios
2. **Animations**: Use `triggerOnce` on scroll animations
3. **Shadows**: Limit to 1-2 per viewport
4. **Gradients**: Use sparingly for performance
5. **Parallax**: Limit to hero sections only

## Accessibility Checklist

✅ Color contrast ratio ≥ 4.5:1 for text
✅ Touch targets ≥ 44x44px
✅ Focus indicators visible
✅ Semantic HTML elements
✅ Alt text for all images
✅ ARIA labels for icons
✅ Keyboard navigation support
✅ Reduced motion support

## Mobile-First Approach

Always design for mobile first, then enhance for larger screens:

```tsx
// Mobile (default)
<Grid cols={1}>

// Then add breakpoints
<Grid cols={{ sm: 1, md: 2, lg: 3 }}>

// Not the other way around
```

## Quick Copy-Paste Classes

```html
<!-- Primary heading -->
<h1 class="text-heading-1 font-display font-light text-charcoal-950">

<!-- Body text -->
<p class="text-body text-charcoal-600">

<!-- Gold accent text -->
<span class="text-gold-500 font-semibold">

<!-- Luxury card -->
<div class="bg-gradient-to-br from-white via-cream-50 to-gold-50 rounded-luxury-lg shadow-luxury-lg p-8">

<!-- Subtle border -->
<div class="border-b border-cream-200">

<!-- Hover lift -->
<div class="transition-all duration-400 hover:-translate-y-1 hover:shadow-luxury-lg">
```

This visual reference provides quick lookups for the most commonly used design tokens and patterns in the Pure Ohana Design System.
