
import React from 'react';
import { MapPin, Clock, CheckCircle2, AlertCircle, XCircle, Bell, BellOff, Compass } from 'lucide-react';
import { PrayerStatus, PrayerLog, PRAYER_NAMES, UserProfile } from '../types';
import { PrayerTimes } from '../services/prayerService';

interface PrayerTrackerProps {
  logs: PrayerLog;
  setLogs: React.Dispatch<React.SetStateAction<PrayerLog>>;
  currentDate: string;
  onUpdateXP: (points: number) => void;
  prayerTimes: PrayerTimes | null;
  prayerLoading: boolean;
  prayerError: string | null;
  userProfile: UserProfile | null;
  onToggleNotification: (prayer: string) => void;
  onOpenQibla?: () => void; // Prop ajoutée pour ouvrir la boussole
}

const PrayerTracker: React.FC<PrayerTrackerProps> = ({ 
  logs, 
  setLogs, 
  currentDate, 
  onUpdateXP, 
  prayerTimes, 
  prayerLoading, 
  prayerError,
  userProfile,
  onToggleNotification,
  onOpenQibla
}) => {

  const handlePrayerAction = (prayer: string, status: PrayerStatus) => {
    const currentStatus = logs[currentDate]?.[prayer] || 'none';
    if (currentStatus === status) return;

    let xpCorrection = 0;
    if (currentStatus === 'on_time') xpCorrection -= 20;
    if (currentStatus === 'late') xpCorrection -= 10;
    if (currentStatus === 'missed') xpCorrection += 20;

    let xpNew = 0;
    if (status === 'on_time') xpNew += 20;
    if (status === 'late') xpNew += 10;
    if (status === 'missed') xpNew -= 20;

    onUpdateXP(xpCorrection + xpNew);

    setLogs(prev => ({
      ...prev,
      [currentDate]: {
        ...(prev[currentDate] || {}),
        [prayer]: status
      }
    }));
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6 relative overflow-hidden">
      {/* Subtle indicator decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-12 -mt-12 opacity-50 -z-0"></div>

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" /> Horaires de Prière
            </h3>
        </div>
        
        <div className="flex items-center gap-2">
            {onOpenQibla && (
                <button 
                    onClick={onOpenQibla}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 text-xs font-bold hover:bg-emerald-100 transition-colors shadow-sm"
                    title="Ouvrir la boussole Qibla"
                >
                    <Compass className="w-3.5 h-3.5" />
                    Qibla
                </button>
            )}
            {prayerLoading && <span className="text-[10px] text-slate-400 animate-pulse bg-slate-50 px-2 py-1 rounded-full">Localisation...</span>}
        </div>
      </div>

      {prayerError && !prayerLoading && (
        <div className="mb-4 p-2 bg-red-50 text-red-500 text-[10px] rounded-lg flex items-center gap-2">
            <AlertCircle className="w-3 h-3" /> {prayerError}
        </div>
      )}

      <div className="space-y-3 relative z-10">
        {PRAYER_NAMES.map((prayer) => {
          const status = logs[currentDate]?.[prayer] || 'none';
          const time = prayerTimes ? prayerTimes[prayer] : '--:--';
          const isNotificationEnabled = userProfile?.prayerNotifications?.[prayer] || false;

          return (
            <div key={prayer} className="flex flex-col gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
              <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className={`w-1 h-8 rounded-full ${status === 'on_time' ? 'bg-emerald-500' : status === 'late' ? 'bg-amber-500' : status === 'missed' ? 'bg-red-500' : 'bg-slate-200'}`}></div>
                    <div>
                        <span className="font-bold text-slate-700 text-sm">{prayer}</span>
                        <span className="text-[10px] text-slate-400 font-mono block tracking-tight">{time}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => onToggleNotification(prayer)}
                    className={`p-2 rounded-full transition-colors ${isNotificationEnabled ? 'bg-emerald-100 text-emerald-600 shadow-inner' : 'bg-white text-slate-300 hover:bg-slate-100 border border-slate-100'}`}
                    title={isNotificationEnabled ? "Désactiver le rappel" : "Activer le rappel"}
                  >
                    {isNotificationEnabled ? <Bell className="w-3.5 h-3.5 fill-current" /> : <BellOff className="w-3.5 h-3.5" />}
                  </button>
              </div>
              
              <div className="grid grid-cols-3 gap-2 w-full">
                <button
                  onClick={() => handlePrayerAction(prayer, 'on_time')}
                  className={`px-2 py-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                    status === 'on_time' 
                      ? 'bg-emerald-600 text-white shadow-md' 
                      : 'bg-white text-slate-500 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-600'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> 
                  À l'heure
                </button>
                
                <button
                  onClick={() => handlePrayerAction(prayer, 'late')}
                  className={`px-2 py-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                    status === 'late' 
                      ? 'bg-amber-500 text-white shadow-md' 
                      : 'bg-white text-slate-500 border border-slate-200 hover:bg-amber-50 hover:text-amber-600'
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5" /> 
                  Rattrapée
                </button>

                <button
                  onClick={() => handlePrayerAction(prayer, 'missed')}
                  className={`px-2 py-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                    status === 'missed' 
                      ? 'bg-red-500 text-white shadow-md' 
                      : 'bg-white text-slate-500 border border-slate-200 hover:bg-red-50 hover:text-red-600'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" /> 
                  Manquée
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {prayerTimes && (
        <div className="mt-4 flex items-center gap-1.5 text-[9px] text-slate-400 px-1">
            <MapPin className="w-3 h-3" />
            Méthode : Muslim World League (Localisée)
        </div>
      )}
    </div>
  );
};

export default PrayerTracker;
