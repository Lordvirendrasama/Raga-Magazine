
'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the 3D scene to ensure it only runs on the client-side.
// This is crucial for preventing server-side rendering errors with 3D libraries.
const MuseumScene = dynamic(() => import('@/components/museum-scene'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[80vh] items-center justify-center">
      <p className="text-lg text-muted-foreground">Loading Museum...</p>
    </div>
  ),
});

export default function MuseumPage() {
  return (
    <div className="relative h-[80vh] w-full cursor-pointer bg-black">
      <Suspense fallback={null}>
        <MuseumScene />
      </Suspense>
    </div>
  );
}
