import { DevTools } from "@/components/dev-tools";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DevToolsPage() {
  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="mb-8 text-center md:mb-12">
        <h1 className="mb-4 font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Developer Dashboard
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Tools for managing and testing your Firebase backend.
        </p>
      </div>
      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <DevTools />
      </Suspense>
    </div>
  );
}
