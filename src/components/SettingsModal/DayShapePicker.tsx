/** DayShapePicker — Inline segmented control for circle vs square day markers */
import { Pressable, View } from 'react-native';
import { Circle, Square } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { triggerHaptic } from '@/utils/haptics';
import { useThemeColors } from '../../theme/ThemeContext';
import { getSegmentedControlColors } from './SegmentedControl.colors';

type DayShape = 'circle' | 'square';

const OPTIONS: { key: DayShape; Icon: typeof Circle }[] = [
  { key: 'circle', Icon: Circle },
  { key: 'square', Icon: Square },
];

interface DayShapePickerProps {
  selected: DayShape;
  onSelect: (shape: DayShape) => void;
}

export function DayShapePicker({ selected, onSelect }: DayShapePickerProps) {
  const { colors, isDark } = useThemeColors();
  const { accent, selectedBg, containerBg } = getSegmentedControlColors(isDark);

  const handleSelect = (key: DayShape) => {
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
            accessibilityLabel={key === 'circle' ? 'Circle' : 'Square'}
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
