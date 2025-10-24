
'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamically import the MuseumScene with SSR turned off
const MuseumScene = dynamic(() => import('@/components/museum-scene'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <Skeleton className="w-full h-full" />
    </div>
  ),
});

export default function MuseumPage() {
  return (
    <div className="h-[calc(100vh-4rem)] w-full">
      <div className="mb-8 text-center md:mb-12 absolute top-8 left-1/2 -translate-x-1/2 z-10">
        <h1 className="mb-4 font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          The Museum
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Click and drag to explore the room.
        </p>
      </div>
      <Suspense fallback={<Skeleton className="w-full h-full" />}>
        <MuseumScene />
      </Suspense>
    </div>
  );
}
