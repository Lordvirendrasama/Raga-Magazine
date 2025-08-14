'use client';

import { usePathname } from 'next/navigation';
import { useState, useLayoutEffect, useRef } from 'react';

export function PageFlipper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [previousChildren, setPreviousChildren] = useState<React.ReactNode>(null);
  const previousPathname = useRef(pathname);

  useLayoutEffect(() => {
    if (previousPathname.current !== pathname) {
      setPreviousChildren(displayChildren);
      setDisplayChildren(children);

      const timeoutId = setTimeout(() => {
        setPreviousChildren(null);
      }, 1000); // Match animation duration

      previousPathname.current = pathname;
      return () => clearTimeout(timeoutId);
    }
  }, [pathname, children, displayChildren]);

  return (
    <div className="page-flipper">
      {previousChildren && (
        <div className="page-flipper-content flipping-out" key={previousPathname.current}>
          {previousChildren}
        </div>
      )}
      <div className="page-flipper-content" key={pathname}>
        {displayChildren}
      </div>
    </div>
  );
}
