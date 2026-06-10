import React from 'react';

export type TextareaSize = 'sm' | 'md' | 'lg';

export type TextareaState = 'base' | 'hover' | 'focus' | 'disabled';

export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';

export interface TextareaProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  size?: TextareaSize;
  /** Controlled visual state override */
  state?: TextareaState;
  /** Controlled value */
  value?: string;
  /** Initial value (uncontrolled) */
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  /** Read-only mode */
  readOnly?: boolean;
  /** Required field indicator */
  required?: boolean;
  /** Field name for form submission */
  name?: string;
  /** ID for label association */
  id?: string;
  /** Maximum character limit */
  maxLength?: number;
  /** Minimum character limit */
  minLength?: number;
  /** Number of visible text rows */
  rows?: number;
  /** Whether the textarea has a validation error */
  invalid?: boolean;
  /** Resize behavior. Defaults to 'vertical'. */
  resize?: TextareaResize;
  /** Show character count indicator */
  showCharCount?: boolean;
  /** Accessible description */
  'aria-describedby'?: string;
  /** Accessible label */
  'aria-label'?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  /** Extra props for the native <textarea> */
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
}
