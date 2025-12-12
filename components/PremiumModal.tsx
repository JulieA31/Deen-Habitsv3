
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
        
        {/* Decorative Header */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-center relative shrink-0">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <Star className="absolute top-2 left-2 w-12 h-12 text-white" />
                <Star className="absolute bottom-4 right-10 w-8 h-8 text-white" />
                <Star className="absolute top-10 right-4 w-6 h-6 text-white" />
            </div>
            
            <div className="relative z-10 pt-2">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg transform rotate-3">
                    <Star className="w-6 h-6 text-yellow-900 fill-yellow-900" />
                </div>
                <h2 className="text-xl font-bold text-white mb-0.5">Deen Habits <span className="text-yellow-400">Premium</span></h2>
                <p className="text-slate-300 text-xs">Investissez dans votre Akhira</p>
            </div>

            {/* Bouton fermer agrandi et plus visible */}
            <button 
                onClick={onClose}
                className="absolute top-3 right-3 text-white hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-20"
                aria-label="Fermer"
            >
                <X className="w-5 h-5" />
            </button>
        </div>

        {/* Benefits List - Scrollable if screen is tiny */}
        <div className="p-5 space-y-3 overflow-y-auto">
            <div className="flex items-start gap-3">
                <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg shrink-0">
                    <Zap className="w-4 h-4" />
                </div>
                <div>
                    <h3 className="font-bold text-sm text-slate-800">Coach IA Illimité</h3>
                    <p className="text-xs text-slate-500">Posez toutes vos questions sans limites.</p>
                </div>
            </div>

            <div className="flex items-start gap-3">
                <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                    <Shield className="w-4 h-4" />
                </div>
                <div>
                    <h3 className="font-bold text-sm text-slate-800">Statistiques Avancées</h3>
                    <p className="text-xs text-slate-500">Analysez votre progression.</p>
                </div>
            </div>

            <div className="flex items-start gap-3">
                <div className="p-1.5 bg-pink-100 text-pink-600 rounded-lg shrink-0">
                    <Heart className="w-4 h-4" />
                </div>
                <div>
                    <h3 className="font-bold text-sm text-slate-800">Soutenir le Projet</h3>
                    <p className="text-xs text-slate-500">Application sans publicité.</p>
                </div>
            </div>
        </div>

        {/* Price & Action - Always visible at bottom */}
        <div className="p-5 bg-slate-50 border-t border-slate-100 mt-auto shrink-0">
            <div className="flex justify-between items-end mb-3 px-1">
                <div>
                    <span className="text-xs text-slate-400 line-through">9.99€</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-slate-800">4,95€</span>
                        <span className="text-xs text-slate-500">/ mois</span>
                    </div>
                </div>
                <div className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-bold">
                    -50% Offre de lancement
                </div>
            </div>

            <button 
                onClick={onConfirm}
                disabled={isLoading}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-base hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
                {isLoading ? (
                    <>Processing...</>
                ) : (
                    <>Devenir Membre Premium <Check className="w-4 h-4" /></>
                )}
            </button>
            
            <p className="text-[10px] text-center text-slate-400 mt-2">
                Paiement sécurisé via Stripe. Annulable à tout moment.
            </p>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;
