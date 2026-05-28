import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import type { ModalVariant, ModalSize } from './Modal.types';
import { Button } from '../Button/Button';

const VARIANTS: ModalVariant[] = ['base', 'danger', 'warning', 'success'];
const SIZES: ModalSize[] = ['sm', 'md', 'lg'];

const meta: Meta<typeof Modal> = {
  title: 'Primitives/Modal',
  component: Modal,
  parameters: {
    docs: {
      description: {
        component:
          '`@UI/Modal` — диалоговое окно с overlay, заголовком, контентом и футером с кнопками. ' +
          'Варианты: base / danger / warning / success. Размеры: sm / md / lg. ' +
          'Props: `showClose`, `showFooter`, `onClose`, `onConfirm`, `onCancel`, `confirmLoading`.',
      },
    },
    layout: 'fullscreen',
  },
  argTypes: {
    variant:       { control: 'select',  options: VARIANTS, description: 'Визуальный вариант' },
    size:          { control: 'select',  options: SIZES, description: 'Размер панели' },
    showClose:     { control: 'boolean', description: 'Показать кнопку закрытия ×' },
    showFooter:    { control: 'boolean', description: 'Показать футер с кнопками' },
    title:         { control: 'text',    description: 'Заголовок' },
    cancelLabel:   { control: 'text',    description: 'Текст кнопки отмены' },
    confirmLabel:  { control: 'text',    description: 'Текст кнопки подтверждения' },
    content:       { control: 'text',    description: 'Содержимое модала' },
    confirmLoading:{ control: 'boolean', description: 'Confirm в состоянии загрузки' },
    cancelButton:  { control: false },
    confirmButton: { control: false },
    onClose:       { action: 'closed',    description: 'Вызывается при закрытии (× или overlay)' },
    onConfirm:     { action: 'confirmed', description: 'Вызывается при подтверждении' },
    onCancel:      { action: 'cancelled', description: 'Вызывается при отмене' },
  },
};
export default meta;
type Story = StoryObj<typeof Modal>;

// ─── Helper: interactive wrapper with open/close ──────
const ModalDemo: React.FC<{
  variant?: ModalVariant;
  size?: ModalSize;
  title?: string;
  content?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  showClose?: boolean;
  showFooter?: boolean;
  confirmLoading?: boolean;
}> = ({
  variant = 'base',
  size = 'md',
  title = 'Modal title',
  content = 'Modal content.',
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
  showClose = true,
  showFooter = true,
  confirmLoading = false,
}) => {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ position: 'relative', width: '100%', minHeight: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-surface-2)', padding: 24 }}>
      {!open && (
        <Button appearance="brand" size="sm" onClick={() => setOpen(true)}>
          Open modal
        </Button>
      )}
      <Modal
        variant={variant}
        size={size}
        open={open}
        portal={false}
        showClose={showClose}
        showFooter={showFooter}
        title={title}
        content={content}
        cancelLabel={cancelLabel}
        confirmLabel={confirmLabel}
        confirmLoading={confirmLoading}
        onClose={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        style={{ position: 'relative' }}
      />
    </div>
  );
};

// ─── Default ─────────────────────────────────────────────────────────────────
export const Default: Story = {
  render: () => (
    <ModalDemo
      title="Modal title"
      content="Modal content. This is a description of the action being confirmed."
    />
  ),
};

// ─── All Variants ─────────────────────────────────────────────────────────────
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, padding: 24, background: 'var(--color-surface-2)' }}>
      {VARIANTS.map((v) => (
        <div key={v} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>variant={v}</span>
          <ModalDemo
            variant={v}
            title={`${v.charAt(0).toUpperCase() + v.slice(1)} dialog`}
            content={`This is a ${v} modal. Press × or Cancel to close.`}
          />
        </div>
      ))}
    </div>
  ),
};

// ─── All Sizes ────────────────────────────────────────────────────────────────
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 24, background: 'var(--color-surface-2)' }}>
      {SIZES.map((s) => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>size={s}</span>
          <ModalDemo size={s} title={`Size ${s}`} content={`This modal uses size="${s}".`} />
        </div>
      ))}
    </div>
  ),
};

// ─── Without Close button ─────────────────────────────────────────────────────
export const NoCloseButton: Story = {
  render: () => (
    <ModalDemo
      title="Confirm action"
      content="This modal has no × button. Close it with Cancel."
      showClose={false}
    />
  ),
};

// ─── Without Footer ───────────────────────────────────────────────────────────
export const NoFooter: Story = {
  render: () => (
    <ModalDemo
      title="Information"
      content="This modal has no footer buttons. Close it with the × button."
      showFooter={false}
    />
  ),
};

// ─── Danger variant ───────────────────────────────────────────────────────────
export const Danger: Story = {
  render: () => (
    <ModalDemo
      variant="danger"
      title="Delete item"
      content="Are you sure you want to delete this item? This action cannot be undone."
      confirmLabel="Delete"
    />
  ),
};

// ─── Confirm Loading ──────────────────────────────────────────────────────────
export const ConfirmLoading: Story = {
  render: () => (
    <ModalDemo
      title="Processing..."
      content="Please wait while we process your request."
      confirmLabel="Saving..."
      confirmLoading
    />
  ),
};

// ─── Interactive (with real open/close via portal) ────────────────────────────
export const Interactive: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [variant, setVariant] = useState<ModalVariant>('base');
    const [log, setLog] = useState<string[]>([]);

    const addLog = (msg: string) => setLog((prev) => [...prev.slice(-4), msg]);

    const configs: Record<ModalVariant, { title: string; content: string; confirmLabel: string }> = {
      base:    { title: 'Confirm action',  content: 'Are you sure you want to proceed?',                       confirmLabel: 'Confirm' },
      danger:  { title: 'Delete account',  content: 'This will permanently delete your account and all data.', confirmLabel: 'Delete' },
      warning: { title: 'Unsaved changes', content: 'Leaving now will discard your unsaved changes.',          confirmLabel: 'Discard' },
      success: { title: 'Publish changes', content: 'Your changes will be published immediately.',             confirmLabel: 'Publish' },
    };

    const cfg = configs[variant];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {VARIANTS.map((v) => (
            <Button
              key={v}
              appearance={v === 'base' ? 'brand' : v === 'danger' ? 'danger' : v === 'warning' ? 'warning' : 'success'}
              size="sm"
              onClick={() => { setVariant(v); setOpen(true); }}
            >
              Open {v}
            </Button>
          ))}
        </div>
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {log.map((l, i) => <span key={i}>{l}</span>)}
        </div>
        <Modal
          variant={variant}
          open={open}
          showClose
          showFooter
          title={cfg.title}
          content={cfg.content}
          confirmLabel={cfg.confirmLabel}
          cancelLabel="Cancel"
          onClose={() => { setOpen(false); addLog('Closed'); }}
          onConfirm={() => { setOpen(false); addLog(`Confirmed (${variant})`); }}
        />
      </div>
    );
  },
};

// ─── Full Matrix: variants × config combos (embedded panel previews) ───────────
const MATRIX_CONFIGS = [
  { label: 'close + footer', showClose: true, showFooter: true },
  { label: 'close only', showClose: true, showFooter: false },
  { label: 'footer only', showClose: false, showFooter: true },
  { label: 'minimal', showClose: false, showFooter: false },
] as const;

export const FullMatrix: Story = {
  render: () => (
    <div style={{ padding: 24, background: 'var(--color-surface-2)', display: 'flex', flexDirection: 'column', gap: 40 }}>
      {VARIANTS.map((v) => (
        <section key={v}>
          <h3 style={{ margin: '0 0 16px', fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>
            variant={v}
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 20,
              alignItems: 'start',
            }}
          >
            {MATRIX_CONFIGS.map((cfg) => (
              <div key={cfg.label} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{cfg.label}</span>
                <Modal
                  embedded
                  size="sm"
                  variant={v}
                  showClose={cfg.showClose}
                  showFooter={cfg.showFooter}
                  title="Dialog title"
                  content="Dialog body text for preview."
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
};
