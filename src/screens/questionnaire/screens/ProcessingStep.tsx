import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useThemeColors } from '@/theme';

import { QuestionnaireScreenFrame } from '../components/QuestionnaireScreenFrame';
import type { StepProps } from '../QuestionnaireFlow.types';

const PROCESSING_MS = 1600;
const PULSE_MS = 900;

export function ProcessingStep({ step, onNext, onBack }: StepProps) {
  const { colors } = useThemeColors();
  const pulse = useSharedValue(0.4);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: PULSE_MS }),
      -1,
      true
    );
    const timeoutId = setTimeout(onNext, PROCESSING_MS);
    return () => clearTimeout(timeoutId);
  }, [onNext, pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
    transform: [{ scale: 0.9 + pulse.value * 0.15 }],
  }));

  return (
    <QuestionnaireScreenFrame
      canGoBack={false}
      step={step}
      title='Building your plan…'
      onBack={onBack}
    >
      <View
        style={{
          alignItems: 'center',
          gap: 24,
          justifyContent: 'center',
          paddingVertical: 48,
        }}
      >
        <Animated.View
          style={[
            {
              backgroundColor: colors.primary[600],
              borderRadius: 999,
              height: 72,
              width: 72,
            },
            pulseStyle,
          ]}
        />
        <Animated.Text
          entering={FadeIn.delay(300)}
          style={{
            color: colors.text.secondary,
            fontSize: 15,
            textAlign: 'center',
          }}
        >
          Matching your picks to science-backed templates.
        </Animated.Text>
      </View>
    </QuestionnaireScreenFrame>
  );
}
