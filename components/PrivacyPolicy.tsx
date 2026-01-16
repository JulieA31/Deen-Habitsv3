
import React from 'react';
import { ArrowLeft, Shield, Lock, Database, Eye, MapPin, Trash2 } from 'lucide-react';
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
                <li>Votre prénom et adresse email (pour l'authentification sécurisée).</li>
                <li>Vos habitudes et leur suivi (logs).</li>
                <li>Vos données de suivi des prières.</li>
                <li>Votre niveau d'expérience (XP).</li>
            </ul>
        </section>

        <section>
            <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-500" /> Géolocalisation
            </h2>
            <p>
                L'accès à votre position géographique peut être demandé uniquement lorsque vous souhaitez mettre à jour les horaires de prière en fonction de votre lieu actuel.
                Ces coordonnées ne sont utilisées que pour interroger l'API de calcul d'horaires et ne sont <strong>pas stockées</strong> sur nos serveurs.
            </p>
        </section>

        <section>
            <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-500" /> Sécurité et Stockage
            </h2>
            <p>
                Vos données sont stockées de manière sécurisée sur <strong>Google Firebase</strong> (Firestore), un leader mondial en matière d'infrastructure cloud sécurisée. 
                L'authentification est gérée par Firebase Auth, garantissant que vous seul avez accès à votre compte.
                Nous ne vendons, ne louons et ne partageons <strong>jamais</strong> vos données personnelles à des tiers.
            </p>
        </section>

        <section>
            <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-slate-500" /> Suppression de compte
            </h2>
            <p className="mb-2">Vous disposez d'un droit total sur vos données. Pour supprimer votre compte et toutes les données associées :</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Utilisez le bouton <strong>"Supprimer mon compte"</strong> situé en bas de la page de votre Profil.</li>
                <li>Ou contactez-nous directement par email à : <strong className="text-emerald-600">studio@deenhabits.app</strong></li>
            </ul>
        </section>

        <div className="pt-6 border-t border-slate-100 text-xs text-slate-400">
            Dernière mise à jour : Octobre 2023. L'application est gratuite.
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
