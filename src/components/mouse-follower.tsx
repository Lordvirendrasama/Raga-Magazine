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
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      // Spring-like animation
      setCoords({
        x: coords.x + (x - coords.x) * 0.1,
        y: coords.y + (y - coords.y) * 0.1,
      });
    });
    return () => cancelAnimationFrame(animationFrame);
  }, [x, y, coords]);

  return (
    <div
      style={{ left: `${coords.x}px`, top: `${coords.y}px` }}
      className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2"
    >
       <svg
        width="50"
        height="50"
        viewBox="0 0 54 133"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M26.9999 53.7547C22.6999 53.7547 18.9999 55.6047 18.9999 59.9047C18.9999 64.2047 22.6999 67.9047 26.9999 67.9047C31.2999 67.9047 34.9999 64.2047 34.9999 59.9047C34.9999 55.6047 31.2999 53.7547 26.9999 53.7547ZM26.9999 70.0047C17.5999 70.0047 12.9999 62.1047 12.9999 59.9047C12.9999 54.7047 19.5999 49.6047 26.9999 49.6047C34.3999 49.6047 40.9999 54.7047 40.9999 59.9047C40.9999 62.1047 36.3999 70.0047 26.9999 70.0047Z"
          fill="black"
        />
        <path
          d="M33.4 125.1C33.4 124.5 34.3 124.2 34.3 123.3C34.3 122.4 33.7 121.5 32.2 121.5C30.7 121.5 29.8 122.4 29.8 123.6C29.8 124.8 30.7 125.7 32.2 125.7C32.9 125.7 33.4 125.4 33.4 125.1Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M27 0.904724C16.2 0.904724 5.4 11.7047 5.4 22.5047C5.4 33.3047 16.2 44.1047 27 44.1047C37.8 44.1047 48.6 33.3047 48.6 22.5047C48.6 11.7047 37.8 0.904724 27 0.904724ZM27 38.4047C19.2 38.4047 11.4 31.2047 11.4 22.5047C11.4 13.8047 19.2 6.60472 27 6.60472C34.8 6.60472 42.6 13.8047 42.6 22.5047C42.6 31.2047 34.8 38.4047 27 38.4047Z"
          fill="black"
        />
        <path
          d="M40.1 23.4047C40.1 23.4047 40.4 23.1047 40.1 22.8047C39.8 22.5047 37.2 21.3047 35.7 21.3047C33.6 21.3047 31.8 23.1047 31.8 25.2047C31.8 27.6047 33.3 29.4047 35.4 29.4047C37.8 29.4047 40.1 27.3047 40.1 23.4047Z"
          fill="black"
        />
        <path
          d="M31.2 123.6C31.2 128.4 29.4 132.9 27 132.9C24.6 132.9 22.8 128.4 22.8 123.6C22.8 118.8 24.6 114.3 27 114.3C29.4 114.3 31.2 118.8 31.2 123.6Z"
          fill="black"
        />
        <path
          d="M27 50.1047C26.7 50.1047 26.7 50.1047 26.7 50.1047C26.4 49.8047 26.4 49.8047 26.4 49.8047V45.9047H27.6V49.8047C27.6 49.8047 27.3 50.1047 27 50.1047Z"
          fill="black"
        />
        <path
          d="M27 114.3C27 114.3 27.3 114.3 27.3 114V69.3047H26.7V114C26.7 114.3 27 114.3 27 114.3Z"
          fill="black"
        />
      </svg>
    </div>
  );
};

export default MouseFollower;
