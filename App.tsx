
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

// Helper pour récupérer les variables d'environnement
const getEnv = (key: string) => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    return import.meta.env[`VITE_${key}`] || import.meta.env[key];
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env[`VITE_${key}`] || process.env[key];
  }
  return undefined;
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
  
  // States Modal & Paiement
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Data State
  const [habits, setHabits] = useState<Habit[]>(DEFAULT_HABITS);
  const [logs, setLogs] = useState<HabitLog>({});
  const [prayerLogs, setPrayerLogs] = useState<PrayerLog>({});
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // App State
  const [view, setView] = useState<ViewMode>('auth');
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Auth Form State
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Profile Edit State
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState('');

  // Lifted Prayer State
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [prayerLoading, setPrayerLoading] = useState(false);
  const [prayerError, setPrayerError] = useState<string | null>(null);
  const notifiedPrayersRef = useRef<Set<string>>(new Set());

  // Location ref for Qibla
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lon: number} | null>(null);

  const now = new Date();
  const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  // Load Random Hadith
  useEffect(() => {
    const random = HADITHS[Math.floor(Math.random() * HADITHS.length)];
    setCurrentHadith(random);
  }, []);

  // Fetch Prayer Times & Location
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

  // Check Prayer Times Loop
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

  // Auth Sync
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

  // Auto Save
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

  const stopSound = () => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlayingSound(false);
    }
  };

  // --- HANDLERS ---
  const handleWelcomeSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (authName.trim()) {
          setShowWelcomeScreen(false);
          setIsSignUpMode(true);
          setAuthError('');
      }
  };

  const handleSkipToLogin = () => {
      setShowWelcomeScreen(false);
      setIsSignUpMode(false);
      setAuthError('');
  };

  const handleForgotPassword = async () => {
      if (!authEmail) {
          setAuthError("Veuillez entrer votre email.");
          return;
      }
      if (!auth) return;
      try {
          await auth.sendPasswordResetEmail(authEmail);
          alert(`Un email de réinitialisation de mot de passe a été envoyé à ${authEmail}.`);
          setAuthError('');
      } catch (error: any) {
          setAuthError("Erreur lors de l'envoi de l'email de réinitialisation.");
      }
  };

  const handleGoogleLogin = async () => {
    if (!auth) return;
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await auth.signInWithPopup(provider);
      setView('home');
    } catch (error: any) {
      setAuthError("Erreur de connexion avec Google.");
    }
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

  const handleLogout = async () => {
    if (auth) await auth.signOut();
  };

  const handleUpdateProfileName = async () => {
    if (!editNameValue.trim() || !userProfile || !auth?.currentUser) return;
    setIsDataLoading(true);
    try {
        await auth.currentUser.updateProfile({ displayName: editNameValue });
        if (db) await db.collection("users").doc(userProfile.uid!).update({ "profile.name": editNameValue });
        setUserProfile(prev => prev ? { ...prev, name: editNameValue } : null);
        setIsEditingName(false);
    } catch (error) {
        alert("Erreur lors de la mise à jour du profil.");
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

  // Challenge logic
  const handleStartChallenge = (id: string) => {
      setUserProfile(prev => {
          if (!prev) return null;
          return { ...prev, activeChallenges: { ...(prev.activeChallenges || {}), [id]: Date.now() } };
      });
  };

  const handleCompleteChallenge = (id: string) => {
      setUserProfile(prev => {
          if (!prev) return null;
          const completed = { ...(prev.completedChallenges || {}) };
          const active = { ...(prev.activeChallenges || {}) };
          if (completed[id]) { delete completed[id]; } 
          else { completed[id] = Date.now(); delete active[id]; }
          return { ...prev, completedChallenges: completed, activeChallenges: active };
      });
  };

  const handleCreateChallenge = (challenge: Challenge) => {
      setUserProfile(prev => prev ? { ...prev, customChallenges: [...(prev.customChallenges || []), challenge] } : null);
  };

  const handleDeleteChallenge = (id: string) => {
      setUserProfile(prev => prev ? { ...prev, customChallenges: (prev.customChallenges || []).filter(c => c.id !== id) } : null);
  };

  const getCompletionRate = () => {
      if (!userProfile) return 0;
      const total = habits.filter(h => h.frequency.length === 0 || h.frequency.includes(new Date().getDay())).length + 5;
      const done = habits.filter(h => logs[currentDate]?.[h.id]).length + (prayerLogs[currentDate] ? Object.values(prayerLogs[currentDate]).filter(s => s === 'on_time' || s === 'late').length : 0);
      return Math.round((done / total) * 100) || 0;
  };

  const getLevelProgress = () => {
      if (!userProfile) return 0;
      // Basé sur handleUpdateXP: floor(sqrt(xp/100)) + 1
      // Pour une barre de progression simple entre les niveaux de 100 XP
      return userProfile.xp % 100;
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
                    <form onSubmit={handleWelcomeSubmit} className="space-y-4">
                        <input type="text" required value={authName} onChange={(e) => setAuthName(e.target.value)} className="w-full p-3 border rounded-xl text-slate-800" placeholder="Ton Prénom" />
                        <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold">C'est parti</button>
                    </form>
                    <button onClick={handleSkipToLogin} className="w-full mt-4 text-sm text-slate-400">J'ai déjà un compte</button>
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
                        {!isSignUpMode && <button type="button" onClick={handleForgotPassword} className="text-xs text-emerald-600 font-bold block text-right">Mot de passe oublié ?</button>}
                        <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-100">{isSignUpMode ? 'Créer mon compte' : 'Se connecter'}</button>
                    </form>
                    <div className="relative flex py-4 items-center"><div className="flex-grow border-t border-slate-100"></div><span className="flex-shrink-0 mx-4 text-xs text-slate-300">OU</span><div className="flex-grow border-t border-slate-100"></div></div>
                    <button onClick={handleGoogleLogin} className="w-full p-3 border border-slate-200 rounded-xl flex items-center justify-center gap-3 font-medium text-slate-600 hover:bg-slate-50">
                        <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> Continuer avec Google
                    </button>
                    <button onClick={() => setIsSignUpMode(!isSignUpMode)} className="w-full mt-6 text-sm text-slate-500">{isSignUpMode ? "Déjà un compte ?" : "Pas encore de compte ?"}</button>
                </div>
            )}
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 md:pb-0 font-sans">
      <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} onConfirm={() => setShowPremiumModal(false)} isLoading={isProcessingPayment} />

      {/* Sidebar Desktop */}
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
            {/* 1. Header Hadith */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10"><Star className="w-20 h-20" /></div>
               <span className="text-xs font-bold uppercase opacity-80 tracking-widest">Hadith du jour</span>
               <p className="text-lg italic mt-3 font-serif leading-relaxed">"{currentHadith}"</p>
            </div>

            {/* 2. Nouveau Dashboard : Niveau et Jauge */}
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
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">Prochain Niveau</span>
                    </div>
                </div>
                
                <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                        <span>Progression</span>
                        <span>{getLevelProgress()}%</span>
                    </div>
                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                        <div 
                            className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-1000 ease-out shadow-inner"
                            style={{ width: `${getLevelProgress()}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* 3. Statistiques de Complétion et Raccourci Qibla */}
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
                onToggleNotification={(p) => {}}
            />
          </div>
        )}

        {view === 'qibla' && <QiblaCompass userLocation={currentLocation} />}
        {view === 'tracker' && <HabitTracker habits={habits} logs={logs} setHabits={setHabits} setLogs={setLogs} currentDate={currentDate} onUpdateXP={handleUpdateXP} />}
        {view === 'invocations' && <InvocationLibrary />}
        {view === 'tasbih' && <TasbihCounter />}
        {view === 'challenges' && <Challenges userProfile={userProfile} onUpdateXP={handleUpdateXP} onToggleChallenge={handleCompleteChallenge} onStartChallenge={handleStartChallenge} onCreateChallenge={handleCreateChallenge} onDeleteChallenge={handleDeleteChallenge} />}
        {view === 'stats' && <Analytics habits={habits} logs={logs} prayerLogs={prayerLogs} userProfile={userProfile} />}
        {view === 'coach' && <DeenCoach userProfile={userProfile} onSubscribe={() => setShowPremiumModal(true)} />}
        
        {view === 'profile' && (
            <div className="max-w-lg mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 text-emerald-700 shadow-inner font-bold border-4 border-white">
                        {userProfile.name.charAt(0).toUpperCase()}
                    </div>
                    {isEditingName ? (
                        <div className="flex items-center justify-center gap-2">
                            <input value={editNameValue} onChange={(e) => setEditNameValue(e.target.value)} className="border-2 border-emerald-500 p-2 rounded-xl w-48 text-center text-lg font-bold" autoFocus />
                            <button onClick={handleUpdateProfileName} className="p-2 bg-emerald-600 text-white rounded-lg"><Save className="w-5 h-5" /></button>
                            <button onClick={() => setIsEditingName(false)} className="p-2 bg-slate-200 text-slate-600 rounded-lg"><X className="w-5 h-5" /></button>
                        </div>
                    ) : (
                        <h2 className="text-3xl font-bold flex items-center justify-center gap-2 text-slate-800">
                            {userProfile.name} 
                            <button onClick={() => { setEditNameValue(userProfile.name); setIsEditingName(true); }} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                                <Edit2 className="w-5 h-5 text-slate-300" />
                            </button>
                        </h2>
                    )}
                    <p className="text-slate-400 text-sm mt-1">{userProfile.email}</p>
                </div>
                
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
                    <button onClick={() => setView('home')} className="w-full p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors text-slate-700 font-medium">
                        <Home className="w-5 h-5 text-slate-400" /> Retour à l'accueil
                    </button>
                    <button onClick={handleLogout} className="w-full p-4 flex items-center gap-4 hover:bg-red-50 transition-colors text-red-600 font-bold">
                        <LogIn className="w-5 h-5 rotate-180" /> Se déconnecter
                    </button>
                </div>
                
                <div className="p-6 bg-slate-100 rounded-2xl text-center">
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">XP Total</p>
                    <div className="text-3xl font-black text-slate-800">{userProfile.xp}</div>
                </div>
            </div>
        )}
      </main>

      {/* Mobile Bottom Navigation - Avec Bouton Accueil réactivé */}
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
