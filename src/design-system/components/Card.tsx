import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

type CardVariant = 'elevated' | 'outlined' | 'filled' | 'luxury' | 'glass';
type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  variant?: CardVariant;
  padding?: CardPadding;
  hoverable?: boolean;
  clickable?: boolean;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  elevated: `
    bg-white
    shadow-luxury
    hover:shadow-luxury-lg
    border border-cream-200
  `,
  outlined: `
    bg-white
    border-2 border-charcoal-200
    hover:border-charcoal-400
  `,
  filled: `
    bg-cream-100
    border border-cream-300
  `,
  luxury: `
    bg-gradient-to-br from-white via-cream-50 to-gold-50
    shadow-luxury-lg
    hover:shadow-luxury-xl
    border border-gold-200/50
    relative overflow-hidden
    before:absolute before:inset-0 before:bg-luxury-gradient before:opacity-0
    hover:before:opacity-100 before:transition-opacity before:duration-500
  `,
  glass: `
    bg-white/80 backdrop-blur-luxury
    border border-white/20
    shadow-luxury
  `,
};

const paddingStyles: Record<CardPadding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  padding = 'md',
  hoverable = false,
  clickable = false,
  className = '',
  children,
  ...motionProps
}) => {
  const baseStyles = `
    rounded-luxury-lg
    transition-all duration-400 ease-luxury
    relative
  `;

  const interactionStyles = `
    ${hoverable ? 'transform hover:-translate-y-1' : ''}
    ${clickable ? 'cursor-pointer active:scale-[0.99]' : ''}
  `;

  const combinedClassName = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${paddingStyles[padding]}
    ${interactionStyles}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <motion.div
      className={combinedClassName}
      whileHover={hoverable ? { y: -4 } : undefined}
      whileTap={clickable ? { scale: 0.99 } : undefined}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

// Photo Card - Specialized for photography display
interface PhotoCardProps extends Omit<CardProps, 'children'> {
  image: string;
  alt: string;
  title?: string;
  description?: string;
  category?: string;
  aspectRatio?: '1/1' | '4/3' | '3/2' | '16/9' | '21/9';
  overlay?: boolean;
  onImageClick?: () => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  image,
  alt,
  title,
  description,
  category,
  aspectRatio = '3/2',
  overlay = true,
  onImageClick,
  variant = 'elevated',
  hoverable = true,
  className = '',
  ...cardProps
}) => {
  return (
    <Card
      variant={variant}
      padding="none"
      hoverable={hoverable}
      clickable={!!onImageClick}
      onClick={onImageClick}
      className={className}
      {...cardProps}
    >
      <div className="relative group">
        {/* Image */}
        <div
          className={`relative overflow-hidden rounded-t-luxury-lg`}
          style={{ aspectRatio }}
        >
          <img
            src={image}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />

          {/* Overlay */}
          {overlay && (
            <div className="absolute inset-0 bg-dark-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
          )}

          {/* Category Badge */}
          {category && (
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-luxury text-xs font-semibold uppercase tracking-luxury text-charcoal-900">
              {category}
            </div>
          )}
        </div>

        {/* Content */}
        {(title || description) && (
          <div className="p-6 space-y-2">
            {title && (
              <h3 className="text-xl font-serif font-medium text-charcoal-950">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-body-sm text-charcoal-600 line-clamp-2">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

// Service Card - For displaying services
interface ServiceCardProps extends Omit<CardProps, 'children'> {
  icon?: React.ReactNode;
  title: string;
  description: string;
  features?: string[];
  price?: string;
  cta?: {
    label: string;
    onClick: () => void;
  };
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
  features,
  price,
  cta,
  variant = 'luxury',
  hoverable = true,
  className = '',
  ...cardProps
}) => {
  return (
    <Card
      variant={variant}
      padding="lg"
      hoverable={hoverable}
      className={className}
      {...cardProps}
    >
      <div className="space-y-6 relative z-10">
        {/* Icon */}
        {icon && (
          <div className="w-14 h-14 rounded-luxury-lg bg-gold-100 flex items-center justify-center text-gold-700">
            {icon}
          </div>
        )}

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-2xl font-serif font-medium text-charcoal-950">
            {title}
          </h3>
          <p className="text-body text-charcoal-600">
            {description}
          </p>
        </div>

        {/* Features */}
        {features && features.length > 0 && (
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-body-sm text-charcoal-700">
                <span className="text-gold-500 mt-0.5">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        )}

        {/* Price & CTA */}
        {(price || cta) && (
          <div className="pt-4 border-t border-charcoal-200/50 flex items-center justify-between">
            {price && (
              <div className="text-heading-3 font-display font-light text-charcoal-950">
                {price}
              </div>
            )}
            {cta && (
              <button
                onClick={cta.onClick}
                className="text-sm font-semibold text-gold-600 hover:text-gold-700 uppercase tracking-luxury transition-colors"
              >
                {cta.label}
              </button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

// Testimonial Card
interface TestimonialCardProps extends Omit<CardProps, 'children'> {
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
  rating?: number;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  author,
  role,
  avatar,
  rating,
  variant = 'luxury',
  className = '',
  ...cardProps
}) => {
  return (
    <Card
      variant={variant}
      padding="lg"
      className={className}
      {...cardProps}
    >
      <div className="space-y-6 relative z-10">
        {/* Quote */}
        <div className="relative">
          <span className="text-6xl font-display text-gold-300 absolute -top-4 -left-2">"</span>
          <p className="text-body-lg text-charcoal-800 italic relative z-10 pl-6">
            {quote}
          </p>
        </div>

        {/* Author */}
        <div className="flex items-center gap-4">
          {avatar && (
            <img
              src={avatar}
              alt={author}
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
          <div className="flex-1">
            <div className="font-semibold text-charcoal-950">{author}</div>
            {role && (
              <div className="text-body-sm text-charcoal-600">{role}</div>
            )}
          </div>
          {rating && (
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={i < rating ? 'text-gold-500' : 'text-charcoal-300'}
                >
                  ★
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

// Showcase component
export const CardShowcase: React.FC = () => {
  return (
    <div className="space-y-12 p-8 bg-cream-50">
      <div className="space-y-4">
        <h3 className="text-2xl font-display">Card Variants</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="elevated">
            <h4 className="font-serif text-lg mb-2">Elevated Card</h4>
            <p className="text-body-sm text-charcoal-600">
              Soft shadows create depth and hierarchy.
            </p>
          </Card>
          <Card variant="outlined">
            <h4 className="font-serif text-lg mb-2">Outlined Card</h4>
            <p className="text-body-sm text-charcoal-600">
              Clean borders for minimal designs.
            </p>
          </Card>
          <Card variant="luxury" hoverable>
            <h4 className="font-serif text-lg mb-2">Luxury Card</h4>
            <p className="text-body-sm text-charcoal-600">
              Premium gradient with elegant interactions.
            </p>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-display">Photo Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PhotoCard
            image="https://images.unsplash.com/photo-1519741497674-611481863552?w=800"
            alt="Wedding"
            title="Intimate Wedding"
            description="A beautiful ceremony captured in golden hour light"
            category="Wedding"
            aspectRatio="3/2"
          />
          <PhotoCard
            image="https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800"
            alt="Portrait"
            title="Sunset Portrait"
            description="Capturing authentic emotions in natural light"
            category="Portrait"
            aspectRatio="3/2"
          />
          <PhotoCard
            image="https://images.unsplash.com/photo-1523438097201-512ae7d59c44?w=800"
            alt="Landscape"
            title="Hawaiian Paradise"
            description="The breathtaking beauty of island life"
            category="Landscape"
            aspectRatio="3/2"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-display">Service Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ServiceCard
            icon={<span className="text-2xl">📸</span>}
            title="Wedding Photography"
            description="Full-day coverage capturing every precious moment of your special day."
            features={[
              '8 hours of coverage',
              '500+ edited photos',
              'Engagement session included',
              'Online gallery'
            ]}
            price="$2,500"
            cta={{ label: 'Learn More', onClick: () => {} }}
          />
        </div>
      </div>
    </div>
  );
};

export default Card;
