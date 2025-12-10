import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, ChevronRight, Fingerprint } from 'lucide-react';

interface TasbihFormula {
  id: string;
  arabic: string;
  phonetic: string;
  translation: string;
  target: number;
}

const TASBIH_FORMULAS: TasbihFormula[] = [
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ الله',
    phonetic: 'SubhanAllah',
    translation: 'Gloire à Allah',
    target: 33
  },
  {
    id: 'alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّه',
    phonetic: 'Alhamdulillah',
    translation: 'Louange à Allah',
    target: 33
  },
  {
    id: 'allahuakbar',
    arabic: 'اللَّهُ أَكْبَر',
    phonetic: 'Allahu Akbar',
    translation: 'Allah est le plus Grand',
    target: 33
  },
  {
    id: 'tahlil',
    arabic: 'لَا إِلَهَ إِلَّا الله',
    phonetic: 'La ilaha illallah',
    translation: 'Il n\'y a de dieu qu\'Allah',
    target: 100
  },
  {
    id: 'istighfar',
    arabic: 'أَسْتَغْفِرُ اللَّه',
    phonetic: 'Astaghfirullah',
    translation: 'Je demande pardon à Allah',
    target: 100
  },
  {
    id: 'salat',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّد',
    phonetic: 'Allahumma salli \'ala Muhammad',
    translation: 'Prières sur le Prophète',
    target: 10
  }
];

const TasbihCounter: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(TASBIH_FORMULAS[0].id);
  const [count, setCount] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);

  const selectedFormula = TASBIH_FORMULAS.find(f => f.id === selectedId) || TASBIH_FORMULAS[0];
  const progress = Math.min((count / selectedFormula.target) * 100, 100);
  const isComplete = count >= selectedFormula.target;

  // Haptic feedback function
  const vibrate = () => {
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }
  };

  const handleIncrement = () => {
    if (isComplete) return;
    
    setCount(prev => prev + 1);
    setSessionTotal(prev => prev + 1);
    vibrate();

    if (count + 1 === selectedFormula.target) {
      // Vibrate longer on completion
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
    }
  };

  const handleReset = () => {
    if (window.confirm("Réinitialiser le compteur ?")) {
      setCount(0);
    }
  };

  return (
    <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
                <div 
                    className="h-full bg-emerald-500 transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            <div className="mb-6">
                <p className="text-3xl font-arabic text-emerald-800 mb-2 font-serif">{selectedFormula.arabic}</p>
                <h2 className="text-xl font-bold text-slate-800">{selectedFormula.phonetic}</h2>
                <p className="text-sm text-slate-500">{selectedFormula.translation}</p>
            </div>

            {/* Circular Counter */}
            <div className="flex justify-center mb-8">
                <button 
                    onClick={handleIncrement}
                    disabled={isComplete}
                    className={`
                        w-64 h-64 rounded-full flex flex-col items-center justify-center 
                        transition-all duration-100 active:scale-95 shadow-2xl relative
                        ${isComplete ? 'bg-emerald-50 border-4 border-emerald-500' : 'bg-gradient-to-br from-emerald-500 to-teal-600 border-4 border-emerald-100'}
                    `}
                >
                    {/* Ring Progress SVG */}
                    <svg className="absolute top-0 left-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                        <circle 
                            cx="50" cy="50" r="46" 
                            fill="none" 
                            stroke="rgba(255,255,255,0.2)" 
                            strokeWidth="2" 
                        />
                        <circle 
                            cx="50" cy="50" r="46" 
                            fill="none" 
                            stroke={isComplete ? '#10b981' : '#ffffff'} 
                            strokeWidth="3"
                            strokeDasharray="289.02" // 2 * pi * 46
                            strokeDashoffset={289.02 - (289.02 * progress) / 100}
                            className="transition-all duration-300 ease-out"
                        />
                    </svg>

                    {isComplete ? (
                        <>
                            <CheckCircle2 className="w-16 h-16 text-emerald-600 mb-2 animate-bounce" />
                            <span className="text-emerald-800 font-bold">Terminé !</span>
                        </>
                    ) : (
                        <>
                            <span className="text-6xl font-bold text-white font-mono">{count}</span>
                            <span className="text-emerald-100/80 text-sm font-medium mt-1">/ {selectedFormula.target}</span>
                            <Fingerprint className="w-8 h-8 text-white/20 mt-4 animate-pulse" />
                        </>
                    )}
                </button>
            </div>

            <div className="flex justify-center gap-4">
                <button 
                    onClick={handleReset}
                    className="p-3 rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
                    title="Réinitialiser"
                >
                    <RefreshCw className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* List Selection */}
        <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider px-2">Choisir une formule</h3>
            <div className="grid gap-2">
                {TASBIH_FORMULAS.map(formula => (
                    <button
                        key={formula.id}
                        onClick={() => {
                            setSelectedId(formula.id);
                            setCount(0);
                        }}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                            selectedId === formula.id 
                                ? 'bg-white border-emerald-500 ring-1 ring-emerald-500 shadow-md' 
                                : 'bg-white border-slate-100 hover:border-emerald-200 hover:bg-slate-50'
                        }`}
                    >
                        <div>
                            <span className="font-bold text-slate-800 block">{formula.phonetic}</span>
                            <span className="text-xs text-slate-400">Objectif : {formula.target}</span>
                        </div>
                        {selectedId === formula.id && <ChevronRight className="w-5 h-5 text-emerald-600" />}
                    </button>
                ))}
            </div>
        </div>

        {/* Stats footer */}
        <div className="text-center text-xs text-slate-400 mt-8">
            Total session : <span className="font-bold text-slate-600">{sessionTotal}</span> dhikr effectués
        </div>
    </div>
  );
};

export default TasbihCounter;