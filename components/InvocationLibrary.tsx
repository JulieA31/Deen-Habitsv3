
import React, { useState } from 'react';
import { BookOpen, Copy, Shield, Moon, Sun, Heart, ChevronDown, ChevronUp, Compass, RefreshCw, Cloud, Sparkles } from 'lucide-react';
import { Invocation } from '../types';

const INVOCATIONS_DATA: Invocation[] = [
  // --- CORAN ---
  {
    id: 'quran_mercy',
    category: 'Coran',
    title: 'Coran : Guide et Lumière',
    arabic: 'اللَّهُمَّ ارْحَمْنِي بِالْقُرْآنِ، وَاجْعَلْهُ لِي إِمَامًا وَنُورًا وَهُدًى وَرَحْمَةً',
    phonetic: 'Allāhumma rḥamnī bil-Qurʾān, wajʿalhu lī imāman wa nūran wa hudan wa raḥmah',
    translation: 'Ô Allah, accorde-moi Ta miséricorde par le Coran. Fais-en pour moi un guide, une lumière, une direction et une miséricorde.'
  },
  {
    id: 'quran_memo',
    category: 'Coran',
    title: 'Mémoriser et comprendre le Coran',
    arabic: 'اللَّهُمَّ ذَكِّرْنِي مِنْهُ مَا نُسِّيتُ، وَعَلِّمْنِي مِنْهُ مَا جَهِلْتُ، وَارْزُقْنِي تِلَاوَتَهُ آنَاءَ اللَّيْلِ وَأَطْرَافَ النَّهَارِ، وَاجْعَلْهُ لِي حُجَّةً يَا رَبَّ الْعَالَمِينَ',
    phonetic: 'Allāhumma dhakkirnī minhu mā nussītu, wa ʿallimnī minhu mā jahilt, warzuqnī tilāwatahu ānāʾa l-layli wa aṭrāfa n-nahār, wajʿalhu lī ḥujjah yā Rabba l-ʿālamīn',
    translation: 'Ô Allah, rappelle-moi du Coran ce que j’ai oublié, enseigne-moi ce que j’ignore, accorde-moi sa récitation au cœur de la nuit et aux extrémités du jour, et fais qu’il soit un argument en ma faveur, ô Seigneur des mondes.'
  },

  // --- SPIRITUALITÉ ---
  {
    id: 'global_repair',
    category: 'Spiritualité',
    title: 'Réparation de la religion et de la vie',
    arabic: 'اللَّهُمَّ أَصْلِحْ لِي دِينِيَ الَّذِي هُوَ عِصْمَةُ أَمْرِي، وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي، وَأَصْلِحْ لِي آخِرَتِيَ الَّتِي إِلَيْهَا مَعَادِي، وَاجْعَلِ الْحَيَاةَ زِيَادَةً لِي فِي كُلِّ خَيْرٍ، وَاجْعَلِ الْمَوْتَ رَاحَةً لِي مِنْ كُلِّ شَرٍّ',
    phonetic: 'Allāhumma aṣliḥ lī dīnī alladhī huwa ʿiṣmatu amrī, wa aṣliḥ lī dunyāya allatī fīhā maʿāshī, wa aṣliḥ lī ākhiratī allatī ilayhā maʿādī, wajʿali l-ḥayāta ziyādatan lī fī kulli khayr, wajʿali l-mawta rāḥatan lī min kulli sharr',
    translation: 'Ô Allah, améliore ma religion qui est la sauvegarde de mon sort, améliore ma vie d’ici-bas qui est ma subsistance, améliore mon au-delà vers lequel est mon retour. Fais de la vie une augmentation en tout bien et de la mort un repos contre tout mal.'
  },
  {
    id: 'good_end',
    category: 'Spiritualité',
    title: 'Pour une bonne fin de vie',
    arabic: 'اللَّهُمَّ اجْعَلْ خَيْرَ عُمُرِي آخِرَهُ، وَخَيْرَ عَمَلِي خَوَاتِيمَهُ، وَخَيْرَ أَيَّامِي يَوْمَ أَلْقَاكَ',
    phonetic: 'Allāhumma ijʿal khayra ʿumurī ākhirah, wa khayra ʿamalī khawātīmah, wa khayra ayyāmī yawma alqāk',
    translation: 'Ô Allah, fais que la meilleure partie de ma vie soit la dernière, que mes meilleures œuvres soient les ultimes, et que le meilleur jour de ma vie soit celui de Ta rencontre.'
  },
  {
    id: 'peaceful_life',
    category: 'Spiritualité',
    title: 'Vie paisible et fin honorable',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِيشَةً نَقِيَّةً، وَمِيتَةً سَوِيَّةً، وَمَرَدًّا غَيْرَ مُخْزٍ وَلَا فَاضِحٍ',
    phonetic: 'Allāhumma innī asʾaluka ʿīshatan naqiyyah, wa mītatan sawiyyah, wa maraddan ghayra mukhzin wa lā fāḍiḥ',
    translation: 'Ô Allah, je Te demande une vie paisible, une mort digne et un retour sans humiliation ni déshonneur.'
  },
  {
    id: 'best_request',
    category: 'Spiritualité',
    title: 'Invocation globale d’excellence',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ أَفْضَلَ الْمَسَائِلِ، وَأَفْضَلَ الدُّعَاءِ، وَأَفْضَلَ النَّجَاحِ، وَأَفْضَلَ الْعِلْمِ، وَأَفْضَلَ الْعَمَلِ، وَأَفْضَلَ الثَّوَابِ، وَأَفْضَلَ الْحَيَاةِ، وَأَفْضَلَ الْمَمَاتِ، وَثَبِّتْنِي، وَثَقِّلْ مَوَازِينِي، وَأَكْمِلْ إِيمَانِي، وَارْفَعْ دَرَجَاتِي، وَتَقَبَّلْ صَلَاتِي، وَاغْفِرْ خَطِيئَاتِي، وَأَسْأَلُكَ الدَّرَجَاتِ الْعُلَى مِنَ الْجَنَّةِ',
    phonetic: 'Allāhumma innī asʾaluka afḍala l-masāʾil, wa afḍala d-duʿāʾ, wa afḍala n-najāḥ, wa afḍala l-ʿilm, wa afḍala l-ʿamal, wa afḍala th-thawāb, wa afḍala l-ḥayāh, wa afḍala l-mamāt, wa thabbitnī, wa thaqqil mawāzīnī, wa akmil īmānī, warfaʿ darajātī, wa taqabbal ṣalātī, waghfir khaṭīʾātī, wa asʾaluka d-darajāti l-ʿulā mina l-jannah',
    translation: 'Ô Allah, je Te demande la meilleure requête, la meilleure invocation, la meilleure réussite, la meilleure science, la meilleure action, la plus belle récompense, la meilleure vie et la meilleure mort. Affermis-moi, alourdis mes balances, complète ma foi, élève mes degrés, accepte ma prière, pardonne mes fautes et accorde-moi les plus hauts degrés du Paradis.'
  },

  // --- DIFFICULTÉ & APAISEMENT ---
  {
    id: 'happy_issue',
    category: 'Difficulté & Apaisement',
    title: 'Pour une issue heureuse',
    arabic: 'اللَّهُمَّ اجْعَلْ لِي فِي كُلِّ أَمْرٍ فَرَجًا وَمَخْرَجًا، وَقِنِي ذُلَّ الدُّنْيَا وَعَذَابَ الْآخِرَةِ',
    phonetic: 'Allāhumma ijʿal lī fī kulli amrin farajan wa makhrajan, wa qinī dhulla d-dunyā wa ʿadhāba l-ākhirah',
    translation: 'Ô Allah, accorde-moi une issue dans toute affaire et préserve-moi de l’avilissement de ce bas monde et du châtiment de l’au-delà.'
  },
  {
    id: 'global_relief',
    category: 'Difficulté & Apaisement',
    title: 'Soulagement global des besoins',
    arabic: 'اللَّهُمَّ لَا تَدَعْ لِي ذَنْبًا إِلَّا غَفَرْتَهُ، وَلَا هَمًّا إِلَّا فَرَّجْتَهُ، وَلَا دَيْنًا إِلَّا قَضَيْتَهُ، وَلَا حَاجَةً مِنْ حَوَائِجِ الدُّنْيَا وَالْآخِرَةِ إِلَّا قَضَيْتَهَا، يَا أَرْحَمَ الرَّاحِمِينَ',
    phonetic: 'Allāhumma lā tadaʿ lī dhanban illā ghafartah, wa lā hamman illā farrajtah, wa lā daynan illā qaḍaytah, wa lā ḥājatan min ḥawāʾiji d-dunyā wa l-ākhirah illā qaḍaytahā, yā Arḥama r-rāḥimīn',
    translation: 'Ô Allah, ne laisse aucun péché sans le pardonner, aucun souci sans l’alléger, aucune dette sans l’acquitter, ni aucun besoin de ce monde ou de l’au-delà sans l’exaucer. Ô le Plus Miséricordieux des miséricordieux'
  },

  // --- PRIÈRE (EXISTANTES) ---
  {
    id: 'doua_ouverture',
    category: 'Prière',
    title: 'Ouverture : Éloignement des péchés',
    arabic: 'اللَّهُمَّ بَاعِدْ بَيْنِي وَبَيْنَ خَطَايَايَ كَمَا بَاعَدْتَ بَيْنَ الْمَشْرِقِ وَالْمَغْرِبِ، اللَّهُمَّ نَقِّنِي مِنْ خَطَايَايَ كَمَا يُنَقَّى الثَّوْبُ الْأَبْيَضُ مِنَ الدَّنَسِ، اللَّهُمَّ اغْسِلْنِي مِنْ خَطَايَايَ بِالثَّلْجِ وَالْمَاءِ وَالْبَرَدِ',
    phonetic: 'Allāhumma bāʾid baynī wa bayna khaṭāyāya kamā bāʾadta bayna l-machriqi wa l-maghrib, Allāhumma naqqinī min khaṭāyāya kamā yunaqqa th-thawbu l-abyaḍū mina d-danas, Allāhumma ghsilnī min khaṭāyāya bi th-thalji wa l-mā`i wa l-barad',
    translation: 'Ô Allah, éloigne-moi de mes fautes comme Tu as éloigné l’Orient de l’Occident. Ô Allah, purifie-moi de mes fautes comme on purifie le vêtement blanc des souillures. Ô Allah, lave-moi de mes fautes avec de la neige, de l’eau et de la grêle.'
  },

  // --- QUOTIDIEN ---
  {
    id: 'meal_before',
    category: 'Quotidien',
    title: 'Avant le repas',
    arabic: 'بِسْمِ اللهِ',
    phonetic: 'Bismillah',
    translation: 'Au nom d\'Allah.'
  }
];

const InvocationLibrary: React.FC = () => {
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const getCategoryIcon = (cat: string) => {
    switch(cat) {
      case 'Coran': return <BookOpen className="w-4 h-4" />;
      case 'Protection': return <Shield className="w-4 h-4" />;
      case 'Quotidien': return <Sun className="w-4 h-4" />;
      case 'Spiritualité': return <Sparkles className="w-4 h-4" />;
      case 'Prière': return <Heart className="w-4 h-4" />;
      case 'Difficulté & Apaisement': return <Cloud className="w-4 h-4" />;
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
              <span className="text-[10px] ml-2 text-slate-400 font-normal bg-white px-2 py-0.5 rounded-full border">
                {grouped[category].length}
              </span>
            </div>
            {openCategories.includes(category) ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          
          {openCategories.includes(category) && (
            <div className="divide-y divide-slate-50">
              {grouped[category].map(inv => (
                <div key={inv.id} className="p-5 hover:bg-slate-50/30 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-slate-800">{inv.title}</h3>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(`${inv.title}\n\n${inv.arabic}\n\n${inv.translation}`);
                        alert("Invocation copiée !");
                      }}
                      className="text-slate-300 hover:text-emerald-600 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="bg-emerald-50/30 p-4 rounded-xl mb-3 border border-emerald-50">
                    <p className="text-right text-xl md:text-2xl font-arabic leading-loose text-emerald-900" dir="rtl">{inv.arabic}</p>
                  </div>
                  <p className="text-xs text-slate-500 italic mb-1 font-medium">{inv.phonetic}</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{inv.translation}</p>
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
