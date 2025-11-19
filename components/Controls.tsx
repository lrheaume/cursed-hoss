import React from 'react';
import { ActionType } from '../types';

interface ControlsProps {
  onAction: (action: ActionType) => void;
  disabled: boolean;
}

const Controls: React.FC<ControlsProps> = ({ onAction, disabled }) => {
  const buttons = [
    { type: ActionType.FEED, label: 'Offer Star', icon: '⭐', gradient: 'from-pink-500 to-rose-500' },
    { type: ActionType.GROOM, label: 'Polish', icon: '✨', gradient: 'from-cyan-400 to-blue-500' },
    { type: ActionType.TRAIN, label: 'Ascend', icon: '🦄', gradient: 'from-violet-500 to-purple-600' },
    { type: ActionType.REST, label: 'Dream', icon: '🌙', gradient: 'from-indigo-400 to-slate-600' },
  ];

  return (
    <div className="flex flex-wrap gap-8 justify-center p-8 bg-[#1a1025]/90 backdrop-blur-md border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-50 relative">
      {buttons.map((btn) => (
        <button
          key={btn.type}
          onClick={() => onAction(btn.type)}
          disabled={disabled}
          className={`
            group relative
            w-36 h-24 flex flex-col items-center justify-center gap-2
            rounded-xl transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-95
            hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]
            bg-gradient-to-br ${btn.gradient} p-[1px]
          `}
        >
          {/* Inner button background */}
          <div className="w-full h-full rounded-[10px] bg-[#1a1025] flex flex-col items-center justify-center relative overflow-hidden">
              {/* Glow blob on hover */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-br ${btn.gradient} transition-opacity duration-500`}></div>
              
              <span className="text-3xl filter drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] transform group-hover:scale-110 transition-transform duration-300">{btn.icon}</span>
              <span className="text-xs font-bold tracking-widest uppercase text-white/80 font-mono-space">{btn.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default Controls;