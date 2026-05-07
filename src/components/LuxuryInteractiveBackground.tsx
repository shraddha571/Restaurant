import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const fragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec3 uBaseColor;
uniform vec3 uAccentColor;
uniform vec3 uSecondaryAccent;
uniform vec3 uHighlightColor;

varying vec2 vUv;

#define PI 3.14159265359

// Hash function
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

// 2D Noise
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

// FBM (Fractal Brownian Motion)
float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p = rot * p * 2.0 + vec2(100.0);
        a *= 0.5;
    }
    return v;
}

mat2 rotate2d(float angle){
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

void main() {
    // Normalize coordinates
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    vec2 uv = st;
    
    // Fix aspect ratio for rendering shapes
    vec2 p = st * 2.0 - 1.0;
    p.x *= uResolution.x / uResolution.y;
    
    // Smooth mouse coordinates
    vec2 mouseOffset = (uMouse * 2.0 - 1.0) * 0.05;
    p += mouseOffset; // subtle parallax

    // Base color
    vec3 color = uBaseColor;

    // --- Soft Flowing Wave Distortion (Living Fabric Texture) ---
    vec2 q = vec2(0.0);
    q.x = fbm(p + 0.05 * uTime);
    q.y = fbm(p + vec2(1.0));
    
    vec2 r = vec2(0.0);
    r.x = fbm(p + 1.2 * q + vec2(1.7, 9.2) + 0.15 * uTime);
    r.y = fbm(p + 1.2 * q + vec2(8.3, 2.8) + 0.126 * uTime);
    
    float f = fbm(p + r);
    
    // Mix in flowing gold and secondary red highlights
    vec3 flowColor = mix(uBaseColor, uAccentColor, f * 0.35);
    flowColor = mix(flowColor, uSecondaryAccent, f * f * 0.15);
    color = flowColor;
    
    // --- Rotating Mandala / Geometry Focus ---
    float angle = atan(p.y, p.x);
    float radius = length(p);
    
    // Slowly rotate the mandala space
    vec2 p_rot = rotate2d(uTime * 0.03) * p;
    float angle_rot = atan(p_rot.y, p_rot.x);
    
    // 12-petal mandala structure
    float petals = 12.0;
    float mandala_shape = sin(angle_rot * petals) * 0.05;
    
    // Rings with soft edges, modulated by noise
    float outerLimit = 1.8;
    float ring_dist = radius - mandala_shape;
    float ring1 = smoothstep(0.03, 0.0, abs(fract(ring_dist * 2.5 - uTime * 0.08) - 0.5));
    float ring2 = smoothstep(0.08, 0.0, abs(fract(ring_dist * 5.0 + uTime * 0.04) - 0.5));
    
    // Combine rings, fade out from center
    float radialFade = smoothstep(outerLimit, 0.2, radius);
    float mandala_intensity = (ring1 * 0.4 + ring2 * 0.2) * radialFade;
    
    // Add mandala to color
    color = mix(color, mix(uAccentColor, uSecondaryAccent, 0.3), mandala_intensity * 0.35);

    // --- Interactive Mouse Glow ---
    // Calculate distance to mouse for a soft highlight
    vec2 mouse_p = uMouse * 2.0 - 1.0;
    mouse_p.x *= uResolution.x / uResolution.y;
    float distToMouse = length(p - mouseOffset - mouse_p);
    float mouseGlow = smoothstep(1.2, 0.0, distToMouse);
    color += mix(uAccentColor, uHighlightColor, 0.4) * mouseGlow * 0.15;

    // --- Soft Ambient Glowing Light ---
    float softGlow = smoothstep(1.8, 0.0, radius);
    color += uAccentColor * softGlow * 0.08;

    // --- Subtle Grain (Silky Packaging Feel) ---
    float grain = hash(uv * 200.0 + uTime);
    color -= grain * 0.025;

    gl_FragColor = vec4(color, 1.0);
}
`;

const vertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}
`;

function AnimatedMaterial({
  baseColor,
  accentColor,
  speedMultiplier,
}: {
  baseColor: string;
  accentColor: string;
  speedMultiplier: number;
}) {
  const { size, viewport } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const uniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uBaseColor: { value: new THREE.Color(baseColor) },
      uAccentColor: { value: new THREE.Color(accentColor) },
      uSecondaryAccent: { value: new THREE.Color('#570000') }, // Royal Red accent
      uHighlightColor: { value: new THREE.Color('#FFFFFF') },
    };
  }, [baseColor, accentColor, size.width, size.height]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime * speedMultiplier;
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height);

      // Lerp mouse for smooth luxurious tracking
      const targetMouseX = (state.pointer.x + 1) / 2;
      const targetMouseY = (state.pointer.y + 1) / 2; // Keep orientation for typical shader usage
      
      const currentMouseX = materialRef.current.uniforms.uMouse.value.x;
      const currentMouseY = materialRef.current.uniforms.uMouse.value.y;
      
      materialRef.current.uniforms.uMouse.value.x += (targetMouseX - currentMouseX) * 0.03;
      materialRef.current.uniforms.uMouse.value.y += (targetMouseY - currentMouseY) * 0.03;
    }
  });

  return (
    <shaderMaterial
      ref={materialRef}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={uniforms}
      depthWrite={false}
      depthTest={false}
    />
  );
}

interface LuxuryInteractiveBackgroundProps {
  baseColor?: string;
  accentColor?: string;
  speedMultiplier?: number;
  density?: number;
}

export default function LuxuryInteractiveBackground({
  baseColor = '#FAF6F0',
  accentColor = '#D4AF37',
  speedMultiplier = 1,
  density = 1,
}: LuxuryInteractiveBackgroundProps) {
  
  return (
    <div className="absolute inset-0 overflow-hidden z-0 bg-[#FAF6F0]" style={{ pointerEvents: 'auto' }}>
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 2]} // Support retina displays efficiently
        gl={{ powerPreference: 'high-performance', antialias: false, alpha: false }}
        style={{ width: '100%', height: '100%' }}
      >
        <mesh>
          {/* A simple plane to draw the fragment shader on */}
          <planeGeometry args={[2, 2]} />
          <AnimatedMaterial
            baseColor={baseColor}
            accentColor={accentColor}
            speedMultiplier={speedMultiplier}
          />
        </mesh>
      </Canvas>
      {/* Overlay to keep the subtle CSS jaali lattice structure linked to the overall brand */}
      <div className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-20 jaali-bg"></div>
    </div>
  );
}
