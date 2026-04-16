/** SortOptionRow — radio row with flat settings-style icon and checkmark */

import { Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { typography, fontWeights } from '@/theme/typography';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { triggerHaptic } from '@/utils/haptics';
import { useThemeColors } from '../../theme/ThemeContext';
import type { SortPickerOption } from './SortPicker.constants';
import type { HabitSortMode } from '../../features/habits/types';

interface SortOptionRowProps {
  option: SortPickerOption;
  selected: boolean;
  showBorder: boolean;
  onSelect: (mode: HabitSortMode) => void;
}

const CHECKMARK_ENTERING = ZoomIn.springify().damping(18);

export function SortOptionRow({ option, selected, showBorder, onSelect }: SortOptionRowProps) {
  const { colors, isDark } = useThemeColors();
  const style = isDark ? option.iconStyle.dark : option.iconStyle.light;

  const handlePress = () => {
    triggerHaptic('tap');
    onSelect(option.value);
  };

  return (
    <AnimatedPressable
      accessibilityHint={`Select ${option.label} sort option`}
      accessibilityLabel={`${option.label}. ${option.description}`}
      accessibilityRole='radio'
      accessibilityState={{ checked: selected }}
      className='flex-row items-center gap-3 px-4 py-3.5'
      style={{
        backgroundColor: selected ? colors.status.successLight : 'transparent',
        borderBottomWidth: showBorder ? 1 : 0,
        borderBottomColor: showBorder ? colors.border : undefined,
      }}
      onPress={handlePress}
    >
      <View
        className='h-10 w-10 items-center justify-center rounded-xl'
        style={{ backgroundColor: style.bg }}
      >
        <option.Icon color={style.icon} size={iconSizes.medium} strokeWidth={2.5} />
      </View>

      <View className='flex-1'>
        <Text style={{ ...typography.body, fontWeight: fontWeights.semibold, color: colors.text.primary }}>
          {option.label}
        </Text>
        <Text style={{ ...typography.caption, color: colors.text.secondary }}>
          {option.description}
        </Text>
      </View>

      {selected ? (
        <Animated.View
          className='h-6 w-6 items-center justify-center rounded-full'
          entering={CHECKMARK_ENTERING}
          style={{ backgroundColor: colors.primary[500] }}
        >
          <Check color='#ffffff' size={iconSizes.small} strokeWidth={2.5} />
        </Animated.View>
      ) : (
        <View
          className='h-6 w-6 rounded-full'
          style={{ borderWidth: 2, borderColor: colors.border }}
        />
      )}
    </AnimatedPressable>
  );
}
