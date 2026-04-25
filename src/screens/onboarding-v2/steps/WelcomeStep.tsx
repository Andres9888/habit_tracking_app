import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useThemeColors } from '@/theme/ThemeContext';

import { StepComponentProps } from '../types';

const PULSE_MS = 1400;

export function WelcomeStep({ onNext }: StepComponentProps) {
  const { colors } = useThemeColors();
  const reduceMotion = useReducedMotion();
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    pulse.value = withRepeat(
      withTiming(1, { duration: PULSE_MS, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [pulse, reduceMotion]);

  const underlineStyle = useAnimatedStyle(() => ({
    opacity: 0.3 + pulse.value * 0.7,
    transform: [{ scaleX: 0.7 + pulse.value * 0.4 }],
  }));

  return (
    <Pressable
      accessibilityHint="Activates to begin onboarding"
      accessibilityLabel="Tap to begin"
      accessibilityRole="button"
      onPress={onNext}
      style={{ flex: 1 }}
    >
      <View style={{ alignItems: 'center', flex: 1, justifyContent: 'space-between' }}>
        <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          <Text
            accessibilityRole="header"
            style={{
              color: colors.text.primary,
              fontSize: 72,
              fontWeight: '800',
              letterSpacing: -2.5,
              textAlign: 'center',
            }}
          >
            Hey.
          </Text>
        </View>
        <View style={{ alignItems: 'center', paddingBottom: 16 }}>
          <Text
            style={{
              color: colors.text.tertiary,
              fontSize: 13,
              fontWeight: '500',
              letterSpacing: 1.5,
              textTransform: 'uppercase',
            }}
          >
            Tap to begin
          </Text>
          <Animated.View
            style={[
              {
                backgroundColor: colors.primary[600],
                borderRadius: 2,
                height: 3,
                marginTop: 8,
                width: 36,
              },
              underlineStyle,
            ]}
          />
        </View>
      </View>
    </Pressable>
  );
}
