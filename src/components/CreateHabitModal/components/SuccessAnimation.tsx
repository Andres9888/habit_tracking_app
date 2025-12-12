import { useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, Text, View } from 'react-native';
import useHapticFeedback from '../../../hooks/useHapticFeedback';

interface SuccessAnimationProps {
  habitName: string;
  onComplete: () => void;
  selectedColor: string;
  selectedEmoji: string | null;
  visible: boolean;
}

interface ConfettiParticleProps {
  color: string;
  delay: number;
  left: number;
}

const ConfettiParticle = ({ color, delay, left }: ConfettiParticleProps) => {
  const translateY = useRef(new Animated.Value(-50)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const randomX = (Math.random() - 0.5) * 100;
    const duration = 1500 + Math.random() * 500;

    Animated.parallel([
      Animated.timing(translateY, {
        delay,
        duration,
        toValue: 400,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        delay,
        duration,
        toValue: randomX,
        useNativeDriver: true,
      }),
      Animated.timing(rotate, {
        delay,
        duration,
        toValue: Math.random() * 360,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        delay: delay + duration - 300,
        duration: 300,
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, opacity, rotate, translateX, translateY]);

  return (
    <Animated.View
      className="absolute h-3 w-3"
      style={{
        backgroundColor: color,
        borderRadius: 2,
        left: `${left}%`,
        opacity,
        top: 0,
        transform: [
          { translateY },
          { translateX },
          {
            rotate: rotate.interpolate({
              inputRange: [0, 360],
              outputRange: ['0deg', '360deg'],
            }),
          },
        ],
      }}
    />
  );
};

const CONFETTI_COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6', '#f97316'];

export const SuccessAnimation = ({
  habitName,
  onComplete,
  selectedColor,
  selectedEmoji,
  visible,
}: SuccessAnimationProps) => {
  const { triggerSuccess } = useHapticFeedback();

  // Animation values
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.5)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (visible) {
      triggerSuccess();

      // Sequence of animations
      Animated.sequence([
        // Backdrop fade in
        Animated.timing(backdropOpacity, {
          duration: 200,
          toValue: 1,
          useNativeDriver: true,
        }),
        // Card bounce in
        Animated.parallel([
          Animated.spring(cardScale, {
            damping: 10,
            stiffness: 200,
            toValue: 1,
            useNativeDriver: true,
          }),
          Animated.timing(cardOpacity, {
            duration: 200,
            toValue: 1,
            useNativeDriver: true,
          }),
        ]),
        // Icon bounce
        Animated.spring(iconScale, {
          damping: 8,
          stiffness: 300,
          toValue: 1,
          useNativeDriver: true,
        }),
        // Text fade in
        Animated.timing(textOpacity, {
          duration: 200,
          toValue: 1,
          useNativeDriver: true,
        }),
        // Button slide up
        Animated.parallel([
          Animated.timing(buttonOpacity, {
            duration: 200,
            toValue: 1,
            useNativeDriver: true,
          }),
          Animated.spring(buttonTranslateY, {
            damping: 15,
            stiffness: 200,
            toValue: 0,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [
    visible,
    triggerSuccess,
    backdropOpacity,
    cardScale,
    cardOpacity,
    iconScale,
    textOpacity,
    buttonOpacity,
    buttonTranslateY,
  ]);

  const handleComplete = () => {
    // Animate out
    Animated.parallel([
      Animated.timing(cardScale, {
        duration: 200,
        toValue: 0.9,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        duration: 200,
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        duration: 200,
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onComplete();
    });
  };

  if (!visible) return null;

  // Generate confetti particles
  const confettiParticles = Array.from({ length: 30 }, (_, i) => ({
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: Math.random() * 400,
    id: i,
    left: Math.random() * 100,
  }));

  return (
    <Modal animationType="none" transparent visible={visible}>
      <Animated.View
        className="flex-1 items-center justify-center bg-black/50"
        style={{ opacity: backdropOpacity }}
      >
        {/* Confetti */}
        <View className="absolute inset-x-0 top-0 h-full overflow-hidden">
          {confettiParticles.map((particle) => (
            <ConfettiParticle
              key={particle.id}
              color={particle.color}
              delay={particle.delay}
              left={particle.left}
            />
          ))}
        </View>

        {/* Success Card */}
        <Animated.View
          className="mx-8 items-center rounded-3xl bg-white px-8 py-10"
          style={{
            opacity: cardOpacity,
            shadowColor: '#000',
            shadowOffset: { height: 10, width: 0 },
            shadowOpacity: 0.15,
            shadowRadius: 20,
            transform: [{ scale: cardScale }],
          }}
        >
          {/* Animated Icon */}
          <Animated.View
            className="mb-6 h-24 w-24 items-center justify-center rounded-3xl"
            style={{
              backgroundColor: selectedColor || '#DBEAFE',
              transform: [{ scale: iconScale }],
            }}
          >
            <Text className="text-5xl">{selectedEmoji || '🎯'}</Text>
          </Animated.View>

          {/* Success Text */}
          <Animated.View className="items-center" style={{ opacity: textOpacity }}>
            <Text className="mb-2 text-center text-2xl font-bold text-slate-800">
              {habitName}
            </Text>
            <Text className="text-center text-lg text-slate-500">created! 🎉</Text>
            <Text className="mt-4 text-center text-sm text-slate-400">
              Your streak starts now
            </Text>
          </Animated.View>

          {/* CTA Button */}
          <Animated.View
            className="mt-8 w-full"
            style={{
              opacity: buttonOpacity,
              transform: [{ translateY: buttonTranslateY }],
            }}
          >
            <Pressable
              accessibilityLabel="Start tracking habit"
              accessibilityRole="button"
              className="items-center rounded-2xl bg-slate-900 py-4"
              onPress={handleComplete}
            >
              <Text className="text-base font-semibold text-white">
                Let's get started! →
              </Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default SuccessAnimation;
