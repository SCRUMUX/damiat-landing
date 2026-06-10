import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SectionHeader } from './SectionHeader';
import { SearchIcon, ChevronRightIcon, BellIcon, GearIcon } from '../../icons';
import { Badge } from '../Badge/Badge';

const SIZES = ['sm', 'md', 'lg'] as const;
const APPEARANCES = ['base', 'success', 'warning', 'danger'] as const;

const iconL = <SearchIcon style={{ width: '100%', height: '100%' }} />;
const iconR = <ChevronRightIcon style={{ width: '100%', height: '100%' }} />;
const badgeEl = <Badge appearance="brand" size="sm">5</Badge>;

const meta: Meta<typeof SectionHeader> = {
  title: 'Primitives/SectionHeader',
  component: SectionHeader,
  parameters: {
    docs: {
      description: {
        component:
          'SectionHeader (@UI/SectionHeader): иконка слева + лейбл + badge + иконка справа. ' +
          '3 размера (sm/md/lg), 4 вида (base, success, warning, danger). ' +
          'Figma: 160:72309.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: SIZES },
    appearance: { control: 'select', options: APPEARANCES },
    showLeftIcon: { control: 'boolean' },
    showBadge: { control: 'boolean' },
    showRightIcon: { control: 'boolean' },
    badge: { control: false },
    iconLeft: { control: false },
    iconRight: { control: false },
  },
};
export default meta;
type Story = StoryObj<typeof SectionHeader>;

/* ── Default: all slots visible ── */
export const Default: Story = {
  args: {
    children: 'Section',
    size: 'sm',
    appearance: 'base',
    showLeftIcon: true,
    iconLeft: iconL,
    showBadge: true,
    badge: badgeEl,
    showRightIcon: true,
    iconRight: iconR,
  },
};

/* ── Label only (no slots) ── */
export const LabelOnly: Story = {
  args: { children: 'Section', size: 'sm', appearance: 'base' },
};

/* ── All appearances ── */
export const AllAppearances: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      {APPEARANCES.map((a) => (
        <SectionHeader key={a} {...args} appearance={a}>
          {a}
        </SectionHeader>
      ))}
    </div>
  ),
  args: {
    size: 'sm',
    showLeftIcon: true,
    iconLeft: iconL,
    showBadge: true,
    badge: badgeEl,
    showRightIcon: true,
    iconRight: iconR,
  },
};

/* ── All sizes ── */
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      {SIZES.map((s) => (
        <SectionHeader key={s} {...args} size={s}>
          {s}
        </SectionHeader>
      ))}
    </div>
  ),
  args: {
    appearance: 'base',
    showLeftIcon: true,
    iconLeft: iconL,
    showBadge: true,
    badge: badgeEl,
    showRightIcon: true,
    iconRight: iconR,
  },
};

/* ── Full matrix: all appearances × all sizes ── */
export const AllAppearancesAllSizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: '8px 16px', alignItems: 'center' }}>
      {APPEARANCES.flatMap((a) =>
        SIZES.map((s) => (
          <SectionHeader
            key={a + s}
            size={s}
            appearance={a}
            showLeftIcon
            iconLeft={<BellIcon style={{ width: '100%', height: '100%' }} />}
            showBadge
            badge={<Badge appearance={a === 'base' ? 'brand' : a} size="sm">3</Badge>}
            showRightIcon
            iconRight={<GearIcon style={{ width: '100%', height: '100%' }} />}
          >
            {`${a} / ${s}`}
          </SectionHeader>
        ))
      )}
    </div>
  ),
};
