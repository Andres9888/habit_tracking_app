/**
 * ProgressPhotos - Main component for progress photo tracking
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActionSheetIOS, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../../theme';
import { PhotoTimeline } from './PhotoTimeline';
import { PhotoViewer } from './PhotoViewer';
import { BeforeAfterComparison } from './BeforeAfterComparison';
import { useProgressPhotos } from './useProgressPhotos';
import type { ProgressPhotosProps } from './ProgressPhotos.types';

export function ProgressPhotos({
  habitId,
  isPremium,
  onPremiumRequired,
}: ProgressPhotosProps) {
  const { colors, isDark } = useThemeColors();
  const [showComparison, setShowComparison] = useState(false);

  const {
    canAddMore,
    handleAddPhoto,
    handleCloseViewer,
    handleDeletePhoto,
    handleUpdateCaption,
    handleViewPhoto,
    isUploading,
    isViewerOpen,
    photoCount,
    photos,
    selectedPhoto,
  } = useProgressPhotos({
    habitId,
    isPremium,
    onPremiumRequired,
  });

  const handleAddPhotoPress = () => {
    if (!canAddMore) {
      onPremiumRequired();
      return;
    }

    const options = ['Take Photo', 'Choose from Library', 'Cancel'];
    const destructiveButtonIndex = undefined;
    const cancelButtonIndex = 2;

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          cancelButtonIndex,
          destructiveButtonIndex,
          options,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            handleAddPhoto('camera');
          } else if (buttonIndex === 1) {
            handleAddPhoto('library');
          }
        }
      );
    } else {
      Alert.alert('Add Photo', 'Choose an option', [
        {
          onPress: () => handleAddPhoto('camera'),
          text: 'Take Photo',
        },
        {
          onPress: () => handleAddPhoto('library'),
          text: 'Choose from Library',
        },
        {
          style: 'cancel',
          text: 'Cancel',
        },
      ]);
    }
  };

  const handleComparisonPress = () => {
    if (photos.length < 2) {
      Alert.alert(
        'Not Enough Photos',
        'Add at least 2 photos to compare your progress.',
        [{ text: 'OK' }]
      );
      return;
    }
    setShowComparison(true);
  };

  return (
    <View>
      {/* Before/After Comparison Button */}
      {photos.length >= 2 && (
        <TouchableOpacity
          activeOpacity={0.7}
          className='flex-row items-center justify-center gap-2 rounded-xl p-3 mb-3'
          style={{
            backgroundColor: isDark ? colors.gray[700] : colors.gray[100],
            borderColor: colors.primary[500],
            borderWidth: 1.5,
          }}
          onPress={handleComparisonPress}
        >
          <Ionicons color={colors.primary[500]} name='git-compare' size={20} />
          <Text
            className='text-[17px] font-semibold'
            style={{ color: colors.primary[500] }}
          >
            Before & After Comparison
          </Text>
        </TouchableOpacity>
      )}

      {/* Photo Count */}
      {photoCount > 0 && (
        <View className='flex-row items-center gap-2 mb-3'>
          <Ionicons color={colors.text.tertiary} name='images-outline' size={16} />
          <Text
            className='text-[13px] font-medium'
            style={{ color: colors.text.tertiary }}
          >
            {photoCount} {photoCount === 1 ? 'photo' : 'photos'}
            {!isPremium && ` • ${5 - photoCount} remaining on free tier`}
          </Text>
        </View>
      )}

      {/* Photo Timeline */}
      <PhotoTimeline
        isPremium={isPremium}
        photos={photos}
        onAddPhoto={handleAddPhotoPress}
        onPhotoPress={handleViewPhoto}
      />

      {/* Photo Viewer Modal */}
      <PhotoViewer
        isOpen={isViewerOpen}
        photo={selectedPhoto}
        onClose={handleCloseViewer}
        onDelete={handleDeletePhoto}
        onUpdateCaption={handleUpdateCaption}
      />

      {/* Before/After Comparison Modal */}
      {showComparison && photos.length >= 2 && (
        <BeforeAfterComparison
          afterPhoto={photos[photos.length - 1]}
          beforePhoto={photos[0]}
          onClose={() => setShowComparison(false)}
        />
      )}

      {/* Loading Indicator */}
      {isUploading && (
        <View
          className='absolute inset-0 items-center justify-center rounded-xl'
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <View
            className='rounded-xl p-4'
            style={{ backgroundColor: isDark ? colors.gray[800] : '#fff' }}
          >
            <Text
              className='text-[17px] font-semibold'
              style={{ color: colors.text.primary }}
            >
              Uploading...
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
