/**
 * DAMIAT product landing — fixtures from company docs (etc/company-sources).
 */
import type { NavbarBlockProps } from './NavbarBlock';
import type { HeroBlockProps } from './HeroBlock';
import type { FeaturesBlockProps } from './FeaturesBlock';
import type { DamiatCalculatorBlockProps } from './DamiatCalculatorBlock';
import type { ShowcasePanelBlockProps } from './ShowcasePanelBlock';
import type { WhyUsBlockProps } from './WhyUsBlock';
import type { StatsBlockProps } from './StatsBlock';
import type { ProcessBlockProps } from './ProcessBlock';
import type { ChooseUsBlockProps } from './ChooseUsBlock';
import type { TrustBlockProps } from './TrustBlock';
import type { PartnersBlockProps } from './PartnersBlock';
import type { ContactHeroBlockProps } from './ContactHeroBlock';
import type { FooterBlockProps } from './FooterBlock';
import type { EventsBlockProps } from './EventsBlock/EventsBlock';
import type { DamiatLandingPageProps } from './DamiatLandingPage/DamiatLandingPage';
import type { DamiatCaseStudiesBlockProps } from './DamiatCaseStudiesBlock';
import type { DamiatVolumeBenefitBlockProps } from './DamiatVolumeBenefitBlock';
import { damiatPartnerItems } from './demo-assets/damiatPartnerLogos';
import { damiatCaseStudyImagesById } from './demo-assets/damiatCaseStudyImages';
import {
  damiatCardIcon,
  damiatCatalogIcon,
  damiatFeaturedCover,
  damiatTrustCover,
} from './damiatGeneratedIcons';

export const damiatNavbarFixture: NavbarBlockProps = {
  variant: 'enterprise',
  logo: 'DAMIAT',
  sticky: true,
  overlay: true,
  /** false — после первого экрана solid: светлое стекло + тёмный текст на светлых секциях. */
  staticGlass: false,
  links: [
    { label: 'Калькулятор', href: '#calculator' },
    { label: 'Сценарии', href: '#scenarios' },
    { label: 'Генератор', href: '#device' },
    { label: 'Кейсы', href: '#case' },
  ],
  phone: {
    number: 'Позвонить',
    href: 'tel:+79184321199',
  },
  accountCta: { label: 'Войти', href: '#login', icon: 'user' },
  cta: { label: 'Рассчитайте выгоду', href: '#calculator', icon: 'send' },
  socialLinks: [],
  servicesMenu: [],
};

export const damiatHeroContent: HeroBlockProps = {
  variant: 'enterprise',
  align: 'left',
  appearance: 'brand',
  fillViewport: true,
  metricsShowTopBorder: false,
  title: 'Управляйте хранением урожая и доходом от реализации',
  subtitle:
    'Задавайте микроклимат генератором этилена DAMIAT. Следите за рисками в платформе и выбирайте момент продажи.',
  primaryAction: { label: 'Рассчитайте выгоду', href: '#calculator' },
  secondaryAction: { label: 'Узнайте о генераторе', href: '#device' },
  stats: [
    { value: '≈2,5 млн ₽', label: 'чистая выгода с 1 000 т (35 ₽/кг, 12 мес.)' },
    { value: '+8%', label: 'массы сохраняется с КГС' },
    { value: '24/7', label: 'удалённый мониторинг' },
  ],
};

export const damiatEventsContent: EventsBlockProps = {
  title: 'Мероприятия',
  titleScale: 'compact',
  subtitle: 'Выставки, демо генератора и вебинары по хранению картофеля',
  variant: 'featured',
  events: [
    {
      id: 'agrotech',
      format: 'offline',
      date: '2026-03-14',
      title: 'AgroTech — стенд DAMIAT, демонстрация КГС и генератора этилена',
      location: 'Москва',
      href: '#events-agrotech',
    },
    {
      id: 'golden-potato',
      format: 'hybrid',
      date: '2026-04-22',
      title: 'Golden Potato: практики хранения и снижение потерь',
      location: 'Краснодар',
      href: '#events-golden-potato',
    },
    {
      id: 'webinar-index',
      format: 'online',
      date: '2026-05-10',
      title: 'Вебинар: управляйте экономикой хранения под ваш объём',
      location: 'Онлайн',
      href: '#events-webinar',
    },
  ],
};

export const damiatProblemContent: FeaturesBlockProps = {
  title: 'Отсутствие контроля = упущенная выгода',
  subtitle:
    'Без контролируемой газовой среды (КГС) вы теряете массу на складе (до 12–17%). С DAMIAT сохраняете партии дольше — и можете выбирать месяц продажи по прогнозу цены, а не по сроку.',
  subtitleAccent: 'до 12–17%',
  variant: 'catalog',
  columns: 2,
  features: [
    {
      id: 'sprouting',
      icon: damiatCatalogIcon('card-abb0ad49a9'),
      title: 'Прорастание и созревание',
      description: 'Естественное накопление этилена ускоряет физиологическое старение клубней.',
    },
    {
      id: 'shrinkage',
      icon: damiatCatalogIcon('card-96f67de640'),
      title: 'Усушка и порча',
      description: 'Метаболизм и патогены без КГС снижают товарный вид и массу партии.',
    },
    {
      id: 'losses',
      icon: damiatCatalogIcon('12-17'),
      title: 'Потери 12–17%',
      description: 'Против 4–6,5% при контролируемой атмосфере и этиленгенераторе DAMIAT.',
    },
    {
      id: 'timing',
      icon: damiatCatalogIcon('card-574a74e0f8'),
      title: 'Неверный момент продажи',
      description: 'Снижение качества и рыночный тайминг вместе съедают маржу хозяйства.',
    },
  ],
};

export const damiatCalculatorContent: DamiatCalculatorBlockProps = {
  title: 'Рассчитайте стоимость урожая и выгоду от хранения',
  subtitle:
    'Укажите площадь посевов и урожайность картофеля — увидите прогноз цен по месяцам, потери и выгоду от генератора DAMIAT.',
  defaultValues: {
    hectares: '536',
    yieldTonsPerHa: '28',
    device1: true,
    manualBasePricePerTon: '',
    priceAdjustPercent: 0,
  },
};

export const damiatScenarioContent: ShowcasePanelBlockProps = {
  title: 'Контролируйте хранилище не выходя из дома',
  titleBreakBefore: ' не выходя из дома',
  panels: [
    {
      id: 'c2h4',
      title: 'Этилен: хранение и дозаривание',
      modes: [
        {
          id: 'storage',
          label: 'Хранение',
          active: true,
        },
        {
          id: 'ripening',
          label: 'Дозаривание',
        },
      ],
      status: { label: 'Авторегулирование', level: 'ok' },
      metrics: [
        {
          label: 'C₂H₄',
          value: '0.12',
          unit: 'ppm',
          min: '0.08',
          max: '0.15',
          trend: 'up',
        },
      ],
      resources: [
        {
          label: 'Топливо',
          level: '68',
          unit: '%',
          consumption: '2,1 л/сут',
          remainingDays: '10–12 дней',
          trend: 'down',
        },
      ],
      alerts: [
        {
          level: 'info',
          title: 'Подача этилена снижена',
          detail: 'C₂H₄ выше коридора — автокоррекция без оператора. Восстановление среды: 2–4 ч.',
          actor: 'auto',
        },
        {
          level: 'warning',
          title: 'Остаток топлива: 10–12 дней',
          detail:
            'Запланируйте дозаправку до порога.\n↑ расход: C₂H₄ ниже коридора, вентиляция, T° продукта.\n↓ расход: C₂H₄ в коридоре, стабильный микроклимат.',
          actor: 'operator',
        },
      ],
      bullets: [],
    },
    {
      id: 'co2',
      title: 'CO₂: потери массы при хранении',
      modesLabel: 'Режим анализа',
      modes: [
        {
          id: 'monitor',
          label: 'Мониторинг',
          active: true,
        },
        {
          id: 'forecast',
          label: 'Прогноз потерь',
        },
      ],
      status: { label: 'В норме', level: 'ok' },
      metrics: [
        {
          label: 'CO₂',
          value: '920',
          unit: 'ppm',
          min: '800',
          max: '1100',
          trend: 'stable',
        },
      ],
      resources: [
        {
          label: 'Потери',
          level: '4,2',
          unit: '%',
          consumption: '0,08 %/сут',
          trend: 'stable',
        },
      ],
      alerts: [
        {
          level: 'info',
          title: 'CO₂ в коридоре',
          detail: 'Дыхание продукта стабильно — режим хранения без изменений.',
          actor: 'auto',
        },
        {
          level: 'warning',
          title: 'CO₂ растёт более суток',
          detail:
            'Усильте вентиляцию или проверьте температуру продукта. Потери растут, если CO₂ долго выше коридора или T° продукта повышена.',
          actor: 'operator',
        },
      ],
      bullets: [],
    },
    {
      id: 'climate',
      title: 'Микроклимат: условия хранения',
      modesLabel: 'Режим контроля',
      modes: [
        {
          id: 'humidity',
          label: 'Влажность',
          active: true,
        },
        {
          id: 'temperature',
          label: 'Температура',
        },
      ],
      status: { label: 'Риск усушки', level: 'alert' },
      metrics: [
        {
          label: 'Влажность',
          value: '82',
          unit: '%',
          min: '85',
          max: '92',
          trend: 'down',
        },
      ],
      resources: [
        {
          label: 'T° продукта',
          level: '4.2',
          unit: '°C',
          trend: 'stable',
        },
      ],
      alerts: [
        {
          level: 'info',
          title: 'T° в коридоре',
          detail: 'Температура продукта стабильна — коррекция не требуется.',
          actor: 'auto',
        },
        {
          level: 'warning',
          title: 'Влажность ниже коридора',
          detail:
            'Усильте увлажнение или сократите вентиляцию. Длительное отклонение RH повышает риск усушки.',
          actor: 'operator',
        },
      ],
      bullets: [],
    },
  ],
};

export const damiatDeviceIntroContent: WhyUsBlockProps = {
  title: 'Промышленный генератор этилена DAMIAT',
  titleBreakBefore: 'этилена',
  cardTitleClassName: 'min-[1024px]:text-style-h4 !font-semibold',
  primaryCards: [
    {
      id: 'autonomy',
      title: 'Автономность по топливу и электричеству',
      description:
        'До 2 недель по топливу и до 24 часов по электропитанию — непрерывный контроль КГС без привязки к сети.',
    },
    {
      id: 'sensors',
      title: '6 точек контроля и газовая среда',
      description:
        '6 точек температуры в продукте и камере. CO₂, C₂H₄, O₃ и влажность — расширенный набор параметров для КГС.',
    },
  ],
  secondaryCards: [
    {
      id: 'connectivity',
      title: 'Интернет и архив',
      description: 'Подключение к мониторингу через интернет, архив параметров до 2 лет.',
    },
    {
      id: 'monitoring',
      title: 'Мониторинг 24/7',
      description:
        'Автоматический контроль параметров — уведомления на телефон при выходе из допустимого коридора.',
    },
    {
      id: 'ozone-fuel',
      title: 'Озонатор и топливо',
      description:
        'Управление озонатором с генератора. Снижение расхода до 20%, в т.ч. на низкосортном топливе.',
    },
  ],
  featured: {
    title: 'Держите микроклимат под контролем',
    description:
      'Устанавливайте генератор для КГС: снижайте потери, сохраняйте товарный вид картофеля и увеличивайте доход при реализации.',
    variant: 'primary',
  },
};

export const damiatDevicePrincipleContent: ProcessBlockProps = {
  title: 'Как работает генератор',
  headingAppearance: 'primary',
  steps: [
    {
      id: 'measure',
      title: 'Измерение микроклимата',
      description: 'Контроллер отслеживает T°, влажность, CO₂, C₂H₄ и O₃ в камере и в продукте.',
      icon: damiatCardIcon('card-343a0cd4df'),
    },
    {
      id: 'ethylene',
      title: 'Регулирование этилена',
      description: 'Поддерживается состав атмосферы, замедляется созревание и дыхание клубней.',
      icon: damiatCardIcon('card-6abcafe7fa'),
    },
    {
      id: 'ozone',
      title: 'Озонирование',
      description: 'Озонатор подключается к генератору и работает по заданным программам обеззараживания.',
      icon: damiatCardIcon('card-538b6cb267'),
    },
    {
      id: 'preserve',
      title: 'Сохранность урожая',
      description: 'Снижаются потери от убыли, болезней и механических повреждений при отгрузке.',
      icon: damiatCardIcon('card-3ad7260126'),
    },
    {
      id: 'platform',
      title: 'Данные в платформу',
      description: 'Телеметрия уходит в архив и DAMIAT — прогноз рисков и рекомендации по продаже.',
      icon: damiatCardIcon('card-49337256ec'),
    },
  ],
};

export const damiatDashboardStatsContent: StatsBlockProps = {
  title: 'Управляйте хранением из любой точки',
  subtitle: 'Следите за телеметрией и прогнозом в личном кабинете после установки генератора.',
  stats: [
    { value: '+4,2°C', label: 'Температура (средняя)' },
    { value: '87%', label: 'Влажность' },
    { value: '920 ppm', label: 'CO₂' },
    { value: 'Норма', label: 'C₂H₄ / O₃' },
  ],
};

export const damiatGeneratorBenefitsContent: ChooseUsBlockProps = {
  title: 'Польза генератора для хранилища',
  titleAccent: 'генератора',
  titleClassName: '!font-semibold',
  cardTitleClassName: 'desktop:text-style-h4 !font-semibold',
  featuredContentAlign: 'top',
  featuredTitleClassName: '!font-semibold',
  cards: [
    {
      id: 'preservation',
      size: 'wide',
      icon: damiatCardIcon('card-f15224e653'),
      title: 'Длительная сохранность',
      description:
        'Клубни дольше остаются в товарном состоянии: меньше убыли и порчи. Продаёте в нужный месяц — а не когда качество уже падает.',
    },
    {
      id: 'ripening',
      size: 'wide',
      icon: damiatCardIcon('card-e5990fea2b'),
      title: 'Дозаривание перед реализацией',
      description:
        'Режим дозаривания выравнивает созревание партии и готовит картофель к отгрузке — без химической обработки.',
    },
    {
      id: 'sprout-control',
      size: 'narrow',
      icon: damiatCardIcon('card-7fe8be0e6a'),
      title: 'Контроль прорастания на хранении',
      description:
        'Замедляет прорастание и физиологическое старение на длинном хранении — клубни дольше «спят» и не теряют массу.',
    },
    {
      id: 'sale-prep',
      size: 'narrow',
      icon: damiatCardIcon('card-8a270b4af6'),
      title: 'Подготовка партии к продаже',
      description:
        'Управляемый этилен помогает подвести партию к нужному состоянию перед отгрузкой: от сдерживания прорастания до дозаривания.',
    },
    {
      id: 'market-mass',
      size: 'narrow',
      icon: damiatCardIcon('card-83888742fd'),
      title: 'Больше массы доходит до рынка',
      description:
        'С контролируемой газовой средой теряете меньше тонн на складе — больше урожая превращается в выручку с того же объёма хранения.',
    },
  ],
  featured: {
    title: 'Эко-технология без химикатов',
    titleBreakBefore: ' без химикатов',
    description:
      'Сохранение урожая за счёт контролируемой атмосферы и этилена — без хлора, ингибиторов прорастания и антисептиков. Меньше food loss, безопаснее для продукта и персонала.',
    media: damiatFeaturedCover('card-52257113ea'),
  },
};

export const damiatCaseStudiesContent: DamiatCaseStudiesBlockProps = {
  title: 'Истории внедрения',
  subtitle: 'Результаты хранения картофеля с контролируемой газовой средой и генератором DAMIAT',
  viewAll: { label: 'Все истории', href: '#case' },
  cases: [
    {
      id: 'agro-holding',
      title: 'ООО «Агро холдинг»',
      meta: 'Краснодарский край, 2025 · хранение 15 000 т картофеля',
      href: '#case',
      ...damiatCaseStudyImagesById['agro-holding'],
      stats: [
        { value: '4–6,5%', label: 'потери с КГС и этиленом' },
        { value: '12–17%', label: 'потери без КГС' },
        { value: '1 200 т', label: 'сохранённая масса (8% от 15 000 т)' },
        { value: '38,25 млн ₽', label: 'чистый экономический эффект' },
      ],
    },
    {
      id: 'belgorod-potato',
      title: 'КПК «Белгородский картофель»',
      meta: 'Белгородская область, 2024 · хранение 8 200 т картофеля',
      href: '#case',
      ...damiatCaseStudyImagesById['belgorod-potato'],
      stats: [
        { value: '5–7%', label: 'потери с КГС и этиленом' },
        { value: '13–16%', label: 'потери без КГС' },
        { value: '656 т', label: 'сохранённая масса (8% от 8 200 т)' },
        { value: '21,4 млн ₽', label: 'чистый экономический эффект' },
      ],
    },
    {
      id: 'severprom',
      title: '«СеверПром Картофель»',
      meta: 'Ленинградская область, 2025 · хранение 5 200 т картофеля',
      href: '#case',
      ...damiatCaseStudyImagesById['severprom'],
      stats: [
        { value: '4–6%', label: 'потери с КГС и этиленом' },
        { value: '14–18%', label: 'потери без КГС' },
        { value: '416 т', label: 'сохранённая масса (8% от 5 200 т)' },
        { value: '13,6 млн ₽', label: 'чистый экономический эффект' },
      ],
    },
    {
      id: 'volga-agro',
      title: '«Волга Агро Склад»',
      meta: 'Саратовская область, 2024 · хранение 11 000 т картофеля',
      href: '#case',
      ...damiatCaseStudyImagesById['volga-agro'],
      stats: [
        { value: '4–6,5%', label: 'потери с КГС и этиленом' },
        { value: '11–16%', label: 'потери без КГС' },
        { value: '880 т', label: 'сохранённая масса (8% от 11 000 т)' },
        { value: '28,6 млн ₽', label: 'чистый экономический эффект' },
      ],
    },
    {
      id: 'urals-tubers',
      title: '«Уральские клубни»',
      meta: 'Свердловская область, 2025 · хранение 6 800 т картофеля',
      href: '#case',
      ...damiatCaseStudyImagesById['urals-tubers'],
      stats: [
        { value: '5–7%', label: 'потери с КГС и этиленом' },
        { value: '12–16%', label: 'потери без КГС' },
        { value: '544 т', label: 'сохранённая масса (8% от 6 800 т)' },
        { value: '17,8 млн ₽', label: 'чистый экономический эффект' },
      ],
    },
  ],
};

export const damiatVolumeBenefitContent: DamiatVolumeBenefitBlockProps = {
  title: 'Выгода от DAMIAT по объёму хранения',
  subtitle: 'Чем больше объём — тем выше выгода с генератором DAMIAT. Расчёт по прогнозу оптовых цен картофеля.',
  volumeStepsTons: [1_000, 3_000, 5_000, 8_000, 10_000, 15_000, 20_000],
  calculatorHref: '#calculator',
  calculatorCtaLabel: 'Рассчитать под своё хозяйство',
};

export const damiatTrustContent: TrustBlockProps = {
  title: 'Подтверждения и отрасль',
  pillars: [
    {
      featured: true,
      title: 'Сколково и пилотные внедрения',
      description: 'Резидент фонда «Сколково», участие в AgroTech и Golden Potato, пилоты в ЮФО и ЦФО.',
      cover: damiatFeaturedCover('card-da1bb29476'),
    },
    {
      title: 'Участие в выставках',
      description: 'AgroTech, Golden Potato, отраслевые форумы 2024–2026.',
      cover: damiatTrustCover('card-43a44f1f5a'),
    },
  ],
  standardsTitle: 'Подтверждения',
  standards: [
    { title: 'Сколково', description: 'Резидент — цифровизация агросектора', href: '#' },
    { title: 'Пилоты', description: 'Внедрения в ЮФО и ЦФО', href: '#case' },
    { title: 'Интеграции', description: 'Росстат, SCADA прибора, погодные API', href: '#' },
    { title: 'GreenTech', description: 'Снижение food loss без хлора и ингибиторов', href: '#' },
  ],
};

export const damiatPartnersContent: PartnersBlockProps = {
  title: 'Партнёры и отрасль',
  partners: damiatPartnerItems,
};

export const damiatContactHeroContent: ContactHeroBlockProps = {
  title: 'Запросите расчёт и демо платформы',
  description:
    'Оставьте контакты — рассчитаем экономику хранения под ваш объём и покажем, как управлять урожаем в DAMIAT.',
  submitLabel: 'Отправить заявку',
  labels: {
    name: 'Имя',
    phone: 'Телефон',
    company: 'Хозяйство или компания',
  },
};

export const damiatFooterContent: FooterBlockProps = {
  variant: 'enterprise',
  logo: 'DAMIAT',
  logoHref: '#',
  copyright: '© 2026 DAMIAT. Agro Capital Intelligence',
  navLinks: [
    { label: 'Калькулятор', href: '#calculator' },
    { label: 'Сценарии', href: '#scenarios' },
    { label: 'Прибор', href: '#device' },
    { label: 'Кейсы', href: '#case' },
    { label: 'Платформа', href: '#dashboard' },
    { label: 'Демо', href: '#demo' },
  ],
  contacts: [
    { label: 'Продукт', value: 'hello@damiat.io', href: 'mailto:hello@damiat.io' },
    { label: 'Внедрение', value: 'sales@damiat.io', href: 'mailto:sales@damiat.io' },
    { label: 'Телефон', value: '+7 (495) 000-00-00', href: 'tel:+74950000000' },
  ],
  legalLinks: [
    { label: 'Пользовательское соглашение', href: '#' },
    { label: 'Обработка персональных данных', href: '#' },
    {
      label: 'DAMIAT — генератор этилена и платформа хранения картофеля',
      href: '#about',
      multiline: true,
    },
  ],
  showBackToTop: true,
};

export const damiatLandingArgs: DamiatLandingPageProps = {
  navbar: damiatNavbarFixture,
  hero: damiatHeroContent,
  events: damiatEventsContent,
  problem: damiatProblemContent,
  calculator: damiatCalculatorContent,
  scenario: damiatScenarioContent,
  deviceIntro: damiatDeviceIntroContent,
  devicePrinciple: damiatDevicePrincipleContent,
  dashboardStats: damiatDashboardStatsContent,
  generatorBenefits: damiatGeneratorBenefitsContent,
  caseStudies: damiatCaseStudiesContent,
  volumeBenefit: damiatVolumeBenefitContent,
  trust: damiatTrustContent,
  partners: damiatPartnersContent,
  contactHero: damiatContactHeroContent,
  footer: damiatFooterContent,
};
