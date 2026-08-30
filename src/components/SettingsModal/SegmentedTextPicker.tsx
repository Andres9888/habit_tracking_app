/** SegmentedTextPicker — full-width segmented control with word labels.
 *  Calendar look's options ("Solid" vs "Gradient", "Line" vs "Dots" vs "Off")
 *  have no honest glyph, so they get spelled out and take the full row width
 *  instead of being squeezed into a right accessory. */
import { Pressable, Text, View } from 'react-native';
import { typography, fontWeights } from '@/theme/typography';
import { triggerHaptic } from '@/utils/haptics';
import { useThemeColors } from '../../theme/ThemeContext';
import { getSegmentedControlColors } from './SegmentedControl.colors';

export interface SegmentOption<T extends string> {
  key: T;
  label: string;
}

interface SegmentedTextPickerProps<T extends string> {
  options: readonly SegmentOption<T>[];
  selected: T;
  /** Names the radiogroup for screen readers, e.g. "Day fill". */
  groupLabel: string;
  onSelect: (key: T) => void;
}

export function SegmentedTextPicker<T extends string>({
  options,
  selected,
  groupLabel,
  onSelect,
}: SegmentedTextPickerProps<T>) {
  const { colors, isDark } = useThemeColors();
  const { accent, selectedBg, containerBg } = getSegmentedControlColors(isDark);

  const handleSelect = (key: T) => {
    if (key === selected) return;
    void triggerHaptic('selection');
    onSelect(key);
  };

  return (
    <View
      accessibilityLabel={groupLabel}
      accessibilityRole='radiogroup'
      className='flex-row rounded-xl p-[3px]'
      style={{ backgroundColor: containerBg, gap: 2 }}
    >
      {options.map(({ key, label }) => {
        const on = key === selected;
        return (
          <Pressable
            key={key}
            accessibilityLabel={label}
            accessibilityRole='radio'
            accessibilityState={{ selected: on }}
            className='flex-1 items-center justify-center rounded-lg py-2.5'
            hitSlop={8}
            style={{ backgroundColor: on ? selectedBg : 'transparent' }}
            onPress={() => handleSelect(key)}
          >
            <Text
              adjustsFontSizeToFit
              minimumFontScale={0.85}
              numberOfLines={1}
              style={{
                ...typography.caption,
                color: on ? accent : colors.text.secondary,
                fontWeight: on ? fontWeights.semibold : fontWeights.regular,
              }}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
