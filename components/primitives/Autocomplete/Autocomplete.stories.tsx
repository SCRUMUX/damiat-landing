/**
 * AUTO-GENERATED – do not edit by hand.
 * Regenerate: npm run stories:generate
 */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Autocomplete } from './Autocomplete';
import { SearchIcon, CloseXIcon, ChevronRightIcon, BookmarkStarFillIcon } from '../../icons';
import { Tag } from '../Tag/Tag';
import { Checkbox } from '../Checkbox/Checkbox';
import { Badge } from '../Badge/Badge';

const meta: Meta<typeof Autocomplete> = {
  title: 'Primitives/Autocomplete',
  component: Autocomplete,
  parameters: {
    docs: { description: { component: "Autocomplete: поле ввода с выпадающим списком значений по вхождению. state: closed/open. size: sm/md/lg. Trigger: Input-like поле с иконкой поиска, TagRow для выбранных значений. Popover: пункты через <AutocompleteItem> с наследованием size." } },
  },
  argTypes: {
    state: { control: 'select', options: ["closed","open"] },
    size: { control: 'select', options: ["sm","md","lg"] },
    appearance: { control: 'select', options: ['brand', 'base', 'ghost', 'outline'] },
    showClearIcon: { control: 'boolean' },
    multiple: { control: 'boolean' },
    allowExclude: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    loading: { control: 'boolean' },
    placeholder: { control: 'text' },
    items: { control: false },
  },
};
export default meta;
type Story = StoryObj<typeof Autocomplete>;

// Базовые пункты — только label через children, itemType
const basicItems = [
  { children: 'Option 1', appearance: 'default' as const },
  { children: 'Option 2', appearance: 'default' as const },
  { children: 'Option 3', appearance: 'default' as const },
  { children: 'Option 4', appearance: 'primary' as const },
  { children: 'Delete item', appearance: 'danger' as const },
];

export const Default: Story = {
  args: {
    state: 'closed',
    size: 'sm',
    placeholder: 'Search...',
    searchIcon: <SearchIcon style={{ width: '100%', height: '100%' }} />,
    clearIcon: <CloseXIcon style={{ width: '100%', height: '100%' }} />,
    showTagRow: false,
    showClearIcon: false,
    items: basicItems,
  },
};

export const Open: Story = {
  args: {
    state: 'open',
    size: 'sm',
    placeholder: 'Search...',
    searchIcon: <SearchIcon style={{ width: '100%', height: '100%' }} />,
    clearIcon: <CloseXIcon style={{ width: '100%', height: '100%' }} />,
    showTagRow: false,
    showClearIcon: true,
    items: basicItems,
  },
  render: (args) => {
    const [open, setOpen] = React.useState(true);
    return (
      <div style={{ padding: 16, minHeight: 320 }}>
        <Autocomplete {...args} state={open ? 'open' : 'closed'} onOpenChange={setOpen} />
      </div>
    );
  },
};

// Пункты с иконками слева (iconLeft slot)
const itemsWithIcons = [
  { children: 'Search results', appearance: 'default' as const, showIconLeft: true, iconLeft: <SearchIcon style={{ width: '100%', height: '100%' }} /> },
  { children: 'Starred item', appearance: 'default' as const, showIconLeft: true, iconLeft: <BookmarkStarFillIcon style={{ width: '100%', height: '100%' }} /> },
  { children: 'Navigate right', appearance: 'primary' as const, showIconLeft: true, iconLeft: <ChevronRightIcon style={{ width: '100%', height: '100%' }} />, showIconRight: true, iconRight: <ChevronRightIcon style={{ width: '100%', height: '100%' }} /> },
  { children: 'Delete', appearance: 'danger' as const, showIconLeft: true, iconLeft: <CloseXIcon style={{ width: '100%', height: '100%' }} /> },
];

export const WithIcons: Story = {
  args: {
    state: 'open',
    size: 'sm',
    placeholder: 'Search...',
    searchIcon: <SearchIcon style={{ width: '100%', height: '100%' }} />,
    clearIcon: <CloseXIcon style={{ width: '100%', height: '100%' }} />,
    showClearIcon: true,
    items: itemsWithIcons,
  },
  render: (args) => (
    <div style={{ padding: 16, minHeight: 220 }}>
      <Autocomplete {...args} state="open" />
    </div>
  ),
};

// Пункты с чекбоксами (checkbox slot)
const itemsWithCheckboxes = [
  { children: 'Option A', showCheckbox: true, checkbox: <Checkbox size="sm" state="checked" /> },
  { children: 'Option B', showCheckbox: true, checkbox: <Checkbox size="sm" state="unchecked" /> },
  { children: 'Option C', showCheckbox: true, checkbox: <Checkbox size="sm" state="unchecked" /> },
  { children: 'Option D', showCheckbox: true, checkbox: <Checkbox size="sm" state="checked" /> },
];

export const WithCheckboxes: Story = {
  args: {
    state: 'open',
    size: 'sm',
    placeholder: 'Search...',
    searchIcon: <SearchIcon style={{ width: '100%', height: '100%' }} />,
    showClearIcon: false,
    items: itemsWithCheckboxes,
  },
  render: (args) => (
    <div style={{ padding: 16, minHeight: 220 }}>
      <Autocomplete {...args} state="open" />
    </div>
  ),
};

// Пункты с бейджами (badge1/2/3 slots)
const itemsWithBadges = [
  { children: 'React', appearance: 'default' as const, showBadge1: true, badge1: <Badge appearance="brand" size="sm">New</Badge> },
  { children: 'TypeScript', appearance: 'default' as const, showBadge1: true, badge1: <Badge appearance="success" size="sm">Stable</Badge> },
  { children: 'Vue', appearance: 'default' as const, showBadge1: true, badge1: <Badge appearance="warning" size="sm">Beta</Badge>, showBadge2: true, badge2: <Badge appearance="outline" size="sm">v3</Badge> },
  { children: 'Angular', appearance: 'default' as const, showBadge1: true, badge1: <Badge appearance="danger" size="sm">Deprecated</Badge> },
];

export const WithBadges: Story = {
  args: {
    state: 'open',
    size: 'sm',
    placeholder: 'Search framework...',
    searchIcon: <SearchIcon style={{ width: '100%', height: '100%' }} />,
    showClearIcon: false,
    items: itemsWithBadges,
  },
  render: (args) => (
    <div style={{ padding: 16, minHeight: 220 }}>
      <Autocomplete {...args} state="open" />
    </div>
  ),
};

// Все размеры
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
      {(["sm","md","lg"] as const).map((s) => (
        <div key={s} style={{ padding: 16, minHeight: 200 }}>
          <Autocomplete
            size={s}
            state="open"
            placeholder={`Size: ${s}`}
            searchIcon={<SearchIcon style={{ width: '100%', height: '100%' }} />}
            items={[
              { children: 'Option 1', appearance: 'default' },
              { children: 'Option 2', appearance: 'primary' },
              { children: 'Delete', appearance: 'danger' },
            ]}
          />
        </div>
      ))}
    </div>
  ),
};

// С TagRow
export const WithTagRow: Story = {
  args: {
    state: 'closed',
    size: 'sm',
    placeholder: 'Search...',
    searchIcon: <SearchIcon style={{ width: '100%', height: '100%' }} />,
    clearIcon: <CloseXIcon style={{ width: '100%', height: '100%' }} />,
    showTagRow: true,
    showClearIcon: true,
    tagRow: <><Tag appearance="base" size="sm">React</Tag><Tag appearance="base" size="sm">TypeScript</Tag></>,
    items: basicItems,
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
  { value: 'astro', label: 'Astro' },
  { value: 'qwik', label: 'Qwik' },
];

export const MultiSelect: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<string[]>(['react', 'vue', 'angular']);
    return (
      <div style={{ padding: 16, minHeight: 360, maxWidth: 400 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 8 }}>
          Выбрано: {selected.join(', ') || 'ничего'}. Режим «кроме» (exclude) — см. story <strong>ExcludeMode</strong>.
        </p>
        <Autocomplete
          size="md"
          multiple
          options={structuredOptions}
          value={selected}
          onChange={(v) => setSelected(v as string[])}
          placeholder="Выберите фреймворки..."
          showClearIcon
          fullWidth
        />
      </div>
    );
  },
};

export const MultiSelectOverflow: Story = {
  render: () => {
    const allValues = structuredOptions.map(o => o.value);
    const [selected, setSelected] = React.useState<string[]>(allValues);
    return (
      <div style={{ padding: 16, minHeight: 360, maxWidth: 320 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 8 }}>
          Overflow: {selected.length} из {structuredOptions.length} выбрано. Видны только те chips, что помещаются + счётчик.
        </p>
        <Autocomplete
          size="sm"
          multiple
          options={structuredOptions}
          value={selected}
          onChange={(v) => setSelected(v as string[])}
          placeholder="Все выбраны..."
          showClearIcon
          fullWidth
        />
      </div>
    );
  },
};

export const AsyncSearch: Story = {
  render: () => {
    const [query, setQuery] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [results, setResults] = React.useState(structuredOptions);

    const handleInputChange = React.useCallback((q: string) => {
      setQuery(q);
      if (!q) { setResults(structuredOptions); return; }
      setLoading(true);
      const timer = setTimeout(() => {
        setResults(structuredOptions.filter(o => o.label!.toLowerCase().includes(q.toLowerCase())));
        setLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }, []);

    return (
      <div style={{ padding: 16, minHeight: 320, maxWidth: 400 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 8 }}>
          Async: вводите текст, результаты появятся с задержкой 800ms.
        </p>
        <Autocomplete
          size="md"
          options={results}
          inputValue={query}
          onInputChange={handleInputChange}
          loading={loading}
          placeholder="Поиск фреймворка..."
          noResultsMessage="Ничего не найдено"
          showClearIcon
          fullWidth
        />
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
        <Autocomplete
          size="md"
          options={structuredOptions}
          value={value}
          onChange={(v) => setValue(v as string)}
          placeholder="Выберите..."
          showClearIcon
          fullWidth
        />
      </div>
    );
  },
};

export const FullWidth: Story = {
  render: () => (
    <div style={{ padding: 16, minHeight: 320 }}>
      <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 8 }}>
        fullWidth=true — занимает всю ширину родителя
      </p>
      <Autocomplete
        size="md"
        options={structuredOptions}
        placeholder="Full-width autocomplete..."
        showClearIcon
        fullWidth
      />
      <div style={{ marginTop: 16 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 8 }}>
          fullWidth=false (default) — по ширине контента
        </p>
        <Autocomplete
          size="md"
          options={structuredOptions}
          placeholder="Default width..."
          showClearIcon
        />
      </div>
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div style={{ padding: 16, minHeight: 200, maxWidth: 400 }}>
      <Autocomplete
        size="md"
        options={[]}
        loading
        placeholder="Загрузка данных..."
        fullWidth
      />
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
        <Autocomplete
          size="md"
          multiple
          allowExclude
          options={structuredOptions}
          value={selected}
          excludedValues={excluded}
          onChange={(v) => setSelected(v as string[])}
          onExcludedChange={setExcluded}
          placeholder="Фреймворки..."
          showClearIcon
          fullWidth
        />
      </div>
    );
  },
};

export const ChipsOverflowBadge: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<string[]>(['react', 'vue', 'angular', 'svelte', 'solid', 'next']);
    return (
      <div style={{ padding: 16, minHeight: 360, maxWidth: 300 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 8 }}>
          Multi-select: закрытый контрол показывает Chip для видимых значений + Badge с количеством overflow. Выбрано: {selected.length}
        </p>
        <Autocomplete
          size="sm"
          multiple
          options={structuredOptions}
          value={selected}
          onChange={(v) => setSelected(v as string[])}
          placeholder="Фреймворки..."
          showClearIcon
          fullWidth
        />
      </div>
    );
  },
};
