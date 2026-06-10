import { Alert } from '@ai-ds/core/components/Alert';
import { fullWidthSectionClass } from '../layout.js';

interface ApiHealthBannerProps {
  ok: boolean;
  message: string;
}

export function ApiHealthBanner({ ok, message }: ApiHealthBannerProps) {
  if (!message) return null;
  return (
    <div className={fullWidthSectionClass}>
      <Alert
        appearance={ok ? 'success' : 'danger'}
        showTitle={false}
        paragraph={message}
        showLeftIcon
        className={`${fullWidthSectionClass} !justify-start !items-start [&_span]:w-full`}
      />
    </div>
  );
}
