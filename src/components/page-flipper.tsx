'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export function PageFlipper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentChildren, setCurrentChildren] = useState(children);
  const [animationClass, setAnimationClass] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any pending timeouts on component unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Only trigger animation if the pathname changes
    if (pathname !== (currentChildren as any)?.props?.childProp?.segment) {
      setIsAnimating(true);
      setAnimationClass('flipping-out');

      // Wait for the 'out' animation to finish
      timeoutRef.current = setTimeout(() => {
        setCurrentChildren(children);
        setAnimationClass('flipping-in');
        
        // Wait for the 'in' animation to finish
        timeoutRef.current = setTimeout(() => {
          setIsAnimating(false);
          setAnimationClass('');
        }, 700); // Duration of the flip-in animation
      }, 700); // Duration of the flip-out animation
    }
  }, [pathname, children, currentChildren]);

  return (
    <div className="page-flipper">
      <div className={`page-flipper-content ${animationClass}`} key={pathname}>
        {isAnimating ? currentChildren : children}
      </div>
    </div>
  );
}
