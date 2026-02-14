/**
 * SkeletonLoader for CreateHabitModal
 * Delegates to the central SkeletonLoader with gradient shimmer.
 */

import { View } from 'react-native';
import { SkeletonLoader as BaseSkeletonLoader } from '../../SkeletonLoader';

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
  className: _className,
}: SkeletonLoaderProps) => (
  <BaseSkeletonLoader
    borderRadius={borderRadius}
    height={height}
    width={width}
  />
);

// Preset skeleton components
export const SkeletonText = ({ className: _className = '' }: { className?: string }) => (
  <SkeletonLoader height={16} width='60%' />
);

export const SkeletonButton = ({ className: _className = '' }: { className?: string }) => (
  <SkeletonLoader borderRadius={20} height={40} width={120} />
);

export const SkeletonCard = ({ className: _className = '' }: { className?: string }) => (
  <View className='rounded-2xl bg-white p-4'>
    <View className='flex-row items-center gap-4'>
      <SkeletonLoader borderRadius={16} height={64} width={64} />
      <View className='flex-1'>
        <SkeletonLoader height={20} width='70%' />
        <SkeletonLoader height={14} width='40%' />
      </View>
    </View>
  </View>
);

export default SkeletonLoader;
