import { memo, useMemo, useCallback } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import useHapticFeedback from '../../../hooks/useHapticFeedback';

/**
 * Preset type definition
 */
export type PresetType = 'daily' | 'weekdays' | 'weekends';

/**
 * Props for FrequencyPresets component
 */
interface FrequencyPresetsProps {
  /** Currently selected days array [Sun, Mon, Tue, Wed, Thu, Fri, Sat] */
  selectedDays: boolean[];
  /** Callback when a preset is selected */
  onPresetSelect: (days: boolean[]) => void;
}

/**
 * Preset patterns for common frequency selections
 * Order: [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
 */
export const PRESETS: Record<PresetType, boolean[]> = {
  daily: [true, true, true, true, true, true, true], // All days
  weekdays: [false, true, true, true, true, true, false], // Mon-Fri
  weekends: [true, false, false, false, false, false, true], // Sat-Sun
};

/**
 * Individual preset button component
 */
interface PresetButtonProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

const PresetButton = memo(({ label, active, onPress }: PresetButtonProps) => (
  <TouchableOpacity
    accessibilityLabel={`${label} preset${active ? ', selected' : ''}`}
    accessibilityRole="button"
    accessibilityState={{ selected: active }}
    className={
      active
        ? 'rounded-lg bg-emerald-500 px-2.5 py-1 shadow-sm'
        : 'rounded-lg border border-stone-200 bg-stone-100 px-2.5 py-1'
    }
    style={{
      opacity: 1,
    }}
    onPress={onPress}
    onPressIn={(e) => {
      // @ts-expect-error - setOpacity exists on native
      e.target?.setNativeProps?.({ opacity: 0.8 });
    }}
    onPressOut={(e) => {
      // @ts-expect-error - setOpacity exists on native
      e.target?.setNativeProps?.({ opacity: 1 });
    }}
  >
    <Text
      className={`text-xs font-bold ${
        active ? 'text-white' : 'text-stone-600'
      }`}
    >
      {label}
    </Text>
  </TouchableOpacity>
));

PresetButton.displayName = 'PresetButton';

/**
 * Quick frequency preset buttons (Daily/Weekdays/Weekends)
 *
 * Features:
 * - 3 preset buttons for common patterns
 * - Auto-detects active preset from selectedDays array
 * - Haptic feedback on selection
 * - Visual distinction for active preset (emerald bg + white text)
 * - One-tap selection (reduces 7 taps to 1)
 *
 * @component
 * @example
 * ```tsx
 * <FrequencyPresets
 *   selectedDays={[true, true, true, true, true, true, true]}
 *   onPresetSelect={setSelectedDays}
 * />
 * ```
 */
const FrequencyPresetsComponent = ({
  selectedDays,
  onPresetSelect,
}: FrequencyPresetsProps) => {
  const { triggerSelection } = useHapticFeedback();

  // Detect which preset is currently active (if any)
  const activePreset = useMemo(() => {
    const presetEntries = Object.entries(PRESETS) as [PresetType, boolean[]][];
    return (
      presetEntries.find(
        ([_, days]) => JSON.stringify(days) === JSON.stringify(selectedDays)
      )?.[0] ?? null
    );
  }, [selectedDays]);

  // Handle preset selection with haptic feedback
  const handlePresetPress = useCallback(
    (preset: PresetType) => {
      triggerSelection();
      onPresetSelect(PRESETS[preset]);
    },
    [onPresetSelect, triggerSelection]
  );

  return (
    <View className="mb-2 flex-row items-center justify-between">
      <Text className="text-xs font-medium text-stone-500">Repeat on</Text>
      <View className="flex-row gap-1.5">
        <PresetButton
          active={activePreset === 'daily'}
          label="Daily"
          onPress={() => handlePresetPress('daily')}
        />
        <PresetButton
          active={activePreset === 'weekdays'}
          label="Weekdays"
          onPress={() => handlePresetPress('weekdays')}
        />
        <PresetButton
          active={activePreset === 'weekends'}
          label="Weekends"
          onPress={() => handlePresetPress('weekends')}
        />
      </View>
    </View>
  );
};

/**
 * Memoized FrequencyPresets component for performance optimization
 */
export const FrequencyPresets = memo(FrequencyPresetsComponent);
