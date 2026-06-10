import React, { useRef, useState } from 'react';
import { Button } from '../../../components/primitives/Button';
import { FileUpload } from '../../../components/primitives/FileUpload';
import { Input } from '../../../components/primitives/Input';
import { toast, Toaster } from '../../../components/primitives/Toast';
import { cn } from '../../../components/primitives/_shared';
import {
  ADMIN_FORM_FIELD_LABEL_CLASS,
  ADMIN_FORM_STACK_CLASS,
  ADMIN_PARTNER_GRID_CLASS,
  ADMIN_PARTNER_LOGO_CLASS,
  ADMIN_PARTNER_TILE_CLASS,
  ADMIN_TOOLBAR_ACTIONS_CLASS,
  ADMIN_TOOLBAR_CLASS,
  ADMIN_TOOLBAR_TITLE_CLASS,
  ADMIN_WORKSPACE_CLASS,
} from '../../_shared/blockLayout';
import type { AdminPartnerRecord } from '../AdminContentEditorBlock/AdminContentEditor.types';

export interface AdminPartnersWorkspaceBlockProps {
  partners: AdminPartnerRecord[];
  onPartnersChange: (partners: AdminPartnerRecord[]) => void;
  className?: string;
}

export const AdminPartnersWorkspaceBlock: React.FC<AdminPartnersWorkspaceBlockProps> = ({
  partners,
  onPartnersChange,
  className,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [pendingPreview, setPendingPreview] = useState<string | undefined>();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPendingPreview(URL.createObjectURL(file));
  };

  const handleAdd = () => {
    if (!name.trim()) {
      toast({ appearance: 'warning', title: 'Укажите название партнёра' });
      return;
    }
    onPartnersChange([
      ...partners,
      {
        id: `partner-${Date.now()}`,
        name: name.trim(),
        imageSrc: pendingPreview,
      },
    ]);
    setName('');
    setPendingPreview(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
    toast({ appearance: 'success', title: 'Партнёр добавлен' });
  };

  const handleRemove = (id: string) => {
    onPartnersChange(partners.filter((partner) => partner.id !== id));
    toast({ appearance: 'success', title: 'Логотип удалён' });
  };

  return (
    <section className={cn(ADMIN_WORKSPACE_CLASS, className)} aria-label="Партнёры">
      <Toaster position="top-right" />
      <div className={ADMIN_TOOLBAR_CLASS}>
        <h2 className={ADMIN_TOOLBAR_TITLE_CLASS}>Партнёры</h2>
      </div>

      <div className={cn(ADMIN_PARTNER_TILE_CLASS, 'max-w-[var(--space-480)]')}>
        <h3 className={ADMIN_TOOLBAR_TITLE_CLASS}>Добавить логотип</h3>
        <div className={ADMIN_FORM_STACK_CLASS}>
          <div>
            <label htmlFor="partner-name" className={ADMIN_FORM_FIELD_LABEL_CLASS}>
              Название
            </label>
            <Input
              id="partner-name"
              appearance="outline"
              size="lg"
              fullWidth
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <FileUpload
            size="md"
            state={pendingPreview ? 'done' : 'idle'}
            className="w-full cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="text-style-body text-[var(--color-text-secondary)]">
              {pendingPreview ? 'Файл выбран — нажмите «Добавить»' : 'Загрузить логотип (PNG, SVG, WebP)'}
            </span>
          </FileUpload>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFileChange}
          />
          {pendingPreview ? (
            <img src={pendingPreview} alt="" className={ADMIN_PARTNER_LOGO_CLASS} />
          ) : null}
          <div className={ADMIN_TOOLBAR_ACTIONS_CLASS}>
            <Button appearance="brand" size="md" onClick={handleAdd}>
              Добавить
            </Button>
          </div>
        </div>
      </div>

      <div className={ADMIN_PARTNER_GRID_CLASS}>
        {partners.map((partner) => (
          <article key={partner.id} className={ADMIN_PARTNER_TILE_CLASS}>
            {partner.imageSrc ? (
              <img
                src={partner.imageSrc}
                alt={partner.name}
                className={ADMIN_PARTNER_LOGO_CLASS}
              />
            ) : (
              <div
                className={cn(
                  ADMIN_PARTNER_LOGO_CLASS,
                  'flex items-center justify-center bg-[var(--color-surface-1)] text-style-caption text-[var(--color-text-muted)]',
                )}
              >
                No logo
              </div>
            )}
            <p className="m-0 text-center text-style-body-sm text-[var(--color-text-primary)]">{partner.name}</p>
            <Button appearance="ghost" size="sm" onClick={() => handleRemove(partner.id)}>
              Удалить
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
};

AdminPartnersWorkspaceBlock.displayName = 'AdminPartnersWorkspaceBlock';
