
import React, { useState } from 'react';
import { BookOpen, Copy, Shield, Moon, Sun, Heart, ChevronDown, ChevronUp, Compass, RefreshCw, Cloud, Sparkles } from 'lucide-react';
import { Invocation } from '../types';

const INVOCATIONS_DATA: Invocation[] = [
  // --- PRIÈRE ---
  {
    id: 'doua_ouverture',
    category: 'Prière',
    title: 'Ouverture : Éloignement des péchés',
    arabic: 'اللَّهُمَّ بَاعِدْ بَيْنِي وَبَيْنَ خَطَايَايَ كَمَا بَاعَدْتَ بَيْنَ الْمَشْرِقِ وَالْمَغْرِبِ، اللَّهُمَّ نَقِّنِي مِنْ خَطَايَايَ كَمَا يُنَقَّى الثَّوْبُ الْأَبْيَضُ مِنَ الدَّنَسِ، اللَّهُمَّ اغْسِلْنِي مِنْ خَطَايَايَ بِالثَّلْجِ وَالْمَاءِ وَالْبَرَدِ',
    phonetic: 'Allāhumma bāʾid baynī wa bayna khaṭāyāya kamā bāʾadta bayna l-machriqi wa l-maghrib, Allāhumma naqqinī min khaṭāyāya kamā yunaqqa th-thawbu l-abyaḍū mina d-danas, Allāhumma ghsilnī min khaṭāyāya bi th-thalji wa l-mā`i wa l-barad',
    translation: 'Ô Allah, éloigne-moi de mes fautes comme Tu as éloigné l’Orient de l’Occident. Ô Allah, purifie-moi de mes fautes comme on purifie le vêtement blanc des souillures. Ô Allah, lave-moi de mes fautes avec de la neige, de l’eau et de la grêle.'
  },
  // --- PARDON & REPENTIR ---
  {
    id: 'sayyid_istighfar',
    category: 'Pardon & Repentir',
    title: 'Maître de la demande de pardon',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أنتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    phonetic: 'Allāhumma anta rabbī lā ilāha illā ant, khalaqtanī wa anā ʾabduk, wa anā ʾalā ʾahdika wa wa’dika ma staṭa’t, a’ūdhu bika min charri mā ṣana’t, abūu laka bi-niʾmatika ʾalayy, wa abūu laka bi-dhanbī fa-ghfir lī, fa innahu lā yaghfiru dh-dhunūba illā ant',
    translation: 'Ô Allah, Tu es mon Seigneur, nul divinité autre que Toi. Tu m’as créé et je suis Ton serviteur. Je suis fidèle à Ton engagement et à Ta promesse tant que je le pourrai... Pardonne-moi donc, car personne d’autre que Toi ne pardonne les péchés.'
  },
  // --- PROTECTION ---
  {
    id: 'kursi',
    category: 'Protection',
    title: 'Ayat al-Kursi',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...',
    phonetic: 'Allāhu lā ilāha illā hu...',
    translation: 'Le verset du Trône...'
  },
  // --- QUOTIDIEN ---
  {
    id: 'meal_before',
    category: 'Quotidien',
    title: 'Avant le repas',
    arabic: 'بِسْمِ اللهِ',
    phonetic: 'Bismillah',
    translation: 'Au nom d\'Allah.'
  },
  {
    id: 'sleep_before',
    category: 'Quotidien',
    title: 'Avant de dormir',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    phonetic: 'Bismika Allahumma amutu wa ahya',
    translation: 'C\'est en Ton nom, ô Allah, que je meurs et que je vis.'
  },
  // --- SPIRITUALITÉ ---
  {
    id: 'coeur_ferme',
    category: 'Spiritualité',
    title: 'Fermeté du cœur',
    arabic: 'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ',
    phonetic: 'Yā muqalliba l-qulūbi thabbit qalbī ʾalā dīnik',
    translation: 'Ô Toi qui fais osciller les cœurs ! Affermis mon cœur dans Ta religion.'
  }
];

const InvocationLibrary: React.FC = () => {
  const [openCategories, setOpenCategories] = useState<string[]>(['Quotidien', 'Spiritualité']);

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const getCategoryIcon = (cat: string) => {
    switch(cat) {
      case 'Protection': return <Shield className="w-4 h-4" />;
      case 'Quotidien': return <Sun className="w-4 h-4" />;
      case 'Spiritualité': return <Sparkles className="w-4 h-4" />;
      case 'Prière': return <Heart className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const grouped = INVOCATIONS_DATA.reduce((acc, inv) => {
    if (!acc[inv.category]) acc[inv.category] = [];
    acc[inv.category].push(inv);
    return acc;
  }, {} as Record<string, Invocation[]>);

  return (
    <div className="space-y-4">
      {Object.keys(grouped).map((category) => (
        <div key={category} className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
          <button onClick={() => toggleCategory(category)} className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <span className="p-1.5 bg-white rounded-lg text-emerald-600 shadow-sm border border-slate-100">
                {getCategoryIcon(category)}
              </span>
              {category}
            </div>
            {openCategories.includes(category) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {openCategories.includes(category) && (
            <div className="divide-y divide-slate-50">
              {grouped[category].map(inv => (
                <div key={inv.id} className="p-5">
                  <h3 className="font-bold text-slate-800 mb-2">{inv.title}</h3>
                  <p className="text-right text-xl font-arabic leading-loose text-emerald-900 mb-3" dir="rtl">{inv.arabic}</p>
                  <p className="text-xs text-slate-500 italic mb-1">{inv.phonetic}</p>
                  <p className="text-sm text-slate-700">{inv.translation}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default InvocationLibrary;
