import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 'auto';
type GridGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface GridProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  cols?: GridCols | { sm?: GridCols; md?: GridCols; lg?: GridCols; xl?: GridCols };
  gap?: GridGap;
  className?: string;
  children: React.ReactNode;
}

const colsToClass = (cols: GridCols): string => {
  if (cols === 'auto') return 'grid-cols-auto-fit';
  return `grid-cols-${cols}`;
};

const responsiveColsToClass = (
  cols: GridCols | { sm?: GridCols; md?: GridCols; lg?: GridCols; xl?: GridCols }
): string => {
  if (typeof cols === 'object') {
    const classes: string[] = [];
    if (cols.sm) classes.push(`sm:${colsToClass(cols.sm)}`);
    if (cols.md) classes.push(`md:${colsToClass(cols.md)}`);
    if (cols.lg) classes.push(`lg:${colsToClass(cols.lg)}`);
    if (cols.xl) classes.push(`xl:${colsToClass(cols.xl)}`);
    return classes.join(' ');
  }
  return colsToClass(cols);
};

const gapStyles: Record<GridGap, string> = {
  none: 'gap-0',
  xs: 'gap-2',
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12',
  '2xl': 'gap-16',
};

/**
 * Grid component - Responsive CSS Grid layout
 */
export const Grid: React.FC<GridProps> = ({
  cols = 3,
  gap = 'md',
  className = '',
  children,
  ...motionProps
}) => {
  const colsClass = responsiveColsToClass(cols);

  const combinedClassName = `
    grid
    ${colsClass}
    ${gapStyles[gap]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <motion.div className={combinedClassName} {...motionProps}>
      {children}
    </motion.div>
  );
};

/**
 * Masonry Grid - Pinterest-style masonry layout
 */
interface MasonryGridProps {
  cols?: number | { sm?: number; md?: number; lg?: number };
  gap?: GridGap;
  className?: string;
  children: React.ReactNode;
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({
  cols = 3,
  gap = 'md',
  className = '',
  children,
}) => {
  const getColumnsClass = () => {
    if (typeof cols === 'object') {
      const classes: string[] = ['columns-1'];
      if (cols.sm) classes.push(`sm:columns-${cols.sm}`);
      if (cols.md) classes.push(`md:columns-${cols.md}`);
      if (cols.lg) classes.push(`lg:columns-${cols.lg}`);
      return classes.join(' ');
    }
    return `columns-${cols}`;
  };

  const combinedClassName = `
    ${getColumnsClass()}
    ${gapStyles[gap]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={combinedClassName}>
      {React.Children.map(children, (child) => (
        <div className="break-inside-avoid mb-6">
          {child}
        </div>
      ))}
    </div>
  );
};

/**
 * Photo Grid - Specialized grid for photography with aspect ratios
 */
interface PhotoGridProps {
  layout?: 'grid' | 'masonry' | 'featured';
  cols?: GridCols | { sm?: GridCols; md?: GridCols; lg?: GridCols; xl?: GridCols };
  gap?: GridGap;
  aspectRatio?: '1/1' | '4/3' | '3/2' | '16/9';
  className?: string;
  children: React.ReactNode;
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({
  layout = 'grid',
  cols = { sm: 1, md: 2, lg: 3 },
  gap = 'md',
  aspectRatio = '3/2',
  className = '',
  children,
}) => {
  if (layout === 'masonry') {
    const masonryCols = typeof cols === 'object'
      ? { sm: cols.sm as number, md: cols.md as number, lg: cols.lg as number }
      : cols as number;

    return (
      <MasonryGrid cols={masonryCols} gap={gap} className={className}>
        {children}
      </MasonryGrid>
    );
  }

  if (layout === 'featured') {
    return (
      <div className={`grid gap-${gap} ${className}`}>
        {/* Featured large item */}
        <div className="col-span-full lg:col-span-2 row-span-2">
          {React.Children.toArray(children)[0]}
        </div>

        {/* Smaller grid items */}
        <Grid cols={{ sm: 1, md: 2 }} gap={gap}>
          {React.Children.toArray(children).slice(1)}
        </Grid>
      </div>
    );
  }

  // Regular grid with aspect ratio
  return (
    <Grid cols={cols} gap={gap} className={className}>
      {React.Children.map(children, (child) => (
        <div className="relative" style={{ aspectRatio }}>
          {child}
        </div>
      ))}
    </Grid>
  );
};

/**
 * AutoGrid - Automatically fits items with minimum width
 */
interface AutoGridProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  minItemWidth?: string;
  gap?: GridGap;
  className?: string;
  children: React.ReactNode;
}

export const AutoGrid: React.FC<AutoGridProps> = ({
  minItemWidth = '250px',
  gap = 'md',
  className = '',
  children,
  ...motionProps
}) => {
  const combinedClassName = `
    grid
    ${gapStyles[gap]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <motion.div
      className={combinedClassName}
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`,
      }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

/**
 * Bento Grid - Modern asymmetric grid layout
 */
interface BentoGridProps {
  className?: string;
  children: React.ReactNode;
}

export const BentoGrid: React.FC<BentoGridProps> = ({
  className = '',
  children,
}) => {
  const items = React.Children.toArray(children);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-6 gap-6 auto-rows-[200px] ${className}`}>
      {items.map((child, index) => {
        // Define sizes for bento layout
        const sizes = [
          'md:col-span-4 md:row-span-2',
          'md:col-span-2 md:row-span-1',
          'md:col-span-2 md:row-span-1',
          'md:col-span-3 md:row-span-2',
          'md:col-span-3 md:row-span-1',
          'md:col-span-3 md:row-span-1',
        ];

        return (
          <div
            key={index}
            className={`${sizes[index % sizes.length]} overflow-hidden rounded-luxury-lg`}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};

// Showcase Component
export const GridShowcase: React.FC = () => {
  return (
    <div className="space-y-16 p-8">
      <div className="space-y-6">
        <h3 className="text-2xl font-display">Standard Grid</h3>
        <Grid cols={{ sm: 1, md: 2, lg: 3 }} gap="md">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 bg-cream-200 rounded-luxury-md flex items-center justify-center">
              Item {i + 1}
            </div>
          ))}
        </Grid>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-display">Auto Grid</h3>
        <AutoGrid minItemWidth="200px" gap="md">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-32 bg-cream-200 rounded-luxury-md flex items-center justify-center">
              Auto {i + 1}
            </div>
          ))}
        </AutoGrid>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-display">Masonry Grid</h3>
        <MasonryGrid cols={{ sm: 1, md: 2, lg: 3 }} gap="md">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="bg-cream-200 rounded-luxury-md p-4"
              style={{ height: `${150 + Math.random() * 200}px` }}
            >
              Masonry Item {i + 1}
            </div>
          ))}
        </MasonryGrid>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-display">Bento Grid</h3>
        <BentoGrid>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-cream-200 rounded-luxury-md flex items-center justify-center h-full"
            >
              Bento {i + 1}
            </div>
          ))}
        </BentoGrid>
      </div>
    </div>
  );
};

export default Grid;
