
'use client';

import { useEffect, useState, useRef } from 'react';
import { Music, Music2, Music3, Music4 } from 'lucide-react';
import { cn } from '@/lib/utils';

const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const setFromEvent = (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', setFromEvent);
        return () => {
            window.removeEventListener('mousemove', setFromEvent);
        };
    }
  }, []);

  return position;
};

const noteIcons = [
    { Icon: Music, className: 'w-4 h-4' },
    { Icon: Music2, className: 'w-5 h-5' },
    { Icon: Music3, className: 'w-3 h-3' },
    { Icon: Music4, className: 'w-4 h-4' },
];

const MIN_DISTANCE = 25; // The minimum distance the mouse has to travel to add a new note.

const MouseFollower = () => {
  const { x, y } = useMousePosition();
  const [points, setPoints] = useState<{ x: number; y: number; noteIndex: number }[]>([]);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);


  useEffect(() => {
    // Prevent execution on server
    if (typeof window === 'undefined') return;

    const lastPoint = lastPointRef.current;
    if (lastPoint) {
        const dx = x - lastPoint.x;
        const dy = y - lastPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < MIN_DISTANCE) {
            return;
        }
    }

    lastPointRef.current = { x, y };

    setPoints(prevPoints => {
        const newPoints = [...prevPoints, { x, y, noteIndex: prevPoints.length % noteIcons.length }];
        // Limit the number of points to prevent performance issues
        if (newPoints.length > 20) {
            newPoints.shift();
        }
        return newPoints;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [x, y]);
  
  // Render nothing on the server or if points are empty
  if (typeof window === 'undefined' || points.length === 0) {
      return null;
  }

  return (
    <>
      {points.map((point, index) => {
        const { Icon, className } = noteIcons[point.noteIndex];
        return (
            <Icon
              key={index}
              className={cn(
                'pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 text-primary transition-opacity duration-300 ease-out',
                className
              )}
              style={{
                left: `${point.x}px`,
                top: `${point.y}px`,
                opacity: (index / points.length),
              }}
            />
        )
      })}
    </>
  );
};

export default MouseFollower;
