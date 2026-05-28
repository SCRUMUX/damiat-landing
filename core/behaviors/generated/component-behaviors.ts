/**
 * AUTO-GENERATED from contracts. Do not edit by hand.
 * Regenerate: npm run behaviors:generate
 *
 * Behavior layer: import this in your app and call registerComponentBehaviors()
 * to seed the behavior registry with component state machines and focus config.
 */

export const COMPONENT_IDS = [
  '@UI/Accordion',
  '@UI/Alert',
  '@UI/Autocomplete',
  '@UI/AutocompleteItem',
  '@UI/Avatar',
  '@UI/Badge',
  '@UI/Breadcrumb',
  '@UI/Button',
  '@UI/Captcha',
  '@UI/Card',
  '@UI/Checkbox',
  '@UI/Chip',
  '@UI/CircularProgress',
  '@UI/Divider',
  '@UI/Drawer',
  '@UI/Dropdown',
  '@UI/DropdownItem',
  '@UI/EmptyState',
  '@UI/FileUpload',
  '@UI/FormHint',
  '@UI/Image',
  '@UI/Input',
  '@UI/LinearProgress',
  '@UI/Link',
  '@UI/ListItem',
  '@UI/Modal',
  '@UI/Pagination',
  '@UI/Paragraph',
  '@UI/PinInput',
  '@UI/Popover',
  '@UI/RadioButton',
  '@UI/RangeSlider',
  '@UI/Rating',
  '@UI/ScrollBar',
  '@UI/SectionHeader',
  '@UI/Select',
  '@UI/Skeleton/Card',
  '@UI/Skeleton/Chart',
  '@UI/Skeleton/List',
  '@UI/Skeleton/Page',
  '@UI/Skeleton/Table',
  '@UI/Slider',
  '@UI/Spinner',
  '@UI/Switch',
  '@UI/Tab',
  '@UI/Table/Cell',
  '@UI/Table/HeaderCell',
  '@UI/Table/HeaderRow',
  '@UI/Table/Row',
  '@UI/Table',
  '@UI/Tag',
  '@UI/TagRow',
  '@UI/Textarea',
  '@UI/Toast',
  '@UI/Tooltip',
];

export const COMPONENT_STATE_MACHINES: Record<string, { initial: string; states: string[]; transitions: Array<{ from: string; to: string; trigger: string }> }> = {
  ['@UI/Accordion']: { initial: 'base', states: ["base","hover","disabled"], transitions: [{"from":"base","to":"hover","trigger":"mouseenter"},{"from":"hover","to":"base","trigger":"mouseleave"},{"from":"base","to":"focus","trigger":"focus"},{"from":"focus","to":"base","trigger":"blur"}] },
  ['@UI/Button']: { initial: 'base', states: ["base","active","hover","focus","disabled"], transitions: [{"from":"base","to":"hover","trigger":"mouseenter"},{"from":"hover","to":"base","trigger":"mouseleave"},{"from":"base","to":"focus","trigger":"focus"},{"from":"focus","to":"base","trigger":"blur"},{"from":"hover","to":"active","trigger":"mousedown"},{"from":"active","to":"hover","trigger":"mouseup"}] },
  ['@UI/Card']: { initial: 'base', states: ["base","hover","focus","disabled"], transitions: [{"from":"base","to":"hover","trigger":"mouseenter"},{"from":"hover","to":"base","trigger":"mouseleave"},{"from":"base","to":"focus","trigger":"focus"},{"from":"focus","to":"base","trigger":"blur"}] },
  ['@UI/Input']: { initial: 'base', states: ["base","hover","focus","filled","disabled"], transitions: [{"from":"base","to":"hover","trigger":"mouseenter"},{"from":"hover","to":"base","trigger":"mouseleave"},{"from":"base","to":"focus","trigger":"focus"},{"from":"focus","to":"base","trigger":"blur"}] },
  ['@UI/Link']: { initial: 'base', states: ["base","hover","visited","disabled"], transitions: [{"from":"base","to":"hover","trigger":"mouseenter"},{"from":"hover","to":"base","trigger":"mouseleave"},{"from":"base","to":"focus","trigger":"focus"},{"from":"focus","to":"base","trigger":"blur"}] },
  ['@UI/ListItem']: { initial: 'base', states: ["base","hover","selected","disabled"], transitions: [{"from":"base","to":"hover","trigger":"mouseenter"},{"from":"hover","to":"base","trigger":"mouseleave"},{"from":"base","to":"focus","trigger":"focus"},{"from":"focus","to":"base","trigger":"blur"}] },
  ['@UI/RadioButton']: { initial: 'base', states: ["base","filled","focus","always-filled","disabled"], transitions: [{"from":"base","to":"hover","trigger":"mouseenter"},{"from":"hover","to":"base","trigger":"mouseleave"},{"from":"base","to":"focus","trigger":"focus"},{"from":"focus","to":"base","trigger":"blur"}] },
  ['@UI/RangeSlider']: { initial: 'base', states: ["base","hover","disabled"], transitions: [{"from":"base","to":"hover","trigger":"mouseenter"},{"from":"hover","to":"base","trigger":"mouseleave"},{"from":"base","to":"focus","trigger":"focus"},{"from":"focus","to":"base","trigger":"blur"}] },
  ['@UI/Select']: { initial: 'base', states: ["base","hover","focus","disabled"], transitions: [{"from":"base","to":"hover","trigger":"mouseenter"},{"from":"hover","to":"base","trigger":"mouseleave"},{"from":"base","to":"focus","trigger":"focus"},{"from":"focus","to":"base","trigger":"blur"}] },
  ['@UI/Tab']: { initial: 'base', states: ["base","hover","active","focus","disabled"], transitions: [{"from":"base","to":"hover","trigger":"mouseenter"},{"from":"hover","to":"base","trigger":"mouseleave"},{"from":"base","to":"focus","trigger":"focus"},{"from":"focus","to":"base","trigger":"blur"},{"from":"hover","to":"active","trigger":"mousedown"},{"from":"active","to":"hover","trigger":"mouseup"}] },
  ['@UI/Table/Row']: { initial: 'base', states: ["base","hover","selected","disabled"], transitions: [{"from":"base","to":"hover","trigger":"mouseenter"},{"from":"hover","to":"base","trigger":"mouseleave"},{"from":"base","to":"focus","trigger":"focus"},{"from":"focus","to":"base","trigger":"blur"}] },
  ['@UI/Tag']: { initial: 'base', states: ["base","hover"], transitions: [{"from":"base","to":"hover","trigger":"mouseenter"},{"from":"hover","to":"base","trigger":"mouseleave"},{"from":"base","to":"focus","trigger":"focus"},{"from":"focus","to":"base","trigger":"blur"}] },
  ['@UI/Textarea']: { initial: 'base', states: ["base","hover","focus","disabled"], transitions: [{"from":"base","to":"hover","trigger":"mouseenter"},{"from":"hover","to":"base","trigger":"mouseleave"},{"from":"base","to":"focus","trigger":"focus"},{"from":"focus","to":"base","trigger":"blur"}] },
};

export const COMPONENT_FOCUS_RINGS: Record<string, { focusRing: string; focusRingDanger: string }> = {
  ['@UI/Accordion']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Alert']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Autocomplete']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/AutocompleteItem']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Avatar']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Badge']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Breadcrumb']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Button']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Captcha']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Card']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Checkbox']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Chip']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/CircularProgress']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Divider']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Drawer']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Dropdown']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/DropdownItem']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/EmptyState']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/FileUpload']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/FormHint']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Image']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Input']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/LinearProgress']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Link']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/ListItem']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Modal']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Pagination']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Paragraph']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/PinInput']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/RadioButton']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/RangeSlider']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Rating']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/ScrollBar']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/SectionHeader']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Select']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Skeleton/Card']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Skeleton/Chart']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Skeleton/List']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Skeleton/Page']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Skeleton/Table']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Slider']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Spinner']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Switch']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Tab']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Table/Cell']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Table/HeaderCell']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Table/HeaderRow']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Table/Row']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Table']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Tag']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/TagRow']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Textarea']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
  ['@UI/Tooltip']: { focusRing: "focus:outline-none focus:shadow-focus-brand", focusRingDanger: "focus:outline-none focus:shadow-focus-danger" },
};

export function getComponentStateMachine(componentId: string) {
  return COMPONENT_STATE_MACHINES[componentId];
}

export function getComponentFocusRing(componentId: string, isDanger = false) {
  const c = COMPONENT_FOCUS_RINGS[componentId];
  if (!c) return '';
  return isDanger ? c.focusRingDanger : c.focusRing;
}

/** Call at app bootstrap to register component behaviors with the registry (if needed). */
export function registerComponentBehaviors() {
  // Optional: register each component's state machine with behaviorRegistry
  // for layout-driven or backend-driven UI that references components by ID.
  // Example: registerBehavior('@UI/Button', { type: 'custom', stateMachine: COMPONENT_STATE_MACHINES['@UI/Button'] });
}
