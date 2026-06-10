import type { Meta, StoryObj } from '@storybook/react';
import { CaseStudySectionsBlock } from './CaseStudySectionsBlock';
import { marketingBlockParameters } from '../../_shared/blockStoryViewports';

const meta: Meta<typeof CaseStudySectionsBlock> = {
  title: 'Blocks/Marketing/CaseStudySectionsBlock',
  component: CaseStudySectionsBlock,
  parameters: marketingBlockParameters,
  args: {
    sections: [
      {
        title: 'Зачем это заказчику?',
        paragraphs: [
          'После роста объёмов хранения команда столкнулась с нестабильной газовой средой в боксах: потери без контроля CO₂ и O₂ достигали 12–17% за сезон.',
        ],
        quote: {
          text: 'Нам нужен был не разовый аудит, а постоянный контроль среды — без хлора и без ручных замеров в каждом боксе.',
          attribution: 'Директор по производству',
          role: 'ООО «Агро холдинг»',
        },
      },
      {
        title: 'Результат',
        paragraphs: [
          'За первый сезон с генератором DAMIAT потери снизились до 4–6,5%, команда получила единую панель мониторинга и прогнозируемую экономику хранения.',
        ],
      },
    ],
  },
};
export default meta;

type Story = StoryObj<typeof CaseStudySectionsBlock>;

export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile' } } };
export const Tablet: Story = { parameters: { viewport: { defaultViewport: 'tablet' } } };
export const Desktop: Story = { parameters: { viewport: { defaultViewport: 'desktop' } } };
