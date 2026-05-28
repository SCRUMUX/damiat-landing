/**
 * AUTO-GENERATED – do not edit by hand.
 * Regenerate: npm run stories:generate
 */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from './Dropdown';
import { SearchIcon, ChevronDownIcon, CloseXIcon } from '../../icons';
import { Tag } from '../Tag/Tag';
import { Badge } from '../Badge/Badge';

const iconL = <SearchIcon style={{ width: '100%', height: '100%' }} />;
const chevronIcon = <ChevronDownIcon style={{ width: '100%', height: '100%' }} />;

const defaultItems = [
  { children: 'Option 1', appearance: 'default' as const },
  { children: 'Option 2', appearance: 'default' as const },
  { children: 'Option 3', appearance: 'primary' as const },
  { children: 'Delete', appearance: 'danger' as const },
];

const SIZES = ['sm', 'md', 'lg'] as const;

const meta: Meta<typeof Dropdown> = {
  title: 'Primitives/Dropdown',
  component: Dropdown,
  parameters: {
    docs: { description: { component: "Dropdown: выпадающее меню. state: closed/open. Trigger: Icon (left), Label, Badge, TagRow, Chevron. Popover: DropdownItem пункты." } },
  },
  argTypes: {
    state: { control: 'select', options: ['closed', 'open'] },
    size: { control: 'select', options: SIZES },
    appearance: { control: 'select', options: ['brand', 'base', 'ghost', 'outline'] },
    showIconLeft: { control: 'boolean' },
    showBadge: { control: 'boolean' },
    showTagRow: { control: 'boolean' },
    multiple: { control: 'boolean' },
    allowExclude: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    showClearButton: { control: 'boolean' },
    placeholder: { control: 'text' },
    tagRow: { control: false },
    badge: { control: false },
    items: { control: false },
    iconLeft: { control: false },
    chevron: { control: false },
  },
};
export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState<string>('');
    return (
      <div style={{ padding: 16, minHeight: 280, maxWidth: 400 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 8 }}>
          Single-select. Выбрано: <strong>{value || 'ничего'}</strong>
        </p>
        <Dropdown
          size="md"
          options={structuredOptions.slice(0, 5)}
          value={value}
          onChange={(v) => setValue(v as string)}
          placeholder="Выберите..."
          fullWidth
        />
      </div>
    );
  },
};

export const ActionMenu: Story = {
  args: {
    children: 'Действия',
    size: 'md',
    chevron: chevronIcon,
    items: defaultItems,
  },
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <div style={{ padding: 16, minHeight: 200 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 8 }}>
          Action menu (items API) — клик по пункту выполняет действие, а не выбирает значение.
        </p>
        <Dropdown {...args} state={open ? 'open' : 'closed'} onOpenChange={setOpen} />
      </div>
    );
  },
};

export const OpenState: Story = {
  args: {
    children: 'Select option',
    state: 'open',
    size: 'md',
    chevron: chevronIcon,
    items: defaultItems,
  },
  render: (args) => (
    <div style={{ padding: 16, minHeight: 220 }}>
      <Dropdown {...args} state="open" />
    </div>
  ),
};

export const WithAllSlots: Story = {
  args: {
    children: 'With all slots',
    state: 'closed',
    size: 'md',
    iconLeft: iconL,
    chevron: chevronIcon,
    badge: <Badge appearance="outline" size="sm">5</Badge>,
    tagRow: <><Tag appearance="base" size="sm">Tag 1</Tag><Tag appearance="base" size="sm">Tag 2</Tag></>,
    showIconLeft: true,
    showBadge: true,
    showTagRow: false,
    items: defaultItems,
  },
};

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16 }}>
      {SIZES.map((s) => (
        <Dropdown key={s} {...args} size={s} state="open">{s}</Dropdown>
      ))}
    </div>
  ),
  args: {
    chevron: chevronIcon,
    items: defaultItems.slice(0, 3),
  },
};

// ─── Structured options for new API ───
const structuredOptions = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'SolidJS' },
  { value: 'next', label: 'Next.js' },
  { value: 'nuxt', label: 'Nuxt' },
  { value: 'remix', label: 'Remix' },
];

export const MultiSelect: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<string[]>(['react', 'vue', 'angular']);
    return (
      <div style={{ padding: 16, minHeight: 360, maxWidth: 400 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 8 }}>
          Выбрано: {selected.join(', ') || 'ничего'}. Режим «кроме» (exclude) — см. story <strong>ExcludeMode</strong>.
        </p>
        <Dropdown
          size="md"
          multiple
          options={structuredOptions}
          value={selected}
          onChange={(v) => setSelected(v as string[])}
          placeholder="Выберите фреймворки..."
          fullWidth
        >
          Фреймворки
        </Dropdown>
      </div>
    );
  },
};

export const MultiSelectOverflow: Story = {
  render: () => {
    const allValues = structuredOptions.map(o => o.value);
    const [selected, setSelected] = React.useState<string[]>(allValues);
    return (
      <div style={{ padding: 16, minHeight: 360, maxWidth: 280 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 8 }}>
          Все {selected.length} значений выбраны. Chips overflow + counter.
        </p>
        <Dropdown
          size="sm"
          multiple
          options={structuredOptions}
          value={selected}
          onChange={(v) => setSelected(v as string[])}
          placeholder="Все выбраны..."
          fullWidth
        >
          Фреймворки
        </Dropdown>
      </div>
    );
  },
};

export const WithSubmenu: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <div style={{ padding: 16, minHeight: 280 }}>
        <Dropdown
          size="md"
          state={open ? 'open' : 'closed'}
          onOpenChange={setOpen}
          items={[
            { children: 'Файл', appearance: 'default' as const },
            {
              children: 'Экспорт',
              appearance: 'default' as const,
              submenuItems: [
                { children: 'PDF', appearance: 'default' as const, onClick: () => {} },
                { children: 'PNG', appearance: 'default' as const, onClick: () => {} },
                { children: 'SVG', appearance: 'primary' as const, onClick: () => {} },
              ],
            },
            { children: 'Настройки', appearance: 'default' as const },
            { children: 'Удалить', appearance: 'danger' as const },
          ]}
        >
          Действия
        </Dropdown>
      </div>
    );
  },
};

export const ControlledValue: Story = {
  render: () => {
    const [value, setValue] = React.useState<string>('react');
    return (
      <div style={{ padding: 16, minHeight: 320, maxWidth: 400 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 8 }}>
          Controlled single-select. Текущее: <strong>{value || 'нет'}</strong>
        </p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <button onClick={() => setValue('vue')} style={{ fontSize: 12 }}>Set Vue</button>
          <button onClick={() => setValue('angular')} style={{ fontSize: 12 }}>Set Angular</button>
          <button onClick={() => setValue('')} style={{ fontSize: 12 }}>Clear</button>
        </div>
        <Dropdown
          size="md"
          options={structuredOptions}
          value={value}
          onChange={(v) => setValue(v as string)}
          placeholder="Выберите..."
          fullWidth
        >
          {structuredOptions.find(o => o.value === value)?.label ?? 'Выберите...'}
        </Dropdown>
      </div>
    );
  },
};

export const WithOptionsAPI: Story = {
  render: () => {
    const [value, setValue] = React.useState<string>('');
    return (
      <div style={{ padding: 16, minHeight: 320, maxWidth: 400 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 8 }}>
          Single-select with <code>options</code> + <code>value</code> + <code>onChange</code> API.
          Текущее: <strong>{value || 'не выбрано'}</strong>
        </p>
        <Dropdown
          size="md"
          options={structuredOptions.slice(0, 5)}
          value={value}
          onChange={(v) => setValue(v as string)}
          placeholder="Выберите один..."
          fullWidth
        >
          {structuredOptions.find(o => o.value === value)?.label ?? 'Выберите...'}
        </Dropdown>
      </div>
    );
  },
};

export const FullWidth: Story = {
  render: () => (
    <div style={{ padding: 16, minHeight: 200 }}>
      <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 8 }}>
        fullWidth=true
      </p>
      <Dropdown
        size="md"
        options={structuredOptions.slice(0, 4)}
        placeholder="Full-width dropdown..."
        fullWidth
      >
        Выберите
      </Dropdown>
      <div style={{ marginTop: 16 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 8 }}>
          fullWidth=false (default)
        </p>
        <Dropdown
          size="md"
          options={structuredOptions.slice(0, 4)}
          placeholder="Default width..."
        >
          Выберите
        </Dropdown>
      </div>
    </div>
  ),
};

export const ExcludeMode: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<string[]>(['react', 'vue']);
    const [excluded, setExcluded] = React.useState<string[]>(['angular']);
    return (
      <div style={{ padding: 16, minHeight: 360, maxWidth: 400 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 8 }}>
          Tri-state: click → selected, click again → excluded (кроме), click again → off.
          <br />
          Selected: <strong>{selected.join(', ') || '—'}</strong>
          <br />
          Excluded: <strong>{excluded.join(', ') || '—'}</strong>
        </p>
        <Dropdown
          size="md"
          multiple
          allowExclude
          options={structuredOptions}
          value={selected}
          excludedValues={excluded}
          onChange={(v) => setSelected(v as string[])}
          onExcludedChange={setExcluded}
          placeholder="Фреймворки..."
          fullWidth
          showClearButton
          onClear={() => { setSelected([]); setExcluded([]); }}
        >
          Фреймворки
        </Dropdown>
      </div>
    );
  },
};

export const ChipsInClosedControl: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<string[]>(['react', 'vue', 'angular', 'svelte', 'solid']);
    return (
      <div style={{ padding: 16, minHeight: 360, maxWidth: 300 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 8 }}>
          Multi-select: в закрытом контроле видны Chip + Badge с количеством. Выбрано: {selected.length}
        </p>
        <Dropdown
          size="sm"
          multiple
          options={structuredOptions}
          value={selected}
          onChange={(v) => setSelected(v as string[])}
          placeholder="Фреймворки..."
          fullWidth
          showClearButton
          onClear={() => setSelected([])}
        >
          Фреймворки
        </Dropdown>
      </div>
    );
  },
};
