
'use client';

import { useState, useEffect, useRef } from 'react';
import { getMuseumContent, type MuseumWall } from '@/lib/museum-content';
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
      
      <a-text
        value={wall.text}
        color={colors.textColor}
        position="0 1.5 0.01"
        align="center"
        baseline="top"
        width="8"
        font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
      ></a-text>

      {youtubeId && (
        <a-entity ref={videoEntityRef} position="0 -1.25 0.01">
          <a-plane width="4" height="2.25" color="#000000"></a-plane>
          <a-image
            src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
            width="3.9"
            height="2.15"
            position="0 0 0.01"
          ></a-image>
          <a-image
            src="https://cdn.glitch.com/a5214015-23d5-4a25-9694-84c4711b712c%2Fyt-play-button.png?v=1614023245084"
            width="0.8"
            height="0.56"
            position="0 0 0.02"
            transparent="true"
          ></a-image>
        </a-entity>
      )}
    </a-entity>
  );
};


export default function MuseumPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [walls, setWalls] = useState<MuseumWall[]>([]);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
    getMuseumContent()
      .then(fetchedWalls => {
        setWalls(fetchedWalls);
      })
      .catch(err => {
        console.error("Failed to load museum content", err);
        setWalls([]); // Set to empty array on error
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  
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
      floorColor: resolvedTheme === 'dark' ? '#444' : '#C0C0C0',
      ceilingColor: resolvedTheme === 'dark' ? '#222' : '#E0E0E0',
      bgColor: resolvedTheme === 'dark' ? '#333' : '#ECECEC',
      wallColor: resolvedTheme === 'dark' ? '#111111' : '#F0F0F0',
      textColor: resolvedTheme === 'dark' ? '#FFFFFF' : '#000000',
  }

  const handlePlayVideo = (url: string) => {
    setVideoUrl(url);
  };

  return (
    <>
      <div className="h-[80vh] w-full">
        <a-scene embedded background={`color: ${colors.bgColor}`} vr-mode-ui="enabled: false">
          <a-camera position="0 2.2 0" wasd-controls="enabled: true; acceleration: 100;" look-controls="pointerLockEnabled: true"></a-camera>
          <a-light type="ambient" color="#888"></a-light>
          <a-light type="point" intensity="0.5" position="0 4 0"></a-light>
          
          <a-plane position="0 0 0" rotation="-90 0 0" width="20" height="20" color={colors.floorColor} material="shader: flat;"></a-plane>
          <a-plane position="0 6 0" rotation="90 0 0" width="20" height="20" color={colors.ceilingColor} material="shader: flat;"></a-plane>
          
          <a-entity id="content-container">
            {loading && (
                 <>
                    {wallConfigs.map((config, index) => (
                        <a-entity key={index} position={config.position} rotation={config.rotation}>
                            <a-plane width="10" height="6" color={colors.wallColor} material="shader: flat;"></a-plane>
                        </a-entity>
                    ))}
                 </>
            )}
            {!loading && walls.length > 0 && walls.map((wall, index) => (
                <MuseumWallComponent
                    key={wall.id}
                    wall={wall}
                    wallConfig={wallConfigs[index]}
                    colors={colors}
                    onPlayVideo={handlePlayVideo}
                />
            ))}
            {!loading && walls.length === 0 && (
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
