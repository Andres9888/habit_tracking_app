import { Pressable, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useHapticFeedback } from '../../../../../hooks/useHapticFeedback';
import type { CompactHelperRowProps } from '../HabitsEmptyState.types';

export function CompactHelperRow({
  onNeedHelpQuiz,
  onScheduleReminder,
}: CompactHelperRowProps) {
  const { triggerSelection } = useHapticFeedback();

  return (
    <Animated.View
      className='w-full flex-row items-center justify-center gap-6 rounded-3xl bg-stone-100/60 px-4 py-3'
      entering={FadeInDown.delay(400).springify().damping(18)}
    >
      {onNeedHelpQuiz && (
        <Pressable
          accessibilityLabel='Open habit quiz'
          className='rounded-lg px-3 py-1.5 active:bg-stone-200/60'
          onPress={() => {
            triggerSelection();
            onNeedHelpQuiz();
          }}
        >
          <Text className='text-[13px] font-semibold text-stone-600'>
            Need help? Take quiz →
          </Text>
        </Pressable>
      )}
      {onScheduleReminder && (
        <Pressable
          accessibilityHint='Schedules a reminder notification to revisit habit setup later'
          accessibilityLabel='Remind me later'
          className='rounded-lg px-3 py-1.5 active:bg-stone-200/60'
          onPress={() => {
            triggerSelection();
            onScheduleReminder();
          }}
        >
          <Text className='text-[13px] font-medium text-stone-500'>
            Remind me later
          </Text>
        </Pressable>
      )}
    </Animated.View>
  );
}
