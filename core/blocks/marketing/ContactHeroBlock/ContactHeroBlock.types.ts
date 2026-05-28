import type React from 'react';

export interface ContactHeroFormLabels {
  name?: string;
  phone?: string;
  company?: string;
}

export interface ContactHeroFormValues {
  name: string;
  phone: string;
  company: string;
  consent: boolean;
}

export interface ContactHeroBlockProps {
  title?: string;
  description?: string;
  submitLabel?: string;
  consentLabel?: React.ReactNode;
  labels?: ContactHeroFormLabels;
  /** Controlled form values — omit for uncontrolled demo. */
  values?: Partial<ContactHeroFormValues>;
  defaultValues?: Partial<ContactHeroFormValues>;
  onSubmit?: (values: ContactHeroFormValues) => void;
  onChange?: (values: ContactHeroFormValues) => void;
  /** Inside `BrandPhotoHeroSection` — no parallax/gradient shell, transparent background. */
  embeddedInPhotoHero?: boolean;
  className?: string;
}
