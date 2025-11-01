import { Plus } from 'lucide-react-native';
import { useCallback, useEffect, useRef } from 'react';
import { Animated, Easing, Pressable } from 'react-native';
import { useHapticFeedback } from '../../../hooks/useHapticFeedback';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface FloatingActionButtonProps {
  openCreateHabitScreen: () => void;
  celebrationsEnabled?: boolean;
  reduceMotionPreference?: boolean;
}

export function FloatingActionButton({
  openCreateHabitScreen,
  celebrationsEnabled = true,
  reduceMotionPreference = false,
}: FloatingActionButtonProps) {
  const bounce = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;
  const rippleOpacity = useRef(new Animated.Value(0)).current;
  const rippleScale = useRef(new Animated.Value(0.6)).current;

  const { triggerMediumImpact, triggerSelection } = useHapticFeedback({
    isEnabled: celebrationsEnabled,
    preference: reduceMotionPreference,
  });

  useEffect(() => {
    if (!celebrationsEnabled || reduceMotionPreference) {
      bounce.stopAnimation();
      bounce.setValue(0);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, {
          duration: 260,
          easing: Easing.out(Easing.cubic),
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          duration: 520,
          easing: Easing.inOut(Easing.ease),
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.delay(1200),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [bounce, celebrationsEnabled, reduceMotionPreference]);

  const handlePress = useCallback(() => {
    if (reduceMotionPreference) {
      openCreateHabitScreen();
      return;
    }

    if (celebrationsEnabled) {
      triggerMediumImpact();
    } else {
      triggerSelection();
    }

    rippleOpacity.setValue(0.26);
    rippleScale.setValue(0.6);

    Animated.parallel([
      Animated.sequence([
        Animated.timing(pressScale, {
          duration: 110,
          easing: Easing.out(Easing.quad),
          toValue: 0.94,
          useNativeDriver: true,
        }),
        Animated.timing(pressScale, {
          duration: 160,
          easing: Easing.out(Easing.ease),
          toValue: 1,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(rippleScale, {
        duration: 320,
        easing: Easing.out(Easing.cubic),
        toValue: 1.8,
        useNativeDriver: true,
      }),
      Animated.timing(rippleOpacity, {
        duration: 320,
        easing: Easing.out(Easing.ease),
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();

    openCreateHabitScreen();
  }, [
    celebrationsEnabled,
    openCreateHabitScreen,
    pressScale,
    rippleOpacity,
    rippleScale,
    triggerMediumImpact,
    triggerSelection,
  ]);

  const animatedStyle = {
    transform: [
      {
        scale: pressScale,
      },
      {
        translateY: bounce.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -6],
        }),
      },
    ],
  };

  return (
    <AnimatedPressable
      accessibilityHint='Open create habit modal'
      accessibilityLabel='Add habit'
      accessibilityRole='button'
      className='h-14 w-14 items-center justify-center rounded-full bg-[#101727] shadow-lg'
      style={animatedStyle}
      onPress={handlePress}
    >
      <Animated.View
        className='absolute h-14 w-14 rounded-full'
        pointerEvents='none'
        style={{
          opacity: rippleOpacity,
          transform: [{ scale: rippleScale }],
          backgroundColor: 'rgba(59,130,246,0.28)',
        }}
      />
      <Plus color='#ffffff' size={24} strokeWidth={2.25} />
    </AnimatedPressable>
  );
}

export default FloatingActionButton;
