
import React from 'react';
import { MapPin, Clock, CheckCircle2, AlertCircle, XCircle, Compass, Sun } from 'lucide-react';
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
  onOpenQibla?: () => void;
}

const PrayerTracker: React.FC<PrayerTrackerProps> = ({ 
  logs, 
  setLogs, 
  currentDate, 
  onUpdateXP, 
  prayerTimes, 
  prayerLoading, 
  prayerError,
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
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 mb-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-12 -mt-12 opacity-50 -z-0"></div>

      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="font-black text-slate-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-600" /> Horaires de Prière
        </h3>
        
        <div className="flex items-center gap-2">
            {onOpenQibla && (
                <button 
                    onClick={onOpenQibla}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 text-[10px] font-black uppercase tracking-wider hover:bg-emerald-100 transition-colors shadow-sm"
                >
                    <Compass className="w-3.5 h-3.5" />
                    Boussole
                </button>
            )}
            {prayerLoading && <span className="text-[10px] text-slate-400 animate-pulse bg-slate-50 px-2 py-1 rounded-full">Calcul...</span>}
        </div>
      </div>

      {/* Alerte Géolocalisation */}
      {!prayerTimes && !prayerLoading && (
        <div className="mb-4 bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start gap-3 relative z-10">
            <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                <MapPin className="w-5 h-5" />
            </div>
            <div>
                <p className="text-sm font-bold text-amber-900">Activez la géolocalisation</p>
                <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                    Besoin de votre position pour les horaires précis de votre ville.
                </p>
            </div>
        </div>
      )}

      <div className="space-y-3 relative z-10">
        {PRAYER_NAMES.map((prayer) => {
          const status = logs[currentDate]?.[prayer] || 'none';
          const time = prayerTimes ? prayerTimes[prayer] : '--:--';

          const elements = [];

          elements.push(
            <div key={prayer} className="flex flex-col gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-100 transition-colors group">
              <div className="flex items-center justify-between w-full px-1">
                  <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-8 rounded-full ${status === 'on_time' ? 'bg-emerald-500' : status === 'late' ? 'bg-amber-500' : status === 'missed' ? 'bg-red-500' : 'bg-slate-200'}`}></div>
                    <div>
                        <span className="font-black text-slate-700 text-sm uppercase tracking-tight">{prayer}</span>
                        <span className="text-[10px] text-slate-400 font-black block tracking-widest">{time}</span>
                    </div>
                  </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 w-full">
                <button onClick={() => handlePrayerAction(prayer, 'on_time')} className={`px-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all flex items-center justify-center gap-1.5 ${status === 'on_time' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100' : 'bg-white text-slate-500 border border-slate-200 hover:border-emerald-200'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> À l'heure
                </button>
                <button onClick={() => handlePrayerAction(prayer, 'late')} className={`px-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all flex items-center justify-center gap-1.5 ${status === 'late' ? 'bg-amber-500 text-white shadow-md shadow-amber-100' : 'bg-white text-slate-500 border border-slate-200 hover:border-amber-200'}`}>
                  <AlertCircle className="w-3.5 h-3.5" /> Tard
                </button>
                <button onClick={() => handlePrayerAction(prayer, 'missed')} className={`px-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all flex items-center justify-center gap-1.5 ${status === 'missed' ? 'bg-red-500 text-white shadow-md shadow-red-100' : 'bg-white text-slate-500 border border-slate-200 hover:border-red-200'}`}>
                  <XCircle className="w-3.5 h-3.5" /> Ratée
                </button>
              </div>
            </div>
          );

          if (prayer === 'Fajr' && prayerTimes?.Sunrise) {
            elements.push(
              <div key="sunrise" className="flex items-center justify-between p-3 rounded-2xl border border-dashed border-amber-200 bg-amber-50/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-tight text-amber-800">Lever du soleil</span>
                    <span className="text-[10px] text-amber-600 block font-black">{prayerTimes.Sunrise}</span>
                  </div>
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest text-amber-600/50">Fin Fajr</span>
              </div>
            );
          }

          return elements;
        })}
      </div>
    </div>
  );
};

export default PrayerTracker;
