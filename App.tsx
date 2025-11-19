import React, { useState, useEffect, useCallback } from 'react';
import { 
  GameState, 
  HorseStats, 
  ActionType, 
  ChatMessage
} from './types';
import {
  INITIAL_STATS, 
  MAX_STAT, 
  MIN_STAT
} from './constants';
import GameWorld from './components/GameWorld';
import Controls from './components/Controls';
import StatsPanel from './components/StatsPanel';
import ChatPanel from './components/ChatPanel';
import { generateHorseReaction } from './services/geminiService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    horse: INITIAL_STATS,
    day: 1,
    timeOfDay: 'Morning',
    messages: [{ sender: 'system', text: 'Welcome to Pixel Pony Paradise! Take good care of your new friend.', timestamp: Date.now() }],
    isThinking: false,
  });

  const [currentAction, setCurrentAction] = useState<ActionType | null>(null);
  const [actionTimer, setActionTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Helper to add message
  const addMessage = (sender: 'user' | 'horse' | 'system', text: string) => {
    setGameState(prev => ({
      ...prev,
      messages: [...prev.messages, { sender, text, timestamp: Date.now() }]
    }));
  };

  // AI Response Handler
  const triggerAIReaction = useCallback(async (stats: HorseStats, action: string, userText?: string) => {
    setGameState(prev => ({ ...prev, isThinking: true }));
    const reaction = await generateHorseReaction(stats, action, userText);
    setGameState(prev => ({
      ...prev,
      isThinking: false,
      messages: [...prev.messages, { sender: 'horse', text: reaction, timestamp: Date.now() }]
    }));
  }, []);

  // Action Handler
  const handleAction = (action: ActionType) => {
    if (currentAction) return; // Prevent spamming

    setCurrentAction(action);

    // 1. Update stats immediately for feedback
    setGameState(prev => {
      const newStats = { ...prev.horse };
      let systemMsg = '';

      switch (action) {
        case ActionType.FEED:
          newStats.hunger = Math.min(MAX_STAT, newStats.hunger + 30);
          newStats.energy = Math.min(MAX_STAT, newStats.energy + 10);
          newStats.happiness = Math.min(MAX_STAT, newStats.happiness + 5);
          systemMsg = `You fed ${newStats.name} a shiny apple.`;
          break;
        case ActionType.GROOM:
          newStats.hygiene = Math.min(MAX_STAT, newStats.hygiene + 40);
          newStats.happiness = Math.min(MAX_STAT, newStats.happiness + 10);
          newStats.bond = Math.min(MAX_STAT, newStats.bond + 5);
          systemMsg = `You brushed ${newStats.name}'s coat until it sparkled.`;
          break;
        case ActionType.TRAIN:
          if (newStats.energy < 20) {
             systemMsg = `${newStats.name} is too tired to train!`;
             // Undo action state essentially
             return { ...prev, messages: [...prev.messages, { sender: 'system', text: systemMsg, timestamp: Date.now() }] };
          }
          newStats.energy = Math.max(MIN_STAT, newStats.energy - 30);
          newStats.hunger = Math.max(MIN_STAT, newStats.hunger - 20);
          newStats.xp += 15;
          newStats.bond += 2;
          systemMsg = `Training session complete! XP gained.`;
          break;
        case ActionType.REST:
          newStats.energy = MAX_STAT;
          newStats.hunger = Math.max(MIN_STAT, newStats.hunger - 10);
          systemMsg = `${newStats.name} took a long nap.`;
          break;
      }

      return {
        ...prev,
        horse: newStats,
        messages: systemMsg ? [...prev.messages, { sender: 'system', text: systemMsg, timestamp: Date.now() }] : prev.messages
      };
    });

    // 2. Trigger AI reaction
    triggerAIReaction(gameState.horse, action.toString());

    // 3. Reset Action Animation after delay
    const timer = setTimeout(() => {
      setCurrentAction(null);
      advanceTime();
    }, 2000);
    setActionTimer(timer);
  };

  const handleChat = (text: string) => {
      addMessage('user', text);
      triggerAIReaction(gameState.horse, "CHAT", text);
  };

  const advanceTime = () => {
    setGameState(prev => {
      const times: GameState['timeOfDay'][] = ['Morning', 'Afternoon', 'Evening', 'Night'];
      const currentIndex = times.indexOf(prev.timeOfDay);
      
      let nextIndex = currentIndex + 1;
      let nextDay = prev.day;
      
      if (nextIndex >= times.length) {
        nextIndex = 0;
        nextDay += 1;
      }

      return {
        ...prev,
        timeOfDay: times[nextIndex],
        day: nextDay
      };
    });
  };

  // Clean up timer
  useEffect(() => {
    return () => {
      if (actionTimer) clearTimeout(actionTimer);
    };
  }, [actionTimer]);

  // Passive decay (optional, simplistic for now)
  useEffect(() => {
     const interval = setInterval(() => {
         setGameState(prev => ({
             ...prev,
             horse: {
                 ...prev.horse,
                 hunger: Math.max(0, prev.horse.hunger - 1),
                 energy: Math.max(0, prev.horse.energy - 0.5)
             }
         }));
     }, 10000); // Every 10 seconds lose a bit
     return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen bg-stone-100 flex flex-col">
      {/* Main Game View */}
      <div className="relative flex-1">
        <GameWorld 
          horse={gameState.horse} 
          currentAction={currentAction === ActionType.CHAT ? null : currentAction} 
          timeOfDay={gameState.timeOfDay}
        />
        
        <StatsPanel stats={gameState.horse} />
        <ChatPanel 
            messages={gameState.messages} 
            onSendMessage={handleChat} 
            isThinking={gameState.isThinking}
        />

        {/* Time Indicator */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/80 px-4 py-2 rounded-full shadow border-2 border-amber-900 font-mono font-bold text-amber-900 z-30">
            Day {gameState.day} - {gameState.timeOfDay}
        </div>
      </div>

      {/* Controls Area */}
      <Controls 
        onAction={handleAction} 
        disabled={currentAction !== null || gameState.isThinking} 
      />
    </div>
  );
};

export default App;