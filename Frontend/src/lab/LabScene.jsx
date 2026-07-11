import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  useScroll,
  useTexture,
  Grid,
  Stars,
  Sparkles,
  Float,
  RoundedBox,
} from '@react-three/drei';
import { STATIONS, LOGO_BASE, STATION_Z0, STATION_GAP } from './labData';

// Camera travels from the entrance (+z) deep into the corridor (-z) as the
// user scrolls. A little sway + bob keeps it feeling like a walk, not a slide.
const CAM_START = 12;
const CAM_END = -118;

function Rig() {
  const scroll = useScroll();
  useFrame((state) => {
    const o = scroll.offset; // 0 → 1
    const z = CAM_START + o * (CAM_END - CAM_START);
    state.camera.position.x = Math.sin(o * Math.PI * 2) * 0.7;
    state.camera.position.y = 0.5 + Math.sin(o * 9) * 0.12;
    state.camera.position.z = z;
    state.camera.lookAt(Math.sin((o + 0.03) * Math.PI * 2) * 0.5, 0.35, z - 12);
  });
  return null;
}

// A receding "gate" ring — repeated down the corridor to build the tunnel.
function Gate({ z, color }) {
  return (
    <mesh position={[0, 0.5, z]}>
      <torusGeometry args={[7.6, 0.05, 12, 72]} />
      <meshBasicMaterial color={color} transparent opacity={0.5} toneMapped={false} />
    </mesh>
  );
}

// A single product "automation bay": glass card + rim glow + halo ring +
// floating logo + a light pool on the floor. Alternates left/right (side).
function Station({ data, z, side }) {
  const tex = useTexture(LOGO_BASE + data.logo);
  const group = useRef();
  return (
    <group ref={group} position={[side * 3.1, 0.6, z]} rotation={[0, -side * 0.3, 0]}>
      <Float speed={2.2} rotationIntensity={0.22} floatIntensity={0.7}>
        {/* halo ring */}
        <mesh>
          <torusGeometry args={[3.05, 0.045, 16, 90]} />
          <meshBasicMaterial color={data.accent} toneMapped={false} />
        </mesh>
        {/* rim glow (behind the card) */}
        <RoundedBox args={[5.35, 5.35, 0.12]} radius={0.26} smoothness={4} position={[0, 0, -0.14]}>
          <meshBasicMaterial color={data.color} transparent opacity={0.2} toneMapped={false} />
        </RoundedBox>
        {/* glass card */}
        <RoundedBox args={[5, 5, 0.25]} radius={0.22} smoothness={4}>
          <meshBasicMaterial color={'#0a0e1f'} transparent opacity={0.66} toneMapped={false} />
        </RoundedBox>
        {/* logo */}
        <mesh position={[0, 0, 0.22]}>
          <planeGeometry args={[3.7, 3.7]} />
          <meshBasicMaterial map={tex} transparent toneMapped={false} />
        </mesh>
      </Float>
      {/* floor light pool under the bay */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.7, 0]}>
        <circleGeometry args={[3.4, 48]} />
        <meshBasicMaterial color={data.color} transparent opacity={0.12} toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function LabScene() {
  const lastZ = STATION_Z0 + (STATIONS.length - 1) * STATION_GAP;
  return (
    <>
      <Rig />

      <Stars radius={150} depth={70} count={2600} factor={4} saturation={0} fade speed={0.6} />
      <Sparkles
        count={140}
        scale={[26, 10, 150]}
        position={[0, 0, -55]}
        size={2.4}
        speed={0.28}
        color={'#8b7bff'}
        opacity={0.7}
      />

      {/* neon floor grid */}
      <Grid
        position={[0, -3.7, -50]}
        args={[40, 240]}
        cellSize={1.2}
        cellThickness={0.6}
        cellColor={'#1b2450'}
        sectionSize={6}
        sectionThickness={1.1}
        sectionColor={'#4c3aa8'}
        fadeDistance={100}
        fadeStrength={2}
        infiniteGrid
      />

      {/* corridor gates receding into the distance */}
      {Array.from({ length: 12 }).map((_, i) => (
        <Gate key={i} z={7 - i * 11} color={i % 2 ? '#22d3ee' : '#7c5cff'} />
      ))}

      {/* product stations, in ecosystem order */}
      {STATIONS.map((s, i) => (
        <Station key={s.key} data={s} z={STATION_Z0 + i * STATION_GAP} side={i % 2 ? 1 : -1} />
      ))}

      {/* final portal / airlock the walk arrives at, behind the sign-in card */}
      <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.3}>
        <mesh position={[0, 0.5, lastZ - 12]}>
          <torusGeometry args={[5.6, 0.16, 24, 90]} />
          <meshBasicMaterial color={'#8b7bff'} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.5, lastZ - 12.4]}>
          <circleGeometry args={[5.5, 64]} />
          <meshBasicMaterial color={'#0a0e1f'} transparent opacity={0.7} toneMapped={false} />
        </mesh>
      </Float>
    </>
  );
}
