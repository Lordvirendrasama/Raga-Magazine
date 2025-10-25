
'use client';

import { useState, useEffect } from 'react';
import MuseumClientPage from './museum-client-page';
import { getMuseumContent, type MuseumWall } from '@/lib/museum-content';
import { Skeleton } from '@/components/ui/skeleton';

export default function MuseumPage() {
  const [walls, setWalls] = useState<MuseumWall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWalls() {
      try {
        const content = await getMuseumContent();
        if (content && content.length > 0) {
          setWalls(content);
        } else {
          setError('Could not load museum content.');
        }
      } catch (e) {
        console.error('Failed to fetch museum content:', e);
        setError('An error occurred while fetching museum content.');
      } finally {
        setLoading(false);
      }
    }
    fetchWalls();
  }, []);

  if (loading) {
    return (
      <div className="h-[80vh] w-full flex items-center justify-center bg-muted">
        <div className="text-center">
            <Skeleton className="w-64 h-64" />
            <p className="mt-4 text-muted-foreground">Loading 3D Museum...</p>
        </div>
      </div>
    );
  }

  if (error) {
     return (
        <div className="h-[80vh] w-full flex items-center justify-center bg-muted">
            <div className="text-center">
                <p className="text-destructive font-bold">Error</p>
                <p className="text-muted-foreground">{error}</p>
            </div>
        </div>
     );
  }

  return <MuseumClientPage initialWalls={walls} />;
}
