
import React, { useState } from 'react';
import { Sparkles, MessageCircle, Loader2, Crown, CheckCircle2, X, CreditCard, Lock } from 'lucide-react';
import { Habit, HabitLog, PrayerLog, UserProfile } from '../types';
import { generateCoachingAdvice } from '../services/geminiService';

interface DeenCoachProps {
  habits: Habit[];
  logs: HabitLog;
  prayerLogs: PrayerLog;
  currentDate: string;
  userProfile: UserProfile;
  onSubscribe: () => void;
}

const DeenCoach: React.FC<DeenCoachProps> = ({ habits, logs, prayerLogs, currentDate, userProfile, onSubscribe }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  const handleGetAdvice = async () => {
    if (!userProfile.isPremium) {
        setShowPaywall(true);
        return;
    }

    setLoading(true);
    const result = await generateCoachingAdvice(habits, logs, prayerLogs, currentDate);
    setAdvice(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6 relative">
      <div className="bg-gradient-to-br from-emerald-900 to-slate-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start">
             <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-400" /> 
                Coach Deen AI
             </h2>
             <span className="bg-yellow-400/20 text-yellow-400 text-xs px-2 py-1 rounded border border-yellow-400/30 font-bold uppercase tracking-wider flex items-center gap-1">
                <Crown className="w-3 h-3" /> Premium
             </span>
          </div>
          
          <p className="text-slate-300 mb-6 max-w-lg">
            Salam {userProfile.name}, prêt pour votre bilan spirituel du jour ?
          </p>

          {!advice && !loading && (
            <button 
              onClick={handleGetAdvice}
              className="bg-white text-emerald-900 px-6 py-3 rounded-lg font-bold hover:bg-emerald-50 transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/50"
            >
              <MessageCircle className="w-5 h-5" />
              Obtenir la Sagesse du Jour
            </button>
          )}

          {loading && (
            <div className="flex items-center gap-3 text-emerald-200 animate-pulse bg-white/5 p-4 rounded-lg inline-flex">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyse de vos progrès...</span>
            </div>
          )}

          {advice && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 animate-in fade-in slide-in-from-bottom-2">
              <p className="text-lg leading-relaxed text-emerald-50 italic font-serif">
                "{advice}"
              </p>
              <div className="mt-4 flex gap-4">
                 <button onClick={handleGetAdvice} className="text-sm font-medium text-emerald-300 hover:text-white underline underline-offset-4">
                    Nouveau conseil
                 </button>
                 <button onClick={() => setAdvice(null)} className="text-sm font-medium text-slate-400 hover:text-white">
                    Fermer
                 </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
             <div className="text-2xl mb-2">🤲</div>
             <h3 className="font-bold text-slate-800">Niyyah (Intention)</h3>
             <p className="text-sm text-slate-500 mt-1">Commencez chaque action avec une intention sincère pour Allah.</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
             <div className="text-2xl mb-2">⚡</div>
             <h3 className="font-bold text-slate-800">Istiqamah (Constance)</h3>
             <p className="text-sm text-slate-500 mt-1">"Les actions les plus aimées d'Allah sont les plus constantes."</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
             <div className="text-2xl mb-2">🌱</div>
             <h3 className="font-bold text-slate-800">Croissance</h3>
             <p className="text-sm text-slate-500 mt-1">Visez le progrès, pas la perfection. Chaque jour est une nouvelle chance.</p>
          </div>
      </div>

      {/* Paywall Modal */}
      {showPaywall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 text-center overflow-hidden animate-in zoom-in-95 duration-200">
             
             <button 
                onClick={() => setShowPaywall(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
             >
                <X className="w-5 h-5" />
             </button>

             <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-yellow-400 to-emerald-400"></div>
             
             <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Crown className="w-8 h-8" />
             </div>

             <h2 className="text-2xl font-bold text-slate-900 mb-2">Débloquez le Coach IA</h2>
             <p className="text-slate-500 mb-6">
               Pour recevoir ce conseil personnalisé, passez au mode Premium.
             </p>

             <ul className="text-left space-y-3 mb-8 bg-slate-50 p-4 rounded-xl">
               <li className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  Analyses spirituelles quotidiennes
               </li>
               <li className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  Conseils basés sur vos données
               </li>
               <li className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  3 jours d'essai gratuit
               </li>
             </ul>

             <div className="mb-6">
               <span className="text-3xl font-bold text-slate-900">4,95 €</span>
               <span className="text-slate-500"> / mois</span>
               <p className="text-xs text-emerald-600 font-medium mt-1">Essai gratuit • Sans engagement</p>
             </div>

             <button 
               onClick={() => {
                   setShowPaywall(false);
                   onSubscribe();
               }}
               className="w-full py-4 bg-[#635BFF] text-white rounded-xl font-bold text-lg hover:bg-[#5851df] transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group"
             >
               <CreditCard className="w-5 h-5 text-white/80" />
               Payer avec Stripe
             </button>
             <p className="text-[10px] text-slate-400 mt-4 flex items-center justify-center gap-1">
               <Lock className="w-3 h-3" /> Paiement sécurisé et crypté
             </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeenCoach;