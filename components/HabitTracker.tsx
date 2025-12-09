import React, { useState } from 'react';
import { Plus, Trash2, Check, X, Calendar, Sparkles, ScrollText, Trophy } from 'lucide-react';
import { Habit, HabitLog, CATEGORY_ICONS, CATEGORY_COLORS } from '../types';

interface HabitTrackerProps {
  habits: Habit[];
  logs: HabitLog;
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  setLogs: React.Dispatch<React.SetStateAction<HabitLog>>;
  currentDate: string;
  onUpdateXP: (points: number) => void;
}

const SUNNAH_HABITS = [
  { title: 'Siwak', category: 'deen', icon: '🦷', description: "Utiliser le Siwak avant chaque prière.", xp: 10 },
  { title: 'Prière de Duha', category: 'deen', icon: '☀️', description: "La prière de la matinée (2 rakʿat minimum).", xp: 30 },
  { title: 'Jeûner Lundi/Jeudi', category: 'deen', icon: '📅', description: "Jeûner comme le Prophète (sws).", xp: 50 },
  { title: 'Witr avant de dormir', category: 'deen', icon: '🌙', description: "Clôturer la journée avec la prière impaire.", xp: 25 },
  { title: 'Lire Sourate Al-Mulk', category: 'deen', icon: '📖', description: "Chaque soir pour la protection de la tombe.", xp: 20 },
  { title: 'Dhikr du Matin', category: 'deen', icon: '📿', description: "Invocations de protection du matin.", xp: 15 },
  { title: 'Sourire (Sadaqa)', category: 'general', icon: '😊', description: "Sourire est une aumône.", xp: 5 },
  { title: 'Visiter un malade', category: 'general', icon: '🏥', description: "Un devoir du musulman envers son frère.", xp: 40 },
];

// JS: getDay() → 0 = Dimanche, 1 = Lundi, ...
const DAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

const HabitTracker: React.FC<HabitTrackerProps> = ({
  habits,
  logs,
  setHabits,
  setLogs,
  currentDate,
  onUpdateXP,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAllHabits, setShowAllHabits] = useState(false);

  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState<Habit['category']>('deen');
  const [newHabitXP, setNewHabitXP] = useState(10);
  const [frequency, setFrequency] = useState<number[]>([]);

  const toggleHabit = (habitId: string, xpValue: number) => {
    const isCompleted = logs[currentDate]?.[habitId];
    if (!isCompleted) {
      onUpdateXP(xpValue);
    } else {
      onUpdateXP(-xpValue);
    }

    setLogs((prev) => {
      const todayLogs = prev[currentDate] || {};
      return {
        ...prev,
        [currentDate]: {
          ...todayLogs,
          [habitId]: !todayLogs[habitId],
        },
      };
    });
  };

  const addHabit = (
    e?: React.FormEvent,
    suggestion?: { title: string; category: string; xp: number; icon?: string; description?: string }
  ) => {
    if (e) e.preventDefault();
    const title = suggestion ? suggestion.title : newHabitTitle;
    const category = suggestion ? (suggestion.category as Habit['category']) : newHabitCategory;
    const xp = suggestion ? suggestion.xp : newHabitXP;

    if (!title.trim()) return;

    const newHabit: Habit = {
      id:
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : Date.now().toString() + Math.random().toString().slice(2),
      title,
      category,
      icon: CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || '✨',
      createdAt: Date.now(),
      frequency,
      xp,
    };

    setHabits((prev) => [...prev, newHabit]);

    setNewHabitTitle('');
    setNewHabitXP(10);
    setFrequency([]);
    setIsAdding(false);
    setShowSuggestions(false);

    alert(`Habitude "${title}" ajoutée avec succès !`);
  };

  const deleteHabit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (window.confirm('Êtes-vous sûr de vouloir supprimer définitivement cette habitude ?')) {
      setHabits((prev) => prev.filter((h) => h.id !== id));
    }
  };

  const toggleDay = (dayIndex: number) => {
    setFrequency((prev) =>
      prev.includes(dayIndex) ? prev.filter((d) => d !== dayIndex) : [...prev, dayIndex]
    );
  };

  const currentDayIndex = new Date(currentDate).getDay();
  const visibleHabits = showAllHabits
    ? habits
    : habits.filter((h) => h.frequency.length === 0 || h.frequency.includes(currentDayIndex));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Vos Habitudes</h2>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setShowAllHabits(false)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                !showAllHabits
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-slate-500 border-slate-200'
              }`}
            >
              Aujourd&apos;hui
            </button>
            <button
              onClick={() => setShowAllHabits(true)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                showAllHabits
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-slate-500 border-slate-200'
              }`}
            >
              Toutes
            </button>
          </div>
        </div>
        <span className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border shadow-sm">
          {new Date(currentDate).toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {visibleHabits.length === 0 && habits.length > 0 && (
          <p className="text-center text-slate-400 py-4 text-sm">
            Pas d&apos;habitudes prévues pour ce jour.
          </p>
        )}

        {habits.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-400 mb-2">Aucune habitude suivie.</p>
            <button
              onClick={() => setIsAdding(true)}
              className="text-emerald-600 font-medium hover:underline"
            >
              Commencer maintenant
            </button>
          </div>
        )}

        {visibleHabits.map((habit) => {
          const isCompleted = logs[currentDate]?.[habit.id] || false;
          return (
            <div
              key={habit.id}
              className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                isCompleted
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : 'bg-white border-slate-100 shadow-sm'
              }`}
            >
              <div
                className="flex items-center gap-4 flex-1 cursor-pointer min-w-0"
                onClick={() => toggleHabit(habit.id, habit.xp)}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-500 text-white scale-110'
                      : 'bg-slate-100 text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <Check
                    className={`w-6 h-6 ${
                      isCompleted ? 'opacity-100' : 'opacity-0'
                    } transition-opacity`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3
                    className={`font-semibold text-lg transition-all truncate ${
                      isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'
                    }`}
                  >
                    {habit.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${CATEGORY_COLORS[habit.category]}`}
                    >
                      {habit.category === 'deen'
                        ? 'Deen'
                        : habit.category === 'health'
                        ? 'Santé'
                        : 'Autre'}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Trophy className="w-3 h-3" /> {habit.xp || 10} XP
                    </span>
                    {habit.frequency.length > 0 && (
                      <span className="text-xs text-slate-400 flex items-center gap-1 border-l pl-2 border-slate-200">
                        <Calendar className="w-3 h-3" />
                        {habit.frequency.map((d) => DAYS[d]).join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => deleteHabit(habit.id, e)}
                className="ml-3 p-3 text-slate-300 hover:text-red-600 bg-transparent hover:bg-red-50 rounded-xl transition-all flex-shrink-0"
                title="Supprimer l'habitude"
                aria-label="Supprimer"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          );
        })}
      </div>

      {isAdding ? (
        <form
          onSubmit={(e) => addHabit(e)}
          className="bg-white p-6 rounded-2xl shadow-lg border border-emerald-100 animate-in fade-in slide-in-from-bottom-4 relative"
        >
          <button
            type="button"
            onClick={() => setShowSuggestions(true)}
            className="absolute top-6 right-6 text-sm text-emerald-600 font-medium flex items-center gap-1 hover:text-
