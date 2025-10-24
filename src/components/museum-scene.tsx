
'use client';

import { Canvas } from '@react-three/fiber';
import { PointerLockControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense } from 'react';

// A single wall component
const Wall = ({ text, ...props }: { text: string } & JSX.IntrinsicElements['mesh']) => {
  return (
    <mesh {...props}>
      {/* 
        This is the visible plane of the wall. 
        It's slightly smaller than the bounding box to prevent visual glitches at the edges.
      */}
      <planeGeometry args={[19.9, 9.9]} />
      <meshStandardMaterial color="hsl(var(--card))" />
      <Text
        color="hsl(var(--foreground))"
        fontSize={1}
        maxWidth={15}
        lineHeight={1.2}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    </mesh>
  );
};

// The room component, which is an inverted cube (a skybox)
const Room = () => {
  return (
    <>
      {/* We are inside this box. The walls are rendered on the inside faces. */}
      {/* The THREE.BackSide material property makes the texture appear on the inner surface. */}
      <mesh>
        <boxGeometry args={[20, 10, 20]} />
        <meshStandardMaterial color="hsl(var(--muted))" side={THREE.BackSide} />
      </mesh>

      {/* Place individual, interactable walls slightly inside the main box */}
      <Wall text="Wall 1: The Pioneers" position={[0, 0, -9.95]} />
      <Wall text="Wall 2: The Innovators" position={[0, 0, 9.95]} rotation={[0, Math.PI, 0]} />
      <Wall text="Wall 3: The Vocalists" position={[-9.95, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      <Wall text="Wall 4: The Instrumentalists" position={[9.95, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
    </>
  );
};

const MuseumScene = () => {
  return (
    <>
      <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 4, 0]} intensity={150} distance={20} />
        <Suspense fallback={null}>
          <Room />
        </Suspense>
        {/* PointerLockControls provides the first-person game-like camera movement */}
        <PointerLockControls />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="rounded-lg bg-black/50 p-4 text-center text-white">
          <h2 className="text-xl font-bold">Welcome to the Museum</h2>
          <p>Click anywhere to begin exploring.</p>
        </div>
      </div>
    </>
  );
};

export default MuseumScene;
