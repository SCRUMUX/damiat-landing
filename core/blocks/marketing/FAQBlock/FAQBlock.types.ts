import type React from 'react';

export interface FAQItem {
  id?: string;
  question: string;
  answer: React.ReactNode;
}

export interface FAQBlockProps {
  /**
   * `default` — compact accordion (SaaS template).
   * `enterprise` — Cortel card accordion with plus toggle (vmware landing).
   */
  variant?: 'default' | 'enterprise';
  title?: string;
  subtitle?: string;
  items: FAQItem[];
  className?: string;
}
