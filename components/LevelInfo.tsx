
import React from 'react';
import { ChevronLeft, Award, Trophy, Star, ShieldCheck, Zap, Heart, BookOpen, Share2 } from 'lucide-react';

interface LevelInfoProps {
  currentLevel: number;
  currentXP: number;
  onBack: () => void;
}

interface Grade {
  level: number;
  name: string;
  xpRequired: number;
  icon: any;
  description: string;
  color: string;
}

const GRADES: Grade[] = [
  { level: 1, name: "Mubtadi", xpRequired: 0, icon: Star, description: "Celui qui commence son cheminement spirituel.", color: "text-slate-400 bg-slate-50 border-slate-100" },
  { level: 2, name: "Salik", xpRequired: 100, icon: Zap, description: "Le voyageur qui s'engage sérieusement dans ses habitudes.", color: "text-blue-500 bg-blue-50 border-blue-100" },
  { level: 3, name: "Talib", xpRequired: 400, icon: BookOpen, description: "L'étudiant qui cherche la constance et le savoir.", color: "text-emerald-500 bg-emerald-50 border-emerald-100" },
  { level: 4, name: "Muqarrab", xpRequired: 900, icon: Heart, description: "Celui qui se rapproche d'Allah par ses actes.", color: "text-pink-500 bg-pink-50 border-pink-100" },
  { level: 5, name: "Mu'min", xpRequired: 1600, icon: ShieldCheck, description: "Le croyant dont le cœur s'apaise dans l'adoration.", color: "text-indigo-500 bg-indigo-50 border-indigo-100" },
  { level: 6, name: "Sadiq", xpRequired: 2500, icon: Award, description: "Le véridique, constant dans ses prières et sa parole.", color: "text-purple-500 bg-purple-50 border-purple-100" },
  { level: 7, name: "Muhsin", xpRequired: 3600, icon: Trophy, description: "Celui qui adore Allah comme s'il Le voyait.", color: "text-yellow-600 bg-yellow-50 border-yellow-100" },
  { level: 8, name: "Zahid", xpRequired: 4900, icon: Star, description: "Celui qui détache son cœur du superflu pour l'Essentiel.", color: "text-orange-500 bg-orange-50 border-orange-100" },
  { level: 9, name: "Arif", xpRequired: 6400, icon: Zap, description: "Le connaisseur qui comprend la profondeur de sa foi.", color: "text-teal-600 bg-teal-50 border-teal-100" },
  { level: 10, name: "Wali", xpRequired: 8100, icon: Trophy, description: "L'ami d'Allah, au sommet de sa discipline spirituelle.", color: "text-amber-600 bg-amber-50 border-amber-100" },
];

const LevelInfo: React.FC<LevelInfoProps> = ({ currentLevel, currentXP, onBack }) => {
  const currentGrade = GRADES.find(g => g.level === currentLevel);

  const handleShare = () => {
    const text = `Alhamdulillah ! Je viens d'atteindre le grade "${currentGrade?.name || 'Croyant'}" (Niveau ${currentLevel}) sur Deen Habits. 🌙✨ Rejoins-moi pour améliorer nos habitudes spirituelles ensemble !`;
    if (navigator.share) {
      navigator.share({
        title: 'Ma Progression Deen Habits',
        text: text,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text);
      alert("Lien et message copiés ! Partage-les avec tes amis.");
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-10">
      <div className="flex items-center justify-between pr-2">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-slate-800">Grades & Progression</h2>
        </div>
        <button 
          onClick={handleShare}
          className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-100 transition-all shadow-sm flex items-center gap-2 group"
        >
          <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold hidden sm:inline">Partager</span>
        </button>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><Trophy className="w-32 h-32" /></div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Ton Grade Actuel</p>
          <h3 className="text-3xl font-black mb-2">{currentGrade?.name || "Mubtadi"}</h3>
          <div className="flex items-center gap-4 mt-4">
              <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Total XP</span>
                  <span className="text-xl font-bold text-yellow-400">{currentXP}</span>
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Niveau</span>
                  <span className="text-xl font-bold text-emerald-400">{currentLevel}</span>
              </div>
          </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-2">Échelle de l'Excellence</h4>
        <div className="grid gap-3">
          {GRADES.map((grade) => {
            const isUnlocked = currentLevel >= grade.level;
            const isCurrent = grade.level === currentLevel;

            return (
              <div 
                key={grade.level}
                className={`relative flex items-start gap-4 p-5 rounded-3xl border transition-all ${
                  isUnlocked ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-50 border-transparent opacity-40'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${isUnlocked ? grade.color : 'bg-slate-100 text-slate-300'}`}>
                  <grade.icon className="w-7 h-7" />
                </div>
                
                <div className="flex-1 min-w-0">
                   <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Niveau {grade.level}</span>
                              {isCurrent && (
                                <span className="bg-emerald-100 text-emerald-700 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest shrink-0">Actuel</span>
                              )}
                            </div>
                            <h5 className={`text-lg font-bold leading-tight ${isUnlocked ? 'text-slate-800' : 'text-slate-400'}`}>{grade.name}</h5>
                        </div>
                        <div className="shrink-0 pt-4">
                            <span className={`text-xs font-bold ${isUnlocked ? 'text-emerald-600' : 'text-slate-400'}`}>
                                {grade.xpRequired} XP
                            </span>
                        </div>
                   </div>
                   <p className="text-xs text-slate-500 mt-2 leading-relaxed italic break-words">
                     {grade.description}
                   </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LevelInfo;
