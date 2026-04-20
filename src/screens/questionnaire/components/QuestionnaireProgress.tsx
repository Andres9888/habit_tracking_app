import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

import { useThemeColors } from '@/theme';
import { TOTAL_STEPS, type QuestionnaireStep } from '../QuestionnaireFlow.types';

interface Props {
  step: QuestionnaireStep;
}

export function QuestionnaireProgress({ step }: Props) {
  const { colors } = useThemeColors();
  const progress = useSharedValue(step / TOTAL_STEPS);

  useEffect(() => {
    progress.value = withTiming(step / TOTAL_STEPS, { duration: 320 });
  }, [progress, step]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View
      accessibilityLabel={`Step ${step} of ${TOTAL_STEPS}`}
      accessibilityRole='progressbar'
      style={{
        backgroundColor: colors.border,
        borderRadius: 999,
        height: 4,
        overflow: 'hidden',
        width: '100%',
      }}
    >
      <Animated.View
        style={[
          {
            backgroundColor: colors.primary[600],
            borderRadius: 999,
            height: '100%',
          },
          fillStyle,
        ]}
      />
    </View>
  );
}
