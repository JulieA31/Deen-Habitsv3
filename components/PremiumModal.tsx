import React from 'react';
import { X, Check, Star, Shield, Zap, Heart } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        {/* Decorative Header */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <Star className="absolute top-2 left-2 w-12 h-12 text-white" />
                <Star className="absolute bottom-4 right-10 w-8 h-8 text-white" />
                <Star className="absolute top-10 right-4 w-6 h-6 text-white" />
            </div>
            
            <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg transform rotate-3">
                    <Star className="w-8 h-8 text-yellow-900 fill-yellow-900" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">Deen Habits <span className="text-yellow-400">Premium</span></h2>
                <p className="text-slate-300 text-sm">Investissez dans votre Akhira</p>
            </div>

            <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors bg-white/10 p-1 rounded-full"
            >
                <X className="w-5 h-5" />
            </button>
        </div>

        {/* Benefits List */}
        <div className="p-6 space-y-4">
            <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg shrink-0">
                    <Zap className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">Coach IA Illimité</h3>
                    <p className="text-sm text-slate-500">Posez toutes vos questions spirituelles sans limites journalières.</p>
                </div>
            </div>

            <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                    <Shield className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">Statistiques Avancées</h3>
                    <p className="text-sm text-slate-500">Analysez votre progression sur le long terme.</p>
                </div>
            </div>

            <div className="flex items-start gap-3">
                <div className="p-2 bg-pink-100 text-pink-600 rounded-lg shrink-0">
                    <Heart className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">Soutenir le Projet</h3>
                    <p className="text-sm text-slate-500">Aidez-nous à maintenir l'application sans publicité.</p>
                </div>
            </div>
        </div>

        {/* Price & Action */}
        <div className="p-6 bg-slate-50 border-t border-slate-100">
            <div className="flex justify-between items-end mb-4 px-2">
                <div>
                    <span className="text-sm text-slate-400 line-through">9.99€</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-slate-800">4,95€</span>
                        <span className="text-sm text-slate-500">/ mois</span>
                    </div>
                </div>
                <div className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-bold">
                    -50% Offre de lancement
                </div>
            </div>

            <button 
                onClick={onConfirm}
                disabled={isLoading}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>Processing...</>
                ) : (
                    <>Devenir Membre Premium <Check className="w-5 h-5" /></>
                )}
            </button>
            
            <p className="text-[10px] text-center text-slate-400 mt-3">
                Paiement sécurisé via Stripe. Annulable à tout moment.
            </p>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;