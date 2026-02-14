/**
 * Toast Notification System
 *
 * App-wide toast context for consistent, beautiful notifications.
 * Replaces scattered Alert.alert calls with slide-down toasts.
 *
 * Usage:
 *   import { useToast } from './ToastContext';
 *   const toast = useToast();
 *   toast.success('Saved!');
 *   toast.error('Something went wrong');
 *   toast.info('Syncing...');
 *   toast.warning('Check your connection');
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { PropsWithChildren } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: ToastMessage[];
  show: (type: ToastType, title: string, message?: string, duration?: number) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION = 3000;

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const idCounter = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (type: ToastType, title: string, message?: string, duration?: number) => {
      const id = `toast-${++idCounter.current}`;
      const toast: ToastMessage = { id, type, title, message, duration: duration ?? DEFAULT_DURATION };
      setToasts((prev) => [...prev, toast]);
    },
    []
  );

  const success = useCallback(
    (title: string, message?: string) => show('success', title, message),
    [show]
  );

  const error = useCallback(
    (title: string, message?: string) => show('error', title, message),
    [show]
  );

  const info = useCallback(
    (title: string, message?: string) => show('info', title, message),
    [show]
  );

  const warning = useCallback(
    (title: string, message?: string) => show('warning', title, message),
    [show]
  );

  const value = useMemo(
    () => ({ toasts, show, success, error, info, warning, dismiss }),
    [toasts, show, success, error, info, warning, dismiss]
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
