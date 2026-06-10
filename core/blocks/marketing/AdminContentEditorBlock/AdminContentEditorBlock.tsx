import React, { useId, useMemo, useState } from 'react';
import { Button } from '../../../components/primitives/Button';
import { Input } from '../../../components/primitives/Input';
import { Select } from '../../../components/primitives/Select';
import { Textarea } from '../../../components/primitives/Textarea';
import { cn } from '../../../components/primitives/_shared';
import {
  ADMIN_EDITOR_FORM_PANEL_CLASS,
  ADMIN_EDITOR_NAV_LINK_ACTIVE_CLASS,
  ADMIN_EDITOR_NAV_LINK_CLASS,
  ADMIN_EDITOR_NAV_LIST_CLASS,
  ADMIN_EDITOR_NAV_STICKY_CLASS,
  ADMIN_EDITOR_SPLIT_CLASS,
  ADMIN_FORM_FIELD_LABEL_CLASS,
  ADMIN_FORM_SECTION_TITLE_CLASS,
  ADMIN_FORM_STACK_CLASS,
  ADMIN_REPEATABLE_ACTIONS_CLASS,
  ADMIN_REPEATABLE_ITEM_CLASS,
  ADMIN_TOOLBAR_ACTIONS_CLASS,
  ADMIN_TOOLBAR_CLASS,
  ADMIN_TOOLBAR_TITLE_CLASS,
} from '../../_shared/blockLayout';
import type {
  AdminAnchorItem,
  AdminCaseDraft,
  AdminContentDraft,
  AdminEditorSectionId,
  AdminEventDraft,
  AdminHighlightPair,
  AdminNarrativeSection,
  AdminStatPair,
} from './AdminContentEditor.types';

export type {
  AdminAnchorItem,
  AdminCaseDraft,
  AdminContentDraft,
  AdminContentKind,
  AdminEditorSectionId,
  AdminEventDraft,
  AdminHighlightPair,
  AdminNarrativeSection,
  AdminPartnerRecord,
  AdminPublishStatus,
  AdminStatPair,
  AdminUserRecord,
} from './AdminContentEditor.types';

export interface AdminContentEditorBlockProps {
  draft: AdminContentDraft;
  onChange: (draft: AdminContentDraft) => void;
  onBack: () => void;
  onSave: (draft: AdminContentDraft) => void;
  onPublish: (draft: AdminContentDraft) => void;
  onDelete: (id: string) => void;
  className?: string;
}

const CASE_SECTIONS: { id: AdminEditorSectionId; label: string }[] = [
  { id: 'general', label: 'Основное' },
  { id: 'navigation', label: 'Навигация' },
  { id: 'hero', label: 'Hero' },
  { id: 'intro', label: 'Intro' },
  { id: 'stats', label: 'Бизнес-результаты' },
  { id: 'implemented', label: 'Реализовано' },
  { id: 'sections', label: 'Разделы' },
  { id: 'publish', label: 'Публикация' },
];

const EVENT_SECTIONS: { id: AdminEditorSectionId; label: string }[] = [
  { id: 'general', label: 'Основное' },
  { id: 'navigation', label: 'Навигация' },
  { id: 'event-card', label: 'Карточка' },
  { id: 'event-body', label: 'Описание' },
  { id: 'publish', label: 'Публикация' },
];

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className={ADMIN_FORM_FIELD_LABEL_CLASS}>
      {children}
    </label>
  );
}

function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (target < 0 || target >= items.length) return items;
  const copy = [...items];
  [copy[index], copy[target]] = [copy[target], copy[index]];
  return copy;
}

function updateCase(draft: AdminCaseDraft, patch: Partial<AdminCaseDraft>): AdminCaseDraft {
  return { ...draft, ...patch };
}

function updateEvent(draft: AdminEventDraft, patch: Partial<AdminEventDraft>): AdminEventDraft {
  return { ...draft, ...patch };
}

function GeneralSection({
  draft,
  onChange,
}: {
  draft: AdminContentDraft;
  onChange: (draft: AdminContentDraft) => void;
}) {
  const slugId = useId();
  const seoId = useId();
  const titleId = useId();
  const statusId = useId();

  return (
    <div className={ADMIN_FORM_STACK_CLASS}>
      <h3 className={ADMIN_FORM_SECTION_TITLE_CLASS}>Основное</h3>
      <div>
        <FieldLabel htmlFor={titleId}>Название в списке</FieldLabel>
        <Input
          id={titleId}
          appearance="outline"
          size="lg"
          fullWidth
          value={draft.title}
          onChange={(event) =>
            onChange(
              draft.kind === 'case'
                ? updateCase(draft, { title: event.target.value })
                : updateEvent(draft, { title: event.target.value }),
            )
          }
        />
      </div>
      <div>
        <FieldLabel htmlFor={slugId}>Slug / ID</FieldLabel>
        <Input
          id={slugId}
          appearance="outline"
          size="lg"
          fullWidth
          value={draft.slug}
          onChange={(event) =>
            onChange(
              draft.kind === 'case'
                ? updateCase(draft, { slug: event.target.value })
                : updateEvent(draft, { slug: event.target.value }),
            )
          }
        />
      </div>
      <div>
        <FieldLabel htmlFor={seoId}>SEO-заголовок</FieldLabel>
        <Input
          id={seoId}
          appearance="outline"
          size="lg"
          fullWidth
          value={draft.seoTitle}
          onChange={(event) =>
            onChange(
              draft.kind === 'case'
                ? updateCase(draft, { seoTitle: event.target.value })
                : updateEvent(draft, { seoTitle: event.target.value }),
            )
          }
        />
      </div>
      <div>
        <FieldLabel htmlFor={statusId}>Статус</FieldLabel>
        <Select
          size="lg"
          value={draft.status}
          options={[
            { value: 'draft', label: 'Черновик' },
            { value: 'published', label: 'Опубликован' },
          ]}
          onValueChange={(value) =>
            onChange(
              draft.kind === 'case'
                ? updateCase(draft, { status: value as AdminCaseDraft['status'] })
                : updateEvent(draft, { status: value as AdminEventDraft['status'] }),
            )
          }
        />
      </div>
    </div>
  );
}

function NavigationSection({
  items,
  onChange,
}: {
  items: AdminAnchorItem[];
  onChange: (items: AdminAnchorItem[]) => void;
}) {
  return (
    <div className={ADMIN_FORM_STACK_CLASS}>
      <h3 className={ADMIN_FORM_SECTION_TITLE_CLASS}>Якорная навигация</h3>
      {items.map((item, index) => (
        <div key={`${item.id}-${index}`} className={ADMIN_REPEATABLE_ITEM_CLASS}>
          <div className={ADMIN_FORM_STACK_CLASS}>
            <Input
              appearance="outline"
              size="md"
              fullWidth
              placeholder="Section ID"
              value={item.id}
              onChange={(event) => {
                const next = [...items];
                next[index] = { ...item, id: event.target.value };
                onChange(next);
              }}
            />
            <Input
              appearance="outline"
              size="md"
              fullWidth
              placeholder="Подпись"
              value={item.label}
              onChange={(event) => {
                const next = [...items];
                next[index] = { ...item, label: event.target.value };
                onChange(next);
              }}
            />
          </div>
          <div className={ADMIN_REPEATABLE_ACTIONS_CLASS}>
            <Button appearance="ghost" size="sm" onClick={() => onChange(moveItem(items, index, -1))}>
              ↑
            </Button>
            <Button appearance="ghost" size="sm" onClick={() => onChange(moveItem(items, index, 1))}>
              ↓
            </Button>
            <Button
              appearance="ghost"
              size="sm"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
            >
              Удалить
            </Button>
          </div>
        </div>
      ))}
      <Button
        appearance="base"
        size="md"
        onClick={() => onChange([...items, { id: `section-${items.length + 1}`, label: 'Новый раздел' }])}
      >
        Добавить пункт
      </Button>
    </div>
  );
}

function CaseHeroSection({ draft, onChange }: { draft: AdminCaseDraft; onChange: (draft: AdminCaseDraft) => void }) {
  return (
    <div className={ADMIN_FORM_STACK_CLASS}>
      <h3 className={ADMIN_FORM_SECTION_TITLE_CLASS}>Hero</h3>
      <div>
        <FieldLabel htmlFor="hero-breadcrumbs">Хлебные крошки (через запятую)</FieldLabel>
        <Input
          id="hero-breadcrumbs"
          appearance="outline"
          size="lg"
          fullWidth
          value={draft.heroBreadcrumbs.join(', ')}
          onChange={(event) =>
            onChange(
              updateCase(draft, {
                heroBreadcrumbs: event.target.value.split(',').map((part) => part.trim()).filter(Boolean),
              }),
            )
          }
        />
      </div>
      <div>
        <FieldLabel htmlFor="hero-title">Заголовок</FieldLabel>
        <Textarea
          id="hero-title"
          size="lg"
          className="w-full max-w-none"
          value={draft.heroTitle}
          onChange={(event) => onChange(updateCase(draft, { heroTitle: event.target.value }))}
        />
      </div>
      <div>
        <FieldLabel htmlFor="hero-subtitle">Подзаголовок</FieldLabel>
        <Input
          id="hero-subtitle"
          appearance="outline"
          size="lg"
          fullWidth
          value={draft.heroSubtitle ?? ''}
          onChange={(event) => onChange(updateCase(draft, { heroSubtitle: event.target.value }))}
        />
      </div>
    </div>
  );
}

function RepeatableTextList({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <div className={ADMIN_FORM_STACK_CLASS}>
      <h4 className={ADMIN_FORM_SECTION_TITLE_CLASS}>{label}</h4>
      {values.map((value, index) => (
        <div key={index} className={ADMIN_REPEATABLE_ITEM_CLASS}>
          <Textarea
            size="md"
            className="w-full max-w-none"
            value={value}
            onChange={(event) => {
              const next = [...values];
              next[index] = event.target.value;
              onChange(next);
            }}
          />
          <div className={ADMIN_REPEATABLE_ACTIONS_CLASS}>
            <Button appearance="ghost" size="sm" onClick={() => onChange(values.filter((_, i) => i !== index))}>
              Удалить
            </Button>
          </div>
        </div>
      ))}
      <Button appearance="base" size="sm" onClick={() => onChange([...values, ''])}>
        Добавить абзац
      </Button>
    </div>
  );
}

function CaseIntroSection({ draft, onChange }: { draft: AdminCaseDraft; onChange: (draft: AdminCaseDraft) => void }) {
  return (
    <div className={ADMIN_FORM_STACK_CLASS}>
      <RepeatableTextList
        label="Lead-абзацы"
        values={draft.leadParagraphs}
        onChange={(leadParagraphs) => onChange(updateCase(draft, { leadParagraphs }))}
      />
      <div className={ADMIN_FORM_STACK_CLASS}>
        <h4 className={ADMIN_FORM_SECTION_TITLE_CLASS}>Highlight-метрики</h4>
        {draft.highlights.map((highlight, index) => (
          <div key={index} className={ADMIN_REPEATABLE_ITEM_CLASS}>
            <Input
              appearance="outline"
              size="md"
              fullWidth
              placeholder="Label"
              value={highlight.label}
              onChange={(event) => {
                const highlights = [...draft.highlights];
                highlights[index] = { ...highlight, label: event.target.value };
                onChange(updateCase(draft, { highlights }));
              }}
            />
            <Input
              appearance="outline"
              size="md"
              fullWidth
              placeholder="Value"
              value={highlight.value}
              onChange={(event) => {
                const highlights = [...draft.highlights];
                highlights[index] = { ...highlight, value: event.target.value };
                onChange(updateCase(draft, { highlights }));
              }}
            />
          </div>
        ))}
        <Button
          appearance="base"
          size="sm"
          onClick={() =>
            onChange(updateCase(draft, { highlights: [...draft.highlights, { label: '', value: '' }] }))
          }
        >
          Добавить метрику
        </Button>
      </div>
      <RepeatableTextList
        label="Trail-абзацы"
        values={draft.trailParagraphs}
        onChange={(trailParagraphs) => onChange(updateCase(draft, { trailParagraphs }))}
      />
    </div>
  );
}

function StatsSection({
  stats,
  onChange,
}: {
  stats: AdminStatPair[];
  onChange: (stats: AdminStatPair[]) => void;
}) {
  return (
    <div className={ADMIN_FORM_STACK_CLASS}>
      <h3 className={ADMIN_FORM_SECTION_TITLE_CLASS}>Бизнес-результаты</h3>
      {stats.map((stat, index) => (
        <div key={index} className={ADMIN_REPEATABLE_ITEM_CLASS}>
          <Input
            appearance="outline"
            size="md"
            fullWidth
            placeholder="Значение"
            value={stat.value}
            onChange={(event) => {
              const next = [...stats];
              next[index] = { ...stat, value: event.target.value };
              onChange(next);
            }}
          />
          <Input
            appearance="outline"
            size="md"
            fullWidth
            placeholder="Подпись"
            value={stat.label}
            onChange={(event) => {
              const next = [...stats];
              next[index] = { ...stat, label: event.target.value };
              onChange(next);
            }}
          />
          <Button appearance="ghost" size="sm" onClick={() => onChange(stats.filter((_, i) => i !== index))}>
            Удалить
          </Button>
        </div>
      ))}
      <Button appearance="base" size="sm" onClick={() => onChange([...stats, { value: '', label: '' }])}>
        Добавить показатель
      </Button>
    </div>
  );
}

function ImplementedSection({
  draft,
  onChange,
}: {
  draft: AdminCaseDraft;
  onChange: (draft: AdminCaseDraft) => void;
}) {
  return (
    <div className={ADMIN_FORM_STACK_CLASS}>
      <h3 className={ADMIN_FORM_SECTION_TITLE_CLASS}>Что было реализовано</h3>
      <Textarea
        size="lg"
        className="w-full max-w-none"
        placeholder="Intro"
        value={draft.implementedIntro ?? ''}
        onChange={(event) => onChange(updateCase(draft, { implementedIntro: event.target.value }))}
      />
      {draft.implementedItems.map((item, index) => (
        <div key={index} className={ADMIN_REPEATABLE_ITEM_CLASS}>
          <Input
            appearance="outline"
            size="md"
            fullWidth
            value={item}
            onChange={(event) => {
              const implementedItems = [...draft.implementedItems];
              implementedItems[index] = event.target.value;
              onChange(updateCase(draft, { implementedItems }));
            }}
          />
          <Button
            appearance="ghost"
            size="sm"
            onClick={() =>
              onChange(updateCase(draft, { implementedItems: draft.implementedItems.filter((_, i) => i !== index) }))
            }
          >
            Удалить
          </Button>
        </div>
      ))}
      <Button
        appearance="base"
        size="sm"
        onClick={() => onChange(updateCase(draft, { implementedItems: [...draft.implementedItems, ''] }))}
      >
        Добавить пункт
      </Button>
    </div>
  );
}

function NarrativeSectionsEditor({
  sections,
  onChange,
}: {
  sections: AdminNarrativeSection[];
  onChange: (sections: AdminNarrativeSection[]) => void;
}) {
  return (
    <div className={ADMIN_FORM_STACK_CLASS}>
      <h3 className={ADMIN_FORM_SECTION_TITLE_CLASS}>Narrative-разделы</h3>
      {sections.map((section, index) => (
        <div key={index} className={ADMIN_REPEATABLE_ITEM_CLASS}>
          <Input
            appearance="outline"
            size="md"
            fullWidth
            placeholder="Section ID"
            value={section.id ?? ''}
            onChange={(event) => {
              const next = [...sections];
              next[index] = { ...section, id: event.target.value };
              onChange(next);
            }}
          />
          <Input
            appearance="outline"
            size="md"
            fullWidth
            placeholder="Заголовок"
            value={section.title}
            onChange={(event) => {
              const next = [...sections];
              next[index] = { ...section, title: event.target.value };
              onChange(next);
            }}
          />
          <Textarea
            size="md"
            className="w-full max-w-none"
            placeholder="Абзацы (каждый с новой строки)"
            value={(section.paragraphs ?? []).join('\n\n')}
            onChange={(event) => {
              const next = [...sections];
              next[index] = {
                ...section,
                paragraphs: event.target.value.split('\n\n').map((p) => p.trim()).filter(Boolean),
              };
              onChange(next);
            }}
          />
          <Textarea
            size="md"
            className="w-full max-w-none"
            placeholder="Bullets (каждый с новой строки)"
            value={(section.bullets ?? []).join('\n')}
            onChange={(event) => {
              const next = [...sections];
              next[index] = {
                ...section,
                bullets: event.target.value.split('\n').map((p) => p.trim()).filter(Boolean),
              };
              onChange(next);
            }}
          />
          <Input
            appearance="outline"
            size="md"
            fullWidth
            placeholder="Цитата"
            value={section.quoteText ?? ''}
            onChange={(event) => {
              const next = [...sections];
              next[index] = { ...section, quoteText: event.target.value };
              onChange(next);
            }}
          />
          <Input
            appearance="outline"
            size="md"
            fullWidth
            placeholder="Автор цитаты"
            value={section.quoteAttribution ?? ''}
            onChange={(event) => {
              const next = [...sections];
              next[index] = { ...section, quoteAttribution: event.target.value };
              onChange(next);
            }}
          />
          <Button appearance="ghost" size="sm" onClick={() => onChange(sections.filter((_, i) => i !== index))}>
            Удалить раздел
          </Button>
        </div>
      ))}
      <Button
        appearance="base"
        size="sm"
        onClick={() => onChange([...sections, { title: 'Новый раздел', paragraphs: [''] }])}
      >
        Добавить раздел
      </Button>
    </div>
  );
}

function EventCardSection({ draft, onChange }: { draft: AdminEventDraft; onChange: (draft: AdminEventDraft) => void }) {
  return (
    <div className={ADMIN_FORM_STACK_CLASS}>
      <h3 className={ADMIN_FORM_SECTION_TITLE_CLASS}>Карточка мероприятия</h3>
      <Select
        size="lg"
        value={draft.format}
        options={[
          { value: 'online', label: 'Онлайн' },
          { value: 'offline', label: 'Офлайн' },
          { value: 'hybrid', label: 'Гибрид' },
        ]}
        onValueChange={(value) =>
          onChange(updateEvent(draft, { format: value as AdminEventDraft['format'] }))
        }
      />
      <Input
        appearance="outline"
        size="lg"
        fullWidth
        placeholder="Дата"
        value={draft.date}
        onChange={(event) => onChange(updateEvent(draft, { date: event.target.value }))}
      />
      <Textarea
        size="lg"
        className="w-full max-w-none"
        placeholder="Заголовок"
        value={draft.eventTitle}
        onChange={(event) => onChange(updateEvent(draft, { eventTitle: event.target.value }))}
      />
      <Input
        appearance="outline"
        size="lg"
        fullWidth
        placeholder="Локация"
        value={draft.location ?? ''}
        onChange={(event) => onChange(updateEvent(draft, { location: event.target.value }))}
      />
      <Input
        appearance="outline"
        size="lg"
        fullWidth
        placeholder="Ссылка"
        value={draft.href ?? ''}
        onChange={(event) => onChange(updateEvent(draft, { href: event.target.value }))}
      />
    </div>
  );
}

function PublishSection({
  draft,
  onSave,
  onPublish,
  onDelete,
}: {
  draft: AdminContentDraft;
  onSave: (draft: AdminContentDraft) => void;
  onPublish: (draft: AdminContentDraft) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className={ADMIN_FORM_STACK_CLASS}>
      <h3 className={ADMIN_FORM_SECTION_TITLE_CLASS}>Публикация</h3>
      <p className="m-0 text-style-body text-[var(--color-text-secondary)]">
        Сохраните черновик или опубликуйте запись. В Storybook действия имитируются локально.
      </p>
      <div className={ADMIN_REPEATABLE_ACTIONS_CLASS}>
        <Button appearance="base" size="md" onClick={() => onSave(draft)}>
          Сохранить
        </Button>
        <Button appearance="brand" size="md" onClick={() => onPublish({ ...draft, status: 'published' })}>
          Опубликовать
        </Button>
        <Button appearance="danger" size="md" onClick={() => onDelete(draft.id)}>
          Удалить
        </Button>
      </div>
    </div>
  );
}

export const AdminContentEditorBlock: React.FC<AdminContentEditorBlockProps> = ({
  draft,
  onChange,
  onBack,
  onSave,
  onPublish,
  onDelete,
  className,
}) => {
  const sections = useMemo(
    () => (draft.kind === 'case' ? CASE_SECTIONS : EVENT_SECTIONS),
    [draft.kind],
  );
  const [activeSection, setActiveSection] = useState<AdminEditorSectionId>(sections[0]?.id ?? 'general');

  const panel = (() => {
    if (activeSection === 'general') return <GeneralSection draft={draft} onChange={onChange} />;
    if (activeSection === 'navigation') {
      return (
        <NavigationSection
          items={draft.anchorNav}
          onChange={(anchorNav) =>
            onChange(
              draft.kind === 'case'
                ? updateCase(draft, { anchorNav })
                : updateEvent(draft, { anchorNav }),
            )
          }
        />
      );
    }
    if (draft.kind === 'case') {
      if (activeSection === 'hero') return <CaseHeroSection draft={draft} onChange={onChange} />;
      if (activeSection === 'intro') return <CaseIntroSection draft={draft} onChange={onChange} />;
      if (activeSection === 'stats') {
        return <StatsSection stats={draft.businessStats} onChange={(businessStats) => onChange(updateCase(draft, { businessStats }))} />;
      }
      if (activeSection === 'implemented') return <ImplementedSection draft={draft} onChange={onChange} />;
      if (activeSection === 'sections') {
        return (
          <NarrativeSectionsEditor
            sections={draft.narrativeSections}
            onChange={(narrativeSections) => onChange(updateCase(draft, { narrativeSections }))}
          />
        );
      }
    }
    if (draft.kind === 'event') {
      if (activeSection === 'event-card') return <EventCardSection draft={draft} onChange={onChange} />;
      if (activeSection === 'event-body') {
        return (
          <RepeatableTextList
            label="Описание"
            values={draft.paragraphs}
            onChange={(paragraphs) => onChange(updateEvent(draft, { paragraphs }))}
          />
        );
      }
    }
    if (activeSection === 'publish') {
      return <PublishSection draft={draft} onSave={onSave} onPublish={onPublish} onDelete={onDelete} />;
    }
    return null;
  })();

  return (
    <section className={cn('flex w-full min-w-0 flex-col gap-[var(--space-section-content-m)]', className)} aria-label="Редактор контента">
      <div className={ADMIN_TOOLBAR_CLASS}>
        <h2 className={ADMIN_TOOLBAR_TITLE_CLASS}>{draft.title}</h2>
        <div className={ADMIN_TOOLBAR_ACTIONS_CLASS}>
          <Button appearance="ghost" size="md" onClick={onBack}>
            ← К списку
          </Button>
        </div>
      </div>

      <div className={ADMIN_EDITOR_SPLIT_CLASS}>
        <nav className={ADMIN_EDITOR_NAV_STICKY_CLASS} aria-label="Секции редактора">
          <ul className={ADMIN_EDITOR_NAV_LIST_CLASS}>
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  type="button"
                  className={
                    activeSection === section.id
                      ? ADMIN_EDITOR_NAV_LINK_ACTIVE_CLASS
                      : ADMIN_EDITOR_NAV_LINK_CLASS
                  }
                  onClick={() => setActiveSection(section.id)}
                >
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className={ADMIN_EDITOR_FORM_PANEL_CLASS}>{panel}</div>
      </div>
    </section>
  );
};

AdminContentEditorBlock.displayName = 'AdminContentEditorBlock';
