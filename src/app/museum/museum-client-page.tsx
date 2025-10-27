
'use client';

import { useState, useEffect } from 'react';
import { type MuseumWall } from '@/lib/museum-content';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const MuseumWallComponent = ({ wall, onPlayVideo }: { wall: MuseumWall; onPlayVideo: (url: string) => void }) => {
  let youtubeId = '';
  if (wall.youtubeUrl && wall.youtubeUrl.includes('embed')) {
    try {
      const url = new URL(wall.youtubeUrl);
      const pathParts = url.pathname.split('/');
      const idFromUrl = pathParts[pathParts.length - 1];
      if (idFromUrl) youtubeId = idFromUrl;
    } catch (e) {
      youtubeId = 'dQw4w9WgXcQ'; // Fallback
    }
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8 rounded-lg border bg-card p-6 shadow-lg md:flex-row">
      {youtubeId && (
        <div 
          className="group relative h-48 w-full cursor-pointer overflow-hidden rounded-md md:h-64 md:w-1/2"
          onClick={() => onPlayVideo(wall.youtubeUrl)}
        >
          <Image
            src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
            alt={`Video thumbnail for ${wall.text.substring(0, 20)}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30 transition-opacity group-hover:bg-black/10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-red-600/80 p-3 text-white transition-transform group-hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>
            </div>
          </div>
        </div>
      )}
      <p className="text-muted-foreground md:w-1/2">{wall.text}</p>
    </div>
  );
};

export default function MuseumClientPage({ initialWalls }: { initialWalls: MuseumWall[] }) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [currentWall, setCurrentWall] = useState(0);

  const wallRotations = [0, -90, -180, -270];

  const showNextWall = () => {
    setCurrentWall((prev) => (prev + 1) % initialWalls.length);
  };

  const showPrevWall = () => {
    setCurrentWall((prev) => (prev - 1 + initialWalls.length) % initialWalls.length);
  };
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') showNextWall();
        if (e.key === 'ArrowLeft') showPrevWall();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlayVideo = (url: string) => {
    setVideoUrl(url);
  };

  return (
    <>
      <div className="flex h-[80vh] flex-col items-center justify-center overflow-hidden bg-background p-4">
        <div className="scene h-[50vh] w-[60vw] max-w-[800px]">
          <div
            className="cube"
            style={{ transform: `translateZ(-30vw) rotateY(${wallRotations[currentWall]}deg)` }}
          >
            {initialWalls.map((wall, index) => (
              <div key={wall.id} className={cn('cube__face', `cube__face--${['front', 'right', 'back', 'left'][index]}`)}>
                <MuseumWallComponent wall={wall} onPlayVideo={handlePlayVideo} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4">
          <Button onClick={showPrevWall} variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous Wall</span>
          </Button>
          <span className="text-sm text-muted-foreground">
            Wall {currentWall + 1} of {initialWalls.length}
          </span>
          <Button onClick={showNextWall} variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next Wall</span>
          </Button>
        </div>
      </div>

      <Dialog open={!!videoUrl} onOpenChange={() => setVideoUrl(null)}>
        <DialogContent className="h-[70vh] max-w-4xl p-0">
          {videoUrl && (
            <iframe
              width="100%"
              height="100%"
              src={`${videoUrl}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen>
            </iframe>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
