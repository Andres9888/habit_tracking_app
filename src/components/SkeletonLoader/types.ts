import type { ViewStyle } from 'react-native';

export type SkeletonWidth = number | 'auto' | `${number}%`;

export interface SkeletonLoaderProps {
  width?: SkeletonWidth;
  height?: number;
  borderRadius?: number;
  reduceMotion?: boolean;
  style?: ViewStyle;
}

export interface ReduceMotionProps {
  reduceMotion?: boolean;
}
