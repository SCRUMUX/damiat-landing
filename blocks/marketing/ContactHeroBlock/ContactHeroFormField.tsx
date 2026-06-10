import React, { useId, useState } from 'react';
import { cn } from '../../../components/primitives/_shared';

/** Nested field on brand glass panel — border only, no opaque fill (inherits panel frost). */
const FIELD_SHELL_CLASS = cn(
  'relative rounded-[var(--radius-section)] border border-solid',
  'h-[var(--space-50)] min-[1024px]:h-[var(--space-60)] min-[1024px]:rounded-[var(--radius-large)]',
  'border-[color-mix(in_srgb,var(--color-text-on-brand)_14%,transparent)]',
  'bg-transparent',
  'transition-[border-color] duration-200 ease-in',
  'hover:border-[var(--color-text-on-brand)] focus-within:border-[var(--color-text-on-brand)]',
  'pt-[var(--space-16)] px-[var(--space-12)] min-[1024px]:pt-[var(--space-24)] min-[1024px]:px-[var(--space-20)]',
);

const FIELD_INPUT_CLASS = cn(
  'w-full border-none bg-transparent p-0 outline-none',
  'text-[var(--color-text-on-brand)] text-style-body min-[1024px]:text-style-body-lg',
  'autofill:bg-transparent autofill:[-webkit-text-fill-color:var(--color-text-on-brand)]',
  'autofill:shadow-[inset_0_0_0_1000px_transparent]',
  'autofill:transition-[background-color] autofill:duration-[9999s]',
);

export interface ContactHeroFormFieldProps {
  id?: string;
  name: string;
  label: string;
  value: string;
  required?: boolean;
  type?: string;
  autoComplete?: string;
  prefix?: React.ReactNode;
  onChange: (value: string) => void;
  className?: string;
}

export const ContactHeroFormField: React.FC<ContactHeroFormFieldProps> = ({
  id: idProp,
  name,
  label,
  value,
  required,
  type = 'text',
  autoComplete,
  prefix,
  onChange,
  className,
}) => {
  const generatedId = useId();
  const inputId = idProp ?? generatedId;
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;

  return (
    <div className={cn('relative min-w-0 flex-1', className)}>
      <label
        htmlFor={inputId}
        className={cn(
          'pointer-events-none absolute z-10 text-[var(--color-text-on-brand)] opacity-70',
          'transition-all duration-200 ease-in',
          prefix ? 'left-[calc(var(--space-12)+var(--space-30)+var(--space-8))] min-[1024px]:left-[calc(var(--space-20)+var(--space-30)+var(--space-8))]' : 'left-[var(--space-12)] min-[1024px]:left-[var(--space-20)]',
          floated
            ? 'top-[var(--space-8)] text-style-caption min-[1024px]:top-[var(--space-12)]'
            : 'top-1/2 -translate-y-1/2 text-style-body min-[1024px]:text-style-body-lg',
        )}
      >
        {label}
      </label>

      <div className={FIELD_SHELL_CLASS}>
        {prefix ? (
          <div className="pointer-events-none absolute left-[var(--space-8)] top-1/2 -translate-y-1/2 min-[1024px]:left-[var(--space-20)]">
            {prefix}
          </div>
        ) : null}
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          required={required}
          autoComplete={autoComplete}
          className={cn(FIELD_INPUT_CLASS, prefix && 'pl-[calc(var(--space-30)+var(--space-8))]')}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  );
};

ContactHeroFormField.displayName = 'ContactHeroFormField';
