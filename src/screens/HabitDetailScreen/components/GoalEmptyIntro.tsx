/** GoalEmptyIntro — Target tile + copy above the goal preset picker. */
import { Text, View } from 'react-native';
import { Target } from 'lucide-react-native';
import { useThemeColors, withAlpha } from '../../../theme';
import { typography, fontWeights } from '../../../theme/typography';

const TARGET_ICON_SIZE = 30;

export function GoalEmptyIntro() {
  const { colors } = useThemeColors();
  return (
    <>
      <View
        className='mb-5 h-16 w-16 items-center justify-center rounded-2xl'
        style={{ backgroundColor: withAlpha(colors.primary[600], 0.1) }}
      >
        <Target
          color={colors.primary[600]}
          size={TARGET_ICON_SIZE}
          strokeWidth={2}
        />
      </View>

      <Text
        className='mb-2 text-center'
        style={{
          ...typography.heading2,
          color: colors.text.primary,
        }}
      >
        Set a streak goal
      </Text>
      <Text
        className='mb-1 text-center'
        style={{
          ...typography.bodySmall,
          color: colors.text.primary,
          fontWeight: fontWeights.medium,
        }}
      >
        66 days is the science-backed sweet spot.
      </Text>
      <Text
        className='mb-6 text-center'
        style={{
          ...typography.caption,
          color: colors.text.secondary,
          lineHeight: 18,
        }}
      >
        Pick a target — we'll celebrate every milestone.
      </Text>
    </>
  );
}
