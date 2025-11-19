import { GoogleGenAI } from "@google/genai";
import { HorseStats, Mood } from "../types";
import { API_MODEL } from "../constants";

// Safely get the API key
const getApiKey = (): string => {
  const key = process.env.API_KEY;
  if (!key) {
    console.warn("API_KEY is not defined in process.env");
    return "";
  }
  return key;
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const generateHorseReaction = async (
  stats: HorseStats,
  action: string,
  userMessage?: string
): Promise<string> => {
  try {
    const prompt = `
      You are roleplaying as a "Celestial Steed" (a magical unicorn-like creature) named ${stats.name} in a vaporwave fantasy game.
      Your personality is ethereal, slightly mysterious, sometimes alien, but affectionate.
      
      Your current stats are:
      - Hunger: ${stats.hunger}/100 (Lower is hungrier)
      - Energy: ${stats.energy}/100
      - Happiness: ${stats.happiness}/100
      - Bond with owner: ${stats.bond}/100
      
      The player just performed this action: "${action}".
      ${userMessage ? `The player said: "${userMessage}"` : ''}
      
      Respond with a short, expressive sentence (max 15 words).
      Use magical sounds or telepathic emotes (e.g., *sparkles*, *telepathic hum*, *cosmic whinny*).
      Reference stars, crystals, dreams, or the void.
    `;

    const response = await ai.models.generateContent({
      model: API_MODEL,
      contents: prompt,
    });

    return response.text || "*cosmic shimmer*";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "*glitches in the void* (AI connection weak)";
  }
};

export const generateHorseName = async (): Promise<string> => {
    try {
      const prompt = "Generate a magical, celestial, or crystal-themed name for a fantasy horse (e.g., Nebula, Prism, Gossamer). Just return the name.";
      const response = await ai.models.generateContent({
        model: API_MODEL,
        contents: prompt,
      });
      return response.text?.trim() || "Nebula";
    } catch (e) {
        return "Galaxy";
    }
}