
import React, { useState, useEffect, useRef } from 'react';
import { LayoutGrid, BarChart3, MessageSquare, BookOpen, Home, Trophy, Star, LogIn, ArrowRight, User, Trash2, Bell, Shield, Volume2, Play, CreditCard, Loader2, GripHorizontal } from 'lucide-react';

import { Habit, HabitLog, ViewMode, PrayerLog, UserProfile } from './types';
import HabitTracker from './components/HabitTracker';
import DeenCoach from './components/DeenCoach';
import Analytics from './components/Analytics';
import PrayerTracker from './components/PrayerTracker';
import InvocationLibrary from './components/InvocationLibrary';
import TasbihCounter from './components/TasbihCounter';

// Audio Assets
const SOUND_URLS = {
  beep: '/sounds/beep.wav',
  adhan: '/sounds/Adhan_Medine.wav' 
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
  "Le sourire est une aumône."
];

const App: React.FC = () => {
  const [currentHadith, setCurrentHadith] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // State
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('dh_habits');
    return saved ? JSON.parse(saved) : DEFAULT_HABITS;
  });
  const [logs, setLogs] = useState<HabitLog>(() => {
    const saved = localStorage.getItem('dh_logs');
    return saved ? JSON.parse(saved) : {};
  });
  const [prayerLogs, setPrayerLogs] = useState<PrayerLog>(() => {
    const saved = localStorage.getItem('dh_prayer_logs');
    return saved ? JSON.parse(saved) : {};
  });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('dh_profile_v2');
    return saved ? JSON.parse(saved) : null;
  });

  const [view, setView] = useState<ViewMode>(userProfile ? 'home' : 'auth');

  // Auth State (Local for the form)
  const [authName, setAuthName] = useState('');

  // Native date formatting instead of date-fns to avoid import errors
  const now = new Date();
  const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  // Load Random Hadith
  useEffect(() => {
    const random = HADITHS[Math.floor(Math.random() * HADITHS.length)];
    setCurrentHadith(random);
  }, []);

  // Persistence
  useEffect(() => { localStorage.setItem('dh_habits', JSON.stringify(habits)); }, [habits]);
  useEffect(() => { localStorage.setItem('dh_logs', JSON.stringify(logs)); }, [logs]);
  useEffect(() => { localStorage.setItem('dh_prayer_logs', JSON.stringify(prayerLogs)); }, [prayerLogs]);
  useEffect(() => { 
    if (userProfile) localStorage.setItem('dh_profile_v2', JSON.stringify(userProfile)); 
  }, [userProfile]);

  // Audio Handler
  const playSound = (soundType: 'beep' | 'adhan') => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
    }

    const audio = new Audio(SOUND_URLS[soundType]);
    audioRef.current = audio;
    
    setIsPlayingSound(true);
    
    // Si Adhan, on ne joue que 5 secondes pour le "court" dans la démo si le fichier est long
    if (soundType === 'adhan') {
        audio.currentTime = 0;
    }

    audio.play().catch(e => console.error("Erreur lecture audio", e));
    
    audio.onended = () => setIsPlayingSound(false);
  };

  const stopSound = () => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlayingSound(false);
    }
  };

  // Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authName.trim()) return;
    
    const newProfile: UserProfile = {
      name: authName,
      xp: 0,
      level: 1,
      isPremium: false,
      joinedAt: Date.now(),
      notificationsEnabled: false,
      notificationSound: 'beep'
    };
    setUserProfile(newProfile);
    setView('home');
  };

  const handleLogout = () => {
    setUserProfile(null);
    setView('auth');
    localStorage.removeItem('dh_profile_v2');
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Attention : Cette action est DÉFINITIVE et toute votre progression sera PERDUE. Voulez-vous vraiment supprimer votre compte ?")) {
      localStorage.clear();
      setUserProfile(null);
      setHabits(DEFAULT_HABITS);
      setLogs({});
      setPrayerLogs({});
      setView('auth');
    }
  };

  const handleToggleNotifications = async () => {
    if (!userProfile) return;
    
    // Si déjà activé, on désactive
    if (userProfile.notificationsEnabled) {
      setUserProfile({ ...userProfile, notificationsEnabled: false });
      return;
    }

    if (!("Notification" in window)) {
        alert("Ce navigateur ne supporte pas les notifications.");
        return;
    }

    try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            setUserProfile(prev => prev ? { ...prev, notificationsEnabled: true } : null);
            new Notification("Deen Habits", { body: "Rappels activés ! Barakallahu fik." });
            playSound(userProfile.notificationSound || 'beep');
        }
    } catch (e) {
        console.error("Erreur notification", e);
    }
  };

  const handleSubscribe = () => {
    if (!userProfile) return;
    
    // Simulation Stripe
    setIsProcessingPayment(true);
    
    // Simuler le délai réseau de Stripe
    setTimeout(() => {
        setIsProcessingPayment(false);
        const confirmed = window.confirm("Simulation Stripe :\n\nConfirmer le paiement de 4,95€ via Stripe Checkout (Mode Test) ?");
        
        if (confirmed) {
            setUserProfile({ ...userProfile, isPremium: true });
            alert("Paiement réussi ! Bienvenue dans le club Premium.");
            new Audio(SOUND_URLS.beep).play(); // Petit son de succès
        }
    }, 1500);
  };

  // Gamification Logic
  const handleUpdateXP = (points: number) => {
    if (!userProfile) return;
    setUserProfile(prev => {
      if (!prev) return null;
      const newXP = Math.max(0, prev.xp + points);
      // Niveau = Racine carrée de XP/100 + 1
      const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;
      return { ...prev, xp: newXP, level: newLevel };
    });
  };

  const getCompletionRate = () => {
      if (!userProfile) return 0;
      // Simplifié : combine prières et habitudes
      const habitCount = habits.filter(h => h.frequency.length === 0 || h.frequency.includes(new Date().getDay())).length;
      const prayerCount = 5;
      const totalTasks = habitCount + prayerCount;
      
      if (totalTasks === 0) return 0;

      const habitsDone = habits.filter(h => logs[currentDate]?.[h.id]).length;
      // On compte les prières faites (on_time ou late)
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

  // Loading Screen for Payment
  if (isProcessingPayment) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-6 animate-bounce">
                <CreditCard className="w-8 h-8 text-[#635BFF]" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Connexion à Stripe...</h2>
            <p className="text-slate-500 text-sm mb-8">Veuillez patienter pendant que nous sécurisons votre transaction.</p>
            <Loader2 className="w-8 h-8 text-[#635BFF] animate-spin" />
        </div>
    );
  }

  // Auth Screen
  if (!userProfile || view === 'auth') {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-emerald-600 rounded-b-[3rem] z-0"></div>
            
            <div className="z-10 bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm border border-slate-100">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 font-bold text-3xl shadow-sm">
                        D
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-center text-slate-800 mb-2">Deen Habits</h1>
                <p className="text-center text-slate-500 mb-8 text-sm">Votre compagnon quotidien pour une vie spirituelle épanouie.</p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Votre Prénom</label>
                        <input 
                            type="text" 
                            required
                            value={authName}
                            onChange={(e) => setAuthName(e.target.value)}
                            className="w-full p-3 border border-slate-200 bg-white text-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            placeholder="Ex: Bilal"
                        />
                    </div>
                    <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 flex items-center justify-center gap-2">
                        Commencer <ArrowRight className="w-4 h-4" />
                    </button>
                </form>
                <p className="text-xs text-center text-slate-400 mt-6">En continuant, vous acceptez nos CGU.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 md:pb-0 font-sans">
      
      {/* Mobile Top Bar / Gamification */}
      <div className="bg-white p-4 sticky top-0 z-20 border-b border-slate-100 flex justify-between items-center md:hidden shadow-sm">
         <div className="flex items-center gap-2" onClick={() => setView('home')}>
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">D</div>
         </div>
         <div className="flex items-center gap-4">
             {/* XP Bar */}
             <div className="flex flex-col items-end">
                 <span className="text-xs text-slate-400 font-bold uppercase">Niveau {userProfile.level}</span>
                 <div className="w-20 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                     <div 
                        className="h-full bg-yellow-400 rounded-full transition-all duration-500" 
                        style={{ width: `${(userProfile.xp % 100)}%` }} 
                     ></div>
                 </div>
             </div>
             
             {/* Profile Button (Moved here) */}
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
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-200">D</div>
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
                        <User className="w-4 h-4 text-slate-400" />
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

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="text-3xl font-bold text-emerald-600 mb-1">{getCompletionRate()}%</div>
                    <div className="text-xs text-slate-400 uppercase font-bold">Complétion du jour</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="text-3xl font-bold text-slate-800 mb-1">{userProfile.xp}</div>
                    <div className="text-xs text-slate-400 uppercase font-bold">Points XP</div>
                </div>
            </div>

            {/* Prayer Preview */}
            <PrayerTracker 
                logs={prayerLogs} 
                setLogs={setPrayerLogs} 
                currentDate={currentDate} 
                onUpdateXP={handleUpdateXP}
            />

          </div>
        )}

        {view === 'tracker' && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            {/* PrayerTracker supprimé de cette vue pour éviter la duplication */}
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

        {view === 'stats' && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Vos Statistiques</h2>
            <Analytics habits={habits} logs={logs} />
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
                onSubscribe={handleSubscribe}
             />
          </div>
        )}

        {view === 'profile' && (
            <div className="animate-in fade-in zoom-in-95 duration-300 max-w-lg mx-auto space-y-6">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 text-emerald-700 shadow-sm">
                        {userProfile.name.charAt(0).toUpperCase()}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">{userProfile.name}</h2>
                    <p className="text-slate-500">Membre depuis le {new Date(userProfile.joinedAt).toLocaleDateString()}</p>
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
                            onClick={handleSubscribe} 
                            className="text-sm bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 shadow-md shadow-emerald-200"
                        >
                            Passer Premium
                        </button>
                    )}
                </div>

                {/* Settings List */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <button 
                        onClick={handleToggleNotifications}
                        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-50"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Bell className="w-5 h-5" /></div>
                            <div className="text-left">
                                <div className="font-semibold text-slate-700">Rappel Quotidien</div>
                                <div className="text-xs text-slate-400">Recevoir une notification de rappel</div>
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

                    <button className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors border-b border-slate-50">
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
                    <h3 className="text-sm font-bold text-red-600 mb-2 uppercase">Zone de danger</h3>
                    <button 
                        onClick={handleDeleteAccount}
                        className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border border-red-100 text-red-600 hover:bg-red-50 transition-colors font-medium"
                    >
                        <Trash2 className="w-5 h-5" /> Supprimer mon compte
                    </button>
                </div>
            </div>
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 flex justify-between items-center z-50 safe-area-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
         <NavButton target="home" icon={Home} label="Accueil" />
         <NavButton target="tracker" icon={LayoutGrid} label="Habitudes" />
         <NavButton target="invocations" icon={BookOpen} label="Douas" />
         <NavButton target="tasbih" icon={GripHorizontal} label="Tasbih" />
         <NavButton target="coach" icon={MessageSquare} label="Coach" />
      </nav>

    </div>
  );
};

export default App;