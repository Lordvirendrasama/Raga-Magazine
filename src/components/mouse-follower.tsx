'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const MusicNoteIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 32 32"
        className={cn("h-8 w-8 text-primary", className)}
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M20.24,2.22A10.15,10.15,0,0,0,12,11.69V23.4a4.3,4.3,0,1,0,3,4.1V12.06a7.15,7.15,0,0,1,5.25-6.84,7.2,7.2,0,0,1,8,7.1,7.08,7.08,0,0,1-7.16,7.29H21a1,1,0,0,0,0,2h.1A9.08,9.08,0,0,0,30,12.32,9.15,9.15,0,0,0,20.24,2.22ZM13,29.5a2.3,2.3,0,1,1,2.3-2.3A2.3,2.3,0,0,1,13,29.5Z" />
    </svg>
);


export function MouseFollower() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) {
        setIsVisible(true);
      }
    };

    const handleMouseDown = () => {
        setIsClicked(true);
    }

    const handleMouseUp = () => {
        setIsClicked(false);
    }
    
    const handleMouseLeave = () => {
        setIsVisible(false);
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);


    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  return (
    <div
      className={cn(
        'pointer-events-none fixed z-50 transition-transform duration-100 ease-in-out',
        'transform-gpu',
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `translate(-50%, -50%) scale(${isClicked ? 0.8 : 1})`,
      }}
    >
      <MusicNoteIcon className="h-10 w-10 text-primary/80 drop-shadow-lg" />
    </div>
  );
}
