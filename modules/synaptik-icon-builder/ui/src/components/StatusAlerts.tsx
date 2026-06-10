import { Alert } from '@ai-ds/core/components/Alert';
import { t } from '../i18n/ru.js';
import { alertStackClass, fullWidthSectionClass } from '../layout.js';

interface StatusAlertsProps {
  success: string;
  error: string;
  resumed: boolean;
  sessionId: string;
  onDismissError: () => void;
  onDismissSuccess: () => void;
}

const alertClass = `${fullWidthSectionClass} !justify-start !items-start [&_span]:w-full`;

export function StatusAlerts({
  success,
  error,
  resumed,
  sessionId,
  onDismissError,
  onDismissSuccess,
}: StatusAlertsProps) {
  const hasContent = (resumed && sessionId) || success || error;
  if (!hasContent) return null;

  return (
    <div className={alertStackClass}>
      {resumed && sessionId && (
        <Alert
          appearance="info"
          showTitle={false}
          paragraph={t.resumedDnaHint(sessionId)}
          showLeftIcon
          className={alertClass}
        />
      )}
      {success && (
        <Alert
          appearance="success"
          showTitle={false}
          paragraph={success}
          showLeftIcon
          onClose={onDismissSuccess}
          closeAriaLabel={t.closeAlertAria}
          className={alertClass}
        />
      )}
      {error && (
        <Alert
          appearance="danger"
          showTitle={false}
          paragraph={error}
          showLeftIcon
          onClose={onDismissError}
          closeAriaLabel={t.closeAlertAria}
          className={alertClass}
        />
      )}
    </div>
  );
}
