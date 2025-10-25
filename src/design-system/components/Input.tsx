import React, { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';

type InputVariant = 'standard' | 'filled' | 'outlined' | 'luxury';
type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: InputVariant;
  size?: InputSize;
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const variantStyles: Record<InputVariant, string> = {
  standard: `
    border-b-2 border-charcoal-300
    focus:border-gold-500
    bg-transparent
    rounded-none
  `,
  filled: `
    bg-cream-100
    border-b-2 border-transparent
    focus:border-gold-500
    focus:bg-cream-50
    rounded-t-luxury-md
  `,
  outlined: `
    border-2 border-charcoal-300
    focus:border-gold-500
    bg-white
    rounded-luxury-md
  `,
  luxury: `
    border-2 border-gold-300/50
    focus:border-gold-500
    bg-gradient-to-br from-white to-cream-50
    rounded-luxury-md
    shadow-luxury-sm
    focus:shadow-luxury
  `,
};

const sizeStyles: Record<InputSize, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-5 py-4 text-lg',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'outlined',
      size = 'md',
      label,
      helperText,
      error = false,
      errorMessage,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      className = '',
      ...inputProps
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const baseStyles = `
      font-sans
      text-charcoal-950
      placeholder:text-charcoal-400
      transition-all duration-300 ease-luxury
      focus:outline-none
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const errorStyles = error
      ? 'border-red-500 focus:border-red-500'
      : '';

    const iconPaddingLeft = icon && iconPosition === 'left' ? 'pl-10' : '';
    const iconPaddingRight = icon && iconPosition === 'right' ? 'pr-10' : '';

    const inputClassName = `
      ${baseStyles}
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${errorStyles}
      ${iconPaddingLeft}
      ${iconPaddingRight}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
      <div className={`${fullWidth ? 'w-full' : ''} space-y-1`}>
        {/* Label */}
        {label && (
          <motion.label
            className={`
              block text-sm font-medium
              transition-colors duration-200
              ${isFocused ? 'text-gold-600' : 'text-charcoal-700'}
              ${error ? 'text-red-600' : ''}
            `}
            animate={{ y: isFocused ? -2 : 0 }}
          >
            {label}
          </motion.label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Icon */}
          {icon && (
            <div
              className={`
                absolute top-1/2 -translate-y-1/2
                ${iconPosition === 'left' ? 'left-3' : 'right-3'}
                text-charcoal-400
                transition-colors duration-200
                ${isFocused ? 'text-gold-500' : ''}
              `}
            >
              {icon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            className={inputClassName}
            onFocus={(e) => {
              setIsFocused(true);
              inputProps.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              inputProps.onBlur?.(e);
            }}
            {...inputProps}
          />
        </div>

        {/* Helper Text / Error Message */}
        {(helperText || errorMessage) && (
          <motion.p
            className={`text-xs ${error ? 'text-red-600' : 'text-charcoal-500'}`}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error ? errorMessage : helperText}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Textarea Component
interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  variant?: InputVariant;
  size?: InputSize;
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  fullWidth?: boolean;
  rows?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      variant = 'outlined',
      size = 'md',
      label,
      helperText,
      error = false,
      errorMessage,
      fullWidth = false,
      rows = 4,
      className = '',
      ...textareaProps
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const baseStyles = `
      font-sans
      text-charcoal-950
      placeholder:text-charcoal-400
      transition-all duration-300 ease-luxury
      focus:outline-none
      resize-y
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const errorStyles = error
      ? 'border-red-500 focus:border-red-500'
      : '';

    const textareaClassName = `
      ${baseStyles}
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${errorStyles}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
      <div className={`${fullWidth ? 'w-full' : ''} space-y-1`}>
        {/* Label */}
        {label && (
          <motion.label
            className={`
              block text-sm font-medium
              transition-colors duration-200
              ${isFocused ? 'text-gold-600' : 'text-charcoal-700'}
              ${error ? 'text-red-600' : ''}
            `}
            animate={{ y: isFocused ? -2 : 0 }}
          >
            {label}
          </motion.label>
        )}

        {/* Textarea */}
        <textarea
          ref={ref}
          rows={rows}
          className={textareaClassName}
          onFocus={(e) => {
            setIsFocused(true);
            textareaProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            textareaProps.onBlur?.(e);
          }}
          {...textareaProps}
        />

        {/* Helper Text / Error Message */}
        {(helperText || errorMessage) && (
          <motion.p
            className={`text-xs ${error ? 'text-red-600' : 'text-charcoal-500'}`}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error ? errorMessage : helperText}
          </motion.p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// Select Component
interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  variant?: InputVariant;
  size?: InputSize;
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  fullWidth?: boolean;
  options: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      variant = 'outlined',
      size = 'md',
      label,
      helperText,
      error = false,
      errorMessage,
      fullWidth = false,
      options,
      className = '',
      ...selectProps
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const baseStyles = `
      font-sans
      text-charcoal-950
      transition-all duration-300 ease-luxury
      focus:outline-none
      appearance-none
      cursor-pointer
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const errorStyles = error
      ? 'border-red-500 focus:border-red-500'
      : '';

    const selectClassName = `
      ${baseStyles}
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${errorStyles}
      ${fullWidth ? 'w-full' : ''}
      pr-10
      ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
      <div className={`${fullWidth ? 'w-full' : ''} space-y-1`}>
        {/* Label */}
        {label && (
          <motion.label
            className={`
              block text-sm font-medium
              transition-colors duration-200
              ${isFocused ? 'text-gold-600' : 'text-charcoal-700'}
              ${error ? 'text-red-600' : ''}
            `}
            animate={{ y: isFocused ? -2 : 0 }}
          >
            {label}
          </motion.label>
        )}

        {/* Select Container */}
        <div className="relative">
          <select
            ref={ref}
            className={selectClassName}
            onFocus={(e) => {
              setIsFocused(true);
              selectProps.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              selectProps.onBlur?.(e);
            }}
            {...selectProps}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Arrow Icon */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal-400">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>

        {/* Helper Text / Error Message */}
        {(helperText || errorMessage) && (
          <motion.p
            className={`text-xs ${error ? 'text-red-600' : 'text-charcoal-500'}`}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error ? errorMessage : helperText}
          </motion.p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

// Showcase Component
export const InputShowcase: React.FC = () => {
  return (
    <div className="space-y-12 p-8 bg-cream-50">
      <div className="space-y-6">
        <h3 className="text-2xl font-display">Input Variants</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <Input
            variant="outlined"
            label="Outlined Input"
            placeholder="Enter your name"
            fullWidth
          />
          <Input
            variant="filled"
            label="Filled Input"
            placeholder="Enter your email"
            fullWidth
          />
          <Input
            variant="standard"
            label="Standard Input"
            placeholder="Enter your phone"
            fullWidth
          />
          <Input
            variant="luxury"
            label="Luxury Input"
            placeholder="Special occasion"
            fullWidth
          />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-display">Input with Icons</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <Input
            variant="outlined"
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            icon={<span>✉</span>}
            iconPosition="left"
            fullWidth
          />
          <Input
            variant="outlined"
            label="Search"
            type="search"
            placeholder="Search photos..."
            icon={<span>🔍</span>}
            iconPosition="right"
            fullWidth
          />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-display">Input States</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <Input
            variant="outlined"
            label="With Helper Text"
            placeholder="Enter value"
            helperText="This is helpful information"
            fullWidth
          />
          <Input
            variant="outlined"
            label="Error State"
            placeholder="Enter value"
            error
            errorMessage="This field is required"
            fullWidth
          />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-display">Textarea</h3>
        <div className="max-w-2xl">
          <Textarea
            variant="luxury"
            label="Your Message"
            placeholder="Tell us about your special day..."
            rows={6}
            helperText="Share your vision and we'll bring it to life"
            fullWidth
          />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-display">Select</h3>
        <div className="max-w-md">
          <Select
            variant="outlined"
            label="Photography Service"
            options={[
              { value: '', label: 'Select a service' },
              { value: 'wedding', label: 'Wedding Photography' },
              { value: 'portrait', label: 'Portrait Session' },
              { value: 'event', label: 'Event Coverage' },
              { value: 'commercial', label: 'Commercial Photography' },
            ]}
            fullWidth
          />
        </div>
      </div>
    </div>
  );
};

export default Input;
