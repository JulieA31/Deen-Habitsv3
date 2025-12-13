
import React, { useState, useEffect, useRef } from 'react';
import { LayoutGrid, BarChart3, MessageSquare, BookOpen, Home, Trophy, Star, LogIn, ArrowRight, User, Trash2, Bell, Shield, Volume2, Play, CreditCard, Loader2, GripHorizontal, CloudOff, Cloud, Mail, Lock, AlertCircle, ChevronLeft, Eye, EyeOff, Share2, RefreshCw } from 'lucide-react';

import { Habit, HabitLog, ViewMode, PrayerLog, UserProfile, PRAYER_NAMES } from './types';
import HabitTracker from './components/HabitTracker';
import DeenCoach from './components/DeenCoach';
import Analytics from './components/Analytics';
import PrayerTracker from './components/PrayerTracker';
import InvocationLibrary from './components/InvocationLibrary';
import TasbihCounter from './components/TasbihCounter';
import PremiumModal from './components/PremiumModal';
import PrivacyPolicy from './components/PrivacyPolicy'; // Import New Component
import Challenges from './components/Challenges'; // Import New Component
import { getPrayerTimes, PrayerTimes } from './services/prayerService';

// Firebase Imports
import { auth, db, firebase } from './services/firebase';

// Audio Assets - Utilisation d'URLs externes fiables
const SOUND_URLS = {
  beep: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
  adhan: 'https://www.islamcan.com/audio/adhan/azan1.mp3' 
};

// Helper pour récupérer les variables d'environnement (Compatible Vite)
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
  const [isDataLoading, setIsDataLoading] = useState(true); // Loading screen for Firebase
  const [isSaving, setIsSaving] = useState(false); // Saving indicator
  
  // Auth Form State
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true); // NEW: Controls the "First Name" screen
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility

  // Lifted Prayer State
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [prayerLoading, setPrayerLoading] = useState(false);
  const [prayerError, setPrayerError] = useState<string | null>(null);
  const notifiedPrayersRef = useRef<Set<string>>(new Set());

  // Native date formatting instead of date-fns to avoid import errors
  const now = new Date();
  const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  // Load Random Hadith
  useEffect(() => {
    const random = HADITHS[Math.floor(Math.random() * HADITHS.length)];
    setCurrentHadith(random);
  }, []);

  // Fetch Prayer Times Globally
  useEffect(() => {
    if (navigator.geolocation) {
      setPrayerLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const fetchedTimes = await getPrayerTimes(position.coords.latitude, position.coords.longitude);
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

  // Check Prayer Times Loop (Notification Trigger)
  useEffect(() => {
    if (!prayerTimes || !userProfile?.notificationsEnabled) return;

    const intervalId = setInterval(() => {
      const now = new Date();
      // Format HH:MM like "14:30"
      const currentHM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      // Reset notified set at midnight
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
                icon: '/public/logo.png' // Fallback icon
             });
          }
        }
      });

    }, 10000); // Check every 10 seconds

    return () => clearInterval(intervalId);
  }, [prayerTimes, userProfile]);

  // --- FIREBASE INTEGRATION & PAYMENT SUCCESS CHECK ---

  // 1. Listen for Auth Changes
  useEffect(() => {
    if (!auth) {
        setIsDataLoading(false);
        return;
    }

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setIsDataLoading(true);
      if (user) {
        // User is signed in, fetch data
        if (!db) return;
        try {
          const docRef = db.collection("users").doc(user.uid);
          const docSnap = await docRef.get();

          if (docSnap.exists) {
            const data = docSnap.data();
            let profile = data?.profile as UserProfile;

            // CHECK FOR PAYMENT SUCCESS IN URL
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('payment_success') === 'true' && !profile.isPremium) {
                profile = { ...profile, isPremium: true };
                // Clean URL
                window.history.replaceState({}, document.title, window.location.pathname);
                alert("MashaAllah ! Merci pour votre abonnement Premium.");
            }

            setUserProfile(profile);
            setHabits(data?.habits || DEFAULT_HABITS);
            setLogs(data?.logs || {});
            setPrayerLogs(data?.prayerLogs || {});
            setView('home'); // Go to app
          } else {
             // Cas rare où l'user est auth mais pas de doc (ex: connexion Google première fois gérée dans handleGoogleLogin, mais safety check ici)
             const newProfile: UserProfile = {
                uid: user.uid,
                name: user.displayName || "Muslim",
                email: user.email || "",
                xp: 0,
                level: 1,
                isPremium: false,
                joinedAt: Date.now(),
                notificationsEnabled: false,
                prayerNotifications: {},
                notificationSound: 'beep'
            };
            
            // On ne force pas la création ici car handleGoogleLogin le fait, mais c'est un fallback
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setAuthError("Erreur de connexion à la base de données.");
        }
      } else {
        // User is signed out
        setUserProfile(null);
        setView('auth');
        setShowWelcomeScreen(true); // Reset to welcome screen on logout
      }
      setIsDataLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Sync Data to Firestore on Change
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

    const timeoutId = setTimeout(saveData, 2000); // Debounce 2s
    return () => clearTimeout(timeoutId);
  }, [habits, logs, prayerLogs, userProfile]);

  // --- AUDIO & HANDLERS ---

  const playSound = (soundType: 'beep' | 'adhan') => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }

    const audio = new Audio(SOUND_URLS[soundType]);
    audioRef.current = audio;
    setIsPlayingSound(true);
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        if (soundType === 'adhan') {
            setTimeout(() => {
                if (audioRef.current === audio) {
                    const fadeOut = setInterval(() => {
                        if (audio.volume > 0.1) {
                            audio.volume -= 0.1;
                        } else {
                            clearInterval(fadeOut);
                            audio.pause();
                            audio.currentTime = 0;
                            setIsPlayingSound(false);
                        }
                    }, 200);
                }
            }, 20000);
        }
      }).catch(error => {
        console.error("Erreur lecture audio:", error);
        setIsPlayingSound(false);
      });
    }
    audio.onended = () => setIsPlayingSound(false);
  };

  const stopSound = () => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlayingSound(false);
    }
  };

  // --- AUTH HANDLERS ---

  const handleWelcomeSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (authName.trim()) {
          setShowWelcomeScreen(false);
          setIsSignUpMode(true); // Assume sign up after giving name
          setAuthError('');
      }
  };

  const handleSkipToLogin = () => {
      setShowWelcomeScreen(false);
      setIsSignUpMode(false); // Go to login
      setAuthError('');
  };

  const handleGoogleLogin = async () => {
    if (!auth) return;
    setAuthError('');
    setIsDataLoading(true);

    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await auth.signInWithPopup(provider);
      const user = result.user;

      // Vérifier si l'utilisateur existe déjà en BDD
      if (db && user) {
        const docRef = db.collection("users").doc(user.uid);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
          // Création du profil pour le nouvel utilisateur Google
          const newProfile: UserProfile = {
            uid: user.uid,
            name: user.displayName || "Muslim",
            email: user.email || "",
            xp: 0,
            level: 1,
            isPremium: false,
            joinedAt: Date.now(),
            notificationsEnabled: false,
            prayerNotifications: {},
            notificationSound: 'beep'
          };

          await docRef.set({
            profile: newProfile,
            habits: DEFAULT_HABITS,
            logs: {},
            prayerLogs: {}
          });
          
          setUserProfile(newProfile);
          setHabits(DEFAULT_HABITS);
        }
      }
      
      setView('home');
    } catch (error: any) {
      console.error("Google Auth Error:", error);
      if (error.code === 'auth/popup-closed-by-user') {
        setAuthError("Connexion annulée.");
      } else {
        setAuthError("Erreur lors de la connexion Google.");
      }
    } finally {
      setIsDataLoading(false);
    }
  };

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    if (!auth) {
        alert("Firebase n'est pas configuré. Vérifiez vos variables d'environnement Vercel (VITE_FIREBASE_*).");
        return;
    }

    if (!authEmail || !authPassword) {
        setAuthError("Veuillez remplir tous les champs.");
        return;
    }

    if (isSignUpMode && !authName) {
        setAuthError("Le prénom est obligatoire pour l'inscription.");
        return;
    }

    setIsDataLoading(true);
    try {
        let user;
        
        if (isSignUpMode) {
            // --- INSCRIPTION ---
            const userCredential = await auth.createUserWithEmailAndPassword(authEmail, authPassword);
            user = userCredential.user;
            
            // Mise à jour du profil Auth
            if (user) await user.updateProfile({ displayName: authName });

            // Création document Firestore
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
                notificationSound: 'beep'
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
            setHabits(DEFAULT_HABITS);

        } else {
            // --- CONNEXION ---
            const userCredential = await auth.signInWithEmailAndPassword(authEmail, authPassword);
            user = userCredential.user;
            // Le useEffect onAuthStateChanged se chargera de récupérer les données Firestore
        }
        
        setView('home');

    } catch (error: any) {
        console.error("Auth error:", error);
        if (error.code === 'auth/email-already-in-use') {
            setAuthError("Cet email est déjà utilisé.");
        } else if (error.code === 'auth/wrong-password') {
            setAuthError("Mot de passe incorrect.");
        } else if (error.code === 'auth/user-not-found') {
            setAuthError("Aucun compte trouvé avec cet email.");
        } else if (error.code === 'auth/weak-password') {
            setAuthError("Le mot de passe doit contenir au moins 6 caractères.");
        } else {
            setAuthError("Une erreur est survenue. Vérifiez vos identifiants.");
        }
    } finally {
        setIsDataLoading(false);
    }
  };

  const handleLogout = async () => {
    if (auth) {
        await auth.signOut();
        setAuthName('');
        setAuthEmail('');
        setAuthPassword('');
        setAuthError('');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Attention : Cette action est DÉFINITIVE. Vos données cloud seront supprimées. Continuer ?")) {
      if (auth && auth.currentUser && db) {
          try {
              await db.collection("users").doc(auth.currentUser.uid).delete();
              await auth.currentUser.delete();
              setUserProfile(null);
              setView('auth');
          } catch (e) {
              console.error(e);
              alert("Erreur lors de la suppression. Vous devez peut-être vous reconnecter récemment.");
          }
      }
    }
  };

  const handleResetXP = async () => {
    if (!userProfile) return;
    if (window.confirm("Attention : Vous êtes sur le point de réinitialiser TOUTE votre progression.\n\nCela inclut :\n- Vos points XP et votre niveau\n- L'historique de vos habitudes et prières\n- Vos statistiques et défis\n\nVoulez-vous vraiment recommencer à zéro ?")) {
        // 1. Reset Profile + Défis
        setUserProfile(prev => prev ? { ...prev, xp: 0, level: 1, completedChallenges: {} } : null);
        
        // 2. Reset Historiques (Logs)
        setLogs({});
        setPrayerLogs({});

        alert("Progression réinitialisée. Bismillah pour ce nouveau départ !");
    }
  };

  const handleShareApp = () => {
    const shareData = {
        title: 'Deen Habits',
        text: "Le Bien se multiplie quand on le partage. Invite un ami à progresser avec toi !",
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData);
    } else {
        navigator.clipboard.writeText(shareData.url);
        alert("Lien de l'application copié !");
    }
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!("Notification" in window)) {
        alert("Ce navigateur ne supporte pas les notifications.");
        return false;
    }
    const permission = await Notification.requestPermission();
    return permission === "granted";
  };

  const handleToggleGlobalNotifications = async () => {
    if (!userProfile) return;
    
    if (userProfile.notificationsEnabled) {
      setUserProfile({ ...userProfile, notificationsEnabled: false });
      return;
    }

    const granted = await requestNotificationPermission();
    if (granted) {
        setUserProfile(prev => prev ? { ...prev, notificationsEnabled: true } : null);
        new Notification("Deen Habits", { body: "Rappels activés ! Barakallahu fik." });
        playSound(userProfile.notificationSound || 'beep');
    }
  };

  const handleTogglePrayerNotification = async (prayerName: string) => {
      if (!userProfile) return;
      if (Notification.permission !== 'granted') {
          const granted = await requestNotificationPermission();
          if (!granted) return;
      }
      setUserProfile(prev => {
          if (!prev) return null;
          const currentSettings = prev.prayerNotifications || {};
          return {
              ...prev,
              notificationsEnabled: true,
              prayerNotifications: { ...currentSettings, [prayerName]: !currentSettings[prayerName] }
          };
      });
  };

  // --- LOGIQUE DE PAIEMENT ---
  const handleOpenSubscribe = () => {
      setShowPremiumModal(true);
  };

  const handleConfirmSubscribe = () => {
    if (!userProfile) return;
    setIsProcessingPayment(true);
    
    // 1. Méthode Réelle : Lien de Paiement Stripe
    // Configuré via VITE_STRIPE_PAYMENT_LINK dans Vercel
    const stripeLink = getEnv('STRIPE_PAYMENT_LINK');
    
    if (stripeLink) {
        // Redirection vers la page de paiement Stripe hébergée
        window.location.href = stripeLink;
        return;
    }

    // 2. Fallback : Mode Simulation (pour le test)
    console.warn("Aucun lien de paiement Stripe configuré (VITE_STRIPE_PAYMENT_LINK). Mode simulation activé.");
    setTimeout(() => {
        setIsProcessingPayment(false);
        const confirmed = window.confirm("Simulation (Pas de lien configuré) :\n\nConfirmer le paiement fictif de 4,95€ ?");
        if (confirmed) {
            setUserProfile({ ...userProfile, isPremium: true });
            alert("Paiement simulé réussi ! Bienvenue dans le club Premium.");
            playSound('beep');
            setShowPremiumModal(false);
        }
    }, 1500);
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

  // --- CHALLENGES ---
  const handleToggleChallenge = (challengeId: string) => {
    if (!userProfile) return;
    setUserProfile(prev => {
      if (!prev) return null;
      const challenges = { ...(prev.completedChallenges || {}) };
      
      // Si déjà complété, on le retire
      if (challenges[challengeId]) {
        delete challenges[challengeId];
      } else {
        // Sinon on l'ajoute
        challenges[challengeId] = Date.now();
      }

      return {
        ...prev,
        completedChallenges: challenges
      };
    });
    // Sound only on completion, not removal (handled in component)
  };

  const getCompletionRate = () => {
      if (!userProfile) return 0;
      const habitCount = habits.filter(h => h.frequency.length === 0 || h.frequency.includes(new Date().getDay())).length;
      const prayerCount = 5;
      const totalTasks = habitCount + prayerCount;
      if (totalTasks === 0) return 0;

      const habitsDone = habits.filter(h => logs[currentDate]?.[h.id]).length;
      const prayersDone = prayerLogs[currentDate] 
        ? Object.values(prayerLogs[currentDate]).filter(s => s === 'on_time' || s === 'late').length 
        : 0;
      
      return Math.round(((habitsDone + prayersDone) / totalTasks) * 100);
  };

  const NavButton = ({ target, icon: Icon, label }: { target: ViewMode, icon: any, label: string }) => (
    <button 
      onClick={() => setView(target)}
      className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors min-w-[60px] ${view === target ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-slate-600'}`}
    >
      <Icon className="w-6 h-6" />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );

  // Loading Screens
  if (isDataLoading) {
     return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Connexion sécurisée...</p>
        </div>
     );
  }

  // Auth Screen Wrapper
  if (!userProfile || view === 'auth') {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-emerald-600 rounded-b-[3rem] z-0"></div>
            
            {/* --- SCREEN 1: WELCOME / NAME --- */}
            {showWelcomeScreen ? (
                 <div className="z-10 bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm border border-slate-100 animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex justify-center mb-6">
                        <img src="/public/logo.png" alt="Deen Habits Logo" className="w-24 h-24 object-contain" />
                    </div>
                    <h1 className="text-2xl font-bold text-center text-slate-800 mb-2">Salam !</h1>
                    <p className="text-center text-slate-500 mb-8 text-sm">Comment t'appelles-tu ?</p>

                    <form onSubmit={handleWelcomeSubmit} className="space-y-4">
                        <div>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input 
                                    type="text" 
                                    required
                                    value={authName}
                                    onChange={(e) => setAuthName(e.target.value)}
                                    className="w-full pl-10 p-3 border border-slate-200 bg-white text-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    placeholder="Ton Prénom"
                                    autoFocus
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 flex items-center justify-center gap-2">
                            C'est parti <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    {/* Google Login for Returning Users on Welcome Screen */}
                    <div className="mt-4">
                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-slate-100"></div>
                            <span className="flex-shrink-0 mx-4 text-xs text-slate-400 uppercase">Ou continuez avec</span>
                            <div className="flex-grow border-t border-slate-100"></div>
                        </div>
                        <button 
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 mt-2"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </button>
                    </div>

                    <div className="mt-4 text-center">
                        <button 
                            onClick={handleSkipToLogin}
                            className="text-sm text-slate-400 hover:text-emerald-600 font-medium transition-colors"
                        >
                            J'ai déjà un compte
                        </button>
                    </div>
                 </div>
            ) : (
                /* --- SCREEN 2: AUTH FORM (Login or Signup) --- */
                <div className="z-10 bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm border border-slate-100 animate-in slide-in-from-right duration-300">
                    <button 
                        onClick={() => setShowWelcomeScreen(true)}
                        className="mb-4 text-slate-400 hover:text-emerald-600 transition-colors flex items-center gap-1 text-xs font-bold uppercase tracking-wider"
                    >
                        <ChevronLeft className="w-4 h-4" /> Retour
                    </button>

                    <h1 className="text-2xl font-bold text-slate-800 mb-2">
                        {isSignUpMode ? `Enchanté ${authName} !` : 'Bon retour !'}
                    </h1>
                    <p className="text-slate-500 mb-6 text-sm">
                        {isSignUpMode ? 'Crée un mot de passe pour sauvegarder ta progression.' : 'Connecte-toi pour retrouver tes habitudes.'}
                    </p>

                    {authError && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {authError}
                        </div>
                    )}

                    <form onSubmit={handleAuthAction} className="space-y-4">
                        
                        {/* Hidden Name field for consistency if needed or edit */}
                        {isSignUpMode && (
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Prénom</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input 
                                        type="text" 
                                        required
                                        value={authName}
                                        onChange={(e) => setAuthName(e.target.value)}
                                        className="w-full pl-10 p-3 border border-slate-200 bg-white text-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input 
                                    type="email" 
                                    required
                                    value={authEmail}
                                    onChange={(e) => setAuthEmail(e.target.value)}
                                    className="w-full pl-10 p-3 border border-slate-200 bg-white text-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    placeholder="votre@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Mot de passe</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={authPassword}
                                    onChange={(e) => setAuthPassword(e.target.value)}
                                    className="w-full pl-10 pr-10 p-3 border border-slate-200 bg-white text-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    placeholder="******"
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 flex items-center justify-center gap-2">
                            {isSignUpMode ? 'Terminer l\'inscription' : 'Se connecter'} <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <div className="relative flex py-4 items-center">
                        <div className="flex-grow border-t border-slate-100"></div>
                        <span className="flex-shrink-0 mx-4 text-xs text-slate-400 uppercase">Ou</span>
                        <div className="flex-grow border-t border-slate-100"></div>
                    </div>

                    <button 
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continuer avec Google
                    </button>

                    <div className="mt-6 text-center">
                        <button 
                            onClick={() => {
                                setIsSignUpMode(!isSignUpMode);
                                setAuthError('');
                            }}
                            className="text-sm text-slate-500 hover:text-emerald-600 font-medium transition-colors"
                        >
                            {isSignUpMode 
                                ? "J'ai déjà un compte" 
                                : "Je veux créer un nouveau compte"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 md:pb-0 font-sans">
      
      {/* Premium Modal */}
      <PremiumModal 
        isOpen={showPremiumModal} 
        onClose={() => setShowPremiumModal(false)} 
        onConfirm={handleConfirmSubscribe}
        isLoading={isProcessingPayment}
      />

      {/* Mobile Top Bar */}
      <div className="bg-white p-4 sticky top-0 z-20 border-b border-slate-100 flex justify-between items-center md:hidden shadow-sm">
         <div className="flex items-center gap-2" onClick={() => setView('home')}>
            <img src="/public/logo.png" alt="Logo" className="w-8 h-8 rounded-lg object-contain bg-emerald-50" />
            {isSaving && <Cloud className="w-4 h-4 text-emerald-400 animate-pulse" />}
         </div>
         <div className="flex items-center gap-4">
             <div className="flex flex-col items-end">
                 <span className="text-xs text-slate-400 font-bold uppercase">Niveau {userProfile.level}</span>
                 <div className="w-20 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                     <div 
                        className="h-full bg-yellow-400 rounded-full transition-all duration-500" 
                        style={{ width: `${(userProfile.xp % 100)}%` }} 
                     ></div>
                 </div>
             </div>
             
             <button 
                onClick={() => setView('profile')}
                className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${view === 'profile' ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
             >
                 <User className="w-5 h-5" />
             </button>
         </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed left-0 top-0 bottom-0 bg-white border-r border-slate-200 px-4 py-8 z-50">
        <div className="flex items-center gap-3 px-4 mb-12 cursor-pointer" onClick={() => setView('home')}>
          <img src="/public/logo.png" alt="Logo" className="w-10 h-10 rounded-xl object-contain bg-emerald-50" />
          <span className="text-xl font-bold tracking-tight text-slate-800">DeenHabits</span>
        </div>

        {/* User Stats Desktop */}
        <div className="mb-8 px-4 cursor-pointer" onClick={() => setView('profile')}>
             <div className="bg-slate-900 rounded-xl p-4 text-white relative overflow-hidden group hover:scale-[1.02] transition-transform">
                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-400 uppercase">Niveau {userProfile.level}</span>
                        {userProfile.isPremium && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                    </div>
                    <div className="text-xl font-bold mb-1 truncate flex items-center gap-2">
                        {userProfile.name}
                        {isSaving ? <Cloud className="w-3 h-3 text-emerald-400 animate-pulse" /> : <User className="w-4 h-4 text-slate-400" />}
                    </div>
                    <div className="text-xs text-slate-400 mb-3">{userProfile.xp} XP total</div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${(userProfile.xp % 100)}%` }}></div>
                    </div>
                </div>
             </div>
        </div>

        <nav className="space-y-1">
          {[
            { id: 'home', icon: Home, label: 'Accueil' },
            { id: 'tracker', icon: LayoutGrid, label: 'Habitudes' },
            { id: 'invocations', icon: BookOpen, label: 'Invocations' },
            { id: 'tasbih', icon: GripHorizontal, label: 'Tasbih' },
            { id: 'challenges', icon: Trophy, label: 'Défis' }, 
            { id: 'stats', icon: BarChart3, label: 'Statistiques' },
            { id: 'coach', icon: MessageSquare, label: 'Coach IA' },
            { id: 'profile', icon: User, label: 'Mon Profil' }
          ].map((item) => (
             <button 
                key={item.id}
                onClick={() => setView(item.id as ViewMode)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${view === item.id ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
             >
                <item.icon className="w-5 h-5" /> {item.label}
             </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 p-4 md:p-8 max-w-3xl mx-auto min-h-screen">
        
        {view === 'home' && (
          <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
            
            {/* Hero / Hadith */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
               <div className="absolute -right-10 -bottom-10 opacity-10">
                  <Star className="w-40 h-40 text-white" />
               </div>
               <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-3 backdrop-blur-sm">
                  Hadith du jour
               </span>
               <p className="text-lg md:text-xl font-serif italic leading-relaxed">
                  "{currentHadith}"
               </p>
            </div>

            {/* Quick Stats - Maintenant Cliquables pour aller aux stats */}
            <div className="grid grid-cols-2 gap-4">
                <button 
                    onClick={() => setView('stats')}
                    className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-left hover:bg-slate-50 transition-colors"
                >
                    <div className="text-3xl font-bold text-emerald-600 mb-1">{getCompletionRate()}%</div>
                    <div className="text-xs text-slate-400 uppercase font-bold flex items-center gap-1">
                        Complétion du jour <BarChart3 className="w-3 h-3" />
                    </div>
                </button>
                <button 
                    onClick={() => setView('challenges')}
                    className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-left hover:bg-slate-50 transition-colors"
                >
                    <div className="text-3xl font-bold text-slate-800 mb-1">{userProfile.xp}</div>
                    <div className="text-xs text-slate-400 uppercase font-bold flex items-center gap-1">
                        Points XP <Trophy className="w-3 h-3" />
                    </div>
                </button>
            </div>

            {/* Banner de Partage Accueil */}
            <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl p-4 text-white shadow-md flex items-center justify-between gap-4">
                <div className="flex-1">
                    <p className="text-sm font-bold mb-1 flex items-center gap-2">
                        <Share2 className="w-4 h-4" /> Motive tes proches !
                    </p>
                    <p className="text-xs text-indigo-100 leading-relaxed">
                        "Multiplie les récompenses : invite tes proches à progresser avec toi !"
                    </p>
                </div>
                <button 
                    onClick={handleShareApp}
                    className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-xs font-bold shadow-sm transition-colors border border-white/20"
                >
                    Inviter
                </button>
            </div>

            {/* Bouton Rapide pour Défis Mobile */}
            <button 
                onClick={() => setView('challenges')}
                className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white p-4 rounded-xl shadow-md flex items-center justify-between group"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                        <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                        <div className="font-bold">Défis Quotidiens</div>
                        <div className="text-xs text-yellow-100">Gagne de l'XP en relevant des challenges</div>
                    </div>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <PrayerTracker 
                logs={prayerLogs} 
                setLogs={setPrayerLogs} 
                currentDate={currentDate} 
                onUpdateXP={handleUpdateXP}
                prayerTimes={prayerTimes}
                prayerLoading={prayerLoading}
                prayerError={prayerError}
                userProfile={userProfile}
                onToggleNotification={handleTogglePrayerNotification}
            />

          </div>
        )}

        {view === 'tracker' && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <HabitTracker 
              habits={habits} 
              logs={logs} 
              setHabits={setHabits} 
              setLogs={setLogs} 
              currentDate={currentDate} 
              onUpdateXP={handleUpdateXP}
            />
          </div>
        )}

        {view === 'invocations' && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
             <h2 className="text-2xl font-bold text-slate-800 mb-6">Bibliothèque</h2>
             <InvocationLibrary />
          </div>
        )}

        {view === 'tasbih' && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Tasbih & Dhikr</h2>
            <TasbihCounter />
          </div>
        )}

        {view === 'challenges' && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <Challenges 
                userProfile={userProfile} 
                onUpdateXP={handleUpdateXP} 
                onToggleChallenge={handleToggleChallenge}
            />
          </div>
        )}

        {view === 'stats' && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <Analytics habits={habits} logs={logs} prayerLogs={prayerLogs} userProfile={userProfile} />
          </div>
        )}

        {view === 'coach' && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
             <DeenCoach 
                habits={habits} 
                logs={logs} 
                prayerLogs={prayerLogs} 
                currentDate={currentDate} 
                userProfile={userProfile}
                onSubscribe={handleOpenSubscribe}
             />
          </div>
        )}

        {view === 'privacy' && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
                <PrivacyPolicy onBack={() => setView('profile')} />
            </div>
        )}

        {view === 'profile' && (
            <div className="animate-in fade-in zoom-in-95 duration-300 max-w-lg mx-auto space-y-6">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 text-emerald-700 shadow-sm relative">
                        {userProfile.name.charAt(0).toUpperCase()}
                        {isSaving && (
                            <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full border border-slate-100 shadow-sm" title="Sauvegarde en cours...">
                                <Cloud className="w-4 h-4 text-emerald-500 animate-pulse" />
                            </div>
                        )}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">{userProfile.name}</h2>
                    <p className="text-slate-500">Membre depuis le {new Date(userProfile.joinedAt).toLocaleDateString()}</p>
                    <div className="mt-2 text-xs text-slate-300 font-mono">{userProfile.email}</div>
                </div>

                {/* Status Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Abonnement</div>
                        <div className="font-bold text-lg flex items-center gap-2">
                            {userProfile.isPremium ? 'Membre Premium' : 'Membre Gratuit'}
                            {userProfile.isPremium && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                        </div>
                    </div>
                    {!userProfile.isPremium && (
                        <button 
                            onClick={handleOpenSubscribe} 
                            className="text-sm bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 shadow-md shadow-emerald-200"
                        >
                            Passer Premium
                        </button>
                    )}
                </div>

                {/* Settings List */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <button 
                        onClick={handleToggleGlobalNotifications}
                        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-50"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Bell className="w-5 h-5" /></div>
                            <div className="text-left">
                                <div className="font-semibold text-slate-700">Rappel Quotidien</div>
                                <div className="text-xs text-slate-400">Recevoir une notification générale</div>
                            </div>
                        </div>
                        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${userProfile.notificationsEnabled ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${userProfile.notificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </div>
                    </button>
                    
                    {/* Audio Settings */}
                    <div className="p-4 border-b border-slate-50">
                        <div className="flex items-center gap-3 mb-3">
                             <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Volume2 className="w-5 h-5" /></div>
                             <div className="text-left">
                                <div className="font-semibold text-slate-700">Son de notification</div>
                                <div className="text-xs text-slate-400">Choisissez votre alerte préférée</div>
                            </div>
                        </div>
                        
                        <div className="ml-12 flex gap-2">
                            <button
                                onClick={() => setUserProfile({ ...userProfile, notificationSound: 'beep' })}
                                className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-all ${userProfile.notificationSound === 'beep' ? 'bg-orange-50 border-orange-200 text-orange-700 font-medium' : 'bg-white border-slate-200 text-slate-600'}`}
                            >
                                Beep
                            </button>
                            <button
                                onClick={() => setUserProfile({ ...userProfile, notificationSound: 'adhan' })}
                                className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-all ${userProfile.notificationSound === 'adhan' ? 'bg-orange-50 border-orange-200 text-orange-700 font-medium' : 'bg-white border-slate-200 text-slate-600'}`}
                            >
                                Adhan (Court)
                            </button>
                            <button
                                onClick={() => isPlayingSound ? stopSound() : playSound(userProfile.notificationSound || 'beep')}
                                className="px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 flex items-center justify-center min-w-[44px]"
                            >
                                {isPlayingSound ? <div className="w-2 h-2 bg-slate-400 rounded-sm animate-pulse"></div> : <Play className="w-4 h-4 fill-current" />}
                            </button>
                        </div>
                    </div>

                    <button 
                        onClick={() => setView('privacy')}
                        className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors border-b border-slate-50"
                    >
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Shield className="w-5 h-5" /></div>
                        <span className="font-semibold text-slate-700">Politique de confidentialité</span>
                    </button>

                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors text-slate-600"
                    >
                        <div className="p-2 bg-slate-100 text-slate-500 rounded-lg"><LogIn className="w-5 h-5 rotate-180" /></div>
                        <span className="font-semibold">Se déconnecter</span>
                    </button>
                </div>

                {/* Danger Zone */}
                <div className="mt-8 pt-6 border-t border-slate-200">
                    <h3 className="text-sm font-bold text-slate-400 mb-2 uppercase">Gestion des données</h3>
                    <button 
                        onClick={handleResetXP}
                        className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors mb-4 text-slate-600"
                    >
                        <span className="font-medium">Réinitialiser mes points XP</span>
                        <RefreshCw className="w-4 h-4" />
                    </button>

                    <h3 className="text-sm font-bold text-red-600 mb-2 uppercase">Zone de danger</h3>
                    <button 
                        onClick={handleDeleteAccount}
                        className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border border-red-100 text-red-600 hover:bg-red-50 transition-colors font-medium"
                    >
                        <Trash2 className="w-5 h-5" /> Supprimer mon compte (Cloud)
                    </button>
                </div>
            </div>
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 flex justify-between items-center z-50 safe-area-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
         {/* <NavButton target="home" icon={Home} label="Accueil" /> REMOVED */}
         <NavButton target="tracker" icon={LayoutGrid} label="Habitudes" />
         <NavButton target="invocations" icon={BookOpen} label="Douas" />
         <NavButton target="challenges" icon={Trophy} label="Défis" />
         <NavButton target="coach" icon={MessageSquare} label="Coach" />
         {/* Added Tasbih as requested in 6th (now 5th) position */}
         <NavButton target="tasbih" icon={GripHorizontal} label="Tasbih" />
      </nav>

    </div>
  );
};

export default App;
