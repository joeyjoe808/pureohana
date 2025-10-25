import { useEffect, useRef, useState } from 'react';

interface UseParallaxOptions {
  speed?: number; // Multiplier for parallax effect (0.5 = half speed, 2 = double speed)
  direction?: 'vertical' | 'horizontal' | 'both';
  offset?: number; // Starting offset
  disabled?: boolean;
}

/**
 * Create smooth parallax scrolling effects
 * Returns a ref and transform values
 */
export const useParallax = ({
  speed = 0.5,
  direction = 'vertical',
  offset = 0,
  disabled = false,
}: UseParallaxOptions = {}) => {
  const ref = useRef<HTMLElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (disabled || !ref.current) return;

    const element = ref.current;
    let animationFrameId: number;

    const handleScroll = () => {
      animationFrameId = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        const scrollPosition = window.pageYOffset;
        const elementTop = rect.top + scrollPosition;
        const elementHeight = rect.height;
        const windowHeight = window.innerHeight;

        // Calculate how much of the element is in view
        const scrolled = scrollPosition + windowHeight - elementTop;
        const percentage = scrolled / (windowHeight + elementHeight);

        // Calculate parallax offset
        const parallaxY = direction !== 'horizontal'
          ? (percentage - 0.5) * elementHeight * speed + offset
          : 0;

        const parallaxX = direction === 'horizontal' || direction === 'both'
          ? (percentage - 0.5) * elementHeight * speed + offset
          : 0;

        setTransform({ x: parallaxX, y: parallaxY });
      });
    };

    handleScroll(); // Initial calculation
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [speed, direction, offset, disabled]);

  return { ref, transform };
};

/**
 * Mouse parallax effect - elements follow mouse movement
 */
export const useMouseParallax = (
  strength: number = 20,
  disabled: boolean = false
) => {
  const ref = useRef<HTMLElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (disabled || !ref.current) return;

    const element = ref.current;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      animationFrameId = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate distance from center
        const deltaX = (e.clientX - centerX) / rect.width;
        const deltaY = (e.clientY - centerY) / rect.height;

        // Apply strength
        const x = deltaX * strength;
        const y = deltaY * strength;

        setTransform({ x, y });
      });
    };

    const handleMouseLeave = () => {
      // Smooth return to center
      animationFrameId = requestAnimationFrame(() => {
        setTransform({ x: 0, y: 0 });
      });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [strength, disabled]);

  return { ref, transform };
};

/**
 * Depth parallax - create layered parallax effect
 */
export const useDepthParallax = (depth: number = 1, disabled: boolean = false) => {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (disabled || !ref.current) return;

    let animationFrameId: number;

    const handleScroll = () => {
      animationFrameId = requestAnimationFrame(() => {
        const scrollY = window.pageYOffset;
        const parallaxOffset = scrollY * (depth * 0.1);
        setOffset(parallaxOffset);
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [depth, disabled]);

  return { ref, offset };
};

export default useParallax;
