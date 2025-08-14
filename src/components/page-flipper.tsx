
'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export function PageFlipper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentChildren, setCurrentChildren] = useState(children);
  const [animationClass, setAnimationClass] = useState('');
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      setAnimationClass('flipping-out');
      setIsAnimating(true);

      const timeoutId = setTimeout(() => {
        setCurrentChildren(children);
        setAnimationClass('flipping-in');
        previousPathname.current = pathname;
        
        const secondTimeoutId = setTimeout(() => {
            setIsAnimating(false);
            setAnimationClass('');
        }, 500); // Must match the "in" animation duration

        return () => clearTimeout(secondTimeoutId);
      }, 500); // Must match the "out" animation duration

      return () => clearTimeout(timeoutId);
    }
  }, [pathname, children]);

  return (
    <div className="page-flipper">
      <div className={`page-flipper-content ${animationClass}`} key={previousPathname.current}>
        {isAnimating && animationClass === 'flipping-in' ? null : currentChildren}
      </div>
      {/* Pre-render the next page but keep it visually hidden to have it ready */}
      <div className="absolute opacity-0 pointer-events-none">
        {animationClass === 'flipping-in' && currentChildren}
      </div>
    </div>
  );
}
