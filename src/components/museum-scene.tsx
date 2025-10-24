
'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function Room() {
  const wallMaterial = new THREE.MeshStandardMaterial({ color: '#f0f0f0', side: THREE.DoubleSide });
  const floorMaterial = new THREE.MeshStandardMaterial({ color: '#cccccc', side: THREE.DoubleSide });

  return (
    <>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[20, 20]} />
        <primitive object={floorMaterial} />
      </mesh>
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 8, 0]}>
        <planeGeometry args={[20, 20]} />
        <primitive object={wallMaterial} />
      </mesh>
      {/* Back Wall */}
      <mesh position={[0, 3, -10]}>
        <planeGeometry args={[20, 10]} />
        <primitive object={wallMaterial} />
      </mesh>
      {/* Front Wall */}
      <mesh position={[0, 3, 10]}>
        <planeGeometry args={[20, 10]} />
        <primitive object={wallMaterial} />
      </mesh>
      {/* Left Wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-10, 3, 0]}>
        <planeGeometry args={[20, 10]} />
        <primitive object={wallMaterial} />
      </mesh>
      {/* Right Wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[10, 3, 0]}>
        <planeGeometry args={[20, 10]} />
        <primitive object={wallMaterial} />
      </mesh>
    </>
  );
}

export function MuseumScene() {
  return (
    <Suspense fallback={null}>
      <Canvas camera={{ position: [0, 1.6, 0], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight intensity={0.8} position={[0, 5, 0]} />
        <Room />
        <OrbitControls />
      </Canvas>
    </Suspense>
  );
}
