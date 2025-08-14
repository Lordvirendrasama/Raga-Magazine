
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
    const previousPathname = (currentChildren as any)?.props?.childProp?.segment;
    // Only trigger animation if the pathname changes
    if (pathname !== previousPathname) {
      setIsAnimating(true);
      setAnimationClass('flipping-out');

      // Wait for the 'out' animation to finish
      timeoutRef.current = setTimeout(() => {
        // Set the new content, but keep animating
        setCurrentChildren(children);
        setAnimationClass('flipping-in');
        
        // Wait for the 'in' animation to finish before stopping animation
        timeoutRef.current = setTimeout(() => {
          setIsAnimating(false);
          setAnimationClass('');
        }, 1000); // Duration of the flip-in animation
      }, 1000); // Duration of the flip-out animation
    }
  }, [pathname, children]); // Remove currentChildren from dependencies to avoid re-triggering

  // Determine which content to render. If animating, always show the state's `currentChildren`.
  // Otherwise, show the latest `children` from props.
  const contentToRender = isAnimating ? currentChildren : children;

  return (
    <div className="page-flipper">
      <div className={`page-flipper-content ${animationClass}`} key={pathname}>
        {contentToRender}
      </div>
    </div>
  );
}
