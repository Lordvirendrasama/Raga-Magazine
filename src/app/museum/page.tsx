
'use client';

import { useState, useEffect } from 'react';
import MuseumClientPage from './museum-client-page';
import { getMuseumContent, type MuseumWall } from '@/lib/museum-content';
import { Progress } from '@/components/ui/progress';

export default function MuseumPage() {
  const [walls, setWalls] = useState<MuseumWall[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    async function fetchWalls() {
      try {
        setProgress(30);
        const content = await getMuseumContent();
        if (content && content.length > 0) {
          setWalls(content);
          setProgress(70);
        } else {
          setError('Could not load museum content.');
          setProgress(100);
        }
      } catch (e) {
        console.error('Failed to fetch museum content:', e);
        setError('An error occurred while fetching museum content.');
        setProgress(100);
      }
    }
    fetchWalls();
  }, []);

  const handleSceneLoaded = () => {
    setProgress(100);
  };
  
  const isLoading = progress < 100;

  if (isLoading) {
    return (
      <div className="h-[80vh] w-full flex items-center justify-center bg-background">
        <div className="w-1/2 max-w-sm text-center">
            <Progress value={progress} className="w-full" />
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

  return <MuseumClientPage initialWalls={walls} onLoaded={handleSceneLoaded} />;
}
