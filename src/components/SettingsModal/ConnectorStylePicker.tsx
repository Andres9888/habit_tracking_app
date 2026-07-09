// src/components/SettingsModal/ConnectorStylePicker.tsx
/** ConnectorStylePicker — inline segmented control for none/small/full connectors */
import { Pressable, View } from 'react-native';
import { Minus, Link, Link2 } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { triggerHaptic } from '@/utils/haptics';
import { useThemeColors } from '../../theme/ThemeContext';
import { getSegmentedControlColors } from './SegmentedControl.colors';
import type { ConnectorStyle } from '../../../convex/settings/types';

const ALL_OPTIONS: { key: ConnectorStyle; Icon: typeof Link }[] = [
  { key: 'none', Icon: Minus },
  { key: 'small', Icon: Link },
  { key: 'full', Icon: Link2 },
];

interface ConnectorStylePickerProps {
  selected: ConnectorStyle;
  /** Circle shape only supports none/full — square supports all three. */
  options: readonly ConnectorStyle[];
  onSelect: (style: ConnectorStyle) => void;
}

export function ConnectorStylePicker({
  selected,
  options,
  onSelect,
}: ConnectorStylePickerProps) {
  const { colors, isDark } = useThemeColors();
  const { accent, selectedBg, containerBg } = getSegmentedControlColors(isDark);
  const visibleOptions = ALL_OPTIONS.filter((o) => options.includes(o.key));

  const handleSelect = (key: ConnectorStyle) => {
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
      {visibleOptions.map(({ key, Icon }) => {
        const isSelected = key === selected;
        return (
          <Pressable
            key={key}
            accessibilityLabel={key}
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
