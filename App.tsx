
import React, { useState, useEffect, useRef } from 'react';
import { LayoutGrid, BarChart3, MessageSquare, BookOpen, Home, Trophy, Star, User, Zap, ChevronLeft, Loader2, ChevronRight } from 'lucide-react';

import { Habit, HabitLog, ViewMode, PrayerLog, UserProfile, Challenge } from './types';
import HabitTracker from './components/HabitTracker';
import DeenCoach from './components/DeenCoach';
import Analytics from './components/Analytics';
import PrayerTracker from './components/PrayerTracker';
import InvocationLibrary from './components/InvocationLibrary';
import TasbihCounter from './components/TasbihCounter';
import Challenges from './components/Challenges';
import QiblaCompass from './components/QiblaCompass';
import LevelInfo from './components/LevelInfo';
import Profile from './components/Profile';
import { getPrayerTimes, PrayerTimes } from './services/prayerService';

// Firebase Imports
import { auth, db } from './services/firebase';

const HADITHS = [
  "La pureté est la moitié de la foi.",
  "Le meilleur d'entre vous est celui qui apprend le Coran et l'enseigne.",
  "Ne vous mettez pas en colère.",
  "Celui qui croit en Allah et au Jour Dernier, qu'il dise du bien ou qu'il se taise.",
  "Allah est Beau et Il aime la beauté.",
  "Le sourire est une aumône.",
  "Les actes ne valent que par leurs intentions"
];

const DEFAULT_HABITS: Habit[] = [
  { id: 'habit_quran', title: 'Lire le Coran', category: 'deen', icon: '📖', createdAt: Date.now(), frequency: [], xp: 30 },
  { id: 'habit_dhikr', title: 'Dhikr Matin & Soir', category: 'deen', icon: '📿', createdAt: Date.now(), frequency: [], xp: 20 },
  { id: 'habit_sport', title: 'Activité Physique', category: 'health', icon: '💪', createdAt: Date.now(), frequency: [1, 3, 5], xp: 40 }
];

const App: React.FC = () => {
  const [currentHadith, setCurrentHadith] = useState('');
  const [habits, setHabits] = useState<Habit[]>(DEFAULT_HABITS);
  const [logs, setLogs] = useState<HabitLog>({});
  const [prayerLogs, setPrayerLogs] = useState<PrayerLog>({});
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const [view, setView] = useState<ViewMode>('auth');
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [prayerLoading, setPrayerLoading] = useState(false);
  const [prayerError, setPrayerError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lon: number} | null>(null);

  const now = new Date();
  const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  // Initialisation
  useEffect(() => {
    setCurrentHadith(HADITHS[Math.floor(Math.random() * HADITHS.length)]);
    if (navigator.geolocation) {
      setPrayerLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lon: longitude });
          const fetchedTimes = await getPrayerTimes(latitude, longitude);
          if (fetchedTimes) setPrayerTimes(fetchedTimes);
          setPrayerLoading(false);
        },
        () => { setPrayerError("Localisation requise"); setPrayerLoading(false); }
      );
    }
  }, []);

  // Chargement initial depuis Firebase
  useEffect(() => {
    if (!auth) { setIsDataLoading(false); return; }
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setIsDataLoading(true);
      if (user && db) {
        try {
          const docSnap = await db.collection("users").doc(user.uid).get();
          if (docSnap.exists) {
            const data = docSnap.data();
            if (data?.profile) setUserProfile(data.profile as UserProfile);
            if (data?.habits) setHabits(data.habits);
            if (data?.logs) setLogs(data.logs);
            if (data?.prayerLogs) setPrayerLogs(data.prayerLogs);
            setView('home');
          } else {
            // Premier utilisateur
            const initialProfile: UserProfile = {
                name: user.displayName || "Utilisateur",
                email: user.email || "",
                uid: user.uid,
                xp: 0,
                level: 1,
                isPremium: false,
                joinedAt: Date.now(),
                notificationsEnabled: true,
                prayerNotifications: {},
                notificationSound: 'beep'
            };
            setUserProfile(initialProfile);
            setView('home');
          }
        } catch (error) { console.error("Erreur chargement Firebase:", error); }
      } else { setView('auth'); }
      setIsDataLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // SAUVEGARDE AUTOMATIQUE VERS FIREBASE
  useEffect(() => {
    const saveToFirebase = async () => {
      const user = auth?.currentUser;
      if (user && db && !isDataLoading && userProfile) {
        try {
          await db.collection("users").doc(user.uid).set({
            profile: userProfile,
            habits: habits,
            logs: logs,
            prayerLogs: prayerLogs,
            lastSync: Date.now()
          }, { merge: true });
        } catch (error) {
          console.error("Erreur lors de la sauvegarde auto:", error);
        }
      }
    };

    // On ne sauvegarde que si on n'est pas en train de charger
    if (!isDataLoading) {
      const timeoutId = setTimeout(saveToFirebase, 1000); // Debounce de 1s pour éviter trop d'écritures
      return () => clearTimeout(timeoutId);
    }
  }, [habits, logs, prayerLogs, userProfile, isDataLoading]);

  // Handlers pour les Défis
  const handleToggleChallenge = (challengeId: string) => {
    if (!userProfile) return;
    setUserProfile(prev => {
      if (!prev) return null;
      const newCompleted = { ...(prev.completedChallenges || {}) };
      const newActive = { ...(prev.activeChallenges || {}) };

      if (newCompleted[challengeId]) {
        delete newCompleted[challengeId];
      } else if (newActive[challengeId]) {
        delete newActive[challengeId];
        newCompleted[challengeId] = Date.now();
      }

      return { ...prev, completedChallenges: newCompleted, activeChallenges: newActive };
    });
  };

  const handleStartChallenge = (challengeId: string) => {
    if (!userProfile) return;
    setUserProfile(prev => {
      if (!prev) return null;
      const newActive = { ...(prev.activeChallenges || {}), [challengeId]: Date.now() };
      return { ...prev, activeChallenges: newActive };
    });
  };

  const handleCreateChallenge = (challenge: Challenge) => {
    if (!userProfile) return;
    setUserProfile(prev => {
      if (!prev) return null;
      const custom = [...(prev.customChallenges || []), challenge];
      return { ...prev, customChallenges: custom };
    });
  };

  const handleDeleteChallenge = (challengeId: string) => {
    if (!userProfile) return;
    setUserProfile(prev => {
      if (!prev) return null;
      const custom = (prev.customChallenges || []).filter(c => c.id !== challengeId);
      return { ...prev, customChallenges: custom };
    });
  };

  const handleUpdateXP = (points: number) => {
    if (!userProfile) return;
    setUserProfile(prev => {
      if (!prev) return null;
      const newXP = Math.max(0, prev.xp + points);
      const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;
      return { ...prev, xp: newXP, level: newLevel };
    });
  };

  const getLevelProgress = () => {
    if (!userProfile) return 0;
    const currentLevel = userProfile.level;
    const currentLevelXP = Math.pow(currentLevel - 1, 2) * 100;
    const nextLevelXP = Math.pow(currentLevel, 2) * 100;
    const range = nextLevelXP - currentLevelXP;
    if (range === 0) return 0;
    return Math.min(Math.max(Math.round(((userProfile.xp - currentLevelXP) / range) * 100), 0), 100);
  };

  const getNextLevelXPThreshold = () => {
    if (!userProfile) return 100;
    return Math.pow(userProfile.level, 2) * 100;
  };

  const getCompletionRate = () => {
      if (!userProfile) return 0;
      const todayHabitsCount = habits.filter(h => h.frequency.length === 0 || h.frequency.includes(new Date().getDay())).length;
      const total = todayHabitsCount + 5;
      const doneHabits = habits.filter(h => logs[currentDate]?.[h.id]).length;
      const donePrayers = prayerLogs[currentDate] ? Object.values(prayerLogs[currentDate]).filter(s => s === 'on_time' || s === 'late').length : 0;
      const rate = Math.round(((doneHabits + donePrayers) / total) * 100) || 0;
      return Math.min(rate, 100);
  };

  // Fixed TypeScript error: Added key to NavButton props type for list rendering
  const NavButton = ({ target, icon: Icon, label }: { target: ViewMode, icon: any, label: string, key?: string }) => (
    <button onClick={() => setView(target)} className={`flex flex-col items-center gap-1 p-2 px-3 rounded-2xl transition-all shrink-0 min-w-[85px] ${view === target ? 'text-emerald-600 bg-emerald-50 scale-105 shadow-sm border border-emerald-100/50' : 'text-slate-400 hover:text-slate-600'}`}>
      <Icon className={`w-5 h-5 ${view === target ? 'stroke-[2px]' : ''}`} />
      <span className={`text-[10px] uppercase tracking-tighter text-center leading-none ${view === target ? 'font-bold' : 'font-semibold'}`}>{label}</span>
    </button>
  );

  if (isDataLoading) return <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-emerald-600 w-10 h-10" /></div>;

  if (view === 'auth') {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-emerald-600 rounded-b-[3rem]"></div>
            <div className="z-10 bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm border border-slate-100 text-center">
                <img src="/logo.png" alt="Logo" className="w-20 h-20 mx-auto mb-6" />
                <h1 className="text-2xl font-bold mb-6 text-slate-800">Deen Habits</h1>
                <button onClick={() => setView('home')} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-100">Entrer dans l'app</button>
            </div>
        </div>
    );
  }

  const mainNavItems = [
    { id: 'tracker', icon: LayoutGrid, label: 'Habitudes' },
    { id: 'challenges', icon: Trophy, label: 'Défis' },
    { id: 'invocations', icon: BookOpen, label: 'Invocations' },
    { id: 'coach', icon: MessageSquare, label: 'Coach' },
    { id: 'tasbih', icon: Zap, label: 'Tasbih' },
    { id: 'stats', icon: BarChart3, label: 'Statistiques' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 md:pb-0 font-sans">
      <main className="max-w-3xl mx-auto p-4 md:p-8 min-h-screen">
        {/* Header - Accueil */}
        {view === 'home' && (
            <div className="flex items-center justify-between px-1 mb-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-3">
                    <img src="/logo.png" className="w-10 h-10" alt="Logo" />
                    <h1 className="text-2xl font-bold text-emerald-600 tracking-tight">Deen Habits</h1>
                </div>
                <button onClick={() => setView('profile')} className="w-12 h-12 rounded-2xl border bg-white text-slate-500 border-slate-100 flex items-center justify-center shadow-sm active:scale-95 transition-all">
                    <User className="w-6 h-6" />
                </button>
            </div>
        )}

        {view === 'home' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Carte Hadith */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
               <span className="text-[10px] font-bold uppercase opacity-60 tracking-widest">Hadith du jour</span>
               <p className="text-lg italic mt-3 font-serif leading-relaxed">"{currentHadith}"</p>
            </div>

            {/* Section Progression XP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => setView('levels')} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm text-left group">
                    <div className="flex justify-between items-end mb-2">
                        <div>
                            <div className="text-[10px] text-slate-400 uppercase font-bold mb-1 tracking-widest">Grade actuel</div>
                            <div className="text-2xl font-semibold text-emerald-600">Niveau {userProfile?.level || 1}</div>
                        </div>
                        <div className="text-right">
                             <div className="text-[10px] text-slate-400 uppercase font-bold mb-1 tracking-widest">Points</div>
                             <div className="text-sm font-semibold text-slate-600">{userProfile?.xp} <span className="text-slate-300 font-normal">/ {getNextLevelXPThreshold()}</span></div>
                        </div>
                    </div>
                    {/* Barre de progression XP */}
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-yellow-400 transition-all duration-1000 ease-out" 
                          style={{ width: `${getLevelProgress()}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Prochain Grade</span>
                        <span className="text-[10px] text-emerald-600 font-bold uppercase">-{getNextLevelXPThreshold() - (userProfile?.xp || 0)} XP</span>
                    </div>
                </button>

                <button onClick={() => setView('stats')} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm text-left flex flex-col justify-center">
                    <div className="text-[10px] text-slate-400 uppercase font-bold mb-1 tracking-widest">Objectif du jour</div>
                    <div className="flex items-center justify-between">
                        <div className="text-4xl font-medium text-emerald-600 tracking-tight">{getCompletionRate()}%</div>
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                            <BarChart3 className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 font-medium">Réussi aujourd'hui</p>
                </button>
            </div>

            <PrayerTracker logs={prayerLogs} setLogs={setPrayerLogs} currentDate={currentDate} onUpdateXP={handleUpdateXP} prayerTimes={prayerTimes} prayerLoading={prayerLoading} prayerError={prayerError} userProfile={userProfile} onOpenQibla={() => setView('qibla')} />
          </div>
        )}

        {/* Vues de l'application */}
        <div className={view === 'home' ? '' : 'pt-2 animate-in fade-in duration-300'}>
            {view === 'levels' && <LevelInfo currentLevel={userProfile?.level || 1} currentXP={userProfile?.xp || 0} onBack={() => setView('home')} />}
            {view === 'qibla' && <div className="space-y-4"><QiblaCompass userLocation={currentLocation} /></div>}
            {view === 'coach' && <DeenCoach userProfile={userProfile!} onSubscribe={() => {}} />}
            {view === 'tracker' && <HabitTracker habits={habits} logs={logs} setHabits={setHabits} setLogs={setLogs} currentDate={currentDate} onUpdateXP={handleUpdateXP} />}
            {view === 'invocations' && <InvocationLibrary />}
            {view === 'tasbih' && <TasbihCounter />}
            {view === 'challenges' && (
              <Challenges 
                userProfile={userProfile!} 
                onUpdateXP={handleUpdateXP} 
                onToggleChallenge={handleToggleChallenge} 
                onStartChallenge={handleStartChallenge} 
                onCreateChallenge={handleCreateChallenge} 
                onDeleteChallenge={handleDeleteChallenge} 
              />
            )}
            {view === 'stats' && <Analytics habits={habits} logs={logs} prayerLogs={prayerLogs} userProfile={userProfile!} />}
            {view === 'profile' && <Profile userProfile={userProfile!} setUserProfile={setUserProfile} onBack={() => setView('home')} />}
        </div>
      </main>

      {/* Navigation Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="relative bg-white/95 backdrop-blur-xl border-t border-slate-100 safe-area-bottom overflow-hidden">
             <nav className="flex overflow-x-auto no-scrollbar justify-start items-center gap-1 px-4 py-2 relative">
                <NavButton target="home" icon={Home} label="Accueil" />
                {mainNavItems.map(item => (
                   <NavButton key={item.id} target={item.id as ViewMode} icon={item.icon} label={item.label} />
                ))}
                <div className="shrink-0 w-8"></div>
             </nav>
             
             <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white via-white/40 to-transparent pointer-events-none flex items-center justify-end pr-1 opacity-90">
                <ChevronRight className="w-4 h-4 text-slate-300 animate-pulse mr-1" />
             </div>
          </div>
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default App;
