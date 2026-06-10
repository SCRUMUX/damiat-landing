/**
 * Internal implementation substrate for AICADS primitives.
 *
 * Adapters over Radix / cmdk / Floating UI / sonner live here and are
 * consumed by `components/primitives/<Name>/<Name>.tsx`.
 *
 * NEVER import from `@ai-ds/core/_internal` in consumer code — this
 * surface is not part of the public package `exports` and may change at
 * any time. See [./README.md](./README.md) for the isolation contract.
 */
export { RadixPopover } from './Popover';
export type {
  RadixPopoverContentProps,
  RadixPopoverTriggerProps,
  RadixPopoverRootProps,
  RadixPopoverAnchorProps,
} from './Popover';

export { RadixTooltip } from './Tooltip';
export type {
  RadixTooltipProviderProps,
  RadixTooltipRootProps,
  RadixTooltipTriggerProps,
  RadixTooltipContentProps,
} from './Tooltip';

export { RadixDialog } from './Dialog';
export type {
  RadixDialogRootProps,
  RadixDialogOverlayProps,
  RadixDialogContentProps,
  RadixDialogTitleProps,
  RadixDialogDescriptionProps,
} from './Dialog';

export { VaulDrawer } from './Drawer';
export type {
  VaulDrawerRootProps,
  VaulDrawerContentProps,
  VaulDrawerOverlayProps,
} from './Drawer';

export { RadixCheckbox } from './Checkbox';
export type { RadixCheckboxRootProps } from './Checkbox';

export { RadixRadioGroup } from './RadioGroup';
export type { RadixRadioGroupRootProps, RadixRadioGroupItemProps } from './RadioGroup';

export { RadixSwitch } from './Switch';
export type { RadixSwitchRootProps } from './Switch';

export { RadixSlider } from './Slider';
export type { RadixSliderRootProps } from './Slider';

export { RadixSelect } from './Select';
export type { RadixSelectTriggerProps, RadixSelectContentProps } from './Select';

export { Cmdk } from './Command';
export type { CmdkCommandProps, CmdkItemProps } from './Command';

export { RadixAccordion } from './Accordion';
export type { RadixAccordionRootProps } from './Accordion';

export { RadixTabs } from './Tabs';
export type { RadixTabsRootProps } from './Tabs';

export { RadixScrollArea } from './ScrollArea';
export type { RadixScrollAreaRootProps } from './ScrollArea';

export { SonnerToaster, sonnerToast } from './Toast';
export type { ExternalToast, SonnerToasterProps } from './Toast';
