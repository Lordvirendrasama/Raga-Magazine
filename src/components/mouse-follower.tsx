
'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
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

const MIN_DISTANCE = 25;
const NOTE_LIFETIME = 1500; // 1.5 seconds in milliseconds

type Point = {
  x: number;
  y: number;
  noteIndex: number;
  timestamp: number;
};

const MouseFollower = () => {
  const { x, y } = useMousePosition();
  const [points, setPoints] = useState<Point[]>([]);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const animationFrameRef = useRef<number>();

  // Add new points based on mouse movement
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
        const randomNoteIndex = Math.floor(Math.random() * noteIcons.length);
        const newPoint: Point = { x, y, noteIndex: randomNoteIndex, timestamp: Date.now() };
        return [...prevPoints, newPoint];
    });
  }, [x, y]);

  // Animation loop to update and remove old points
  const animateTrail = useCallback(() => {
    setPoints(currentPoints => {
      const now = Date.now();
      const newPoints = currentPoints.filter(p => now - p.timestamp < NOTE_LIFETIME);
      return newPoints;
    });
    animationFrameRef.current = requestAnimationFrame(animateTrail);
  }, []);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(animateTrail);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animateTrail]);
  
  // Render nothing on the server
  if (typeof window === 'undefined') {
      return null;
  }

  return (
    <>
      {points.map((point, index) => {
        const { Icon, className } = noteIcons[point.noteIndex];
        const age = Date.now() - point.timestamp;
        const opacity = 1 - (age / NOTE_LIFETIME);

        return (
            <Icon
              key={index}
              className={cn(
                'pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 text-primary transition-opacity duration-100 ease-linear',
                className
              )}
              style={{
                left: `${point.x}px`,
                top: `${point.y}px`,
                opacity: Math.max(0, opacity),
              }}
            />
        )
      })}
    </>
  );
};

export default MouseFollower;
