import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

type SkeletonWidth = number | 'auto' | `${number}%`;

interface SkeletonLoaderProps {
  width?: SkeletonWidth;
  height?: number;
  borderRadius?: number;
  className?: string;
}

export const SkeletonLoader = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  className = '',
}: SkeletonLoaderProps) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      className={className}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: '#e2e8f0',
        opacity,
      }}
    />
  );
};

// Preset skeleton components
export const SkeletonText = ({ className = '' }: { className?: string }) => (
  <SkeletonLoader width='60%' height={16} className={className} />
);

export const SkeletonButton = ({ className = '' }: { className?: string }) => (
  <SkeletonLoader width={120} height={40} borderRadius={20} className={className} />
);

export const SkeletonCard = ({ className = '' }: { className?: string }) => (
  <View className={`rounded-2xl bg-white p-4 ${className}`}>
    <View className='flex-row items-center gap-4'>
      <SkeletonLoader width={64} height={64} borderRadius={16} />
      <View className='flex-1'>
        <SkeletonLoader width='70%' height={20} className='mb-2' />
        <SkeletonLoader width='40%' height={14} />
      </View>
    </View>
  </View>
);

export default SkeletonLoader;
