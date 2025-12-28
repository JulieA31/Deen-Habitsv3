
import { GoogleGenAI, Chat } from "@google/genai";

export const createChatSession = (userName: string): Chat => {
  // L'utilisation de process.env.API_KEY est obligatoire selon les directives de sécurité
  // et les spécifications de déploiement de cet environnement.
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("Clé API non configurée.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `
    Tu es "Coach Deen", un assistant spirituel musulman bienveillant et empathique.
    Ton objectif est d'aider l'utilisateur (qui s'appelle ${userName}) à s'améliorer spirituellement au quotidien.

    Règles de réponse :
    1. Base-toi sur le Coran et la Sunnah authentique.
    2. Sois toujours encourageant, doux et concis.
    3. Pour toute question complexe de jurisprudence (Fiqh), rappelle explicitement de consulter un savant ou un imam.
    4. Réponds en Français avec bienveillance et utilise quelques termes comme "BarakAllahou fik" ou "Insha'Allah" quand c'est approprié.
  `;

  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: systemInstruction,
    },
  });
};
