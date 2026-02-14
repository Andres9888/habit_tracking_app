/**
 * HabitsListFooter Component
 * Renders the footer with mini analytics dashboard and locked habit card
 */

import { View } from 'react-native';
import { LockedHabitCard } from './LockedHabitCard';
import { MiniAnalyticsDashboard } from '../../../../components/MiniAnalyticsDashboard';

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
  const showMiniAnalytics = !isPremiumUser;

  if (!showLockedCard && !showMiniAnalytics) return null;

  return (
    <View className='gap-4'>
      {showMiniAnalytics && (
        <MiniAnalyticsDashboard
          onUpgradePress={onUpgradeIntent}
          reduceMotion={reduceMotionPreference}
        />
      )}
      {showLockedCard && (
        <View className='mt-2'>
          <LockedHabitCard
            reduceMotion={reduceMotionPreference}
            onUpgradePress={onUpgradeIntent}
          />
        </View>
      )}
    </View>
  );
}
