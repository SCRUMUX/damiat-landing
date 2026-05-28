import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export interface ScrollLoopContextValue {
  loopEpoch: number;
  isWrapping: boolean;
  notifyLoopWrap: () => void;
  setIsWrapping: (value: boolean) => void;
}

const ScrollLoopContext = createContext<ScrollLoopContextValue>({
  loopEpoch: 0,
  isWrapping: false,
  notifyLoopWrap: () => {},
  setIsWrapping: () => {},
});

export function ScrollLoopProvider({
  children,
  enabled,
}: {
  children: React.ReactNode;
  enabled: boolean;
}) {
  const [loopEpoch, setLoopEpoch] = useState(0);
  const [isWrapping, setIsWrapping] = useState(false);

  const notifyLoopWrap = useCallback(() => {
    if (!enabled) return;
    setLoopEpoch((n) => n + 1);
  }, [enabled]);

  const value = useMemo(
    () => ({
      loopEpoch,
      isWrapping,
      notifyLoopWrap,
      setIsWrapping,
    }),
    [loopEpoch, isWrapping, notifyLoopWrap],
  );

  return (
    <ScrollLoopContext.Provider value={value}>{children}</ScrollLoopContext.Provider>
  );
}

export function useScrollLoopContext(): ScrollLoopContextValue {
  return useContext(ScrollLoopContext);
}
