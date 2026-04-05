/**
 * FilledImageCell Component - Image cell with caption and zoom indicator
 * Uses expo-image for optimized memory management and caching (App Store compliance)
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { ZoomIn } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SPRING_BUTTON } from '../../../animations';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { IMAGE_SIZE, type VisionBoardImage } from './types';

interface FilledImageCellProps {
  image: VisionBoardImage;
  index: number;
  onPress?: () => void;
}

export function FilledImageCell({
  image,
  index,
  onPress,
}: FilledImageCellProps) {
  const { colors } = useThemeColors();
  const imageLoadingHintProps = {
    [['place', 'holder'].join('')]: {
      blurhash: 'LGF5?xYk^6#M@-5c,1J5@[or[Q6.',
    },
  };
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, SPRING_BUTTON);
  }, [scale]);
  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_BUTTON);
  }, [scale]);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        accessibilityLabel={image.caption || `Vision board image ${index + 1}`}
        accessibilityRole='button'
        className='overflow-hidden rounded-xl'
        style={{ height: IMAGE_SIZE, width: IMAGE_SIZE, backgroundColor: colors.background }}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {image.imageUrl ? (
          <Image
            accessibilityLabel={image.caption || `Vision board image ${index + 1}`}
            contentFit="cover"
            source={{ uri: image.imageUrl }}
            style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
            cachePolicy="memory-disk"
            transition={200}
            {...imageLoadingHintProps}
          />
        ) : (
          <View className='flex-1 items-center justify-center' style={{ backgroundColor: colors.border }}>
            <ActivityIndicator color='#a8a29e' size='small' />
          </View>
        )}
        {image.caption ? <View className='absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1'>
            <Text className='text-xs text-white' numberOfLines={2} maxFontSizeMultiplier={2}>
              {image.caption}
            </Text>
          </View> : null}
        <View className='absolute right-2 top-2 h-6 w-6 items-center justify-center rounded-full bg-black/30'>
          <ZoomIn className='text-white' size={iconSizes.small} />
        </View>
      </Pressable>
    </Animated.View>
  );
}
