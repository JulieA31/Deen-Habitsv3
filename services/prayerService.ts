
export interface PrayerTimes {
  Fajr: string;
  Sunrise: string; // Lever du soleil
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

export const getPrayerTimes = async (latitude: number, longitude: number): Promise<PrayerTimes | null> => {
  try {
    const date = new Date();
    const timestamp = Math.floor(date.getTime() / 1000);
    
    // Utilisation de l'API Aladhan (Méthode 3 - Muslim World League)
    const response = await fetch(
      `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=3`
    );
    
    const data = await response.json();
    
    if (data && data.data && data.data.timings) {
      return data.data.timings;
    }
    return null;
  } catch (error) {
    console.error("Erreur lors de la récupération des horaires de prière:", error);
    return null;
  }
};
