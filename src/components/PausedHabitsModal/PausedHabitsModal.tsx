/**
 * PausedHabitsModal - OPTIMIZED: Design system typography, animations, shadows
 * Uses FlatList for virtualized rendering of paused habits.
 */
import { useCallback } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { ChevronLeft, X } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '../../theme/ThemeContext';
import { usePausedHabitsModalLogic } from './PausedHabitsModal.hooks';
import { PausedHabitCard } from './PausedHabitCard';
import { PausedEmptyState } from './PausedEmptyState';
import { iconSizes } from '@/theme/iconSizes';
import { fontFamilies } from '@/theme/typography';

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
  const { colors: themeColors } = useThemeColors();
  const { pausedHabits, handleResume } = usePausedHabitsModalLogic();

  const renderItem = useCallback(
    ({ item, index }: { item: (typeof pausedHabits)[0]; index: number }) => (
      <PausedHabitCard habit={item} index={index} onResume={handleResume} />
    ),
    [handleResume]
  );

  const keyExtractor = useCallback(
    (item: (typeof pausedHabits)[0]) => item._id,
    []
  );

  return (
    <View className='flex-1' style={{ backgroundColor: themeColors.background }}>
      <View style={{ paddingTop: insets.top + 8 }}>
        <Animated.View
          className='mb-6 flex-row items-center justify-between px-4'
          entering={anim}
        >
          <Pressable
            accessibilityLabel='Back to settings'
            accessibilityRole='button'
            className='h-11 w-11 items-center justify-center rounded-full'
            style={{ backgroundColor: themeColors.gray[100] }}
            onPress={onBack}
          >
            <ChevronLeft color={themeColors.text.secondary} size={iconSizes.large} strokeWidth={2} />
          </Pressable>
          <Text
            className='flex-1 text-center font-bold'
            style={{ fontFamily: fontFamilies.primary.text, fontSize: 22, color: themeColors.text.primary }}
          >
            Paused Habits
          </Text>
          <Pressable
            accessibilityLabel='Close'
            accessibilityRole='button'
            className='h-11 w-11 items-center justify-center rounded-full'
            style={{ backgroundColor: themeColors.gray[100] }}
            onPress={onClose}
          >
            <X color={themeColors.text.secondary} size={iconSizes.large} strokeWidth={2} />
          </Pressable>
        </Animated.View>
      </View>
      <FlatList
        className='flex-1 px-4'
        contentContainerStyle={{ gap: 12, paddingBottom: insets.bottom + 16 }}
        data={pausedHabits}
        initialNumToRender={10}
        keyExtractor={keyExtractor}
        ListEmptyComponent={PausedEmptyState}
        maxToRenderPerBatch={10}
        removeClippedSubviews
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        windowSize={5}
      />
    </View>
  );
}
