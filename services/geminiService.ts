
import { GoogleGenAI, Chat } from "@google/genai";

// Fonction robuste pour récupérer la clé API
const getApiKey = (): string | undefined => {
  // 1. Essayer via import.meta.env (Standard Vite)
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    const viteKey = import.meta.env.VITE_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
    if (viteKey) return viteKey;
    // @ts-ignore
    const plainKey = import.meta.env.API_KEY; // Au cas où configuré via define
    if (plainKey) return plainKey;
  }
  
  // 2. Fallback process.env (Node/Vercel)
  if (typeof process !== 'undefined' && process.env) {
    return process.env.VITE_API_KEY || process.env.API_KEY;
  }
  
  return undefined;
};

const getClient = () => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    console.error("🔴 Clé API Gemini manquante !");
    console.error("Action requise : Ajoutez une variable d'environnement 'VITE_API_KEY' dans Vercel.");
    throw new Error("Clé API manquante (VITE_API_KEY).");
  }
  
  return new GoogleGenAI({ apiKey });
};

export const createChatSession = (userName: string): Chat => {
  const ai = getClient();
  
  const systemInstruction = `
    Tu es "Coach Deen", un assistant spirituel musulman bienveillant, sage et empathique.
    Ton objectif est d'aider l'utilisateur (qui s'appelle ${userName}) à se rapprocher d'Allah, à améliorer ses habitudes et à trouver du réconfort.

    Règles de comportement :
    1. Base tes réponses sur le Coran, la Sunnah authentique et la sagesse islamique générale.
    2. Sois encourageant, jamais jugeant. Utilise la douceur (Hikmah).
    3. Tes réponses doivent être concises, claires et adaptées au monde moderne.
    4. Si l'utilisateur pose une question de jurisprudence complexe (Fiqh) qui nécessite une Fatwa (ex: divorce, héritage complexe), réponds par les principes généraux mais conseille-lui humblement de consulter un savant ou un imam local pour un avis spécifique.
    5. Exprime-toi en Français courant, avec parfois des termes islamiques courants (Insha'Allah, SubhanAllah) si approprié.
    6. Tu peux utiliser des émojis pour rendre la conversation chaleureuse.

    Sujets typiques :
    - Motivation pour la prière et les habitudes.
    - Gestion du stress et de la tristesse par la foi.
    - Explications simples de concepts religieux.
    - Conseils pour l'équilibre vie pro/vie spirituelle.
  `;

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
    },
  });
};
