
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
    }
  }
}

export default function MuseumPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const sceneRef = useRef<any>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !resolvedTheme) {
        return;
    }

    const sceneEl = sceneRef.current;
    if (!sceneEl) return;

    const wallColor = resolvedTheme === 'dark' ? '#111111' : '#F0F0F0';
    const textColor = resolvedTheme === 'dark' ? '#FFFFFF' : '#000000';
    
    // Clear previous content
    const contentContainer = sceneEl.querySelector('#content-container');
    if (contentContainer) {
      while (contentContainer.firstChild) {
        contentContainer.removeChild(contentContainer.firstChild);
      }
    } else {
        return; // Container not ready
    }

    const handlePlayVideo = (url: string) => {
        setVideoUrl(url);
    };

    getMuseumContent().then(walls => {
        setLoading(false);
        if (walls.length === 4) {
            const wallConfigs = [
                { position: '0 2 -5', rotation: '0 0 0' },   // Front
                { position: '5 2 0', rotation: '0 -90 0' },  // Right
                { position: '0 2 5', rotation: '0 180 0' }, // Back
                { position: '-5 2 0', rotation: '0 90 0' },  // Left
            ];

            walls.forEach((wallData, index) => {
                const config = wallConfigs[index];
                const wallEntity = document.createElement('a-entity');
                wallEntity.setAttribute('position', config.position);
                wallEntity.setAttribute('rotation', config.rotation);

                // Wall Plane
                const plane = document.createElement('a-plane');
                plane.setAttribute('width', '10');
                plane.setAttribute('height', '4');
                plane.setAttribute('color', wallColor);
                plane.setAttribute('material', 'side: double');
                wallEntity.appendChild(plane);

                // Image
                const image = document.createElement('a-image');
                image.setAttribute('src', wallData.imageUrl);
                image.setAttribute('width', '3');
                image.setAttribute('height', '2.25');
                image.setAttribute('position', '-3 0.5 0.01');
                image.setAttribute('data-ai-hint', wallData.imageHint);
                wallEntity.appendChild(image);

                // Artist Name Text
                const artistName = document.createElement('a-text');
                artistName.setAttribute('value', wallData.artistName);
                artistName.setAttribute('color', textColor);
                artistName.setAttribute('position', '1.5 1.2 0.01');
                artistName.setAttribute('align', 'center');
                artistName.setAttribute('width', '4');
                wallEntity.appendChild(artistName);
                
                // Artist Description Text
                const artistDesc = document.createElement('a-text');
                artistDesc.setAttribute('value', wallData.artistDescription);
                artistDesc.setAttribute('color', textColor);
                artistDesc.setAttribute('position', '1.5 0.2 0.01');
                artistDesc.setAttribute('align', 'left');
                artistDesc.setAttribute('width', '3.5');
                artistDesc.setAttribute('wrap-count', '40');
                wallEntity.appendChild(artistDesc);
                
                // YouTube Video Placeholder
                if (wallData.youtubeUrl && wallData.youtubeUrl.includes('embed')) {
                    const videoEntity = document.createElement('a-entity');
                    videoEntity.setAttribute('position', '1.5 -1.1 0.01');

                    const videoBg = document.createElement('a-plane');
                    videoBg.setAttribute('width', '2');
                    videoBg.setAttribute('height', '1.125');
                    videoBg.setAttribute('color', '#000000');
                    videoEntity.appendChild(videoBg);
                    
                    const videoThumb = document.createElement('a-image');
                    videoThumb.setAttribute('src', 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg');
                    videoThumb.setAttribute('width', '1.9');
                    videoThumb.setAttribute('height', '1.025');
                    videoThumb.setAttribute('position', '0 0 0.01');
                    videoEntity.appendChild(videoThumb);
                    
                    const playButton = document.createElement('a-image');
                    playButton.setAttribute('src', 'https://www.transparentpng.com/thumb/youtube-play-button/youtube-play-button-png-image-free-download-27.png');
                    playButton.setAttribute('width', '0.5');
                    playButton.setAttribute('height', '0.35');
                    playButton.setAttribute('position', '0 0 0.02');
                    playButton.setAttribute('transparent', 'true');
                    videoEntity.appendChild(playButton);

                    videoEntity.addEventListener('click', () => handlePlayVideo(wallData.youtubeUrl));
                    wallEntity.appendChild(videoEntity);
                }

                contentContainer.appendChild(wallEntity);
            });
        } else {
             // Handle error case
            const errorText = document.createElement('a-text');
            errorText.setAttribute('value', 'Could not load museum content.');
            errorText.setAttribute('color', textColor);
            errorText.setAttribute('position', '0 1.6 -3');
            errorText.setAttribute('align', 'center');
            errorText.setAttribute('width', '4');
            contentContainer.appendChild(errorText);
        }
    }).catch(err => {
        setLoading(false);
        console.error("Failed to load and render museum content", err);
    });

  }, [isMounted, resolvedTheme]);

  if (!isMounted) {
    return (
        <div className="h-[80vh] w-full flex items-center justify-center bg-muted">
            <Skeleton className="w-3/4 h-3/4" />
        </div>
    );
  }

  const wallColor = resolvedTheme === 'dark' ? '#111111' : '#F0F0F0';
  const floorColor = resolvedTheme === 'dark' ? '#444' : '#C0C0C0';
  const ceilingColor = resolvedTheme === 'dark' ? '#222' : '#E0E0E0';
  const bgColor = resolvedTheme === 'dark' ? '#333' : '#ECECEC';

  return (
    <>
      <div className="h-[80vh] w-full">
        <a-scene ref={sceneRef} embedded background={`color: ${bgColor}`}>
          <a-camera position="0 1.6 0"></a-camera>
          <a-light type="ambient" color="#888"></a-light>
          <a-light type="point" intensity="0.5" position="0 3 0"></a-light>
          <a-plane position="0 0 0" rotation="-90 0 0" width="20" height="20" color={floorColor}></a-plane>
          <a-plane position="0 4 0" rotation="90 0 0" width="20" height="20" color={ceilingColor}></a-plane>
          
          <a-entity id="content-container">
            {/* Content will be injected here by useEffect */}
            {loading && (
                 <>
                    <a-plane width="10" height="4" position="0 2 -5" rotation="0 0 0" color={wallColor}></a-plane>
                    <a-plane width="10" height="4" position="5 2 0" rotation="0 -90 0" color={wallColor}></a-plane>
                    <a-plane width="10" height="4" position="0 2 5" rotation="0 180 0" color={wallColor}></a-plane>
                    <a-plane width="10" height="4" position="-5 2 0" rotation="0 90 0" color={wallColor}></a-plane>
                 </>
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
