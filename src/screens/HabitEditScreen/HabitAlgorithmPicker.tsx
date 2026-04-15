/** HabitAlgorithmPicker — Per-habit strength algorithm override with Default option */
import { Pressable, View } from 'react-native';
import { Feather, Flame, RotateCcw, Scale } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '../../theme/ThemeContext';

type AlgorithmOption = 'default' | 'forgiving' | 'balanced' | 'strict';

const OPTIONS: {
  key: AlgorithmOption;
  Icon: typeof Feather;
  label: string;
}[] = [
  { key: 'default', Icon: RotateCcw, label: 'Default' },
  { key: 'forgiving', Icon: Feather, label: 'Forgiving' },
  { key: 'balanced', Icon: Scale, label: 'Balanced' },
  { key: 'strict', Icon: Flame, label: 'Strict' },
];

interface HabitAlgorithmPickerProps {
  /** undefined = use global default */
  selected: string | undefined;
  onSelect: (mode: string | undefined) => void;
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

  const activeKey: AlgorithmOption = selected ?? 'default';

  const handleSelect = (key: AlgorithmOption) => {
    if (key === activeKey) return;
    void Haptics.selectionAsync();
    onSelect(key === 'default' ? undefined : key);
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
