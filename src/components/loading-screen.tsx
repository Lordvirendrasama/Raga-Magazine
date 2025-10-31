
import { Logo } from './logo';
import { Music, Music2, Music3, Music4 } from 'lucide-react';
import React from 'react';

const noteTypes = [
  { Icon: Music, baseSize: 6 },
  { Icon: Music2, baseSize: 7 },
  { Icon: Music3, baseSize: 5 },
  { Icon: Music4, baseSize: 8 },
];

const noteCount = 20;

const LoadingScreen = () => {
  const notes = Array.from({ length: noteCount }).map((_, i) => {
    const { Icon, baseSize } = noteTypes[i % noteTypes.length];
    const size = Math.random() * 4 + baseSize;
    const style = {
      left: `${Math.random() * 100}vw`,
      width: `${size}px`,
      height: `${size}px`,
      animationDuration: `${Math.random() * 5 + 5}s`,
      animationDelay: `${Math.random() * 5}s`,
    };
    return { Icon, style };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden">
      <div className="light-sweep-logo animate-breathing-logo z-10">
        <Logo className="w-48 md:w-56 h-auto text-foreground" />
      </div>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {notes.map(({ Icon, style }, index) => (
          <Icon
            key={index}
            className="absolute bottom-[-20px] text-primary animate-float-up"
            style={style}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;
