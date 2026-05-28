import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from './Accordion';
import { AicaIcon, CaretUpFillIcon } from '../../icons';
import { Badge } from '../Badge/Badge';
import { Chip } from '../Chip/Chip';
import { Checkbox } from '../Checkbox/Checkbox';

const meta: Meta<typeof Accordion> = {
  title: 'Primitives/Accordion',
  component: Accordion,
  parameters: {
    docs: {
      description: {
        component:
          'Accordion: no wrapper border. When open — 1px brand-primary top accent + brand icons. ' +
          'Do not add `border` via className in consumer code.',
      },
    },
  },
  argTypes: {
    state: { control: 'select', options: ['open', 'closed'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    interaction: { control: 'select', options: ['base', 'hover', 'disabled'] },
    defaultOpen: { control: 'boolean' },
    showIconLeft1: { control: 'boolean' },
    showIconLeft2: { control: 'boolean' },
    showBadge: { control: 'boolean' },
    badge: { control: false },
    content: { control: 'text' },
  },
  args: {
    children: 'Accordion',
    size: 'sm',
    iconLeft1: <AicaIcon style={{ width: '100%', height: '100%' }} />,
    iconLeft2: <AicaIcon style={{ width: '100%', height: '100%' }} />,
    chevron: <CaretUpFillIcon style={{ width: '1em', height: '1em' }} />,
    badge: <Badge appearance="outline" size="sm">5</Badge>,
    showIconLeft1: true,
    showIconLeft2: true,
    showBadge: true,
    content: 'Accordion content...',
  },
};
export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {};

export const Open: Story = {
  args: { children: 'Accordion (open)', state: 'open' },
};

export const AllSlotsVisible: Story = {};

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <div key={s}>
          <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>{s} — closed</p>
          <Accordion {...args} size={s}>{s}</Accordion>
        </div>
      ))}
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <div key={`${s}-open`}>
          <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>{s} — open (top accent only)</p>
          <Accordion {...args} size={s} state="open">{s}</Accordion>
        </div>
      ))}
    </div>
  ),
  args: { children: 'Accordion' },
};

export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-start', padding: 16 }}>
      {(['base', 'hover', 'disabled'] as const).map((st) => (
        <div key={st} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Accordion {...args} interaction={st} state="closed">{st} closed</Accordion>
          <Accordion {...args} interaction={st} state="open">{st} open</Accordion>
        </div>
      ))}
    </div>
  ),
  args: { children: 'Accordion' },
};

export const WithCheckboxSelection: StoryObj = {
  render: () => {
    const ALL_OPTIONS = ['React', 'Vue', 'Angular', 'Svelte', 'SolidJS', 'Next.js', 'Remix', 'Astro'];
    const MAX_CHIPS = 2;
    const [selected, setSelected] = React.useState<string[]>(['React', 'Vue', 'Svelte']);
    const toggle = (opt: string) =>
      setSelected((prev) => (prev.includes(opt) ? prev.filter((s) => s !== opt) : [...prev, opt]));
    const visibleChips = selected.slice(0, MAX_CHIPS);
    const overflow = Math.max(0, selected.length - MAX_CHIPS);

    const badgeSlot = selected.length > 0 ? (
      <div
        className="flex items-center gap-[var(--space-4)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {visibleChips.map((v) => (
          <Chip key={v} size="sm" appearance="base" showCloseIcon onClose={() => toggle(v)}>
            {v}
          </Chip>
        ))}
        {overflow > 0 && <Badge appearance="brand" size="sm">+{overflow}</Badge>}
      </div>
    ) : undefined;

    return (
      <div style={{ padding: 16, maxWidth: 320 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 12 }}>
          Паттерн: Accordion primitive с fullWidth, chips + Badge в badge-слоте. Без wrapper-border —
          только top accent в open.
        </p>
        <Accordion
          size="sm"
          fullWidth
          defaultOpen
          showBadge={selected.length > 0}
          badge={badgeSlot}
          content={
            <div className="flex flex-col gap-[var(--space-6)] pt-[var(--space-4)]">
              {ALL_OPTIONS.map((opt) => (
                <Checkbox
                  key={opt}
                  size="sm"
                  checked={selected.includes(opt)}
                  label={opt}
                  onChange={() => toggle(opt)}
                />
              ))}
            </div>
          }
        >
          Фреймворки
        </Accordion>
      </div>
    );
  },
};

export const RhythmComparison: StoryObj = {
  render: () => (
    <div style={{ padding: 16, maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4 }}>
        Accordion и Dropdown sm — одинаковые size-токены. Accordion без обводки контейнера.
      </p>
      <Accordion size="sm" fullWidth state="open" content={<span>Content</span>}>
        Accordion sm (open)
      </Accordion>
      <div
        className="flex items-center min-h-[var(--space-28)] px-[var(--space-button-x-sm)] text-[var(--color-text-muted)] text-style-caption rounded-[var(--radius-default)] border border-solid border-[var(--color-border-base)]"
      >
        Reference: Dropdown sm trigger height
      </div>
    </div>
  ),
};
