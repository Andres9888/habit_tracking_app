/**
 * HeroWhyPill — white card with a sage tile, matching the full-flow mock.
 * Renders nothing when why / identity / wish are all empty.
 */
import { Text, View } from 'react-native';
import { Sunrise } from 'lucide-react-native';
import type { Habit } from '../../../../features/habits/types';
import { borderRadius, shadows } from '../../../../theme/spacing';
import { fontFamilies, fontWeights } from '../../../../theme/typography';
import type { InsightPalette } from '../../insightPalette';
import { resolveWhy } from '../resolveWhy';

interface HeroWhyPillProps {
  habit: Habit;
  palette: InsightPalette;
}

export function HeroWhyPill({ habit, palette }: HeroWhyPillProps) {
  const resolved = resolveWhy(habit);
  if (resolved === null) return null;

  return (
    <View
      accessibilityLabel={`${resolved.label}: ${resolved.value}`}
      accessibilityRole='summary'
      style={{
        alignItems: 'center',
        backgroundColor: palette.card,
        borderColor: palette.cardBorder,
        borderRadius: borderRadius.large,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 15,
        paddingVertical: 13,
        ...shadows.subtle,
      }}
    >
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
        <Sunrise color={palette.green} size={21} strokeWidth={1.8} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: palette.green,
            fontSize: 13,
            fontWeight: fontWeights.bold,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
          }}
        >
          {resolved.label}
        </Text>
        <Text
          style={{
            color: palette.textSecondary,
            fontFamily: fontFamilies.primary.display,
            fontSize: 15,
            fontStyle: 'italic',
            lineHeight: 21,
            marginTop: 3,
          }}
        >
          {resolved.value}
        </Text>
      </View>
    </View>
  );
}
