/**
 * HabitsListFooter — conditional footer for the habits FlatList.
 *
 * Renders a {@link LockedHabitCard} when `!isPremiumUser && hasReachedHabitLimit`.
 * Returns `null` otherwise, keeping the list clean for premium or under-limit users.
 */

import { View } from 'react-native';
import { LockedHabitCard } from './LockedHabitCard';

interface HabitsListFooterProps {
  isPremiumUser: boolean;
  hasReachedHabitLimit: boolean;
  reduceMotionPreference: boolean;
  onUpgradeIntent: () => void;
}

export function HabitsListFooter({
  isPremiumUser,
  hasReachedHabitLimit,
  reduceMotionPreference,
  onUpgradeIntent,
}: HabitsListFooterProps) {
  const showLockedCard = !isPremiumUser && hasReachedHabitLimit;
  if (!showLockedCard) return null;

  return (
    <View className='gap-4'>
      <View className='mt-2'>
        <LockedHabitCard
          reduceMotion={reduceMotionPreference}
          onUpgradePress={onUpgradeIntent}
        />
      </View>
    </View>
  );
}
