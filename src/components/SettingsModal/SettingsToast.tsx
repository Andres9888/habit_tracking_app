/** SettingsToast — bottom-centred confirmation pill for Settings actions.
 *  Spec 4a uses it for the App lock confirm and the Export my data hand-off. */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Toast } from '../Toast';

/** Spec 4a: toasts auto-dismiss after ~1.8s. */
const TOAST_DURATION_MS = 1800;

interface SettingsToastValue {
  showToast: (message: string) => void;
}

const SettingsToastContext = createContext<SettingsToastValue>({
  showToast: () => {},
});

export function useSettingsToast(): SettingsToastValue {
  return useContext(SettingsToastContext);
}

export function SettingsToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const showToast = useCallback((next: string) => setMessage(next), []);
  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <SettingsToastContext.Provider value={value}>
      {children}
      {/* Keyed on the message so a second toast remounts rather than swapping
          text under a dismiss timer already counting down from the first. */}
      <Toast
        key={message ?? 'idle'}
        duration={TOAST_DURATION_MS}
        message={message ?? ''}
        variant='success'
        visible={message !== null}
        onDismiss={() => setMessage(null)}
      />
    </SettingsToastContext.Provider>
  );
}
