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
          duration: 800,
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          duration: 800,
          toValue: 0.3,
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
        backgroundColor: '#e7e5e4',
        borderRadius,
        height,
        opacity,
        width,
      }}
    />
  );
};

// Preset skeleton components
export const SkeletonText = ({ className = '' }: { className?: string }) => (
  <SkeletonLoader className={className} height={16} width='60%' />
);

export const SkeletonButton = ({ className = '' }: { className?: string }) => (
  <SkeletonLoader borderRadius={20} className={className} height={40} width={120} />
);

export const SkeletonCard = ({ className = '' }: { className?: string }) => (
  <View className={`rounded-2xl bg-white p-4 ${className}`}>
    <View className='flex-row items-center gap-4'>
      <SkeletonLoader borderRadius={16} height={64} width={64} />
      <View className='flex-1'>
        <SkeletonLoader className='mb-2' height={20} width='70%' />
        <SkeletonLoader height={14} width='40%' />
      </View>
    </View>
  </View>
);

export default SkeletonLoader;
