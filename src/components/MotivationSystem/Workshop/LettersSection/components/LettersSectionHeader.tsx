/**
 * LettersSectionHeader Component
 * Header row with icon, title, premium badge, and action — delegates to WorkshopSectionHeader.
 */

import React from 'react';
import { WorkshopSectionHeader } from '../../shared';

interface LettersSectionHeaderProps {
  isPremium: boolean;
  hasLetters: boolean;
  unreadCount: number;
}

export function LettersSectionHeader({
  isPremium,
  hasLetters,
  unreadCount,
}: LettersSectionHeaderProps) {
  return (
    <WorkshopSectionHeader
      accent="violet"
      badge={!isPremium ? { label: 'PRO', variant: 'pro' } : undefined}
      emoji="✉️"
      title="Letters to Self"
      trailingAction={!hasLetters ? { label: 'Write' } : undefined}
      trailingBadge={
        hasLetters && unreadCount > 0
          ? { filled: true, label: `${unreadCount} new` }
          : undefined
      }
    />
  );
}
