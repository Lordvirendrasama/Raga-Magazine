
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const walls = [
  { id: 'front', title: 'Wall 1: The Pioneers' },
  { id: 'right', title: 'Wall 2: The Innovators' },
  { id: 'back', title: 'Wall 3: The Vocalists' },
  { id: 'left', title: 'Wall 4: The Instrumentalists' },
];

export default function MuseumPage() {
  const [rotation, setRotation] = useState(0);

  const handleNext = () => {
    setRotation((prev) => prev - 90);
  };

  const handlePrev = () => {
    setRotation((prev) => prev + 90);
  };

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center overflow-hidden bg-background p-4">
      <div className="mb-8 text-center">
        <h1 className="mb-2 font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          The Museum
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          An interactive exhibit of legendary musicians. Use the arrows to navigate.
        </p>
      </div>

      <div className="scene h-[50vh] w-full max-w-4xl">
        <div
          className="cube"
          style={{ transform: `translateZ(-30vw) rotateY(${rotation}deg)` }}
        >
          {walls.map((wall) => (
            <div key={wall.id} className={cn('cube__face', `cube__face--${wall.id}`)}>
              <div className="flex h-full flex-col items-center justify-center rounded-lg border-4 border-dashed border-muted-foreground/50 bg-card/80 p-8">
                <h2 className="font-headline text-2xl font-bold text-foreground">{wall.title}</h2>
                <p className="mt-4 text-center text-muted-foreground">Artist content will be displayed here.</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <Button onClick={handlePrev} size="lg">
          <ArrowLeft className="mr-2 h-5 w-5" /> Previous Wall
        </Button>
        <Button onClick={handleNext} size="lg">
          Next Wall <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
