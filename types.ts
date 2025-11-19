export enum Mood {
  HAPPY = 'HAPPY',
  NEUTRAL = 'NEUTRAL',
  SAD = 'SAD',
  TIRED = 'TIRED',
  EXCITED = 'EXCITED'
}

export enum ActionType {
  FEED = 'FEED',
  GROOM = 'GROOM',
  TRAIN = 'TRAIN',
  REST = 'REST',
  CHAT = 'CHAT'
}

export interface HorseStats {
  name: string;
  coatColor: string; // Hex code
  hunger: number; // 0-100 (0 is starving)
  hygiene: number; // 0-100 (0 is dirty)
  energy: number; // 0-100 (0 is exhausted)
  happiness: number; // 0-100 (0 is depressed)
  bond: number; // 0-100 (100 is best friends)
  xp: number;
}

export interface ChatMessage {
  sender: 'user' | 'horse' | 'system';
  text: string;
  timestamp: number;
}

export interface GameState {
  horse: HorseStats;
  day: number;
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  messages: ChatMessage[];
  isThinking: boolean;
}
