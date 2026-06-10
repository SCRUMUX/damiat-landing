export type InputSize = 'sm' | 'md' | 'lg';
export type InputState = 'base' | 'hover' | 'focus' | 'filled' | 'disabled';
export type InputAppearance = 'base' | 'brand' | 'ghost' | 'outline';

export interface InputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  appearance?: InputAppearance;
  size?: InputSize;
  state?: InputState;

  iconLeft1?: React.ReactNode;
  iconLeft2?: React.ReactNode;
  badge?: React.ReactNode;
  tagRow?: React.ReactNode;
  iconRight1?: React.ReactNode;
  iconRight2?: React.ReactNode;
  showIconLeft1?: boolean;
  showIconLeft2?: boolean;
  showBadge?: boolean;
  showTagRow?: boolean;
  showIconRight1?: boolean;
  showIconRight2?: boolean;

  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  type?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  maxLength?: number;
  invalid?: boolean;
  'aria-describedby'?: string;
  'aria-label'?: string;
  showClearButton?: boolean;
  clearAlwaysVisible?: boolean;
  onClear?: () => void;
  fullWidth?: boolean;
}
