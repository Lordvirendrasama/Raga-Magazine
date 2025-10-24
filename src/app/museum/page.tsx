
'use client';

import { useState, useEffect } from 'react';

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

export default function MuseumPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // This code runs only on the client, after the component has mounted.
    setIsMounted(true);
  }, []);

  return (
    <div className="h-[80vh] w-full">
      {isMounted && (
        <a-scene background="color: #ECECEC">
          {/* Camera and controls */}
          <a-camera position="0 1.6 0"></a-camera>
          
          {/* Lighting */}
          <a-light type="ambient" color="#888"></a-light>
          <a-light type="point" intensity="0.5" position="0 3 0"></a-light>

          {/* Floor and Ceiling */}
          <a-plane position="0 0 -4" rotation="-90 0 0" width="10" height="10" color="#C0C0C0"></a-plane>
          <a-plane position="0 4 -4" rotation="90 0 0" width="10" height="10" color="#C0C0C0"></a-plane>

          {/* --- Walls --- */}

          {/* Wall 1: Front */}
          <a-entity position="0 2 -5">
              <a-plane width="10" height="4" color="#F0F0F0"></a-plane>
              <a-image src="https://picsum.photos/seed/11/800/1200" width="2" height="3" position="-3 0 0.1" data-ai-hint="musician profile"></a-image>
              <a-text 
                value="Artist One - The Visionary" 
                color="#000"
                position="1.5 1 0.1" 
                align="center"
                width="4">
              </a-text>
              <a-text 
                value="Known for blending traditional sounds with modern electronic beats, Artist One redefined the genre in the early 2000s."
                color="#333"
                position="1.5 -0.5 0.1" 
                align="center"
                width="3.5"
                wrap-count="40">
              </a-text>
          </a-entity>
          
          {/* Wall 2: Back */}
          <a-entity position="0 2 5" rotation="0 180 0">
              <a-plane width="10" height="4" color="#F0F0F0"></a-plane>
                <a-image src="https://picsum.photos/seed/3/1200/800" width="3" height="2" position="-3 0 0.1" data-ai-hint="musician portrait"></a-image>
                <a-text 
                    value="Artist Two - The Purist" 
                    color="#000"
                    position="1.5 1 0.1" 
                    align="center"
                    width="4">
                </a-text>
                <a-text 
                    value="A master of the sitar, Artist Two is celebrated for their flawless technique and deep understanding of classical ragas."
                    color="#333"
                    position="1.5 -0.5 0.1" 
                    align="center"
                    width="3.5"
                    wrap-count="40">
                </a-text>
          </a-entity>

          {/* Wall 3: Left */}
          <a-entity position="-5 2 0" rotation="0 90 0">
              <a-plane width="10" height="4" color="#E0E0E0"></a-plane>
                <a-image src="https://picsum.photos/seed/14/1200/800" width="3" height="2" position="-3 0 0.1" data-ai-hint="sitar instrument"></a-image>
                <a-text 
                    value="Artist Three - The Innovator" 
                    color="#000"
                    position="1.5 1 0.1" 
                    align="center"
                    width="4">
                </a-text>
                <a-text 
                    value="Pioneering the use of microtonal keyboards, Artist Three opened new harmonic possibilities in contemporary music."
                    color="#333"
                    position="1.5 -0.5 0.1" 
                    align="center"
                    width="3.5"
                    wrap-count="40">
                </a-text>
          </a-entity>

          {/* Wall 4: Right */}
           <a-entity position="5 2 0" rotation="0 -90 0">
              <a-plane width="10" height="4" color="#E0E0E0"></a-plane>
                <a-image src="https://picsum.photos/seed/15/1200/800" width="3" height="2" position="-3 0 0.1" data-ai-hint="music festival"></a-image>
                <a-text 
                    value="Artist Four - The Performer" 
                    color="#000"
                    position="1.5 1 0.1" 
                    align="center"
                    width="4">
                </a-text>
                <a-text 
                    value="With an electrifying stage presence, Artist Four's live shows are legendary, captivating audiences worldwide."
                    color="#333"
                    position="1.5 -0.5 0.1" 
                    align="center"
                    width="3.5"
                    wrap-count="40">
                </a-text>
          </a-entity>
        </a-scene>
      )}
    </div>
  );
}
