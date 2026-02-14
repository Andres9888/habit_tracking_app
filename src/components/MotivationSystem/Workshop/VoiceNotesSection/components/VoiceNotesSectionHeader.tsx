/**
 * VoiceNotesSectionHeader Component
 * Header row with icon, title, and premium badge — delegates to WorkshopSectionHeader.
 */

import React from 'react';
import { WorkshopSectionHeader } from '../../shared';

interface VoiceNotesSectionHeaderProps {
  isPremium: boolean;
  hasVoiceNotes: boolean;
  isRecording: boolean;
}

export function VoiceNotesSectionHeader({
  isPremium,
  hasVoiceNotes,
  isRecording,
}: VoiceNotesSectionHeaderProps) {
  return (
    <WorkshopSectionHeader
      accent="teal"
      badge={isPremium ? { label: 'PREMIUM', variant: 'premium' } : undefined}
      emoji="🎙️"
      title="Voice Notes"
      trailingAction={
        !isPremium && !hasVoiceNotes && !isRecording
          ? { label: 'Record' }
          : undefined
      }
    />
  );
}
