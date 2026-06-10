import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SkeletonChart } from './SkeletonChart';
import type { SkeletonChartSize, SkeletonChartType } from './SkeletonChart.types';

const meta: Meta<typeof SkeletonChart> = {
  title: 'Primitives/Skeleton/Chart',
  component: SkeletonChart,
  parameters: {
    docs: { description: { component: '`@UI/Skeleton/Chart` — шаблон-заглушка для графика. chartType: bar | line | donut.' } },
    layout: 'centered',
  },
  argTypes: {
    size:      { control: 'select', options: ['sm', 'md', 'lg'] },
    shimmer:   { control: 'boolean' },
    chartType: { control: 'select', options: ['bar', 'line', 'donut'] },
  },
};
export default meta;
type Story = StoryObj<typeof SkeletonChart>;

export const Default: Story = { args: { size: 'sm', shimmer: true, chartType: 'bar' } };

export const AllChartTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', padding: 16 }}>
      {(['bar', 'line', 'donut'] as SkeletonChartType[]).map((t) => (
        <div key={t}>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 6 }}>chartType={t}</div>
          <SkeletonChart size="sm" shimmer chartType={t} />
        </div>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 16 }}>
      {(['sm', 'md', 'lg'] as SkeletonChartSize[]).map((s) => (
        <div key={s}>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 6 }}>size={s}</div>
          <SkeletonChart size={s} shimmer chartType="bar" />
        </div>
      ))}
    </div>
  ),
};

export const NoShimmer: Story = { args: { size: 'sm', shimmer: false, chartType: 'bar' } };

export const FullMatrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: 16 }}>
      {(['bar', 'line', 'donut'] as SkeletonChartType[]).map((t) => (
        <div key={t}>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 8 }}>chartType={t}</div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {(['sm', 'md', 'lg'] as SkeletonChartSize[]).map((s) => (
              <div key={s}>
                <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 4 }}>{s}</div>
                <SkeletonChart size={s} shimmer chartType={t} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};
