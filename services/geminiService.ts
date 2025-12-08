import { GoogleGenAI } from "@google/genai";
import { Habit, HabitLog, PrayerLog } from "../types";

const getClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateCoachingAdvice = async (
  habits: Habit[],
  logs: HabitLog,
  prayerLogs: PrayerLog,
  today: string
): Promise<string> => {
  const ai = getClient();
  
  // Stats rapides
  const todayLog = logs[today] || {};
  const completedCount = Object.values(todayLog).filter(Boolean).length;
  
  const todayPrayers = prayerLogs[today] || {};
  const prayersOnTime = Object.values(todayPrayers).filter(s => s === 'on_time').length;
  const prayersLate = Object.values(todayPrayers).filter(s => s === 'late').length;

  const habitList = habits.map(h => `- ${h.title} (${h.category})`).join('\n');
  
  const prompt = `
    Tu es un "Deen & Life Coach" sage, bienveillant et motivant.
    L'utilisateur suit ses habitudes et ses prières.
    
    Contexte :
    - Date : ${today}
    - Habitudes complétées aujourd'hui : ${completedCount}
    - Prières à l'heure : ${prayersOnTime}
    - Prières rattrapées : ${prayersLate}
    - Liste des habitudes suivies :
    ${habitList}

    Tâche :
    Donne un message court et encourageant (max 3 phrases) en FRANÇAIS.
    Si l'utilisateur a été assidu (Istiqamah), félicite-le.
    S'il a eu des difficultés, rappelle-lui la patience (Sabr) et l'importance de l'intention (Niyyah).
    Inclus un petit conseil pratique basé sur ses habitudes.
    Reste spirituel, moderne et pratique. Évite les discours théologiques trop complexes.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Continuez vos efforts, chaque petit pas compte auprès d'Allah.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Je n'arrive pas à me connecter à la source de sagesse pour le moment. Réessayez plus tard.";
  }
};