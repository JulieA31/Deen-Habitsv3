import React, { useState } from 'react';
import { Trophy, CheckCircle2, Star, RefreshCw, Share2, Play, Timer, Plus, X, Calendar, Edit3, Trash2 } from 'lucide-react';
import { Challenge, UserProfile } from '../types';

interface ChallengesProps {
  userProfile: UserProfile;
  onUpdateXP: (xp: number) => void;
  onToggleChallenge: (challengeId: string) => void; // Used for completing/resetting
  onStartChallenge: (challengeId: string) => void; // New prop for starting
  onCreateChallenge: (challenge: Challenge) => void; // Create custom challenge
  onDeleteChallenge: (challengeId: string) => void; // Delete custom challenge
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

const Challenges: React.FC<ChallengesProps> = ({ userProfile, onUpdateXP, onToggleChallenge, onStartChallenge, onCreateChallenge, onDeleteChallenge }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newXP, setNewXP] = useState(50);
  const [newDuration, setNewDuration] = useState('');

  const completedIds = Object.keys(userProfile.completedChallenges || {});
  const activeIds = Object.keys(userProfile.activeChallenges || {});
  const customChallenges = userProfile.customChallenges || [];
  
  // Merge lists: Custom challenges first, then standard ones
  const allChallenges = [...customChallenges, ...CHALLENGES_LIST];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newChallenge: Challenge = {
        id: `custom_${Date.now()}`,
        title: newTitle,
        description: newDesc,
        xp: newXP,
        duration: newDuration,
        icon: '🎯',
        category: 'self',
        difficulty: 'medium',
        isCustom: true
    };

    onCreateChallenge(newChallenge);
    setIsAdding(false);
    // Reset form
    setNewTitle('');
    setNewDesc('');
    setNewXP(50);
    setNewDuration('');
  };

  const handleAction = (challenge: Challenge) => {
    const isCompleted = completedIds.includes(challenge.id);
    const isActive = activeIds.includes(challenge.id);

    if (isCompleted) {
        if (window.confirm(`Voulez-vous recommencer le défi "${challenge.title}" ?\n\nCela réinitialisera son statut.`)) {
            onToggleChallenge(challenge.id);
        }
    } else if (isActive) {
        if (window.confirm(`Avez-vous terminé "${challenge.title}" ?\n\nVous recevrez ${challenge.xp} XP !`)) {
            onUpdateXP(challenge.xp);
            onToggleChallenge(challenge.id);
        }
    } else {
        onStartChallenge(challenge.id);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if(window.confirm("Supprimer définitivement ce défi personnalisé ?")) {
          onDeleteChallenge(id);
      }
  }

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
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-yellow-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 p-4 opacity-10">
            <Trophy className="w-32 h-32" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Centre de Défis</h2>
        <p className="text-yellow-100 text-sm max-w-xs">
            Relève des défis pour booster ta foi et gagner des points d'expérience exclusifs !
        </p>
      </div>

      {/* Action Buttons Group */}
      <div className="grid grid-cols-2 gap-3">
        {/* Create Button */}
        <button 
            onClick={() => setIsAdding(!isAdding)}
            className={`p-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${isAdding ? 'bg-slate-800 text-white' : 'bg-white border-2 border-dashed border-slate-300 text-slate-500 hover:border-emerald-500 hover:text-emerald-600'}`}
        >
            {isAdding ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {isAdding ? "Fermer" : "Créer un défi"}
        </button>

        {/* Share Button */}
        <button 
            onClick={handleShareChallenges}
            className="bg-indigo-50 border border-indigo-100 text-indigo-700 p-4 rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-indigo-100 transition-colors"
        >
            <Share2 className="w-5 h-5" /> Inviter un ami
        </button>
      </div>

      {/* Creation Form */}
      {isAdding && (
          <form onSubmit={handleCreate} className="bg-white p-6 rounded-2xl shadow-lg border border-emerald-100 animate-in slide-in-from-top-4 duration-300">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-emerald-600" /> Nouveau Défi Personnalisé
              </h3>
              
              <div className="space-y-4">
                  <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Titre du défi</label>
                      <input 
                        type="text" 
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Ex: Jeûner 3 jours"
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                  </div>

                  <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Durée / Fréquence</label>
                      <input 
                        type="text" 
                        value={newDuration}
                        onChange={(e) => setNewDuration(e.target.value)}
                        placeholder="Ex: Avant la fin de la semaine"
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                  </div>

                  <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Points XP</label>
                      <div className="flex items-center gap-4">
                          <input 
                            type="range" 
                            min="10" 
                            max="500" 
                            step="10"
                            value={newXP}
                            onChange={(e) => setNewXP(parseInt(e.target.value))}
                            className="flex-1 accent-emerald-600"
                          />
                          <span className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg w-20 text-center">{newXP} XP</span>
                      </div>
                  </div>

                  <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Description (Optionnelle)</label>
                      <textarea 
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        placeholder="Détails de votre objectif..."
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none h-20 resize-none"
                      />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                  >
                      <Plus className="w-5 h-5" /> Ajouter ce défi
                  </button>
              </div>
          </form>
      )}

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allChallenges.map((challenge) => {
          const isCompleted = completedIds.includes(challenge.id);
          const isActive = activeIds.includes(challenge.id);
          
          return (
            <div 
                key={challenge.id}
                className={`border rounded-2xl p-4 transition-all relative ${
                    isCompleted 
                    ? 'bg-emerald-50/50 border-emerald-200 opacity-90' 
                    : isActive
                    ? 'bg-white border-blue-400 shadow-md ring-1 ring-blue-100'
                    : 'bg-white border-slate-100 hover:shadow-md'
                }`}
            >
                {/* Delete button for custom challenges */}
                {challenge.isCustom && !isActive && !isCompleted && (
                    <button 
                        onClick={(e) => handleDelete(e, challenge.id)}
                        className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}

                <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-3">
                        <div className="text-3xl bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm">
                            {challenge.icon}
                        </div>
                        <div>
                            <h3 className={`font-bold text-slate-800 pr-6 ${isCompleted ? 'text-emerald-800' : ''}`}>
                                {challenge.title}
                            </h3>
                            <div className="flex flex-wrap gap-2 mt-1">
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
                    {isActive && <div className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full animate-pulse flex items-center gap-1"><Timer className="w-3 h-3"/> En cours</div>}
                </div>
                
                {challenge.duration && (
                     <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-2 bg-slate-50 px-2 py-1 rounded-md inline-block">
                        <Calendar className="w-3 h-3" />
                        {challenge.duration}
                     </div>
                )}
                
                <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                    {challenge.description || "Aucune description."}
                </p>

                <button
                    onClick={() => handleAction(challenge)}
                    className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                        isCompleted
                        ? 'bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-50'
                        : isActive
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200'
                        : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200'
                    }`}
                >
                    {isCompleted ? (
                        <>
                            <RefreshCw className="w-4 h-4" /> Recommencer
                        </>
                    ) : isActive ? (
                        <>
                            <CheckCircle2 className="w-4 h-4" /> Valider le défi
                        </>
                    ) : (
                        <>
                            <Play className="w-4 h-4 fill-current" /> Choisir ce défi
                        </>
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
