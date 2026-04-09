/** useSettingsSectionStates - Centralized expand/collapse state for all settings sections */

import { useState, useCallback, useEffect } from 'react';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import {
  getSettingsSectionPreferences,
  setSettingsSectionExpanded,
} from '@/utils/settingsSectionPreferences';

export const SECTION_IDS = {
  about: 'about',
  appearance: 'appearance',
  behavior: 'behavior',
  habitManagement: 'habitManagement',
  notifications: 'notifications',
  support: 'support',
} as const;

type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

const ALL_EXPANDED: Record<SectionId, boolean> = {
  [SECTION_IDS.about]: true,
  [SECTION_IDS.appearance]: true,
  [SECTION_IDS.behavior]: true,
  [SECTION_IDS.habitManagement]: true,
  [SECTION_IDS.notifications]: true,
  [SECTION_IDS.support]: true,
};

export function useSettingsSectionStates() {
  const [sectionStates, setSectionStates] =
    useState<Record<SectionId, boolean>>(ALL_EXPANDED);
  const { triggerSelection } = useHapticFeedback();

  useEffect(() => {
    void getSettingsSectionPreferences().then((prefs) => {
      const loaded = { ...ALL_EXPANDED };
      for (const [key, value] of Object.entries(prefs)) {
        if (key in loaded) {
          loaded[key as SectionId] = value.isExpanded;
        }
      }
      setSectionStates(loaded);
    });
  }, []);

  const toggleSection = useCallback(
    (id: SectionId) => {
      triggerSelection();
      setSectionStates((prev) => {
        const newExpanded = !prev[id];
        void setSettingsSectionExpanded(id, newExpanded);
        return { ...prev, [id]: newExpanded };
      });
    },
    [triggerSelection]
  );

  return { sectionStates, toggleSection };
}
