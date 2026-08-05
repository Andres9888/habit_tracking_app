/**
 * HeroTitleRow — schedule eyebrow + serif habit name on the left, strength dial
 * on the right. The dial's arc turns from amber to green once today is logged,
 * which is the only colour cue the design gives the row.
 */
import { Text, View } from 'react-native';
import type { Habit } from '../../../../features/habits/types';
import { spacing } from '../../../../theme/spacing';
import { fontFamilies, fontWeights } from '../../../../theme/typography';
import type { InsightPalette } from '../../insightPalette';
import { getHabitDisplayName } from '../DetailHero.utils';
import {
  scheduleLabel,
  strengthLabel,
  strengthPercent,
} from './DetailHeroBanner.utils';
import { HeroStrengthDial } from './HeroStrengthDial';

interface HeroTitleRowProps {
  habit: Habit;
  isCompletedToday: boolean;
  palette: InsightPalette;
}

export function HeroTitleRow({
  habit,
  isCompletedToday,
  palette,
}: HeroTitleRowProps) {
  const percent = strengthPercent(habit);

  return (
    <View
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        gap: 18,
        paddingHorizontal: 20,
        paddingTop: 18,
      }}
    >
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          style={{
            color: palette.ctaGreen,
            fontSize: 11,
            fontWeight: fontWeights.bold,
            letterSpacing: 1.7,
            textTransform: 'uppercase',
          }}
        >
          {scheduleLabel(habit)}
        </Text>
        <Text
          accessibilityRole='header'
          style={{
            color: palette.bandFg,
            fontFamily: fontFamilies.primary.display,
            fontSize: 30,
            fontWeight: fontWeights.semibold,
            lineHeight: 34,
            marginTop: spacing.sm,
          }}
        >
          {getHabitDisplayName(habit)}
        </Text>
      </View>
      <HeroStrengthDial
        arcColor={isCompletedToday ? palette.green : palette.dialArc}
        levelLabel={strengthLabel(percent)}
        mutedColor={palette.bandMuted}
        strengthPercent={percent}
        textColor={palette.bandFg}
        trackColor={palette.dialTrack}
      />
    </View>
  );
}
