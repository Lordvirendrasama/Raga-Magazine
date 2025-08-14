
'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef, useLayoutEffect } from 'react';

export function PageFlipper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [currentChildren, setCurrentChildren] = useState(children);
  const [previousChildren, setPreviousChildren] = useState<React.ReactNode>(null);
  const [animationClass, setAnimationClass] = useState('');
  const previousPathname = useRef(pathname);

  useLayoutEffect(() => {
    if (previousPathname.current !== pathname) {
      setAnimationClass('flipping-out');
      setPreviousChildren(currentChildren);
      setCurrentChildren(children);

      const timeoutId = setTimeout(() => {
        setPreviousChildren(null);
        setAnimationClass('');
      }, 1000); // Must match the "out" animation duration

      previousPathname.current = pathname;
      return () => clearTimeout(timeoutId);
    } else if (!currentChildren) {
      // Set initial children if it's the first render
      setCurrentChildren(children);
    }
  }, [pathname, children, currentChildren]);

  return (
    <div className="page-flipper">
      {previousChildren && (
        <div
          className={`page-flipper-content ${animationClass}`}
          key={previousPathname.current}
        >
          {previousChildren}
        </div>
      )}
      <div className="page-flipper-content" key={pathname}>
        {currentChildren}
      </div>
    </div>
  );
}
