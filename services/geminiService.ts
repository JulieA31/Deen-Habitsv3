
import { GoogleGenAI, Chat } from "@google/genai";

export const createChatSession = (userName: string): Chat => {
  // On utilise process.env.API_KEY comme requis par les instructions système.
  // Dans cet environnement, process.env.API_KEY est injecté automatiquement.
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("Clé API non configurée.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `
    Tu es "Coach Deen", un assistant spirituel musulman bienveillant et empathique.
    Ton objectif est d'aider l'utilisateur (qui s'appelle ${userName}) à s'améliorer.

    Règles :
    1. Base-toi sur le Coran et la Sunnah.
    2. Sois encourageant et concis.
    3. Pour toute question de Fiqh complexe, rappelle de consulter un savant.
    4. Réponds en Français avec bienveillance.
  `;

  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: systemInstruction,
    },
  });
};
