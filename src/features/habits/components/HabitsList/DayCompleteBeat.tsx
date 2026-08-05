/**
 * DayCompleteBeat — one calm line that appears above the habit rows when every
 * habit for today is complete. Quiet FadeIn plus a single shimmer sweep, never
 * a modal or burst (honors the premium-not-cheap, calm-fade invariant). Mounts
 * only on the all-done transition and unmounts cleanly when a habit is undone,
 * so it fires once per completed day. Shares its grammar with CompletionToast.
 */
import { memo } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SuccessShimmer } from '../../../../components/animations/SuccessShimmer';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { durations, enterEasing } from '../../../../theme/animations';
import { spacing } from '../../../../theme/spacing';
import { fontFamilies, fontWeights } from '../../../../theme/typography';

interface DayCompleteBeatProps {
  isAllDone: boolean;
  reduceMotion: boolean;
}

function DayCompleteBeatComponent({
  isAllDone,
  reduceMotion,
}: DayCompleteBeatProps) {
  const { colors } = useThemeColors();

  if (!isAllDone) return null;

  return (
    <View
      className='overflow-hidden'
      style={{
        marginHorizontal: spacing.base + spacing.xs,
        marginTop: spacing.xs,
        marginBottom: spacing.xs,
      }}
    >
      <Animated.Text
        accessibilityLiveRegion='polite'
        accessibilityRole='text'
        entering={
          reduceMotion
            ? undefined
            : FadeIn.duration(durations.standard).easing(enterEasing)
        }
        style={{
          color: colors.status.streakText,
          fontFamily: fontFamilies.primary.display,
          fontSize: 15,
          fontWeight: fontWeights.semibold,
          letterSpacing: -0.1,
          textAlign: 'center',
        }}
      >
        That&apos;s everything for today.
      </Animated.Text>
      <SuccessShimmer active={!reduceMotion} />
    </View>
  );
}

export const DayCompleteBeat = memo(DayCompleteBeatComponent);
