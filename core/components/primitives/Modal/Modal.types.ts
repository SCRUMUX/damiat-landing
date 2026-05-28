export type ModalVariant = 'base' | 'danger' | 'warning' | 'success';
export type ModalSize = 'sm' | 'md' | 'lg';

export interface ModalProps {
  variant?: ModalVariant;
  size?: ModalSize;
  showClose?: boolean;
  showFooter?: boolean;
  title?: React.ReactNode;
  content?: React.ReactNode;
  cancelLabel?: string;
  confirmLabel?: string;
  onClose?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  cancelButton?: React.ReactNode;
  confirmButton?: React.ReactNode;
  open?: boolean;
  portal?: boolean;
  /** Storybook / inline preview: panel only, no overlay or portal positioning. */
  embedded?: boolean;
  confirmLoading?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
