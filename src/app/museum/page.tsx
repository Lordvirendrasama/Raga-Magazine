
'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function MuseumPage() {
  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="mb-8 text-center md:mb-12">
        <h1 className="mb-4 font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          The Museum
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          This 3D experience is currently under construction.
        </p>
      </div>
      <div className="flex h-[50vh] w-full items-center justify-center bg-background">
        <Skeleton className="w-full h-full" />
      </div>
    </div>
  );
}
