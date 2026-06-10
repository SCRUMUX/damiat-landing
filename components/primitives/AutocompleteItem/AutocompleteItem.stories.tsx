/**
 * AUTO-GENERATED – do not edit by hand.
 * Regenerate: npm run stories:generate
 */
import type { Meta, StoryObj } from '@storybook/react';
import { AutocompleteItem } from './AutocompleteItem';
import { SearchIcon, ChevronRightIcon } from '../../icons';
import { Checkbox } from '../Checkbox/Checkbox';
import { Badge } from '../Badge/Badge';

const meta: Meta<typeof AutocompleteItem> = {
  title: 'Primitives/AutocompleteItem',
  component: AutocompleteItem,
  parameters: {
    docs: { description: { component: "AutocompleteItem: пункт выпадающего списка автокомплита. Оси: size (sm/md/lg) × itemType (default/primary/danger). Всегда 7 слотов в DOM: Checkbox, Icon Left, Label, Badge 1, Badge 2, Badge 3, Icon Right. Видимость через BOOLEAN props. Используется в @UI/Autocomplete через instance swap." } },
  },
  argTypes: {
    size: { control: 'select', options: ["sm","md","lg"] },
    appearance: { control: 'select', options: ["default","primary","danger"] },
    showCheckbox: { control: 'boolean' },
    showIconLeft: { control: 'boolean' },
    showBadge1: { control: 'boolean' },
    showBadge2: { control: 'boolean' },
    showBadge3: { control: 'boolean' },
    showIconRight: { control: 'boolean' },
    checkbox: { control: false },
    badge1: { control: false },
    badge2: { control: false },
    badge3: { control: false },
  },
};
export default meta;
type Story = StoryObj<typeof AutocompleteItem>;

export const Default: Story = {
  args: {
    children: 'Option',
    size: 'sm',
    appearance: 'default',
    iconLeft: <SearchIcon style={{ width: '100%', height: '100%' }} />,
    iconRight: <ChevronRightIcon style={{ width: '100%', height: '100%' }} />,
    checkbox: <Checkbox size="sm" />,
    badge1: <Badge appearance="outline" size="sm">1</Badge>,
    badge2: <Badge appearance="success" size="sm">2</Badge>,
    badge3: <Badge appearance="warning" size="sm">3</Badge>,
    showCheckbox: false,
    showIconLeft: false,
    showBadge1: false,
    showBadge2: false,
    showBadge3: false,
    showIconRight: false,
  },
};

export const AllSlotsVisible: Story = {
  args: {
    children: 'Option',
    size: 'sm',
    appearance: 'default',
    showCheckbox: true,
    showIconLeft: true,
    showBadge1: true,
    showBadge2: true,
    showBadge3: true,
    showIconRight: true,
    iconLeft: <SearchIcon style={{ width: '100%', height: '100%' }} />,
    iconRight: <ChevronRightIcon style={{ width: '100%', height: '100%' }} />,
    checkbox: <Checkbox size="sm" />,
    badge1: <Badge appearance="outline" size="sm">1</Badge>,
    badge2: <Badge appearance="success" size="sm">2</Badge>,
    badge3: <Badge appearance="warning" size="sm">3</Badge>,
  },
};

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {(["sm","md","lg"] as const).map((s) => (
        <AutocompleteItem key={s} {...args} size={s}>{`Option (${s})`}</AutocompleteItem>
      ))}
    </div>
  ),
  args: {
    appearance: 'default',
    iconLeft: <SearchIcon style={{ width: '100%', height: '100%' }} />,
    iconRight: <ChevronRightIcon style={{ width: '100%', height: '100%' }} />,
    showIconLeft: true,
    showIconRight: true,
    showCheckbox: false,
    showBadge1: false,
    showBadge2: false,
    showBadge3: false,
  },
};

export const AllAppearances: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {(["default","primary","danger"] as const).map((t) => (
        <AutocompleteItem key={t} {...args} appearance={t}>{`Option (${t})`}</AutocompleteItem>
      ))}
    </div>
  ),
  args: {
    size: 'sm',
    iconLeft: <SearchIcon style={{ width: '100%', height: '100%' }} />,
    showIconLeft: true,
    showCheckbox: false,
    showBadge1: false,
    showBadge2: false,
    showBadge3: false,
    showIconRight: false,
  },
};

export const AllSizesAllTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {(["sm","md","lg"] as const).map((s) => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {(["default","primary","danger"] as const).map((t) => (
            <AutocompleteItem key={t} size={s} appearance={t} showIconLeft iconLeft={<SearchIcon style={{ width: '100%', height: '100%' }} />}>
              {`${s} / ${t}`}
            </AutocompleteItem>
          ))}
        </div>
      ))}
    </div>
  ),
};
