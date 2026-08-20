/**
 * HeroTitleRow — centered habit name and its real schedule context.
 */
import { Text, View } from 'react-native';
import type { Habit } from '../../../../features/habits/types';
import { fontFamilies, fontWeights } from '../../../../theme/typography';
import type { InsightPalette } from '../../insightPalette';
import { getHabitDisplayName } from '../DetailHero.utils';
import { scheduleLabel } from './DetailHeroBanner.utils';

interface HeroTitleRowProps {
  habit: Habit;
  palette: InsightPalette;
}

export function HeroTitleRow({ habit, palette }: HeroTitleRowProps) {
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
          marginBottom: 2,
          marginTop: 6,
        }}
      >
        {scheduleLabel(habit)}
      </Text>
    </View>
  );
}
