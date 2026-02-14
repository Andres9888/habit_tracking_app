declare module 'react-native-siri-shortcut' {
  interface ShortcutOptions {
    activityType: string;
    title: string;
    suggestedInvocationPhrase?: string;
    userInfo?: Record<string, string>;
    isEligibleForSearch?: boolean;
    isEligibleForPrediction?: boolean;
    needsSave?: boolean;
    description?: string;
  }

  interface ShortcutResult {
    status: 'added' | 'updated' | 'deleted' | 'cancelled';
  }

  export function donateShortcut(options: ShortcutOptions): void;
  export function suggestShortcuts(shortcuts: ShortcutOptions[]): void;
  export function clearAllShortcuts(): Promise<void>;
  export function presentShortcut(
    options: ShortcutOptions,
    callback: (result: ShortcutResult) => void
  ): void;

  export const SiriShortcutsEvent: {
    addListener(
      event: 'SiriShortcutListener',
      callback: (data: { userInfo?: Record<string, string> }) => void
    ): { remove: () => void };
  };
}
