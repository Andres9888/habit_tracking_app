/** HabitAlgorithmPicker — Per-habit strength algorithm selector */
import { Pressable, View } from 'react-native';
import { Heart, Activity, Zap } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '../../theme/ThemeContext';

type AlgorithmOption = 'forgiving' | 'balanced' | 'strict';

const OPTIONS: {
  key: AlgorithmOption;
  Icon: typeof Heart;
  label: string;
}[] = [
  { key: 'forgiving', Icon: Heart, label: 'Quick Win' },
  { key: 'balanced', Icon: Activity, label: 'Textbook' },
  { key: 'strict', Icon: Zap, label: 'Long Haul' },
];

interface HabitAlgorithmPickerProps {
  selected: AlgorithmOption;
  onSelect: (mode: AlgorithmOption) => void;
}

export function HabitAlgorithmPicker({
  selected,
  onSelect,
}: HabitAlgorithmPickerProps) {
  const { colors, isDark } = useThemeColors();

  const accent = colors.primary[700];
  const accentBg = isDark ? 'rgba(52,211,153,0.18)' : 'rgba(5,150,105,0.12)';
  const containerBg = isDark
    ? 'rgba(255,255,255,0.06)'
    : 'rgba(0,0,0,0.05)';

  const activeKey: AlgorithmOption = selected;

  const handleSelect = (key: AlgorithmOption) => {
    if (key === activeKey) return;
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
        const isSelected = key === activeKey;
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
