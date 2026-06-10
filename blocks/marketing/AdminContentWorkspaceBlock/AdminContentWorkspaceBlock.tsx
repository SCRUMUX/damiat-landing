import React, { useCallback, useState } from 'react';
import { toast } from '../../../components/primitives/Toast';
import { cn } from '../../../components/primitives/_shared';
import { ADMIN_WORKSPACE_CLASS } from '../../_shared/blockLayout';
import { AdminContentEditorBlock } from '../AdminContentEditorBlock';
import type {
  AdminCaseDraft,
  AdminContentDraft,
  AdminContentKind,
  AdminEventDraft,
} from '../AdminContentEditorBlock/AdminContentEditor.types';
import { AdminContentListBlock } from '../AdminContentListBlock';

export interface AdminContentWorkspaceBlockProps {
  kind: AdminContentKind;
  items: AdminContentDraft[];
  onItemsChange: (items: AdminContentDraft[]) => void;
  initialView?: 'list' | 'edit';
  initialSelectedId?: string;
  className?: string;
}

function createEmptyDraft(kind: AdminContentKind): AdminContentDraft {
  const id = `new-${kind}-${Date.now()}`;
  const base = {
    id,
    kind,
    title: kind === 'case' ? 'Новый кейс' : 'Новое мероприятие',
    status: 'draft' as const,
    updatedAt: new Date().toISOString().slice(0, 10),
    slug: id,
    seoTitle: '',
    anchorNav: [{ id: 'section-1', label: 'Раздел 1' }],
  };

  if (kind === 'case') {
    return {
      ...base,
      kind: 'case',
      heroBreadcrumbs: ['Главная', 'Кейсы'],
      heroTitle: '',
      leadParagraphs: [''],
      highlights: [],
      trailParagraphs: [],
      businessStats: [],
      implementedItems: [],
      narrativeSections: [{ title: 'Раздел', paragraphs: [''] }],
    } satisfies AdminCaseDraft;
  }

  return {
    ...base,
    kind: 'event',
    format: 'online',
    date: '',
    eventTitle: '',
    paragraphs: [''],
  } satisfies AdminEventDraft;
}

export const AdminContentWorkspaceBlock: React.FC<AdminContentWorkspaceBlockProps> = ({
  kind,
  items,
  onItemsChange,
  initialView = 'list',
  initialSelectedId,
  className,
}) => {
  const [view, setView] = useState<'list' | 'edit'>(initialView);
  const [selectedId, setSelectedId] = useState<string | undefined>(initialSelectedId);
  const [draft, setDraft] = useState<AdminContentDraft | null>(() => {
    if (initialView === 'edit' && initialSelectedId) {
      return items.find((item) => item.id === initialSelectedId) ?? null;
    }
    return null;
  });

  const upsertItem = useCallback(
    (nextDraft: AdminContentDraft) => {
      const exists = items.some((item) => item.id === nextDraft.id);
      const updated = {
        ...nextDraft,
        updatedAt: new Date().toISOString().slice(0, 10),
      };
      onItemsChange(
        exists ? items.map((item) => (item.id === updated.id ? updated : item)) : [...items, updated],
      );
      setDraft(updated);
    },
    [items, onItemsChange],
  );

  const handleCreate = () => {
    const next = createEmptyDraft(kind);
    setDraft(next);
    setSelectedId(next.id);
    setView('edit');
  };

  const handleEdit = (id: string) => {
    const item = items.find((entry) => entry.id === id);
    if (!item) return;
    setDraft({ ...item });
    setSelectedId(id);
    setView('edit');
  };

  const handleDelete = (id: string) => {
    onItemsChange(items.filter((item) => item.id !== id));
    toast({ appearance: 'success', title: 'Запись удалена' });
    setView('list');
    setDraft(null);
    setSelectedId(undefined);
  };

  if (view === 'edit' && draft) {
    return (
      <div className={cn(ADMIN_WORKSPACE_CLASS, className)}>
        <AdminContentEditorBlock
          draft={draft}
          onChange={setDraft}
          onBack={() => setView('list')}
          onSave={(next) => {
            upsertItem(next);
            toast({ appearance: 'success', title: 'Черновик сохранён' });
          }}
          onPublish={(next) => {
            upsertItem({ ...next, status: 'published' });
            toast({ appearance: 'success', title: 'Опубликовано' });
          }}
          onDelete={handleDelete}
        />
      </div>
    );
  }

  return (
    <div className={cn(ADMIN_WORKSPACE_CLASS, className)}>
      <AdminContentListBlock
        kind={kind}
        items={items.filter((item) => item.kind === kind)}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

AdminContentWorkspaceBlock.displayName = 'AdminContentWorkspaceBlock';
