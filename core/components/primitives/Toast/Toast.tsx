import React from 'react';
import type { ToasterProps, ToastItem, ToastPosition, ToastAppearance } from './Toast.types';
import { cn, findClasses, type VR } from '../_shared';
import { SonnerToaster, sonnerToast } from '../_internal';
import contract from '../../../contracts/components/Toast.contract.json';

/**
 * Toast — sonner-backed notification surface.
 *
 * Public API:
 *   - `<Toaster />` — render once near the app root; hosts the toast stack.
 *   - `toast({ appearance, title, ... })` — imperative call to enqueue a
 *      notification from anywhere in the app.
 */

const rules = (contract.variantRules || []) as unknown as VR[];
const TOAST_SURFACE_CLASSES = findClasses(rules, {});

const POSITION_MAP: Record<ToastPosition, 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left'> = {
  'top-right': 'top-right',
  'top-center': 'top-center',
  'top-left': 'top-left',
  'bottom-right': 'bottom-right',
  'bottom-center': 'bottom-center',
  'bottom-left': 'bottom-left',
};

const SONNER_TYPE_MAP: Record<ToastAppearance, 'info' | 'success' | 'warning' | 'error'> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'error',
};

export function toast(config: ToastItem) {
  const { appearance = 'info', title, description, duration, showClose, icon } = config;
  sonnerToast[SONNER_TYPE_MAP[appearance]](String(title ?? ''), {
    description: description ? String(description) : undefined,
    duration: duration ?? 5000,
    dismissible: showClose !== false,
    icon,
  });
}

export const Toaster: React.FC<ToasterProps> = ({
  position = 'top-right',
  maxVisible = 5,
}) => (
  <SonnerToaster
    position={POSITION_MAP[position]}
    visibleToasts={maxVisible}
    toastOptions={{
      classNames: {
        toast: cn(...TOAST_SURFACE_CLASSES),
        title: 'text-style-caption font-semibold',
        description: 'text-style-body-sm opacity-80',
      },
    }}
  />
);

Toaster.displayName = 'Toaster';
