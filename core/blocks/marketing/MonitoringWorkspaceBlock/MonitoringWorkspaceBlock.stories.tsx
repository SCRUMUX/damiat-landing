import type { Meta, StoryObj } from '@storybook/react';
import { MonitoringWorkspaceBlock } from './MonitoringWorkspaceBlock';
import { marketingBlockParameters } from '../../_shared/blockStoryViewports';
import { damiatCabinetPanels } from '../damiatCabinetFixtures';

const meta: Meta<typeof MonitoringWorkspaceBlock> = {
  title: 'Blocks/Marketing/MonitoringWorkspaceBlock',
  component: MonitoringWorkspaceBlock,
  parameters: marketingBlockParameters,
  args: {
    panel: damiatCabinetPanels[0],
  },
};
export default meta;

type Story = StoryObj<typeof MonitoringWorkspaceBlock>;

export const Ethylene: Story = { parameters: { viewport: { defaultViewport: 'desktop' } } };

export const CO2: Story = {
  args: { panel: damiatCabinetPanels[1] },
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile' } },
};
