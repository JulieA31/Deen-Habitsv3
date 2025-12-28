
import React, { useState, useEffect, useRef } from 'react';
import { LayoutGrid, BarChart3, MessageSquare, BookOpen, Home, Trophy, Star, LogIn, User, Bell, Compass, Zap, ChevronLeft, Eye, EyeOff, ChevronRight, Loader2 } from 'lucide-react';

import { Habit, HabitLog, ViewMode, PrayerLog, UserProfile, PRAYER_NAMES } from './types';
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
  "Les actes ne valent que par leurs intentions",
  "Aucun de vous ne croit vraiment tant qu’il n’aime pas pour son frère ce qu’il aime pour lui-même.",
  "Allah est miséricordieux envers ceux qui sont miséricordieux.",
  "Le meilleur d’entre vous est celui qui a le meilleur comportement.",
  "Celui qui a l’intention de faire le bien et ne le fait pas, Allah lui inscrit une bonne action.",
  "La pudeur fait partie de la foi."
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
  const [isSaving, setIsSaving] = useState(false);
  
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [prayerLoading, setPrayerLoading] = useState(false);
  const [prayerError, setPrayerError] = useState<string | null>(null);
  
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lon: number} | null>(null);

  const now = new Date();
  const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  useEffect(() => {
    const random = HADITHS[Math.floor(Math.random() * HADITHS.length)];
    setCurrentHadith(random);
  }, []);

  useEffect(() => {
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
        () => {
          setPrayerError("Activez la localisation");
          setPrayerLoading(false);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (!auth) {
        setIsDataLoading(false);
        return;
    }

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setIsDataLoading(true);
      if (user) {
        if (!db) return;
        try {
          const docRef = db.collection("users").doc(user.uid);
          const docSnap = await docRef.get();
          if (docSnap.exists) {
            const data = docSnap.data();
            setUserProfile(data?.profile as UserProfile);
            setHabits(data?.habits || DEFAULT_HABITS);
            setLogs(data?.logs || {});
            setPrayerLogs(data?.prayerLogs || {});
            setView('home');
          }
        } catch (error) { console.error(error); }
      } else {
        setUserProfile(null);
        setView('auth');
      }
      setIsDataLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userProfile?.uid || !db || isDataLoading) return;
    const saveData = async () => {
      setIsSaving(true);
      try {
        await db!.collection("users").doc(userProfile.uid!).set({
          profile: userProfile,
          habits, logs, prayerLogs, lastUpdated: Date.now()
        }, { merge: true });
      } catch (error) { console.error(error); }
      finally { setTimeout(() => setIsSaving(false), 500); }
    };
    const timeoutId = setTimeout(saveData, 2000);
    return () => clearTimeout(timeoutId);
  }, [habits, logs, prayerLogs, userProfile]);

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setIsDataLoading(true);
    setAuthError('');
    try {
        if (isSignUpMode) {
            const userCredential = await auth.createUserWithEmailAndPassword(authEmail, authPassword);
            const user = userCredential.user;
            if (user) await user.updateProfile({ displayName: authName });
            const newProfile: UserProfile = {
                uid: user?.uid, name: authName, email: authEmail, xp: 0, level: 1, isPremium: false,
                joinedAt: Date.now(), notificationsEnabled: false, prayerNotifications: {},
                notificationSound: 'beep', completedChallenges: {}, activeChallenges: {}, customChallenges: []
            };
            if (db) await db.collection("users").doc(user!.uid).set({ profile: newProfile, habits: DEFAULT_HABITS, logs: {}, prayerLogs: {} });
            setUserProfile(newProfile);
        } else {
            await auth.signInWithEmailAndPassword(authEmail, authPassword);
        }
        setView('home');
    } catch (error: any) { 
        setAuthError(error.message || "Erreur d'authentification."); 
    }
    finally { setIsDataLoading(false); }
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

  const getCompletionRate = () => {
      if (!userProfile) return 0;
      const todayHabitsCount = habits.filter(h => h.frequency.length === 0 || h.frequency.includes(new Date().getDay())).length;
      const total = todayHabitsCount + 5; // Habitudes + 5 prières
      const doneHabits = habits.filter(h => logs[currentDate]?.[h.id]).length;
      const donePrayers = prayerLogs[currentDate] ? Object.values(prayerLogs[currentDate]).filter(s => s === 'on_time' || s === 'late').length : 0;
      const done = doneHabits + donePrayers;
      return Math.round((done / total) * 100) || 0;
  };

  const getLevelProgress = () => {
      if (!userProfile) return 0;
      const currentLevel = userProfile.level;
      const baseXP = Math.pow(currentLevel - 1, 2) * 100;
      const nextXP = Math.pow(currentLevel, 2) * 100;
      const range = nextXP - baseXP;
      if (range === 0) return 0;
      return Math.min(Math.max(Math.round(((userProfile.xp - baseXP) / range) * 100), 0), 100);
  };

  const NavButton = ({ target, icon: Icon, label }: { target: ViewMode, icon: any, label: string }) => (
    <button onClick={() => setView(target)} className={`flex flex-col items-center gap-1 p-2 px-3 rounded-2xl transition-all shrink-0 ${view === target ? 'text-emerald-600 bg-emerald-50 scale-105 shadow-sm border border-emerald-100/50' : 'text-slate-400 hover:text-slate-600'}`}>
      <Icon className={`w-5 h-5 ${view === target ? 'stroke-[2px]' : ''}`} />
      <span className={`text-[10px] uppercase tracking-tighter ${view === target ? 'font-bold' : 'font-semibold'}`}>{label}</span>
    </button>
  );

  if (isDataLoading) return <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50"><Loader2 className="animate-spin text-emerald-600 w-10 h-10" /><p className="text-slate-400 font-medium">Chargement de votre Deen...</p></div>;

  if (!userProfile || view === 'auth') {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-emerald-600 rounded-b-[3rem] z-0"></div>
            {showWelcomeScreen ? (
                 <div className="z-10 bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm border border-slate-100">
                    <img src="/logo.png" alt="Logo" className="w-20 h-20 mx-auto mb-6" />
                    <h1 className="text-2xl font-bold text-center mb-6 text-slate-800">Salam Alaykum</h1>
                    <form onSubmit={(e) => { e.preventDefault(); if (authName.trim()) setShowWelcomeScreen(false); setIsSignUpMode(true); }} className="space-y-4">
                        <input type="text" required value={authName} onChange={(e) => setAuthName(e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800" placeholder="Ton Prénom" />
                        <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all">C'est parti</button>
                    </form>
                    <button onClick={() => { setShowWelcomeScreen(false); setIsSignUpMode(false); }} className="w-full mt-6 text-sm text-slate-400 font-medium hover:text-emerald-600 transition-colors">J'ai déjà un compte</button>
                 </div>
            ) : (
                <div className="z-10 bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm border border-slate-100">
                    <button onClick={() => setShowWelcomeScreen(true)} className="text-xs font-bold mb-6 uppercase flex items-center gap-1 text-slate-500 hover:text-emerald-600 transition-colors"><ChevronLeft className="w-4 h-4"/> Retour</button>
                    <h1 className="text-2xl font-bold mb-6 text-slate-800">{isSignUpMode ? 'Inscription' : 'Connexion'}</h1>
                    {authError && <div className="p-3 mb-4 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100">{authError}</div>}
                    <form onSubmit={handleAuthAction} className="space-y-4">
                        {isSignUpMode && <input type="text" required value={authName} onChange={(e) => setAuthName(e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800" placeholder="Prénom" />}
                        <input type="email" required value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800" placeholder="Email" />
                        <div className="relative">
                            <input type={showPassword ? "text" : "password"} required value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800" placeholder="Mot de passe" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                        </div>
                        <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all">{isSignUpMode ? 'Créer mon compte' : 'Se connecter'}</button>
                    </form>
                    <button onClick={() => setIsSignUpMode(!isSignUpMode)} className="w-full mt-6 text-sm text-slate-500 font-medium hover:text-emerald-600 transition-colors">{isSignUpMode ? "Déjà un compte ?" : "Pas encore de compte ?"}</button>
                </div>
            )}
        </div>
    );
  }

  // Liste épurée pour la navigation (sans Home car il passe dans le header)
  const mainNavItems = [
    { id: 'coach', icon: MessageSquare, label: 'Coach IA' },
    { id: 'tracker', icon: LayoutGrid, label: 'Habitudes' },
    { id: 'invocations', icon: BookOpen, label: 'Douas' },
    { id: 'tasbih', icon: Zap, label: 'Tasbih' },
    { id: 'challenges', icon: Trophy, label: 'Défis' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 md:pb-0 font-sans">
      <aside className="hidden md:flex flex-col w-64 fixed left-0 top-0 bottom-0 bg-white border-r border-slate-200 px-4 py-8 z-50">
        <div className="flex items-center gap-3 px-4 mb-12 cursor-pointer group" onClick={() => setView('home')}>
          <div className="bg-emerald-100 p-1.5 rounded-lg group-hover:scale-110 transition-transform"><img src="/logo.png" className="w-6 h-6" /></div>
          <span className="text-xl font-bold tracking-tight">DeenHabits</span>
        </div>
        <nav className="space-y-1">
          <button onClick={() => setView('home')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${view === 'home' ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>
            <Home className={`w-5 h-5 ${view === 'home' ? 'stroke-[2px]' : ''}`} /> Accueil
          </button>
          {mainNavItems.map((item) => (
             <button key={item.id} onClick={() => setView(item.id as ViewMode)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${view === item.id ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>
                <item.icon className={`w-5 h-5 ${view === item.id ? 'stroke-[2px]' : ''}`} /> {item.label}
             </button>
          ))}
        </nav>
      </aside>

      <main className="md:ml-64 p-4 md:p-8 max-w-3xl mx-auto min-h-screen">
        {/* Header Unifié - Conditionnel selon la vue */}
        <div className="flex items-center justify-between px-1 mb-6">
            <div className="flex items-center gap-3">
                {view === 'home' ? (
                    <button 
                      onClick={() => setView('home')} 
                      className="text-2xl font-bold text-emerald-600 tracking-tight hover:opacity-80 transition-opacity"
                    >
                      Deen Habits
                    </button>
                ) : (
                    <button 
                      onClick={() => setView('home')} 
                      className="flex items-center gap-2 text-emerald-600 font-bold hover:bg-emerald-50 px-3 py-2 rounded-xl transition-all active:scale-95"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span>revenir à l'accueil</span>
                    </button>
                )}
            </div>
            
            {view === 'home' && (
                <button 
                    onClick={() => setView('profile')} 
                    className="w-12 h-12 rounded-2xl border bg-white text-slate-500 border-slate-100 hover:border-emerald-200 flex items-center justify-center transition-all shadow-sm active:scale-95 group"
                >
                    <User className="w-6 h-6" />
                </button>
            )}
        </div>

        {view === 'home' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-500"><Star className="w-24 h-24" /></div>
               <span className="text-[10px] font-bold uppercase opacity-60 tracking-[0.2em]">Hadith du jour</span>
               <p className="text-lg italic mt-3 font-serif leading-relaxed pr-8">"{currentHadith}"</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                    onClick={() => setView('levels')}
                    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 text-left hover:border-emerald-300 transition-all group"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <Trophy className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-base">Niveau {userProfile.level}</h3>
                                <div className="mt-1">
                                    <span className="text-2xl font-bold text-emerald-600 leading-none">{userProfile.xp}</span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-1.5">XP acquis</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                            <div className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-1000 ease-out" style={{ width: `${getLevelProgress()}%` }}></div>
                        </div>
                    </div>
                </button>

                {/* Accès aux Stats via l'Objectif Quotidien */}
                <button onClick={() => setView('stats')} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-emerald-300 transition-all text-left group flex items-center justify-between">
                    <div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Objectif Quotidien</div>
                        <div className="text-3xl font-bold text-emerald-600">{getCompletionRate()}% <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Fait</span></div>
                    </div>
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:rotate-12 transition-transform shadow-sm shadow-emerald-100">
                        <BarChart3 className="w-6 h-6" />
                    </div>
                </button>
            </div>

            <PrayerTracker 
              logs={prayerLogs} 
              setLogs={setPrayerLogs} 
              currentDate={currentDate} 
              onUpdateXP={handleUpdateXP} 
              prayerTimes={prayerTimes} 
              prayerLoading={prayerLoading} 
              prayerError={prayerError} 
              userProfile={userProfile} 
              onOpenQibla={() => setView('qibla')}
            />
          </div>
        )}

        {view === 'levels' && <LevelInfo currentLevel={userProfile.level} currentXP={userProfile.xp} onBack={() => setView('home')} />}
        {view === 'qibla' && (
          <div className="space-y-4">
             <button onClick={() => setView('home')} className="flex items-center gap-2 text-slate-400 font-bold px-2 py-1 hover:text-slate-600 transition-colors">
                <ChevronLeft className="w-5 h-5" /> Retour
             </button>
             <QiblaCompass userLocation={currentLocation} />
          </div>
        )}
        {view === 'coach' && <DeenCoach userProfile={userProfile} onSubscribe={() => {}} />}
        {view === 'tracker' && <HabitTracker habits={habits} logs={logs} setHabits={setHabits} setLogs={setLogs} currentDate={currentDate} onUpdateXP={handleUpdateXP} />}
        {view === 'invocations' && <InvocationLibrary />}
        {view === 'tasbih' && <TasbihCounter />}
        {view === 'challenges' && <Challenges userProfile={userProfile} onUpdateXP={handleUpdateXP} onToggleChallenge={() => {}} onStartChallenge={() => {}} onCreateChallenge={() => {}} onDeleteChallenge={() => {}} />}
        {view === 'stats' && <Analytics habits={habits} logs={logs} prayerLogs={prayerLogs} userProfile={userProfile} />}
        {view === 'profile' && <Profile userProfile={userProfile} setUserProfile={setUserProfile} onBack={() => setView('home')} />}
      </main>

      {/* Barre de navigation mobile épurée avec 5 éléments (Défis inclus) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-100 p-2 z-50 shadow-[0_-8px_30px_rgb(0,0,0,0.08)] flex justify-around items-center gap-1 px-4 safe-area-bottom">
         {mainNavItems.map(item => (
            <NavButton key={item.id} target={item.id as ViewMode} icon={item.icon} label={item.label} />
         ))}
      </nav>
    </div>
  );
};

export default App;
