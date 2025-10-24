
'use client';

import { useState, useEffect } from 'react';
import { getMuseumContent, type MuseumWall } from '@/lib/museum-content';

// A-Frame's components are not standard HTML, so we need to declare them for TypeScript/JSX
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

const Wall = ({ wallData, rotation, position }: { wallData: MuseumWall; rotation: string; position: string; }) => {
    return (
        <a-entity position={position} rotation={rotation}>
            <a-plane width="10" height="4" color="#F0F0F0" material="side: double"></a-plane>
            <a-image src={wallData.imageUrl} width="3" height="2.25" position="-3 0.5 0.1" data-ai-hint={wallData.imageHint}></a-image>
            <a-text 
                value={wallData.artistName} 
                color="#000"
                position="1.5 1 0.1" 
                align="center"
                width="4">
            </a-text>
            <a-text 
                value={wallData.artistDescription}
                color="#333"
                position="1.5 -0.5 0.1" 
                align="center"
                width="3.5"
                wrap-count="40">
            </a-text>
        </a-entity>
    );
};


export default function MuseumPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [walls, setWalls] = useState<MuseumWall[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    async function fetchContent() {
        try {
            const content = await getMuseumContent();
            setWalls(content);
        } catch (error) {
            console.error("Failed to load museum content", error);
        } finally {
            setLoading(false);
        }
    }
    fetchContent();
  }, []);

  if (!isMounted) {
    return null;
  }
  
  if (loading) {
      return (
          <div className="h-[80vh] w-full flex items-center justify-center">
              <p>Loading Museum...</p>
          </div>
      );
  }
  
  if (!walls) {
       return (
          <div className="h-[80vh] w-full flex items-center justify-center">
              <p className="text-destructive">Could not load museum content.</p>
          </div>
      );
  }

  return (
    <div className="h-[80vh] w-full">
      <a-scene background="color: #ECECEC">
        {/* Camera and controls */}
        <a-camera position="0 1.6 0"></a-camera>
        
        {/* Lighting */}
        <a-light type="ambient" color="#888"></a-light>
        <a-light type="point" intensity="0.5" position="0 3 0"></a-light>

        {/* Floor and Ceiling */}
        <a-plane position="0 0 0" rotation="-90 0 0" width="20" height="20" color="#C0C0C0"></a-plane>
        <a-plane position="0 4 0" rotation="90 0 0" width="20" height="20" color="#C0C0C0"></a-plane>

        {/* --- Walls --- */}
        <Wall wallData={walls[0]} position="0 2 -5" rotation="0 0 0" />
        <Wall wallData={walls[1]} position="5 2 0" rotation="0 -90 0" />
        <Wall wallData={walls[2]} position="0 2 5" rotation="0 180 0" />
        <Wall wallData={walls[3]} position="-5 2 0" rotation="0 90 0" />

      </a-scene>
    </div>
  );
}
