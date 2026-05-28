/**
 * AUTO-GENERATED – do not edit by hand.
 * Regenerate: npm run stories:generate
 */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const APPEARANCES = ['brand', 'base', 'ghost', 'outline', 'success', 'warning', 'danger', 'info'] as const;
const SIZES = ['sm', 'md', 'lg'] as const;

const meta: Meta<typeof Badge> = {
  title: 'Primitives/Badge',
  component: Badge,
  parameters: {
    docs: { description: { component: "Badge: appearance (brand/base/ghost/outline/success/warning/danger/info). 3 размера. Только текст/число." } },
  },
  argTypes: {
    appearance: { control: 'select', options: APPEARANCES },
    size: { control: 'select', options: SIZES },
  },
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: { children: '99', appearance: 'brand', size: 'sm' },
};

export const AllAppearances: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', padding: 16 }}>
      {APPEARANCES.map((a) => (
        <Badge key={a} {...args} appearance={a}>{a}</Badge>
      ))}
    </div>
  ),
  args: { size: 'md' },
};

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 16 }}>
      {SIZES.map((s) => (
        <Badge key={s} {...args} size={s}>{s}</Badge>
      ))}
    </div>
  ),
  args: { appearance: 'brand' },
};

/** Матрица appearance × size */
export const VariantMatrix: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SIZES.length}, auto)`, gap: 8, padding: 16 }}>
      {APPEARANCES.flatMap((a) =>
        SIZES.map((s) => (
          <Badge key={a + s} {...args} appearance={a} size={s}>{a}</Badge>
        ))
      )}
    </div>
  ),
  args: {},
};
