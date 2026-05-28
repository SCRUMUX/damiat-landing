import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Paragraph } from './Paragraph';

const SIZES       = ['sm', 'md', 'lg'] as const;
const BREAKPOINTS = ['mobile', 'tablet', 'desktop-sm', 'desktop-lg'] as const;
const ALIGNS      = ['left', 'center', 'right', 'justify'] as const;

const SAMPLE_TEXT =
  'Machine-readable layout — structured interface markup that can be parsed by algorithms and AI. ' +
  'AICA DS (AI Component Architecture Design System) ensures consistency of components and tokens ' +
  'for automated generation and maintenance of design systems.';

const meta: Meta<typeof Paragraph> = {
  title: 'Primitives/Paragraph',
  component: Paragraph,
  parameters: {
    docs: {
      description: {
        component:
          'Paragraph (@UI/Paragraph): типографический блок для длинного текста. ' +
          '3 размера (sm/md/lg), 4 breakpoint-ширины (mobile/tablet/desktop-sm/desktop-lg). ' +
          'padding=32px. Цвет: --color-text-primary. ' +
          'Figma: 160:82623.',
      },
    },
  },
  argTypes: {
    size:       { control: 'select', options: SIZES },
    breakpoint: { control: 'select', options: BREAKPOINTS },
    align:      { control: 'select', options: ALIGNS },
  },
  decorators: [(Story) => (
    <div style={{ padding: 24, overflowX: 'auto' }}>
      <Story />
    </div>
  )],
};
export default meta;
type Story = StoryObj<typeof Paragraph>;

/* ── Default ── */
export const Default: Story = {
  args: {
    size:       'md',
    breakpoint: 'tablet',
    children:   SAMPLE_TEXT,
  },
};

/* ── Все размеры ── */
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {SIZES.map((s) => (
        <div key={s} style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
          <span style={{
            width: 24, fontSize: 11, color: 'var(--color-text-muted)',
            paddingTop: 32, paddingRight: 8, flexShrink: 0,
          }}>{s}</span>
          <Paragraph {...args} size={s} breakpoint="tablet" />
        </div>
      ))}
    </div>
  ),
  args: { children: SAMPLE_TEXT },
};

/* ── Все breakpoints ── */
export const AllBreakpoints: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {BREAKPOINTS.map((bp) => (
        <div key={bp} style={{ display: 'flex', alignItems: 'flex-start' }}>
          <span style={{
            width: 88, fontSize: 11, color: 'var(--color-text-muted)',
            paddingTop: 32, paddingRight: 8, flexShrink: 0,
          }}>{bp}</span>
          <Paragraph {...args} breakpoint={bp} />
        </div>
      ))}
    </div>
  ),
  args: { size: 'sm', children: SAMPLE_TEXT },
};

/* ── Выравнивания ── */
export const Alignments: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {ALIGNS.map((a) => (
        <div key={a} style={{ display: 'flex', alignItems: 'flex-start' }}>
          <span style={{
            width: 56, fontSize: 11, color: 'var(--color-text-muted)',
            paddingTop: 32, paddingRight: 8, flexShrink: 0,
          }}>{a}</span>
          <Paragraph {...args} align={a} breakpoint="tablet" />
        </div>
      ))}
    </div>
  ),
  args: { size: 'md', children: SAMPLE_TEXT },
};

/* ── Полная матрица: sizes × breakpoints ── */
export const FullMatrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {SIZES.map((s) => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={{
            fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.05em',
            padding: '8px 0 0 0',
          }}>
            size={s}
          </div>
          {BREAKPOINTS.map((bp) => (
            <div key={bp} style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span style={{
                width: 80, fontSize: 11, color: 'var(--color-text-muted)',
                paddingTop: 32, flexShrink: 0,
              }}>{bp}</span>
              <Paragraph size={s} breakpoint={bp}>{SAMPLE_TEXT}</Paragraph>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};
