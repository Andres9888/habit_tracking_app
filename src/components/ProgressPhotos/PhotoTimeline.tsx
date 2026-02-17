/**
 * PhotoTimeline - Grid display of progress photos in chronological order
 */

import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../../theme';
import {
  PHOTOS_PER_ROW,
  PHOTO_GAP,
  ENTER_DURATION,
  STAGGER_DELAY,
  FREE_TIER_PHOTO_LIMIT,
} from './ProgressPhotos.constants';
import type { PhotoTimelineProps, ProgressPhoto } from './ProgressPhotos.types';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

function PhotoCard({
  index,
  onPress,
  photo,
  photoSize,
}: {
  index: number;
  onPress: () => void;
  photo: ProgressPhoto;
  photoSize: number;
}) {
  const { colors, isDark } = useThemeColors();

  const anim = FadeInUp.duration(ENTER_DURATION)
    .delay(index * STAGGER_DELAY)
    .springify()
    .damping(18);

  const date = new Date(photo.createdAt);
  const dateStr = date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
  });

  return (
    <AnimatedTouchable
      activeOpacity={0.7}
      className='rounded-xl overflow-hidden'
      entering={anim}
      style={{
        backgroundColor: isDark ? colors.gray[700] : colors.gray[100],
        height: photoSize,
        width: photoSize,
      }}
      onPress={onPress}
    >
      {photo.imageUrl ? (
        <Image
          source={{ uri: photo.imageUrl }}
          style={{ height: '100%', width: '100%' }}
        />
      ) : (
        <View className='flex-1 items-center justify-center'>
          <Ionicons
            color={colors.text.secondary}
            name='image-outline'
            size={32}
          />
        </View>
      )}
      <View
        className='absolute bottom-0 left-0 right-0 px-2 py-1'
        style={{
          backgroundColor: 'rgba(0,0,0,0.6)',
        }}
      >
        <Text className='text-white text-xs font-medium'>{dateStr}</Text>
      </View>
    </AnimatedTouchable>
  );
}

export function PhotoTimeline({
  isPremium,
  onAddPhoto,
  onPhotoPress,
  photos,
}: PhotoTimelineProps) {
  const { width } = useWindowDimensions();
  const { colors, isDark } = useThemeColors();

  const photoSize = useMemo(() => {
    const containerPadding = 32; // 16px on each side
    const totalGap = PHOTO_GAP * (PHOTOS_PER_ROW - 1);
    return (width - containerPadding - totalGap) / PHOTOS_PER_ROW;
  }, [width]);

  const showUpgradePrompt = !isPremium && photos.length >= FREE_TIER_PHOTO_LIMIT;

  return (
    <View className='gap-3'>
      {/* Add Photo Button */}
      <TouchableOpacity
        activeOpacity={0.7}
        className='flex-row items-center justify-center gap-2 rounded-xl p-4'
        style={{
          backgroundColor: colors.primary[500],
        }}
        onPress={onAddPhoto}
      >
        <Ionicons color='white' name='camera' size={20} />
        <Text className='text-white text-[17px] font-semibold'>
          {photos.length === 0 ? 'Add Your First Photo' : 'Add Photo'}
        </Text>
      </TouchableOpacity>

      {/* Premium Upgrade Prompt */}
      {showUpgradePrompt && (
        <View
          className='rounded-xl p-3'
          style={{
            backgroundColor: isDark
              ? 'rgba(251, 191, 36, 0.15)'
              : 'rgba(251, 191, 36, 0.1)',
            borderColor: colors.warning[500],
            borderWidth: 1,
          }}
        >
          <Text
            className='text-[13px] font-medium text-center'
            style={{ color: colors.warning[700] }}
          >
            Free limit reached ({FREE_TIER_PHOTO_LIMIT} photos). Upgrade to
            Premium for unlimited photos!
          </Text>
        </View>
      )}

      {/* Empty State */}
      {photos.length === 0 && (
        <View className='items-center py-8'>
          <Ionicons
            color={colors.text.tertiary}
            name='images-outline'
            size={48}
          />
          <Text
            className='text-[17px] font-medium mt-3'
            style={{ color: colors.text.secondary }}
          >
            No photos yet
          </Text>
          <Text
            className='text-[13px] mt-1 text-center'
            style={{ color: colors.text.tertiary }}
          >
            Track your progress with photos{'\n'}and see your transformation!
          </Text>
        </View>
      )}

      {/* Photo Grid */}
      {photos.length > 0 && (
        <View className='flex-row flex-wrap' style={{ gap: PHOTO_GAP }}>
          {photos.map((photo, index) => (
            <PhotoCard
              key={photo._id}
              index={index}
              photoSize={photoSize}
              photo={photo}
              onPress={() => onPhotoPress(photo)}
            />
          ))}
        </View>
      )}
    </View>
  );
}
