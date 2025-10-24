
'use client';

import { useEffect, useState } from 'react';

const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const setFromEvent = (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', setFromEvent);
    return () => {
      window.removeEventListener('mousemove', setFromEvent);
    };
  }, []);

  return position;
};

const MouseFollower = () => {
  const { x, y } = useMousePosition();
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    // Use a functional update to avoid depending on `points` in the dependency array
    setPoints(prevPoints => {
        const newPoints = [...prevPoints, { x, y }];
        if (newPoints.length > 10) {
            newPoints.shift();
        }
        return newPoints;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [x, y]);

  return (
    <>
      {points.map((point, index) => (
        <div
          key={index}
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary transition-transform duration-300 ease-out"
          style={{
            left: `${point.x}px`,
            top: `${point.y}px`,
            width: `${10 - index}px`,
            height: `${10 - index}px`,
            opacity: (index + 1) / 10,
            transform: `scale(${(index + 1) / 10})`,
          }}
        />
      ))}
    </>
  );
};

export default MouseFollower;
