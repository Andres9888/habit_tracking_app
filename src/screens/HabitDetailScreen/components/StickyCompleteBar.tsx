/**
 * StickyCompleteBar - the redesign's StickyComplete, pinned over the scroll.
 *   • done    — light-green "Done for today" pill (StickyDonePill)
 *   • at-risk — gold bar + "⚠ N-day chain at risk" line (live streak, not logged today)
 *   • default — solid green "Mark today complete" + white ring
 * Solid colored bars float above the safe area — no fade-to-background slab.
 */
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '../../../theme';
import { borderRadius, spacing } from '../../../theme/spacing';
import { fontWeights, typography } from '../../../theme/typography';
import { ABS_BOTTOM, BAR_ROW, barShadow, wrapStyle } from './StickyCompleteBar.styles';
import { StickyDonePill } from './StickyDonePill';

interface StickyCompleteBarProps {
  currentStreak: number;
  isCompletedToday: boolean;
  isToggling: boolean;
  onToggle: () => void;
}

export function StickyCompleteBar({
  currentStreak,
  isCompletedToday,
  isToggling,
  onToggle,
}: StickyCompleteBarProps) {
  const { colors } = useThemeColors();
  const insets = useSafeAreaInsets();

  if (isCompletedToday) return <StickyDonePill insetBottom={insets.bottom} />;

  const atRisk = currentStreak > 0;
  const barColor = atRisk ? colors.status.warning : colors.primary[600];

  return (
    <View pointerEvents='box-none' style={ABS_BOTTOM}>
      <View style={wrapStyle(insets.bottom)}>
        {atRisk ? (
          <Text
            style={{
              ...typography.caption,
              color: colors.status.warning,
              fontWeight: fontWeights.semibold,
              marginBottom: spacing.sm,
              textAlign: 'center',
            }}
          >
            ⚠ {currentStreak}-day chain at risk — don’t break it tonight
          </Text>
        ) : null}
        <Pressable
          accessibilityLabel='Mark today complete'
          accessibilityRole='button'
          disabled={isToggling}
          style={[
            BAR_ROW,
            barShadow(barColor),
            { backgroundColor: barColor, opacity: isToggling ? 0.6 : 1 },
          ]}
          onPress={onToggle}
        >
          <View
            style={{
              borderColor: 'rgba(255,255,255,0.9)',
              borderRadius: borderRadius.full,
              borderWidth: 2,
              height: 22,
              width: 22,
            }}
          />
          <Text
            style={{
              ...typography.body,
              color: colors.text.inverse,
              fontWeight: fontWeights.bold,
            }}
          >
            Mark today complete
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
