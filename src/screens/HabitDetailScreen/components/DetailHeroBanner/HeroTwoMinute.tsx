/**
 * HeroTwoMinute — secondary outline CTA that logs today's completion as minimal.
 * Hidden by the parent once today is already complete.
 */
import { Pressable, Text } from 'react-native';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { fontWeights } from '../../../../theme/typography';
import type { InsightPalette } from '../../insightPalette';

interface HeroTwoMinuteProps {
  disabled?: boolean;
  palette: InsightPalette;
  onPress: () => void;
}

export function HeroTwoMinute({
  disabled = false,
  palette,
  onPress,
}: HeroTwoMinuteProps) {
  return (
    <Pressable
      accessibilityHint='Logs today as the smaller 2-minute version of this habit'
      accessibilityLabel='Do the 2-minute version — it counts'
      accessibilityRole='button'
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={8}
      style={{
        alignItems: 'center',
        borderColor: palette.ctaGreen,
        borderRadius: borderRadius.medium,
        borderWidth: 1.5,
        justifyContent: 'center',
        marginTop: spacing.md,
        minHeight: 44,
        opacity: disabled ? 0.5 : 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
      onPress={onPress}
    >
      <Text
        style={{
          color: palette.ctaGreen,
          fontSize: 14,
          fontWeight: fontWeights.semibold,
          textAlign: 'center',
        }}
      >
        Do the 2-minute version — it counts
      </Text>
    </Pressable>
  );
}
