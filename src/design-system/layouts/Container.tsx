import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

interface ContainerProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  size?: ContainerSize;
  className?: string;
  children: React.ReactNode;
  noPadding?: boolean;
  as?: 'div' | 'section' | 'article' | 'main' | 'aside';
}

const sizeStyles: Record<ContainerSize, string> = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  '2xl': 'max-w-[1400px]',
  full: 'max-w-full',
};

/**
 * Container component - Responsive centered container with consistent padding
 */
export const Container: React.FC<ContainerProps> = ({
  size = 'xl',
  className = '',
  children,
  noPadding = false,
  as = 'div',
  ...motionProps
}) => {
  const Component = motion[as];

  const paddingStyles = noPadding
    ? ''
    : 'px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20';

  const combinedClassName = `
    w-full mx-auto
    ${sizeStyles[size]}
    ${paddingStyles}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <Component className={combinedClassName} {...motionProps}>
      {children}
    </Component>
  );
};

/**
 * Narrow Container - For focused content like articles
 */
export const NarrowContainer: React.FC<Omit<ContainerProps, 'size'>> = (props) => (
  <Container size="md" {...props} />
);

/**
 * Wide Container - For gallery layouts and media
 */
export const WideContainer: React.FC<Omit<ContainerProps, 'size'>> = (props) => (
  <Container size="2xl" {...props} />
);

/**
 * Full Width Container - Edge-to-edge content
 */
export const FullContainer: React.FC<Omit<ContainerProps, 'size'>> = (props) => (
  <Container size="full" noPadding {...props} />
);

export default Container;
