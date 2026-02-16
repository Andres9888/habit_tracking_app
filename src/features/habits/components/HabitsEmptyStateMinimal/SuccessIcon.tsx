/**
 * SuccessIcon - Icon container with progress ring and particle burst
 *
 * Displays the success emoji surrounded by visual effects.
 * The progress ring shows countdown to auto-transition.
 */

import { Text, View, ViewStyle } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';

import { PROGRESS_RING, PARTICLE_BURST } from './animations';
import { ParticleBurst } from './ParticleBurst';
import { ProgressRing } from './ProgressRing';
import { useEmptyStateColors } from './useEmptyStateColors';

interface SuccessIconProps {
  emoji: string;
  autoTransition: boolean;
  iconStyle: AnimatedStyle<ViewStyle>;
  ringStyle: AnimatedStyle<ViewStyle>;
  burstStyle: AnimatedStyle<ViewStyle>;
}

export function SuccessIcon({
  emoji,
  autoTransition,
  iconStyle,
  ringStyle,
  burstStyle,
}: SuccessIconProps) {
  const colors = useEmptyStateColors();

  return (
    <Animated.View
      style={[
        iconStyle,
        {
          alignItems: 'center',
          height: PROGRESS_RING.size,
          justifyContent: 'center',
          marginBottom: 24,
          width: PROGRESS_RING.size,
        },
      ]}
    >
      {/* Progress Ring - Behind the icon, shows countdown */}
      {autoTransition && (
        <Animated.View
          style={[
            ringStyle,
            {
              height: PROGRESS_RING.size,
              position: 'absolute',
              width: PROGRESS_RING.size,
            },
          ]}
        >
          <ProgressRing
            duration={PROGRESS_RING.duration}
            size={PROGRESS_RING.size}
          />
        </Animated.View>
      )}

      {/* Particle Burst - Positioned behind icon */}
      <Animated.View
        style={[
          burstStyle,
          {
            height: PROGRESS_RING.size,
            position: 'absolute',
            width: PROGRESS_RING.size,
          },
        ]}
      >
        <ParticleBurst
          distance={PARTICLE_BURST.distance}
          duration={PARTICLE_BURST.duration}
        />
      </Animated.View>

      {/* Success Icon Emoji */}
      <View
        style={{
          alignItems: 'center',
          backgroundColor: colors.successBackground,
          borderRadius: 48,
          height: 96,
          justifyContent: 'center',
          width: 96,
          zIndex: 10,
        }}
      >
        <Text style={{ fontSize: 48 }}>{emoji}</Text>
      </View>
    </Animated.View>
  );
}
