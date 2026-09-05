/**
 * HeroTitleRow — centered habit name, then the if-then plan the habit already
 * stores. The plan line is the shortcut into Edit: the pencil is the only
 * affordance, so the row reads as text first and a control second.
 */
import { Text, View } from 'react-native';
import { Pencil } from 'lucide-react-native';
import { AnimatedPressable } from '../../../../components/ui/AnimatedPressable';
import type { Habit } from '../../../../features/habits/types';
import { fontFamilies, fontWeights } from '../../../../theme/typography';
import type { InsightPalette } from '../../insightPalette';
import { getHabitDisplayName } from '../DetailHero.utils';
import { planLabel } from './DetailHeroBanner.plan';

interface HeroTitleRowProps {
  habit: Habit;
  palette: InsightPalette;
  onEditPlan: () => void;
}

export function HeroTitleRow({
  habit,
  palette,
  onEditPlan,
}: HeroTitleRowProps) {
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
      <AnimatedPressable
        accessibilityHint='Opens Edit'
        accessibilityLabel='Edit plan'
        accessibilityRole='button'
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          gap: 5,
          marginBottom: 2,
          marginTop: 6,
          paddingHorizontal: 4,
          paddingVertical: 2,
        }}
        onPress={onEditPlan}
      >
        <Text
          numberOfLines={1}
          style={{
            color: palette.bandMuted,
            fontSize: 13,
            fontWeight: fontWeights.medium,
            textAlign: 'center',
          }}
        >
          {planLabel(habit)}
        </Text>
        <Pencil color={palette.bandMuted} size={12} strokeWidth={2} />
      </AnimatedPressable>
    </View>
  );
}
