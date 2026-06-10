import type { Meta, StoryObj } from '@storybook/react';
import { DamiatCabinetPage } from './DamiatCabinetPage';
import { marketingBlockParameters } from '@ai-ds/core/blocks/_shared/blockStoryViewports';
import { damiatCabinetArgs } from '../damiatCabinetFixtures';

const meta: Meta<typeof DamiatCabinetPage> = {
  title: 'Screens/DAMIAT Cabinet',
  component: DamiatCabinetPage,
  parameters: {
    ...marketingBlockParameters,
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Личный кабинет DAMIAT — app-shell с sidebar, KPI-телеметрия и панели мониторинга (C₂H₄ / CO₂ / микроклимат) из лендинга.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof DamiatCabinetPage>;

export const Overview: Story = {
  render: () => <DamiatCabinetPage {...damiatCabinetArgs} />,
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const EthylenePanel: Story = {
  render: () => <DamiatCabinetPage {...damiatCabinetArgs} defaultActiveId="c2h4" />,
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const Mobile: Story = {
  render: () => <DamiatCabinetPage {...damiatCabinetArgs} />,
  parameters: { viewport: { defaultViewport: 'mobile' } },
};
