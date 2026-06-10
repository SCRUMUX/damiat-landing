import React, { useMemo, useState } from 'react';
import { Button } from '../../../components/primitives/Button';
import { Chip } from '../../../components/primitives/Chip';
import { Input } from '../../../components/primitives/Input';
import { Table } from '../../../components/primitives/Table';
import { cn } from '../../../components/primitives/_shared';
import {
  ADMIN_EMPTY_STATE_CLASS,
  ADMIN_TABLE_WRAP_CLASS,
  ADMIN_TOOLBAR_ACTIONS_CLASS,
  ADMIN_TOOLBAR_CLASS,
  ADMIN_TOOLBAR_TITLE_CLASS,
} from '../../_shared/blockLayout';
import type { AdminContentDraft, AdminContentKind } from '../AdminContentEditorBlock/AdminContentEditor.types';

export interface AdminContentListBlockProps {
  kind: AdminContentKind;
  items: AdminContentDraft[];
  onCreate: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  className?: string;
}

const KIND_LABEL: Record<AdminContentKind, string> = {
  case: 'Кейсы',
  event: 'Мероприятия',
};

export const AdminContentListBlock: React.FC<AdminContentListBlockProps> = ({
  kind,
  items,
  onCreate,
  onEdit,
  onDelete,
  className,
}) => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return items;
    return items.filter((item) => item.title.toLowerCase().includes(normalized));
  }, [items, query]);

  return (
    <section className={cn('flex w-full min-w-0 flex-col gap-[var(--space-section-content-m)]', className)} aria-label={KIND_LABEL[kind]}>
      <div className={ADMIN_TOOLBAR_CLASS}>
        <h2 className={ADMIN_TOOLBAR_TITLE_CLASS}>{KIND_LABEL[kind]}</h2>
        <div className={ADMIN_TOOLBAR_ACTIONS_CLASS}>
          <Input
            appearance="outline"
            size="md"
            placeholder="Поиск…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Поиск"
          />
          <Button appearance="brand" size="md" onClick={onCreate}>
            Создать
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={ADMIN_EMPTY_STATE_CLASS}>
          <p className="m-0">Нет записей. Создайте первую или измените поиск.</p>
          <Button appearance="brand" size="md" onClick={onCreate}>
            Создать
          </Button>
        </div>
      ) : (
        <div className={ADMIN_TABLE_WRAP_CLASS}>
          <Table
            size="md"
            appearance="striped"
            columns={[
              { key: 'title', label: 'Название', render: (row) => row.title },
              {
                key: 'status',
                label: 'Статус',
                render: (row) => (
                  <Chip
                    appearance={row.status === 'published' ? 'brand' : 'base'}
                    size="sm"
                    state={row.status === 'published' ? 'selected' : 'base'}
                  >
                    {row.status === 'published' ? 'Опубликован' : 'Черновик'}
                  </Chip>
                ),
              },
              { key: 'updatedAt', label: 'Обновлено', render: (row) => row.updatedAt },
              {
                key: 'actions',
                label: 'Действия',
                cellType: 'actions',
                render: (row) => (
                  <div className="flex flex-wrap gap-[var(--space-section-stack-s)]">
                    <Button appearance="ghost" size="sm" onClick={() => onEdit(row.id)}>
                      Редактировать
                    </Button>
                    <Button appearance="ghost" size="sm" onClick={() => onDelete(row.id)}>
                      Удалить
                    </Button>
                  </div>
                ),
              },
            ]}
            rows={filtered}
            getRowKey={(row) => row.id}
          />
        </div>
      )}
    </section>
  );
};

AdminContentListBlock.displayName = 'AdminContentListBlock';
