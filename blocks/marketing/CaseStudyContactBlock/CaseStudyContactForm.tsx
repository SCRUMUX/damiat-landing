import React, { useCallback, useId, useState } from 'react';
import { Button } from '../../../components/primitives/Button';
import { Checkbox } from '../../../components/primitives/Checkbox';
import { Input } from '../../../components/primitives/Input';
import {
  CONTACT_HERO_FIELDS_STACK_CLASS,
  CONTACT_HERO_FORM_SHELL_CLASS,
} from '../../_shared/blockLayout';
import type {
  CaseStudyContactBlockProps,
  CaseStudyContactFormValues,
} from './CaseStudyContactBlock.types';

const DEFAULT_VALUES: CaseStudyContactFormValues = {
  name: '',
  company: '',
  consent: true,
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

export interface CaseStudyContactFormProps
  extends Pick<
    CaseStudyContactBlockProps,
    'submitLabel' | 'consentLabel' | 'labels' | 'values' | 'defaultValues' | 'onSubmit' | 'onChange'
  > {}

export const CaseStudyContactForm: React.FC<CaseStudyContactFormProps> = ({
  submitLabel = 'Обсудить проект',
  consentLabel = (
    <>
      Соглашаюсь на использование моих персональных данных в соответствии с{' '}
      <a href="#" className="underline underline-offset-2">
        политикой обработки ПДн
      </a>
    </>
  ),
  labels,
  values: valuesProp,
  defaultValues,
  onSubmit,
  onChange,
}) => {
  const nameId = useId();
  const companyId = useId();

  const [internalValues, setInternalValues] = useState<CaseStudyContactFormValues>({
    ...DEFAULT_VALUES,
    ...defaultValues,
  });

  const values = valuesProp
    ? {
        name: valuesProp.name ?? internalValues.name,
        company: valuesProp.company ?? internalValues.company,
        consent: valuesProp.consent ?? internalValues.consent,
      }
    : internalValues;

  const updateValues = useCallback(
    (patch: Partial<CaseStudyContactFormValues>) => {
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
        <div>
          <FieldLabel htmlFor={nameId}>{labels?.name ?? 'Имя*'}</FieldLabel>
          <Input
            id={nameId}
            name="name"
            appearance="outline"
            size="lg"
            fullWidth
            value={values.name}
            inputProps={{ autoComplete: 'name' }}
            required
            onChange={(event) => updateValues({ name: event.target.value })}
          />
        </div>

        <div>
          <FieldLabel htmlFor={companyId}>{labels?.company ?? 'Название компании'}</FieldLabel>
          <Input
            id={companyId}
            name="company"
            appearance="outline"
            size="lg"
            fullWidth
            value={values.company}
            inputProps={{ autoComplete: 'organization' }}
            onChange={(event) => updateValues({ company: event.target.value })}
          />
        </div>

        <Button type="submit" appearance="brand" size="lg" fullWidth className="mt-[var(--space-8)]">
          {submitLabel}
        </Button>

        <div className="mt-[var(--space-16)]">
          <Checkbox
            size="md"
            label={consentLabel}
            checked={values.consent}
            onChange={(event) => updateValues({ consent: event.target.checked })}
            className="items-start [&_label]:text-[var(--color-text-secondary)] [&_label]:text-style-caption min-[1024px]:[&_label]:text-style-body-sm"
          />
        </div>
      </div>
    </form>
  );
};

CaseStudyContactForm.displayName = 'CaseStudyContactForm';
