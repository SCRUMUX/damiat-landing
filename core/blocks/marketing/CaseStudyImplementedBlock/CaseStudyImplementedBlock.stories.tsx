import type { Meta, StoryObj } from '@storybook/react';
import { CaseStudyImplementedBlock } from './CaseStudyImplementedBlock';
import { marketingBlockParameters } from '../../_shared/blockStoryViewports';

const meta: Meta<typeof CaseStudyImplementedBlock> = {
  title: 'Blocks/Marketing/CaseStudyImplementedBlock',
  component: CaseStudyImplementedBlock,
  parameters: marketingBlockParameters,
  args: {
    title: 'Что было реализовано?',
    intro:
      'На площадке заказчика установлен генератор этилена DAMIAT. Команда DAMIAT обеспечивает сопровождение систем:',
    items: [
      'Мониторинг CO₂ и O₂ 24/7',
      'Устранение и оповещение об отклонениях',
      'Контроль газовой среды в камерах хранения',
      'Управление этиленом',
      'SCADA-интеграция',
      'Отчётность и аналитика',
    ],
  },
};
export default meta;

type Story = StoryObj<typeof CaseStudyImplementedBlock>;

export const Desktop: Story = { parameters: { viewport: { defaultViewport: 'desktop' } } };
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile' } } };
