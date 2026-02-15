/**
 * SkeletonBox - Delegates to the central SkeletonLoader with gradient shimmer.
 */

import React from 'react';

import type { SkeletonBoxProps } from '../TemplateScienceModal.types';
import { SkeletonLoader } from '../../SkeletonLoader';

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
