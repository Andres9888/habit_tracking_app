/**
 * HeroWhyPill — the one why card, in two sizes.
 *
 * `card` is the ready state: white card, sage tile, full sentence. `compact`
 * sits under the recovery / completed state card so the why survives the two
 * moments it matters most — no tile, smaller label, sentence clamped to three
 * lines (imported whys run to 140 chars) so they never cut mid-word. In
 * recovery the label and hairline take the amber of the card above it.
 */
import { Text, View } from 'react-native';
import { FlaskConical, Sunrise } from 'lucide-react-native';
import type { Habit } from '../../../../features/habits/types';
import { borderRadius, shadows } from '../../../../theme/spacing';
import { fontFamilies, fontWeights } from '../../../../theme/typography';
import type { InsightPalette } from '../../insightPalette';
import { RECOVERY_INK_SMALL } from '../../insightPalette.tokens';
import { resolveWhy } from '../resolveWhy';

interface HeroWhyPillProps {
  habit: Habit;
  /** Compact only: amber label + hairline under the recovery card. */
  isRecovery?: boolean;
  palette: InsightPalette;
  variant?: 'card' | 'compact';
}

export function HeroWhyPill({
  habit,
  isRecovery = false,
  palette,
  variant = 'card',
}: HeroWhyPillProps) {
  const resolved = resolveWhy(habit);
  if (resolved === null) return null;

  const compact = variant === 'compact';
  const amber = compact && isRecovery;
  const Icon = resolved.isTemplateWhy ? FlaskConical : Sunrise;

  return (
    <View
      accessibilityLabel={`${resolved.label}: ${resolved.value}`}
      accessibilityRole='summary'
      style={{
        alignItems: 'center',
        backgroundColor: palette.card,
        borderColor: amber ? palette.amberBorder : palette.cardBorder,
        borderRadius: borderRadius.large,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 12,
        marginTop: compact ? 8 : 0,
        paddingHorizontal: compact ? 14 : 15,
        paddingVertical: compact ? 10 : 13,
        ...(compact ? {} : shadows.subtle),
      }}
    >
      {compact ? null : (
        <View
          style={{
            alignItems: 'center',
            backgroundColor: palette.tileBg,
            borderRadius: 12,
            height: 40,
            justifyContent: 'center',
            width: 40,
          }}
        >
          <Icon color={palette.green} size={21} strokeWidth={1.8} />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: amber ? RECOVERY_INK_SMALL : palette.green,
            fontSize: compact ? 11 : 13,
            fontWeight: fontWeights.bold,
            letterSpacing: compact ? 0.8 : 0.5,
            textTransform: 'uppercase',
          }}
        >
          {resolved.label}
        </Text>
        <Text
          numberOfLines={compact ? 3 : undefined}
          style={{
            color: palette.textSecondary,
            fontFamily: fontFamilies.primary.display,
            fontSize: compact ? 14 : 15,
            fontStyle: 'italic',
            lineHeight: compact ? 20 : 21,
            marginTop: compact ? 2 : 3,
          }}
        >
          {resolved.value}
        </Text>
      </View>
    </View>
  );
}
