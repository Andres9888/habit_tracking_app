/**
 * GoalCardHeader — amber eyebrow plus the "Change" affordance.
 *
 * Retargeting sits next to the label rather than inside Edit: a goal you
 * cannot adjust in place is one people abandon instead of lowering.
 */
import { Pressable, Text, View } from 'react-native';
import { fontFamilies, fontWeights } from '../../../../theme/typography';
import type { InsightPalette } from '../../insightPalette';

interface GoalCardHeaderProps {
  palette: InsightPalette;
  onChange: () => void;
}

export function GoalCardHeader({ palette, onChange }: GoalCardHeaderProps) {
  return (
    <View
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <Text
        style={{
          color: palette.amber,
          fontFamily: fontFamilies.primary.text,
          fontSize: 12,
          fontWeight: fontWeights.bold,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
        }}
      >
        Streak goal
      </Text>
      <Pressable
        accessibilityLabel='Change streak goal'
        accessibilityRole='button'
        hitSlop={10}
        onPress={onChange}
      >
        <Text
          style={{
            color: palette.ctaGreen,
            fontFamily: fontFamilies.primary.text,
            fontSize: 12.5,
            fontWeight: fontWeights.semibold,
          }}
        >
          Change
        </Text>
      </Pressable>
    </View>
  );
}
