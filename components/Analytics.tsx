
import React, { useState, useMemo } from 'react';
import { Star, Trophy, CheckCircle2, TrendingUp, Share2 } from 'lucide-react';
import { Habit, HabitLog, PrayerLog, PRAYER_NAMES, UserProfile } from '../types';

interface AnalyticsProps {
  habits: Habit[];
  logs: HabitLog;
  prayerLogs: PrayerLog;
  userProfile: UserProfile;
}

// Composant pour la Jauge Circulaire Moderne
const CircleProgress = ({ 
  value, 
  max, 
  color, 
  size = 120, 
  label,
  subLabel 
}: { 
  value: number, 
  max: number, 
  color: string, 
  size?: number,
  label: string,
  subLabel?: string
}) => {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min((value / max) * 100, 100);
  const offset = circumference - (progress / 100) * circumference;

  // Couleurs Tailwind mapping
  const colorMap: Record<string, string> = {
    emerald: '#10b981', // text-emerald-500
    amber: '#f59e0b',   // text-amber-500
    blue: '#3b82f6',    // text-blue-500
    red: '#ef4444'      // text-red-500
  };

  const strokeColor = colorMap[color] || colorMap.emerald;

  return (
    <div className="flex flex-col items-center">
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            {/* Background Circle */}
            <svg className="transform -rotate-90 w-full h-full">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    className="text-slate-100"
                />
                {/* Progress Circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-800">
                <span className="text-2xl font-bold">{value}</span>
                <span className="text-xs text-slate-400 font-medium">/ {max}</span>
            </div>
        </div>
        <div className="mt-3 text-center">
            <h4 className="font-bold text-slate-700 text-sm">{label}</h4>
            {subLabel && <p className="text-xs text-slate-400">{subLabel}</p>}
        </div>
    </div>
  );
};

const Analytics: React.FC<AnalyticsProps> = ({ habits, logs, prayerLogs, userProfile }) => {
  const [period, setPeriod] = useState<7 | 30>(7);

  // --- LOGIQUE DE CALCUL ---
  const stats = useMemo(() => {
    // 1. Générer les dates
    const dates: string[] = [];
    const now = new Date();
    // Start date timestamp for challenges filtering
    const startTime = new Date();
    startTime.setDate(now.getDate() - period);
    startTime.setHours(0, 0, 0, 0);
    const startTimeMs = startTime.getTime();

    for (let i = 0; i < period; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i); // On recule depuis aujourd'hui
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        dates.push(dateStr);
    }

    // 2. Stats Prières
    const totalPossiblePrayers = period * 5;
    let onTime = 0;
    let late = 0;
    let missed = 0;

    // Calcul XP Prières sur la période
    let xpFromPrayers = 0;

    dates.forEach(dateStr => {
        const dayLogs = prayerLogs[dateStr] || {};
        PRAYER_NAMES.forEach(p => {
            const status = dayLogs[p];
            if (status === 'on_time') {
                onTime++;
                xpFromPrayers += 20;
            } else if (status === 'late') {
                late++;
                xpFromPrayers += 10;
            } else if (status === 'missed') {
                missed++;
                xpFromPrayers -= 20; // Malus (optionnel selon logique app, ici on le compte)
            }
        });
    });

    const totalDone = onTime + late;

    // 3. Stats Habitudes & XP Habitudes
    let xpFromHabits = 0;
    
    dates.forEach(dateStr => {
        const dayHabitLogs = logs[dateStr] || {};
        habits.forEach(h => {
            if (dayHabitLogs[h.id]) {
                xpFromHabits += (h.xp || 10);
            }
        });
    });

    // 4. Stats Défis (Filtrés par date)
    let challengesCount = 0;
    let xpFromChallenges = 0;
    const completedChallenges: Record<string, number> = userProfile.completedChallenges || {};
    
    // On doit regarder les défis *actuels* pour connaître leur XP, car l'historique ne stocke que le timestamp
    // (Note: Cela suppose que la liste des défis n'a pas changé ou qu'on ne cherche qu'une estimation)
    // Pour faire simple, on va regarder la liste des défis disponibles dans le code si on avait accès,
    // mais ici on n'a pas la liste `CHALLENGES_LIST` importée. 
    // On va compter le nombre. Pour l'XP Défis, c'est dur sans la map des défis.
    // Hack: On compte juste le nombre, et on affiche l'XP total *calculé* (Prières + Habitudes) qui est sûr.
    // L'XP total affiché sera (Prières + Habitudes), on mentionnera "Défis relevés" séparément.
    
    Object.values(completedChallenges).forEach(timestamp => {
        if (timestamp >= startTimeMs) {
            challengesCount++;
            // Estimation moyenne 50xp par défi si on voulait ajouter
        }
    });

    const totalXPEarned = Math.max(0, xpFromPrayers + xpFromHabits); // On évite le négatif

    return {
        totalPossiblePrayers,
        onTime,
        late,
        missed,
        totalDone,
        totalXPEarned,
        challengesCount
    };

  }, [period, logs, prayerLogs, habits, userProfile]);

  const handleShareStats = () => {
    if (navigator.share) {
        navigator.share({
            title: 'Deen Habits - Mes Statistiques',
            text: `J'ai accompli ${stats.totalDone} prières et gagné ${stats.totalXPEarned} XP cette semaine ! Multiplie les récompenses : invite tes proches à progresser avec toi !`,
            url: window.location.href
        });
    } else {
        alert("Partage non supporté sur ce navigateur.");
    }
  };

  return (
    <div className="space-y-8 pb-24">
      
      {/* --- HEADER & SELECTEUR --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
                Tes Performances
            </h2>
            <p className="text-slate-500 text-sm">
                Bilan de tes efforts sur les derniers jours
            </p>
        </div>
        
        <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm inline-flex">
            <button 
                onClick={() => setPeriod(7)}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${period === 7 ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
                7 Jours
            </button>
            <button 
                onClick={() => setPeriod(30)}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${period === 30 ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
                30 Jours
            </button>
        </div>
      </div>

      {/* --- SECTION 1: JAUGES CIRCULAIRES (PRIÈRES) --- */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-50 pb-4">
            Analyse des Prières Obligatoires
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 justify-items-center">
            
            {/* 1. Total Accompli */}
            <CircleProgress 
                value={stats.totalDone} 
                max={stats.totalPossiblePrayers} 
                color="blue" 
                size={140}
                label="Prières Accomplies"
                subLabel="Toutes (À l'heure + Rattrapées)"
            />

            {/* 2. À l'heure */}
            <CircleProgress 
                value={stats.onTime} 
                max={stats.totalPossiblePrayers} 
                color="emerald" 
                size={140}
                label="Prières à l'Heure"
                subLabel="L'excellence visée"
            />

            {/* 3. Rattrapées */}
            <CircleProgress 
                value={stats.late} 
                max={stats.totalPossiblePrayers} 
                color="amber" 
                size={140}
                label="Prières Rattrapées"
                subLabel="Mieux vaut tard que jamais"
            />
        </div>

        {/* Note informative */}
        <div className="mt-8 bg-slate-50 p-4 rounded-xl text-center text-xs text-slate-400">
            Sur cette période de <strong>{period} jours</strong>, il y avait un total de <strong>{stats.totalPossiblePrayers} prières</strong> obligatoires (Fard).
        </div>
      </div>

      {/* --- SECTION 2: RÉCOMPENSES & DÉFIS (GRID) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card XP */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[160px]">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Star className="w-24 h-24" />
             </div>
             <div>
                 <p className="text-indigo-100 font-medium text-sm mb-1 uppercase tracking-wider">Points Acquis</p>
                 <h4 className="text-4xl font-bold">{stats.totalXPEarned} <span className="text-lg text-indigo-200">XP</span></h4>
             </div>
             <div className="mt-4">
                 <p className="text-xs text-indigo-100 opacity-80">
                    Cumulés grâce à vos prières et habitudes validées durant ces {period} jours.
                 </p>
             </div>
          </div>

          {/* Card Défis */}
          <div className="bg-gradient-to-br from-orange-400 to-pink-500 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[160px]">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Trophy className="w-24 h-24" />
             </div>
             <div>
                 <p className="text-orange-100 font-medium text-sm mb-1 uppercase tracking-wider">Défis Relevés</p>
                 <h4 className="text-4xl font-bold">{stats.challengesCount} <span className="text-lg text-orange-200">Défis</span></h4>
             </div>
             <div className="mt-4">
                 <div className="flex items-center gap-2">
                     <CheckCircle2 className="w-4 h-4 text-orange-200" />
                     <p className="text-xs text-orange-100 opacity-80">
                        Challenges validés sur la période.
                     </p>
                 </div>
             </div>
          </div>
      </div>

      {/* --- SECTION 3: SHARE --- */}
      <button 
        onClick={handleShareStats}
        className="w-full bg-slate-800 text-white p-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors shadow-lg"
      >
        <Share2 className="w-5 h-5" /> Partager mes résultats
      </button>

    </div>
  );
};

export default Analytics;
