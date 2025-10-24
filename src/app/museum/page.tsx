
'use client';

// Note: The 3D canvas has been temporarily replaced with a 2D representation
// to resolve a critical rendering error.

export default function MuseumPage() {
  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="mb-8 text-center md:mb-12">
        <h1 className="mb-4 font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          The Museum
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          An interactive exhibit of legendary musicians.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border-4 border-dashed border-muted-foreground/50 rounded-lg p-8 flex items-center justify-center h-96">
            <p className="text-muted-foreground text-center">Wall 1: Artist content will be displayed here.</p>
        </div>
         <div className="border-4 border-dashed border-muted-foreground/50 rounded-lg p-8 flex items-center justify-center h-96">
            <p className="text-muted-foreground text-center">Wall 2: Artist content will be displayed here.</p>
        </div>
         <div className="border-4 border-dashed border-muted-foreground/50 rounded-lg p-8 flex items-center justify-center h-96">
            <p className="text-muted-foreground text-center">Wall 3: Artist content will be displayed here.</p>
        </div>
         <div className="border-4 border-dashed border-muted-foreground/50 rounded-lg p-8 flex items-center justify-center h-96">
            <p className="text-muted-foreground text-center">Wall 4: Artist content will be displayed here.</p>
        </div>
      </div>
    </div>
  );
}
