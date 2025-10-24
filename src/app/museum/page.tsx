
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const walls = [
  { id: 1, title: 'Wall 1: The Pioneers', content: 'Details about pioneer musicians will be displayed here.' },
  { id: 2, title: 'Wall 2: The Innovators', content: 'Details about innovator musicians will be displayed here.' },
  { id: 3, title: 'Wall 3: The Vocalists', content: 'Details about vocalists will be displayed here.' },
  { id: 4, title: 'Wall 4: The Instrumentalists', content: 'Details about instrumentalists will be displayed here.' },
];

export default function MuseumPage() {
  const [rotationY, setRotationY] = useState(0);

  const handleNext = () => {
    setRotationY((prev) => prev - 90);
  };

  const handlePrev = () => {
    setRotationY((prev) => prev + 90);
  };

  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center bg-black p-4">
        <h2 className="mb-4 font-headline text-3xl font-bold text-white">The Raga Museum</h2>
      <div className="scene h-[50vh] w-[60vw] max-w-[800px]">
        <div
          className="cube"
          style={{ transform: `rotateY(${rotationY}deg)` }}
        >
          {walls.map((wall, index) => (
            <div
              key={wall.id}
              className={cn('cube__face', {
                'cube__face--front': index === 0,
                'cube__face--right': index === 1,
                'cube__face--back': index === 2,
                'cube__face--left': index === 3,
              })}
            >
              <div className="flex h-full w-full flex-col items-center justify-center rounded-lg border-2 border-primary/50 bg-card p-4 text-center text-card-foreground">
                <h3 className="font-headline text-2xl font-bold text-primary">{wall.title}</h3>
                <p className="mt-4 text-muted-foreground">{wall.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 flex gap-4">
        <Button onClick={handlePrev} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous Wall
        </Button>
        <Button onClick={handleNext} variant="outline">
          Next Wall <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">Use the buttons to navigate the museum.</p>
    </div>
  );
}
