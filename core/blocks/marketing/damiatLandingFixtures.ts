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
import type { TrustBlockProps } from './TrustBlock';
import type { PartnersBlockProps } from './PartnersBlock';
import type { LogoCloudBlockProps } from './LogoCloudBlock';
import type { ContactHeroBlockProps } from './ContactHeroBlock';
import type { FooterBlockProps } from './FooterBlock';
import type { EventsBlockProps } from './EventsBlock/EventsBlock';
import type { DamiatLandingPageProps } from './DamiatLandingPage/DamiatLandingPage';

export const damiatNavbarFixture: NavbarBlockProps = {
  variant: 'enterprise',
  logo: 'DAMIAT',
  sticky: true,
  overlay: true,
  staticGlass: true,
  links: [
    { label: 'Мероприятия', href: '#events' },
    { label: 'Калькулятор', href: '#calculator' },
    { label: 'Сценарии', href: '#scenarios' },
    { label: 'Прибор', href: '#device' },
    { label: 'Кейсы', href: '#case' },
    { label: 'Платформа', href: '#dashboard' },
  ],
  phone: {
    number: 'Демо-режим',
    href: '#demo',
    status: { label: 'Поддержка', href: '#support' },
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
    { value: '4–6,5%', label: 'потери с КГС и этиленом' },
    { value: '6 точек', label: 'контроля температуры' },
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
  title: 'Почему без контролируемой газовой среды теряется урожай',
  subtitle:
    'Без этиленгенератора ускоряется созревание, растёт дыхание клубней и активизируются болезни — потери доходят до 12–17% массы.',
  columns: 2,
  features: [
    {
      title: 'Прорастание и созревание',
      description: 'Естественное накопление этилена ускоряет физиологическое старение клубней.',
      icon: '🌱',
    },
    {
      title: 'Усушка и порча',
      description: 'Метаболизм и патогены без КГС снижают товарный вид и массу партии.',
      icon: '💧',
    },
    {
      title: 'Потери 12–17%',
      description: 'Против 4–6,5% при контролируемой атмосфере и этиленгенераторе DAMIAT.',
      icon: '📉',
    },
    {
      title: 'Неверный момент продажи',
      description: 'Снижение качества и рыночный тайминг вместе съедают маржу хозяйства.',
      icon: '⏱',
    },
  ],
};

export const damiatCalculatorContent: DamiatCalculatorBlockProps = {
  title: 'Рассчитайте стоимость урожая и выгоду от хранения',
  subtitle:
    'Укажите площадь посевов и урожайность картофеля — увидите прогноз цен по месяцам, потери и выгоду от генератора DAMIAT.',
  defaultValues: {
    hectares: '500',
    yieldTonsPerHa: '28',
    device1: true,
    manualBasePricePerTon: '',
    priceAdjustPercent: 0,
  },
};

export const damiatScenarioContent: ShowcasePanelBlockProps = {
  title: 'Выбирайте момент продажи урожая',
  titleBreakBefore: 'урожая',
  panels: [
    {
      id: 'growth',
      title: 'Сценарий: рост цены',
      bullets: [
        'Ожидайте рост +6–9% к концу срока хранения',
        'Держите партию до недели 22',
        'Поддерживайте микроклимат — этилен в норме',
      ],
      action: { label: 'Подробнее', href: '#growth' },
    },
    {
      id: 'decline',
      title: 'Сценарий: падение',
      bullets: [
        'Учитывайте давление предложения на оптовом рынке',
        'Отгрузите часть партии в течение 14 дней',
        'Снизьте риск усушки — проверьте C₂H₄',
      ],
      action: { label: 'Подробнее', href: '#decline' },
    },
    {
      id: 'stable',
      title: 'Сценарий: стабильность',
      bullets: [
        'Планируйте при боковом тренде ±2%',
        'Отгружайте равномерно по графику',
        'Поддерживайте КГС и режим озонирования',
      ],
      action: { label: 'Подробнее', href: '#stable' },
    },
  ],
};

export const damiatDeviceIntroContent: WhyUsBlockProps = {
  title: 'Промышленный генератор этилена DAMIAT',
  titleBreakBefore: 'этилена',
  primaryCards: [
    {
      title: 'Автономность',
      description: 'До 2 недель по топливу и до 24 часов по электропитанию — непрерывный контроль КГС.',
    },
    {
      title: '6 точек температуры',
      description: 'Непрерывный контроль продукта, камеры, влажности, CO₂, C₂H₄ и O₃.',
    },
  ],
  secondaryCards: [
    {
      title: 'Связь и архив',
      description: 'Интеграция в мониторинг через интернет, архив параметров до 2 лет.',
    },
    {
      title: 'Мониторинг 24/7',
      description: 'Специалисты DAMIAT удалённо следят за состоянием хранилища.',
    },
    {
      title: 'Экономия топлива',
      description: 'Конструкция реактора снижает расход до 20%, в т.ч. на низкосортном топливе.',
    },
  ],
  featured: {
    title: 'Держите микроклимат под контролем',
    description:
      'Устанавливайте генератор для КГС: снижайте потери, сохраняйте товарный вид картофеля и увеличивайте доход при реализации.',
  },
};

export const damiatDevicePrincipleContent: ProcessBlockProps = {
  title: 'Как работает генератор',
  steps: [
    {
      title: 'Измерение микроклимата',
      description: 'Контроллер отслеживает T°, влажность, CO₂, C₂H₄ и O₃ в камере и в продукте.',
    },
    {
      title: 'Регулирование этилена',
      description: 'Поддерживается состав атмосферы, замедляется созревание и дыхание клубней.',
    },
    {
      title: 'Озонирование',
      description: 'Озонатор подключается к генератору и работает по заданным программам обеззараживания.',
    },
    {
      title: 'Сохранность урожая',
      description: 'Снижаются потери от убыли, болезней и механических повреждений при отгрузке.',
    },
    {
      title: 'Данные в платформу',
      description: 'Телеметрия уходит в архив и DAMIAT — прогноз рисков и рекомендации по продаже.',
    },
  ],
};

export const damiatDeviceCapabilitiesContent: FeaturesBlockProps = {
  eyebrow: 'Сравнение с аналогами',
  title: 'Технологические возможности DAMIAT',
  subtitle: 'По материалам производителя — ключевые отличия от типовых этиленгенераторов на рынке.',
  columns: 2,
  features: [
    {
      title: 'Автономность по топливу',
      description: 'До 2 недель — у аналогов обычно до 1 недели.',
      icon: '⛽',
    },
    {
      title: 'Резерв по электричеству',
      description: 'До 24 часов автономной работы — у аналогов, как правило, нет.',
      icon: '🔋',
    },
    {
      title: 'Точки контроля температуры',
      description: '6 точек в продукте и камере — у аналогов чаще 1.',
      icon: '🌡',
    },
    {
      title: 'Параметры газовой среды',
      description: 'CO₂, C₂H₄, O₃, влажность — расширенный набор vs CO₂, C₂H₄, T°.',
      icon: '📡',
    },
    {
      title: 'Интернет и архив',
      description: 'Подключение к мониторингу и архив до 2 лет — у аналогов обычно отсутствует.',
      icon: '☁',
    },
    {
      title: 'Озонатор и топливо',
      description: 'Управление озонатором с генератора; допуск некачественного топлива.',
      icon: '✓',
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

export const damiatDashboardAlertsContent: FeaturesBlockProps = {
  eyebrow: 'Личный кабинет',
  title: 'Реагируйте на отклонения до потери качества',
  columns: 3,
  features: [
    { title: 'Перегрев секции', description: 'Тренд выше порога — скорректировать вентиляцию.', icon: '🔥' },
    { title: 'Влажность', description: 'Отклонение от коридора КГС — риск усушки.', icon: '💧' },
    { title: 'Этилен', description: 'Концентрация C₂H₄ вне целевого диапазона.', icon: '⚗' },
    { title: 'Увеличить вентиляцию', description: 'Рекомендация по данным SCADA прибора.', icon: '↻' },
    { title: 'Снизить температуру', description: 'Целевой коридор для сохранности тургора.', icon: '❄' },
    { title: 'Момент отгрузки', description: 'Сигнал из сценария продажи и оценки хранения.', icon: '📈' },
  ],
};

export const damiatHowItWorksContent: ProcessBlockProps = {
  title: 'Как платформа дополняет прибор',
  steps: [
    { title: 'Данные рынка (Росстат)', description: 'Средние цены и динамика по региону и культуре.' },
    { title: 'Погодные API', description: 'Осадки, температура и сезонные факторы.' },
    { title: 'Телеметрия генератора', description: 'T°, влажность, O₃, C₂H₄, CO₂ с прибора DAMIAT.' },
    { title: 'Оценка хранения', description: 'Сводный балл сохранности и выгоды — от 0 до 100.' },
    { title: 'Рекомендации', description: 'Получайте сценарии продажи и действия по микроклимату.' },
  ],
};

export const damiatCaseStudyStatsContent: StatsBlockProps = {
  title: 'Кейс: ООО «Агро холдинг»',
  subtitle: 'Краснодарский край, 2025 · хранение 15 000 т картофеля',
  stats: [
    { value: '4–6,5%', label: 'потери с КГС и этиленом' },
    { value: '12–17%', label: 'потери без КГС (прогноз)' },
    { value: '1 200 т', label: 'сохранённая масса (8% от 15 000 т)' },
    { value: '38,25 млн ₽', label: 'чистый экономический эффект' },
  ],
};

export const damiatCaseStudyDetailsContent: FeaturesBlockProps = {
  eyebrow: 'Анализ потерь',
  title: 'Контролируемая газовая среда окупается на объёме хранения',
  subtitle:
    'При отказе от этиленгенератора растут убыль, болезни и механические потери. Расчёт для объёма «Агро холдинг»: 42 млн ₽ валовой выгоды минус 3,75 млн ₽ на этилен.',
  columns: 2,
  features: [
    {
      title: 'С этиленгенератором',
      description: 'Убыль 2–3%, болезни 1–2%, механика 1–1,5% — суммарно 4–6,5%.',
      icon: '✓',
    },
    {
      title: 'Без КГС',
      description: 'Убыль 5–7%, болезни 4–6%, механика 3–4% — суммарно 12–17%.',
      icon: '✕',
    },
    {
      title: 'Разница',
      description: '8–10,5 процентных пунктов — прямой рычаг урожайности и выручки.',
      icon: '📊',
    },
    {
      title: 'Экономика',
      description: '35 000 ₽/т реализация · 3 750 000 ₽ затраты на этилен · 38 250 000 ₽ эффект.',
      icon: '₽',
    },
  ],
};

export const damiatTrustContent: TrustBlockProps = {
  title: 'Агротехнологии и доверие',
  pillars: [
    {
      featured: true,
      title: 'Генератор этилена + цифровая платформа',
      description: 'Оборудование для КГС и аналитика хранения для агрохолдингов и операторов складов.',
    },
    {
      title: 'Участие в выставках',
      description: 'AgroTech, Golden Potato, отраслевые форумы 2024–2026.',
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
  partners: [
    { name: 'AgroTech', href: '#' },
    { name: 'Сколково', href: '#' },
    { name: 'Росстат', href: '#' },
    { name: 'Potato Union', href: '#' },
    { name: 'ColdChain', href: '#' },
    { name: 'FarmData', href: '#' },
  ],
};

export const damiatLogoCloudContent: LogoCloudBlockProps = {
  title: 'Нам доверяют операторы хранения',
  logos: [
    { name: 'AgroHold' },
    { name: 'North Potato' },
    { name: 'Volga Storage' },
    { name: 'GreenField' },
    { name: 'ColdLine' },
  ],
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
  deviceCapabilities: damiatDeviceCapabilitiesContent,
  dashboardStats: damiatDashboardStatsContent,
  dashboardAlerts: damiatDashboardAlertsContent,
  howItWorks: damiatHowItWorksContent,
  caseStudyStats: damiatCaseStudyStatsContent,
  caseStudyDetails: damiatCaseStudyDetailsContent,
  trust: damiatTrustContent,
  partners: damiatPartnersContent,
  logoCloud: damiatLogoCloudContent,
  contactHero: damiatContactHeroContent,
  footer: damiatFooterContent,
};
