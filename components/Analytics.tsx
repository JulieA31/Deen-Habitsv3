import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Habit, HabitLog } from '../types';

interface AnalyticsProps {
  habits: Habit[];
  logs: HabitLog;
}

const Analytics: React.FC<AnalyticsProps> = ({ habits, logs }) => {
  const data = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    
    const dayLogs = logs[dateStr] || {};
    const completed = Object.values(dayLogs).filter(Boolean).length;
    
    return {
      name: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
      completed: completed,
      date: dateStr
    };
  });

  const totalCompleted = Object.values(logs).reduce((acc: number, dayLog) => {
    return acc + Object.values(dayLog).filter(Boolean).length;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Complété</p>
          <p className="text-4xl font-bold text-emerald-600 mt-2">{totalCompleted}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Habitudes Actives</p>
          <p className="text-4xl font-bold text-slate-800 mt-2">{habits.length}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-80">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Performance Hebdomadaire</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12, textTransform: 'capitalize' }} 
                dy={10}
            />
            <YAxis hide />
            <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="completed" radius={[4, 4, 4, 4]} barSize={32}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 6 ? '#10b981' : '#cbd5e1'} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;