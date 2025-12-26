
import React, { useState, useEffect, useRef } from 'react';
import { LayoutGrid, BarChart3, MessageSquare, BookOpen, Home, Trophy, Star, LogIn, ArrowRight, User, Trash2, Bell, Shield, Volume2, Play, CreditCard, Loader2, GripHorizontal, CloudOff, Cloud, Mail, Lock, AlertCircle, ChevronLeft, Eye, EyeOff, Share2, RefreshCw, Edit2, Save, X, Compass, Zap } from 'lucide-react';

import { Habit, HabitLog, ViewMode, PrayerLog, UserProfile, PRAYER_NAMES, Challenge } from './types';
import HabitTracker from './components/HabitTracker';
import DeenCoach from './components/DeenCoach';
import Analytics from './components/Analytics';
import PrayerTracker from './components/PrayerTracker';
import InvocationLibrary from './components/InvocationLibrary';
import TasbihCounter from './components/TasbihCounter';
import PremiumModal from './components/PremiumModal';
import PrivacyPolicy from './components/PrivacyPolicy';
import Challenges from './components/Challenges';
import QiblaCompass from './components/QiblaCompass';
import { getPrayerTimes, PrayerTimes } from './services/prayerService';

// Firebase Imports
import { auth, db, firebase } from './services/firebase';

// Audio Assets
const SOUND_URLS = {
  beep: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
  adhan: 'https://www.islamcan.com/audio/adhan/azan1.mp3' 
};

// Initial Data
const DEFAULT_HABITS: Habit[] = [
  { id: '1', title: 'Lecture Coran (1 page)', category: 'deen', icon: '📖', createdAt: Date.now(), frequency: [], xp: 15 },
  { id: '2', title: 'Boire 1,5L Eau', category: 'health', icon: '💧', createdAt: Date.now(), frequency: [], xp: 5 },
];

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

const App: React.FC = () => {
  const [currentHadith, setCurrentHadith] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
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

  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState('');

  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [prayerLoading, setPrayerLoading] = useState(false);
  const [prayerError, setPrayerError] = useState<string | null>(null);
  const notifiedPrayersRef = useRef<Set<string>>(new Set());

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
          if (fetchedTimes) {
            setPrayerTimes(fetchedTimes);
          } else {
            setPrayerError("Impossible de charger les horaires.");
          }
          setPrayerLoading(false);
        },
        (err) => {
          console.error(err);
          setPrayerError("Activez la localisation pour les horaires.");
          setPrayerLoading(false);
        }
      );
    } else {
      setPrayerError("Géolocalisation non supportée.");
    }
  }, []);

  useEffect(() => {
    if (!prayerTimes || !userProfile?.notificationsEnabled) return;

    const intervalId = setInterval(() => {
      const now = new Date();
      const currentHM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      if (currentHM === '00:00') {
        notifiedPrayersRef.current.clear();
      }

      PRAYER_NAMES.forEach(prayer => {
        const isEnabled = userProfile.prayerNotifications?.[prayer];
        const time = prayerTimes[prayer];
        const cleanTime = time ? time.split(' ')[0] : '';

        if (isEnabled && cleanTime === currentHM && !notifiedPrayersRef.current.has(prayer)) {
          notifiedPrayersRef.current.add(prayer);
          playSound(userProfile.notificationSound || 'beep');
          if (Notification.permission === 'granted') {
             new Notification(`C'est l'heure de ${prayer}`, {
                body: "Hayya 'ala Salah (Venez à la prière)",
                icon: '/logo.png'
             });
          }
        }
      });

    }, 10000);

    return () => clearInterval(intervalId);
  }, [prayerTimes, userProfile]);

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
            let profile = data?.profile as UserProfile;

            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('payment_success') === 'true' && !profile.isPremium) {
                profile = { ...profile, isPremium: true };
                window.history.replaceState({}, document.title, window.location.pathname);
                alert("MashaAllah ! Merci pour votre abonnement Premium.");
            }

            setUserProfile(profile);
            setHabits(data?.habits || DEFAULT_HABITS);
            setLogs(data?.logs || {});
            setPrayerLogs(data?.prayerLogs || {});
            setView('home');
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setAuthError("Erreur de connexion à la base de données.");
        }
      } else {
        setUserProfile(null);
        setView('auth');
        setShowWelcomeScreen(true);
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
        const docRef = db.collection("users").doc(userProfile.uid!);
        await docRef.set({
          profile: userProfile,
          habits: habits,
          logs: logs,
          prayerLogs: prayerLogs,
          lastUpdated: Date.now()
        }, { merge: true });
      } catch (error) {
        console.error("Error saving data:", error);
      } finally {
        setTimeout(() => setIsSaving(false), 500);
      }
    };

    const timeoutId = setTimeout(saveData, 2000);
    return () => clearTimeout(timeoutId);
  }, [habits, logs, prayerLogs, userProfile]);

  const playSound = (soundType: 'beep' | 'adhan') => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }

    const audio = new Audio(SOUND_URLS[soundType]);
    audioRef.current = audio;
    setIsPlayingSound(true);
    
    audio.play().catch(error => console.error(error));
    audio.onended = () => setIsPlayingSound(false);
  };

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setIsDataLoading(true);
    try {
        if (isSignUpMode) {
            const userCredential = await auth.createUserWithEmailAndPassword(authEmail, authPassword);
            const user = userCredential.user;
            if (user) await user.updateProfile({ displayName: authName });

            const newProfile: UserProfile = {
                uid: user?.uid,
                name: authName,
                email: authEmail,
                xp: 0,
                level: 1,
                isPremium: false,
                joinedAt: Date.now(),
                notificationsEnabled: false,
                prayerNotifications: {},
                notificationSound: 'beep',
                completedChallenges: {},
                activeChallenges: {},
                customChallenges: []
            };

            if (db && user) {
                await db.collection("users").doc(user.uid).set({
                    profile: newProfile,
                    habits: DEFAULT_HABITS,
                    logs: {},
                    prayerLogs: {}
                });
            }
            setUserProfile(newProfile);
        } else {
            await auth.signInWithEmailAndPassword(authEmail, authPassword);
        }
        setView('home');
    } catch (error: any) {
        setAuthError("Identifiants incorrects ou erreur serveur.");
    } finally {
        setIsDataLoading(false);
    }
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
      const total = habits.filter(h => h.frequency.length === 0 || h.frequency.includes(new Date().getDay())).length + 5;
      const done = habits.filter(h => logs[currentDate]?.[h.id]).length + (prayerLogs[currentDate] ? Object.values(prayerLogs[currentDate]).filter(s => s === 'on_time' || s === 'late').length : 0);
      return Math.round((done / total) * 100) || 0;
  };

  const getLevelProgress = () => {
      if (!userProfile) return 0;
      const currentLevel = userProfile.level;
      const currentXP = userProfile.xp;
      
      const baseXP = Math.pow(currentLevel - 1, 2) * 100;
      const nextXP = Math.pow(currentLevel, 2) * 100;
      const range = nextXP - baseXP;
      
      if (range === 0) return 0;
      const progress = ((currentXP - baseXP) / range) * 100;
      return Math.min(Math.max(Math.round(progress), 0), 100);
  };

  const NavButton = ({ target, icon: Icon, label }: { target: ViewMode, icon: any, label: string }) => (
    <button 
      onClick={() => setView(target)}
      className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors min-w-[55px] ${view === target ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-slate-600'}`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );

  if (isDataLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-600" /></div>;

  if (!userProfile || view === 'auth') {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-emerald-600 rounded-b-[3rem] z-0"></div>
            {showWelcomeScreen ? (
                 <div className="z-10 bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm border border-slate-100">
                    <img src="/logo.png" alt="Logo" className="w-20 h-20 mx-auto mb-6" />
                    <h1 className="text-2xl font-bold text-center mb-6 text-slate-800">Salam Alaykum</h1>
                    <form onSubmit={(e) => { e.preventDefault(); if (authName.trim()) { setShowWelcomeScreen(false); setIsSignUpMode(true); } }} className="space-y-4">
                        <input type="text" required value={authName} onChange={(e) => setAuthName(e.target.value)} className="w-full p-3 border rounded-xl text-slate-800" placeholder="Ton Prénom" />
                        <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold">C'est parti</button>
                    </form>
                    <button onClick={() => { setShowWelcomeScreen(false); setIsSignUpMode(false); }} className="w-full mt-4 text-sm text-slate-400">J'ai déjà un compte</button>
                 </div>
            ) : (
                <div className="z-10 bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm border border-slate-100">
                    <button onClick={() => setShowWelcomeScreen(true)} className="text-xs font-bold mb-4 uppercase flex items-center gap-1 text-slate-500"><ChevronLeft className="w-4 h-4"/> Retour</button>
                    <h1 className="text-2xl font-bold mb-6 text-slate-800">{isSignUpMode ? 'Inscription' : 'Connexion'}</h1>
                    {authError && <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {authError}</div>}
                    <form onSubmit={handleAuthAction} className="space-y-4">
                        {isSignUpMode && <input type="text" required value={authName} onChange={(e) => setAuthName(e.target.value)} className="w-full p-3 border rounded-xl text-slate-800" placeholder="Prénom" />}
                        <input type="email" required value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="w-full p-3 border rounded-xl text-slate-800" placeholder="Email" />
                        <div className="relative">
                            <input type={showPassword ? "text" : "password"} required value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="w-full p-3 border rounded-xl text-slate-800" placeholder="Mot de passe" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-100">{isSignUpMode ? 'Créer mon compte' : 'Se connecter'}</button>
                    </form>
                    <button onClick={() => setIsSignUpMode(!isSignUpMode)} className="w-full mt-6 text-sm text-slate-500">{isSignUpMode ? "Déjà un compte ?" : "Pas encore de compte ?"}</button>
                </div>
            )}
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 md:pb-0 font-sans">
      <aside className="hidden md:flex flex-col w-64 fixed left-0 top-0 bottom-0 bg-white border-r border-slate-200 px-4 py-8 z-50">
        <div className="flex items-center gap-3 px-4 mb-12 cursor-pointer" onClick={() => setView('home')}>
          <img src="/logo.png" className="w-8 h-8" />
          <span className="text-xl font-bold">DeenHabits</span>
        </div>
        <nav className="space-y-1">
          {[
            { id: 'home', icon: Home, label: 'Accueil' },
            { id: 'tracker', icon: LayoutGrid, label: 'Habitudes' },
            { id: 'qibla', icon: Compass, label: 'Qibla' },
            { id: 'invocations', icon: BookOpen, label: 'Invocations' },
            { id: 'tasbih', icon: GripHorizontal, label: 'Tasbih' },
            { id: 'challenges', icon: Trophy, label: 'Défis' },
            { id: 'stats', icon: BarChart3, label: 'Stats' },
            { id: 'profile', icon: User, label: 'Profil' }
          ].map((item) => (
             <button key={item.id} onClick={() => setView(item.id as ViewMode)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${view === item.id ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50'}`}>
                <item.icon className="w-5 h-5" /> {item.label}
             </button>
          ))}
        </nav>
      </aside>

      <main className="md:ml-64 p-4 md:p-8 max-w-3xl mx-auto min-h-screen">
        {view === 'home' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10"><Star className="w-20 h-20" /></div>
               <span className="text-xs font-bold uppercase opacity-80 tracking-widest">Hadith du jour</span>
               <p className="text-lg italic mt-3 font-serif leading-relaxed">"{currentHadith}"</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center shadow-sm">
                            <Trophy className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg">Niveau {userProfile.level}</h3>
                            <p className="text-xs text-slate-400 font-medium">{userProfile.xp} XP au total</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">Progrès</span>
                    </div>
                </div>
                
                <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                        <span>XP du niveau actuel</span>
                        <span>{getLevelProgress()}%</span>
                    </div>
                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                        <div 
                            className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-700 ease-out shadow-inner"
                            style={{ width: `${getLevelProgress()}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setView('stats')} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:bg-slate-50 transition-colors text-left group">
                    <div className="flex justify-between items-start mb-2">
                        <div className="text-3xl font-bold text-emerald-600">{getCompletionRate()}%</div>
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:scale-110 transition-transform"><BarChart3 className="w-5 h-5" /></div>
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Complétion du jour</div>
                </button>
                <button onClick={() => setView('qibla')} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:bg-slate-50 transition-colors text-left group">
                    <div className="flex justify-between items-start mb-2">
                        <div className="text-3xl font-bold text-slate-800"><Compass className="w-8 h-8 text-emerald-600" /></div>
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:rotate-45 transition-transform"><Zap className="w-5 h-5" /></div>
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Boussole Qibla</div>
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
                onToggleNotification={() => {}}
            />
          </div>
        )}

        {view === 'qibla' && <QiblaCompass userLocation={currentLocation} />}
        {view === 'tracker' && <HabitTracker habits={habits} logs={logs} setHabits={setHabits} setLogs={setLogs} currentDate={currentDate} onUpdateXP={handleUpdateXP} />}
        {view === 'invocations' && <InvocationLibrary />}
        {view === 'tasbih' && <TasbihCounter />}
        {view === 'challenges' && <Challenges userProfile={userProfile} onUpdateXP={handleUpdateXP} onToggleChallenge={() => {}} onStartChallenge={() => {}} onCreateChallenge={() => {}} onDeleteChallenge={() => {}} />}
        {view === 'stats' && <Analytics habits={habits} logs={logs} prayerLogs={prayerLogs} userProfile={userProfile} />}
        {view === 'profile' && (
            <div className="max-w-lg mx-auto space-y-6">
                 <button onClick={() => setView('home')} className="w-full p-4 bg-white border rounded-xl flex items-center gap-3 text-slate-600 font-bold"><Home className="w-5 h-5" /> Retour à l'accueil</button>
                 <button onClick={() => auth?.signOut()} className="w-full p-4 bg-white border rounded-xl flex items-center gap-3 text-red-600 font-bold"><LogIn className="w-5 h-5 rotate-180" /> Déconnexion</button>
            </div>
        )}
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-2 flex justify-around items-center z-50 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)]">
         <NavButton target="home" icon={Home} label="Accueil" />
         <NavButton target="tracker" icon={LayoutGrid} label="Habitudes" />
         <NavButton target="invocations" icon={BookOpen} label="Douas" />
         <NavButton target="challenges" icon={Trophy} label="Défis" />
         <NavButton target="tasbih" icon={GripHorizontal} label="Tasbih" />
      </nav>
    </div>
  );
};

export default App;
