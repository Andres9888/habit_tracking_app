/**
 * Type declarations for expo-image
 * This package provides optimized image loading and caching for Expo apps
 */
declare module 'expo-image' {
  import type { ComponentType } from 'react';
  import type { ImageProps as RNImageProps } from 'react-native';

  export interface ImageProps extends Omit<RNImageProps, 'source'> {
    source?: string | number | { uri?: string; blurhash?: string } | null;
    placeholder?: string | number | { uri?: string; blurhash?: string } | null;
    contentFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
    contentPosition?: string;
    transition?: number | { duration?: number; timing?: string };
    cachePolicy?: 'none' | 'disk' | 'memory' | 'memory-disk';
    priority?: 'low' | 'normal' | 'high';
    blurRadius?: number;
    recyclingKey?: string;
    onLoad?: () => void;
    onError?: (error: { error: unknown }) => void;
    onLoadEnd?: () => void;
  }

  export const Image: ComponentType<ImageProps>;
  export default Image;
}
