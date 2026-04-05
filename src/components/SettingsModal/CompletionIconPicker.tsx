/** CompletionIconPicker — Inline segmented control for chain vs checkmark */
import { Pressable, View } from 'react-native';
import { Check, Link2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '../../theme/ThemeContext';

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

  const accent = colors.primary[700];
  /* Intentional rgba — alpha overlays on theme surfaces */
  const accentBg = isDark ? 'rgba(52,211,153,0.18)' : 'rgba(5,150,105,0.12)';
  const containerBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';

  const handleSelect = (key: CompletionIcon) => {
    if (key === selected) return;
    void Haptics.selectionAsync();
    onSelect(key);
  };

  return (
    <View
      accessibilityRole='radiogroup'
      className='flex-row rounded-[10px] p-[3px]'
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
              width: 36,
              height: 30,
              backgroundColor: isSelected ? accentBg : 'transparent',
            }}
            onPress={() => handleSelect(key)}
          >
            <Icon
              color={isSelected ? accent : colors.text.secondary}
              size={16}
              strokeWidth={isSelected ? 2.5 : 2}
            />
          </Pressable>
        );
      })}
    </View>
  );
}
