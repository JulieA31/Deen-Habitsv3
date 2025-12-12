
import React from 'react';
import { ArrowLeft, Shield, Lock, Database, Eye } from 'lucide-react';
import { ViewMode } from '../types';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="bg-slate-50 p-6 border-b border-slate-100">
        <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors mb-4 text-sm font-medium"
        >
            <ArrowLeft className="w-4 h-4" /> Retour au profil
        </button>
        <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Politique de Confidentialité</h1>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-8 text-slate-600 leading-relaxed">
        
        <section>
            <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-500" /> Collecte des Données
            </h2>
            <p className="mb-2">
                Chez Deen Habits, nous minimisons la collecte de données. Les informations que nous stockons sont strictement nécessaires au fonctionnement de l'application :
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Votre prénom et adresse email (pour l'authentification).</li>
                <li>Vos habitudes et leur suivi (logs).</li>
                <li>Vos données de suivi des prières.</li>
                <li>Votre niveau d'expérience (XP) et vos préférences (notifications).</li>
            </ul>
        </section>

        <section>
            <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-500" /> Sécurité et Stockage
            </h2>
            <p>
                Vos données sont stockées de manière sécurisée sur <strong>Google Firebase</strong> (Firestore), un leader mondial en matière d'infrastructure cloud sécurisée. 
                L'authentification est gérée par Firebase Auth, garantissant que vous seul avez accès à votre compte.
                Nous ne vendons, ne louons et ne partageons <strong>jamais</strong> vos données personnelles à des tiers à des fins publicitaires.
            </p>
        </section>

        <section>
            <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Eye className="w-5 h-5 text-purple-500" /> Intelligence Artificielle (Coach Deen)
            </h2>
            <p>
                Lorsque vous discutez avec le Coach IA, vos messages sont envoyés à l'API de Google Gemini pour générer une réponse. 
                Ces données sont transitoires et ne sont pas utilisées pour entraîner les modèles publics de manière à vous identifier. 
                Nous vous conseillons de ne jamais partager d'informations sensibles (bancaires, mots de passe, secrets intimes) avec l'IA.
            </p>
        </section>

        <section>
            <h2 className="text-lg font-bold text-slate-800 mb-3">Vos Droits</h2>
            <p className="mb-2">Conformément au RGPD et aux lois sur la protection des données, vous disposez des droits suivants :</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Droit d'accès à vos données.</li>
                <li>Droit de rectification.</li>
                <li>Droit à l'effacement (Suppression du compte disponible dans le profil).</li>
            </ul>
        </section>

        <div className="pt-6 border-t border-slate-100 text-xs text-slate-400">
            Dernière mise à jour : Octobre 2023. Pour toute question, contactez-nous via le support de l'application.
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
