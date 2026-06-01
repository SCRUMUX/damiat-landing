/**
 * DAMIAT landing — partner logos from repo `/Partners`.
 */
import type { PartnerItem } from '../PartnersBlock/PartnersBlock.types';

import skolkovoLogo from '../../../Partners/Logo_of_the_Skolkovo_Foundation.svg.png';
import agroholdingLogo from '../../../Partners/agroholding.webp';
import rosnanoLogo from '../../../Partners/Rosnano.webp';
import efkoLogo from '../../../Partners/efko-scaled.jpg';
import sibagroLogo from '../../../Partners/SIBAGRO_white_logotip.jpg';
import vaminLogo from '../../../Partners/b771c3798c8433fbf95c8e0079dd8aef.png';
import resursLogo from '../../../Partners/98355f4671e6ca667bdb29fb45301e6a.jpg';
import miratorgLogo from '../../../Partners/c61ece50-2106-4b9c-8939-b1a6d45c91ce.jpg';
import scadaSolutionsLogo from '../../../Partners/i.webp';
import rusagroLogo from '../../../Partners/rusagro_group_logo_ru-2048x718.png';
import rosselkhozbankLogo from '../../../Partners/ViewFile.png';
import ecocultureLogo from '../../../Partners/t15rjgdrpvf60nox3jmonnhpysxnv5nk.png';

export const damiatPartnerItems: PartnerItem[] = [
  {
    id: 'skolkovo',
    name: 'Сколково',
    imageSrc: skolkovoLogo,
    imageAlt: 'Фонд Сколково',
  },
  {
    id: 'rusagro',
    name: 'Русагро',
    imageSrc: rusagroLogo,
    imageAlt: 'Группа компаний Русагро',
  },
  {
    id: 'rosnano',
    name: 'Роснано',
    imageSrc: rosnanoLogo,
    imageAlt: 'РОСНАНО',
  },
  {
    id: 'agroholding',
    name: 'Агрохолдинг',
    imageSrc: agroholdingLogo,
    imageAlt: 'Агрохолдинг',
  },
  {
    id: 'efko',
    name: 'ЭФКО',
    imageSrc: efkoLogo,
    imageAlt: 'Группа компаний ЭФКО',
  },
  {
    id: 'sibagro',
    name: 'СибАгро',
    imageSrc: sibagroLogo,
    imageAlt: 'СибАгро',
  },
  {
    id: 'miratorg',
    name: 'Мираторг',
    imageSrc: miratorgLogo,
    imageAlt: 'Мираторг',
  },
  {
    id: 'rosselkhozbank',
    name: 'Россельхозбанк',
    imageSrc: rosselkhozbankLogo,
    imageAlt: 'Россельхозбанк',
  },
  {
    id: 'vamin',
    name: 'ВАМИН',
    imageSrc: vaminLogo,
    imageAlt: 'ВАМИН',
  },
  {
    id: 'resurs',
    name: 'ГАП «Ресурс»',
    imageSrc: resursLogo,
    imageAlt: 'Группа агропредприятий Ресурс',
  },
  {
    id: 'scada-solutions',
    name: 'SCADA Solutions',
    imageSrc: scadaSolutionsLogo,
    imageAlt: 'SCADA Solutions',
  },
  {
    id: 'ecoculture',
    name: 'Эко-культура',
    imageSrc: ecocultureLogo,
    imageAlt: 'Эко-культура',
  },
];
