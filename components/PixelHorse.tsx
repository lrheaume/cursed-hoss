import React, { useEffect, useState } from 'react';

interface PixelHorseProps {
  color: string;
  isMoving: boolean;
  isEating: boolean;
  isSleeping: boolean;
  direction: 'left' | 'right';
}

const PixelHorse: React.FC<PixelHorseProps> = ({ color, isMoving, isEating, isSleeping, direction }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % 4);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const scaleX = direction === 'left' ? -1 : 1;
  
  // Style: Magical Girl / Celestial Unicorn
  // Pastel outlines, glowing mane.
  
  // Darker outline for contrast against the magical coat
  const outline = "#4A148C44"; 
  const maneColor = '#FF80AB'; // Hot pink/Neon base
  const hornColor = '#E1BEE7';

  const getManeOffset = (i: number) => Math.sin((frame + i) * 1.5) * 1.5;
  const getFloatOffset = () => Math.sin(frame * 0.5) * 1;

  if (isSleeping) {
      return (
        <svg viewBox="0 0 32 32" className="w-full h-full overflow-visible filter drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" style={{ transform: `scaleX(${scaleX})` }}>
            <defs>
                <filter id="glow-sleep" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                    <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
            </defs>
            {/* Sleeping Body */}
            <path d="M8 22 C 8 20, 24 20, 24 22 C 24 26, 8 26, 8 22 Z" fill={color} stroke={outline} strokeWidth="0.5" />
            {/* Head Tucked */}
            <circle cx="22" cy="21" r="4" fill={color} />
            <path d="M23 19 L 25 16 L 26 19 Z" fill={hornColor} filter="url(#glow-sleep)" />
            {/* Mane Puddle */}
            <path d="M6 22 Q 2 26, 10 28 T 18 26" fill="none" stroke={maneColor} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            
            <text x={12} y={14} fontSize={4} className="font-mono-space fill-pink-200 animate-pulse">zZz</text>
        </svg>
      );
  }

  return (
    <svg 
      viewBox="0 0 32 32" 
      shapeRendering="geometricPrecision" 
      className="w-full h-full overflow-visible"
      style={{ transform: `scaleX(${scaleX}) translateY(${isMoving ? 0 : getFloatOffset()}px)` }}
    >
       <defs>
          <linearGradient id="maneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9E80" />
            <stop offset="50%" stopColor="#EA80FC" />
            <stop offset="100%" stopColor="#8C9EFF" />
          </linearGradient>
          <filter id="magicGlow" height="300%" width="300%" x="-75%" y="-75%">
            <feMorphology operator="dilate" radius="1" in="SourceAlpha" result="thicken" />
            <feGaussianBlur in="thicken" stdDeviation="2" result="blurred" />
            <feFlood floodColor="rgb(255, 180, 255)" result="glowColor" />
            <feComposite in="glowColor" in2="blurred" operator="in" result="softGlow_colored" />
            <feMerge>
              <feMergeNode in="softGlow_colored"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
       </defs>

       {/* -- Aura/Wings -- */}
       {!isEating && (
           <path 
             d={`M 12 16 Q 6 ${10 + getManeOffset(1)} 4 14 Q 8 20 12 18`} 
             fill="url(#maneGradient)" 
             opacity="0.4"
             className="animate-pulse"
           />
       )}

       {/* -- Body -- */}
       <path d="M 10 14 Q 10 22 14 24 L 20 24 Q 24 22 24 14 T 10 14 Z" fill={color} stroke={outline} strokeWidth="0.5" />
       
       {/* -- Legs (Slender) -- */}
       <path d={`M 12 22 L ${11 + (isMoving ? Math.sin(frame)*2 : 0)} 30`} stroke={color} strokeWidth="2" strokeLinecap="round" />
       <path d={`M 18 22 L ${19 - (isMoving ? Math.sin(frame)*2 : 0)} 30`} stroke={color} strokeWidth="2" strokeLinecap="round" />
       
       {/* -- Head & Neck -- */}
       {isEating ? (
         <g transform="rotate(-30 22 16)">
            <ellipse cx="22" cy="14" rx="5" ry="3" fill={color} />
            <path d="M 24 14 L 27 14 L 26 16 Z" fill={color} />
         </g>
       ) : (
         <g>
            {/* Neck */}
            <path d="M 20 16 Q 22 10 24 8 L 26 14 Z" fill={color} />
            {/* Head */}
            <ellipse cx="24" cy="7" rx="4" ry="3" fill={color} />
            <path d="M 26 7 L 29 8 L 27 9 Z" fill={color} />
            
            {/* Horn */}
            <path d="M 23.5 5 L 25 -2 L 26 5 Z" fill="url(#maneGradient)" filter="url(#magicGlow)" />
            
            {/* Eye (Alien/Anime) */}
            <ellipse cx="24" cy="7" rx="1.5" ry="2" fill="#220033" />
            <circle cx="24.5" cy="6.5" r="0.5" fill="white" />
         </g>
       )}

       {/* -- Mane & Tail (Liquid/Galaxy) -- */}
       <g filter="url(#magicGlow)">
            <path 
                d={`M 23 4 Q ${18+getManeOffset(0)} 8 22 14`} 
                stroke="url(#maneGradient)" 
                strokeWidth="2" 
                fill="none" 
                strokeLinecap="round" 
            />
            <path 
                d={`M 8 16 Q ${4+getManeOffset(2)} 20 6 28`} 
                stroke="url(#maneGradient)" 
                strokeWidth="3" 
                fill="none" 
                strokeLinecap="round"
            />
       </g>
    </svg>
  );
};

export default PixelHorse;