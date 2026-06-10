import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Chip } from './Chip';
import { SearchIcon, CloseXIcon } from '../../icons';

const iconL = <SearchIcon style={{ width: '100%', height: '100%' }} />;
const iconClose = <CloseXIcon style={{ width: '100%', height: '100%' }} />;

const APPEARANCES = ['base', 'brand'] as const;
const SIZES = ['sm', 'md', 'lg'] as const;
const STATES = ['base', 'selected', 'disabled', 'exclude'] as const;

const meta: Meta<typeof Chip> = {
  title: 'Primitives/Chip',
  component: Chip,
  parameters: {
    docs: { description: { component: "Chip: фильтр/тег с удалением. appearance (base/brand), size (sm/md/lg), state (base/selected/disabled/exclude). Close-иконка показана по умолчанию. Иконка слева — опциональна." } },
  },
  argTypes: {
    appearance: { control: 'select', options: APPEARANCES },
    size: { control: 'select', options: SIZES },
    state: { control: 'select', options: STATES },
    showLeftIcon: { control: 'boolean' },
    showCloseIcon: { control: 'boolean' },
    disabled: { control: 'boolean', description: 'Disabled state' },
    iconLeft: { control: false },
    closeIcon: { control: false },
    onClose: { action: 'closed', description: 'Close icon click' },
  },
};
export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {
  args: {
    children: 'Chip',
    appearance: 'base',
    size: 'md',
    state: 'base',
    iconLeft: iconL,
    closeIcon: iconClose,
    showLeftIcon: true,
    showCloseIcon: true,
  },
};

export const AllAppearances: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: 16 }}>
      {APPEARANCES.map((a) => (
        <Chip key={a} {...args} appearance={a}>{a}</Chip>
      ))}
    </div>
  ),
  args: { size: 'md', state: 'base', iconLeft: iconL, closeIcon: iconClose, showLeftIcon: true, showCloseIcon: true },
};

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 16 }}>
      {SIZES.map((s) => (
        <Chip key={s} {...args} size={s}>{s}</Chip>
      ))}
    </div>
  ),
  args: { appearance: 'base', state: 'base', iconLeft: iconL, closeIcon: iconClose, showLeftIcon: true, showCloseIcon: true },
};

export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: 16 }}>
      {STATES.map((st) => (
        <Chip key={st} {...args} state={st}>{st}</Chip>
      ))}
    </div>
  ),
  args: { appearance: 'base', size: 'md', iconLeft: iconL, closeIcon: iconClose, showLeftIcon: true, showCloseIcon: true },
};

/** Матрица appearance × state */
export const AllAppearancesAllStates: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${STATES.length}, auto)`, gap: 8, padding: 16 }}>
      {APPEARANCES.flatMap((a) =>
        STATES.map((st) => (
          <Chip key={a + st} {...args} appearance={a} state={st}>{`${a}/${st}`}</Chip>
        ))
      )}
    </div>
  ),
  args: { size: 'md', iconLeft: iconL, closeIcon: iconClose, showLeftIcon: true, showCloseIcon: true },
};

/** Interactive — dismissible chips */
export const Interactive: Story = {
  render: () => {
    const [chips, setChips] = useState(['React', 'TypeScript', 'Tailwind', 'Figma', 'Storybook']);
    const remove = (label: string) => setChips(prev => prev.filter(c => c !== label));

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {chips.map((label) => (
            <Chip
              key={label}
              appearance="base"
              size="md"
              state="base"
              closeIcon={iconClose}
              showCloseIcon
              onClose={() => remove(label)}
            >
              {label}
            </Chip>
          ))}
        </div>
        {chips.length === 0 && (
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>All chips removed</span>
        )}
        {chips.length < 5 && (
          <button
            onClick={() => setChips(['React', 'TypeScript', 'Tailwind', 'Figma', 'Storybook'])}
            style={{
              alignSelf: 'flex-start',
              padding: '4px 12px',
              fontSize: 12,
              borderRadius: 4,
              border: '1px solid var(--color-border-base)',
              background: 'var(--color-surface-1)',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
            }}
          >
            Reset
          </button>
        )}
      </div>
    );
  },
};
