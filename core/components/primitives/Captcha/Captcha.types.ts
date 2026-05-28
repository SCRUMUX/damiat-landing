import React from 'react';

/**
 * @UI/Captcha
 * Placeholder-виджет для встраивания reCAPTCHA / hCaptcha.
 * Фиксированный размер 160×72px.
 * Состояния: idle, loading, success, error.
 */

export type CaptchaState = 'idle' | 'loading' | 'success' | 'error';

export interface CaptchaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current CAPTCHA state */
  state?: CaptchaState;
  /** Placeholder label text shown in the widget area */
  placeholder?: string;
  /** Called when the CAPTCHA is successfully solved */
  onVerify?: (token: string) => void;
  /** Called when the CAPTCHA expires or errors */
  onExpire?: () => void;
}
