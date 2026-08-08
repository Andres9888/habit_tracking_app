/** ThemePicker — Inline segmented control for light / dark / system theme */
import type { DarkModePreference } from '../../../convex/settings/types';
import { triggerHaptic } from '@/utils/haptics';
import { SegmentedTextPicker } from './SegmentedTextPicker';

const OPTIONS: { key: DarkModePreference; label: string }[] = [
  { key: 'light', label: 'Light' },
  { key: 'dark', label: 'Dark' },
  { key: 'system', label: 'System' },
];

interface ThemePickerProps {
  selected: DarkModePreference;
  onSelect: (preference: DarkModePreference) => void;
}

export function ThemePicker({ selected, onSelect }: ThemePickerProps) {
  const handleSelect = (key: DarkModePreference) => {
    if (key === selected) return;
    void triggerHaptic('selection');
    onSelect(key);
  };

  return (
    <SegmentedTextPicker
      groupLabel='Theme'
      options={OPTIONS}
      selected={selected}
      onSelect={handleSelect}
    />
  );
}
