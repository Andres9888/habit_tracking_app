import { Platform } from 'react-native';

/**
 * Applies or removes the OpenDyslexic font class on the document body for web builds.
 */
export const applyDyslexicFont = (enabled: boolean) => {
  if (Platform.OS !== 'web') return;
  if (typeof document === 'undefined' || !document.body) return;

  document.body.classList.toggle('dyslexic-font', enabled);
};
