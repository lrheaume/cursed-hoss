import React from 'react';
import { HorseStats } from '../types';

interface StatsPanelProps {
  stats: HorseStats;
}

const StatBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div className="mb-4 group">
    <div className="flex justify-between text-xs uppercase tracking-[0.2em] text-pink-200 mb-1 font-mono-space opacity-80">
      <span>{label}</span>
      <span>{Math.round(value)}%</span>
    </div>
    <div className="w-full bg-black/30 h-2 rounded-full overflow-hidden border border-white/10">
      <div
        className={`h-full transition-all duration-1000 ease-out relative overflow-hidden ${color}`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      >
        {/* Shimmer effect on bar */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
      </div>
    </div>
    <style>{`
      @keyframes shimmer {
        100% { transform: translateX(100%); }
      }
    `}</style>
  </div>
);

const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  return (
    <div className="absolute top-6 left-6 z-40 w-80 glass-panel rounded-xl p-6 text-white">
        <div className="flex items-center gap-5 mb-8 border-b border-white/10 pb-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-500 to-violet-500 p-[2px] shadow-[0_0_15px_rgba(236,72,153,0.5)]">
               <div className="w-full h-full bg-[#1a1025] rounded-full flex items-center justify-center font-display text-2xl text-pink-200">
                  {stats.name.charAt(0)}
               </div>
            </div>
            <div>
                <h2 className="font-display text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-cyan-200 neon-glow">{stats.name}</h2>
                <p className="text-[10px] text-cyan-200 font-mono-space uppercase tracking-widest">Entity Level {Math.floor(stats.xp / 100) + 1}</p>
            </div>
        </div>
        
        <div className="space-y-2">
          <StatBar label="Stardust" value={stats.hunger} color="bg-gradient-to-r from-pink-500 to-rose-500" />
          <StatBar label="Cosmic Energy" value={stats.energy} color="bg-gradient-to-r from-amber-300 to-orange-500" />
          <StatBar label="Aura Purity" value={stats.hygiene} color="bg-gradient-to-r from-cyan-400 to-blue-500" />
          <StatBar label="Resonance" value={stats.happiness} color="bg-gradient-to-r from-fuchsia-500 to-purple-600" />
          <StatBar label="Soul Bond" value={stats.bond} color="bg-gradient-to-r from-violet-400 to-indigo-500" />
        </div>
    </div>
  );
};

export default StatsPanel;