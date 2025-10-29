import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';

type GameStage = 'intro' | 'map' | 'riddle' | 'question' | 'success' | 'failure';

interface Guardian {
  id: number;
  name: string;
  icon: string;
  emoji: string;
  riddle: string;
  riddleAnswer: string;
  question: string;
  options: string[];
  correctAnswer: number;
  fact: string;
  color: string;
}

const guardians: Guardian[] = [
  {
    id: 1,
    name: 'Хранитель Солнца',
    icon: 'Sun',
    emoji: '☀️',
    riddle: 'Я – жизнь дарящий диск, что день за днём горит, Без меня всё вянет вмиг, и мир во тьме стоит.',
    riddleAnswer: 'солнце',
    question: 'Хранители Солнца учат нас, что энергия – это дар. Как мы можем использовать солнечную энергию мудро, не нанося вред планете?',
    options: ['Сжигать больше топлива', 'Использовать солнечные батареи для получения электричества', 'Не выходить на солнце'],
    correctAnswer: 1,
    fact: 'Знаешь ли ты, что за час на Землю попадает столько солнечной энергии, сколько человечество потребляет за год?',
    color: 'from-orange-400 to-yellow-300'
  },
  {
    id: 2,
    name: 'Хранитель Воды',
    icon: 'Droplet',
    emoji: '💧',
    riddle: 'Я – жизнь, текущая рекой, Я – в тучах, в льдах, в земле сырой, Без меня не сможет жить никто, Так берегите же меня, прошу!',
    riddleAnswer: 'вода',
    question: 'Хранители Воды говорят о важности чистоты. Что ты можешь сделать, чтобы защитить водные ресурсы от загрязнения?',
    options: ['Выливать мусор в реки', 'Экономить воду и не использовать вредные химикаты', 'Использовать как можно больше воды'],
    correctAnswer: 1,
    fact: 'Более миллиарда людей на Земле не имеют доступа к чистой питьевой воде. Берегите воду!',
    color: 'from-blue-400 to-cyan-300'
  },
  {
    id: 3,
    name: 'Хранитель Леса',
    icon: 'Trees',
    emoji: '🌲',
    riddle: 'Я дом для зверя и для птицы, Даю прохладу и покой, Но от людей порой мне снится, Что я теряю облик свой.',
    riddleAnswer: 'лес',
    question: 'Хранители Леса напоминают нам о балансе. Почему так важно сохранять леса и их биоразнообразие?',
    options: ['Чтобы было больше мест для пикников', 'Леса очищают воздух, поддерживают водный баланс и являются домом для многих видов', 'Чтобы строить больше домов'],
    correctAnswer: 1,
    fact: 'Леса покрывают около 30% поверхности Земли и являются домом для более половины всех известных видов растений и животных!',
    color: 'from-green-500 to-emerald-400'
  },
  {
    id: 4,
    name: 'Хранитель Воздуха',
    icon: 'Wind',
    emoji: '🪶',
    riddle: 'Невидим я, но нужен всем, Деревьям, зверям и людям! Без меня жизнь станет совсем, Холодной, темной и скудной.',
    riddleAnswer: 'воздух',
    question: 'Хранители Воздуха предупреждают нас о загрязнении. Какие основные источники загрязнения воздуха вы знаете?',
    options: ['Только вулканы', 'Выхлопные газы автомобилей, промышленные выбросы, сжигание мусора', 'Только лесные пожары'],
    correctAnswer: 1,
    fact: 'Загрязненный воздух является причиной миллионов смертей в год по всему миру. Чистый воздух – залог здоровья!',
    color: 'from-sky-300 to-blue-200'
  },
  {
    id: 5,
    name: 'Хранитель Угля',
    icon: 'Mountain',
    emoji: '⬛',
    riddle: 'Я – камень чёрный и горючий, В земле глубоко залегаю, Энергию даю я людям, Но часто мир я загрязняю.',
    riddleAnswer: 'уголь',
    question: 'Хранители Угля напоминают о необходимости бережного использования ресурсов. Какие более экологичные альтернативы углю вы знаете?',
    options: ['Только сжигать больше дерева', 'Солнечная и ветровая энергия', 'Только атомная энергия'],
    correctAnswer: 1,
    fact: 'Уголь – это ископаемое топливо, которое образовалось миллионы лет назад из остатков древних растений. Но его сжигание оказывает сильное негативное воздействие на климат!',
    color: 'from-gray-700 to-gray-500'
  },
  {
    id: 6,
    name: 'Хранитель Земли',
    icon: 'Globe',
    emoji: '🌍',
    riddle: 'Шар голубой, мой дом родной, Здесь реки, горы и моря! Меня ты должен охранять, Чтоб вечно жизнь могла сиять.',
    riddleAnswer: 'земля',
    question: 'Хранители Земли учат нас бережно относиться к нашей планете. Что такое переработка отходов и зачем она нужна?',
    options: ['Просто выбрасывать все в одну кучу', 'Это процесс превращения старых вещей в новые, чтобы уменьшить загрязнение и сохранить ресурсы', 'Закапывать отходы в землю'],
    correctAnswer: 1,
    fact: 'Каждый год в мире производится более двух миллиардов тонн отходов! Переработка помогает уменьшить это количество и сохранить ресурсы планеты.',
    color: 'from-blue-500 to-green-500'
  },
  {
    id: 7,
    name: 'Хранитель Грозы',
    icon: 'CloudLightning',
    emoji: '⚡',
    riddle: 'Я – гнев небесный, вспышка света, Я – дождь обильный, громкий звук, Но после бури дарю я лето, И свежесть трав, и зелень луг.',
    riddleAnswer: 'гроза',
    question: 'Хранители Грозы предупреждают об опасности. Что нужно делать, если вы оказались на улице во время грозы?',
    options: ['Спрятаться под высоким деревом', 'Найти низину, отойти от водоёмов и металлических предметов', 'Купаться в реке'],
    correctAnswer: 1,
    fact: 'Молния может ударить на расстояние до 15 километров! Будь осторожен во время грозы!',
    color: 'from-purple-600 to-indigo-500'
  },
  {
    id: 8,
    name: 'Хранитель Дорог',
    icon: 'Route',
    emoji: '🛣️',
    riddle: 'Я – путь, что связывает места, Где мчатся быстро поезда, Автомобили и автобусы, От городов и до сел вкусных.',
    riddleAnswer: 'дорога',
    question: 'Хранители Дорог напоминают о безопасности. Почему важно соблюдать правила дорожного движения?',
    options: ['Чтобы быстрее доехать до места назначения', 'Чтобы избежать аварий и сохранить жизнь и здоровье', 'Чтобы не платить штрафы'],
    correctAnswer: 1,
    fact: 'Правила дорожного движения созданы для нашей безопасности! Соблюдайте их всегда!',
    color: 'from-gray-600 to-slate-500'
  },
  {
    id: 9,
    name: 'Хранитель Хищников',
    icon: 'PawPrint',
    emoji: '🐾',
    riddle: 'Я – сила дикая природы, Что держит в страхе всех зверей: В лесах и джунглях я живу, Добычу ловлю, как умею.',
    riddleAnswer: 'хищник',
    question: 'Хранители Хищников напоминают о равновесии в природе. Какую роль играют хищники в экосистеме?',
    options: ['Они вредят другим животным', 'Они контролируют численность других видов, поддерживая баланс', 'Они не играют никакой роли'],
    correctAnswer: 1,
    fact: 'Хищники – важная часть экосистемы! Без них численность травоядных может выйти из-под контроля, что негативно повлияет на всю природу.',
    color: 'from-amber-600 to-orange-500'
  },
  {
    id: 10,
    name: 'Хранитель Столицы',
    icon: 'Building2',
    emoji: '🏛️',
    riddle: 'Град древний, на реке стоящий, Здесь бьётся сердце всей страны, Кремль величавый, историей дышащий, Он символ силы и весны.',
    riddleAnswer: 'москва',
    question: 'Хранители Столицы напоминают о важности истории и культуры. Что вы знаете о Москве и ее истории?',
    options: ['Что это просто большой город', 'Это столица России, город с богатой историей и культурой', 'Что там всегда плохая погода'],
    correctAnswer: 1,
    fact: 'Москва – один из старейших и крупнейших городов Европы! Ее история насчитывает более 870 лет!',
    color: 'from-red-500 to-rose-400'
  },
  {
    id: 11,
    name: 'Хранитель Озера',
    icon: 'Waves',
    emoji: '🌊',
    riddle: 'Спокоен, тих я, словно сон, В моих глубинах тайна дремлет, Я дом для рыбы и растения, Но от людей нуждаюсь в защите.',
    riddleAnswer: 'озеро',
    question: 'Хранители Озера напоминают о хрупкости водных экосистем. Почему важно не загрязнять озера и другие водоемы?',
    options: ['Чтобы рыбам было где плавать', 'Загрязнение может убить животных и растения, а также сделать воду непригодной для питья', 'Чтобы было красиво'],
    correctAnswer: 1,
    fact: 'Озера содержат около 0,013% всей воды на Земле! Они являются домом для огромного количества живых организмов.',
    color: 'from-teal-400 to-blue-400'
  },
  {
    id: 12,
    name: 'Хранитель Листопада',
    icon: 'Leaf',
    emoji: '🍂',
    riddle: 'Я – танец красок в час осенний, Когда деревья раздеваются, Готовясь к зимнему сну, Но я дарю новые надежды.',
    riddleAnswer: 'листопад',
    question: 'Хранители Листопада напоминают о цикличности жизни. Почему деревья сбрасывают листья осенью?',
    options: ['Потому что им холодно', 'Чтобы сэкономить энергию и влагу зимой', 'Чтобы было красиво'],
    correctAnswer: 1,
    fact: 'Листья меняют цвет осенью из-за того, что хлорофилл разрушается, и становятся видны другие пигменты, такие как каротиноиды и антоцианы!',
    color: 'from-orange-500 to-red-400'
  },
  {
    id: 13,
    name: 'Хранитель Ветра',
    icon: 'Tornado',
    emoji: '🌪️',
    riddle: 'Я — невидимка с силою огромной, Всегда летаю, мир собой кружа. Могу быть ласковым, а иногда - суровым, На мельницу крылья навожу дрожа.',
    riddleAnswer: 'ветер',
    question: 'Хранители Ветра открывают нам свои силы. Как можно использовать силу ветра без вреда для мира?',
    options: ['только с помощью ветра, чтобы шуметь в трубах', 'с помощью ветряных электростанций', 'силой ветра валить деревья'],
    correctAnswer: 1,
    fact: 'На Земле люди используют ветряную энергию уже более 3000 лет',
    color: 'from-cyan-400 to-sky-300'
  },
  {
    id: 14,
    name: 'Хранитель Луга',
    icon: 'Flower2',
    emoji: '🌼',
    riddle: 'Я — холст зеленый, что цветами вышит, Где бабочки кружат и пчелы жужжат, Здесь жизнь кипит, в траве высокой дышит, И ароматы летние в воздухе парят.',
    riddleAnswer: 'луг',
    question: 'Хранители Луга повествуют о пользе многообразия. Зачем нужен луг?',
    options: ['чтобы мусор было куда выбрасывать', 'там пасутся животные, растут цветы и травы, живут насекомые', 'просто так существует'],
    correctAnswer: 1,
    fact: 'На лугах растет так много различных трав и цветов, что, если их правильно использовать, можно лечить разные болезни!',
    color: 'from-lime-400 to-green-400'
  },
  {
    id: 15,
    name: 'Хранитель Снегопада',
    icon: 'Snowflake',
    emoji: '❄️',
    riddle: 'Я — тихий пух, что с неба опускается, Землю окутывая в белый свой покров. И мир на время в сказку превращается, Под тихий шелест белоснежных снов.',
    riddleAnswer: 'снегопад',
    question: 'Хранители Снегопада указывают на его полезные стороны. Зачем нужен снег?',
    options: ['чтобы зима долго длилась', 'чтобы было красиво', 'чтобы укрывать землю от морозов и давать влагу весной'],
    correctAnswer: 2,
    fact: 'Снежинки состоят из кристаллов льда и никогда не бывают одинаковыми!',
    color: 'from-blue-200 to-white'
  },
  {
    id: 16,
    name: 'Хранитель Марса',
    icon: 'Orbit',
    emoji: '🔴',
    riddle: 'Я – красная звезда вдали, Планета дальняя зовусь, Возможно, в будущем, смогли, Бы люди жить на мне - открой путь!',
    riddleAnswer: 'марс',
    question: 'Хранители Марса мечтают о будущем. Какую планету называют красной?',
    options: ['Марс', 'Земля', 'Юпитер'],
    correctAnswer: 0,
    fact: 'Марс - планета названа в честь древнеримского бога войны.',
    color: 'from-red-600 to-orange-600'
  },
  {
    id: 17,
    name: 'Хранитель Государства',
    icon: 'Flag',
    emoji: '🇷🇺',
    riddle: 'Бескрайняя моя земля, Богата лесом и полями, Где дружно все живем семья, Горжусь великими краями!',
    riddleAnswer: 'государство',
    question: 'Хранители Государства чтят Родину. Как называется страна, в которой ты живешь?',
    options: ['Америка', 'Китай', 'Россия'],
    correctAnswer: 2,
    fact: 'Россия - самое большое по площади государство в мире!',
    color: 'from-blue-600 via-white to-red-600'
  },
  {
    id: 18,
    name: 'Хранитель Животных',
    icon: 'Cat',
    emoji: '🐻',
    riddle: 'Зимой он спит в своей берлоге, Весной выходит на луга, Любит мед и ягоды тоже, И он, конечно …',
    riddleAnswer: 'медведь',
    question: 'Хранители Леса напоминают о зверях лесных. Что ты знаешь о жизни медведей в лесу?',
    options: ['Они живут в африке', 'они зимой спят в берлогах', 'они живут в океане'],
    correctAnswer: 1,
    fact: 'Медведи – самые большие хищные животные в европейских лесах.',
    color: 'from-brown-600 to-amber-700'
  },
  {
    id: 19,
    name: 'Хранитель Растений',
    icon: 'Sprout',
    emoji: '🌸',
    riddle: 'Белые ромашки на лугу цветут, От болезней разных всех они спасут. Чай с ней ароматный, сердцу просто рай, Что за травка, быстро угадай?',
    riddleAnswer: 'ромашка',
    question: 'Хранители Леса напоминают о целебных свойствах. Как называется цветы, которые использую, когда болит горло?',
    options: ['ромашка', 'подснежник', 'фиалки'],
    correctAnswer: 0,
    fact: 'Ромашка обладает противовоспалительными, антибактериальными и успокаивающими свойствами.',
    color: 'from-white to-yellow-200'
  },
  {
    id: 20,
    name: 'Хранитель Года',
    icon: 'Calendar',
    emoji: '📅',
    riddle: 'Они друг друга сменяют каждый год, Весна, Лето, Осень и та, что в снег зовет.',
    riddleAnswer: 'времена года',
    question: 'Хранители Года просят рассказать. После какого времени года наступает лето?',
    options: ['после зимы', 'после весны', 'после осени'],
    correctAnswer: 1,
    fact: 'На Земле есть места, где зима длится почти весь год, а лето очень короткое!',
    color: 'from-green-400 via-yellow-300 via-orange-400 to-blue-300'
  }
];

export default function Index() {
  const [stage, setStage] = useState<GameStage>('intro');
  const [lives, setLives] = useState(3);
  const [currentGuardianIndex, setCurrentGuardianIndex] = useState(0);
  const [riddleAnswer, setRiddleAnswer] = useState('');
  const [riddleSolved, setRiddleSolved] = useState(false);
  const [completedGuardians, setCompletedGuardians] = useState<number[]>([]);
  const [unlockedGuardians, setUnlockedGuardians] = useState<number[]>([1]);
  const [showFact, setShowFact] = useState(false);
  const [collectedFragments, setCollectedFragments] = useState<number[]>([]);
  
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null);
  const successSoundRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    correctSoundRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuCzPLaizsJHGi+8OedTgwOUqrp7K1aFgxKouT1x2wuBCqBzPL1iTsJG2m98OGaTQwRVLHq7rNhFw1Onef1zm0vBSiCzvLcizsIHGi98OGZTgwOUqvr7bNhGAxNnuj1zm4wBSeAzvLaiDwIHGi98OGbTQ0OUqvr7bNhFw1Onef1z28vBSiBzvLZiDoIHWm+8OGaTQ0OUqvr7rJgFw1Onef1z28vBSiBzvLaiDsJHGi+8OGaTQ0OUqvq7rJgFw1Onef1z28vBSiBzvLZiDsJHGi+8OGZTQ0OUqvq7rJgGAxOnef1z24vBSiBzvLZiDsJHGi+8OGZTQ0OUqvr7bJgFw1Onef1z24vBSiBzvLaiDsJHGi+8OGZTQ0OUqvr7bJgFw1Onef1z24vBSiBzvLaiDsJHGi+8OGZTQ0OUqvr7bJgFw1Onef1z24vBSiBzvLaiDsJHGi+8OGZTQ0OUqvr7bJgFw1Onef1z24vBSiBzvLaiDsJHGi+8OGZTQ0OUqvr7bJgFw1Onef1z24vBQ==');
    wrongSoundRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAAD/8ePt5dXn9vL7/frx5d3c4+z0+Pzy6uLY19rh6fD1+fbv5d7W1dzk7fL2+vn0797a1dnh6e7z+Pn49/Dp4tzZ29/k6u/z9/j5+PPu6ePf3dzg5urv8/b4+vv59vPv6ePf3dzg5urv8/b4+vr49vPv6ePf3dzg5urv8/b4+vr49vPv6ePf3dzg5urv8/b4+vr49vPv6ePf3dzg5urv8/b4+vr49vPv6ePf3dzg5urv8/b4+vr49vPv6ePf3dzg5urv8/b4+vr49vPv6ePf3dzg5urv8/b4+vr49vPv6ePf3dzg5urv8/b4+vr49vPv6ePf3dzg5urv8/b4+vr49vPv6ePf3dzg5urv8/b4+vr49vPv6ePf3dzg5urv8/b4+vr49vPv6ePf3dzg5urv8/b4+vr49vPv6ePf3dzg5urv8/b4+vr49vPv6ePf3dzg5urv8/b4+vr49vPv6ePf3dzg5urv8/b4+vr49vPv6ePf3dzg5urv8/b4+vr49vPv6ePf3dzg5urv8/b4+vr49vPv6ePf3dzg5urv8/b4+vr49vPv6ePf3dzg5urv8/b4+vr49vPv6ePf3dzg5urv8/b4+vr49vPv6ePf3dzg5urv8/b4+vr49vPv6ePf3dzg5urv8/b4+vr49vPv6ePf3dzg5urv8/b4+vr49vPv6ePf3dzg5urv8/b4+vr49vPv6ePf3dzg5urv8w==');
    successSoundRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm2dIBAAAABBAAEAQB8AAEAfAAABAAgAZGF0YQoGAACAhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuCzPLaizsJHGi+8OedTgwOUqrp7K1aFgxKouT1x2wuBCqBzPLaizsJHGi+8OedTgwOUqrp7K1aFgxKouT1x2wuBCqBzPLaizsJHGi+8OedTgwOUqrp7K1aFgxKouT1x2wuBCqBzPLaizsJHGi+8OedTgwOUqrp7K1aFgxKouT1x2wuBCqBzPLaizsJHGi+8OedTgwOUqrp7K1aFgxKouT1x2wuBCqBzPLaizsJHGi+8OedTgwOUqrp7K1aFgxKouT1x2wuBCqBzPLaizsJHGi+8OedTgwOUqrp7K1aFgxKouT1x2wuBA==');
  }, []);

  const currentGuardian = guardians[currentGuardianIndex];

  const handleStartGame = () => {
    setStage('map');
  };

  const handleGuardianClick = (index: number) => {
    const guardianId = guardians[index].id;
    
    if (!unlockedGuardians.includes(guardianId)) {
      wrongSoundRef.current?.play();
      toast({
        title: '🔒 Локация заблокирована',
        description: 'Сначала пройди предыдущие испытания!',
        variant: 'destructive',
      });
      return;
    }
    
    if (completedGuardians.includes(guardianId)) {
      toast({
        title: 'Фрагмент уже собран',
        description: 'Этот хранитель уже поделился своим фрагментом!',
      });
      return;
    }
    setCurrentGuardianIndex(index);
    setRiddleSolved(false);
    setRiddleAnswer('');
    setShowFact(false);
    setStage('riddle');
  };

  const handleRiddleSubmit = () => {
    if (riddleAnswer.toLowerCase().trim() === currentGuardian.riddleAnswer) {
      correctSoundRef.current?.play();
      toast({
        title: '✨ Верно!',
        description: 'Загадка разгадана! Переходим к вопросу.',
      });
      setRiddleSolved(true);
    } else {
      wrongSoundRef.current?.play();
      toast({
        title: '🤔 Подумай еще!',
        description: 'Попробуй еще раз разгадать загадку.',
        variant: 'destructive',
      });
    }
  };

  const handleQuestionAnswer = (answerIndex: number) => {
    const isCorrect = answerIndex === currentGuardian.correctAnswer;
    
    if (isCorrect) {
      correctSoundRef.current?.play();
      toast({
        title: '🎉 Правильно!',
        description: 'Ты получил фрагмент амулета!',
      });
      setCompletedGuardians([...completedGuardians, currentGuardian.id]);
      setCollectedFragments([...collectedFragments, currentGuardian.id]);
    } else {
      wrongSoundRef.current?.play();
      const newLives = lives - 1;
      setLives(newLives);
      toast({
        title: '❌ Неверно!',
        description: `Ты потерял одну жизнь. Осталось: ${newLives}`,
        variant: 'destructive',
      });
      
      if (newLives === 0) {
        setStage('failure');
        return;
      }
    }
    
    if (currentGuardian.id < 20) {
      setUnlockedGuardians([...unlockedGuardians, currentGuardian.id + 1]);
    }
    
    setShowFact(true);
  };

  const handleContinue = () => {
    if (collectedFragments.length === 20) {
      successSoundRef.current?.play();
      setStage('success');
    } else {
      setStage('map');
    }
  };

  const handleRestart = () => {
    setStage('intro');
    setLives(3);
    setCurrentGuardianIndex(0);
    setRiddleAnswer('');
    setRiddleSolved(false);
    setCompletedGuardians([]);
    setUnlockedGuardians([1]);
    setCollectedFragments([]);
    setShowFact(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white sparkle"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 2 + 's',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {lives > 0 && stage !== 'intro' && stage !== 'success' && stage !== 'failure' && (
          <div className="fixed top-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-xl flex items-center gap-3">
            <span className="font-semibold text-lg">Жизни:</span>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <span key={i} className="text-2xl">
                  {i < lives ? '❤️' : '🖤'}
                </span>
              ))}
            </div>
          </div>
        )}

        {stage === 'intro' && (
          <div className="max-w-3xl mx-auto animate-fade-in">
            <Card className="p-8 shadow-2xl bg-white/95 backdrop-blur-sm">
              <div className="text-center mb-6">
                <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                  ✨ Загадки Хранителей Древней Земли ✨
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-primary via-secondary to-accent mx-auto rounded-full" />
              </div>

              <div className="space-y-6 text-lg leading-relaxed">
                <p className="font-semibold text-xl text-center text-secondary">
                  Дорогой друг, тебя приветствует виртуальное послание от профессора Эмилио!
                </p>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-primary/20">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-3xl float">
                      👨‍🔬
                    </div>
                    <div>
                      <p className="font-bold text-xl">Профессор Эмилио</p>
                      <p className="text-sm text-muted-foreground">Археолог и исследователь</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-base">
                    <p>
                      «Мой юный друг, если ты читаешь это, значит, я исчез, исследуя величайшую тайну в истории нашей планеты – <span className="font-bold text-primary">тайну хранителей древней земли!</span>
                    </p>
                    <p>
                      Эти сущности, согласно легендам, оберегали знания о гармонии между природой и человечеством, знания, которые могут спасти наш мир от экологической катастрофы.
                    </p>
                    <p>
                      Я нашел древний амулет хранителей, но он разбит на <span className="font-bold text-secondary">20 фрагментов</span>, каждый из которых спрятан и охраняется загадками, связанными с определенным аспектом нашей планеты.
                    </p>
                    <p className="font-semibold">
                      Мне нужна твоя помощь! Найди все фрагменты амулета, разгадай тайны хранителей, и, возможно, ты найдёшь и меня, и спасешь мир!
                    </p>
                    <p className="text-destructive font-bold flex items-center gap-2 bg-red-50 p-3 rounded-lg">
                      <Icon name="AlertTriangle" className="flex-shrink-0" />
                      Но будь осторожен! Неправильный ответ ослабит тебя, ведь у тебя есть всего три жизни.
                    </p>
                    <p className="italic">
                      С каждым найденным фрагментом амулета ты будешь не только приближаться ко мне, но и узнаешь больше о секретах хранителей и их мудрых уроках.»
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleStartGame}
                  size="lg"
                  className="w-full text-xl py-6 bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-transform"
                >
                  🚀 Начать приключение
                </Button>
              </div>
            </Card>
          </div>
        )}

        {stage === 'map' && (
          <div className="max-w-6xl mx-auto animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-primary mb-2">
                🗺️ Карта Сказочного Леса
              </h2>
              <p className="text-xl text-muted-foreground">
                Собрано фрагментов: {collectedFragments.length} / 20
              </p>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-4 max-w-md mx-auto">
                <div
                  className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(collectedFragments.length / 20) * 100}%` }}
                />
              </div>
              
              {collectedFragments.length > 0 && (
                <div className="mt-6">
                  <p className="text-lg font-semibold mb-3">✨ Собранные фрагменты амулета:</p>
                  <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
                    {collectedFragments.map(fragmentId => {
                      const guardian = guardians.find(g => g.id === fragmentId);
                      return (
                        <div
                          key={fragmentId}
                          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${guardian?.color} flex items-center justify-center text-2xl shadow-lg`}
                          title={guardian?.name}
                        >
                          {guardian?.emoji}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {guardians.map((guardian, index) => {
                const isCompleted = completedGuardians.includes(guardian.id);
                const isUnlocked = unlockedGuardians.includes(guardian.id);
                const isLocked = !isUnlocked;
                
                return (
                  <button
                    key={guardian.id}
                    onClick={() => handleGuardianClick(index)}
                    disabled={isLocked && !isCompleted}
                    className={`relative group transition-all duration-300 ${
                      isCompleted ? 'scale-95 opacity-75' : 
                      isLocked ? 'opacity-40 cursor-not-allowed grayscale' :
                      'hover:scale-110 pulse-glow'
                    }`}
                  >
                    <Card className={`p-6 text-center bg-gradient-to-br ${guardian.color} text-white relative overflow-hidden`}>
                      {isLocked && !isCompleted && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                          <Icon name="Lock" size={48} className="text-white" />
                        </div>
                      )}
                      {isCompleted && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Icon name="Check" size={48} className="text-white" />
                        </div>
                      )}
                      <div className="text-5xl mb-3 float">{guardian.emoji}</div>
                      <p className="font-bold text-sm drop-shadow-lg">{guardian.name}</p>
                      <p className="text-xs mt-1 opacity-90">Фрагмент #{guardian.id}</p>
                    </Card>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {stage === 'riddle' && (
          <div className="max-w-2xl mx-auto animate-scale-in">
            <Card className="p-8 shadow-2xl bg-white/95 backdrop-blur-sm">
              <div className="text-center mb-6">
                <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${currentGuardian.color} rounded-full flex items-center justify-center text-4xl mb-4 float`}>
                  {currentGuardian.emoji}
                </div>
                <h2 className="text-3xl font-bold text-primary mb-2">
                  {currentGuardian.name}
                </h2>
                <div className="inline-block px-4 py-2 bg-primary/10 rounded-full">
                  <p className="font-semibold">Фрагмент #{currentGuardian.id}</p>
                </div>
              </div>

              {!riddleSolved ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-center mb-4 text-secondary">
                      🔮 Загадка Хранителя
                    </h3>
                    <p className="text-lg italic text-center leading-relaxed bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
                      "{currentGuardian.riddle}"
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold">
                      Введи ответ маленькими буквами:
                    </label>
                    <Input
                      value={riddleAnswer}
                      onChange={(e) => setRiddleAnswer(e.target.value)}
                      placeholder="Введи свой ответ..."
                      className="text-lg py-6"
                      onKeyPress={(e) => e.key === 'Enter' && handleRiddleSubmit()}
                    />
                    <Button
                      onClick={handleRiddleSubmit}
                      className="w-full text-lg py-6 bg-gradient-to-r from-primary to-secondary"
                    >
                      Проверить ответ
                    </Button>
                  </div>

                  <Button
                    onClick={() => setStage('map')}
                    variant="outline"
                    className="w-full"
                  >
                    Вернуться к карте
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-6xl mb-4">✨</div>
                    <p className="text-2xl font-bold text-green-600 mb-4">Загадка разгадана!</p>
                    <p className="text-lg">Теперь ответь на вопрос Хранителя</p>
                  </div>
                  <Button
                    onClick={() => setStage('question')}
                    className="w-full text-lg py-6 bg-gradient-to-r from-primary to-secondary"
                  >
                    К Вопросу Хранителя →
                  </Button>
                </div>
              )}
            </Card>
          </div>
        )}

        {stage === 'question' && (
          <div className="max-w-2xl mx-auto animate-scale-in">
            <Card className="p-8 shadow-2xl bg-white/95 backdrop-blur-sm">
              <div className="text-center mb-6">
                <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${currentGuardian.color} rounded-full flex items-center justify-center text-4xl mb-4 float`}>
                  {currentGuardian.emoji}
                </div>
                <h2 className="text-3xl font-bold text-primary mb-2">
                  {currentGuardian.name}
                </h2>
              </div>

              {!showFact ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-center mb-4 text-secondary">
                      ❓ Вопрос Хранителя
                    </h3>
                    <p className="text-lg text-center leading-relaxed bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl mb-6">
                      {currentGuardian.question}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {currentGuardian.options.map((option, index) => (
                      <Button
                        key={index}
                        onClick={() => handleQuestionAnswer(index)}
                        variant="outline"
                        className="w-full text-left text-base py-6 px-6 hover:bg-primary/10 hover:border-primary transition-all"
                      >
                        <span className="font-bold mr-3">{String.fromCharCode(97 + index)})</span>
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200">
                    <h3 className="text-2xl font-bold text-center mb-4 text-green-700">
                      💡 Познавательный факт
                    </h3>
                    <p className="text-lg leading-relaxed text-center">
                      {currentGuardian.fact}
                    </p>
                  </div>

                  <Button
                    onClick={handleContinue}
                    className="w-full text-lg py-6 bg-gradient-to-r from-primary to-secondary"
                  >
                    Отправиться дальше →
                  </Button>
                </div>
              )}
            </Card>
          </div>
        )}

        {stage === 'success' && (
          <div className="max-w-3xl mx-auto animate-scale-in">
            <Card className="p-8 shadow-2xl bg-gradient-to-br from-yellow-50 to-amber-50">
              <div className="text-center space-y-6">
                <div className="text-8xl mb-4">🏆</div>
                <h2 className="text-4xl font-bold text-primary">
                  Поздравляем, юный хранитель!
                </h2>
                
                <div className="bg-white/80 p-6 rounded-xl space-y-4 text-lg">
                  <p className="font-semibold">
                    Ты собрал все фрагменты Амулета!
                  </p>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-primary/20">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-3xl">
                        👨‍🔬
                      </div>
                      <p className="font-bold text-xl">Профессор Эмилио благодарит тебя:</p>
                    </div>
                    <div className="space-y-3 text-base">
                      <p>
                        «Ты сделал это! Ты разгадал тайны хранителей и восстановил амулет. Сила древних знаний теперь в твоих руках!
                      </p>
                      <p>
                        Я в безопасности, амулет указал мне путь к древнему городу хранителей, где я изучаю их мудрость.
                      </p>
                      <p className="font-bold text-primary">
                        Самое главное – используй эти знания, чтобы защитить нашу планету и вдохновлять других!»
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 justify-center pt-4">
                  <Button
                    onClick={handleRestart}
                    className="text-lg py-6 px-8 bg-gradient-to-r from-primary to-secondary"
                  >
                    Начать заново
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {stage === 'failure' && (
          <div className="max-w-3xl mx-auto animate-scale-in">
            <Card className="p-8 shadow-2xl bg-gradient-to-br from-gray-50 to-slate-50">
              <div className="text-center space-y-6">
                <div className="text-8xl mb-4">💫</div>
                <h2 className="text-4xl font-bold text-muted-foreground">
                  К сожалению, юный исследователь...
                </h2>
                
                <div className="bg-white/80 p-6 rounded-xl space-y-4 text-lg">
                  <p>
                    У тебя закончились жизни… Но не отчаивайся!
                  </p>
                  <p>
                    Ты узнал много нового о нашей планете и о мудрости хранителей. Твоё путешествие лишь начинается!
                  </p>
                  <p className="font-semibold text-primary">
                    Попробуй снова, вспомни уроки хранителей, будь внимательнее к подсказкам, и ты обязательно добьёшься успеха!
                  </p>
                  <p className="italic">
                    Знания – это сила, и твоя тяга к знаниям уже сделала тебя героем!
                  </p>
                  
                  <div className="pt-4">
                    <p className="font-semibold mb-2">Ты собрал фрагментов: {completedGuardians.length} / 20</p>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all"
                        style={{ width: `${(completedGuardians.length / 20) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleRestart}
                  className="text-lg py-6 px-8 bg-gradient-to-r from-primary to-secondary"
                >
                  🔄 Начать заново
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}