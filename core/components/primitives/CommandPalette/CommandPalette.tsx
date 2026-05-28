import React, { useCallback, useMemo } from 'react';
import type { CommandPaletteProps } from './CommandPalette.types';
import { cn, findClasses, MENU_ITEM_CLASSES, type VR } from '../_shared';
import { RadixDialog, Cmdk } from '../_internal';
import contract from '../../../contracts/components/CommandPalette.contract.json';

const rules = (contract.variantRules || []) as unknown as VR[];
const PANEL_CLASSES = findClasses(rules, {});

const OVERLAY_CLASSES = 'fixed inset-0 z-modal bg-[var(--effect-scrim-light)] animate-fade-in';
const PANEL_POSITION =
  'fixed z-modal left-1/2 top-[20%] -translate-x-1/2 animate-modal-in';
const INPUT_ROW = 'border-b border-[var(--color-border-base)] px-[var(--space-12)]';
const INPUT_FIELD =
  'w-full bg-transparent py-[var(--space-12)] text-style-body outline-none text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]';
const LIST =
  'max-h-[var(--space-320)] overflow-y-auto p-[var(--space-dropdown-popover-inset)]';
const EMPTY = 'py-[var(--space-24)] text-center text-style-body-sm text-[var(--color-text-muted)]';
const GROUP_HEADING =
  '[&_[cmdk-group-heading]]:px-[var(--space-8)] [&_[cmdk-group-heading]]:py-[var(--space-6)] [&_[cmdk-group-heading]]:text-style-caption-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-[var(--color-text-muted)]';
const ITEM_SELECTED =
  'aria-selected:bg-[var(--color-surface-3)] data-[selected=true]:bg-[var(--color-surface-3)]';

const DEFAULT_ACTIONS: CommandPaletteProps['actions'] = [
  { id: 'home', label: 'Go to Home', group: 'Navigation', shortcut: 'G H' },
  { id: 'settings', label: 'Open Settings', group: 'Navigation', shortcut: 'G S' },
  { id: 'profile', label: 'View Profile', group: 'Account' },
  { id: 'logout', label: 'Sign out', group: 'Account' },
];

/**
 * CommandPalette — searchable command dialog, backed by cmdk + Radix Dialog.
 */
export const CommandPalette: React.FC<CommandPaletteProps> = (props) => {
  const {
    open,
    defaultOpen = false,
    onOpenChange,
    actions = DEFAULT_ACTIONS,
    placeholder = 'Type a command or search...',
    emptyMessage = 'No results found.',
    title = 'Command Palette',
  } = props;

  const grouped = useMemo(() => {
    const map = new Map<string, typeof actions>();
    for (const action of actions ?? []) {
      const group = action.group ?? 'Commands';
      if (!map.has(group)) map.set(group, []);
      map.get(group)!.push(action);
    }
    return map;
  }, [actions]);

  const handleOpenChange = useCallback((next: boolean) => {
    onOpenChange?.(next);
  }, [onOpenChange]);

  const handleSelect = useCallback((actionId: string) => {
    const action = actions?.find((a) => a.id === actionId);
    action?.onSelect?.();
    onOpenChange?.(false);
  }, [actions, onOpenChange]);

  return (
    <RadixDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={handleOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className={OVERLAY_CLASSES} />
        <RadixDialog.Content className={cn(PANEL_POSITION, ...PANEL_CLASSES)}>
          <RadixDialog.Title className="sr-only">{title}</RadixDialog.Title>
          <Cmdk.Command className="flex flex-col" loop>
            <div className={INPUT_ROW}>
              <Cmdk.Input placeholder={placeholder} className={INPUT_FIELD} />
            </div>
            <Cmdk.List className={LIST}>
              <Cmdk.Empty className={EMPTY}>{emptyMessage}</Cmdk.Empty>
              {[...grouped.entries()].map(([group, groupActions]) => (
                <Cmdk.Group key={group} heading={group} className={GROUP_HEADING}>
                  {groupActions.map((action) => (
                    <Cmdk.Item
                      key={action.id}
                      value={`${action.label} ${action.keywords?.join(' ') ?? ''}`}
                      disabled={action.disabled}
                      onSelect={() => handleSelect(action.id)}
                      className={cn(
                        'flex cursor-pointer select-none items-center justify-between rounded-[var(--radius-default)]',
                        MENU_ITEM_CLASSES.md,
                        'text-style-body text-[var(--color-text-primary)]',
                        ITEM_SELECTED,
                        'data-[disabled=true]:opacity-[var(--opacity-disabled)] data-[disabled=true]:pointer-events-none',
                      )}
                    >
                      <span>{action.label}</span>
                      {action.shortcut && (
                        <span className="text-style-caption-xs text-[var(--color-text-muted)]">
                          {action.shortcut}
                        </span>
                      )}
                    </Cmdk.Item>
                  ))}
                </Cmdk.Group>
              ))}
            </Cmdk.List>
          </Cmdk.Command>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};

CommandPalette.displayName = 'CommandPalette';
