/**
 * ShareStreakButton - "Share my streak" with branded share card
 */
import React, { useCallback, useMemo } from 'react';
import { Text, TouchableOpacity, Share, Alert, Platform } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { computeCurrentStreakFromDates } from '../../../utils/streak';
import { computeBestStreak } from '../utils/streakStats';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

interface ShareStreakButtonProps {
  habitName: string;
  completedDates: Set<string>;
  baseDelay?: number;
}

export function ShareStreakButton({
  habitName,
  completedDates,
  baseDelay = 540,
}: ShareStreakButtonProps) {
  const now = useMemo(() => new Date(), []);
  const currentStreak = useMemo(
    () => computeCurrentStreakFromDates(completedDates, now),
    [completedDates, now]
  );
  const bestStreak = useMemo(
    () => computeBestStreak(completedDates),
    [completedDates]
  );

  const handleShare = useCallback(async () => {
    const streakEmoji = currentStreak >= 30 ? '🌟' : currentStreak >= 7 ? '🔥' : '⚡';
    const message = [
      `${streakEmoji} ${currentStreak}-day streak on "${habitName}"!`,
      bestStreak > currentStreak
        ? `Personal best: ${bestStreak} days`
        : `This is my personal best! 🏆`,
      '',
      `Tracked with ChainDay 📱`,
    ].join('\n');

    try {
      await Share.share({
        message,
        ...(Platform.OS === 'ios' ? { url: 'https://chainday.app' } : {}),
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        Alert.alert('Share failed', 'Could not open share sheet.');
      }
    }
  }, [currentStreak, bestStreak, habitName]);

  if (currentStreak < 1) return null;

  return (
    <Animated.View entering={anim(baseDelay)}>
      <TouchableOpacity
        activeOpacity={0.85}
        className='mt-2 items-center rounded-2xl bg-emerald-600 py-3.5 shadow-md'
        onPress={handleShare}
        style={{
          shadowColor: '#059669',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.25,
          shadowRadius: 12,
        }}
      >
        <Text className='text-[17px] font-bold text-white'>
          Share my streak 🎉
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
