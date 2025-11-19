import React, { useEffect, useState } from 'react';
import PixelHorse from './PixelHorse';
import { HorseStats } from '../types';

interface GameWorldProps {
  horse: HorseStats;
  currentAction: string | null;
  timeOfDay: string;
}

const GameWorld: React.FC<GameWorldProps> = ({ horse, currentAction, timeOfDay }) => {
  const [butterflies, setButterflies] = useState<{id: number, left: number, top: number, scale: number, delay: number}[]>([]);

  // Generate ambient floating particles/butterflies
  useEffect(() => {
      const newButterflies = Array.from({ length: 12 }).map((_, i) => ({
          id: i,
          left: 10 + Math.random() * 80,
          top: 20 + Math.random() * 60,
          scale: 0.5 + Math.random() * 0.8,
          delay: Math.random() * 5
      }));
      setButterflies(newButterflies);
  }, []);

  const getSkyGradient = () => {
    // Vaporwave / Galaxy Gradients
    switch (timeOfDay) {
      case 'Morning': return 'from-[#ff9a9e] via-[#fecfef] to-[#a18cd1]'; 
      case 'Afternoon': return 'from-[#a18cd1] via-[#bc4e9c] to-[#f80759]'; 
      case 'Evening': return 'from-[#09203f] via-[#537895] to-[#1e130c]'; 
      case 'Night': return 'from-[#1a1025] via-[#4a148c] to-[#000000]'; 
      default: return 'from-slate-900 to-purple-900';
    }
  };

  const isEating = currentAction === 'FEED';
  const isGrooming = currentAction === 'GROOM';
  const isTraining = currentAction === 'TRAIN';
  const isResting = currentAction === 'REST';

  return (
    <div className={`relative w-full h-[65vh] bg-gradient-to-b ${getSkyGradient()} overflow-hidden transition-all duration-2000`}>
      
      {/* Huge Moon / Planet */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-gradient-to-tr from-violet-200 to-fuchsia-100 opacity-80 blur-sm shadow-[0_0_100px_rgba(255,200,255,0.5)]">
         {/* Craters/Texture */}
         <div className="absolute top-10 left-10 w-10 h-10 bg-purple-300/20 rounded-full blur-md"></div>
         <div className="absolute bottom-12 right-16 w-16 h-16 bg-blue-300/20 rounded-full blur-md"></div>
      </div>

      {/* Floating Butterflies / Motes */}
      {butterflies.map(b => (
          <div key={b.id} 
               className="absolute w-4 h-4 animate-pulse"
               style={{
                   left: `${b.left}%`,
                   top: `${b.top}%`,
                   transform: `scale(${b.scale})`,
                   animation: `float butterfly ${3 + b.scale}s infinite ease-in-out ${b.delay}s`
               }}>
              <div className="w-full h-full bg-white/60 blur-[1px] rounded-full shadow-[0_0_10px_white]"></div>
          </div>
      ))}

      {/* The 3D Scene Container */}
      <div className="absolute bottom-0 w-full h-full preserve-3d perspective-[1000px] flex justify-center items-end">
        
        {/* Floor - Reflective Glass / Water */}
        <div className="relative w-[200%] h-[100%] origin-bottom transform-style-3d" 
             style={{ 
                 transform: 'rotateX(75deg) translateZ(0)', 
                 background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,182,193,0.2) 50%, rgba(100,50,255,0.4) 100%)',
                 boxShadow: '0 0 50px rgba(255,100,255,0.2)'
             }}>
             
             {/* Grid Lines (Vaporwave style) */}
             <div className="absolute inset-0"
                  style={{
                      backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
                      backgroundSize: '60px 60px',
                      maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 80%)'
                  }}
             />
        </div>

        {/* Crystal Spires (Background) */}
        <div className="absolute bottom-[20%] left-[10%] w-16 h-48 bg-gradient-to-t from-purple-900/50 to-cyan-400/30 backdrop-blur-sm clip-path-crystal z-10"></div>
        <div className="absolute bottom-[25%] right-[15%] w-24 h-64 bg-gradient-to-t from-pink-900/50 to-purple-400/30 backdrop-blur-sm clip-path-crystal z-10"></div>
        
        <style>{`
          .clip-path-crystal {
            clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
          }
        `}</style>

        {/* The Horse */}
        <div className="absolute bottom-[15%] z-20 w-72 h-72 transition-all duration-500 ease-in-out"
             style={{ 
                 transform: isTraining ? 'translateY(-150px) scale(1.1)' : 'translateY(0)',
                 filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))'
             }}>
            
            {/* Thought Bubble / Speech */}
            {currentAction && (
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 glass-panel px-6 py-3 rounded-2xl text-sm text-pink-100 tracking-widest font-display min-w-[140px] text-center neon-glow animate-bounce">
                     {isEating && "Consuming Stardust"}
                     {isGrooming && "Polishing Aura"}
                     {isTraining && "Ascending"}
                     {isResting && "Dream Walking"}
                     {!currentAction && horse.happiness > 80 && "Resonant"}
                </div>
            )}

            <PixelHorse 
                color={horse.coatColor} 
                isMoving={isTraining} 
                isEating={isEating} 
                isSleeping={isResting}
                direction="left" 
            />
            
            {/* Magic Particles */}
            {isGrooming && (
                <div className="absolute inset-0">
                     <div className="absolute top-0 right-0 text-3xl animate-ping text-yellow-200">✦</div>
                     <div className="absolute bottom-0 left-0 text-2xl animate-ping text-pink-200 delay-100">✦</div>
                     <div className="absolute top-1/2 left-1/2 text-4xl animate-pulse text-white mix-blend-overlay">✧</div>
                </div>
            )}
        </div>
        
        {/* Foreground Mist/Fog */}
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#1a1025] to-transparent pointer-events-none z-30"></div>
      </div>
    </div>
  );
};

export default GameWorld;