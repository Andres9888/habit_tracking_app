import React from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { colors } from '../../../theme/colors';
import { springs } from '@/theme/animations';
import { styles } from './ConfettiBurst.styles';

const CONFETTI_COLORS = [
  colors.primary[500],
  colors.secondary[500],
  colors.warning[500],
  colors.error,
  colors.premium[500],
];
const PARTICLE_COUNT = 8;

interface ConfettiBurstProps {
  active: boolean;
  onComplete: () => void;
}

interface ParticleProps {
  color: string;
  endX: number;
  endY: number;
  onComplete?: () => void;
}

function Particle({ color, endX, endY, onComplete }: ParticleProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  React.useEffect(() => {
    translateX.value = withSpring(endX, springs.standard);
    translateY.value = withSpring(endY, springs.standard);
    scale.value = withSequence(
      withSpring(1.5, springs.bouncy),
      withTiming(0, { duration: 300 })
    );
    opacity.value = withTiming(0, { duration: 400 }, () => {
      if (onComplete) {
        runOnJS(onComplete)();
      }
    });
  }, [endX, endY, onComplete, opacity, scale, translateX, translateY]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      style={[styles.particle, { backgroundColor: color }, style]}
    />
  );
}

export function ConfettiBurst({ active, onComplete }: ConfettiBurstProps) {
  const particles = React.useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
      const distance = 40 + Math.random() * 20;

      return {
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        endX: Math.cos(angle) * distance,
        endY: Math.sin(angle) * distance,
        id: i,
      };
    });
  }, []);

  if (!active) return null;

  return (
    <View pointerEvents='none' style={styles.container}>
      {particles.map((particle) => (
        <Particle
          key={particle.id}
          color={particle.color}
          endX={particle.endX}
          endY={particle.endY}
          onComplete={particle.id === 0 ? onComplete : undefined}
        />
      ))}
    </View>
  );
}
