
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { Habit, HabitLog, PrayerLog, PRAYER_NAMES } from '../types';

interface AnalyticsProps {
  habits: Habit[];
  logs: HabitLog;
  prayerLogs: PrayerLog;
}

const Analytics: React.FC<AnalyticsProps> = ({ habits, logs, prayerLogs }) => {
  const [period, setPeriod] = useState<7 | 30>(7);

  // Génération des dates
  const dates = Array.from({ length: period }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (period - 1 - i));
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });

  // --- Données Habitudes ---
  const habitData = dates.map(dateStr => {
    const dayLogs = logs[dateStr] || {};
    const completed = Object.values(dayLogs).filter(Boolean).length;
    return {
      name: new Date(dateStr).toLocaleDateString('fr-FR', { weekday: 'narrow' }),
      completed: completed,
      fullDate: dateStr
    };
  });

  // --- Données Prières (Pie Chart global) ---
  let prayerStats = { on_time: 0, late: 0, missed: 0, total: 0 };
  
  // --- Données Prières (Par Prière) ---
  const prayerBreakdown = PRAYER_NAMES.map(name => ({ name, on_time: 0, late: 0, missed: 0 }));

  dates.forEach(dateStr => {
    const dayLog = prayerLogs[dateStr] || {};
    PRAYER_NAMES.forEach((name, idx) => {
        const status = dayLog[name];
        if (status === 'on_time') {
            prayerStats.on_time++;
            prayerBreakdown[idx].on_time++;
        } else if (status === 'late') {
            prayerStats.late++;
            prayerBreakdown[idx].late++;
        } else if (status === 'missed') {
            prayerStats.missed++;
            prayerBreakdown[idx].missed++;
        }
        // On ne compte pas 'none' (pas encore passé ou pas rempli)
    });
  });

  prayerStats.total = prayerStats.on_time + prayerStats.late + prayerStats.missed;

  const pieData = [
    { name: 'À l\'heure', value: prayerStats.on_time, color: '#10b981' }, // Emerald-500
    { name: 'Rattrapée', value: prayerStats.late, color: '#f59e0b' },    // Amber-500
    { name: 'Manquée', value: prayerStats.missed, color: '#ef4444' }     // Red-500
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-8 pb-20">
      {/* Contrôle Période */}
      <div className="flex justify-end">
        <div className="bg-slate-100 p-1 rounded-xl inline-flex">
            <button 
                onClick={() => setPeriod(7)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${period === 7 ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
            >
                7 Jours
            </button>
            <button 
                onClick={() => setPeriod(30)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${period === 30 ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
            >
                30 Jours
            </button>
        </div>
      </div>

      {/* --- SECTION PRIÈRES --- */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            🕌 Assiduité Prières
        </h3>
        
        {prayerStats.total === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-200 text-center text-slate-400">
                Pas assez de données pour cette période.
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pie Chart */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center min-h-[250px]">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Vue d'ensemble</h4>
                    <div className="w-full h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="space-y-4">
                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex justify-between items-center">
                        <div>
                            <p className="text-emerald-800 font-bold">Prières à l'heure</p>
                            <p className="text-xs text-emerald-600">Sur les {period} derniers jours</p>
                        </div>
                        <span className="text-2xl font-bold text-emerald-600">{prayerStats.on_time}</span>
                    </div>
                    <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex justify-between items-center">
                        <div>
                            <p className="text-red-800 font-bold">Manquées</p>
                            <p className="text-xs text-red-600">À améliorer insha'Allah</p>
                        </div>
                        <span className="text-2xl font-bold text-red-600">{prayerStats.missed}</span>
                    </div>
                     <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex justify-between items-center">
                        <div>
                            <p className="text-amber-800 font-bold">Rattrapées</p>
                        </div>
                        <span className="text-2xl font-bold text-amber-600">{prayerStats.late}</span>
                    </div>
                </div>
            </div>
        )}

        {/* Détail par Prière (Tableau/Matrice) */}
        <div className="mt-6 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <h4 className="text-sm font-bold text-slate-800 p-4 bg-slate-50 border-b border-slate-100">Détail par Prière</h4>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-50">
                        <tr>
                            <th className="px-4 py-3">Prière</th>
                            <th className="px-4 py-3 text-center text-emerald-600">À l'heure</th>
                            <th className="px-4 py-3 text-center text-amber-600">Rattrapée</th>
                            <th className="px-4 py-3 text-center text-red-600">Manquée</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {prayerBreakdown.map((row) => (
                            <tr key={row.name} className="hover:bg-slate-50/50">
                                <td className="px-4 py-3 font-medium text-slate-700">{row.name}</td>
                                <td className="px-4 py-3 text-center font-bold text-emerald-600 bg-emerald-50/30">{row.on_time}</td>
                                <td className="px-4 py-3 text-center text-amber-600">{row.late}</td>
                                <td className="px-4 py-3 text-center font-bold text-red-600 bg-red-50/30">{row.missed}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>

      {/* --- SECTION HABITUDES --- */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            ✅ Habitudes Complétées
        </h3>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-64">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={habitData}>
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }} 
                    dy={10}
                />
                <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="completed" radius={[4, 4, 4, 4]} barSize={20}>
                    {habitData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === habitData.length - 1 ? '#10b981' : '#cbd5e1'} />
                    ))}
                </Bar>
            </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
