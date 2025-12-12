
import React from 'react';
import { Trophy, CheckCircle2, Star, Target, Users, Heart } from 'lucide-react';
import { Challenge, UserProfile } from '../types';

interface ChallengesProps {
  userProfile: UserProfile;
  onUpdateXP: (xp: number) => void;
  onCompleteChallenge: (challengeId: string) => void;
}

const CHALLENGES_LIST: Challenge[] = [
  {
    id: 'read_yasin',
    title: 'Lire Sourate Yasin',
    description: "Le cœur du Coran. Prends 15 minutes pour la lire aujourd'hui.",
    xp: 50,
    icon: '📖',
    category: 'faith',
    difficulty: 'medium'
  },
  {
    id: 'fast_monday',
    title: 'Jeûner Lundi ou Jeudi',
    description: "Revivifie une Sunnah en jeûnant une journée cette semaine.",
    xp: 100,
    icon: '📅',
    category: 'faith',
    difficulty: 'hard'
  },
  {
    id: 'charity',
    title: 'Faire une Sadaqa',
    description: "Donne quelque chose aujourd'hui, même 1€ ou un sourire sincère.",
    xp: 30,
    icon: '🤝',
    category: 'community',
    difficulty: 'easy'
  },
  {
    id: 'mosque_fajr',
    title: 'Fajr à la Mosquée',
    description: "Prie le Fajr en groupe à la mosquée.",
    xp: 150,
    icon: '🕌',
    category: 'community',
    difficulty: 'hard'
  },
  {
    id: 'call_parents',
    title: 'Appeler ses parents',
    description: "Prends des nouvelles de tes parents ou d'un proche âgé.",
    xp: 40,
    icon: '📞',
    category: 'community',
    difficulty: 'easy'
  },
  {
    id: 'no_music',
    title: 'Journée sans musique',
    description: "Remplace la musique par du Coran ou des podcasts bénéfiques.",
    xp: 60,
    icon: '🎧',
    category: 'self',
    difficulty: 'medium'
  },
  {
    id: 'learn_verse',
    title: 'Apprendre 1 Verset',
    description: "Mémorise un nouveau verset avec sa signification.",
    xp: 40,
    icon: '🧠',
    category: 'faith',
    difficulty: 'medium'
  },
  {
    id: 'dhikr_100',
    title: '100 Istighfar',
    description: "Fais 100 fois 'Astaghfirullah' dans la journée.",
    xp: 30,
    icon: '📿',
    category: 'self',
    difficulty: 'easy'
  }
];

const Challenges: React.FC<ChallengesProps> = ({ userProfile, onUpdateXP, onCompleteChallenge }) => {
  const completedIds = Object.keys(userProfile.completedChallenges || {});

  const handleClaim = (challenge: Challenge) => {
    if (window.confirm(`Valider le défi "${challenge.title}" et recevoir ${challenge.xp} XP ?`)) {
      onUpdateXP(challenge.xp);
      onCompleteChallenge(challenge.id);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-yellow-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 p-4 opacity-10">
            <Trophy className="w-32 h-32" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Centre de Défis</h2>
        <p className="text-yellow-100 text-sm max-w-xs">
            Relève des défis pour booster ta foi et gagner des points d'expérience exclusifs !
        </p>
        <div className="mt-4 flex gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                <span className="block text-2xl font-bold">{completedIds.length}</span>
                <span className="text-[10px] uppercase font-bold text-yellow-100">Défis Réalisés</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                <span className="block text-2xl font-bold">{CHALLENGES_LIST.length - completedIds.length}</span>
                <span className="text-[10px] uppercase font-bold text-yellow-100">Disponibles</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CHALLENGES_LIST.map((challenge) => {
          const isCompleted = completedIds.includes(challenge.id);
          
          return (
            <div 
                key={challenge.id}
                className={`border rounded-2xl p-4 transition-all ${
                    isCompleted 
                    ? 'bg-emerald-50/50 border-emerald-200 opacity-80' 
                    : 'bg-white border-slate-100 hover:shadow-md'
                }`}
            >
                <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-3">
                        <div className="text-3xl bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm">
                            {challenge.icon}
                        </div>
                        <div>
                            <h3 className={`font-bold text-slate-800 ${isCompleted ? 'line-through text-slate-500' : ''}`}>
                                {challenge.title}
                            </h3>
                            <div className="flex gap-2 mt-1">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getDifficultyColor(challenge.difficulty)}`}>
                                    {challenge.difficulty}
                                </span>
                                <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                    <Star className="w-3 h-3" /> {challenge.xp} XP
                                </span>
                            </div>
                        </div>
                    </div>
                    {isCompleted && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                </div>
                
                <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                    {challenge.description}
                </p>

                <button
                    onClick={() => handleClaim(challenge)}
                    disabled={isCompleted}
                    className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                        isCompleted
                        ? 'bg-slate-100 text-slate-400 cursor-default'
                        : 'bg-slate-900 text-white hover:bg-emerald-600 shadow-lg shadow-slate-200 hover:shadow-emerald-200'
                    }`}
                >
                    {isCompleted ? 'Accompli' : 'Valider le défi'}
                </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Challenges;
