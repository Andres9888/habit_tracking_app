import { View, Text } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useThemeColors } from '../../theme/ThemeContext';

interface ActionButtonsProps {
  isTodayCompleted: boolean;
  onMarkToday: () => void;
  onEdit: () => void;
}

export function ActionButtons({ isTodayCompleted, onMarkToday, onEdit }: ActionButtonsProps) {
  const { colors } = useThemeColors();
  const markTodayLabel = isTodayCompleted ? 'Completed today' : 'Mark Today Done';

  return (
    <View className='mt-4 flex-row gap-3'>
      <AnimatedPressable
        // Primary "mark done" CTA — the toggle mutation fires no haptic.
        animationConfig={{ enableHaptics: true }}
        accessibilityLabel={
          isTodayCompleted ? 'Today already completed' : 'Mark this habit as done today'
        }
        accessibilityRole='button'
        className='flex-1 rounded-2xl px-4 py-3'
        disableAnimation={isTodayCompleted}
        disabled={isTodayCompleted}
        style={{ backgroundColor: isTodayCompleted ? colors.border : colors.status.info }}
        onPress={onMarkToday}
      >
        <Text
          className='text-center text-base font-semibold'
          style={{ color: isTodayCompleted ? colors.text.secondary : colors.text.inverse }}
        >
          {markTodayLabel}
        </Text>
      </AnimatedPressable>

      <AnimatedPressable
        accessibilityLabel='Edit habit'
        accessibilityRole='button'
        className='w-[110px] items-center justify-center rounded-2xl border px-3'
        style={{ borderColor: colors.border }}
        onPress={onEdit}
      >
        <Text className='text-sm font-semibold' style={{ color: colors.text.primary }}>Edit habit</Text>
      </AnimatedPressable>
    </View>
  );
}
