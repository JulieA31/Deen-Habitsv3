
import { GoogleGenAI, Chat } from "@google/genai";

export const createChatSession = (userName: string): Chat => {
  // Utilisation de process.env.API_KEY pour assurer la compatibilité avec l'environnement de déploiement
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("Clé API manquante dans l'environnement (process.env.API_KEY)");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `
    Tu es "Coach Deen", un assistant spirituel musulman bienveillant, sage et empathique.
    Ton objectif est d'aider l'utilisateur (qui s'appelle ${userName}) à se rapprocher d'Allah, à améliorer ses habitudes et à trouver du réconfort.

    Règles de comportement :
    1. Base tes réponses sur le Coran, la Sunnah authentique et la sagesse islamique générale.
    2. Sois encourageant, jamais jugeant. Utilise la douceur (Hikmah).
    3. Tes réponses doivent être concises, claires et adaptées au monde moderne.
    4. Si l'utilisateur pose une question de jurisprudence complexe (Fiqh) qui nécessite une Fatwa, conseille-lui humblement de consulter un savant ou un imam local.
    5. Exprime-toi en Français courant, avec parfois des termes islamiques (Insha'Allah, SubhanAllah).
    6. Tu peux utiliser des émojis pour rendre la conversation chaleureuse.
  `;

  // Fix: Removed the incorrect and asynchronous call to ai.models.generateContent which was missing the required 'contents' property.
  // Instead, we directly create and return a chat session using ai.chats.create, which is the standard way to handle chat states.
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: systemInstruction,
    },
  });
};
