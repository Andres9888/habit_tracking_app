/**
 * SectionHeader Component
 * Header row for the Vision Board section — delegates to WorkshopSectionHeader.
 */

import React from 'react';
import { WorkshopSectionHeader } from '../shared';
import { MAX_IMAGES } from './types';

interface SectionHeaderProps {
  hasImages: boolean;
  imageCount: number;
  isPremium: boolean;
}

export function SectionHeader({
  hasImages,
  imageCount,
  isPremium,
}: SectionHeaderProps) {
  return (
    <WorkshopSectionHeader
      accent="fuchsia"
      badge={!isPremium ? { label: 'PRO', variant: 'pro' } : undefined}
      emoji="🖼️"
      title="Vision Board"
      trailingAction={!hasImages ? { label: 'Add' } : undefined}
      trailingCount={hasImages ? `${imageCount}/${MAX_IMAGES}` : undefined}
    />
  );
}
