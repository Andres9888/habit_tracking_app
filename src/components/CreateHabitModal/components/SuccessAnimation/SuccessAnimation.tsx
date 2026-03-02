/**
 * SuccessAnimation Component
 *
 * Full-screen modal celebrating habit creation with confetti effect
 * Uses react-native-reanimated (migrated from legacy Animated)
 */

import { Modal, View } from 'react-native';
import Reanimated, { useAnimatedStyle } from 'react-native-reanimated';

import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import { ConfettiParticle } from './ConfettiParticle';
import { CONFETTI_COLORS, CONFETTI_PARTICLE_COUNT } from './constants';
import { SuccessCard } from './SuccessCard';
import { useSuccessAnimations } from './useSuccessAnimations';

import type { SuccessAnimationProps, ConfettiParticleData } from './types';

export const SuccessAnimation = ({
  habitName,
  onComplete,
  selectedColor,
  selectedEmoji,
  visible,
}: SuccessAnimationProps) => {
  const { triggerSuccess } = useHapticFeedback();

  const { animatedValues, runExitAnimation } = useSuccessAnimations({
    onHapticFeedback: triggerSuccess,
    visible,
  });

  const handleComplete = () => runExitAnimation(onComplete);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: animatedValues.backdropOpacity.value,
  }));

  if (!visible) return null;

  const confettiParticles: ConfettiParticleData[] = Array.from(
    { length: CONFETTI_PARTICLE_COUNT },
    (_, i) => ({
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      delay: Math.random() * 400,
      id: i,
      left: Math.random() * 100,
    })
  );

  return (
    <Modal transparent animationType='none' visible={visible} onRequestClose={handleComplete}>
      <Reanimated.View
        className='flex-1 items-center justify-center bg-black/50'
        style={backdropStyle}
      >
        <View className='absolute inset-x-0 top-0 h-full overflow-hidden'>
          {confettiParticles.map((p) => (
            <ConfettiParticle
              key={p.id}
              color={p.color}
              delay={p.delay}
              left={p.left}
            />
          ))}
        </View>

        <SuccessCard
          {...animatedValues}
          habitName={habitName}
          selectedColor={selectedColor}
          selectedEmoji={selectedEmoji}
          onComplete={handleComplete}
        />
      </Reanimated.View>
    </Modal>
  );
};

export default SuccessAnimation;
