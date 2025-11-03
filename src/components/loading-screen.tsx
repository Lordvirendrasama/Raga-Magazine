
'use client';

import { useState, useEffect } from 'react';
import { Logo } from './logo';
import { Music, Music2, Music3, Music4 } from 'lucide-react';
import { cn } from '@/lib/utils';

const noteIcons = [
  { Icon: Music, className: 'w-4 h-4' },
  { Icon: Music2, className: 'w-5 h-5' },
  { Icon: Music3, className: 'w-3 h-3' },
  { Icon: Music4, className: 'w-6 h-6' },
];

const noteCount = 40;

const LoadingScreen = () => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-background overflow-hidden">
        <div className="relative flex items-center justify-center">
            <div className="light-sweep-logo animate-breathing-logo">
                <Logo className="w-48 h-20" />
            </div>
        </div>
      </div>
    );
  }

  const notes = Array.from({ length: noteCount }).map((_, i) => {
    const { Icon, className } = noteIcons[i % noteIcons.length];
    const style = {
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 5 + 5}s`,
      animationDelay: `${Math.random() * 5}s`,
    };
    return <Icon key={i} className={cn('absolute text-primary/50 animate-float-up', className)} style={style} />;
  });

  return (
    <div className="flex items-center justify-center h-full w-full bg-background overflow-hidden">
      <div className="absolute inset-0 z-0 bottom-0">{notes}</div>
      <div className="relative z-10 flex items-center justify-center">
        <div className="light-sweep-logo animate-breathing-logo">
          <Logo className="w-48 h-20" />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
