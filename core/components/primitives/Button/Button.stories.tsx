/**
 * AUTO-GENERATED – do not edit by hand.
 * Regenerate: npm run stories:generate
 */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { SearchIcon, ChevronRightIcon } from '../../icons';

const iconL = <SearchIcon style={{ width: '100%', height: '100%' }} />;
const iconR = <ChevronRightIcon style={{ width: '100%', height: '100%' }} />;

const APPEARANCES = ['brand', 'base', 'ghost', 'ghost-danger', 'ghost-warning', 'ghost-success', 'outline', 'success', 'warning', 'danger'] as const;
const SIZES = ['sm', 'md', 'lg'] as const;
const STATES = ['base', 'hover', 'active', 'focus', 'disabled'] as const;

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          '`@UI/Button` — основная кнопка дизайн-системы.\n\n' +
          '**appearance**: brand / base / ghost / ghost-danger / ghost-warning / ghost-success / outline / success / warning / danger\n\n' +
          '**size**: sm / md / lg\n\n' +
          '**state**: управляется автоматически (hover/focus/active/disabled). Используйте `disabled` prop.\n\n' +
          'Иконки слева и справа — необязательны (`showLeftIcon`, `showRightIcon`).',
      },
    },
  },
  argTypes: {
    appearance:   { control: 'select',  options: APPEARANCES, description: 'Визуальный стиль' },
    size:         { control: 'select',  options: SIZES,       description: 'Размер' },
    state:        { control: 'select',  options: STATES,      description: 'Принудительное состояние' },
    showLeftIcon: { control: 'boolean', description: 'Показать иконку слева' },
    showRightIcon:{ control: 'boolean', description: 'Показать иконку справа' },
    showLabel:    { control: 'boolean', description: 'Показать текст' },
    disabled:     { control: 'boolean', description: 'Заблокировать кнопку' },
    loading:      { control: 'boolean', description: 'Состояние загрузки (спиннер)' },
    fullWidth:    { control: 'boolean', description: 'Растянуть на всю ширину' },
    iconLeft:     { control: false },
    iconRight:    { control: false },
    onClick:      { action: 'clicked',  description: 'Клик по кнопке' },
  },
  args: {
    appearance: 'brand',
    size: 'md',
    showLeftIcon: false,
    showRightIcon: false,
    showLabel: true,
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Button',
    appearance: 'brand',
    size: 'md',
    iconLeft: iconL,
    iconRight: iconR,
    showLeftIcon: true,
    showRightIcon: false,
    showLabel: true,
  },
};

export const IconOnly: Story = {
  args: {
    appearance: 'brand',
    size: 'md',
    iconLeft: iconL,
    showLeftIcon: true,
    showRightIcon: false,
    showLabel: false,
  },
};

export const AllAppearances: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', padding: 16 }}>
      {APPEARANCES.map((a) => (
        <Button key={a} {...args} appearance={a}>{a}</Button>
      ))}
    </div>
  ),
  args: { size: 'md', iconLeft: iconL, showLeftIcon: true, showRightIcon: false },
};

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 16 }}>
      {SIZES.map((s) => (
        <Button key={s} {...args} size={s}>{s}</Button>
      ))}
    </div>
  ),
  args: { appearance: 'brand', iconLeft: iconL, showLeftIcon: true, showRightIcon: false },
};

export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: 16 }}>
      {STATES.map((st) => (
        <Button key={st} {...args} state={st}>{st}</Button>
      ))}
    </div>
  ),
  args: { appearance: 'brand', size: 'md', iconLeft: iconL, showLeftIcon: true, showRightIcon: false },
};

/** Полная матрица: все appearance × все states */
export const AllAppearancesAllStates: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${STATES.length}, auto)`, gap: 6, alignItems: 'center', padding: 16 }}>
      {APPEARANCES.flatMap((a) =>
        STATES.map((st) => (
          <Button key={a + st} {...args} appearance={a} state={st}>{a}</Button>
        ))
      )}
    </div>
  ),
  args: { size: 'sm', iconLeft: iconL, showLeftIcon: true, showRightIcon: false },
};

/** Loading state */
export const Loading: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 16 }}>
      {APPEARANCES.slice(0, 5).map((a) => (
        <Button key={a} appearance={a} size="md" loading>{a}</Button>
      ))}
    </div>
  ),
};

/** Full width */
export const FullWidth: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16, width: 400 }}>
      <Button appearance="brand" size="md" fullWidth>Full width brand</Button>
      <Button appearance="outline" size="md" fullWidth>Full width outline</Button>
      <Button appearance="ghost" size="md" fullWidth>Full width ghost</Button>
    </div>
  ),
};

/** Disabled */
export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: 16 }}>
      {['brand', 'outline', 'ghost', 'danger'].map((a) => (
        <Button key={a} appearance={a as any} size="md" disabled>{a}</Button>
      ))}
    </div>
  ),
};

/** Матрица appearance × size */
export const VariantMatrix: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SIZES.length}, auto)`, gap: 8, alignItems: 'center', padding: 16 }}>
      {APPEARANCES.flatMap((a) =>
        SIZES.map((s) => (
          <Button key={a + s} {...args} appearance={a} size={s}>{a}</Button>
        ))
      )}
    </div>
  ),
  args: { iconLeft: iconL, showLeftIcon: true, showRightIcon: false },
};
