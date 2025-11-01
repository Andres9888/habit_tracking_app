import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';

interface SparkleBurstProps {
  color?: string;
  isActive: boolean;
  onComplete?: () => void;
  reduceMotion?: boolean;
  size?: number;
}

const DOT_COUNT = 4;

export const SparkleBurst = ({
  color = '#34D399',
  isActive,
  onComplete,
  reduceMotion = false,
  size = 36,
}: SparkleBurstProps) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    if (!isActive || reduceMotion) {
      if (isActive && reduceMotion) {
        onComplete?.();
      }
      return;
    }

    opacity.setValue(0.9);
    scale.setValue(0.6);

    Animated.parallel([
      Animated.timing(opacity, {
        duration: 260,
        easing: Easing.out(Easing.ease),
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        duration: 260,
        easing: Easing.out(Easing.cubic),
        toValue: 1.4,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onComplete?.();
    });
  }, [isActive, onComplete, opacity, reduceMotion, scale]);

  if (!isActive || reduceMotion) {
    return null;
  }

  const dotSize = size * 0.2;

  return (
    <Animated.View
      className='absolute items-center justify-center'
      pointerEvents='none'
      style={{
        height: size,
        opacity,
        transform: [{ scale }],
        width: size,
      }}
    >
      {Array.from({ length: DOT_COUNT }).map((_, index) => {
        const angle = (index / DOT_COUNT) * Math.PI * 2;
        const translateX = Math.cos(angle) * (size / 2.5);
        const translateY = Math.sin(angle) * (size / 2.5);

        return (
          <Animated.View
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className='absolute rounded-full'
            style={{
              backgroundColor: color,
              height: dotSize,
              left: size / 2 - dotSize / 2,
              top: size / 2 - dotSize / 2,
              transform: [
                { translateX },
                { translateY },
              ],
              width: dotSize,
            }}
          />
        );
      })}

      <View
        className='absolute rounded-full'
        pointerEvents='none'
        style={{
          backgroundColor: `${color}33`,
          height: dotSize * 2,
          width: dotSize * 2,
        }}
      />
    </Animated.View>
  );
};

export default SparkleBurst;

