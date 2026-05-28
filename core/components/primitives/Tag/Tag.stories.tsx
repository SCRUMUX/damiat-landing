/**
 * AUTO-GENERATED – do not edit by hand.
 * Regenerate: npm run stories:generate
 */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from './Tag';
import { SearchIcon, CloseXIcon } from '../../icons';

const icon1 = <SearchIcon style={{ width: '100%', height: '100%' }} />;
const iconClose = <CloseXIcon style={{ width: '100%', height: '100%' }} />;

const APPEARANCES = ['brand', 'base', 'ghost', 'outline'] as const;
const SIZES = ['sm', 'md', 'lg'] as const;
const STATES = ['base', 'hover'] as const;

const meta: Meta<typeof Tag> = {
  title: 'Primitives/Tag',
  component: Tag,
  parameters: {
    docs: {
      description: {
        component:
          '`@UI/Tag` — текстовая метка-тег. appearance: brand / base / ghost / outline.\n\n' +
          'Размеры sm/md/lg. Состояния base/hover.\n\n' +
          'Опционально: иконка слева, иконка справа (close).',
      },
    },
  },
  argTypes: {
    appearance:    { control: 'select',  options: APPEARANCES, description: 'Визуальный стиль' },
    size:          { control: 'select',  options: SIZES,       description: 'Размер' },
    state:         { control: 'select',  options: STATES,      description: 'Состояние' },
    showLeftIcon:  { control: 'boolean', description: 'Иконка слева' },
    showRightIcon: { control: 'boolean', description: 'Иконка справа (close)' },
    iconLeft:  { control: false },
    iconRight: { control: false },
  },
  args: {
    appearance: 'base',
    size: 'sm',
    showLeftIcon: false,
    showRightIcon: false,
  },
};
export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: {
    children: 'Tag label',
    appearance: 'base',
    size: 'sm',
  },
};

export const WithIcons: Story = {
  args: {
    children: 'Tag label',
    appearance: 'base',
    size: 'md',
    iconLeft: icon1,
    iconRight: iconClose,
    showLeftIcon: true,
    showRightIcon: true,
  },
};

export const AllAppearances: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 16 }}>
      {APPEARANCES.map((a) => (
        <Tag key={a} {...args} appearance={a}>{a}</Tag>
      ))}
    </div>
  ),
  args: { size: 'md' },
};

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 16, alignItems: 'center' }}>
      {SIZES.map((s) => (
        <Tag key={s} {...args} size={s}>{s}</Tag>
      ))}
    </div>
  ),
  args: { appearance: 'base' },
};

export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, padding: 16, alignItems: 'center' }}>
      {STATES.map((st) => (
        <Tag key={st} {...args} state={st}>{st}</Tag>
      ))}
    </div>
  ),
  args: { appearance: 'base', size: 'md' },
};

export const FullMatrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
      {APPEARANCES.map((a) => (
        <div key={a} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ width: 60, fontSize: 11, color: 'var(--color-text-muted)' }}>{a}</span>
          {SIZES.map((s) =>
            STATES.map((st) => (
              <Tag key={`${a}-${s}-${st}`} appearance={a} size={s} state={st}>{`${s}/${st}`}</Tag>
            ))
          )}
        </div>
      ))}
    </div>
  ),
};
