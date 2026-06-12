/** useSettingsSectionStates - Centralized expand/collapse state for accordion sections */

import { useState, useCallback, useEffect } from 'react';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import {
  getSettingsSectionPreferences,
  setSettingsSectionExpanded,
} from '@/utils/settingsSectionPreferences';

export const SECTION_IDS = {
  appearance: 'appearance',
  behavior: 'behavior',
  notifications: 'notifications',
} as const;

type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

const ALL_EXPANDED: Record<SectionId, boolean> = {
  [SECTION_IDS.appearance]: true,
  [SECTION_IDS.behavior]: true,
  [SECTION_IDS.notifications]: true,
};

/** Map legacy persisted keys onto current section IDs */
export function migrateSectionPrefs(
  prefs: Record<string, { isExpanded: boolean }>
): Record<SectionId, boolean> {
  const loaded = { ...ALL_EXPANDED };

  for (const [key, value] of Object.entries(prefs)) {
    if (key in loaded) {
      loaded[key as SectionId] = value.isExpanded;
    }
  }

  // habitManagement folded into behavior — honor its collapsed state
  if ('habitManagement' in prefs && !('behavior' in prefs)) {
    loaded.behavior = prefs.habitManagement.isExpanded;
  }

  return loaded;
}

export function useSettingsSectionStates() {
  const [sectionStates, setSectionStates] =
    useState<Record<SectionId, boolean>>(ALL_EXPANDED);
  const { triggerSelection } = useHapticFeedback();

  useEffect(() => {
    void getSettingsSectionPreferences().then((prefs) => {
      setSectionStates(migrateSectionPrefs(prefs));
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
