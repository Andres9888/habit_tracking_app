/**
 * HeroCheckInCard — the "after check-in" confirmation block (frame 2 of the
 * Habit Flow Prototype). Replaces the complete bar once today is logged:
 * which day of the run this was, when it landed, and how far the current run
 * is from the record.
 *
 * The design draws it as a static block, but this is the only place in the hero
 * that can un-mark today once the bar is gone, so the whole card is the undo
 * affordance.
 */
import { Check } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { fontWeights } from '../../../../theme/typography';
import { BAND_FG, type InsightPalette } from '../../insightPalette';

interface HeroCheckInCardProps {
  /** Which day of the current run today is — 1 when the run just started. */
  streakDay: number;
  /** Local timestamp of the completion, when known. */
  completedAtLabel?: string;
  /** Quiet secondary line — milestone countdown or "2-min version". */
  caption?: string;
  palette: InsightPalette;
  disabled?: boolean;
  onUndo: () => void;
}

export function HeroCheckInCard({
  caption,
  completedAtLabel,
  disabled = false,
  onUndo,
  palette,
  streakDay,
}: HeroCheckInCardProps) {
  const headline = completedAtLabel
    ? `Day ${streakDay} — done at ${completedAtLabel}`
    : `Day ${streakDay} — done`;
  const a11yLabel = caption
    ? `${headline}. ${caption}. Tap to undo.`
    : `${headline}. Tap to undo.`;

  return (
    <Pressable
      accessibilityHint='Tap to un-mark today'
      accessibilityLabel={a11yLabel}
      accessibilityRole='button'
      accessibilityState={{ checked: true, disabled }}
      disabled={disabled}
      style={{
        alignItems: 'center',
        backgroundColor: palette.green,
        borderRadius: borderRadius.medium,
        flexDirection: 'row',
        gap: 10,
        marginTop: spacing.base,
        opacity: disabled ? 0.6 : 1,
        paddingHorizontal: 16,
        paddingVertical: 14,
      }}
      onPress={onUndo}
    >
      <View
        style={{
          alignItems: 'center',
          backgroundColor: BAND_FG,
          borderRadius: borderRadius.full,
          height: 26,
          justifyContent: 'center',
          width: 26,
        }}
      >
        <Check color={palette.green} size={15} strokeWidth={3} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          style={{
            color: BAND_FG,
            fontSize: 14,
            fontWeight: fontWeights.bold,
          }}
        >
          {headline}
        </Text>
        {caption ? (
          <Text
            style={{
              color: palette.onGreenMuted,
              fontSize: 13,
              marginTop: 1,
            }}
          >
            {caption}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
