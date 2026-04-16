/** StrengthAlgorithmPicker — 3-option segmented control for strength algorithm mode */
import { Pressable, View } from 'react-native';
import { Heart, Activity, Zap } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '../../theme/ThemeContext';

export type StrengthAlgorithmMode = 'forgiving' | 'balanced' | 'strict';

const OPTIONS: {
  key: StrengthAlgorithmMode;
  Icon: typeof Heart;
  label: string;
}[] = [
  { key: 'forgiving', Icon: Heart, label: 'Forgiving' },
  { key: 'balanced', Icon: Activity, label: 'Balanced' },
  { key: 'strict', Icon: Zap, label: 'Strict' },
];

interface StrengthAlgorithmPickerProps {
  selected: StrengthAlgorithmMode;
  onSelect: (mode: StrengthAlgorithmMode) => void;
}

export function StrengthAlgorithmPicker({
  selected,
  onSelect,
}: StrengthAlgorithmPickerProps) {
  const { colors, isDark } = useThemeColors();

  const accent = colors.primary[700];
  /* Intentional rgba — alpha overlays on theme surfaces */
  const accentBg = isDark ? 'rgba(52,211,153,0.18)' : 'rgba(5,150,105,0.12)';
  const containerBg = isDark
    ? 'rgba(255,255,255,0.06)'
    : 'rgba(0,0,0,0.05)';

  const handleSelect = (key: StrengthAlgorithmMode) => {
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
            accessibilityLabel={key}
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
              size={iconSizes.small}
              strokeWidth={isSelected ? 2.5 : 2}
            />
          </Pressable>
        );
      })}
    </View>
  );
}
