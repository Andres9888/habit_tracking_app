import { Text } from 'react-native';
import Animated, { useReducedMotion, ZoomIn } from 'react-native-reanimated';

import { durations, enterEasing } from '../../../theme/animations';
import { useThemeColors } from '../../../theme/ThemeContext';
import { typography, fontFamilies, fontWeights } from '../../../theme/typography';

const PROGRESS_BASE = {
  fontFamily: fontFamilies.primary.text,
  fontSize: typography.bodySmall.fontSize,
  fontWeight: fontWeights.semibold,
  letterSpacing: -0.2,
};

interface ProgressTextProps {
  completed: number;
  total: number;
}

const DONE_ENTER = ZoomIn.duration(durations.moderate).easing(enterEasing);

/** Progress text with celebration micro-animation on "All done!" */
export function ProgressText({ completed, total }: ProgressTextProps) {
  const { colors } = useThemeColors();
  const reduceMotion = useReducedMotion();
  if (total === 0) return null;

  const isAllDone = completed >= total;
  const mutedColor = colors.text.tertiary;

  if (isAllDone) {
    return (
      <Animated.Text
        entering={reduceMotion ? undefined : DONE_ENTER}
        style={[
          PROGRESS_BASE,
          { color: colors.primary[600], fontWeight: fontWeights.bold },
        ]}
      >
        All done!
      </Animated.Text>
    );
  }

  const countColor = completed > 0 ? colors.primary[700] : mutedColor;

  return (
    <Text style={[PROGRESS_BASE, { color: mutedColor }]}>
      <Text
        style={{
          color: countColor,
          fontWeight: fontWeights.bold,
          fontFamily: fontFamilies.monospace,
        }}
      >
        {completed}
      </Text>
      {' of '}
      <Text style={{ fontFamily: fontFamilies.monospace }}>{total}</Text>
    </Text>
  );
}
