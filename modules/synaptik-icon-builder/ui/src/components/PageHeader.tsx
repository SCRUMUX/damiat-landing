import { t } from '../i18n/ru.js';
import { headerStackClass } from '../layout.js';

export function PageHeader() {
  return (
    <header className={headerStackClass}>
      <h1 className="text-style-h2 text-[var(--color-text-primary)] m-0">{t.appTitle}</h1>
      <p className="text-style-body text-[var(--color-text-secondary)] m-0">{t.lede}</p>
    </header>
  );
}
