import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float, Stars, MeshDistortMaterial, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Refined Central Element: Tech Circuit Cube
const TechCube = () => {
    const meshRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
        meshRef.current.rotation.y = t * 0.5;
        meshRef.current.position.y = Math.sin(t * 0.5) * 0.1;
    });

    return (
        <group>
            {/* Main Glowing Cube */}
            <mesh ref={meshRef}>
                <boxGeometry args={[1.5, 1.5, 1.5]} />
                <meshStandardMaterial
                    color="#112240"
                    metalness={0.9}
                    roughness={0.1}
                    emissive="#64FFDA"
                    emissiveIntensity={0.2}
                    wireframe={false}
                />
                {/* Circuit Overlay Effect via wireframe duplicate */}
                <mesh scale={1.02}>
                    <boxGeometry args={[1.5, 1.5, 1.5]} />
                    <meshStandardMaterial
                        color="#64FFDA"
                        wireframe
                        transparent
                        opacity={0.3}
                        emissive="#64FFDA"
                        emissiveIntensity={0.5}
                    />
                </mesh>
            </mesh>

            {/* Floating Orbital Rings */}
            <Float speed={5} rotationIntensity={2} floatIntensity={1}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[2.2, 0.02, 16, 100]} />
                    <meshBasicMaterial color="#3b82f6" transparent opacity={0.4} />
                </mesh>
            </Float>
            <Float speed={4} rotationIntensity={1} floatIntensity={2}>
                <mesh rotation={[0, Math.PI / 4, 0]}>
                    <torusGeometry args={[1.8, 0.01, 16, 100]} />
                    <meshBasicMaterial color="#64FFDA" transparent opacity={0.2} />
                </mesh>
            </Float>
        </group>
    );
};

// Interactive Mouse Parallax Group
const SceneContent = () => {
    const groupRef = useRef();

    useFrame((state) => {
        const { x, y } = state.mouse;
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, x * 0.3, 0.1);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -y * 0.3, 0.1);
    });

    return (
        <group ref={groupRef}>
            <TechCube />
        </group>
    );
};

// Background Particle System
const StarField = () => {
    return (
        <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1.5}
        />
    );
};

export default function HeroScene() {
    return (
        <div className="absolute inset-0 z-0 bg-primary">
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />

                <ambientLight intensity={0.4} />
                <spotLight
                    position={[10, 10, 10]}
                    angle={0.15}
                    penumbra={1}
                    intensity={2}
                    castShadow
                    color="#64FFDA"
                />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#3b82f6" />

                <StarField />
                <SceneContent />

                <fog attach="fog" args={['#0A192F', 5, 15]} />
            </Canvas>
        </div>
    );
}
