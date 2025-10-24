
'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const MuseumScene = dynamic(
  () => import('@/components/museum-scene').then((mod) => mod.MuseumScene),
  {
    ssr: false,
    loading: () => (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="w-full h-full">
                <Skeleton className="w-full h-full" />
            </div>
        </div>
    ),
  }
);

export default function MuseumPage() {
  return (
    <div className="h-screen w-full">
        <MuseumScene />
    </div>
  );
}
