
'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export function MuseumScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      {/* 
        Hello! You can paste the 3D components from your other project right here.
        I've set up a basic ambient light and camera controls for you.
      */}
      <ambientLight intensity={0.8} />
      <OrbitControls />

      {/* Your 3D room components go here */}

    </Canvas>
  );
}
