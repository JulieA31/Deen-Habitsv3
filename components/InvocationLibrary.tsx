
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
  {
    id: 'sujud_pardon',
    category: 'Prière',
    title: 'Sujud : Demande de pardon global',
    arabic: 'اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ، دِقَّهُ وَجِلَّهُ، وَأَوَّلَهُ وَآخِرَهُ، وَعَلَانِيَتَهُ وَسِرَّهُ',
    phonetic: 'Allāhumma ghfir lī dhanbī kullahu diqqah, wa jillah, wa awwalahu wa akhirah, wa ʾalāniyatahu wa sirrah',
    translation: 'Ô Allah ! Pardonne-moi tous mes péchés, les plus insignifiants comme les plus graves, les premiers comme les derniers, ceux qui sont publics comme ceux qui sont privés.'
  },
  {
    id: 'tashahhud_aide',
    category: 'Prière',
    title: 'Tashahhud : Aide pour l\'adoration',
    arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ، وَشُكْرِكَ، وَحُسْنِ عِبَادَتِكَ',
    phonetic: 'Allāhumma a’innī ‘alā dhikrik, wa chukrik, wa ḥusni ʾibādatik',
    translation: 'Ô Allah, aide-moi à T’évoquer, à T’être reconnaissant et à T’adorer convenablement.'
  },
  {
    id: 'istikhara',
    category: 'Prière',
    title: 'Prière de Consultation (Istikhara)',
    arabic: 'اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلاَ أَقْدِرُ وَتَعْلَمُ وَلاَ أَعْلَمُ وَأَنْتَ عَلاَّمُ الْغُيُوبِ...',
    phonetic: 'Allahumma inni astakhiruka bi\'ilmika wa astaqdiruka biqudratika...',
    translation: 'Seigneur Allah, je Te demande de me guider par Ton savoir et je cherche la capacité par Ton pouvoir...'
  },
  {
    id: '2',
    category: 'Prière',
    title: 'Dhikr après la prière',
    arabic: 'أَسْتَغْفِرُ اللَّهَ (3x) اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
    phonetic: 'Astaghfirullah (3x). Allahumma antas-salam wa minkas-salam, tabarakta ya dhal-jalali wal-ikram',
    translation: 'Je demande pardon à Allah (3 fois). Ô Allah, Tu es la Paix et la paix vient de Toi. Béni sois-Tu, Ô Possesseur de la Majesté et de la Noblesse.'
  },

  // --- PARDON & REPENTIR (NOUVEAU) ---
  {
    id: 'sayyid_istighfar',
    category: 'Pardon & Repentir',
    title: 'La maîtresse demande de pardon',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    phonetic: 'Allāhumma anta rabbī lā ilāha illā ant, khalaqtanī wa anā ʾabduk, wa anā ʾalā ʾahdika wa wa’dika ma staṭa’t, a’ūdhu bika min charri mā ṣana’t, abūu laka bi-niʾmatika ʾalayy, wa abūu laka bi-dhanbī fa-ghfir lī, fa innahu lā yaghfiru dh-dhunūba illā ant',
    translation: 'Ô Allah, Tu es mon Seigneur, nul divinité autre que Toi. Tu m’as créé et je suis Ton serviteur. Je suis fidèle à Ton engagement et à Ta promesse tant que je le pourrai... Pardonne-moi donc, car personne d’autre que Toi ne pardonne les péchés.'
  },
  {
    id: 'yunus',
    category: 'Pardon & Repentir',
    title: 'Invocation de Yunus (Jonas)',
    arabic: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    phonetic: 'Lā ilāha illā anta subḥānaka innī kuntu mina ẓ-ẓālimīn',
    translation: 'Pas de divinité à part Toi ! Pureté à Toi ! J’ai été vraiment du nombre des injustes.'
  },

  // --- PROTECTION ---
  {
    id: 'protection_epreuves',
    category: 'Protection',
    title: 'Contre les épreuves et ennemis',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ جَهْدِ الْبَلَاءِ، وَدَرَكِ الشَّقَاءِ، وَسُوءِ الْقَضَاءِ، وَشَمَاتَةِ الْأَعْدَاءِ',
    phonetic: 'Allāhumma innī a’ūdhu bika min jahdi l-balā, wa daraki ch-chaqā, wa sūi l-qaḍā, wa chamātati l-aʾdā`',
    translation: 'Ô Allah, je cherche refuge auprès de Toi contre l’accablement de l’épreuve, contre le fait de devenir malheureux, contre le mauvais décret et contre la réjouissance des ennemis.'
  },
  {
    id: 'protection_paresse',
    category: 'Protection',
    title: 'Contre la paresse et l\'avarice',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْعَجْزِ، وَالْكَسَلِ، وَالْجُبْنِ، وَالْبُخْلِ، وَالْهَرَمِ، وَعَذَابِ الْقَبْرِ',
    phonetic: 'Allāhumma innī a’ūdhu bika mina l-ʾajz, wa l-kasal, wa l-jubn, wa l-bukhl, wa l-haram, wa ʾadhābi l-qabr',
    translation: 'Ô Allah, je cherche refuge auprès de Toi contre l’impuissance, la paresse, la lâcheté, l’avarice, la vieillesse et le supplice de la tombe.'
  },
  {
    id: 'kursi',
    category: 'Protection',
    title: 'Ayat al-Kursi (Verset du Trône)',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ...',
    phonetic: 'Allahu la ilaha illa Huwa, Al-Haiyul-Qaiyum...',
    translation: 'Allah ! Point de divinité à part Lui, le Vivant, Celui qui subsiste par Lui-même...'
  },
  {
    id: '1',
    category: 'Protection',
    title: 'Protection totale (Matin/Soir)',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    phonetic: 'Bismillahil-ladhi la yadurru ma\'as-mihi shai\'un fil-ardi wa la fis-sama\'i, wa Huwas-Sami\'ul-\'Alim',
    translation: 'Au nom d\'Allah, tel qu\'en compagnie de Son Nom, rien sur Terre ni au ciel ne peut nuire, et Il est Celui qui entend tout et sait tout.'
  },

  // --- DIFFICULTÉ & APAISEMENT ---
  {
    id: 'dette_tristesse',
    category: 'Difficulté & Apaisement',
    title: 'Contre la tristesse et les dettes',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ، وَغَلَبَةِ الرِّجَالِ',
    phonetic: 'Allāhumma innī a’ūdhu bika mina l-hammi wa l-ḥazan, wa l-ʾajzi wa l-kasal, wa l-bukhl, wa l-jubn, wa ḍala’i d-dayn, wa ghalabati r-rijāl',
    translation: 'Ô Allah, je me réfugie auprès de Toi contre l’affliction, la tristesse, l’impuissance, la paresse, l’avarice, la lâcheté, le poids de la dette et la domination des hommes.'
  },
  {
    id: 'afflige_vivant',
    category: 'Difficulté & Apaisement',
    title: 'Invocation de l\'affligé (Ya Hayyu)',
    arabic: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ',
    phonetic: 'Yā ḥayyu yā qayyūmu bi-raḥmatika astaghīth, aṣliḥ lī cha`nī kullah, wa lā takilnī ilā nafsī ṭarfata ʾayn',
    translation: 'Ô Toi le Vivant et Celui qui subsiste par lui-même, c’est par Ta miséricorde que j’implore le secours. Améliore donc en bien tout ce qui me concerne et ne me délaisse pas à moi-même, ne serait-ce que la durée d’un clignement d’œil.'
  },
  {
    id: 'oppressed',
    category: 'Difficulté & Apaisement',
    title: 'Invocation de l\'opprimé',
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    phonetic: 'Hasbunallahu wa ni\'mal wakil',
    translation: 'Allah nous suffit, Il est notre meilleur garant.'
  },
  {
    id: '4',
    category: 'Difficulté & Apaisement',
    title: 'Pour faciliter les choses',
    arabic: 'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا',
    phonetic: 'Allahumma la sahla illa ma ja\'altahu sahlan, wa anta taj\'alul-hazna idha shi\'ta sahlan',
    translation: 'Ô Allah, il n\'y a de facile que ce que Tu rends facile, et si Tu le veux, Tu peux rendre la tristesse (ou la difficulté) facile.'
  },

  // --- QUOTIDIEN & SPIRITUALITÉ ---
  {
    id: 'coeur_ferme',
    category: 'Quotidien & Spiritualité',
    title: 'Pour la fermeté du cœur',
    arabic: 'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ',
    phonetic: 'Yā muqalliba l-qulūbi thabbit qalbī ʾalā dīnik',
    translation: 'Ô Toi qui fais osciller les cœurs ! Affermis mon cœur dans Ta religion.'
  },
  {
    id: 'dunya_akhira',
    category: 'Quotidien & Spiritualité',
    title: 'Invocation complète (Dunya & Akhira)',
    arabic: 'اللَّهُمَّ رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً، وَفِي الْآخِرَةِ حَسَنَةً، وَقِنَا عَذَابَ النَّارِ',
    phonetic: 'Allāhumma rabbanā ātinā fi d-dunyā ḥasanah, wa fi l-ākhirati ḥasanah, wa qinā ʾadhāba n-nār',
    translation: 'Ô Allah notre Seigneur ! Accorde-nous une belle part dans ce bas monde et une belle part dans l’au-delà, et préserve-nous du châtiment du Feu.'
  },
  {
    id: 'rizq_halal',
    category: 'Quotidien & Spiritualité',
    title: 'Pour la subsistance licite',
    arabic: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
    phonetic: 'Allāhumma kfinī bi-ḥalālika ʾan ḥarāmik, wa ghninī bi-faḍlika ʾan siwāk',
    translation: 'Ô Allah, fais que je me contente de ce que Tu as déclaré licite pour que je ne m’approche pas de ce que Tu as déclaré illicite et épargne-moi par Ta grâce de recourir à autre que Toi.'
  },
  {
    id: 'meal_before',
    category: 'Quotidien & Spiritualité',
    title: 'Avant de manger',
    arabic: 'بِسْمِ اللهِ',
    phonetic: 'Bismillah',
    translation: 'Au nom d\'Allah. (Si on oublie au début : Bismillahi fi awwalihi wa akhirihi).'
  },
  {
    id: 'meal_after',
    category: 'Quotidien & Spiritualité',
    title: 'Après avoir mangé',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
    phonetic: 'Al-hamdu lillahil-ladhi at\'amana wa saqana wa ja\'alana muslimin',
    translation: 'Louange à Allah qui nous a nourris, nous a abreuvés et a fait de nous des Musulmans.'
  },
  {
    id: 'iftar',
    category: 'Quotidien & Spiritualité',
    title: 'Rupture du jeûne (Iftar)',
    arabic: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ',
    phonetic: 'Dhahaba adh-dhama\'u wabtallatil-\'uruqu wa thabatal-ajru in sha\' Allah',
    translation: 'La soif est partie, les veines sont humidifiées et la récompense est assurée, si Allah le veut.'
  },
  {
    id: '3',
    category: 'Quotidien & Spiritualité',
    title: 'Avant de dormir',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    phonetic: 'Bismika Allahumma amutu wa ahya',
    translation: 'C\'est en Ton nom, ô Allah, que je meurs et que je vis.'
  }
];

const InvocationLibrary: React.FC = () => {
  // Modification : Array vide par défaut pour que toutes les catégories soient fermées
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const getCategoryIcon = (cat: string) => {
    switch(cat) {
      case 'Protection': return <Shield className="w-4 h-4" />;
      case 'Pardon & Repentir': return <RefreshCw className="w-4 h-4" />;
      case 'Difficulté & Apaisement': return <Cloud className="w-4 h-4" />;
      case 'Prière': return <Heart className="w-4 h-4" />;
      case 'Quotidien & Spiritualité': return <Compass className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  // Group invocations by category
  const groupedInvocations = INVOCATIONS_DATA.reduce((acc, inv) => {
    if (!acc[inv.category]) acc[inv.category] = [];
    acc[inv.category].push(inv);
    return acc;
  }, {} as Record<string, Invocation[]>);

  const categories = Object.keys(groupedInvocations);

  return (
    <div className="space-y-4">
      {categories.map((category) => {
        const isOpen = openCategories.includes(category);
        const items = groupedInvocations[category];

        return (
            <div key={category} className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
                <button 
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                        <span className="p-1.5 bg-white rounded-lg text-emerald-600 shadow-sm border border-slate-100">
                            {getCategoryIcon(category)}
                        </span>
                        {category}
                        <span className="text-xs font-normal text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-100">
                            {items.length}
                        </span>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                
                {isOpen && (
                    <div className="divide-y divide-slate-50">
                        {items.map(inv => (
                            <div key={inv.id} className="p-5 hover:bg-slate-50/50 transition-colors">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-bold text-lg text-slate-800">{inv.title}</h3>
                                    <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(`${inv.title}\n\n${inv.arabic}\n\n${inv.translation}`);
                                            alert("Invocation copiée !");
                                        }}
                                        className="text-slate-300 hover:text-emerald-600 transition-colors" 
                                        title="Copier"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                                
                                <div className="bg-emerald-50/30 p-4 rounded-xl mb-3 border border-emerald-50">
                                    <p className="text-right text-xl md:text-2xl font-arabic leading-loose text-emerald-900 font-serif" dir="rtl">
                                        {inv.arabic}
                                    </p>
                                </div>
                                
                                <div className="space-y-2">
                                    <p className="text-sm text-slate-500 italic font-medium leading-relaxed">
                                        {inv.phonetic}
                                    </p>
                                    <p className="text-slate-700 leading-relaxed text-sm">
                                        {inv.translation}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
      })}
    </div>
  );
};

export default InvocationLibrary;
