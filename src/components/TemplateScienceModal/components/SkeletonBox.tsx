/**
 * SkeletonBox - Delegates to the central SkeletonLoader with gradient shimmer.
 */

import React from 'react';
import { SkeletonLoader } from '../../SkeletonLoader';
import type { SkeletonBoxProps } from '../TemplateScienceModal.types';

export const SkeletonBox = ({
  height,
  width,
  style,
  borderRadius = 8,
}: SkeletonBoxProps) => (
  <SkeletonLoader
    borderRadius={borderRadius}
    height={height}
    style={style}
    width={width}
  />
);
