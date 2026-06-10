import React, { useCallback, useState } from 'react';
import { Checkbox } from '../../../components/primitives/Checkbox';
import { cn } from '../../../components/primitives/_shared';
import {
  CONTACT_HERO_FIELD_ROW_CLASS,
  CONTACT_HERO_FIELDS_STACK_CLASS,
  CONTACT_HERO_FORM_SHELL_CLASS,
} from '../../_shared/blockLayout';
import { ContactHeroArrowIcon, ContactHeroPhoneFlagIcon } from './ContactHeroBlockIcons';
import type { ContactHeroBlockProps, ContactHeroFormValues } from './ContactHeroBlock.types';
import { ContactHeroFormField } from './ContactHeroFormField';

const DEFAULT_VALUES: ContactHeroFormValues = {
  name: '',
  phone: '',
  company: '',
  consent: true,
};

export interface ContactHeroFormProps
  extends Pick<
    ContactHeroBlockProps,
    'submitLabel' | 'consentLabel' | 'labels' | 'values' | 'defaultValues' | 'onSubmit' | 'onChange'
  > {}

export const ContactHeroForm: React.FC<ContactHeroFormProps> = ({
  submitLabel = 'Обсудить проект',
  consentLabel = (
    <>
      Даю согласие на обработку персональных данных и принимаю{' '}
      <a href="#" className="underline underline-offset-2">
        политику конфиденциальности
      </a>
    </>
  ),
  labels,
  values: valuesProp,
  defaultValues,
  onSubmit,
  onChange,
}) => {
  const [internalValues, setInternalValues] = useState<ContactHeroFormValues>({
    ...DEFAULT_VALUES,
    ...defaultValues,
  });

  const values = valuesProp
    ? {
        name: valuesProp.name ?? internalValues.name,
        phone: valuesProp.phone ?? internalValues.phone,
        company: valuesProp.company ?? internalValues.company,
        consent: valuesProp.consent ?? internalValues.consent,
      }
    : internalValues;

  const updateValues = useCallback(
    (patch: Partial<ContactHeroFormValues>) => {
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
    <form className={CONTACT_HERO_FORM_SHELL_CLASS} onSubmit={handleSubmit} noValidate>
      <div className={CONTACT_HERO_FIELDS_STACK_CLASS}>
        <div className={CONTACT_HERO_FIELD_ROW_CLASS}>
          <ContactHeroFormField
            name="name"
            label={labels?.name ?? 'Имя*'}
            value={values.name}
            required
            autoComplete="name"
            onChange={(name) => updateValues({ name })}
          />
          <ContactHeroFormField
            name="phone"
            label={labels?.phone ?? 'Телефон'}
            value={values.phone}
            type="tel"
            autoComplete="tel"
            prefix={<ContactHeroPhoneFlagIcon />}
            onChange={(phone) => updateValues({ phone })}
          />
        </div>

        <ContactHeroFormField
          name="company"
          label={labels?.company ?? 'Название компании'}
          value={values.company}
          autoComplete="organization"
          onChange={(company) => updateValues({ company })}
        />

        <button
          type="submit"
          className={cn(
            'group mt-[var(--space-16)] flex w-full items-center overflow-hidden',
            'rounded-[var(--radius-section)] min-[1024px]:mt-[var(--space-18)] min-[1024px]:rounded-[var(--radius-large)]',
            'h-[var(--space-50)] min-[1024px]:h-[var(--space-60)]',
            'bg-[var(--color-surface-1)] text-[var(--color-text-primary)]',
            'transition-opacity duration-200 hover:opacity-95',
          )}
        >
          <span className="flex w-full items-center px-[var(--space-24)] min-[1024px]:px-[var(--space-32)]">
            <span
              className={cn(
                'mr-[var(--space-12)] flex shrink-0 items-center justify-center',
                'h-[var(--space-24)] w-[var(--space-24)] rounded-[var(--radius-default)]',
                'min-[1024px]:h-[var(--space-22)] min-[1024px]:w-[var(--space-22)] min-[1024px]:rounded-[var(--radius-section)]',
                'bg-[var(--color-surface-2)] text-[var(--color-text-primary)]',
                'transition-colors duration-200',
                'group-hover:bg-[var(--color-brand-primary)] group-hover:text-[var(--color-text-on-brand)]',
              )}
            >
              <ContactHeroArrowIcon />
            </span>
            <span className="font-normal text-style-body min-[1024px]:text-style-body-lg">{submitLabel}</span>
          </span>
        </button>

        <div className="mt-[var(--space-24)] min-[1024px]:mt-[var(--space-18)]">
          <Checkbox
            size="md"
            label={consentLabel}
            checked={values.consent}
            onChange={(event) => updateValues({ consent: event.target.checked })}
            className="items-start [&_label]:text-[var(--color-text-on-brand)] [&_label]:opacity-80 [&_label]:text-style-caption min-[1024px]:[&_label]:text-style-body-sm"
          />
        </div>
      </div>
    </form>
  );
};

ContactHeroForm.displayName = 'ContactHeroForm';
