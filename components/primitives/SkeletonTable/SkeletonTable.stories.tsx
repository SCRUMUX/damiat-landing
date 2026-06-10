import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SkeletonTable } from './SkeletonTable';
import type { SkeletonTableSize } from './SkeletonTable.types';

const meta: Meta<typeof SkeletonTable> = {
  title: 'Primitives/Skeleton/Table',
  component: SkeletonTable,
  parameters: {
    docs: { description: { component: '`@UI/Skeleton/Table` — шаблон-заглушка для таблицы. Header + data rows с вертикальными разделителями колонок.' } },
    layout: 'centered',
  },
  argTypes: {
    size:    { control: 'select', options: ['sm', 'md', 'lg'] },
    shimmer: { control: 'boolean' },
    rows:    { control: 'number' },
    cols:    { control: 'number' },
  },
};
export default meta;
type Story = StoryObj<typeof SkeletonTable>;

export const Default: Story = { args: { size: 'sm', shimmer: true, rows: 4, cols: 4 } };

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 16 }}>
      {(['sm', 'md', 'lg'] as SkeletonTableSize[]).map((s) => (
        <div key={s}>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 6 }}>size={s}</div>
          <SkeletonTable size={s} shimmer />
        </div>
      ))}
    </div>
  ),
};

export const NoShimmer: Story = { args: { size: 'sm', shimmer: false } };
export const ThreeColumns: Story = { args: { size: 'sm', shimmer: true, cols: 3 } };

export const FullMatrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: 16 }}>
      {(['sm', 'md', 'lg'] as SkeletonTableSize[]).map((s) => (
        <div key={s} style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 4 }}>{s} shimmer</div>
            <SkeletonTable size={s} shimmer />
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 4 }}>{s} static</div>
            <SkeletonTable size={s} shimmer={false} />
          </div>
        </div>
      ))}
    </div>
  ),
};
