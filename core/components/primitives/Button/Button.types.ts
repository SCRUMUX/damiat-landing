export type ButtonAppearance = 'brand' | 'base' | 'ghost' | 'ghost-danger' | 'ghost-warning' | 'ghost-success' | 'outline' | 'success' | 'warning' | 'danger';

export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonState = 'base' | 'active' | 'hover' | 'focus' | 'disabled';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  appearance?: ButtonAppearance;
  size?: ButtonSize;
  state?: ButtonState;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  showLabel?: boolean;
}
