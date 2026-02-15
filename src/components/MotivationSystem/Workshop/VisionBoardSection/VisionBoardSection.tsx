/**
 * VisionBoardSection Component
 * Photo grid of motivational images for habits
 *
 * Part of the Motivation System Workshop tab
 * Story T12.2-T12.7: Vision Board feature
 */

import React from 'react';
import { Text } from 'react-native';

import type { VisionBoardSectionProps } from './types';
import { AddFirstImageButton } from './AddFirstImageButton';
import { AddImageModal } from './AddImageModal';
import { AnimatedSection } from './AnimatedSection';
import { CompletionCheckmark } from '../../../animations';
import { ImageGrid } from './ImageGrid';
import { ImageViewerModal } from './ImageViewerModal';
import { SectionCard } from './SectionCard';
import { SectionHeader } from './SectionHeader';
import { useVisionBoardState } from './VisionBoardSection.hooks';

export function VisionBoardSection({
  images,
  imageCount,
  isPremium,
  onAddImage,
  onUpdateCaption,
  onDeleteImage,
  onPremiumRequired,
  shouldAnimate = false,
  reduceMotion = false,
  sectionIndex = 0,
}: VisionBoardSectionProps) {
  const state = useVisionBoardState({
    imageCount,
    isPremium,
    onAddImage,
    onDeleteImage,
    onPremiumRequired,
    onUpdateCaption,
  });

  const a11yLabel = state.hasImages
    ? `Vision Board with ${imageCount} images`
    : 'Create your Vision Board with motivational images';

  return (
    <>
      <AnimatedSection
        index={sectionIndex}
        reduceMotion={reduceMotion}
        shouldAnimate={shouldAnimate}
      >
        <SectionCard
          accessibilityLabel={a11yLabel}
          className='border-l-4 border-l-fuchsia-400'
          onPress={state.handleSectionPress}
        >
          <SectionHeader
            hasImages={state.hasImages}
            imageCount={imageCount}
            isPremium={isPremium}
          />
          {!state.hasImages && (
            <Text className='text-sm text-stone-500'>
              Add photos that inspire your habit journey
            </Text>
          )}
          <CompletionCheckmark
            isVisible={state.hasImages}
            reduceMotion={reduceMotion}
            sectionIndex={sectionIndex}
            shouldAnimate={shouldAnimate}
          />
          {isPremium && (
            <ImageGrid
              images={images}
              isUploading={state.isLoading}
              onAddImage={() => state.setIsAddModalOpen(true)}
              onViewImage={state.handleViewImage}
            />
          )}
          {isPremium && !state.hasImages && !state.isLoading && (
            <AddFirstImageButton
              onPress={() => state.setIsAddModalOpen(true)}
            />
          )}
        </SectionCard>
      </AnimatedSection>

      <AddImageModal
        visible={state.isAddModalOpen}
        onClose={() => state.setIsAddModalOpen(false)}
        onPickFromCamera={() => state.handleAddImage('camera')}
        onPickFromLibrary={() => state.handleAddImage('library')}
      />
      <ImageViewerModal
        image={state.selectedImage}
        visible={state.isViewerOpen}
        onClose={state.handleCloseViewer}
        onDelete={state.handleDeleteImage}
        onUpdateCaption={state.handleUpdateCaption}
      />
    </>
  );
}

export default VisionBoardSection;
