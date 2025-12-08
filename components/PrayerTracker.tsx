
import React, { useEffect, useState } from 'react';
import { MapPin, Clock, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { PrayerStatus, PrayerLog, PRAYER_NAMES } from '../types';
import { getPrayerTimes, PrayerTimes } from '../services/prayerService';

interface PrayerTrackerProps {
  logs: PrayerLog;
  setLogs: React.Dispatch<React.SetStateAction<PrayerLog>>;
  currentDate: string;
  onUpdateXP: (points: number) => void;
}

const PrayerTracker: React.FC<PrayerTrackerProps> = ({ logs, setLogs, currentDate, onUpdateXP }) => {
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const fetchedTimes = await getPrayerTimes(position.coords.latitude, position.coords.longitude);
          if (fetchedTimes) {
            setTimes(fetchedTimes);
          } else {
            setError("Impossible de charger les horaires.");
          }
          setLoading(false);
        },
        (err) => {
          console.error(err);
          setError("Activez la localisation pour les horaires.");
          setLoading(false);
        }
      );
    } else {
      setError("Géolocalisation non supportée.");
    }
  }, []);

  const handlePrayerAction = (prayer: string, status: PrayerStatus) => {
    const currentStatus = logs[currentDate]?.[prayer] || 'none';
    
    // Empêcher le farming d'XP en changeant le statut plusieurs fois vers le même état
    if (currentStatus === status) return;

    // Calcul diff XP
    // 1. On "rembourse" l'effet du statut précédent
    let xpCorrection = 0;
    if (currentStatus === 'on_time') xpCorrection -= 20;
    if (currentStatus === 'late') xpCorrection -= 10;
    if (currentStatus === 'missed') xpCorrection += 20; // On redonne les 20 points perdus

    // 2. On applique le nouveau statut
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
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-600" /> Horaires de Prière
        </h3>
        {loading && <span className="text-xs text-slate-400 animate-pulse">Localisation...</span>}
        {error && !loading && <span className="text-xs text-red-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {error}</span>}
        {times && !loading && <span className="text-xs text-emerald-600 font-medium flex items-center gap-1"><MapPin className="w-3 h-3" /> Localisé</span>}
      </div>

      <div className="space-y-3">
        {PRAYER_NAMES.map((prayer) => {
          const status = logs[currentDate]?.[prayer] || 'none';
          const time = times ? times[prayer] : '--:--';

          return (
            <div key={prayer} className="flex flex-col gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between w-full">
                  <div>
                    <span className="font-semibold text-slate-700 block">{prayer}</span>
                    <span className="text-sm text-slate-400 font-mono">{time}</span>
                  </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 w-full">
                <button
                  onClick={() => handlePrayerAction(prayer, 'on_time')}
                  className={`px-2 py-2 rounded-lg text-[10px] sm:text-xs font-medium transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                    status === 'on_time' 
                      ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-100' 
                      : 'bg-white text-slate-500 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" /> 
                  <span>À l'heure</span>
                </button>
                
                <button
                  onClick={() => handlePrayerAction(prayer, 'late')}
                  className={`px-2 py-2 rounded-lg text-[10px] sm:text-xs font-medium transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                    status === 'late' 
                      ? 'bg-amber-500 text-white shadow-md ring-2 ring-amber-100' 
                      : 'bg-white text-slate-500 border border-slate-200 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200'
                  }`}
                >
                  <AlertCircle className="w-4 h-4" /> 
                  <span>Rattrapée</span>
                </button>

                <button
                  onClick={() => handlePrayerAction(prayer, 'missed')}
                  className={`px-2 py-2 rounded-lg text-[10px] sm:text-xs font-medium transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                    status === 'missed' 
                      ? 'bg-red-500 text-white shadow-md ring-2 ring-red-100' 
                      : 'bg-white text-slate-500 border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                  }`}
                >
                  <XCircle className="w-4 h-4" /> 
                  <span>Manquée</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PrayerTracker;
