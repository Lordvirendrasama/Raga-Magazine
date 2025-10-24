
'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const Wall = (props: JSX.IntrinsicElements['mesh']) => {
  return (
    <mesh {...props}>
      <planeGeometry args={[20, 10]} />
      <meshStandardMaterial color="hsl(var(--card))" side={THREE.DoubleSide} />
    </mesh>
  );
};

const Floor = (props: JSX.IntrinsicElements['mesh']) => {
    return (
      <mesh {...props}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="hsl(var(--muted))" />
      </mesh>
    );
  };


const Room = () => {
  return (
    <>
      {/* Floor */}
      <Floor rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} />
      {/* Back Wall */}
      <Wall position={[0, 0, -10]} />
      {/* Front Wall */}
      <Wall position={[0, 0, 10]} />
      {/* Left Wall */}
      <Wall position={[-10, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      {/* Right Wall */}
      <Wall position={[10, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
    </>
  );
};

const MuseumScene = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 4, 0]} intensity={150} distance={20} />
      <Suspense fallback={null}>
        <Room />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
};

export default MuseumScene;
