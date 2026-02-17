/**
 * TrialCountdownBanner
 *
 * Sticky banner shown below the HabitsHeader during the free trial period.
 * Displays "X days left of Premium trial" with an upgrade CTA.
 *
 * Design:
 *   - Emerald gradient strip — stands out without being disruptive
 *   - Compact (40px tall) so it doesn't eat into habit list space
 *   - Spring entrance animation from the top
 *   - Days remaining count creates urgency (especially ≤2 days)
 */

import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { memo } from 'react';

interface TrialCountdownBannerProps {
  daysRemaining: number;
  onUpgradePress: () => void;
}

const ENTERING = FadeInDown.duration(320).springify().damping(18);

// Use urgency-level colors: green → amber → red
function getBannerColors(daysRemaining: number): {
  background: string;
  text: string;
  accent: string;
} {
  if (daysRemaining <= 1) {
    // Last day — high urgency red
    return { background: '#FEF2F2', text: '#991B1B', accent: '#DC2626' };
  }
  if (daysRemaining <= 3) {
    // 2-3 days — amber warning
    return { background: '#FFFBEB', text: '#92400E', accent: '#D97706' };
  }
  // 4-7 days — standard emerald premium feel
  return { background: '#ECFDF5', text: '#065F46', accent: '#059669' };
}

function TrialCountdownBannerComponent({
  daysRemaining,
  onUpgradePress,
}: TrialCountdownBannerProps) {
  const { background, text, accent } = getBannerColors(daysRemaining);

  const dayWord = daysRemaining === 1 ? 'day' : 'days';
  const urgencyNote =
    daysRemaining <= 1
      ? ' — don\'t lose your streaks!'
      : daysRemaining <= 3
        ? ' — keep your momentum!'
        : '';

  return (
    <Animated.View entering={ENTERING} style={[styles.wrapper, { backgroundColor: background }]}>
      <View style={styles.inner}>
        <Text
          style={[styles.message, { color: text }]}
          numberOfLines={1}
          accessibilityLabel={`${daysRemaining} ${dayWord} left of Premium trial${urgencyNote}`}
        >
          ⏳{' '}
          <Text style={[styles.bold, { color: accent }]}>
            {daysRemaining} {dayWord} left
          </Text>
          {' '}of Premium trial{urgencyNote}
        </Text>

        <Pressable
          onPress={onUpgradePress}
          style={({ pressed }) => [
            styles.upgradeBtn,
            { backgroundColor: accent, opacity: pressed ? 0.85 : 1 },
          ]}
          accessibilityRole='button'
          accessibilityLabel='Upgrade to Premium'
        >
          <Text style={styles.upgradeBtnText}>Upgrade</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bold: {
    fontWeight: '700',
  },
  inner: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  message: {
    flex: 1,
    fontFamily: 'System',
    fontSize: 13,
    fontWeight: '500',
    marginRight: 8,
  },
  upgradeBtn: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  upgradeBtnText: {
    color: '#FFFFFF',
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  wrapper: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
});

export const TrialCountdownBanner = memo(TrialCountdownBannerComponent);
export default TrialCountdownBanner;
