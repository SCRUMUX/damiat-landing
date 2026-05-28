import React, { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ListItem } from './ListItem';
import type { ListItemState, ListItemSize, ListItemVariant } from './ListItem.types';
import {
  BellIcon,
  ChevronRightIcon,
  GearIcon,
  PersonIcon,
  SearchIcon,
} from '../../icons';
import { Avatar } from '../Avatar/Avatar';
import { Badge } from '../Badge/Badge';
import { Checkbox } from '../Checkbox/Checkbox';
import { Switch } from '../Switch/Switch';
import { SkeletonList } from '../SkeletonList/SkeletonList';

const meta: Meta<typeof ListItem> = {
  title: 'Primitives/ListItem',
  component: ListItem,
  parameters: {
    docs: {
      description: {
        component:
          '`@UI/ListItem` — строка списка. Оси: size (sm/md/lg) × interaction (base/hover/selected/disabled) × variant (iconNav/iconMeta/avatarContact/checkboxSelect).',
      },
    },
  },
  argTypes: {
    size:        { control: 'select', options: ['sm', 'md', 'lg'] },
    state:       { control: 'select', options: ['base', 'hover', 'selected', 'disabled'] },
    variant:     { control: 'select', options: ['iconNav', 'iconMeta', 'avatarContact', 'checkboxSelect'] },
    label:       { control: 'text' },
    subtitle:    { control: 'text' },
    trailingMeta:{ control: 'text' },
    showSubtitle:{ control: 'boolean' },
    showDivider: { control: 'boolean' },
    leadingIcon:     { control: false },
    leadingAvatar:   { control: false },
    leadingCheckbox: { control: false },
    trailingChevron: { control: false },
    trailingBadge:   { control: false },
    trailingAction:  { control: false },
  },
};
export default meta;
type Story = StoryObj<typeof ListItem>;

// ─── Shared slot defaults ────────────────────────────────────────────────────
const sharedSlots = {
  leadingIcon:     <GearIcon size={20} />,
  leadingAvatar:   <Avatar size="sm" variant="registered-no-photo" />,
  leadingCheckbox: <Checkbox size="sm" />,
  trailingChevron: <ChevronRightIcon size={20} />,
  trailingBadge:   <Badge appearance="brand" size="sm">3</Badge>,
  trailingAction:  <Switch size="sm" state="off" />,
};

// ─── Default ────────────────────────────────────────────────────────────────
export const Default: Story = {
  args: {
    size: 'md',
    variant: 'iconNav',
    label: 'List item label',
    showDivider: true,
    ...sharedSlots,
  },
  decorators: [(Story) => <div style={{ width: 360 }}><Story /></div>],
};

// ─── All Variants ────────────────────────────────────────────────────────────
export const AllVariants: Story = {
  render: () => (
    <div style={{ width: 360, display: 'flex', flexDirection: 'column' }}>
      <ListItem
        variant="iconNav"
        label="iconNav — Settings"
        subtitle="Navigate or configure"
        showSubtitle
        showDivider
        {...sharedSlots}
      />
      <ListItem
        variant="iconMeta"
        label="iconMeta — Notifications"
        subtitle="Badge count on right"
        showSubtitle
        showDivider
        {...sharedSlots}
      />
      <ListItem
        variant="avatarContact"
        label="avatarContact — Alice"
        trailingMeta="2m ago"
        showDivider
        {...sharedSlots}
      />
      <ListItem
        variant="checkboxSelect"
        label="checkboxSelect — Select me"
        showDivider
        {...sharedSlots}
      />
    </div>
  ),
};

// ─── All Interaction States ───────────────────────────────────────────────────
export const AllStates: Story = {
  render: () => (
    <div style={{ width: 360, display: 'flex', flexDirection: 'column' }}>
      {(['base', 'hover', 'selected', 'disabled'] as ListItemState[]).map((st) => (
        <ListItem
          key={st}
          variant="iconNav"
          state={st}
          label={`${st} state`}
          showDivider
          {...sharedSlots}
        />
      ))}
    </div>
  ),
};

// ─── All Sizes ──────────────────────────────────────────────────────────────
export const AllSizes: Story = {
  render: () => (
    <div style={{ width: 360, display: 'flex', flexDirection: 'column' }}>
      {(['sm', 'md', 'lg'] as ListItemSize[]).map((s) => (
        <ListItem
          key={s}
          size={s}
          variant="iconNav"
          label={`size = ${s}`}
          showDivider
          {...sharedSlots}
        />
      ))}
    </div>
  ),
};

// ─── With Subtitle ──────────────────────────────────────────────────────────
export const WithSubtitle: Story = {
  render: () => (
    <div style={{ width: 360, display: 'flex', flexDirection: 'column' }}>
      {(['sm', 'md', 'lg'] as ListItemSize[]).map((s) => (
        <ListItem
          key={s}
          size={s}
          variant="iconNav"
          label="List item label"
          subtitle="Secondary description text"
          showSubtitle
          showDivider
          {...sharedSlots}
        />
      ))}
    </div>
  ),
};

// ─── iconNav ─────────────────────────────────────────────────────────────────
export const IconNav: Story = {
  render: () => (
    <div style={{ width: 360, display: 'flex', flexDirection: 'column' }}>
      {(['base', 'hover', 'selected', 'disabled'] as ListItemState[]).map((st) => (
        <ListItem
          key={st}
          variant="iconNav"
          state={st}
          label={`iconNav — ${st}`}
          showDivider
          leadingIcon={<GearIcon size={20} />}
          trailingChevron={<ChevronRightIcon size={20} />}
        />
      ))}
    </div>
  ),
};

// ─── iconMeta ────────────────────────────────────────────────────────────────
export const IconMeta: Story = {
  render: () => (
    <div style={{ width: 360, display: 'flex', flexDirection: 'column' }}>
      {(['base', 'hover', 'selected', 'disabled'] as ListItemState[]).map((st) => (
        <ListItem
          key={st}
          variant="iconMeta"
          state={st}
          label={`iconMeta — ${st}`}
          showDivider
          leadingIcon={<BellIcon size={20} />}
          trailingBadge={<Badge appearance="brand" size="sm">5</Badge>}
        />
      ))}
    </div>
  ),
};

// ─── avatarContact ───────────────────────────────────────────────────────────
export const AvatarContact: Story = {
  render: () => (
    <div style={{ width: 360, display: 'flex', flexDirection: 'column' }}>
      {(['base', 'hover', 'selected', 'disabled'] as ListItemState[]).map((st) => (
        <ListItem
          key={st}
          variant="avatarContact"
          state={st}
          label="Alice Johnson"
          trailingMeta="12:00"
          showDivider
          leadingAvatar={<Avatar size="sm" variant="registered-no-photo" />}
        />
      ))}
    </div>
  ),
};

// ─── checkboxSelect ──────────────────────────────────────────────────────────
export const CheckboxSelect: Story = {
  render: () => (
    <div style={{ width: 360, display: 'flex', flexDirection: 'column' }}>
      {(['base', 'hover', 'selected', 'disabled'] as ListItemState[]).map((st) => (
        <ListItem
          key={st}
          variant="checkboxSelect"
          state={st}
          label={`checkboxSelect — ${st}`}
          showDivider
          leadingCheckbox={<Checkbox size="sm" checked={st === 'selected'} readOnly />}
          trailingAction={<Switch size="sm" state={st === 'selected' ? 'on' : 'off'} />}
        />
      ))}
    </div>
  ),
};

// ─── Full Matrix ─────────────────────────────────────────────────────────────
export const FullMatrix: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
      {(['iconNav', 'iconMeta', 'avatarContact', 'checkboxSelect'] as ListItemVariant[]).map((v) => (
        <div key={v} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4, paddingLeft: 4 }}>{v}</div>
          {(['sm', 'md', 'lg'] as ListItemSize[]).map((s) => (
            <div key={s} style={{ display: 'flex', flexDirection: 'column', marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: 'var(--color-text-muted)', paddingLeft: 4, marginBottom: 2 }}>{s}</div>
              {(['base', 'hover', 'selected', 'disabled'] as ListItemState[]).map((st) => (
                <ListItem
                  key={st}
                  size={s}
                  variant={v}
                  state={st}
                  label="List item label"
                  trailingMeta="12:00"
                  showDivider
                  style={{ width: 320 }}
                  leadingIcon={<GearIcon size={s === 'lg' ? 20 : 20} />}
                  leadingAvatar={<Avatar size="sm" variant="registered-no-photo" />}
                  leadingCheckbox={<Checkbox size="sm" />}
                  trailingChevron={<ChevronRightIcon size={20} />}
                  trailingBadge={<Badge appearance="brand" size="sm">3</Badge>}
                  trailingAction={<Switch size="sm" state="off" />}
                />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};

// ─── Interactive (with selection) ────────────────────────────────────────────
export const Interactive: Story = {
  render: () => {
    const [selected, setSelected] = useState<number | null>(null);
    const items = [
      { label: 'Profile settings', icon: <PersonIcon size={20} /> },
      { label: 'Notifications',    icon: <BellIcon size={20} /> },
      { label: 'Search preferences', icon: <SearchIcon size={20} /> },
      { label: 'Advanced config',  icon: <GearIcon size={20} /> },
    ];
    return (
      <div style={{ width: 360, display: 'flex', flexDirection: 'column' }}>
        {items.map((item, i) => (
          <ListItem
            key={i}
            variant="iconNav"
            state={selected === i ? 'selected' : undefined}
            label={item.label}
            showDivider={i < items.length - 1}
            leadingIcon={item.icon}
            trailingChevron={<ChevronRightIcon size={20} />}
            onClick={() => setSelected(i)}
          />
        ))}
      </div>
    );
  },
};

// ─── Loading → Content transition (skeleton integration) ─────────────────────
export const WithSkeleton: Story = {
  render: () => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      const t = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(t);
    }, []);

    return (
      <div style={{ width: 360, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading ? (
          <SkeletonList size="sm" shimmer rows={4} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {['Profile', 'Notifications', 'Search', 'Settings'].map((label, i) => (
              <ListItem
                key={label}
                variant="iconNav"
                label={label}
                showDivider={i < 3}
                leadingIcon={<GearIcon size={20} />}
                trailingChevron={<ChevronRightIcon size={20} />}
              />
            ))}
          </div>
        )}
        <button
          onClick={() => setLoading(true)}
          style={{
            alignSelf: 'flex-start',
            padding: '6px 16px',
            fontSize: 12,
            borderRadius: 4,
            border: '1px solid var(--color-border-base)',
            background: 'var(--color-surface-1)',
            color: 'var(--color-text-primary)',
            cursor: 'pointer',
          }}
        >
          Reload (2s delay)
        </button>
      </div>
    );
  },
};

// ─── Interactive CheckboxSelect ───────────────────────────────────────────────
export const InteractiveCheckboxSelect: Story = {
  render: () => {
    const [checked, setChecked] = useState<Record<number, boolean>>({ 0: false, 1: true, 2: false });
    const items = ['Enable dark mode', 'Auto-sync data', 'Send notifications'];

    return (
      <div style={{ width: 360, display: 'flex', flexDirection: 'column' }}>
        {items.map((label, i) => (
          <ListItem
            key={i}
            variant="checkboxSelect"
            state={checked[i] ? 'selected' : undefined}
            label={label}
            showDivider={i < items.length - 1}
            leadingCheckbox={
              <Checkbox
                size="sm"
                checked={checked[i]}
                onChange={(e) => setChecked((prev) => ({ ...prev, [i]: e.target.checked }))}
              />
            }
            trailingAction={
              <Switch
                size="sm"
                state={checked[i] ? 'on' : 'off'}
                onClick={() => setChecked((prev) => ({ ...prev, [i]: !prev[i] }))}
              />
            }
            onClick={() => setChecked((prev) => ({ ...prev, [i]: !prev[i] }))}
          />
        ))}
      </div>
    );
  },
};
