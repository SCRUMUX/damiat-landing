/**
 * DAMIAT case detail page — fixtures for «ООО «Агро холдинг»» (Cortel long-read layout).
 */
import type { NavbarBlockProps } from '@ai-ds/core/blocks/NavbarBlock';
import type { HeroBlockProps } from '@ai-ds/core/blocks/HeroBlock';
import type { SolutionsBlockProps, SolutionItem } from '@ai-ds/core/blocks/SolutionsBlock';
import type { FooterBlockProps } from '@ai-ds/core/blocks/FooterBlock';
import type { ContactHeroBlockProps } from '@ai-ds/core/blocks/ContactHeroBlock';
import type { CaseStudyIntroBlockProps } from '@ai-ds/core/blocks/CaseStudyIntroBlock';
import type { CaseStudyInlineStatsBlockProps } from '@ai-ds/core/blocks/CaseStudyInlineStatsBlock';
import type { CaseStudyImplementedBlockProps } from '@ai-ds/core/blocks/CaseStudyImplementedBlock';
import type { CaseStudySectionsBlockProps } from '@ai-ds/core/blocks/CaseStudySectionsBlock';
import type { CaseStudyAnchorNavProps } from './CaseStudyAnchorNav';
import type { DamiatCaseDetailPageProps } from './DamiatCaseDetailPage/DamiatCaseDetailPage';
import type { CaseStudyItem } from './DamiatCaseStudiesBlock/DamiatCaseStudiesBlock.types';
import {
  damiatCaseStudiesContent,
  damiatContactHeroContent,
  damiatFooterContent,
  damiatNavbarFixture,
} from './damiatLandingFixtures';

const CURRENT_CASE_ID = 'agro-holding';

function parseCaseMeta(meta: string): { region: string; date: string; volumeLine: string } {
  const parts = meta.split(' · ');
  const regionDate = parts[0] ?? meta;
  const commaIndex = regionDate.lastIndexOf(',');
  const region = commaIndex >= 0 ? regionDate.slice(0, commaIndex).trim() : regionDate;
  const yearMatch = regionDate.match(/\d{4}/);
  return {
    region,
    date: yearMatch?.[0] ?? '',
    volumeLine: parts[1] ?? meta,
  };
}

function mapCaseToSolutionItem(caseItem: CaseStudyItem): SolutionItem {
  const { date, volumeLine } = parseCaseMeta(caseItem.meta);
  const savedMass = caseItem.stats[2];
  const effect = caseItem.stats[3];

  return {
    id: caseItem.id,
    category: 'Агро',
    title: `Контролируемая газовая среда — ${volumeLine}`,
    description: savedMass ? `${savedMass.value} ${savedMass.label}` : volumeLine,
    highlights: effect ? [`${effect.value} ${effect.label}`] : undefined,
    client: caseItem.title,
    date,
    href: caseItem.href ?? '#case',
    imageSrc: caseItem.imageSrc,
    imageAlt: caseItem.imageAlt,
  };
}

export const damiatCaseDetailNavbar: NavbarBlockProps = {
  ...damiatNavbarFixture,
};

export const damiatCaseDetailHero: HeroBlockProps = {
  variant: 'page',
  appearance: 'brand',
  breadcrumbs: [
    { label: 'Главная', href: '#' },
    { label: 'Кейсы', href: '#case' },
    { label: 'ООО «Агро холдинг»' },
  ],
  title: 'Контролируемая газовая среда и генератор DAMIAT для хранения 15 000 т картофеля',
};

export const damiatCaseDetailIntro: CaseStudyIntroBlockProps = {
  leadParagraphs: [
    'Заказчик — агрохолдинг Юга России с сетью хранилищ картофеля. На площадке в Краснодарском крае в сезон 2025 хранится до 15 000 т клубней — объём, при котором даже небольшой рост потерь напрямую бьёт по марже.',
  ],
  highlights: [
    { label: 'Объём хранения', value: '15 000 т картофеля' },
    { label: 'Регион', value: 'Краснодарский край' },
  ],
  trailParagraphs: [
    'Команда искала способ снизить естественные потери без хлорирования и без ручного контроля газовой среды в каждом боксе. После пилота с генератором этилена DAMIAT холдинг масштабировал решение на ключевые камеры хранения и обратился к команде DAMIAT за сопровождением.',
  ],
};

export const damiatCaseDetailAnchorNav: Pick<CaseStudyAnchorNavProps, 'items'> = {
  items: [
    { id: 'case-business-results', label: 'Бизнес-результаты' },
    { id: 'case-implemented', label: 'Что было реализовано?' },
    { id: 'case-why', label: 'Зачем это заказчику?' },
    { id: 'case-vendor', label: 'Как искали подрядчика?' },
    { id: 'case-delivered', label: 'Что получил заказчик?' },
    { id: 'case-result', label: 'Результат' },
  ],
};

export const damiatCaseDetailBusinessResults: CaseStudyInlineStatsBlockProps = {
  sectionId: 'case-business-results',
  title: 'Бизнес-результаты',
  stats: [
    {
      value: '4–6,5%',
      label: 'потери с КГС и генератором DAMIAT — вместо 12–17% без контроля среды',
    },
    {
      value: '38,25 млн ₽',
      label: 'чистый экономический эффект за сезон хранения',
    },
  ],
};

export const damiatCaseDetailImplemented: CaseStudyImplementedBlockProps = {
  sectionId: 'case-implemented',
  title: 'Что было реализовано?',
  intro:
    'На площадке заказчика установлен генератор этилена DAMIAT и подключена платформа мониторинга газовой среды. Команда DAMIAT обеспечивает сопровождение систем:',
  items: [
    'Мониторинг CO₂ и O₂ 24/7',
    'Устранение и оповещение об отклонениях',
    'Контроль газовой среды в камерах хранения',
    'Управление этиленом',
    'SCADA-интеграция и телеметрия',
    'Отчётность и аналитика',
  ],
};

export const damiatCaseDetailNarrative: CaseStudySectionsBlockProps = {
  sections: [
    {
      id: 'case-why',
      title: 'Зачем это заказчику?',
      paragraphs: [
        'После расширения мощностей хранения команда столкнулась с нестабильной газовой средой: без контроля CO₂ и O₂ потери достигали 12–17% за сезон, а ручные замеры не успевали за темпом работы склада.',
        'Руководство поставило задачу — снизить food loss, сохранить качество клубней к отгрузке и получить прозрачную экономику хранения без хлорирования.',
      ],
      quote: {
        text: 'Нам нужен был не разовый аудит, а постоянный контроль среды — без хлора и без обходов каждого бокса с газоанализатором.',
        attribution: 'Директор по производству',
      },
    },
    {
      id: 'case-vendor',
      title: 'Как искали подрядчика?',
      paragraphs: [
        'Холдинг рассматривал несколько подходов: классическое хлорирование, ручной мониторинг и автоматизированную контролируемую газовую среду. Пилот DAMIAT провели на одной камере в 2024 году — команда сравнила фактические потери с контрольной площадкой.',
        'По итогам пилота генератор этилена и платформа мониторинга показали устойчивое снижение потерь при предсказуемых операционных затратах.',
      ],
      quote: {
        text: 'Мы уже видели результаты DAMIAT на пилоте — поэтому для основного сезона выбрали масштабирование, а не эксперименты с хлором.',
        attribution: 'Главный агроном',
      },
    },
    {
      id: 'case-delivered',
      title: 'Что получил заказчик?',
      bullets: [
        'Снижение потерь до 4–6,5% при контролируемой газовой среде',
        'Сохранение 1 200 т картофеля — 8% от 15 000 т объёма хранения',
        'Панель мониторинга с историей показаний и оповещениями',
        'Персональное сопровождение команды DAMIAT в первый сезон',
      ],
      quote: {
        text: 'Главное — мы видим цифры в реальном времени и понимаем экономику каждой камеры, а не узнаём о проблеме по итогам отгрузки.',
        attribution: 'Директор по производству',
      },
    },
    {
      id: 'case-result',
      title: 'Результат',
      paragraphs: [
        'За сезон 2025 холдинг снизил потери, сохранил качество клубней к контрактным отгрузкам и зафиксировал чистый экономический эффект 38,25 млн ₽. Решение масштабируется на остальные площадки группы.',
      ],
    },
  ],
};

export const damiatCaseDetailRelatedProjects: Extract<SolutionsBlockProps, { variant: 'grid' }> = {
  variant: 'grid',
  title: 'Реализованные проекты',
  solutions: damiatCaseStudiesContent.cases
    .filter((caseItem) => caseItem.id !== CURRENT_CASE_ID)
    .map(mapCaseToSolutionItem),
  viewAll: { label: 'Все истории', href: '#case' },
};

export const damiatCaseDetailContactHero: ContactHeroBlockProps = damiatContactHeroContent;

export const damiatCaseDetailFooter: FooterBlockProps = damiatFooterContent;

export const damiatCaseDetailArgs: DamiatCaseDetailPageProps = {
  navbar: damiatCaseDetailNavbar,
  hero: damiatCaseDetailHero,
  intro: damiatCaseDetailIntro,
  anchorNav: damiatCaseDetailAnchorNav,
  businessResults: damiatCaseDetailBusinessResults,
  implemented: damiatCaseDetailImplemented,
  narrative: damiatCaseDetailNarrative,
  relatedProjects: damiatCaseDetailRelatedProjects,
  contactHero: damiatCaseDetailContactHero,
  footer: damiatCaseDetailFooter,
};
