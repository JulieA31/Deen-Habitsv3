
import React from 'react';
import { Trophy, CheckCircle2, Star, RefreshCw, Share2 } from 'lucide-react';
import { Challenge, UserProfile } from '../types';

interface ChallengesProps {
  userProfile: UserProfile;
  onUpdateXP: (xp: number) => void;
  onToggleChallenge: (challengeId: string) => void;
}

const CHALLENGES_LIST: Challenge[] = [
  // --- FOI & ADORATION (FAITH) ---
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
    id: 'mosque_fajr',
    title: 'Fajr à la Mosquée',
    description: "La prière la plus lourde pour les hypocrites, mais la plus récompensée.",
    xp: 150,
    icon: '🕌',
    category: 'community',
    difficulty: 'hard'
  },
  {
    id: 'learn_verse',
    title: 'Apprendre 1 Verset',
    description: "Mémorise un nouveau verset avec sa signification en français.",
    xp: 40,
    icon: '🧠',
    category: 'faith',
    difficulty: 'medium'
  },
  {
    id: 'prayer_duha',
    title: 'Prière de Duha',
    description: "2 unités de prière en matinée : c'est l'aumône de tes articulations.",
    xp: 30,
    icon: '☀️',
    category: 'faith',
    difficulty: 'easy'
  },
  {
    id: 'prayer_witr',
    title: 'Prière du Witr',
    description: "Ne dors pas sans avoir prié au moins 1 rakat impaire.",
    xp: 35,
    icon: '🌙',
    category: 'faith',
    difficulty: 'easy'
  },
  {
    id: 'surah_mulk',
    title: 'Lire Al-Mulk',
    description: "La protectrice contre les châtiments de la tombe, avant de dormir.",
    xp: 40,
    icon: '🛡️',
    category: 'faith',
    difficulty: 'medium'
  },
  {
    id: 'ayat_kursi_prayer',
    title: 'Ayat al-Kursi x5',
    description: "Lis le verset du Trône après chacune des 5 prières obligatoires.",
    xp: 50,
    icon: '🪑',
    category: 'faith',
    difficulty: 'medium'
  },
  {
    id: 'qiyam_night',
    title: 'Qiyam al-Layl',
    description: "Lève-toi 15min avant le Fajr pour prier 2 rakats dans le calme.",
    xp: 150,
    icon: '🌌',
    category: 'faith',
    difficulty: 'hard'
  },
  {
    id: 'rawatib_12',
    title: 'Les 12 Rawatib',
    description: "Accomplis les 12 prières surérogatoires de la journée.",
    xp: 120,
    icon: '✨',
    category: 'faith',
    difficulty: 'hard'
  },
  
  // --- COMMUNAUTÉ & FAMILLE (COMMUNITY) ---
  {
    id: 'charity',
    title: 'Faire une Sadaqa',
    description: "Donne quelque chose aujourd'hui, même 1€ ou de la nourriture.",
    xp: 30,
    icon: '🤝',
    category: 'community',
    difficulty: 'easy'
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
    id: 'feed_someone',
    title: 'Nourrir quelqu\'un',
    description: "Offre un repas ou partage ta nourriture avec quelqu'un.",
    xp: 60,
    icon: '🍲',
    category: 'community',
    difficulty: 'medium'
  },
  {
    id: 'help_home',
    title: 'Aider à la maison',
    description: "Fais une tâche ménagère spontanée pour aider ta famille.",
    xp: 25,
    icon: '🧹',
    category: 'community',
    difficulty: 'easy'
  },
  {
    id: 'forgive_someone',
    title: 'Pardonner',
    description: "Pardonne à une personne qui t'a blessé ou énervé aujourd'hui.",
    xp: 70,
    icon: '❤️',
    category: 'community',
    difficulty: 'hard'
  },
  {
    id: 'visit_sick',
    title: 'Visiter un malade',
    description: "Rends visite à un malade, physique ou moral (déprime).",
    xp: 100,
    icon: '🏥',
    category: 'community',
    difficulty: 'hard'
  },

  // --- SOI & DÉVELOPPEMENT (SELF) ---
  {
    id: 'dhikr_100',
    title: '100 Istighfar',
    description: "Fais 100 fois 'Astaghfirullah' dans la journée.",
    xp: 30,
    icon: '📿',
    category: 'self',
    difficulty: 'easy'
  },
  {
    id: 'salawat_100',
    title: '100 Salawat',
    description: "Prie 100 fois sur le Prophète (Allahumma salli 'ala Muhammad).",
    xp: 40,
    icon: '🌹',
    category: 'self',
    difficulty: 'medium'
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
    id: 'social_detox',
    title: 'Detox Réseaux',
    description: "Passe 3h consécutives sans ouvrir Instagram/TikTok/Snap.",
    xp: 50,
    icon: '📵',
    category: 'self',
    difficulty: 'medium'
  },
  {
    id: 'islamic_lecture',
    title: 'Écouter un cours',
    description: "Écoute une conférence religieuse de 20min minimum.",
    xp: 40,
    icon: '🎓',
    category: 'self',
    difficulty: 'easy'
  },
  {
    id: 'wudu_sleep',
    title: 'Dormir avec Wudu',
    description: "Fais tes ablutions juste avant de te glisser dans ton lit.",
    xp: 20,
    icon: '💧',
    category: 'self',
    difficulty: 'easy'
  },
  {
    id: 'walk_mosque',
    title: 'Marche vers Allah',
    description: "Vas à la mosquée à pied (chaque pas efface un péché).",
    xp: 45,
    icon: '👣',
    category: 'self',
    difficulty: 'medium'
  },
  {
    id: 'smile_sunnah',
    title: 'Sourire Sunnah',
    description: "Efforce-toi de sourire à toutes les personnes que tu croises.",
    xp: 20,
    icon: '😊',
    category: 'self',
    difficulty: 'easy'
  }
];

const Challenges: React.FC<ChallengesProps> = ({ userProfile, onUpdateXP, onToggleChallenge }) => {
  const completedIds = Object.keys(userProfile.completedChallenges || {});

  const handleClaim = (challenge: Challenge) => {
    const isCompleted = completedIds.includes(challenge.id);
    
    if (isCompleted) {
        if (window.confirm(`Voulez-vous recommencer le défi "${challenge.title}" ?\n\nCela réinitialisera son statut pour que vous puissiez le valider à nouveau (demain par exemple).`)) {
            // Note: On ne retire PAS l'XP pour permettre le cumul si le défi est refait.
            onToggleChallenge(challenge.id);
        }
    } else {
        if (window.confirm(`Valider le défi "${challenge.title}" et recevoir ${challenge.xp} XP ?`)) {
            onUpdateXP(challenge.xp);
            onToggleChallenge(challenge.id);
        }
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

  const handleShareChallenges = () => {
    if (navigator.share) {
        navigator.share({
            title: 'Défis Deen Habits',
            text: "Je relève des défis spirituels sur Deen Habits ! Si tu connais quelqu'un qui comme toi a envie de s'améliorer, rejoins-moi.",
            url: window.location.href
        });
    } else {
        alert("Partage non supporté");
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

      {/* Share Banner for Challenges */}
      <button 
        onClick={handleShareChallenges}
        className="w-full bg-indigo-50 border border-indigo-100 text-indigo-700 p-4 rounded-xl flex items-center justify-between group hover:bg-indigo-100 transition-colors"
      >
        <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-200 rounded-lg">
                <Share2 className="w-5 h-5 text-indigo-800" />
            </div>
            <div className="text-left">
                <div className="font-bold text-sm">Se challenger entre amis</div>
                <div className="text-xs text-indigo-500">Invite un proche à faire les défis avec toi</div>
            </div>
        </div>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CHALLENGES_LIST.map((challenge) => {
          const isCompleted = completedIds.includes(challenge.id);
          
          return (
            <div 
                key={challenge.id}
                className={`border rounded-2xl p-4 transition-all ${
                    isCompleted 
                    ? 'bg-emerald-50/50 border-emerald-200' 
                    : 'bg-white border-slate-100 hover:shadow-md'
                }`}
            >
                <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-3">
                        <div className="text-3xl bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm">
                            {challenge.icon}
                        </div>
                        <div>
                            <h3 className={`font-bold text-slate-800 ${isCompleted ? 'text-emerald-800' : ''}`}>
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
                    className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                        isCompleted
                        ? 'bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-50'
                        : 'bg-slate-900 text-white hover:bg-emerald-600 shadow-lg shadow-slate-200 hover:shadow-emerald-200'
                    }`}
                >
                    {isCompleted ? (
                        <>
                            <RefreshCw className="w-4 h-4" /> Recommencer
                        </>
                    ) : (
                        'Valider le défi'
                    )}
                </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Challenges;
