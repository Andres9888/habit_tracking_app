/**
 * ImageGrid Component
 * 2x2 grid of vision board images with add slots
 */

import React from 'react';
import { View } from 'react-native';
import { ImageGridCell } from './ImageGridCell';
import { MAX_IMAGES, type VisionBoardImage } from './types';

interface ImageGridProps {
  images: VisionBoardImage[];
  onAddImage: () => void;
  onViewImage: (image: VisionBoardImage) => void;
  isUploading: boolean;
}

export function ImageGrid({
  images,
  onAddImage,
  onViewImage,
  isUploading,
}: ImageGridProps) {
  // Fill remaining slots with empty cells
  const gridItems: (VisionBoardImage | null)[] = [...images];
  while (gridItems.length < MAX_IMAGES) {
    gridItems.push(null);
  }

  return (
    <View className='mt-4 flex-row flex-wrap justify-between gap-y-3'>
      {gridItems.map((image, index) => (
        <ImageGridCell
          key={image?.id || `empty-${index}`}
          image={image || undefined}
          index={index}
          isLoading={Boolean(isUploading && !image && index === images.length)}
          onPress={() => {
            if (image) {
              onViewImage(image);
            } else {
              onAddImage();
            }
          }}
        />
      ))}
    </View>
  );
}
