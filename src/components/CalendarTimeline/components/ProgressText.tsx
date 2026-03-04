import { Text } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { useReduceMotion } from '../../../hooks/useReduceMotion';
import { useThemeColors } from '../../../theme/ThemeContext';
import { fontFamilies } from '../../../theme/typography';

const PROGRESS_BASE = {
  fontFamily: fontFamilies.primary.text,
  fontSize: 14,
  fontWeight: '600' as const,
  letterSpacing: -0.2,
};

interface ProgressTextProps {
  completed: number;
  total: number;
}

const DONE_ENTER = ZoomIn.duration(300).springify().damping(12);

/** Progress text with celebration micro-animation on "All done!" */
export function ProgressText({ completed, total }: ProgressTextProps) {
  const { colors } = useThemeColors();
  const reduceMotion = useReduceMotion();
  if (total === 0) return null;

  const isAllDone = completed >= total;
  const mutedColor = colors.text.tertiary;

  if (isAllDone) {
    return (
      <Animated.Text
        entering={reduceMotion ? undefined : DONE_ENTER}
        style={[
          PROGRESS_BASE,
          { color: colors.primary[600], fontWeight: '700' },
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
          fontWeight: '700',
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
