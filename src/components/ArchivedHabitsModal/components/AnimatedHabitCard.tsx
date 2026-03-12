import { useRef, useCallback } from 'react';
import { Text, View, Pressable, Animated as RNAnimated } from 'react-native';
import Animated from 'react-native-reanimated';
import { Swipeable } from 'react-native-gesture-handler';
import { useAnimatedHabitCard } from './AnimatedHabitCard.hooks';
import { SwipeDeleteAction } from './SwipeDeleteAction';
import { useThemeColors } from '../../../theme/ThemeContext';
import { triggerHaptic } from '@/utils/haptics';
import { getDaysArchived } from '../utils';
import type { AnimatedHabitCardProps } from '../types';

export function AnimatedHabitCard({
  habit,
  index,
  reducedMotion,
  onRestore,
  onDelete,
}: AnimatedHabitCardProps) {
  const { colors, isDark } = useThemeColors();
  const swipeableRef = useRef<Swipeable>(null);
  const { isRestoring, animatedStyle, handleRestorePress } = useAnimatedHabitCard({
    habitId: habit._id,
    habitName: habit.name,
    index,
    onRestore,
    reducedMotion,
  });

  const archiveDate = habit.archivedAt || habit._creationTime;
  const daysText = getDaysArchived(archiveDate);

  const handleDelete = useCallback(() => {
    swipeableRef.current?.close();
    onDelete(habit._id, habit.name);
  }, [habit._id, habit.name, onDelete]);

  const renderRightActions = useCallback(
    (_p: RNAnimated.AnimatedInterpolation<number>, dragX: RNAnimated.AnimatedInterpolation<number>) => (
      <SwipeDeleteAction dragX={dragX} habitName={habit.name} onPress={handleDelete} />
    ),
    [habit.name, handleDelete]
  );

  const handleSwipeOpen = useCallback(() => {
    triggerHaptic('heavy');
    handleDelete();
  }, [handleDelete]);

  return (
    <Animated.View style={animatedStyle}>
      <Swipeable
        ref={swipeableRef}
        friction={2}
        overshootRight={false}
        renderRightActions={renderRightActions}
        rightThreshold={60}
        onSwipeableOpen={handleSwipeOpen}
      >
        <View
          className="flex-row items-center gap-4 px-5 py-5"
          style={{
            backgroundColor: isDark ? '#111827' : '#ffffff',
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#1f2937' : '#f8fafc',
          }}
        >
          <Text style={{ fontSize: 32, width: 44, textAlign: 'center' }}>
            {habit.icon || '\uD83D\uDCDD'}
          </Text>
          <View className="flex-1">
            <Text
              className="text-base font-semibold"
              style={{ color: colors.text.primary, marginBottom: 2 }}
            >
              {habit.name}
            </Text>
            <Text style={{ color: isDark ? '#6b7280' : '#b0b8c4', fontSize: 13 }}>
              {daysText}
            </Text>
          </View>
          <Pressable
            accessibilityLabel={`Restore ${habit.name}`}
            disabled={isRestoring}
            style={({ pressed }) => ({
              backgroundColor: pressed
                ? isDark ? '#065f46' : '#dcfce7'
                : isDark ? '#064e3b' : '#f0fdf4',
              borderRadius: 20,
              opacity: isRestoring ? 0.6 : 1,
              paddingHorizontal: 16,
              paddingVertical: 7,
            })}
            onPress={handleRestorePress}
          >
            <Text style={{ color: isDark ? '#6ee7b7' : '#16a34a', fontSize: 13, fontWeight: '600' }}>
              {isRestoring ? 'Restoring...' : 'Restore'}
            </Text>
          </Pressable>
        </View>
      </Swipeable>
    </Animated.View>
  );
}
