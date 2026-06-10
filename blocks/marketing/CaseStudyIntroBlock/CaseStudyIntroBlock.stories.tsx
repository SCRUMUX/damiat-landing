import type { Meta, StoryObj } from '@storybook/react';
import { CaseStudyIntroBlock } from './CaseStudyIntroBlock';
import { marketingBlockParameters } from '../../_shared/blockStoryViewports';

const meta: Meta<typeof CaseStudyIntroBlock> = {
  title: 'Blocks/Marketing/CaseStudyIntroBlock',
  component: CaseStudyIntroBlock,
  parameters: marketingBlockParameters,
  args: {
    leadParagraphs: [
      'Заказчик — крупный агрохолдинг Юга России с сетью хранилищ картофеля. На площадке в Краснодарском крае хранится до 15 000 т клубней в сезон.',
    ],
    highlights: [
      { label: 'Объём хранения', value: '15 000 т картофеля' },
      { label: 'Регион', value: 'Краснодарский край' },
    ],
    trailParagraphs: [
      'Перед сезоном 2025 команда искала способ снизить естественные потери без хлорирования. Холдинг обратился к DAMIAT.',
    ],
  },
};
export default meta;

type Story = StoryObj<typeof CaseStudyIntroBlock>;

export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile' } } };
export const Tablet: Story = { parameters: { viewport: { defaultViewport: 'tablet' } } };
export const Desktop: Story = { parameters: { viewport: { defaultViewport: 'desktop' } } };
