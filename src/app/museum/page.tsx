
'use client';

import { useState, useEffect } from 'react';
import MuseumClientPage from './museum-client-page';
import { getMuseumContent, type MuseumWall } from '@/lib/museum-content';
import { Progress } from '@/components/ui/progress';

export default function MuseumPage() {
  const [walls, setWalls] = useState<MuseumWall[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWalls() {
      try {
        setLoading(true);
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
      <div className="h-[80vh] w-full flex items-center justify-center bg-background">
        <div className="w-1/2 max-w-sm text-center">
            <Progress value={50} className="w-full" />
            <p className="mt-4 text-muted-foreground">Loading Museum...</p>
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
