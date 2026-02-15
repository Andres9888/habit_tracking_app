/**
 * Accessibility announcement hook for MilestoneCelebration
 */

import { AccessibilityInfo } from 'react-native';
import { useEffect } from 'react';

import type { StrengthLevel } from '../HabitStrengthIndicator';
import { STRENGTH_LEVEL_CONFIG } from '../HabitStrengthIndicator';

interface UseAccessibilityAnnouncementProps {
  visible: boolean;
  habitName: string;
  level: StrengthLevel;
  strength: number;
}

export function useAccessibilityAnnouncement({
  visible,
  habitName,
  level,
  strength,
}: UseAccessibilityAnnouncementProps) {
  useEffect(() => {
    if (visible) {
      const config = STRENGTH_LEVEL_CONFIG[level];
      const message = `Milestone achieved! ${habitName} reached ${config.label} level at ${Math.round(strength)}% strength. ${config.description}`;
      AccessibilityInfo?.announceForAccessibility?.(message);
    }
  }, [visible, habitName, level, strength]);
}
