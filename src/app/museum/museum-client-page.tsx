
'use client';

import { useState, useEffect } from 'react';
import { type MuseumWall } from '@/lib/museum-content';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const MuseumWallComponent = ({ wall }: { wall: MuseumWall }) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8 rounded-lg border bg-card p-6 shadow-lg">
      <p className="text-muted-foreground text-center">{wall.text}</p>
    </div>
  );
};

export default function MuseumClientPage({ initialWalls }: { initialWalls: MuseumWall[] }) {
  const [currentWall, setCurrentWall] = useState(0);
  const wallRotations = [0, -90, -180, -270];

  const showNextWall = () => {
    setCurrentWall((prev) => (prev + 1) % initialWalls.length);
  };

  const showPrevWall = () => {
    setCurrentWall((prev) => (prev - 1 + initialWalls.length) % initialWalls.length);
  };
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') showNextWall();
        if (e.key === 'ArrowLeft') showPrevWall();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex h-[80vh] flex-col items-center justify-center overflow-hidden bg-background p-4">
        <div className="scene h-[50vh] w-[60vw] max-w-[800px]">
          <div
            className="cube"
            style={{ transform: `translateZ(-30vw) rotateY(${wallRotations[currentWall]}deg)` }}
          >
            {initialWalls.map((wall, index) => (
              <div key={wall.id} className={cn('cube__face', `cube__face--${['front', 'right', 'back', 'left'][index]}`)}>
                <MuseumWallComponent wall={wall} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4">
          <Button onClick={showPrevWall} variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous Wall</span>
          </Button>
          <span className="text-sm text-muted-foreground">
            Wall {currentWall + 1} of {initialWalls.length}
          </span>
          <Button onClick={showNextWall} variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next Wall</span>
          </Button>
        </div>
      </div>
    </>
  );
}
