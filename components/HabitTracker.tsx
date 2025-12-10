
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
  // Prières & Actes d'adoration
  { title: 'Prière de Duha', category: 'deen', icon: '☀️', description: "La prière de la matinée (2 rakʿat minimum).", xp: 30 },
  { title: 'Rawâtib (Surérogatoires)', category: 'deen', icon: '🕌', description: "Les 12 unités de prière liées aux prières obligatoires.", xp: 25 },
  { title: 'Witr avant de dormir', category: 'deen', icon: '🌙', description: "Clôturer la journée avec la prière impaire.", xp: 25 },
  { title: 'Dhikr du Matin', category: 'deen', icon: '📿', description: "Invocations de protection du matin.", xp: 15 },
  { title: 'Dhikr du Soir', category: 'deen', icon: '🌇', description: "Invocations de protection du soir.", xp: 15 },
  { title: 'Tasbih post-prière', category: 'deen', icon: '☝️', description: "33x SubhanAllah, Alhamdulillah, Allahu Akbar.", xp: 10 },
  { title: 'Istighfar quotidien', category: 'deen', icon: '💧', description: "Demander pardon à Allah régulièrement.", xp: 10 },
  { title: 'Lire Sourate Al-Mulk', category: 'deen', icon: '📖', description: "Chaque soir pour la protection de la tombe.", xp: 20 },
  { title: 'Lire Sourate Al-Kahf', category: 'deen', icon: '🔦', description: "Le Vendredi (Lumière entre deux vendredis).", xp: 50 },
  { title: 'Jeûner Lundi/Jeudi', category: 'deen', icon: '📅', description: "Jeûner comme le Prophète (sws).", xp: 50 },
  { title: 'Jeûner Jours Blancs', category: 'deen', icon: '🌕', description: "13, 14 et 15ème jour du mois lunaire.", xp: 50 },
  
  // Hygiène de vie & Sunnah Quotidienne
  { title: 'Siwak', category: 'deen', icon: '🦷', description: "Utiliser le Siwak avant chaque prière.", xp: 10 },
  { title: 'Ablutions avant dormir', category: 'deen', icon: '🚿', description: "Dormir en état de pureté.", xp: 15 },
  { title: 'Dormir côté droit', category: 'health', icon: '💤', description: "Sounnah du sommeil.", xp: 5 },
  { title: 'Manger main droite', category: 'deen', icon: '🥣', description: "Manger avec la main droite.", xp: 5 },
  { title: 'Boire assis (3 gorgées)', category: 'health', icon: '🥤', description: "Ne pas boire debout, respirer hors du récipient.", xp: 5 },
  { title: 'Ne pas souffler (repas)', category: 'health', icon: '🌬️', description: "Attendre que ça refroidisse.", xp: 5 },
  { title: 'Couper les ongles', category: 'health', icon: '✂️', description: "Hygiène naturelle (Fitra) hebdomadaire.", xp: 10 },
  { title: 'Se parfumer (Hommes)', category: 'general', icon: '🌺', description: "Sentir bon est une Sunnah aimée.", xp: 5 },
  { title: 'Ghusl du Vendredi', category: 'deen', icon: '🚿', description: "Grandes ablutions pour Jumu'a.", xp: 20 },
  
  // Entrées / Sorties & Etiquette (Adab)
  { title: 'Entrer toilettes (PG)', category: 'deen', icon: '🦶', description: "Pied gauche + 'Bismillah, Allahoumma...'", xp: 5 },
  { title: 'Sortir toilettes (PD)', category: 'deen', icon: '🦶', description: "Pied droit + 'Ghufrânaka'.", xp: 5 },
  { title: 'Entrer maison (Bismillah)', category: 'deen', icon: '🏠', description: "Dire Bismillah en entrant.", xp: 5 },
  { title: 'Sortir maison (Doua)', category: 'deen', icon: '🚪', description: "'Bismillahi tawakkaltu...'", xp: 5 },
  { title: 'Chaussures (PD/PG)', category: 'deen', icon: '👟', description: "Mettre pied droit, retirer pied gauche.", xp: 5 },
  
  // Protection & Sommeil
  { title: 'Ayat al-Kursi (Soir)', category: 'deen', icon: '🛡️', description: "Protection avant de dormir.", xp: 10 },
  { title: '3 Quls + Souffler', category: 'deen', icon: '🤲', description: "Ikhlass, Falaq, Nas dans les mains.", xp: 10 },
  { title: 'Doua du coucher', category: 'deen', icon: '🛌', description: "'Bismika Allahumma amutu wa ahya'.", xp: 5 },

  // Comportement & Social
  { title: 'Sourire (Sadaqa)', category: 'general', icon: '😊', description: "Sourire est une aumône.", xp: 5 },
  { title: 'Passer le Salam', category: 'general', icon: '🤝', description: "Même aux inconnus.", xp: 10 },
  { title: 'Visiter un malade', category: 'general', icon: '🏥', description: "Un devoir du musulman envers son frère.", xp: 40 },
  { title: 'Pardonner', category: 'general', icon: '❤️', description: "Pardonner à quelqu'un qui nous a blessé.", xp: 20 },
  { title: 'Ne pas mentir', category: 'general', icon: '🙊', description: "Dire la vérité même si c'est dur.", xp: 20 },
  { title: 'Aider par une parole', category: 'general', icon: '🗣️', description: "Réconforter ou guider quelqu'un.", xp: 5 },
  { title: 'Faire un cadeau', category: 'general', icon: '🎁', description: "Tahadaw tahabbaw (Offrez des cadeaux, vous vous aimerez).", xp: 10 },
  { title: 'Soutenir un opprimé', category: 'general', icon: '✊', description: "Aider physiquement ou moralement.", xp: 15 },
];

// getDay() : 0 = Dim, 1 = Lun…
const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam','Dim'];

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
    onUpdateXP(isCompleted ? -xpValue : xpValue);

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
      icon: CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || (suggestion?.icon ?? '✨'),
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
                    className={`font-semibold text-lg transition-all truncate flex items-center gap-2 ${
                      isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'
                    }`}
                  >
                    <span>{habit.icon}</span> {habit.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${CATEGORY_COLORS[habit.category]}`}
                    >
                      {habit.category === 'deen'
                        ? 'Deen'
                        : habit.category === 'health'
                        ? 'Santé'
                        : habit.category === 'productivity'
                        ? 'Prod.'
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
          className="bg-white p-6 rounded-2xl shadow-lg border border-emerald-100 relative"
        >
          <button
            type="button"
            onClick={() => setShowSuggestions(true)}
            className="absolute top-6 right-6 text-sm text-emerald-600 font-medium flex items-center gap-1 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100"
          >
            <Sparkles className="w-4 h-4" /> Suggestions
          </button>

          <h3 className="text-lg font-bold text-slate-800 mb-4">Nouvelle Habitude</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Titre</label>
              <input
                type="text"
                value={newHabitTitle}
                onChange={(e) => setNewHabitTitle(e.target.value)}
                placeholder="Ex: Lire Sourate Al-Kahf"
                className="w-full p-3 border border-slate-200 bg-white text-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Catégorie</label>
              <div className="flex gap-2 flex-wrap">
                {(['deen', 'health', 'productivity', 'general'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setNewHabitCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      newHabitCategory === cat
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {CATEGORY_ICONS[cat]}{' '}
                    {cat === 'deen'
                      ? 'Religion'
                      : cat === 'health'
                      ? 'Santé'
                      : cat === 'productivity'
                      ? 'Prod.'
                      : 'Autre'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Points d&apos;XP (Récompense)
              </label>
              <div className="relative">
                <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={newHabitXP}
                  onChange={(e) => setNewHabitXP(parseInt(e.target.value) || 0)}
                  className="w-full pl-10 p-3 border border-slate-200 bg-white text-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Fréquence</label>
              <div className="flex justify-between gap-1">
                {DAYS.map((day, index) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(index)}
                    className={`w-10 h-10 rounded-full text-xs font-bold transition-all ${
                      frequency.includes(index)
                        ? 'bg-emerald-600 text-white shadow-md scale-105'
                        : frequency.length === 0
                        ? 'bg-slate-100 text-slate-400'
                        : 'bg-slate-50 text-slate-400'
                    }`}
                  >
                    {day.charAt(0)}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Si aucun jour n&apos;est sélectionné, l&apos;habitude sera quotidienne.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
              >
                Sauvegarder
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-6 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200"
              >
                Annuler
              </button>
            </div>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-medium hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center justify-center gap-2 group"
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
            <Plus className="w-5 h-5" />
          </div>
          Ajouter une habitude
        </button>
      )}

      {showSuggestions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-emerald-50/50 rounded-t-2xl">
              <h3 className="font-bold text-lg text-emerald-900 flex items-center gap-2">
                <ScrollText className="w-5 h-5 text-emerald-600" />
                Bibliothèque d&apos;habitudes
              </h3>
              <button
                onClick={() => setShowSuggestions(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="overflow-y-auto p-4 space-y-3">
              {SUNNAH_HABITS.map((habit, idx) => (
                <button
                  key={idx}
                  onClick={() => addHabit(undefined, habit)}
                  className="w-full flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all text-left group"
                >
                  <span className="text-2xl bg-white p-2 rounded-lg shadow-sm flex-shrink-0">{habit.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                       <span className="font-bold text-slate-800 block group-hover:text-emerald-800 truncate pr-2">
                        {habit.title}
                       </span>
                       <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded flex-shrink-0">
                        +{habit.xp} XP
                       </span>
                    </div>
                    <span className="text-xs text-slate-500 line-clamp-2 leading-snug">{habit.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitTracker;
