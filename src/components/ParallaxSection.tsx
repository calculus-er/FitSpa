import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  offset?: number;
}

export const ParallaxSection = ({ 
  children, 
  speed = 0.5, 
  className,
  offset = 0 
}: ParallaxSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const scrolled = window.scrollY;
      const elementTop = rect.top + scrolled;
      const windowHeight = window.innerHeight;
      
      if (rect.top < windowHeight && rect.bottom > 0) {
        const yPos = (scrolled - elementTop + offset) * speed;
        setTranslateY(yPos);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, offset]);

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      <div style={{ transform: `translateY(${translateY}px)` }}>
        {children}
      </div>
    </div>
  );
};
