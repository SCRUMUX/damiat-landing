import React from 'react';

const iconClass = 'shrink-0';

export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className ?? iconClass} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className ?? iconClass} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const MenuIcon: React.FC = () => (
  <svg className={iconClass} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const CloseIcon: React.FC = () => (
  <svg className={iconClass} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const UserIcon: React.FC = () => (
  <svg className={iconClass} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="8" r="3.75" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5.5 18.5c0-3.038 2.91-5.5 6.5-5.5s6.5 2.462 6.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const SendIcon: React.FC = () => (
  <svg className={iconClass} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M7 5l12 7-12 7V5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M7 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const socialIconClass = `${iconClass} h-full w-full`;

export const TelegramIcon: React.FC = () => (
  <svg className={socialIconClass} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.13-.31-1.09-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z" />
  </svg>
);

export const PhoneIcon: React.FC = () => (
  <svg className={socialIconClass} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </svg>
);

/** VK logomark — fills 24×24 viewBox (legacy path was ~8×8 inside 40×40). */
export const VkIcon: React.FC = () => (
  <svg className={socialIconClass} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.785 16.241s.336-.034.504-.204c.158-.17.153-.489.153-.489s-.022-1.496.641-1.715c.687-.211 1.57 1.099 2.507 1.584.696.362 1.225.284 1.225.284l2.495-.036s1.305-.082.687-.111c-.051-.082-.361-.759-1.857-2.146-1.567-1.452-1.358-.607.529-1.861 1.143-.955 1.601-1.536 1.458-1.784-.136-.234-.978-.172-.978-.172l-2.824.017s-.209-.029-.363.065c-.151.091-.249.301-.249.301s-.447 1.192-1.039 2.205c-1.253 2.132-1.752 2.248-1.956 2.112-.475-.31-.357-1.249-.357-1.921 0-2.09.315-2.962-.613-2.187-.307-.075-.534-.124-1.321-.132-1.01-.008-1.865.003-2.347.241-.321.157-.57.509-.419.529.187.025.609.114.833.417.289.391.279 1.269.279 1.269s.167 2.449-.389 2.756c-.383.208-.912-.216-2.042-2.155-.579-.99-1.017-2.087-1.017-2.087s-.085-.21-.236-.322c-.183-.135-.436-.178-.436-.178l-2.685.017s-.402.011-.549.181c-.132.157-.011.483-.011.483s2.107 4.98 4.494 7.498c2.305 2.316 4.933 2.164 4.933 2.164h1.122z" />
  </svg>
);

export const YoutubeIcon: React.FC = () => (
  <svg className={socialIconClass} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.82.42A2.5 2.5 0 0 0 2.42 7.19 26 26 0 0 0 2 12a26 26 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.42-4.81zM10 15.5v-7l6 3.5-6 3.5z" />
  </svg>
);

export const SOCIAL_ICON_MAP: Record<string, React.FC> = {
  telegram: TelegramIcon,
  phone: PhoneIcon,
  vk: VkIcon,
  youtube: YoutubeIcon,
};
