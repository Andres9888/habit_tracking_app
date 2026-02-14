/**
 * AffirmationsSectionHeader Component
 * Header row with icon, title, count badge, and add button — delegates to WorkshopSectionHeader.
 */

import React from 'react';
import { WorkshopSectionHeader } from '../../shared';
import { FREE_TIER_MAX_AFFIRMATIONS } from '../AffirmationsSection.constants';

interface AffirmationsSectionHeaderProps {
  isPremium: boolean;
  affirmationCount: number;
  hasAffirmations: boolean;
}

export function AffirmationsSectionHeader({
  isPremium,
  affirmationCount,
  hasAffirmations,
}: AffirmationsSectionHeaderProps) {
  return (
    <WorkshopSectionHeader
      accent="amber"
      badge={
        !isPremium
          ? {
              label: `${affirmationCount}/${FREE_TIER_MAX_AFFIRMATIONS}`,
              variant: 'count',
            }
          : undefined
      }
      emoji="💬"
      title="Affirmations"
      trailingAction={!hasAffirmations ? { label: 'Add' } : undefined}
      style={{ marginBottom: 6 }}
    />
  );
}
