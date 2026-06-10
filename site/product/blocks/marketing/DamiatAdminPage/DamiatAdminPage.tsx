import React, { useState } from 'react';
import { AppShellBlock, type AppShellBlockProps } from '@ai-ds/core/blocks/AppShellBlock';
import { AdminContentWorkspaceBlock } from '@ai-ds/core/blocks/AdminContentWorkspaceBlock';
import type {
  AdminCaseDraft,
  AdminContentDraft,
  AdminEventDraft,
  AdminPartnerRecord,
  AdminUserRecord,
} from '@ai-ds/core/blocks/AdminContentEditorBlock/AdminContentEditor.types';
import { AdminPartnersWorkspaceBlock } from '@ai-ds/core/blocks/AdminPartnersWorkspaceBlock';
import { AdminUsersWorkspaceBlock } from '@ai-ds/core/blocks/AdminUsersWorkspaceBlock';

export type AdminSectionId = 'cases' | 'events' | 'users' | 'partners';

export interface DamiatAdminPageProps {
  logo?: AppShellBlockProps['logo'];
  storageLabel: string;
  userLabel: string;
  nav: AppShellBlockProps['nav'];
  defaultSection?: AdminSectionId;
  initialCases: AdminCaseDraft[];
  initialEvents: AdminEventDraft[];
  initialUsers: AdminUserRecord[];
  initialPartners: AdminPartnerRecord[];
  /** Storybook: open editor on mount */
  initialContentView?: 'list' | 'edit';
  initialContentSelectedId?: string;
  className?: string;
}

export const DamiatAdminPage: React.FC<DamiatAdminPageProps> = ({
  logo,
  storageLabel,
  userLabel,
  nav,
  defaultSection = 'cases',
  initialCases,
  initialEvents,
  initialUsers,
  initialPartners,
  initialContentView = 'list',
  initialContentSelectedId,
  className,
}) => {
  const [activeSection, setActiveSection] = useState<AdminSectionId>(defaultSection);
  const [cases, setCases] = useState<AdminCaseDraft[]>(initialCases);
  const [events, setEvents] = useState<AdminEventDraft[]>(initialEvents);
  const [users, setUsers] = useState<AdminUserRecord[]>(initialUsers);
  const [partners, setPartners] = useState<AdminPartnerRecord[]>(initialPartners);

  const contentItems: AdminContentDraft[] = [...cases, ...events];

  const handleContentChange = (items: AdminContentDraft[]) => {
    setCases(items.filter((item): item is AdminCaseDraft => item.kind === 'case'));
    setEvents(items.filter((item): item is AdminEventDraft => item.kind === 'event'));
  };

  return (
    <AppShellBlock
      logo={logo}
      storageLabel={storageLabel}
      userLabel={userLabel}
      nav={nav}
      activeId={activeSection}
      onNavigate={(id) => setActiveSection(id as AdminSectionId)}
      className={className}
    >
      {activeSection === 'cases' ? (
        <AdminContentWorkspaceBlock
          kind="case"
          items={contentItems}
          onItemsChange={handleContentChange}
          initialView={defaultSection === 'cases' ? initialContentView : 'list'}
          initialSelectedId={defaultSection === 'cases' ? initialContentSelectedId : undefined}
        />
      ) : null}
      {activeSection === 'events' ? (
        <AdminContentWorkspaceBlock
          kind="event"
          items={contentItems}
          onItemsChange={handleContentChange}
          initialView={defaultSection === 'events' ? initialContentView : 'list'}
          initialSelectedId={defaultSection === 'events' ? initialContentSelectedId : undefined}
        />
      ) : null}
      {activeSection === 'users' ? (
        <AdminUsersWorkspaceBlock users={users} onUsersChange={setUsers} />
      ) : null}
      {activeSection === 'partners' ? (
        <AdminPartnersWorkspaceBlock partners={partners} onPartnersChange={setPartners} />
      ) : null}
    </AppShellBlock>
  );
};

DamiatAdminPage.displayName = 'DamiatAdminPage';
