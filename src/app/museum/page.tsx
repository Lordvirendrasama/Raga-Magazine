
'use client';

import { useState, useEffect } from 'react';
import { getMuseumContent, type MuseumWall } from '@/lib/museum-content';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useTheme } from 'next-themes';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': any;
      'a-sky': any;
      'a-plane': any;
      'a-box': any;
      'a-camera': any;
      'a-entity': any;
      'a-text': any;
      'a-image': any;
      'a-light': any;
    }
  }
}

const Wall = ({ wallData, rotation, position, wallColor, textColor }: { wallData: MuseumWall; rotation: string; position: string; wallColor: string, textColor: string }) => {
    const hasVideo = wallData.youtubeUrl && wallData.youtubeUrl.includes('embed');

    const handleVideoClick = () => {
        if (!hasVideo) return;
        const event = new CustomEvent('play-video', { detail: wallData.youtubeUrl });
        window.dispatchEvent(event);
    }
    
    return (
        <a-entity position={position} rotation={rotation}>
            <a-plane width="10" height="4" color={wallColor} material="side: double"></a-plane>
            <a-image src={wallData.imageUrl} width="3" height="2.25" position="-3 0.5 0.01" data-ai-hint={wallData.imageHint}></a-image>
            <a-text 
                value={wallData.artistName} 
                color={textColor}
                position="1.5 1.2 0.01" 
                align="center"
                width="4">
            </a-text>
            <a-text 
                value={wallData.artistDescription}
                color={textColor}
                position="1.5 0.2 0.01" 
                align="left"
                width="3.5"
                wrap-count="40">
            </a-text>
             {hasVideo && (
                <a-entity onClick={handleVideoClick} position="1.5 -1.1 0.01" events={{ click: handleVideoClick }}>
                    <a-plane width="2" height="1.125" color="#000000"></a-plane>
                    <a-image src="https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg" width="1.9" height="1.025" position="0 0 0.01"></a-image>
                    <a-image src="https://www.transparentpng.com/thumb/youtube-play-button/youtube-play-button-png-image-free-download-27.png" width="0.5" height="0.35" position="0 0 0.02" transparent="true"></a-image>
                </a-entity>
            )}
        </a-entity>
    );
};

const SkeletonWall = ({ rotation, position, wallColor }: { rotation: string; position: string; wallColor: string; }) => {
    return (
        <a-entity position={position} rotation={rotation}>
            <a-plane width="10" height="4" color={wallColor} material="side: double"></a-plane>
            <a-box color="#DDD" width="3" height="2.25" position="-3 0.5 0.01"></a-box>
            <a-box color="#E5E5E5" width="2" height="0.3" position="1.5 1.2 0.01"></a-box>
            <a-box color="#E5E5E5" width="3" height="1" position="1.5 0.2 0.01"></a-box>
        </a-entity>
    );
}

export default function MuseumPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [walls, setWalls] = useState<MuseumWall[]>([]);
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  const [wallColor, setWallColor] = useState('#F0F0F0');
  const [textColor, setTextColor] = useState('#000000');

  useEffect(() => {
    setIsMounted(true);
    async function fetchContent() {
        try {
            setLoading(true);
            const content = await getMuseumContent();
            setWalls(content);
        } catch (error) {
            console.error("Failed to load museum content", error);
            setWalls([]);
        } finally {
            setLoading(false);
        }
    }
    fetchContent();

    const handlePlayVideo = (event: CustomEvent) => {
        setVideoUrl(event.detail);
    };

    window.addEventListener('play-video', handlePlayVideo as EventListener);

    return () => {
        window.removeEventListener('play-video', handlePlayVideo as EventListener);
    };

  }, []);

  useEffect(() => {
    if(resolvedTheme) {
        setWallColor(resolvedTheme === 'dark' ? '#111111' : '#F0F0F0');
        setTextColor(resolvedTheme === 'dark' ? '#FFFFFF' : '#000000');
    }
  }, [resolvedTheme]);

  if (!isMounted) {
    return null;
  }
  
  const sceneElements = (
      <>
        <a-camera position="0 1.6 0"></a-camera>
        <a-light type="ambient" color="#888"></a-light>
        <a-light type="point" intensity="0.5" position="0 3 0"></a-light>
        <a-plane position="0 0 0" rotation="-90 0 0" width="20" height="20" color={wallColor === '#111111' ? '#444' : '#C0C0C0'}></a-plane>
        <a-plane position="0 4 0" rotation="90 0 0" width="20" height="20" color={wallColor === '#111111' ? '#222' : '#E0E0E0'}></a-plane>
      </>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <>
            <SkeletonWall position="0 2 -5" rotation="0 0 0" wallColor={wallColor}/>
            <SkeletonWall position="5 2 0" rotation="0 -90 0" wallColor={wallColor}/>
            <SkeletonWall position="0 2 5" rotation="0 180 0" wallColor={wallColor}/>
            <SkeletonWall position="-5 2 0" rotation="0 90 0" wallColor={wallColor}/>
        </>
      );
    }
    if (walls.length === 4) {
      return (
        <>
          <Wall wallData={walls[0]} position="0 2 -5" rotation="0 0 0" wallColor={wallColor} textColor={textColor}/>
          <Wall wallData={walls[1]} position="5 2 0" rotation="0 -90 0" wallColor={wallColor} textColor={textColor}/>
          <Wall wallData={walls[2]} position="0 2 5" rotation="0 180 0" wallColor={wallColor} textColor={textColor}/>
          <Wall wallData={walls[3]} position="-5 2 0" rotation="0 90 0" wallColor={wallColor} textColor={textColor}/>
        </>
      );
    }
    return (
        <a-entity position="0 1.6 -3">
            <a-text value="Could not load museum content." color={textColor} align="center" width="4"></a-text>
        </a-entity>
    );
  };
  
  return (
    <>
    <div className="h-[80vh] w-full">
      <a-scene embedded background={`color: ${resolvedTheme === 'dark' ? '#333' : '#ECECEC'}`} key={resolvedTheme}>
        {sceneElements}
        {renderContent()}
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
