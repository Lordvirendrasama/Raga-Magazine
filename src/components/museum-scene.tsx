
'use client';

import { Canvas } from '@react-three/fiber';
import { PointerLockControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense } from 'react';

function Room() {
  const wallMaterial = new THREE.MeshStandardMaterial({ color: '#f0f0f0', side: THREE.DoubleSide });
  const floorMaterial = new THREE.MeshStandardMaterial({ color: '#cccccc', side: THREE.DoubleSide });

  return (
    <>
      {/* Floor */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -2, 0]} material={floorMaterial}>
        <planeGeometry args={[20, 20]} />
      </mesh>
      {/* Ceiling */}
      <mesh rotation-x={Math.PI / 2} position={[0, 8, 0]} material={wallMaterial}>
        <planeGeometry args={[20, 20]} />
      </mesh>
      {/* Back Wall */}
      <mesh position={[0, 3, -10]} material={wallMaterial}>
        <planeGeometry args={[20, 10]} />
      </mesh>
      {/* Left Wall */}
      <mesh rotation-y={Math.PI / 2} position={[-10, 3, 0]} material={wallMaterial}>
        <planeGeometry args={[20, 10]} />
      </mesh>
      {/* Right Wall */}
      <mesh rotation-y={-Math.PI / 2} position={[10, 3, 0]} material={wallMaterial}>
        <planeGeometry args={[20, 10]} />
      </mesh>
    </>
  );
}

export function MuseumScene() {
  return (
    <Suspense fallback={null}>
      <Canvas camera={{ position: [0, 1.6, 0], fov: 75 }}>
        <ambientLight intensity={0.3} />
        <pointLight intensity={0.8} position={[0, 5, 0]} />
        <Room />
        <PointerLockControls />
        <Text
          position={[0, 2, -9.9]}
          fontSize={0.5}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          Click to explore the Museum
        </Text>
      </Canvas>
    </Suspense>
  );
}
