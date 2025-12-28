
import React, { useState } from 'react';
// Added Star to the lucide-react imports
import { User, Mail, Lock, LogOut, Trash2, Save, ChevronLeft, Award, ShieldCheck, Key, Star } from 'lucide-react';
import { UserProfile } from '../types';
import { auth, db } from '../services/firebase';

interface ProfileProps {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  onBack: () => void;
}

const Profile: React.FC<ProfileProps> = ({ userProfile, setUserProfile, onBack }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(userProfile.name);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleUpdateName = async () => {
    if (!newName.trim() || !userProfile.uid) return;
    setIsLoading(true);
    try {
      if (db) {
        await db.collection("users").doc(userProfile.uid).update({
          "profile.name": newName
        });
        setUserProfile(prev => prev ? { ...prev, name: newName } : null);
        setIsEditingName(false);
        setMessage({ type: 'success', text: "Prénom mis à jour avec succès !" });
      }
    } catch (error) {
      setMessage({ type: 'error', text: "Erreur lors de la mise à jour." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!userProfile.email) return;
    setIsLoading(true);
    try {
      if (auth) {
        await auth.sendPasswordResetEmail(userProfile.email);
        setMessage({ type: 'success', text: "Un email de réinitialisation a été envoyé à " + userProfile.email });
      }
    } catch (error) {
      setMessage({ type: 'error', text: "Erreur lors de l'envoi de l'email." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Voulez-vous vraiment vous déconnecter ?")) {
      auth?.signOut();
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("⚠️ ATTENTION : Cette action est irréversible. Toutes vos données seront supprimées. Voulez-vous continuer ?")) {
      const user = auth?.currentUser;
      try {
        if (db && userProfile.uid) {
          await db.collection("users").doc(userProfile.uid).delete();
        }
        await user?.delete();
      } catch (error) {
        alert("Pour supprimer votre compte, vous devez vous être reconnecté récemment. Veuillez vous déconnecter et vous reconnecter avant de réessayer.");
      }
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300 pb-10">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={onBack} className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-slate-800">Mon Profil</h2>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-medium animate-in fade-in ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
          <ShieldCheck className="w-5 h-5" />
          {message.text}
        </div>
      )}

      {/* Identité Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5">
            <User className="w-32 h-32" />
        </div>
        
        <div className="flex items-center gap-5 mb-8 relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-emerald-100">
            {userProfile.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-slate-50 border border-slate-200 p-2 rounded-lg font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                  autoFocus
                />
                <button onClick={handleUpdateName} className="p-2 bg-emerald-600 text-white rounded-lg"><Save className="w-4 h-4" /></button>
              </div>
            ) : (
              <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                {userProfile.name}
                <button onClick={() => setIsEditingName(true)} className="p-1 text-slate-300 hover:text-emerald-600"><Save className="w-4 h-4" /></button>
              </h3>
            )}
            <p className="text-slate-400 text-sm flex items-center gap-1.5 mt-1">
              <Mail className="w-3.5 h-3.5" /> {userProfile.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 relative z-10">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Grade actuel</span>
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <Award className="w-4 h-4" /> Niveau {userProfile.level}
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total XP</span>
            <div className="flex items-center gap-2 text-indigo-700 font-bold">
              <Star className="w-4 h-4" /> {userProfile.xp} pts
            </div>
          </div>
        </div>
      </div>

      {/* Paramètres & Actions */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Sécurité & Compte</h4>
        
        <button 
          onClick={handleResetPassword}
          disabled={isLoading}
          className="w-full bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Key className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="font-bold text-slate-700 block text-sm">Réinitialiser le mot de passe</span>
              <span className="text-xs text-slate-400">Envoi d'un lien par email</span>
            </div>
          </div>
        </button>

        <button 
          onClick={handleLogout}
          className="w-full bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between hover:bg-red-50 hover:border-red-100 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:text-red-600 transition-colors">
              <LogOut className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="font-bold text-slate-700 block text-sm group-hover:text-red-700">Déconnexion</span>
              <span className="text-xs text-slate-400">Se déconnecter de cet appareil</span>
            </div>
          </div>
        </button>

        <button 
          onClick={handleDeleteAccount}
          className="w-full bg-red-50/30 p-4 rounded-2xl border border-red-50 flex items-center justify-between hover:bg-red-50 transition-colors group mt-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="font-bold text-red-800 block text-sm">Supprimer mon compte</span>
              <span className="text-xs text-red-400">Action irréversible</span>
            </div>
          </div>
        </button>
      </div>

      <p className="text-[10px] text-center text-slate-400 pt-4">
        Deen Habits AI v2.0 • Propulsé par Google Gemini
      </p>
    </div>
  );
};

export default Profile;
