import React, { useId, useState } from 'react';
import { Button } from '../../../components/primitives/Button';
import { Chip } from '../../../components/primitives/Chip';
import { Input } from '../../../components/primitives/Input';
import { Modal } from '../../../components/primitives/Modal';
import { Select } from '../../../components/primitives/Select';
import { Table } from '../../../components/primitives/Table';
import { toast, Toaster } from '../../../components/primitives/Toast';
import { cn } from '../../../components/primitives/_shared';
import {
  ADMIN_FORM_FIELD_LABEL_CLASS,
  ADMIN_FORM_STACK_CLASS,
  ADMIN_TABLE_WRAP_CLASS,
  ADMIN_TOOLBAR_ACTIONS_CLASS,
  ADMIN_TOOLBAR_CLASS,
  ADMIN_TOOLBAR_TITLE_CLASS,
  ADMIN_WORKSPACE_CLASS,
} from '../../_shared/blockLayout';
import type { AdminUserRecord } from '../AdminContentEditorBlock/AdminContentEditor.types';

export interface AdminUsersWorkspaceBlockProps {
  users: AdminUserRecord[];
  onUsersChange: (users: AdminUserRecord[]) => void;
  className?: string;
}

type PasswordModalMode = 'generate' | 'change' | 'send' | 'add' | null;

const PASSWORD_STATUS_LABEL: Record<AdminUserRecord['passwordStatus'], string> = {
  active: 'Активен',
  pending: 'Ожидает',
  expired: 'Истёк',
};

function mockPassword() {
  return `Dmt-${Math.random().toString(36).slice(2, 10)}!`;
}

export const AdminUsersWorkspaceBlock: React.FC<AdminUsersWorkspaceBlockProps> = ({
  users,
  onUsersChange,
  className,
}) => {
  const orgId = useId();
  const emailId = useId();
  const roleId = useId();
  const passwordId = useId();
  const confirmId = useId();

  const [modalMode, setModalMode] = useState<PasswordModalMode>(null);
  const [activeUser, setActiveUser] = useState<AdminUserRecord | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newUser, setNewUser] = useState({ organization: '', email: '', role: 'Оператор' });

  const closeModal = () => {
    setModalMode(null);
    setActiveUser(null);
    setGeneratedPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setNewUser({ organization: '', email: '', role: 'Оператор' });
  };

  return (
    <section className={cn(ADMIN_WORKSPACE_CLASS, className)} aria-label="Пользователи">
      <Toaster position="top-right" />
      <div className={ADMIN_TOOLBAR_CLASS}>
        <h2 className={ADMIN_TOOLBAR_TITLE_CLASS}>Пользователи</h2>
        <div className={ADMIN_TOOLBAR_ACTIONS_CLASS}>
          <Button appearance="brand" size="md" onClick={() => setModalMode('add')}>
            Добавить пользователя
          </Button>
        </div>
      </div>

      <div className={ADMIN_TABLE_WRAP_CLASS}>
        <Table
          size="md"
          appearance="striped"
          columns={[
            { key: 'organization', label: 'Организация', render: (row) => row.organization },
            { key: 'email', label: 'Email', render: (row) => row.email },
            { key: 'role', label: 'Роль', render: (row) => row.role },
            {
              key: 'passwordStatus',
              label: 'Пароль',
              render: (row) => (
                <Chip
                  appearance={row.passwordStatus === 'active' ? 'brand' : 'base'}
                  size="sm"
                  state={row.passwordStatus === 'active' ? 'selected' : 'base'}
                >
                  {PASSWORD_STATUS_LABEL[row.passwordStatus]}
                </Chip>
              ),
            },
            { key: 'lastLogin', label: 'Последний вход', render: (row) => row.lastLogin ?? '—' },
            {
              key: 'actions',
              label: 'Действия',
              cellType: 'actions',
              render: (row) => (
                <div className="flex flex-wrap gap-[var(--space-section-stack-s)]">
                  <Button
                    appearance="ghost"
                    size="sm"
                    onClick={() => {
                      setActiveUser(row);
                      setGeneratedPassword(mockPassword());
                      setModalMode('generate');
                    }}
                  >
                    Сгенерировать
                  </Button>
                  <Button
                    appearance="ghost"
                    size="sm"
                    onClick={() => {
                      setActiveUser(row);
                      setModalMode('change');
                    }}
                  >
                    Изменить
                  </Button>
                  <Button
                    appearance="ghost"
                    size="sm"
                    onClick={() => {
                      setActiveUser(row);
                      setModalMode('send');
                    }}
                  >
                    Отправить
                  </Button>
                </div>
              ),
            },
          ]}
          rows={users}
          getRowKey={(row) => row.id}
        />
      </div>

      <Modal
        open={modalMode === 'generate'}
        title="Сгенерированный пароль"
        content={
          activeUser ? (
            <div className={ADMIN_FORM_STACK_CLASS}>
              <p className="m-0 text-style-body text-[var(--color-text-secondary)]">
                Пользователь: {activeUser.organization} ({activeUser.email})
              </p>
              <Input appearance="outline" size="lg" fullWidth readOnly value={generatedPassword} />
            </div>
          ) : null
        }
        confirmLabel="Применить"
        cancelLabel="Закрыть"
        onConfirm={() => {
          if (activeUser) {
            onUsersChange(
              users.map((user) =>
                user.id === activeUser.id ? { ...user, passwordStatus: 'pending' as const } : user,
              ),
            );
            toast({ appearance: 'success', title: 'Пароль сгенерирован' });
          }
          closeModal();
        }}
        onCancel={closeModal}
        onClose={closeModal}
      />

      <Modal
        open={modalMode === 'change'}
        title="Изменить пароль"
        content={
          activeUser ? (
            <div className={ADMIN_FORM_STACK_CLASS}>
              <div>
                <label htmlFor={passwordId} className={ADMIN_FORM_FIELD_LABEL_CLASS}>
                  Новый пароль
                </label>
                <Input
                  id={passwordId}
                  appearance="outline"
                  size="lg"
                  fullWidth
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                />
              </div>
              <div>
                <label htmlFor={confirmId} className={ADMIN_FORM_FIELD_LABEL_CLASS}>
                  Подтверждение
                </label>
                <Input
                  id={confirmId}
                  appearance="outline"
                  size="lg"
                  fullWidth
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </div>
            </div>
          ) : null
        }
        confirmLabel="Сохранить"
        cancelLabel="Отмена"
        onConfirm={() => {
          if (newPassword && newPassword === confirmPassword && activeUser) {
            onUsersChange(
              users.map((user) =>
                user.id === activeUser.id ? { ...user, passwordStatus: 'active' as const } : user,
              ),
            );
            toast({ appearance: 'success', title: 'Пароль обновлён' });
            closeModal();
          } else {
            toast({ appearance: 'warning', title: 'Пароли не совпадают' });
          }
        }}
        onCancel={closeModal}
        onClose={closeModal}
      />

      <Modal
        open={modalMode === 'send'}
        title="Отправить пароль"
        content={
          activeUser ? (
            <p className="m-0 text-style-body text-[var(--color-text-secondary)]">
              Отправить новый пароль на {activeUser.email}?
            </p>
          ) : null
        }
        confirmLabel="Отправить"
        cancelLabel="Отмена"
        onConfirm={() => {
          if (activeUser) {
            toast({
              appearance: 'success',
              title: 'Пароль отправлен',
              description: activeUser.email,
            });
          }
          closeModal();
        }}
        onCancel={closeModal}
        onClose={closeModal}
      />

      <Modal
        open={modalMode === 'add'}
        title="Новый пользователь"
        content={
          <div className={ADMIN_FORM_STACK_CLASS}>
            <div>
              <label htmlFor={orgId} className={ADMIN_FORM_FIELD_LABEL_CLASS}>
                Организация
              </label>
              <Input
                id={orgId}
                appearance="outline"
                size="lg"
                fullWidth
                value={newUser.organization}
                onChange={(event) => setNewUser({ ...newUser, organization: event.target.value })}
              />
            </div>
            <div>
              <label htmlFor={emailId} className={ADMIN_FORM_FIELD_LABEL_CLASS}>
                Email
              </label>
              <Input
                id={emailId}
                appearance="outline"
                size="lg"
                fullWidth
                value={newUser.email}
                onChange={(event) => setNewUser({ ...newUser, email: event.target.value })}
              />
            </div>
            <div>
              <label htmlFor={roleId} className={ADMIN_FORM_FIELD_LABEL_CLASS}>
                Роль
              </label>
              <Select
                size="lg"
                value={newUser.role}
                options={[
                  { value: 'Оператор', label: 'Оператор' },
                  { value: 'Менеджер', label: 'Менеджер' },
                  { value: 'Администратор', label: 'Администратор' },
                ]}
                onValueChange={(role) => setNewUser({ ...newUser, role })}
              />
            </div>
          </div>
        }
        confirmLabel="Добавить"
        cancelLabel="Отмена"
        onConfirm={() => {
          if (newUser.organization && newUser.email) {
            onUsersChange([
              ...users,
              {
                id: `user-${Date.now()}`,
                organization: newUser.organization,
                email: newUser.email,
                role: newUser.role,
                passwordStatus: 'pending',
              },
            ]);
            toast({ appearance: 'success', title: 'Пользователь добавлен' });
            closeModal();
          }
        }}
        onCancel={closeModal}
        onClose={closeModal}
      />
    </section>
  );
};

AdminUsersWorkspaceBlock.displayName = 'AdminUsersWorkspaceBlock';
