import type { Meta, StoryObj } from '@storybook/react';
import { CabinetStatsStrip } from './CabinetStatsStrip';
import { marketingBlockParameters } from '../../_shared/blockStoryViewports';
import { damiatCabinetTelemetry } from '../damiatCabinetFixtures';

const meta: Meta<typeof CabinetStatsStrip> = {
  title: 'Blocks/Marketing/CabinetStatsStrip',
  component: CabinetStatsStrip,
  parameters: marketingBlockParameters,
  args: {
    stats: damiatCabinetTelemetry,
  },
};
export default meta;

type Story = StoryObj<typeof CabinetStatsStrip>;

export const Desktop: Story = { parameters: { viewport: { defaultViewport: 'desktop' } } };
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile' } } };
