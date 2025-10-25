import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'luxury' | 'minimal';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-charcoal-950 text-cream-50
    hover:bg-charcoal-900
    active:bg-charcoal-800
    shadow-luxury
    hover:shadow-luxury-lg
  `,
  secondary: `
    bg-gold-500 text-charcoal-950
    hover:bg-gold-600
    active:bg-gold-700
    shadow-luxury
    hover:shadow-glow
  `,
  outline: `
    bg-transparent border-2 border-charcoal-950 text-charcoal-950
    hover:bg-charcoal-950 hover:text-cream-50
    active:bg-charcoal-900
  `,
  ghost: `
    bg-transparent text-charcoal-950
    hover:bg-charcoal-100
    active:bg-charcoal-200
  `,
  luxury: `
    bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600
    text-charcoal-950 font-semibold
    hover:from-gold-500 hover:via-gold-600 hover:to-gold-700
    shadow-luxury-lg
    hover:shadow-luxury-xl
    relative overflow-hidden
    before:absolute before:inset-0 before:bg-white/20
    before:translate-x-[-100%] hover:before:translate-x-[100%]
    before:transition-transform before:duration-700 before:ease-out
  `,
  minimal: `
    bg-transparent text-charcoal-950
    hover:text-gold-600
    underline underline-offset-4 decoration-1
    hover:decoration-2
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  xl: 'px-10 py-5 text-xl',
};

const disabledStyles = 'opacity-50 cursor-not-allowed pointer-events-none';

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...motionProps
}) => {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-sans font-medium
    rounded-luxury-md
    transition-all duration-300 ease-luxury
    focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2
    select-none
  `;

  const combinedClassName = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled || loading ? disabledStyles : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const spinnerSize = size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6';

  return (
    <motion.button
      className={combinedClassName}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      {...motionProps}
    >
      {loading ? (
        <div className={`${spinnerSize} border-2 border-current border-t-transparent rounded-full animate-spin`} />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span>{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span>{icon}</span>}
        </>
      )}
    </motion.button>
  );
};

// Icon Button variant
interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  icon: React.ReactNode;
  'aria-label': string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  variant = 'ghost',
  size = 'md',
  icon,
  className = '',
  ...props
}) => {
  const sizeClass = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14',
  }[size];

  return (
    <Button
      variant={variant}
      size={size}
      className={`${sizeClass} !p-0 ${className}`}
      {...props}
    >
      {icon}
    </Button>
  );
};

// Button Group component
interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  className = '',
}) => {
  const orientationClass = orientation === 'horizontal' ? 'flex-row' : 'flex-col';

  return (
    <div className={`inline-flex ${orientationClass} ${className}`}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          const isFirst = index === 0;
          const isLast = index === React.Children.count(children) - 1;

          const roundedClass = orientation === 'horizontal'
            ? `${isFirst ? 'rounded-l-luxury-md' : ''} ${isLast ? 'rounded-r-luxury-md' : ''} ${!isFirst && !isLast ? 'rounded-none' : ''}`
            : `${isFirst ? 'rounded-t-luxury-md' : ''} ${isLast ? 'rounded-b-luxury-md' : ''} ${!isFirst && !isLast ? 'rounded-none' : ''}`;

          return React.cloneElement(child as React.ReactElement<any>, {
            className: `${(child.props as any).className || ''} ${roundedClass} ${orientation === 'horizontal' && !isLast ? '-mr-px' : ''} ${orientation === 'vertical' && !isLast ? '-mb-px' : ''}`,
          });
        }
        return child;
      })}
    </div>
  );
};

// Showcase component
export const ButtonShowcase: React.FC = () => {
  return (
    <div className="space-y-8 p-8 bg-cream-50">
      <div className="space-y-4">
        <h3 className="text-2xl font-display">Button Variants</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="luxury">Luxury Button</Button>
          <Button variant="minimal">Minimal Button</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-display">Button Sizes</h3>
        <div className="flex items-center flex-wrap gap-4">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-display">Button States</h3>
        <div className="flex flex-wrap gap-4">
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
          <Button icon={<span>→</span>} iconPosition="right">With Icon</Button>
          <Button fullWidth>Full Width Button</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-display">Button Groups</h3>
        <ButtonGroup>
          <Button variant="outline">Left</Button>
          <Button variant="outline">Center</Button>
          <Button variant="outline">Right</Button>
        </ButtonGroup>
      </div>
    </div>
  );
};

export default Button;
