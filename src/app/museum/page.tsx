
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

    // Use CSS variables defined in globals.css
    const wallColor = getComputedStyle(document.documentElement).getPropertyValue('--museum-wall').trim();
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--museum-text').trim();
    
    const contentContainer = sceneEl.querySelector('#content-container');
    if (contentContainer) {
      // Clear previous content to prevent duplicates on theme change
      while (contentContainer.firstChild) {
        contentContainer.removeChild(contentContainer.firstChild);
      }
    } else {
        return; // Container not ready
    }

    const handlePlayVideo = (url: string) => {
        setVideoUrl(url);
    };
    
    setLoading(true);
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

                // Wall Plane (acts as a backboard)
                const plane = document.createElement('a-plane');
                plane.setAttribute('width', '10');
                plane.setAttribute('height', '4');
                plane.setAttribute('color', wallColor);
                plane.setAttribute('material', 'shader: flat;');
                wallEntity.appendChild(plane);

                // Image
                const image = document.createElement('a-image');
                image.setAttribute('src', wallData.imageUrl);
                image.setAttribute('width', '3');
                image.setAttribute('height', '2.25');
                image.setAttribute('position', '-3 0.5 0.01');
                image.setAttribute('data-ai-hint', wallData.imageHint || 'music artist');
                wallEntity.appendChild(image);

                // Artist Name Text
                const artistName = document.createElement('a-text');
                artistName.setAttribute('value', wallData.artistName);
                artistName.setAttribute('color', textColor);
                artistName.setAttribute('position', '1.5 1.5 0.01');
                artistName.setAttribute('align', 'center');
                artistName.setAttribute('width', '4');
                artistName.setAttribute('font', 'https://cdn.aframe.io/fonts/Exo2Bold.fnt');
                wallEntity.appendChild(artistName);
                
                // Artist Description Text
                const artistDesc = document.createElement('a-text');
                artistDesc.setAttribute('value', wallData.artistDescription);
                artistDesc.setAttribute('color', textColor);
                artistDesc.setAttribute('position', '1.5 0.5 0.01');
                artistDesc.setAttribute('align', 'left');
                artistDesc.setAttribute('baseline', 'top');
                artistDesc.setAttribute('width', '3.5');
                artistDesc.setAttribute('wrap-count', '40');
                artistDesc.setAttribute('font', 'https://cdn.aframe.io/fonts/Roboto-msdf.json');
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
                    // A generic thumbnail, you could extract this from youtube ID later if needed.
                    videoThumb.setAttribute('src', 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg');
                    videoThumb.setAttribute('width', '1.9');
                    videoThumb.setAttribute('height', '1.025');
                    videoThumb.setAttribute('position', '0 0 0.01');
                    videoEntity.appendChild(videoThumb);
                    
                    const playButton = document.createElement('a-image');
                    playButton.setAttribute('src', 'https://cdn.glitch.com/a5214015-23d5-4a25-9694-84c4711b712c%2Fyt-play-button.png?v=1614023245084');
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
        const errorText = document.createElement('a-text');
        errorText.setAttribute('value', 'Error: Could not load content.');
        errorText.setAttribute('color', 'red');
        errorText.setAttribute('position', '0 1.6 -3');
        errorText.setAttribute('align', 'center');
        contentContainer.appendChild(errorText);
    });

  }, [isMounted, resolvedTheme]);

  if (!isMounted) {
    return (
        <div className="h-[80vh] w-full flex items-center justify-center bg-muted">
            <Skeleton className="w-3/4 h-3/4" />
        </div>
    );
  }

  const floorColor = resolvedTheme === 'dark' ? '#444' : '#C0C0C0';
  const ceilingColor = resolvedTheme === 'dark' ? '#222' : '#E0E0E0';
  const bgColor = resolvedTheme === 'dark' ? '#333' : '#ECECEC';

  return (
    <>
      <div className="h-[80vh] w-full">
        <a-scene ref={sceneRef} embedded background={`color: ${bgColor}`} vr-mode-ui="enabled: false">
          <a-camera position="0 1.6 0" wasd-controls="enabled: true; acceleration: 40;" look-controls="pointerLockEnabled: true"></a-camera>
          <a-light type="ambient" color="#888"></a-light>
          <a-light type="point" intensity="0.5" position="0 3 0"></a-light>
          
          <a-plane position="0 0 0" rotation="-90 0 0" width="20" height="20" color={floorColor} material="shader: flat;"></a-plane>
          <a-plane position="0 4 0" rotation="90 0 0" width="20" height="20" color={ceilingColor} material="shader: flat;"></a-plane>
          
          <a-entity id="content-container">
            {/* Content will be injected here by useEffect */}
            {loading && (
                 <>
                    <a-entity position="0 2 -5" rotation="0 0 0"><a-plane width="10" height="4" color="var(--museum-wall)" material="shader: flat;"></a-plane></a-entity>
                    <a-entity position="5 2 0" rotation="0 -90 0"><a-plane width="10" height="4" color="var(--museum-wall)" material="shader: flat;"></a-plane></a-entity>
                    <a-entity position="0 2 5" rotation="0 180 0"><a-plane width="10" height="4" color="var(--museum-wall)" material="shader: flat;"></a-plane></a-entity>
                    <a-entity position="-5 2 0" rotation="0 90 0"><a-plane width="10" height="4" color="var(--museum-wall)" material="shader: flat;"></a-plane></a-entity>
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
