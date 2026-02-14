import { Text, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { useState, useCallback } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
  withSequence,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { shadows } from '../../../theme/spacing';
import { colors } from '../../../theme/colors';
import type { DeletedHabitCardProps } from '../types';

const CARD_STAGGER = 50;
const CARD_DURATION = 300;
const EXIT_DURATION = 300;

export function DeletedHabitCard({
  habit,
  index,
  daysRemaining,
  reducedMotion,
  onRestore,
  onDelete,
}: DeletedHabitCardProps) {
  const [isRestoring, setIsRestoring] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Animations
  const cardOpacity = useSharedValue(reducedMotion ? 1 : 0);
  const cardTranslateY = useSharedValue(reducedMotion ? 0 : 20);
  const cardTranslateX = useSharedValue(0);
  const cardScale = useSharedValue(1);
  const successScale = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion) return;
    const delay = index * CARD_STAGGER;
    cardOpacity.value = withDelay(
      delay,
      withTiming(1, { duration: CARD_DURATION, easing: Easing.out(Easing.cubic) })
    );
    cardTranslateY.value = withDelay(
      delay,
      withSpring(0, { damping: 18, stiffness: 120 })
    );
    return () => {
      cancelAnimation(cardOpacity);
      cancelAnimation(cardTranslateY);
    };
  }, [index, reducedMotion, cardOpacity, cardTranslateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [
      { translateY: cardTranslateY.value },
      { translateX: cardTranslateX.value },
      { scale: cardScale.value },
    ],
  }));

  const successIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: successScale.value }],
  }));

  const handleRestorePress = useCallback(async () => {
    if (isRestoring) return;
    setIsRestoring(true);
    const success = await onRestore(habit._id, habit.name);
    if (success) {
      setShowSuccess(true);
      successScale.value = withSequence(
        withSpring(1.2, { damping: 10, stiffness: 200 }),
        withSpring(1, { damping: 15, stiffness: 150 })
      );
      setTimeout(() => {
        const exitTiming = { duration: EXIT_DURATION, easing: Easing.out(Easing.cubic) };
        if (reducedMotion) {
          cardOpacity.value = 0;
        } else {
          cardTranslateX.value = withTiming(100, exitTiming);
          cardOpacity.value = withTiming(0, exitTiming);
          cardScale.value = withTiming(0.95, exitTiming);
        }
      }, 400);
    } else {
      setIsRestoring(false);
    }
  }, [habit._id, habit.name, isRestoring, onRestore, reducedMotion, cardOpacity, cardTranslateX, cardScale, successScale]);

  const isUrgent = daysRemaining <= 7;

  return (
    <Animated.View style={animatedStyle}>
      <View
        className='overflow-hidden rounded-2xl border border-stone-200 bg-white'
        style={{ ...shadows.card, shadowOpacity: 0.05 }}
      >
        <View className='p-4'>
          {/* Header: icon + name + days remaining */}
          <View className='mb-3 flex-row items-center gap-3'>
            {habit.icon ? (
              <View
                className='h-10 w-10 items-center justify-center rounded-xl'
                style={{ backgroundColor: habit.iconColor ?? '#e7e5e4' }}
              >
                <Text className='text-lg'>{habit.icon}</Text>
              </View>
            ) : (
              <View className='h-10 w-10 items-center justify-center rounded-xl bg-stone-100'>
                <Text className='text-lg'>📋</Text>
              </View>
            )}
            <View className='flex-1'>
              <Text className='text-base font-semibold text-stone-900' numberOfLines={1}>
                {habit.name}
              </Text>
              <Text
                className={`text-xs font-medium ${
                  isUrgent ? 'text-red-500' : 'text-stone-400'
                }`}
              >
                {daysRemaining === 0
                  ? 'Expires today'
                  : daysRemaining === 1
                    ? '1 day remaining'
                    : `${daysRemaining} days remaining`}
              </Text>
            </View>
          </View>

          {/* Expiry progress bar */}
          <View className='mb-3 h-1.5 overflow-hidden rounded-full bg-stone-100'>
            <View
              className={`h-full rounded-full ${isUrgent ? 'bg-red-400' : 'bg-amber-400'}`}
              style={{ width: `${(daysRemaining / 30) * 100}%` }}
            />
          </View>

          {/* Action buttons */}
          <View className='flex-row gap-2'>
            <TouchableOpacity
              accessibilityLabel={`Restore ${habit.name}`}
              accessibilityRole='button'
              className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl border-2 py-2.5 ${
                showSuccess
                  ? 'border-emerald-500 bg-emerald-50'
                  : isRestoring
                    ? 'border-blue-300 opacity-70'
                    : 'border-blue-500'
              }`}
              disabled={isRestoring}
              onPress={handleRestorePress}
            >
              {showSuccess ? (
                <Animated.View
                  className='flex-row items-center gap-2'
                  style={successIconStyle}
                >
                  <View className='h-5 w-5 items-center justify-center rounded-full bg-emerald-500'>
                    <Check color={colors.text.inverse} size={14} strokeWidth={3} />
                  </View>
                  <Text className='text-xs font-bold tracking-wide text-emerald-600'>
                    RESTORED!
                  </Text>
                </Animated.View>
              ) : (
                <>
                  <Text className={isRestoring ? 'text-blue-300' : 'text-blue-500'}>
                    ↩
                  </Text>
                  <Text
                    className={`text-xs font-bold tracking-wide ${isRestoring ? 'text-blue-300' : 'text-blue-500'}`}
                  >
                    {isRestoring ? 'RESTORING...' : 'RESTORE'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityLabel={`Permanently delete ${habit.name}`}
              accessibilityRole='button'
              className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl border-2 border-red-400 py-2.5 ${
                isRestoring ? 'opacity-50' : ''
              }`}
              disabled={isRestoring}
              onPress={() => onDelete(habit._id, habit.name)}
            >
              <Text className='text-red-400'>🗑</Text>
              <Text className='text-xs font-bold tracking-wide text-red-400'>
                DELETE
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}
