'use client';

import { usePathname } from 'next/navigation';
import { useState, useLayoutEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export function PageFlipper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [animationClass, setAnimationClass] = useState('');
  const previousPathname = useRef(pathname);

  useLayoutEffect(() => {
    if (previousPathname.current !== pathname) {
      setAnimationClass('flipping-in');
      previousPathname.current = pathname;

      const timer = setTimeout(() => {
        setAnimationClass('');
      }, 1000); // Must match animation duration in globals.css

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return (
    <div className="page-flipper">
      <div className={cn("page-flipper-content", animationClass)} key={pathname}>
        {children}
      </div>
    </div>
  );
}
