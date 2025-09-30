
'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Plane } from '@react-three/drei';
import * as THREE from 'three';

function Wall({ position, rotation, color }: { position: [number, number, number], rotation: [number, number, number], color: string }) {
  return (
    <Plane args={[10, 5]} position={position} rotation={rotation}>
      <meshStandardMaterial color={color} side={THREE.DoubleSide} />
    </Plane>
  );
}

export function TimelineScene() {
  return (
    <Canvas camera={{ position: [0, 0, 0.1] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 2, 5]} intensity={1} />
      
      {/* Walls */}
      <Wall position={[0, 0, -5]} rotation={[0, 0, 0]} color={"#2a2a2a"} />
      <Wall position={[-5, 0, 0]} rotation={[0, Math.PI / 2, 0]} color={"#3a3a3a"} />
      <Wall position={[5, 0, 0]} rotation={[0, -Math.PI / 2, 0]} color={"#3a3a3a"} />
      <Wall position={[0, 0, 5]} rotation={[0, Math.PI, 0]} color={"#2a2a2a"} />

      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        minAzimuthAngle={-Math.PI / 2}
        maxAzimuthAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 1.5}
      />
    </Canvas>
  );
}
