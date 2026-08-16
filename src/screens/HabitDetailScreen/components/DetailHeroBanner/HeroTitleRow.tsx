/**
 * HeroTitleRow — centered habit name, schedule, strength dial, and caption.
 * Matches the full-flow mock: title first, then the 120px ring.
 */
import { Text, View } from 'react-native';
import type { Habit } from '../../../../features/habits/types';
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
  palette: InsightPalette;
}

export function HeroTitleRow({ habit, palette }: HeroTitleRowProps) {
  const percent = strengthPercent(habit);

  return (
    <View style={{ alignItems: 'center', paddingHorizontal: 20 }}>
      <Text
        accessibilityRole='header'
        style={{
          color: palette.bandFg,
          fontFamily: fontFamilies.primary.display,
          fontSize: 26,
          fontWeight: fontWeights.medium,
          letterSpacing: -0.3,
          lineHeight: 30,
          textAlign: 'center',
        }}
      >
        {getHabitDisplayName(habit)}
      </Text>
      <Text
        style={{
          color: palette.bandMuted,
          fontSize: 13,
          fontWeight: fontWeights.medium,
          marginBottom: 10,
          marginTop: 6,
        }}
      >
        {scheduleLabel(habit)}
      </Text>
      <HeroStrengthDial
        arcColor={palette.green}
        levelLabel={strengthLabel(percent)}
        mutedColor={palette.green}
        strengthPercent={percent}
        textColor={palette.bandFg}
        trackColor={palette.dialTrack}
      />
      <Text
        style={{
          color: palette.bandMuted,
          fontSize: 11,
          letterSpacing: 0.1,
          marginTop: 6,
        }}
      >
        Habit strength · a snapshot, not a score
      </Text>
    </View>
  );
}
