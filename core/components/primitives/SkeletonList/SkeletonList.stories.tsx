import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SkeletonList } from './SkeletonList';
import type { SkeletonListSize } from './SkeletonList.types';

const meta: Meta<typeof SkeletonList> = {
  title: 'Primitives/Skeleton/List',
  component: SkeletonList,
  parameters: {
    docs: { description: { component: '`@UI/Skeleton/List` — шаблон-заглушка для списка. Строки с Avatar + Label + Meta, разделённые dividers.' } },
    layout: 'centered',
  },
  argTypes: {
    size:    { control: 'select', options: ['sm', 'md', 'lg'] },
    shimmer: { control: 'boolean' },
    rows:    { control: 'number' },
  },
};
export default meta;
type Story = StoryObj<typeof SkeletonList>;

export const Default: Story = { args: { size: 'sm', shimmer: true, rows: 4 } };

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 16 }}>
      {(['sm', 'md', 'lg'] as SkeletonListSize[]).map((s) => (
        <div key={s}>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 6 }}>size={s}</div>
          <SkeletonList size={s} shimmer />
        </div>
      ))}
    </div>
  ),
};

export const NoShimmer: Story = { args: { size: 'sm', shimmer: false } };
export const ThreeRows: Story = { args: { size: 'sm', shimmer: true, rows: 3 } };

export const FullMatrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: 16 }}>
      {(['sm', 'md', 'lg'] as SkeletonListSize[]).map((s) => (
        <div key={s} style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 4 }}>{s} shimmer</div>
            <SkeletonList size={s} shimmer />
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 4 }}>{s} static</div>
            <SkeletonList size={s} shimmer={false} />
          </div>
        </div>
      ))}
    </div>
  ),
};
