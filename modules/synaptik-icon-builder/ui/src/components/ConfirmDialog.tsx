import { Modal } from '@ai-ds/core/components/Modal';
import { t } from '../i18n/ru.js';

export type ConfirmKind =
  | 'forceNew'
  | 'sessionExists'
  | 'publish'
  | 'republish'
  | 'promptQualityLow'
  | 'publishAllReady'
  | 'deleteSession';

export interface ConfirmState {
  kind: ConfirmKind;
  sessionId?: string;
  cardId?: string;
  cardTitle?: string;
}

interface ConfirmDialogProps {
  state: ConfirmState | null;
  onConfirm: () => void;
  onCancel: () => void;
}

function titleFor(state: ConfirmState): string {
  if (state.kind === 'forceNew') return t.confirmForceNewTitle;
  if (state.kind === 'sessionExists') return t.confirm409Title;
  if (state.kind === 'republish') return t.confirmRepublishTitle;
  if (state.kind === 'promptQualityLow') return t.confirmPromptQualityTitle;
  if (state.kind === 'publishAllReady') return t.confirmPublishAllTitle;
  if (state.kind === 'deleteSession') return t.deleteSessionTitle;
  return t.confirmPublishTitle;
}

function contentFor(state: ConfirmState): string {
  if (state.kind === 'forceNew') return t.confirmForceNew;
  if (state.kind === 'sessionExists' && state.sessionId) {
    return t.confirm409(state.sessionId);
  }
  if (state.kind === 'republish') {
    return t.confirmRepublish(state.cardTitle ?? state.cardId ?? '—');
  }
  if (state.kind === 'promptQualityLow') return t.confirmPromptQuality;
  if (state.kind === 'publishAllReady') return t.confirmPublishAll;
  if (state.kind === 'deleteSession') return t.deleteSessionBody;
  return t.confirmPublish;
}

export function ConfirmDialog({ state, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!state) return null;

  const confirmLabel =
    state.kind === 'promptQualityLow'
      ? t.confirmGenerateAnyway
      : state.kind === 'deleteSession'
        ? t.deleteSessionConfirm
        : t.confirmOk;

  return (
    <Modal
      open
      portal
      variant="warning"
      size="md"
      title={titleFor(state)}
      content={contentFor(state)}
      cancelLabel={t.confirmCancel}
      confirmLabel={confirmLabel}
      onConfirm={onConfirm}
      onCancel={onCancel}
      onClose={onCancel}
    />
  );
}
