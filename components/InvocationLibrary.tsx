
import React, { useState } from 'react';
import { BookOpen, Copy, Shield, Moon, Sun, Heart, ChevronDown, ChevronUp, Compass } from 'lucide-react';
import { Invocation } from '../types';

const INVOCATIONS_DATA: Invocation[] = [
  {
    id: 'istikhara',
    category: 'Prière',
    title: 'Prière de Consultation (Istikhara)',
    arabic: 'اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلاَ أَقْدِرُ وَتَعْلَمُ وَلاَ أَعْلَمُ وَأَنْتَ عَلاَّمُ الْغُيُوبِ، اللَّهُمَّ إِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الأَمْرَ (ويسمي حاجته) خَيْرٌ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاقْدُرْهُ لِي وَيَسِّرْهُ لِي ثُمَّ بَارِكْ لِي فِيهِ، وَإِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الأَمْرَ شَرٌّ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاصْرِفْهُ عَنِّي وَاصْرِفْنِي عَنْهُ، وَاقْدُرْ لِي الْخَيْرَ حَيْثُ كَانَ ثُمَّ أَرْضِنِي بِهِ',
    phonetic: 'Allahumma inni astakhiruka bi\'ilmika wa astaqdiruka biqudratika, wa as\'aluka min fadlikal-\'azim, fa innaka taqdiru wa la aqdir, wa ta\'lamu wa la a\'lam, wa anta \'allamul-ghuyub. Allahumma in kunta ta\'lamu anna hadhal-amra (nommer la chose) khayrun li fi dini wa ma\'ashi wa \'aqibati amri, faqdurhu li wa yassirhu li thumma barik li fih. Wa in kunta ta\'lamu anna hadhal-amra sharrun li fi dini wa ma\'ashi wa \'aqibati amri, fasrifhu \'anni wasrifni \'anhu, waqdur liyal-khayra haythu kana thumma ardini bih.',
    translation: 'Seigneur Allah, je Te demande de me guider par Ton savoir et je cherche la capacité par Ton pouvoir et je Te demande de Ton immense grâce. Car Tu as le pouvoir et je ne l\'ai pas, Tu sais et je ne sais pas, et c\'est Toi le Grand Connaisseur des mondes inconnus. Seigneur Allah, si Tu sais que cette affaire (la nommer) est un bien pour moi dans ma religion, ma vie mondaine et ma fin, alors décrète-la pour moi, facilite-la-moi puis bénis-la pour moi. Et si Tu sais que cette affaire est un mal pour moi dans ma religion, ma vie mondaine et ma fin, alors écarte-la de moi et écarte-moi d\'elle, et décrète pour moi le bien où qu\'il soit, puis rends-moi satisfait de cela.'
  },
  {
    id: 'kursi',
    category: 'Protection',
    title: 'Ayat al-Kursi (Verset du Trône)',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    phonetic: 'Allahu la ilaha illa Huwa, Al-Haiyul-Qaiyum. La ta\'khudhuhu sinatun wa la nawm. Lahu ma fis-samawati wa ma fil-ard. Man dhal-ladhi yashfa\'u \'indahu illa bi-idhnihi. Ya\'lamu ma baina aidihim wa ma khalfahum. Wa la yuhituna bi-shai\'in min \'ilmihi illa bima sha\'a. Wasi\'a kursiyuhus-samawati wal-ard. Wa la ya\'uduhu hifzuhuma, wa Huwal-\'Aliyul-\'Azim.',
    translation: 'Allah ! Point de divinité à part Lui, le Vivant, Celui qui subsiste par Lui-même "al-Qayyum". Ni somnolence ni sommeil ne Le saisissent. A lui appartient tout ce qui est dans les cieux et sur la terre. Qui peut intercéder auprès de Lui sans Sa permission ? Il connaît leur passé et leur futur. Et, de Sa science, ils n\'embrassent que ce qu\'Il veut. Son Trône "Kursiy" déborde les cieux et la terre, dont la garde ne Lui coûte aucune peine. Et Il est le Très Haut, le Très Grand.'
  },
  {
    id: 'oppressed',
    category: 'Difficulté',
    title: 'Invocation de l\'opprimé',
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    phonetic: 'Hasbunallahu wa ni\'mal wakil',
    translation: 'Allah nous suffit, Il est notre meilleur garant.'
  },
  {
    id: '1',
    category: 'Matin & Soir',
    title: 'Protection contre le mal',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    phonetic: 'Bismillahil-ladhi la yadurru ma\'as-mihi shai\'un fil-ardi wa la fis-sama\'i, wa Huwas-Sami\'ul-\'Alim',
    translation: 'Au nom d\'Allah, tel qu\'en compagnie de Son Nom, rien sur Terre ni au ciel ne peut nuire, et Il est Celui qui entend tout et sait tout.'
  },
  {
    id: 'meal_before',
    category: 'Quotidien',
    title: 'Avant de manger',
    arabic: 'بِسْمِ اللهِ',
    phonetic: 'Bismillah',
    translation: 'Au nom d\'Allah. (Si on oublie au début : Bismillahi fi awwalihi wa akhirihi - Au nom d\'Allah au début et à la fin).'
  },
  {
    id: 'meal_after',
    category: 'Quotidien',
    title: 'Après avoir mangé',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
    phonetic: 'Al-hamdu lillahil-ladhi at\'amana wa saqana wa ja\'alana muslimin',
    translation: 'Louange à Allah qui nous a nourris, nous a abreuvés et a fait de nous des Musulmans.'
  },
  {
    id: 'iftar',
    category: 'Quotidien',
    title: 'Rupture du jeûne (Iftar)',
    arabic: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ',
    phonetic: 'Dhahaba adh-dhama\'u wabtallatil-\'uruqu wa thabatal-ajru in sha\' Allah',
    translation: 'La soif est partie, les veines sont humidifiées et la récompense est assurée, si Allah le veut.'
  },
  {
    id: '2',
    category: 'Prière',
    title: 'Après la prière',
    arabic: 'أَسْتَغْفِرُ اللَّهَ (3x) اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
    phonetic: 'Astaghfirullah (3x). Allahumma antas-salam wa minkas-salam, tabarakta ya dhal-jalali wal-ikram',
    translation: 'Je demande pardon à Allah (3 fois). Ô Allah, Tu es la Paix et la paix vient de Toi. Béni sois-Tu, Ô Possesseur de la Majesté et de la Noblesse.'
  },
  {
    id: '3',
    category: 'Quotidien',
    title: 'Avant de dormir',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    phonetic: 'Bismika Allahumma amutu wa ahya',
    translation: 'C\'est en Ton nom, ô Allah, que je meurs et que je vis.'
  },
  {
    id: '4',
    category: 'Difficulté',
    title: 'En cas de souci',
    arabic: 'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا',
    phonetic: 'Allahumma la sahla illa ma ja\'altahu sahlan, wa anta taj\'alul-hazna idha shi\'ta sahlan',
    translation: 'Ô Allah, il n\'y a de facile que ce que Tu rends facile, et si Tu le veux, Tu peux rendre la tristesse (ou la difficulté) facile.'
  }
];

const InvocationLibrary: React.FC = () => {
  const [openCategories, setOpenCategories] = useState<string[]>(['Protection']);

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
      case 'Matin & Soir': return <Sun className="w-4 h-4" />;
      case 'Prière': return <Heart className="w-4 h-4" />;
      case 'Quotidien': return <Compass className="w-4 h-4" />;
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
                                    <button className="text-slate-300 hover:text-emerald-600 transition-colors" title="Copier">
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
