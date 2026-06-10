/**
 * DAMIAT landing — partner logos (text labels when image assets are not in repo).
 */
import type { PartnerItem } from '@ai-ds/core/blocks/PartnersBlock/PartnersBlock.types';

const labelLogo = (name: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 48"><rect width="200" height="48" rx="8" fill="#f1f5f9"/><text x="100" y="30" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="600" fill="#0f172a">${name}</text></svg>`,
  )}`;

export const damiatPartnerItems: PartnerItem[] = [
  { id: 'skolkovo', name: 'Сколково', imageSrc: labelLogo('Сколково'), imageAlt: 'Фонд Сколково' },
  { id: 'rusagro', name: 'Русагро', imageSrc: labelLogo('Русагро'), imageAlt: 'Группа компаний Русагро' },
  { id: 'efko', name: 'ЭФКО', imageSrc: labelLogo('ЭФКО'), imageAlt: 'ЭФКО' },
  { id: 'miratorg', name: 'Мираторг', imageSrc: labelLogo('Мираторг'), imageAlt: 'Мираторг' },
  { id: 'rosnano', name: 'Роснано', imageSrc: labelLogo('Роснано'), imageAlt: 'Роснано' },
  { id: 'agroholding', name: 'Агрохолдинг', imageSrc: labelLogo('Агрохолдинг'), imageAlt: 'Агрохолдинг' },
];
