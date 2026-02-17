/**
 * AccountabilityCard - Displays accountability partner status on habit detail
 *
 * Shows partner's streak, completion status, nudge button, and celebrations.
 * Scientific Basis: Social accountability increases habit adherence by 65% (ASTC, 2015)
 */

import { useQuery, useMutation } from 'convex/react';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { useThemeColors } from '../../theme';

interface AccountabilityCardProps {
  habitId: Id<'habits'>;
  completedToday: boolean;
  onInvitePartner: () => void;
}

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

/** Streak flame indicator */
function StreakBadge({ streak, color }: { streak: number; color: string }) {
  return (
    <View className="flex-row items-center gap-1">
      <Text className="text-[16px]">🔥</Text>
      <Text className="text-[15px] font-bold" style={{ color }}>
        {streak}
      </Text>
    </View>
  );
}

/** Nudge button component */
function NudgeButton({
  onPress,
  disabled,
  partnerName,
}: {
  onPress: () => void;
  disabled: boolean;
  partnerName: string;
}) {
  const { colors: themeColors } = useThemeColors();

  return (
    <TouchableOpacity
      accessibilityLabel={`Nudge ${partnerName}`}
      accessibilityRole="button"
      className="mt-3 flex-row items-center justify-center rounded-xl py-2.5 px-4"
      disabled={disabled}
      onPress={onPress}
      style={{
        backgroundColor: disabled ? themeColors.gray[200] : '#FEF3C7',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Text className="text-[14px] font-semibold" style={{ color: disabled ? themeColors.text.secondary : '#92400E' }}>
        👋 Hey, did you do it today?
      </Text>
    </TouchableOpacity>
  );
}

/** Celebration banner when both complete on same day */
function CelebrationBanner() {
  return (
    <Animated.View
      className="mt-3 flex-row items-center justify-center rounded-xl py-2.5 px-4"
      entering={FadeInUp.duration(400).springify().damping(14)}
      style={{ backgroundColor: '#D1FAE5' }}
    >
      <Text className="text-[14px] font-semibold" style={{ color: '#047857' }}>
        🎉 You both crushed it today!
      </Text>
    </Animated.View>
  );
}

export function AccountabilityCard({
  habitId,
  completedToday,
  onInvitePartner,
}: AccountabilityCardProps) {
  const { colors: themeColors, isDark } = useThemeColors();
  const [nudgeSent, setNudgeSent] = useState(false);

  const partnership = useQuery(api.accountability.getPartnerForHabit, { habitId });
  const partnerStreak = useQuery(
    api.accountability.getPartnerStreakInfo,
    partnership?._id ? { partnershipId: partnership._id } : 'skip'
  );

  const sendNudge = useMutation(api.accountability.sendNudge);
  const recordCelebration = useMutation(api.accountability.recordCelebration);

  const bothCompletedToday = completedToday && partnerStreak?.completedToday;

  // Record celebration when both complete
  React.useEffect(() => {
    if (bothCompletedToday && partnership?._id) {
      recordCelebration({ partnershipId: partnership._id });
    }
  }, [bothCompletedToday, partnership?._id, recordCelebration]);

  const handleNudge = useCallback(async () => {
    if (!partnership?._id) return;
    try {
      await sendNudge({ partnershipId: partnership._id });
      setNudgeSent(true);
    } catch {
      Alert.alert('Hold on', 'You can only nudge once per hour 😅');
    }
  }, [partnership?._id, sendNudge]);

  const cardBg = isDark ? themeColors.card : '#FFFFFF';
  const shadowColor = isDark ? '#000000' : '#1c1917';
  const partnerName = partnership?.partnerName ?? 'Partner';

  // No partnership — show invite prompt
  if (!partnership || partnership.status === 'pending') {
    return (
      <Animated.View
        className="rounded-2xl p-4"
        entering={anim(180)}
        style={{
          backgroundColor: cardBg,
          elevation: 4,
          shadowColor,
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: isDark ? 0.3 : 0.08,
          shadowRadius: 16,
        }}
      >
        <View className="items-center py-2">
          <Text className="text-[28px] mb-1">🤝</Text>
          <Text
            className="text-[15px] font-semibold mb-1"
            style={{ color: themeColors.text.primary }}
          >
            Get an Accountability Partner
          </Text>
          <Text
            className="text-[13px] text-center mb-3 px-4"
            style={{ color: themeColors.text.secondary }}
          >
            Pair with a friend and keep each other on track. People with
            accountability partners are 65% more likely to stick with their
            habits.
          </Text>
          <TouchableOpacity
            accessibilityLabel="Invite a partner"
            accessibilityRole="button"
            className="rounded-xl py-2.5 px-6"
            onPress={onInvitePartner}
            style={{ backgroundColor: '#059669' }}
          >
            <Text className="text-[14px] font-semibold text-white">
              🔗 Share Invite Link
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  // Active partnership
  return (
    <Animated.View
      className="rounded-2xl p-4"
      entering={anim(180)}
      style={{
        backgroundColor: cardBg,
        elevation: 4,
        shadowColor,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: isDark ? 0.3 : 0.08,
        shadowRadius: 16,
      }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <Text className="text-[20px]">🤝</Text>
          <Text
            className="text-[15px] font-semibold"
            style={{ color: themeColors.text.primary }}
          >
            {partnerName}
          </Text>
        </View>
        {partnerStreak && (
          <StreakBadge color={themeColors.text.primary} streak={partnerStreak.currentStreak} />
        )}
      </View>

      {/* Partner status */}
      {partnerStreak && (
        <View className="flex-row items-center gap-3 mb-1">
          <View
            className="h-2.5 flex-1 rounded-full overflow-hidden"
            style={{ backgroundColor: isDark ? themeColors.gray[200] : '#F3F0EB' }}
          >
            <View
              className="h-full rounded-full"
              style={{
                backgroundColor: partnerStreak.completedToday ? '#059669' : '#D97706',
                width: `${Math.max(partnerStreak.strength * 100, 5)}%`,
              }}
            />
          </View>
          <Text className="text-[12px] font-medium" style={{ color: themeColors.text.tertiary }}>
            {partnerStreak.completedToday ? '✅ Done' : '⏳ Pending'}
          </Text>
        </View>
      )}

      {/* Celebration or Nudge */}
      {bothCompletedToday ? (
        <CelebrationBanner />
      ) : !partnerStreak?.completedToday && completedToday ? (
        <NudgeButton
          disabled={nudgeSent}
          onPress={handleNudge}
          partnerName={partnerName}
        />
      ) : null}
    </Animated.View>
  );
}
