
export interface Habit {
  id: string;
  title: string;
  category: 'deen' | 'health' | 'productivity' | 'general';
  icon: string;
  createdAt: number;
  frequency: number[]; // 0 (Dimanche) à 6 (Samedi). Si vide = tous les jours.
  xp: number;
}

export type PrayerStatus = 'none' | 'on_time' | 'late' | 'missed';

export interface PrayerLog {
  [date: string]: {
    [prayerName: string]: PrayerStatus;
  };
}

export interface HabitLog {
  [date: string]: {
    [habitId: string]: boolean;
  };
}

export interface UserProfile {
  name: string;
  email?: string;
  xp: number;
  level: number;
  isPremium: boolean;
  joinedAt: number;
  notificationsEnabled: boolean;
  notificationSound: 'beep' | 'adhan';
}

export interface Invocation {
  id: string;
  title: string;
  category: string;
  arabic: string;
  phonetic: string;
  translation: string;
}

export type ViewMode = 'auth' | 'home' | 'tracker' | 'invocations' | 'stats' | 'coach' | 'profile';

export const CATEGORY_COLORS = {
  deen: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  health: 'bg-blue-100 text-blue-800 border-blue-200',
  productivity: 'bg-purple-100 text-purple-800 border-purple-200',
  general: 'bg-gray-100 text-gray-800 border-gray-200',
};

export const CATEGORY_ICONS = {
  deen: '☪️',
  health: '💪',
  productivity: '🚀',
  general: '✨',
};

export const PRAYER_NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];