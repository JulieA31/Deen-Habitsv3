
import React, { useState } from 'react';
import { BookOpen, Copy, Shield, Moon, Sun, Heart, ChevronDown, ChevronUp, Compass, RefreshCw, Cloud, Sparkles, Star } from 'lucide-react';
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
    id: 'istikhara',
    category: 'Prière',
    title: 'Prière de Consultation (Istikhara)',
    arabic: 'اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلاَ أَقْدِرُ وَتَعْلَمُ وَلاَ أَعْلَمُ وَأنتَ عَلاَّمُ الْغُيُوبِ. اللَّهُمَّ إِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الأَمْرَ خَيْرٌ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاقْدُرْهُ لِي وَيَسِّرْهُ لِي ثُمَّ بَارِكْ لِي فِيهِ',
    phonetic: 'Allāhumma innī astakhīruka bi-ʿilmika wa astaqdiruka bi-qudratika...',
    translation: 'Ô Allah, je Te demande de me guider par Ton savoir et de me donner la force par Ta puissance...'
  },

  // --- PARDON & REPENTIR ---
  {
    id: 'sayyid_istighfar',
    category: 'Pardon & Repentir',
    title: 'Maître de la demande de pardon',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أنتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    phonetic: 'Allāhumma anta rabbī lā ilāha illā ant, khalaqtanī wa anā ʾabduk, wa anā ʾalā ʾahdika wa wa’dika ma staṭa’t, a’ūdhu bika min charri mā ṣana’t, abūu laka bi-niʾmatika ʾalayy, wa abūu laka bi-dhanbī fa-ghfir lī, fa innahu lā yaghfiru dh-dhunūba illā ant',
    translation: 'Ô Allah, Tu es mon Seigneur, nul divinité autre que Toi. Tu m’as créé et je suis Ton serviteur. Je suis fidèle à Ton engagement et à Ta promesse tant que je le pourrai. Je cherche refuge auprès de Toi contre le mal que j’ai fait. Je reconnais Tes bienfaits sur moi et je reconnais mon péché. Pardonne-moi donc, car personne d’autre que Toi ne pardonne les péchés.'
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
    id: 'kursi',
    category: 'Protection',
    title: 'Ayat al-Kursi (Verset du Trône)',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَؤُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    phonetic: 'Allāhu lā ilāha illā hu, al-ḥayyu l-qayyūm...',
    translation: 'Allah ! Point de divinité à part Lui, le Vivant, Celui qui subsiste par lui-même. Ni somnolence ni sommeil ne Le saisissent...'
  },
  {
    id: 'protection_epreuves',
    category: 'Protection',
    title: 'Contre les épreuves et ennemis',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ جَهْدِ الْبَلَاءِ، وَدَرَكِ الشَّقَاءِ، وَسُوءِ الْقَضَاءِ، وَشَمَاتَةِ الْأَعْدَاءِ',
    phonetic: 'Allāhumma innī a’ūdhu bika min jahdi l-balā, wa daraki ch-chaqā, wa sūi l-qaḍā, wa chamātati l-aʾdā`',
    translation: 'Ô Allah, je cherche refuge auprès de Toi contre l’accablement de l’épreuve, contre le fait de devenir malheureux, contre le mauvais décret et contre la réjouissance des ennemis.'
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
    translation: 'Ô Allah, ne laisse aucun péché sans le pardonner, aucun souci sans l’alléger, aucune dette sans l’acquitter, ni aucun besoin de ce monde ou de l’au-delà sans l’exaucer. Ô le Plus Miséricordieux des miséricordieux.'
  },
  {
    id: 'dette_tristesse',
    category: 'Difficulté & Apaisement',
    title: 'Contre la tristesse et les dettes',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ، وَغَلَبَةِ الرِّجَالِ',
    phonetic: 'Allāhumma innī a’ūdhu bika mina l-hammi wa l-ḥazan, wa-l-ʿajzi wa-l-kasal, wa-l-bukhli wa-l-jubn, wa-ḍalaʿi d-dayni wa-ghalaba r-rijāl',
    translation: 'Ô Allah, je me réfugie auprès de Toi contre l’affliction, la tristesse, l’incapacité, la paresse, l’avarice, la lâcheté, le fardeau des dettes et la domination des hommes.'
  },

  // --- QUOTIDIEN ---
  {
    id: 'meal_before',
    category: 'Quotidien',
    title: 'Avant de manger',
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
  {
    id: 'iftar',
    category: 'Quotidien',
    title: 'Rupture du jeûne (Iftar)',
    arabic: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ',
    phonetic: 'Dhahaba adh-dhama\'u wa-btallati l-ʿurūqu wa-thabata l-ajru in shāʾa Allāh',
    translation: 'La soif est partie, les veines sont humidifiées et la récompense est assurée si Allah le veut.'
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
    id: 'best_request',
    category: 'Spiritualité',
    title: 'Invocation globale d’excellence',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ أَفْضَلَ الْمَسَائِلِ، وَأَفْضَلَ الدُّعَاءِ، وَأَفْضَلَ النَّجَاحِ، وَأَفْضَلَ الْعِلْمِ، وَأَفْضَلَ الْعَمَلِ، وَأَفْضَلَ الثَّوَابِ، وَأَفْضَلَ الْحَيَاةِ، وَأَفْضَلَ الْمَمَاتِ، وَثَبِّتْنِي، وَثَقِّلْ مَوَازِينِي، وَأَكْمِلْ إِيمَانِي، وَارْفَعْ دَرَجَاتِي، وَتَقَبَّلْ صَلَاتِي، وَاغْفِرْ خَطِيئَاتِي، وَأَسْأَلُكَ الدَّرَجَاتِ الْعُلَى مِنَ الْجَنَّةِ',
    phonetic: 'Allāhumma innī asʾaluka afḍala l-masāʾil, wa afḍala d-duʿāʾ, wa afḍala n-najāḥ...',
    translation: 'Ô Allah, je Te demande la meilleure requête, la meilleure invocation, la meilleure réussite, la meilleure science, la meilleure action, la plus belle récompense, la meilleure vie et la meilleure mort. Affermis-moi, alourdis mes balances, complète ma foi, élève mes degrés, accepte ma prière, pardonne mes fautes et accorde-moi les plus hauts degrés du Paradis.'
  },
  {
    id: 'coeur_ferme',
    category: 'Spiritualité',
    title: 'Fermeté du cœur',
    arabic: 'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ',
    phonetic: 'Yā muqalliba l-qulūbi thabbit qalbī ʾalā dīnik',
    translation: 'Ô Toi qui fais osciller les cœurs ! Affermis mon cœur dans Ta religion.'
  },
  {
    id: 'rizq_halal',
    category: 'Spiritualité',
    title: 'Pour la subsistance licite',
    arabic: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
    phonetic: 'Allāhumma kfinī bi-ḥalālika ʿan ḥarāmika, wa-aghninī bi-faḍlika ʿamman siwāka',
    translation: 'Ô Allah, fais que je me contente de ce que Tu as déclaré licite pour me dispenser de ce que Tu as déclaré illicite, et par Ta grâce, dispense-moi de tout autre que Toi.'
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
      case 'Prière': return <Heart className="w-4 h-4" />;
      case 'Pardon & Repentir': return <RefreshCw className="w-4 h-4" />;
      case 'Protection': return <Shield className="w-4 h-4" />;
      case 'Difficulté & Apaisement': return <Cloud className="w-4 h-4" />;
      case 'Quotidien': return <Sun className="w-4 h-4" />;
      case 'Spiritualité': return <Sparkles className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const grouped = INVOCATIONS_DATA.reduce((acc, inv) => {
    if (!acc[inv.category]) acc[inv.category] = [];
    acc[inv.category].push(inv);
    return acc;
  }, {} as Record<string, Invocation[]>);

  const categoryOrder = [
    'Coran', 
    'Prière', 
    'Pardon & Repentir', 
    'Protection', 
    'Difficulté & Apaisement', 
    'Quotidien', 
    'Spiritualité'
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden mb-2">
        <div className="absolute right-0 top-0 p-4 opacity-10">
            <BookOpen className="w-24 h-24" />
        </div>
        <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-1">Invocations & Douas</h2>
            <p className="text-emerald-100 text-sm opacity-90 max-w-xs leading-relaxed">
                Retrouve ici les meilleures invocations tirées du Coran et de la Sunna pour chaque moment de ta vie.
            </p>
        </div>
      </div>

      <div className="space-y-3">
        {categoryOrder.filter(cat => grouped[cat]).map((category) => {
            const isOpen = openCategories.includes(category);
            const items = grouped[category];

            return (
            <div key={category} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:border-emerald-100 transition-colors">
                <button 
                onClick={() => toggleCategory(category)} 
                className={`w-full flex items-center justify-between p-4 transition-colors ${isOpen ? 'bg-slate-50' : 'bg-white hover:bg-slate-50'}`}
                >
                <div className="flex items-center gap-3 font-bold text-slate-800">
                    <span className={`p-2 rounded-xl shadow-sm border ${isOpen ? 'bg-white text-emerald-600 border-emerald-50' : 'bg-emerald-50 text-emerald-700 border-transparent'}`}>
                    {getCategoryIcon(category)}
                    </span>
                    <span className="text-base">{category}</span>
                    <span className="text-[10px] ml-2 text-slate-400 font-black bg-white px-2 py-0.5 rounded-full border border-slate-100">
                    {items.length}
                    </span>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-slate-300" /> : <ChevronDown className="w-5 h-5 text-slate-300" />}
                </button>
                
                {isOpen && (
                <div className="divide-y divide-slate-50 animate-in slide-in-from-top-1 duration-200">
                    {items.map(inv => (
                    <div key={inv.id} className="p-5 md:p-6 hover:bg-slate-50/40 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                            {inv.title}
                        </h3>
                        <button 
                            onClick={() => {
                            navigator.clipboard.writeText(`${inv.title}\n\n${inv.arabic}\n\n${inv.translation}`);
                            alert("Invocation copiée avec succès !");
                            }}
                            className="p-2 text-slate-300 hover:text-emerald-600 bg-slate-50 rounded-xl transition-all"
                            title="Copier l'invocation"
                        >
                            <Copy className="w-4 h-4" />
                        </button>
                        </div>
                        
                        <div className="bg-emerald-50/30 p-5 rounded-2xl mb-4 border border-emerald-50/50">
                        <p className="text-right text-2xl md:text-3xl font-arabic leading-relaxed text-emerald-950 font-serif" dir="rtl">
                            {inv.arabic}
                        </p>
                        </div>
                        
                        <div className="space-y-3 bg-white/50 rounded-xl">
                            <div className="flex items-start gap-2">
                                <span className="text-[10px] font-black text-slate-300 uppercase mt-1 shrink-0">Phonétique</span>
                                <p className="text-xs text-slate-500 italic leading-relaxed">
                                    {inv.phonetic}
                                </p>
                            </div>
                            <div className="flex items-start gap-2 border-t border-slate-50 pt-3">
                                <span className="text-[10px] font-black text-emerald-300 uppercase mt-1 shrink-0">Traduction</span>
                                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                    {inv.translation}
                                </p>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </div>
            );
        })}
      </div>

      <div className="text-center p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-xs text-slate-400">
              "Invoquez-Moi, Je vous répondrai." <br/> <span className="font-bold">— Sourate Ghafir, Verset 60</span>
          </p>
      </div>
    </div>
  );
};

export default InvocationLibrary;
