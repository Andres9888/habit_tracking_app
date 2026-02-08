/**
 * PausedHabitsModal - OPTIMIZED: Design system typography, animations, shadows
 */
import { Pressable, ScrollView, Text, View } from 'react-native';
import { ChevronLeft, X } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { usePausedHabitsModalLogic } from './PausedHabitsModal.hooks';
import { PausedHabitCard } from './PausedHabitCard';
import { PausedEmptyState } from './PausedEmptyState';

interface PausedHabitsModalProps {
  onClose: () => void;
  onBack: () => void;
}

const anim = FadeInDown.duration(280).springify().damping(18);

export default function PausedHabitsModal({
  onClose,
  onBack,
}: PausedHabitsModalProps) {
  const insets = useSafeAreaInsets();
  const { pausedHabits, handleResume } = usePausedHabitsModalLogic();

  return (
    <View className='flex-1' style={{ backgroundColor: '#faf9f7' }}>
      <View style={{ paddingTop: insets.top + 8 }}>
        <Animated.View
          className='mb-6 flex-row items-center justify-between px-4'
          entering={anim}
        >
          <Pressable
            accessibilityLabel='Back to settings'
            accessibilityRole='button'
            className='h-11 w-11 items-center justify-center rounded-full bg-stone-100 active:bg-stone-200'
            onPress={onBack}
          >
            <ChevronLeft color={colors.gray[500]} size={24} strokeWidth={2} />
          </Pressable>
          <Text
            className='flex-1 text-center font-bold text-stone-900'
            style={{ fontSize: 22 }}
          >
            Paused Habits
          </Text>
          <Pressable
            accessibilityLabel='Close'
            accessibilityRole='button'
            className='h-11 w-11 items-center justify-center rounded-full bg-stone-100 active:bg-stone-200'
            onPress={onClose}
          >
            <X color={colors.gray[500]} size={24} strokeWidth={2} />
          </Pressable>
        </Animated.View>
      </View>
      <ScrollView
        className='flex-1 px-4'
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        showsVerticalScrollIndicator={false}
      >
        {pausedHabits.length === 0 ? (
          <PausedEmptyState />
        ) : (
          <View className='gap-3'>
            {pausedHabits.map((habit, i) => (
              <PausedHabitCard
                key={habit._id}
                habit={habit}
                index={i}
                onResume={handleResume}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
