'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const TrebleClefIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        className={cn("h-8 w-8 text-primary", className)}
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M12.51,2.022c-2.934,0.481-5.188,2.24-6.07,5.524c-1.2,4.48,0.73,8.31,4.44,10.37c0.34,0.19,0.72,0.28,1.1,0.28c0.88,0,1.72-0.45,2.18-1.25c0.8-1.38-0.01-3.25-1.39-4.04c-0.34-0.2-0.72-0.29-1.1-0.29c-0.88,0-1.72,0.45-2.18,1.25c-0.41,0.71-0.36,1.58,0.11,2.24c0.16,0.22,0.37,0.4,0.6,0.52c-2.1-1.28-3.23-3.8-2.45-6.32c0.81-2.61,3.2-4.14,5.49-4.14c0.4,0,0.8,0.06,1.19,0.19c3.09,0.98,4.56,4.72,3.48,7.9c-0.14,0.4-0.21,0.82-0.21,1.24c0,3.38,2.74,6.12,6.12,6.12c0.41,0,0.81-0.04,1.2-0.12c-0.43,1.38-1.43,2.47-2.73,3.01c-0.13,0.05-0.26,0.1-0.4,0.15c-3.3,1.19-6.85,0.42-9.31-2.1c-2.47-2.53-3.2-6.22-1.9-9.67C10.12,6.8,12.42,4.98,15.17,4.34c0.19-0.04,0.38-0.08,0.57-0.11C15.22,2.83,13.88,2.052,12.51,2.022z" />
    </svg>
);


export function MouseFollower() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [smoothedPosition, setSmoothedPosition] = useState({ x: -100, y: -100 });
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


    let animationFrameId: number;

    const animate = () => {
      setSmoothedPosition(current => {
        const newX = current.x + (position.x - current.x) * 0.1;
        const newY = current.y + (position.y - current.y) * 0.1;
        return { x: newX, y: newY };
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible, position.x, position.y]);

  return (
    <div
      className={cn(
        'pointer-events-none fixed z-50 transition-transform duration-100 ease-in-out',
        'transform-gpu',
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
      style={{
        left: `${smoothedPosition.x}px`,
        top: `${smoothedPosition.y}px`,
        transform: `translate(-50%, -50%) scale(${isClicked ? 0.8 : 1})`,
      }}
    >
      <TrebleClefIcon />
    </div>
  );
}
