/**
 * InsightPill — outlined pill CTA used by the insight cards ("Adjust ›").
 *
 * Wraps `ui/AnimatedPressable` rather than a bare Pressable so it gets the app's
 * standard press scale and the web focus ring; previously it had no press
 * feedback at all. `Button` can't be reused here — its `secondary` variant is
 * hardcoded to `colors.primary` and this pill takes an arbitrary tint.
 */
import { Text } from 'react-native';
import { AnimatedPressable } from '../../../../components/ui';
import { borderRadius } from '../../../../theme/spacing';
import { fontWeights } from '../../../../theme/typography';

interface InsightPillProps {
  accessibilityHint?: string;
  borderColor: string;
  label: string;
  tint: string;
  onPress: () => void;
}

export function InsightPill({
  accessibilityHint,
  borderColor,
  label,
  tint,
  onPress,
}: InsightPillProps) {
  return (
    <AnimatedPressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={label}
      accessibilityRole='button'
      hitSlop={6}
      style={{
        alignItems: 'center',
        borderColor,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        flex: 0,
        justifyContent: 'center',
        minHeight: 44,
        paddingHorizontal: 16,
      }}
      onPress={onPress}
    >
      <Text style={{ color: tint, fontSize: 13, fontWeight: fontWeights.bold }}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}
