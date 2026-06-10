import React, { useCallback, useState } from 'react';
import { DamiatLandingPage } from '../../../blocks/marketing/DamiatLandingPage';
import { buildDamiatLandingDisplayProps } from '../../../blocks/marketing/damiatLandingIntegrations';
import { getContactApiUrl, getPriceApiUrl } from './api';
import { LoginStubPanel } from './LoginStubPanel';

export function App() {
  const [loginOpen, setLoginOpen] = useState(false);

  const handleLoginClick = useCallback(() => {
    setLoginOpen(true);
  }, []);

  const landingProps = buildDamiatLandingDisplayProps({
    priceApiUrl: getPriceApiUrl(),
    contactApiUrl: getContactApiUrl(),
    onLoginClick: handleLoginClick,
  });

  return (
    <>
      <DamiatLandingPage {...landingProps} />
      <LoginStubPanel open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
