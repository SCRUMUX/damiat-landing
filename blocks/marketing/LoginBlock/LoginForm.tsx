import React, { useCallback, useId, useState } from 'react';
import { Input } from '../../../components/primitives/Input';
import { Button } from '../../../components/primitives/Button';
import { Checkbox } from '../../../components/primitives/Checkbox';
import { Link } from '../../../components/primitives/Link';
import { Alert } from '../../../components/primitives/Alert';
import {
  LOGIN_FORM_STACK_CLASS,
  LOGIN_REGISTRATION_HINT_CLASS,
  LOGIN_REMEMBER_FORGOT_ROW_CLASS,
} from '../../_shared/blockLayout';
import type { LoginBlockProps, LoginFormValues } from './LoginBlock.types';

const DEFAULT_VALUES: LoginFormValues = {
  username: '',
  password: '',
  rememberMe: false,
};

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-[var(--space-6)] block text-style-body font-medium text-[var(--color-text-secondary)]"
    >
      {children}
    </label>
  );
}

export interface LoginFormProps
  extends Pick<
    LoginBlockProps,
    | 'submitLabel'
    | 'forgotPasswordLabel'
    | 'forgotPasswordHref'
    | 'rememberMeLabel'
    | 'registrationHint'
    | 'labels'
    | 'errorMessage'
    | 'values'
    | 'defaultValues'
    | 'onChange'
    | 'onSubmit'
  > {}

export const LoginForm: React.FC<LoginFormProps> = ({
  submitLabel = 'Войти',
  forgotPasswordLabel = 'Забыли пароль?',
  forgotPasswordHref = '#',
  rememberMeLabel = 'Запомнить меня',
  registrationHint,
  labels,
  errorMessage,
  values: valuesProp,
  defaultValues,
  onChange,
  onSubmit,
}) => {
  const usernameId = useId();
  const passwordId = useId();

  const [internalValues, setInternalValues] = useState<LoginFormValues>({
    ...DEFAULT_VALUES,
    ...defaultValues,
  });

  const values = valuesProp
    ? {
        username: valuesProp.username ?? internalValues.username,
        password: valuesProp.password ?? internalValues.password,
        rememberMe: valuesProp.rememberMe ?? internalValues.rememberMe,
      }
    : internalValues;

  const updateValues = useCallback(
    (patch: Partial<LoginFormValues>) => {
      const next = { ...values, ...patch };
      if (valuesProp === undefined) {
        setInternalValues(next);
      }
      onChange?.(next);
    },
    [onChange, values, valuesProp],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(values);
  };

  return (
    <form className={LOGIN_FORM_STACK_CLASS} onSubmit={handleSubmit} noValidate>
      {errorMessage ? (
        <Alert
          appearance="danger"
          variant="leftBorder"
          title="Ошибка входа"
          paragraph={errorMessage}
          showLeftIcon
          showRightIcon={false}
        />
      ) : null}

      <div>
        <FieldLabel htmlFor={usernameId}>{labels?.username ?? 'Логин'}</FieldLabel>
        <Input
          id={usernameId}
          name="username"
          type="text"
          appearance="outline"
          size="lg"
          fullWidth
          value={values.username}
          inputProps={{ autoComplete: 'username' }}
          required
          onChange={(event) => updateValues({ username: event.target.value })}
        />
      </div>

      <div>
        <FieldLabel htmlFor={passwordId}>{labels?.password ?? 'Пароль'}</FieldLabel>
        <Input
          id={passwordId}
          name="password"
          type="password"
          appearance="outline"
          size="lg"
          fullWidth
          value={values.password}
          inputProps={{ autoComplete: 'current-password' }}
          required
          onChange={(event) => updateValues({ password: event.target.value })}
        />
      </div>

      <div className={LOGIN_REMEMBER_FORGOT_ROW_CLASS}>
        <Checkbox
          size="md"
          label={rememberMeLabel}
          checked={values.rememberMe}
          onChange={(event) => updateValues({ rememberMe: event.target.checked })}
        />
        <Link href={forgotPasswordHref} size="md" className="shrink-0">
          {forgotPasswordLabel}
        </Link>
      </div>

      <Button type="submit" appearance="brand" size="lg" fullWidth>
        {submitLabel}
      </Button>

      {registrationHint ? (
        <p className={LOGIN_REGISTRATION_HINT_CLASS}>{registrationHint}</p>
      ) : null}
    </form>
  );
};

LoginForm.displayName = 'LoginForm';
