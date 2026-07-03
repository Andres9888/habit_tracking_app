import { useWindowDimensions } from 'react-native';

/**
 * Small-screen scale for settings-scoped sizes (design_handoff_settings_final §3).
 * Identity at width ≥ 390; clamps to 0.9 on the narrowest phones.
 */
export function useSettingsScale() {
  const { width } = useWindowDimensions();
  const factor = Math.min(1, Math.max(0.9, width / 390));
  return (v: number) => Math.round(v * factor * 2) / 2;
}
