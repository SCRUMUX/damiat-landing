/**
 * UI Components — token-driven React primitives.
 *
 * This barrel is the **public** semantic surface of `@ai-ds/core`.
 * Implementation details (Radix UI / cmdk / vaul / sonner) live inside
 * `components/primitives/_internal/` and are never re-exported from here.
 *
 * Consumers (AI code generators, Figma plugin, application code) should
 * import only from this barrel or from the individual primitive paths
 * (`@ai-ds/core/components/<Name>`). See `ai-manifest.json` for the
 * machine-readable mapping of each primitive to its semantic role and
 * the behavior engine that powers it under the hood.
 */

// ── Forms ──
export { Button } from './primitives/Button';
export type { ButtonProps, ButtonAppearance, ButtonSize, ButtonState } from './primitives/Button';

export { Input } from './primitives/Input';
export type { InputProps, InputAppearance, InputSize, InputState } from './primitives/Input';

export { Textarea } from './primitives/Textarea';
export type { TextareaProps, TextareaSize, TextareaState } from './primitives/Textarea';

export { Checkbox } from './primitives/Checkbox';
export type { CheckboxProps, CheckboxSize, CheckboxState } from './primitives/Checkbox';

export { RadioButton, RadioGroup } from './primitives/RadioButton';
export type { RadioButtonProps, RadioButtonSize, RadioButtonState, RadioGroupProps } from './primitives/RadioButton';

export { Switch } from './primitives/Switch';
export type { SwitchProps, SwitchSize, SwitchState } from './primitives/Switch';

export { Slider } from './primitives/Slider';
export type { SliderProps, SliderSize, SliderThumbs } from './primitives/Slider';

export { RangeSlider } from './primitives/RangeSlider';
export type { RangeSliderProps, RangeSliderSize, RangeSliderState } from './primitives/RangeSlider';

export { Select } from './primitives/Select';
export type { SelectProps, SelectSize, SelectState, SelectOption } from './primitives/Select';

export { PinInput } from './primitives/PinInput';
export type { PinInputProps, PinInputSize, PinInputState } from './primitives/PinInput';

export { FileUpload } from './primitives/FileUpload';
export type { FileUploadProps, FileUploadSize, FileUploadState } from './primitives/FileUpload';

export { Rating } from './primitives/Rating';
export type { RatingProps, RatingSize, RatingValue } from './primitives/Rating';

export { Captcha } from './primitives/Captcha';
export type { CaptchaProps, CaptchaState } from './primitives/Captcha';

export { FormHint } from './primitives/FormHint';
export type { FormHintProps, FormHintSize, FormHintAppearance } from './primitives/FormHint';

// ── Combobox / search ──
export { Autocomplete } from './primitives/Autocomplete';
export type { AutocompleteProps, AutocompleteState, AutocompleteSize } from './primitives/Autocomplete';

export { AutocompleteItem } from './primitives/AutocompleteItem';
export type { AutocompleteItemProps, AutocompleteItemSize, AutocompleteItemItemType } from './primitives/AutocompleteItem';

export { Dropdown } from './primitives/Dropdown';
export type { DropdownProps, DropdownState, DropdownSize } from './primitives/Dropdown';

export { DropdownItem } from './primitives/DropdownItem';
export type { DropdownItemProps, DropdownItemSize, DropdownItemItemType } from './primitives/DropdownItem';

export { CommandPalette } from './primitives/CommandPalette';
export type { CommandPaletteProps, CommandPaletteAction } from './primitives/CommandPalette';

// ── Overlays ──
export { Popover } from './primitives/Popover';
export type { PopoverProps } from './primitives/Popover';

export { Tooltip, TooltipBubble } from './primitives/Tooltip';
export type { TooltipProps, TooltipBubbleProps, TooltipPosition, TooltipAppearance } from './primitives/Tooltip';

export { Modal } from './primitives/Modal';
export type { ModalProps, ModalVariant, ModalSize } from './primitives/Modal';

export { Drawer } from './primitives/Drawer';
export type { DrawerProps, DrawerSize, DrawerSide } from './primitives/Drawer';

export { Toaster, toast } from './primitives/Toast';
export type { ToasterProps, ToastAppearance, ToastPosition, ToastItem } from './primitives/Toast';

// ── Disclosure / navigation ──
export { Accordion } from './primitives/Accordion';
export type { AccordionProps, AccordionState, AccordionSize, AccordionInteraction } from './primitives/Accordion';

export { Tab, Tabs, TabList, TabPanel } from './primitives/Tab';
export type { TabProps, TabAppearance, TabSize, TabState, TabsProps } from './primitives/Tab';

export { Breadcrumb } from './primitives/Breadcrumb';
export type { BreadcrumbProps, BreadcrumbLevels } from './primitives/Breadcrumb';

export { Pagination } from './primitives/Pagination';
export type { PaginationProps, PaginationSize, PaginationAppearance, PaginationVariant } from './primitives/Pagination';

export { Link } from './primitives/Link';
export type { LinkProps, LinkSize, LinkState } from './primitives/Link';

// ── Feedback / status ──
export { Alert } from './primitives/Alert';
export type { AlertProps, AlertAppearance, AlertVariant } from './primitives/Alert';

export { EmptyState } from './primitives/EmptyState';
export type { EmptyStateProps, EmptyStateSize, EmptyStateAppearance, EmptyStateLayout } from './primitives/EmptyState';

export { Spinner } from './primitives/Spinner';
export type { SpinnerProps, SpinnerSize, SpinnerAppearance } from './primitives/Spinner';

export { CircularProgress } from './primitives/CircularProgress';
export type { CircularProgressProps, CircularProgressSize } from './primitives/CircularProgress';

export { LinearProgress } from './primitives/LinearProgress';
export type { LinearProgressProps, LinearProgressSize } from './primitives/LinearProgress';

// ── Display / content ──
export { Avatar } from './primitives/Avatar';
export type { AvatarProps, AvatarVariant, AvatarSize } from './primitives/Avatar';

export { Badge } from './primitives/Badge';
export type { BadgeProps, BadgeAppearance, BadgeSize } from './primitives/Badge';

export { Chip } from './primitives/Chip';
export type { ChipProps, ChipAppearance, ChipSize, ChipState } from './primitives/Chip';

export { Tag } from './primitives/Tag';
export type { TagProps, TagAppearance, TagSize, TagState } from './primitives/Tag';

export { TagRow } from './primitives/TagRow';
export type { TagRowProps } from './primitives/TagRow';

export { Card } from './primitives/Card';
export type { CardProps, CardVariant, CardSize, CardState } from './primitives/Card';

export { Image } from './primitives/Image';
export type { ImageProps, ImageLayout, ImageSize, ImageRatio, ImageState } from './primitives/Image';

export { Paragraph } from './primitives/Paragraph';
export type { ParagraphProps, ParagraphSize, ParagraphBreakpoint } from './primitives/Paragraph';

export { SectionHeader } from './primitives/SectionHeader';
export type { SectionHeaderProps, SectionHeaderSize, SectionHeaderAppearance } from './primitives/SectionHeader';

export { ListItem } from './primitives/ListItem';
export type { ListItemProps, ListItemSize, ListItemInteraction, ListItemVariant } from './primitives/ListItem';

export { Divider } from './primitives/Divider';
export type { DividerProps, DividerOrientation, DividerSize, DividerAppearance } from './primitives/Divider';

// ── Data ──
export { Table } from './primitives/Table';
export type { TableProps, TableSize, TableAppearance } from './primitives/Table';

export { TableRow } from './primitives/TableRow';
export type { TableRowProps, TableRowSize, TableRowState } from './primitives/TableRow';

export { TableCell } from './primitives/TableCell';
export type { TableCellProps, TableCellSize, TableCellType } from './primitives/TableCell';

export { TableHeaderRow } from './primitives/TableHeaderRow';
export type { TableHeaderRowProps, TableHeaderRowSize } from './primitives/TableHeaderRow';

export { TableHeaderCell } from './primitives/TableHeaderCell';
export type { TableHeaderCellProps, TableHeaderCellSize, TableHeaderCellSort } from './primitives/TableHeaderCell';

// ── Layout helpers ──
export { GridContainer, GridItem } from './primitives/GridContainer';
export type { GridContainerProps, GridItemProps, GridContainerMaxWidth } from './primitives/GridContainer';

export { ScrollBar } from './primitives/ScrollBar';
export type { ScrollBarProps, ScrollBarOrientation, ScrollBarSize, ScrollBarShape } from './primitives/ScrollBar';

// ── Skeletons ──
export { SkeletonCard } from './primitives/SkeletonCard';
export type { SkeletonCardProps, SkeletonCardSize } from './primitives/SkeletonCard';

export { SkeletonChart } from './primitives/SkeletonChart';
export type { SkeletonChartProps, SkeletonChartSize, SkeletonChartType } from './primitives/SkeletonChart';

export { SkeletonList } from './primitives/SkeletonList';
export type { SkeletonListProps, SkeletonListSize } from './primitives/SkeletonList';

export { SkeletonPage } from './primitives/SkeletonPage';
export type { SkeletonPageProps, SkeletonPageSize } from './primitives/SkeletonPage';

export { SkeletonTable } from './primitives/SkeletonTable';
export type { SkeletonTableProps, SkeletonTableSize } from './primitives/SkeletonTable';
