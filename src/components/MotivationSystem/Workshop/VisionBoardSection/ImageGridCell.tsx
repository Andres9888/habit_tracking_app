/**
 * ImageGridCell Component - Single cell in the vision board grid
 * Delegates to EmptyImageCell or FilledImageCell based on image presence
 */

import React from 'react';

import type { VisionBoardImage } from './types';
import { EmptyImageCell } from './EmptyImageCell';
import { FilledImageCell } from './FilledImageCell';

interface ImageGridCellProps {
  image?: VisionBoardImage;
  index: number;
  onPress?: () => void;
  isLoading?: boolean;
}

export function ImageGridCell({
  image,
  index,
  onPress,
  isLoading,
}: ImageGridCellProps) {
  if (!image) {
    return (
      <EmptyImageCell index={index} isLoading={isLoading} onPress={onPress} />
    );
  }
  return <FilledImageCell image={image} index={index} onPress={onPress} />;
}
