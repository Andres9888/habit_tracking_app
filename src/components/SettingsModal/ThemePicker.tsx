/** ThemePicker — Inline segmented control for light / dark / system theme */
import { Pressable, View } from 'react-native';
import { Moon, Smartphone, Sun } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import type { DarkModePreference } from '../../../convex/settings/types';
import { triggerHaptic } from '@/utils/haptics';
import { useThemeColors } from '../../theme/ThemeContext';
import { getSegmentedControlColors } from './SegmentedControl.colors';

const OPTIONS: { key: DarkModePreference; label: string; Icon: typeof Sun }[] =
  [
    { key: 'light', label: 'Light', Icon: Sun },
    { key: 'dark', label: 'Dark', Icon: Moon },
    { key: 'system', label: 'System', Icon: Smartphone },
  ];

interface ThemePickerProps {
  selected: DarkModePreference;
  onSelect: (preference: DarkModePreference) => void;
}

export function ThemePicker({ selected, onSelect }: ThemePickerProps) {
  const { colors, isDark } = useThemeColors();
  const { accent, selectedBg, containerBg } = getSegmentedControlColors(isDark);

  const handleSelect = (key: DarkModePreference) => {
    if (key === selected) return;
    void triggerHaptic('selection');
    onSelect(key);
  };

  return (
    <View
      accessibilityRole='radiogroup'
      className='flex-row rounded-xl p-[3px]'
      style={{ backgroundColor: containerBg, gap: 2 }}
    >
      {OPTIONS.map(({ key, label, Icon }) => {
        const isSelected = key === selected;
        return (
          <Pressable
            key={key}
            accessibilityLabel={label}
            accessibilityRole='radio'
            accessibilityState={{ selected: isSelected }}
            className='items-center justify-center rounded-lg'
            hitSlop={8}
            style={{
              width: 40,
              height: 36,
              backgroundColor: isSelected ? selectedBg : 'transparent',
            }}
            onPress={() => handleSelect(key)}
          >
            <Icon
              color={isSelected ? accent : colors.text.secondary}
              size={iconSizes.small}
              strokeWidth={isSelected ? 2.5 : 2}
            />
          </Pressable>
        );
      })}
    </View>
  );
}
