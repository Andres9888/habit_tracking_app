import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSparkleBurstAnimation } from './useSparkleBurstAnimation';

interface SparkleBurstProps {
  color?: string;
  isActive: boolean;
  onComplete?: () => void;
  reduceMotion?: boolean;
  size?: number;
}

const DOT_COUNT = 6;

export const SparkleBurst = ({
  color = '#34D399',
  isActive,
  onComplete,
  reduceMotion = false,
  size = 40,
}: SparkleBurstProps) => {
  const { animatedStyle } = useSparkleBurstAnimation({
    color,
    isActive,
    onComplete,
    reduceMotion,
  });

  if (!isActive || reduceMotion) {
    return null;
  }

  const dotSize = size * 0.18;

  return (
    <Animated.View
      className='absolute items-center justify-center'
      pointerEvents='none'
      style={[
        {
          height: size,
          width: size,
          zIndex: 1000,
        },
        animatedStyle,
      ]}
    >
      {Array.from({ length: DOT_COUNT }).map((_, index) => {
        const angle = (index / DOT_COUNT) * Math.PI * 2;
        const translateX = Math.round(Math.cos(angle) * (size / 2.2));
        const translateY = Math.round(Math.sin(angle) * (size / 2.2));

        return (
          <View
            key={index}
            className='absolute rounded-full'
            style={{
              backgroundColor: color,
              elevation: 4,
              height: dotSize,
              left: size / 2 - dotSize / 2,
              shadowColor: color,
              shadowOffset: { height: 0, width: 0 },
              shadowOpacity: 0.5,
              shadowRadius: 3,
              top: size / 2 - dotSize / 2,
              transform: [{ translateX }, { translateY }],
              width: dotSize,
            }}
          />
        );
      })}

      {/* Center glow */}
      <View
        className='absolute rounded-full'
        pointerEvents='none'
        style={{
          backgroundColor: `${color}40`,
          height: dotSize * 2,
          shadowColor: color,
          shadowOffset: { height: 0, width: 0 },
          shadowOpacity: 0.4,
          shadowRadius: 4,
          width: dotSize * 2,
        }}
      />
    </Animated.View>
  );
};

export default SparkleBurst;
