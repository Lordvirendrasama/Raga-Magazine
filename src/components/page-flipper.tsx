
'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export function PageFlipper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [currentChildren, setCurrentChildren] = useState(children);
  const [animationClass, setAnimationClass] = useState('');
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      setAnimationClass('flipping-out');

      const timeoutId = setTimeout(() => {
        // After the 'out' animation, we set the new children and start the 'in' animation.
        // The old content is gone because of the opacity in the `flipping-out` animation.
        setCurrentChildren(children);
        setAnimationClass('flipping-in');
        previousPathname.current = pathname;
        
        const secondTimeoutId = setTimeout(() => {
            // Clean up animation classes after the 'in' animation completes.
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
        {currentChildren}
      </div>
    </div>
  );
}
