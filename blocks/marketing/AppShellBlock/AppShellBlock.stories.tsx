import type { Meta, StoryObj } from '@storybook/react';
import { AppShellBlock } from './AppShellBlock';
import { marketingBlockParameters } from '../../_shared/blockStoryViewports';
import { damiatCabinetNav } from '../damiatCabinetFixtures';

const meta: Meta<typeof AppShellBlock> = {
  title: 'Blocks/Marketing/AppShellBlock',
  component: AppShellBlock,
  parameters: marketingBlockParameters,
  args: {
    storageLabel: 'Краснодар · Бокс 3',
    userLabel: 'ООО «Агро холдинг»',
    nav: damiatCabinetNav,
    activeId: 'overview',
    children: <p className="m-0 text-style-body text-[var(--color-text-secondary)]">Main content area</p>,
  },
};
export default meta;

type Story = StoryObj<typeof AppShellBlock>;

export const Desktop: Story = { parameters: { viewport: { defaultViewport: 'desktop' } } };
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile' } } };
