import { useEffect, useState } from 'react';
import { Variants } from 'framer-motion';

type FadeDirection = 'up' | 'down' | 'left' | 'right' | 'none';

interface UseFadeInOptions {
  direction?: FadeDirection;
  distance?: number;
  duration?: number;
  delay?: number;
  once?: boolean;
}

/**
 * Generate fade-in animation variants for Framer Motion
 * Perfect for elegant entrance animations
 */
export const useFadeIn = ({
  direction = 'up',
  distance = 30,
  duration = 0.6,
  delay = 0,
  once = true,
}: UseFadeInOptions = {}): Variants => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance };
      case 'down':
        return { y: -distance };
      case 'left':
        return { x: distance };
      case 'right':
        return { x: -distance };
      default:
        return {};
    }
  };

  return {
    hidden: {
      opacity: 0,
      ...getInitialPosition(),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1], // Luxury easing
      },
    },
  };
};

/**
 * Staggered children animation
 * Each child appears with a delay after the previous
 */
export const useStaggeredFadeIn = (
  staggerDelay: number = 0.1,
  childOptions: UseFadeInOptions = {}
): Variants => {
  const childVariants = useFadeIn(childOptions);

  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: childOptions.delay || 0,
      },
    },
  };
};

/**
 * Scale fade-in animation
 * Element grows and fades in
 */
export const useScaleFadeIn = ({
  scale = 0.95,
  duration = 0.5,
  delay = 0,
}: {
  scale?: number;
  duration?: number;
  delay?: number;
} = {}): Variants => {
  return {
    hidden: {
      opacity: 0,
      scale,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };
};

/**
 * Blur fade-in animation
 * Element un-blurs as it fades in
 */
export const useBlurFadeIn = ({
  blur = 10,
  duration = 0.6,
  delay = 0,
}: {
  blur?: number;
  duration?: number;
  delay?: number;
} = {}): Variants => {
  return {
    hidden: {
      opacity: 0,
      filter: `blur(${blur}px)`,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };
};

/**
 * Text reveal animation
 * Text appears character by character or word by word
 */
export const useTextReveal = ({
  duration = 0.05,
  delay = 0,
  staggerDelay = 0.03,
}: {
  duration?: number;
  delay?: number;
  staggerDelay?: number;
} = {}): Variants => {
  return {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };
};

/**
 * Curtain reveal animation
 * Element is revealed from behind a curtain
 */
export const useCurtainReveal = ({
  direction = 'left',
  duration = 0.8,
  delay = 0,
}: {
  direction?: 'left' | 'right' | 'top' | 'bottom';
  duration?: number;
  delay?: number;
} = {}): { containerVariants: Variants; curtainVariants: Variants } => {
  const getSlideDirection = () => {
    switch (direction) {
      case 'left':
        return { x: '-100%' };
      case 'right':
        return { x: '100%' };
      case 'top':
        return { y: '-100%' };
      case 'bottom':
        return { y: '100%' };
    }
  };

  return {
    containerVariants: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          delay,
          duration: 0.01,
        },
      },
    },
    curtainVariants: {
      hidden: { x: 0, y: 0 },
      visible: {
        ...getSlideDirection(),
        transition: {
          delay,
          duration,
          ease: [0.4, 0, 0.2, 1],
        },
      },
    },
  };
};

/**
 * Controlled fade-in state
 * Manually control when animation triggers
 */
export const useControlledFadeIn = () => {
  const [isVisible, setIsVisible] = useState(false);

  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return {
    variants,
    isVisible,
    show: () => setIsVisible(true),
    hide: () => setIsVisible(false),
    toggle: () => setIsVisible((prev) => !prev),
  };
};

/**
 * Sequential reveal
 * Elements appear one after another in sequence
 */
export const useSequentialReveal = (
  count: number,
  duration: number = 0.5,
  stagger: number = 0.2
) => {
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    if (currentIndex < count - 1) {
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, stagger * 1000);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, count, stagger]);

  const isVisible = (index: number) => index <= currentIndex;
  const start = () => setCurrentIndex(0);
  const reset = () => setCurrentIndex(-1);

  return { isVisible, start, reset, currentIndex };
};

export default useFadeIn;
