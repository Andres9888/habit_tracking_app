import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';

interface SparkleBurstProps {
  color?: string;
  isActive: boolean;
  onComplete?: () => void;
  reduceMotion?: boolean;
  size?: number;
}

const DOT_COUNT = 6; // Enhanced sparkle for premium celebrations

export const SparkleBurst = ({
  color = '#34D399',
  isActive,
  onComplete,
  reduceMotion = false,
  size = 40, // Slightly larger for more impact
}: SparkleBurstProps) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    console.log('🌟 SparkleBurst:', { isActive, reduceMotion, color });

    if (!isActive || reduceMotion) {
      if (isActive && reduceMotion) {
        console.log('🌟 SparkleBurst skipped (reduceMotion enabled)');
        onComplete?.();
      }
      return;
    }

    console.log('🌟 SparkleBurst TRIGGERED!');
    opacity.setValue(0.9); // More prominent for celebration
    scale.setValue(0.6);

    Animated.parallel([
      Animated.timing(opacity, {
        duration: 400, // Slightly longer celebration
        easing: Easing.out(Easing.ease),
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        duration: 400, // Longer expansion for impact
        easing: Easing.out(Easing.cubic),
        toValue: 1.6, // More expansive celebration
        useNativeDriver: true,
      }),
    ]).start(() => {
      console.log('🌟 SparkleBurst completed');
      onComplete?.();
    });
  }, [isActive, onComplete, opacity, reduceMotion, scale]);

  if (!isActive || reduceMotion) {
    return null;
  }

  const dotSize = size * 0.18; // Small, subtle sparkles

  return (
    <Animated.View
      className='absolute items-center justify-center'
      pointerEvents='none'
      style={{
        height: size,
        opacity,
        transform: [{ scale }],
        width: size,
        zIndex: 1000, // Render ABOVE everything
      }}
    >
      {Array.from({ length: DOT_COUNT }).map((_, index) => {
        const angle = (index / DOT_COUNT) * Math.PI * 2;
        const translateX = Math.cos(angle) * (size / 2.2);
        const translateY = Math.sin(angle) * (size / 2.2);

        return (
          <Animated.View
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className='absolute rounded-full'
            style={{
              backgroundColor: color, // Use accent color
              height: dotSize,
              left: size / 2 - dotSize / 2,
              top: size / 2 - dotSize / 2,
              transform: [
                { translateX },
                { translateY },
              ],
              width: dotSize,
              shadowColor: color,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5, // Subtle glow
              shadowRadius: 3,
              elevation: 4,
            }}
          />
        );
      })}

      {/* Center glow - subtle */}
      <View
        className='absolute rounded-full'
        pointerEvents='none'
        style={{
          backgroundColor: `${color}40`, // 25% opacity
          height: dotSize * 2,
          width: dotSize * 2,
          shadowColor: color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.4,
          shadowRadius: 4,
        }}
      />
    </Animated.View>
  );
};

export default SparkleBurst;

