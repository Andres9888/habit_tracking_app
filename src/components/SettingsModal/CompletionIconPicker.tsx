/** CompletionIconPicker — Inline segmented control for chain vs checkmark */
import { Pressable, View } from 'react-native';
import { Check, Link2 } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { triggerHaptic } from '@/utils/haptics';
import { useThemeColors } from '../../theme/ThemeContext';
import { getSegmentedControlColors } from './SegmentedControl.colors';

type CompletionIcon = 'chain' | 'checkbox';

const OPTIONS: { key: CompletionIcon; Icon: typeof Check }[] = [
  { key: 'chain', Icon: Link2 },
  { key: 'checkbox', Icon: Check },
];

interface CompletionIconPickerProps {
  selected: CompletionIcon;
  onSelect: (type: CompletionIcon) => void;
}

export function CompletionIconPicker({
  selected,
  onSelect,
}: CompletionIconPickerProps) {
  const { colors, isDark } = useThemeColors();
  const { accent, selectedBg, containerBg } = getSegmentedControlColors(isDark);

  const handleSelect = (key: CompletionIcon) => {
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
      {OPTIONS.map(({ key, Icon }) => {
        const isSelected = key === selected;
        return (
          <Pressable
            key={key}
            accessibilityLabel={key === 'chain' ? 'Chain' : 'Checkmark'}
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
