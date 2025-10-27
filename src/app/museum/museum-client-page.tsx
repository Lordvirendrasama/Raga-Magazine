
'use client';

import { useState, useEffect, useRef } from 'react';
import { type MuseumWall } from '@/lib/museum-content';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useTheme } from 'next-themes';
import { Skeleton } from '@/components/ui/skeleton';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': any;
      'a-camera': any;
      'a-entity': any;
      'a-light': any;
      'a-plane': any;
      'a-image': any;
      'a-text': any;
      'a-sky': any;
    }
  }
}

// Component to render a single wall
const MuseumWallComponent = ({ wall, wallConfig, colors, onPlayVideo }: { wall: MuseumWall, wallConfig: any, colors: any, onPlayVideo: (url: string) => void }) => {
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

  const videoEntityRef = useRef<any>(null);

  useEffect(() => {
    if (videoEntityRef.current && youtubeId) {
      const handler = () => onPlayVideo(wall.youtubeUrl);
      const el = videoEntityRef.current;
      el.addEventListener('click', handler);
      return () => {
        el.removeEventListener('click', handler);
      };
    }
  }, [wall.youtubeUrl, onPlayVideo, youtubeId]);

  return (
    <a-entity position={wallConfig.position} rotation={wallConfig.rotation}>
      <a-plane
        width="10"
        height="6"
        color={colors.wallColor}
        material="shader: flat;"
      ></a-plane>
      
      {/* Text on the right */}
       <a-entity
        text={`value: ${wall.text}; color: ${colors.textColor}; align: left; baseline: top; wrapCount: 35; width: 4.5;`}
        position="0.25 1.5 0.01"
      ></a-entity>

      {/* Video on the left */}
      {youtubeId && (
        <a-entity ref={videoEntityRef} position="-2.5 0 0.01">
          <a-plane width="4" height="2.25" color="#000000"></a-plane>
          <a-image
            src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
            width="3.9"
            height="2.15"
            position="0 0 0.01"
          ></a-image>
        </a-entity>
      )}
    </a-entity>
  );
};


export default function MuseumClientPage({ initialWalls, onLoaded }: { initialWalls: MuseumWall[], onLoaded: () => void }) {
  const [isMounted, setIsMounted] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const sceneRef = useRef<any>(null);

  useEffect(() => {
    setIsMounted(true);
    const sceneEl = sceneRef.current;
    if (sceneEl) {
      const handleLoaded = () => {
        onLoaded();
      };
      sceneEl.addEventListener('loaded', handleLoaded);
      return () => {
        sceneEl.removeEventListener('loaded', handleLoaded);
      };
    }
  }, [onLoaded]);
  
  if (!isMounted) {
    return (
        <div className="h-[80vh] w-full flex items-center justify-center bg-muted">
            <Skeleton className="w-3/4 h-3/4" />
        </div>
    );
  }

  const wallConfigs = [
    { position: '0 3 -5', rotation: '0 0 0' },   // Front
    { position: '5 3 0', rotation: '0 -90 0' },  // Right
    { position: '0 3 5', rotation: '0 180 0' }, // Back
    { position: '-5 3 0', rotation: '0 90 0' },  // Left
  ];

  const colors = {
      skyColor: resolvedTheme === 'dark' ? '#1A1A1A' : '#E0E0E0',
      wallColor: resolvedTheme === 'dark' ? '#111111' : '#F0F0F0',
      textColor: resolvedTheme === 'dark' ? '#FFFFFF' : '#000000',
  }

  const handlePlayVideo = (url: string) => {
    setVideoUrl(url);
  };

  return (
    <>
      <div className="h-[80vh] w-full">
        <a-scene ref={sceneRef} embedded vr-mode-ui="enabled: false">
          <a-camera position="0 2.2 0" wasd-controls="enabled: true; acceleration: 60;" look-controls="pointerLockEnabled: true"></a-camera>
          
          <a-sky color={colors.skyColor}></a-sky>
          <a-light type="ambient" color="#FFF" intensity="0.7"></a-light>
          
          <a-entity id="content-container">
            {initialWalls.length > 0 ? (
                initialWalls.map((wall, index) => (
                    <MuseumWallComponent
                        key={wall.id}
                        wall={wall}
                        wallConfig={wallConfigs[index]}
                        colors={colors}
                        onPlayVideo={handlePlayVideo}
                    />
                ))
            ) : (
                 <a-text value="Could not load museum content." color={colors.textColor} position="0 1.6 -3" align="center" width="4"></a-text>
            )}
          </a-entity>
        </a-scene>
      </div>
      <Dialog open={!!videoUrl} onOpenChange={() => setVideoUrl(null)}>
        <DialogContent className="max-w-4xl h-[70vh] p-0">
          {videoUrl && (
            <iframe
              width="100%"
              height="100%"
              src={videoUrl}
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
